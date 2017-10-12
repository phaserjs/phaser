var GetRight = require('../../bounds/GetRight');
var GetTop = require('../../bounds/GetTop');
var SetRight = require('../../bounds/SetRight');
var SetTop = require('../../bounds/SetTop');

/**
 * [description]
 *
 * @function Phaser.Display.Align.In.TopRight
 * @since 3.0.0
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - [description]
 * @param {Phaser.GameObjects.GameObject} container - [description]
 * @param {number} [offsetX=0] - [description]
 * @param {number} [offsetY=0] - [description]
 *
 * @return {Phaser.GameObjects.GameObject} [description]
 */
var TopRight = function (gameObject, container, offsetX, offsetY)
{
    if (offsetX === undefined) { offsetX = 0; }
    if (offsetY === undefined) { offsetY = 0; }

    SetRight(gameObject, GetRight(container) + offsetX);
    SetTop(gameObject, GetTop(container) - offsetY);

    return gameObject;
};

module.exports = TopRight;
