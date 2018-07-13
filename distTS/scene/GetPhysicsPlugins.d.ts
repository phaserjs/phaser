/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var GetFastValue: any;
declare var UppercaseFirst: any;
/**
 * Builds an array of which physics plugins should be activated for the given Scene.
 *
 * @function Phaser.Scenes.GetPhysicsPlugins
 * @since 3.0.0
 *
 * @param {Phaser.Scenes.Systems} sys - The scene system to get the physics systems of.
 *
 * @return {array} An array of Physics systems to start for this Scene.
 */
declare var GetPhysicsPlugins: (sys: any) => any[];
