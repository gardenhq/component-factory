module.exports = function(html)
{
    return function(el, props, dispatch, render, shadow)
    {
        return render(
            props,
            dispatch,
            html
        );
    }
    
}
