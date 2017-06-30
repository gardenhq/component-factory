module.exports = function(builder, win, doc)
{
    var root = __dirname + "/../..";
    win = win || window;
    doc = doc || document;
    var hasCustomElements = "customElements" in win;
    var hasRegisterElement = "registerElement" in doc;
    var isable = false; // TODO: move the feature detect from the polyfill to here
    return {
        "dom.window": win,
        "dom.document": doc,
        "dom.localStorage": win.localStorage,
        "dom.class.html": {
            "callable": root + "/dom/class/html",
            "tags": [
                "dom.classes"
            ]
        },
        "dom.selector": {
            "callable": root + "/dom/selector.js"
        },
        "dom.innerdom":{
            "object": root + "/dom/innerDOM.js"
        },
        "dom.class.svg": {
            "callable": root + "/dom/class/svg",
            "tags": [
                "dom.classes"
            ]
        },
        "dom.container.class": {
            "callable": root + "/dom/DomClassContainer",
            "arguments": [
                "#dom.classes"
            ]
        },
        "dom.fetch": {
            "resolve": window.fetch ? [] : ["@dom.polyfill.fetch"],
            "service": function()
            {
                return win.fetch;
            }
        },
        "dom.customElements.define": {
            "resolve": hasRegisterElement && !isable ? ["@dom.polyfill.custom-element"] : ["@dom.registerElement"],
            "service": function()
            {
                return win.customElements.define.bind(win.customElements);
            }
        },
        "dom.registerElement": {
            "resolve": !hasRegisterElement ? ["@dom.polyfill.register-element"] : [],
            "service": function()
            {
                return doc.registerElement.bind(document);
            }
        },
        "dom.polyfill.fetch": {
            "object": "whatwg-fetch/fetch.js"
        },
        "dom.polyfill.custom-element": {
            "callable": root + "/dom/polyfill/custom-element",
            "arguments": [
                "@dom.window",
                "@dom.container.class",
                "force"
            ]
        },
        "dom.polyfill.register-element": {
            "object": root + "/dom/polyfill/register-element",
            "arguments": [
                "@dom.window",
                "force"
            ]
        },
        "dom.getShadowRootForNode": {
            "service": function()
            {
                // I've stopped working in FF
                var hasCreateShadowRoot;
                return function(node)
                {
                    if(typeof hasCreateShadowRoot === "undefined") {
                        hasCreateShadowRoot = typeof node.createShadowRoot !== "undefined"; 
                    }
                    // createShadowRoot is deprecated
                    return hasCreateShadowRoot ? node.createShadowRoot() : node.attachShadow({mode: "closed"});
                }
                // if(hasCustomElements) {
                //  return function(node)
                //  {
                //      return node.createShadowRoot();
                //  }
                // } else {
                //  return function(node)
                //  {
                //      //return HTMLElement.prototype.attachShadow.apply(node, [{mode: closed}]);
                //      return node.attachShadow({mode: "closed"})
                //  }
                // }
            }
        }
    };
}
