module.exports = function(builder)
{
    const canConnect = "customElements" in window;
    const root = "component-factory";
    return {
        "imports": [
            {
                resource: "@gardenhq/o/src/dev/container.js"
            },
            {
                resource: "@gardenhq/willow/loader/"
            }
        ],
        "postcss.plugin.extend": {
            "requires": [
                "postcss"
            ],
            "object": "postcss-extend/index.js",
            "tags": [
                "postcss.plugin"
            ]
        },
        "require../icons": {
            "object": "postcss-font-awesome/icons.json"
        },
        "postcss.plugin.font-awesome": {
            "requires": [
                "postcss",
                "./icons"
            ],
            "object": "postcss-font-awesome/index.js",
            "tags": [
                "postcss.plugin"
            ]
        },
        "o.dev.reloader.websocket": {
            "callable": "o/src/util/reload.js",
            "arguments": [
                "@o.dev.cache.invalidator",
                "@o.dev.flash",
                "@component-factory.dev.reload"
            ]
        },
        "component-factory.dev.reload": {
            "callable": root + "/util/reload.js",
            "arguments": [
                window,
                document,
                builder
            ]
        },
        // "component-factory.factory.prod": {
        //  "callable": root + "/ComponentFactory",
        //  "arguments": [
        //      "@component-factory.mapper",
        //      "@component-factory.dispatcher",
        //      "@component-factory.renderer",
        //      "@component-factory.onAnimationFrame",
        //      "@parse-template-literal",
        //      "@classtrophobic",
        //      "@dom.customElements.define",
        //      canConnect
        //  ]
        // },
        // // Reloadable
        // "component-factory.factory": {
        //  "callable": root + "/DebugComponentFactory",
        //  "arguments": [
        //      "@component-factory.factory.prod",
        //      "@parse-template-literal"
        //  ]
        // }
    };
}
