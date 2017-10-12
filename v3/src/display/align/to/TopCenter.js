var GetCenterX = require('../../bounds/GetCenterX');
var GetTop = require('../../bounds/GetTop');
var SetCenterX = require('../../bounds/SetCenterX');
var SetBottom = require('../../bounds/SetBottom');

/**
 * [description]
 *
 * @function Phaser.Display.Align.To.TopCenter
 * @since 3.0.0
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - [description]
 * @param {Phaser.GameObjects.GameObject} container - [description]
 * @param {number} [offsetX=0] - [description]
 * @param {number} [offsetY=0] - [description]
 *
 * @return {Phaser.GameObjects.GameObject} [description]
 */
var TopCenter = function (gameObject, parent, offsetX, offsetY)
{
    if (offsetX === undefined) { offsetX = 0; }
    if (offsetY === undefined) { offsetY = 0; }

    SetCenterX(gameObject, GetCenterX(parent) + offsetX);
    SetBottom(gameObject, GetTop(parent) - offsetY);

    return gameObject;
};

module.exports = TopCenter;
