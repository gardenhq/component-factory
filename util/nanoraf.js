module.exports = function(raf)
{
    if (!raf) raf = window.requestAnimationFrame;
    return function (render)
    {
        var redrawScheduled = false;
        return function()
        {
            if (!redrawScheduled) {
                redrawScheduled = true;
                var args = arguments;
                raf(
                    function()
                    {
                        redrawScheduled = false;
                        render.apply(this, args);
                    }.bind(this)
                )
            }
        }
    }   
}
