var GetCenterX = require('../../bounds/GetCenterX');
var GetBottom = require('../../bounds/GetBottom');
var SetCenterX = require('../../bounds/SetCenterX');
var SetTop = require('../../bounds/SetTop');

/**
 * [description]
 *
 * @function Phaser.Display.Align.To.BottomCenter
 * @since 3.0.0
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - [description]
 * @param {Phaser.GameObjects.GameObject} container - [description]
 * @param {number} [offsetX=0] - [description]
 * @param {number} [offsetY=0] - [description]
 *
 * @return {Phaser.GameObjects.GameObject} [description]
 */
var BottomCenter = function (gameObject, parent, offsetX, offsetY)
{
    if (offsetX === undefined) { offsetX = 0; }
    if (offsetY === undefined) { offsetY = 0; }

    SetCenterX(gameObject, GetCenterX(parent) + offsetX);
    SetTop(gameObject, GetBottom(parent) + offsetY);

    return gameObject;
};

module.exports = BottomCenter;
