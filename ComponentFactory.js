module.exports = function(mapper, dispatcher, renderer, onAnimationFrame, parse, Class, define, canConnect, prefix, shadow)
{
    shadow = false;
    define = define || (function(customElements){return customElements.bind(customElements)})(window.customElements);
    renderer = renderer || function(el, props, dispatch, render, shadow){ render(props, dispatch)};
    canConnect = canConnect || false;
    prefix = prefix || "x";
    shadow = shadow || false;
    const noop = function(){};
    const DefaultBaseElement = HTMLElement;
    const defaultDefinition = {
        extends: DefaultBaseElement,
        prefix: prefix,
        properties: {},
        attributes: {},
        methods: {},
        shadow: shadow,
        template: null,
        css: null,
        render: function(props, dispatch, html)
        {
            return definition.template(html, dispatch).apply(this, [props]);    
        }
    };
    const defaultLifecycle = "constructed,beforeConnected,connected,disconnected,adopted,attributeChanged,animationFrame,rendered".split(",").reduce(
        function(prev, item, i, arr)
        {
            prev[item + "Callback"] = noop;
            return prev;
        },
        {}
    );
    defaultLifecycle.beforeAnimationFrameCallback = function(props, dispatch, html)
    {
        return [props, dispatch, html || this.html];
    }
    defaultLifecycle.templateRequestedCallback = function(vars)
    {
        return vars;
    };
    const assign = Object.assign;
    const keys = Object.keys;
    return function(definition, name)
    {
        definition = assign(
            {},
            defaultDefinition,
            definition
        );
        // temp hack until I can get the Polyfill working in FF
        if(definition.shadow
            && typeof document.body.attachShadow === "undefined"
            && typeof document.body.createShadowRoot === "undefined"
        ) {
            definition.shadow = false;
        }
        if(definition.template != null) {
            if(definition.css != null) {
                if(definition.shadow) {
                    definition.template = '<style type="text/css">' + definition.css + '</style>' + definition.template;
                } else {
                    var style = document.createElement("style");
                    style.setAttribute("type", "text/css");
                    style.textContent = definition.css;
                    document.querySelector("head").appendChild(style);
                }
            }
            definition.template = parse.compile(definition.template, ["props", "dispatch", "html"]);
            defaultLifecycle.animationFrameCallback = function(props, dispatch, html)
            {
                const vars = lifecycle.templateRequestedCallback.apply(
                    this,
                    [
                        {props: props, dispatch: dispatch, html: html}
                    ]
                );
                // console.log(html.update);
                return html.apply(null, definition.template.prepare.apply(null, [{props: props, dispatch: dispatch, html: html}]))
            }
        }   

        const lifecycle = assign(
            {},
            defaultLifecycle,
            definition.lifecycle || {}
        );
        const attributes = definition.attributes;
        const properties = definition.properties;
        const methods = definition.methods;
        const tagName = definition.prefix == null ? name : definition.prefix + "-" + name;
        const Component = Class(
            {
                extends: definition.extends,
                static: {
                    get name()
                    {
                        return tagName;
                    },
                    get observedAttributes()
                    {
                        return keys(attributes);
                    },
                    get observedProperties()
                    {
                        return keys(properties);
                    }
                },
                constructor: function()
                {
                    const self = this.super.apply(this, arguments);
                    mapper.construct.apply(self, [attributes])
                    lifecycle.constructedCallback.apply(self, arguments);
                    return self;
                },
                connectedCallback: function()
                {
                    lifecycle.beforeConnectedCallback.apply(this, arguments);
                    this.render();
                    setTimeout(
                        function()
                        {
                            lifecycle.connectedCallback.apply(this, arguments);
                        }.bind(this),
                        0
                    );
                },
                disconnectedCallback: function()
                {
                    lifecycle.disconnectedCallback.apply(this, arguments);
                    mapper.removeListeners.apply(this, [attributes])
                },
                attributeChangedCallback: function(name, previous, value, namespace)
                {
                    lifecycle.attributeChangedCallback.apply(this, arguments);
                    this.render();
                },
                propertyChangedCallback: function(name, previous, value, namespace)
                {
                    this.render();
                },
                adoptedCallback: function()
                {
                    lifecycle.adoptedCallback.apply(this, arguments);
                },
                // return typeof fromEl.hasSameChildren !== "function" || !fromEl.hasSameChildren(toEl);
                hasSameChildren: function(node)
                {
                    return true;
                },
                isSameNode: function(node)
                {
                    return [].slice.call(this.attributes).every(
                        function(item)
                        {
                            return node.getAttribute(item.nodeName) === item.value;
                        }
                    );
                },
                render: onAnimationFrame(
                    function(args)
                    {
                        renderer(
                            this,
                            mapper.get(attributes, properties)(this),
                            dispatcher.bind(this),
                            function(props, dispatch, html)
                            {
                                const args = lifecycle.beforeAnimationFrameCallback.apply(
                                    this,
                                    arguments
                                );
                                if(args) {
                                    return lifecycle.animationFrameCallback.apply(this, args)
                                }
                            }.bind(this),
                            definition.shadow
                        );
                        lifecycle.renderedCallback.apply(this, []);
                    }
                )
            }
        );
        definition.attributes = mapper.attributes.apply(Component.prototype, [attributes]);
        definition.properties = mapper.properties.apply(Component.prototype, [properties]);
        definition.methods = mapper.methods.apply(Component.prototype, [methods]);
        const options = {};
        if(definition.enhances) {
            options.extends = definition.enhances;
        }
        define(
            Component.name,
            Component,
            options
        );
        // canConnect = false;
        if(!canConnect) {
            Array.prototype.slice.call(document.getElementsByTagName(Component.name)).forEach(
                function(item)
                {
                    item.connectedCallback();
                }
            );
        }
        return Component;
    }
};

