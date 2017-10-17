var Class = require('../../utils/Class');
var Components = require('../components');
var GameObject = require('../GameObject');
var ParticleEmitter = require('./ParticleEmitter');
var Render = require('./ParticleManagerRender');

var ParticleEmitterManager = new Class({

    Extends: GameObject,

    Mixins: [
        Components.Texture,
        Components.Visible,
        Render
    ],

    initialize:

    function ParticleEmitterManager (scene, texture, frame, emitters)
    {
        GameObject.call(this, scene, 'ParticleEmitterManager');

        //  private
        this.blendMode = -1;

        this.timeScale = 1;

        this.setTexture(texture, frame);

        this.emitters = [];

        if (emitters !== undefined)
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

    addEmitter: function (emitter)
    {
        this.emitters.push(emitter);

        return emitter;
    },

    createEmitter: function (config)
    {
        return this.addEmitter(new ParticleEmitter(this, config));
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

    preUpdate: function (time, delta)
    {
        //  Scale the delta
        delta *= this.timeScale;

        var emitters = this.emitters;

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
