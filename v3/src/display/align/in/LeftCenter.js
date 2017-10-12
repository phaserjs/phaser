var GetLeft = require('../../bounds/GetLeft');
var GetCenterY = require('../../bounds/GetCenterY');
var SetLeft = require('../../bounds/SetLeft');
var SetCenterY = require('../../bounds/SetCenterY');

/**
 * [description]
 *
 * @function Phaser.Display.Align.In.LeftCenter
 * @since 3.0.0
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - [description]
 * @param {Phaser.GameObjects.GameObject} container - [description]
 * @param {number} [offsetX=0] - [description]
 * @param {number} [offsetY=0] - [description]
 *
 * @return {Phaser.GameObjects.GameObject} [description]
 */
var LeftCenter = function (gameObject, container, offsetX, offsetY)
{
    if (offsetX === undefined) { offsetX = 0; }
    if (offsetY === undefined) { offsetY = 0; }

    SetLeft(gameObject, GetLeft(container) - offsetX);
    SetCenterY(gameObject, GetCenterY(container) + offsetY);

    return gameObject;
};

module.exports = LeftCenter;
