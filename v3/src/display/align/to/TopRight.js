var GetRight = require('../../bounds/GetRight');
var GetTop = require('../../bounds/GetTop');
var SetRight = require('../../bounds/SetRight');
var SetBottom = require('../../bounds/SetBottom');

/**
 * [description]
 *
 * @function Phaser.Display.Align.To.TopRight
 * @since 3.0.0
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - [description]
 * @param {Phaser.GameObjects.GameObject} container - [description]
 * @param {number} [offsetX=0] - [description]
 * @param {number} [offsetY=0] - [description]
 *
 * @return {Phaser.GameObjects.GameObject} [description]
 */
var TopRight = function (gameObject, parent, offsetX, offsetY)
{
    if (offsetX === undefined) { offsetX = 0; }
    if (offsetY === undefined) { offsetY = 0; }

    SetRight(gameObject, GetRight(parent) + offsetX);
    SetBottom(gameObject, GetTop(parent) - offsetY);

    return gameObject;
};

module.exports = TopRight;
