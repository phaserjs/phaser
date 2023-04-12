/**
 * @typedef {object} Phaser.Types.GameObjects.Particles.ParticleEmitterConfig
 * @since 3.0.0
 *
 * @property {boolean} [active] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#active}. Setting this to false will stop the emitter from running at all. If you just wish to stop particles from emitting, set `emitting` property instead.
 * @property {Phaser.BlendModes|string} [blendMode] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#blendMode}.
 * @property {*} [callbackScope] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#deathCallbackScope} and {@link Phaser.GameObjects.Particles.ParticleEmitter#emitCallbackScope}.
 * @property {boolean} [collideBottom] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#collideBottom}.
 * @property {boolean} [collideLeft] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#collideLeft}.
 * @property {boolean} [collideRight] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#collideRight}.
 * @property {boolean} [collideTop] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#collideTop}.
 * @property {function} [deathCallback] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#deathCallback}.
 * @property {*} [deathCallbackScope] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#deathCallbackScope}.
 * @property {function} [emitCallback] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#emitCallback}.
 * @property {*} [emitCallbackScope] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#emitCallbackScope}.
 * @property {Phaser.GameObjects.GameObject} [follow] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#follow}.
 * @property {number} [frequency] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#frequency}.
 * @property {number} [gravityX] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#gravityX}.
 * @property {number} [gravityY] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#gravityY}.
 * @property {number} [maxParticles] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#maxParticles}.
 * @property {number} [maxAliveParticles] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#maxAliveParticles}.
 * @property {string} [name] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#name}.
 * @property {boolean} [emitting] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#emitting}.
 * @property {boolean} [particleBringToTop] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#particleBringToTop}.
 * @property {function} [particleClass] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#particleClass}.
 * @property {boolean} [radial] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#radial}.
 * @property {number} [timeScale] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#timeScale}.
 * @property {boolean} [trackVisible] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#trackVisible}.
 * @property {boolean} [visible] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#visible}.
 * @property {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType|Phaser.Types.GameObjects.Particles.EmitterOpOnUpdateType} [accelerationX] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#accelerationX}.
 * @property {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType|Phaser.Types.GameObjects.Particles.EmitterOpOnUpdateType} [accelerationY] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#accelerationY}.
 * @property {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType|Phaser.Types.GameObjects.Particles.EmitterOpOnUpdateType} [alpha] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#particleAlpha}.
 * @property {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType} [angle] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#particleAngle} (emit only).
 * @property {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType|Phaser.Types.GameObjects.Particles.EmitterOpOnUpdateType} [bounce] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#bounce}.
 * @property {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType} [delay] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#delay} (emit only).
 * @property {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType} [hold] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#hold} (emit only).
 * @property {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType} [lifespan] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#lifespan} (emit only).
 * @property {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType|Phaser.Types.GameObjects.Particles.EmitterOpOnUpdateType} [maxVelocityX] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#maxVelocityX}.
 * @property {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType|Phaser.Types.GameObjects.Particles.EmitterOpOnUpdateType} [maxVelocityY] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#maxVelocityY}.
 * @property {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType|Phaser.Types.GameObjects.Particles.EmitterOpOnUpdateType} [moveToX] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#moveToX}. If set, overrides `angle` and `speed` properties.
 * @property {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType|Phaser.Types.GameObjects.Particles.EmitterOpOnUpdateType} [moveToY] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#moveToY}. If set, overrides `angle` and `speed` properties.
 * @property {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType} [quantity] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#quantity} (emit only).
 * @property {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType|Phaser.Types.GameObjects.Particles.EmitterOpOnUpdateType} [rotate] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#particleRotate}.
 * @property {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType|Phaser.Types.GameObjects.Particles.EmitterOpOnUpdateType} [scale] - As {@link Phaser.GameObjects.Particles.ParticleEmitter#setScale}.
 * @property {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType|Phaser.Types.GameObjects.Particles.EmitterOpOnUpdateType} [scaleX] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#particleScaleX}.
 * @property {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType|Phaser.Types.GameObjects.Particles.EmitterOpOnUpdateType} [scaleY] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#particleScaleY}.
 * @property {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType} [speed] - As {@link Phaser.GameObjects.Particles.ParticleEmitter#setSpeed} (emit only).
 * @property {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType} [speedX] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#speedX} (emit only).
 * @property {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType} [speedY] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#speedY} (emit only).
 * @property {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType|Phaser.Types.GameObjects.Particles.EmitterOpOnUpdateType} [tint] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#particleTint}.
 * @property {number[]} [color] - An array of color values that the Particles interpolate through during theif life. If set, overrides any `tint` property.
 * @property {string} [colorEase] - The string-based name of the Easing function to use if you have enabled Particle color interpolation via the `color` property, otherwise has no effect.
 * @property {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType} [x] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#particleX}.
 * @property {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType} [y] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#particleY}.
 * @property {Phaser.Types.GameObjects.Particles.ParticleEmitterEdgeZoneConfig|Phaser.Types.GameObjects.Particles.ParticleEmitterRandomZoneConfig} [emitZone] - As {@link Phaser.GameObjects.Particles.ParticleEmitter#setEmitZone}.
 * @property {Phaser.Types.GameObjects.Particles.ParticleEmitterDeathZoneConfig} [deathZone] - As {@link Phaser.GameObjects.Particles.ParticleEmitter#setDeathZone}.
 * @property {Phaser.Types.GameObjects.Particles.ParticleEmitterBounds|Phaser.Types.GameObjects.Particles.ParticleEmitterBoundsAlt} [bounds] - As {@link Phaser.GameObjects.Particles.ParticleEmitter#setBounds}.
 * @property {object} [followOffset] - Assigns to {@link Phaser.GameObjects.Particles.ParticleEmitter#followOffset}.
 * @property {number} [followOffset.x] - x coordinate of the offset.
 * @property {number} [followOffset.y] - y coordinate of the offset.
 * @property {number|number[]|string|string[]|Phaser.Textures.Frame|Phaser.Textures.Frame[]|Phaser.Types.GameObjects.Particles.ParticleEmitterFrameConfig} [frame] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#frames}.
 * @property {string|Phaser.Textures.Frame} [texture] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#texture}. Overrides any texture already set on the Emitter.
 * @property {number} [reserve] - Creates specified number of inactive particles and adds them to this emitter's pool. {@link Phaser.GameObjects.Particles.ParticleEmitter#reserve}
 * @property {number} [advance] - If you wish to 'fast forward' the emitter in time, set this value to a number representing the amount of ms the emitter should advance.
 * @property {number} [duration] - Limit the emitter to emit particles for a maximum of `duration` ms. Default to zero, meaning 'forever'.
 * @property {number} [stopAfter] - Limit the emitter to emit this exact number of particles and then stop. Default to zero, meaning no limit.
 * @property {Phaser.Types.GameObjects.Particles.ParticleSortCallback} [sortCallback] - A custom callback that sorts particles prior to rendering. Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#sortCallback}.
 * @property {boolean} [sortOrderAsc] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#sortOrderAsc}.
 * @property {string} [sortProperty] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#sortProperty}.
 * @property {boolean} [tintFill] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#tintFill}.
 */
