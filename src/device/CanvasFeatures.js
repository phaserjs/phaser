/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var CanvasPool = require('../display/canvas/CanvasPool');

/**
 * Determines the canvas features of the browser running this Phaser Game instance.
 * These values are read-only and populated during the boot sequence of the game.
 * They are then referenced by internal game systems and are available for you to access
 * via `this.sys.game.device.canvasFeatures` from within any Scene.
 *
 * @typedef {object} Phaser.Device.CanvasFeatures
 * @since 3.0.0
 *
 * @property {boolean} supportInverseAlpha - Set to true if the browser supports inversed alpha.
 * @property {boolean} supportNewBlendModes - Set to true if the browser supports new canvas blend modes.
 */
var CanvasFeatures = {

    supportInverseAlpha: false,
    supportNewBlendModes: false

};

function checkBlendMode ()
{
    var pngHead = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAABAQMAAADD8p2OAAAAA1BMVEX/';
    var pngEnd = 'AAAACklEQVQI12NgAAAAAgAB4iG8MwAAAABJRU5ErkJggg==';

    var magenta = new Image();

    magenta.onload = function ()
    {
        var yellow = new Image();

        yellow.onload = function ()
        {
            var canvas = CanvasPool.create2D(yellow, 6);
            var context = canvas.getContext('2d', { willReadFrequently: true });

            context.globalCompositeOperation = 'multiply';

            context.drawImage(magenta, 0, 0);
            context.drawImage(yellow, 2, 0);

            if (!context.getImageData(2, 0, 1, 1))
            {
                return false;
            }

            var data = context.getImageData(2, 0, 1, 1).data;

            CanvasPool.remove(yellow);

            CanvasFeatures.supportNewBlendModes = (data[0] === 255 && data[1] === 0 && data[2] === 0);
        };

        yellow.src = pngHead + '/wCKxvRF' + pngEnd;
    };

    magenta.src = pngHead + 'AP804Oa6' + pngEnd;

    return false;
}

function checkInverseAlpha ()
{
    var canvas = CanvasPool.create2D(this, 2);
    var context = canvas.getContext('2d', { willReadFrequently: true });

    context.fillStyle = 'rgba(10, 20, 30, 0.5)';

    //  Draw a single pixel
    context.fillRect(0, 0, 1, 1);

    //  Get the color values
    var s1 = context.getImageData(0, 0, 1, 1);

    if (s1 === null)
    {
        return false;
    }

    //  Plot them to x2
    context.putImageData(s1, 1, 0);

    //  Get those values
    var s2 = context.getImageData(1, 0, 1, 1);

    var result = (s2.data[0] === s1.data[0] && s2.data[1] === s1.data[1] && s2.data[2] === s1.data[2] && s2.data[3] === s1.data[3]);

    CanvasPool.remove(this);

    //  Compare and return
    return result;
}

function init ()
{
    if (typeof importScripts !== 'function' && document !== undefined)
    {
        CanvasFeatures.supportNewBlendModes = checkBlendMode();
        CanvasFeatures.supportInverseAlpha = checkInverseAlpha();
    }

    return CanvasFeatures;
}

module.exports = init();
