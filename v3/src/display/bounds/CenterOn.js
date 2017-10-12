var SetCenterX = require('./SetCenterX');
var SetCenterY = require('./SetCenterY');

/**
* The center x coordinate of the Game Object.
* This is the same as `(x - offsetX) + (width / 2)`.
*
* @property {number} centerX
*/

/**
 * [description]
 *
 * @function Phaser.Display.Bounds.CenterOn
 * @since 3.0.0
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - [description]
 * @param {number} x - [description]
 * @param {number} y - [description]
 *
 * @return {Phaser.GameObjects.GameObject} [description]
 */
var CenterOn = function (gameObject, x, y)
{
    SetCenterX(gameObject, x);

    return SetCenterY(gameObject, y);
};

module.exports = CenterOn;
