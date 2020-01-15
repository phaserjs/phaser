/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var DegToRad = require('../../math/DegToRad');
var GetBoolean = require('../../tweens/builders/GetBoolean');
var GetValue = require('../../utils/object/GetValue');
var TWEEN_CONST = require('../../tweens/tween/const');
var Vector2 = require('../../math/Vector2');

/**
 * Provides methods used for managing a Game Object following a Path.
 * Should be applied as a mixin and not used directly.
 *
 * @namespace Phaser.GameObjects.Components.PathFollower
 * @since 3.17.0
 */

var PathFollower = {

    /**
     * The Path this PathFollower is following. It can only follow one Path at a time.
     *
     * @name Phaser.GameObjects.Components.PathFollower#path
     * @type {Phaser.Curves.Path}
     * @since 3.0.0
     */
    path: null,

    /**
     * Should the PathFollower automatically rotate to point in the direction of the Path?
     *
     * @name Phaser.GameObjects.Components.PathFollower#rotateToPath
     * @type {boolean}
     * @default false
     * @since 3.0.0
     */
    rotateToPath: false,

    /**
     * If the PathFollower is rotating to match the Path (@see Phaser.GameObjects.PathFollower#rotateToPath)
     * this value is added to the rotation value. This allows you to rotate objects to a path but control
     * the angle of the rotation as well.
     *
     * @name Phaser.GameObjects.PathFollower#pathRotationOffset
     * @type {number}
     * @default 0
     * @since 3.0.0
     */
    pathRotationOffset: 0,

    /**
     * An additional vector to add to the PathFollowers position, allowing you to offset it from the
     * Path coordinates.
     *
     * @name Phaser.GameObjects.PathFollower#pathOffset
     * @type {Phaser.Math.Vector2}
     * @since 3.0.0
     */
    pathOffset: null,

    /**
     * A Vector2 that stores the current point of the path the follower is on.
     *
     * @name Phaser.GameObjects.PathFollower#pathVector
     * @type {Phaser.Math.Vector2}
     * @since 3.0.0
     */
    pathVector: null,

    /**
     * The Tween used for following the Path.
     *
     * @name Phaser.GameObjects.PathFollower#pathTween
     * @type {Phaser.Tweens.Tween}
     * @since 3.0.0
     */
    pathTween: null,

    /**
     * Settings for the PathFollower.
     *
     * @name Phaser.GameObjects.PathFollower#pathConfig
     * @type {?Phaser.Types.GameObjects.PathFollower.PathConfig}
     * @default null
     * @since 3.0.0
     */
    pathConfig: null,

    /**
     * Records the direction of the follower so it can change direction.
     *
     * @name Phaser.GameObjects.PathFollower#_prevDirection
     * @type {integer}
     * @private
     * @since 3.0.0
     */
    _prevDirection: TWEEN_CONST.PLAYING_FORWARD,

    /**
     * Set the Path that this PathFollower should follow.
     *
     * Optionally accepts {@link Phaser.Types.GameObjects.PathFollower.PathConfig} settings.
     *
     * @method Phaser.GameObjects.Components.PathFollower#setPath
     * @since 3.0.0
     *
     * @param {Phaser.Curves.Path} path - The Path this PathFollower is following. It can only follow one Path at a time.
     * @param {(number|Phaser.Types.GameObjects.PathFollower.PathConfig|Phaser.Types.Tweens.NumberTweenBuilderConfig)} [config] - Settings for the PathFollower.
     *
     * @return {Phaser.GameObjects.PathFollower} This Game Object.
     */
    setPath: function (path, config)
    {
        if (config === undefined) { config = this.pathConfig; }

        var tween = this.pathTween;

        if (tween && tween.isPlaying())
        {
            tween.stop();
        }

        this.path = path;

        if (config)
        {
            this.startFollow(config);
        }

        return this;
    },

    /**
     * Set whether the PathFollower should automatically rotate to point in the direction of the Path.
     *
     * @method Phaser.GameObjects.Components.PathFollower#setRotateToPath
     * @since 3.0.0
     *
     * @param {boolean} value - Whether the PathFollower should automatically rotate to point in the direction of the Path.
     * @param {number} [offset=0] - Rotation offset in degrees.
     *
     * @return {Phaser.GameObjects.PathFollower} This Game Object.
     */
    setRotateToPath: function (value, offset)
    {
        if (offset === undefined) { offset = 0; }

        this.rotateToPath = value;

        this.pathRotationOffset = offset;

        return this;
    },

    /**
     * Is this PathFollower actively following a Path or not?
     *
     * To be considered as `isFollowing` it must be currently moving on a Path, and not paused.
     *
     * @method Phaser.GameObjects.Components.PathFollower#isFollowing
     * @since 3.0.0
     *
     * @return {boolean} `true` is this PathFollower is actively following a Path, otherwise `false`.
     */
    isFollowing: function ()
    {
        var tween = this.pathTween;

        return (tween && tween.isPlaying());
    },

    /**
     * Starts this PathFollower following its given Path.
     *
     * @method Phaser.GameObjects.Components.PathFollower#startFollow
     * @since 3.3.0
     *
     * @param {(number|Phaser.Types.GameObjects.PathFollower.PathConfig|Phaser.Types.Tweens.NumberTweenBuilderConfig)} [config={}] - The duration of the follow, or a PathFollower config object.
     * @param {number} [startAt=0] - Optional start position of the follow, between 0 and 1.
     *
     * @return {Phaser.GameObjects.PathFollower} This Game Object.
     */
    startFollow: function (config, startAt)
    {
        if (config === undefined) { config = {}; }
        if (startAt === undefined) { startAt = 0; }

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
        config.from = GetValue(config, 'from', 0);
        config.to = GetValue(config, 'to', 1);

        var positionOnPath = GetBoolean(config, 'positionOnPath', false);

        this.rotateToPath = GetBoolean(config, 'rotateToPath', false);
        this.pathRotationOffset = GetValue(config, 'rotationOffset', 0);

        //  This works, but it's not an ideal way of doing it as the follower jumps position
        var seek = GetValue(config, 'startAt', startAt);

        if (seek)
        {
            config.onStart = function (tween)
            {
                var tweenData = tween.data[0];
                tweenData.progress = seek;
                tweenData.elapsed = tweenData.duration * seek;
                var v = tweenData.ease(tweenData.progress);
                tweenData.current = tweenData.start + ((tweenData.end - tweenData.start) * v);
                tweenData.target[tweenData.key] = tweenData.current;
            };
        }

        if (!this.pathOffset)
        {
            this.pathOffset = new Vector2(this.x, this.y);
        }

        if (!this.pathVector)
        {
            this.pathVector = new Vector2();
        }

        this.pathTween = this.scene.sys.tweens.addCounter(config);

        //  The starting point of the path, relative to this follower
        this.path.getStartPoint(this.pathOffset);

        if (positionOnPath)
        {
            this.x = this.pathOffset.x;
            this.y = this.pathOffset.y;
        }

        this.pathOffset.x = this.x - this.pathOffset.x;
        this.pathOffset.y = this.y - this.pathOffset.y;

        this._prevDirection = TWEEN_CONST.PLAYING_FORWARD;

        if (this.rotateToPath)
        {
            //  Set the rotation now (in case the tween has a delay on it, etc)
            var nextPoint = this.path.getPoint(0.1);

            this.rotation = Math.atan2(nextPoint.y - this.y, nextPoint.x - this.x) + DegToRad(this.pathRotationOffset);
        }

        this.pathConfig = config;

        return this;
    },

    /**
     * Pauses this PathFollower. It will still continue to render, but it will remain motionless at the
     * point on the Path at which you paused it.
     *
     * @method Phaser.GameObjects.Components.PathFollower#pauseFollow
     * @since 3.3.0
     *
     * @return {Phaser.GameObjects.PathFollower} This Game Object.
     */
    pauseFollow: function ()
    {
        var tween = this.pathTween;

        if (tween && tween.isPlaying())
        {
            tween.pause();
        }

        return this;
    },

    /**
     * Resumes a previously paused PathFollower.
     *
     * If the PathFollower was not paused this has no effect.
     *
     * @method Phaser.GameObjects.Components.PathFollower#resumeFollow
     * @since 3.3.0
     *
     * @return {Phaser.GameObjects.PathFollower} This Game Object.
     */
    resumeFollow: function ()
    {
        var tween = this.pathTween;

        if (tween && tween.isPaused())
        {
            tween.resume();
        }

        return this;
    },

    /**
     * Stops this PathFollower from following the path any longer.
     *
     * This will invoke any 'stop' conditions that may exist on the Path, or for the follower.
     *
     * @method Phaser.GameObjects.Components.PathFollower#stopFollow
     * @since 3.3.0
     *
     * @return {Phaser.GameObjects.PathFollower} This Game Object.
     */
    stopFollow: function ()
    {
        var tween = this.pathTween;

        if (tween && tween.isPlaying())
        {
            tween.stop();
        }

        return this;
    },

    /**
     * Internal update handler that advances this PathFollower along the path.
     *
     * Called automatically by the Scene step, should not typically be called directly.
     *
     * @method Phaser.GameObjects.Components.PathFollower#pathUpdate
     * @since 3.17.0
     */
    pathUpdate: function ()
    {
        var tween = this.pathTween;

        if (tween)
        {
            var tweenData = tween.data[0];
            var pathVector = this.pathVector;

            if (tweenData.state !== TWEEN_CONST.COMPLETE)
            {
                this.path.getPoint(1, pathVector);

                pathVector.add(this.pathOffset);
   
                this.setPosition(pathVector.x, pathVector.y);

                return;
            }
            else if (tweenData.state !== TWEEN_CONST.PLAYING_FORWARD && tweenData.state !== TWEEN_CONST.PLAYING_BACKWARD)
            {
                //  If delayed, etc then bail out
                return;
            }

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
            }
        }
    }

};

module.exports = PathFollower;
