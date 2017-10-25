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

        this.accelerationX = 0;
        this.accelerationY = 0;

        this.maxVelocityX = 10000;
        this.maxVelocityY = 10000;

        this.bounce = 0;

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
            rotate: { min: 0, max: 0 },
            scaleX: { min: 1, max: 1 },
            scaleY: { min: 1, max: 1 }
        };
    },

    isAlive: function ()
    {
        return (this.lifeCurrent > 0);
    },

    emit: function (x, y)
    {
        var emitter = this.emitter;

        this.frame = emitter.getFrame();

        if (emitter.zone)
        {
            //  Updates particle.x and particle.y during this call
            emitter.zone.getRandomPoint(this);
        }

        if (x === undefined)
        {
            if (emitter.follow)
            {
                this.x += emitter.follow.x + emitter.followOffset.x;
            }

            this.x += emitter.x.onEmit(this, 'x');
        }
        else
        {
            this.x += x;
        }

        if (y === undefined)
        {
            if (emitter.follow)
            {
                this.y += emitter.follow.y + emitter.followOffset.y;
            }

            this.y += emitter.y.onEmit(this, 'y');
        }
        else
        {
            this.y += y;
        }

        var sx = emitter.speedX.onEmit(this, 'speedX');
        var sy = (emitter.speedY) ? emitter.speedY.onEmit(this, 'speedY') : sx;

        if (emitter.radial)
        {
            var rad = DegToRad(emitter.angle.onEmit(this, 'angle'));

            this.velocityX = Math.cos(rad) * Math.abs(sx);
            this.velocityY = Math.sin(rad) * Math.abs(sy);
        }
        else
        {
            this.velocityX = sx;
            this.velocityY = sy;
        }

        if (emitter.acceleration)
        {
            this.accelerationX = emitter.accelerationX.onEmit(this, 'accelerationX');
            this.accelerationY = emitter.accelerationY.onEmit(this, 'accelerationY');
        }

        this.maxVelocityX = emitter.maxVelocityX.onEmit(this, 'maxVelocityX');
        this.maxVelocityY = emitter.maxVelocityY.onEmit(this, 'maxVelocityY');

        this.life = emitter.lifespan.onEmit(this, 'lifespan');
        this.lifeCurrent = this.life;

        this.scaleX = emitter.scaleX.onEmit(this, 'scaleX');
        this.scaleY = (emitter.scaleY) ? emitter.scaleY.onEmit(this, 'scaleY') : this.scaleX;

        this.angle = emitter.rotate.onEmit(this, 'rotate');
        this.rotation = DegToRad(this.angle);

        this.bounce = emitter.bounce.onEmit(this, 'bounce');

        this.alpha = emitter.alpha.onEmit(this, 'alpha');

        this.color = (this.color & 0x00FFFFFF) | (((this.alpha * 0xFF) | 0) << 24);

        this.index = emitter.alive.length;
    },

    computeVelocity: function (emitter, step)
    {
        var vx = this.velocityX;
        var vy = this.velocityY;

        var ax = this.accelerationX;
        var ay = this.accelerationY;

        var mx = this.maxVelocityX;
        var my = this.maxVelocityY;

        vx += (emitter.gravityX * step);
        vy += (emitter.gravityY * step);

        if (ax)
        {
            vx += (ax * step);
        }

        if (ay)
        {
            vy += (ay * step);
        }

        if (vx > mx)
        {
            vx = mx;
        }
        else if (vx < -mx)
        {
            vx = -mx;
        }

        if (vy > my)
        {
            vy = my;
        }
        else if (vy < -my)
        {
            vy = -my;
        }

        this.velocityX = vx;
        this.velocityY = vy;
    },

    checkBounds: function (emitter)
    {
        var bounds = emitter.bounds;
        var bounce = -this.bounce;

        if (this.x < bounds.x && emitter.collideLeft)
        {
            this.x = bounds.x;
            this.velocityX *= bounce;
        }
        else if (this.x > bounds.right && emitter.collideRight)
        {
            this.x = bounds.right;
            this.velocityX *= bounce;
        }

        if (this.y < bounds.y && emitter.collideTop)
        {
            this.y = bounds.y;
            this.velocityY *= bounce;
        }
        else if (this.y > bounds.bottom && emitter.collideBottom)
        {
            this.y = bounds.bottom;
            this.velocityY *= bounce;
        }
    },

    //  delta = ms, step = delta / 1000
    update: function (delta, step)
    {
        var emitter = this.emitter;

        //  How far along in life is this particle? (t = 0 to 1)
        var t = 1 - (this.lifeCurrent / this.life);

        this.computeVelocity(emitter, step);

        this.x += this.velocityX * step;
        this.y += this.velocityY * step;

        if (emitter.bounds)
        {
            this.checkBounds(emitter);
        }

        this.scaleX = emitter.scaleX.onUpdate(this, 'scaleX', t, this.scaleX);

        if (emitter.scaleY)
        {
            this.scaleY = emitter.scaleY.onUpdate(this, 'scaleY', t, this.scaleY);
        }
        else
        {
            this.scaleY = this.scaleX;
        }

        this.angle = emitter.rotate.onUpdate(this, 'rotate', t, this.angle);
        this.rotation = DegToRad(this.angle);

        this.alpha = emitter.alpha.onUpdate(this, 'alpha', t, this.alpha);

        this.color = (this.color & 0x00FFFFFF) | (((this.alpha * 0xFF) | 0) << 24);

        this.lifeCurrent -= delta;

        return (this.lifeCurrent <= 0);
    }

});

module.exports = Particle;
