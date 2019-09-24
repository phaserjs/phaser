/**
 * @typedef {object} Phaser.Types.Input.InteractiveObject
 * @since 3.0.0
 *
 * @property {Phaser.GameObjects.GameObject} gameObject - The Game Object to which this Interactive Object is bound.
 * @property {boolean} enabled - Is this Interactive Object currently enabled for input events?
 * @property {boolean} alwaysEnabled - An Interactive Object that is 'always enabled' will receive input even if the parent object is invisible or won't render.
 * @property {boolean} draggable - Is this Interactive Object draggable? Enable with `InputPlugin.setDraggable`.
 * @property {boolean} dropZone - Is this Interactive Object a drag-targets drop zone? Set when the object is created.
 * @property {(boolean|string)} cursor - Should this Interactive Object change the cursor (via css) when over? (desktop only)
 * @property {?Phaser.GameObjects.GameObject} target - An optional drop target for a draggable Interactive Object.
 * @property {Phaser.Cameras.Scene2D.Camera} camera - The most recent Camera to be tested against this Interactive Object.
 * @property {any} hitArea - The hit area for this Interactive Object. Typically a geometry shape, like a Rectangle or Circle.
 * @property {Phaser.Types.Input.HitAreaCallback} hitAreaCallback - The 'contains' check callback that the hit area shape will use for all hit tests.
 * @property {Phaser.GameObjects.Shape} hitAreaDebug - If this Interactive Object has been enabled for debug, via `InputPlugin.enableDebug` then this property holds its debug shape.
 * @property {boolean} customHitArea - Was the hitArea for this Interactive Object created based on texture size (false), or a custom shape? (true)
 * @property {number} localX - The x coordinate that the Pointer interacted with this object on, relative to the Game Object's top-left position.
 * @property {number} localY - The y coordinate that the Pointer interacted with this object on, relative to the Game Object's top-left position.
 * @property {(0|1|2)} dragState - The current drag state of this Interactive Object. 0 = Not being dragged, 1 = being checked for drag, or 2 = being actively dragged.
 * @property {number} dragStartX - The x coordinate of the Game Object that owns this Interactive Object when the drag started.
 * @property {number} dragStartY - The y coordinate of the Game Object that owns this Interactive Object when the drag started.
 * @property {number} dragStartXGlobal - The x coordinate that the Pointer started dragging this Interactive Object from.
 * @property {number} dragStartYGlobal - The y coordinate that the Pointer started dragging this Interactive Object from.
 * @property {number} dragX - The x coordinate that this Interactive Object is currently being dragged to.
 * @property {number} dragY - The y coordinate that this Interactive Object is currently being dragged to.
 */
