module.exports = function()
{
    var root = __dirname + "/..";
    var canConnect = "customElements" in window;
    return {
        "imports": [
            {
                resource: "@gardenhq/domino/container.js"
            },
            {
                resource: "@gardenhq/tick-control/container.js"
            },
            {
                resource: root + "/conf/hyperhtml"
            }
        ],
        "component-factory": {
            "iterator": "@component-factory.factory",
            "arguments": [
                "#dom.component"
            ]
        },
        "component-factory.factory"/*.prod*/: {
            "callable": root + "/ComponentFactory",
            "arguments": [
                "@component-factory.mapper",
                "@component-factory.dispatcher",
                "@component-factory.renderer",
                "@component-factory.onAnimationFrame",
                "@gardenhq.tick-control",
                "@classtrophobic",
                "@dom.customElements.define",
                canConnect
            ]
        },
        // Reloadable
        // "component-factory.factory": {
        //  "callable": root + "/DebugComponentFactory",
        //  "arguments": [
        //      "@component-factory.factory.prod",
        //      "@parse-template-literal"
        //  ]
        // },



        "component-factory.onAnimationFrame": {
            "callable": root + "/util/onAnimationFrame",
            "arguments": [
                "@nanoraf"
            ]
        },
        "component-factory.renderer.slot": {
            "callable": root + "/renderer/slot"
        },
        "component-factory.renderer.html": {
            "callable": "@hyperhtml:wire"
        },
        "component-factory.mapper": {
            "callable": root + "/mapper/index"
        },
        "component-factory.dispatcher": {
            "callable": root + "/dispatcher/index"
        },
        "nanoraf": {
            "callable": root + "/util/nanoraf"
        },
        "classtrophobic": {
            "object": "classtrophobic-es5/classtrophobic-es5",
            "version": "^0.2.1"
        }
    };
}
