/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * @namespace Phaser.Input.Keyboard
 */

module.exports = {

    KeyboardManager: require('./KeyboardManager'),

    Key: require('./keys/Key'),
    KeyCodes: require('./keys/KeyCodes'),

    KeyCombo: require('./combo/KeyCombo'),

    JustDown: require('./keys/JustDown'),
    JustUp: require('./keys/JustUp'),
    DownDuration: require('./keys/DownDuration'),
    UpDuration: require('./keys/UpDuration')
    
};
