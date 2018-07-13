/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var CanvasPool: any;
/**
 * Determines the canvas features of the browser running this Phaser Game instance.
 * These values are read-only and populated during the boot sequence of the game.
 * They are then referenced by internal game systems and are available for you to access
 * via `this.sys.game.device.canvasFeatures` from within any Scene.
 *
 * @typedef {object} Phaser.Device.CanvasFeatures
 * @since 3.0.0
 *
 * @property {boolean} supportInverseAlpha - Set to true if the browser supports inversed alpha.
 * @property {boolean} supportNewBlendModes - Set to true if the browser supports new canvas blend modes.
 */
declare var CanvasFeatures: {
    supportInverseAlpha: boolean;
    supportNewBlendModes: boolean;
};
declare function checkBlendMode(): boolean;
declare function checkInverseAlpha(): boolean;
