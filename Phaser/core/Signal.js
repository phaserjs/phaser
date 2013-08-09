/// <reference path="../_definitions.ts" />
/**
* Phaser - Signal
*
* A Signal is used for object communication via a custom broadcaster instead of Events.
* Based on JS Signals by Miller Medeiros. Converted by TypeScript by Richard Davey.
* Released under the MIT license
* http://millermedeiros.github.com/js-signals/
*/
var Phaser;
(function (Phaser) {
    var Signal = (function () {
        function Signal() {
            /**
            *
            * @property _bindings
            * @type Array
            * @private
            */
            this._bindings = [];
            /**
            *
            * @property _prevParams
            * @type Any
            * @private
            */
            this._prevParams = null;
            /**
            * If Signal should keep record of previously dispatched parameters and
            * automatically execute listener during `add()`/`addOnce()` if Signal was
            * already dispatched before.
            * @type boolean
            */
            this.memorize = false;
            /**
            * @type boolean
            * @private
            */
            this._shouldPropagate = true;
            /**
            * If Signal is active and should broadcast events.
            * <p><strong>IMPORTANT:</strong> Setting this property during a dispatch will only affect the next dispatch, if you want to stop the propagation of a signal use `halt()` instead.</p>
            * @type boolean
            */
            this.active = true;
        }
        /**
        *
        * @method validateListener
        * @param {Any} listener
        * @param {Any} fnName
        */
        Signal.prototype.validateListener = function (listener, fnName) {
            if (typeof listener !== 'function') {
                throw new Error('listener is a required param of {fn}() and should be a Function.'.replace('{fn}', fnName));
            }
        };

        /**
        * @param {Function} listener
        * @param {boolean} isOnce
        * @param {Object} [listenerContext]
        * @param {Number} [priority]
        * @return {SignalBinding}
        * @private
        */
        Signal.prototype._registerListener = function (listener, isOnce, listenerContext, priority) {
            var prevIndex = this._indexOfListener(listener, listenerContext);
            var binding;

            if (prevIndex !== -1) {
                binding = this._bindings[prevIndex];

                if (binding.isOnce() !== isOnce) {
                    throw new Error('You cannot add' + (isOnce ? '' : 'Once') + '() then add' + (!isOnce ? '' : 'Once') + '() the same listener without removing the relationship first.');
                }
            } else {
                binding = new Phaser.SignalBinding(this, listener, isOnce, listenerContext, priority);

                this._addBinding(binding);
            }

            if (this.memorize && this._prevParams) {
                binding.execute(this._prevParams);
            }

            return binding;
        };

        /**
        *
        * @method _addBinding
        * @param {SignalBinding} binding
        * @private
        */
        Signal.prototype._addBinding = function (binding) {
            //simplified insertion sort
            var n = this._bindings.length;

            do {
                --n;
            } while(this._bindings[n] && binding.priority <= this._bindings[n].priority);

            this._bindings.splice(n + 1, 0, binding);
        };

        /**
        *
        * @method _indexOfListener
        * @param {Function} listener
        * @return {number}
        * @private
        */
        Signal.prototype._indexOfListener = function (listener, context) {
            var n = this._bindings.length;
            var cur;

            while (n--) {
                cur = this._bindings[n];

                if (cur.getListener() === listener && cur.context === context) {
                    return n;
                }
            }

            return -1;
        };

        /**
        * Check if listener was attached to Signal.
        * @param {Function} listener
        * @param {Object} [context]
        * @return {boolean} if Signal has the specified listener.
        */
        Signal.prototype.has = function (listener, context) {
            if (typeof context === "undefined") { context = null; }
            return this._indexOfListener(listener, context) !== -1;
        };

        /**
        * Add a listener to the signal.
        * @param {Function} listener Signal handler function.
        * @param {Object} [listenerContext] Context on which listener will be executed (object that should represent the `this` variable inside listener function).
        * @param {Number} [priority] The priority level of the event listener. Listeners with higher priority will be executed before listeners with lower priority. Listeners with same priority level will be executed at the same order as they were added. (default = 0)
        * @return {SignalBinding} An Object representing the binding between the Signal and listener.
        */
        Signal.prototype.add = function (listener, listenerContext, priority) {
            if (typeof listenerContext === "undefined") { listenerContext = null; }
            if (typeof priority === "undefined") { priority = 0; }
            this.validateListener(listener, 'add');

            return this._registerListener(listener, false, listenerContext, priority);
        };

        /**
        * Add listener to the signal that should be removed after first execution (will be executed only once).
        * @param {Function} listener Signal handler function.
        * @param {Object} [listenerContext] Context on which listener will be executed (object that should represent the `this` variable inside listener function).
        * @param {Number} [priority] The priority level of the event listener. Listeners with higher priority will be executed before listeners with lower priority. Listeners with same priority level will be executed at the same order as they were added. (default = 0)
        * @return {SignalBinding} An Object representing the binding between the Signal and listener.
        */
        Signal.prototype.addOnce = function (listener, listenerContext, priority) {
            if (typeof listenerContext === "undefined") { listenerContext = null; }
            if (typeof priority === "undefined") { priority = 0; }
            this.validateListener(listener, 'addOnce');

            return this._registerListener(listener, true, listenerContext, priority);
        };

        /**
        * Remove a single listener from the dispatch queue.
        * @param {Function} listener Handler function that should be removed.
        * @param {Object} [context] Execution context (since you can add the same handler multiple times if executing in a different context).
        * @return {Function} Listener handler function.
        */
        Signal.prototype.remove = function (listener, context) {
            if (typeof context === "undefined") { context = null; }
            this.validateListener(listener, 'remove');

            var i = this._indexOfListener(listener, context);

            if (i !== -1) {
                this._bindings[i]._destroy();
                this._bindings.splice(i, 1);
            }

            return listener;
        };

        /**
        * Remove all listeners from the Signal.
        */
        Signal.prototype.removeAll = function () {
            if (this._bindings) {
                var n = this._bindings.length;

                while (n--) {
                    this._bindings[n]._destroy();
                }

                this._bindings.length = 0;
            }
        };

        /**
        * @return {number} Number of listeners attached to the Signal.
        */
        Signal.prototype.getNumListeners = function () {
            return this._bindings.length;
        };

        /**
        * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
        * <p><strong>IMPORTANT:</strong> should be called only during signal dispatch, calling it before/after dispatch won't affect signal broadcast.</p>
        * @see Signal.prototype.disable
        */
        Signal.prototype.halt = function () {
            this._shouldPropagate = false;
        };

        /**
        * Dispatch/Broadcast Signal to all listeners added to the queue.
        * @param {...*} [params] Parameters that should be passed to each handler.
        */
        Signal.prototype.dispatch = function () {
            var paramsArr = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                paramsArr[_i] = arguments[_i + 0];
            }
            if (!this.active) {
                return;
            }

            var n = this._bindings.length;
            var bindings;

            if (this.memorize) {
                this._prevParams = paramsArr;
            }

            if (!n) {
                //should come after memorize
                return;
            }

            bindings = this._bindings.slice(0);

            this._shouldPropagate = true;

            do {
                n--;
            } while(bindings[n] && this._shouldPropagate && bindings[n].execute(paramsArr) !== false);
        };

        /**
        * Forget memorized arguments.
        * @see Signal.memorize
        */
        Signal.prototype.forget = function () {
            this._prevParams = null;
        };

        /**
        * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
        * <p><strong>IMPORTANT:</strong> calling any method on the signal instance after calling dispose will throw errors.</p>
        */
        Signal.prototype.dispose = function () {
            this.removeAll();

            delete this._bindings;
            delete this._prevParams;
        };

        /**
        * @return {string} String representation of the object.
        */
        Signal.prototype.toString = function () {
            return '[Signal active:' + this.active + ' numListeners:' + this.getNumListeners() + ']';
        };
        Signal.VERSION = '1.0.0';
        return Signal;
    })();
    Phaser.Signal = Signal;
})(Phaser || (Phaser = {}));
