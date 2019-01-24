/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * @namespace Phaser.Scenes.Events
 */

module.exports = {

    BOOT: require('./BOOT_EVENT'),
    DESTROY: require('./DESTROY_EVENT'),
    PAUSE: require('./PAUSE_EVENT'),
    POST_UPDATE: require('./POST_UPDATE_EVENT'),
    PRE_UPDATE: require('./PRE_UPDATE_EVENT'),
    READY: require('./READY_EVENT'),
    RENDER: require('./RENDER_EVENT'),
    RESUME: require('./RESUME_EVENT'),
    SHUTDOWN: require('./SHUTDOWN_EVENT'),
    SLEEP: require('./SLEEP_EVENT'),
    START: require('./START_EVENT'),
    TRANSITION_COMPLETE: require('./TRANSITION_COMPLETE_EVENT'),
    TRANSITION_INIT: require('./TRANSITION_INIT_EVENT'),
    TRANSITION_OUT: require('./TRANSITION_OUT_EVENT'),
    TRANSITION_START: require('./TRANSITION_START_EVENT'),
    TRANSITION_WAKE: require('./TRANSITION_WAKE_EVENT'),
    UPDATE: require('./UPDATE_EVENT'),
    WAKE: require('./WAKE_EVENT')

};
