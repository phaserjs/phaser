/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var ArrayRemove = require('../../utils/array/Remove');
var BaseTween = require('./BaseTween');
var Class = require('../../utils/Class');
var Events = require('../events');
var GameObjectCreator = require('../../gameobjects/GameObjectCreator');
var GameObjectFactory = require('../../gameobjects/GameObjectFactory');
var TWEEN_CONST = require('./const');

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
 * @param {(Phaser.Tweens.TweenManager|Phaser.Tweens.TweenChain)} parent - A reference to the Tween Manager, or TweenChain, that owns this TweenChain.
 */
var TweenChain = new Class({

    Extends: BaseTween,

    initialize:

    function TweenChain (parent)
    {
        BaseTween.call(this, parent);

        /**
         * A reference to the Tween that this TweenChain is currently playing.
         *
         * @name Phaser.Tweens.TweenChain#currentTween
         * @type {Phaser.Tweens.Tween}
         * @since 3.60.0
         */
        this.currentTween = null;

        /**
         * A reference to the data array index of the currently playing tween.
         *
         * @name Phaser.Tweens.TweenChain#currentIndex
         * @type {number}
         * @since 3.60.0
         */
        this.currentIndex = 0;
    },

    /**
     * Prepares this TweenChain for playback.
     *
     * Called automatically by the TweenManager. Should not be called directly.
     *
     * @method Phaser.Tweens.TweenChain#init
     * @fires Phaser.Tweens.Events#TWEEN_ACTIVE
     * @since 3.60.0
     *
     * @return {this} This TweenChain instance.
     */
    init: function ()
    {
        this.loopCounter = (this.loop === -1) ? TWEEN_CONST.MAX : this.loop;

        this.setCurrentTween(0);

        if (this.startDelay > 0 && !this.isStartDelayed())
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
     * @method Phaser.Tweens.TweenChain#add
     * @since 3.60.0
     *
     * @param {Phaser.Types.Tweens.TweenBuilderConfig[]|object[]} tweens - An array of Tween configuration objects for the Tweens in this chain.
     *
     * @return {this} This TweenChain instance.
     */
    add: function (tweens)
    {
        var newTweens = this.parent.create(tweens);

        if (!Array.isArray(newTweens))
        {
            newTweens = [ newTweens ];
        }

        var data = this.data;

        for (var i = 0; i < newTweens.length; i++)
        {
            var tween = newTweens[i];

            tween.parent = this;

            data.push(tween.reset());
        }

        this.totalData = data.length;

        return this;
    },

    /**
     * Removes the given Tween from this Tween Chain.
     *
     * The removed tween is _not_ destroyed. It is just removed from this Tween Chain.
     *
     * If the given Tween is currently playing then the chain will automatically move
     * to the next tween in the chain. If there are no more tweens, this chain will complete.
     *
     * @method Phaser.Tweens.TweenChain#remove
     * @since 3.60.0
     * @override
     *
     * @param {Phaser.Tweens.Tween} tween - The Tween to be removed.
     *
     * @return {this} This Tween Chain instance.
     */
    remove: function (tween)
    {
        //  Remove it immediately
        ArrayRemove(this.data, tween);

        tween.setRemovedState();

        if (tween === this.currentTween)
        {
            this.nextTween();
        }

        this.totalData = this.data.length;

        return this;
    },

    /**
     * See if any of the tweens in this Tween Chain is currently acting upon the given target.
     *
     * @method Phaser.Tweens.TweenChain#hasTarget
     * @since 3.60.0
     *
     * @param {object} target - The target to check against this TweenChain.
     *
     * @return {boolean} `true` if the given target is a target of this TweenChain, otherwise `false`.
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
     * Restarts the TweenChain from the beginning.
     *
     * If this TweenChain was configured to have a loop, or start delay, those
     * are reset to their initial values as well. It will also dispatch the
     * `onActive` callback and event again.
     *
     * @method Phaser.Tweens.TweenChain#restart
     * @since 3.60.0
     *
     * @return {this} This TweenChain instance.
     */
    restart: function ()
    {
        if (this.isDestroyed())
        {
            console.warn('Cannot restart destroyed TweenChain', this);

            return this;
        }

        if (this.isRemoved())
        {
            this.parent.makeActive(this);
        }

        this.resetTweens();

        this.paused = false;

        return this.init();
    },

    /**
     * Resets the given Tween.
     *
     * It will seek to position 0 and playback will start on the next frame.
     *
     * @method Phaser.Tweens.TweenChain#reset
     * @since 3.60.0
     *
     * @param {Phaser.Tweens.Tween} tween - The Tween to be reset.
     *
     * @return {this} This TweenChain instance.
     */
    reset: function (tween)
    {
        tween.seek();

        tween.setActiveState();

        return this;
    },

    /**
     * Re-initiases the given Tween and sets it to the Active state.
     *
     * @method Phaser.Tweens.TweenChain#makeActive
     * @since 3.60.0
     * @override
     *
     * @param {Phaser.Tweens.Tween} tween - The Tween to check.
     *
     * @return {this} This TweenChain instance.
     */
    makeActive: function (tween)
    {
        tween.reset();

        tween.setActiveState();

        return this;
    },

    /**
     * Internal method that advances to the next state of the TweenChain playback.
     *
     * @method Phaser.Tweens.TweenChain#nextState
     * @fires Phaser.Tweens.Events#TWEEN_COMPLETE
     * @fires Phaser.Tweens.Events#TWEEN_LOOP
     * @since 3.60.0
     *
     * @return {boolean} `true` if this TweenChain has completed, otherwise `false`.
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
     * Starts this TweenChain playing.
     *
     * You only need to call this method if you have configured this TweenChain to be paused on creation.
     *
     * If the TweenChain is already playing, calling this method again will have no effect. If you wish to
     * restart the chain, use `TweenChain.restart` instead.
     *
     * Calling this method after the TweenChain has completed will start the chain playing again from the beginning.
     *
     * @method Phaser.Tweens.TweenChain#play
     * @since 3.60.0
     *
     * @return {this} This TweenChain instance.
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

        if (this.startDelay > 0 && !this.isStartDelayed())
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
     * Internal method that resets all of the Tweens and the current index pointer.
     *
     * @method Phaser.Tweens.TweenChain#resetTweens
     * @since 3.60.0
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
     * Internal method that advances the TweenChain based on the time values.
     *
     * @method Phaser.Tweens.TweenChain#update
     * @fires Phaser.Tweens.Events#TWEEN_COMPLETE
     * @fires Phaser.Tweens.Events#TWEEN_LOOP
     * @fires Phaser.Tweens.Events#TWEEN_START
     * @since 3.60.0
     *
     * @param {number} delta - The delta time in ms since the last frame. This is a smoothed and capped value based on the FPS rate.
     *
     * @return {boolean} Returns `true` if this TweenChain has finished and should be removed from the Tween Manager, otherwise returns `false`.
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

    /**
     * Immediately advances to the next Tween in the chain.
     *
     * This is typically called internally, but can be used if you need to
     * advance playback for some reason.
     *
     * @method Phaser.Tweens.TweenChain#nextTween
     * @since 3.60.0
     *
     * @return {boolean} `true` if there are no more Tweens in the chain, otherwise `false`.
     */
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

        return false;
    },

    /**
     * Sets the current active Tween to the given index, based on its
     * entry in the TweenChain data array.
     *
     * @method Phaser.Tweens.TweenChain#setCurrentTween
     * @since 3.60.0
     *
     * @param {number} index - The index of the Tween to be made current.
     */
    setCurrentTween: function (index)
    {
        this.currentIndex = index;

        this.currentTween = this.data[index];

        this.currentTween.setActiveState();

        this.currentTween.dispatchEvent(Events.TWEEN_ACTIVE, 'onActive');
    },

    /**
     * Internal method that will emit a TweenChain based Event and invoke the given callback.
     *
     * @method Phaser.Tweens.TweenChain#dispatchEvent
     * @since 3.60.0
     *
     * @param {Phaser.Types.Tweens.Event} event - The Event to be dispatched.
     * @param {Phaser.Types.Tweens.TweenCallbackTypes} [callback] - The name of the callback to be invoked. Can be `null` or `undefined` to skip invocation.
     */
    dispatchEvent: function (event, callback)
    {
        this.emit(event, this);

        var handler = this.callbacks[callback];

        if (handler)
        {
            handler.func.apply(this.callbackScope, [ this ].concat(handler.params));
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

        this.currentTween = null;
    }

});

/**
 * Creates a new TweenChain object and adds it to the Tween Manager.
 *
 * Note: This method will only be available if Tweens have been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectFactory#tweenchain
 * @since 3.60.0
 *
 * @param {Phaser.Types.Tweens.TweenBuilderConfig|object} config - The TweenChain configuration.
 *
 * @return {Phaser.Tweens.TweenChain} The TweenChain that was created.
 */
GameObjectFactory.register('tweenchain', function (config)
{
    return this.scene.sys.tweens.chain(config);
});

/**
 * Creates a new TweenChain object and returns it, without adding it to the Tween Manager.
 *
 * Note: This method will only be available if Tweens have been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectCreator#tweenchain
 * @since 3.60.0
 *
 * @param {Phaser.Types.Tweens.TweenBuilderConfig|object} config - The TweenChain configuration.
 *
 * @return {Phaser.Tweens.TweenChain} The TweenChain that was created.
 */
GameObjectCreator.register('tweenchain', function (config)
{
    return this.scene.sys.tweens.create(config);
});

module.exports = TweenChain;
