module.exports = function(eventClass)
{
    eventClass = eventClass || CustomEvent;
    return function(eventName, cb)
    {
        cb = typeof cb !== "undefined" ? cb : function(e){return e.target.value;};
// e.detail.event.preventDefault();
        cb = typeof cb !== "function" ? (function(cb){ return function(e){  return cb; }})(cb) : cb;
        return function(e)
        {
            // e.preventDefault();
            // e.stopPropagation();
            const event = new eventClass(eventName, {"detail": {callback: cb, event: e}});
            this.dispatchEvent(event)
        }.bind(this);
    }
}
