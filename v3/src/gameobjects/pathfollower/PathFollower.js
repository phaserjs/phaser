var Class = require('../../utils/Class');
var Linear = require('../../math/easing/Linear');
var Sprite = require('../sprite/Sprite');
var Vector2 = require('../../math/Vector2');
// GetEaseFunction

var PathFollower = new Class({

    Extends: Sprite,

    initialize:

    function PathFollower (scene, path, x, y, texture, frame)
    {
        Sprite.call(this, scene, x, y, texture, frame);

        this.path = path;

        this.pathOffset = new Vector2(x, y);
        this.pathVector = new Vector2();

        //  Path
        //  Direction (forwards, backwards)
        //  Speed (or is that controlled by the path?)
        //  Rotate to face direction
        //  Speed function (ease, default Linear)
        //  Start from T along the path
        //  Start from path x/y, or current x/y

        this.isFollowing = false;
        this.pathT = 0;
        this.timeScale = 1;
        this.elapsed = 0;
        this.progress = 0;
        this.duration = 0;
        this.ease = Linear;
    },

    start: function (duration)
    {
        this.duration = duration;
        this.isFollowing = true;
        this.pathT = 0;
        this.timeScale = 1;
        this.elapsed = 0;
        this.progress = 0;

        //  path.startPoint

        //  The starting point of the path, relative to this follower

        var start = this.path.getStartPoint();
        var diffX = this.pathOffset.x - start.x;
        var diffY = this.pathOffset.y - start.y;

        this.pathOffset.set(diffX, diffY);
    },

    preUpdate: function (time, delta)
    {
        this.anims.update(time, delta);

        if (!this.isFollowing)
        {
            return;
        }

        //  Apply ease to pathT
        delta *= this.timeScale;

        this.elapsed += delta;
        this.progress = Math.min(this.elapsed / this.duration, 1);

        if (this.elapsed > this.duration)
        {
            var diff = this.elapsed - this.duration;
            this.elapsed = this.duration;
        }

        var forward = true;

        this.progress = this.elapsed / this.duration;

        if (forward)
        {
            this.pathT = this.ease(this.progress);
        }
        else
        {
            this.pathT = this.ease(1 - this.progress);
        }

        this.path.getPoint(this.pathT, this.pathVector);

        this.pathVector.add(this.pathOffset);

        this.setPosition(this.pathVector.x, this.pathVector.y);

        // this.setDepth(this.y);

        if (this.progress === 1)
        {
            this.isFollowing = false;
        }
    }

});

module.exports = PathFollower;
