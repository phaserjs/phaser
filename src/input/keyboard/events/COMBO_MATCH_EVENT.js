/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * The Key Combo Match Event.
 * 
 * This event is dispatched by the Keyboard Plugin when a [Key Combo]{@link Phaser.Input.Keyboard.KeyCombo} is matched.
 * 
 * Listen for this event from the Key Plugin after a combo has been created:
 * 
 * ```javascript
 * this.input.keyboard.createCombo([ 38, 38, 40, 40, 37, 39, 37, 39, 66, 65, 13 ], { resetOnMatch: true });
 *
 * this.input.keyboard.on('keycombomatch', function (event) {
 *     console.log('Konami Code entered!');
 * });
 * ```
 *
 * @event Phaser.Input.Keyboard.Events#COMBO_MATCH
 * 
 * @param {Phaser.Input.Keyboard.KeyCombo} keycombo - The Key Combo object that was matched.
 * @param {KeyboardEvent} event - The native DOM Keyboard Event of the final key in the combo. You can inspect this to learn more about any modifiers, etc.
 */
module.exports = 'keycombomatch';
