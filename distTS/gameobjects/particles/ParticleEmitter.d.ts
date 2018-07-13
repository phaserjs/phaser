/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var BlendModes: any;
declare var Class: any;
declare var Components: any;
declare var DeathZone: any;
declare var EdgeZone: any;
declare var EmitterOp: any;
declare var GetFastValue: any;
declare var GetRandom: any;
declare var HasAny: any;
declare var HasValue: any;
declare var Particle: any;
declare var RandomZone: any;
declare var Rectangle: any;
declare var StableSort: any;
declare var Vector2: any;
declare var Wrap: any;
/**
 * @callback ParticleEmitterCallback
 *
 * @param {Phaser.GameObjects.Particles.Particle} particle - The particle associated with the call.
 * @param {Phaser.GameObjects.Particles.ParticleEmitter} emitter - This particle emitter associated with the call.
 */
/**
 * @callback ParticleDeathCallback
 *
 * @param {Phaser.GameObjects.Particles.Particle} particle - The particle that died.
*/
/**
 * @typedef {object} ParticleEmitterBounds
 *
 * @property {number} x - The left edge of the rectangle.
 * @property {number} y - The top edge of the rectangle.
 * @property {number} width - The width of the rectangle.
 * @property {number} height - The height of the rectangle.
 *
 * @see Phaser.GameObjects.Particles.ParticleEmitter#setBounds
 */
/**
 * @typedef {object} ParticleEmitterBoundsAlt
 *
 * @property {number} x - The left edge of the rectangle.
 * @property {number} y - The top edge of the rectangle.
 * @property {number} w - The width of the rectangle.
 * @property {number} h - The height of the rectangle.
 *
 * @see Phaser.GameObjects.Particles.ParticleEmitter#setBounds
 */
/**
 * @typedef {object} ParticleEmitterDeathZoneConfig
 *
 * @property {DeathZoneSource} source - A shape representing the zone. See {@link Phaser.GameObjects.Particles.Zones.DeathZone#source}.
 * @property {string} [type='onEnter'] - 'onEnter' or 'onLeave'.
 */
/**
 * @typedef {object} ParticleEmitterEdgeZoneConfig
 *
 * @property {EdgeZoneSource} source - A shape representing the zone. See {@link Phaser.GameObjects.Particles.Zones.EdgeZone#source}.
 * @property {string} type - 'edge'.
 * @property {integer} quantity - The number of particles to place on the source edge. Set to 0 to use `stepRate` instead.
 * @property {number} [stepRate] - The distance between each particle. When set, `quantity` is implied and should be set to 0.
 * @property {boolean} [yoyo=false] - Whether particles are placed from start to end and then end to start.
 * @property {boolean} [seamless=true] - Whether one endpoint will be removed if it's identical to the other.
 */
/**
 * @typedef {object} ParticleEmitterRandomZoneConfig
 *
 * @property {RandomZoneSource} source - A shape representing the zone. See {@link Phaser.GameObjects.Particles.Zones.RandomZone#source}.
 * @property {string} [type] - 'random'.
 */
/**
 * @typedef {object} ParticleEmitterConfig
 *
 * @property {boolean} [active] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#active}.
 * @property {integer} [blendMode] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#blendMode}.
 * @property {*} [callbackScope] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#deathCallbackScope} and {@link Phaser.GameObjects.Particles.ParticleEmitter#emitCallbackScope}.
 * @property {boolean} [collideBottom] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#collideBottom}.
 * @property {boolean} [collideLeft] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#collideLeft}.
 * @property {boolean} [collideRight] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#collideRight}.
 * @property {boolean} [collideTop] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#collideTop}.
 * @property {boolean} [deathCallback] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#deathCallback}.
 * @property {*} [deathCallbackScope] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#deathCallbackScope}.
 * @property {function} [emitCallback] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#emitCallback}.
 * @property {*} [emitCallbackScope] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#emitCallbackScope}.
 * @property {Phaser.GameObjects.GameObject} [follow] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#follow}.
 * @property {number} [frequency] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#frequency}.
 * @property {number} [gravityX] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#gravityX}.
 * @property {number} [gravityY] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#gravityY}.
 * @property {integer} [maxParticles] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#maxParticles}.
 * @property {string} [name] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#name}.
 * @property {boolean} [on] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#on}.
 * @property {boolean} [particleBringToTop] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#particleBringToTop}.
 * @property {Phaser.GameObjects.Particles.Particle} [particleClass] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#particleClass}.
 * @property {boolean} [radial] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#radial}.
 * @property {number} [timeScale] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#timeScale}.
 * @property {boolean} [trackVisible] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#trackVisible}.
 * @property {boolean} [visible] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#visible}.
 * @property {number|number[]|EmitterOpOnEmitCallback|object} [accelerationX] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#accelerationX} (emit only).
 * @property {number|number[]|EmitterOpOnEmitCallback|object} [accelerationY] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#accelerationY} (emit only).
 * @property {number|number[]|EmitterOpOnUpdateCallback|object} [alpha] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#alpha}.
 * @property {number|number[]|EmitterOpOnEmitCallback|object} [angle] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#angle} (emit only)
 * @property {number|number[]|EmitterOpOnEmitCallback|object} [bounce] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#bounce} (emit only).
 * @property {number|number[]|EmitterOpOnEmitCallback|object} [delay] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#delay} (emit only).
 * @property {number|number[]|EmitterOpOnEmitCallback|object} [lifespan] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#lifespan} (emit only).
 * @property {number|number[]|EmitterOpOnEmitCallback|object} [maxVelocityX] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#maxVelocityX} (emit only).
 * @property {number|number[]|EmitterOpOnEmitCallback|object} [maxVelocityY] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#maxVelocityY} (emit only).
 * @property {number|number[]|EmitterOpOnEmitCallback|object} [moveToX] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#moveToX} (emit only).
 * @property {number|number[]|EmitterOpOnEmitCallback|object} [moveToY] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#moveToY} (emit only).
 * @property {number|number[]|EmitterOpOnEmitCallback|object} [quantity] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#quantity} (emit only).
 * @property {number|number[]|EmitterOpOnUpdateCallback|object} [rotate] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#rotate}.
 * @property {number|number[]|EmitterOpOnUpdateCallback|object} [scale] - As {@link Phaser.GameObjects.Particles.ParticleEmitter#setScale}.
 * @property {number|number[]|EmitterOpOnUpdateCallback|object} [scaleX] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#scaleX}.
 * @property {number|number[]|EmitterOpOnUpdateCallback|object} [scaleY] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#scaleY}.
 * @property {number|number[]|EmitterOpOnEmitCallback|object} [speed] - As {@link Phaser.GameObjects.Particles.ParticleEmitter#setSpeed} (emit only).
 * @property {number|number[]|EmitterOpOnEmitCallback|object} [speedX] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#speedX} (emit only).
 * @property {number|number[]|EmitterOpOnEmitCallback|object} [speedY] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#speedY} (emit only).
 * @property {number|number[]|EmitterOpOnEmitCallback|object} [tint] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#tint}.
 * @property {number|number[]|EmitterOpOnEmitCallback|object} [x] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#x} (emit only).
 * @property {number|number[]|EmitterOpOnEmitCallback|object} [y] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#y} (emit only).
 * @property {object} [emitZone] - As {@link Phaser.GameObjects.Particles.ParticleEmitter#setEmitZone}.
 * @property {ParticleEmitterBounds|ParticleEmitterBoundsAlt} [bounds] - As {@link Phaser.GameObjects.Particles.ParticleEmitter#setBounds}.
 * @property {object} [followOffset] - Assigns to {@link Phaser.GameObjects.Particles.ParticleEmitter#followOffset}.
 * @property {number} [followOffset.x] - x-coordinate of the offset.
 * @property {number} [followOffset.y] - y-coordinate of the offset.
 * @property {number|number[]|string|string[]|Phaser.Textures.Frame|Phaser.Textures.Frame[]|ParticleEmitterFrameConfig} [frames] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#frames}.
 */
/**
 * @typedef {object} ParticleEmitterFrameConfig
 *
 * @property {number|number[]|string|string[]|Phaser.Textures.Frame|Phaser.Textures.Frame[]} [frames] - One or more texture frames.
 * @property {boolean} [cycle] - Whether texture frames will be assigned consecutively (true) or at random (false).
 * @property {integer} [quantity] - The number of consecutive particles receiving each texture frame, when `cycle` is true.
 */
/**
 * @classdesc
 * A particle emitter represents a single particle stream.
 * It controls a pool of {@link Phaser.GameObjects.Particles.Particle Particles} and is controlled by a {@link Phaser.GameObjects.Particles.ParticleEmitterManager Particle Emitter Manager}.
 *
 * @class ParticleEmitter
 * @memberOf Phaser.GameObjects.Particles
 * @constructor
 * @since 3.0.0
 *
 * @extends Phaser.GameObjects.Components.BlendMode
 * @extends Phaser.GameObjects.Components.Mask
 * @extends Phaser.GameObjects.Components.ScrollFactor
 * @extends Phaser.GameObjects.Components.Visible
 *
 * @param {Phaser.GameObjects.Particles.ParticleEmitterManager} manager - The Emitter Manager this Emitter belongs to.
 * @param {ParticleEmitterConfig} config - Settings for this emitter.
 */
declare var ParticleEmitter: any;
