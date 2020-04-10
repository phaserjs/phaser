/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Sets the user-select property on the canvas style. Can be used to disable default browser selection actions.
 *
 * @function Phaser.Display.Canvas.UserSelect
 * @since 3.0.0
 *
 * @param {HTMLCanvasElement} canvas - The canvas element to have the style applied to.
 * @param {string} [value='none'] - The touch callout value to set on the canvas. Set to `none` to disable touch callouts.
 *
 * @return {HTMLCanvasElement} The canvas element.
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
