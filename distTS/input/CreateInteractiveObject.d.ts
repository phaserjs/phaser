/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
/**
 * @callback HitAreaCallback
 *
 * @param {any} hitArea - The hit area object.
 * @param {number} x - The translated x coordinate of the hit test event.
 * @param {number} y - The translated y coordinate of the hit test event.
 * @param {Phaser.GameObjects.GameObject} gameObject - The Game Object that invoked the hit test.
 *
 * @return {boolean} `true` if the coordinates fall within the space of the hitArea, otherwise `false`.
 */
/**
 * @typedef {object} Phaser.Input.InteractiveObject
 *
 * @property {Phaser.GameObjects.GameObject} gameObject - The Game Object to which this Interactive Object is bound.
 * @property {boolean} enabled - Is this Interactive Object currently enabled for input events?
 * @property {boolean} draggable - Is this Interactive Object draggable? Enable with `InputPlugin.setDraggable`.
 * @property {boolean} dropZone - Is this Interactive Object a drag-targets drop zone? Set when the object is created.
 * @property {(boolean|string)} cursor - Should this Interactive Object change the cursor (via css) when over? (desktop only)
 * @property {?Phaser.GameObjects.GameObject} target - An optional drop target for a draggable Interactive Object.
 * @property {Phaser.Cameras.Scene2D.Camera} camera - The most recent Camera to be tested against this Interactive Object.
 * @property {any} hitArea - The hit area for this Interactive Object. Typically a geometry shape, like a Rectangle or Circle.
 * @property {HitAreaCallback} hitAreaCallback - The 'contains' check callback that the hit area shape will use for all hit tests.
 * @property {number} localX - The x coordinate that the Pointer interacted with this object on, relative to the Game Object's top-left position.
 * @property {number} localY - The y coordinate that the Pointer interacted with this object on, relative to the Game Object's top-left position.
 * @property {(0|1|2)} dragState - The current drag state of this Interactive Object. 0 = Not being dragged, 1 = being checked for drag, or 2 = being actively dragged.
 * @property {number} dragStartX - The x coordinate that the Pointer started dragging this Interactive Object from.
 * @property {number} dragStartY - The y coordinate that the Pointer started dragging this Interactive Object from.
 * @property {number} dragX - The x coordinate that this Interactive Object is currently being dragged to.
 * @property {number} dragY - The y coordinate that this Interactive Object is currently being dragged to.
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
 * @param {HitAreaCallback} hitAreaCallback - The 'contains' check callback that the hit area shape will use for all hit tests.
 *
 * @return {Phaser.Input.InteractiveObject} The new Interactive Object.
 */
declare var CreateInteractiveObject: (gameObject: any, hitArea: any, hitAreaCallback: any) => {
    gameObject: any;
    enabled: boolean;
    draggable: boolean;
    dropZone: boolean;
    cursor: boolean;
    target: any;
    camera: any;
    hitArea: any;
    hitAreaCallback: any;
    localX: number;
    localY: number;
    dragState: number;
    dragStartX: number;
    dragStartY: number;
    dragX: number;
    dragY: number;
};
