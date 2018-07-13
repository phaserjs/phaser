/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var OS: any;
declare var Browser: any;
/**
 * Determines the input support of the browser running this Phaser Game instance.
 * These values are read-only and populated during the boot sequence of the game.
 * They are then referenced by internal game systems and are available for you to access
 * via `this.sys.game.device.input` from within any Scene.
 *
 * @typedef {object} Phaser.Device.Input
 * @since 3.0.0
 *
 * @property {?string} wheelType - The newest type of Wheel/Scroll event supported: 'wheel', 'mousewheel', 'DOMMouseScroll'
 * @property {boolean} gamepads - Is navigator.getGamepads available?
 * @property {boolean} mspointer - Is mspointer available?
 * @property {boolean} touch - Is touch available?
 */
declare var Input: {
    gamepads: boolean;
    mspointer: boolean;
    touch: boolean;
    wheelEvent: any;
};
