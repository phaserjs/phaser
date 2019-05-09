/**
 * @typedef {object} Phaser.Types.Scenes.CreateSceneFromObjectConfig
 * @since 3.17.0
 *
 * @property {function} [init] - See {@link Phaser.Scene#init}.
 * @property {function} [preload] - See See {@link Phaser.Scene#preload}.
 * @property {function} [create] - See {@link Phaser.Scene#create}.
 * @property {function} [update] - See {@link Phaser.Scene#update}.
 * @property {any} [extend] - Any additional properties, which will be copied to the Scene after it's created (except `data` or `sys`).
 * @property {any} [extend.data] - Any values, which will be merged into the Scene's Data Manager store.
 */
