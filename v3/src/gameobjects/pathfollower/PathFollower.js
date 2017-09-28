var Class = require('../../utils/Class');
var DegToRad = require('../../math/DegToRad');
var GetBoolean = require('../../tween/builder/GetBoolean');
var GetValue = require('../../utils/object/GetValue');
var Sprite = require('../sprite/Sprite');
var TWEEN_CONST = require('../../tween/tween/const');
var Vector2 = require('../../math/Vector2');

var PathFollower = new Class({

    Extends: Sprite,

    initialize:

    function PathFollower (scene, path, x, y, texture, frame)
    {
        Sprite.call(this, scene, x, y, texture, frame);

        this.path = path;

        this.rotateToPath = false;

        this.pathRotationVerticalAdjust = false;

        this.pathRotationOffset = 0;

        this.pathOffset = new Vector2(x, y);

        this.pathVector = new Vector2();

        this.pathTween;

        this._prevDirection = TWEEN_CONST.PLAYING_FORWARD;
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

    //  rotation offset in degrees
    setRotateToPath: function (value, offset, verticalAdjust)
    {
        if (offset === undefined) { offset = 0; }
        if (verticalAdjust === undefined) { verticalAdjust = false; }

        this.rotateToPath = value;

        this.pathRotationOffset = offset;
        this.pathRotationVerticalAdjust = verticalAdjust;

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
        this.pathRotationVerticalAdjust = GetBoolean(config, 'verticalAdjust', false);

        this.pathTween = this.scene.sys.tweens.addCounter(config);

        //  The starting point of the path, relative to this follower
        this.path.getStartPoint(this.pathOffset);

        this.pathOffset.x = this.x - this.pathOffset.x;
        this.pathOffset.y = this.y - this.pathOffset.y;

        this._prevDirection = TWEEN_CONST.PLAYING_FORWARD;

        if (this.rotateToPath)
        {
            //  Set the rotation now (in case the tween has a delay on it, etc)
            var nextPoint = this.path.getPoint(0.1);

            this.rotation = Math.atan2(nextPoint.y - this.y, nextPoint.x - this.x) + DegToRad(this.pathRotationOffset);
        }

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

        if (tween)
        {
            var tweenData = tween.data[0];

            if (tweenData.state !== TWEEN_CONST.PLAYING_FORWARD && tweenData.state !== TWEEN_CONST.PLAYING_BACKWARD)
            {
                //  If delayed, etc then bail out
                return;
            }

            var pathVector = this.pathVector;

            this.path.getPoint(tween.getValue(), pathVector);

            pathVector.add(this.pathOffset);

            var oldX = this.x;
            var oldY = this.y;

            this.setPosition(pathVector.x, pathVector.y);

            var speedX = this.x - oldX;
            var speedY = this.y - oldY;

            if (speedX === 0 && speedY === 0)
            {
                //  Bail out early
                return;
            }

            if (tweenData.state !== this._prevDirection)
            {
                //  We've changed direction, so don't do a rotate this frame
                this._prevDirection = tweenData.state;

                return;
            }

            if (this.rotateToPath)
            {
                this.rotation = Math.atan2(speedY, speedX) + DegToRad(this.pathRotationOffset);

                if (this.pathRotationVerticalAdjust)
                {
                    this.flipY = (this.rotation !== 0 && tweenData.state === TWEEN_CONST.PLAYING_BACKWARD);
                }
            }
        }
    }

});

module.exports = PathFollower;
