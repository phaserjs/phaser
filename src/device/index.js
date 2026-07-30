/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Device class is a collection of properties and functions that describe the device on which the Phaser Game instance is running.
 *
 * These values are read-only and populated during the boot sequence of the game. They are then referenced by internal game systems and are available for you to access
 * via `this.sys.game.device` from within any Scene.
 *
 * @namespace Phaser.Device
 * @since 3.0.0
 */

/**
 * @typedef {object} Phaser.DeviceConf
 *
 * @property {Phaser.Device.OS} os - The OS Device functions.
 * @property {Phaser.Device.Browser} browser - The Browser Device functions.
 * @property {Phaser.Device.Features} features - The Features Device functions.
 * @property {Phaser.Device.Input} input - The Input Device functions.
 * @property {Phaser.Device.Audio} audio - The Audio Device functions.
 * @property {Phaser.Device.Video} video - The Video Device functions.
 * @property {Phaser.Device.Fullscreen} fullscreen - The Fullscreen Device functions.
 * @property {Phaser.Device.CanvasFeatures} canvasFeatures - The Canvas Device functions.
 */

module.exports = {

    os: require('./OS'),
    browser: require('./Browser'),
    features: require('./Features'),
    input: require('./Input'),
    audio: require('./Audio'),
    video: require('./Video'),
    fullscreen: require('./Fullscreen'),
    canvasFeatures: require('./CanvasFeatures')

};
