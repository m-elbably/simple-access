const path = require("path");

const NODE_BUNDLE = "index.js";
const WEB_BUNDLE = "simple-access.min.js";

const getConfig = (name, platform, dist) => {
    const config = {
        entry: "./src/index.ts",
        target: platform,
        output: {
            filename: name,
            path: path.resolve(__dirname, dist),
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: "ts-loader",
                    exclude: /node_modules/,
                },
            ],
        },
        resolve: {
            extensions: [".tsx", ".ts", ".js"],
        },
        optimization: {
            minimize: true
        },
        mode: "production",
    };

    if (platform === "node") {
        config.optimization = {
            minimize: false,
        };
        config.output.libraryTarget = "commonjs";
    }

    return config;
};

const nodeConfig = getConfig(NODE_BUNDLE, "node", "lib");
const webConfig = getConfig(WEB_BUNDLE, "web", "dist");

module.exports = [nodeConfig, webConfig];
