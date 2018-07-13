/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var Class: any;
declare var LightsManager: any;
declare var PluginCache: any;
/**
 * @classdesc
 * A Scene plugin that provides a {@link Phaser.GameObjects.LightsManager} for the Light2D pipeline.
 *
 * Available from within a Scene via `this.lights`.
 *
 * Add Lights using the {@link Phaser.GameObjects.LightsManager#addLight} method:
 *
 * ```javascript
 * // Enable the Lights Manager because it is disabled by default
 * this.lights.enable();
 *
 * // Create a Light at [400, 300] with a radius of 200
 * this.lights.addLight(400, 300, 200);
 * ```
 *
 * For Game Objects to be affected by the Lights when rendered, you will need to set them to use the `Light2D` pipeline like so:
 *
 * ```javascript
 * sprite.setPipeline('Light2D');
 * ```
 *
 * @class LightsPlugin
 * @extends Phaser.GameObjects.LightsManager
 * @memberOf Phaser.GameObjects
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Scene} scene - The Scene that this Lights Plugin belongs to.
 */
declare var LightsPlugin: any;
