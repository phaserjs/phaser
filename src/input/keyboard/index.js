/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @namespace Phaser.Input.Keyboard
 */

module.exports = {

    Events: require('./events'),

    KeyboardManager: require('./KeyboardManager'),
    KeyboardPlugin: require('./KeyboardPlugin'),

    Key: require('./keys/Key'),
    KeyCodes: require('./keys/KeyCodes'),

    KeyCombo: require('./combo/KeyCombo'),

    AdvanceKeyCombo: require('./combo/AdvanceKeyCombo'),
    ProcessKeyCombo: require('./combo/ProcessKeyCombo'),
    ResetKeyCombo: require('./combo/ResetKeyCombo'),

    JustDown: require('./keys/JustDown'),
    JustUp: require('./keys/JustUp'),
    DownDuration: require('./keys/DownDuration'),
    UpDuration: require('./keys/UpDuration')

};
