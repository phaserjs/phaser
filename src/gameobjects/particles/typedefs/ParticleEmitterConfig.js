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
 * @property {function} [deathCallback] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#deathCallback}.
 * @property {*} [deathCallbackScope] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#deathCallbackScope}.
 * @property {function} [emitCallback] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#emitCallback}.
 * @property {*} [emitCallbackScope] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#emitCallbackScope}.
 * @property {Phaser.GameObjects.GameObject} [follow] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#follow}.
 * @property {number} [frequency] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#frequency}.
 * @property {number} [gravityX] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#gravityX}.
 * @property {number} [gravityY] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#gravityY}.
 * @property {number} [maxParticles] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#maxParticles}.
 * @property {string} [name] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#name}.
 * @property {boolean} [on] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#on}.
 * @property {boolean} [particleBringToTop] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#particleBringToTop}.
 * @property {Phaser.GameObjects.Particles.Particle} [particleClass] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#particleClass}.
 * @property {boolean} [radial] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#radial}.
 * @property {number} [timeScale] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#timeScale}.
 * @property {boolean} [trackVisible] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#trackVisible}.
 * @property {boolean} [visible] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#visible}.
 * @property {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType} [accelerationX] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#accelerationX} (emit only).
 * @property {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType} [accelerationY] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#accelerationY} (emit only).
 * @property {(Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType|Phaser.Types.GameObjects.Particles.EmitterOpOnUpdateType)} [alpha] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#alpha}.
 * @property {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType} [angle] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#angle} (emit only).
 * @property {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType} [bounce] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#bounce} (emit only).
 * @property {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType} [delay] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#delay} (emit only).
 * @property {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType} [lifespan] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#lifespan} (emit only).
 * @property {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType} [maxVelocityX] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#maxVelocityX} (emit only).
 * @property {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType} [maxVelocityY] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#maxVelocityY} (emit only).
 * @property {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType} [moveToX] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#moveToX} (emit only).
 * @property {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType} [moveToY] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#moveToY} (emit only).
 * @property {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType} [quantity] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#quantity} (emit only).
 * @property {(Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType|Phaser.Types.GameObjects.Particles.EmitterOpOnUpdateType)} [rotate] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#rotate}.
 * @property {(Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType|Phaser.Types.GameObjects.Particles.EmitterOpOnUpdateType)} [scale] - As {@link Phaser.GameObjects.Particles.ParticleEmitter#setScale}.
 * @property {(Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType|Phaser.Types.GameObjects.Particles.EmitterOpOnUpdateType)} [scaleX] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#scaleX}.
 * @property {(Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType|Phaser.Types.GameObjects.Particles.EmitterOpOnUpdateType)} [scaleY] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#scaleY}.
 * @property {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType} [speed] - As {@link Phaser.GameObjects.Particles.ParticleEmitter#setSpeed} (emit only).
 * @property {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType} [speedX] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#speedX} (emit only).
 * @property {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType} [speedY] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#speedY} (emit only).
 * @property {(Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType|Phaser.Types.GameObjects.Particles.EmitterOpOnUpdateType)} [tint] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#tint}.
 * @property {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType} [x] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#x} (emit only).
 * @property {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType} [y] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#y} (emit only).
 * @property {Phaser.Types.GameObjects.Particles.ParticleEmitterEdgeZoneConfig | Phaser.Types.GameObjects.Particles.ParticleEmitterRandomZoneConfig} [emitZone] - As {@link Phaser.GameObjects.Particles.ParticleEmitter#setEmitZone}.
 * @property {Phaser.Types.GameObjects.Particles.ParticleEmitterDeathZoneConfig} [deathZone] - As {@link Phaser.GameObjects.Particles.ParticleEmitter#setDeathZone}.
 * @property {Phaser.Types.GameObjects.Particles.ParticleEmitterBounds|Phaser.Types.GameObjects.Particles.ParticleEmitterBoundsAlt} [bounds] - As {@link Phaser.GameObjects.Particles.ParticleEmitter#setBounds}.
 * @property {object} [followOffset] - Assigns to {@link Phaser.GameObjects.Particles.ParticleEmitter#followOffset}.
 * @property {number} [followOffset.x] - x-coordinate of the offset.
 * @property {number} [followOffset.y] - y-coordinate of the offset.
 * @property {number|number[]|string|string[]|Phaser.Textures.Frame|Phaser.Textures.Frame[]|Phaser.Types.GameObjects.Particles.ParticleEmitterFrameConfig} [frame] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#frames}.
 * @property {number} [reserve] - Creates specified number of inactive particles and adds them to this emitter's pool. {@link Phaser.GameObjects.Particles.ParticleEmitter#reserve}
 */
