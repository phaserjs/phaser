var Class = require('../../utils/Class');
var DegToRad = require('../../math/DegToRad');
var DistanceBetween = require('../../math/distance/DistanceBetween');

//  Phaser.GameObjects.Particle

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

        this.tint = 0xffffffff;
        this.color = 0xffffffff;

        //  in ms
        this.life = 1000;
        this.lifeCurrent = 1000;
        this.delayCurrent = 0;

        //  0-1
        this.lifeT = 0;

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

    fire: function (x, y)
    {
        var emitter = this.emitter;

        this.frame = emitter.getFrame();

        if (emitter.emitZone)
        {
            //  Updates particle.x and particle.y during this call
            emitter.emitZone.getPoint(this);
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

        this.life = emitter.lifespan.onEmit(this, 'lifespan');
        this.lifeCurrent = this.life;
        this.lifeT = 0;

        var sx = emitter.speedX.onEmit(this, 'speedX');
        var sy = (emitter.speedY) ? emitter.speedY.onEmit(this, 'speedY') : sx;

        if (emitter.radial)
        {
            var rad = DegToRad(emitter.angle.onEmit(this, 'angle'));

            this.velocityX = Math.cos(rad) * Math.abs(sx);
            this.velocityY = Math.sin(rad) * Math.abs(sy);
        }
        else if (emitter.moveTo)
        {
            var mx = emitter.moveToX.onEmit(this, 'moveToX');
            var my = (emitter.moveToY) ? emitter.moveToY.onEmit(this, 'moveToY') : mx;

            var angle = Math.atan2(my - this.y, mx - this.x);

            var speed = DistanceBetween(this.x, this.y, mx, my) / (this.life / 1000);

            //  We know how many pixels we need to move, but how fast?
            // var speed = this.distanceToXY(displayObject, x, y) / (maxTime / 1000);

            this.velocityX = Math.cos(angle) * speed;
            this.velocityY = Math.sin(angle) * speed;
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

        this.delayCurrent = emitter.delay.onEmit(this, 'delay');

        this.scaleX = emitter.scaleX.onEmit(this, 'scaleX');
        this.scaleY = (emitter.scaleY) ? emitter.scaleY.onEmit(this, 'scaleY') : this.scaleX;

        this.angle = emitter.rotate.onEmit(this, 'rotate');
        this.rotation = DegToRad(this.angle);

        this.bounce = emitter.bounce.onEmit(this, 'bounce');

        this.alpha = emitter.alpha.onEmit(this, 'alpha');

        this.tint = emitter.tint.onEmit(this, 'tint');

        this.color = (this.tint & 0x00FFFFFF) | (((this.alpha * 0xFF) | 0) << 24);

        this.index = emitter.alive.length;
    },

    computeVelocity: function (emitter, delta, step, processors)
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

        //  Apply any additional processors
        for (var i = 0; i < processors.length; i++)
        {
            processors[i].update(this, delta, step);
        }
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
    update: function (delta, step, processors)
    {
        if (this.delayCurrent > 0)
        {
            this.delayCurrent -= delta;

            return false;
        }

        var emitter = this.emitter;

        //  How far along in life is this particle? (t = 0 to 1)
        var t = 1 - (this.lifeCurrent / this.life);

        this.lifeT = t;

        this.computeVelocity(emitter, delta, step, processors);

        this.x += this.velocityX * step;
        this.y += this.velocityY * step;

        if (emitter.bounds)
        {
            this.checkBounds(emitter);
        }

        if (emitter.deathZone && emitter.deathZone.willKill(this))
        {
            this.lifeCurrent = 0;

            //  No need to go any further, particle has been killed
            return true;
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

        this.tint = emitter.tint.onUpdate(this, 'tint', t, this.tint);

        this.color = (this.tint & 0x00FFFFFF) | (((this.alpha * 0xFF) | 0) << 24);

        this.lifeCurrent -= delta;

        return (this.lifeCurrent <= 0);
    }

});

module.exports = Particle;
