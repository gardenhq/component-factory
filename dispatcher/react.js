module.exports = function(setProperty, eventClass)
{
    eventClass = eventClass || CustomEvent;
    return function(eventName, cb)
    {
        cb = typeof cb !== "undefined" ? cb : function(e)
        {
            return e.target.value;
        };
        cb = typeof cb !== "function" ? (
            function(cb)
            {
                return function(e)
                {
                    return cb;
                }
            }
        )(cb) : cb;
        return function(e)
        {
            if(eventName.indexOf(".") !== -1 || typeof this.state[eventName] !== "undefined") {
                this.setState(
                    setProperty(eventName, cb(e), this.state)
                );
            } else {
                this[eventName](e)
            }
            // const event = new eventClass(eventName, {"detail": {callback: cb, event: e}});
            // this.dispatchEvent(event)
        }.bind(this);
    }
}
