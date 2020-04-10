/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @namespace Phaser.Core.Events
 */

module.exports = {

    BLUR: require('./BLUR_EVENT'),
    BOOT: require('./BOOT_EVENT'),
    CONTEXT_LOST: require('./CONTEXT_LOST_EVENT'),
    CONTEXT_RESTORED: require('./CONTEXT_RESTORED_EVENT'),
    DESTROY: require('./DESTROY_EVENT'),
    FOCUS: require('./FOCUS_EVENT'),
    HIDDEN: require('./HIDDEN_EVENT'),
    PAUSE: require('./PAUSE_EVENT'),
    POST_RENDER: require('./POST_RENDER_EVENT'),
    POST_STEP: require('./POST_STEP_EVENT'),
    PRE_RENDER: require('./PRE_RENDER_EVENT'),
    PRE_STEP: require('./PRE_STEP_EVENT'),
    READY: require('./READY_EVENT'),
    RESUME: require('./RESUME_EVENT'),
    STEP: require('./STEP_EVENT'),
    VISIBLE: require('./VISIBLE_EVENT')

};
