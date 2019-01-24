/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var CONST = require('./const');
var Extend = require('../utils/object/Extend');

/**
 * @namespace Phaser.Input
 */

var Input = {

    CreateInteractiveObject: require('./CreateInteractiveObject'),
    Events: require('./events'),
    Gamepad: require('./gamepad'),
    InputManager: require('./InputManager'),
    InputPlugin: require('./InputPlugin'),
    InputPluginCache: require('./InputPluginCache'),
    Keyboard: require('./keyboard'),
    Mouse: require('./mouse'),
    Pointer: require('./Pointer'),
    Touch: require('./touch')

};

//   Merge in the consts
Input = Extend(false, Input, CONST);

module.exports = Input;
