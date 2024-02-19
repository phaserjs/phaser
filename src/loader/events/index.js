/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @namespace Phaser.Loader.Events
 */

module.exports = {

    ADD: require('./ADD_EVENT'),
    COMPLETE: require('./COMPLETE_EVENT'),
    FILE_COMPLETE: require('./FILE_COMPLETE_EVENT'),
    FILE_KEY_COMPLETE: require('./FILE_KEY_COMPLETE_EVENT'),
    FILE_LOAD_ERROR: require('./FILE_LOAD_ERROR_EVENT'),
    FILE_LOAD: require('./FILE_LOAD_EVENT'),
    FILE_PROGRESS: require('./FILE_PROGRESS_EVENT'),
    POST_PROCESS: require('./POST_PROCESS_EVENT'),
    PROGRESS: require('./PROGRESS_EVENT'),
    START: require('./START_EVENT')

};
