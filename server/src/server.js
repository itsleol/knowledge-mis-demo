const app = require("./app");
const connectDb = require("./db");
const { autoSeed, port } = require("./config");
const { seedDemoData } = require("./seed/demoData");

connectDb()
  .then(async () => {
    if (autoSeed) {
      const result = await seedDemoData();
      if (result.skipped) {
        console.log(`AUTO_SEED skipped: ${result.users} users already exist.`);
      } else {
        console.log(`AUTO_SEED inserted ${result.users} users and ${result.knowledge} knowledge items.`);
      }
    }
  })
  .then(() => {
    app.listen(port, () => console.log(`API server listening on http://localhost:${port}`));
  })
  .catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
  });
