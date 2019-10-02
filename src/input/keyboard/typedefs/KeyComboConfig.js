/**
 * @typedef {object} Phaser.Types.Input.Keyboard.KeyComboConfig
 * @since 3.0.0
 *
 * @property {boolean} [resetOnWrongKey=true] - If they press the wrong key do we reset the combo?
 * @property {number} [maxKeyDelay=0] - The max delay in ms between each key press. Above this the combo is reset. 0 means disabled.
 * @property {boolean} [resetOnMatch=false] - If previously matched and they press the first key of the combo again, will it reset?
 * @property {boolean} [deleteOnMatch=false] - If the combo matches, will it delete itself?
 */
