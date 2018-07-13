/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var Class: any;
declare var GetFastValue: any;
declare var ProcessKeyCombo: any;
declare var ResetKeyCombo: any;
/**
 * @callback KeyboardKeydownCallback
 *
 * @param {KeyboardEvent} event - The Keyboard Event.
 */
/**
 * @typedef {object} KeyComboConfig
 *
 * @property {boolean} [resetOnWrongKey=true] - If they press the wrong key do we reset the combo?
 * @property {number} [maxKeyDelay=0] - The max delay in ms between each key press. Above this the combo is reset. 0 means disabled.
 * @property {boolean} [resetOnMatch=false] - If previously matched and they press the first key of the combo again, will it reset?
 * @property {boolean} [deleteOnMatch=false] - If the combo matches, will it delete itself?
 */
/**
 * @classdesc
 * A KeyCombo will listen for a specific string of keys from the Keyboard, and when it receives them
 * it will emit a `keycombomatch` event from the Keyboard Manager.
 *
 * The keys to be listened for can be defined as:
 *
 * A string (i.e. 'ATARI')
 * An array of either integers (key codes) or strings, or a mixture of both
 * An array of objects (such as Key objects) with a public 'keyCode' property
 *
 * For example, to listen for the Konami code (up, up, up, down, down, down, left, left, left, right, right, right)
 * you could pass the following array of key codes:
 *
 * ```javascript
 * this.input.keyboard.createCombo([ 38, 38, 38, 40, 40, 40, 37, 37, 37, 39, 39, 39 ], { resetOnMatch: true });
 *
 * this.input.keyboard.on('keycombomatch', function (event) {
 *     console.log('Konami Code entered!');
 * });
 * ```
 *
 * Or, to listen for the user entering the word PHASER:
 *
 * ```javascript
 * this.input.keyboard.createCombo('PHASER');
 * ```
 *
 * @class KeyCombo
 * @memberOf Phaser.Input.Keyboard
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Input.Keyboard.KeyboardPlugin} keyboardPlugin - A reference to the Keyboard Plugin.
 * @param {(string|integer[]|object[])} keys - The keys that comprise this combo.
 * @param {KeyComboConfig} [config] - A Key Combo configuration object.
 */
declare var KeyCombo: any;
