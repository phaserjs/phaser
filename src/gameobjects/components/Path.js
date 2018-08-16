/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var DegToRad = require('../../math/DegToRad');
var GetBoolean = require('../../tweens/builders/GetBoolean');
var GetValue = require('../../utils/object/GetValue');
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
 * @property {boolean} [verticalAdjust=false] - [description]
 */

/**
 * Provides properties and methods used to allow a Game Object to follow a Path automatically.
 *
 * @name Phaser.GameObjects.Components.Transform
 * @since 3.12.0
 */
var Path = {

    /**
     * The Path this PathFollower is following. It can only follow one Path at a time.
     *
     * @name Phaser.GameObjects.Components.Path#path
     * @type {Phaser.Curves.Path}
     * @since 3.12.0
     */
    path: null,

    /**
     * Should the PathFollower automatically rotate to point in the direction of the Path?
     *
     * @name Phaser.GameObjects.Components.Path#rotateToPath
     * @type {boolean}
     * @default false
     * @since 3.12.0
     */
    rotateToPath: false,

    /**
     * [description]
     *
     * @name Phaser.GameObjects.Components.Path#pathRotationVerticalAdjust
     * @type {boolean}
     * @default false
     * @since 3.12.0
     */
    pathRotationVerticalAdjust: false,

    /**
     * If the PathFollower is rotating to match the Path (@see Phaser.GameObjects.Components.Path#rotateToPath)
     * this value is added to the rotation value. This allows you to rotate objects to a path but control
     * the angle of the rotation as well.
     *
     * @name Phaser.GameObjects.Components.Path#pathRotationOffset
     * @type {number}
     * @default 0
     * @since 3.12.0
     */
    pathRotationOffset: 0,

    /**
     * An additional vector to add to the PathFollowers position, allowing you to offset it from the
     * Path coordinates.
     *
     * @name Phaser.GameObjects.Components.Path#pathOffset
     * @type {Phaser.Math.Vector2}
     * @since 3.12.0
     */
    pathOffset: {

        factory: function ()
        {
            return new Vector2();
        }

    },

    /**
     * [description]
     *
     * @name Phaser.GameObjects.Components.Path#pathVector
     * @type {Phaser.Math.Vector2}
     * @since 3.12.0
     */
    pathVector: {

        factory: function ()
        {
            return new Vector2();
        }

    },

    /**
     * The Tween used for following the Path.
     *
     * @name Phaser.GameObjects.Components.Path#pathTween
     * @type {Phaser.Tweens.Tween}
     * @since 3.12.0
     */
    pathTween: null,

    /**
     * Settings for the PathFollower.
     *
     * @name Phaser.GameObjects.Components.Path#pathConfig
     * @type {?PathConfig}
     * @default null
     * @since 3.12.0
     */
    pathConfig: null,

    /**
     * Records the direction of the follower so it can change direction.
     *
     * @name Phaser.GameObjects.Components.Path#_prevDirection
     * @type {integer}
     * @private
     * @since 3.12.0
     */
    _prevDirection: TWEEN_CONST.PLAYING_FORWARD,

    /**
     * Set the Path that this PathFollower should follow.
     *
     * Optionally accepts {@link PathConfig} settings.
     *
     * @method Phaser.GameObjects.Components.Path#setPath
     * @since 3.12.0
     *
     * @param {Phaser.Curves.Path} path - The Path this PathFollower is following. It can only follow one Path at a time.
     * @param {PathConfig} [config] - Settings for the PathFollower.
     *
     * @return {this} This Game Object.
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
     * @method Phaser.GameObjects.Components.Path#setRotateToPath
     * @since 3.12.0
     *
     * @param {boolean} value - Whether the PathFollower should automatically rotate to point in the direction of the Path.
     * @param {number} [offset=0] - Rotation offset in degrees.
     * @param {boolean} [verticalAdjust=false] - [description]
     *
     * @return {this} This Game Object.
     */
    setRotateToPath: function (value, offset, verticalAdjust)
    {
        if (offset === undefined) { offset = 0; }
        if (verticalAdjust === undefined) { verticalAdjust = false; }

        this.rotateToPath = value;

        this.pathRotationOffset = offset;
        this.pathRotationVerticalAdjust = verticalAdjust;

        return this;
    },

    /**
     * Is this PathFollower actively following a Path or not?
     *
     * To be considered as `isFollowing` it must be currently moving on a Path, and not paused.
     *
     * @method Phaser.GameObjects.Components.Path#isFollowing
     * @since 3.12.0
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
     * @method Phaser.GameObjects.Components.Path#startFollow
     * @since 3.12.0
     *
     * @param {(number|PathConfig)} [config={}] - The duration of the follow, or a PathFollower config object.
     * @param {number} [startAt=0] - Optional start position of the follow, between 0 and 1.
     *
     * @return {this} This Game Object.
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
        this.pathRotationVerticalAdjust = GetBoolean(config, 'verticalAdjust', false);

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
     * @method Phaser.GameObjects.Components.Path#pauseFollow
     * @since 3.12.0
     *
     * @return {this} This Game Object.
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
     * @method Phaser.GameObjects.Components.Path#resumeFollow
     * @since 3.12.0
     *
     * @return {this} This Game Object.
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
     * @method Phaser.GameObjects.Components.Path#stopFollow
     * @since 3.12.0
     *
     * @return {this} This Game Object.
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
     * @method Phaser.GameObjects.Components.Path#preUpdate
     * @protected
     * @since 3.12.0
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

                if (this.pathRotationVerticalAdjust)
                {
                    this.flipY = (this.rotation !== 0 && tweenData.state === TWEEN_CONST.PLAYING_BACKWARD);
                }
            }
        }
    }

};

module.exports = Path;
