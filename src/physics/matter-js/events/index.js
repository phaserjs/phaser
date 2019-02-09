/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * @namespace Phaser.Physics.Matter.Events
 */

module.exports = {

    AFTER_UPDATE: require('./AFTER_UPDATE_EVENT'),
    BEFORE_UPDATE: require('./BEFORE_UPDATE_EVENT'),
    COLLISION_ACTIVE: require('./COLLISION_ACTIVE_EVENT'),
    COLLISION_END: require('./COLLISION_END_EVENT'),
    COLLISION_START: require('./COLLISION_START_EVENT'),
    DRAG_END: require('./DRAG_END_EVENT'),
    DRAG: require('./DRAG_EVENT'),
    DRAG_START: require('./DRAG_START_EVENT'),
    PAUSE: require('./PAUSE_EVENT'),
    RESUME: require('./RESUME_EVENT'),
    SLEEP_END: require('./SLEEP_END_EVENT'),
    SLEEP_START: require('./SLEEP_START_EVENT')

};
