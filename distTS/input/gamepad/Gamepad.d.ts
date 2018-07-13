/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var Axis: any;
declare var Button: any;
declare var Class: any;
declare var EventEmitter: any;
declare var Vector2: any;
/**
 * @classdesc
 * A single Gamepad.
 *
 * These are created, updated and managed by the Gamepad Plugin.
 *
 * @class Gamepad
 * @extends Phaser.Events.EventEmitter
 * @memberOf Phaser.Input.Gamepad
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Input.Gamepad.GamepadPlugin} manager - A reference to the Gamepad Plugin.
 * @param {Pad} pad - The Gamepad object, as extracted from GamepadEvent.
 */
declare var Gamepad: {
    new (): Gamepad;
    prototype: Gamepad;
};
