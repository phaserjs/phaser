var GetLeft = require('../../bounds/GetLeft');
var GetCenterY = require('../../bounds/GetCenterY');
var SetRight = require('../../bounds/SetRight');
var SetCenterY = require('../../bounds/SetCenterY');

/**
 * [description]
 *
 * @function Phaser.Display.Align.To.LeftCenter
 * @since 3.0.0
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - [description]
 * @param {Phaser.GameObjects.GameObject} container - [description]
 * @param {number} [offsetX=0] - [description]
 * @param {number} [offsetY=0] - [description]
 *
 * @return {Phaser.GameObjects.GameObject} [description]
 */
var LeftCenter = function (gameObject, parent, offsetX, offsetY)
{
    if (offsetX === undefined) { offsetX = 0; }
    if (offsetY === undefined) { offsetY = 0; }

    SetRight(gameObject, GetLeft(parent) - offsetX);
    SetCenterY(gameObject, GetCenterY(parent) + offsetY);

    return gameObject;
};

module.exports = LeftCenter;
