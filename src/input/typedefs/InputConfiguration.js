/**
 * @typedef {object} Phaser.Types.Input.InputConfiguration
 * @since 3.0.0
 *
 * @property {any} [hitArea] - The object / shape to use as the Hit Area. If not given it will try to create a Rectangle based on the texture frame.
 * @property {function} [hitAreaCallback] - The callback that determines if the pointer is within the Hit Area shape or not.
 * @property {boolean} [draggable=false] - If `true` the Interactive Object will be set to be draggable and emit drag events.
 * @property {boolean} [dropZone=false] - If `true` the Interactive Object will be set to be a drop zone for draggable objects.
 * @property {boolean} [useHandCursor=false] - If `true` the Interactive Object will set the `pointer` hand cursor when a pointer is over it. This is a short-cut for setting `cursor: 'pointer'`.
 * @property {string} [cursor] - The CSS string to be used when the cursor is over this Interactive Object.
 * @property {boolean} [pixelPerfect=false] - If `true` the a pixel perfect function will be set for the hit area callback. Only works with texture based Game Objects.
 * @property {integer} [alphaTolerance=1] - If `pixelPerfect` is set, this is the alpha tolerance threshold value used in the callback.
 */
