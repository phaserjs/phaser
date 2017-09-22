var Between = require('../../math/Between');
var Class = require('../../utils/Class');
var Components = require('../components');
var DegToRad = require('../../math/DegToRad');
var Easing = require('../../math/easing');
var GameObject = require('../GameObject');
var GetEaseFunction = require('../../tween/builder/GetEaseFunction');
var Particle = require('./Particle');
var Render = require('./ParticleEmitterRender');
var StableSort = require('../../utils/array/StableSort');

var ParticleEmitter = new Class({

    Extends: GameObject,

    Mixins: [
        Components.Alpha,
        Components.BlendMode,
        Components.RenderTarget,
        Components.ScrollFactor,
        Components.Texture,
        Components.Transform,
        Components.Visible,
        Render
    ],

    initialize:

    function ParticleEmitter (scene, x, y, texture, frame)
    {

        GameObject.call(this, scene, 'ParticleEmitter');

        this.dead = [];
        this.alive = [];
        this.minSpeed = 0;
        this.maxSpeed = 0;
        this.startScale = 1.0;
        this.endScale = 1.0;
        this.startAlpha = 1.0;
        this.endAlpha = 1.0;
        this.minEmitAngle = 0;
        this.maxEmitAngle = 360;
        this.startAngle = 0;
        this.endAngle = 0;
        this.gravityX = 0;
        this.gravityY = 0;
        this.life = 1.0;
        this.deathCallback = null;
        this.easingFunctionAlpha = Easing.Linear;
        this.easingFunctionScale = Easing.Linear;
        this.easingFunctionRotation = Easing.Linear;
        this.setTexture(texture, frame);
        this.setPosition(x, y);
    },

    setEase: function (easeName, easeParam)
    {
        var ease = GetEaseFunction(easeName, easeParam);

        this.easingFunctionAlpha = ease;
        this.easingFunctionScale = ease;
        this.easingFunctionRotation = ease;

        return this;
    },

    setAlphaEase: function (easeName, easeParam)
    {
        this.easingFunctionAlpha = GetEaseFunction(easeName, easeParam);

        return this;
    },

    setScaleEase: function (easeName, easeParam)
    {
        this.easingFunctionScale = GetEaseFunction(easeName, easeParam);

        return this;
    },

    setRotationEase: function (easeName, easeParam)
    {
        this.easingFunctionRotation = GetEaseFunction(easeName, easeParam);

        return this;
    },

    setSpeed: function (min, max)
    {
        if (max === undefined) { max = min; }

        this.minSpeed = min;
        this.maxSpeed = max;

        return this;
    },

    setEmitAngle: function (min, max)
    {
        if (max === undefined) { max = min; }

        this.minEmitAngle = min;
        this.maxEmitAngle = max;

        return this;
    },

    setScale: function (start, end)
    {
        if (end === undefined) { end = start; }

        this.startScale = start;
        this.endScale = end;

        return this;
    },

    setAlpha: function (start, end)
    {
        if (end === undefined) { end = start; }

        this.startAlpha = start;
        this.endAlpha = end;

        return this;
    },

    setAngle: function (start, end)
    {
        if (end === undefined) { end = start; }

        this.startAngle = start;
        this.endAngle = end;

        return this;
    },

    setGravity: function (x, y)
    {
        if (y === undefined) { y = x; }

        this.gravityX = x;
        this.gravityY = y;

        return this;
    },

    reserve: function (particleCount)
    {
        var dead = this.dead;

        for (var count = 0; count < particleCount; ++count)
        {
            dead.push(new Particle(this.x, this.y));
        }

        return this;
    },

    getAliveParticleCount: function ()
    {
        return this.alive.length;
    },

    getDeadParticleCount: function ()
    {
        return this.dead.length;
    },

    getParticleCount: function ()
    {
        return this.getAliveParticleCount() + this.getDeadParticleCount();
    },

    onParticleDeath: function (callback)
    {
        if (typeof callback === 'function')
        {
            this.deathCallback = callback;
        }

        return this;
    },

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

    forEachAlive: function (callback, thisArg)
    {
        var alive = this.alive;
        var length = alive.length;

        for (var index = 0; index < length; ++index)
        {
            callback.call(thisArg, alive[index]);
        }

        return this;
    },

    forEachDead: function (callback, thisArg)
    {
        var dead = this.dead;
        var length = dead.length;

        for (var index = 0; index < length; ++index)
        {
            callback.call(thisArg, dead[index]);
        }

        return this;
    },

    emitParticle: function ()
    {
        var particle = null;
        var rad = DegToRad(Between(this.minEmitAngle, this.maxEmitAngle));
        var speed = Between(this.minSpeed, this.maxSpeed);
        var vx = Math.cos(rad) * speed;
        var vy = Math.sin(rad) * speed;
        
        if (this.dead.length > 0)
        {
            particle = this.dead.pop();
            particle.reset(this.x, this.y);
        }
        else
        {
            particle = new Particle(this.x, this.y);
        }

        particle.velocityX = vx;
        particle.velocityY = vy;
        particle.life = Math.max(this.life, Number.MIN_VALUE);
        particle.lifeStep = particle.life;
        particle.start.scale = this.startScale;
        particle.end.scale = this.endScale;
        particle.scaleX = this.startScale;
        particle.scaleY = this.startScale;
        particle.start.alpha = this.startAlpha;
        particle.end.alpha = this.endAlpha;
        particle.start.rotation = this.startAngle * Math.PI / 180;
        particle.end.rotation = this.endAngle * Math.PI / 180;
        particle.color = (particle.color & 0x00FFFFFF) | (((this.startAlpha * 0xFF)|0) << 24);
        particle.index = this.alive.length;
                
        this.alive.push(particle);

        return particle;
    },

    preUpdate: function (time, delta)
    {
        var dead = this.dead;
        var particles = this.alive;
        var length = particles.length;
        var emitterStep = (delta / 1000);
        var gravityX = this.gravityX * emitterStep;
        var gravityY = this.gravityY * emitterStep;
        var deathCallback = this.deathCallback;

        /* Simulation */
        for (var index = 0; index < length; ++index)
        {
            var particle = particles[index];

            particle.velocityX += gravityX;
            particle.velocityY += gravityY;
            particle.x += particle.velocityX * emitterStep;
            particle.y += particle.velocityY * emitterStep;
            particle.normLifeStep = particle.lifeStep / particle.life;

            var norm = 1.0 - particle.normLifeStep;
            var alphaEase = this.easingFunctionAlpha(norm);
            var scaleEase = this.easingFunctionScale(norm);
            var rotationEase = this.easingFunctionRotation(norm);
            var alphaf = (particle.end.alpha - particle.start.alpha) * alphaEase + particle.start.alpha;
            var scale = (particle.end.scale - particle.start.scale) * scaleEase + particle.start.scale;
            var rotation = (particle.end.rotation - particle.start.rotation) * rotationEase + particle.start.rotation;

            particle.scaleX = particle.scaleY = scale;
            particle.color = (particle.color & 0x00FFFFFF) | (((alphaf * 0xFF)|0) << 24);
            particle.rotation = rotation;

            if (particle.lifeStep <= 0)
            {
                var last = particles[length - 1];
                particles[length - 1] = particle;
                particles[index] = last;
                index -= 1;
                length -= 1;

                if (deathCallback)
                {
                    deathCallback(particle);
                }
            }

            particle.lifeStep -= emitterStep;

        }

        /* Cleanup */
        var deadLength = particles.length - length;

        if (deadLength > 0)
        {
            dead.push.apply(dead, particles.splice(particles.length - deadLength, deadLength));
            StableSort(particles, function (a, b) { return a.index - b.index; });
        }
    }

});

module.exports = ParticleEmitter;
