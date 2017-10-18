var Clamp = require('../../math/Clamp');
var Class = require('../../utils/Class');
var DegToRad = require('../../math/DegToRad');

var Particle = new Class({

    initialize:

    function Particle ()
    {
        //  Phaser.Texture.Frame
        this.frame = null;

        this.index = 0;

        this.x = 0;
        this.y = 0;

        //  Add Acceleration (and Bounce?)

        this.velocityX = 0;
        this.velocityY = 0;

        this.scaleX = 1;
        this.scaleY = 1;

        this.angle = 0;

        this.alpha = 1;

        //  rads
        this.rotation = 0;

        this.scrollFactorX = 1;
        this.scrollFactorY = 1;

        this.color = 0xffffffff;

        //  in ms
        this.life = 1000;
        this.lifeCurrent = 1000;

        //  ease data
        this.data = {
            tint: { min: 0xffffff, max: 0xffffff, current: 0xffffff },
            alpha: { min: 1, max: 1 },
            angle: { min: 0, max: 0 },
            scaleX: { min: 1, max: 1 },
            scaleY: { min: 1, max: 1 }
        };

        /*
        this.start = {
            tint: 0xFFFFFF,
            alpha: 1,
            scale: { x: 1, y: 1 },
            angle: 0
        };

        this.end = {
            tint: 0xFFFFFF,
            alpha: 1,
            scale: { x: 1, y: 1 },
            angle: 0
        };
        */
    },

    reset: function ()
    {
        this.index = 0;

        // this.frame = frame;

        this.x = 0;
        this.y = 0;

        this.velocityX = 0;
        this.velocityY = 0;

        this.life = 1000;
        this.lifeCurrent = 1000;

        // this.scaleX = 1;
        // this.scaleY = 1;

        // this.rotation = 0;

        // this.color = 0xFFFFFFFF;

        // this.life = 1;
        // this.lifeStep = 1;
        // this.normLifeStep = 1;

        /*
        var start = this.start;

        start.tint = 0xFFFFFF;
        start.alpha = 1;
        start.scale.x = 1;
        start.scale.y = 1;
        start.angle = 0;

        var end = this.end;

        end.tint = 0xFFFFFF;
        end.alpha = 1;
        end.scale.x = 1;
        end.scale.y = 1;
        end.angle = 0;
        */

        return this;
    },

    isAlive: function ()
    {
        return (this.lifeCurrent > 0);
    },

    // var rad = DegToRad(Between(this.minEmitAngle, this.maxEmitAngle));
    // var speed = Between(this.minSpeed, this.maxSpeed);
    // var vx = Math.cos(rad) * speed;
    // var vy = Math.sin(rad) * speed;

    // particle.velocityX = vx;
    // particle.velocityY = vy;
    // particle.life = Math.max(this.life, Number.MIN_VALUE);
    // particle.lifeStep = particle.life;
    // particle.start.scale = this.startScale;
    // particle.end.scale = this.endScale;
    // particle.scaleX = this.startScale;
    // particle.scaleY = this.startScale;
    // particle.start.alpha = this.startAlpha;
    // particle.end.alpha = this.endAlpha;
    // particle.start.rotation = DegToRad(this.startAngle);
    // particle.end.rotation = DegToRad(this.endAngle);
    // particle.color = (particle.color & 0x00FFFFFF) | (((this.startAlpha * 0xFF)|0) << 24);
    // particle.index = this.alive.length;

        // this.data = {
        //     tint: { min: 0xffffff, max: 0xffffff, current: 0xffffff },
        //     alpha: { min: 1, max: 1, current: 1 },
        //     angle: { min: 0, max: 0, current: 0 },
        //     scaleX: { min: 1, max: 1, current: 1 },
        //     scaleY: { min: 1, max: 1, current: 1 }
        // };

    emit: function (emitter)
    {
        this.frame = emitter.getFrame();

        if (emitter.zone)
        {
            emitter.zone.getRandomPoint(this);
        }

        this.x += emitter.x;
        this.y += emitter.y;

        var sx = emitter.speed.getRandomX();
        var sy = emitter.speed.getRandomY();

        if (emitter.radial)
        {
            var rad = DegToRad(emitter.angle.getRandom());

            this.velocityX = Math.cos(rad) * Math.abs(sx);
            this.velocityY = Math.sin(rad) * Math.abs(sy);
        }
        else
        {
            this.velocityX = sx;
            this.velocityY = sy;
        }

        this.life = emitter.lifespan.getRandom();
        this.lifeCurrent = this.life;

        //  eased values

        // emitter.scale.copyXToMinMax(this.data.scaleX);
        // emitter.scale.copyYToMinMax(this.data.scaleY);

        // emitter.particleAngle.copyToMinMax(this.data.angle);

        // emitter.alpha.copyToMinMax(this.data.alpha);

        // this.scaleX = emitter.scale.xMin;
        // this.scaleY = emitter.scale.yMin;

        // this.rotation = DegToRad(emitter.particleAngle.min);

        //  Set the starting ease data

        // emitter.scale.copyX(this.start.scale);
        // emitter.scale.copyY(this.end.scale);

        // this.start.alpha = emitter.alpha.min;
        // this.end.alpha = emitter.alpha.max;

        // this.start.rotation = emitter.particleAngle.min;
        // this.end.rotation = emitter.particleAngle.max;

        // this.color = (this.color & 0x00ffffff) | (((this.start.alpha * 0xff) | 0) << 24);

        this.index = emitter.alive.length;
    },

    // particle.velocityX += gravityX;
    // particle.velocityY += gravityY;
    // particle.x += particle.velocityX * emitterStep;
    // particle.y += particle.velocityY * emitterStep;
    // particle.normLifeStep = particle.lifeStep / particle.life;

    // var norm = 1 - particle.normLifeStep;
    // var alphaEase = this.easingFunctionAlpha(norm);
    // var scaleEase = this.easingFunctionScale(norm);
    // var rotationEase = this.easingFunctionRotation(norm);
    // var alphaf = (particle.end.alpha - particle.start.alpha) * alphaEase + particle.start.alpha;
    // var scale = (particle.end.scale - particle.start.scale) * scaleEase + particle.start.scale;
    // var rotation = (particle.end.rotation - particle.start.rotation) * rotationEase + particle.start.rotation;

    // particle.scaleX = particle.scaleY = scale;
    // particle.color = (particle.color & 0x00FFFFFF) | (((alphaf * 0xFF)|0) << 24);
    // particle.rotation = rotation;

    //  delta = ms, step = delta / 1000
    update: function (emitter, delta, step)
    {
        //  How far along in life is this particle? (t = 0 to 1)
        // var t = this.lifeCurrent / this.life, 0, 1;

        this.velocityX += (emitter.gravity.x * step);
        this.velocityY += (emitter.gravity.y * step);

        this.x += this.velocityX * step;
        this.y += this.velocityY * step;

        //  scale

        //  rotation

        //  alpha

        this.lifeCurrent -= delta;

        return (this.lifeCurrent <= 0);
    }

});

module.exports = Particle;
