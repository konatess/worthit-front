export default {
    expo: {
        extra: {
          eas: {
            projectId: "9f68bef9-2d97-4362-b1a3-3e0d3e16f7cc"
          }
        }
    },
    android: {
        googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
    },
    ios: {
        googleServicesFile: process.env.GOOGLE_SERVICES_PLIST,
    }
  };
  