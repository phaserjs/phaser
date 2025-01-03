/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Creates a new Interactive Object.
 *
 * This is called automatically by the Input Manager when you enable a Game Object for input.
 *
 * The resulting Interactive Object is mapped to the Game Object's `input` property.
 *
 * @function Phaser.Input.CreateInteractiveObject
 * @since 3.0.0
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - The Game Object to which this Interactive Object is bound.
 * @param {any} hitArea - The hit area for this Interactive Object. Typically a geometry shape, like a Rectangle or Circle.
 * @param {Phaser.Types.Input.HitAreaCallback} hitAreaCallback - The 'contains' check callback that the hit area shape will use for all hit tests.
 *
 * @return {Phaser.Types.Input.InteractiveObject} The new Interactive Object.
 */
var CreateInteractiveObject = function (gameObject, hitArea, hitAreaCallback)
{
    return {

        gameObject: gameObject,

        enabled: true,
        draggable: false,
        dropZone: false,
        cursor: false,

        target: null,

        camera: null,

        hitArea: hitArea,
        hitAreaCallback: hitAreaCallback,
        hitAreaDebug: null,

        //  Has the dev specified their own shape, or is this bound to the texture size?
        customHitArea: false,

        localX: 0,
        localY: 0,

        //  0 = Not being dragged
        //  1 = Being checked for dragging
        //  2 = Being dragged
        dragState: 0,

        dragStartX: 0,
        dragStartY: 0,
        dragStartXGlobal: 0,
        dragStartYGlobal: 0,
        dragStartCamera: null,

        dragX: 0,
        dragY: 0

    };
};

module.exports = CreateInteractiveObject;
