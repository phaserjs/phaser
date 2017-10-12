var GetRight = require('../../bounds/GetRight');
var GetCenterY = require('../../bounds/GetCenterY');
var SetRight = require('../../bounds/SetRight');
var SetCenterY = require('../../bounds/SetCenterY');

/**
 * [description]
 *
 * @function Phaser.Display.Align.In.RightCenter
 * @since 3.0.0
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - [description]
 * @param {Phaser.GameObjects.GameObject} container - [description]
 * @param {number} [offsetX=0] - [description]
 * @param {number} [offsetY=0] - [description]
 *
 * @return {Phaser.GameObjects.GameObject} [description]
 */
var RightCenter = function (gameObject, container, offsetX, offsetY)
{
    if (offsetX === undefined) { offsetX = 0; }
    if (offsetY === undefined) { offsetY = 0; }

    SetRight(gameObject, GetRight(container) + offsetX);
    SetCenterY(gameObject, GetCenterY(container) + offsetY);

    return gameObject;
};

module.exports = RightCenter;
