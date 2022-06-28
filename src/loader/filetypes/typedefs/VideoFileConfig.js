/**
 * @typedef {object} Phaser.Types.Loader.FileTypes.VideoFileConfig
 *
 * @property {(string|Phaser.Types.Loader.FileTypes.VideoFileConfig)} key - The key to use for this file, or a file configuration object.
 * @property {(string|string[]|Phaser.Types.Loader.FileTypes.VideoFileURLConfig|Phaser.Types.Loader.FileTypes.VideoFileURLConfig[])} [url] - The absolute or relative URLs to load the video files from.
 * @property {string} [loadEvent] - The load event to listen for when _not_ loading as a blob. Either 'loadeddata', 'canplay' or 'canplaythrough'.
 * @property {boolean} [asBlob] - Load the video as a data blob, or via the Video element?
 * @property {boolean} [noAudio] - Does the video have an audio track? If not you can enable auto-playing on it.
 * @property {Phaser.Types.Loader.XHRSettingsObject} [xhrSettings] - Extra XHR Settings specifically for this file.
 */
