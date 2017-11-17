var Class = require('../../utils/Class');
var Components = require('../components');
var GameObject = require('../GameObject');
var GravityWell = require('./GravityWell');
var List = require('../../structs/List');
var ParticleEmitter = require('./ParticleEmitter');
var Render = require('./ParticleManagerRender');

var ParticleEmitterManager = new Class({

    Extends: GameObject,

    Mixins: [
        Components.Depth,
        Components.RenderTarget,
        Components.Visible,
        Render
    ],

    initialize:

    //  frame is optional and can contain the emitters array or object if skipped
    function ParticleEmitterManager (scene, texture, frame, emitters)
    {
        GameObject.call(this, scene, 'ParticleEmitterManager');

        //  private
        this.blendMode = -1;

        this.timeScale = 1;

        this.texture = null;
        this.frame = null;
        this.frameNames = [];

        //  frame is optional and can contain the emitters array or object if skipped
        if (frame !== null && (typeof frame === 'object' || Array.isArray(frame)))
        {
            emitters = frame;
            frame = null;
        }

        this.setTexture(texture, frame);

        this.emitters = new List(this);

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

    setTexture: function (key, frame)
    {
        this.texture = this.scene.sys.textures.get(key);

        return this.setFrame(frame);
    },

    setFrame: function (frame)
    {
        this.frame = this.texture.get(frame);

        this.frameNames = this.texture.getFramesFromTextureSource(this.frame.sourceIndex);

        this.defaultFrame = this.frame;

        return this;
    },

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

    addEmitter: function (emitter)
    {
        return this.emitters.add(emitter);
    },

    createEmitter: function (config)
    {
        return this.addEmitter(new ParticleEmitter(this, config));
    },

    addGravityWell: function (well)
    {
        return this.wells.add(well);
    },

    createGravityWell: function (config)
    {
        return this.addGravityWell(new GravityWell(config));
    },

    emit: function (count, x, y)
    {
        var emitters = this.emitters.list;

        for (var i = 0; i < emitters.length; i++)
        {
            var emitter = emitters[i];

            if (emitter.active)
            {
                emitter.emit(count, x, y);
            }
        }

        return this;
    },

    emitAt: function (x, y, count)
    {
        return this.emit(count, x, y);
    },

    pause: function ()
    {
        this.active = false;

        return this;
    },

    resume: function ()
    {
        this.active = true;

        return this;
    },

    getProcessors: function ()
    {
        return this.wells.getAll('active', true);
    },

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
