/**
 * The total number of objects created will be
 *
 *     key.length * frame.length * frameQuantity * (yoyo ? 2 : 1) * (1 + repeat)
 *
 * If `max` is nonzero, then the total created will not exceed `max`.
 *
 * `key` is required. {@link Phaser.GameObjects.Group#defaultKey} is not used.
 *
 * @typedef {object} Phaser.Types.GameObjects.Group.GroupCreateConfig
 * @since 3.0.0
 *
 * @property {(string|string[])} key - The texture key of each new Game Object. Must be provided or not objects will be created.
 * @property {?Function} [classType] - The class of each new Game Object.
 * @property {?(string|string[]|number|number[])} [frame=null] - The texture frame of each new Game Object.
 * @property {?number} [quantity=false] - The number of Game Objects to create. If set, this overrides the `frameQuantity` value. Use `frameQuantity` for more advanced control.
 * @property {?boolean} [visible=true] - The visible state of each new Game Object.
 * @property {?boolean} [active=true] - The active state of each new Game Object.
 * @property {?number} [repeat=0] - The number of times each `key` × `frame` combination will be *repeated* (after the first combination).
 * @property {?boolean} [randomKey=false] - Select a `key` at random.
 * @property {?boolean} [randomFrame=false] - Select a `frame` at random.
 * @property {?boolean} [yoyo=false] - Select keys and frames by moving forward then backward through `key` and `frame`.
 * @property {?number} [frameQuantity=1] - The number of times each `frame` should be combined with one `key`.
 * @property {?number} [max=0] - The maximum number of new Game Objects to create. 0 is no maximum.
 * @property {?object} [setXY] - Options as named in {@link Phaser.Actions.SetXY}.
 * @property {?object} [setRotation] - Options as named in {@link Phaser.Actions.SetRotation}.
 * @property {?object} [setScale] - Options as named in {@link Phaser.Actions.SetScale}.
 * @property {?object} [setOrigin] - Options as named in {@link Phaser.Actions.SetOrigin}.
 * @property {?object} [setAlpha] - Options as named in {@link Phaser.Actions.SetAlpha}.
 * @property {?object} [setDepth] - Options as named in {@link Phaser.Actions.SetDepth}.
 * @property {?object} [setScrollFactor] - Options as named in {@link Phaser.Actions.SetScrollFactor}.
 * @property {?*} [hitArea] - A geometric shape that defines the hit area for the Game Object.
 * @property {?Phaser.Types.Input.HitAreaCallback} [hitAreaCallback] - A callback to be invoked when the Game Object is interacted with.
 * @property {?(false|Phaser.Types.Actions.GridAlignConfig)} [gridAlign=false] - Align the new Game Objects in a grid using these settings.
 *
 * @see Phaser.GameObjects.Group#createFromConfig
 * @see Phaser.Utils.Array.Range
 */
