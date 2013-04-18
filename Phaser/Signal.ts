/// <reference path="SignalBinding.ts" />

/**
* Phaser - Signal
*
* A Signal is used for object communication via a custom broadcaster instead of Events.
* Based on JS Signals by Miller Medeiros. Converted by TypeScript by Richard Davey.
* Released under the MIT license
* http://millermedeiros.github.com/js-signals/
*/

module Phaser {

    export class Signal {

        /**
        * 
        * @property _bindings
        * @type Array
        * @private
        */
        private _bindings: SignalBinding[] = [];

        /**
        * 
        * @property _prevParams
        * @type Any
        * @private
        */
        private _prevParams = null;

        /**
         * Signals Version Number
         * @property VERSION
         * @type String
         * @const
         */
        public static VERSION: string = '1.0.0';

        /**
         * If Signal should keep record of previously dispatched parameters and
         * automatically execute listener during `add()`/`addOnce()` if Signal was
         * already dispatched before.
         * @type boolean
         */
        public memorize: bool = false;

        /**
         * @type boolean
         * @private
         */
        private _shouldPropagate: bool = true;

        /**
         * If Signal is active and should broadcast events.
         * <p><strong>IMPORTANT:</strong> Setting this property during a dispatch will only affect the next dispatch, if you want to stop the propagation of a signal use `halt()` instead.</p>
         * @type boolean
         */
        public active: bool = true;

        /**
        * 
        * @method validateListener
        * @param {Any} listener
        * @param {Any} fnName
        */
        public validateListener(listener, fnName) {

            if (typeof listener !== 'function')
            {
                throw new Error('listener is a required param of {fn}() and should be a Function.'.replace('{fn}', fnName));
            }

        }

        /**
         * @param {Function} listener
         * @param {boolean} isOnce
         * @param {Object} [listenerContext]
         * @param {Number} [priority]
         * @return {SignalBinding}
         * @private
         */
        private _registerListener(listener, isOnce: bool, listenerContext, priority: number): SignalBinding {

            var prevIndex: number = this._indexOfListener(listener, listenerContext);
            var binding: SignalBinding;

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
                binding = new SignalBinding(this, listener, isOnce, listenerContext, priority);

                this._addBinding(binding);
            }

            if (this.memorize && this._prevParams)
            {
                binding.execute(this._prevParams);
            }

            return binding;

        }

        /**
        *
        * @method _addBinding
         * @param {SignalBinding} binding
         * @private
         */
        private _addBinding(binding: SignalBinding) {

            //simplified insertion sort

            var n: number = this._bindings.length;

            do { --n; } while (this._bindings[n] && binding.priority <= this._bindings[n].priority);

            this._bindings.splice(n + 1, 0, binding);

        }

        /**
         *
         * @method _indexOfListener
         * @param {Function} listener
         * @return {number}
         * @private
         */
        private _indexOfListener(listener, context): number {

            var n: number = this._bindings.length;
            var cur: SignalBinding;

            while (n--)
            {
                cur = this._bindings[n];

                if (cur.getListener() === listener && cur.context === context)
                {
                    return n;
                }
            }

            return -1;

        }

        /**
         * Check if listener was attached to Signal.
         * @param {Function} listener
         * @param {Object} [context]
         * @return {boolean} if Signal has the specified listener.
         */
        public has(listener, context?: any = null): bool {

            return this._indexOfListener(listener, context) !== -1;

        }

        /**
         * Add a listener to the signal.
         * @param {Function} listener Signal handler function.
         * @param {Object} [listenerContext] Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param {Number} [priority] The priority level of the event listener. Listeners with higher priority will be executed before listeners with lower priority. Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         * @return {SignalBinding} An Object representing the binding between the Signal and listener.
         */
        public add(listener, listenerContext?: any = null, priority?: number = 0): SignalBinding {

            this.validateListener(listener, 'add');

            return this._registerListener(listener, false, listenerContext, priority);

        }

        /**
         * Add listener to the signal that should be removed after first execution (will be executed only once).
         * @param {Function} listener Signal handler function.
         * @param {Object} [listenerContext] Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param {Number} [priority] The priority level of the event listener. Listeners with higher priority will be executed before listeners with lower priority. Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         * @return {SignalBinding} An Object representing the binding between the Signal and listener.
         */
        public addOnce(listener, listenerContext?: any = null, priority?: number = 0): SignalBinding {

            this.validateListener(listener, 'addOnce');

            return this._registerListener(listener, true, listenerContext, priority);

        }

        /**
         * Remove a single listener from the dispatch queue.
         * @param {Function} listener Handler function that should be removed.
         * @param {Object} [context] Execution context (since you can add the same handler multiple times if executing in a different context).
         * @return {Function} Listener handler function.
         */
        public remove(listener, context?: any = null) {

            this.validateListener(listener, 'remove');

            var i: number = this._indexOfListener(listener, context);

            if (i !== -1)
            {
                this._bindings[i]._destroy(); //no reason to a SignalBinding exist if it isn't attached to a signal
                this._bindings.splice(i, 1);
            }

            return listener;

        }

        /**
         * Remove all listeners from the Signal.
         */
        public removeAll() {

            var n: number = this._bindings.length;

            while (n--)
            {
                this._bindings[n]._destroy();
            }

            this._bindings.length = 0;

        }

        /**
         * @return {number} Number of listeners attached to the Signal.
         */
        public getNumListeners(): number {

            return this._bindings.length;

        }

        /**
         * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
         * <p><strong>IMPORTANT:</strong> should be called only during signal dispatch, calling it before/after dispatch won't affect signal broadcast.</p>
         * @see Signal.prototype.disable
         */
        public halt() {

            this._shouldPropagate = false;

        }

        /**
         * Dispatch/Broadcast Signal to all listeners added to the queue.
         * @param {...*} [params] Parameters that should be passed to each handler.
         */
        public dispatch(...paramsArr: any[]) {

            if (!this.active)
            {
                return;
            }

            var n: number = this._bindings.length;
            var bindings: SignalBinding[];

            if (this.memorize)
            {
                this._prevParams = paramsArr;
            }

            if (!n)
            {
                //should come after memorize
                return;
            }

            bindings = this._bindings.slice(0); //clone array in case add/remove items during dispatch

            this._shouldPropagate = true; //in case `halt` was called before dispatch or during the previous dispatch.

            //execute all callbacks until end of the list or until a callback returns `false` or stops propagation
            //reverse loop since listeners with higher priority will be added at the end of the list
            do { n--; } while (bindings[n] && this._shouldPropagate && bindings[n].execute(paramsArr) !== false);

        }

        /**
         * Forget memorized arguments.
         * @see Signal.memorize
         */
        public forget() {

            this._prevParams = null;

        }

        /**
         * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
         * <p><strong>IMPORTANT:</strong> calling any method on the signal instance after calling dispose will throw errors.</p>
         */
        public dispose() {

            this.removeAll();

            delete this._bindings;
            delete this._prevParams;

        }

        /**
         * @return {string} String representation of the object.
         */
        public toString(): string {

            return '[Signal active:' + this.active + ' numListeners:' + this.getNumListeners() + ']';

        }

    }

}