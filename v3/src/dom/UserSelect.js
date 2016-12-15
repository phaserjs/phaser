/**
* Sets the user-select property on the canvas style. Can be used to disable default browser selection actions.
*
* @method Phaser.Canvas.setUserSelect
* @param {HTMLCanvasElement} canvas - The canvas to set the touch action on.
* @param {string} [value] - The touch action to set. Defaults to 'none'.
* @return {HTMLCanvasElement} The source canvas.
*/
var UserSelect = function (canvas, value)
{
    if (value === undefined) { value = 'none'; }

    var vendors = [
        '-webkit-',
        '-khtml-',
        '-moz-',
        '-ms-',
        ''
    ];

    vendors.forEach(function (vendor)
    {
        canvas.style[vendor + 'user-select'] = value;
    });

    canvas.style['-webkit-touch-callout'] = value;
    canvas.style['-webkit-tap-highlight-color'] = 'rgba(0, 0, 0, 0)';

    return canvas;
};

module.exports = UserSelect;
