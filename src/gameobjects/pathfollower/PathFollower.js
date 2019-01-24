/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../utils/Class');
var DegToRad = require('../../math/DegToRad');
var GetBoolean = require('../../tweens/builders/GetBoolean');
var GetValue = require('../../utils/object/GetValue');
var Sprite = require('../sprite/Sprite');
var TWEEN_CONST = require('../../tweens/tween/const');
var Vector2 = require('../../math/Vector2');

/**
 * Settings for a PathFollower.
 *
 * @typedef {object} PathConfig
 *
 * @property {number} duration - The duration of the path follow.
 * @property {number} from - The start position of the path follow, between 0 and 1.
 * @property {number} to - The end position of the path follow, between 0 and 1.
 * @property {boolean} [positionOnPath=false] - Whether to position the PathFollower on the Path using its path offset.
 * @property {boolean} [rotateToPath=false] - Should the PathFollower automatically rotate to point in the direction of the Path?
 * @property {number} [rotationOffset=0] - If the PathFollower is rotating to match the Path, this value is added to the rotation value. This allows you to rotate objects to a path but control the angle of the rotation as well.
 * @property {number} [startAt=0] - Current start position of the path follow, between 0 and 1.
 */

/**
 * @classdesc
 * A PathFollower Game Object.
 *
 * A PathFollower is a Sprite Game Object with some extra helpers to allow it to follow a Path automatically.
 *
 * Anything you can do with a standard Sprite can be done with this PathFollower, such as animate it, tint it,
 * scale it and so on.
 *
 * PathFollowers are bound to a single Path at any one time and can traverse the length of the Path, from start
 * to finish, forwards or backwards, or from any given point on the Path to its end. They can optionally rotate
 * to face the direction of the path, be offset from the path coordinates or rotate independently of the Path.
 *
 * @class PathFollower
 * @extends Phaser.GameObjects.Sprite
 * @memberof Phaser.GameObjects
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Scene} scene - The Scene to which this PathFollower belongs.
 * @param {Phaser.Curves.Path} path - The Path this PathFollower is following. It can only follow one Path at a time.
 * @param {number} x - The horizontal position of this Game Object in the world.
 * @param {number} y - The vertical position of this Game Object in the world.
 * @param {string} texture - The key of the Texture this Game Object will use to render with, as stored in the Texture Manager.
 * @param {(string|integer)} [frame] - An optional frame from the Texture this Game Object is rendering with.
 */
var PathFollower = new Class({

    Extends: Sprite,

    initialize:

    function PathFollower (scene, path, x, y, texture, frame)
    {
        Sprite.call(this, scene, x, y, texture, frame);

        /**
         * The Path this PathFollower is following. It can only follow one Path at a time.
         *
         * @name Phaser.GameObjects.PathFollower#path
         * @type {Phaser.Curves.Path}
         * @since 3.0.0
         */
        this.path = path;

        /**
         * Should the PathFollower automatically rotate to point in the direction of the Path?
         *
         * @name Phaser.GameObjects.PathFollower#rotateToPath
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.rotateToPath = false;

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
        this.pathRotationOffset = 0;

        /**
         * An additional vector to add to the PathFollowers position, allowing you to offset it from the
         * Path coordinates.
         *
         * @name Phaser.GameObjects.PathFollower#pathOffset
         * @type {Phaser.Math.Vector2}
         * @since 3.0.0
         */
        this.pathOffset = new Vector2(x, y);

        /**
         * A Vector2 that stores the current point of the path the follower is on.
         *
         * @name Phaser.GameObjects.PathFollower#pathVector
         * @type {Phaser.Math.Vector2}
         * @since 3.0.0
         */
        this.pathVector = new Vector2();

        /**
         * The Tween used for following the Path.
         *
         * @name Phaser.GameObjects.PathFollower#pathTween
         * @type {Phaser.Tweens.Tween}
         * @since 3.0.0
         */
        this.pathTween;

        /**
         * Settings for the PathFollower.
         *
         * @name Phaser.GameObjects.PathFollower#pathConfig
         * @type {?PathConfig}
         * @default null
         * @since 3.0.0
         */
        this.pathConfig = null;

        /**
         * Records the direction of the follower so it can change direction.
         *
         * @name Phaser.GameObjects.PathFollower#_prevDirection
         * @type {integer}
         * @private
         * @since 3.0.0
         */
        this._prevDirection = TWEEN_CONST.PLAYING_FORWARD;
    },

    /**
     * Set the Path that this PathFollower should follow.
     *
     * Optionally accepts {@link PathConfig} settings.
     *
     * @method Phaser.GameObjects.PathFollower#setPath
     * @since 3.0.0
     *
     * @param {Phaser.Curves.Path} path - The Path this PathFollower is following. It can only follow one Path at a time.
     * @param {PathConfig} [config] - Settings for the PathFollower.
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
     * @method Phaser.GameObjects.PathFollower#setRotateToPath
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
     * @method Phaser.GameObjects.PathFollower#isFollowing
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
     * @method Phaser.GameObjects.PathFollower#startFollow
     * @since 3.3.0
     *
     * @param {(number|PathConfig)} [config={}] - The duration of the follow, or a PathFollower config object.
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
        config.from = 0;
        config.to = 1;

        //  Can also read extra values out of the config:

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
     * @method Phaser.GameObjects.PathFollower#pauseFollow
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
     * @method Phaser.GameObjects.PathFollower#resumeFollow
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
     * @method Phaser.GameObjects.PathFollower#stopFollow
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
     * @method Phaser.GameObjects.PathFollower#preUpdate
     * @protected
     * @since 3.0.0
     *
     * @param {integer} time - The current timestamp as generated by the Request Animation Frame or SetTimeout.
     * @param {number} delta - The delta time, in ms, elapsed since the last frame.
     */
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
            }
        }
    }

});

module.exports = PathFollower;
