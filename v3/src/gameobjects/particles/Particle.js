var Class = require('../../utils/Class');
var DegToRad = require('../../math/DegToRad');

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
            alpha: { min: 1, max: 1 },
            angle: { min: 0, max: 0 },
            scaleX: { min: 1, max: 1 },
            scaleY: { min: 1, max: 1 }
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

        this.x += emitter.x.onEmit(this, 'x');
        this.y += emitter.y.onEmit(this, 'y');

        var sx = emitter.speedX.onEmit(this, 'speedX');
        var sy = (emitter.speedY) ? emitter.speedY.onEmit(this, 'speedY') : sx;

        if (emitter.radial)
        {
            var rad = DegToRad(emitter.emitterAngle.onEmit(this, 'angle'));

            this.velocityX = Math.cos(rad) * Math.abs(sx);
            this.velocityY = Math.sin(rad) * Math.abs(sy);
        }
        else
        {
            this.velocityX = sx;
            this.velocityY = sy;
        }

        this.life = emitter.lifespan.onEmit(this, 'lifespan');
        this.lifeCurrent = this.life;

        this.scaleX = emitter.scaleX.onEmit(this, 'scaleX');
        this.scaleY = (emitter.scaleY) ? emitter.scaleY.onEmit(this, 'scaleY') : this.scaleX;

        this.angle = emitter.particleAngle.onEmit(this, 'angle');
        this.rotation = DegToRad(this.angle);

        this.alpha = emitter.alpha.onEmit(this, 'alpha');

        this.color = (this.color & 0x00FFFFFF) | (((this.alpha * 0xFF) | 0) << 24);

        this.index = emitter.alive.length;
    },

    //  delta = ms, step = delta / 1000
    update: function (delta, step)
    {
        var emitter = this.emitter;

        //  How far along in life is this particle? (t = 0 to 1)
        var t = 1 - (this.lifeCurrent / this.life);

        this.velocityX += (emitter.gravityX * step);
        this.velocityY += (emitter.gravityY * step);

        this.x += this.velocityX * step;
        this.y += this.velocityY * step;

        this.scaleX = emitter.scaleX.onUpdate(this, 'scaleX', t, this.scaleX);

        if (emitter.scaleY)
        {
            this.scaleY = emitter.scaleY.onUpdate(this, 'scaleY', t, this.scaleY);
        }
        else
        {
            this.scaleY = this.scaleX;
        }

        this.angle = emitter.particleAngle.onUpdate(this, 'angle', t, this.angle);
        this.rotation = DegToRad(this.angle);

        this.alpha = emitter.alpha.onUpdate(this, 'alpha', t, this.alpha);

        this.color = (this.color & 0x00FFFFFF) | (((this.alpha * 0xFF) | 0) << 24);

        this.lifeCurrent -= delta;

        return (this.lifeCurrent <= 0);
    }

});

module.exports = Particle;
