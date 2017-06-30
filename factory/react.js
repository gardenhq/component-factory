module.exports = function(Class, Template, Super, createElement, dispatcher, renderer)
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
        component.template = Template.compile(component.template, ['props', 'dispatch', 'html']);
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
                        function(props, dispatch, html)
                        {
                            return html.apply(null, component.template.prepare.apply(null, [{props: props, dispatch: dispatch, html: html}]))
                        }
                    );
                    return el;
                }
            }
        );
        mapper.methods.apply(Component.prototype, [component.methods]);
        return Component;
    }
}
