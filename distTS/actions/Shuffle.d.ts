/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var ArrayShuffle: any;
/**
 * Shuffles the array in place. The shuffled array is both modified and returned.
 *
 * @function Phaser.Actions.Shuffle
 * @since 3.0.0
 * @see Phaser.Utils.Array.Shuffle
 *
 * @generic {Phaser.GameObjects.GameObject[]} G - [items,$return]
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - An array of Game Objects. The contents of this array are updated by this Action.
 *
 * @return {(array|Phaser.GameObjects.GameObject[])} The array of Game Objects that was passed to this Action.
 */
declare var Shuffle: (items: any) => any;
