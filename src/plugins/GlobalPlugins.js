/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

//  These are the global managers, available on the Game instance,
//  that are installed into Scene.Systems as local properties.

var GlobalPlugins = [

    'anims',
    'cache',
    'registry',
    'sound',
    'textures'

];

module.exports = GlobalPlugins;
