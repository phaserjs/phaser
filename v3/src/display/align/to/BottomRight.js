var GetRight = require('../../bounds/GetRight');
var GetBottom = require('../../bounds/GetBottom');
var SetRight = require('../../bounds/SetRight');
var SetTop = require('../../bounds/SetTop');

/**
 * [description]
 *
 * @function Phaser.Display.Align.To.BottomRight
 * @since 3.0.0
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - [description]
 * @param {Phaser.GameObjects.GameObject} container - [description]
 * @param {number} [offsetX=0] - [description]
 * @param {number} [offsetY=0] - [description]
 *
 * @return {Phaser.GameObjects.GameObject} [description]
 */
var BottomRight = function (gameObject, parent, offsetX, offsetY)
{
    if (offsetX === undefined) { offsetX = 0; }
    if (offsetY === undefined) { offsetY = 0; }

    SetRight(gameObject, GetRight(parent) + offsetX);
    SetTop(gameObject, GetBottom(parent) + offsetY);

    return gameObject;
};

module.exports = BottomRight;
