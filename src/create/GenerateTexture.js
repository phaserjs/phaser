/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Arne16 = require('./palettes/Arne16');
var CanvasPool = require('../display/canvas/CanvasPool');
var GetValue = require('../utils/object/GetValue');

/**
 * [description]
 *
 * @function Phaser.Create.GenerateTexture
 * @since 3.0.0
 *
 * @param {Phaser.Types.Create.GenerateTextureConfig} config - [description]
 *
 * @return {HTMLCanvasElement} [description]
 */
var GenerateTexture = function (config)
{
    var data = GetValue(config, 'data', []);
    var canvas = GetValue(config, 'canvas', null);
    var palette = GetValue(config, 'palette', Arne16);
    var pixelWidth = GetValue(config, 'pixelWidth', 1);
    var pixelHeight = GetValue(config, 'pixelHeight', pixelWidth);
    var resizeCanvas = GetValue(config, 'resizeCanvas', true);
    var clearCanvas = GetValue(config, 'clearCanvas', true);
    var preRender = GetValue(config, 'preRender', null);
    var postRender = GetValue(config, 'postRender', null);

    var width = Math.floor(Math.abs(data[0].length * pixelWidth));
    var height = Math.floor(Math.abs(data.length * pixelHeight));

    if (!canvas)
    {
        canvas = CanvasPool.create2D(this, width, height);
        resizeCanvas = false;
        clearCanvas = false;
    }

    if (resizeCanvas)
    {
        canvas.width = width;
        canvas.height = height;
    }

    var ctx = canvas.getContext('2d');

    if (clearCanvas)
    {
        ctx.clearRect(0, 0, width, height);
    }

    //  preRender Callback?
    if (preRender)
    {
        preRender(canvas, ctx);
    }

    //  Draw it
    for (var y = 0; y < data.length; y++)
    {
        var row = data[y];

        for (var x = 0; x < row.length; x++)
        {
            var d = row[x];

            if (d !== '.' && d !== ' ')
            {
                ctx.fillStyle = palette[d];
                ctx.fillRect(x * pixelWidth, y * pixelHeight, pixelWidth, pixelHeight);
            }
        }
    }

    //  postRender Callback?
    if (postRender)
    {
        postRender(canvas, ctx);
    }

    return canvas;
};

module.exports = GenerateTexture;
