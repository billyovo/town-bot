module.exports = {
    mongodbMemoryServerOptions: {
      binary: {
        skipMD5: true,
      },
      autoStart: false,
      instance: {
        dbName: "admin_minigames"
      },
      useSharedDBForAllJestWorkers: false,
    },
  };