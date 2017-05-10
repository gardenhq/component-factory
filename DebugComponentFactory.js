module.exports = function(factory, parse, debug, tag)
{
    // debug();
    return function(definition, name)
    {
        if(definition.template != null) {
            var path;
            if(definition.attributes == null) {
                definition.attributes = {};
            }
            if(definition.lifecycle == null) {
                definition.lifecycle = {};
            }
            if(definition.css) {
                const css = URL.createObjectURL(new Blob([definition.css], {type: "text/css"}));
                path = definition.css.split("sourceURL=")[1];
                if(path) {
                    path = path.substr(0, path.length - 3);
                    definition.template = '<link href="${ props._css }" rel="stylesheet" type="text/css" />' + definition.template;
                    Object.assign(
                        definition.attributes,
                        {
                            _cssHref: {
                                value: path
                            },
                            _css: {
                                value: css
                            }
                        }
                    );

                }
            }

            path = definition.template.split("sourceURL=")[1];
            if(path != null) {
                path = path.substr(0, path.length - 3).trim();
                Object.assign(
                    definition.attributes,
                    {
                        _templateHref: {
                            value: path
                        },
                        _template: {
                            value: definition.template
                        }
                    }
                );
                if(definition.lifecycle.templateRequestedCallback == null) {
                    definition.lifecycle.templateRequestedCallback = function(vars)
                    {
                        return vars;
                    };

                }
                var lifecycle = definition.lifecycle;
                definition.lifecycle.animationFrameCallback = function(props, dispatch, html)
                {
                    let template = props._template;
                    if(typeof template === "string") {
                        return html.apply(
                            null,
                            parse(
                                template,
                                definition.lifecycle.templateRequestedCallback.apply(
                                    null,
                                    [
                                        {props: props, dispatch: dispatch, html: html}
                                    ]
                                )
                            )
                        );
                    }
                }

            }
        }
        var Component = factory(definition, name);
        if(name == tag) {
            document.body.appendChild(document.createElement(Component.name));
        }
        return Component;
    }
};

