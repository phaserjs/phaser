/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var BaseTween = require('./BaseTween');
var Class = require('../../utils/Class');
var Events = require('../events');
var GameObjectCreator = require('../../gameobjects/GameObjectCreator');
var GameObjectFactory = require('../../gameobjects/GameObjectFactory');
var Tween = require('./Tween');
var TWEEN_CONST = require('./const');
var TweenBuilder = require('../builders/TweenBuilder');

/**
 * @classdesc
 * TODO
 *
 * @class TweenChain
 * @memberof Phaser.Tweens
 * @extends Phaser.Tweens.BaseTween
 * @constructor
 * @since 3.60.0
 *
 * @param {Phaser.Tweens.TweenManager} parent - A reference to the Tween Manager that owns this Tween.
 */
var TweenChain = new Class({

    Extends: BaseTween,

    initialize:

    function TweenChain (parent)
    {
        BaseTween.call(this, parent);

        this.currentTween = null;

        this.currentIndex = 0;
    },

    /**
     * Prepares this Tween for playback.
     *
     * Called automatically by the TweenManager. Should not be called directly.
     *
     * @method Phaser.Tweens.Tween#init
     * @fires Phaser.Tweens.Events#TWEEN_ACTIVE
     * @since 3.0.0
     *
     * @return {this} This Tween instance.
     */
    init: function ()
    {
        this.loopCounter = (this.loop === -1) ? 999999999999 : this.loop;

        this.setCurrentTween(0);

        if (this.startDelay > 0)
        {
            this.setStartDelayState();
        }
        else
        {
            this.setActiveState();
        }

        this.dispatchEvent(Events.TWEEN_ACTIVE, 'onActive');

        return this;
    },

    /**
     * Create a sequence of Tweens, chained to one-another, and add them to this Tween Manager.
     *
     * The tweens are played in order, from start to finish. You can optionally set the chain
     * to repeat as many times as you like. Once the chain has finished playing, or repeating if set,
     * all tweens in the chain will be destroyed automatically. To override this, set the 'persists'
     * argument to 'true'.
     *
     * Playback will start immediately unless the _first_ Tween has been configured to be paused.
     *
     * Please note that Tweens will not manipulate any target property that begins with an underscore.
     *
     * @method Phaser.Tweens.TweenManager#add
     * @since 3.60.0
     *
     * @param {Phaser.Types.Tweens.TweenBuilderConfig[]|object[]} tweens - An array of Tween configuration objects for the Tweens in this chain.
     *
     * @return {Phaser.Tweens.TweenChain} This TweenChain instance.
     */
    add: function (tweens)
    {
        if (!Array.isArray(tweens))
        {
            tweens = [ tweens ];
        }

        var data = this.data;

        for (var i = 0; i < tweens.length; i++)
        {
            var tween = tweens[i];

            if (tween instanceof Tween)
            {
                data.push(tween.init());
            }
            else
            {
                tween = TweenBuilder(this, tween);

                data.push(tween.init());
            }
        }

        this.totalData = data.length;

        return this;
    },

    /**
     * See if this Tween is currently acting upon the given target.
     *
     * @method Phaser.Tweens.Tween#hasTarget
     * @since 3.0.0
     *
     * @param {object} target - The target to check against this Tween.
     *
     * @return {boolean} `true` if the given target is a target of this Tween, otherwise `false`.
     */
    hasTarget: function (target)
    {
        var data = this.data;

        for (var i = 0; i < this.totalData; i++)
        {
            if (data[i].hasTarget(target))
            {
                return true;
            }
        }

        return false;
    },

    /**
     * Restarts the Tween from the beginning.
     *
     * You can only restart a Tween that is currently playing. If the Tween has already been stopped, restarting
     * it will throw an error.
     *
     * If you wish to restart the Tween from a specific point, use the `Tween.seek` method instead.
     *
     * @method Phaser.Tweens.Tween#restart
     * @since 3.0.0
     *
     * @return {this} This Tween instance.
     */
    restart: function ()
    {
        switch (this.state)
        {
            case TWEEN_CONST.REMOVED:
            case TWEEN_CONST.FINISHED:
                this.parent.makeActive(this);
                break;

            case TWEEN_CONST.PENDING:
            case TWEEN_CONST.PENDING_REMOVE:
                this.parent.reset(this);
                break;

            case TWEEN_CONST.DESTROYED:
                console.warn('Cannot restart destroyed TweenChain');
                break;

            default:
                // this.seek();
                break;
        }

        this.paused = false;
        this.hasStarted = false;
        this.currentIndex = 0;
        this.currentTween = this.data[0];

        return this;
    },

    /**
     * Resets the given Tween.
     *
     * If the Tween does not belong to this Tween Manager, it will first be added.
     *
     * Then it will seek to position 0 and playback will start on the next frame.
     *
     * @method Phaser.Tweens.TweenManager#reset
     * @since 3.60.0
     *
     * @param {Phaser.Tweens.Tween} tween - The Tween to be reset.
     *
     * @return {this} This Tween Manager instance.
     */
    reset: function (tween)
    {
        tween.seek();

        tween.setActiveState();

        return this;
    },

    /**
     * Checks if a Tween is active and adds it to the Tween Manager at the start of the frame if it isn't.
     *
     * @method Phaser.Tweens.TweenManager#makeActive
     * @since 3.0.0
     *
     * @param {Phaser.Tweens.Tween} tween - The Tween to check.
     *
     * @return {this} This Tween Manager instance.
     */
    makeActive: function (tween)
    {
        tween.init();

        tween.setActiveState();

        return this;
    },

    /**
     * Internal method that advances to the next state of the Tween during playback.
     *
     * @method Phaser.Tweens.Tween#nextState
     * @fires Phaser.Tweens.Events#TWEEN_COMPLETE
     * @fires Phaser.Tweens.Events#TWEEN_LOOP
     * @since 3.0.0
     *
     * @return {boolean} `true` if this Tween has completed, otherwise `false`.
     */
    nextState: function ()
    {
        if (this.loopCounter > 0)
        {
            this.loopCounter--;

            this.resetTweens();

            if (this.loopDelay > 0)
            {
                this.countdown = this.loopDelay;

                this.setLoopDelayState();
            }
            else
            {
                this.setActiveState();

                this.dispatchEvent(Events.TWEEN_LOOP, 'onLoop');
            }
        }
        else if (this.completeDelay > 0)
        {
            this.countdown = this.completeDelay;

            this.setCompleteDelayState();
        }
        else
        {
            this.onCompleteHandler();

            return true;
        }

        return false;
    },

    /**
     * Starts a Tween playing.
     *
     * You only need to call this method if you have configured the tween to be paused on creation.
     *
     * If the Tween is already playing, calling this method again will have no effect. If you wish to
     * restart the Tween, use `Tween.restart` instead.
     *
     * Calling this method after the Tween has completed will start the Tween playing again from the beginning.
     * This is the same as calling `Tween.seek(0)` and then `Tween.play()`.
     *
     * @method Phaser.Tweens.Tween#play
     * @since 3.0.0
     *
     * @return {this} This Tween instance.
     */
    play: function ()
    {
        if (this.isDestroyed())
        {
            console.warn('Cannot play destroyed TweenChain', this);

            return this;
        }

        if (this.isPendingRemove() || this.isPending())
        {
            this.resetTweens();
        }

        this.paused = false;

        if (this.startDelay > 0)
        {
            this.setStartDelayState();
        }
        else
        {
            this.setActiveState();
        }

        return this;
    },

    /**
     * Internal method that resets all of the Tween Data, including the progress and elapsed values.
     *
     * @method Phaser.Tweens.Tween#resetTweens
     * @since 3.0.0
     */
    resetTweens: function ()
    {
        var data = this.data;
        var total = this.totalData;

        for (var i = 0; i < total; i++)
        {
            data[i].reset(false);
        }

        this.currentIndex = 0;
        this.currentTween = data[0];
    },

    /**
     * Internal method that advances the Tween based on the time values.
     *
     * @method Phaser.Tweens.Tween#update
     * @fires Phaser.Tweens.Events#TWEEN_COMPLETE
     * @fires Phaser.Tweens.Events#TWEEN_LOOP
     * @fires Phaser.Tweens.Events#TWEEN_START
     * @since 3.0.0
     *
     * @param {number} delta - The delta time in ms since the last frame. This is a smoothed and capped value based on the FPS rate.
     *
     * @return {boolean} Returns `true` if this Tween has finished and should be removed from the Tween Manager, otherwise returns `false`.
     */
    update: function (delta)
    {
        if (this.isPendingRemove() || this.isDestroyed())
        {
            return true;
        }
        else if (this.isFinished() || this.paused)
        {
            return false;
        }

        //  The TweehChain.timeScale is applied within Tween.update, so doesn't need including here
        delta *= this.parent.timeScale;

        if (this.isLoopDelayed())
        {
            this.updateLoopCountdown(delta);
        }
        else if (this.isCompleteDelayed())
        {
            this.updateCompleteDelay(delta);
        }
        else if (this.isStartDelayed())
        {
            //  Reset the delta so we always start progress from zero
            delta = this.updateStartCountdown(delta);
        }

        var remove = false;

        if (this.isActive() && this.currentTween)
        {
            if (this.currentTween.update(delta))
            {
                //  This tween has finshed playback, so move to the next one
                if (this.nextTween())
                {
                    this.nextState();
                }
            }

            //  if nextState called onCompleteHandler then we're ready to be removed, unless we persist
            remove = this.isPendingRemove();

            if (remove && this.persist)
            {
                this.setFinishedState();

                remove = false;
            }
        }

        return remove;
    },

    getCurrentTween: function ()
    {
        return this.data[this.currentIndex];
    },

    nextTween: function ()
    {
        this.currentIndex++;

        if (this.currentIndex === this.totalData)
        {
            return true;
        }
        else
        {
            this.setCurrentTween(this.currentIndex);
        }
    },

    setCurrentTween: function (index)
    {
        this.currentIndex = index;

        this.currentTween = this.data[index];

        this.currentTween.setActiveState();

        this.currentTween.dispatchEvent(Events.TWEEN_ACTIVE, 'onActive');
    },

    /**
     * Internal method that will emit a Tween based Event and invoke the given callback.
     *
     * @method Phaser.Tweens.Tween#dispatchEvent
     * @since 3.60.0
     *
     * @param {Phaser.Types.Tweens.Event} event - The Event to be dispatched.
     * @param {Phaser.Types.Tweens.TweenCallbackTypes} [callback] - The name of the callback to be invoked. Can be `null` or `undefined` to skip invocation.
     */
    dispatchEvent: function (event, callback)
    {
        this.emit(event, this, this.targets);

        var handler = this.callbacks[callback];

        if (handler)
        {
            handler.func.apply(handler.scope, [ this, this.targets ].concat(handler.params));
        }
    },

    /**
     * Immediately destroys this TweenChain, nulling of all its references.
     *
     * @method Phaser.Tweens.TweenChain#destroy
     * @since 3.60.0
     */
    destroy: function ()
    {
        BaseTween.prototype.destroy.call(this);

        console.log('TweenChain destroyed');
    }

});

/**
 * Creates a new Tween object.
 *
 * Note: This method will only be available if Tweens have been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectFactory#tweenchain
 * @since 3.0.0
 *
 * @param {Phaser.Types.Tweens.TweenBuilderConfig|object} config - The Tween configuration.
 *
 * @return {Phaser.Tweens.Tween} The Tween that was created.
 */
GameObjectFactory.register('tweenchain', function (config)
{
    return this.scene.sys.tweens.add(config);
});

/**
 * Creates a new Tween object and returns it.
 *
 * Note: This method will only be available if Tweens have been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectCreator#tweenchain
 * @since 3.0.0
 *
 * @param {Phaser.Types.Tweens.TweenBuilderConfig|object} config - The Tween configuration.
 *
 * @return {Phaser.Tweens.Tween} The Tween that was created.
 */
GameObjectCreator.register('tweenchain', function (config)
{
    return this.scene.sys.tweens.create(config);
});

module.exports = TweenChain;
