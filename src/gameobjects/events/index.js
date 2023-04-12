/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @namespace Phaser.GameObjects.Events
 */

module.exports = {

    ADDED_TO_SCENE: require('./ADDED_TO_SCENE_EVENT'),
    DESTROY: require('./DESTROY_EVENT'),
    REMOVED_FROM_SCENE: require('./REMOVED_FROM_SCENE_EVENT'),
    VIDEO_COMPLETE: require('./VIDEO_COMPLETE_EVENT'),
    VIDEO_CREATED: require('./VIDEO_CREATED_EVENT'),
    VIDEO_ERROR: require('./VIDEO_ERROR_EVENT'),
    VIDEO_LOCKED: require('./VIDEO_LOCKED_EVENT'),
    VIDEO_LOOP: require('./VIDEO_LOOP_EVENT'),
    VIDEO_PLAY: require('./VIDEO_PLAY_EVENT'),
    VIDEO_PLAYING: require('./VIDEO_PLAYING_EVENT'),
    VIDEO_SEEKED: require('./VIDEO_SEEKED_EVENT'),
    VIDEO_SEEKING: require('./VIDEO_SEEKING_EVENT'),
    VIDEO_STALLED: require('./VIDEO_STALLED_EVENT'),
    VIDEO_STOP: require('./VIDEO_STOP_EVENT'),
    VIDEO_TEXTURE: require('./VIDEO_TEXTURE_EVENT'),
    VIDEO_UNLOCKED: require('./VIDEO_UNLOCKED_EVENT'),
    VIDEO_UNSUPPORTED: require('./VIDEO_UNSUPPORTED_EVENT')

};
