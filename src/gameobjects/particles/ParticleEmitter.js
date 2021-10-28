/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var BlendModes = require('../../renderer/BlendModes');
var Class = require('../../utils/Class');
var Components = require('../components');
var DeathZone = require('./zones/DeathZone');
var EdgeZone = require('./zones/EdgeZone');
var EmitterOp = require('./EmitterOp');
var GetFastValue = require('../../utils/object/GetFastValue');
var GetRandom = require('../../utils/array/GetRandom');
var HasAny = require('../../utils/object/HasAny');
var HasValue = require('../../utils/object/HasValue');
var Particle = require('./Particle');
var RandomZone = require('./zones/RandomZone');
var Rectangle = require('../../geom/rectangle/Rectangle');
var StableSort = require('../../utils/array/StableSort');
var Vector2 = require('../../math/Vector2');
var Wrap = require('../../math/Wrap');

/**
 * @classdesc
 * A particle emitter represents a single particle stream.
 * It controls a pool of {@link Phaser.GameObjects.Particles.Particle Particles} and is controlled by a {@link Phaser.GameObjects.Particles.ParticleEmitterManager Particle Emitter Manager}.
 *
 * @class ParticleEmitter
 * @memberof Phaser.GameObjects.Particles
 * @constructor
 * @since 3.0.0
 *
 * @extends Phaser.GameObjects.Components.BlendMode
 * @extends Phaser.GameObjects.Components.Mask
 * @extends Phaser.GameObjects.Components.ScrollFactor
 * @extends Phaser.GameObjects.Components.Visible
 *
 * @param {Phaser.GameObjects.Particles.ParticleEmitterManager} manager - The Emitter Manager this Emitter belongs to.
 * @param {Phaser.Types.GameObjects.Particles.ParticleEmitterConfig} config - Settings for this emitter.
 */
var ParticleEmitter = new Class({

    Mixins: [
        Components.BlendMode,
        Components.Mask,
        Components.ScrollFactor,
        Components.Visible
    ],

    initialize:

    function ParticleEmitter (manager, config)
    {
        /**
         * The Emitter Manager this Emitter belongs to.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#manager
         * @type {Phaser.GameObjects.Particles.ParticleEmitterManager}
         * @since 3.0.0
         */
        this.manager = manager;

        /**
         * The texture assigned to particles.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#texture
         * @type {Phaser.Textures.Texture}
         * @since 3.0.0
         */
        this.texture = manager.texture;

        /**
         * The texture frames assigned to particles.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#frames
         * @type {Phaser.Textures.Frame[]}
         * @since 3.0.0
         */
        this.frames = [ manager.defaultFrame ];

        /**
         * The default texture frame assigned to particles.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#defaultFrame
         * @type {Phaser.Textures.Frame}
         * @since 3.0.0
         */
        this.defaultFrame = manager.defaultFrame;

        /**
         * Names of simple configuration properties.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#configFastMap
         * @type {object}
         * @since 3.0.0
         */
        this.configFastMap = [
            'active',
            'blendMode',
            'collideBottom',
            'collideLeft',
            'collideRight',
            'collideTop',
            'deathCallback',
            'deathCallbackScope',
            'emitCallback',
            'emitCallbackScope',
            'follow',
            'frequency',
            'gravityX',
            'gravityY',
            'maxParticles',
            'name',
            'on',
            'particleBringToTop',
            'particleClass',
            'radial',
            'timeScale',
            'trackVisible',
            'visible'
        ];

        /**
         * Names of complex configuration properties.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#configOpMap
         * @type {object}
         * @since 3.0.0
         */
        this.configOpMap = [
            'accelerationX',
            'accelerationY',
            'angle',
            'alpha',
            'bounce',
            'delay',
            'lifespan',
            'maxVelocityX',
            'maxVelocityY',
            'moveToX',
            'moveToY',
            'quantity',
            'rotate',
            'scaleX',
            'scaleY',
            'speedX',
            'speedY',
            'tint',
            'x',
            'y'
        ];

        /**
         * The name of this Particle Emitter.
         *
         * Empty by default and never populated by Phaser, this is left for developers to use.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#name
         * @type {string}
         * @default ''
         * @since 3.0.0
         */
        this.name = '';

        /**
         * The Particle Class which will be emitted by this Emitter.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#particleClass
         * @type {Phaser.GameObjects.Particles.Particle}
         * @default Phaser.GameObjects.Particles.Particle
         * @since 3.0.0
         */
        this.particleClass = Particle;

        /**
         * The x-coordinate of the particle origin (where particles will be emitted).
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#x
         * @type {Phaser.GameObjects.Particles.EmitterOp}
         * @default 0
         * @since 3.0.0
         * @see Phaser.GameObjects.Particles.ParticleEmitter#setPosition
         */
        this.x = new EmitterOp(config, 'x', 0, true);

        /**
         * The y-coordinate of the particle origin (where particles will be emitted).
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#y
         * @type {Phaser.GameObjects.Particles.EmitterOp}
         * @default 0
         * @since 3.0.0
         * @see Phaser.GameObjects.Particles.ParticleEmitter#setPosition
         */
        this.y = new EmitterOp(config, 'y', 0, true);

        /**
         * A radial emitter will emit particles in all directions between angle min and max,
         * using {@link Phaser.GameObjects.Particles.ParticleEmitter#speed} as the value. If set to false then this acts as a point Emitter.
         * A point emitter will emit particles only in the direction derived from the speedX and speedY values.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#radial
         * @type {boolean}
         * @default true
         * @since 3.0.0
         * @see Phaser.GameObjects.Particles.ParticleEmitter#setRadial
         */
        this.radial = true;

        /**
         * Horizontal acceleration applied to emitted particles, in pixels per second squared.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#gravityX
         * @type {number}
         * @default 0
         * @since 3.0.0
         * @see Phaser.GameObjects.Particles.ParticleEmitter#setGravity
         */
        this.gravityX = 0;

        /**
         * Vertical acceleration applied to emitted particles, in pixels per second squared.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#gravityY
         * @type {number}
         * @default 0
         * @since 3.0.0
         * @see Phaser.GameObjects.Particles.ParticleEmitter#setGravity
         */
        this.gravityY = 0;

        /**
         * Whether accelerationX and accelerationY are non-zero. Set automatically during configuration.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#acceleration
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.acceleration = false;

        /**
         * Horizontal acceleration applied to emitted particles, in pixels per second squared.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#accelerationX
         * @type {Phaser.GameObjects.Particles.EmitterOp}
         * @default 0
         * @since 3.0.0
         */
        this.accelerationX = new EmitterOp(config, 'accelerationX', 0, true);

        /**
         * Vertical acceleration applied to emitted particles, in pixels per second squared.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#accelerationY
         * @type {Phaser.GameObjects.Particles.EmitterOp}
         * @default 0
         * @since 3.0.0
         */
        this.accelerationY = new EmitterOp(config, 'accelerationY', 0, true);

        /**
         * The maximum horizontal velocity of emitted particles, in pixels per second squared.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#maxVelocityX
         * @type {Phaser.GameObjects.Particles.EmitterOp}
         * @default 10000
         * @since 3.0.0
         */
        this.maxVelocityX = new EmitterOp(config, 'maxVelocityX', 10000, true);

        /**
         * The maximum vertical velocity of emitted particles, in pixels per second squared.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#maxVelocityY
         * @type {Phaser.GameObjects.Particles.EmitterOp}
         * @default 10000
         * @since 3.0.0
         */
        this.maxVelocityY = new EmitterOp(config, 'maxVelocityY', 10000, true);

        /**
         * The initial horizontal speed of emitted particles, in pixels per second.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#speedX
         * @type {Phaser.GameObjects.Particles.EmitterOp}
         * @default 0
         * @since 3.0.0
         * @see Phaser.GameObjects.Particles.ParticleEmitter#setSpeedX
         */
        this.speedX = new EmitterOp(config, 'speedX', 0, true);

        /**
         * The initial vertical speed of emitted particles, in pixels per second.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#speedY
         * @type {Phaser.GameObjects.Particles.EmitterOp}
         * @default 0
         * @since 3.0.0
         * @see Phaser.GameObjects.Particles.ParticleEmitter#setSpeedY
         */
        this.speedY = new EmitterOp(config, 'speedY', 0, true);

        /**
         * Whether moveToX and moveToY are nonzero. Set automatically during configuration.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#moveTo
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.moveTo = false;

        /**
         * The x-coordinate emitted particles move toward, when {@link Phaser.GameObjects.Particles.ParticleEmitter#moveTo} is true.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#moveToX
         * @type {Phaser.GameObjects.Particles.EmitterOp}
         * @default 0
         * @since 3.0.0
         */
        this.moveToX = new EmitterOp(config, 'moveToX', 0, true);

        /**
         * The y-coordinate emitted particles move toward, when {@link Phaser.GameObjects.Particles.ParticleEmitter#moveTo} is true.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#moveToY
         * @type {Phaser.GameObjects.Particles.EmitterOp}
         * @default 0
         * @since 3.0.0
         */
        this.moveToY = new EmitterOp(config, 'moveToY', 0, true);

        /**
         * Whether particles will rebound when they meet the emitter bounds.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#bounce
         * @type {Phaser.GameObjects.Particles.EmitterOp}
         * @default 0
         * @since 3.0.0
         */
        this.bounce = new EmitterOp(config, 'bounce', 0, true);

        /**
         * The horizontal scale of emitted particles.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#scaleX
         * @type {Phaser.GameObjects.Particles.EmitterOp}
         * @default 1
         * @since 3.0.0
         * @see Phaser.GameObjects.Particles.ParticleEmitter#setScale
         * @see Phaser.GameObjects.Particles.ParticleEmitter#setScaleX
         */
        this.scaleX = new EmitterOp(config, 'scaleX', 1);

        /**
         * The vertical scale of emitted particles.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#scaleY
         * @type {Phaser.GameObjects.Particles.EmitterOp}
         * @default 1
         * @since 3.0.0
         * @see Phaser.GameObjects.Particles.ParticleEmitter#setScale
         * @see Phaser.GameObjects.Particles.ParticleEmitter#setScaleY
         */
        this.scaleY = new EmitterOp(config, 'scaleY', 1);

        /**
         * Color tint applied to emitted particles. Value must not include the alpha channel.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#tint
         * @type {Phaser.GameObjects.Particles.EmitterOp}
         * @default 0xffffff
         * @since 3.0.0
         */
        this.tint = new EmitterOp(config, 'tint', 0xffffff);

        /**
         * The alpha (transparency) of emitted particles.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#alpha
         * @type {Phaser.GameObjects.Particles.EmitterOp}
         * @default 1
         * @since 3.0.0
         * @see Phaser.GameObjects.Particles.ParticleEmitter#setAlpha
         */
        this.alpha = new EmitterOp(config, 'alpha', 1);

        /**
         * The lifespan of emitted particles, in ms.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#lifespan
         * @type {Phaser.GameObjects.Particles.EmitterOp}
         * @default 1000
         * @since 3.0.0
         * @see Phaser.GameObjects.Particles.ParticleEmitter#setLifespan
         */
        this.lifespan = new EmitterOp(config, 'lifespan', 1000, true);

        /**
         * The angle of the initial velocity of emitted particles, in degrees.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#angle
         * @type {Phaser.GameObjects.Particles.EmitterOp}
         * @default { min: 0, max: 360 }
         * @since 3.0.0
         * @see Phaser.GameObjects.Particles.ParticleEmitter#setAngle
         */
        this.angle = new EmitterOp(config, 'angle', { min: 0, max: 360 }, true);

        /**
         * The rotation of emitted particles, in degrees.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#rotate
         * @type {Phaser.GameObjects.Particles.EmitterOp}
         * @default 0
         * @since 3.0.0
         */
        this.rotate = new EmitterOp(config, 'rotate', 0);

        /**
         * A function to call when a particle is emitted.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#emitCallback
         * @type {?Phaser.Types.GameObjects.Particles.ParticleEmitterCallback}
         * @default null
         * @since 3.0.0
         */
        this.emitCallback = null;

        /**
         * The calling context for {@link Phaser.GameObjects.Particles.ParticleEmitter#emitCallback}.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#emitCallbackScope
         * @type {?*}
         * @default null
         * @since 3.0.0
         */
        this.emitCallbackScope = null;

        /**
         * A function to call when a particle dies.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#deathCallback
         * @type {?Phaser.Types.GameObjects.Particles.ParticleDeathCallback}
         * @default null
         * @since 3.0.0
         */
        this.deathCallback = null;

        /**
         * The calling context for {@link Phaser.GameObjects.Particles.ParticleEmitter#deathCallback}.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#deathCallbackScope
         * @type {?*}
         * @default null
         * @since 3.0.0
         */
        this.deathCallbackScope = null;

        /**
         * Set to hard limit the amount of particle objects this emitter is allowed to create.
         * 0 means unlimited.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#maxParticles
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.maxParticles = 0;

        /**
         * How many particles are emitted each time particles are emitted (one explosion or one flow cycle).
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#quantity
         * @type {Phaser.GameObjects.Particles.EmitterOp}
         * @default 1
         * @since 3.0.0
         * @see Phaser.GameObjects.Particles.ParticleEmitter#setFrequency
         * @see Phaser.GameObjects.Particles.ParticleEmitter#setQuantity
         */
        this.quantity = new EmitterOp(config, 'quantity', 1, true);

        /**
         * How many ms to wait after emission before the particles start updating.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#delay
         * @type {Phaser.GameObjects.Particles.EmitterOp}
         * @default 0
         * @since 3.0.0
         */
        this.delay = new EmitterOp(config, 'delay', 0, true);

        /**
         * For a flow emitter, the time interval (>= 0) between particle flow cycles in ms.
         * A value of 0 means there is one particle flow cycle for each logic update (the maximum flow frequency). This is the default setting.
         * For an exploding emitter, this value will be -1.
         * Calling {@link Phaser.GameObjects.Particles.ParticleEmitter#flow} also puts the emitter in flow mode (frequency >= 0).
         * Calling {@link Phaser.GameObjects.Particles.ParticleEmitter#explode} also puts the emitter in explode mode (frequency = -1).
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#frequency
         * @type {number}
         * @default 0
         * @since 3.0.0
         * @see Phaser.GameObjects.Particles.ParticleEmitter#setFrequency
         */
        this.frequency = 0;

        /**
         * Controls if the emitter is currently emitting a particle flow (when frequency >= 0).
         * Already alive particles will continue to update until they expire.
         * Controlled by {@link Phaser.GameObjects.Particles.ParticleEmitter#start} and {@link Phaser.GameObjects.Particles.ParticleEmitter#stop}.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#on
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.on = true;

        /**
         * Newly emitted particles are added to the top of the particle list, i.e. rendered above those already alive.
         * Set to false to send them to the back.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#particleBringToTop
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.particleBringToTop = true;

        /**
         * The time rate applied to active particles, affecting lifespan, movement, and tweens. Values larger than 1 are faster than normal.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#timeScale
         * @type {number}
         * @default 1
         * @since 3.0.0
         */
        this.timeScale = 1;

        /**
         * An object describing a shape to emit particles from.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#emitZone
         * @type {?Phaser.GameObjects.Particles.Zones.EdgeZone|Phaser.GameObjects.Particles.Zones.RandomZone}
         * @default null
         * @since 3.0.0
         * @see Phaser.GameObjects.Particles.ParticleEmitter#setEmitZone
         */
        this.emitZone = null;

        /**
         * An object describing a shape that deactivates particles when they interact with it.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#deathZone
         * @type {?Phaser.GameObjects.Particles.Zones.DeathZone}
         * @default null
         * @since 3.0.0
         * @see Phaser.GameObjects.Particles.ParticleEmitter#setDeathZone
         */
        this.deathZone = null;

        /**
         * A rectangular boundary constraining particle movement.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#bounds
         * @type {?Phaser.Geom.Rectangle}
         * @default null
         * @since 3.0.0
         * @see Phaser.GameObjects.Particles.ParticleEmitter#setBounds
         */
        this.bounds = null;

        /**
         * Whether particles interact with the left edge of the emitter {@link Phaser.GameObjects.Particles.ParticleEmitter#bounds}.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#collideLeft
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.collideLeft = true;

        /**
         * Whether particles interact with the right edge of the emitter {@link Phaser.GameObjects.Particles.ParticleEmitter#bounds}.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#collideRight
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.collideRight = true;

        /**
         * Whether particles interact with the top edge of the emitter {@link Phaser.GameObjects.Particles.ParticleEmitter#bounds}.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#collideTop
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.collideTop = true;

        /**
         * Whether particles interact with the bottom edge of the emitter {@link Phaser.GameObjects.Particles.ParticleEmitter#bounds}.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#collideBottom
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.collideBottom = true;

        /**
         * Whether this emitter updates itself and its particles.
         *
         * Controlled by {@link Phaser.GameObjects.Particles.ParticleEmitter#pause}
         * and {@link Phaser.GameObjects.Particles.ParticleEmitter#resume}.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#active
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.active = true;

        /**
         * Set this to false to hide any active particles.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#visible
         * @type {boolean}
         * @default true
         * @since 3.0.0
         * @see Phaser.GameObjects.Particles.ParticleEmitter#setVisible
         */
        this.visible = true;

        /**
         * The blend mode of this emitter's particles.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#blendMode
         * @type {number}
         * @since 3.0.0
         * @see Phaser.GameObjects.Particles.ParticleEmitter#setBlendMode
         */
        this.blendMode = BlendModes.NORMAL;

        /**
         * A Game Object whose position is used as the particle origin.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#follow
         * @type {?Phaser.GameObjects.GameObject}
         * @default null
         * @since 3.0.0
         * @see Phaser.GameObjects.Particles.ParticleEmitter#startFollow
         * @see Phaser.GameObjects.Particles.ParticleEmitter#stopFollow
         */
        this.follow = null;

        /**
         * The offset of the particle origin from the {@link Phaser.GameObjects.Particles.ParticleEmitter#follow} target.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#followOffset
         * @type {Phaser.Math.Vector2}
         * @since 3.0.0
         * @see Phaser.GameObjects.Particles.ParticleEmitter#startFollow
         */
        this.followOffset = new Vector2();

        /**
         * Whether the emitter's {@link Phaser.GameObjects.Particles.ParticleEmitter#visible} state will track
         * the {@link Phaser.GameObjects.Particles.ParticleEmitter#follow} target's visibility state.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#trackVisible
         * @type {boolean}
         * @default false
         * @since 3.0.0
         * @see Phaser.GameObjects.Particles.ParticleEmitter#startFollow
         */
        this.trackVisible = false;

        /**
         * The current texture frame, as an index of {@link Phaser.GameObjects.Particles.ParticleEmitter#frames}.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#currentFrame
         * @type {number}
         * @default 0
         * @since 3.0.0
         * @see Phaser.GameObjects.Particles.ParticleEmitter#setFrame
         */
        this.currentFrame = 0;

        /**
         * Whether texture {@link Phaser.GameObjects.Particles.ParticleEmitter#frames} are selected at random.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#randomFrame
         * @type {boolean}
         * @default true
         * @since 3.0.0
         * @see Phaser.GameObjects.Particles.ParticleEmitter#setFrame
         */
        this.randomFrame = true;

        /**
         * The number of consecutive particles that receive a single texture frame (per frame cycle).
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#frameQuantity
         * @type {number}
         * @default 1
         * @since 3.0.0
         * @see Phaser.GameObjects.Particles.ParticleEmitter#setFrame
         */
        this.frameQuantity = 1;

        /**
         * Inactive particles.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#dead
         * @type {Phaser.GameObjects.Particles.Particle[]}
         * @private
         * @since 3.0.0
         */
        this.dead = [];

        /**
         * Active particles
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#alive
         * @type {Phaser.GameObjects.Particles.Particle[]}
         * @private
         * @since 3.0.0
         */
        this.alive = [];

        /**
         * The time until the next flow cycle.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#_counter
         * @type {number}
         * @private
         * @default 0
         * @since 3.0.0
         */
        this._counter = 0;

        /**
         * Counts up to {@link Phaser.GameObjects.Particles.ParticleEmitter#frameQuantity}.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#_frameCounter
         * @type {number}
         * @private
         * @default 0
         * @since 3.0.0
         */
        this._frameCounter = 0;

        if (config)
        {
            this.fromJSON(config);
        }
    },

    /**
     * Merges configuration settings into the emitter's current settings.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#fromJSON
     * @since 3.0.0
     *
     * @param {Phaser.Types.GameObjects.Particles.ParticleEmitterConfig} config - Settings for this emitter.
     *
     * @return {this} This Particle Emitter.
     */
    fromJSON: function (config)
    {
        if (!config)
        {
            return this;
        }

        //  Only update properties from their current state if they exist in the given config

        var i = 0;
        var key = '';

        for (i = 0; i < this.configFastMap.length; i++)
        {
            key = this.configFastMap[i];

            if (HasValue(config, key))
            {
                this[key] = GetFastValue(config, key);
            }
        }

        for (i = 0; i < this.configOpMap.length; i++)
        {
            key = this.configOpMap[i];

            if (HasValue(config, key))
            {
                this[key].loadConfig(config);
            }
        }

        this.acceleration = (this.accelerationX.propertyValue !== 0 || this.accelerationY.propertyValue !== 0);

        this.moveTo = (this.moveToX.propertyValue !== 0 || this.moveToY.propertyValue !== 0);

        //  Special 'speed' override

        if (HasValue(config, 'speed'))
        {
            this.speedX.loadConfig(config, 'speed');
            this.speedY = null;
        }

        //  If you specify speedX, speedY or moveTo then it changes the emitter from radial to a point emitter
        if (HasAny(config, [ 'speedX', 'speedY' ]) || this.moveTo)
        {
            this.radial = false;
        }

        //  Special 'scale' override

        if (HasValue(config, 'scale'))
        {
            this.scaleX.loadConfig(config, 'scale');
            this.scaleY.loadConfig(config, 'scale');
        }

        if (HasValue(config, 'callbackScope'))
        {
            var callbackScope = GetFastValue(config, 'callbackScope', null);

            this.emitCallbackScope = callbackScope;
            this.deathCallbackScope = callbackScope;
        }

        if (HasValue(config, 'emitZone'))
        {
            this.setEmitZone(config.emitZone);
        }

        if (HasValue(config, 'deathZone'))
        {
            this.setDeathZone(config.deathZone);
        }

        if (HasValue(config, 'bounds'))
        {
            this.setBounds(config.bounds);
        }

        if (HasValue(config, 'followOffset'))
        {
            this.followOffset.setFromObject(GetFastValue(config, 'followOffset', 0));
        }

        if (HasValue(config, 'frame'))
        {
            this.setFrame(config.frame);
        }

        if (HasValue(config, 'reserve'))
        {
            this.reserve(config.reserve);
        }

        return this;
    },

    /**
     * Creates a description of this emitter suitable for JSON serialization.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#toJSON
     * @since 3.0.0
     *
     * @param {object} [output] - An object to copy output into.
     *
     * @return {object} - The output object.
     */
    toJSON: function (output)
    {
        if (output === undefined) { output = {}; }

        var i = 0;
        var key = '';

        for (i = 0; i < this.configFastMap.length; i++)
        {
            key = this.configFastMap[i];

            output[key] = this[key];
        }

        for (i = 0; i < this.configOpMap.length; i++)
        {
            key = this.configOpMap[i];

            if (this[key])
            {
                output[key] = this[key].toJSON();
            }
        }

        //  special handlers
        if (!this.speedY)
        {
            delete output.speedX;
            output.speed = this.speedX.toJSON();
        }

        if (this.scaleX === this.scaleY)
        {
            delete output.scaleX;
            delete output.scaleY;
            output.scale = this.scaleX.toJSON();
        }

        return output;
    },

    /**
     * Continuously moves the particle origin to follow a Game Object's position.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#startFollow
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject} target - The Game Object to follow.
     * @param {number} [offsetX=0] - Horizontal offset of the particle origin from the Game Object.
     * @param {number} [offsetY=0] - Vertical offset of the particle origin from the Game Object.
     * @param {boolean} [trackVisible=false] - Whether the emitter's visible state will track the target's visible state.
     *
     * @return {this} This Particle Emitter.
     */
    startFollow: function (target, offsetX, offsetY, trackVisible)
    {
        if (offsetX === undefined) { offsetX = 0; }
        if (offsetY === undefined) { offsetY = 0; }
        if (trackVisible === undefined) { trackVisible = false; }

        this.follow = target;
        this.followOffset.set(offsetX, offsetY);
        this.trackVisible = trackVisible;

        return this;
    },

    /**
     * Stops following a Game Object.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#stopFollow
     * @since 3.0.0
     *
     * @return {this} This Particle Emitter.
     */
    stopFollow: function ()
    {
        this.follow = null;
        this.followOffset.set(0, 0);
        this.trackVisible = false;

        return this;
    },

    /**
     * Chooses a texture frame from {@link Phaser.GameObjects.Particles.ParticleEmitter#frames}.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#getFrame
     * @since 3.0.0
     *
     * @return {Phaser.Textures.Frame} The texture frame.
     */
    getFrame: function ()
    {
        if (this.frames.length === 1)
        {
            return this.defaultFrame;
        }
        else if (this.randomFrame)
        {
            return GetRandom(this.frames);
        }
        else
        {
            var frame = this.frames[this.currentFrame];

            this._frameCounter++;

            if (this._frameCounter === this.frameQuantity)
            {
                this._frameCounter = 0;
                this.currentFrame = Wrap(this.currentFrame + 1, 0, this._frameLength);
            }

            return frame;
        }
    },

    // frame: 0
    // frame: 'red'
    // frame: [ 0, 1, 2, 3 ]
    // frame: [ 'red', 'green', 'blue', 'pink', 'white' ]
    // frame: { frames: [ 'red', 'green', 'blue', 'pink', 'white' ], [cycle: bool], [quantity: int] }

    /**
     * Sets a pattern for assigning texture frames to emitted particles.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#setFrame
     * @since 3.0.0
     *
     * @param {(array|string|number|Phaser.Types.GameObjects.Particles.ParticleEmitterFrameConfig)} frames - One or more texture frames, or a configuration object.
     * @param {boolean} [pickRandom=true] - Whether frames should be assigned at random from `frames`.
     * @param {number} [quantity=1] - The number of consecutive particles that will receive each frame.
     *
     * @return {this} This Particle Emitter.
     */
    setFrame: function (frames, pickRandom, quantity)
    {
        if (pickRandom === undefined) { pickRandom = true; }
        if (quantity === undefined) { quantity = 1; }

        this.randomFrame = pickRandom;
        this.frameQuantity = quantity;
        this.currentFrame = 0;
        this._frameCounter = 0;

        var t = typeof (frames);

        if (Array.isArray(frames) || t === 'string' || t === 'number')
        {
            this.manager.setEmitterFrames(frames, this);
        }
        else if (t === 'object')
        {
            var frameConfig = frames;

            frames = GetFastValue(frameConfig, 'frames', null);

            if (frames)
            {
                this.manager.setEmitterFrames(frames, this);
            }

            var isCycle = GetFastValue(frameConfig, 'cycle', false);

            this.randomFrame = (isCycle) ? false : true;

            this.frameQuantity = GetFastValue(frameConfig, 'quantity', quantity);
        }

        this._frameLength = this.frames.length;

        if (this._frameLength === 1)
        {
            this.frameQuantity = 1;
            this.randomFrame = false;
        }

        return this;
    },

    /**
     * Turns {@link Phaser.GameObjects.Particles.ParticleEmitter#radial} particle movement on or off.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#setRadial
     * @since 3.0.0
     *
     * @param {boolean} [value=true] - Radial mode (true) or point mode (true).
     *
     * @return {this} This Particle Emitter.
     */
    setRadial: function (value)
    {
        if (value === undefined) { value = true; }

        this.radial = value;

        return this;
    },

    /**
     * Sets the position of the emitter's particle origin.
     * New particles will be emitted here.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#setPosition
     * @since 3.0.0
     *
     * @param {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType} x - The x-coordinate of the particle origin.
     * @param {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType} y - The y-coordinate of the particle origin.
     *
     * @return {this} This Particle Emitter.
     */
    setPosition: function (x, y)
    {
        this.x.onChange(x);
        this.y.onChange(y);

        return this;
    },

    /**
     * Sets or modifies a rectangular boundary constraining the particles.
     *
     * To remove the boundary, set {@link Phaser.GameObjects.Particles.ParticleEmitter#bounds} to null.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#setBounds
     * @since 3.0.0
     *
     * @param {(number|Phaser.Types.GameObjects.Particles.ParticleEmitterBounds|Phaser.Types.GameObjects.Particles.ParticleEmitterBoundsAlt)} x - The x-coordinate of the left edge of the boundary, or an object representing a rectangle.
     * @param {number} y - The y-coordinate of the top edge of the boundary.
     * @param {number} width - The width of the boundary.
     * @param {number} height - The height of the boundary.
     *
     * @return {this} This Particle Emitter.
     */
    setBounds: function (x, y, width, height)
    {
        if (typeof x === 'object')
        {
            var obj = x;

            x = obj.x;
            y = obj.y;
            width = (HasValue(obj, 'w')) ? obj.w : obj.width;
            height = (HasValue(obj, 'h')) ? obj.h : obj.height;
        }

        if (this.bounds)
        {
            this.bounds.setTo(x, y, width, height);
        }
        else
        {
            this.bounds = new Rectangle(x, y, width, height);
        }

        return this;
    },

    /**
     * Sets the initial horizontal speed of emitted particles.
     * Changes the emitter to point mode.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#setSpeedX
     * @since 3.0.0
     *
     * @param {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType} value - The speed, in pixels per second.
     *
     * @return {this} This Particle Emitter.
     */
    setSpeedX: function (value)
    {
        this.speedX.onChange(value);

        //  If you specify speedX and Y then it changes the emitter from radial to a point emitter
        this.radial = false;

        return this;
    },

    /**
     * Sets the initial vertical speed of emitted particles.
     * Changes the emitter to point mode.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#setSpeedY
     * @since 3.0.0
     *
     * @param {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType} value - The speed, in pixels per second.
     *
     * @return {this} This Particle Emitter.
     */
    setSpeedY: function (value)
    {
        if (this.speedY)
        {
            this.speedY.onChange(value);

            //  If you specify speedX and Y then it changes the emitter from radial to a point emitter
            this.radial = false;
        }

        return this;
    },

    /**
     * Sets the initial radial speed of emitted particles.
     * Changes the emitter to radial mode.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#setSpeed
     * @since 3.0.0
     *
     * @param {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType} value - The speed, in pixels per second.
     *
     * @return {this} This Particle Emitter.
     */
    setSpeed: function (value)
    {
        this.speedX.onChange(value);
        this.speedY = null;

        //  If you specify speedX and Y then it changes the emitter from radial to a point emitter
        this.radial = true;

        return this;
    },

    /**
     * Sets the horizontal scale of emitted particles.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#setScaleX
     * @since 3.0.0
     *
     * @param {(Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType|Phaser.Types.GameObjects.Particles.EmitterOpOnUpdateType)} value - The scale, relative to 1.
     *
     * @return {this} This Particle Emitter.
     */
    setScaleX: function (value)
    {
        this.scaleX.onChange(value);

        return this;
    },

    /**
     * Sets the vertical scale of emitted particles.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#setScaleY
     * @since 3.0.0
     *
     * @param {(Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType|Phaser.Types.GameObjects.Particles.EmitterOpOnUpdateType)} value - The scale, relative to 1.
     *
     * @return {this} This Particle Emitter.
     */
    setScaleY: function (value)
    {
        this.scaleY.onChange(value);

        return this;
    },

    /**
     * Sets the scale of emitted particles. This updates both the scaleX and scaleY values.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#setScale
     * @since 3.0.0
     *
     * @param {(Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType|Phaser.Types.GameObjects.Particles.EmitterOpOnUpdateType)} value - The scale, relative to 1.
     *
     * @return {this} This Particle Emitter.
     */
    setScale: function (value)
    {
        this.scaleX.onChange(value);
        this.scaleY.onChange(value);

        return this;
    },

    /**
     * Sets the horizontal gravity applied to emitted particles.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#setGravityX
     * @since 3.0.0
     *
     * @param {number} value - Acceleration due to gravity, in pixels per second squared.
     *
     * @return {this} This Particle Emitter.
     */
    setGravityX: function (value)
    {
        this.gravityX = value;

        return this;
    },

    /**
     * Sets the vertical gravity applied to emitted particles.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#setGravityY
     * @since 3.0.0
     *
     * @param {number} value - Acceleration due to gravity, in pixels per second squared.
     *
     * @return {this} This Particle Emitter.
     */
    setGravityY: function (value)
    {
        this.gravityY = value;

        return this;
    },

    /**
     * Sets the gravity applied to emitted particles.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#setGravity
     * @since 3.0.0
     *
     * @param {number} x - Horizontal acceleration due to gravity, in pixels per second squared.
     * @param {number} y - Vertical acceleration due to gravity, in pixels per second squared.
     *
     * @return {this} This Particle Emitter.
     */
    setGravity: function (x, y)
    {
        this.gravityX = x;
        this.gravityY = y;

        return this;
    },

    /**
     * Sets the opacity of emitted particles.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#setAlpha
     * @since 3.0.0
     *
     * @param {(Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType|Phaser.Types.GameObjects.Particles.EmitterOpOnUpdateType)} value - A value between 0 (transparent) and 1 (opaque).
     *
     * @return {this} This Particle Emitter.
     */
    setAlpha: function (value)
    {
        this.alpha.onChange(value);

        return this;
    },

    /**
     * Sets the color tint of emitted particles.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#setTint
     * @since 3.22.0
     *
     * @param {(Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType|Phaser.Types.GameObjects.Particles.EmitterOpOnUpdateType)} value - A value between 0 and 0xffffff.
     *
     * @return {this} This Particle Emitter.
     */
    setTint: function (value)
    {
        this.tint.onChange(value);

        return this;
    },

    /**
     * Sets the angle of a {@link Phaser.GameObjects.Particles.ParticleEmitter#radial} particle stream.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#setEmitterAngle
     * @since 3.0.0
     *
     * @param {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType} value - The angle of the initial velocity of emitted particles.
     *
     * @return {this} This Particle Emitter.
     */
    setEmitterAngle: function (value)
    {
        this.angle.onChange(value);

        return this;
    },

    /**
     * Sets the angle of a {@link Phaser.GameObjects.Particles.ParticleEmitter#radial} particle stream.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#setAngle
     * @since 3.0.0
     *
     * @param {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType} value - The angle of the initial velocity of emitted particles.
     *
     * @return {this} This Particle Emitter.
     */
    setAngle: function (value)
    {
        this.angle.onChange(value);

        return this;
    },

    /**
     * Sets the lifespan of newly emitted particles.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#setLifespan
     * @since 3.0.0
     *
     * @param {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType} value - The particle lifespan, in ms.
     *
     * @return {this} This Particle Emitter.
     */
    setLifespan: function (value)
    {
        this.lifespan.onChange(value);

        return this;
    },

    /**
     * Sets the number of particles released at each flow cycle or explosion.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#setQuantity
     * @since 3.0.0
     *
     * @param {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType} quantity - The number of particles to release at each flow cycle or explosion.
     *
     * @return {this} This Particle Emitter.
     */
    setQuantity: function (quantity)
    {
        this.quantity.onChange(quantity);

        return this;
    },

    /**
     * Sets the emitter's {@link Phaser.GameObjects.Particles.ParticleEmitter#frequency}
     * and {@link Phaser.GameObjects.Particles.ParticleEmitter#quantity}.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#setFrequency
     * @since 3.0.0
     *
     * @param {number} frequency - The time interval (>= 0) of each flow cycle, in ms; or -1 to put the emitter in explosion mode.
     * @param {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType} [quantity] - The number of particles to release at each flow cycle or explosion.
     *
     * @return {this} This Particle Emitter.
     */
    setFrequency: function (frequency, quantity)
    {
        this.frequency = frequency;

        this._counter = 0;

        if (quantity)
        {
            this.quantity.onChange(quantity);
        }

        return this;
    },

    /**
     * Sets or removes the {@link Phaser.GameObjects.Particles.ParticleEmitter#emitZone}.
     *
     * An {@link Phaser.Types.GameObjects.Particles.ParticleEmitterEdgeZoneConfig EdgeZone} places particles on its edges. Its {@link Phaser.Types.GameObjects.Particles.EdgeZoneSource source} can be a Curve, Path, Circle, Ellipse, Line, Polygon, Rectangle, or Triangle; or any object with a suitable {@link Phaser.Types.GameObjects.Particles.EdgeZoneSourceCallback getPoints} method.
     *
     * A {@link Phaser.Types.GameObjects.Particles.ParticleEmitterRandomZoneConfig RandomZone} places randomly within its interior. Its {@link RandomZoneSource source} can be a Circle, Ellipse, Line, Polygon, Rectangle, or Triangle; or any object with a suitable {@link Phaser.Types.GameObjects.Particles.RandomZoneSourceCallback getRandomPoint} method.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#setEmitZone
     * @since 3.0.0
     *
     * @param {Phaser.Types.GameObjects.Particles.ParticleEmitterEdgeZoneConfig|Phaser.Types.GameObjects.Particles.ParticleEmitterRandomZoneConfig} [zoneConfig] - An object describing the zone, or `undefined` to remove any current emit zone.
     *
     * @return {this} This Particle Emitter.
     */
    setEmitZone: function (zoneConfig)
    {
        if (zoneConfig === undefined)
        {
            this.emitZone = null;
        }
        else
        {
            //  Where source = Geom like Circle, or a Path or Curve
            //  emitZone: { type: 'random', source: X }
            //  emitZone: { type: 'edge', source: X, quantity: 32, [stepRate=0], [yoyo=false], [seamless=true] }

            var type = GetFastValue(zoneConfig, 'type', 'random');
            var source = GetFastValue(zoneConfig, 'source', null);

            switch (type)
            {
                case 'random':

                    this.emitZone = new RandomZone(source);

                    break;

                case 'edge':

                    var quantity = GetFastValue(zoneConfig, 'quantity', 1);
                    var stepRate = GetFastValue(zoneConfig, 'stepRate', 0);
                    var yoyo = GetFastValue(zoneConfig, 'yoyo', false);
                    var seamless = GetFastValue(zoneConfig, 'seamless', true);

                    this.emitZone = new EdgeZone(source, quantity, stepRate, yoyo, seamless);

                    break;
            }
        }

        return this;
    },

    /**
     * Sets or removes the {@link Phaser.GameObjects.Particles.ParticleEmitter#deathZone}.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#setDeathZone
     * @since 3.0.0
     *
     * @param {Phaser.Types.GameObjects.Particles.ParticleEmitterDeathZoneConfig} [zoneConfig] - An object describing the zone, or `undefined` to remove any current death zone.
     *
     * @return {this} This Particle Emitter.
     */
    setDeathZone: function (zoneConfig)
    {
        if (zoneConfig === undefined)
        {
            this.deathZone = null;
        }
        else
        {
            //  Where source = Geom like Circle or Rect that supports a 'contains' function
            //  deathZone: { type: 'onEnter', source: X }
            //  deathZone: { type: 'onLeave', source: X }

            var type = GetFastValue(zoneConfig, 'type', 'onEnter');
            var source = GetFastValue(zoneConfig, 'source', null);

            if (source && typeof source.contains === 'function')
            {
                var killOnEnter = (type === 'onEnter') ? true : false;

                this.deathZone = new DeathZone(source, killOnEnter);
            }
        }

        return this;
    },

    /**
     * Creates inactive particles and adds them to this emitter's pool.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#reserve
     * @since 3.0.0
     *
     * @param {number} particleCount - The number of particles to create.
     *
     * @return {this} This Particle Emitter.
     */
    reserve: function (particleCount)
    {
        var dead = this.dead;

        for (var i = 0; i < particleCount; i++)
        {
            dead.push(new this.particleClass(this));
        }

        return this;
    },

    /**
     * Gets the number of active (in-use) particles in this emitter.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#getAliveParticleCount
     * @since 3.0.0
     *
     * @return {number} The number of particles with `active=true`.
     */
    getAliveParticleCount: function ()
    {
        return this.alive.length;
    },

    /**
     * Gets the number of inactive (available) particles in this emitter.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#getDeadParticleCount
     * @since 3.0.0
     *
     * @return {number} The number of particles with `active=false`.
     */
    getDeadParticleCount: function ()
    {
        return this.dead.length;
    },

    /**
     * Gets the total number of particles in this emitter.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#getParticleCount
     * @since 3.0.0
     *
     * @return {number} The number of particles, including both alive and dead.
     */
    getParticleCount: function ()
    {
        return this.getAliveParticleCount() + this.getDeadParticleCount();
    },

    /**
     * Whether this emitter is at its limit (if set).
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#atLimit
     * @since 3.0.0
     *
     * @return {boolean} Returns `true` if this Emitter is at its limit, or `false` if no limit, or below the `maxParticles` level.
     */
    atLimit: function ()
    {
        return (this.maxParticles > 0 && this.getParticleCount() === this.maxParticles);
    },

    /**
     * Sets a function to call for each newly emitted particle.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#onParticleEmit
     * @since 3.0.0
     *
     * @param {Phaser.Types.GameObjects.Particles.ParticleEmitterCallback} callback - The function.
     * @param {*} [context] - The calling context.
     *
     * @return {this} This Particle Emitter.
     */
    onParticleEmit: function (callback, context)
    {
        if (callback === undefined)
        {
            //  Clear any previously set callback
            this.emitCallback = null;
            this.emitCallbackScope = null;
        }
        else if (typeof callback === 'function')
        {
            this.emitCallback = callback;

            if (context)
            {
                this.emitCallbackScope = context;
            }
        }

        return this;
    },

    /**
     * Sets a function to call for each particle death.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#onParticleDeath
     * @since 3.0.0
     *
     * @param {Phaser.Types.GameObjects.Particles.ParticleDeathCallback} callback - The function.
     * @param {*} [context] - The function's calling context.
     *
     * @return {this} This Particle Emitter.
     */
    onParticleDeath: function (callback, context)
    {
        if (callback === undefined)
        {
            //  Clear any previously set callback
            this.deathCallback = null;
            this.deathCallbackScope = null;
        }
        else if (typeof callback === 'function')
        {
            this.deathCallback = callback;

            if (context)
            {
                this.deathCallbackScope = context;
            }
        }

        return this;
    },

    /**
     * Deactivates every particle in this emitter.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#killAll
     * @since 3.0.0
     *
     * @return {this} This Particle Emitter.
     */
    killAll: function ()
    {
        var dead = this.dead;
        var alive = this.alive;

        while (alive.length > 0)
        {
            dead.push(alive.pop());
        }

        return this;
    },

    /**
     * Calls a function for each active particle in this emitter.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#forEachAlive
     * @since 3.0.0
     *
     * @param {Phaser.Types.GameObjects.Particles.ParticleEmitterCallback} callback - The function.
     * @param {*} context - The function's calling context.
     *
     * @return {this} This Particle Emitter.
     */
    forEachAlive: function (callback, context)
    {
        var alive = this.alive;
        var length = alive.length;

        for (var index = 0; index < length; ++index)
        {
            //  Sends the Particle and the Emitter
            callback.call(context, alive[index], this);
        }

        return this;
    },

    /**
     * Calls a function for each inactive particle in this emitter.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#forEachDead
     * @since 3.0.0
     *
     * @param {Phaser.Types.GameObjects.Particles.ParticleEmitterCallback} callback - The function.
     * @param {*} context - The function's calling context.
     *
     * @return {this} This Particle Emitter.
     */
    forEachDead: function (callback, context)
    {
        var dead = this.dead;
        var length = dead.length;

        for (var index = 0; index < length; ++index)
        {
            //  Sends the Particle and the Emitter
            callback.call(context, dead[index], this);
        }

        return this;
    },

    /**
     * Turns {@link Phaser.GameObjects.Particles.ParticleEmitter#on} the emitter and resets the flow counter.
     *
     * If this emitter is in flow mode (frequency >= 0; the default), the particle flow will start (or restart).
     *
     * If this emitter is in explode mode (frequency = -1), nothing will happen.
     * Use {@link Phaser.GameObjects.Particles.ParticleEmitter#explode} or {@link Phaser.GameObjects.Particles.ParticleEmitter#flow} instead.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#start
     * @since 3.0.0
     *
     * @return {this} This Particle Emitter.
     */
    start: function ()
    {
        this.on = true;

        this._counter = 0;

        return this;
    },

    /**
     * Turns {@link Phaser.GameObjects.Particles.ParticleEmitter#on off} the emitter.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#stop
     * @since 3.11.0
     *
     * @return {this} This Particle Emitter.
     */
    stop: function ()
    {
        this.on = false;

        return this;
    },

    /**
     * {@link Phaser.GameObjects.Particles.ParticleEmitter#active Deactivates} the emitter.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#pause
     * @since 3.0.0
     *
     * @return {this} This Particle Emitter.
     */
    pause: function ()
    {
        this.active = false;

        return this;
    },

    /**
     * {@link Phaser.GameObjects.Particles.ParticleEmitter#active Activates} the emitter.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#resume
     * @since 3.0.0
     *
     * @return {this} This Particle Emitter.
     */
    resume: function ()
    {
        this.active = true;

        return this;
    },

    /**
     * Removes the emitter from its manager and the scene.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#remove
     * @since 3.22.0
     *
     * @return {this} This Particle Emitter.
     */
    remove: function ()
    {
        this.manager.removeEmitter(this);

        return this;
    },

    /**
     * Sorts active particles with {@link Phaser.GameObjects.Particles.ParticleEmitter#depthSortCallback}.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#depthSort
     * @since 3.0.0
     *
     * @return {this} This Particle Emitter.
     */
    depthSort: function ()
    {
        StableSort(this.alive, this.depthSortCallback);

        return this;
    },

    /**
     * Puts the emitter in flow mode (frequency >= 0) and starts (or restarts) a particle flow.
     *
     * To resume a flow at the current frequency and quantity, use {@link Phaser.GameObjects.Particles.ParticleEmitter#start} instead.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#flow
     * @since 3.0.0
     *
     * @param {number} frequency - The time interval (>= 0) of each flow cycle, in ms.
     * @param {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType} [count=1] - The number of particles to emit at each flow cycle.
     *
     * @return {this} This Particle Emitter.
     */
    flow: function (frequency, count)
    {
        if (count === undefined) { count = 1; }

        this.frequency = frequency;

        this.quantity.onChange(count);

        return this.start();
    },

    /**
     * Puts the emitter in explode mode (frequency = -1), stopping any current particle flow, and emits several particles all at once.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#explode
     * @since 3.0.0
     *
     * @param {number} count - The amount of Particles to emit.
     * @param {number} x - The x coordinate to emit the Particles from.
     * @param {number} y - The y coordinate to emit the Particles from.
     *
     * @return {Phaser.GameObjects.Particles.Particle} The most recently emitted Particle.
     */
    explode: function (count, x, y)
    {
        this.frequency = -1;

        return this.emitParticle(count, x, y);
    },

    /**
     * Emits particles at a given position (or the emitter's current position).
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#emitParticleAt
     * @since 3.0.0
     *
     * @param {number} [x=this.x] - The x coordinate to emit the Particles from.
     * @param {number} [y=this.x] - The y coordinate to emit the Particles from.
     * @param {number} [count=this.quantity] - The number of Particles to emit.
     *
     * @return {Phaser.GameObjects.Particles.Particle} The most recently emitted Particle.
     */
    emitParticleAt: function (x, y, count)
    {
        return this.emitParticle(count, x, y);
    },

    /**
     * Emits particles at a given position (or the emitter's current position).
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#emitParticle
     * @since 3.0.0
     *
     * @param {number} [count=this.quantity] - The number of Particles to emit.
     * @param {number} [x=this.x] - The x coordinate to emit the Particles from.
     * @param {number} [y=this.x] - The y coordinate to emit the Particles from.
     *
     * @return {Phaser.GameObjects.Particles.Particle} The most recently emitted Particle.
     *
     * @see Phaser.GameObjects.Particles.Particle#fire
     */
    emitParticle: function (count, x, y)
    {
        if (this.atLimit())
        {
            return;
        }

        if (count === undefined)
        {
            count = this.quantity.onEmit();
        }

        var dead = this.dead;

        var followX = (this.follow) ? this.follow.x + this.followOffset.x : x;
        var followY = (this.follow) ? this.follow.y + this.followOffset.y : y;

        for (var i = 0; i < count; i++)
        {
            var particle = dead.pop();

            if (!particle)
            {
                particle = new this.particleClass(this);
            }

            particle.fire(followX, followY);

            if (this.particleBringToTop)
            {
                this.alive.push(particle);
            }
            else
            {
                this.alive.unshift(particle);
            }

            if (this.emitCallback)
            {
                this.emitCallback.call(this.emitCallbackScope, particle, this);
            }

            if (this.atLimit())
            {
                break;
            }
        }

        return particle;
    },

    /**
     * Updates this emitter and its particles.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#preUpdate
     * @since 3.0.0
     *
     * @param {number} time - The current timestamp as generated by the Request Animation Frame or SetTimeout.
     * @param {number} delta - The delta time, in ms, elapsed since the last frame.
     */
    preUpdate: function (time, delta)
    {
        //  Scale the delta
        delta *= this.timeScale;

        var step = (delta / 1000);

        if (this.trackVisible)
        {
            this.visible = this.follow.visible;
        }

        //  Any particle processors?
        var processors = this.manager.getProcessors();

        var particles = this.alive;
        var dead = this.dead;

        var i = 0;
        var rip = [];
        var length = particles.length;

        for (i = 0; i < length; i++)
        {
            var particle = particles[i];

            //  update returns `true` if the particle is now dead (lifeCurrent <= 0)
            if (particle.update(delta, step, processors))
            {
                rip.push({ index: i, particle: particle });
            }
        }

        //  Move dead particles to the dead array
        length = rip.length;

        if (length > 0)
        {
            var deathCallback = this.deathCallback;
            var deathCallbackScope = this.deathCallbackScope;

            for (i = length - 1; i >= 0; i--)
            {
                var entry = rip[i];

                //  Remove from particles array
                particles.splice(entry.index, 1);

                //  Add to dead array
                dead.push(entry.particle);

                //  Callback
                if (deathCallback)
                {
                    deathCallback.call(deathCallbackScope, entry.particle);
                }

                entry.particle.resetPosition();
            }
        }

        if (!this.on)
        {
            return;
        }

        if (this.frequency === 0)
        {
            this.emitParticle();
        }
        else if (this.frequency > 0)
        {
            this._counter -= delta;

            if (this._counter <= 0)
            {
                this.emitParticle();

                //  counter = frequency - remained from previous delta
                this._counter = (this.frequency - Math.abs(this._counter));
            }
        }
    },

    /**
     * Calculates the difference of two particles, for sorting them by depth.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#depthSortCallback
     * @since 3.0.0
     *
     * @param {object} a - The first particle.
     * @param {object} b - The second particle.
     *
     * @return {number} The difference of a and b's y coordinates.
     */
    depthSortCallback: function (a, b)
    {
        return a.y - b.y;
    }

});

module.exports = ParticleEmitter;
