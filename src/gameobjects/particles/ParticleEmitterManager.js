/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../utils/Class');
var Components = require('../components');
var GameObject = require('../GameObject');
var GravityWell = require('./GravityWell');
var List = require('../../structs/List');
var ParticleEmitter = require('./ParticleEmitter');
var Render = require('./ParticleManagerRender');

/**
 * @classdesc
 * [description]
 *
 * @class ParticleEmitterManager
 * @extends Phaser.GameObjects.Particles.GameObject
 * @memberOf Phaser.GameObjects.Particles
 * @constructor
 * @since 3.0.0
 *
 * @extends Phaser.GameObjects.Particles.Components.Depth
 * @extends Phaser.GameObjects.Particles.Components.Visible
 * @extends Phaser.GameObjects.Particles.Components.Pipeline
 *
 * @param {Phaser.Scene} scene - [description]
 * @param {string} texture - [description]
 * @param {(string|integer)} frame - [description]
 * @param {Phaser.GameObjects.Particles.ParticleEmitter[]} emitters - [description]
 */
var ParticleEmitterManager = new Class({

    Extends: GameObject,

    Mixins: [
        Components.Depth,
        Components.Visible,
        Components.Pipeline,
        Render
    ],

    initialize:

    //  frame is optional and can contain the emitters array or object if skipped
    function ParticleEmitterManager (scene, texture, frame, emitters)
    {
        GameObject.call(this, scene, 'ParticleEmitterManager');

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitterManager#blendMode
         * @type {number}
         * @default -1
         * @private
         * @since 3.0.0
         */
        this.blendMode = -1;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitterManager#timeScale
         * @type {float}
         * @default 1
         * @since 3.0.0
         */
        this.timeScale = 1;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitterManager#texture
         * @type {Phaser.Textures.Texture}
         * @default null
         * @since 3.0.0
         */
        this.texture = null;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitterManager#frame
         * @type {Phaser.Textures.Frame}
         * @default null
         * @since 3.0.0
         */
        this.frame = null;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitterManager#frameNames
         * @type {Phaser.Textures.Frame[]}
         * @since 3.0.0
         */
        this.frameNames = [];

        //  frame is optional and can contain the emitters array or object if skipped
        if (frame !== null && (typeof frame === 'object' || Array.isArray(frame)))
        {
            emitters = frame;
            frame = null;
        }

        this.setTexture(texture, frame);

        this.initPipeline('TextureTintPipeline');

        /**
         * A list of Emitters being managed by this Emitter Manager.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitterManager#emitters
         * @type {Phaser.Structs.List}
         * @since 3.0.0
         */
        this.emitters = new List(this);

        /**
         * A list of Gravity Wells being managed by this Emitter Manager.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitterManager#wells
         * @type {Phaser.Structs.List}
         * @since 3.0.0
         */
        this.wells = new List(this);

        if (emitters)
        {
            //  An array of emitter configs?
            if (!Array.isArray(emitters))
            {
                emitters = [ emitters ];
            }

            for (var i = 0; i < emitters.length; i++)
            {
                this.createEmitter(emitters[i]);
            }
        }
    },

    /**
     * Sets the texture and frame this Game Object will use to render with.
     *
     * Textures are referenced by their string-based keys, as stored in the Texture Manager.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitterManager#setTexture
     * @since 3.0.0
     *
     * @param {string} key - The key of the texture to be used, as stored in the Texture Manager.
     * @param {(string|integer)} [frame] - The name or index of the frame within the Texture.
     *
     * @return {Phaser.GameObjects.Particles.ParticleEmitterManager} This Game Object.
     */
    setTexture: function (key, frame)
    {
        this.texture = this.scene.sys.textures.get(key);

        return this.setFrame(frame);
    },

    /**
     * Sets the frame this Game Object will use to render with.
     *
     * The Frame has to belong to the current Texture being used.
     *
     * It can be either a string or an index.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitterManager#setFrame
     * @since 3.0.0
     *
     * @param {(string|integer)} [frame] - The name or index of the frame within the Texture.
     *
     * @return {Phaser.GameObjects.Particles.ParticleEmitterManager} This Game Object.
     */
    setFrame: function (frame)
    {
        this.frame = this.texture.get(frame);

        this.frameNames = this.texture.getFramesFromTextureSource(this.frame.sourceIndex);

        this.defaultFrame = this.frame;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitterManager#setEmitterFrames
     * @since 3.0.0
     *
     * @param {(Phaser.Textures.Frame|Phaser.Textures.Frame[])} frames - [description]
     * @param {Phaser.GameObjects.Particles.ParticleEmitter} emitter - [description]
     *
     * @return {Phaser.GameObjects.Particles.ParticleEmitterManager} This Game Object.
     */
    setEmitterFrames: function (frames, emitter)
    {
        if (!Array.isArray(frames))
        {
            frames = [ frames ];
        }

        var out = emitter.frames;

        out.length = 0;

        for (var i = 0; i < frames.length; i++)
        {
            var frame = frames[i];

            if (this.frameNames.indexOf(frame) !== -1)
            {
                out.push(this.texture.get(frame));
            }
        }

        if (out.length > 0)
        {
            emitter.defaultFrame = out[0];
        }
        else
        {
            emitter.defaultFrame = this.defaultFrame;
        }

        return this;
    },

    /**
     * Adds an existing Particle Emitter to this Manager.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitterManager#addEmitter
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Particles.ParticleEmitter} emitter - The Particle Emitter to add to this Emitter Manager.
     *
     * @return {Phaser.GameObjects.Particles.ParticleEmitter} The Particle Emitter that was added to this Emitter Manager.
     */
    addEmitter: function (emitter)
    {
        return this.emitters.add(emitter);
    },

    /**
     * Creates a new Particle Emitter object, adds it to this Manager and returns a reference to it.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitterManager#createEmitter
     * @since 3.0.0
     *
     * @param {object} config - [description]
     *
     * @return {Phaser.GameObjects.Particles.ParticleEmitter} The Particle Emitter that was created.
     */
    createEmitter: function (config)
    {
        return this.addEmitter(new ParticleEmitter(this, config));
    },

    /**
     * Adds an existing Gravity Well object to this Manager.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitterManager#addGravityWell
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Particles.GravityWell} well - The Gravity Well to add to this Emitter Manager.
     *
     * @return {Phaser.GameObjects.Particles.GravityWell} The Gravity Well that was added to this Emitter Manager.
     */
    addGravityWell: function (well)
    {
        return this.wells.add(well);
    },

    /**
     * Creates a new Gravity Well, adds it to this Manager and returns a reference to it.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitterManager#createGravityWell
     * @since 3.0.0
     *
     * @param {object} config - [description]
     *
     * @return {Phaser.GameObjects.Particles.GravityWell} The Gravity Well that was created.
     */
    createGravityWell: function (config)
    {
        return this.addGravityWell(new GravityWell(config));
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitterManager#emitParticle
     * @since 3.0.0
     *
     * @param {integer} count - [description]
     * @param {number} x - [description]
     * @param {number} y - [description]
     *
     * @return {Phaser.GameObjects.Particles.ParticleEmitterManager} This Game Object.
     */
    emitParticle: function (count, x, y)
    {
        var emitters = this.emitters.list;

        for (var i = 0; i < emitters.length; i++)
        {
            var emitter = emitters[i];

            if (emitter.active)
            {
                emitter.emitParticle(count, x, y);
            }
        }

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitterManager#emitParticleAt
     * @since 3.0.0
     *
     * @param {number} x - [description]
     * @param {number} y - [description]
     * @param {integer} count - [description]
     *
     * @return {Phaser.GameObjects.Particles.ParticleEmitterManager} This Game Object.
     */
    emitParticleAt: function (x, y, count)
    {
        return this.emitParticle(count, x, y);
    },

    /**
     * Pauses this Emitter Manager.
     *
     * This has the effect of pausing all emitters, and all particles of those emitters, currently under its control.
     *
     * The particles will still render, but they will not have any of their logic updated.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitterManager#pause
     * @since 3.0.0
     *
     * @return {Phaser.GameObjects.Particles.ParticleEmitterManager} This Game Object.
     */
    pause: function ()
    {
        this.active = false;

        return this;
    },

    /**
     * Resumes this Emitter Manager, should it have been previously paused.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitterManager#resume
     * @since 3.0.0
     *
     * @return {Phaser.GameObjects.Particles.ParticleEmitterManager} This Game Object.
     */
    resume: function ()
    {
        this.active = true;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitterManager#getProcessors
     * @since 3.0.0
     *
     * @return {Phaser.GameObjects.Particles.GravityWell[]} [description]
     */
    getProcessors: function ()
    {
        return this.wells.getAll('active', true);
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitterManager#preUpdate
     * @since 3.0.0
     *
     * @param {integer} time - The current timestamp as generated by the Request Animation Frame or SetTimeout.
     * @param {number} delta - The delta time, in ms, elapsed since the last frame.
     */
    preUpdate: function (time, delta)
    {
        //  Scale the delta
        delta *= this.timeScale;

        var emitters = this.emitters.list;

        for (var i = 0; i < emitters.length; i++)
        {
            var emitter = emitters[i];

            if (emitter.active)
            {
                emitter.preUpdate(time, delta);
            }
        }
    }

});

module.exports = ParticleEmitterManager;
