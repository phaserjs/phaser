/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GameObjectFactory = require('../GameObjectFactory');
var PointLight = require('./PointLight');

/**
 * Creates a new Point Light Game Object and adds it to the Scene.
 *
 * Note: This method will only be available if the Point Light Game Object has been built into Phaser.
 *
 * The Point Light Game Object provides a way to add a point light effect into your game,
 * without the expensive shader processing requirements of the traditional Light Game Object.
 *
 * The difference is that the Point Light renders using a custom shader, designed to give the
 * impression of a point light source, of variable radius, intensity and color, in your game.
 * However, unlike the Light Game Object, it does not impact any other Game Objects, or use their
 * normal maps for calcuations. This makes them extremely fast to render compared to Lights
 * and perfect for special effects, such as flickering torches or muzzle flashes.
 *
 * For maximum performance you should batch Point Light Game Objects together. This means
 * ensuring they follow each other consecutively on the display list. Ideally, use a Layer
 * Game Object and then add just Point Lights to it, so that it can batch together the rendering
 * of the lights. You don't _have_ to do this, and if you've only a handful of Point Lights in
 * your game then it's perfectly safe to mix them into the dislay list as normal. However, if
 * you're using a large number of them, please consider how they are mixed into the display list.
 *
 * The renderer will automatically cull Point Lights. Those with a radius that does not intersect
 * with the Camera will be skipped in the rendering list. This happens automatically and the
 * culled state is refreshed every frame, for every camera.
 *
 * The origin of a Point Light is always 0.5 and it cannot be changed.
 *
 * Point Lights are a WebGL only feature and do not have a Canvas counterpart.
 *
 * @method Phaser.GameObjects.GameObjectFactory#pointlight
 * @since 3.50.0
 *
 * @param {number} x - The horizontal position of this Point Light in the world.
 * @param {number} y - The vertical position of this Point Light in the world.
 * @param {number} [color=0xffffff] - The color of the Point Light, given as a hex value.
 * @param {number} [radius=128] - The radius of the Point Light.
 * @param {number} [intensity=1] - The intensity, or colr blend, of the Point Light.
 * @param {number} [attenuation=0.1] - The attenuation  of the Point Light. This is the reduction of light from the center point.
 *
 * @return {Phaser.GameObjects.PointLight} The Game Object that was created.
 */
GameObjectFactory.register('pointlight', function (x, y, color, radius, intensity, attenuation)
{
    return this.displayList.add(new PointLight(this.scene, x, y, color, radius, intensity, attenuation));
});
