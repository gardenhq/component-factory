module.exports = function()
{
    var root = __dirname;
    return {
        "imports": [
            root + "/dom/conf/index.js"
        ],
        "gardenhq.component-factory.render": {
            "callable": root + "/render/react.js",
            "arguments": [
                "@dom.selector",
                "@react.dom:render"
            ]
        },
        "gardenhq.component-factory.component": {
            "iterator": "@gardenhq.component-factory.react",
            "arguments": [
                "#gardenhq.component-factory.component"
            ]
        },
        "gardenhq.component-factory.templates": {
            "iterator": "@gardenhq.component-factory.react.template.dom",
            "arguments": [
                "#gardenhq.component-factory.template.dom"
            ]
        },
        "gardenhq.component-factory.react": {
            "callable": root + "/factory/react.js",
            "arguments": [
                "@classtrophobic",
                "@gardenhq.parse-template-literal",
                "@react.core:Component",
                "@react.core:createElement",
                "@gardenhq.component-factory.react.dispatcher",
                "@gardenhq.component-factory.react.renderer"
            ]
        },
        "gardenhq.component-factory.react.dispatcher": {
            "callable": root + "/dispatcher/react.js",
            "arguments": [
                "@gardenhq.component-factory.util.setproperty"
            ]
        },
        "gardenhq.component-factory.react.renderer": {
            "callable": root + "/renderer/react.js",
            "arguments": [
                "@gardenhq.component-factory.react.renderer.html"
            ]
        },
        "gardenhq.component-factory.util.setproperty": {
            "object": root + "/util/setProperty.js"
        },
        "gardenhq.component-factory.react.renderer.html": {
            "callable": "@hyperx",
            "arguments": [
                "@react.core:createElement"
            ]
        },
        "gardenhq.component-factory.react.template.dom": {
            "callable": root + "/template/react/dom.js",
            "arguments": [
                "@dom.selector",
                "@dom.innerdom:toString"
            ]
        },




        "react.core": {
            "object": "react/dist/react.min.js"
        },
        "react.dom": {
            "requires": {
                "react": "@react.core"
            },
            "object": "react-dom/dist/react-dom.min.js"
        },
        "hyperx": {
            "object": "hyperx/index",
            "version": "2.3.0"
        },
        "gardenhq.parse-template-literal": {
            "object": "@gardenhq/parse-template-literal/index",
            "version": "1.1.0"
        },
        "classtrophobic": {
            "object": "classtrophobic-es5/classtrophobic-es5",
            "version": "0.2.1"
        }
    };
}
