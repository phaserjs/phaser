var GetLeft = require('../../bounds/GetLeft');
var GetTop = require('../../bounds/GetTop');
var SetLeft = require('../../bounds/SetLeft');
var SetBottom = require('../../bounds/SetBottom');

/**
 * [description]
 *
 * @function Phaser.Display.Align.To.TopLeft
 * @since 3.0.0
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - [description]
 * @param {Phaser.GameObjects.GameObject} container - [description]
 * @param {number} [offsetX=0] - [description]
 * @param {number} [offsetY=0] - [description]
 *
 * @return {Phaser.GameObjects.GameObject} [description]
 */
var TopLeft = function (gameObject, parent, offsetX, offsetY)
{
    if (offsetX === undefined) { offsetX = 0; }
    if (offsetY === undefined) { offsetY = 0; }

    SetLeft(gameObject, GetLeft(parent) - offsetX);
    SetBottom(gameObject, GetTop(parent) - offsetY);

    return gameObject;
};

module.exports = TopLeft;
