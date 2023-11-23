module.exports = {
    mongodbMemoryServerOptions: {
      binary: {
        skipMD5: true,
        version: "6.0.4"
      },
      autoStart: false,
      instance: {
        dbName: "admin_minigames"
      },
    },
    useSharedDBForAllJestWorkers: false,
  };