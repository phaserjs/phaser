/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * @namespace Phaser.Input.Events
 */

module.exports = {

    BOOT: require('./BOOT_EVENT'),
    DESTROY: require('./DESTROY_EVENT'),
    GAME_OUT: require('./GAME_OUT_EVENT'),
    GAME_OVER: require('./GAME_OVER_EVENT'),
    GAMEOBJECT_DOWN: require('./GAMEOBJECT_DOWN_EVENT'),
    GAMEOBJECT_MOVE: require('./GAMEOBJECT_MOVE_EVENT'),
    GAMEOBJECT_POINTER_DOWN: require('./GAMEOBJECT_POINTER_DOWN_EVENT'),
    GAMEOBJECT_POINTER_MOVE: require('./GAMEOBJECT_POINTER_MOVE_EVENT'),
    GAMEOBJECT_POINTER_UP: require('./GAMEOBJECT_POINTER_UP_EVENT'),
    GAMEOBJECT_UP: require('./GAMEOBJECT_UP_EVENT'),
    POINTER_DOWN: require('./POINTER_DOWN_EVENT'),
    POINTER_DOWN_OUTSIDE: require('./POINTER_DOWN_OUTSIDE_EVENT'),
    POINTER_MOVE: require('./POINTER_MOVE_EVENT'),
    POINTER_UP: require('./POINTER_UP_EVENT'),
    POINTER_UP_OUTSIDE: require('./POINTER_UP_OUTSIDE_EVENT'),
    PRE_UPDATE: require('./PRE_UPDATE_EVENT'),
    SHUTDOWN: require('./SHUTDOWN_EVENT'),
    START: require('./START_EVENT'),
    UPDATE: require('./UPDATE_EVENT')

};
