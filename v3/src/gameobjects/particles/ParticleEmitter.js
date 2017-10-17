var Between = require('../../math/Between');
var Class = require('../../utils/Class');
var Components = require('../components');
var DegToRad = require('../../math/DegToRad');
var Easing = require('../../math/easing');
var GameObject = require('../GameObject');
var GetEaseFunction = require('../../tweens/builder/GetEaseFunction');
var Particle = require('./Particle');
var StableSort = require('../../utils/array/StableSort');

var ParticleEmitter = new Class({

    Mixins: [
        Components.BlendMode,
        Components.RenderTarget,
        Components.ScrollFactor,
        Components.Visible
    ],

    initialize:

    function ParticleEmitter (manager, config)
    {
        if (config === undefined) { config = {}; }

        this.manager = manager;

        this.key = '';

        this.x = 0;
        this.y = 0;

        this.frame = manager.frame;

        this.classType = Particle;

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

        this.delay = 0.0;
        this.delayCounter = 0.0;

        this.deathCallback = null;
        this.deathCallbackScope = null;

        this.emitCount = 1;
        this.enabled = true;
        this.allowCreation = true;
        this.emitShape = null;

        this.easingFunctionAlpha = Easing.Linear;
        this.easingFunctionScale = Easing.Linear;
        this.easingFunctionRotation = Easing.Linear;

        this.active = true;
    },

    setFrame: function (frame)
    {
        this.frame = this.manager.texture.get(frame);

        return this;
    },

    setPosition: function (x, y)
    {
        this.x = x;
        this.y = y;

        return this;
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

    setEmitterDelay: function (delay)
    {
        this.delay = delay;
        this.delayCounter = delay / 1000;

        return this;
    },

    setShape: function (shape)
    {
        this.emitShape = shape;

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

    explode: function (count)
    {
        this.emit(count);

        return this;
    },

    emitAt: function (x, y, count)
    {
        var oldX = this.x;
        var oldY = this.y;

        this.x = x;
        this.y = y;

        var particle = this.emit(count);

        this.x = oldX;
        this.y = oldY;

        return particle;
    },

    emit: function (count)
    {
        if (count === undefined) { count = 1; }

        var particle = null;

        var x = this.x;
        var y = this.y;
        var shape = this.emitShape;
        var dead = this.dead;
        var allowCreation = this.allowCreation;

        for (var index = 0; index < count; index++)
        {
            var rad = DegToRad(Between(this.minEmitAngle, this.maxEmitAngle));
            var speed = Between(this.minSpeed, this.maxSpeed);
            var vx = Math.cos(rad) * speed;
            var vy = Math.sin(rad) * speed;

            if (dead.length > 0)
            {
                particle = dead.pop();
                particle.reset(x, y, this.frame);
            }
            else if (allowCreation)
            {
                particle = new this.classType(x, y, this.frame);
            }
            else
            {
                return null;
            }

            if (shape)
            {
                shape.getRandomPoint(particle);
                particle.x += x;
                particle.y += y;
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
            particle.start.rotation = DegToRad(this.startAngle);
            particle.end.rotation = DegToRad(this.endAngle);
            particle.color = (particle.color & 0x00FFFFFF) | (((this.startAlpha * 0xFF)|0) << 24);
            particle.index = this.alive.length;

            this.alive.push(particle);
        }

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
        var deathCallbackScope = this.deathCallbackScope;

        /* Simulation */
        for (var index = 0; index < length; ++index)
        {
            var particle = particles[index];

            particle.velocityX += gravityX;
            particle.velocityY += gravityY;
            particle.x += particle.velocityX * emitterStep;
            particle.y += particle.velocityY * emitterStep;
            particle.normLifeStep = particle.lifeStep / particle.life;

            var norm = 1 - particle.normLifeStep;
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
                    deathCallback.call(deathCallbackScope, particle);
                }
            }

            particle.lifeStep -= emitterStep;
        }

        //  Move dead particles to the dead array
        //  We can skip this for 'emitCount' number of particles if 'this.enabled'
        var deadLength = particles.length - length;

        if (deadLength > 0)
        {
            dead.push.apply(dead, particles.splice(particles.length - deadLength, deadLength));

            StableSort(particles, this.indexSort);
        }

        this.delayCounter -= emitterStep;

        if (this.delayCounter <= 0 && this.enabled)
        {
            this.emit(this.emitCount);
            this.delayCounter = this.delay / 1000;
        }
    },

    indexSort: function (a, b)
    {
        return a.index - b.index;
    }

});

module.exports = ParticleEmitter;
