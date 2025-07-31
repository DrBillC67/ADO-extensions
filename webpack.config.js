const path = require("path");
const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { existsSync } = require("fs");
const Apps = require("./src/Apps");

let appEntryPoints = {};
let appPlugins = [
    new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify("production")
    })
];

Apps.forEach(appName => {
    const appPath = path.resolve(__dirname, `src/Apps/${appName}`);
    if (existsSync(appPath)) {
        console.log(`App "${appName}" found.`);
        const configPath = path.resolve(__dirname, `src/Apps/${appName}/configs/webpack.config.js`);
        if (existsSync(configPath)) {
            const config = require(configPath);
            if (config.entry) {
                appEntryPoints = { ...appEntryPoints, ...config.entry };
            }
            if (config.plugins) {
                appPlugins = appPlugins.concat(config.plugins);
            }
        } else {
            console.log(`No config found for App "${appName}".`);
        }
    } else {
        console.log(`App "${appName}" not found.`);
    }
});

module.exports = {
    target: "web",
    entry: appEntryPoints,
    output: {
        filename: "[name].js",
        libraryTarget: "amd",
        clean: true
    },
    externals: [
        {
            q: true,
            react: true,
            "react-dom": true
        },
        /^VSS\/.*/,
        /^TFS\/.*/,
        /^q$/
    ],
    resolve: {
        extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"],
        alias: {
            OfficeFabric: path.resolve(__dirname, "node_modules/office-ui-fabric-react/lib"),
            VSSUI: path.resolve(__dirname, "node_modules/vss-ui"),
            Common: path.resolve(__dirname, "src/Common"),
            BugBashPro: path.resolve(__dirname, "src/Apps/BugBashPro/scripts"),
            Checklist: path.resolve(__dirname, "src/Apps/Checklist/scripts"),
            ControlsLibrary: path.resolve(__dirname, "src/Apps/ControlsLibrary/scripts"),
            OneClick: path.resolve(__dirname, "src/Apps/OneClick/scripts"),
            PRWorkItems: path.resolve(__dirname, "src/Apps/PRWorkItems/scripts"),
            RelatedWits: path.resolve(__dirname, "src/Apps/RelatedWits/scripts")
        }
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: {
                    loader: "ts-loader",
                    options: {
                        transpileOnly: true,
                        ignoreDiagnostics: [2322, 2339, 2345, 2551, 2554, 2693, 2724, 2769]
                    }
                }
            },
            {
                test: /\.s?css$/,
                exclude: /node_modules\/vss-ui\/Components\/VssBreadcrumb\/VssBreadcrumb\.css$/,
                use: [
                    { loader: "style-loader" },
                    { loader: "css-loader" },
                    { 
                        loader: "sass-loader",
                        options: {
                            sassOptions: {
                                quietDeps: true,
                                silenceDeprecations: ['legacy-js-api', 'import']
                            }
                        }
                    },
                    {
                        loader: "sass-resources-loader",
                        options: {
                            resources: [path.resolve(__dirname, "./src/Common/_CommonStyles.scss")]
                        }
                    }
                ]
            },
            {
                test: /node_modules\/vss-ui\/Components\/VssBreadcrumb\/VssBreadcrumb\.css$/,
                use: [
                    { loader: "style-loader" },
                    { loader: "css-loader" }
                ]
            }
        ]
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                bugbashpro_common: {
                    name: "BugBashPro/scripts/bugbashpro_common_chunks",
                    chunks: "all",
                    test: /[\\/]src[\\/]Apps[\\/]BugBashPro[\\/]/,
                    minChunks: 3,
                    enforce: true
                }
            }
        },
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    compress: {
                        warnings: false,
                        ie8: true,
                        conditionals: true,
                        unused: true,
                        comparisons: true,
                        sequences: true,
                        dead_code: true,
                        evaluate: true,
                        if_return: true,
                        join_vars: true
                    },
                    output: {
                        comments: false,
                        beautify: false
                    },
                    warnings: false
                }
            })
        ]
    },
    plugins: appPlugins
};
