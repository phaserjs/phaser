/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* @class Phaser.Signal
* @classdesc A Signal is used for object communication via a custom broadcaster instead of Events.
* @author Miller Medeiros http://millermedeiros.github.com/js-signals/
* @constructor
*/
Phaser.Signal = function () {

    /**
    * @property {Array.<Phaser.SignalBinding>} _bindings - Internal variable.
    * @private
    */
    this._bindings = [];

    /**
    * @property {any} _prevParams - Internal variable.
    * @private
    */
    this._prevParams = null;

    // enforce dispatch to aways work on same context (#47)
    var self = this;

    /**
    * @property {function} dispatch - The dispatch function is what sends the Signal out.
    */
    this.dispatch = function(){
        Phaser.Signal.prototype.dispatch.apply(self, arguments);
    };

};

Phaser.Signal.prototype = {

    /**
    * If Signal should keep record of previously dispatched parameters and
    * automatically execute listener during `add()`/`addOnce()` if Signal was
    * already dispatched before.
    * @property {boolean} memorize
    */
    memorize: false,

    /**
    * @property {boolean} _shouldPropagate
    * @private
    */
    _shouldPropagate: true,

    /**
    * If Signal is active and should broadcast events.
    * IMPORTANT: Setting this property during a dispatch will only affect the next dispatch, if you want to stop the propagation of a signal use `halt()` instead.
    * @property {boolean} active
    * @default
    */
    active: true,

    /**
    * @method Phaser.Signal#validateListener
    * @param {function} listener - Signal handler function.
    * @param {string} fnName - Function name.
    * @private
    */
    validateListener: function (listener, fnName) {

        if (typeof listener !== 'function')
        {
            throw new Error('Phaser.Signal: listener is a required param of {fn}() and should be a Function.'.replace('{fn}', fnName));
        }

    },

    /**
    * @method Phaser.Signal#_registerListener
    * @private
    * @param {function} listener - Signal handler function.
    * @param {boolean} isOnce - Should the listener only be called once?
    * @param {object} [listenerContext] - The context under which the listener is invoked.
    * @param {number} [priority] - The priority level of the event listener. Listeners with higher priority will be executed before listeners with lower priority. Listeners with same priority level will be executed at the same order as they were added. (default = 0).
    * @return {Phaser.SignalBinding} An Object representing the binding between the Signal and listener.
    */
    _registerListener: function (listener, isOnce, listenerContext, priority) {

        var prevIndex = this._indexOfListener(listener, listenerContext);
        var binding;

        if (prevIndex !== -1)
        {
            binding = this._bindings[prevIndex];

            if (binding.isOnce() !== isOnce)
            {
                throw new Error('You cannot add' + (isOnce ? '' : 'Once') + '() then add' + (!isOnce ? '' : 'Once') + '() the same listener without removing the relationship first.');
            }
        }
        else
        {
            binding = new Phaser.SignalBinding(this, listener, isOnce, listenerContext, priority);
            this._addBinding(binding);
        }

        if (this.memorize && this._prevParams)
        {
            binding.execute(this._prevParams);
        }

        return binding;

    },

    /**
    * @method Phaser.Signal#_addBinding
    * @private
    * @param {Phaser.SignalBinding} binding - An Object representing the binding between the Signal and listener.
    */
    _addBinding: function (binding) {

        //  Simplified insertion sort
        var n = this._bindings.length;

        do {
            n--;
        }
        while (this._bindings[n] && binding._priority <= this._bindings[n]._priority);

        this._bindings.splice(n + 1, 0, binding);

    },

    /**
    * @method Phaser.Signal#_indexOfListener
    * @private
    * @param {function} listener - Signal handler function.
    * @return {number} The index of the listener within the private bindings array.
    */
    _indexOfListener: function (listener, context) {

        var n = this._bindings.length;
        var cur;

        while (n--)
        {
            cur = this._bindings[n];

            if (cur._listener === listener && cur.context === context)
            {
                return n;
            }
        }

        return -1;

    },

    /**
    * Check if listener was attached to Signal.
    *
    * @method Phaser.Signal#has
    * @param {function} listener - Signal handler function.
    * @param {object} [context] - Context on which listener will be executed (object that should represent the `this` variable inside listener function).
    * @return {boolean} If Signal has the specified listener.
    */
    has: function (listener, context) {

        return this._indexOfListener(listener, context) !== -1;

    },

    /**
    * Add a listener to the signal.
    *
    * @method Phaser.Signal#add
    * @param {function} listener - The function to call when this Signal is dispatched.
    * @param {object} [listenerContext] - The context under which the listener will be executed (i.e. the object that should represent the `this` variable).
    * @param {number} [priority] - The priority level of the event listener. Listeners with higher priority will be executed before listeners with lower priority. Listeners with same priority level will be executed at the same order as they were added (default = 0)
    * @return {Phaser.SignalBinding} An Object representing the binding between the Signal and listener.
    */
    add: function (listener, listenerContext, priority) {

        this.validateListener(listener, 'add');

        return this._registerListener(listener, false, listenerContext, priority);

    },

    /**
    * Add listener to the signal that should be removed after first execution (will be executed only once).
    *
    * @method Phaser.Signal#addOnce
    * @param {function} listener - The function to call when this Signal is dispatched.
    * @param {object} [listenerContext] - The context under which the listener will be executed (i.e. the object that should represent the `this` variable).
    * @param {number} [priority] - The priority level of the event listener. Listeners with higher priority will be executed before listeners with lower priority. Listeners with same priority level will be executed at the same order as they were added (default = 0)
    * @return {Phaser.SignalBinding} An Object representing the binding between the Signal and listener.
    */
    addOnce: function (listener, listenerContext, priority) {

        this.validateListener(listener, 'addOnce');

        return this._registerListener(listener, true, listenerContext, priority);

    },

    /**
    * Remove a single listener from the dispatch queue.
    *
    * @method Phaser.Signal#remove
    * @param {function} listener - Handler function that should be removed.
    * @param {object} [context] - Execution context (since you can add the same handler multiple times if executing in a different context).
    * @return {function} Listener handler function.
    */
    remove: function (listener, context) {

        this.validateListener(listener, 'remove');

        var i = this._indexOfListener(listener, context);

        if (i !== -1)
        {
            this._bindings[i]._destroy(); //no reason to a Phaser.SignalBinding exist if it isn't attached to a signal
            this._bindings.splice(i, 1);
        }

        return listener;

    },

    /**
    * Remove all listeners from the Signal.
    *
    * @method Phaser.Signal#removeAll
    * @param {object} [context=null] - If specified only listeners for the given context will be removed.
    */
    removeAll: function (context) {

        if (typeof context === 'undefined') { context = null; }

        var n = this._bindings.length;

        while (n--)
        {
            if (context)
            {
                if (this._bindings[n].context === context)
                {
                    this._bindings[n]._destroy();
                    this._bindings.splice(n, 1);
                }
            }
            else
            {
                this._bindings[n]._destroy();
            }
        }

        this._bindings.length = 0;

    },

    /**
    * Gets the total number of listeneres attached to ths Signal.
    *
    * @method Phaser.Signal#getNumListeners
    * @return {number} Number of listeners attached to the Signal.
    */
    getNumListeners: function () {

        return this._bindings.length;

    },

    /**
    * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
    * IMPORTANT: should be called only during signal dispatch, calling it before/after dispatch won't affect signal broadcast.
    * @see Signal.prototype.disable
    *
    * @method Phaser.Signal#halt
    */
    halt: function () {

        this._shouldPropagate = false;

    },

    /**
    * Dispatch/Broadcast Signal to all listeners added to the queue.
    *
    * @method Phaser.Signal#dispatch
    * @param {any} [params] - Parameters that should be passed to each handler.
    */
    dispatch: function () {

        if (!this.active)
        {
            return;
        }

        var paramsArr = Array.prototype.slice.call(arguments);
        var n = this._bindings.length;
        var bindings;

        if (this.memorize)
        {
            this._prevParams = paramsArr;
        }

        if (!n)
        {
            //  Should come after memorize
            return;
        }

        bindings = this._bindings.slice(); //clone array in case add/remove items during dispatch
        this._shouldPropagate = true; //in case `halt` was called before dispatch or during the previous dispatch.

        //execute all callbacks until end of the list or until a callback returns `false` or stops propagation
        //reverse loop since listeners with higher priority will be added at the end of the list
        do {
            n--;
        }
        while (bindings[n] && this._shouldPropagate && bindings[n].execute(paramsArr) !== false);

    },

    /**
    * Forget memorized arguments.
    * @see Signal.memorize
    *
    * @method Phaser.Signal#forget
    */
    forget: function() {

        this._prevParams = null;

    },

    /**
    * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
    * IMPORTANT: calling any method on the signal instance after calling dispose will throw errors.
    *
    * @method Phaser.Signal#dispose
    */
    dispose: function () {

        this.removeAll();

        delete this._bindings;
        delete this._prevParams;

    },

    /**
    *
    * @method Phaser.Signal#toString
    * @return {string} String representation of the object.
    */
    toString: function () {

        return '[Phaser.Signal active:'+ this.active +' numListeners:'+ this.getNumListeners() +']';

    }

};

Phaser.Signal.prototype.constructor = Phaser.Signal;
