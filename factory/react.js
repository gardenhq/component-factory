module.exports = function(Class, TemplateLiteral, Super, createElement, dispatcher, renderer)
{
    var mapper = {
        construct: function(component, attributes)
        {
            component.state = {};
            Object.keys(attributes).forEach(
                function(key)
                {
                    this.state[key] = attributes[key];
                },
                component
            );
            return component;
        },
        get: function()
        {
            return this.state;
        },
        methods: function(methods)
        {
            Object.keys(methods).forEach(
                function(method)
                {
                    this[method] = methods[method];
                },
                this
            );
            return methods;
        }
    }
    return function(component, name)
    {
        var render;
        if(typeof component.template !== "function") {
            component.template = new TemplateLiteral(component.template);
            render = function(props, dispatch, html)
            {
                return component.template.render({props: props, dispatch: dispatch, html: html}, html);
            }
        } else {
            render = function(props, dispatch, html)
            {
                return component.template(props, dispatch, html);
            }
        }
        var Component = Class(
            {
                extends: component.extends || Super,
                constructor: function(props)
                {
                    return mapper.construct(
                        this.super(props),
                        Object.assign({}, component.attributes, props)
                    );
                },
                static: {
                    create: function(attributes)
                    {
                        var element = createElement(Component, attributes);
                        return element;
                    },
                    get name()
                    {
                        return name;
                    }
                },
                render: function()
                {
                    var el = renderer(
                        this,
                        mapper.get.bind(this)(/**/),
                        dispatcher.bind(this),
                        render      
                    );
                    return el;
                }
            }
        );
        mapper.methods.apply(Component.prototype, [component.methods || {}]);
        return Component;
    }
}
