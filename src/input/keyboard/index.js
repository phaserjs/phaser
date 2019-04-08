/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
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

    JustDown: require('./keys/JustDown'),
    JustUp: require('./keys/JustUp'),
    DownDuration: require('./keys/DownDuration'),
    UpDuration: require('./keys/UpDuration')
    
};
