/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../utils/Class');
var FloatBetween = require('../../math/FloatBetween');
var GetEaseFunction = require('../../tweens/builders/GetEaseFunction');
var GetFastValue = require('../../utils/object/GetFastValue');
var Wrap = require('../../math/Wrap');

/**
 * @classdesc
 * [description]
 *
 * @class EmitterOp
 * @memberOf Phaser.GameObjects.Particles
 * @constructor
 * @since 3.0.0
 *
 * @param {object} config - [description]
 * @param {string} key - [description]
 * @param {number} defaultValue - [description]
 * @param {boolean} [emitOnly=false] - [description]
 */
var EmitterOp = new Class({

    initialize:

    function EmitterOp (config, key, defaultValue, emitOnly)
    {
        if (emitOnly === undefined) { emitOnly = false; }

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Particles.EmitterOp#propertyKey
         * @type {string}
         * @since 3.0.0
         */
        this.propertyKey = key;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Particles.EmitterOp#propertyValue
         * @type {number}
         * @since 3.0.0
         */
        this.propertyValue = defaultValue;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Particles.EmitterOp#defaultValue
         * @type {number}
         * @since 3.0.0
         */
        this.defaultValue = defaultValue;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Particles.EmitterOp#steps
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.steps = 0;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Particles.EmitterOp#counter
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.counter = 0;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Particles.EmitterOp#start
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.start = 0;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Particles.EmitterOp#end
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.end = 0;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Particles.EmitterOp#ease
         * @type {?function}
         * @since 3.0.0
         */
        this.ease;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Particles.EmitterOp#emitOnly
         * @type {boolean}
         * @since 3.0.0
         */
        this.emitOnly = emitOnly;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Particles.EmitterOp#onEmit
         * @type {[type]}
         * @since 3.0.0
         */
        this.onEmit = this.defaultEmit;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Particles.EmitterOp#onUpdate
         * @type {[type]}
         * @since 3.0.0
         */
        this.onUpdate = this.defaultUpdate;

        this.loadConfig(config);
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Particles.EmitterOp#loadConfig
     * @since 3.0.0
     *
     * @param {object} config - [description]
     * @param {string} newKey - [description]
     */
    loadConfig: function (config, newKey)
    {
        if (config === undefined) { config = {}; }

        if (newKey)
        {
            this.propertyKey = newKey;
        }

        this.propertyValue = GetFastValue(config, this.propertyKey, this.defaultValue);

        this.setMethods();

        if (this.emitOnly)
        {
            //  Reset it back again
            this.onUpdate = this.defaultUpdate;
        }
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Particles.EmitterOp#toJSON
     * @since 3.0.0
     *
     * @return {object} [description]
     */
    toJSON: function ()
    {
        return JSON.stringify(this.propertyValue);
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Particles.EmitterOp#onChange
     * @since 3.0.0
     *
     * @param {[type]} value - [description]
     *
     * @return {Phaser.GameObjects.Particles.EmitterOp} This Emitter Op object.
     */
    onChange: function (value)
    {
        this.propertyValue = value;

        return this.setMethods();
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Particles.EmitterOp#setMethods
     * @since 3.0.0
     *
     * @return {Phaser.GameObjects.Particles.EmitterOp} This Emitter Op object.
     */
    setMethods: function ()
    {
        var value = this.propertyValue;

        var t = typeof(value);

        if (t === 'number')
        {
            //  Explicit static value:
            //  x: 400

            this.onEmit = this.staticValueEmit;
            this.onUpdate = this.staticValueUpdate;
        }
        else if (Array.isArray(value))
        {
            //  Picks a random element from the array:
            //  x: [ 100, 200, 300, 400 ]

            this.onEmit = this.randomStaticValueEmit;
        }
        else if (t === 'function')
        {
            //  The same as setting just the onUpdate function and no onEmit (unless this op is an emitOnly one)
            //  Custom callback, must return a value:

            /*
            x: function (particle, key, t, value)
               {
                   return value + 50;
               }
            */

            if (this.emitOnly)
            {
                this.onEmit = value;
            }
            else
            {
                this.onUpdate = value;
            }
        }
        else if (t === 'object' && (this.has(value, 'random') || this.hasBoth(value, 'start', 'end') || this.hasBoth(value, 'min', 'max')))
        {
            this.start = (this.has(value, 'start')) ? value.start : value.min;
            this.end = (this.has(value, 'end')) ? value.end : value.max;

            var isRandom = (this.hasBoth(value, 'min', 'max') || this.has(value, 'random'));

            //  A random starting value (using 'min | max' instead of 'start | end' automatically implies a random value)

            //  x: { start: 100, end: 400, random: true } OR { min: 100, max: 400 } OR { random: [ 100, 400 ] }

            if (isRandom)
            {
                var rnd = value.random;

                //  x: { random: [ 100, 400 ] } = the same as doing: x: { start: 100, end: 400, random: true }
                if (Array.isArray(rnd))
                {
                    this.start = rnd[0];
                    this.end = rnd[1];
                }

                this.onEmit = this.randomRangedValueEmit;
            }

            if (this.has(value, 'steps'))
            {
                //  A stepped (per emit) range

                //  x: { start: 100, end: 400, steps: 64 }

                //  Increments a value stored in the emitter

                this.steps = value.steps;
                this.counter = this.start;

                this.onEmit = this.steppedEmit;
            }
            else
            {
                //  An eased range (defaults to Linear if not specified)

                //  x: { start: 100, end: 400, [ ease: 'Linear' ] }

                var easeType = (this.has(value, 'ease')) ? value.ease : 'Linear';

                this.ease = GetEaseFunction(easeType);

                if (!isRandom)
                {
                    this.onEmit = this.easedValueEmit;
                }

                this.onUpdate = this.easeValueUpdate;
            }
        }
        else if (t === 'object' && this.hasEither(value, 'onEmit', 'onUpdate'))
        {
            //  Custom onEmit and onUpdate callbacks

            /*
            x: {
                //  Called at the start of the particles life, when it is being created
                onEmit: function (particle, key, t, value)
                {
                    return value;
                },

                //  Called during the particles life on each update
                onUpdate: function (particle, key, t, value)
                {
                    return value;
                }
            }
            */

            if (this.has(value, 'onEmit'))
            {
                this.onEmit = value.onEmit;
            }

            if (this.has(value, 'onUpdate'))
            {
                this.onUpdate = value.onUpdate;
            }
        }

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Particles.EmitterOp#has
     * @since 3.0.0
     *
     * @param {object} object - [description]
     * @param {string} key - [description]
     *
     * @return {boolean} [description]
     */
    has: function (object, key)
    {
        return (object.hasOwnProperty(key));
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Particles.EmitterOp#hasBoth
     * @since 3.0.0
     *
     * @param {object} object - [description]
     * @param {string} key1 - [description]
     * @param {string} key2 - [description]
     *
     * @return {boolean} [description]
     */
    hasBoth: function (object, key1, key2)
    {
        return (object.hasOwnProperty(key1) && object.hasOwnProperty(key2));
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Particles.EmitterOp#hasEither
     * @since 3.0.0
     *
     * @param {object} object - [description]
     * @param {string} key1 - [description]
     * @param {string} key2 - [description]
     *
     * @return {boolean} [description]
     */
    hasEither: function (object, key1, key2)
    {
        return (object.hasOwnProperty(key1) || object.hasOwnProperty(key2));
    },

    /**
     * The returned value sets what the property will be at the START of the particles life, on emit.
     *
     * @method Phaser.GameObjects.Particles.EmitterOp#defaultEmit
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Particles.Particle} particle - [description]
     * @param {string} key - [description]
     * @param {number} value - [description]
     *
     * @return {number} [description]
     */
    defaultEmit: function (particle, key, value)
    {
        return value;
    },

    /**
     * The returned value updates the property for the duration of the particles life.
     *
     * @method Phaser.GameObjects.Particles.EmitterOp#defaultUpdate
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Particles.Particle} particle - [description]
     * @param {string} key - [description]
     * @param {float} t - The T value (between 0 and 1)
     * @param {number} value - [description]
     *
     * @return {number} [description]
     */
    defaultUpdate: function (particle, key, t, value)
    {
        return value;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Particles.EmitterOp#staticValueEmit
     * @since 3.0.0
     *
     * @return {number} [description]
     */
    staticValueEmit: function ()
    {
        return this.propertyValue;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Particles.EmitterOp#staticValueUpdate
     * @since 3.0.0
     *
     * @return {number} [description]
     */
    staticValueUpdate: function ()
    {
        return this.propertyValue;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Particles.EmitterOp#randomStaticValueEmit
     * @since 3.0.0
     *
     * @return {number} [description]
     */
    randomStaticValueEmit: function ()
    {
        var randomIndex = Math.floor(Math.random() * this.propertyValue.length);

        return this.propertyValue[randomIndex];
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Particles.EmitterOp#randomRangedValueEmit
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Particles.Particle} particle - [description]
     * @param {string} key - [description]
     *
     * @return {number} [description]
     */
    randomRangedValueEmit: function (particle, key)
    {
        var value = FloatBetween(this.start, this.end);

        if (particle && particle.data[key])
        {
            particle.data[key].min = value;
        }

        return value;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Particles.EmitterOp#steppedEmit
     * @since 3.0.0
     *
     * @return {number} [description]
     */
    steppedEmit: function ()
    {
        var current = this.counter;

        var next = this.counter + ((this.end - this.start) / this.steps);

        this.counter = Wrap(next, this.start, this.end);

        return current;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Particles.EmitterOp#easedValueEmit
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Particles.Particle} particle - [description]
     * @param {string} key - [description]
     *
     * @return {number} [description]
     */
    easedValueEmit: function (particle, key)
    {
        if (particle && particle.data[key])
        {
            var data = particle.data[key];

            data.min = this.start;
            data.max = this.end;
        }

        return this.start;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Particles.EmitterOp#easeValueUpdate
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Particles.Particle} particle - [description]
     * @param {string} key - [description]
     * @param {float} t - The T value (between 0 and 1)
     *
     * @return {number} [description]
     */
    easeValueUpdate: function (particle, key, t)
    {
        var data = particle.data[key];

        return (data.max - data.min) * this.ease(t) + data.min;
    }

});

module.exports = EmitterOp;
