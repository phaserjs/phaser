var GetCenterX = require('../../bounds/GetCenterX');
var GetBottom = require('../../bounds/GetBottom');
var SetCenterX = require('../../bounds/SetCenterX');
var SetBottom = require('../../bounds/SetBottom');

/**
 * [description]
 *
 * @function Phaser.Display.Align.In.BottomCenter
 * @since 3.0.0
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - [description]
 * @param {Phaser.GameObjects.GameObject} container - [description]
 * @param {number} [offsetX] - [description]
 * @param {number} [offsetY] - [description]
 *
 * @return {Phaser.GameObjects.GameObject} [description]
 */
var BottomCenter = function (gameObject, container, offsetX, offsetY)
{
    if (offsetX === undefined) { offsetX = 0; }
    if (offsetY === undefined) { offsetY = 0; }

    SetCenterX(gameObject, GetCenterX(container) + offsetX);
    SetBottom(gameObject, GetBottom(container) + offsetY);

    return gameObject;
};

module.exports = BottomCenter;
