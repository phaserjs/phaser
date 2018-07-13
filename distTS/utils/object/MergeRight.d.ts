/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var Clone: (source: any) => any;
/**
 * Creates a new Object using all values from obj1.
 *
 * Then scans obj2. If a property is found in obj2 that *also* exists in obj1, the value from obj2 is used, otherwise the property is skipped.
 *
 * @function Phaser.Utils.Object.MergeRight
 * @since 3.0.0
 *
 * @param {object} obj1 - [description]
 * @param {object} obj2 - [description]
 *
 * @return {object} [description]
 */
declare var MergeRight: (obj1: any, obj2: any) => any;
