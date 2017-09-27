var Class = require('../../utils/Class');
var GetBoolean = require('../../tween/builder/GetBoolean');
var GetValue = require('../../utils/object/GetValue');
var Sprite = require('../sprite/Sprite');
var Vector2 = require('../../math/Vector2');

var PathFollower = new Class({

    Extends: Sprite,

    initialize:

    function PathFollower (scene, path, x, y, texture, frame)
    {
        Sprite.call(this, scene, x, y, texture, frame);

        this.path = path;

        this.rotateToPath = false;
        this.pathRotationOffset = 0;

        this.pathOffset = new Vector2(x, y);

        this.pathVector = new Vector2();

        this.pathTween;
    },

    setPath: function (path, config)
    {
        var tween = this.pathTween;

        if (tween && tween.isPlaying())
        {
            tween.stop();
        }

        this.path = path;

        if (config)
        {
            this.start(config);
        }

        return this;
    },

    //  rotation offset in radians
    setRotateToPath: function (value, offset)
    {
        if (offset === undefined) { offset = 0; }

        this.rotateToPath = value;
        this.pathRotationOffset = offset;

        return this;
    },

    isFollowing: function ()
    {
        var tween = this.pathTween;

        return (tween && tween.isPlaying());
    },

    start: function (config)
    {
        if (config === undefined) { config = {}; }

        var tween = this.pathTween;

        if (tween && tween.isPlaying())
        {
            tween.stop();
        }

        if (typeof config === 'number')
        {
            config = { duration: config };
        }

        //  Override in case they've been specified in the config
        config.from = 0;
        config.to = 1;

        //  Can also read extra values out of the config:

        this.rotateToPath = GetBoolean(config, 'rotateToPath', false);
        this.pathRotationOffset = GetValue(config, 'rotationOffset', 0);

        this.pathTween = this.scene.sys.tweens.addCounter(config);

        //  The starting point of the path, relative to this follower
        this.path.getStartPoint(this.pathOffset);

        this.pathOffset.x = this.x - this.pathOffset.x;
        this.pathOffset.y = this.y - this.pathOffset.y;

        return this;
    },

    pause: function ()
    {
        var tween = this.pathTween;

        if (tween && tween.isPlaying())
        {
            tween.pause();
        }

        return this;
    },

    resume: function ()
    {
        var tween = this.pathTween;

        if (tween && tween.isPaused())
        {
            tween.resume();
        }

        return this;
    },

    stop: function ()
    {
        var tween = this.pathTween;

        if (tween && tween.isPlaying())
        {
            tween.stop();
        }

        return this;
    },

    preUpdate: function (time, delta)
    {
        this.anims.update(time, delta);

        var tween = this.pathTween;

        if (tween && tween.isPlaying())
        {
            var pathVector = this.pathVector;

            this.path.getPoint(tween.getValue(), pathVector);

            pathVector.add(this.pathOffset);

            var oldX = this.x;
            var oldY = this.y;

            this.setPosition(pathVector.x, pathVector.y);

            if (this.rotateToPath)
            {
                this.rotation = Math.atan2(this.y - oldY, this.x - oldX);
            }
        }
    }

});

module.exports = PathFollower;
