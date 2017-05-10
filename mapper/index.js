module.exports = function()
{
    const getGetter = function(type, attribute)
    {
        var accessor = function(item, key)
        {
            return item.getAttribute(key.toLowerCase());
        }
        if(!attribute) {
            accessor = function(item, key)
            {
                return item[key];
            }
        }

        return function(el, name)
        {
            let value = accessor(el, name);
            if(type == String) {
                return value;
            }
            if(type == Boolean) {
                switch(value) {
                    case "on":
                    case "true":
                        value = true;
                        break;
                    case "off":
                    case "false":
                        value = false;
                        break;
                }
                return !!value;
            }
            return new type(value);
        }
    }
    const getSetter = function(type, attribute)
    {
        var accessor = function(item, key, value)
        {
            return item.setAttribute(key.toLowerCase(), value);
        }
        if(!attribute) {
            accessor = function(item, key, value)
            {
                return item[key] = value;
            }
        }
        return function(el, name, value)
        {
            if(type == Boolean) {
                switch(value) {
                    case true:
                        value = "on";
                        break;
                    case false:
                        value = "off";
                        break;
                }
            }
            return accessor(el, name, value);
        }
    }
    const keys = Object.keys;
    return {
        methods: function(methods)
        {
            keys(methods).forEach(
                function(method)
                {
                    this[method] = methods[method];
                },
                this
            );
            return methods;
        },
        removeListeners: function(attributes)
        {

        },
        construct: function(attributes)
        {
            keys(attributes).forEach(
                function(key)
                {
                    const attribute = attributes[key];
                    if(attribute.bind != null) {
                        attribute.bind.split(" ").forEach(
                            function(event)
                            {
                                this.addEventListener(
                                    event,
                                    function(e)
                                    {
                                        e.detail.event.preventDefault();
                                        e.detail.event.stopPropagation();
                                        let res = e.detail.callback.bind(this)(e.detail.event);
                                        if(res != null) {
                                            attribute.set(this, key, res)
                                            // console.log(this.getAttribute(key));
                                            // this.setAttribute(key, res);
                                        }
                                    }
                                );
                            },
                            this
                        );
                    }
                    if(attribute.value != null) {
                        if(attribute.get(this, key) == null) {
                            attribute.set(this, key, attribute.value);
                        }
                    }
                },
                this
            );
        },
        get: function(attributes, properties)
        {
            return function(el)
            {
                const props = {};
                keys(attributes).forEach(
                    function(item, i, arr)
                    {
                        const definition = attributes[item];
                        props[item] = definition.get(this, item);
                    },
                    el
                );
                // keys(properties).forEach(
                //  function(item, i, arr)
                //  {
                //      props[item] = this[item];
                //  },
                //  el
                // );
                return props;
            };

        },
        properties: function(properties)
        {
            keys(properties).forEach(
                function(item, i, arr)
                {
                    Object.defineProperty(
                        this,
                        item,
                        {
                            set: function(value)
                            {
                                const prev = this.properties[item];
                                if(prev !== value) {
                                    this.properties[item] = value;
                                    this.propertyChangedCallback(item, prev, value, null)
                                }   
                            },
                            get: function()
                            {
                                if(this.properties == null) {
                                    this.properties = Object.assign({}, properties);
                                }
                                return this.properties[item];
                            }
                        }
                    )
                },
                this
            );
            return properties;
        },
        attributes: function(attributes, properties)
        {
            var proto = this;
            keys(attributes).forEach(
                function(item)
                {
                    let type = null;
                    let value = this[item];
                    let bind = null;
                    let visibility = "visible";
                    if(typeof value == "object") {
                        type = value.type;
                        bind = value.bind === true ? item : value.bind;
                        visibility = value.visibility || visibility;
                        value = value.value;
                        
                    }
                    if(type == null) {
                        switch(typeof value) {
                            case "number":
                                type = Number;
                                break;
                            case "boolean":
                                type = Boolean;
                                break;
                            case "string":
                                type = String;
                                break;
                            default:
                                type = String;
                        }

                    }
                    if(visibility == "hidden") {
                        Object.defineProperty(
                            proto,
                            item,
                            {
                                set: function(value)
                                {
                                    const prev = this.properties[item];
                                    if(prev !== value) {
                                        this.properties[item] = value;
                                        this.propertyChangedCallback(item, prev, value, null)
                                    }   
                                },
                                get: function()
                                {
                                    if(this.properties == null) {
                                        this.properties = Object.assign({}, properties);
                                    }
                                    return this.properties[item];
                                }
                            }
                        )

                    }
                    this[item] = {
                        type: type,
                        value: value,
                        get: getGetter(
                            type,
                            visibility != "hidden"
                        ),
                        set: getSetter(
                            type,
                            visibility != "hidden"
                        ),
                        bind: bind,
                        visibility: visibility
                    }
                },
                attributes
            );
            return attributes;

        }
    };
}
