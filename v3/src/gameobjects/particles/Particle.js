var Class = require('../../utils/Class');
var DegToRad = require('../../math/DegToRad');
var FloatBetween = require('../../math/FloatBetween');

var Particle = new Class({

    initialize:

    function Particle (emitter)
    {
        this.emitter = emitter;

        //  Phaser.Texture.Frame
        this.frame = null;

        this.index = 0;

        this.x = 0;
        this.y = 0;

        this.velocityX = 0;
        this.velocityY = 0;

        this.scaleX = 1;
        this.scaleY = 1;

        this.alpha = 1;

        //  degs
        this.angle = 0;

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

    emit: function ()
    {
        var emitter = this.emitter;

        this.frame = emitter.getFrame();

        if (emitter.zone)
        {
            emitter.zone.getRandomPoint(this);
        }

        this.x += emitter.x.getNext();
        this.y += emitter.y.getNext();

        var sx = emitter.speedX.getNext();
        var sy = emitter.speedY.getNext();

        if (emitter.radial)
        {
            var rad = DegToRad(emitter.emitterAngle.getNext());

            this.velocityX = Math.cos(rad) * Math.abs(sx);
            this.velocityY = Math.sin(rad) * Math.abs(sy);
        }
        else
        {
            this.velocityX = sx;
            this.velocityY = sy;
        }

        this.life = emitter.lifespan.getNext();
        this.lifeCurrent = this.life;

        //  eased values

        var dataScaleX = this.data.scaleX;
        var dataScaleY = this.data.scaleY;
        var dataAngle = this.data.angle;
        var dataAlpha = this.data.alpha;

        emitter.scaleX.copyToMinMax(dataScaleX);
        emitter.scaleY.copyToMinMax(dataScaleY);
        emitter.particleAngle.copyToMinMax(dataAngle);
        emitter.alpha.copyToMinMax(dataAlpha);

        //  Random overrides

        if (emitter.randomScaleX)
        {
            var randomScaleX = FloatBetween(emitter.randomScaleX[0], emitter.randomScaleX[1]);

            //  If there is no current ease value set we override them both
            if (dataScaleX.min === dataScaleX.max)
            {
                dataScaleX.min = randomScaleX;
                dataScaleX.max = randomScaleX;
            }
            else
            {
                //  Otherwise we just reset the start value, so it still eases to the end value
                dataScaleX.min = randomScaleX;
            }
        }

        if (emitter.randomScaleY)
        {
            var randomScaleY = FloatBetween(emitter.randomScaleY[0], emitter.randomScaleY[1]);

            //  If there is no current ease value set we override them both
            if (dataScaleY.min === dataScaleY.max)
            {
                dataScaleY.min = randomScaleY;
                dataScaleY.max = randomScaleY;
            }
            else
            {
                //  Otherwise we just reset the start value, so it still eases to the end value
                dataScaleY.min = randomScaleY;
            }
        }

        if (emitter.randomAngle)
        {
            var randomAngle = FloatBetween(emitter.randomAngle[0], emitter.randomAngle[1]);

            //  If there is no current ease value set we override them both
            if (dataAngle.min === dataAngle.max)
            {
                dataAngle.min = randomAngle;
                dataAngle.max = randomAngle;
            }
            else
            {
                //  Otherwise we just reset the start value, so it still eases to the end value
                dataAngle.min = randomAngle;
            }
        }

        if (emitter.randomAlpha)
        {
            var randomAlpha = FloatBetween(emitter.randomAlpha[0], emitter.randomAlpha[1]);

            //  If there is no current ease value set we override them both
            if (dataAlpha.min === dataAlpha.max)
            {
                dataAlpha.min = randomAlpha;
                dataAlpha.max = randomAlpha;
            }
            else
            {
                //  Otherwise we just reset the start value, so it still eases to the end value
                dataAlpha.min = randomAlpha;
            }
        }

        //  Pre-calc ease values
        dataScaleX.calc = dataScaleX.max - dataScaleX.min;
        dataScaleY.calc = dataScaleY.max - dataScaleY.min;
        dataAngle.calc = dataAngle.max - dataAngle.min;
        dataAlpha.calc = dataAlpha.max - dataAlpha.min;

        //  Set initial values
        this.scaleX = dataScaleX.min;
        this.scaleY = dataScaleY.min;
        this.angle = dataAngle.min;
        this.rotation = DegToRad(dataAngle.min);

        this.alpha = dataAlpha.min;
        this.color = (this.color & 0x00FFFFFF) | (((this.alpha * 0xFF) | 0) << 24);

        this.index = emitter.alive.length;
    },

    //  delta = ms, step = delta / 1000
    update: function (delta, step)
    {
        var emitter = this.emitter;

        //  How far along in life is this particle? (t = 0 to 1)
        var t = 1 - (this.lifeCurrent / this.life);

        this.velocityX += (emitter.gravity.x * step);
        this.velocityY += (emitter.gravity.y * step);

        this.x += this.velocityX * step;
        this.y += this.velocityY * step;

        var data = this.data;

        this.scaleX = data.scaleX.calc * emitter.easingFunctionScale(t) + data.scaleX.min;
        this.scaleY = data.scaleY.calc * emitter.easingFunctionScale(t) + data.scaleY.min;

        this.angle = data.angle.calc * emitter.easingFunctionRotation(t) + data.angle.min;
        this.rotation = DegToRad(this.angle);

        this.alpha = data.alpha.calc * emitter.easingFunctionAlpha(t) + data.alpha.min;

        this.color = (this.color & 0x00FFFFFF) | (((this.alpha * 0xFF) | 0) << 24);

        this.lifeCurrent -= delta;

        return (this.lifeCurrent <= 0);
    }

});

module.exports = Particle;
