module.exports = function(eventClass)
{(function () {

  if ( typeof window.CustomEvent === "function" ) return false;

  function CustomEvent ( event, params ) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent( 'CustomEvent' );
    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
    return evt;
   }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
})();
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
            // var event = document.createEvent('CustomEvent');
            // event.initEvent(eventName, true, true);
            // this.dispatchEvent(event);
            const event = new eventClass(eventName, {"detail": {callback: cb, event: e}});
            this.dispatchEvent(event)
        }.bind(this);
    }
}
