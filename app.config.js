export default {
    expo: {
        name: "Worth It",
        slug: "worthit",
        scheme: "worthit",
        version: "1.0.11",
        orientation: "portrait",
        icon: "./assets/icon.jpg",
        userInterfaceStyle: "light",
        notification: {
            icon: "./assets/white-icon.png"
        },
        splash: {
            image: "./assets/splash.png",
            resizeMode: "contain",
            backgroundColor: "#001B2E"
        },
        updates: {
            fallbackToCacheTimeout: 0
        },
        assetBundlePatterns: [
            "**/*"
        ],
        ios: {
            supportsTablet: true,
            infoPlist: {
                SKAdNetworkItems: [
                    {
                        SKAdNetworkIdentifier: "v9wttpbfk9.skadnetwork"
                    },
                    {
                        SKAdNetworkIdentifier: "n38lu8286q.skadnetwork"
                    }
                ]
            },
            bundleIdentifier: "com.buddingapps.worthit",
            googleServicesFile: process.env.GOOGLE_SERVICES_PLIST,
        },
        android: {
            adaptiveIcon: {
                foregroundImage: "./assets/adaptive-icon.png",
                backgroundColor: "#FFFAEF"
            },
            versionCode: 12,
            permissions: [
                "android.permission.INTERNET"
            ],
            package: "com.buddingapps.worthit",
            googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
        },
        web: {
            favicon: "./assets/favicon.png"
        },
        plugins: [
            ["expo-build-properties",
                {
                    android: {
                        enableProguardInReleaseBuilds: true,
                        allowBackup: false
                    }
                }]
        ],
        extra: {
            eas: {
                projectId: "9f68bef9-2d97-4362-b1a3-3e0d3e16f7cc"
            }
        }
    }
}
