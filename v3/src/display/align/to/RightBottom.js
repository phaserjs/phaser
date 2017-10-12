var GetRight = require('../../bounds/GetRight');
var GetBottom = require('../../bounds/GetBottom');
var SetLeft = require('../../bounds/SetLeft');
var SetBottom = require('../../bounds/SetBottom');

/**
 * [description]
 *
 * @function Phaser.Display.Align.To.RightBottom
 * @since 3.0.0
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - [description]
 * @param {Phaser.GameObjects.GameObject} container - [description]
 * @param {number} [offsetX=0] - [description]
 * @param {number} [offsetY=0] - [description]
 *
 * @return {Phaser.GameObjects.GameObject} [description]
 */
var RightBottom = function (gameObject, parent, offsetX, offsetY)
{
    if (offsetX === undefined) { offsetX = 0; }
    if (offsetY === undefined) { offsetY = 0; }

    SetLeft(gameObject, GetRight(parent) + offsetX);
    SetBottom(gameObject, GetBottom(parent) + offsetY);

    return gameObject;
};

module.exports = RightBottom;
