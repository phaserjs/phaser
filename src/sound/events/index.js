/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * @namespace Phaser.Sound.Events
 */

module.exports = {

    COMPLETE: require('./COMPLETE_EVENT'),
    DESTROY: require('./DESTROY_EVENT'),
    DETUNE: require('./DETUNE_EVENT'),
    GLOBAL_DETUNE: require('./GLOBAL_DETUNE_EVENT'),
    GLOBAL_MUTE: require('./GLOBAL_MUTE_EVENT'),
    GLOBAL_RATE: require('./GLOBAL_RATE_EVENT'),
    GLOBAL_VOLUME: require('./GLOBAL_VOLUME_EVENT'),
    LOOP: require('./LOOP_EVENT'),
    LOOPED: require('./LOOPED_EVENT'),
    MUTE: require('./MUTE_EVENT'),
    PAUSE_ALL: require('./PAUSE_ALL_EVENT'),
    PAUSE: require('./PAUSE_EVENT'),
    PLAY: require('./PLAY_EVENT'),
    RATE: require('./RATE_EVENT'),
    RESUME_ALL: require('./RESUME_ALL_EVENT'),
    RESUME: require('./RESUME_EVENT'),
    SEEK: require('./SEEK_EVENT'),
    STOP_ALL: require('./STOP_ALL_EVENT'),
    STOP: require('./STOP_EVENT'),
    UNLOCKED: require('./UNLOCKED_EVENT'),
    VOLUME: require('./VOLUME_EVENT')

};
