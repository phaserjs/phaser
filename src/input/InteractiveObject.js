/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

//  Phaser.Input.InteractiveObject

/**
 * @callback HitAreaCallback
 *
 * @param {*} hitArea - [description]
 * @param {number} x - [description]
 * @param {number} y - [description]
 * @param {Phaser.GameObjects.GameObject} gameObject - [description]
 *
 * @return {boolean} [description]
 */

/**
 * @typedef {object} InteractiveObject
 *
 * @property {Phaser.GameObjects.GameObject} gameObject - [description]
 * @property {boolean} enabled - [description]
 * @property {boolean} draggable - [description]
 * @property {boolean} dropZone - [description]
 * @property {[type]} target - [description]
 * @property {Phaser.Cameras.Scene2D.Camera} camera - [description]
 * @property {*} hitArea - [description]
 * @property {HitAreaCallback} hitAreaCallback - [description]
 * @property {number} localX - [description]
 * @property {number} localY - [description]
 * @property {(0|1|2)} dragState - [description]
 * @property {number} dragStartX - [description]
 * @property {number} dragStartY - [description]
 * @property {number} dragX - [description]
 * @property {number} dragY - [description]
 */

/**
 * [description]
 *
 * @method Phaser.Input.Pointer#positionToCamera
 * @since 3.0.0
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - [description]
 * @param {*} hitArea - [description]
 * @param {HitAreaCallback} hitAreaCallback - [description]
 *
 * @return {InteractiveObject} [description]
 */
var InteractiveObject = function (gameObject, hitArea, hitAreaCallback)
{
    return {

        gameObject: gameObject,

        enabled: true,
        draggable: false,
        dropZone: false,

        target: null,

        camera: null,

        hitArea: hitArea,
        hitAreaCallback: hitAreaCallback,

        localX: 0,
        localY: 0,

        //  0 = Not being dragged
        //  1 = Being checked for dragging
        //  2 = Being dragged
        dragState: 0,

        dragStartX: 0,
        dragStartY: 0,

        dragX: 0,
        dragY: 0

    };
};

module.exports = InteractiveObject;
