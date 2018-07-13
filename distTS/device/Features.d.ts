/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var OS: any;
declare var Browser: any;
declare var CanvasPool: any;
/**
 * Determines the features of the browser running this Phaser Game instance.
 * These values are read-only and populated during the boot sequence of the game.
 * They are then referenced by internal game systems and are available for you to access
 * via `this.sys.game.device.features` from within any Scene.
 *
 * @typedef {object} Phaser.Device.Features
 * @since 3.0.0
 *
 * @property {?boolean} canvasBitBltShift - True if canvas supports a 'copy' bitblt onto itself when the source and destination regions overlap.
 * @property {boolean} canvas - Is canvas available?
 * @property {boolean} file - Is file available?
 * @property {boolean} fileSystem - Is fileSystem available?
 * @property {boolean} getUserMedia - Does the device support the getUserMedia API?
 * @property {boolean} littleEndian - Is the device big or little endian? (only detected if the browser supports TypedArrays)
 * @property {boolean} localStorage - Is localStorage available?
 * @property {boolean} pointerLock - Is Pointer Lock available?
 * @property {boolean} support32bit - Does the device context support 32bit pixel manipulation using array buffer views?
 * @property {boolean} vibration - Does the device support the Vibration API?
 * @property {boolean} webGL - Is webGL available?
 * @property {boolean} worker - Is worker available?
 */
declare var Features: any;
declare function checkIsLittleEndian(): boolean;
