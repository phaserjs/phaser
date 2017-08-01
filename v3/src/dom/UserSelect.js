/**
* Sets the user-select property on the canvas style. Can be used to disable default browser selection actions.
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
