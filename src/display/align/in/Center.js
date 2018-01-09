var GetCenterX = require('../../bounds/GetCenterX');
var GetCenterY = require('../../bounds/GetCenterY');
var CenterOn = require('../../bounds/CenterOn');

/**
 * [description]
 *
 * @function Phaser.Display.Align.In.Center
 * @since 3.0.0
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - [description]
 * @param {Phaser.GameObjects.GameObject} container - [description]
 * @param {number} [offsetX=0] - [description]
 * @param {number} [offsetY=0] - [description]
 *
 * @return {Phaser.GameObjects.GameObject} [description]
 */
var Center = function (gameObject, container, offsetX, offsetY)
{
    if (offsetX === undefined) { offsetX = 0; }
    if (offsetY === undefined) { offsetY = 0; }

    CenterOn(gameObject, GetCenterX(container) + offsetX, GetCenterY(container) + offsetY);

    return gameObject;
};

module.exports = Center;
