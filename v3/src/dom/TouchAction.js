/**
* Sets the touch-action property on the canvas style. Can be used to disable default browser touch actions.
*
* @method Phaser.Canvas.TouchAction
* @param {HTMLCanvasElement} canvas - The canvas to set the touch action on.
* @param {string} [value] - The touch action to set. Defaults to 'none'.
* @return {HTMLCanvasElement} The source canvas.
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
