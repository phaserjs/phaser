/**
* Phaser.SignalBinding
*
* Object that represents a binding between a Signal and a listener function.
* <br />- <strong>This is an internal constructor and shouldn't be called by regular users.</strong>
* <br />- inspired by Joa Ebert AS3 SignalBinding and Robert Penner's Slot classes.
*
* @author Miller Medeiros http://millermedeiros.github.com/js-signals/
* @constructor
* @internal
* @name SignalBinding
* @param {Signal} signal Reference to Signal object that listener is currently bound to.
* @param {Function} listener Handler function bound to the signal.
* @param {boolean} isOnce If binding should be executed just once.
* @param {Object} [listenerContext] Context on which listener will be executed (object that should represent the `this` variable inside listener function).
* @param {Number} [priority] The priority level of the event listener. (default = 0).
*/
Phaser.SignalBinding = function (signal, listener, isOnce, listenerContext, priority) {

    /**
     * Handler function bound to the signal.
     * @type Function
     * @private
     */
    this._listener = listener;

    /**
     * If binding should be executed just once.
     * @type boolean
     * @private
     */
    this._isOnce = isOnce;

    /**
     * Context on which listener will be executed (object that should represent the `this` variable inside listener function).
     * @memberOf SignalBinding.prototype
     * @name context
     * @type Object|undefined|null
     */
    this.context = listenerContext;

    /**
     * Reference to Signal object that listener is currently bound to.
     * @type Signal
     * @private
     */
    this._signal = signal;

    /**
     * Listener priority
     * @type Number
     * @private
     */
    this._priority = priority || 0;

};

Phaser.SignalBinding.prototype = {

    /**
     * If binding is active and should be executed.
     * @type boolean
     */
    active: true,

    /**
     * Default parameters passed to listener during `Signal.dispatch` and `SignalBinding.execute`. (curried parameters)
     * @type Array|null
     */
    params: null,

    /**
     * Call listener passing arbitrary parameters.
     * <p>If binding was added using `Signal.addOnce()` it will be automatically removed from signal dispatch queue, this method is used internally for the signal dispatch.</p>
     * @param {Array} [paramsArr] Array of parameters that should be passed to the listener
     * @return {*} Value returned by the listener.
     */
    execute: function (paramsArr) {

        var handlerReturn, params;

        if (this.active && !!this._listener)
        {
            params = this.params? this.params.concat(paramsArr) : paramsArr;
            handlerReturn = this._listener.apply(this.context, params);

            if (this._isOnce)
            {
                this.detach();
            }
        }

        return handlerReturn;

    },

    /**
     * Detach binding from signal.
     * - alias to: mySignal.remove(myBinding.getListener());
     * @return {Function|null} Handler function bound to the signal or `null` if binding was previously detached.
     */
    detach: function () {
        return this.isBound() ? this._signal.remove(this._listener, this.context) : null;
    },

    /**
     * @return {Boolean} `true` if binding is still bound to the signal and have a listener.
     */
    isBound: function () {
        return (!!this._signal && !!this._listener);
    },

    /**
     * @return {boolean} If SignalBinding will only be executed once.
     */
    isOnce: function () {
        return this._isOnce;
    },

    /**
     * @return {Function} Handler function bound to the signal.
     */
    getListener: function () {
        return this._listener;
    },

    /**
     * @return {Signal} Signal that listener is currently bound to.
     */
    getSignal: function () {
        return this._signal;
    },

    /**
     * Delete instance properties
     * @private
     */
    _destroy: function () {
        delete this._signal;
        delete this._listener;
        delete this.context;
    },

    /**
     * @return {string} String representation of the object.
     */
    toString: function () {
        return '[Phaser.SignalBinding isOnce:' + this._isOnce +', isBound:'+ this.isBound() +', active:' + this.active + ']';
    }

};
