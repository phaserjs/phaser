/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var Extend: any;
declare var XHRSettings: any;
/**
 * Takes two XHRSettings Objects and creates a new XHRSettings object from them.
 *
 * The new object is seeded by the values given in the global settings, but any setting in
 * the local object overrides the global ones.
 *
 * @function Phaser.Loader.MergeXHRSettings
 * @since 3.0.0
 *
 * @param {XHRSettingsObject} global - The global XHRSettings object.
 * @param {XHRSettingsObject} local - The local XHRSettings object.
 *
 * @return {XHRSettingsObject} A newly formed XHRSettings object.
 */
declare var MergeXHRSettings: any;
