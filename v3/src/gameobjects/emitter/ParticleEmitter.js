
var Class = require('../../utils/Class');
var Components = require('../components');
var GameObject = require('../GameObject');
var Render = require('./ParticleEmitterRender');
var Particle = require('./Particle');
var Between = require('../../math/Between');
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
        this.minAngle = 0;
        this.maxAngle = 0;
        this.gravityX = 0;
        this.gravityY = 0;
        this.life = 1.0;
        this.setTexture(texture, frame);
        this.setPosition(x, y);
    },

    setSpeed: function (min, max)
    {
        this.minSpeed = min;
        this.maxSpeed = max;
    },

    setAngle: function (min, max)
    {
        this.minAngle = min;
        this.maxAngle = max;
    },

    setGravity: function (x, y)
    {
        this.gravityX = x;
        this.gravityY = y;
    },

    reserve: function (particleCount)
    {
        var dead = this.dead;
        for (var count = 0; count < particleCount; ++count)
        {
            dead.push(new Particle(this.x, this.y));
        }
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

    killAll: function ()
    {
        var dead = this.dead;
        var alive = this.alive;

        while (alive.length > 0)
        {
            dead.push(alive.pop());
        }
    },

    forEachAlive: function (callback, thisArg)
    {
        var alive = this.alive;
        var length = alive.length;

        for (var index = 0; index < length; ++index)
        {
            callback.call(thisArg, alive[index]);
        }
    },

    forEachDead: function (callback, thisArg)
    {
        var dead = this.dead;
        var length = dead.length;

        for (var index = 0; index < length; ++index)
        {
            callback.call(thisArg, dead[index]);
        }
    },

    emitParticle: function()
    {
        var particle = null;
        var rad = Between(this.minAngle, this.maxAngle) * Math.PI / 180;
        var vx = Math.cos(rad) * Between(this.minSpeed, this.maxSpeed);
        var vy = Math.sin(rad) * Between(this.minSpeed, this.maxSpeed);
        
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
        particle.life = this.life;
        particle.index = this.alive.length;
                
        this.alive.push(particle);
    },

    preUpdate: function (time, delta)
    {
        var dead = this.dead;
        var particles = this.alive;
        var length = particles.length;
        var step = delta / 1000;
        var gravityX = this.gravityX * step;
        var gravityY = this.gravityY * step;

        /* Simulation */
        for (var index = 0; index < length; ++index)
        {
            var particle = particles[index];

            particle.velocityX += gravityX;
            particle.velocityY += gravityY;
            particle.x += particle.velocityX * step;
            particle.y += particle.velocityY * step;
            particle.rotation += particle.angularVelocity * step;
            particle.life -= step;

            if (particle.life <= 0)
            {
                let last = particles[length - 1];
                particles[length - 1] = particle;
                particles[index] = last;
                index -= 1;
                length -= 1;
            }
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
