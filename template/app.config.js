import "dotenv/config";

export default {
    expo: {
        name: "template",
        slug: "template",
        extra: {
            OPENAI_API_KEY: process.env.OPENAI_API_KEY,
            OPENAI_API_BASE_URL: process.env.OPENAI_API_BASE_URL,
            AZURE_SPEECH_REGION: process.env.AZURE_SPEECH_REGION,
            AZURE_SPEECH_KEY: process.env.AZURE_SPEECH_KEY,
        },
        platforms: ["ios", "android", "web"],
        version: "1.0.0",
        orientation: "portrait",
        icon: "./assets/icon.png",
        packagerOpts: {
            config: "metro.config.js",
        },
        splash: {
            image: "./assets/splash.png",
            resizeMode: "contain",
            backgroundColor: "#ffffff",
        },
        updates: {
            fallbackToCacheTimeout: 0,
        },
        assetBundlePatterns: ["**/*"],
        ios: {
            supportsTablet: true,
        },
    },
};