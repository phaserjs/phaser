var GetCenterX = require('../../bounds/GetCenterX');
var GetTop = require('../../bounds/GetTop');
var SetCenterX = require('../../bounds/SetCenterX');
var SetTop = require('../../bounds/SetTop');

/**
 * [description]
 *
 * @function Phaser.Display.Align.In.TopCenter
 * @since 3.0.0
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - [description]
 * @param {Phaser.GameObjects.GameObject} container - [description]
 * @param {number} [offsetX=0] - [description]
 * @param {number} [offsetY=0] - [description]
 *
 * @return {Phaser.GameObjects.GameObject} [description]
 */
var TopCenter = function (gameObject, container, offsetX, offsetY)
{
    if (offsetX === undefined) { offsetX = 0; }
    if (offsetY === undefined) { offsetY = 0; }

    SetCenterX(gameObject, GetCenterX(container) + offsetX);
    SetTop(gameObject, GetTop(container) - offsetY);

    return gameObject;
};

module.exports = TopCenter;
