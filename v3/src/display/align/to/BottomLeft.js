var GetLeft = require('../../bounds/GetLeft');
var GetBottom = require('../../bounds/GetBottom');
var SetLeft = require('../../bounds/SetLeft');
var SetTop = require('../../bounds/SetTop');

/**
 * [description]
 *
 * @function Phaser.Display.Align.To.BottomLeft
 * @since 3.0.0
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - [description]
 * @param {Phaser.GameObjects.GameObject} container - [description]
 * @param {number} [offsetX=0] - [description]
 * @param {number} [offsetY=0] - [description]
 *
 * @return {Phaser.GameObjects.GameObject} [description]
 */
var BottomLeft = function (gameObject, parent, offsetX, offsetY)
{
    if (offsetX === undefined) { offsetX = 0; }
    if (offsetY === undefined) { offsetY = 0; }

    SetLeft(gameObject, GetLeft(parent) - offsetX);
    SetTop(gameObject, GetBottom(parent) + offsetY);

    return gameObject;
};

module.exports = BottomLeft;
