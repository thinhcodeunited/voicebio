module.exports = {
    apps: [
        {
            name: "DEMO VOICEBIO",
            script: "index.js",
            watch: false,
            env: {
                "PORT": process.env.PORT || 5555,
                "NODE_ENV": "development"
            },
            env_production: {
                "PORT": process.env.PORT || 5555,
                "NODE_ENV": "production",
            }
        },
    ]
}