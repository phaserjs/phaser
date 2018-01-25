/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
*
* @class Phaser.TextureCrop
* @constructor
* @param {object} source
* @param {number} scaleMode
*/
Phaser.TextureCrop = function (gameObject, width, height, x, y)
{
    var frame = gameObject.frame;

    if (width === undefined) { width = frame.data.cut.w; }
    if (height === undefined) { height = frame.data.cut.h; }
    if (x === undefined) { x = 0; }
    if (y === undefined) { y = 0; }

    if (width === undefined)
    {
        //  No arguments means reset the crop
        frame.cutX = frame.data.cut.x;
        frame.cutY = frame.data.cut.y;
        frame.cutWidth = frame.data.cut.w;
        frame.cutHeight = frame.data.cut.h;
    }
    else if (width !== frame.cutWidth || height !== frame.cutHeight || x !== frame.cutX || y !== frame.cutY)
    {
        frame.cutX = Phaser.Math.clamp(x, frame.data.cut.x, frame.data.cut.r);
        frame.cutY = Phaser.Math.clamp(y, frame.data.cut.y, frame.data.cut.b);
        frame.cutWidth = Phaser.Math.clamp(width, 0, frame.data.cut.w - frame.cutX);
        frame.cutHeight = Phaser.Math.clamp(height, 0, frame.data.cut.h - frame.cutY);
    }

    frame.updateUVs();

    gameObject.transform.updateVertexData();

    return gameObject;
};
