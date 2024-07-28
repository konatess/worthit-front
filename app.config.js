const versionNum = "1.0.31";
const buildNum = "32";
const versionCode = 32;

export default {
    expo: {
        name: "Worth It",
        slug: "worthit",
        scheme: "worthit",
        version: versionNum,
        orientation: "portrait",
        icon: "./assets/icon.jpg",
        userInterfaceStyle: "light",
        originalFullName: '@buddingapps/worthit',
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
            buildNumber: buildNum,
            bundleIdentifier: "com.buddingapps.worthit",
            googleServicesFile: "./GoogleService-Info.plist",
        },
        android: {
            adaptiveIcon: {
                foregroundImage: "./assets/adaptive-icon.png",
                backgroundColor: "#FFFAEF"
            },
            versionCode: versionCode,
            permissions: [
                "android.permission.INTERNET"
            ],
            package: "com.buddingapps.worthit",
            googleServicesFile: "./google-services.json",
        },
        web: {
            favicon: "./assets/favicon.png"
        },
        plugins: [
            "@react-native-firebase/app",
            "@react-native-firebase/auth",
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
                projectId: "fb0c0800-52b5-4a5d-b98a-469ce3d46ec9"
            }
        }
    }
}
