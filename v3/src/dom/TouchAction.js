/**
* Sets the touch-action property on the canvas style. Can be used to disable default browser touch actions.
*/
var TouchAction = function (canvas, value)
{
    if (value === undefined) { value = 'none'; }

    canvas.style['msTouchAction'] = value;
    canvas.style['ms-touch-action'] = value;
    canvas.style['touch-action'] = value;

    return canvas;
};

module.exports = TouchAction;
