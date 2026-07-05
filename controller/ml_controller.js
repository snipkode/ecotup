const knex = require("knex");
const knexfile = require("../knexfile");
const db = knex(knexfile.development);

// ─────────────────────────────────────────────
// HELPER: Haversine formula (returns km)
// ─────────────────────────────────────────────
const haversine = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// ─────────────────────────────────────────────
// HELPER: Euclidean distance between two points
// ─────────────────────────────────────────────
const euclidean = (a, b) =>
  Math.sqrt(a.reduce((sum, _, i) => sum + (a[i] - b[i]) ** 2, 0));

// ─────────────────────────────────────────────
// HELPER: K-Means clustering (manual, no deps)
// ─────────────────────────────────────────────
const runKMeans = (points, K = 3, maxIters = 20) => {
  // Random initial centroids (seeded by picking first K shuffled indices)
  const shuffled = [...points].sort(() => Math.random() - 0.5);
  let centroids = shuffled.slice(0, K).map((p) => [...p]);
  let assignments = new Array(points.length).fill(0);

  for (let iter = 0; iter < maxIters; iter++) {
    // Assign each point to nearest centroid
    assignments = points.map((p) => {
      let minDist = Infinity;
      let nearest = 0;
      centroids.forEach((c, k) => {
        const d = euclidean(p, c);
        if (d < minDist) { minDist = d; nearest = k; }
      });
      return nearest;
    });

    // Recompute centroids
    const newCentroids = Array.from({ length: K }, () =>
      new Array(points[0].length).fill(0),
    );
    const counts = new Array(K).fill(0);

    points.forEach((p, i) => {
      const k = assignments[i];
      counts[k]++;
      p.forEach((val, dim) => { newCentroids[k][dim] += val; });
    });

    newCentroids.forEach((c, k) => {
      if (counts[k] > 0) c.forEach((_, dim) => { c[dim] /= counts[k]; });
    });

    centroids = newCentroids;
  }

  return assignments; // array of cluster index per point
};

// ─────────────────────────────────────────────
// HELPER: TSP Greedy — nearest-neighbour
// ─────────────────────────────────────────────
const tspGreedy = (distMatrix) => {
  const n = distMatrix.length;
  const unvisited = new Set(Array.from({ length: n }, (_, i) => i));
  const path = [0];
  unvisited.delete(0);

  while (unvisited.size > 0) {
    const current = path[path.length - 1];
    let nearest = null;
    let minDist = Infinity;
    for (const idx of unvisited) {
      if (distMatrix[current][idx] < minDist) {
        minDist = distMatrix[current][idx];
        nearest = idx;
      }
    }
    path.push(nearest);
    unvisited.delete(nearest);
  }
  return path;
};

// ─────────────────────────────────────────────
// HELPER: Build NxN haversine distance matrix
// ─────────────────────────────────────────────
const buildDistanceMatrix = (points) =>
  points.map((a) =>
    points.map((b) => haversine(a[0], a[1], b[0], b[1])),
  );

// ─────────────────────────────────────────────
// CONTROLLER 1: Finding Nearest Driver
// GET /api/ml/find_nearest_driver/:user_id
// ─────────────────────────────────────────────
const findNearestDriverController = async (req, res) => {
  const { user_id } = req.params;

  if (!user_id) {
    return res.status(400).json({ error: true, message: "user_id is required" });
  }

  try {
    // Step 1: Get user coordinates
    const user = await db("tbl_user")
        .select("user_longitude", "user_latitude")
        .where({ user_id })
        .first();

    if (!user) {
      return res.status(404).json({ error: true, message: "User not found" });
    }

    const userLat = parseFloat(user.user_latitude);
    const userLon = parseFloat(user.user_longitude);

    // Step 2: Get all drivers
    const drivers = await db("tbl_driver")
        .select("driver_id", "driver_longitude", "driver_latitude");

    if (!drivers.length) {
      return res.status(404).json({ error: true, message: "No drivers found" });
    }

    // Step 3: Find nearest driver using Haversine
    let nearest = null;
    let minDistance = Infinity;

    for (const driver of drivers) {
      const dist = haversine(
          userLat, userLon,
          parseFloat(driver.driver_latitude),
          parseFloat(driver.driver_longitude),
      );
      if (dist < minDistance) {
        minDistance = dist;
        nearest = driver;
      }
    }

    return res.status(200).json({
      error: false,
      message: "Request successful",
      data: {
        user_id: parseInt(user_id),
        nearest_driver_id: nearest.driver_id,
        driver_longitude: nearest.driver_longitude,
        driver_latitude: nearest.driver_latitude,
        distance: parseFloat(minDistance.toFixed(4)), // km
      },
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal server error",
      debug: error.message,
    });
  }
};

// ─────────────────────────────────────────────
// CONTROLLER 2: Clustering & TSP Sorting
// GET /api/ml/clustering_and_sorting
// ─────────────────────────────────────────────
const clusteringAndSortingController = async (req, res) => {
  try {
    // Step 1: Fetch active subscription users
    const users = await db("tbl_user as u")
        .join("tbl_subscription as s", "u.subscription_id", "s.subscription_id")
        .where("s.subscription_value", ">", 0)
        .select("u.user_id", "u.user_longitude", "u.user_latitude")
        .orderBy("u.user_id", "asc");

    if (users.length < 3) {
      return res.status(400).json({
        error: true,
        message: `Not enough subscribed users for clustering. Found ${users.length}, need at least 3.`,
      });
    }

    // Step 2: Prepare coordinate matrix [ [lon, lat], ... ]
    const coords = users.map((u) => [
      parseFloat(u.user_longitude),
      parseFloat(u.user_latitude),
    ]);

    // Step 3: K-Means clustering (K=3, max 20 iterations)
    const K = 3;
    const clusterAssignments = runKMeans(coords, K, 20);

    // Step 4: Get drivers (need at least 3)
    const drivers = await db("tbl_driver")
        .select("driver_id", "driver_longitude", "driver_latitude")
        .limit(3);

    if (drivers.length < 3) {
      return res.status(400).json({
        error: true,
        message: `Need at least 3 drivers. Found ${drivers.length}.`,
      });
    }

    // Step 5: Update DB — reset + insert new cluster assignments
    await db.transaction(async (trx) => {
      await trx("tbl_user").update({ cluster_id: null });
      await trx("tbl_cluster").delete();

      for (let i = 0; i < users.length; i++) {
        const k = clusterAssignments[i];
        const assignedDriver = drivers[k];
        const clusterName = `cluster ${k}`;

        const [clusterId] = await trx("tbl_cluster").insert({
          cluster_name: clusterName,
          cluster_region: clusterName,
          user_id: users[i].user_id,
          driver_id: assignedDriver.driver_id,
          created_at: trx.fn.now(),
        });

        await trx("tbl_user")
            .where({ user_id: users[i].user_id })
            .update({ cluster_id: clusterId });
      }
    });

    // Step 6: TSP Greedy sort per cluster
    const clusterResults = {};

    for (let k = 0; k < K; k++) {
      const clusterUsers = users.filter((_, i) => clusterAssignments[i] === k);
      const driver = drivers[k];

      if (!clusterUsers.length) {
        clusterResults[`cluster${k}`] = [];
        continue;
      }

      // Points: driver at index 0, then cluster users
      const points = [
        [parseFloat(driver.driver_latitude), parseFloat(driver.driver_longitude)],
        ...clusterUsers.map((u) => [
          parseFloat(u.user_latitude),
          parseFloat(u.user_longitude),
        ]),
      ];

      const distMatrix = buildDistanceMatrix(points);
      const tspPath = tspGreedy(distMatrix);

      // Skip index 0 (driver start), map back to user data
      clusterResults[`cluster${k}`] = tspPath
          .filter((idx) => idx !== 0)
          .map((idx, order) => ({
            pickup_order: order + 1,
            driver_id: driver.driver_id,
            driver_longitude: driver.driver_longitude,
            driver_latitude: driver.driver_latitude,
            user_id: clusterUsers[idx - 1].user_id,
            user_longitude: clusterUsers[idx - 1].user_longitude,
            user_latitude: clusterUsers[idx - 1].user_latitude,
          }));
    }

    return res.status(200).json({
      error: false,
      message: "Clustering and sorting successful",
      data: clusterResults,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal server error",
      debug: error.message,
    });
  }
};

module.exports = {
  findNearestDriverController,
  clusteringAndSortingController,
};
