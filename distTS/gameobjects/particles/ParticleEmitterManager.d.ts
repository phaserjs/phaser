/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var Class: any;
declare var Components: any;
declare var GameObject: any;
declare var GravityWell: any;
declare var List: any;
declare var ParticleEmitter: any;
declare var Render: any;
/**
 * @classdesc
 * A Particle Emitter Manager creates and controls {@link Phaser.GameObjects.Particles.ParticleEmitter Particle Emitters} and {@link Phaser.GameObjects.Particles.GravityWell Gravity Wells}.
 *
 * @class ParticleEmitterManager
 * @extends Phaser.GameObjects.GameObject
 * @memberOf Phaser.GameObjects.Particles
 * @constructor
 * @since 3.0.0
 *
 * @extends Phaser.GameObjects.Particles.Components.Depth
 * @extends Phaser.GameObjects.Particles.Components.Pipeline
 * @extends Phaser.GameObjects.Particles.Components.Visible
 *
 * @param {Phaser.Scene} scene - The Scene to which this Emitter Manager belongs.
 * @param {string} texture - The key of the Texture this Emitter Manager will use to render particles, as stored in the Texture Manager.
 * @param {(string|integer)} [frame] - An optional frame from the Texture this Emitter Manager will use to render particles.
 * @param {ParticleEmitterConfig|ParticleEmitterConfig[]} [emitters] - Configuration settings for one or more emitters to create.
 */
declare var ParticleEmitterManager: any;
