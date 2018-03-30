/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var BlendModes = require('../../renderer/BlendModes');
var Class = require('../../utils/Class');
var Components = require('../components');
var DeathZone = require('./zones/DeathZone');
var EdgeZone = require('./zones/EdgeZone');
var EmitterOp = require('./EmitterOp');
var GetFastValue = require('../../utils/object/GetFastValue');
var GetRandomElement = require('../../utils/array/GetRandomElement');
var HasAny = require('../../utils/object/HasAny');
var HasValue = require('../../utils/object/HasValue');
var Particle = require('./Particle');
var RandomZone = require('./zones/RandomZone');
var Rectangle = require('../../geom/rectangle/Rectangle');
var StableSort = require('../../utils/array/StableSort');
var Vector2 = require('../../math/Vector2');
var Wrap = require('../../math/Wrap');

/**
 * @callback ParticleEmitterCallback
 *
 * @param {Phaser.GameObjects.Particles.Particle} particle - [description]
 * @param {Phaser.GameObjects.Particles.ParticleEmitter} emitter - [description]
 */

/**
 * @callback ParticleDeathCallback
 *
 * @param {Phaser.GameObjects.Particles.Particle} particle - [description]
 */

/**
 * @classdesc
 * [description]
 *
 * @class ParticleEmitter
 * @memberOf Phaser.GameObjects.Particles
 * @constructor
 * @since 3.0.0
 *
 * @extends Phaser.GameObjects.Components.BlendMode
 * @extends Phaser.GameObjects.Components.ScrollFactor
 * @extends Phaser.GameObjects.Components.Visible
 *
 * @param {Phaser.GameObjects.Particles.ParticleEmitterManager} manager - The Emitter Manager this Emitter belongs to.
 * @param {object} config - [description]
 */
var ParticleEmitter = new Class({

    Mixins: [
        Components.BlendMode,
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
         * [description]
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#texture
         * @type {Phaser.Textures.Texture}
         * @since 3.0.0
         */
        this.texture = manager.texture;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#frames
         * @type {Phaser.Textures.Frame[]}
         * @since 3.0.0
         */
        this.frames = [ manager.defaultFrame ];

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#defaultFrame
         * @type {Phaser.Textures.Frame}
         * @since 3.0.0
         */
        this.defaultFrame = manager.defaultFrame;

        /**
         * [description]
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
         * [description]
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#configOpMap
         * @type {object}
         * @since 3.0.0
         */
        this.configOpMap = [
            'accelerationX',
            'accelerationY',
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
         * The name of this Game Object.
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
         * @since 3.0.0
         */
        this.particleClass = Particle;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#x
         * @type {number}
         * @since 3.0.0
         */
        this.x = new EmitterOp(config, 'x', 0);

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#y
         * @type {number}
         * @since 3.0.0
         */
        this.y = new EmitterOp(config, 'y', 0);

        /**
         * A radial emitter will emit particles in all directions between angle min and max,
         * using speed as the value. If set to false then this acts as a point Emitter.
         * A point emitter will emit particles only in the direction derived from the speedX and speedY values.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#radial
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.radial = true;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#gravityX
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.gravityX = 0;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#gravityY
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.gravityY = 0;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#acceleration
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.acceleration = false;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#accelerationX
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.accelerationX = new EmitterOp(config, 'accelerationX', 0, true);

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#accelerationY
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.accelerationY = new EmitterOp(config, 'accelerationY', 0, true);

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#maxVelocityX
         * @type {number}
         * @default 10000
         * @since 3.0.0
         */
        this.maxVelocityX = new EmitterOp(config, 'maxVelocityX', 10000, true);

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#maxVelocityY
         * @type {number}
         * @default 10000
         * @since 3.0.0
         */
        this.maxVelocityY = new EmitterOp(config, 'maxVelocityY', 10000, true);

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#speedX
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.speedX = new EmitterOp(config, 'speedX', 0, true);

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#speedY
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.speedY = new EmitterOp(config, 'speedY', 0, true);

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#moveTo
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.moveTo = false;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#moveToX
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.moveToX = new EmitterOp(config, 'moveToX', 0, true);

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#moveToY
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.moveToY = new EmitterOp(config, 'moveToY', 0, true);

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#bounce
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.bounce = new EmitterOp(config, 'bounce', 0, true);

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#scaleX
         * @type {float}
         * @default 1
         * @since 3.0.0
         */
        this.scaleX = new EmitterOp(config, 'scaleX', 1);

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#scaleY
         * @type {float}
         * @default 1
         * @since 3.0.0
         */
        this.scaleY = new EmitterOp(config, 'scaleY', 1);

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#tint
         * @type {integer}
         * @since 3.0.0
         */
        this.tint = new EmitterOp(config, 'tint', 0xffffffff);

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#alpha
         * @type {float}
         * @default 1
         * @since 3.0.0
         */
        this.alpha = new EmitterOp(config, 'alpha', 1);

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#lifespan
         * @type {number}
         * @default 1000
         * @since 3.0.0
         */
        this.lifespan = new EmitterOp(config, 'lifespan', 1000);

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#angle
         * @type {number}
         * @since 3.0.0
         */
        this.angle = new EmitterOp(config, 'angle', { min: 0, max: 360 });

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#rotate
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.rotate = new EmitterOp(config, 'rotate', 0);

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#emitCallback
         * @type {?ParticleEmitterCallback}
         * @default null
         * @since 3.0.0
         */
        this.emitCallback = null;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#emitCallbackScope
         * @type {?*}
         * @default null
         * @since 3.0.0
         */
        this.emitCallbackScope = null;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#deathCallback
         * @type {?ParticleDeathCallback}
         * @default null
         * @since 3.0.0
         */
        this.deathCallback = null;

        /**
         * [description]
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
         * How many particles are emitted each time the emitter updates.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#quantity
         * @type {number}
         * @default 1
         * @since 3.0.0
         */
        this.quantity = new EmitterOp(config, 'quantity', 1, true);

        /**
         * How many ms to wait after emission before the particles start updating.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#delay
         * @type {number}
         * @default 1
         * @since 3.0.0
         */
        this.delay = new EmitterOp(config, 'delay', 0, true);

        /**
         * How often a particle is emitted in ms (if emitter is a constant / flow emitter)
         * If emitter is an explosion emitter this value will be -1.
         * Anything > -1 sets this to be a flow emitter.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#frequency
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.frequency = 0;

        /**
         * Controls if the emitter is currently emitting particles.
         * Already alive particles will continue to update until they expire.
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
         * [description]
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#timeScale
         * @type {number}
         * @default 1
         * @since 3.0.0
         */
        this.timeScale = 1;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#emitZone
         * @type {?object}
         * @default null
         * @since 3.0.0
         */
        this.emitZone = null;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#deathZone
         * @type {?object}
         * @default null
         * @since 3.0.0
         */
        this.deathZone = null;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#bounds
         * @type {?Phaser.Geom.Rectangle}
         * @default null
         * @since 3.0.0
         */
        this.bounds = null;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#collideLeft
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.collideLeft = true;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#collideRight
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.collideRight = true;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#collideTop
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.collideTop = true;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#collideBottom
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.collideBottom = true;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#active
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.active = true;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#visible
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.visible = true;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#blendMode
         * @type {integer}
         * @since 3.0.0
         */
        this.blendMode = BlendModes.NORMAL;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#follow
         * @type {?Phaser.GameObjects.Particles.Particle}
         * @default null
         * @since 3.0.0
         */
        this.follow = null;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#followOffset
         * @type {Phaser.Math.Vector2}
         * @since 3.0.0
         */
        this.followOffset = new Vector2();

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#trackVisible
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.trackVisible = false;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#currentFrame
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.currentFrame = 0;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#randomFrame
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.randomFrame = true;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#frameQuantity
         * @type {number}
         * @default 1
         * @since 3.0.0
         */
        this.frameQuantity = 1;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#dead
         * @type {Phaser.GameObjects.Particles.Particle[]}
         * @private
         * @since 3.0.0
         */
        this.dead = [];

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#alive
         * @type {Phaser.GameObjects.Particles.Particle[]}
         * @private
         * @since 3.0.0
         */
        this.alive = [];

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitter#_counter
         * @type {number}
         * @private
         * @default 0
         * @since 3.0.0
         */
        this._counter = 0;

        /**
         * [description]
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
     * [description]
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#fromJSON
     * @since 3.0.0
     *
     * @param {object} config - [description]
     *
     * @return {Phaser.GameObjects.Particles.ParticleEmitter} This Particle Emitter.
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

        //  If you specify speedX, speedY ot moveTo then it changes the emitter from radial to a point emitter
        if (HasAny(config, [ 'speedX', 'speedY' ]) || this.moveTo)
        {
            this.radial = false;
        }

        //  Special 'scale' override

        if (HasValue(config, 'scale'))
        {
            this.scaleX.loadConfig(config, 'scale');
            this.scaleY = null;
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

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#toJSON
     * @since 3.0.0
     *
     * @param {object} output - [description]
     *
     * @return {object} [description]
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

        if (!this.scaleY)
        {
            delete output.scaleX;
            output.scale = this.scaleX.toJSON();
        }

        return output;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#startFollow
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Particles.Particle} target - [description]
     * @param {number} [offsetX=0] - [description]
     * @param {number} [offsetY=0] - [description]
     * @param {boolean} [trackVisible=false] - [description]
     *
     * @return {Phaser.GameObjects.Particles.ParticleEmitter} This Particle Emitter.
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
     * [description]
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#stopFollow
     * @since 3.0.0
     *
     * @return {Phaser.GameObjects.Particles.ParticleEmitter} This Particle Emitter.
     */
    stopFollow: function ()
    {
        this.follow = null;
        this.followOffset.set(0, 0);
        this.trackVisible = false;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#getFrame
     * @since 3.0.0
     *
     * @return {Phaser.Textures.Frame} [description]
     */
    getFrame: function ()
    {
        if (this.frames.length === 1)
        {
            return this.defaultFrame;
        }
        else if (this.randomFrame)
        {
            return GetRandomElement(this.frames);
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
     * [description]
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#setFrame
     * @since 3.0.0
     *
     * @param {(array|string|integer|object)} frames - [description]
     * @param {boolean} [pickRandom=true] - [description]
     * @param {integer} [quantity=1] - [description]
     *
     * @return {Phaser.GameObjects.Particles.ParticleEmitter} This Particle Emitter.
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
     * [description]
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#setRadial
     * @since 3.0.0
     *
     * @param {boolean} value - [description]
     *
     * @return {Phaser.GameObjects.Particles.ParticleEmitter} This Particle Emitter.
     */
    setRadial: function (value)
    {
        if (value === undefined) { value = true; }

        this.radial = value;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#setPosition
     * @since 3.0.0
     *
     * @param {number} x - [description]
     * @param {number} y - [description]
     *
     * @return {Phaser.GameObjects.Particles.ParticleEmitter} This Particle Emitter.
     */
    setPosition: function (x, y)
    {
        this.x.onChange(x);
        this.y.onChange(y);

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#setBounds
     * @since 3.0.0
     *
     * @param {(number|object)} x - [description]
     * @param {number} y - [description]
     * @param {number} width - [description]
     * @param {number} height - [description]
     *
     * @return {Phaser.GameObjects.Particles.ParticleEmitter} This Particle Emitter.
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
     * [description]
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#setSpeedX
     * @since 3.0.0
     *
     * @param {number} value - [description]
     *
     * @return {Phaser.GameObjects.Particles.ParticleEmitter} This Particle Emitter.
     */
    setSpeedX: function (value)
    {
        this.speedX.onChange(value);

        //  If you specify speedX and Y then it changes the emitter from radial to a point emitter
        this.radial = false;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#setSpeedY
     * @since 3.0.0
     *
     * @param {number} value - [description]
     *
     * @return {Phaser.GameObjects.Particles.ParticleEmitter} This Particle Emitter.
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
     * [description]
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#setSpeed
     * @since 3.0.0
     *
     * @param {number} value - [description]
     *
     * @return {Phaser.GameObjects.Particles.ParticleEmitter} This Particle Emitter.
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
     * [description]
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#setScaleX
     * @since 3.0.0
     *
     * @param {number} value - [description]
     *
     * @return {Phaser.GameObjects.Particles.ParticleEmitter} This Particle Emitter.
     */
    setScaleX: function (value)
    {
        this.scaleX.onChange(value);

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#setScaleY
     * @since 3.0.0
     *
     * @param {number} value - [description]
     *
     * @return {Phaser.GameObjects.Particles.ParticleEmitter} This Particle Emitter.
     */
    setScaleY: function (value)
    {
        this.scaleY.onChange(value);

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#setScale
     * @since 3.0.0
     *
     * @param {number} value - [description]
     *
     * @return {Phaser.GameObjects.Particles.ParticleEmitter} This Particle Emitter.
     */
    setScale: function (value)
    {
        this.scaleX.onChange(value);
        this.scaleY = null;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#setGravityX
     * @since 3.0.0
     *
     * @param {number} value - [description]
     *
     * @return {Phaser.GameObjects.Particles.ParticleEmitter} This Particle Emitter.
     */
    setGravityX: function (value)
    {
        this.gravityX = value;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#setGravityY
     * @since 3.0.0
     *
     * @param {number} value - [description]
     *
     * @return {Phaser.GameObjects.Particles.ParticleEmitter} This Particle Emitter.
     */
    setGravityY: function (value)
    {
        this.gravityY = value;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#setGravity
     * @since 3.0.0
     *
     * @param {number} x - [description]
     * @param {number} y - [description]
     *
     * @return {Phaser.GameObjects.Particles.ParticleEmitter} This Particle Emitter.
     */
    setGravity: function (x, y)
    {
        this.gravityX = x;
        this.gravityY = y;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#setAlpha
     * @since 3.0.0
     *
     * @param {float} value - [description]
     *
     * @return {Phaser.GameObjects.Particles.ParticleEmitter} This Particle Emitter.
     */
    setAlpha: function (value)
    {
        this.alpha.onChange(value);

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#setEmitterAngle
     * @since 3.0.0
     *
     * @param {number} value - [description]
     *
     * @return {Phaser.GameObjects.Particles.ParticleEmitter} This Particle Emitter.
     */
    setEmitterAngle: function (value)
    {
        this.angle.onChange(value);

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#setAngle
     * @since 3.0.0
     *
     * @param {number} value - [description]
     *
     * @return {Phaser.GameObjects.Particles.ParticleEmitter} This Particle Emitter.
     */
    setAngle: function (value)
    {
        this.angle.onChange(value);

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#setLifespan
     * @since 3.0.0
     *
     * @param {number} value - [description]
     *
     * @return {Phaser.GameObjects.Particles.ParticleEmitter} This Particle Emitter.
     */
    setLifespan: function (value)
    {
        this.lifespan.onChange(value);

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#setQuantity
     * @since 3.0.0
     *
     * @param {integer} quantity - [description]
     *
     * @return {Phaser.GameObjects.Particles.ParticleEmitter} This Particle Emitter.
     */
    setQuantity: function (quantity)
    {
        this.quantity.onChange(quantity);

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#setFrequency
     * @since 3.0.0
     *
     * @param {number} frequency - [description]
     * @param {integer} [quantity] - [description]
     *
     * @return {Phaser.GameObjects.Particles.ParticleEmitter} This Particle Emitter.
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
     * The zone must have a function called `getPoint` that takes a particle object and sets
     * its x and y properties accordingly then returns that object.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#setEmitZone
     * @since 3.0.0
     *
     * @param {object} [zoneConfig] - [description]
     *
     * @return {Phaser.GameObjects.Particles.ParticleEmitter} This Particle Emitter.
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

            if (source && typeof source.getPoint === 'function')
            {
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
        }

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#setDeathZone
     * @since 3.0.0
     *
     * @param {object} [zoneConfig] - [description]
     *
     * @return {Phaser.GameObjects.Particles.ParticleEmitter} This Particle Emitter.
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
     * [description]
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#reserve
     * @since 3.0.0
     *
     * @param {integer} particleCount - [description]
     *
     * @return {Phaser.GameObjects.Particles.ParticleEmitter} This Particle Emitter.
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
     * [description]
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#getAliveParticleCount
     * @since 3.0.0
     *
     * @return {integer} The number of currently alive Particles in this Emitter.
     */
    getAliveParticleCount: function ()
    {
        return this.alive.length;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#getDeadParticleCount
     * @since 3.0.0
     *
     * @return {integer} The number of currently dead Particles in this Emitter.
     */
    getDeadParticleCount: function ()
    {
        return this.dead.length;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#getParticleCount
     * @since 3.0.0
     *
     * @return {integer} The number of Particles in this Emitter, including both alive and dead.
     */
    getParticleCount: function ()
    {
        return this.getAliveParticleCount() + this.getDeadParticleCount();
    },

    /**
     * [description]
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
     * [description]
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#onParticleEmit
     * @since 3.0.0
     *
     * @param {ParticleEmitterCallback} callback - [description]
     * @param {*} [context] - [description]
     *
     * @return {Phaser.GameObjects.Particles.ParticleEmitter} This Particle Emitter.
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
     * [description]
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#onParticleDeath
     * @since 3.0.0
     *
     * @param {ParticleDeathCallback} callback - [description]
     * @param {*} [context] - [description]
     *
     * @return {Phaser.GameObjects.Particles.ParticleEmitter} This Particle Emitter.
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
     * [description]
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#killAll
     * @since 3.0.0
     *
     * @return {Phaser.GameObjects.Particles.ParticleEmitter} This Particle Emitter.
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
     * [description]
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#forEachAlive
     * @since 3.0.0
     *
     * @param {ParticleEmitterCallback} callback - [description]
     * @param {*} thisArg - [description]
     *
     * @return {Phaser.GameObjects.Particles.ParticleEmitter} This Particle Emitter.
     */
    forEachAlive: function (callback, thisArg)
    {
        var alive = this.alive;
        var length = alive.length;

        for (var index = 0; index < length; ++index)
        {
            //  Sends the Particle and the Emitter
            callback.call(thisArg, alive[index], this);
        }

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#forEachDead
     * @since 3.0.0
     *
     * @param {ParticleEmitterCallback} callback - [description]
     * @param {*} thisArg - [description]
     *
     * @return {Phaser.GameObjects.Particles.ParticleEmitter} This Particle Emitter.
     */
    forEachDead: function (callback, thisArg)
    {
        var dead = this.dead;
        var length = dead.length;

        for (var index = 0; index < length; ++index)
        {
            //  Sends the Particle and the Emitter
            callback.call(thisArg, dead[index], this);
        }

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#start
     * @since 3.0.0
     *
     * @return {Phaser.GameObjects.Particles.ParticleEmitter} This Particle Emitter.
     */
    start: function ()
    {
        this.on = true;

        this._counter = 0;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#pause
     * @since 3.0.0
     *
     * @return {Phaser.GameObjects.Particles.ParticleEmitter} This Particle Emitter.
     */
    pause: function ()
    {
        this.active = false;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#resume
     * @since 3.0.0
     *
     * @return {Phaser.GameObjects.Particles.ParticleEmitter} This Particle Emitter.
     */
    resume: function ()
    {
        this.active = true;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#depthSort
     * @since 3.0.0
     *
     * @return {Phaser.GameObjects.Particles.ParticleEmitter} This Particle Emitter.
     */
    depthSort: function ()
    {
        StableSort.inplace(this.alive, this.depthSortCallback);

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#flow
     * @since 3.0.0
     *
     * @param {number} frequency - [description]
     * @param {integer} [count=1] - [description]
     *
     * @return {Phaser.GameObjects.Particles.ParticleEmitter} This Particle Emitter.
     */
    flow: function (frequency, count)
    {
        if (count === undefined) { count = 1; }

        this.frequency = frequency;

        this.quantity.onChange(count);

        return this.start();
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#explode
     * @since 3.0.0
     *
     * @param {integer} count - The amount of Particles to emit.
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
     * [description]
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#emitParticleAt
     * @since 3.0.0
     *
     * @param {number} x - The x coordinate to emit the Particles from.
     * @param {number} y - The y coordinate to emit the Particles from.
     * @param {integer} count - The amount of Particles to emit.
     *
     * @return {Phaser.GameObjects.Particles.Particle} The most recently emitted Particle.
     */
    emitParticleAt: function (x, y, count)
    {
        return this.emitParticle(count, x, y);
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#emitParticle
     * @since 3.0.0
     *
     * @param {integer} count - The amount of Particles to emit.
     * @param {number} x - The x coordinate to emit the Particles from.
     * @param {number} y - The y coordinate to emit the Particles from.
     *
     * @return {Phaser.GameObjects.Particles.Particle} The most recently emitted Particle.
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

        for (var i = 0; i < count; i++)
        {
            var particle;

            if (dead.length > 0)
            {
                particle = dead.pop();
            }
            else
            {
                particle = new this.particleClass(this);
            }

            particle.fire(x, y);

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
     * [description]
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#preUpdate
     * @since 3.0.0
     *
     * @param {integer} time - The current timestamp as generated by the Request Animation Frame or SetTimeout.
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
        var length = particles.length;

        for (var index = 0; index < length; index++)
        {
            var particle = particles[index];

            //  update returns `true` if the particle is now dead (lifeStep < 0)
            if (particle.update(delta, step, processors))
            {
                //  Moves the dead particle to the end of the particles array (ready for splicing out later)
                var last = particles[length - 1];

                particles[length - 1] = particle;
                particles[index] = last;

                index -= 1;
                length -= 1;
            }
        }

        //  Move dead particles to the dead array
        var deadLength = particles.length - length;

        if (deadLength > 0)
        {
            var rip = particles.splice(particles.length - deadLength, deadLength);

            var deathCallback = this.deathCallback;
            var deathCallbackScope = this.deathCallbackScope;

            if (deathCallback)
            {
                for (var i = 0; i < rip.length; i++)
                {
                    deathCallback.call(deathCallbackScope, rip[i]);
                }
            }

            this.dead.concat(rip);

            StableSort.inplace(particles, this.indexSortCallback);
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
     * [description]
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#depthSortCallback
     * @since 3.0.0
     *
     * @param {object} a - [description]
     * @param {object} b - [description]
     *
     * @return {integer} [description]
     */
    depthSortCallback: function (a, b)
    {
        return a.y - b.y;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitter#indexSortCallback
     * @since 3.0.0
     *
     * @param {object} a - [description]
     * @param {object} b - [description]
     *
     * @return {integer} [description]
     */
    indexSortCallback: function (a, b)
    {
        return a.index - b.index;
    }

});

module.exports = ParticleEmitter;
