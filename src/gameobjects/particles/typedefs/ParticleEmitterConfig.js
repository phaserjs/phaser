/**
 * @typedef {object} Phaser.Types.GameObjects.Particles.ParticleEmitterConfig
 * @since 3.0.0
 *
 * @property {boolean} [active] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#active}.
 * @property {(Phaser.BlendModes|string)} [blendMode] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#blendMode}.
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
 * @property {number|number[]|Phaser.Types.GameObjects.Particles.EmitterOpOnEmitCallback|object} [accelerationX] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#accelerationX} (emit only).
 * @property {number|number[]|Phaser.Types.GameObjects.Particles.EmitterOpOnEmitCallback|object} [accelerationY] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#accelerationY} (emit only).
 * @property {number|number[]|Phaser.Types.GameObjects.Particles.EmitterOpOnUpdateCallback|object} [alpha] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#alpha}.
 * @property {number|number[]|Phaser.Types.GameObjects.Particles.EmitterOpOnEmitCallback|object} [angle] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#angle} (emit only)
 * @property {number|number[]|Phaser.Types.GameObjects.Particles.EmitterOpOnEmitCallback|object} [bounce] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#bounce} (emit only).
 * @property {number|number[]|Phaser.Types.GameObjects.Particles.EmitterOpOnEmitCallback|object} [delay] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#delay} (emit only).
 * @property {number|number[]|Phaser.Types.GameObjects.Particles.EmitterOpOnEmitCallback|object} [lifespan] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#lifespan} (emit only).
 * @property {number|number[]|Phaser.Types.GameObjects.Particles.EmitterOpOnEmitCallback|object} [maxVelocityX] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#maxVelocityX} (emit only).
 * @property {number|number[]|Phaser.Types.GameObjects.Particles.EmitterOpOnEmitCallback|object} [maxVelocityY] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#maxVelocityY} (emit only).
 * @property {number|number[]|Phaser.Types.GameObjects.Particles.EmitterOpOnEmitCallback|object} [moveToX] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#moveToX} (emit only).
 * @property {number|number[]|Phaser.Types.GameObjects.Particles.EmitterOpOnEmitCallback|object} [moveToY] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#moveToY} (emit only).
 * @property {number|number[]|Phaser.Types.GameObjects.Particles.EmitterOpOnEmitCallback|object} [quantity] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#quantity} (emit only).
 * @property {number|number[]|Phaser.Types.GameObjects.Particles.EmitterOpOnUpdateCallback|object} [rotate] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#rotate}.
 * @property {number|number[]|Phaser.Types.GameObjects.Particles.EmitterOpOnUpdateCallback|object} [scale] - As {@link Phaser.GameObjects.Particles.ParticleEmitter#setScale}.
 * @property {number|number[]|Phaser.Types.GameObjects.Particles.EmitterOpOnUpdateCallback|object} [scaleX] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#scaleX}.
 * @property {number|number[]|Phaser.Types.GameObjects.Particles.EmitterOpOnUpdateCallback|object} [scaleY] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#scaleY}.
 * @property {number|number[]|Phaser.Types.GameObjects.Particles.EmitterOpOnEmitCallback|object} [speed] - As {@link Phaser.GameObjects.Particles.ParticleEmitter#setSpeed} (emit only).
 * @property {number|number[]|Phaser.Types.GameObjects.Particles.EmitterOpOnEmitCallback|object} [speedX] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#speedX} (emit only).
 * @property {number|number[]|Phaser.Types.GameObjects.Particles.EmitterOpOnEmitCallback|object} [speedY] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#speedY} (emit only).
 * @property {number|number[]|Phaser.Types.GameObjects.Particles.EmitterOpOnEmitCallback|object} [tint] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#tint}.
 * @property {number|number[]|Phaser.Types.GameObjects.Particles.EmitterOpOnEmitCallback|object} [x] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#x} (emit only).
 * @property {number|number[]|Phaser.Types.GameObjects.Particles.EmitterOpOnEmitCallback|object} [y] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#y} (emit only).
 * @property {object} [emitZone] - As {@link Phaser.GameObjects.Particles.ParticleEmitter#setEmitZone}.
 * @property {Phaser.Types.GameObjects.Particles.ParticleEmitterBounds|Phaser.Types.GameObjects.Particles.ParticleEmitterBoundsAlt} [bounds] - As {@link Phaser.GameObjects.Particles.ParticleEmitter#setBounds}.
 * @property {object} [followOffset] - Assigns to {@link Phaser.GameObjects.Particles.ParticleEmitter#followOffset}.
 * @property {number} [followOffset.x] - x-coordinate of the offset.
 * @property {number} [followOffset.y] - y-coordinate of the offset.
 * @property {number|number[]|string|string[]|Phaser.Textures.Frame|Phaser.Textures.Frame[]|Phaser.Types.GameObjects.Particles.ParticleEmitterFrameConfig} [frame] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#frames}.
 */
