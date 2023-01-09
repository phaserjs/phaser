/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Add = require('../../utils/array/Add');
var Class = require('../../utils/Class');
var Components = require('../components');
var CopyFrom = require('../../geom/rectangle/CopyFrom');
var DeathZone = require('./zones/DeathZone');
var EdgeZone = require('./zones/EdgeZone');
var EmitterOp = require('./EmitterOp');
var Events = require('./events');
var GameObject = require('../GameObject');
var GetFastValue = require('../../utils/object/GetFastValue');
var GetRandom = require('../../utils/array/GetRandom');
var HasAny = require('../../utils/object/HasAny');
var HasValue = require('../../utils/object/HasValue');
var Inflate = require('../../geom/rectangle/Inflate');
var MergeRect = require('../../geom/rectangle/MergeRect');
var Particle2 = require('./Particle2');
var RandomZone = require('./zones/RandomZone');
var Rectangle = require('../../geom/rectangle/Rectangle');
var RectangleToRectangle = require('../../geom/intersects/RectangleToRectangle');
var Render = require('./ParticleEmitterRender');
var Remove = require('../../utils/array/Remove');
var StableSort = require('../../utils/array/StableSort');
var TransformMatrix = require('../components/TransformMatrix');
var Vector2 = require('../../math/Vector2');
var Wrap = require('../../math/Wrap');
var List = require('../../structs/List');

/**
 * Names of simple configuration properties.
 *
 * @ignore
 */
var configFastMap = [
    'active',
    'advance',
    'blendMode',
    'collideBottom',
    'collideLeft',
    'collideRight',
    'collideTop',
    'deathCallback',
    'deathCallbackScope',
    'duration',
    'emitCallback',
    'emitCallbackScope',
    'follow',
    'frequency',
    'gravityX',
    'gravityY',
    'maxAliveParticles',
    'maxParticles',
    'name',
    'emitting',
    'particleBringToTop',
    'particleClass',
    'radial',
    'sortCallback',
    'sortOrderAsc',
    'sortProperty',
    'stopAfter',
    'timeScale',
    'trackVisible',
    'visible'
];

/**
 * Names of complex configuration properties.
 *
 * @ignore
 */
var configOpMap = [
    'accelerationX',
    'accelerationY',
    'alpha',
    'angle',
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
 * @classdesc
 * A particle emitter represents a single particle stream.
 * It controls a pool of {@link Phaser.GameObjects.Particles.Particle Particles} and is controlled by a {@link Phaser.GameObjects.Particles.ParticleEmitterManager Particle Emitter Manager}.
 *
 * Lots of emitter properties can be specified in a variety of formats, giving you lots
 * of control over the values they return. Here are the different variations:
 *
 * ## An explicit static value:
 *
 * ```js
 * x: 400
 * ```
 *
 * The x value will always be 400 when the particle is spawned.
 *
 * ## A random value:
 *
 * ```js
 * x: [ 100, 200, 300, 400 ]
 * ```
 *
 * The x value will be one of the 4 elements in the given array, picked at random on emission.
 *
 * ## A custom callback:
 *
 * ```js
 * x: (particle, key, t, value) => {
 *   return value + 50;
 * }
 * ```
 *
 * The x value is the result of calling this function. This is only used when the
 * particle is emitted, so it provides it's initial starting value. It is not used
 * when the particle is updated (see the onUpdate callback for that)
 *
 * ## A start / end object:
 *
 * This allows you to control the change in value between the given start and
 * end parameters over the course of the particles lifetime:
 *
 * ```js
 * scale: { start: 0, end: 1 }
 * ```
 *
 * The particle scale will start at 0 when emitted and ease to a scale of 1
 * over the course of its lifetime. You can also specify the ease function
 * used for this change (the default is Linear):
 *
 * ```js
 * scale: { start: 0, end: 1, ease: 'bounce.out' }
 * ```
 *
 * ## A start / end random object:
 *
 * The start and end object can have an optional `random` parameter.
 * This forces it to pick a random value between the two values and use
 * this as the starting value, then easing to the 'end' parameter over
 * its lifetime.
 *
 * ```js
 * scale: { start: 4, end: 0.5, random: true }
 * ```
 *
 * The particle will start with a random scale between 0.5 and 4 and then
 * scale to the end value over its lifetime. You can combine the above
 * with the `ease` parameter as well to control the value easing.
 *
 * ## An interpolation object:
 *
 * You can provide an array of values which will be used for interpolation
 * during the particles lifetime. You can also define the interpolation
 * function to be used. There are three provided: `linear` (the default),
 * `bezier` and `catmull`, or you can provide your own function.
 *
 * ```js
 * x: { values: [ 50, 500, 200, 800 ], interpolation: 'catmull' }
 * ```
 *
 * The particle scale will interpolate from 50 when emitted to 800 via the other
 * points over the course of its lifetime. You can also specify an ease function
 * used to control the rate of change through the values (the default is Linear):
 *
 * ```js
 * x: { values: [ 50, 500, 200, 800 ], interpolation: 'catmull', ease: 'bounce.out }
 * ```
 *
 * ## A stepped emitter object:
 *
 * The `steps` parameter allows you to control the placement of sequential
 * particles across the start-end range:
 *
 * ```js
 * x: { steps: 32, start: 0, end: 576 }
 * ```
 *
 * Here we have a range of 576 (start to end). This is divided into 32 steps.
 *
 * The first particle will emit at the x position of 0. The next will emit
 * at the next 'step' along, which would be 18. The following particle will emit
 * at the next step, which is 36, and so on. Because the range of 576 has been
 * divided by 32, creating 18 pixels steps. When a particle reaches the 'end'
 * value the next one will start from the beginning again.
 *
 * ## A stepped emitter object with yoyo:
 *
 * You can add the optional `yoyo` property to a stepped object:
 *
 * ```js
 * x: { steps: 32, start: 0, end: 576, yoyo: true }
 * ```
 *
 * As with the stepped emitter, particles are emitted in sequence, from 'start'
 * to 'end' in step sized jumps. Normally, when a stepped emitter reaches the
 * end it snaps around to the start value again. However, if you provide the 'yoyo'
 * parameter then when it reaches the end it will reverse direction and start
 * emitting back down to 'start' again. Depending on the effect you require this
 * can often look better.
 *
 * ## A min / max object:
 *
 * This allows you to pick a random float value between the min and max properties:
 *
 * ```js
 * x: { min: 100, max: 700 }
 * ```
 *
 * The x value will be a random float between min and max.
 *
 * You can force it select an integer by setting the 'int' flag:
 *
 * ```js
 * x: { min: 100, max: 700, int: true }
 * ```
 *
 * Or, you could use the 'random' array approach (see below)
 *
 * ## A random object:
 *
 * This allows you to pick a random integer value between the first and second array elements:
 *
 * ```js
 * x: { random: [ 100, 700 ] }
 * ```
 *
 * The x value will be a random integer between 100 and 700 as it takes the first
 * element in the 'random' array as the 'min' value and the 2nd element as the 'max' value.
 *
 * ## Custom onEmit and onUpdate callbacks:
 *
 * If the above won't give you the effect you're after, you can provide your own
 * callbacks that will be used when the particle is both emitted and updated:
 *
 * ```js
 * x: {
 *   onEmit: (particle, key, t, value) => {
 *     return value;
 *   },
 *   onUpdate: (particle, key, t, value) => {
 *     return value;
 *   }
 * }
 * ```
 *
 * You can provide either one or both functions. The `onEmit` is called at the
 * start of the particles life and defines the value of the property on birth.
 *
 * The `onUpdate` function is called every time the Particle Emitter updates
 * until the particle dies. Both must return a value.
 *
 * The properties are:
 *
 * particle - A reference to the Particle instance.
 * key - The string based key of the property, i.e. 'x' or 'lifespan'.
 * t - The current normalized lifetime of the particle, between 0 (birth) and 1 (death).
 * value - The current property value. At a minimum you should return this.
 *
 * By using the above configuration options you have an unlimited about of
 * control over how your particles behave.
 *
 * @class ParticleEmitter
 * @extends Phaser.GameObjects.GameObject
 * @memberof Phaser.GameObjects.Particles
 * @constructor
 * @since 3.60.0
 *
 * @extends Phaser.GameObjects.Components.AlphaSingle
 * @extends Phaser.GameObjects.Components.BlendMode
 * @extends Phaser.GameObjects.Components.Depth
 * @extends Phaser.GameObjects.Components.FX
 * @extends Phaser.GameObjects.Components.Mask
 * @extends Phaser.GameObjects.Components.Pipeline
 * @extends Phaser.GameObjects.Components.ScrollFactor
 * @extends Phaser.GameObjects.Components.Texture
 * @extends Phaser.GameObjects.Components.Transform
 * @extends Phaser.GameObjects.Components.Visible
 *
 * @param {Phaser.Types.GameObjects.Particles.ParticleEmitterConfig} config - Settings for this emitter.
 */
var ParticleEmitter2 = new Class({

    Extends: GameObject,

    Mixins: [
        Components.AlphaSingle,
        Components.BlendMode,
        Components.Depth,
        Components.FX,
        Components.Mask,
        Components.Pipeline,
        Components.ScrollFactor,
        Components.Texture,
        Components.Transform,
        Components.Visible,
        Render
    ],

    initialize:

    function ParticleEmitter2 (scene, texture, config)
    {
        GameObject.call(this, scene, 'ParticleEmitter');

        /**
         * The Particle Class which will be emitted by this Emitter.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#particleClass
         * @type {function}
         * @default Phaser.GameObjects.Particles.Particle
         * @since 3.0.0
         * @see Phaser.Types.GameObjects.Particles.ParticleClassConstructor
         */
        this.particleClass = Particle2;

        /**
         * An internal object holding all of the EmitterOp instances.
         *
         * These are populated as part of the Emitter configuration parsing.
         *
         * You typically do not access them directly, but instead use the
         * provided getters and setters on this class, such as `ParticleEmitter.speedX` etc.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#ops
         * @type {Phaser.Types.GameObjects.Particles.ParticleEmitterOps}
         * @since 3.60.0
         */
        this.ops = {
            x: new EmitterOp('x', 0),
            y: new EmitterOp('y', 0),
            accelerationX: new EmitterOp('accelerationX', 0),
            accelerationY: new EmitterOp('accelerationY', 0),
            maxVelocityX: new EmitterOp('maxVelocityX', 10000),
            maxVelocityY: new EmitterOp('maxVelocityY', 10000),
            speedX: new EmitterOp('speedX', 0, true),
            speedY: new EmitterOp('speedY', 0, true),
            moveToX: new EmitterOp('moveToX', 0),
            moveToY: new EmitterOp('moveToY', 0),
            bounce: new EmitterOp('bounce', 0),
            scaleX: new EmitterOp('scaleX', 1),
            scaleY: new EmitterOp('scaleY', 1),
            tint: new EmitterOp('tint', 0xffffff),
            alpha: new EmitterOp('alpha', 1),
            lifespan: new EmitterOp('lifespan', 1000, true),
            angle: new EmitterOp('angle', { min: 0, max: 360 }, true),
            rotate: new EmitterOp('rotate', 0),
            quantity: new EmitterOp('quantity', 1, true),
            delay: new EmitterOp('delay', 0, true)
        };

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
         * Whether moveToX and moveToY are set. Set automatically during configuration.
         *
         * When true the particles move toward the moveToX and moveToY coordinates and arrive at the end of their life.
         * Emitter angle, speedX, and speedY are ignored.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#moveTo
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.moveTo = false;

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
         * Set to hard limit the amount of particle objects this emitter is allowed to create
         * in total. This is the number of `Particle` instances it can create, not the number
         * of 'alive' particles.
         *
         * 0 means unlimited.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#maxParticles
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.maxParticles = 0;

        /**
         * The maximum number of alive and rendering particles this emitter will update.
         * When this limit is reached, a particle needs to die before another can be emitted.
         *
         * 0 means no limits.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#maxAliveParticles
         * @type {number}
         * @default 0
         * @since 3.60.0
         */
        this.maxAliveParticles = 0;

        /**
         * If set, either via the Emitter config, or by directly setting this property,
         * the Particle Emitter will stop emitting particles once this total has been
         * reached. It will then enter a 'stopped' state, firing the `STOP`
         * event. Note that entering a stopped state doesn't mean all the particles
         * have finished, just that it's not emitting any further ones.
         *
         * To know when the final particle expires, listen for the COMPLETE event.
         *
         * Use this if you wish to launch an exact number of particles and then stop
         * your emitter afterwards.
         *
         * The counter is reset each time the `ParticleEmitter.start` method is called.
         *
         * 0 means the emitter will not stop based on total emitted particles.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#stopAfter
         * @type {number}
         * @default 0
         * @since 3.60.0
         */
        this.stopAfter = 0;

        /**
         * The number of milliseconds this emitter will emit particles for when in flow mode,
         * before it stops emission. A value of 0 (the default) means there is no duration.
         *
         * When the duration expires the `STOP` event is emitted. Note that entering a
         * stopped state doesn't mean all the particles have finished, just that it's
         * not emitting any further ones.
         *
         * To know when the final particle expires, listen for the COMPLETE event.
         *
         * The counter is reset each time the `ParticleEmitter.start` method is called.
         *
         * 0 means the emitter will not stop based on duration.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#duration
         * @type {number}
         * @default 0
         * @since 3.60.0
         */
        this.duration = 0;

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
        this.emitting = true;

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
         * An array containing Particle Emission Zones. These can be either EdgeZones or RandomZones.
         *
         * Particles are emitted from a randomly selected zone from this array.
         *
         * Prior to Phaser v3.60 an Emitter could only have one single Emission Zone.
         * In 3.60 they can now have an array of Emission Zones.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#emitZones
         * @type {Phaser.GameObjects.Particles.Zones.EdgeZone[]|Phaser.GameObjects.Particles.Zones.RandomZone[]}
         * @since 3.60.0
         * @see Phaser.GameObjects.Particles.ParticleEmitter#setEmitZone
         */
        this.emitZones = [];

        /**
         * An array containing Particle Death Zone objects. A particle is immediately killed as soon as its x/y coordinates
         * intersect with any of the configured Death Zones.
         *
         * Prior to Phaser v3.60 an Emitter could only have one single Death Zone.
         * In 3.60 they can now have an array of Death Zones.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#deathZones
         * @type {Phaser.GameObjects.Particles.Zones.DeathZone[]}
         * @since 3.60.0
         * @see Phaser.GameObjects.Particles.ParticleEmitter#setDeathZone
         */
        this.deathZones = [];

        /**
         * An optional Rectangle object that is used during rendering to cull Particles from
         * display. For example, if your particles are limited to only move within a 300x300
         * sized area from their origin, then you can set this Rectangle to those dimensions.
         *
         * The renderer will check to see if the `viewBounds` Rectangle intersects with the
         * Camera bounds during the render step and if not it will skip rendering the Emitter
         * entirely.
         *
         * This allows you to create many emitters in a Scene without the cost of
         * rendering if the contents aren't visible.
         *
         * Note that the Emitter will not perform any checks to see if the Particles themselves
         * are outside of these bounds, or not. It will simply check the bounds against the
         * camera. Use the `getBounds` method with the `advance` parameter to help define
         * the location and placement of the view bounds.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#viewBounds
         * @type {?Phaser.Geom.Rectangle}
         * @default null
         * @since 3.60.0
         * @see Phaser.GameObjects.Particles.ParticleEmitter#setViewBounds
         */
        this.viewBounds = null;

        /**
         * A rectangular boundary constraining particle movement. Use the Emitter properties `collideLeft`,
         * `collideRight`, `collideTop` and `collideBottom` to control if a particle will rebound off
         * the sides of this boundary, or not. This happens when the particles x/y coordinate hits
         * the boundary.
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
         * The animations assigned to particles.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#anims
         * @type {string[]}
         * @since 3.60.0
         */
        this.anims = [];

        /**
         * The default animation assigned to particles.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#defaultAnim
         * @type {string}
         * @since 3.60.0
         */
        this.defaultAnim = null;

        /**
         * The current animation, as an index of {@link Phaser.GameObjects.Particles.ParticleEmitter#anims}.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#currentAnim
         * @type {number}
         * @default 0
         * @since 3.60.0
         * @see Phaser.GameObjects.Particles.ParticleEmitter#setAnim
         */
        this.currentAnim = 0;

        /**
         * Whether animations {@link Phaser.GameObjects.Particles.ParticleEmitter#anims} are selected at random.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#randomAnim
         * @type {boolean}
         * @default true
         * @since 3.60.0
         * @see Phaser.GameObjects.Particles.ParticleEmitter#setAnim
         */
        this.randomAnim = true;

        /**
         * The number of consecutive particles that receive a single animation (per frame cycle).
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#animQuantity
         * @type {number}
         * @default 1
         * @since 3.60.0
         * @see Phaser.GameObjects.Particles.ParticleEmitter#setAnim
         */
        this.animQuantity = 1;

        /**
         * An array containing all currently inactive Particle instances.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#dead
         * @type {Phaser.GameObjects.Particles.Particle[]}
         * @private
         * @since 3.0.0
         */
        this.dead = [];

        /**
         * An array containing all currently live and rendering Particle instances.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#alive
         * @type {Phaser.GameObjects.Particles.Particle[]}
         * @private
         * @since 3.0.0
         */
        this.alive = [];

        /**
         * Internal array that holds counter data:
         *
         * 0 - _counter - The time until next flow cycle.
         * 1 - _frameCounter - Counts up to {@link Phaser.GameObjects.Particles.ParticleEmitter#frameQuantity}.
         * 2 - _animCounter (counts up to animQuantity)
         * 3 - _elapsed - The time remaining until the `duration` limit is reached.
         * 4 - _stopCounter - The number of particles remaining until `stopAfter` limit is reached.
         * 5 - _completeFlag - Has the COMPLETE event been emitted?
         * 6 - _emitIndex - The emit zone index counter.
         * 7 - _zoneTotal - The emit zone total counter.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#counters
         * @type {Float32Array}
         * @private
         * @since 3.60.0
         */
        this.counters = new Float32Array(8);

        /**
         * Cached amount of frames in the `ParticleEmitter.frames` array.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#_frameLength
         * @type {number}
         * @private
         * @default 0
         * @since 3.0.0
         */
        this._frameLength = 0;

        /**
         * Cached amount of animations in the `ParticleEmitter.anims` array.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#_animLength
         * @type {number}
         * @private
         * @default 0
         * @since 3.60.0
         */
        this._animLength = 0;

        /**
         * An internal property used to tell when the emitter is in fast-forwarc mode.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#skipping
         * @type {boolean}
         * @default true
         * @since 3.60.0
         */
        this.skipping = false;

        /**
         * An internal Transform Matrix used for bounds calculations.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#tempMatrix1
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @since 3.60.0
         */
        this.tempMatrix1 = new TransformMatrix();

        /**
         * An internal Transform Matrix used for bounds calculations.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#tempMatrix2
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @since 3.60.0
         */
        this.tempMatrix2 = new TransformMatrix();

        /**
         * Optionally sort the particles before they render based on this
         * property. The property must exist on the `Particle` class, such
         * as `y`, `lifeT`, `scaleX`, etc.
         *
         * When set this overrides the `particleBringToTop` setting.
         *
         * To reset this and disable sorting, so this property to an empty string.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#sortProperty
         * @type {string}
         * @since 3.60.0
         */
        this.sortProperty = '';

        /**
         * When `sortProperty` is defined this controls the sorting order,
         * either ascending or descending. Toggle to control the visual effect.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#sortOrderAsc
         * @type {boolean}
         * @since 3.60.0
         */
        this.sortOrderAsc = true;

        /**
         * The callback used to sort the particles. Only used if `sortProperty`
         * has been set. Set this via the `setSortCallback` method.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#sortCallback
         * @type {?Phaser.Types.GameObjects.Particles.ParticleSortCallback}
         * @since 3.60.0
         */
        this.sortCallback = this.depthSortCallback;

        /**
         * A list of Particle Processors being managed by this Emitter Manager.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitterManager#processors
         * @type {Phaser.Structs.List.<Phaser.GameObjects.Particles.ParticleProcessor>}
         * @since 3.0.0
         */
        this.processors = new List(this);

        this.setTexture(texture);

        this.initPipeline();

        this.fromJSON(config);
    },

    //  Overrides Game Object method
    addedToScene: function ()
    {
        this.scene.sys.updateList.add(this);
    },

    //  Overrides Game Object method
    removedFromScene: function ()
    {
        this.scene.sys.updateList.remove(this);
    },

    /**
     * Gets all active Particle Processors.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitterManager#getProcessors
     * @since 3.0.0
     *
     * @return {Phaser.GameObjects.Particles.ParticleProcessor[]} - An array of active Particle Processors.
     */
    getProcessors: function ()
    {
        return this.processors.getAll('active', true);
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

        for (i = 0; i < configFastMap.length; i++)
        {
            key = configFastMap[i];

            if (HasValue(config, key))
            {
                this[key] = GetFastValue(config, key);
            }
        }

        var ops = this.ops;

        for (i = 0; i < configOpMap.length; i++)
        {
            key = configOpMap[i];

            ops[key].loadConfig(config);
        }

        this.acceleration = (this.accelerationX !== 0 || this.accelerationY !== 0);

        this.moveTo = (this.moveToX !== 0 && this.moveToY !== 0);

        //  Special 'speed' override

        if (HasValue(config, 'speed'))
        {
            ops.speedX.loadConfig(config, 'speed');
            ops.speedY.active = false;
        }

        //  If you specify speedX, speedY or moveTo then it changes the emitter from radial to a point emitter
        if (HasAny(config, [ 'speedX', 'speedY' ]) || this.moveTo)
        {
            this.radial = false;
        }

        //  Special 'scale' override

        if (HasValue(config, 'scale'))
        {
            ops.scaleX.loadConfig(config, 'scale');
            ops.scaleY.active = false;
        }

        if (HasValue(config, 'callbackScope'))
        {
            var callbackScope = GetFastValue(config, 'callbackScope', null);

            this.emitCallbackScope = callbackScope;
            this.deathCallbackScope = callbackScope;
        }

        if (HasValue(config, 'emitZone'))
        {
            this.addEmitZone(config.emitZone);
        }

        if (HasValue(config, 'deathZone'))
        {
            this.addDeathZone(config.deathZone);
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
        else if (HasValue(config, 'anim'))
        {
            this.setAnim(config.anim);
        }

        if (HasValue(config, 'reserve'))
        {
            this.reserve(config.reserve);
        }

        if (HasValue(config, 'advance'))
        {
            this.fastForward(config.advance);
        }

        this.resetCounters(this.frequency, this.emitting);

        if (this.emitting)
        {
            this.emit(Events.START, this);
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

        for (i = 0; i < configFastMap.length; i++)
        {
            key = configFastMap[i];

            output[key] = this[key];
        }

        var ops = this.ops;

        for (i = 0; i < configOpMap.length; i++)
        {
            key = configOpMap[i];

            if (ops[key])
            {
                output[key] = ops[key].toJSON();
            }
        }

        //  special handlers
        if (!ops.speedY.active)
        {
            delete output.speedX;
            output.speed = ops.speedX.toJSON();
        }

        if (this.scaleX === this.scaleY)
        {
            delete output.scaleX;
            delete output.scaleY;
            output.scale = ops.scaleX.toJSON();
        }

        return output;
    },

    /**
     * Resets the internal counter trackers.
     *
     * You shouldn't ever need to call this directly.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#resetCounters
     * @since 3.60.0
     *
     * @param {number} frequency - The frequency counter.
     * @param {boolean} on - Set the complete flag.
     */
    resetCounters: function (frequency, on)
    {
        var counters = this.counters;

        counters.fill(0);

        counters[0] = frequency;

        if (on)
        {
            counters[5] = 1;
        }
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
        return this.frame;

        /*
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

            this.frameCounter++;

            if (this.frameCounter >= this.frameQuantity)
            {
                this.frameCounter = 0;
                this.currentFrame = Wrap(this.currentFrame + 1, 0, this._frameLength);
            }

            return frame;
        }
        */
    },

    /**
     * Sets a pattern for assigning texture frames to emitted particles. The `frames` configuration can be any of:
     *
     * frame: 0
     * frame: 'red'
     * frame: [ 0, 1, 2, 3 ]
     * frame: [ 'red', 'green', 'blue', 'pink', 'white' ]
     * frame: { frames: [ 'red', 'green', 'blue', 'pink', 'white' ], [cycle: bool], [quantity: int] }
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#setFrame
     * @since 3.0.0
     *
     * @param {(array|string|number|Phaser.Types.GameObjects.Particles.ParticleEmitterFrameConfig)} frames - One or more texture frames, or a configuration object.
     * @param {boolean} [pickRandom=true] - Whether frames should be assigned at random from `frames`.
     * @param {number} [quantity=1] - The number of consecutive particles that will receive each frame.
     *
     * @return {this} This Particle Emitter.
    setFrame: function (frames, pickRandom, quantity)
    {
        if (pickRandom === undefined) { pickRandom = true; }
        if (quantity === undefined) { quantity = 1; }

        this.randomFrame = pickRandom;
        this.frameQuantity = quantity;
        this.currentFrame = 0;

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
     */

    /**
     * Chooses an animation from {@link Phaser.GameObjects.Particles.ParticleEmitter#anims}, if populated.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#getAnim
     * @since 3.60.0
     *
     * @return {string} The animation to play, or `null` if there aren't any.
     */
    getAnim: function ()
    {
        var anims = this.anims;

        if (anims.length === 0)
        {
            return null;
        }
        else if (anims.length === 1)
        {
            return this.defaultAnim;
        }
        else if (this.randomAnim)
        {
            return GetRandom(anims);
        }
        else
        {
            var anim = anims[this.currentAnim];

            this.animCounter++;

            if (this.animCounter >= this.animQuantity)
            {
                this.animCounter = 0;
                this.currentAnim = Wrap(this.currentAnim + 1, 0, this._animLength);
            }

            return anim;
        }
    },

    /**
     * Sets a pattern for assigning animations to emitted particles. The `anims` configuration can be any of:
     *
     * anim: 'red'
     * anim: [ 'red', 'green', 'blue', 'pink', 'white' ]
     * anim: { anims: [ 'red', 'green', 'blue', 'pink', 'white' ], [cycle: bool], [quantity: int] }
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#setAnim
     * @since 3.60.0
     *
     * @param {(array|string|Phaser.Types.GameObjects.Particles.ParticleEmitterFrameConfig)} anims - One or more animations, or a configuration object.
     * @param {boolean} [pickRandom=true] - Whether animations should be assigned at random from `anims`.
     * @param {number} [quantity=1] - The number of consecutive particles that will receive each animation.
     *
     * @return {this} This Particle Emitter.
     */
    setAnim: function (anims, pickRandom, quantity)
    {
        if (pickRandom === undefined) { pickRandom = true; }
        if (quantity === undefined) { quantity = 1; }

        this.randomAnim = pickRandom;
        this.animQuantity = quantity;
        this.currentAnim = 0;

        var t = typeof (anims);

        if (Array.isArray(anims) || t === 'string')
        {
            this.manager.setEmitterAnims(anims, this);
        }
        else if (t === 'object')
        {
            var animConfig = anims;

            anims = GetFastValue(animConfig, 'anims', null);

            if (anims)
            {
                this.manager.setEmitterAnims(anims, this);
            }

            var isCycle = GetFastValue(animConfig, 'cycle', false);

            this.randomAnim = (isCycle) ? false : true;

            this.animQuantity = GetFastValue(animConfig, 'quantity', quantity);
        }

        this._animLength = this.anims.length;

        if (this._animLength === 1)
        {
            this.animQuantity = 1;
            this.randomAnim = false;
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
        this.ops.speedX.onChange(value);

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
        this.ops.speedY.onChange(value);

        //  If you specify speedX and Y then it changes the emitter from radial to a point emitter
        this.radial = false;

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
        this.ops.speedX.onChange(value);
        this.ops.speedY.active = false;

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
        this.ops.scaleX.onChange(value);

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
        this.ops.scaleY.onChange(value);

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
        this.ops.alpha.onChange(value);

        return this;
    },

    /**
     * Sets the color tint of emitted particles.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#setTint
     * @since 3.22.0
     * @webglOnly
     *
     * @param {(Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType|Phaser.Types.GameObjects.Particles.EmitterOpOnUpdateType)} value - A value between 0 and 0xffffff.
     *
     * @return {this} This Particle Emitter.
     */
    setTint: function (value)
    {
        this.ops.tint.onChange(value);

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
        this.ops.angle.onChange(value);

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
        this.quantity = quantity;

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

        this.flowCounter = (frequency > 0) ? frequency : 0;

        if (quantity)
        {
            this.quantity = quantity;
        }

        return this;
    },

    /**
     * Adds a new Particle Death Zone to this Particle Emitter.
     *
     * This method is an alias for `ParticleEmitter#addDeathZone` and is retained for
     * backward API compatibility only. Please note that calling this method multiple
     * times will add multiple death zones to this Emitter.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#setDeathZone
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Particles.Zones.DeathZone|Phaser.Types.GameObjects.Particles.ParticleEmitterDeathZoneConfig} zone - A Death Zone configuration object, or a Death Zone instance.
     *
     * @return {this} This Particle Emitter.
     */
    setDeathZone: function (zoneConfig)
    {
        this.addDeathZone(zoneConfig);

        return this;
    },

    /**
     * Adds a new Particle Death Zone to this Emitter.
     *
     * A particle is immediately killed as soon as its x/y coordinates intersect
     * with any of the configured Death Zones.
     *
     * The `source` can be a Geometry Shape, such as a Circle, Rectangle or Triangle.
     * Any valid object from the `Phaser.Geometry` namespace is allowed, as long as
     * it supports a `contains` function. You can set the `type` to be either `onEnter`
     * or `onLeave`.
     *
     * A Death Zone can only exist once within this Emitter.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#addDeathZone
     * @since 3.60.0
     *
     * @param {Phaser.Types.GameObjects.Particles.DeathZoneObject|Phaser.Types.GameObjects.Particles.DeathZoneObject[]} config - A Death Zone configuration object, a Death Zone instance, a valid Geometry object or an array of them.
     *
     * @return {Phaser.GameObjects.Particles.Zones.DeathZone} The Death Zone that was added to this Emitter.
     */
    addDeathZone: function (config)
    {
        if (!Array.isArray(config))
        {
            config = [ config ];
        }

        var zone;

        for (var i = 0; i < config.length; i++)
        {
            zone = config[i];

            if (zone instanceof DeathZone)
            {
                Add(this.deathZones, zone);
            }
            else if (typeof zone.contains === 'function')
            {
                zone = new DeathZone(zone, true);

                Add(this.deathZones, zone);
            }
            else
            {
                var type = GetFastValue(zone, 'type', 'onEnter');
                var source = GetFastValue(zone, 'source', null);

                if (source && typeof source.contains === 'function')
                {
                    var killOnEnter = (type === 'onEnter') ? true : false;

                    zone = new DeathZone(source, killOnEnter);

                    Add(this.deathZones, zone);
                }
            }
        }

        return zone;
    },

    /**
     * Removes the given Particle Death Zone from this Emitter.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#removeDeathZone
     * @since 3.60.0
     *
     * @param {Phaser.GameObjects.Particles.Zones.DeathZone} zone - The Death Zone that should be removed from this Emitter.
     *
     * @return {this} This Particle Emitter.
     */
    removeDeathZone: function (zone)
    {
        Remove(this.deathZones, zone);

        return this;
    },

    /**
     * Adds a new Particle Emission Zone to this Emitter.
     *
     * An {@link Phaser.Types.GameObjects.Particles.ParticleEmitterEdgeZoneConfig EdgeZone} places particles on its edges.
     * Its {@link Phaser.Types.GameObjects.Particles.EdgeZoneSource source} can be a Curve, Path, Circle, Ellipse, Line, Polygon, Rectangle, or Triangle;
     * or any object with a suitable {@link Phaser.Types.GameObjects.Particles.EdgeZoneSourceCallback getPoints} method.
     *
     * A {@link Phaser.Types.GameObjects.Particles.ParticleEmitterRandomZoneConfig RandomZone} places the particles randomly within its interior.
     * Its {@link RandomZoneSource source} can be a Circle, Ellipse, Line, Polygon, Rectangle, or Triangle; or any object with a suitable {@link Phaser.Types.GameObjects.Particles.RandomZoneSourceCallback getRandomPoint} method.
     *
     * An Emission Zone can only exist once within this Emitter.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#addEmitZone
     * @since 3.60.0
     *
     * @param {Phaser.Types.GameObjects.Particles.EmitZoneObject|Phaser.Types.GameObjects.Particles.EmitZoneObject[]} zone - An Emission Zone configuration object, a RandomZone or EdgeZone instance, or an array of them.
     *
     * @return {Phaser.GameObjects.Particles.Zones.EdgeZone|Phaser.GameObjects.Particles.Zones.RandomZone} The Emission Zone that was added to this Emitter.
     */
    addEmitZone: function (config)
    {
        if (!Array.isArray(config))
        {
            config = [ config ];
        }

        var zone;

        for (var i = 0; i < config.length; i++)
        {
            zone = config[i];

            if (zone instanceof RandomZone || zone instanceof EdgeZone)
            {
                Add(this.emitZones, zone);
            }
            else
            {
                //  Where source = Geom like Circle, or a Path or Curve
                //  emitZone: { type: 'random', source: X }
                //  emitZone: { type: 'edge', source: X, quantity: 32, [stepRate=0], [yoyo=false], [seamless=true], [total=1] }

                var type = GetFastValue(zone, 'type', 'random');
                var source = GetFastValue(zone, 'source', null);

                if (type === 'random')
                {
                    zone = new RandomZone(source);
                }
                else if (type === 'edge')
                {
                    var quantity = GetFastValue(zone, 'quantity', 1);
                    var stepRate = GetFastValue(zone, 'stepRate', 0);
                    var yoyo = GetFastValue(zone, 'yoyo', false);
                    var seamless = GetFastValue(zone, 'seamless', true);
                    var total = GetFastValue(zone, 'total', -1);

                    zone = new EdgeZone(source, quantity, stepRate, yoyo, seamless, total);
                }

                if (zone)
                {
                    Add(this.emitZones, zone);
                }
            }
        }

        return zone;
    },

    /**
     * Removes the given Particle Emission Zone from this Emitter.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#removeEmitZone
     * @since 3.60.0
     *
     * @param {Phaser.GameObjects.Particles.Zones.EdgeZone|Phaser.GameObjects.Particles.Zones.RandomZone} zone - The Emission Zone that should be removed from this Emitter.
     *
     * @return {this} This Particle Emitter.
     */
    removeEmitZone: function (zone)
    {
        Remove(this.emitZones, zone);

        this.zoneIndex = 0;

        return this;
    },

    /**
     * Takes the given particle and sets its x/y coordinates to match the next available
     * emission zone, if any have been configured. This method is called automatically
     * as part of the `Particle.fire` process.
     *
     * The Emit Zones are iterated in sequence. Once a zone has had a particle emitted
     * from it, then the next zone is used and so on, in a loop.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#getEmitZone
     * @since 3.60.0
     *
     * @param {Phaser.GameObjects.Particles.Particle} particle - The particle to set the emission zone for.
     */
    getEmitZone: function (particle)
    {
        var zones = this.emitZones;
        var len = zones.length;

        if (len === 0)
        {
            return;
        }
        else
        {
            var zone = zones[this.zoneIndex];

            zone.getPoint(particle);

            if (zone.total > -1)
            {
                this.zoneTotal++;

                if (this.zoneTotal >= zone.total)
                {
                    this.zoneTotal = 0;

                    this.zoneIndex = Wrap(this.zoneIndex + 1, 0, len);
                }
            }
        }
    },

    /**
     * Takes the given particle and checks to see if any of the configured Death Zones
     * will kill it and returns the result. This method is called automatically as part
     * of the `Particle.update` process.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#getDeathZone
     * @fires Phaser.GameObjects.Particles.Events#DEATH_ZONE
     * @since 3.60.0
     *
     * @param {Phaser.GameObjects.Particles.Particle} particle - The particle to test against the Death Zones.
     *
     * @return {boolean} `true` if the particle should be killed, otherwise `false`.
     */
    getDeathZone: function (particle)
    {
        var zones = this.deathZones;

        for (var i = 0; i < zones.length; i++)
        {
            if (zones[i].willKill(particle))
            {
                this.emit(Events.DEATH_ZONE, this, particle, zones[i]);

                return true;
            }
        }

        return false;
    },

    /**
     * Changes the currently active Emission Zone. The zones should have already
     * been added to this Emitter either via the emitter config, or the
     * `addEmitZone` method.
     *
     * Call this method by passing either a numeric zone index value, or
     * the zone instance itself.
     *
     * Prior to v3.60 an Emitter could only have a single Emit Zone and this
     * method was how you set it. From 3.60 and up it now performs a different
     * function and swaps between all available active zones.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#setEmitZone
     * @since 3.0.0
     *
     * @param {number|Phaser.GameObjects.Particles.Zones.EdgeZone|Phaser.GameObjects.Particles.Zones.RandomZone} zone - The Emit Zone to set as the active zone.
     *
     * @return {this} This Particle Emitter.
     */
    setEmitZone: function (zone)
    {
        var index;

        if (isFinite(zone))
        {
            index = zone;
        }
        else
        {
            index = this.emitZones.indexOf(zone);
        }

        if (index >= 0)
        {
            this.zoneIndex = index;
        }

        return this;
    },

    /**
     * Creates inactive particles and adds them to this emitter's pool.
     *
     * If `ParticleEmitter.maxParticles` is set it will limit the
     * value passed to this method to make sure it's not exceeded.
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

        if (this.maxParticles > 0)
        {
            var total = this.getParticleCount();

            if (total + particleCount > this.maxParticles)
            {
                particleCount = this.maxParticles - (total + particleCount);
            }
        }

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
     * Whether this emitter is at either its hard-cap limit (maxParticles), if set, or
     * the max allowed number of 'alive' particles (maxAliveParticles).
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#atLimit
     * @since 3.0.0
     *
     * @return {boolean} Returns `true` if this Emitter is at its limit, or `false` if no limit, or below the `maxParticles` level.
     */
    atLimit: function ()
    {
        if (this.maxParticles > 0 && this.getParticleCount() >= this.maxParticles)
        {
            return true;
        }

        return (this.maxAliveParticles > 0 && this.getAliveParticleCount() >= this.maxAliveParticles);
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
     * Deactivates every particle in this emitter immediately.
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
     * Calls a function for each active particle in this emitter. The function is
     * sent two parameters: a reference to the Particle instance and to this Emitter.
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

        for (var i = 0; i < length; i++)
        {
            //  Sends the Particle and the Emitter
            callback.call(context, alive[i], this);
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

        for (var i = 0; i < length; i++)
        {
            //  Sends the Particle and the Emitter
            callback.call(context, dead[i], this);
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
     * Calling this method will emit the `START` event.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#start
     * @fires Phaser.GameObjects.Particles.Events#START
     * @since 3.0.0
     *
     * @param {number} [advance=0] - Advance this number of ms in time through the emitter.
     * @param {number} [duration=0] - Limit this emitter to only emit particles for the given number of ms. Setting this parameter will override any duration already set in the Emitter configuration object.
     *
     * @return {this} This Particle Emitter.
     */
    start: function (advance, duration)
    {
        if (advance === undefined) { advance = 0; }

        if (!this.emitting)
        {
            if (advance > 0)
            {
                this.fastForward(advance);
            }

            this.emitting = true;

            this.resetCounters(this.frequency, true);

            if (duration !== undefined)
            {
                this.duration = Math.abs(duration);
            }

            this.emit(Events.START, this);
        }

        return this;
    },

    /**
     * Turns {@link Phaser.GameObjects.Particles.ParticleEmitter#on off} the emitter and
     * stops it from emitting further particles. Currently alive particles will remain
     * active until they naturally expire unless you set the `kill` parameter to `true`.
     *
     * Calling this method will emit the `STOP` event. When the final particle has
     * expired the `COMPLETE` event will be emitted.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#stop
     * @fires Phaser.GameObjects.Particles.Events#STOP
     * @since 3.11.0
     *
     * @param {boolean} [kill=false] - Kill all particles immediately (true), or leave them to die after their lifespan expires? (false, the default)
     *
     * @return {this} This Particle Emitter.
     */
    stop: function (kill)
    {
        if (kill === undefined) { kill = false; }

        if (this.emitting)
        {
            this.emitting = false;

            if (kill)
            {
                this.killAll();
            }

            this.emit(Events.STOP, this);
        }

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
     * Removes this Emitter from its Emitter Manager.
     *
     * Doing so does not destroy this Emitter. It's up to you to call the
     * `destroy` method when you're ready to free-up the resources it's using.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#remove
     * @since 3.22.0
     *
     * @return {this} This Particle Emitter.
    remove: function ()
    {
        this.manager.removeEmitter(this);

        return this;
    },
     */

    /**
     * Set the property by which active particles are sorted prior to be rendered.
     *
     * It allows you to control the rendering order of the particles.
     *
     * This can be any valid property of the `Particle` class, such as `y`, `alpha`
     * or `lifeT`.
     *
     * The 'alive' particles array is sorted in place each game frame. Setting a
     * sort property will override the `particleBringToTop` setting.
     *
     * If you wish to use your own sorting function, see `setSortCallback` instead.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#setSortProperty
     * @since 3.60.0
     *
     * @param {string} [property] - The property on the `Particle` class to sort by.
     * @param {boolean} [ascending=true] - Should the particles be sorted in ascending or descending order?
     *
     * @return {this} This Particle Emitter.
     */
    setSortProperty: function (property, ascending)
    {
        if (property === undefined) { property = ''; }
        if (ascending === undefined) { ascending = this.true; }

        this.sortProperty = property;
        this.sortOrderAsc = ascending;
        this.sortCallback = this.depthSortCallback;

        return this;
    },

    /**
     * Sets a callback to be used to sort the particles before rendering each frame.
     *
     * This allows you to define your own logic and behavior in the callback.
     *
     * The callback will be sent two parameters: the two Particles being compared,
     * and must adhere to the criteria of the `compareFn` in `Array.sort`:
     *
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#description
     *
     * Call this method with no parameters to reset the sort callback.
     *
     * Setting your own callback will override both the `particleBringToTop` and
     * `sortProperty` settings of this Emitter.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#setSortCallback
     * @since 3.60.0
     *
     * @param {Phaser.Types.GameObjects.Particles.ParticleSortCallback} [callback] - The callback to invoke when the particles are sorted. Leave undefined to reset to the default.
     *
     * @return {this} This Particle Emitter.
     */
    setSortCallback: function (callback)
    {
        if (this.sortProperty !== '')
        {
            callback = this.depthSortCallback;
        }
        else
        {
            callback = null;
        }

        this.sortCallback = callback;

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
        StableSort(this.alive, this.sortCallback.bind(this));

        return this;
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
        var key = this.sortProperty;

        if (this.sortOrderAsc)
        {
            return a[key] - b[key];
        }
        else
        {
            return b[key] - a[key];
        }
    },

    /**
     * Puts the emitter in flow mode (frequency >= 0) and starts (or restarts) a particle flow.
     *
     * To resume a flow at the current frequency and quantity, use {@link Phaser.GameObjects.Particles.ParticleEmitter#start} instead.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#flow
     * @fires Phaser.GameObjects.Particles.Events#START
     * @since 3.0.0
     *
     * @param {number} frequency - The time interval (>= 0) of each flow cycle, in ms.
     * @param {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType} [count=1] - The number of particles to emit at each flow cycle.
     * @param {number} [stopAfter] - Stop this emitter from firing any more particles once this value is reached. Set to zero for unlimited. Setting this parameter will override any `stopAfter` value already set in the Emitter configuration object.
     *
     * @return {this} This Particle Emitter.
     */
    flow: function (frequency, count, stopAfter)
    {
        if (count === undefined) { count = 1; }

        this.emitting = false;

        this.frequency = frequency;
        this.quantity = count;

        if (stopAfter !== undefined)
        {
            this.stopAfter = stopAfter;
        }

        return this.start();
    },

    /**
     * Puts the emitter in explode mode (frequency = -1), stopping any current particle flow, and emits several particles all at once.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#explode
     * @fires Phaser.GameObjects.Particles.Events#EXPLODE
     * @since 3.0.0
     *
     * @param {number} [count=this.quantity] - The number of Particles to emit.
     * @param {number} [x=this.x] - The x coordinate to emit the Particles from.
     * @param {number} [y=this.x] - The y coordinate to emit the Particles from.
     *
     * @return {Phaser.GameObjects.Particles.Particle} The most recently emitted Particle.
     */
    explode: function (count, x, y)
    {
        this.frequency = -1;

        this.resetCounters(-1, true);

        var particle = this.emitParticle(count, x, y);

        this.emit(Events.EXPLODE, this, particle);

        return particle;
    },

    /**
     * Emits particles at the given position. If no position is given, it will
     * emit from this Emitters current location.
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
            count = this.ops.quantity.onEmit();
        }

        var dead = this.dead;
        var counters = this.counters;
        var stopAfter = this.stopAfter;

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

            if (stopAfter > 0)
            {
                counters[4]++;

                if (counters[4] >= stopAfter)
                {
                    break;
                }
            }

            if (this.atLimit())
            {
                break;
            }
        }

        return particle;
    },

    /**
     * Fast forwards this Particle Emitter and all of its particles.
     *
     * Works by running the Emitter `preUpdate` handler in a loop until the `time`
     * has been reached at `delta` steps per loop.
     *
     * All callbacks and emitter related events that would normally be fired
     * will still be invoked.
     *
     * You can make an emitter 'fast forward' via the emitter config using the
     * `advance` property. Set this value to the number of ms you wish the
     * emitter to be fast-forwarded by. Or, call this method post-creation.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#fastForward
     * @since 3.60.0
     *
     * @param {number} time - The number of ms to advance the Particle Emitter by.
     * @param {number} [delta] - The amount of delta to use for each step. Defaults to 1000 / 60.
     *
     * @return {this} This Particle Emitter.
     */
    fastForward: function (time, delta)
    {
        if (delta === undefined) { delta = 1000 / 60; }

        var total = 0;

        this.skipping = true;

        while (total < Math.abs(time))
        {
            this.preUpdate(0, delta);

            total += delta;
        }

        this.skipping = false;

        return this;
    },

    /**
     * Updates this emitter and its particles.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#preUpdate
     * @fires Phaser.GameObjects.Particles.Events#COMPLETE
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
        var processors = this.getProcessors();

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

                entry.particle.setPosition();
            }
        }

        var counters = this.counters;

        if (!this.emitting && !this.skipping)
        {
            if (counters[5] === 1 && particles.length === 0)
            {
                //  completeFlag
                counters[5] = 0;

                this.emit(Events.COMPLETE, this);
            }

            return;
        }

        if (this.frequency === 0)
        {
            this.emitParticle();
        }
        else if (this.frequency > 0)
        {
            //  counter
            this.flowCounter -= delta;

            if (this.flowCounter <= 0)
            {
                //  Emits the 'quantity' number of particles
                this.emitParticle();

                //  counter = frequency - remainder from previous delta
                this.flowCounter += this.frequency;
            }
        }

        //  Duration or stopAfter set?
        if (!this.skipping)
        {
            if (this.duration > 0)
            {
                //  elapsed
                counters[3] += delta;

                if (counters[3] >= this.duration)
                {
                    this.stop();
                }
            }

            if (this.stopAfter > 0 && counters[4] >= this.stopAfter)
            {
                this.stop();
            }
        }
    },

    /**
     * Gets the world transform matrix for this Particle Emitter, factoring in any parents.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#getWorldTransformMatrix
     * @since 3.60.0
     *
     * @param {Phaser.GameObjects.Components.TransformMatrix} [tempMatrix] - The matrix to populate with the values from this Game Object.
     * @param {Phaser.GameObjects.Components.TransformMatrix} [parentMatrix] - A temporary matrix to hold parent values during the calculations.
     *
     * @return {Phaser.GameObjects.Components.TransformMatrix} The populated Transform Matrix.
    getWorldTransformMatrix: function (tempMatrix, parentMatrix)
    {
        if (tempMatrix === undefined) { tempMatrix = this.tempMatrix1; }
        if (parentMatrix === undefined) { parentMatrix = this.tempMatrix2; }

        var parent = this.manager;

        tempMatrix.applyITRS(0, 0, 0, 1, 1);

        while (parent)
        {
            parentMatrix.applyITRS(parent.x, parent.y, parent._rotation, parent._scaleX, parent._scaleY);

            parentMatrix.multiply(tempMatrix, tempMatrix);

            parent = parent.parentContainer;
        }

        return tempMatrix;
    },
     */

    /**
     * Takes either a Rectangle Geometry object or an Arcade Physics Body and tests
     * to see if it intersects with any currently alive Particle in this Emitter.
     *
     * Overlapping particles are returned in an array, where you can perform further
     * processing on them. If nothing overlaps then the array will be empty.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#overlap
     * @since 3.60.0
     *
     * @param {(Phaser.Geom.Rectangle|Phaser.Physics.Arcade.Body)} target - A Rectangle or Arcade Physics Body to check for intersection against all alive particles.
     *
     * @return {Phaser.GameObjects.Particles.Particle[]} An array of Particles that overlap with the given target.
     */
    overlap: function (target)
    {
        var matrix = this.getWorldTransformMatrix();

        var alive = this.alive;
        var length = alive.length;

        var output = [];

        for (var i = 0; i < length; i++)
        {
            var particle = alive[i];

            if (RectangleToRectangle(target, particle.getBounds(matrix)))
            {
                output.push(particle);
            }
        }

        return output;
    },

    /**
     * Returns a bounds Rectangle calculated from the bounds of all currently
     * _active_ Particles in this Emitter. If this Emitter has only just been
     * created and not yet rendered, then calling this method will return a Rectangle
     * with a max safe integer for dimensions. Use the `advance` parameter to
     * avoid this.
     *
     * Typically it takes a few seconds for a flow Emitter to 'warm up'. You can
     * use the `advance` and `delta` parameters to force the Emitter to
     * 'fast forward' in time to try and allow the bounds to be more accurate,
     * as it will calculate the bounds based on the particle bounds across all
     * timesteps, giving a better result.
     *
     * You can also use the `padding` parameter to increase the size of the
     * bounds. Emitters with a lot of randomness in terms of direction or lifespan
     * can often return a bounds smaller than their possible maximum. By using
     * the `padding` (and `advance` if needed) you can help limit this.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#getBounds
     * @since 3.60.0
     *
     * @param {number} [padding] - The amount of padding, in pixels, to add to the bounds Rectangle.
     * @param {number} [advance] - The number of ms to advance the Particle Emitter by. Defaults to 0, i.e. not used.
     * @param {number} [delta] - The amount of delta to use for each step. Defaults to 1000 / 60.
     * @param {Phaser.Geom.Rectangle} [output] - The Rectangle to store the results in. If not given a new one will be created.
     *
     * @return {Phaser.Geom.Rectangle} A Rectangle containing the calculated bounds of this Emitter.
     */
    getBounds: function (padding, advance, delta, output)
    {
        if (padding === undefined) { padding = 0; }
        if (advance === undefined) { advance = 0; }
        if (delta === undefined) { delta = 1000 / 60; }
        if (output === undefined) { output = new Rectangle(); }

        var matrix = this.getWorldTransformMatrix();

        var i;
        var bounds;
        var alive = this.alive;
        var setFirst = false;

        output.setTo(0, 0, 0, 0);

        if (advance > 0)
        {
            var total = 0;

            this.skipping = true;

            while (total < Math.abs(advance))
            {
                this.preUpdate(0, delta);

                for (i = 0; i < alive.length; i++)
                {
                    bounds = alive[i].getBounds(matrix);

                    if (!setFirst)
                    {
                        setFirst = true;

                        CopyFrom(bounds, output);
                    }
                    else
                    {
                        MergeRect(output, bounds);
                    }
                }

                total += delta;
            }

            this.skipping = false;
        }
        else
        {
            for (i = 0; i < alive.length; i++)
            {
                bounds = alive[i].getBounds(matrix);

                if (!setFirst)
                {
                    setFirst = true;

                    CopyFrom(bounds, output);
                }
                else
                {
                    MergeRect(output, bounds);
                }
            }
        }

        if (padding > 0)
        {
            Inflate(output, padding, padding);
        }

        return output;
    },

    /**
     * The x coordinate the particles are emitted from.
     *
     * Accessing this property should typically return a number.
     * However, it can be set to any valid EmitterOp onEmit type.
     *
     * @name Phaser.GameObjects.Particles.ParticleEmitter#x
     * @type {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType}
     * @since 3.60.0
     * @see Phaser.GameObjects.Particles.ParticleEmitter#setPosition
     */
    emitX: {

        get: function ()
        {
            return this.ops.x.current;
        },

        set: function (value)
        {
            this.ops.x.onChange(value);
        }

    },

    /**
     * The y coordinate the particles are emitted from.
     *
     * Accessing this property should typically return a number.
     * However, it can be set to any valid EmitterOp onEmit type.
     *
     * @name Phaser.GameObjects.Particles.ParticleEmitter#y
     * @type {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType}
     * @since 3.60.0
     * @see Phaser.GameObjects.Particles.ParticleEmitter#setPosition
     */
    emitY: {

        get: function ()
        {
            return this.ops.y.current;
        },

        set: function (value)
        {
            this.ops.y.onChange(value);
        }

    },

    /**
     * The horizontal acceleration applied to emitted particles, in pixels per second squared.
     *
     * Accessing this property should typically return a number.
     * However, it can be set to any valid EmitterOp onEmit type.
     *
     * @name Phaser.GameObjects.Particles.ParticleEmitter#accelerationX
     * @type {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType}
     * @since 3.60.0
     */
    accelerationX: {

        get: function ()
        {
            return this.ops.accelerationX.current;
        },

        set: function (value)
        {
            this.ops.accelerationX.onChange(value);
        }

    },

    /**
     * The vertical acceleration applied to emitted particles, in pixels per second squared.
     *
     * Accessing this property should typically return a number.
     * However, it can be set to any valid EmitterOp onEmit type.
     *
     * @name Phaser.GameObjects.Particles.ParticleEmitter#accelerationY
     * @type {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType}
     * @since 3.60.0
     */
    accelerationY: {

        get: function ()
        {
            return this.ops.accelerationY.current;
        },

        set: function (value)
        {
            this.ops.accelerationY.onChange(value);
        }

    },

    /**
     * The maximum horizontal velocity emitted particles can reach, in pixels per second squared.
     *
     * Accessing this property should typically return a number.
     * However, it can be set to any valid EmitterOp onEmit type.
     *
     * @name Phaser.GameObjects.Particles.ParticleEmitter#maxVelocityX
     * @type {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType}
     * @since 3.60.0
     * @default 10000
     */
    maxVelocityX: {

        get: function ()
        {
            return this.ops.maxVelocityX.current;
        },

        set: function (value)
        {
            this.ops.maxVelocityX.onChange(value);
        }

    },

    /**
     * The maximum vertical velocity emitted particles can reach, in pixels per second squared.
     *
     * Accessing this property should typically return a number.
     * However, it can be set to any valid EmitterOp onEmit type.
     *
     * @name Phaser.GameObjects.Particles.ParticleEmitter#maxVelocityY
     * @type {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType}
     * @since 3.60.0
     * @default 10000
     */
    maxVelocityY: {

        get: function ()
        {
            return this.ops.maxVelocityY.current;
        },

        set: function (value)
        {
            this.ops.maxVelocityY.onChange(value);
        }

    },

    /**
     * The initial horizontal speed of emitted particles, in pixels per second.
     *
     * Accessing this property should typically return a number.
     * However, it can be set to any valid EmitterOp onEmit type.
     *
     * @name Phaser.GameObjects.Particles.ParticleEmitter#speed
     * @type {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType}
     * @since 3.60.0
     */
    speed: {

        get: function ()
        {
            return this.ops.speedX.current;
        },

        set: function (value)
        {
            this.ops.speedX.onChange(value);
            this.ops.speedY.onChange(value);
        }

    },

    /**
     * The initial horizontal speed of emitted particles, in pixels per second.
     *
     * Accessing this property should typically return a number.
     * However, it can be set to any valid EmitterOp onEmit type.
     *
     * @name Phaser.GameObjects.Particles.ParticleEmitter#speedX
     * @type {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType}
     * @since 3.60.0
     */
    speedX: {

        get: function ()
        {
            return this.ops.speedX.current;
        },

        set: function (value)
        {
            this.ops.speedX.onChange(value);
        }

    },

    /**
     * The initial vertical speed of emitted particles, in pixels per second.
     *
     * Accessing this property should typically return a number.
     * However, it can be set to any valid EmitterOp onEmit type.
     *
     * @name Phaser.GameObjects.Particles.ParticleEmitter#speedY
     * @type {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType}
     * @since 3.60.0
     */
    speedY: {

        get: function ()
        {
            return this.ops.speedY.current;
        },

        set: function (value)
        {
            this.ops.speedY.onChange(value);
        }

    },

    /**
     * The x coordinate emitted particles move toward, when {@link Phaser.GameObjects.Particles.ParticleEmitter#moveTo} is true.
     *
     * Accessing this property should typically return a number.
     * However, it can be set to any valid EmitterOp onEmit type.
     *
     * @name Phaser.GameObjects.Particles.ParticleEmitter#moveToX
     * @type {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType}
     * @since 3.60.0
     */
    moveToX: {

        get: function ()
        {
            return this.ops.moveToX.current;
        },

        set: function (value)
        {
            this.ops.moveToX.onChange(value);
        }

    },

    /**
     * The y coordinate emitted particles move toward, when {@link Phaser.GameObjects.Particles.ParticleEmitter#moveTo} is true.
     *
     * Accessing this property should typically return a number.
     * However, it can be set to any valid EmitterOp onEmit type.
     *
     * @name Phaser.GameObjects.Particles.ParticleEmitter#moveToY
     * @type {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType}
     * @since 3.60.0
     */
    moveToY: {

        get: function ()
        {
            return this.ops.moveToY.current;
        },

        set: function (value)
        {
            this.ops.moveToY.onChange(value);
        }

    },

    /**
     * The amount of velocity particles will use when rebounding off the
     * emitter bounds, if set. A value of 0 means no bounce. A value of 1
     * means a full rebound.
     *
     * Accessing this property should typically return a number.
     * However, it can be set to any valid EmitterOp onEmit type.
     *
     * @name Phaser.GameObjects.Particles.ParticleEmitter#bounce
     * @type {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType}
     * @since 3.60.0
     */
    bounce: {

        get: function ()
        {
            return this.ops.bounce.current;
        },

        set: function (value)
        {
            this.ops.bounce.onChange(value);
        }

    },

    /**
     * The horizontal scale of emitted particles.
     *
     * Accessing this property should typically return a number.
     * However, it can be set to any valid EmitterOp onEmit type.
     *
     * @name Phaser.GameObjects.Particles.ParticleEmitter#scaleX
     * @type {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType}
     * @since 3.60.0
     */
    emitScaleX: {

        get: function ()
        {
            return this.ops.scaleX.current;
        },

        set: function (value)
        {
            this.ops.scaleX.onChange(value);
        }

    },

    /**
     * The vertical scale of emitted particles.
     *
     * Accessing this property should typically return a number.
     * However, it can be set to any valid EmitterOp onEmit type.
     *
     * @name Phaser.GameObjects.Particles.ParticleEmitter#scaleY
     * @type {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType}
     * @since 3.60.0
     */
    emitScaleY: {

        get: function ()
        {
            return this.ops.scaleY.current;
        },

        set: function (value)
        {
            this.ops.scaleY.onChange(value);
        }

    },

    /**
     * A color tint value that is applied to the texture of the emitted
     * particle. The value should be given in hex format, i.e. 0xff0000
     * for a red tint, and should not include the alpha channel.
     *
     * Tints are additive, meaning a tint value of white (0xffffff) will
     * effectively reset the tint to nothing.
     *
     * This is a WebGL only feature.
     *
     * Accessing this property should typically return a number.
     * However, it can be set to any valid EmitterOp onEmit type.
     *
     * @name Phaser.GameObjects.Particles.ParticleEmitter#tint
     * @type {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType}
     * @since 3.60.0
     */
    tint: {

        get: function ()
        {
            return this.ops.tint.current;
        },

        set: function (value)
        {
            this.ops.tint.onChange(value);
        }

    },

    /**
     * The alpha value of the emitted particles. This is a value
     * between 0 and 1. Particles with alpha zero are invisible
     * and are therefore not rendered, but are still processed
     * by the Emitter.
     *
     * Accessing this property should typically return a number.
     * However, it can be set to any valid EmitterOp onEmit type.
     *
     * @name Phaser.GameObjects.Particles.ParticleEmitter#alpha
     * @type {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType}
     * @since 3.60.0
     */
    emitAlpha: {

        get: function ()
        {
            return this.ops.alpha.current;
        },

        set: function (value)
        {
            this.ops.alpha.onChange(value);
        }

    },

    /**
     * The lifespan of the emitted particles. This value is given
     * in milliseconds and defaults to 1000ms (1 second). When a
     * particle reaches this amount it is killed.
     *
     * Accessing this property should typically return a number.
     * However, it can be set to any valid EmitterOp onEmit type.
     *
     * @name Phaser.GameObjects.Particles.ParticleEmitter#lifespan
     * @type {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType}
     * @since 3.60.0
     */
    lifespan: {

        get: function ()
        {
            return this.ops.lifespan.current;
        },

        set: function (value)
        {
            this.ops.lifespan.onChange(value);
        }

    },

    /**
     * The angle in which the particles are emitted. The values are
     * given in degrees. This allows you to control the direction
     * of the emitter. If you wish instead to change the rotation
     * of the particles themselves, see the `rotate` property.
     *
     * Accessing this property should typically return a number.
     * However, it can be set to any valid EmitterOp onEmit type.
     *
     * @name Phaser.GameObjects.Particles.ParticleEmitter#angle
     * @type {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType}
     * @since 3.60.0
     */
    emitAngle: {

        get: function ()
        {
            return this.ops.angle.current;
        },

        set: function (value)
        {
            this.ops.angle.onChange(value);
        }

    },

    /**
     * The rotation (or angle) of the particles when they are
     * emitted. The value is given in degrees and uses a right-handed
     * coordinate system, where 0 degrees points to the right, 90 degrees
     * points down and -90 degrees points up.
     *
     * Accessing this property should typically return a number.
     * However, it can be set to any valid EmitterOp onEmit type.
     *
     * @name Phaser.GameObjects.Particles.ParticleEmitter#rotate
     * @type {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType}
     * @since 3.60.0
     */
    emitRotate: {

        get: function ()
        {
            return this.ops.rotate.current;
        },

        set: function (value)
        {
            this.ops.rotate.onChange(value);
        }

    },

    /**
     * The number of particles that are emitted each time an emission
     * occurs, i.e. from one 'explosion' or each frame in a 'flow' cycle.
     *
     * The default is 1.
     *
     * Accessing this property should typically return a number.
     * However, it can be set to any valid EmitterOp onEmit type.
     *
     * @name Phaser.GameObjects.Particles.ParticleEmitter#quantity
     * @type {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType}
     * @see Phaser.GameObjects.Particles.ParticleEmitter#setFrequency
     * @see Phaser.GameObjects.Particles.ParticleEmitter#setQuantity
     * @since 3.60.0
     */
    quantity: {

        get: function ()
        {
            return this.ops.quantity.current;
        },

        set: function (value)
        {
            this.ops.quantity.onChange(value);
        }

    },

    /**
     * The number of milliseconds to wait after emission before
     * the particles strat updating. This allows you to emit particles
     * that appear 'static' or still on-screen and then, after this value,
     * begin to move.
     *
     * Accessing this property should typically return a number.
     * However, it can be set to any valid EmitterOp onEmit type.
     *
     * @name Phaser.GameObjects.Particles.ParticleEmitter#delay
     * @type {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType}
     * @since 3.60.0
     */
    delay: {

        get: function ()
        {
            return this.ops.delay.current;
        },

        set: function (value)
        {
            this.ops.delay.onChange(value);
        }

    },

    /**
     * The internal flow counter.
     *
     * @name Phaser.GameObjects.Particles.ParticleEmitter#flowCounter
     * @type {number}
     * @since 3.60.0
     */
    flowCounter: {

        get: function ()
        {
            return this.counters[0];
        },

        set: function (value)
        {
            this.counters[0] = value;
        }

    },

    /**
     * The internal frame counter.
     *
     * @name Phaser.GameObjects.Particles.ParticleEmitter#frameCounter
     * @type {number}
     * @since 3.60.0
     */
    frameCounter: {

        get: function ()
        {
            return this.counters[1];
        },

        set: function (value)
        {
            this.counters[1] = value;
        }

    },

    /**
     * The internal anim counter.
     *
     * @name Phaser.GameObjects.Particles.ParticleEmitter#animCounter
     * @type {number}
     * @since 3.60.0
     */
    animCounter: {

        get: function ()
        {
            return this.counters[2];
        },

        set: function (value)
        {
            this.counters[2] = value;
        }

    },

    /**
     * The internal zone counter.
     *
     * @name Phaser.GameObjects.Particles.ParticleEmitter#zoneIndex
     * @type {number}
     * @since 3.60.0
     */
    zoneIndex: {

        get: function ()
        {
            return this.counters[6];
        },

        set: function (value)
        {
            this.counters[6] = value;
        }

    },

    /**
     * The current emission zone index.
     *
     * @name Phaser.GameObjects.Particles.ParticleEmitter#zoneTotal
     * @type {number}
     * @since 3.60.0
     */
    zoneTotal: {

        get: function ()
        {
            return this.counters[7];
        },

        set: function (value)
        {
            this.counters[7] = value;
        }

    },

    /**
     * Destroys this Particle Emitter and all Particles it owns.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#preDestroy
     * @since 3.60.0
     */
    preDestroy: function ()
    {
        // this.texture = null;
        // this.frames = null;
        this.anims = null;
        this.defaultFrame = null;
        this.emitCallback = null;
        this.emitCallbackScope = null;
        this.deathCallback = null;
        this.deathCallbackScope = null;
        this.emitZones = null;
        this.deathZones = null;
        this.bounds = null;
        this.follow = null;
        this.counters = null;

        var i;

        var ops = this.ops;

        for (i = 0; i < configOpMap.length; i++)
        {
            var key = configOpMap[i];

            ops[key].destroy();
        }

        for (i = 0; i < this.particles.length; i++)
        {
            this.particles[i].destroy();
        }

        for (i = 0; i < this.dead.length; i++)
        {
            this.dead[i].destroy();
        }

        this.ops = null;
        this.particles = [];
        this.dead = [];
        this.tempMatrix1.destroy();
        this.tempMatrix2.destroy();
    }

});

module.exports = ParticleEmitter2;
