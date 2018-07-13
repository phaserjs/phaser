/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var Class: any;
declare var EventEmitter: any;
declare var Gamepad: {
    new (): Gamepad;
    prototype: Gamepad;
};
declare var GetValue: any;
declare var InputPluginCache: any;
/**
 * @typedef {object} Pad
 *
 * @property {string} id - The ID of the Gamepad.
 * @property {integer} index - The index of the Gamepad.
 */
/**
 * @classdesc
 * The Gamepad Plugin is an input plugin that belongs to the Scene-owned Input system.
 *
 * Its role is to listen for native DOM Gamepad Events and then process them.
 *
 * You do not need to create this class directly, the Input system will create an instance of it automatically.
 *
 * You can access it from within a Scene using `this.input.gamepad`.
 *
 * To listen for a gamepad being connected:
 *
 * ```javascript
 * this.input.gamepad.once('connected', function (pad) {
 *     //   'pad' is a reference to the gamepad that was just connected
 * });
 * ```
 *
 * Note that the browser may require you to press a button on a gamepad before it will allow you to access it,
 * this is for security reasons. However, it may also trust the page already, in which case you won't get the
 * 'connected' event and instead should check `GamepadPlugin.total` to see if it thinks there are any gamepads
 * already connected.
 *
 * Once you have received the connected event, or polled the gamepads and found them enabled, you can access
 * them via the built-in properties `GamepadPlugin.pad1` to `pad4`, for up to 4 game pads. With a reference
 * to the gamepads you can poll its buttons and axis sticks. See the properties and methods available on
 * the `Gamepad` class for more details.
 *
 * For more information about Gamepad support in browsers see the following resources:
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API
 * https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API/Using_the_Gamepad_API
 * https://www.smashingmagazine.com/2015/11/gamepad-api-in-web-games/
 * http://html5gamepad.com/
 *
 * @class GamepadPlugin
 * @extends Phaser.Events.EventEmitter
 * @memberOf Phaser.Input.Gamepad
 * @constructor
 * @since 3.10.0
 *
 * @param {Phaser.Input.InputPlugin} sceneInputPlugin - A reference to the Scene Input Plugin that the KeyboardPlugin belongs to.
 */
declare var GamepadPlugin: any;
