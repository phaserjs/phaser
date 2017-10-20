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
            alpha: { min: 1, max: 1, calc: 0 },
            angle: { min: 0, max: 0, calc: 0 },
            scaleX: { min: 1, max: 1, calc: 0 },
            scaleY: { min: 1, max: 1, calc: 0 }
        };
    },

    isAlive: function ()
    {
        return (this.lifeCurrent > 0);
    },

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
        emitter.scale.copyXToMinMax(this.data.scaleX);
        emitter.scale.copyYToMinMax(this.data.scaleY);
        emitter.particleAngle.copyToMinMax(this.data.angle);
        emitter.alpha.copyToMinMax(this.data.alpha);

        //  Pre-calc ease values
        this.data.scaleX.calc = this.data.scaleX.max - this.data.scaleX.min;
        this.data.scaleY.calc = this.data.scaleY.max - this.data.scaleY.min;
        this.data.angle.calc = this.data.angle.max - this.data.angle.min;
        this.data.alpha.calc = this.data.alpha.max - this.data.alpha.min;

        //  Set initial values
        this.rotation = DegToRad(this.data.angle.min);
        this.alpha = this.data.alpha.min;
        this.color = (this.color & 0x00FFFFFF) | (((this.alpha * 0xFF) | 0) << 24);
        this.scaleX = this.data.scaleX.min;
        this.scaleY = this.data.scaleY.min;

        this.index = emitter.alive.length;
    },

    //  delta = ms, step = delta / 1000
    update: function (emitter, delta, step)
    {
        //  How far along in life is this particle? (t = 0 to 1)
        var t = 1 - (this.lifeCurrent / this.life);

        this.velocityX += (emitter.gravity.x * step);
        this.velocityY += (emitter.gravity.y * step);

        this.x += this.velocityX * step;
        this.y += this.velocityY * step;

        this.scaleX = this.data.scaleX.calc * emitter.easingFunctionScale(t) + this.data.scaleX.min;
        this.scaleY = this.data.scaleY.calc * emitter.easingFunctionScale(t) + this.data.scaleY.min;

        this.rotation = DegToRad(this.data.angle.calc * emitter.easingFunctionRotation(t) + this.data.angle.min);

        this.alpha = this.data.alpha.calc * emitter.easingFunctionAlpha(t) + this.data.alpha.min;

        this.color = (this.color & 0x00FFFFFF) | (((this.alpha * 0xFF) | 0) << 24);

        this.lifeCurrent -= delta;

        return (this.lifeCurrent <= 0);
    }

});

module.exports = Particle;
