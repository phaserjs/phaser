/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
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
 * A Particle Emitter Manager creates and controls {@link Phaser.GameObjects.Particles.ParticleEmitter Particle Emitters} and {@link Phaser.GameObjects.Particles.GravityWell Gravity Wells}.
 *
 * @class ParticleEmitterManager
 * @extends Phaser.GameObjects.GameObject
 * @memberof Phaser.GameObjects.Particles
 * @constructor
 * @since 3.0.0
 *
 * @extends Phaser.GameObjects.Components.Depth
 * @extends Phaser.GameObjects.Components.Mask
 * @extends Phaser.GameObjects.Components.Pipeline
 * @extends Phaser.GameObjects.Components.Transform
 * @extends Phaser.GameObjects.Components.Visible
 *
 * @param {Phaser.Scene} scene - The Scene to which this Emitter Manager belongs.
 * @param {string} texture - The key of the Texture this Emitter Manager will use to render particles, as stored in the Texture Manager.
 * @param {(string|integer)} [frame] - An optional frame from the Texture this Emitter Manager will use to render particles.
 * @param {Phaser.Types.GameObjects.Particles.ParticleEmitterConfig|Phaser.Types.GameObjects.Particles.ParticleEmitterConfig[]} [emitters] - Configuration settings for one or more emitters to create.
 */
var ParticleEmitterManager = new Class({

    Extends: GameObject,

    Mixins: [
        Components.Depth,
        Components.Mask,
        Components.Pipeline,
        Components.Transform,
        Components.Visible,
        Render
    ],

    initialize:

    //  frame is optional and can contain the emitters array or object if skipped
    function ParticleEmitterManager (scene, texture, frame, emitters)
    {
        GameObject.call(this, scene, 'ParticleEmitterManager');

        /**
         * The blend mode applied to all emitters and particles.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitterManager#blendMode
         * @type {integer}
         * @default -1
         * @private
         * @since 3.0.0
         */
        this.blendMode = -1;

        /**
         * The time scale applied to all emitters and particles, affecting flow rate, lifespan, and movement.
         * Values larger than 1 are faster than normal.
         * This is multiplied with any timeScale set on each individual emitter.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitterManager#timeScale
         * @type {number}
         * @default 1
         * @since 3.0.0
         */
        this.timeScale = 1;

        /**
         * The texture used to render this Emitter Manager's particles.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitterManager#texture
         * @type {Phaser.Textures.Texture}
         * @default null
         * @since 3.0.0
         */
        this.texture = null;

        /**
         * The texture frame used to render this Emitter Manager's particles.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitterManager#frame
         * @type {Phaser.Textures.Frame}
         * @default null
         * @since 3.0.0
         */
        this.frame = null;

        /**
         * Names of this Emitter Manager's texture frames.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitterManager#frameNames
         * @type {string[]}
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

        this.initPipeline();

        /**
         * A list of Emitters being managed by this Emitter Manager.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitterManager#emitters
         * @type {Phaser.Structs.List.<Phaser.GameObjects.Particles.ParticleEmitter>}
         * @since 3.0.0
         */
        this.emitters = new List(this);

        /**
         * A list of Gravity Wells being managed by this Emitter Manager.
         *
         * @name Phaser.GameObjects.Particles.ParticleEmitterManager#wells
         * @type {Phaser.Structs.List.<Phaser.GameObjects.Particles.GravityWell>}
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
     * Sets the texture and frame this Emitter Manager will use to render with.
     *
     * Textures are referenced by their string-based keys, as stored in the Texture Manager.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitterManager#setTexture
     * @since 3.0.0
     *
     * @param {string} key - The key of the texture to be used, as stored in the Texture Manager.
     * @param {(string|integer)} [frame] - The name or index of the frame within the Texture.
     *
     * @return {Phaser.GameObjects.Particles.ParticleEmitterManager} This Emitter Manager.
     */
    setTexture: function (key, frame)
    {
        this.texture = this.scene.sys.textures.get(key);

        return this.setFrame(frame);
    },

    /**
     * Sets the frame this Emitter Manager will use to render with.
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
     * @return {Phaser.GameObjects.Particles.ParticleEmitterManager} This Emitter Manager.
     */
    setFrame: function (frame)
    {
        this.frame = this.texture.get(frame);

        var frames = this.texture.getFramesFromTextureSource(this.frame.sourceIndex);

        var names = [];

        frames.forEach(function (sourceFrame)
        {
            names.push(sourceFrame.name);
        });

        this.frameNames = names;

        this.defaultFrame = this.frame;

        return this;
    },

    /**
     * Assigns texture frames to an emitter.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitterManager#setEmitterFrames
     * @since 3.0.0
     *
     * @param {(Phaser.Textures.Frame|Phaser.Textures.Frame[])} frames - The texture frames.
     * @param {Phaser.GameObjects.Particles.ParticleEmitter} emitter - The particle emitter to modify.
     *
     * @return {Phaser.GameObjects.Particles.ParticleEmitterManager} This Emitter Manager.
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
     * Adds an existing Particle Emitter to this Emitter Manager.
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
     * Creates a new Particle Emitter object, adds it to this Emitter Manager and returns a reference to it.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitterManager#createEmitter
     * @since 3.0.0
     *
     * @param {Phaser.Types.GameObjects.Particles.ParticleEmitterConfig} config - Configuration settings for the Particle Emitter to create.
     *
     * @return {Phaser.GameObjects.Particles.ParticleEmitter} The Particle Emitter that was created.
     */
    createEmitter: function (config)
    {
        return this.addEmitter(new ParticleEmitter(this, config));
    },

    /**
     * Removes a Particle Emitter from this Emitter Manager, if the Emitter belongs to this Manager.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitterManager#removeEmitter
     * @since 3.22.0
     *
     * @param {Phaser.GameObjects.Particles.ParticleEmitter} emitter
     *
     * @return {?Phaser.GameObjects.Particles.ParticleEmitter} The Particle Emitter if it was removed or null if it was not.
     */
    removeEmitter: function (emitter)
    {
        return this.emitters.remove(emitter, true);
    },

    /**
     * Adds an existing Gravity Well object to this Emitter Manager.
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
     * Creates a new Gravity Well, adds it to this Emitter Manager and returns a reference to it.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitterManager#createGravityWell
     * @since 3.0.0
     *
     * @param {Phaser.Types.GameObjects.Particles.GravityWellConfig} config - Configuration settings for the Gravity Well to create.
     *
     * @return {Phaser.GameObjects.Particles.GravityWell} The Gravity Well that was created.
     */
    createGravityWell: function (config)
    {
        return this.addGravityWell(new GravityWell(config));
    },

    /**
     * Emits particles from each active emitter.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitterManager#emitParticle
     * @since 3.0.0
     *
     * @param {integer} [count] - The number of particles to release from each emitter. The default is the emitter's own {@link Phaser.GameObjects.Particles.ParticleEmitter#quantity}.
     * @param {number} [x] - The x-coordinate to to emit particles from. The default is the x-coordinate of the emitter's current location.
     * @param {number} [y] - The y-coordinate to to emit particles from. The default is the y-coordinate of the emitter's current location.
     *
     * @return {Phaser.GameObjects.Particles.ParticleEmitterManager} This Emitter Manager.
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
     * Emits particles from each active emitter.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitterManager#emitParticleAt
     * @since 3.0.0
     *
     * @param {number} [x] - The x-coordinate to to emit particles from. The default is the x-coordinate of the emitter's current location.
     * @param {number} [y] - The y-coordinate to to emit particles from. The default is the y-coordinate of the emitter's current location.
     * @param {integer} [count] - The number of particles to release from each emitter. The default is the emitter's own {@link Phaser.GameObjects.Particles.ParticleEmitter#quantity}.
     *
     * @return {Phaser.GameObjects.Particles.ParticleEmitterManager} This Emitter Manager.
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
     * @return {Phaser.GameObjects.Particles.ParticleEmitterManager} This Emitter Manager.
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
     * @return {Phaser.GameObjects.Particles.ParticleEmitterManager} This Emitter Manager.
     */
    resume: function ()
    {
        this.active = true;

        return this;
    },

    /**
     * Gets all active particle processors (gravity wells).
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitterManager#getProcessors
     * @since 3.0.0
     *
     * @return {Phaser.GameObjects.Particles.GravityWell[]} - The active gravity wells.
     */
    getProcessors: function ()
    {
        return this.wells.getAll('active', true);
    },

    /**
     * Updates all active emitters.
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
    },

    /**
     * A NOOP method so you can pass an EmitterManager to a Container.
     * Calling this method will do nothing. It is intentionally empty.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitterManager#setAlpha
     * @private
     * @since 3.10.0
     */
    setAlpha: function ()
    {
    },

    /**
     * A NOOP method so you can pass an EmitterManager to a Container.
     * Calling this method will do nothing. It is intentionally empty.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitterManager#setScrollFactor
     * @private
     * @since 3.10.0
     */
    setScrollFactor: function ()
    {
    },

    /**
     * A NOOP method so you can pass an EmitterManager to a Container.
     * Calling this method will do nothing. It is intentionally empty.
     *
     * @method Phaser.GameObjects.Particles.ParticleEmitterManager#setBlendMode
     * @private
     * @since 3.15.0
     */
    setBlendMode: function ()
    {
    }

});

module.exports = ParticleEmitterManager;
