module.exports = function()
{
    var temp = __dirname.split("/");
    temp.pop();
    var root = temp.join("/");
    var canConnect = "customElements" in window;
    return {
        "imports": [
            {
                resource: root + "/dom/conf/"
            },
            {
                resource: root + "/conf/hyperhtml.js"
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
                "@parse-template-literal",
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
            "callable": root + "/mapper/"
        },
        "component-factory.dispatcher": {
            "callable": root + "/dispatcher/"
        },
        "parse-template-literal": {
            "object": "@gardenhq/parse-template-literal"
        },
        "nanoraf": {
            "callable": root + "/util/nanoraf"
        },
        "classtrophobic": {
            "object": "classtrophobic-es5/classtrophobic-es5"
        }
    };
}
