/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @namespace Phaser.Physics.Matter.Events
 */

module.exports = {

    AFTER_ADD: require('./AFTER_ADD_EVENT'),
    AFTER_REMOVE: require('./AFTER_REMOVE_EVENT'),
    AFTER_UPDATE: require('./AFTER_UPDATE_EVENT'),
    BEFORE_ADD: require('./BEFORE_ADD_EVENT'),
    BEFORE_REMOVE: require('./BEFORE_REMOVE_EVENT'),
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
