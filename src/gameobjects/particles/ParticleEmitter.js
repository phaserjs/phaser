/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var Components = require('../components');
var ComponentsToJSON = require('../components/ToJSON');
var CopyFrom = require('../../geom/rectangle/CopyFrom');
var DeathZone = require('./zones/DeathZone');
var EdgeZone = require('./zones/EdgeZone');
var EmitterColorOp = require('./EmitterColorOp');
var EmitterOp = require('./EmitterOp');
var Events = require('./events');
var GameObject = require('../GameObject');
var GetFastValue = require('../../utils/object/GetFastValue');
var GetRandom = require('../../utils/array/GetRandom');
var GravityWell = require('./GravityWell');
var HasAny = require('../../utils/object/HasAny');
var HasValue = require('../../utils/object/HasValue');
var Inflate = require('../../geom/rectangle/Inflate');
var List = require('../../structs/List');
var MergeRect = require('../../geom/rectangle/MergeRect');
var MergeRight = require('../../utils/object/MergeRight');
var Particle = require('./Particle');
var ParticleBounds = require('./ParticleBounds');
var RandomZone = require('./zones/RandomZone');
var Rectangle = require('../../geom/rectangle/Rectangle');
var RectangleToRectangle = require('../../geom/intersects/RectangleToRectangle');
var Remove = require('../../utils/array/Remove');
var Render = require('./ParticleEmitterRender');
var StableSort = require('../../utils/array/StableSort');
var TransformMatrix = require('../components/TransformMatrix');
var Vector2 = require('../../math/Vector2');
var Wrap = require('../../math/Wrap');

/**
 * Names of simple configuration properties.
 *
 * @ignore
 */
var configFastMap = [
    'active',
    'advance',
    'blendMode',
    'colorEase',
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
    'tintFill',
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
    'color',
    'delay',
    'hold',
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
 * A Particle Emitter is a special kind of Game Object that controls a pool of {@link Phaser.GameObjects.Particles.Particle Particles}.
 *
 * Particle Emitters are created via a configuration object. The properties of this object
 * can be specified in a variety of formats, given you plenty of scope over the values they
 * return, leading to complex visual effects. Here are the different forms of configuration
 * value you can give:
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
 * ## v3.55 Differences
 *
 * Prior to v3.60 Phaser used a `ParticleEmitterManager`. This was removed in v3.60
 * and now calling `this.add.particles` returns a `ParticleEmitter` instance instead.
 *
 * In order to streamline memory and the display list we have removed the
 * `ParticleEmitterManager` entirely. When you call `this.add.particles` you're now
 * creating a `ParticleEmitter` instance, which is being added directly to the
 * display list and can be manipulated just like any other Game Object, i.e.
 * scaled, rotated, positioned, added to a Container, etc. It now extends the
 * `GameObject` base class, meaning it's also an event emitter, which allowed us
 * to create some handy new events for particles.
 *
 * So, to create an emitter, you now give it an xy coordinate, a texture and an
 * emitter configuration object (you can also set this later, but most commonly
 * you'd do it on creation). I.e.:
 *
 * ```js
 * const emitter = this.add.particles(100, 300, 'flares', {
 *   frame: 'red',
 *   angle: { min: -30, max: 30 },
 *   speed: 150
 * });
 * ```
 *
 * This will create a 'red flare' emitter at 100 x 300.
 *
 * Please update your code to ensure it adheres to the new function signatures.
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
 * @extends Phaser.GameObjects.Components.Mask
 * @extends Phaser.GameObjects.Components.Pipeline
 * @extends Phaser.GameObjects.Components.PostPipeline
 * @extends Phaser.GameObjects.Components.ScrollFactor
 * @extends Phaser.GameObjects.Components.Texture
 * @extends Phaser.GameObjects.Components.Transform
 * @extends Phaser.GameObjects.Components.Visible
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
 * @param {number} [x] - The horizontal position of this Game Object in the world.
 * @param {number} [y] - The vertical position of this Game Object in the world.
 * @param {(string|Phaser.Textures.Texture)} [texture] - The key, or instance of the Texture this Game Object will use to render with, as stored in the Texture Manager.
 * @param {Phaser.Types.GameObjects.Particles.ParticleEmitterConfig} [config] - Settings for this emitter.
 */
var ParticleEmitter = new Class({

    Extends: GameObject,

    Mixins: [
        Components.AlphaSingle,
        Components.BlendMode,
        Components.Depth,
        Components.Mask,
        Components.Pipeline,
        Components.PostPipeline,
        Components.ScrollFactor,
        Components.Texture,
        Components.Transform,
        Components.Visible,
        Render
    ],

    initialize:

    function ParticleEmitter (scene, x, y, texture, config)
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
        this.particleClass = Particle;

        /**
         * An internal object holding the configuration for the Emitter.
         *
         * These are populated as part of the Emitter configuration parsing.
         *
         * You typically do not access them directly, but instead use the
         * `ParticleEmitter.setConfig` or `ParticleEmitter.updateConfig` methods.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#config
         * @type {Phaser.Types.GameObjects.Particles.ParticleEmitterConfig}
         * @since 3.85.0
         */
        this.config = null;
            
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
            accelerationX: new EmitterOp('accelerationX', 0),
            accelerationY: new EmitterOp('accelerationY', 0),
            alpha: new EmitterOp('alpha', 1),
            angle: new EmitterOp('angle', { min: 0, max: 360 }, true),
            bounce: new EmitterOp('bounce', 0),
            color: new EmitterColorOp('color'),
            delay: new EmitterOp('delay', 0, true),
            hold: new EmitterOp('hold', 0, true),
            lifespan: new EmitterOp('lifespan', 1000, true),
            maxVelocityX: new EmitterOp('maxVelocityX', 10000),
            maxVelocityY: new EmitterOp('maxVelocityY', 10000),
            moveToX: new EmitterOp('moveToX', 0),
            moveToY: new EmitterOp('moveToY', 0),
            quantity: new EmitterOp('quantity', 1, true),
            rotate: new EmitterOp('rotate', 0),
            scaleX: new EmitterOp('scaleX', 1),
            scaleY: new EmitterOp('scaleY', 1),
            speedX: new EmitterOp('speedX', 0, true),
            speedY: new EmitterOp('speedY', 0, true),
            tint: new EmitterOp('tint', 0xffffff),
            x: new EmitterOp('x', 0),
            y: new EmitterOp('y', 0)
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
         *
         * Already alive particles will continue to update until they expire.
         *
         * Controlled by {@link Phaser.GameObjects.Particles.ParticleEmitter#start} and {@link Phaser.GameObjects.Particles.ParticleEmitter#stop}.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#emitting
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.emitting = true;

        /**
         * Newly emitted particles are added to the top of the particle list, i.e. rendered above those already alive.
         *
         * Set to false to send them to the back.
         *
         * Also see the `sortOrder` property for more complex particle sorting.
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
         * @type {Phaser.Types.GameObjects.Particles.EmitZoneObject[]}
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
         * A Game Object whose position is used as the particle origin.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#follow
         * @type {?Phaser.Types.Math.Vector2Like}
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
         * The texture frames assigned to particles.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#frames
         * @type {Phaser.Textures.Frame[]}
         * @since 3.0.0
         */
        this.frames = [];

        /**
         * Whether texture {@link Phaser.GameObjects.Particles.ParticleEmitter#frames} are selected at random.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#randomFrame
         * @type {boolean}
         * @default true
         * @since 3.0.0
         * @see Phaser.GameObjects.Particles.ParticleEmitter#setEmitterFrame
         */
        this.randomFrame = true;

        /**
         * The number of consecutive particles that receive a single texture frame (per frame cycle).
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#frameQuantity
         * @type {number}
         * @default 1
         * @since 3.0.0
         * @see Phaser.GameObjects.Particles.ParticleEmitter#setEmitterFrame
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
         * 0 - flowCounter - The time until next flow cycle.
         * 1 - frameCounter - Counts up to {@link Phaser.GameObjects.Particles.ParticleEmitter#frameQuantity}.
         * 2 - animCounter - Counts up to animQuantity.
         * 3 - elapsed - The time remaining until the `duration` limit is reached.
         * 4 - stopCounter - The number of particles remaining until `stopAfter` limit is reached.
         * 5 - completeFlag - Has the COMPLETE event been emitted?
         * 6 - zoneIndex - The emit zone index counter.
         * 7 - zoneTotal - The emit zone total counter.
         * 8 - currentFrame - The current texture frame, as an index of {@link Phaser.GameObjects.Particles.ParticleEmitter#frames}.
         * 9 - currentAnim - The current animation, as an index of {@link Phaser.GameObjects.Particles.ParticleEmitter#anims}.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#counters
         * @type {Float32Array}
         * @private
         * @since 3.60.0
         */
        this.counters = new Float32Array(10);

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
         * An internal Transform Matrix used to cache this emitters world matrix.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#worldMatrix
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @since 3.60.0
         */
        this.worldMatrix = new TransformMatrix();

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
         * A list of Particle Processors being managed by this Emitter.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#processors
         * @type {Phaser.Structs.List.<Phaser.GameObjects.Particles.ParticleProcessor>}
         * @since 3.60.0
         */
        this.processors = new List(this);

        /**
         * The tint fill mode used by the Particles in this Emitter.
         *
         * `false` = An additive tint (the default), where vertices colors are blended with the texture.
         * `true` = A fill tint, where the vertices colors replace the texture, but respects texture alpha.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#tintFill
         * @type {boolean}
         * @default false
         * @since 3.60.0
         */
        this.tintFill = false;

        this.initPipeline();
        this.initPostPipeline();

        this.setPosition(x, y);
        this.setTexture(texture);

        if (config)
        {
            this.setConfig(config);
        }
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
     * Takes an Emitter Configuration file and resets this Emitter, using any
     * properties defined in the config to then set it up again.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#setConfig
     * @since 3.60.0
     *
     * @param {Phaser.Types.GameObjects.Particles.ParticleEmitterConfig} config - Settings for this emitter.
     *
     * @return {this} This Particle Emitter.
     */
    setConfig: function (config)
    {
        if (!config)
        {
            return this;
        }

        this.config = config;

        var i = 0;
        var key = '';

        var ops = this.ops;

        for (i = 0; i < configOpMap.length; i++)
        {
            key = configOpMap[i];

            ops[key].loadConfig(config);
        }

        for (i = 0; i < configFastMap.length; i++)
        {
            key = configFastMap[i];

            //  Only update properties from their current state if they exist in the given config
            if (HasValue(config, key))
            {
                this[key] = GetFastValue(config, key);
            }
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
            var bounds = this.addParticleBounds(config.bounds);

            bounds.collideLeft = GetFastValue(config, 'collideLeft', true);
            bounds.collideRight = GetFastValue(config, 'collideRight', true);
            bounds.collideTop = GetFastValue(config, 'collideTop', true);
            bounds.collideBottom = GetFastValue(config, 'collideBottom', true);
        }

        if (HasValue(config, 'followOffset'))
        {
            this.followOffset.setFromObject(GetFastValue(config, 'followOffset', 0));
        }

        if (HasValue(config, 'texture'))
        {
            this.setTexture(config.texture);
        }

        if (HasValue(config, 'frame'))
        {
            this.setEmitterFrame(config.frame);
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
     * Takes an existing Emitter Configuration file and updates this Emitter.
     * Existing properties are overriden while new properties are added. The
     * updated configuration is then passed to the `setConfig` method to reset
     * the Emitter with the updated configuration.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#updateConfig
     * @since 3.85.0
     *
     * @param {Phaser.Types.GameObjects.Particles.ParticleEmitterConfig} config - Settings for this emitter.
     *
     * @return {this} This Particle Emitter.
     */
    updateConfig: function (config)
    {
        if (config)
        {
            if (!this.config)
            {
                this.setConfig(config);
            }
            else
            {
                this.setConfig(MergeRight(this.config, config));
            }
        }
        
        return this;
    },

    /**
     * Creates a description of this emitter suitable for JSON serialization.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#toJSON
     * @since 3.0.0
     *
     * @return {Phaser.Types.GameObjects.JSONGameObject} A JSON representation of the Game Object.
     */
    toJSON: function ()
    {
        var output = ComponentsToJSON(this);

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
     * @param {Phaser.Types.Math.Vector2Like} target - The Object to follow.
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
        var frames = this.frames;
        var len = frames.length;
        var current;

        if (len === 1)
        {
            current = frames[0];
        }
        else if (this.randomFrame)
        {
            current = GetRandom(frames);
        }
        else
        {
            current = frames[this.currentFrame];

            this.frameCounter++;

            if (this.frameCounter === this.frameQuantity)
            {
                this.frameCounter = 0;

                this.currentFrame++;

                if (this.currentFrame === len)
                {
                    this.currentFrame = 0;
                }
            }
        }

        return this.texture.get(current);
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
     * @method Phaser.GameObjects.Particles.ParticleEmitter#setEmitterFrame
     * @since 3.0.0
     *
     * @param {(array|string|number|Phaser.Types.GameObjects.Particles.ParticleEmitterFrameConfig)} frames - One or more texture frames, or a configuration object.
     * @param {boolean} [pickRandom=true] - Whether frames should be assigned at random from `frames`.
     * @param {number} [quantity=1] - The number of consecutive particles that will receive each frame.
     *
     * @return {this} This Particle Emitter.
     */
    setEmitterFrame: function (frames, pickRandom, quantity)
    {
        if (pickRandom === undefined) { pickRandom = true; }
        if (quantity === undefined) { quantity = 1; }

        this.randomFrame = pickRandom;
        this.frameQuantity = quantity;

        this.currentFrame = 0;

        var t = typeof (frames);

        this.frames.length = 0;

        if (Array.isArray(frames))
        {
            this.frames = this.frames.concat(frames);
        }
        else if (t === 'string' || t === 'number')
        {
            this.frames.push(frames);
        }
        else if (t === 'object')
        {
            var frameConfig = frames;

            frames = GetFastValue(frameConfig, 'frames', null);

            if (frames)
            {
                this.frames = this.frames.concat(frames);
            }

            var isCycle = GetFastValue(frameConfig, 'cycle', false);

            this.randomFrame = (isCycle) ? false : true;

            this.frameQuantity = GetFastValue(frameConfig, 'quantity', quantity);
        }

        if (this.frames.length === 1)
        {
            this.frameQuantity = 1;
            this.randomFrame = false;
        }

        return this;
    },

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
        var len = anims.length;

        if (len === 0)
        {
            return null;
        }
        else if (len === 1)
        {
            return anims[0];
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
                this.currentAnim = Wrap(this.currentAnim + 1, 0, len);
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
     * Call this method at least once before any particles are created, or set `anim` in the Particle Emitter's configuration when creating the Emitter.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#setAnim
     * @since 3.60.0
     *
     * @param {(string|string[]|Phaser.Types.GameObjects.Particles.ParticleEmitterAnimConfig)} anims - One or more animations, or a configuration object.
     * @param {boolean} [pickRandom=true] - Whether animations should be assigned at random from `anims`. If a config object is given, this parameter is ignored.
     * @param {number} [quantity=1] - The number of consecutive particles that will receive each animation. If a config object is given, this parameter is ignored.
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

        this.anims.length = 0;

        if (Array.isArray(anims))
        {
            this.anims = this.anims.concat(anims);
        }
        else if (t === 'string')
        {
            this.anims.push(anims);
        }
        else if (t === 'object')
        {
            var animConfig = anims;

            anims = GetFastValue(animConfig, 'anims', null);

            if (anims)
            {
                this.anims = this.anims.concat(anims);
            }

            var isCycle = GetFastValue(animConfig, 'cycle', false);

            this.randomAnim = (isCycle) ? false : true;

            this.animQuantity = GetFastValue(animConfig, 'quantity', quantity);
        }

        if (this.anims.length === 1)
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
     * Creates a Particle Bounds processor and adds it to this Emitter.
     *
     * This processor will check to see if any of the active Particles hit
     * the defined boundary, as specified by a Rectangle shape in world-space.
     *
     * If so, they are 'rebounded' back again by having their velocity adjusted.
     *
     * The strength of the rebound is controlled by the `Particle.bounce`
     * property.
     *
     * You should be careful to ensure that you emit particles within a bounds,
     * if set, otherwise it will lead to unpredictable visual results as the
     * particles are hastily repositioned.
     *
     * The Particle Bounds processor is returned from this method. If you wish
     * to modify the area you can directly change its `bounds` property, along
     * with the `collideLeft` etc values.
     *
     * To disable the bounds you can either set its `active` property to `false`,
     * or if you no longer require it, call `ParticleEmitter.removeParticleProcessor`.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#addParticleBounds
     * @since 3.60.0
     *
     * @param {(number|Phaser.Types.GameObjects.Particles.ParticleEmitterBounds|Phaser.Types.GameObjects.Particles.ParticleEmitterBoundsAlt)} x - The x-coordinate of the left edge of the boundary, or an object representing a rectangle.
     * @param {number} [y] - The y-coordinate of the top edge of the boundary.
     * @param {number} [width] - The width of the boundary.
     * @param {number} [height] - The height of the boundary.
     * @param {boolean} [collideLeft=true] - Whether particles interact with the left edge of the bounds.
     * @param {boolean} [collideRight=true] - Whether particles interact with the right edge of the bounds.
     * @param {boolean} [collideTop=true] - Whether particles interact with the top edge of the bounds.
     * @param {boolean} [collideBottom=true] - Whether particles interact with the bottom edge of the bounds.
     *
     * @return {Phaser.GameObjects.Particles.ParticleBounds} The Particle Bounds processor.
     */
    addParticleBounds: function (x, y, width, height, collideLeft, collideRight, collideTop, collideBottom)
    {
        if (typeof x === 'object')
        {
            var obj = x;

            x = obj.x;
            y = obj.y;
            width = (HasValue(obj, 'w')) ? obj.w : obj.width;
            height = (HasValue(obj, 'h')) ? obj.h : obj.height;
        }

        return this.addParticleProcessor(new ParticleBounds(x, y, width, height, collideLeft, collideRight, collideTop, collideBottom));
    },

    /**
     * Sets the initial radial speed of emitted particles.
     *
     * Changes the emitter to radial mode.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#setParticleSpeed
     * @since 3.60.0
     *
     * @param {number} x - The horizontal speed of the emitted Particles.
     * @param {number} [y=x] - The vertical speed of emitted Particles. If not set it will use the `x` value.
     *
     * @return {this} This Particle Emitter.
     */
    setParticleSpeed: function (x, y)
    {
        if (y === undefined) { y = x; }

        this.ops.speedX.onChange(x);

        if (x === y)
        {
            this.ops.speedY.active = false;
        }
        else
        {
            this.ops.speedY.onChange(y);
        }

        //  If you specify speedX and Y then it changes the emitter from radial to a point emitter
        this.radial = true;

        return this;
    },

    /**
     * Sets the vertical and horizontal scale of the emitted particles.
     *
     * You can also set the scale of the entire emitter via `setScale`.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#setParticleScale
     * @since 3.60.0
     *
     * @param {number} [x=1] - The horizontal scale of the emitted Particles.
     * @param {number} [y=x] - The vertical scale of emitted Particles. If not set it will use the `x` value.
     *
     * @return {this} This Particle Emitter.
     */
    setParticleScale: function (x, y)
    {
        if (x === undefined) { x = 1; }
        if (y === undefined) { y = x; }

        this.ops.scaleX.onChange(x);
        this.ops.scaleY.onChange(y);

        return this;
    },

    /**
     * Sets the gravity applied to emitted particles.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#setParticleGravity
     * @since 3.60.0
     *
     * @param {number} x - Horizontal acceleration due to gravity, in pixels per second squared. Set to zero for no gravity.
     * @param {number} y - Vertical acceleration due to gravity, in pixels per second squared. Set to zero for no gravity.
     *
     * @return {this} This Particle Emitter.
     */
    setParticleGravity: function (x, y)
    {
        this.gravityX = x;
        this.gravityY = y;

        return this;
    },

    /**
     * Sets the opacity (alpha) of emitted particles.
     *
     * You can also set the alpha of the entire emitter via `setAlpha`.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#setParticleAlpha
     * @since 3.60.0
     *
     * @param {(Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType|Phaser.Types.GameObjects.Particles.EmitterOpOnUpdateType)} value - A value between 0 (transparent) and 1 (opaque).
     *
     * @return {this} This Particle Emitter.
     */
    setParticleAlpha: function (value)
    {
        this.ops.alpha.onChange(value);

        return this;
    },

    /**
     * Sets the color tint of emitted particles.
     *
     * This is a WebGL only feature.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#setParticleTint
     * @since 3.60.0
     * @webglOnly
     *
     * @param {(Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType|Phaser.Types.GameObjects.Particles.EmitterOpOnUpdateType)} value - A value between 0 and 0xffffff.
     *
     * @return {this} This Particle Emitter.
     */
    setParticleTint: function (value)
    {
        this.ops.tint.onChange(value);

        return this;
    },

    /**
     * Sets the angle of a {@link Phaser.GameObjects.Particles.ParticleEmitter#radial} particle stream.
     *
     * The value is given in degrees using Phaser's right-handed coordinate system.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#setEmitterAngle
     * @since 3.0.0
     *
     * @param {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType} value - The angle of the initial velocity of emitted particles, in degrees.
     *
     * @return {this} This Particle Emitter.
     */
    setEmitterAngle: function (value)
    {
        this.ops.angle.onChange(value);

        return this;
    },

    /**
     * Sets the lifespan of newly emitted particles in milliseconds.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#setParticleLifespan
     * @since 3.60.0
     *
     * @param {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType} value - The lifespan of a particle, in ms.
     *
     * @return {this} This Particle Emitter.
     */
    setParticleLifespan: function (value)
    {
        this.ops.lifespan.onChange(value);

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
     * A single Death Zone instance can only exist once within this Emitter, but can belong
     * to multiple Emitters.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#addDeathZone
     * @since 3.60.0
     *
     * @param {Phaser.Types.GameObjects.Particles.DeathZoneObject|Phaser.Types.GameObjects.Particles.DeathZoneObject[]} config - A Death Zone configuration object, a Death Zone instance, a valid Geometry object or an array of them.
     *
     * @return {Phaser.GameObjects.Particles.Zones.DeathZone[]} An array of the Death Zones that were added to this Emitter.
     */
    addDeathZone: function (config)
    {
        if (!Array.isArray(config))
        {
            config = [ config ];
        }

        var zone;
        var output = [];

        for (var i = 0; i < config.length; i++)
        {
            zone = config[i];

            if (zone instanceof DeathZone)
            {
                output.push(zone);
            }
            else if (typeof zone.contains === 'function')
            {
                zone = new DeathZone(zone, true);

                output.push(zone);
            }
            else
            {
                var type = GetFastValue(zone, 'type', 'onEnter');
                var source = GetFastValue(zone, 'source', null);

                if (source && typeof source.contains === 'function')
                {
                    var killOnEnter = (type === 'onEnter') ? true : false;

                    zone = new DeathZone(source, killOnEnter);

                    output.push(zone);
                }
            }
        }

        this.deathZones = this.deathZones.concat(output);

        return output;
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
     * Clear all Death Zones from this Particle Emitter.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#clearDeathZones
     * @since 3.70.0
     *
     * @return {this} This Particle Emitter.
     */
    clearDeathZones: function ()
    {
        this.deathZones.length = 0;

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
     * Its {@link Phaser.GameObjects.Particles.Zones.RandomZone#source source} can be a Circle, Ellipse, Line, Polygon, Rectangle, or Triangle; or any object with a suitable {@link Phaser.Types.GameObjects.Particles.RandomZoneSourceCallback getRandomPoint} method.
     *
     * An Emission Zone can only exist once within this Emitter.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#addEmitZone
     * @since 3.60.0
     *
     * @param {Phaser.Types.GameObjects.Particles.EmitZoneData|Phaser.Types.GameObjects.Particles.EmitZoneData[]} zone - An Emission Zone configuration object, a RandomZone or EdgeZone instance, or an array of them.
     *
     * @return {Phaser.Types.GameObjects.Particles.EmitZoneObject[]} An array of the Emission Zones that were added to this Emitter.
     */
    addEmitZone: function (config)
    {
        if (!Array.isArray(config))
        {
            config = [ config ];
        }

        var zone;
        var output = [];

        for (var i = 0; i < config.length; i++)
        {
            zone = config[i];

            if (zone instanceof RandomZone || zone instanceof EdgeZone)
            {
                output.push(zone);
            }
            else
            {
                //  Where source = Geom like Circle, or a Path or Curve
                //  emitZone: { type: 'random', source: X }
                //  emitZone: { type: 'edge', source: X, quantity: 32, [stepRate=0], [yoyo=false], [seamless=true], [total=1] }

                var source = GetFastValue(zone, 'source', null);

                if (source)
                {
                    var type = GetFastValue(zone, 'type', 'random');

                    if (type === 'random' && typeof source.getRandomPoint === 'function')
                    {
                        zone = new RandomZone(source);

                        output.push(zone);
                    }
                    else if (type === 'edge' && typeof source.getPoints === 'function')
                    {
                        var quantity = GetFastValue(zone, 'quantity', 1);
                        var stepRate = GetFastValue(zone, 'stepRate', 0);
                        var yoyo = GetFastValue(zone, 'yoyo', false);
                        var seamless = GetFastValue(zone, 'seamless', true);
                        var total = GetFastValue(zone, 'total', -1);

                        zone = new EdgeZone(source, quantity, stepRate, yoyo, seamless, total);

                        output.push(zone);
                    }
                }
            }
        }

        this.emitZones = this.emitZones.concat(output);

        return output;
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
     * Clear all Emission Zones from this Particle Emitter.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#clearEmitZones
     * @since 3.70.0
     *
     * @return {this} This Particle Emitter.
     */
    clearEmitZones: function ()
    {
        this.emitZones.length = 0;

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

                if (this.zoneTotal === zone.total)
                {
                    this.zoneTotal = 0;

                    this.zoneIndex++;

                    if (this.zoneIndex === len)
                    {
                        this.zoneIndex = 0;
                    }
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
            var zone = zones[i];

            if (zone.willKill(particle))
            {
                this.emit(Events.DEATH_ZONE, this, particle, zone);

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
     * Adds a Particle Processor, such as a Gravity Well, to this Emitter.
     *
     * It will start processing particles from the next update as long as its `active`
     * property is set.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#addParticleProcessor
     * @since 3.60.0
     *
     * @generic {Phaser.GameObjects.Particles.ParticleProcessor} T
     * @param {T} processor - The Particle Processor to add to this Emitter Manager.
     *
     * @return {T} The Particle Processor that was added to this Emitter Manager.
     */
    addParticleProcessor: function (processor)
    {
        if (!this.processors.exists(processor))
        {
            if (processor.emitter)
            {
                processor.emitter.removeParticleProcessor(processor);
            }

            this.processors.add(processor);

            processor.emitter = this;
        }

        return processor;
    },

    /**
     * Removes a Particle Processor from this Emitter.
     *
     * The Processor must belong to this Emitter to be removed.
     *
     * It is not destroyed when removed, allowing you to move it to another Emitter Manager,
     * so if you no longer require it you should call its `destroy` method directly.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#removeParticleProcessor
     * @since 3.60.0
     *
     * @generic {Phaser.GameObjects.Particles.ParticleProcessor} T
     * @param {T} processor - The Particle Processor to remove from this Emitter Manager.
     *
     * @return {?T} The Particle Processor that was removed, or null if it could not be found.
     */
    removeParticleProcessor: function (processor)
    {
        if (this.processors.exists(processor))
        {
            this.processors.remove(processor, true);

            processor.emitter = null;
        }

        return processor;
    },

    /**
     * Gets all active Particle Processors.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#getProcessors
     * @since 3.60.0
     *
     * @return {Phaser.GameObjects.Particles.ParticleProcessor[]} - An array of active Particle Processors.
     */
    getProcessors: function ()
    {
        return this.processors.getAll('active', true);
    },

    /**
     * Creates a new Gravity Well, adds it to this Emitter and returns a reference to it.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#createGravityWell
     * @since 3.60.0
     *
     * @param {Phaser.Types.GameObjects.Particles.GravityWellConfig} config - Configuration settings for the Gravity Well to create.
     *
     * @return {Phaser.GameObjects.Particles.GravityWell} The Gravity Well that was created.
     */
    createGravityWell: function (config)
    {
        return this.addParticleProcessor(new GravityWell(config));
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
     * @param {number} count - The number of particles to create.
     *
     * @return {this} This Particle Emitter.
     */
    reserve: function (count)
    {
        var dead = this.dead;

        if (this.maxParticles > 0)
        {
            var total = this.getParticleCount();

            if (total + count > this.maxParticles)
            {
                count = this.maxParticles - (total + count);
            }
        }

        for (var i = 0; i < count; i++)
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
     * This particles are killed but do not emit an event or callback.
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
     * @param {*} context - The functions calling context.
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
     * @param {*} context - The functions calling context.
     *
     * @return {this} This Particle Emitter.
     */
    forEachDead: function (callback, context)
    {
        var dead = this.dead;
        var length = dead.length;

        for (var i = 0; i < length; i++)
        {
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
     * Turns {@link Phaser.GameObjects.Particles.ParticleEmitter#emitting off} the emitter and
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
     * @return {(Phaser.GameObjects.Particles.Particle|undefined)} The most recently emitted Particle, or `undefined` if the emitter is at its limit.
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
     * @return {(Phaser.GameObjects.Particles.Particle|undefined)} The most recently emitted Particle, or `undefined` if the emitter is at its limit.
     */
    emitParticleAt: function (x, y, count)
    {
        return this.emitParticle(count, x, y);
    },

    /**
     * Emits particles at a given position (or the emitters current position).
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#emitParticle
     * @since 3.0.0
     *
     * @param {number} [count=this.quantity] - The number of Particles to emit.
     * @param {number} [x=this.x] - The x coordinate to emit the Particles from.
     * @param {number} [y=this.x] - The y coordinate to emit the Particles from.
     *
     * @return {(Phaser.GameObjects.Particles.Particle|undefined)} The most recently emitted Particle, or `undefined` if the emitter is at its limit.
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

            if (particle.fire(followX, followY))
            {
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
            }
            else
            {
                this.dead.push(particle);
            }

            if (stopAfter > 0)
            {
                this.stopCounter++;

                if (this.stopCounter >= stopAfter)
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

        this.getWorldTransformMatrix(this.worldMatrix);

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

        if (!this.emitting && !this.skipping)
        {
            if (this.completeFlag === 1 && particles.length === 0)
            {
                this.completeFlag = 0;

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
            this.flowCounter -= delta;

            while (this.flowCounter <= 0)
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
                this.elapsed += delta;

                if (this.elapsed >= this.duration)
                {
                    this.stop();
                }
            }

            if (this.stopAfter > 0 && this.stopCounter >= this.stopAfter)
            {
                this.stop();
            }
        }
    },

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
     * Prints a warning to the console if you mistakenly call this function
     * thinking it works the same way as Phaser v3.55.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#createEmitter
     * @since 3.60.0
     */
    createEmitter: function ()
    {
        throw new Error('createEmitter removed. See ParticleEmitter docs for info');
    },

    /**
     * The x coordinate the particles are emitted from.
     *
     * This is relative to the Emitters x coordinate and that of any parent.
     *
     * Accessing this property should typically return a number.
     * However, it can be set to any valid EmitterOp onEmit type.
     *
     * @name Phaser.GameObjects.Particles.ParticleEmitter#particleX
     * @type {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType|Phaser.Types.GameObjects.Particles.EmitterOpOnUpdateType}
     * @since 3.60.0
     */
    particleX: {

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
     * This is relative to the Emitters x coordinate and that of any parent.
     *
     * Accessing this property should typically return a number.
     * However, it can be set to any valid EmitterOp onEmit type.
     *
     * @name Phaser.GameObjects.Particles.ParticleEmitter#particleY
     * @type {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType|Phaser.Types.GameObjects.Particles.EmitterOpOnUpdateType}
     * @since 3.60.0
     */
    particleY: {

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
     * The initial speed of emitted particles, in pixels per second.
     *
     * If using this as a getter it will return the `speedX` value.
     *
     * If using it as a setter it will update both `speedX` and `speedY` to the
     * given value.
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
     * This is relative to the Emitters scale and that of any parent.
     *
     * Accessing this property should typically return a number.
     * However, it can be set to any valid EmitterOp onEmit type.
     *
     * @name Phaser.GameObjects.Particles.ParticleEmitter#particleScaleX
     * @type {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType}
     * @since 3.60.0
     */
    particleScaleX: {

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
     * This is relative to the Emitters scale and that of any parent.
     *
     * Accessing this property should typically return a number.
     * However, it can be set to any valid EmitterOp onEmit type.
     *
     * @name Phaser.GameObjects.Particles.ParticleEmitter#particleScaleY
     * @type {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType}
     * @since 3.60.0
     */
    particleScaleY: {

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
     * Modify the `ParticleEmitter.tintFill` property to change between
     * an additive and replacement tint mode.
     *
     * When you define the color via the Emitter config you should give
     * it as an array of color values. The Particle will then interpolate
     * through these colors over the course of its lifespan. Setting this
     * will override any `tint` value that may also be given.
     *
     * This is a WebGL only feature.
     *
     * Accessing this property should typically return a number.
     * However, it can be set to any valid EmitterOp onEmit type.
     *
     * @name Phaser.GameObjects.Particles.ParticleEmitter#particleColor
     * @type {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType}
     * @since 3.60.0
     */
    particleColor: {

        get: function ()
        {
            return this.ops.color.current;
        },

        set: function (value)
        {
            this.ops.color.onChange(value);
        }

    },

    /**
     * Controls the easing function used when you have created an
     * Emitter that uses the `color` property to interpolate the
     * tint of Particles over their lifetime.
     *
     * Setting this has no effect if you haven't also applied a
     * `particleColor` to this Emitter.
     *
     * @name Phaser.GameObjects.Particles.ParticleEmitter#colorEase
     * @type {string}
     * @since 3.60.0
     */
    colorEase: {

        get: function ()
        {
            return this.ops.color.easeName;
        },

        set: function (value)
        {
            this.ops.color.setEase(value);
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
     * Modify the `ParticleEmitter.tintFill` property to change between
     * an additive and replacement tint mode.
     *
     * The `tint` value will be overriden if a `color` array is provided.
     *
     * This is a WebGL only feature.
     *
     * Accessing this property should typically return a number.
     * However, it can be set to any valid EmitterOp onEmit type.
     *
     * @name Phaser.GameObjects.Particles.ParticleEmitter#particleTint
     * @type {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType}
     * @since 3.60.0
     */
    particleTint: {

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
     * @name Phaser.GameObjects.Particles.ParticleEmitter#particleAlpha
     * @type {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType}
     * @since 3.60.0
     */
    particleAlpha: {

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
     * The angle at which the particles are emitted. The values are
     * given in degrees. This allows you to control the direction
     * of the emitter. If you wish instead to change the rotation
     * of the particles themselves, see the `particleRotate` property.
     *
     * Accessing this property should typically return a number.
     * However, it can be set to any valid EmitterOp onEmit type.
     *
     * @name Phaser.GameObjects.Particles.ParticleEmitter#particleAngle
     * @type {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType}
     * @since 3.60.0
     */
    particleAngle: {

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
     * The rotation (or angle) of each particle when it is emitted.
     * The value is given in degrees and uses a right-handed
     * coordinate system, where 0 degrees points to the right, 90 degrees
     * points down and -90 degrees points up.
     *
     * Accessing this property should typically return a number.
     * However, it can be set to any valid EmitterOp onEmit type.
     *
     * @name Phaser.GameObjects.Particles.ParticleEmitter#particleRotate
     * @type {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType}
     * @since 3.60.0
     */
    particleRotate: {

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
     * the particles start updating. This allows you to emit particles
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
     * The number of milliseconds to wait after a particle has finished
     * its life before it will be removed. This allows you to 'hold' a
     * particle on the screen once it has reached its final state
     * before it then vanishes.
     *
     * Note that all particle updates will cease, including changing
     * alpha, scale, movement or animation.
     *
     * Accessing this property should typically return a number.
     * However, it can be set to any valid EmitterOp onEmit type.
     *
     * @name Phaser.GameObjects.Particles.ParticleEmitter#hold
     * @type {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType}
     * @since 3.60.0
     */
    hold: {

        get: function ()
        {
            return this.ops.hold.current;
        },

        set: function (value)
        {
            this.ops.hold.onChange(value);
        }

    },

    /**
     * The internal flow counter.
     *
     * Treat this property as read-only.
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
     * Treat this property as read-only.
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
     * The internal animation counter.
     *
     * Treat this property as read-only.
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
     * The internal elasped counter.
     *
     * Treat this property as read-only.
     *
     * @name Phaser.GameObjects.Particles.ParticleEmitter#elapsed
     * @type {number}
     * @since 3.60.0
     */
    elapsed: {

        get: function ()
        {
            return this.counters[3];
        },

        set: function (value)
        {
            this.counters[3] = value;
        }

    },

    /**
     * The internal stop counter.
     *
     * Treat this property as read-only.
     *
     * @name Phaser.GameObjects.Particles.ParticleEmitter#stopCounter
     * @type {number}
     * @since 3.60.0
     */
    stopCounter: {

        get: function ()
        {
            return this.counters[4];
        },

        set: function (value)
        {
            this.counters[4] = value;
        }

    },

    /**
     * The internal complete flag.
     *
     * Treat this property as read-only.
     *
     * @name Phaser.GameObjects.Particles.ParticleEmitter#completeFlag
     * @type {boolean}
     * @since 3.60.0
     */
    completeFlag: {

        get: function ()
        {
            return this.counters[5];
        },

        set: function (value)
        {
            this.counters[5] = value;
        }

    },

    /**
     * The internal zone index.
     *
     * Treat this property as read-only.
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
     * The internal zone total.
     *
     * Treat this property as read-only.
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
     * The current frame index.
     *
     * Treat this property as read-only.
     *
     * @name Phaser.GameObjects.Particles.ParticleEmitter#currentFrame
     * @type {number}
     * @since 3.60.0
     */
    currentFrame: {

        get: function ()
        {
            return this.counters[8];
        },

        set: function (value)
        {
            this.counters[8] = value;
        }

    },

    /**
     * The current animation index.
     *
     * Treat this property as read-only.
     *
     * @name Phaser.GameObjects.Particles.ParticleEmitter#currentAnim
     * @type {number}
     * @since 3.60.0
     */
    currentAnim: {

        get: function ()
        {
            return this.counters[9];
        },

        set: function (value)
        {
            this.counters[9] = value;
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
        this.texture = null;
        this.frames = null;
        this.anims = null;
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

        for (i = 0; i < this.alive.length; i++)
        {
            this.alive[i].destroy();
        }

        for (i = 0; i < this.dead.length; i++)
        {
            this.dead[i].destroy();
        }

        this.ops = null;
        this.alive = [];
        this.dead = [];
        this.worldMatrix.destroy();
    }

});

module.exports = ParticleEmitter;
