var GetRight = require('../../bounds/GetRight');
var GetBottom = require('../../bounds/GetBottom');
var SetRight = require('../../bounds/SetRight');
var SetBottom = require('../../bounds/SetBottom');

/**
 * [description]
 *
 * @function Phaser.Display.Align.In.BottomRight
 * @since 3.0.0
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - [description]
 * @param {Phaser.GameObjects.GameObject} container - [description]
 * @param {number} [offsetX] - [description]
 * @param {number} [offsetY] - [description]
 *
 * @return {Phaser.GameObjects.GameObject} [description]
 */
var BottomRight = function (gameObject, container, offsetX, offsetY)
{
    if (offsetX === undefined) { offsetX = 0; }
    if (offsetY === undefined) { offsetY = 0; }

    SetRight(gameObject, GetRight(container) + offsetX);
    SetBottom(gameObject, GetBottom(container) + offsetY);

    return gameObject;
};

module.exports = BottomRight;
