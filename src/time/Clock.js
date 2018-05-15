/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../utils/Class');
var PluginCache = require('../plugins/PluginCache');
var TimerEvent = require('./TimerEvent');

/**
 * @classdesc
 * [description]
 *
 * @class Clock
 * @memberOf Phaser.Time
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Scene} scene - [description]
 */
var Clock = new Class({

    initialize:

    function Clock (scene)
    {
        /**
         * [description]
         *
         * @name Phaser.Time.Clock#scene
         * @type {Phaser.Scene}
         * @since 3.0.0
         */
        this.scene = scene;

        /**
         * [description]
         *
         * @name Phaser.Time.Clock#systems
         * @type {Phaser.Scenes.Systems}
         * @since 3.0.0
         */
        this.systems = scene.sys;

        /**
         * [description]
         *
         * @name Phaser.Time.Clock#now
         * @type {number}
         * @since 3.0.0
         */
        this.now = Date.now();

        //  Scale the delta time coming into the Clock by this factor
        //  which then influences anything using this Clock for calculations, like TimerEvents

        /**
         * [description]
         *
         * @name Phaser.Time.Clock#timeScale
         * @type {float}
         * @default 1
         * @since 3.0.0
         */
        this.timeScale = 1;

        /**
         * [description]
         *
         * @name Phaser.Time.Clock#paused
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.paused = false;

        /**
         * [description]
         *
         * @name Phaser.Time.Clock#_active
         * @type {Phaser.Time.TimerEvent[]}
         * @private
         * @default []
         * @since 3.0.0
         */
        this._active = [];

        /**
         * [description]
         *
         * @name Phaser.Time.Clock#_pendingInsertion
         * @type {Phaser.Time.TimerEvent[]}
         * @private
         * @default []
         * @since 3.0.0
         */
        this._pendingInsertion = [];

        /**
         * [description]
         *
         * @name Phaser.Time.Clock#_pendingRemoval
         * @type {Phaser.Time.TimerEvent[]}
         * @private
         * @default []
         * @since 3.0.0
         */
        this._pendingRemoval = [];

        scene.sys.events.once('boot', this.boot, this);
        scene.sys.events.on('start', this.start, this);
    },

    /**
     * This method is called automatically, only once, when the Scene is first created.
     * Do not invoke it directly.
     *
     * @method Phaser.Time.Clock#boot
     * @private
     * @since 3.5.1
     */
    boot: function ()
    {
        this.systems.events.once('destroy', this.destroy, this);
    },

    /**
     * This method is called automatically by the Scene when it is starting up.
     * It is responsible for creating local systems, properties and listening for Scene events.
     * Do not invoke it directly.
     *
     * @method Phaser.Time.Clock#start
     * @private
     * @since 3.5.0
     */
    start: function ()
    {
        var eventEmitter = this.systems.events;

        eventEmitter.on('preupdate', this.preUpdate, this);
        eventEmitter.on('update', this.update, this);
        eventEmitter.once('shutdown', this.shutdown, this);
    },

    /**
     * [description]
     *
     * @method Phaser.Time.Clock#addEvent
     * @since 3.0.0
     *
     * @param {TimerEventConfig} config - [description]
     *
     * @return {Phaser.Time.TimerEvent} [description]
     */
    addEvent: function (config)
    {
        var event = new TimerEvent(config);

        this._pendingInsertion.push(event);

        return event;
    },

    /**
     * [description]
     *
     * @method Phaser.Time.Clock#delayedCall
     * @since 3.0.0
     *
     * @param {number} delay - [description]
     * @param {function} callback - [description]
     * @param {Array.<*>} args - [description]
     * @param {*} callbackScope - [description]
     *
     * @return {Phaser.Time.TimerEvent} [description]
     */
    delayedCall: function (delay, callback, args, callbackScope)
    {
        return this.addEvent({ delay: delay, callback: callback, args: args, callbackScope: callbackScope });
    },

    /**
     * [description]
     *
     * @method Phaser.Time.Clock#clearPendingEvents
     * @since 3.0.0
     *
     * @return {Phaser.Time.Clock} [description]
     */
    clearPendingEvents: function ()
    {
        this._pendingInsertion = [];

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Time.Clock#removeAllEvents
     * @since 3.0.0
     *
     * @return {Phaser.Time.Clock} [description]
     */
    removeAllEvents: function ()
    {
        this._pendingRemoval = this._pendingRemoval.concat(this._active);

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Time.Clock#preUpdate
     * @since 3.0.0
     *
     * @param {number} time - [description]
     * @param {number} delta - [description]
     */
    preUpdate: function ()
    {
        var toRemove = this._pendingRemoval.length;
        var toInsert = this._pendingInsertion.length;

        if (toRemove === 0 && toInsert === 0)
        {
            //  Quick bail
            return;
        }

        var i;
        var event;

        //  Delete old events
        for (i = 0; i < toRemove; i++)
        {
            event = this._pendingRemoval[i];

            var index = this._active.indexOf(event);

            if (index > -1)
            {
                this._active.splice(index, 1);
            }

            //  Pool them?
            event.destroy();
        }

        for (i = 0; i < toInsert; i++)
        {
            event = this._pendingInsertion[i];

            this._active.push(event);
        }

        //  Clear the lists
        this._pendingRemoval.length = 0;
        this._pendingInsertion.length = 0;
    },

    /**
     * [description]
     *
     * @method Phaser.Time.Clock#update
     * @since 3.0.0
     *
     * @param {number} time - [description]
     * @param {number} delta - [description]
     */
    update: function (time, delta)
    {
        this.now = time;

        if (this.paused)
        {
            return;
        }

        delta *= this.timeScale;

        for (var i = 0; i < this._active.length; i++)
        {
            var event = this._active[i];

            if (event.paused)
            {
                continue;
            }

            //  Use delta time to increase elapsed.
            //  Avoids needing to adjust for pause / resume.
            //  Automatically smoothed by TimeStep class.
            //  In testing accurate to +- 1ms!
            event.elapsed += delta * event.timeScale;

            if (event.elapsed >= event.delay)
            {
                var remainder = event.elapsed - event.delay;

                //  Limit it, in case it's checked in the callback
                event.elapsed = event.delay;

                //  Process the event
                if (!event.hasDispatched && event.callback)
                {
                    event.hasDispatched = true;
                    event.callback.apply(event.callbackScope, event.args);
                }

                if (event.repeatCount > 0)
                {
                    event.repeatCount--;

                    event.elapsed = remainder;
                    event.hasDispatched = false;
                }
                else
                {
                    this._pendingRemoval.push(event);
                }
            }
        }
    },

    /**
     * The Scene that owns this plugin is shutting down.
     * We need to kill and reset all internal properties as well as stop listening to Scene events.
     *
     * @method Phaser.Time.Clock#shutdown
     * @private
     * @since 3.0.0
     */
    shutdown: function ()
    {
        var i;

        for (i = 0; i < this._pendingInsertion.length; i++)
        {
            this._pendingInsertion[i].destroy();
        }

        for (i = 0; i < this._active.length; i++)
        {
            this._active[i].destroy();
        }

        for (i = 0; i < this._pendingRemoval.length; i++)
        {
            this._pendingRemoval[i].destroy();
        }

        this._active.length = 0;
        this._pendingRemoval.length = 0;
        this._pendingInsertion.length = 0;

        var eventEmitter = this.systems.events;

        eventEmitter.off('preupdate', this.preUpdate, this);
        eventEmitter.off('update', this.update, this);
        eventEmitter.off('shutdown', this.shutdown, this);
    },

    /**
     * The Scene that owns this plugin is being destroyed.
     * We need to shutdown and then kill off all external references.
     *
     * @method Phaser.Time.Clock#destroy
     * @private
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.shutdown();

        this.scene.sys.events.off('start', this.start, this);

        this.scene = null;
        this.systems = null;
    }

});

PluginCache.register('Clock', Clock, 'time');

module.exports = Clock;
