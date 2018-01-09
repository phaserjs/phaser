var GetLeft = require('../../bounds/GetLeft');
var GetBottom = require('../../bounds/GetBottom');
var SetLeft = require('../../bounds/SetLeft');
var SetBottom = require('../../bounds/SetBottom');

/**
 * [description]
 *
 * @function Phaser.Display.Align.In.BottomLeft
 * @since 3.0.0
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - [description]
 * @param {Phaser.GameObjects.GameObject} container - [description]
 * @param {number} [offsetX] - [description]
 * @param {number} [offsetY] - [description]
 *
 * @return {Phaser.GameObjects.GameObject} [description]
 */
var BottomLeft = function (gameObject, container, offsetX, offsetY)
{
    if (offsetX === undefined) { offsetX = 0; }
    if (offsetY === undefined) { offsetY = 0; }

    SetLeft(gameObject, GetLeft(container) - offsetX);
    SetBottom(gameObject, GetBottom(container) + offsetY);

    return gameObject;
};

module.exports = BottomLeft;
