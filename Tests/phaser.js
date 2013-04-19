/// <reference path="Game.ts" />
/**
* Phaser - Basic
*
* A useful "generic" object on which all GameObjects and Groups are based.
* It has no size, position or graphical data.
*/
var Phaser;
(function (Phaser) {
    var Basic = (function () {
        /**
        * Instantiate the basic object.
        */
        function Basic(game) {
            /**
            * Allows you to give this object a name. Useful for debugging, but not actually used internally.
            */
            this.name = '';
            this._game = game;
            this.ID = -1;
            this.exists = true;
            this.active = true;
            this.visible = true;
            this.alive = true;
            this.isGroup = false;
            this.ignoreDrawDebug = false;
        }
        Basic.prototype.destroy = /**
        * Override this to null out iables or manually call
        * <code>destroy()</code> on class members if necessary.
        * Don't forget to call <code>super.destroy()</code>!
        */
        function () {
        };
        Basic.prototype.preUpdate = /**
        * Pre-update is called right before <code>update()</code> on each object in the game loop.
        */
        function () {
        };
        Basic.prototype.update = /**
        * Override this to update your class's position and appearance.
        * This is where most of your game rules and behavioral code will go.
        */
        function () {
        };
        Basic.prototype.postUpdate = /**
        * Post-update is called right after <code>update()</code> on each object in the game loop.
        */
        function () {
        };
        Basic.prototype.render = function (camera, cameraOffsetX, cameraOffsetY) {
        };
        Basic.prototype.kill = /**
        * Handy for "killing" game objects.
        * Default behavior is to flag them as nonexistent AND dead.
        * However, if you want the "corpse" to remain in the game,
        * like to animate an effect or whatever, you should override this,
        * setting only alive to false, and leaving exists true.
        */
        function () {
            this.alive = false;
            this.exists = false;
        };
        Basic.prototype.revive = /**
        * Handy for bringing game objects "back to life". Just sets alive and exists back to true.
        * In practice, this is most often called by <code>Object.reset()</code>.
        */
        function () {
            this.alive = true;
            this.exists = true;
        };
        Basic.prototype.toString = /**
        * Convert object to readable string name.  Useful for debugging, save games, etc.
        */
        function () {
            return "";
        };
        return Basic;
    })();
    Phaser.Basic = Basic;    
})(Phaser || (Phaser = {}));
/// <reference path="Signal.ts" />
/**
* Phaser - SignalBinding
*
* An object that represents a binding between a Signal and a listener function.
* Based on JS Signals by Miller Medeiros. Converted by TypeScript by Richard Davey.
* Released under the MIT license
* http://millermedeiros.github.com/js-signals/
*/
var Phaser;
(function (Phaser) {
    var SignalBinding = (function () {
        /**
        * Object that represents a binding between a Signal and a listener function.
        * <br />- <strong>This is an internal constructor and shouldn't be called by regular users.</strong>
        * <br />- inspired by Joa Ebert AS3 SignalBinding and Robert Penner's Slot classes.
        * @author Miller Medeiros
        * @constructor
        * @internal
        * @name SignalBinding
        * @param {Signal} signal Reference to Signal object that listener is currently bound to.
        * @param {Function} listener Handler function bound to the signal.
        * @param {boolean} isOnce If binding should be executed just once.
        * @param {Object} [listenerContext] Context on which listener will be executed (object that should represent the `this` variable inside listener function).
        * @param {Number} [priority] The priority level of the event listener. (default = 0).
        */
        function SignalBinding(signal, listener, isOnce, listenerContext, priority) {
            if (typeof priority === "undefined") { priority = 0; }
            /**
            * If binding is active and should be executed.
            * @type boolean
            */
            this.active = true;
            /**
            * Default parameters passed to listener during `Signal.dispatch` and `SignalBinding.execute`. (curried parameters)
            * @type Array|null
            */
            this.params = null;
            this._listener = listener;
            this._isOnce = isOnce;
            this.context = listenerContext;
            this._signal = signal;
            this.priority = priority || 0;
        }
        SignalBinding.prototype.execute = /**
        * Call listener passing arbitrary parameters.
        * <p>If binding was added using `Signal.addOnce()` it will be automatically removed from signal dispatch queue, this method is used internally for the signal dispatch.</p>
        * @param {Array} [paramsArr] Array of parameters that should be passed to the listener
        * @return {*} Value returned by the listener.
        */
        function (paramsArr) {
            var handlerReturn;
            var params;
            if(this.active && !!this._listener) {
                params = this.params ? this.params.concat(paramsArr) : paramsArr;
                handlerReturn = this._listener.apply(this.context, params);
                if(this._isOnce) {
                    this.detach();
                }
            }
            return handlerReturn;
        };
        SignalBinding.prototype.detach = /**
        * Detach binding from signal.
        * - alias to: mySignal.remove(myBinding.getListener());
        * @return {Function|null} Handler function bound to the signal or `null` if binding was previously detached.
        */
        function () {
            return this.isBound() ? this._signal.remove(this._listener, this.context) : null;
        };
        SignalBinding.prototype.isBound = /**
        * @return {Boolean} `true` if binding is still bound to the signal and have a listener.
        */
        function () {
            return (!!this._signal && !!this._listener);
        };
        SignalBinding.prototype.isOnce = /**
        * @return {boolean} If SignalBinding will only be executed once.
        */
        function () {
            return this._isOnce;
        };
        SignalBinding.prototype.getListener = /**
        * @return {Function} Handler function bound to the signal.
        */
        function () {
            return this._listener;
        };
        SignalBinding.prototype.getSignal = /**
        * @return {Signal} Signal that listener is currently bound to.
        */
        function () {
            return this._signal;
        };
        SignalBinding.prototype._destroy = /**
        * Delete instance properties
        * @private
        */
        function () {
            delete this._signal;
            delete this._listener;
            delete this.context;
        };
        SignalBinding.prototype.toString = /**
        * @return {string} String representation of the object.
        */
        function () {
            return '[SignalBinding isOnce:' + this._isOnce + ', isBound:' + this.isBound() + ', active:' + this.active + ']';
        };
        return SignalBinding;
    })();
    Phaser.SignalBinding = SignalBinding;    
})(Phaser || (Phaser = {}));
/// <reference path="SignalBinding.ts" />
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
        Signal.VERSION = '1.0.0';
        Signal.prototype.validateListener = /**
        *
        * @method validateListener
        * @param {Any} listener
        * @param {Any} fnName
        */
        function (listener, fnName) {
            if(typeof listener !== 'function') {
                throw new Error('listener is a required param of {fn}() and should be a Function.'.replace('{fn}', fnName));
            }
        };
        Signal.prototype._registerListener = /**
        * @param {Function} listener
        * @param {boolean} isOnce
        * @param {Object} [listenerContext]
        * @param {Number} [priority]
        * @return {SignalBinding}
        * @private
        */
        function (listener, isOnce, listenerContext, priority) {
            var prevIndex = this._indexOfListener(listener, listenerContext);
            var binding;
            if(prevIndex !== -1) {
                binding = this._bindings[prevIndex];
                if(binding.isOnce() !== isOnce) {
                    throw new Error('You cannot add' + (isOnce ? '' : 'Once') + '() then add' + (!isOnce ? '' : 'Once') + '() the same listener without removing the relationship first.');
                }
            } else {
                binding = new Phaser.SignalBinding(this, listener, isOnce, listenerContext, priority);
                this._addBinding(binding);
            }
            if(this.memorize && this._prevParams) {
                binding.execute(this._prevParams);
            }
            return binding;
        };
        Signal.prototype._addBinding = /**
        *
        * @method _addBinding
        * @param {SignalBinding} binding
        * @private
        */
        function (binding) {
            //simplified insertion sort
            var n = this._bindings.length;
            do {
                --n;
            }while(this._bindings[n] && binding.priority <= this._bindings[n].priority);
            this._bindings.splice(n + 1, 0, binding);
        };
        Signal.prototype._indexOfListener = /**
        *
        * @method _indexOfListener
        * @param {Function} listener
        * @return {number}
        * @private
        */
        function (listener, context) {
            var n = this._bindings.length;
            var cur;
            while(n--) {
                cur = this._bindings[n];
                if(cur.getListener() === listener && cur.context === context) {
                    return n;
                }
            }
            return -1;
        };
        Signal.prototype.has = /**
        * Check if listener was attached to Signal.
        * @param {Function} listener
        * @param {Object} [context]
        * @return {boolean} if Signal has the specified listener.
        */
        function (listener, context) {
            if (typeof context === "undefined") { context = null; }
            return this._indexOfListener(listener, context) !== -1;
        };
        Signal.prototype.add = /**
        * Add a listener to the signal.
        * @param {Function} listener Signal handler function.
        * @param {Object} [listenerContext] Context on which listener will be executed (object that should represent the `this` variable inside listener function).
        * @param {Number} [priority] The priority level of the event listener. Listeners with higher priority will be executed before listeners with lower priority. Listeners with same priority level will be executed at the same order as they were added. (default = 0)
        * @return {SignalBinding} An Object representing the binding between the Signal and listener.
        */
        function (listener, listenerContext, priority) {
            if (typeof listenerContext === "undefined") { listenerContext = null; }
            if (typeof priority === "undefined") { priority = 0; }
            this.validateListener(listener, 'add');
            return this._registerListener(listener, false, listenerContext, priority);
        };
        Signal.prototype.addOnce = /**
        * Add listener to the signal that should be removed after first execution (will be executed only once).
        * @param {Function} listener Signal handler function.
        * @param {Object} [listenerContext] Context on which listener will be executed (object that should represent the `this` variable inside listener function).
        * @param {Number} [priority] The priority level of the event listener. Listeners with higher priority will be executed before listeners with lower priority. Listeners with same priority level will be executed at the same order as they were added. (default = 0)
        * @return {SignalBinding} An Object representing the binding between the Signal and listener.
        */
        function (listener, listenerContext, priority) {
            if (typeof listenerContext === "undefined") { listenerContext = null; }
            if (typeof priority === "undefined") { priority = 0; }
            this.validateListener(listener, 'addOnce');
            return this._registerListener(listener, true, listenerContext, priority);
        };
        Signal.prototype.remove = /**
        * Remove a single listener from the dispatch queue.
        * @param {Function} listener Handler function that should be removed.
        * @param {Object} [context] Execution context (since you can add the same handler multiple times if executing in a different context).
        * @return {Function} Listener handler function.
        */
        function (listener, context) {
            if (typeof context === "undefined") { context = null; }
            this.validateListener(listener, 'remove');
            var i = this._indexOfListener(listener, context);
            if(i !== -1) {
                this._bindings[i]._destroy()//no reason to a SignalBinding exist if it isn't attached to a signal
                ;
                this._bindings.splice(i, 1);
            }
            return listener;
        };
        Signal.prototype.removeAll = /**
        * Remove all listeners from the Signal.
        */
        function () {
            var n = this._bindings.length;
            while(n--) {
                this._bindings[n]._destroy();
            }
            this._bindings.length = 0;
        };
        Signal.prototype.getNumListeners = /**
        * @return {number} Number of listeners attached to the Signal.
        */
        function () {
            return this._bindings.length;
        };
        Signal.prototype.halt = /**
        * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
        * <p><strong>IMPORTANT:</strong> should be called only during signal dispatch, calling it before/after dispatch won't affect signal broadcast.</p>
        * @see Signal.prototype.disable
        */
        function () {
            this._shouldPropagate = false;
        };
        Signal.prototype.dispatch = /**
        * Dispatch/Broadcast Signal to all listeners added to the queue.
        * @param {...*} [params] Parameters that should be passed to each handler.
        */
        function () {
            var paramsArr = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                paramsArr[_i] = arguments[_i + 0];
            }
            if(!this.active) {
                return;
            }
            var n = this._bindings.length;
            var bindings;
            if(this.memorize) {
                this._prevParams = paramsArr;
            }
            if(!n) {
                //should come after memorize
                return;
            }
            bindings = this._bindings.slice(0)//clone array in case add/remove items during dispatch
            ;
            this._shouldPropagate = true//in case `halt` was called before dispatch or during the previous dispatch.
            ;
            //execute all callbacks until end of the list or until a callback returns `false` or stops propagation
            //reverse loop since listeners with higher priority will be added at the end of the list
            do {
                n--;
            }while(bindings[n] && this._shouldPropagate && bindings[n].execute(paramsArr) !== false);
        };
        Signal.prototype.forget = /**
        * Forget memorized arguments.
        * @see Signal.memorize
        */
        function () {
            this._prevParams = null;
        };
        Signal.prototype.dispose = /**
        * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
        * <p><strong>IMPORTANT:</strong> calling any method on the signal instance after calling dispose will throw errors.</p>
        */
        function () {
            this.removeAll();
            delete this._bindings;
            delete this._prevParams;
        };
        Signal.prototype.toString = /**
        * @return {string} String representation of the object.
        */
        function () {
            return '[Signal active:' + this.active + ' numListeners:' + this.getNumListeners() + ']';
        };
        return Signal;
    })();
    Phaser.Signal = Signal;    
})(Phaser || (Phaser = {}));
var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="../Game.ts" />
/// <reference path="../Basic.ts" />
/// <reference path="../Signal.ts" />
/**
* Phaser - GameObject
*
* This is the base GameObject on which all other game objects are derived. It contains all the logic required for position,
* motion, size, collision and input.
*/
var Phaser;
(function (Phaser) {
    var GameObject = (function (_super) {
        __extends(GameObject, _super);
        function GameObject(game, x, y, width, height) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            if (typeof width === "undefined") { width = 16; }
            if (typeof height === "undefined") { height = 16; }
                _super.call(this, game);
            this._angle = 0;
            this.z = 0;
            this.moves = true;
            //  Input
            this.inputEnabled = false;
            this._inputOver = false;
            this.bounds = new Phaser.Rectangle(x, y, width, height);
            this.exists = true;
            this.active = true;
            this.visible = true;
            this.alive = true;
            this.isGroup = false;
            this.alpha = 1;
            this.scale = new Phaser.MicroPoint(1, 1);
            this.last = new Phaser.MicroPoint(x, y);
            this.origin = new Phaser.MicroPoint(this.bounds.halfWidth, this.bounds.halfHeight);
            this.align = GameObject.ALIGN_TOP_LEFT;
            this.mass = 1.0;
            this.elasticity = 0.0;
            this.health = 1;
            this.immovable = false;
            this.moves = true;
            this.touching = Phaser.Collision.NONE;
            this.wasTouching = Phaser.Collision.NONE;
            this.allowCollisions = Phaser.Collision.ANY;
            this.velocity = new Phaser.MicroPoint();
            this.acceleration = new Phaser.MicroPoint();
            this.drag = new Phaser.MicroPoint();
            this.maxVelocity = new Phaser.MicroPoint(10000, 10000);
            this.angle = 0;
            this.angularVelocity = 0;
            this.angularAcceleration = 0;
            this.angularDrag = 0;
            this.maxAngular = 10000;
            this.scrollFactor = new Phaser.MicroPoint(1.0, 1.0);
        }
        GameObject.ALIGN_TOP_LEFT = 0;
        GameObject.ALIGN_TOP_CENTER = 1;
        GameObject.ALIGN_TOP_RIGHT = 2;
        GameObject.ALIGN_CENTER_LEFT = 3;
        GameObject.ALIGN_CENTER = 4;
        GameObject.ALIGN_CENTER_RIGHT = 5;
        GameObject.ALIGN_BOTTOM_LEFT = 6;
        GameObject.ALIGN_BOTTOM_CENTER = 7;
        GameObject.ALIGN_BOTTOM_RIGHT = 8;
        GameObject.prototype.preUpdate = function () {
            //  flicker time
            this.last.x = this.bounds.x;
            this.last.y = this.bounds.y;
        };
        GameObject.prototype.update = function () {
        };
        GameObject.prototype.postUpdate = function () {
            if(this.moves) {
                this.updateMotion();
            }
            if(this.inputEnabled) {
                this.updateInput();
            }
            this.wasTouching = this.touching;
            this.touching = Phaser.Collision.NONE;
        };
        GameObject.prototype.updateInput = function () {
        };
        GameObject.prototype.updateMotion = function () {
            var delta;
            var velocityDelta;
            velocityDelta = (this._game.motion.computeVelocity(this.angularVelocity, this.angularAcceleration, this.angularDrag, this.maxAngular) - this.angularVelocity) / 2;
            this.angularVelocity += velocityDelta;
            this._angle += this.angularVelocity * this._game.time.elapsed;
            this.angularVelocity += velocityDelta;
            velocityDelta = (this._game.motion.computeVelocity(this.velocity.x, this.acceleration.x, this.drag.x, this.maxVelocity.x) - this.velocity.x) / 2;
            this.velocity.x += velocityDelta;
            delta = this.velocity.x * this._game.time.elapsed;
            this.velocity.x += velocityDelta;
            this.bounds.x += delta;
            velocityDelta = (this._game.motion.computeVelocity(this.velocity.y, this.acceleration.y, this.drag.y, this.maxVelocity.y) - this.velocity.y) / 2;
            this.velocity.y += velocityDelta;
            delta = this.velocity.y * this._game.time.elapsed;
            this.velocity.y += velocityDelta;
            this.bounds.y += delta;
        };
        GameObject.prototype.overlaps = /**
        * Checks to see if some <code>GameObject</code> overlaps this <code>GameObject</code> or <code>Group</code>.
        * If the group has a LOT of things in it, it might be faster to use <code>G.overlaps()</code>.
        * WARNING: Currently tilemaps do NOT support screen space overlap checks!
        *
        * @param	ObjectOrGroup	The object or group being tested.
        * @param	InScreenSpace	Whether to take scroll factors numbero account when checking for overlap.  Default is false, or "only compare in world space."
        * @param	Camera			Specify which game camera you want.  If null getScreenXY() will just grab the first global camera.
        *
        * @return	Whether or not the two objects overlap.
        */
        function (ObjectOrGroup, InScreenSpace, Camera) {
            if (typeof InScreenSpace === "undefined") { InScreenSpace = false; }
            if (typeof Camera === "undefined") { Camera = null; }
            if(ObjectOrGroup.isGroup) {
                var results = false;
                var i = 0;
                var members = ObjectOrGroup.members;
                while(i < length) {
                    if(this.overlaps(members[i++], InScreenSpace, Camera)) {
                        results = true;
                    }
                }
                return results;
            }
            /*
            if (typeof ObjectOrGroup === 'Tilemap')
            {
            //Since tilemap's have to be the caller, not the target, to do proper tile-based collisions,
            // we redirect the call to the tilemap overlap here.
            return ObjectOrGroup.overlaps(this, InScreenSpace, Camera);
            }
            */
            //var object: GameObject = ObjectOrGroup;
            if(!InScreenSpace) {
                return (ObjectOrGroup.x + ObjectOrGroup.width > this.x) && (ObjectOrGroup.x < this.x + this.width) && (ObjectOrGroup.y + ObjectOrGroup.height > this.y) && (ObjectOrGroup.y < this.y + this.height);
            }
            if(Camera == null) {
                Camera = this._game.camera;
            }
            var objectScreenPos = ObjectOrGroup.getScreenXY(null, Camera);
            this.getScreenXY(this._point, Camera);
            return (objectScreenPos.x + ObjectOrGroup.width > this._point.x) && (objectScreenPos.x < this._point.x + this.width) && (objectScreenPos.y + ObjectOrGroup.height > this._point.y) && (objectScreenPos.y < this._point.y + this.height);
        };
        GameObject.prototype.overlapsAt = /**
        * Checks to see if this <code>GameObject</code> were located at the given position, would it overlap the <code>GameObject</code> or <code>Group</code>?
        * This is distinct from overlapsPoint(), which just checks that point, rather than taking the object's size numbero account.
        * WARNING: Currently tilemaps do NOT support screen space overlap checks!
        *
        * @param	X				The X position you want to check.  Pretends this object (the caller, not the parameter) is located here.
        * @param	Y				The Y position you want to check.  Pretends this object (the caller, not the parameter) is located here.
        * @param	ObjectOrGroup	The object or group being tested.
        * @param	InScreenSpace	Whether to take scroll factors numbero account when checking for overlap.  Default is false, or "only compare in world space."
        * @param	Camera			Specify which game camera you want.  If null getScreenXY() will just grab the first global camera.
        *
        * @return	Whether or not the two objects overlap.
        */
        function (X, Y, ObjectOrGroup, InScreenSpace, Camera) {
            if (typeof InScreenSpace === "undefined") { InScreenSpace = false; }
            if (typeof Camera === "undefined") { Camera = null; }
            if(ObjectOrGroup.isGroup) {
                var results = false;
                var basic;
                var i = 0;
                var members = ObjectOrGroup.members;
                while(i < length) {
                    if(this.overlapsAt(X, Y, members[i++], InScreenSpace, Camera)) {
                        results = true;
                    }
                }
                return results;
            }
            /*
            if (typeof ObjectOrGroup === 'Tilemap')
            {
            //Since tilemap's have to be the caller, not the target, to do proper tile-based collisions,
            // we redirect the call to the tilemap overlap here.
            //However, since this is overlapsAt(), we also have to invent the appropriate position for the tilemap.
            //So we calculate the offset between the player and the requested position, and subtract that from the tilemap.
            var tilemap: Tilemap = ObjectOrGroup;
            return tilemap.overlapsAt(tilemap.x - (X - this.x), tilemap.y - (Y - this.y), this, InScreenSpace, Camera);
            }
            */
            //var object: GameObject = ObjectOrGroup;
            if(!InScreenSpace) {
                return (ObjectOrGroup.x + ObjectOrGroup.width > X) && (ObjectOrGroup.x < X + this.width) && (ObjectOrGroup.y + ObjectOrGroup.height > Y) && (ObjectOrGroup.y < Y + this.height);
            }
            if(Camera == null) {
                Camera = this._game.camera;
            }
            var objectScreenPos = ObjectOrGroup.getScreenXY(null, Camera);
            this._point.x = X - Camera.scroll.x * this.scrollFactor.x//copied from getScreenXY()
            ;
            this._point.y = Y - Camera.scroll.y * this.scrollFactor.y;
            this._point.x += (this._point.x > 0) ? 0.0000001 : -0.0000001;
            this._point.y += (this._point.y > 0) ? 0.0000001 : -0.0000001;
            return (objectScreenPos.x + ObjectOrGroup.width > this._point.x) && (objectScreenPos.x < this._point.x + this.width) && (objectScreenPos.y + ObjectOrGroup.height > this._point.y) && (objectScreenPos.y < this._point.y + this.height);
        };
        GameObject.prototype.overlapsPoint = /**
        * Checks to see if a point in 2D world space overlaps this <code>GameObject</code>.
        *
        * @param	Point			The point in world space you want to check.
        * @param	InScreenSpace	Whether to take scroll factors numbero account when checking for overlap.
        * @param	Camera			Specify which game camera you want.  If null getScreenXY() will just grab the first global camera.
        *
        * @return	Whether or not the point overlaps this object.
        */
        function (point, InScreenSpace, Camera) {
            if (typeof InScreenSpace === "undefined") { InScreenSpace = false; }
            if (typeof Camera === "undefined") { Camera = null; }
            if(!InScreenSpace) {
                return (point.x > this.x) && (point.x < this.x + this.width) && (point.y > this.y) && (point.y < this.y + this.height);
            }
            if(Camera == null) {
                Camera = this._game.camera;
            }
            var X = point.x - Camera.scroll.x;
            var Y = point.y - Camera.scroll.y;
            this.getScreenXY(this._point, Camera);
            return (X > this._point.x) && (X < this._point.x + this.width) && (Y > this._point.y) && (Y < this._point.y + this.height);
        };
        GameObject.prototype.onScreen = /**
        * Check and see if this object is currently on screen.
        *
        * @param	Camera		Specify which game camera you want. If null getScreenXY() will just grab the first global camera.
        *
        * @return	Whether the object is on screen or not.
        */
        function (Camera) {
            if (typeof Camera === "undefined") { Camera = null; }
            if(Camera == null) {
                Camera = this._game.camera;
            }
            this.getScreenXY(this._point, Camera);
            return (this._point.x + this.width > 0) && (this._point.x < Camera.width) && (this._point.y + this.height > 0) && (this._point.y < Camera.height);
        };
        GameObject.prototype.getScreenXY = /**
        * Call this to figure out the on-screen position of the object.
        *
        * @param	Camera		Specify which game camera you want.  If null getScreenXY() will just grab the first global camera.
        * @param	Point		Takes a <code>MicroPoint</code> object and assigns the post-scrolled X and Y values of this object to it.
        *
        * @return	The <code>MicroPoint</code> you passed in, or a new <code>Point</code> if you didn't pass one, containing the screen X and Y position of this object.
        */
        function (point, Camera) {
            if (typeof point === "undefined") { point = null; }
            if (typeof Camera === "undefined") { Camera = null; }
            if(point == null) {
                point = new Phaser.MicroPoint();
            }
            if(Camera == null) {
                Camera = this._game.camera;
            }
            point.x = this.x - Camera.scroll.x * this.scrollFactor.x;
            point.y = this.y - Camera.scroll.y * this.scrollFactor.y;
            point.x += (point.x > 0) ? 0.0000001 : -0.0000001;
            point.y += (point.y > 0) ? 0.0000001 : -0.0000001;
            return point;
        };
        Object.defineProperty(GameObject.prototype, "solid", {
            get: /**
            * Whether the object collides or not.  For more control over what directions
            * the object will collide from, use collision constants (like LEFT, FLOOR, etc)
            * to set the value of allowCollisions directly.
            */
            function () {
                return (this.allowCollisions & Phaser.Collision.ANY) > Phaser.Collision.NONE;
            },
            set: /**
            * @private
            */
            function (Solid) {
                if(Solid) {
                    this.allowCollisions = Phaser.Collision.ANY;
                } else {
                    this.allowCollisions = Phaser.Collision.NONE;
                }
            },
            enumerable: true,
            configurable: true
        });
        GameObject.prototype.getMidpoint = /**
        * Retrieve the midpoint of this object in world coordinates.
        *
        * @Point	Allows you to pass in an existing <code>Point</code> object if you're so inclined.  Otherwise a new one is created.
        *
        * @return	A <code>Point</code> object containing the midpoint of this object in world coordinates.
        */
        function (point) {
            if (typeof point === "undefined") { point = null; }
            if(point == null) {
                point = new Phaser.MicroPoint();
            }
            point.copyFrom(this.bounds.center);
            return point;
        };
        GameObject.prototype.reset = /**
        * Handy for reviving game objects.
        * Resets their existence flags and position.
        *
        * @param	X	The new X position of this object.
        * @param	Y	The new Y position of this object.
        */
        function (X, Y) {
            this.revive();
            this.touching = Phaser.Collision.NONE;
            this.wasTouching = Phaser.Collision.NONE;
            this.x = X;
            this.y = Y;
            this.last.x = X;
            this.last.y = Y;
            this.velocity.x = 0;
            this.velocity.y = 0;
        };
        GameObject.prototype.isTouching = /**
        * Handy for checking if this object is touching a particular surface.
        * For slightly better performance you can just &amp; the value directly numbero <code>touching</code>.
        * However, this method is good for readability and accessibility.
        *
        * @param	Direction	Any of the collision flags (e.g. LEFT, FLOOR, etc).
        *
        * @return	Whether the object is touching an object in (any of) the specified direction(s) this frame.
        */
        function (Direction) {
            return (this.touching & Direction) > Phaser.Collision.NONE;
        };
        GameObject.prototype.justTouched = /**
        * Handy for checking if this object is just landed on a particular surface.
        *
        * @param	Direction	Any of the collision flags (e.g. LEFT, FLOOR, etc).
        *
        * @return	Whether the object just landed on (any of) the specified surface(s) this frame.
        */
        function (Direction) {
            return ((this.touching & Direction) > Phaser.Collision.NONE) && ((this.wasTouching & Direction) <= Phaser.Collision.NONE);
        };
        GameObject.prototype.hurt = /**
        * Reduces the "health" variable of this sprite by the amount specified in Damage.
        * Calls kill() if health drops to or below zero.
        *
        * @param	Damage		How much health to take away (use a negative number to give a health bonus).
        */
        function (Damage) {
            this.health = this.health - Damage;
            if(this.health <= 0) {
                this.kill();
            }
        };
        GameObject.prototype.destroy = function () {
        };
        Object.defineProperty(GameObject.prototype, "x", {
            get: function () {
                return this.bounds.x;
            },
            set: function (value) {
                this.bounds.x = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameObject.prototype, "y", {
            get: function () {
                return this.bounds.y;
            },
            set: function (value) {
                this.bounds.y = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameObject.prototype, "rotation", {
            get: function () {
                return this._angle;
            },
            set: function (value) {
                this._angle = this._game.math.wrap(value, 360, 0);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameObject.prototype, "angle", {
            get: function () {
                return this._angle;
            },
            set: function (value) {
                this._angle = this._game.math.wrap(value, 360, 0);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameObject.prototype, "width", {
            get: function () {
                return this.bounds.width;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameObject.prototype, "height", {
            get: function () {
                return this.bounds.height;
            },
            enumerable: true,
            configurable: true
        });
        return GameObject;
    })(Phaser.Basic);
    Phaser.GameObject = GameObject;    
})(Phaser || (Phaser = {}));
/// <reference path="../Game.ts" />
/// <reference path="../AnimationManager.ts" />
/// <reference path="GameObject.ts" />
/**
* Phaser - Sprite
*
* The Sprite GameObject is an extension of the core GameObject that includes support for animation and dynamic textures.
* It's probably the most used GameObject of all.
*/
var Phaser;
(function (Phaser) {
    var Sprite = (function (_super) {
        __extends(Sprite, _super);
        function Sprite(game, x, y, key) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            if (typeof key === "undefined") { key = null; }
                _super.call(this, game, x, y);
            this._dynamicTexture = false;
            //  local rendering related temp vars to help avoid gc spikes
            this._sx = 0;
            this._sy = 0;
            this._sw = 0;
            this._sh = 0;
            this._dx = 0;
            this._dy = 0;
            this._dw = 0;
            this._dh = 0;
            this.renderDebug = false;
            this.renderDebugColor = 'rgba(0,255,0,0.5)';
            this.renderDebugPointColor = 'rgba(255,255,255,1)';
            this._texture = null;
            this.animations = new Phaser.AnimationManager(this._game, this);
            if(key !== null) {
                this.loadGraphic(key);
            } else {
                this.bounds.width = 16;
                this.bounds.height = 16;
            }
        }
        Sprite.prototype.loadGraphic = function (key) {
            if(this._game.cache.getImage(key) !== null) {
                if(this._game.cache.isSpriteSheet(key) == false) {
                    this._texture = this._game.cache.getImage(key);
                    this.bounds.width = this._texture.width;
                    this.bounds.height = this._texture.height;
                } else {
                    this._texture = this._game.cache.getImage(key);
                    this.animations.loadFrameData(this._game.cache.getFrameData(key));
                }
                this._dynamicTexture = false;
            }
            return this;
        };
        Sprite.prototype.loadDynamicTexture = function (texture) {
            this._texture = texture;
            this.bounds.width = this._texture.width;
            this.bounds.height = this._texture.height;
            this._dynamicTexture = true;
            return this;
        };
        Sprite.prototype.makeGraphic = function (width, height, color) {
            if (typeof color === "undefined") { color = 0xffffffff; }
            this._texture = null;
            this.width = width;
            this.height = height;
            this._dynamicTexture = false;
            return this;
        };
        Sprite.prototype.inCamera = function (camera) {
            if(this.scrollFactor.x !== 1.0 || this.scrollFactor.y !== 1.0) {
                this._dx = this.bounds.x - (camera.x * this.scrollFactor.x);
                this._dy = this.bounds.y - (camera.y * this.scrollFactor.x);
                this._dw = this.bounds.width * this.scale.x;
                this._dh = this.bounds.height * this.scale.y;
                return (camera.right > this._dx) && (camera.x < this._dx + this._dw) && (camera.bottom > this._dy) && (camera.y < this._dy + this._dh);
            } else {
                return camera.intersects(this.bounds, this.bounds.length);
            }
        };
        Sprite.prototype.postUpdate = function () {
            this.animations.update();
            _super.prototype.postUpdate.call(this);
        };
        Object.defineProperty(Sprite.prototype, "frame", {
            get: function () {
                return this.animations.frame;
            },
            set: function (value) {
                this.animations.frame = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Sprite.prototype, "frameName", {
            get: function () {
                return this.animations.frameName;
            },
            set: function (value) {
                this.animations.frameName = value;
            },
            enumerable: true,
            configurable: true
        });
        Sprite.prototype.render = function (camera, cameraOffsetX, cameraOffsetY) {
            //  Render checks
            if(this.visible === false || this.scale.x == 0 || this.scale.y == 0 || this.alpha < 0.1 || this.inCamera(camera.worldView) == false) {
                return false;
            }
            //  Alpha
            if(this.alpha !== 1) {
                var globalAlpha = this._game.stage.context.globalAlpha;
                this._game.stage.context.globalAlpha = this.alpha;
            }
            //if (this.flip === true)
            //{
            //	this.context.save();
            //	this.context.translate(game.canvas.width, 0);
            //	this.context.scale(-1, 1);
            //}
            this._sx = 0;
            this._sy = 0;
            this._sw = this.bounds.width;
            this._sh = this.bounds.height;
            this._dx = cameraOffsetX + (this.bounds.topLeft.x - camera.worldView.x);
            this._dy = cameraOffsetY + (this.bounds.topLeft.y - camera.worldView.y);
            this._dw = this.bounds.width * this.scale.x;
            this._dh = this.bounds.height * this.scale.y;
            if(this.align == Phaser.GameObject.ALIGN_TOP_CENTER) {
                this._dx -= this.bounds.halfWidth * this.scale.x;
            } else if(this.align == Phaser.GameObject.ALIGN_TOP_RIGHT) {
                this._dx -= this.bounds.width * this.scale.x;
            } else if(this.align == Phaser.GameObject.ALIGN_CENTER_LEFT) {
                this._dy -= this.bounds.halfHeight * this.scale.y;
            } else if(this.align == Phaser.GameObject.ALIGN_CENTER) {
                this._dx -= this.bounds.halfWidth * this.scale.x;
                this._dy -= this.bounds.halfHeight * this.scale.y;
            } else if(this.align == Phaser.GameObject.ALIGN_CENTER_RIGHT) {
                this._dx -= this.bounds.width * this.scale.x;
                this._dy -= this.bounds.halfHeight * this.scale.y;
            } else if(this.align == Phaser.GameObject.ALIGN_BOTTOM_LEFT) {
                this._dy -= this.bounds.height * this.scale.y;
            } else if(this.align == Phaser.GameObject.ALIGN_BOTTOM_CENTER) {
                this._dx -= this.bounds.halfWidth * this.scale.x;
                this._dy -= this.bounds.height * this.scale.y;
            } else if(this.align == Phaser.GameObject.ALIGN_BOTTOM_RIGHT) {
                this._dx -= this.bounds.width * this.scale.x;
                this._dy -= this.bounds.height * this.scale.y;
            }
            if(this._dynamicTexture == false && this.animations.currentFrame !== null) {
                this._sx = this.animations.currentFrame.x;
                this._sy = this.animations.currentFrame.y;
                if(this.animations.currentFrame.trimmed) {
                    this._dx += this.animations.currentFrame.spriteSourceSizeX;
                    this._dy += this.animations.currentFrame.spriteSourceSizeY;
                }
            }
            //	Apply camera difference
            if(this.scrollFactor.x !== 1.0 || this.scrollFactor.y !== 1.0) {
                this._dx -= (camera.worldView.x * this.scrollFactor.x);
                this._dy -= (camera.worldView.y * this.scrollFactor.y);
            }
            //	Rotation
            if(this.angle !== 0) {
                this._game.stage.context.save();
                //this._game.stage.context.translate(this._dx + (this._dw / 2) - this.origin.x, this._dy + (this._dh / 2) - this.origin.y);
                this._game.stage.context.translate(this._dx + (this._dw / 2), this._dy + (this._dh / 2));
                this._game.stage.context.rotate(this.angle * (Math.PI / 180));
                this._dx = -(this._dw / 2);
                this._dy = -(this._dh / 2);
            }
            this._sx = Math.round(this._sx);
            this._sy = Math.round(this._sy);
            this._sw = Math.round(this._sw);
            this._sh = Math.round(this._sh);
            this._dx = Math.round(this._dx);
            this._dy = Math.round(this._dy);
            this._dw = Math.round(this._dw);
            this._dh = Math.round(this._dh);
            if(this._texture != null) {
                if(this._dynamicTexture) {
                    this._game.stage.context.drawImage(this._texture.canvas, //	Source Image
                    this._sx, //	Source X (location within the source image)
                    this._sy, //	Source Y
                    this._sw, //	Source Width
                    this._sh, //	Source Height
                    this._dx, //	Destination X (where on the canvas it'll be drawn)
                    this._dy, //	Destination Y
                    this._dw, //	Destination Width (always same as Source Width unless scaled)
                    this._dh);
                    //	Destination Height (always same as Source Height unless scaled)
                                    } else {
                    this._game.stage.context.drawImage(this._texture, //	Source Image
                    this._sx, //	Source X (location within the source image)
                    this._sy, //	Source Y
                    this._sw, //	Source Width
                    this._sh, //	Source Height
                    this._dx, //	Destination X (where on the canvas it'll be drawn)
                    this._dy, //	Destination Y
                    this._dw, //	Destination Width (always same as Source Width unless scaled)
                    this._dh);
                    //	Destination Height (always same as Source Height unless scaled)
                                    }
            } else {
                this._game.stage.context.fillStyle = 'rgb(255,255,255)';
                this._game.stage.context.fillRect(this._dx, this._dy, this._dw, this._dh);
            }
            if(this.renderDebug) {
                this.renderBounds();
            }
            //if (this.flip === true || this.rotation !== 0)
            if(this.rotation !== 0) {
                this._game.stage.context.translate(0, 0);
                this._game.stage.context.restore();
            }
            if(globalAlpha > -1) {
                this._game.stage.context.globalAlpha = globalAlpha;
            }
            return true;
        };
        Sprite.prototype.renderBounds = function () {
            this._game.stage.context.fillStyle = this.renderDebugColor;
            this._game.stage.context.fillRect(this._dx, this._dy, this._dw, this._dh);
            this._game.stage.context.fillStyle = this.renderDebugPointColor;
            var hw = this.bounds.halfWidth * this.scale.x;
            var hh = this.bounds.halfHeight * this.scale.y;
            var sw = (this.bounds.width * this.scale.x) - 1;
            var sh = (this.bounds.height * this.scale.y) - 1;
            this._game.stage.context.fillRect(this._dx, this._dy, 1, 1)//  top left
            ;
            this._game.stage.context.fillRect(this._dx + hw, this._dy, 1, 1)//  top center
            ;
            this._game.stage.context.fillRect(this._dx + sw, this._dy, 1, 1)//  top right
            ;
            this._game.stage.context.fillRect(this._dx, this._dy + hh, 1, 1)//  left center
            ;
            this._game.stage.context.fillRect(this._dx + hw, this._dy + hh, 1, 1)//  center
            ;
            this._game.stage.context.fillRect(this._dx + sw, this._dy + hh, 1, 1)//  right center
            ;
            this._game.stage.context.fillRect(this._dx, this._dy + sh, 1, 1)//  bottom left
            ;
            this._game.stage.context.fillRect(this._dx + hw, this._dy + sh, 1, 1)//  bottom center
            ;
            this._game.stage.context.fillRect(this._dx + sw, this._dy + sh, 1, 1)//  bottom right
            ;
        };
        Sprite.prototype.renderDebugInfo = function (x, y, color) {
            if (typeof color === "undefined") { color = 'rgb(255,255,255)'; }
            this._game.stage.context.fillStyle = color;
            this._game.stage.context.fillText('Sprite: ' + this.name + ' (' + this.bounds.width + ' x ' + this.bounds.height + ')', x, y);
            this._game.stage.context.fillText('x: ' + this.bounds.x.toFixed(1) + ' y: ' + this.bounds.y.toFixed(1) + ' rotation: ' + this.angle.toFixed(1), x, y + 14);
            this._game.stage.context.fillText('dx: ' + this._dx.toFixed(1) + ' dy: ' + this._dy.toFixed(1) + ' dw: ' + this._dw.toFixed(1) + ' dh: ' + this._dh.toFixed(1), x, y + 28);
            this._game.stage.context.fillText('sx: ' + this._sx.toFixed(1) + ' sy: ' + this._sy.toFixed(1) + ' sw: ' + this._sw.toFixed(1) + ' sh: ' + this._sh.toFixed(1), x, y + 42);
        };
        return Sprite;
    })(Phaser.GameObject);
    Phaser.Sprite = Sprite;    
})(Phaser || (Phaser = {}));
/// <reference path="../../Game.ts" />
/**
* Phaser - Animation
*
* An Animation is a single animation. It is created by the AnimationManager and belongs to Sprite objects.
*/
var Phaser;
(function (Phaser) {
    var Animation = (function () {
        function Animation(game, parent, frameData, name, frames, delay, looped) {
            this._game = game;
            this._parent = parent;
            this._frames = frames;
            this._frameData = frameData;
            this.name = name;
            this.delay = 1000 / delay;
            this.looped = looped;
            this.isFinished = false;
            this.isPlaying = false;
        }
        Object.defineProperty(Animation.prototype, "frameTotal", {
            get: function () {
                return this._frames.length;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Animation.prototype, "frame", {
            get: function () {
                return this._frameIndex;
            },
            set: function (value) {
                this.currentFrame = this._frameData.getFrame(value);
                if(this.currentFrame !== null) {
                    this._parent.bounds.width = this.currentFrame.width;
                    this._parent.bounds.height = this.currentFrame.height;
                    this._frameIndex = value;
                }
            },
            enumerable: true,
            configurable: true
        });
        Animation.prototype.play = function (frameRate, loop) {
            if (typeof frameRate === "undefined") { frameRate = null; }
            if(frameRate !== null) {
                this.delay = 1000 / frameRate;
            }
            if(loop !== undefined) {
                this.looped = loop;
            }
            this.isPlaying = true;
            this.isFinished = false;
            this._timeLastFrame = this._game.time.now;
            this._timeNextFrame = this._game.time.now + this.delay;
            this._frameIndex = 0;
            this.currentFrame = this._frameData.getFrame(this._frames[this._frameIndex]);
        };
        Animation.prototype.onComplete = function () {
            this.isPlaying = false;
            this.isFinished = true;
            //  callback
                    };
        Animation.prototype.stop = function () {
            this.isPlaying = false;
            this.isFinished = true;
        };
        Animation.prototype.update = function () {
            if(this.isPlaying == true && this._game.time.now >= this._timeNextFrame) {
                this._frameIndex++;
                if(this._frameIndex == this._frames.length) {
                    if(this.looped) {
                        this._frameIndex = 0;
                        this.currentFrame = this._frameData.getFrame(this._frames[this._frameIndex]);
                    } else {
                        this.onComplete();
                    }
                } else {
                    this.currentFrame = this._frameData.getFrame(this._frames[this._frameIndex]);
                }
                this._timeLastFrame = this._game.time.now;
                this._timeNextFrame = this._game.time.now + this.delay;
                return true;
            }
            return false;
        };
        Animation.prototype.destroy = function () {
            this._game = null;
            this._parent = null;
            this._frames = null;
            this._frameData = null;
            this.currentFrame = null;
            this.isPlaying = false;
        };
        return Animation;
    })();
    Phaser.Animation = Animation;    
})(Phaser || (Phaser = {}));
/// <reference path="../../Game.ts" />
/**
* Phaser - AnimationLoader
*
* Responsible for parsing sprite sheet and JSON data into the internal FrameData format that Phaser uses for animations.
*/
var Phaser;
(function (Phaser) {
    var AnimationLoader = (function () {
        function AnimationLoader() { }
        AnimationLoader.parseSpriteSheet = function parseSpriteSheet(game, key, frameWidth, frameHeight, frameMax) {
            //  How big is our image?
            var img = game.cache.getImage(key);
            if(img == null) {
                return null;
            }
            var width = img.width;
            var height = img.height;
            var row = Math.round(width / frameWidth);
            var column = Math.round(height / frameHeight);
            var total = row * column;
            if(frameMax !== -1) {
                total = frameMax;
            }
            //  Zero or smaller than frame sizes?
            if(width == 0 || height == 0 || width < frameWidth || height < frameHeight || total === 0) {
                return null;
            }
            //  Let's create some frames then
            var data = new Phaser.FrameData();
            var x = 0;
            var y = 0;
            for(var i = 0; i < total; i++) {
                data.addFrame(new Phaser.Frame(x, y, frameWidth, frameHeight, ''));
                x += frameWidth;
                if(x === width) {
                    x = 0;
                    y += frameHeight;
                }
            }
            return data;
        };
        AnimationLoader.parseJSONData = function parseJSONData(game, json) {
            //  Let's create some frames then
            var data = new Phaser.FrameData();
            //  By this stage frames is a fully parsed array
            var frames = json;
            var newFrame;
            for(var i = 0; i < frames.length; i++) {
                newFrame = data.addFrame(new Phaser.Frame(frames[i].frame.x, frames[i].frame.y, frames[i].frame.w, frames[i].frame.h, frames[i].filename));
                newFrame.setTrim(frames[i].trimmed, frames[i].sourceSize.w, frames[i].sourceSize.h, frames[i].spriteSourceSize.x, frames[i].spriteSourceSize.y, frames[i].spriteSourceSize.w, frames[i].spriteSourceSize.h);
            }
            return data;
        };
        return AnimationLoader;
    })();
    Phaser.AnimationLoader = AnimationLoader;    
})(Phaser || (Phaser = {}));
/// <reference path="../../Game.ts" />
/**
* Phaser - Frame
*
* A Frame is a single frame of an animation and is part of a FrameData collection.
*/
var Phaser;
(function (Phaser) {
    var Frame = (function () {
        function Frame(x, y, width, height, name) {
            //  Useful for Texture Atlas files (is set to the filename value)
            this.name = '';
            //  Rotated? (not yet implemented)
            this.rotated = false;
            //  Either cw or ccw, rotation is always 90 degrees
            this.rotationDirection = 'cw';
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.name = name;
            this.rotated = false;
            this.trimmed = false;
        }
        Frame.prototype.setRotation = function (rotated, rotationDirection) {
            //  Not yet supported
                    };
        Frame.prototype.setTrim = function (trimmed, actualWidth, actualHeight, destX, destY, destWidth, destHeight) {
            this.trimmed = trimmed;
            this.sourceSizeW = actualWidth;
            this.sourceSizeH = actualHeight;
            this.spriteSourceSizeX = destX;
            this.spriteSourceSizeY = destY;
            this.spriteSourceSizeW = destWidth;
            this.spriteSourceSizeH = destHeight;
        };
        return Frame;
    })();
    Phaser.Frame = Frame;    
})(Phaser || (Phaser = {}));
/// <reference path="../../Game.ts" />
/**
* Phaser - FrameData
*
* FrameData is a container for Frame objects, the internal representation of animation data in Phaser.
*/
var Phaser;
(function (Phaser) {
    var FrameData = (function () {
        function FrameData() {
            this._frames = [];
            this._frameNames = [];
        }
        Object.defineProperty(FrameData.prototype, "total", {
            get: function () {
                return this._frames.length;
            },
            enumerable: true,
            configurable: true
        });
        FrameData.prototype.addFrame = function (frame) {
            frame.index = this._frames.length;
            this._frames.push(frame);
            if(frame.name !== '') {
                this._frameNames[frame.name] = frame.index;
            }
            return frame;
        };
        FrameData.prototype.getFrame = function (index) {
            if(this._frames[index]) {
                return this._frames[index];
            }
            return null;
        };
        FrameData.prototype.getFrameByName = function (name) {
            if(this._frameNames[name] >= 0) {
                return this._frames[this._frameNames[name]];
            }
            return null;
        };
        FrameData.prototype.checkFrameName = function (name) {
            if(this._frameNames[name] >= 0) {
                return true;
            }
            return false;
        };
        FrameData.prototype.getFrameRange = function (start, end, output) {
            if (typeof output === "undefined") { output = []; }
            for(var i = start; i <= end; i++) {
                output.push(this._frames[i]);
            }
            return output;
        };
        FrameData.prototype.getFrameIndexes = function (output) {
            if (typeof output === "undefined") { output = []; }
            output.length = 0;
            for(var i = 0; i < this._frames.length; i++) {
                output.push(i);
            }
            return output;
        };
        FrameData.prototype.getFrameIndexesByName = function (input) {
            var output = [];
            for(var i = 0; i < input.length; i++) {
                if(this.getFrameByName(input[i])) {
                    output.push(this.getFrameByName(input[i]).index);
                }
            }
            return output;
        };
        FrameData.prototype.getAllFrames = function () {
            return this._frames;
        };
        FrameData.prototype.getFrames = function (range) {
            var output = [];
            for(var i = 0; i < range.length; i++) {
                output.push(this._frames[i]);
            }
            return output;
        };
        return FrameData;
    })();
    Phaser.FrameData = FrameData;    
})(Phaser || (Phaser = {}));
/// <reference path="Game.ts" />
/// <reference path="gameobjects/Sprite.ts" />
/// <reference path="system/animation/Animation.ts" />
/// <reference path="system/animation/AnimationLoader.ts" />
/// <reference path="system/animation/Frame.ts" />
/// <reference path="system/animation/FrameData.ts" />
/**
* Phaser - AnimationManager
*
* Any Sprite that has animation contains an instance of the AnimationManager, which is used to add, play and update
* sprite specific animations.
*/
var Phaser;
(function (Phaser) {
    var AnimationManager = (function () {
        function AnimationManager(game, parent) {
            this._frameData = null;
            this.currentFrame = null;
            this._game = game;
            this._parent = parent;
            this._anims = {
            };
        }
        AnimationManager.prototype.loadFrameData = function (frameData) {
            this._frameData = frameData;
            this.frame = 0;
        };
        AnimationManager.prototype.add = function (name, frames, frameRate, loop, useNumericIndex) {
            if (typeof frames === "undefined") { frames = null; }
            if (typeof frameRate === "undefined") { frameRate = 60; }
            if (typeof loop === "undefined") { loop = false; }
            if (typeof useNumericIndex === "undefined") { useNumericIndex = true; }
            if(this._frameData == null) {
                return;
            }
            if(frames == null) {
                frames = this._frameData.getFrameIndexes();
            } else {
                if(this.validateFrames(frames, useNumericIndex) == false) {
                    return;
                }
            }
            if(useNumericIndex == false) {
                frames = this._frameData.getFrameIndexesByName(frames);
            }
            this._anims[name] = new Phaser.Animation(this._game, this._parent, this._frameData, name, frames, frameRate, loop);
            this.currentAnim = this._anims[name];
        };
        AnimationManager.prototype.validateFrames = function (frames, useNumericIndex) {
            for(var i = 0; i < frames.length; i++) {
                if(useNumericIndex == true) {
                    if(frames[i] > this._frameData.total) {
                        return false;
                    }
                } else {
                    if(this._frameData.checkFrameName(frames[i]) == false) {
                        return false;
                    }
                }
            }
            return true;
        };
        AnimationManager.prototype.play = function (name, frameRate, loop) {
            if (typeof frameRate === "undefined") { frameRate = null; }
            if(this._anims[name]) {
                this.currentAnim = this._anims[name];
                this.currentAnim.play(frameRate, loop);
            }
        };
        AnimationManager.prototype.stop = function (name) {
            if(this._anims[name]) {
                this.currentAnim = this._anims[name];
                this.currentAnim.stop();
            }
        };
        AnimationManager.prototype.update = function () {
            if(this.currentAnim && this.currentAnim.update() == true) {
                this.currentFrame = this.currentAnim.currentFrame;
                this._parent.bounds.width = this.currentFrame.width;
                this._parent.bounds.height = this.currentFrame.height;
            }
        };
        Object.defineProperty(AnimationManager.prototype, "frameData", {
            get: function () {
                return this._frameData;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AnimationManager.prototype, "frameTotal", {
            get: function () {
                return this._frameData.total;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AnimationManager.prototype, "frame", {
            get: function () {
                return this._frameIndex;
            },
            set: function (value) {
                this.currentFrame = this._frameData.getFrame(value);
                if(this.currentFrame !== null) {
                    this._parent.bounds.width = this.currentFrame.width;
                    this._parent.bounds.height = this.currentFrame.height;
                    this._frameIndex = value;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AnimationManager.prototype, "frameName", {
            get: function () {
                return this.currentFrame.name;
            },
            set: function (value) {
                this.currentFrame = this._frameData.getFrameByName(value);
                if(this.currentFrame !== null) {
                    this._parent.bounds.width = this.currentFrame.width;
                    this._parent.bounds.height = this.currentFrame.height;
                    this._frameIndex = this.currentFrame.index;
                }
            },
            enumerable: true,
            configurable: true
        });
        return AnimationManager;
    })();
    Phaser.AnimationManager = AnimationManager;    
})(Phaser || (Phaser = {}));
/// <reference path="Game.ts" />
/**
* Phaser - Cache
*
* A game only has one instance of a Cache and it is used to store all externally loaded assets such
* as images, sounds and data files as a result of Loader calls. Cache items use string based keys for look-up.
*/
var Phaser;
(function (Phaser) {
    var Cache = (function () {
        function Cache(game) {
            this._game = game;
            this._canvases = {
            };
            this._images = {
            };
            this._sounds = {
            };
            this._text = {
            };
        }
        Cache.prototype.addCanvas = function (key, canvas, context) {
            this._canvases[key] = {
                canvas: canvas,
                context: context
            };
        };
        Cache.prototype.addSpriteSheet = function (key, url, data, frameWidth, frameHeight, frameMax) {
            this._images[key] = {
                url: url,
                data: data,
                spriteSheet: true,
                frameWidth: frameWidth,
                frameHeight: frameHeight
            };
            this._images[key].frameData = Phaser.AnimationLoader.parseSpriteSheet(this._game, key, frameWidth, frameHeight, frameMax);
        };
        Cache.prototype.addTextureAtlas = function (key, url, data, jsonData) {
            this._images[key] = {
                url: url,
                data: data,
                spriteSheet: true
            };
            this._images[key].frameData = Phaser.AnimationLoader.parseJSONData(this._game, jsonData);
        };
        Cache.prototype.addImage = function (key, url, data) {
            this._images[key] = {
                url: url,
                data: data,
                spriteSheet: false
            };
        };
        Cache.prototype.addSound = function (key, url, data) {
            this._sounds[key] = {
                url: url,
                data: data,
                decoded: false
            };
        };
        Cache.prototype.decodedSound = function (key, data) {
            this._sounds[key].data = data;
            this._sounds[key].decoded = true;
        };
        Cache.prototype.addText = function (key, url, data) {
            this._text[key] = {
                url: url,
                data: data
            };
        };
        Cache.prototype.getCanvas = function (key) {
            if(this._canvases[key]) {
                return this._canvases[key].canvas;
            }
            return null;
        };
        Cache.prototype.getImage = function (key) {
            if(this._images[key]) {
                return this._images[key].data;
            }
            return null;
        };
        Cache.prototype.getFrameData = function (key) {
            if(this._images[key] && this._images[key].spriteSheet == true) {
                return this._images[key].frameData;
            }
            return null;
        };
        Cache.prototype.getSound = function (key) {
            if(this._sounds[key]) {
                return this._sounds[key].data;
            }
            return null;
        };
        Cache.prototype.isSoundDecoded = function (key) {
            if(this._sounds[key]) {
                return this._sounds[key].decoded;
            }
        };
        Cache.prototype.isSpriteSheet = function (key) {
            if(this._images[key]) {
                return this._images[key].spriteSheet;
            }
        };
        Cache.prototype.getText = function (key) {
            if(this._text[key]) {
                return this._text[key].data;
            }
            return null;
        };
        Cache.prototype.destroy = function () {
            for(var item in this._canvases) {
                delete this._canvases[item['key']];
            }
            for(var item in this._images) {
                delete this._images[item['key']];
            }
            for(var item in this._sounds) {
                delete this._sounds[item['key']];
            }
            for(var item in this._text) {
                delete this._text[item['key']];
            }
        };
        return Cache;
    })();
    Phaser.Cache = Cache;    
})(Phaser || (Phaser = {}));
/// <reference path="../gameobjects/Sprite.ts" />
/// <reference path="../Game.ts" />
/**
* Phaser - Camera
*
* A Camera is your view into the game world. It has a position, size, scale and rotation and renders only those objects
* within its field of view. The game automatically creates a single Stage sized camera on boot, but it can be changed and
* additional cameras created via the CameraManager.
*/
var Phaser;
(function (Phaser) {
    var Camera = (function () {
        /**
        * Instantiates a new camera at the specified location, with the specified size and zoom level.
        *
        * @param X			X location of the camera's display in pixels. Uses native, 1:1 resolution, ignores zoom.
        * @param Y			Y location of the camera's display in pixels. Uses native, 1:1 resolution, ignores zoom.
        * @param Width		The width of the camera display in pixels.
        * @param Height	The height of the camera display in pixels.
        * @param Zoom		The initial zoom level of the camera.  A zoom level of 2 will make all pixels display at 2x resolution.
        */
        function Camera(game, id, x, y, width, height) {
            this._clip = false;
            this._rotation = 0;
            this._target = null;
            this._sx = 0;
            this._sy = 0;
            this._fxFlashComplete = null;
            this._fxFlashDuration = 0;
            this._fxFlashAlpha = 0;
            this._fxFadeComplete = null;
            this._fxFadeDuration = 0;
            this._fxFadeAlpha = 0;
            this._fxShakeIntensity = 0;
            this._fxShakeDuration = 0;
            this._fxShakeComplete = null;
            this._fxShakeOffset = new Phaser.Point(0, 0);
            this._fxShakeDirection = 0;
            this._fxShakePrevX = 0;
            this._fxShakePrevY = 0;
            this.scale = new Phaser.Point(1, 1);
            this.scroll = new Phaser.Point(0, 0);
            this.bounds = null;
            this.deadzone = null;
            //  Camera Border
            this.showBorder = false;
            this.borderColor = 'rgb(255,255,255)';
            //  Camera Background Color
            this.opaque = true;
            this._bgColor = 'rgb(0,0,0)';
            this._bgTextureRepeat = 'repeat';
            //  Camera Shadow
            this.showShadow = false;
            this.shadowColor = 'rgb(0,0,0)';
            this.shadowBlur = 10;
            this.shadowOffset = new Phaser.Point(4, 4);
            this.visible = true;
            this.alpha = 1;
            //  The x/y position of the current input event in world coordinates
            this.inputX = 0;
            this.inputY = 0;
            this._game = game;
            this.ID = id;
            this._stageX = x;
            this._stageY = y;
            //  The view into the world canvas we wish to render
            this.worldView = new Phaser.Rectangle(0, 0, width, height);
            this.checkClip();
        }
        Camera.STYLE_LOCKON = 0;
        Camera.STYLE_PLATFORMER = 1;
        Camera.STYLE_TOPDOWN = 2;
        Camera.STYLE_TOPDOWN_TIGHT = 3;
        Camera.SHAKE_BOTH_AXES = 0;
        Camera.SHAKE_HORIZONTAL_ONLY = 1;
        Camera.SHAKE_VERTICAL_ONLY = 2;
        Camera.prototype.flash = /**
        * The camera is filled with this color and returns to normal at the given duration.
        *
        * @param	Color		The color you want to use in 0xRRGGBB format, i.e. 0xffffff for white.
        * @param	Duration	How long it takes for the flash to fade.
        * @param	OnComplete	An optional function you want to run when the flash finishes. Set to null for no callback.
        * @param	Force		Force an already running flash effect to reset.
        */
        function (color, duration, onComplete, force) {
            if (typeof color === "undefined") { color = 0xffffff; }
            if (typeof duration === "undefined") { duration = 1; }
            if (typeof onComplete === "undefined") { onComplete = null; }
            if (typeof force === "undefined") { force = false; }
            if(force === false && this._fxFlashAlpha > 0) {
                //  You can't flash again unless you force it
                return;
            }
            if(duration <= 0) {
                duration = 1;
            }
            var red = color >> 16 & 0xFF;
            var green = color >> 8 & 0xFF;
            var blue = color & 0xFF;
            this._fxFlashColor = 'rgba(' + red + ',' + green + ',' + blue + ',';
            this._fxFlashDuration = duration;
            this._fxFlashAlpha = 1;
            this._fxFlashComplete = onComplete;
        };
        Camera.prototype.fade = /**
        * The camera is gradually filled with this color.
        *
        * @param	Color		The color you want to use in 0xRRGGBB format, i.e. 0xffffff for white.
        * @param	Duration	How long it takes for the flash to fade.
        * @param	OnComplete	An optional function you want to run when the flash finishes. Set to null for no callback.
        * @param	Force		Force an already running flash effect to reset.
        */
        function (color, duration, onComplete, force) {
            if (typeof color === "undefined") { color = 0x000000; }
            if (typeof duration === "undefined") { duration = 1; }
            if (typeof onComplete === "undefined") { onComplete = null; }
            if (typeof force === "undefined") { force = false; }
            if(force === false && this._fxFadeAlpha > 0) {
                //  You can't fade again unless you force it
                return;
            }
            if(duration <= 0) {
                duration = 1;
            }
            var red = color >> 16 & 0xFF;
            var green = color >> 8 & 0xFF;
            var blue = color & 0xFF;
            this._fxFadeColor = 'rgba(' + red + ',' + green + ',' + blue + ',';
            this._fxFadeDuration = duration;
            this._fxFadeAlpha = 0.01;
            this._fxFadeComplete = onComplete;
        };
        Camera.prototype.shake = /**
        * A simple screen-shake effect.
        *
        * @param	Intensity	Percentage of screen size representing the maximum distance that the screen can move while shaking.
        * @param	Duration	The length in seconds that the shaking effect should last.
        * @param	OnComplete	A function you want to run when the shake effect finishes.
        * @param	Force		Force the effect to reset (default = true, unlike flash() and fade()!).
        * @param	Direction	Whether to shake on both axes, just up and down, or just side to side (use class constants SHAKE_BOTH_AXES, SHAKE_VERTICAL_ONLY, or SHAKE_HORIZONTAL_ONLY).
        */
        function (intensity, duration, onComplete, force, direction) {
            if (typeof intensity === "undefined") { intensity = 0.05; }
            if (typeof duration === "undefined") { duration = 0.5; }
            if (typeof onComplete === "undefined") { onComplete = null; }
            if (typeof force === "undefined") { force = true; }
            if (typeof direction === "undefined") { direction = Camera.SHAKE_BOTH_AXES; }
            if(!force && ((this._fxShakeOffset.x != 0) || (this._fxShakeOffset.y != 0))) {
                return;
            }
            //  If a shake is not already running we need to store the offsets here
            if(this._fxShakeOffset.x == 0 && this._fxShakeOffset.y == 0) {
                this._fxShakePrevX = this._stageX;
                this._fxShakePrevY = this._stageY;
            }
            this._fxShakeIntensity = intensity;
            this._fxShakeDuration = duration;
            this._fxShakeComplete = onComplete;
            this._fxShakeDirection = direction;
            this._fxShakeOffset.setTo(0, 0);
        };
        Camera.prototype.stopFX = /**
        * Just turns off all the camera effects instantly.
        */
        function () {
            this._fxFlashAlpha = 0;
            this._fxFadeAlpha = 0;
            if(this._fxShakeDuration !== 0) {
                this._fxShakeDuration = 0;
                this._fxShakeOffset.setTo(0, 0);
                this._stageX = this._fxShakePrevX;
                this._stageY = this._fxShakePrevY;
            }
        };
        Camera.prototype.follow = function (target, style) {
            if (typeof style === "undefined") { style = Camera.STYLE_LOCKON; }
            this._target = target;
            var helper;
            switch(style) {
                case Camera.STYLE_PLATFORMER:
                    var w = this.width / 8;
                    var h = this.height / 3;
                    this.deadzone = new Phaser.Rectangle((this.width - w) / 2, (this.height - h) / 2 - h * 0.25, w, h);
                    break;
                case Camera.STYLE_TOPDOWN:
                    helper = Math.max(this.width, this.height) / 4;
                    this.deadzone = new Phaser.Rectangle((this.width - helper) / 2, (this.height - helper) / 2, helper, helper);
                    break;
                case Camera.STYLE_TOPDOWN_TIGHT:
                    helper = Math.max(this.width, this.height) / 8;
                    this.deadzone = new Phaser.Rectangle((this.width - helper) / 2, (this.height - helper) / 2, helper, helper);
                    break;
                case Camera.STYLE_LOCKON:
                default:
                    this.deadzone = null;
                    break;
            }
        };
        Camera.prototype.focusOnXY = function (x, y) {
            x += (x > 0) ? 0.0000001 : -0.0000001;
            y += (y > 0) ? 0.0000001 : -0.0000001;
            this.scroll.x = Math.round(x - this.worldView.halfWidth);
            this.scroll.y = Math.round(y - this.worldView.halfHeight);
        };
        Camera.prototype.focusOn = function (point) {
            point.x += (point.x > 0) ? 0.0000001 : -0.0000001;
            point.y += (point.y > 0) ? 0.0000001 : -0.0000001;
            this.scroll.x = Math.round(point.x - this.worldView.halfWidth);
            this.scroll.y = Math.round(point.y - this.worldView.halfHeight);
        };
        Camera.prototype.setBounds = /**
        * Specify the boundaries of the world or where the camera is allowed to move.
        *
        * @param	X				The smallest X value of your world (usually 0).
        * @param	Y				The smallest Y value of your world (usually 0).
        * @param	Width			The largest X value of your world (usually the world width).
        * @param	Height			The largest Y value of your world (usually the world height).
        * @param	UpdateWorld		Whether the global quad-tree's dimensions should be updated to match (default: false).
        */
        function (X, Y, Width, Height, UpdateWorld) {
            if (typeof X === "undefined") { X = 0; }
            if (typeof Y === "undefined") { Y = 0; }
            if (typeof Width === "undefined") { Width = 0; }
            if (typeof Height === "undefined") { Height = 0; }
            if (typeof UpdateWorld === "undefined") { UpdateWorld = false; }
            if(this.bounds == null) {
                this.bounds = new Phaser.Rectangle();
            }
            this.bounds.setTo(X, Y, Width, Height);
            //if(UpdateWorld)
            //	G.worldBounds.copyFrom(bounds);
            this.update();
        };
        Camera.prototype.update = function () {
            if(this._target !== null) {
                if(this.deadzone == null) {
                    this.focusOnXY(this._target.x + this._target.origin.x, this._target.y + this._target.origin.y);
                } else {
                    var edge;
                    var targetX = this._target.x + ((this._target.x > 0) ? 0.0000001 : -0.0000001);
                    var targetY = this._target.y + ((this._target.y > 0) ? 0.0000001 : -0.0000001);
                    edge = targetX - this.deadzone.x;
                    if(this.scroll.x > edge) {
                        this.scroll.x = edge;
                    }
                    edge = targetX + this._target.width - this.deadzone.x - this.deadzone.width;
                    if(this.scroll.x < edge) {
                        this.scroll.x = edge;
                    }
                    edge = targetY - this.deadzone.y;
                    if(this.scroll.y > edge) {
                        this.scroll.y = edge;
                    }
                    edge = targetY + this._target.height - this.deadzone.y - this.deadzone.height;
                    if(this.scroll.y < edge) {
                        this.scroll.y = edge;
                    }
                }
            }
            //  Make sure we didn't go outside the camera's bounds
            if(this.bounds !== null) {
                if(this.scroll.x < this.bounds.left) {
                    this.scroll.x = this.bounds.left;
                }
                if(this.scroll.x > this.bounds.right - this.width) {
                    this.scroll.x = this.bounds.right - this.width;
                }
                if(this.scroll.y < this.bounds.top) {
                    this.scroll.y = this.bounds.top;
                }
                if(this.scroll.y > this.bounds.bottom - this.height) {
                    this.scroll.y = this.bounds.bottom - this.height;
                }
            }
            this.worldView.x = this.scroll.x;
            this.worldView.y = this.scroll.y;
            //  Input values
            this.inputX = this.worldView.x + this._game.input.x;
            this.inputY = this.worldView.y + this._game.input.y;
            //  Update the Flash effect
            if(this._fxFlashAlpha > 0) {
                this._fxFlashAlpha -= this._game.time.elapsed / this._fxFlashDuration;
                this._fxFlashAlpha = this._game.math.roundTo(this._fxFlashAlpha, -2);
                if(this._fxFlashAlpha <= 0) {
                    this._fxFlashAlpha = 0;
                    if(this._fxFlashComplete !== null) {
                        this._fxFlashComplete();
                    }
                }
            }
            //  Update the Fade effect
            if(this._fxFadeAlpha > 0) {
                this._fxFadeAlpha += this._game.time.elapsed / this._fxFadeDuration;
                this._fxFadeAlpha = this._game.math.roundTo(this._fxFadeAlpha, -2);
                if(this._fxFadeAlpha >= 1) {
                    this._fxFadeAlpha = 1;
                    if(this._fxFadeComplete !== null) {
                        this._fxFadeComplete();
                    }
                }
            }
            //  Update the "shake" special effect
            if(this._fxShakeDuration > 0) {
                this._fxShakeDuration -= this._game.time.elapsed;
                this._fxShakeDuration = this._game.math.roundTo(this._fxShakeDuration, -2);
                if(this._fxShakeDuration <= 0) {
                    this._fxShakeDuration = 0;
                    this._fxShakeOffset.setTo(0, 0);
                    this._stageX = this._fxShakePrevX;
                    this._stageY = this._fxShakePrevY;
                    if(this._fxShakeComplete != null) {
                        this._fxShakeComplete();
                    }
                } else {
                    if((this._fxShakeDirection == Camera.SHAKE_BOTH_AXES) || (this._fxShakeDirection == Camera.SHAKE_HORIZONTAL_ONLY)) {
                        //this._fxShakeOffset.x = ((this._game.math.random() * this._fxShakeIntensity * this.worldView.width * 2 - this._fxShakeIntensity * this.worldView.width) * this._zoom;
                        this._fxShakeOffset.x = (this._game.math.random() * this._fxShakeIntensity * this.worldView.width * 2 - this._fxShakeIntensity * this.worldView.width);
                    }
                    if((this._fxShakeDirection == Camera.SHAKE_BOTH_AXES) || (this._fxShakeDirection == Camera.SHAKE_VERTICAL_ONLY)) {
                        //this._fxShakeOffset.y = (this._game.math.random() * this._fxShakeIntensity * this.worldView.height * 2 - this._fxShakeIntensity * this.worldView.height) * this._zoom;
                        this._fxShakeOffset.y = (this._game.math.random() * this._fxShakeIntensity * this.worldView.height * 2 - this._fxShakeIntensity * this.worldView.height);
                    }
                }
            }
        };
        Camera.prototype.render = function () {
            if(this.visible === false && this.alpha < 0.1) {
                return;
            }
            if((this._fxShakeOffset.x != 0) || (this._fxShakeOffset.y != 0)) {
                //this._stageX = this._fxShakePrevX + (this.worldView.halfWidth * this._zoom) + this._fxShakeOffset.x;
                //this._stageY = this._fxShakePrevY + (this.worldView.halfHeight * this._zoom) + this._fxShakeOffset.y;
                this._stageX = this._fxShakePrevX + (this.worldView.halfWidth) + this._fxShakeOffset.x;
                this._stageY = this._fxShakePrevY + (this.worldView.halfHeight) + this._fxShakeOffset.y;
                //console.log('shake', this._fxShakeDuration, this._fxShakeIntensity, this._fxShakeOffset.x, this._fxShakeOffset.y);
                            }
            //if (this._rotation !== 0 || this._clip || this.scale.x !== 1 || this.scale.y !== 1)
            //{
            //this._game.stage.context.save();
            //}
            //  It may be safe/quicker to just save the context every frame regardless
            this._game.stage.context.save();
            if(this.alpha !== 1) {
                this._game.stage.context.globalAlpha = this.alpha;
            }
            this._sx = this._stageX;
            this._sy = this._stageY;
            //  Shadow
            if(this.showShadow) {
                this._game.stage.context.shadowColor = this.shadowColor;
                this._game.stage.context.shadowBlur = this.shadowBlur;
                this._game.stage.context.shadowOffsetX = this.shadowOffset.x;
                this._game.stage.context.shadowOffsetY = this.shadowOffset.y;
            }
            //  Scale on
            if(this.scale.x !== 1 || this.scale.y !== 1) {
                this._game.stage.context.scale(this.scale.x, this.scale.y);
                this._sx = this._sx / this.scale.x;
                this._sy = this._sy / this.scale.y;
            }
            //  Rotation - translate to the mid-point of the camera
            if(this._rotation !== 0) {
                this._game.stage.context.translate(this._sx + this.worldView.halfWidth, this._sy + this.worldView.halfHeight);
                this._game.stage.context.rotate(this._rotation * (Math.PI / 180));
                // now shift back to where that should actually render
                this._game.stage.context.translate(-(this._sx + this.worldView.halfWidth), -(this._sy + this.worldView.halfHeight));
            }
            //  Background
            if(this.opaque == true) {
                if(this._bgTexture) {
                    this._game.stage.context.fillStyle = this._bgTexture;
                    this._game.stage.context.fillRect(this._sx, this._sy, this.worldView.width, this.worldView.height);
                } else {
                    this._game.stage.context.fillStyle = this._bgColor;
                    this._game.stage.context.fillRect(this._sx, this._sy, this.worldView.width, this.worldView.height);
                }
            }
            //  Shadow off
            if(this.showShadow) {
                this._game.stage.context.shadowBlur = 0;
                this._game.stage.context.shadowOffsetX = 0;
                this._game.stage.context.shadowOffsetY = 0;
            }
            //  Clip the camera so we don't get sprites appearing outside the edges
            if(this._clip) {
                this._game.stage.context.beginPath();
                this._game.stage.context.rect(this._sx, this._sy, this.worldView.width, this.worldView.height);
                this._game.stage.context.closePath();
                this._game.stage.context.clip();
            }
            //this.totalSpritesRendered = this._game.world.renderSpritesInCamera(this.worldView, sx, sy);
            //this._game.world.group.render(this.worldView, this.worldView.x, this.worldView.y, sx, sy);
            this._game.world.group.render(this, this._sx, this._sy);
            if(this.showBorder) {
                this._game.stage.context.strokeStyle = this.borderColor;
                this._game.stage.context.lineWidth = 1;
                this._game.stage.context.rect(this._sx, this._sy, this.worldView.width, this.worldView.height);
                this._game.stage.context.stroke();
            }
            //  "Flash" FX
            if(this._fxFlashAlpha > 0) {
                this._game.stage.context.fillStyle = this._fxFlashColor + this._fxFlashAlpha + ')';
                this._game.stage.context.fillRect(this._sx, this._sy, this.worldView.width, this.worldView.height);
            }
            //  "Fade" FX
            if(this._fxFadeAlpha > 0) {
                this._game.stage.context.fillStyle = this._fxFadeColor + this._fxFadeAlpha + ')';
                this._game.stage.context.fillRect(this._sx, this._sy, this.worldView.width, this.worldView.height);
            }
            //  Scale off
            if(this.scale.x !== 1 || this.scale.y !== 1) {
                this._game.stage.context.scale(1, 1);
            }
            if(this._rotation !== 0 || this._clip) {
                this._game.stage.context.translate(0, 0);
                //this._game.stage.context.restore();
                            }
            //  maybe just do this every frame regardless?
            this._game.stage.context.restore();
            if(this.alpha !== 1) {
                this._game.stage.context.globalAlpha = 1;
            }
        };
        Object.defineProperty(Camera.prototype, "backgroundColor", {
            get: function () {
                return this._bgColor;
            },
            set: function (color) {
                this._bgColor = color;
            },
            enumerable: true,
            configurable: true
        });
        Camera.prototype.setTexture = function (key, repeat) {
            if (typeof repeat === "undefined") { repeat = 'repeat'; }
            this._bgTexture = this._game.stage.context.createPattern(this._game.cache.getImage(key), repeat);
            this._bgTextureRepeat = repeat;
        };
        Camera.prototype.setPosition = function (x, y) {
            this._stageX = x;
            this._stageY = y;
            this.checkClip();
        };
        Camera.prototype.setSize = function (width, height) {
            this.worldView.width = width;
            this.worldView.height = height;
            this.checkClip();
        };
        Camera.prototype.renderDebugInfo = function (x, y, color) {
            if (typeof color === "undefined") { color = 'rgb(255,255,255)'; }
            this._game.stage.context.fillStyle = color;
            this._game.stage.context.fillText('Camera ID: ' + this.ID + ' (' + this.worldView.width + ' x ' + this.worldView.height + ')', x, y);
            this._game.stage.context.fillText('X: ' + this._stageX + ' Y: ' + this._stageY + ' Rotation: ' + this._rotation, x, y + 14);
            this._game.stage.context.fillText('World X: ' + this.scroll.x.toFixed(1) + ' World Y: ' + this.scroll.y.toFixed(1), x, y + 28);
            if(this.bounds) {
                this._game.stage.context.fillText('Bounds: ' + this.bounds.width + ' x ' + this.bounds.height, x, y + 56);
            }
        };
        Object.defineProperty(Camera.prototype, "x", {
            get: function () {
                return this._stageX;
            },
            set: function (value) {
                this._stageX = value;
                this.checkClip();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Camera.prototype, "y", {
            get: function () {
                return this._stageY;
            },
            set: function (value) {
                this._stageY = value;
                this.checkClip();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Camera.prototype, "width", {
            get: function () {
                return this.worldView.width;
            },
            set: function (value) {
                this.worldView.width = value;
                this.checkClip();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Camera.prototype, "height", {
            get: function () {
                return this.worldView.height;
            },
            set: function (value) {
                this.worldView.height = value;
                this.checkClip();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Camera.prototype, "rotation", {
            get: function () {
                return this._rotation;
            },
            set: function (value) {
                this._rotation = this._game.math.wrap(value, 360, 0);
            },
            enumerable: true,
            configurable: true
        });
        Camera.prototype.checkClip = function () {
            if(this._stageX !== 0 || this._stageY !== 0 || this.worldView.width < this._game.stage.width || this.worldView.height < this._game.stage.height) {
                this._clip = true;
            } else {
                this._clip = false;
            }
        };
        return Camera;
    })();
    Phaser.Camera = Camera;    
})(Phaser || (Phaser = {}));
/// <reference path="Game.ts" />
/// <reference path="system/Camera.ts" />
/**
* Phaser - CameraManager
*
* Your game only has one CameraManager instance and it's responsible for looking after, creating and destroying
* all of the cameras in the world.
*
* TODO: If the Camera is larger than the Stage size then the rotation offset isn't correct
* TODO: Texture Repeat doesn't scroll, because it's part of the camera not the world, need to think about this more
*/
var Phaser;
(function (Phaser) {
    var CameraManager = (function () {
        function CameraManager(game, x, y, width, height) {
            this._game = game;
            this._cameras = [];
            this.current = this.addCamera(x, y, width, height);
        }
        CameraManager.prototype.getAll = function () {
            return this._cameras;
        };
        CameraManager.prototype.update = function () {
            this._cameras.forEach(function (camera) {
                return camera.update();
            });
        };
        CameraManager.prototype.render = function () {
            this._cameras.forEach(function (camera) {
                return camera.render();
            });
        };
        CameraManager.prototype.addCamera = function (x, y, width, height) {
            var newCam = new Phaser.Camera(this._game, this._cameras.length, x, y, width, height);
            this._cameras.push(newCam);
            return newCam;
        };
        CameraManager.prototype.removeCamera = function (id) {
            if(this._cameras[id]) {
                if(this.current === this._cameras[id]) {
                    this.current = null;
                }
                this._cameras.splice(id, 1);
                return true;
            } else {
                return false;
            }
        };
        CameraManager.prototype.destroy = function () {
            this._cameras.length = 0;
            this.current = this.addCamera(0, 0, this._game.stage.width, this._game.stage.height);
        };
        return CameraManager;
    })();
    Phaser.CameraManager = CameraManager;    
})(Phaser || (Phaser = {}));
/// <reference path="../Game.ts" />
/**
* Phaser - Point
*
* The Point object represents a location in a two-dimensional coordinate system, where x represents the horizontal axis and y represents the vertical axis.
*/
var Phaser;
(function (Phaser) {
    var Point = (function () {
        /**
        * Creates a new point. If you pass no parameters to this method, a point is created at (0,0).
        * @class Point
        * @constructor
        * @param {Number} x The horizontal position of this point (default 0)
        * @param {Number} y The vertical position of this point (default 0)
        **/
        function Point(x, y) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            this.setTo(x, y);
        }
        Point.prototype.add = /**
        * Adds the coordinates of another point to the coordinates of this point to create a new point.
        * @method add
        * @param {Point} point - The point to be added.
        * @return {Point} The new Point object.
        **/
        function (toAdd, output) {
            if (typeof output === "undefined") { output = new Point(); }
            return output.setTo(this.x + toAdd.x, this.y + toAdd.y);
        };
        Point.prototype.addTo = /**
        * Adds the given values to the coordinates of this point and returns it
        * @method addTo
        * @param {Number} x - The amount to add to the x value of the point
        * @param {Number} y - The amount to add to the x value of the point
        * @return {Point} This Point object.
        **/
        function (x, y) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            return this.setTo(this.x + x, this.y + y);
        };
        Point.prototype.subtractFrom = /**
        * Adds the given values to the coordinates of this point and returns it
        * @method addTo
        * @param {Number} x - The amount to add to the x value of the point
        * @param {Number} y - The amount to add to the x value of the point
        * @return {Point} This Point object.
        **/
        function (x, y) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            return this.setTo(this.x - x, this.y - y);
        };
        Point.prototype.invert = /**
        * Inverts the x and y values of this point
        * @method invert
        * @return {Point} This Point object.
        **/
        function () {
            return this.setTo(this.y, this.x);
        };
        Point.prototype.clamp = /**
        * Clamps this Point object to be between the given min and max
        * @method clamp
        * @param {number} The minimum value to clamp this Point to
        * @param {number} The maximum value to clamp this Point to
        * @return {Point} This Point object.
        **/
        function (min, max) {
            this.clampX(min, max);
            this.clampY(min, max);
            return this;
        };
        Point.prototype.clampX = /**
        * Clamps the x value of this Point object to be between the given min and max
        * @method clampX
        * @param {number} The minimum value to clamp this Point to
        * @param {number} The maximum value to clamp this Point to
        * @return {Point} This Point object.
        **/
        function (min, max) {
            this.x = Math.max(Math.min(this.x, max), min);
            return this;
        };
        Point.prototype.clampY = /**
        * Clamps the y value of this Point object to be between the given min and max
        * @method clampY
        * @param {number} The minimum value to clamp this Point to
        * @param {number} The maximum value to clamp this Point to
        * @return {Point} This Point object.
        **/
        function (min, max) {
            this.x = Math.max(Math.min(this.x, max), min);
            this.y = Math.max(Math.min(this.y, max), min);
            return this;
        };
        Point.prototype.clone = /**
        * Creates a copy of this Point.
        * @method clone
        * @param {Point} output Optional Point object. If given the values will be set into this object, otherwise a brand new Point object will be created and returned.
        * @return {Point} The new Point object.
        **/
        function (output) {
            if (typeof output === "undefined") { output = new Point(); }
            return output.setTo(this.x, this.y);
        };
        Point.prototype.copyFrom = /**
        * Copies the point data from the source Point object into this Point object.
        * @method copyFrom
        * @param {Point} source - The point to copy from.
        * @return {Point} This Point object. Useful for chaining method calls.
        **/
        function (source) {
            return this.setTo(source.x, source.y);
        };
        Point.prototype.copyTo = /**
        * Copies the point data from this Point object to the given target Point object.
        * @method copyTo
        * @param {Point} target - The point to copy to.
        * @return {Point} The target Point object.
        **/
        function (target) {
            return target.setTo(this.x, this.y);
        };
        Point.prototype.distanceTo = /**
        * Returns the distance from this Point object to the given Point object.
        * @method distanceFrom
        * @param {Point} target - The destination Point object.
        * @param {Boolean} round - Round the distance to the nearest integer (default false)
        * @return {Number} The distance between this Point object and the destination Point object.
        **/
        function (target, round) {
            if (typeof round === "undefined") { round = false; }
            var dx = this.x - target.x;
            var dy = this.y - target.y;
            if(round === true) {
                return Math.round(Math.sqrt(dx * dx + dy * dy));
            } else {
                return Math.sqrt(dx * dx + dy * dy);
            }
        };
        Point.distanceBetween = /**
        * Returns the distance between the two Point objects.
        * @method distanceBetween
        * @param {Point} pointA - The first Point object.
        * @param {Point} pointB - The second Point object.
        * @param {Boolean} round - Round the distance to the nearest integer (default false)
        * @return {Number} The distance between the two Point objects.
        **/
        function distanceBetween(pointA, pointB, round) {
            if (typeof round === "undefined") { round = false; }
            var dx = pointA.x - pointB.x;
            var dy = pointA.y - pointB.y;
            if(round === true) {
                return Math.round(Math.sqrt(dx * dx + dy * dy));
            } else {
                return Math.sqrt(dx * dx + dy * dy);
            }
        };
        Point.prototype.distanceCompare = /**
        * Returns true if the distance between this point and a target point is greater than or equal a specified distance.
        * This avoids using a costly square root operation
        * @method distanceCompare
        * @param {Point} target - The Point object to use for comparison.
        * @param {Number} distance - The distance to use for comparison.
        * @return {Boolena} True if distance is >= specified distance.
        **/
        function (target, distance) {
            if(this.distanceTo(target) >= distance) {
                return true;
            } else {
                return false;
            }
        };
        Point.prototype.equals = /**
        * Determines whether this Point object and the given point object are equal. They are equal if they have the same x and y values.
        * @method equals
        * @param {Point} point - The point to compare against.
        * @return {Boolean} A value of true if the object is equal to this Point object; false if it is not equal.
        **/
        function (toCompare) {
            if(this.x === toCompare.x && this.y === toCompare.y) {
                return true;
            } else {
                return false;
            }
        };
        Point.prototype.interpolate = /**
        * Determines a point between two specified points. The parameter f determines where the new interpolated point is located relative to the two end points specified by parameters pt1 and pt2.
        * The closer the value of the parameter f is to 1.0, the closer the interpolated point is to the first point (parameter pt1). The closer the value of the parameter f is to 0, the closer the interpolated point is to the second point (parameter pt2).
        * @method interpolate
        * @param {Point} pointA - The first Point object.
        * @param {Point} pointB - The second Point object.
        * @param {Number} f - The level of interpolation between the two points. Indicates where the new point will be, along the line between pt1 and pt2. If f=1, pt1 is returned; if f=0, pt2 is returned.
        * @return {Point} The new interpolated Point object.
        **/
        function (pointA, pointB, f) {
        };
        Point.prototype.offset = /**
        * Offsets the Point object by the specified amount. The value of dx is added to the original value of x to create the new x value.
        * The value of dy is added to the original value of y to create the new y value.
        * @method offset
        * @param {Number} dx - The amount by which to offset the horizontal coordinate, x.
        * @param {Number} dy - The amount by which to offset the vertical coordinate, y.
        * @return {Point} This Point object. Useful for chaining method calls.
        **/
        function (dx, dy) {
            this.x += dx;
            this.y += dy;
            return this;
        };
        Point.prototype.polar = /**
        * Converts a pair of polar coordinates to a Cartesian point coordinate.
        * @method polar
        * @param {Number} length - The length coordinate of the polar pair.
        * @param {Number} angle - The angle, in radians, of the polar pair.
        * @return {Point} The new Cartesian Point object.
        **/
        function (length, angle) {
        };
        Point.prototype.setTo = /**
        * Sets the x and y values of this Point object to the given coordinates.
        * @method setTo
        * @param {Number} x - The horizontal position of this point.
        * @param {Number} y - The vertical position of this point.
        * @return {Point} This Point object. Useful for chaining method calls.
        **/
        function (x, y) {
            this.x = x;
            this.y = y;
            return this;
        };
        Point.prototype.subtract = /**
        * Subtracts the coordinates of another point from the coordinates of this point to create a new point.
        * @method subtract
        * @param {Point} point - The point to be subtracted.
        * @param {Point} output Optional Point object. If given the values will be set into this object, otherwise a brand new Point object will be created and returned.
        * @return {Point} The new Point object.
        **/
        function (point, output) {
            if (typeof output === "undefined") { output = new Point(); }
            return output.setTo(this.x - point.x, this.y - point.y);
        };
        Point.prototype.toString = /**
        * Returns a string representation of this object.
        * @method toString
        * @return {string} a string representation of the instance.
        **/
        function () {
            return '[{Point (x=' + this.x + ' y=' + this.y + ')}]';
        };
        return Point;
    })();
    Phaser.Point = Point;    
})(Phaser || (Phaser = {}));
/// <reference path="../Game.ts" />
/// <reference path="MicroPoint.ts" />
/**
* Phaser - Rectangle
*
* A Rectangle object is an area defined by its position, as indicated by its top-left corner (x,y) and width and height.
*/
var Phaser;
(function (Phaser) {
    var Rectangle = (function () {
        /**
        * Creates a new Rectangle object with the top-left corner specified by the x and y parameters and with the specified width and height parameters. If you call this function without parameters, a rectangle with x, y, width, and height properties set to 0 is created.
        * @class Rectangle
        * @constructor
        * @param {Number} x The x coordinate of the top-left corner of the rectangle.
        * @param {Number} y The y coordinate of the top-left corner of the rectangle.
        * @param {Number} width The width of the rectangle in pixels.
        * @param {Number} height The height of the rectangle in pixels.
        * @return {Rectangle} This rectangle object
        **/
        function Rectangle(x, y, width, height) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            if (typeof width === "undefined") { width = 0; }
            if (typeof height === "undefined") { height = 0; }
            this._tempX = null;
            this._tempY = null;
            this._tempWidth = null;
            this._tempHeight = null;
            /**
            * The width of the rectangle
            * @property width
            * @type Number
            **/
            this._width = 0;
            /**
            * The height of the rectangle
            * @property height
            * @type Number
            **/
            this._height = 0;
            /**
            * Half of the width of the rectangle
            * @property halfWidth
            * @type Number
            **/
            this._halfWidth = 0;
            /**
            * Half of the height of the rectangle
            * @property halfHeight
            * @type Number
            **/
            this._halfHeight = 0;
            /**
            * The size of the longest side (width or height)
            * @property length
            * @type Number
            **/
            this.length = 0;
            this._width = width;
            if(width > 0) {
                this._halfWidth = Math.round(width / 2);
            }
            this._height = height;
            if(height > 0) {
                this._halfHeight = Math.round(height / 2);
            }
            this.length = Math.max(this._width, this._height);
            this.topLeft = new Phaser.MicroPoint(x, y, this);
            this.topCenter = new Phaser.MicroPoint(x + this._halfWidth, y, this);
            this.topRight = new Phaser.MicroPoint(x + this._width - 1, y, this);
            this.leftCenter = new Phaser.MicroPoint(x, y + this._halfHeight, this);
            this.center = new Phaser.MicroPoint(x + this._halfWidth, y + this._halfHeight, this);
            this.rightCenter = new Phaser.MicroPoint(x + this._width - 1, y + this._halfHeight, this);
            this.bottomLeft = new Phaser.MicroPoint(x, y + this._height - 1, this);
            this.bottomCenter = new Phaser.MicroPoint(x + this._halfWidth, y + this._height - 1, this);
            this.bottomRight = new Phaser.MicroPoint(x + this._width - 1, y + this._height - 1, this);
        }
        Object.defineProperty(Rectangle.prototype, "x", {
            get: /**
            * The x coordinate of the top-left corner of the rectangle
            * @property x
            * @type Number
            **/
            function () {
                return this.topLeft.x;
            },
            set: /**
            * The x coordinate of the top-left corner of the rectangle
            * @property x
            * @type Number
            **/
            function (value) {
                this.topLeft.x = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rectangle.prototype, "y", {
            get: /**
            * The y coordinate of the top-left corner of the rectangle
            * @property y
            * @type Number
            **/
            function () {
                return this.topLeft.y;
            },
            set: /**
            * The y coordinate of the top-left corner of the rectangle
            * @property y
            * @type Number
            **/
            function (value) {
                this.topLeft.y = value;
            },
            enumerable: true,
            configurable: true
        });
        Rectangle.prototype.updateBounds = /**
        * Updates all of the MicroPoints based on the values of width and height.
        * You should not normally call this directly.
        **/
        function () {
            if(this._tempWidth !== null) {
                this._width = this._tempWidth;
                this._halfWidth = 0;
                if(this._width > 0) {
                    this._halfWidth = Math.round(this._width / 2);
                }
            }
            if(this._tempHeight !== null) {
                this._height = this._tempHeight;
                this._halfHeight = 0;
                if(this._height > 0) {
                    this._halfHeight = Math.round(this._height / 2);
                }
            }
            this.length = Math.max(this._width, this._height);
            if(this._tempX !== null && this._tempY !== null) {
                this.topLeft.setTo(this._tempX, this._tempY, false);
            } else if(this._tempX !== null && this._tempY == null) {
                this.topLeft.setTo(this._tempX, this.topLeft.y, false);
            } else if(this._tempX == null && this._tempY !== null) {
                this.topLeft.setTo(this.topLeft.x, this._tempY, false);
            } else {
                this.topLeft.setTo(this.x, this.y, false);
            }
            this.topCenter.setTo(this.x + this._halfWidth, this.y, false);
            this.topRight.setTo(this.x + this._width - 1, this.y, false);
            this.leftCenter.setTo(this.x, this.y + this._halfHeight, false);
            this.center.setTo(this.x + this._halfWidth, this.y + this._halfHeight, false);
            this.rightCenter.setTo(this.x + this._width - 1, this.y + this._halfHeight, false);
            this.bottomLeft.setTo(this.x, this.y + this._height - 1, false);
            this.bottomCenter.setTo(this.x + this._halfWidth, this.y + this._height - 1, false);
            this.bottomRight.setTo(this.x + this._width - 1, this.y + this._height - 1, false);
            this._tempX = null;
            this._tempY = null;
            this._tempWidth = null;
            this._tempHeight = null;
        };
        Object.defineProperty(Rectangle.prototype, "width", {
            get: /**
            * The width of the rectangle
            * @property width
            * @type Number
            **/
            function () {
                return this._width;
            },
            set: /**
            * The width of the rectangle
            * @property width
            * @type Number
            **/
            function (value) {
                this._width = value;
                this._halfWidth = Math.round(value / 2);
                this.updateBounds();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rectangle.prototype, "height", {
            get: /**
            * The height of the rectangle
            * @property height
            * @type Number
            **/
            function () {
                return this._height;
            },
            set: /**
            * The height of the rectangle
            * @property height
            * @type Number
            **/
            function (value) {
                this._height = value;
                this._halfHeight = Math.round(value / 2);
                this.updateBounds();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rectangle.prototype, "halfWidth", {
            get: /**
            * Half of the width of the rectangle
            * @property halfWidth
            * @type Number
            **/
            function () {
                return this._halfWidth;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rectangle.prototype, "halfHeight", {
            get: /**
            * Half of the height of the rectangle
            * @property halfHeight
            * @type Number
            **/
            function () {
                return this._halfHeight;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rectangle.prototype, "bottom", {
            get: /**
            * The sum of the y and height properties.
            * Changing the bottom property of a Rectangle object has no effect on the x, y and width properties, but does change the height property.
            * @method bottom
            * @return {Number}
            **/
            function () {
                return this.bottomCenter.y;
            },
            set: /**
            * The sum of the y and height properties.
            * Changing the bottom property of a Rectangle object has no effect on the x, y and width properties, but does change the height property.
            * @method bottom
            * @param {Number} value
            **/
            function (value) {
                if(value < this.y) {
                    this._tempHeight = 0;
                } else {
                    this._tempHeight = this.y + value;
                }
                this.updateBounds();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rectangle.prototype, "left", {
            get: /**
            * The x coordinate of the top-left corner of the rectangle.
            * Changing the left property of a Rectangle object has no effect on the y and height properties.
            * However it does affect the width property, whereas changing the x value does not affect the width property.
            * @method left
            * @ return {number}
            **/
            function () {
                return this.x;
            },
            set: /**
            * The x coordinate of the top-left corner of the rectangle.
            * Changing the left property of a Rectangle object has no effect on the y and height properties.
            * However it does affect the width property, whereas changing the x value does not affect the width property.
            * @method left
            * @param {Number} value
            **/
            function (value) {
                var diff = this.x - value;
                if(this._width + diff < 0) {
                    this._tempWidth = 0;
                    this._tempX = value;
                } else {
                    this._tempWidth = this._width + diff;
                    this._tempX = value;
                }
                this.updateBounds();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rectangle.prototype, "right", {
            get: /**
            * The sum of the x and width properties.
            * Changing the right property of a Rectangle object has no effect on the x, y and height properties.
            * However it does affect the width property.
            * @method right
            * @return {Number}
            **/
            function () {
                return this.rightCenter.x;
            },
            set: /**
            * The sum of the x and width properties.
            * Changing the right property of a Rectangle object has no effect on the x, y and height properties.
            * However it does affect the width property.
            * @method right
            * @param {Number} value
            **/
            function (value) {
                if(value < this.topLeft.x) {
                    this._tempWidth = 0;
                } else {
                    this._tempWidth = (value - this.topLeft.x);
                }
                this.updateBounds();
            },
            enumerable: true,
            configurable: true
        });
        Rectangle.prototype.size = /**
        * The size of the Rectangle object, expressed as a Point object with the values of the width and height properties.
        * @method size
        * @param {Point} output Optional Point object. If given the values will be set into the object, otherwise a brand new Point object will be created and returned.
        * @return {Point} The size of the Rectangle object
        **/
        function (output) {
            if (typeof output === "undefined") { output = new Phaser.Point(); }
            return output.setTo(this._width, this._height);
        };
        Object.defineProperty(Rectangle.prototype, "volume", {
            get: /**
            * The volume of the Rectangle object in pixels, derived from width * height
            * @method volume
            * @return {Number}
            **/
            function () {
                return this._width * this._height;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rectangle.prototype, "perimeter", {
            get: /**
            * The perimeter size of the Rectangle object in pixels. This is the sum of all 4 sides.
            * @method perimeter
            * @return {Number}
            **/
            function () {
                return (this._width * 2) + (this._height * 2);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rectangle.prototype, "top", {
            get: /**
            * The y coordinate of the top-left corner of the rectangle.
            * Changing the top property of a Rectangle object has no effect on the x and width properties.
            * However it does affect the height property, whereas changing the y value does not affect the height property.
            * @method top
            * @return {Number}
            **/
            function () {
                return this.topCenter.y;
            },
            set: /**
            * The y coordinate of the top-left corner of the rectangle.
            * Changing the top property of a Rectangle object has no effect on the x and width properties.
            * However it does affect the height property, whereas changing the y value does not affect the height property.
            * @method top
            * @param {Number} value
            **/
            function (value) {
                var diff = this.topCenter.y - value;
                if(this._height + diff < 0) {
                    this._tempHeight = 0;
                    this._tempY = value;
                } else {
                    this._tempHeight = this._height + diff;
                    this._tempY = value;
                }
                this.updateBounds();
            },
            enumerable: true,
            configurable: true
        });
        Rectangle.prototype.clone = /**
        * Returns a new Rectangle object with the same values for the x, y, width, and height properties as the original Rectangle object.
        * @method clone
        * @param {Rectangle} output Optional Rectangle object. If given the values will be set into the object, otherwise a brand new Rectangle object will be created and returned.
        * @return {Rectangle}
        **/
        function (output) {
            if (typeof output === "undefined") { output = new Rectangle(); }
            return output.setTo(this.x, this.y, this.width, this.height);
        };
        Rectangle.prototype.contains = /**
        * Determines whether the specified coordinates are contained within the region defined by this Rectangle object.
        * @method contains
        * @param {Number} x The x coordinate of the point to test.
        * @param {Number} y The y coordinate of the point to test.
        * @return {Boolean} A value of true if the Rectangle object contains the specified point; otherwise false.
        **/
        function (x, y) {
            if(x >= this.topLeft.x && x <= this.topRight.x && y >= this.topLeft.y && y <= this.bottomRight.y) {
                return true;
            }
            return false;
        };
        Rectangle.prototype.containsPoint = /**
        * Determines whether the specified point is contained within the rectangular region defined by this Rectangle object.
        * This method is similar to the Rectangle.contains() method, except that it takes a Point object as a parameter.
        * @method containsPoint
        * @param {Point} point The point object being checked. Can be Point or any object with .x and .y values.
        * @return {Boolean} A value of true if the Rectangle object contains the specified point; otherwise false.
        **/
        function (point) {
            return this.contains(point.x, point.y);
        };
        Rectangle.prototype.containsRect = /**
        * Determines whether the Rectangle object specified by the rect parameter is contained within this Rectangle object.
        * A Rectangle object is said to contain another if the second Rectangle object falls entirely within the boundaries of the first.
        * @method containsRect
        * @param {Rectangle} rect The rectangle object being checked.
        * @return {Boolean} A value of true if the Rectangle object contains the specified point; otherwise false.
        **/
        function (rect) {
            //	If the given rect has a larger volume than this one then it can never contain it
            if(rect.volume > this.volume) {
                return false;
            }
            if(rect.x >= this.topLeft.x && rect.y >= this.topLeft.y && rect.rightCenter.x <= this.rightCenter.x && rect.bottomCenter.y <= this.bottomCenter.y) {
                return true;
            }
            return false;
        };
        Rectangle.prototype.copyFrom = /**
        * Copies all of rectangle data from the source Rectangle object into the calling Rectangle object.
        * @method copyFrom
        * @param {Rectangle} rect The source rectangle object to copy from
        * @return {Rectangle} This rectangle object
        **/
        function (source) {
            return this.setTo(source.x, source.y, source.width, source.height);
        };
        Rectangle.prototype.copyTo = /**
        * Copies all the rectangle data from this Rectangle object into the destination Rectangle object.
        * @method copyTo
        * @param {Rectangle} rect The destination rectangle object to copy in to
        * @return {Rectangle} The destination rectangle object
        **/
        function (target) {
            return target.copyFrom(this);
        };
        Rectangle.prototype.equals = /**
        * Determines whether the object specified in the toCompare parameter is equal to this Rectangle object.
        * This method compares the x, y, width, and height properties of an object against the same properties of this Rectangle object.
        * @method equals
        * @param {Rectangle} toCompare The rectangle to compare to this Rectangle object.
        * @return {Boolean} A value of true if the object has exactly the same values for the x, y, width, and height properties as this Rectangle object; otherwise false.
        **/
        function (toCompare) {
            if(this.topLeft.equals(toCompare.topLeft) && this.bottomRight.equals(toCompare.bottomRight)) {
                return true;
            }
            return false;
        };
        Rectangle.prototype.inflate = /**
        * Increases the size of the Rectangle object by the specified amounts.
        * The center point of the Rectangle object stays the same, and its size increases to the left and right by the dx value,
        * and to the top and the bottom by the dy value.
        * @method inflate
        * @param {Number} dx The amount to be added to the left side of this Rectangle.
        * @param {Number} dy The amount to be added to the bottom side of this Rectangle.
        * @return {Rectangle} This Rectangle object.
        **/
        function (dx, dy) {
            this._tempX = this.topLeft.x - dx;
            this._tempWidth = this._width + (2 * dx);
            this._tempY = this.topLeft.y - dy;
            this._tempHeight = this._height + (2 * dy);
            this.updateBounds();
            return this;
        };
        Rectangle.prototype.inflatePoint = /**
        * Increases the size of the Rectangle object.
        * This method is similar to the Rectangle.inflate() method except it takes a Point object as a parameter.
        * @method inflatePoint
        * @param {Point} point The x property of this Point object is used to increase the horizontal dimension of the Rectangle object. The y property is used to increase the vertical dimension of the Rectangle object.
        * @return {Rectangle} This Rectangle object.
        **/
        function (point) {
            return this.inflate(point.x, point.y);
        };
        Rectangle.prototype.intersection = /**
        * If the Rectangle object specified in the toIntersect parameter intersects with this Rectangle object,
        * returns the area of intersection as a Rectangle object. If the rectangles do not intersect, this method
        * returns an empty Rectangle object with its properties set to 0.
        * @method intersection
        * @param {Rectangle} toIntersect The Rectangle object to compare against to see if it intersects with this Rectangle object.
        * @param {Rectangle} output Optional Rectangle object. If given the intersection values will be set into this object, otherwise a brand new Rectangle object will be created and returned.
        * @return {Rectangle} A Rectangle object that equals the area of intersection. If the rectangles do not intersect, this method returns an empty Rectangle object; that is, a rectangle with its x, y, width, and height properties set to 0.
        **/
        function (toIntersect, output) {
            if (typeof output === "undefined") { output = new Rectangle(); }
            if(this.intersects(toIntersect) === true) {
                output.x = Math.max(toIntersect.topLeft.x, this.topLeft.x);
                output.y = Math.max(toIntersect.topLeft.y, this.topLeft.y);
                output.width = Math.min(toIntersect.rightCenter.x, this.rightCenter.x) - output.x;
                output.height = Math.min(toIntersect.bottomCenter.y, this.bottomCenter.y) - output.y;
            }
            return output;
        };
        Rectangle.prototype.intersects = /**
        * Determines whether the object specified intersects (overlaps) with this Rectangle object.
        * This method checks the x, y, width, and height properties of the specified Rectangle object to see if it intersects with this Rectangle object.
        * @method intersects
        * @param {Rectangle} r2 The Rectangle object to compare against to see if it intersects with this Rectangle object.
        * @param {Number} t A tolerance value to allow for an intersection test with padding, default to 0
        * @return {Boolean} A value of true if the specified object intersects with this Rectangle object; otherwise false.
        **/
        function (r2, t) {
            if (typeof t === "undefined") { t = 0; }
            return !(r2.left > this.right + t || r2.right < this.left - t || r2.top > this.bottom + t || r2.bottom < this.top - t);
        };
        Object.defineProperty(Rectangle.prototype, "isEmpty", {
            get: /**
            * Determines whether or not this Rectangle object is empty.
            * @method isEmpty
            * @return {Boolean} A value of true if the Rectangle object's width or height is less than or equal to 0; otherwise false.
            **/
            function () {
                if(this.width < 1 || this.height < 1) {
                    return true;
                }
                return false;
            },
            enumerable: true,
            configurable: true
        });
        Rectangle.prototype.offset = /**
        * Adjusts the location of the Rectangle object, as determined by its top-left corner, by the specified amounts.
        * @method offset
        * @param {Number} dx Moves the x value of the Rectangle object by this amount.
        * @param {Number} dy Moves the y value of the Rectangle object by this amount.
        * @return {Rectangle} This Rectangle object.
        **/
        function (dx, dy) {
            if(!isNaN(dx) && !isNaN(dy)) {
                this.x += dx;
                this.y += dy;
            }
            return this;
        };
        Rectangle.prototype.offsetPoint = /**
        * Adjusts the location of the Rectangle object using a Point object as a parameter. This method is similar to the Rectangle.offset() method, except that it takes a Point object as a parameter.
        * @method offsetPoint
        * @param {Point} point A Point object to use to offset this Rectangle object.
        * @return {Rectangle} This Rectangle object.
        **/
        function (point) {
            return this.offset(point.x, point.y);
        };
        Rectangle.prototype.setEmpty = /**
        * Sets all of the Rectangle object's properties to 0. A Rectangle object is empty if its width or height is less than or equal to 0.
        * @method setEmpty
        * @return {Rectangle} This rectangle object
        **/
        function () {
            return this.setTo(0, 0, 0, 0);
        };
        Rectangle.prototype.setTo = /**
        * Sets the members of Rectangle to the specified values.
        * @method setTo
        * @param {Number} x The x coordinate of the top-left corner of the rectangle.
        * @param {Number} y The y coordinate of the top-left corner of the rectangle.
        * @param {Number} width The width of the rectangle in pixels.
        * @param {Number} height The height of the rectangle in pixels.
        * @return {Rectangle} This rectangle object
        **/
        function (x, y, width, height) {
            this._tempX = x;
            this._tempY = y;
            this._tempWidth = width;
            this._tempHeight = height;
            this.updateBounds();
            return this;
        };
        Rectangle.prototype.union = /**
        * Adds two rectangles together to create a new Rectangle object, by filling in the horizontal and vertical space between the two rectangles.
        * @method union
        * @param {Rectangle} toUnion A Rectangle object to add to this Rectangle object.
        * @param {Rectangle} output Optional Rectangle object. If given the new values will be set into this object, otherwise a brand new Rectangle object will be created and returned.
        * @return {Rectangle} A Rectangle object that is the union of the two rectangles.
        **/
        function (toUnion, output) {
            if (typeof output === "undefined") { output = new Rectangle(); }
            return output.setTo(Math.min(toUnion.x, this.x), Math.min(toUnion.y, this.y), Math.max(toUnion.right, this.right), Math.max(toUnion.bottom, this.bottom));
        };
        Rectangle.prototype.toString = /**
        * Returns a string representation of this object.
        * @method toString
        * @return {string} a string representation of the instance.
        **/
        function () {
            return "[{Rectangle (x=" + this.x + " y=" + this.y + " width=" + this.width + " height=" + this.height + " empty=" + this.isEmpty + ")}]";
        };
        return Rectangle;
    })();
    Phaser.Rectangle = Rectangle;    
})(Phaser || (Phaser = {}));
/// <reference path="../Game.ts" />
/**
* Phaser - Circle
*
* A Circle object is an area defined by its position, as indicated by its center point (x,y) and diameter.
*/
var Phaser;
(function (Phaser) {
    var Circle = (function () {
        /**
        * Creates a new Circle object with the center coordinate specified by the x and y parameters and the diameter specified by the diameter parameter. If you call this function without parameters, a circle with x, y, diameter and radius properties set to 0 is created.
        * @class Circle
        * @constructor
        * @param {Number} x The x coordinate of the center of the circle.
        * @param {Number} y The y coordinate of the center of the circle.
        * @return {Circle} This circle object
        **/
        function Circle(x, y, diameter) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            if (typeof diameter === "undefined") { diameter = 0; }
            this._diameter = 0;
            this._radius = 0;
            /**
            * The x coordinate of the center of the circle
            * @property x
            * @type Number
            **/
            this.x = 0;
            /**
            * The y coordinate of the center of the circle
            * @property y
            * @type Number
            **/
            this.y = 0;
            this.setTo(x, y, diameter);
        }
        Object.defineProperty(Circle.prototype, "diameter", {
            get: /**
            * The diameter of the circle. The largest distance between any two points on the circle. The same as the radius * 2.
            * @method diameter
            * @return {Number}
            **/
            function () {
                return this._diameter;
            },
            set: /**
            * The diameter of the circle. The largest distance between any two points on the circle. The same as the radius * 2.
            * @method diameter
            * @param {Number} The diameter of the circle.
            **/
            function (value) {
                if(value > 0) {
                    this._diameter = value;
                    this._radius = value * 0.5;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Circle.prototype, "radius", {
            get: /**
            * The radius of the circle. The length of a line extending from the center of the circle to any point on the circle itself. The same as half the diameter.
            * @method radius
            * @return {Number}
            **/
            function () {
                return this._radius;
            },
            set: /**
            * The radius of the circle. The length of a line extending from the center of the circle to any point on the circle itself. The same as half the diameter.
            * @method radius
            * @param {Number} The radius of the circle.
            **/
            function (value) {
                if(value > 0) {
                    this._radius = value;
                    this._diameter = value * 2;
                }
            },
            enumerable: true,
            configurable: true
        });
        Circle.prototype.circumference = /**
        * The circumference of the circle.
        * @method circumference
        * @return {Number}
        **/
        function () {
            return 2 * (Math.PI * this._radius);
        };
        Object.defineProperty(Circle.prototype, "bottom", {
            get: /**
            * The sum of the y and radius properties. Changing the bottom property of a Circle object has no effect on the x and y properties, but does change the diameter.
            * @method bottom
            * @return {Number}
            **/
            function () {
                return this.y + this._radius;
            },
            set: /**
            * The sum of the y and radius properties. Changing the bottom property of a Circle object has no effect on the x and y properties, but does change the diameter.
            * @method bottom
            * @param {Number} The value to adjust the height of the circle by.
            **/
            function (value) {
                if(!isNaN(value)) {
                    if(value < this.y) {
                        this._radius = 0;
                        this._diameter = 0;
                    } else {
                        this.radius = value - this.y;
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Circle.prototype, "left", {
            get: /**
            * The x coordinate of the leftmost point of the circle. Changing the left property of a Circle object has no effect on the x and y properties. However it does affect the diameter, whereas changing the x value does not affect the diameter property.
            * @method left
            * @return {Number} The x coordinate of the leftmost point of the circle.
            **/
            function () {
                return this.x - this._radius;
            },
            set: /**
            * The x coordinate of the leftmost point of the circle. Changing the left property of a Circle object has no effect on the x and y properties. However it does affect the diameter, whereas changing the x value does not affect the diameter property.
            * @method left
            * @param {Number} The value to adjust the position of the leftmost point of the circle by.
            **/
            function (value) {
                if(!isNaN(value)) {
                    if(value < this.x) {
                        this.radius = this.x - value;
                    } else {
                        this._radius = 0;
                        this._diameter = 0;
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Circle.prototype, "right", {
            get: /**
            * The x coordinate of the rightmost point of the circle. Changing the right property of a Circle object has no effect on the x and y properties. However it does affect the diameter, whereas changing the x value does not affect the diameter property.
            * @method right
            * @return {Number}
            **/
            function () {
                return this.x + this._radius;
            },
            set: /**
            * The x coordinate of the rightmost point of the circle. Changing the right property of a Circle object has no effect on the x and y properties. However it does affect the diameter, whereas changing the x value does not affect the diameter property.
            * @method right
            * @param {Number} The amount to adjust the diameter of the circle by.
            **/
            function (value) {
                if(!isNaN(value)) {
                    if(value > this.x) {
                        this.radius = value - this.x;
                    } else {
                        this._radius = 0;
                        this._diameter = 0;
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Circle.prototype, "top", {
            get: /**
            * The sum of the y minus the radius property. Changing the top property of a Circle object has no effect on the x and y properties, but does change the diameter.
            * @method bottom
            * @return {Number}
            **/
            function () {
                return this.y - this._radius;
            },
            set: /**
            * The sum of the y minus the radius property. Changing the top property of a Circle object has no effect on the x and y properties, but does change the diameter.
            * @method bottom
            * @param {Number} The amount to adjust the height of the circle by.
            **/
            function (value) {
                if(!isNaN(value)) {
                    if(value > this.y) {
                        this._radius = 0;
                        this._diameter = 0;
                    } else {
                        this.radius = this.y - value;
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Circle.prototype, "area", {
            get: /**
            * Gets the area of this Circle.
            * @method area
            * @return {Number} This area of this circle.
            **/
            function () {
                if(this._radius > 0) {
                    return Math.PI * this._radius * this._radius;
                } else {
                    return 0;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Circle.prototype, "isEmpty", {
            get: /**
            * Determines whether or not this Circle object is empty.
            * @method isEmpty
            * @return {Boolean} A value of true if the Circle objects diameter is less than or equal to 0; otherwise false.
            **/
            function () {
                if(this._diameter < 1) {
                    return true;
                }
                return false;
            },
            enumerable: true,
            configurable: true
        });
        Circle.prototype.intersectCircleLine = /**
        * Whether the circle intersects with a line. Checks against infinite line defined by the two points on the line, not the line segment.
        * If you need details about the intersection then use Collision.lineToCircle instead.
        * @method intersectCircleLine
        * @param {Object} the line object to check.
        * @return {Boolean}
        **/
        function (line) {
            return Phaser.Collision.lineToCircle(line, this).result;
        };
        Circle.prototype.clone = /**
        * Returns a new Circle object with the same values for the x, y, width, and height properties as the original Circle object.
        * @method clone
        * @param {Circle} output Optional Circle object. If given the values will be set into the object, otherwise a brand new Circle object will be created and returned.
        * @return {Phaser.Circle}
        **/
        function (output) {
            if (typeof output === "undefined") { output = new Circle(); }
            return output.setTo(this.x, this.y, this._diameter);
        };
        Circle.prototype.contains = /**
        * Return true if the given x/y coordinates are within this Circle object.
        * If you need details about the intersection then use Phaser.Intersect.circleContainsPoint instead.
        * @method contains
        * @param {Number} The X value of the coordinate to test.
        * @param {Number} The Y value of the coordinate to test.
        * @return {Boolean} True if the coordinates are within this circle, otherwise false.
        **/
        function (x, y) {
            return Phaser.Collision.circleContainsPoint(this, {
                x: x,
                y: y
            }).result;
        };
        Circle.prototype.containsPoint = /**
        * Return true if the coordinates of the given Point object are within this Circle object.
        * If you need details about the intersection then use Phaser.Intersect.circleContainsPoint instead.
        * @method containsPoint
        * @param {Phaser.Point} The Point object to test.
        * @return {Boolean} True if the coordinates are within this circle, otherwise false.
        **/
        function (point) {
            return Phaser.Collision.circleContainsPoint(this, point).result;
        };
        Circle.prototype.containsCircle = /**
        * Return true if the given Circle is contained entirely within this Circle object.
        * If you need details about the intersection then use Phaser.Intersect.circleToCircle instead.
        * @method containsCircle
        * @param {Phaser.Circle} The Circle object to test.
        * @return {Boolean} True if the coordinates are within this circle, otherwise false.
        **/
        function (circle) {
            return Phaser.Collision.circleToCircle(this, circle).result;
        };
        Circle.prototype.copyFrom = /**
        * Copies all of circle data from the source Circle object into the calling Circle object.
        * @method copyFrom
        * @param {Circle} rect The source circle object to copy from
        * @return {Circle} This circle object
        **/
        function (source) {
            return this.setTo(source.x, source.y, source.diameter);
        };
        Circle.prototype.copyTo = /**
        * Copies all of circle data from this Circle object into the destination Circle object.
        * @method copyTo
        * @param {Circle} circle The destination circle object to copy in to
        * @return {Circle} The destination circle object
        **/
        function (target) {
            return target.copyFrom(this);
        };
        Circle.prototype.distanceTo = /**
        * Returns the distance from the center of this Circle object to the given object (can be Circle, Point or anything with x/y values)
        * @method distanceFrom
        * @param {Circle/Point} target - The destination Point object.
        * @param {Boolean} round - Round the distance to the nearest integer (default false)
        * @return {Number} The distance between this Point object and the destination Point object.
        **/
        function (target, round) {
            if (typeof round === "undefined") { round = false; }
            var dx = this.x - target.x;
            var dy = this.y - target.y;
            if(round === true) {
                return Math.round(Math.sqrt(dx * dx + dy * dy));
            } else {
                return Math.sqrt(dx * dx + dy * dy);
            }
        };
        Circle.prototype.equals = /**
        * Determines whether the object specified in the toCompare parameter is equal to this Circle object. This method compares the x, y and diameter properties of an object against the same properties of this Circle object.
        * @method equals
        * @param {Circle} toCompare The circle to compare to this Circle object.
        * @return {Boolean} A value of true if the object has exactly the same values for the x, y and diameter properties as this Circle object; otherwise false.
        **/
        function (toCompare) {
            if(this.x === toCompare.x && this.y === toCompare.y && this.diameter === toCompare.diameter) {
                return true;
            }
            return false;
        };
        Circle.prototype.intersects = /**
        * Determines whether the Circle object specified in the toIntersect parameter intersects with this Circle object. This method checks the radius distances between the two Circle objects to see if they intersect.
        * @method intersects
        * @param {Circle} toIntersect The Circle object to compare against to see if it intersects with this Circle object.
        * @return {Boolean} A value of true if the specified object intersects with this Circle object; otherwise false.
        **/
        function (toIntersect) {
            if(this.distanceTo(toIntersect, false) < (this._radius + toIntersect._radius)) {
                return true;
            }
            return false;
        };
        Circle.prototype.circumferencePoint = /**
        * Returns a Point object containing the coordinates of a point on the circumference of this Circle based on the given angle.
        * @method circumferencePoint
        * @param {Number} The angle in radians (unless asDegrees is true) to return the point from.
        * @param {Boolean} Is the given angle in radians (false) or degrees (true)?
        * @param {Phaser.Point} An optional Point object to put the result in to. If none specified a new Point object will be created.
        * @return {Phaser.Point} The Point object holding the result.
        **/
        function (angle, asDegrees, output) {
            if (typeof asDegrees === "undefined") { asDegrees = false; }
            if (typeof output === "undefined") { output = new Phaser.Point(); }
            if(asDegrees === true) {
                angle = angle * Phaser.GameMath.DEG_TO_RAD;
            }
            output.x = this.x + this._radius * Math.cos(angle);
            output.y = this.y + this._radius * Math.sin(angle);
            return output;
        };
        Circle.prototype.offset = /**
        * Adjusts the location of the Circle object, as determined by its center coordinate, by the specified amounts.
        * @method offset
        * @param {Number} dx Moves the x value of the Circle object by this amount.
        * @param {Number} dy Moves the y value of the Circle object by this amount.
        * @return {Circle} This Circle object.
        **/
        function (dx, dy) {
            if(!isNaN(dx) && !isNaN(dy)) {
                this.x += dx;
                this.y += dy;
            }
            return this;
        };
        Circle.prototype.offsetPoint = /**
        * Adjusts the location of the Circle object using a Point object as a parameter. This method is similar to the Circle.offset() method, except that it takes a Point object as a parameter.
        * @method offsetPoint
        * @param {Point} point A Point object to use to offset this Circle object.
        * @return {Circle} This Circle object.
        **/
        function (point) {
            return this.offset(point.x, point.y);
        };
        Circle.prototype.setTo = /**
        * Sets the members of Circle to the specified values.
        * @method setTo
        * @param {Number} x The x coordinate of the center of the circle.
        * @param {Number} y The y coordinate of the center of the circle.
        * @param {Number} diameter The diameter of the circle in pixels.
        * @return {Circle} This circle object
        **/
        function (x, y, diameter) {
            this.x = x;
            this.y = y;
            this._diameter = diameter;
            this._radius = diameter * 0.5;
            return this;
        };
        Circle.prototype.toString = /**
        * Returns a string representation of this object.
        * @method toString
        * @return {string} a string representation of the instance.
        **/
        function () {
            return "[{Circle (x=" + this.x + " y=" + this.y + " diameter=" + this.diameter + " radius=" + this.radius + ")}]";
        };
        return Circle;
    })();
    Phaser.Circle = Circle;    
})(Phaser || (Phaser = {}));
/// <reference path="../Game.ts" />
/**
* Phaser - Line
*
* A Line object is an infinte line through space. The two sets of x/y coordinates define the Line Segment.
*/
var Phaser;
(function (Phaser) {
    var Line = (function () {
        /**
        *
        * @constructor
        * @param {Number} x1
        * @param {Number} y1
        * @param {Number} x2
        * @param {Number} y2
        * @return {Phaser.Line} This Object
        */
        function Line(x1, y1, x2, y2) {
            if (typeof x1 === "undefined") { x1 = 0; }
            if (typeof y1 === "undefined") { y1 = 0; }
            if (typeof x2 === "undefined") { x2 = 0; }
            if (typeof y2 === "undefined") { y2 = 0; }
            /**
            *
            * @property x1
            * @type Number
            */
            this.x1 = 0;
            /**
            *
            * @property y1
            * @type Number
            */
            this.y1 = 0;
            /**
            *
            * @property x2
            * @type Number
            */
            this.x2 = 0;
            /**
            *
            * @property y2
            * @type Number
            */
            this.y2 = 0;
            this.setTo(x1, y1, x2, y2);
        }
        Line.prototype.clone = /**
        *
        * @method clone
        * @param {Phaser.Line} [output]
        * @return {Phaser.Line}
        */
        function (output) {
            if (typeof output === "undefined") { output = new Line(); }
            return output.setTo(this.x1, this.y1, this.x2, this.y2);
        };
        Line.prototype.copyFrom = /**
        *
        * @method copyFrom
        * @param {Phaser.Line} source
        * @return {Phaser.Line}
        */
        function (source) {
            return this.setTo(source.x1, source.y1, source.x2, source.y2);
        };
        Line.prototype.copyTo = /**
        *
        * @method copyTo
        * @param {Phaser.Line} target
        * @return {Phaser.Line}
        */
        function (target) {
            return target.copyFrom(this);
        };
        Line.prototype.setTo = /**
        *
        * @method setTo
        * @param {Number} x1
        * @param {Number} y1
        * @param {Number} x2
        * @param {Number} y2
        * @return {Phaser.Line}
        */
        function (x1, y1, x2, y2) {
            if (typeof x1 === "undefined") { x1 = 0; }
            if (typeof y1 === "undefined") { y1 = 0; }
            if (typeof x2 === "undefined") { x2 = 0; }
            if (typeof y2 === "undefined") { y2 = 0; }
            this.x1 = x1;
            this.y1 = y1;
            this.x2 = x2;
            this.y2 = y2;
            return this;
        };
        Object.defineProperty(Line.prototype, "width", {
            get: function () {
                return Math.max(this.x1, this.x2) - Math.min(this.x1, this.x2);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Line.prototype, "height", {
            get: function () {
                return Math.max(this.y1, this.y2) - Math.min(this.y1, this.y2);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Line.prototype, "length", {
            get: /**
            *
            * @method length
            * @return {Number}
            */
            function () {
                return Math.sqrt((this.x2 - this.x1) * (this.x2 - this.x1) + (this.y2 - this.y1) * (this.y2 - this.y1));
            },
            enumerable: true,
            configurable: true
        });
        Line.prototype.getY = /**
        *
        * @method getY
        * @param {Number} x
        * @return {Number}
        */
        function (x) {
            return this.slope * x + this.yIntercept;
        };
        Object.defineProperty(Line.prototype, "angle", {
            get: /**
            *
            * @method angle
            * @return {Number}
            */
            function () {
                return Math.atan2(this.x2 - this.x1, this.y2 - this.y1);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Line.prototype, "slope", {
            get: /**
            *
            * @method slope
            * @return {Number}
            */
            function () {
                return (this.y2 - this.y1) / (this.x2 - this.x1);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Line.prototype, "perpSlope", {
            get: /**
            *
            * @method perpSlope
            * @return {Number}
            */
            function () {
                return -((this.x2 - this.x1) / (this.y2 - this.y1));
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Line.prototype, "yIntercept", {
            get: /**
            *
            * @method yIntercept
            * @return {Number}
            */
            function () {
                return (this.y1 - this.slope * this.x1);
            },
            enumerable: true,
            configurable: true
        });
        Line.prototype.isPointOnLine = /**
        *
        * @method isPointOnLine
        * @param {Number} x
        * @param {Number} y
        * @return {Boolean}
        */
        function (x, y) {
            if((x - this.x1) * (this.y2 - this.y1) === (this.x2 - this.x1) * (y - this.y1)) {
                return true;
            } else {
                return false;
            }
        };
        Line.prototype.isPointOnLineSegment = /**
        *
        * @method isPointOnLineSegment
        * @param {Number} x
        * @param {Number} y
        * @return {Boolean}
        */
        function (x, y) {
            var xMin = Math.min(this.x1, this.x2);
            var xMax = Math.max(this.x1, this.x2);
            var yMin = Math.min(this.y1, this.y2);
            var yMax = Math.max(this.y1, this.y2);
            if(this.isPointOnLine(x, y) && (x >= xMin && x <= xMax) && (y >= yMin && y <= yMax)) {
                return true;
            } else {
                return false;
            }
        };
        Line.prototype.intersectLineLine = /**
        *
        * @method intersectLineLine
        * @param {Any} line
        * @return {Any}
        */
        function (line) {
            //return Phaser.intersectLineLine(this,line);
                    };
        Line.prototype.perp = /**
        *
        * @method perp
        * @param {Number} x
        * @param {Number} y
        * @param {Phaser.Line} [output]
        * @return {Phaser.Line}
        */
        function (x, y, output) {
            if(this.y1 === this.y2) {
                if(output) {
                    output.setTo(x, y, x, this.y1);
                } else {
                    return new Line(x, y, x, this.y1);
                }
            }
            var yInt = (y - this.perpSlope * x);
            var pt = this.intersectLineLine({
                x1: x,
                y1: y,
                x2: 0,
                y2: yInt
            });
            if(output) {
                output.setTo(x, y, pt.x, pt.y);
            } else {
                return new Line(x, y, pt.x, pt.y);
            }
        };
        Line.prototype.toString = /*
        intersectLineCircle (circle:Circle)
        {
        var perp = this.perp()
        return Phaser.intersectLineCircle(this,circle);
        
        }
        */
        /**
        *
        * @method toString
        * @return {String}
        */
        function () {
            return "[{Line (x1=" + this.x1 + " y1=" + this.y1 + " x2=" + this.x2 + " y2=" + this.y2 + ")}]";
        };
        return Line;
    })();
    Phaser.Line = Line;    
})(Phaser || (Phaser = {}));
/// <reference path="../Game.ts" />
/**
* Phaser - IntersectResult
*
* A light-weight result object to hold the results of an intersection. For when you need more than just true/false.
*/
var Phaser;
(function (Phaser) {
    var IntersectResult = (function () {
        function IntersectResult() {
            /**
            * Did they intersect or not?
            * @property result
            * @type Boolean
            */
            this.result = false;
        }
        IntersectResult.prototype.setTo = /**
        *
        * @method setTo
        * @param {Number} x1
        * @param {Number} y1
        * @param {Number} [x2]
        * @param {Number} [y2]
        * @param {Number} [width]
        * @param {Number} [height]
        */
        function (x1, y1, x2, y2, width, height) {
            if (typeof x2 === "undefined") { x2 = 0; }
            if (typeof y2 === "undefined") { y2 = 0; }
            if (typeof width === "undefined") { width = 0; }
            if (typeof height === "undefined") { height = 0; }
            this.x = x1;
            this.y = y1;
            this.x1 = x1;
            this.y1 = y1;
            this.x2 = x2;
            this.y2 = y2;
            this.width = width;
            this.height = height;
        };
        return IntersectResult;
    })();
    Phaser.IntersectResult = IntersectResult;    
})(Phaser || (Phaser = {}));
/// <reference path="../Game.ts" />
/**
* Phaser - LinkedList
*
* A miniature linked list class. Useful for optimizing time-critical or highly repetitive tasks!
*/
var Phaser;
(function (Phaser) {
    var LinkedList = (function () {
        /**
        * Creates a new link, and sets <code>object</code> and <code>next</code> to <code>null</code>.
        */
        function LinkedList() {
            this.object = null;
            this.next = null;
        }
        LinkedList.prototype.destroy = /**
        * Clean up memory.
        */
        function () {
            this.object = null;
            if(this.next != null) {
                this.next.destroy();
            }
            this.next = null;
        };
        return LinkedList;
    })();
    Phaser.LinkedList = LinkedList;    
})(Phaser || (Phaser = {}));
/// <reference path="../Game.ts" />
/// <reference path="LinkedList.ts" />
/**
* Phaser - QuadTree
*
* A fairly generic quad tree structure for rapid overlap checks. QuadTree is also configured for single or dual list operation.
* You can add items either to its A list or its B list. When you do an overlap check, you can compare the A list to itself,
* or the A list against the B list.  Handy for different things!
*/
var Phaser;
(function (Phaser) {
    var QuadTree = (function (_super) {
        __extends(QuadTree, _super);
        /**
        * Instantiate a new Quad Tree node.
        *
        * @param	X			The X-coordinate of the point in space.
        * @param	Y			The Y-coordinate of the point in space.
        * @param	Width		Desired width of this node.
        * @param	Height		Desired height of this node.
        * @param	Parent		The parent branch or node.  Pass null to create a root.
        */
        function QuadTree(X, Y, Width, Height, Parent) {
            if (typeof Parent === "undefined") { Parent = null; }
                _super.call(this, X, Y, Width, Height);
            //console.log('-------- QuadTree',X,Y,Width,Height);
            this._headA = this._tailA = new Phaser.LinkedList();
            this._headB = this._tailB = new Phaser.LinkedList();
            //Copy the parent's children (if there are any)
            if(Parent != null) {
                //console.log('Parent not null');
                var iterator;
                var ot;
                if(Parent._headA.object != null) {
                    iterator = Parent._headA;
                    //console.log('iterator set to parent headA');
                    while(iterator != null) {
                        if(this._tailA.object != null) {
                            ot = this._tailA;
                            this._tailA = new Phaser.LinkedList();
                            ot.next = this._tailA;
                        }
                        this._tailA.object = iterator.object;
                        iterator = iterator.next;
                    }
                }
                if(Parent._headB.object != null) {
                    iterator = Parent._headB;
                    //console.log('iterator set to parent headB');
                    while(iterator != null) {
                        if(this._tailB.object != null) {
                            ot = this._tailB;
                            this._tailB = new Phaser.LinkedList();
                            ot.next = this._tailB;
                        }
                        this._tailB.object = iterator.object;
                        iterator = iterator.next;
                    }
                }
            } else {
                QuadTree._min = (this.width + this.height) / (2 * QuadTree.divisions);
            }
            this._canSubdivide = (this.width > QuadTree._min) || (this.height > QuadTree._min);
            //console.log('canSubdivided', this._canSubdivide);
            //Set up comparison/sort helpers
            this._northWestTree = null;
            this._northEastTree = null;
            this._southEastTree = null;
            this._southWestTree = null;
            this._leftEdge = this.x;
            this._rightEdge = this.x + this.width;
            this._halfWidth = this.width / 2;
            this._midpointX = this._leftEdge + this._halfWidth;
            this._topEdge = this.y;
            this._bottomEdge = this.y + this.height;
            this._halfHeight = this.height / 2;
            this._midpointY = this._topEdge + this._halfHeight;
        }
        QuadTree.A_LIST = 0;
        QuadTree.B_LIST = 1;
        QuadTree.prototype.destroy = /**
        * Clean up memory.
        */
        function () {
            this._tailA.destroy();
            this._tailB.destroy();
            this._headA.destroy();
            this._headB.destroy();
            this._tailA = null;
            this._tailB = null;
            this._headA = null;
            this._headB = null;
            if(this._northWestTree != null) {
                this._northWestTree.destroy();
            }
            if(this._northEastTree != null) {
                this._northEastTree.destroy();
            }
            if(this._southEastTree != null) {
                this._southEastTree.destroy();
            }
            if(this._southWestTree != null) {
                this._southWestTree.destroy();
            }
            this._northWestTree = null;
            this._northEastTree = null;
            this._southEastTree = null;
            this._southWestTree = null;
            QuadTree._object = null;
            QuadTree._processingCallback = null;
            QuadTree._notifyCallback = null;
        };
        QuadTree.prototype.load = /**
        * Load objects and/or groups into the quad tree, and register notify and processing callbacks.
        *
        * @param ObjectOrGroup1	Any object that is or extends GameObject or Group.
        * @param ObjectOrGroup2	Any object that is or extends GameObject or Group.  If null, the first parameter will be checked against itself.
        * @param NotifyCallback	A function with the form <code>myFunction(Object1:GameObject,Object2:GameObject)</code> that is called whenever two objects are found to overlap in world space, and either no ProcessCallback is specified, or the ProcessCallback returns true.
        * @param ProcessCallback	A function with the form <code>myFunction(Object1:GameObject,Object2:GameObject):bool</code> that is called whenever two objects are found to overlap in world space.  The NotifyCallback is only called if this function returns true.  See GameObject.separate().
        */
        function (ObjectOrGroup1, ObjectOrGroup2, NotifyCallback, ProcessCallback) {
            if (typeof ObjectOrGroup2 === "undefined") { ObjectOrGroup2 = null; }
            if (typeof NotifyCallback === "undefined") { NotifyCallback = null; }
            if (typeof ProcessCallback === "undefined") { ProcessCallback = null; }
            //console.log('quadtree load', QuadTree.divisions, ObjectOrGroup1, ObjectOrGroup2);
            this.add(ObjectOrGroup1, QuadTree.A_LIST);
            if(ObjectOrGroup2 != null) {
                this.add(ObjectOrGroup2, QuadTree.B_LIST);
                QuadTree._useBothLists = true;
            } else {
                QuadTree._useBothLists = false;
            }
            QuadTree._notifyCallback = NotifyCallback;
            QuadTree._processingCallback = ProcessCallback;
            //console.log('use both', QuadTree._useBothLists);
            //console.log('------------ end of load');
                    };
        QuadTree.prototype.add = /**
        * Call this function to add an object to the root of the tree.
        * This function will recursively add all group members, but
        * not the groups themselves.
        *
        * @param	ObjectOrGroup	GameObjects are just added, Groups are recursed and their applicable members added accordingly.
        * @param	List			A <code>uint</code> flag indicating the list to which you want to add the objects.  Options are <code>QuadTree.A_LIST</code> and <code>QuadTree.B_LIST</code>.
        */
        function (ObjectOrGroup, List) {
            QuadTree._list = List;
            if(ObjectOrGroup.isGroup == true) {
                var i = 0;
                var basic;
                var members = ObjectOrGroup['members'];
                var l = ObjectOrGroup['length'];
                while(i < l) {
                    basic = members[i++];
                    if((basic != null) && basic.exists) {
                        if(basic.isGroup) {
                            this.add(basic, List);
                        } else {
                            QuadTree._object = basic;
                            if(QuadTree._object.exists && QuadTree._object.allowCollisions) {
                                QuadTree._objectLeftEdge = QuadTree._object.x;
                                QuadTree._objectTopEdge = QuadTree._object.y;
                                QuadTree._objectRightEdge = QuadTree._object.x + QuadTree._object.width;
                                QuadTree._objectBottomEdge = QuadTree._object.y + QuadTree._object.height;
                                this.addObject();
                            }
                        }
                    }
                }
            } else {
                QuadTree._object = ObjectOrGroup;
                //console.log('add - not group:', ObjectOrGroup.name);
                if(QuadTree._object.exists && QuadTree._object.allowCollisions) {
                    QuadTree._objectLeftEdge = QuadTree._object.x;
                    QuadTree._objectTopEdge = QuadTree._object.y;
                    QuadTree._objectRightEdge = QuadTree._object.x + QuadTree._object.width;
                    QuadTree._objectBottomEdge = QuadTree._object.y + QuadTree._object.height;
                    //console.log('object properties', QuadTree._objectLeftEdge, QuadTree._objectTopEdge, QuadTree._objectRightEdge, QuadTree._objectBottomEdge);
                    this.addObject();
                }
            }
        };
        QuadTree.prototype.addObject = /**
        * Internal function for recursively navigating and creating the tree
        * while adding objects to the appropriate nodes.
        */
        function () {
            //console.log('addObject');
            //If this quad (not its children) lies entirely inside this object, add it here
            if(!this._canSubdivide || ((this._leftEdge >= QuadTree._objectLeftEdge) && (this._rightEdge <= QuadTree._objectRightEdge) && (this._topEdge >= QuadTree._objectTopEdge) && (this._bottomEdge <= QuadTree._objectBottomEdge))) {
                //console.log('add To List');
                this.addToList();
                return;
            }
            //See if the selected object fits completely inside any of the quadrants
            if((QuadTree._objectLeftEdge > this._leftEdge) && (QuadTree._objectRightEdge < this._midpointX)) {
                if((QuadTree._objectTopEdge > this._topEdge) && (QuadTree._objectBottomEdge < this._midpointY)) {
                    //console.log('Adding NW tree');
                    if(this._northWestTree == null) {
                        this._northWestTree = new QuadTree(this._leftEdge, this._topEdge, this._halfWidth, this._halfHeight, this);
                    }
                    this._northWestTree.addObject();
                    return;
                }
                if((QuadTree._objectTopEdge > this._midpointY) && (QuadTree._objectBottomEdge < this._bottomEdge)) {
                    //console.log('Adding SW tree');
                    if(this._southWestTree == null) {
                        this._southWestTree = new QuadTree(this._leftEdge, this._midpointY, this._halfWidth, this._halfHeight, this);
                    }
                    this._southWestTree.addObject();
                    return;
                }
            }
            if((QuadTree._objectLeftEdge > this._midpointX) && (QuadTree._objectRightEdge < this._rightEdge)) {
                if((QuadTree._objectTopEdge > this._topEdge) && (QuadTree._objectBottomEdge < this._midpointY)) {
                    //console.log('Adding NE tree');
                    if(this._northEastTree == null) {
                        this._northEastTree = new QuadTree(this._midpointX, this._topEdge, this._halfWidth, this._halfHeight, this);
                    }
                    this._northEastTree.addObject();
                    return;
                }
                if((QuadTree._objectTopEdge > this._midpointY) && (QuadTree._objectBottomEdge < this._bottomEdge)) {
                    //console.log('Adding SE tree');
                    if(this._southEastTree == null) {
                        this._southEastTree = new QuadTree(this._midpointX, this._midpointY, this._halfWidth, this._halfHeight, this);
                    }
                    this._southEastTree.addObject();
                    return;
                }
            }
            //If it wasn't completely contained we have to check out the partial overlaps
            if((QuadTree._objectRightEdge > this._leftEdge) && (QuadTree._objectLeftEdge < this._midpointX) && (QuadTree._objectBottomEdge > this._topEdge) && (QuadTree._objectTopEdge < this._midpointY)) {
                if(this._northWestTree == null) {
                    this._northWestTree = new QuadTree(this._leftEdge, this._topEdge, this._halfWidth, this._halfHeight, this);
                }
                //console.log('added to north west partial tree');
                this._northWestTree.addObject();
            }
            if((QuadTree._objectRightEdge > this._midpointX) && (QuadTree._objectLeftEdge < this._rightEdge) && (QuadTree._objectBottomEdge > this._topEdge) && (QuadTree._objectTopEdge < this._midpointY)) {
                if(this._northEastTree == null) {
                    this._northEastTree = new QuadTree(this._midpointX, this._topEdge, this._halfWidth, this._halfHeight, this);
                }
                //console.log('added to north east partial tree');
                this._northEastTree.addObject();
            }
            if((QuadTree._objectRightEdge > this._midpointX) && (QuadTree._objectLeftEdge < this._rightEdge) && (QuadTree._objectBottomEdge > this._midpointY) && (QuadTree._objectTopEdge < this._bottomEdge)) {
                if(this._southEastTree == null) {
                    this._southEastTree = new QuadTree(this._midpointX, this._midpointY, this._halfWidth, this._halfHeight, this);
                }
                //console.log('added to south east partial tree');
                this._southEastTree.addObject();
            }
            if((QuadTree._objectRightEdge > this._leftEdge) && (QuadTree._objectLeftEdge < this._midpointX) && (QuadTree._objectBottomEdge > this._midpointY) && (QuadTree._objectTopEdge < this._bottomEdge)) {
                if(this._southWestTree == null) {
                    this._southWestTree = new QuadTree(this._leftEdge, this._midpointY, this._halfWidth, this._halfHeight, this);
                }
                //console.log('added to south west partial tree');
                this._southWestTree.addObject();
            }
        };
        QuadTree.prototype.addToList = /**
        * Internal function for recursively adding objects to leaf lists.
        */
        function () {
            //console.log('Adding to List');
            var ot;
            if(QuadTree._list == QuadTree.A_LIST) {
                //console.log('A LIST');
                if(this._tailA.object != null) {
                    ot = this._tailA;
                    this._tailA = new Phaser.LinkedList();
                    ot.next = this._tailA;
                }
                this._tailA.object = QuadTree._object;
            } else {
                //console.log('B LIST');
                if(this._tailB.object != null) {
                    ot = this._tailB;
                    this._tailB = new Phaser.LinkedList();
                    ot.next = this._tailB;
                }
                this._tailB.object = QuadTree._object;
            }
            if(!this._canSubdivide) {
                return;
            }
            if(this._northWestTree != null) {
                this._northWestTree.addToList();
            }
            if(this._northEastTree != null) {
                this._northEastTree.addToList();
            }
            if(this._southEastTree != null) {
                this._southEastTree.addToList();
            }
            if(this._southWestTree != null) {
                this._southWestTree.addToList();
            }
        };
        QuadTree.prototype.execute = /**
        * <code>QuadTree</code>'s other main function.  Call this after adding objects
        * using <code>QuadTree.load()</code> to compare the objects that you loaded.
        *
        * @return	Whether or not any overlaps were found.
        */
        function () {
            //console.log('quadtree execute');
            var overlapProcessed = false;
            var iterator;
            if(this._headA.object != null) {
                //console.log('---------------------------------------------------');
                //console.log('headA iterator');
                iterator = this._headA;
                while(iterator != null) {
                    QuadTree._object = iterator.object;
                    if(QuadTree._useBothLists) {
                        QuadTree._iterator = this._headB;
                    } else {
                        QuadTree._iterator = iterator.next;
                    }
                    if(QuadTree._object.exists && (QuadTree._object.allowCollisions > 0) && (QuadTree._iterator != null) && (QuadTree._iterator.object != null) && QuadTree._iterator.object.exists && this.overlapNode()) {
                        //console.log('headA iterator overlapped true');
                        overlapProcessed = true;
                    }
                    iterator = iterator.next;
                }
            }
            //Advance through the tree by calling overlap on each child
            if((this._northWestTree != null) && this._northWestTree.execute()) {
                //console.log('NW quadtree execute');
                overlapProcessed = true;
            }
            if((this._northEastTree != null) && this._northEastTree.execute()) {
                //console.log('NE quadtree execute');
                overlapProcessed = true;
            }
            if((this._southEastTree != null) && this._southEastTree.execute()) {
                //console.log('SE quadtree execute');
                overlapProcessed = true;
            }
            if((this._southWestTree != null) && this._southWestTree.execute()) {
                //console.log('SW quadtree execute');
                overlapProcessed = true;
            }
            return overlapProcessed;
        };
        QuadTree.prototype.overlapNode = /**
        * An private for comparing an object against the contents of a node.
        *
        * @return	Whether or not any overlaps were found.
        */
        function () {
            //console.log('overlapNode');
            //Walk the list and check for overlaps
            var overlapProcessed = false;
            var checkObject;
            while(QuadTree._iterator != null) {
                if(!QuadTree._object.exists || (QuadTree._object.allowCollisions <= 0)) {
                    //console.log('break 1');
                    break;
                }
                checkObject = QuadTree._iterator.object;
                if((QuadTree._object === checkObject) || !checkObject.exists || (checkObject.allowCollisions <= 0)) {
                    //console.log('break 2');
                    QuadTree._iterator = QuadTree._iterator.next;
                    continue;
                }
                //calculate bulk hull for QuadTree._object
                QuadTree._objectHullX = (QuadTree._object.x < QuadTree._object.last.x) ? QuadTree._object.x : QuadTree._object.last.x;
                QuadTree._objectHullY = (QuadTree._object.y < QuadTree._object.last.y) ? QuadTree._object.y : QuadTree._object.last.y;
                QuadTree._objectHullWidth = QuadTree._object.x - QuadTree._object.last.x;
                QuadTree._objectHullWidth = QuadTree._object.width + ((QuadTree._objectHullWidth > 0) ? QuadTree._objectHullWidth : -QuadTree._objectHullWidth);
                QuadTree._objectHullHeight = QuadTree._object.y - QuadTree._object.last.y;
                QuadTree._objectHullHeight = QuadTree._object.height + ((QuadTree._objectHullHeight > 0) ? QuadTree._objectHullHeight : -QuadTree._objectHullHeight);
                //calculate bulk hull for checkObject
                QuadTree._checkObjectHullX = (checkObject.x < checkObject.last.x) ? checkObject.x : checkObject.last.x;
                QuadTree._checkObjectHullY = (checkObject.y < checkObject.last.y) ? checkObject.y : checkObject.last.y;
                QuadTree._checkObjectHullWidth = checkObject.x - checkObject.last.x;
                QuadTree._checkObjectHullWidth = checkObject.width + ((QuadTree._checkObjectHullWidth > 0) ? QuadTree._checkObjectHullWidth : -QuadTree._checkObjectHullWidth);
                QuadTree._checkObjectHullHeight = checkObject.y - checkObject.last.y;
                QuadTree._checkObjectHullHeight = checkObject.height + ((QuadTree._checkObjectHullHeight > 0) ? QuadTree._checkObjectHullHeight : -QuadTree._checkObjectHullHeight);
                //check for intersection of the two hulls
                if((QuadTree._objectHullX + QuadTree._objectHullWidth > QuadTree._checkObjectHullX) && (QuadTree._objectHullX < QuadTree._checkObjectHullX + QuadTree._checkObjectHullWidth) && (QuadTree._objectHullY + QuadTree._objectHullHeight > QuadTree._checkObjectHullY) && (QuadTree._objectHullY < QuadTree._checkObjectHullY + QuadTree._checkObjectHullHeight)) {
                    //console.log('intersection!');
                    //Execute callback functions if they exist
                    if((QuadTree._processingCallback == null) || QuadTree._processingCallback(QuadTree._object, checkObject)) {
                        overlapProcessed = true;
                    }
                    if(overlapProcessed && (QuadTree._notifyCallback != null)) {
                        QuadTree._notifyCallback(QuadTree._object, checkObject);
                    }
                }
                QuadTree._iterator = QuadTree._iterator.next;
            }
            return overlapProcessed;
        };
        return QuadTree;
    })(Phaser.Rectangle);
    Phaser.QuadTree = QuadTree;    
})(Phaser || (Phaser = {}));
/// <reference path="Game.ts" />
/// <reference path="geom/Point.ts" />
/// <reference path="geom/Rectangle.ts" />
/// <reference path="geom/Circle.ts" />
/// <reference path="geom/Line.ts" />
/// <reference path="geom/IntersectResult.ts" />
/// <reference path="system/QuadTree.ts" />
/**
* Phaser - Collision
*
* A set of extremely useful collision and geometry intersection functions.
*/
var Phaser;
(function (Phaser) {
    var Collision = (function () {
        function Collision(game) {
            this._game = game;
        }
        Collision.LEFT = 0x0001;
        Collision.RIGHT = 0x0010;
        Collision.UP = 0x0100;
        Collision.DOWN = 0x1000;
        Collision.NONE = 0;
        Collision.CEILING = Collision.UP;
        Collision.FLOOR = Collision.DOWN;
        Collision.WALL = Collision.LEFT | Collision.RIGHT;
        Collision.ANY = Collision.LEFT | Collision.RIGHT | Collision.UP | Collision.DOWN;
        Collision.OVERLAP_BIAS = 4;
        Collision.lineToLine = /**
        * -------------------------------------------------------------------------------------------
        * Lines
        * -------------------------------------------------------------------------------------------
        **/
        /**
        * Check if the two given Line objects intersect
        * @method lineToLine
        * @param {Phaser.Line} The first line object to check
        * @param {Phaser.Line} The second line object to check
        * @param {Phaser.IntersectResult} An optional IntersectResult object to store the intersection values in (one is created if none given)
        * @return {Phaser.IntersectResult} An IntersectResult object containing the results of this intersection in x/y
        **/
        function lineToLine(line1, line2, output) {
            if (typeof output === "undefined") { output = new Phaser.IntersectResult(); }
            var denom = (line1.x1 - line1.x2) * (line2.y1 - line2.y2) - (line1.y1 - line1.y2) * (line2.x1 - line2.x2);
            if(denom !== 0) {
                output.result = true;
                output.x = ((line1.x1 * line1.y2 - line1.y1 * line1.x2) * (line2.x1 - line2.x2) - (line1.x1 - line1.x2) * (line2.x1 * line2.y2 - line2.y1 * line2.x2)) / denom;
                output.y = ((line1.x1 * line1.y2 - line1.y1 * line1.x2) * (line2.y1 - line2.y2) - (line1.y1 - line1.y2) * (line2.x1 * line2.y2 - line2.y1 * line2.x2)) / denom;
            }
            return output;
        };
        Collision.lineToLineSegment = /**
        * Check if the Line and Line Segment intersects
        * @method lineToLineSegment
        * @param {Phaser.Line} The line object to check
        * @param {Phaser.Line} The line segment object to check
        * @param {Phaser.IntersectResult} An optional IntersectResult object to store the intersection values in (one is created if none given)
        * @return {Phaser.IntersectResult} An IntersectResult object containing the results of this intersection in x/y
        **/
        function lineToLineSegment(line1, seg, output) {
            if (typeof output === "undefined") { output = new Phaser.IntersectResult(); }
            var denom = (line1.x1 - line1.x2) * (seg.y1 - seg.y2) - (line1.y1 - line1.y2) * (seg.x1 - seg.x2);
            if(denom !== 0) {
                output.x = ((line1.x1 * line1.y2 - line1.y1 * line1.x2) * (seg.x1 - seg.x2) - (line1.x1 - line1.x2) * (seg.x1 * seg.y2 - seg.y1 * seg.x2)) / denom;
                output.y = ((line1.x1 * line1.y2 - line1.y1 * line1.x2) * (seg.y1 - seg.y2) - (line1.y1 - line1.y2) * (seg.x1 * seg.y2 - seg.y1 * seg.x2)) / denom;
                var maxX = Math.max(seg.x1, seg.x2);
                var minX = Math.min(seg.x1, seg.x2);
                var maxY = Math.max(seg.y1, seg.y2);
                var minY = Math.min(seg.y1, seg.y2);
                //if (!(output.x <= maxX && output.x >= minX) || !(output.y <= maxY && output.y >= minY))
                if((output.x <= maxX && output.x >= minX) === true || (output.y <= maxY && output.y >= minY) === true) {
                    output.result = true;
                }
            }
            return output;
        };
        Collision.lineToRawSegment = /**
        * Check if the Line and Line Segment intersects
        * @method lineToLineSegment
        * @param {Phaser.Line} The line object to check
        * @param {number} The x1 value
        * @param {number} The y1 value
        * @param {number} The x2 value
        * @param {number} The y2 value
        * @param {Phaser.IntersectResult} An optional IntersectResult object to store the intersection values in (one is created if none given)
        * @return {Phaser.IntersectResult} An IntersectResult object containing the results of this intersection in x/y
        **/
        function lineToRawSegment(line, x1, y1, x2, y2, output) {
            if (typeof output === "undefined") { output = new Phaser.IntersectResult(); }
            var denom = (line.x1 - line.x2) * (y1 - y2) - (line.y1 - line.y2) * (x1 - x2);
            if(denom !== 0) {
                output.x = ((line.x1 * line.y2 - line.y1 * line.x2) * (x1 - x2) - (line.x1 - line.x2) * (x1 * y2 - y1 * x2)) / denom;
                output.y = ((line.x1 * line.y2 - line.y1 * line.x2) * (y1 - y2) - (line.y1 - line.y2) * (x1 * y2 - y1 * x2)) / denom;
                var maxX = Math.max(x1, x2);
                var minX = Math.min(x1, x2);
                var maxY = Math.max(y1, y2);
                var minY = Math.min(y1, y2);
                if((output.x <= maxX && output.x >= minX) === true || (output.y <= maxY && output.y >= minY) === true) {
                    output.result = true;
                }
            }
            return output;
        };
        Collision.lineToRay = /**
        * Check if the Line and Ray intersects
        * @method lineToRay
        * @param {Phaser.Line} The Line object to check
        * @param {Phaser.Line} The Ray object to check
        * @param {Phaser.IntersectResult} An optional IntersectResult object to store the intersection values in (one is created if none given)
        * @return {Phaser.IntersectResult} An IntersectResult object containing the results of this intersection in x/y
        **/
        function lineToRay(line1, ray, output) {
            if (typeof output === "undefined") { output = new Phaser.IntersectResult(); }
            var denom = (line1.x1 - line1.x2) * (ray.y1 - ray.y2) - (line1.y1 - line1.y2) * (ray.x1 - ray.x2);
            if(denom !== 0) {
                output.x = ((line1.x1 * line1.y2 - line1.y1 * line1.x2) * (ray.x1 - ray.x2) - (line1.x1 - line1.x2) * (ray.x1 * ray.y2 - ray.y1 * ray.x2)) / denom;
                output.y = ((line1.x1 * line1.y2 - line1.y1 * line1.x2) * (ray.y1 - ray.y2) - (line1.y1 - line1.y2) * (ray.x1 * ray.y2 - ray.y1 * ray.x2)) / denom;
                output.result = true// true unless either of the 2 following conditions are met
                ;
                if(!(ray.x1 >= ray.x2) && output.x < ray.x1) {
                    output.result = false;
                }
                if(!(ray.y1 >= ray.y2) && output.y < ray.y1) {
                    output.result = false;
                }
            }
            return output;
        };
        Collision.lineToCircle = /**
        * Check if the Line and Circle intersects
        * @method lineToCircle
        * @param {Phaser.Line} The Line object to check
        * @param {Phaser.Circle} The Circle object to check
        * @param {Phaser.IntersectResult} An optional IntersectResult object to store the intersection values in (one is created if none given)
        * @return {Phaser.IntersectResult} An IntersectResult object containing the results of this intersection
        **/
        function lineToCircle(line, circle, output) {
            if (typeof output === "undefined") { output = new Phaser.IntersectResult(); }
            //  Get a perpendicular line running to the center of the circle
            if(line.perp(circle.x, circle.y).length <= circle.radius) {
                output.result = true;
            }
            return output;
        };
        Collision.lineToRectangle = /**
        * Check if the Line intersects each side of the Rectangle
        * @method lineToRectangle
        * @param {Phaser.Line} The Line object to check
        * @param {Phaser.Rectangle} The Rectangle object to check
        * @param {Phaser.IntersectResult} An optional IntersectResult object to store the intersection values in (one is created if none given)
        * @return {Phaser.IntersectResult} An IntersectResult object containing the results of this intersection
        **/
        function lineToRectangle(line, rect, output) {
            if (typeof output === "undefined") { output = new Phaser.IntersectResult(); }
            //  Top of the Rectangle vs the Line
            this.lineToRawSegment(line, rect.x, rect.y, rect.right, rect.y, output);
            if(output.result === true) {
                return output;
            }
            //  Left of the Rectangle vs the Line
            this.lineToRawSegment(line, rect.x, rect.y, rect.x, rect.bottom, output);
            if(output.result === true) {
                return output;
            }
            //  Bottom of the Rectangle vs the Line
            this.lineToRawSegment(line, rect.x, rect.bottom, rect.right, rect.bottom, output);
            if(output.result === true) {
                return output;
            }
            //  Right of the Rectangle vs the Line
            this.lineToRawSegment(line, rect.right, rect.y, rect.right, rect.bottom, output);
            return output;
        };
        Collision.lineSegmentToLineSegment = /**
        * -------------------------------------------------------------------------------------------
        * Line Segment
        * -------------------------------------------------------------------------------------------
        **/
        /**
        * Check if Line1 intersects with Line2
        * @method lineSegmentToLineSegment
        * @param {Phaser.Line} The first line object to check
        * @param {Phaser.Line} The second line object to check
        * @param {Phaser.IntersectResult} An optional IntersectResult object to store the intersection values in (one is created if none given)
        * @return {Phaser.IntersectResult} An IntersectResult object containing the results of this intersection in x/y
        **/
        function lineSegmentToLineSegment(line1, line2, output) {
            if (typeof output === "undefined") { output = new Phaser.IntersectResult(); }
            this.lineToLineSegment(line1, line2, output);
            if(output.result === true) {
                if(!(output.x >= Math.min(line1.x1, line1.x2) && output.x <= Math.max(line1.x1, line1.x2) && output.y >= Math.min(line1.y1, line1.y2) && output.y <= Math.max(line1.y1, line1.y2))) {
                    output.result = false;
                }
            }
            return output;
        };
        Collision.lineSegmentToRay = /**
        * Check if the Line Segment intersects with the Ray
        * @method lineSegmentToRay
        * @param {Phaser.Line} The Line object to check
        * @param {Phaser.Line} The Line Ray object to check
        * @param {Phaser.IntersectResult} An optional IntersectResult object to store the intersection values in (one is created if none given)
        * @return {Phaser.IntersectResult} An IntersectResult object containing the results of this intersection in x/y
        **/
        function lineSegmentToRay(line1, ray, output) {
            if (typeof output === "undefined") { output = new Phaser.IntersectResult(); }
            this.lineToRay(line1, ray, output);
            if(output.result === true) {
                if(!(output.x >= Math.min(line1.x1, line1.x2) && output.x <= Math.max(line1.x1, line1.x2) && output.y >= Math.min(line1.y1, line1.y2) && output.y <= Math.max(line1.y1, line1.y2))) {
                    output.result = false;
                }
            }
            return output;
        };
        Collision.lineSegmentToCircle = /**
        * Check if the Line Segment intersects with the Circle
        * @method lineSegmentToCircle
        * @param {Phaser.Line} The Line object to check
        * @param {Phaser.Circle} The Circle object to check
        * @param {Phaser.IntersectResult} An optional IntersectResult object to store the intersection values in (one is created if none given)
        * @return {Phaser.IntersectResult} An IntersectResult object containing the results of this intersection in x/y
        **/
        function lineSegmentToCircle(seg, circle, output) {
            if (typeof output === "undefined") { output = new Phaser.IntersectResult(); }
            var perp = seg.perp(circle.x, circle.y);
            if(perp.length <= circle.radius) {
                //  Line intersects circle - check if segment does
                var maxX = Math.max(seg.x1, seg.x2);
                var minX = Math.min(seg.x1, seg.x2);
                var maxY = Math.max(seg.y1, seg.y2);
                var minY = Math.min(seg.y1, seg.y2);
                if((perp.x2 <= maxX && perp.x2 >= minX) && (perp.y2 <= maxY && perp.y2 >= minY)) {
                    output.result = true;
                } else {
                    //  Worst case - segment doesn't traverse center, so no perpendicular connection.
                    if(this.circleContainsPoint(circle, {
                        x: seg.x1,
                        y: seg.y1
                    }) || this.circleContainsPoint(circle, {
                        x: seg.x2,
                        y: seg.y2
                    })) {
                        output.result = true;
                    }
                }
            }
            return output;
        };
        Collision.lineSegmentToRectangle = /**
        * Check if the Line Segment intersects with the Rectangle
        * @method lineSegmentToCircle
        * @param {Phaser.Line} The Line object to check
        * @param {Phaser.Circle} The Circle object to check
        * @param {Phaser.IntersectResult} An optional IntersectResult object to store the intersection values in (one is created if none given)
        * @return {Phaser.IntersectResult} An IntersectResult object containing the results of this intersection in x/y
        **/
        function lineSegmentToRectangle(seg, rect, output) {
            if (typeof output === "undefined") { output = new Phaser.IntersectResult(); }
            if(rect.contains(seg.x1, seg.y1) && rect.contains(seg.x2, seg.y2)) {
                output.result = true;
            } else {
                //  Top of the Rectangle vs the Line
                this.lineToRawSegment(seg, rect.x, rect.y, rect.right, rect.bottom, output);
                if(output.result === true) {
                    return output;
                }
                //  Left of the Rectangle vs the Line
                this.lineToRawSegment(seg, rect.x, rect.y, rect.x, rect.bottom, output);
                if(output.result === true) {
                    return output;
                }
                //  Bottom of the Rectangle vs the Line
                this.lineToRawSegment(seg, rect.x, rect.bottom, rect.right, rect.bottom, output);
                if(output.result === true) {
                    return output;
                }
                //  Right of the Rectangle vs the Line
                this.lineToRawSegment(seg, rect.right, rect.y, rect.right, rect.bottom, output);
                return output;
            }
            return output;
        };
        Collision.rayToRectangle = /**
        * -------------------------------------------------------------------------------------------
        * Ray
        * -------------------------------------------------------------------------------------------
        **/
        /**
        * Check if the two given Circle objects intersect
        * @method circleToCircle
        * @param {Phaser.Circle} The first circle object to check
        * @param {Phaser.Circle} The second circle object to check
        * @param {Phaser.IntersectResult} An optional IntersectResult object to store the intersection values in (one is created if none given)
        * @return {Phaser.IntersectResult} An IntersectResult object containing the results of this intersection
        **/
        function rayToRectangle(ray, rect, output) {
            if (typeof output === "undefined") { output = new Phaser.IntersectResult(); }
            //  Currently just finds first intersection - might not be closest to ray pt1
            this.lineToRectangle(ray, rect, output);
            return output;
        };
        Collision.rayToLineSegment = /**
        * Check whether a ray intersects a line segment, returns the parametric value where the intersection occurs.
        * @method rayToLineSegment
        * @static
        * @param {Number} rayx1. The origin x of the ray.
        * @param {Number} rayy1. The origin y of the ray.
        * @param {Number} rayx2. The direction x of the ray.
        * @param {Number} rayy2. The direction y of the ray.
        * @param {Number} linex1. The x of the first point of the line segment.
        * @param {Number} liney1. The y of the first point of the line segment.
        * @param {Number} linex2. The x of the second point of the line segment.
        * @param {Number} liney2. The y of the second point of the line segment.
        * @param {Phaser.IntersectResult} An optional IntersectResult object to store the intersection values in (one is created if none given)
        * @return {Phaser.IntersectResult} An IntersectResult object containing the results of this intersection stored in x
        **/
        function rayToLineSegment(rayx1, rayy1, rayx2, rayy2, linex1, liney1, linex2, liney2, output) {
            if (typeof output === "undefined") { output = new Phaser.IntersectResult(); }
            var r, s, d;
            // Check lines are not parallel
            if((rayy2 - rayy1) / (rayx2 - rayx1) != (liney2 - liney1) / (linex2 - linex1)) {
                d = (((rayx2 - rayx1) * (liney2 - liney1)) - (rayy2 - rayy1) * (linex2 - linex1));
                if(d != 0) {
                    r = (((rayy1 - liney1) * (linex2 - linex1)) - (rayx1 - linex1) * (liney2 - liney1)) / d;
                    s = (((rayy1 - liney1) * (rayx2 - rayx1)) - (rayx1 - linex1) * (rayy2 - rayy1)) / d;
                    if(r >= 0) {
                        if(s >= 0 && s <= 1) {
                            output.result = true;
                            output.x = rayx1 + r * (rayx2 - rayx1) , rayy1 + r * (rayy2 - rayy1);
                        }
                    }
                }
            }
            return output;
        };
        Collision.pointToRectangle = /**
        * -------------------------------------------------------------------------------------------
        * Rectangles
        * -------------------------------------------------------------------------------------------
        **/
        /**
        * Determines whether the specified point is contained within the rectangular region defined by the Rectangle object.
        * @method pointToRectangle
        * @param {Point} point The point object being checked.
        * @param {Rectangle} rect The rectangle object being checked.
        * @return {Phaser.IntersectResult} An IntersectResult object containing the results of this intersection in x/y/result
        **/
        function pointToRectangle(point, rect, output) {
            if (typeof output === "undefined") { output = new Phaser.IntersectResult(); }
            output.setTo(point.x, point.y);
            output.result = rect.containsPoint(point);
            return output;
        };
        Collision.rectangleToRectangle = /**
        * Check whether two axis aligned rectangles intersect. Return the intersecting rectangle dimensions if they do.
        * @method rectangleToRectangle
        * @param {Phaser.Rectangle} The first Rectangle object
        * @param {Phaser.Rectangle} The second Rectangle object
        * @param {Phaser.IntersectResult} An optional IntersectResult object to store the intersection values in (one is created if none given)
        * @return {Phaser.IntersectResult} An IntersectResult object containing the results of this intersection in x/y/width/height
        **/
        function rectangleToRectangle(rect1, rect2, output) {
            if (typeof output === "undefined") { output = new Phaser.IntersectResult(); }
            var leftX = Math.max(rect1.x, rect2.x);
            var rightX = Math.min(rect1.right, rect2.right);
            var topY = Math.max(rect1.y, rect2.y);
            var bottomY = Math.min(rect1.bottom, rect2.bottom);
            output.setTo(leftX, topY, rightX - leftX, bottomY - topY, rightX - leftX, bottomY - topY);
            var cx = output.x + output.width * .5;
            var cy = output.y + output.height * .5;
            if((cx > rect1.x && cx < rect1.right) && (cy > rect1.y && cy < rect1.bottom)) {
                output.result = true;
            }
            return output;
        };
        Collision.rectangleToCircle = function rectangleToCircle(rect, circle, output) {
            if (typeof output === "undefined") { output = new Phaser.IntersectResult(); }
            return this.circleToRectangle(circle, rect, output);
        };
        Collision.circleToCircle = /**
        * -------------------------------------------------------------------------------------------
        * Circle
        * -------------------------------------------------------------------------------------------
        **/
        /**
        * Check if the two given Circle objects intersect
        * @method circleToCircle
        * @param {Phaser.Circle} The first circle object to check
        * @param {Phaser.Circle} The second circle object to check
        * @param {Phaser.IntersectResult} An optional IntersectResult object to store the intersection values in (one is created if none given)
        * @return {Phaser.IntersectResult} An IntersectResult object containing the results of this intersection
        **/
        function circleToCircle(circle1, circle2, output) {
            if (typeof output === "undefined") { output = new Phaser.IntersectResult(); }
            output.result = ((circle1.radius + circle2.radius) * (circle1.radius + circle2.radius)) >= this.distanceSquared(circle1.x, circle1.y, circle2.x, circle2.y);
            return output;
        };
        Collision.circleToRectangle = /**
        * Check if the given Rectangle intersects with the given Circle
        * @method circleToRectangle
        * @param {Phaser.Circle} The circle object to check
        * @param {Phaser.Rectangle} The Rectangle object to check
        * @param {Phaser.IntersectResult} An optional IntersectResult object to store the intersection values in (one is created if none given)
        * @return {Phaser.IntersectResult} An IntersectResult object containing the results of this intersection
        **/
        function circleToRectangle(circle, rect, output) {
            if (typeof output === "undefined") { output = new Phaser.IntersectResult(); }
            var inflatedRect = rect.clone();
            inflatedRect.inflate(circle.radius, circle.radius);
            output.result = inflatedRect.contains(circle.x, circle.y);
            return output;
        };
        Collision.circleContainsPoint = /**
        * Check if the given Point is found within the given Circle
        * @method circleContainsPoint
        * @param {Phaser.Circle} The circle object to check
        * @param {Phaser.Point} The point object to check
        * @param {Phaser.IntersectResult} An optional IntersectResult object to store the intersection values in (one is created if none given)
        * @return {Phaser.IntersectResult} An IntersectResult object containing the results of this intersection
        **/
        function circleContainsPoint(circle, point, output) {
            if (typeof output === "undefined") { output = new Phaser.IntersectResult(); }
            output.result = circle.radius * circle.radius >= this.distanceSquared(circle.x, circle.y, point.x, point.y);
            return output;
        };
        Collision.prototype.overlap = /**
        * -------------------------------------------------------------------------------------------
        * Game Object Collision
        * -------------------------------------------------------------------------------------------
        **/
        /**
        * Call this function to see if one <code>GameObject</code> overlaps another.
        * Can be called with one object and one group, or two groups, or two objects,
        * whatever floats your boat! For maximum performance try bundling a lot of objects
        * together using a <code>Group</code> (or even bundling groups together!).
        *
        * <p>NOTE: does NOT take objects' scrollfactor into account, all overlaps are checked in world space.</p>
        *
        * @param	ObjectOrGroup1	The first object or group you want to check.
        * @param	ObjectOrGroup2	The second object or group you want to check.  If it is the same as the first it knows to just do a comparison within that group.
        * @param	NotifyCallback	A function with two <code>GameObject</code> parameters - e.g. <code>myOverlapFunction(Object1:GameObject,Object2:GameObject)</code> - that is called if those two objects overlap.
        * @param	ProcessCallback	A function with two <code>GameObject</code> parameters - e.g. <code>myOverlapFunction(Object1:GameObject,Object2:GameObject)</code> - that is called if those two objects overlap.  If a ProcessCallback is provided, then NotifyCallback will only be called if ProcessCallback returns true for those objects!
        *
        * @return	Whether any overlaps were detected.
        */
        function (ObjectOrGroup1, ObjectOrGroup2, NotifyCallback, ProcessCallback) {
            if (typeof ObjectOrGroup1 === "undefined") { ObjectOrGroup1 = null; }
            if (typeof ObjectOrGroup2 === "undefined") { ObjectOrGroup2 = null; }
            if (typeof NotifyCallback === "undefined") { NotifyCallback = null; }
            if (typeof ProcessCallback === "undefined") { ProcessCallback = null; }
            if(ObjectOrGroup1 == null) {
                ObjectOrGroup1 = this._game.world.group;
            }
            if(ObjectOrGroup2 == ObjectOrGroup1) {
                ObjectOrGroup2 = null;
            }
            Phaser.QuadTree.divisions = this._game.world.worldDivisions;
            var quadTree = new Phaser.QuadTree(this._game.world.bounds.x, this._game.world.bounds.y, this._game.world.bounds.width, this._game.world.bounds.height);
            quadTree.load(ObjectOrGroup1, ObjectOrGroup2, NotifyCallback, ProcessCallback);
            var result = quadTree.execute();
            quadTree.destroy();
            quadTree = null;
            return result;
        };
        Collision.separate = /**
        * The main collision resolution in flixel.
        *
        * @param	Object1 	Any <code>Sprite</code>.
        * @param	Object2		Any other <code>Sprite</code>.
        *
        * @return	Whether the objects in fact touched and were separated.
        */
        function separate(Object1, Object2) {
            var separatedX = Collision.separateX(Object1, Object2);
            var separatedY = Collision.separateY(Object1, Object2);
            return separatedX || separatedY;
        };
        Collision.separateX = /**
        * The X-axis component of the object separation process.
        *
        * @param	Object1 	Any <code>Sprite</code>.
        * @param	Object2		Any other <code>Sprite</code>.
        *
        * @return	Whether the objects in fact touched and were separated along the X axis.
        */
        function separateX(Object1, Object2) {
            //can't separate two immovable objects
            var obj1immovable = Object1.immovable;
            var obj2immovable = Object2.immovable;
            if(obj1immovable && obj2immovable) {
                return false;
            }
            //If one of the objects is a tilemap, just pass it off.
            /*
            if (typeof Object1 === 'Tilemap')
            {
            return Object1.overlapsWithCallback(Object2, separateX);
            }
            
            if (typeof Object2 === 'Tilemap')
            {
            return Object2.overlapsWithCallback(Object1, separateX, true);
            }
            */
            //First, get the two object deltas
            var overlap = 0;
            var obj1delta = Object1.x - Object1.last.x;
            var obj2delta = Object2.x - Object2.last.x;
            if(obj1delta != obj2delta) {
                //Check if the X hulls actually overlap
                var obj1deltaAbs = (obj1delta > 0) ? obj1delta : -obj1delta;
                var obj2deltaAbs = (obj2delta > 0) ? obj2delta : -obj2delta;
                var obj1rect = new Phaser.Rectangle(Object1.x - ((obj1delta > 0) ? obj1delta : 0), Object1.last.y, Object1.width + ((obj1delta > 0) ? obj1delta : -obj1delta), Object1.height);
                var obj2rect = new Phaser.Rectangle(Object2.x - ((obj2delta > 0) ? obj2delta : 0), Object2.last.y, Object2.width + ((obj2delta > 0) ? obj2delta : -obj2delta), Object2.height);
                if((obj1rect.x + obj1rect.width > obj2rect.x) && (obj1rect.x < obj2rect.x + obj2rect.width) && (obj1rect.y + obj1rect.height > obj2rect.y) && (obj1rect.y < obj2rect.y + obj2rect.height)) {
                    var maxOverlap = obj1deltaAbs + obj2deltaAbs + Collision.OVERLAP_BIAS;
                    //If they did overlap (and can), figure out by how much and flip the corresponding flags
                    if(obj1delta > obj2delta) {
                        overlap = Object1.x + Object1.width - Object2.x;
                        if((overlap > maxOverlap) || !(Object1.allowCollisions & Collision.RIGHT) || !(Object2.allowCollisions & Collision.LEFT)) {
                            overlap = 0;
                        } else {
                            Object1.touching |= Collision.RIGHT;
                            Object2.touching |= Collision.LEFT;
                        }
                    } else if(obj1delta < obj2delta) {
                        overlap = Object1.x - Object2.width - Object2.x;
                        if((-overlap > maxOverlap) || !(Object1.allowCollisions & Collision.LEFT) || !(Object2.allowCollisions & Collision.RIGHT)) {
                            overlap = 0;
                        } else {
                            Object1.touching |= Collision.LEFT;
                            Object2.touching |= Collision.RIGHT;
                        }
                    }
                }
            }
            //Then adjust their positions and velocities accordingly (if there was any overlap)
            if(overlap != 0) {
                var obj1v = Object1.velocity.x;
                var obj2v = Object2.velocity.x;
                if(!obj1immovable && !obj2immovable) {
                    overlap *= 0.5;
                    Object1.x = Object1.x - overlap;
                    Object2.x += overlap;
                    var obj1velocity = Math.sqrt((obj2v * obj2v * Object2.mass) / Object1.mass) * ((obj2v > 0) ? 1 : -1);
                    var obj2velocity = Math.sqrt((obj1v * obj1v * Object1.mass) / Object2.mass) * ((obj1v > 0) ? 1 : -1);
                    var average = (obj1velocity + obj2velocity) * 0.5;
                    obj1velocity -= average;
                    obj2velocity -= average;
                    Object1.velocity.x = average + obj1velocity * Object1.elasticity;
                    Object2.velocity.x = average + obj2velocity * Object2.elasticity;
                } else if(!obj1immovable) {
                    Object1.x = Object1.x - overlap;
                    Object1.velocity.x = obj2v - obj1v * Object1.elasticity;
                } else if(!obj2immovable) {
                    Object2.x += overlap;
                    Object2.velocity.x = obj1v - obj2v * Object2.elasticity;
                }
                return true;
            } else {
                return false;
            }
        };
        Collision.separateY = /**
        * The Y-axis component of the object separation process.
        *
        * @param	Object1 	Any <code>Sprite</code>.
        * @param	Object2		Any other <code>Sprite</code>.
        *
        * @return	Whether the objects in fact touched and were separated along the Y axis.
        */
        function separateY(Object1, Object2) {
            //can't separate two immovable objects
            var obj1immovable = Object1.immovable;
            var obj2immovable = Object2.immovable;
            if(obj1immovable && obj2immovable) {
                return false;
            }
            //If one of the objects is a tilemap, just pass it off.
            /*
            if (typeof Object1 === 'Tilemap')
            {
            return Object1.overlapsWithCallback(Object2, separateY);
            }
            
            if (typeof Object2 === 'Tilemap')
            {
            return Object2.overlapsWithCallback(Object1, separateY, true);
            }
            */
            //First, get the two object deltas
            var overlap = 0;
            var obj1delta = Object1.y - Object1.last.y;
            var obj2delta = Object2.y - Object2.last.y;
            if(obj1delta != obj2delta) {
                //Check if the Y hulls actually overlap
                var obj1deltaAbs = (obj1delta > 0) ? obj1delta : -obj1delta;
                var obj2deltaAbs = (obj2delta > 0) ? obj2delta : -obj2delta;
                var obj1rect = new Phaser.Rectangle(Object1.x, Object1.y - ((obj1delta > 0) ? obj1delta : 0), Object1.width, Object1.height + obj1deltaAbs);
                var obj2rect = new Phaser.Rectangle(Object2.x, Object2.y - ((obj2delta > 0) ? obj2delta : 0), Object2.width, Object2.height + obj2deltaAbs);
                if((obj1rect.x + obj1rect.width > obj2rect.x) && (obj1rect.x < obj2rect.x + obj2rect.width) && (obj1rect.y + obj1rect.height > obj2rect.y) && (obj1rect.y < obj2rect.y + obj2rect.height)) {
                    var maxOverlap = obj1deltaAbs + obj2deltaAbs + Collision.OVERLAP_BIAS;
                    //If they did overlap (and can), figure out by how much and flip the corresponding flags
                    if(obj1delta > obj2delta) {
                        overlap = Object1.y + Object1.height - Object2.y;
                        if((overlap > maxOverlap) || !(Object1.allowCollisions & Collision.DOWN) || !(Object2.allowCollisions & Collision.UP)) {
                            overlap = 0;
                        } else {
                            Object1.touching |= Collision.DOWN;
                            Object2.touching |= Collision.UP;
                        }
                    } else if(obj1delta < obj2delta) {
                        overlap = Object1.y - Object2.height - Object2.y;
                        if((-overlap > maxOverlap) || !(Object1.allowCollisions & Collision.UP) || !(Object2.allowCollisions & Collision.DOWN)) {
                            overlap = 0;
                        } else {
                            Object1.touching |= Collision.UP;
                            Object2.touching |= Collision.DOWN;
                        }
                    }
                }
            }
            //Then adjust their positions and velocities accordingly (if there was any overlap)
            if(overlap != 0) {
                var obj1v = Object1.velocity.y;
                var obj2v = Object2.velocity.y;
                if(!obj1immovable && !obj2immovable) {
                    overlap *= 0.5;
                    Object1.y = Object1.y - overlap;
                    Object2.y += overlap;
                    var obj1velocity = Math.sqrt((obj2v * obj2v * Object2.mass) / Object1.mass) * ((obj2v > 0) ? 1 : -1);
                    var obj2velocity = Math.sqrt((obj1v * obj1v * Object1.mass) / Object2.mass) * ((obj1v > 0) ? 1 : -1);
                    var average = (obj1velocity + obj2velocity) * 0.5;
                    obj1velocity -= average;
                    obj2velocity -= average;
                    Object1.velocity.y = average + obj1velocity * Object1.elasticity;
                    Object2.velocity.y = average + obj2velocity * Object2.elasticity;
                } else if(!obj1immovable) {
                    Object1.y = Object1.y - overlap;
                    Object1.velocity.y = obj2v - obj1v * Object1.elasticity;
                    //This is special case code that handles cases like horizontal moving platforms you can ride
                    if(Object2.active && Object2.moves && (obj1delta > obj2delta)) {
                        Object1.x += Object2.x - Object2.last.x;
                    }
                } else if(!obj2immovable) {
                    Object2.y += overlap;
                    Object2.velocity.y = obj1v - obj2v * Object2.elasticity;
                    //This is special case code that handles cases like horizontal moving platforms you can ride
                    if(Object1.active && Object1.moves && (obj1delta < obj2delta)) {
                        Object2.x += Object1.x - Object1.last.x;
                    }
                }
                return true;
            } else {
                return false;
            }
        };
        Collision.distance = /**
        * -------------------------------------------------------------------------------------------
        * Distance
        * -------------------------------------------------------------------------------------------
        **/
        function distance(x1, y1, x2, y2) {
            return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
        };
        Collision.distanceSquared = function distanceSquared(x1, y1, x2, y2) {
            return (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
        };
        return Collision;
    })();
    Phaser.Collision = Collision;    
})(Phaser || (Phaser = {}));
/// <reference path="Game.ts" />
/**
* Phaser - DynamicTexture
*
* A DynamicTexture can be thought of as a mini canvas into which you can draw anything.
* Game Objects can be assigned a DynamicTexture, so when they render in the world they do so
* based on the contents of the texture at the time. This allows you to create powerful effects
* once and have them replicated across as many game objects as you like.
*/
var Phaser;
(function (Phaser) {
    var DynamicTexture = (function () {
        function DynamicTexture(game, key, width, height) {
            this._sx = 0;
            this._sy = 0;
            this._sw = 0;
            this._sh = 0;
            this._dx = 0;
            this._dy = 0;
            this._dw = 0;
            this._dh = 0;
            this._game = game;
            this.canvas = document.createElement('canvas');
            this.canvas.width = width;
            this.canvas.height = height;
            this.context = this.canvas.getContext('2d');
            this.bounds = new Phaser.Rectangle(0, 0, width, height);
        }
        DynamicTexture.prototype.getPixel = function (x, y) {
            //r = imageData.data[0];
            //g = imageData.data[1];
            //b = imageData.data[2];
            //a = imageData.data[3];
            var imageData = this.context.getImageData(x, y, 1, 1);
            return this.getColor(imageData.data[0], imageData.data[1], imageData.data[2]);
        };
        DynamicTexture.prototype.getPixel32 = function (x, y) {
            var imageData = this.context.getImageData(x, y, 1, 1);
            return this.getColor32(imageData.data[3], imageData.data[0], imageData.data[1], imageData.data[2]);
        };
        DynamicTexture.prototype.getPixels = //  Returns a CanvasPixelArray
        function (rect) {
            return this.context.getImageData(rect.x, rect.y, rect.width, rect.height);
        };
        DynamicTexture.prototype.setPixel = function (x, y, color) {
            this.context.fillStyle = color;
            this.context.fillRect(x, y, 1, 1);
        };
        DynamicTexture.prototype.setPixel32 = function (x, y, color) {
            this.context.fillStyle = color;
            this.context.fillRect(x, y, 1, 1);
        };
        DynamicTexture.prototype.setPixels = function (rect, input) {
            this.context.putImageData(input, rect.x, rect.y);
        };
        DynamicTexture.prototype.fillRect = function (rect, color) {
            this.context.fillStyle = color;
            this.context.fillRect(rect.x, rect.y, rect.width, rect.height);
        };
        DynamicTexture.prototype.pasteImage = function (key, frame, destX, destY, destWidth, destHeight) {
            if (typeof frame === "undefined") { frame = -1; }
            if (typeof destX === "undefined") { destX = 0; }
            if (typeof destY === "undefined") { destY = 0; }
            if (typeof destWidth === "undefined") { destWidth = null; }
            if (typeof destHeight === "undefined") { destHeight = null; }
            var texture = null;
            var frameData;
            this._sx = 0;
            this._sy = 0;
            this._dx = destX;
            this._dy = destY;
            //  TODO - Load a frame from a sprite sheet, otherwise we'll draw the whole lot
            if(frame > -1) {
                //if (this._game.cache.isSpriteSheet(key))
                //{
                //    texture = this._game.cache.getImage(key);
                //this.animations.loadFrameData(this._game.cache.getFrameData(key));
                //}
                            } else {
                texture = this._game.cache.getImage(key);
                this._sw = texture.width;
                this._sh = texture.height;
                this._dw = texture.width;
                this._dh = texture.height;
            }
            if(destWidth !== null) {
                this._dw = destWidth;
            }
            if(destHeight !== null) {
                this._dh = destHeight;
            }
            if(texture != null) {
                this.context.drawImage(texture, //	Source Image
                this._sx, //	Source X (location within the source image)
                this._sy, //	Source Y
                this._sw, //	Source Width
                this._sh, //	Source Height
                this._dx, //	Destination X (where on the canvas it'll be drawn)
                this._dy, //	Destination Y
                this._dw, //	Destination Width (always same as Source Width unless scaled)
                this._dh);
                //	Destination Height (always same as Source Height unless scaled)
                            }
        };
        DynamicTexture.prototype.copyPixels = //  TODO - Add in support for: alphaBitmapData: BitmapData = null, alphaPoint: Point = null, mergeAlpha: bool = false
        function (sourceTexture, sourceRect, destPoint) {
            //  Swap for drawImage if the sourceRect is the same size as the sourceTexture to avoid a costly getImageData call
            if(sourceRect.equals(this.bounds) == true) {
                this.context.drawImage(sourceTexture.canvas, destPoint.x, destPoint.y);
            } else {
                this.context.putImageData(sourceTexture.getPixels(sourceRect), destPoint.x, destPoint.y);
            }
        };
        DynamicTexture.prototype.clear = function () {
            this.context.clearRect(0, 0, this.bounds.width, this.bounds.height);
        };
        Object.defineProperty(DynamicTexture.prototype, "width", {
            get: function () {
                return this.bounds.width;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DynamicTexture.prototype, "height", {
            get: function () {
                return this.bounds.height;
            },
            enumerable: true,
            configurable: true
        });
        DynamicTexture.prototype.getColor32 = /**
        * Given an alpha and 3 color values this will return an integer representation of it
        *
        * @param	alpha	The Alpha value (between 0 and 255)
        * @param	red		The Red channel value (between 0 and 255)
        * @param	green	The Green channel value (between 0 and 255)
        * @param	blue	The Blue channel value (between 0 and 255)
        *
        * @return	A native color value integer (format: 0xAARRGGBB)
        */
        function (alpha, red, green, blue) {
            return alpha << 24 | red << 16 | green << 8 | blue;
        };
        DynamicTexture.prototype.getColor = /**
        * Given 3 color values this will return an integer representation of it
        *
        * @param	red		The Red channel value (between 0 and 255)
        * @param	green	The Green channel value (between 0 and 255)
        * @param	blue	The Blue channel value (between 0 and 255)
        *
        * @return	A native color value integer (format: 0xRRGGBB)
        */
        function (red, green, blue) {
            return red << 16 | green << 8 | blue;
        };
        return DynamicTexture;
    })();
    Phaser.DynamicTexture = DynamicTexture;    
})(Phaser || (Phaser = {}));
/// <reference path="Game.ts" />
/**
* Phaser - GameMath
*
* Adds a set of extra Math functions used through-out Phaser.
* Includes methods written by Dylan Engelman and Adam Saltsman.
*/
var Phaser;
(function (Phaser) {
    var GameMath = (function () {
        function GameMath(game) {
            //arbitrary 8 digit epsilon
            this.cosTable = [];
            this.sinTable = [];
            /**
            * The global random number generator seed (for deterministic behavior in recordings and saves).
            */
            this.globalSeed = Math.random();
            this._game = game;
        }
        GameMath.PI = 3.141592653589793;
        GameMath.PI_2 = 1.5707963267948965;
        GameMath.PI_4 = 0.7853981633974483;
        GameMath.PI_8 = 0.39269908169872413;
        GameMath.PI_16 = 0.19634954084936206;
        GameMath.TWO_PI = 6.283185307179586;
        GameMath.THREE_PI_2 = 4.7123889803846895;
        GameMath.E = 2.71828182845905;
        GameMath.LN10 = 2.302585092994046;
        GameMath.LN2 = 0.6931471805599453;
        GameMath.LOG10E = 0.4342944819032518;
        GameMath.LOG2E = 1.442695040888963387;
        GameMath.SQRT1_2 = 0.7071067811865476;
        GameMath.SQRT2 = 1.4142135623730951;
        GameMath.DEG_TO_RAD = 0.017453292519943294444444444444444;
        GameMath.RAD_TO_DEG = 57.295779513082325225835265587527;
        GameMath.B_16 = 65536;
        GameMath.B_31 = 2147483648;
        GameMath.B_32 = 4294967296;
        GameMath.B_48 = 281474976710656;
        GameMath.B_53 = 9007199254740992;
        GameMath.B_64 = 18446744073709551616;
        GameMath.ONE_THIRD = 0.333333333333333333333333333333333;
        GameMath.TWO_THIRDS = 0.666666666666666666666666666666666;
        GameMath.ONE_SIXTH = 0.166666666666666666666666666666666;
        GameMath.COS_PI_3 = 0.86602540378443864676372317075294;
        GameMath.SIN_2PI_3 = 0.03654595;
        GameMath.CIRCLE_ALPHA = 0.5522847498307933984022516322796;
        GameMath.ON = true;
        GameMath.OFF = false;
        GameMath.SHORT_EPSILON = 0.1;
        GameMath.PERC_EPSILON = 0.001;
        GameMath.EPSILON = 0.0001;
        GameMath.LONG_EPSILON = 0.00000001;
        GameMath.prototype.fuzzyEqual = function (a, b, epsilon) {
            if (typeof epsilon === "undefined") { epsilon = 0.0001; }
            return Math.abs(a - b) < epsilon;
        };
        GameMath.prototype.fuzzyLessThan = function (a, b, epsilon) {
            if (typeof epsilon === "undefined") { epsilon = 0.0001; }
            return a < b + epsilon;
        };
        GameMath.prototype.fuzzyGreaterThan = function (a, b, epsilon) {
            if (typeof epsilon === "undefined") { epsilon = 0.0001; }
            return a > b - epsilon;
        };
        GameMath.prototype.fuzzyCeil = function (val, epsilon) {
            if (typeof epsilon === "undefined") { epsilon = 0.0001; }
            return Math.ceil(val - epsilon);
        };
        GameMath.prototype.fuzzyFloor = function (val, epsilon) {
            if (typeof epsilon === "undefined") { epsilon = 0.0001; }
            return Math.floor(val + epsilon);
        };
        GameMath.prototype.average = function () {
            var args = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                args[_i] = arguments[_i + 0];
            }
            var avg = 0;
            for(var i = 0; i < args.length; i++) {
                avg += args[i];
            }
            return avg / args.length;
        };
        GameMath.prototype.slam = function (value, target, epsilon) {
            if (typeof epsilon === "undefined") { epsilon = 0.0001; }
            return (Math.abs(value - target) < epsilon) ? target : value;
        };
        GameMath.prototype.percentageMinMax = /**
        * ratio of value to a range
        */
        function (val, max, min) {
            if (typeof min === "undefined") { min = 0; }
            val -= min;
            max -= min;
            if(!max) {
                return 0;
            } else {
                return val / max;
            }
        };
        GameMath.prototype.sign = /**
        * a value representing the sign of the value.
        * -1 for negative, +1 for positive, 0 if value is 0
        */
        function (n) {
            if(n) {
                return n / Math.abs(n);
            } else {
                return 0;
            }
        };
        GameMath.prototype.truncate = function (n) {
            return (n > 0) ? Math.floor(n) : Math.ceil(n);
        };
        GameMath.prototype.shear = function (n) {
            return n % 1;
        };
        GameMath.prototype.wrap = /**
        * wrap a value around a range, similar to modulus with a floating minimum
        */
        function (val, max, min) {
            if (typeof min === "undefined") { min = 0; }
            val -= min;
            max -= min;
            if(max == 0) {
                return min;
            }
            val %= max;
            val += min;
            while(val < min) {
                val += max;
            }
            return val;
        };
        GameMath.prototype.arithWrap = /**
        * arithmetic version of wrap... need to decide which is more efficient
        */
        function (value, max, min) {
            if (typeof min === "undefined") { min = 0; }
            max -= min;
            if(max == 0) {
                return min;
            }
            return value - max * Math.floor((value - min) / max);
        };
        GameMath.prototype.clamp = /**
        * force a value within the boundaries of two values
        *
        * if max < min, min is returned
        */
        function (input, max, min) {
            if (typeof min === "undefined") { min = 0; }
            return Math.max(min, Math.min(max, input));
        };
        GameMath.prototype.snapTo = /**
        * Snap a value to nearest grid slice, using rounding.
        *
        * example if you have an interval gap of 5 and a position of 12... you will snap to 10. Where as 14 will snap to 15
        *
        * @param input - the value to snap
        * @param gap - the interval gap of the grid
        * @param start - optional starting offset for gap
        */
        function (input, gap, start) {
            if (typeof start === "undefined") { start = 0; }
            if(gap == 0) {
                return input;
            }
            input -= start;
            input = gap * Math.round(input / gap);
            return start + input;
        };
        GameMath.prototype.snapToFloor = /**
        * Snap a value to nearest grid slice, using floor.
        *
        * example if you have an interval gap of 5 and a position of 12... you will snap to 10. As will 14 snap to 10... but 16 will snap to 15
        *
        * @param input - the value to snap
        * @param gap - the interval gap of the grid
        * @param start - optional starting offset for gap
        */
        function (input, gap, start) {
            if (typeof start === "undefined") { start = 0; }
            if(gap == 0) {
                return input;
            }
            input -= start;
            input = gap * Math.floor(input / gap);
            return start + input;
        };
        GameMath.prototype.snapToCeil = /**
        * Snap a value to nearest grid slice, using ceil.
        *
        * example if you have an interval gap of 5 and a position of 12... you will snap to 15. As will 14 will snap to 15... but 16 will snap to 20
        *
        * @param input - the value to snap
        * @param gap - the interval gap of the grid
        * @param start - optional starting offset for gap
        */
        function (input, gap, start) {
            if (typeof start === "undefined") { start = 0; }
            if(gap == 0) {
                return input;
            }
            input -= start;
            input = gap * Math.ceil(input / gap);
            return start + input;
        };
        GameMath.prototype.snapToInArray = /**
        * Snaps a value to the nearest value in an array.
        */
        function (input, arr, sort) {
            if (typeof sort === "undefined") { sort = true; }
            if(sort) {
                arr.sort();
            }
            if(input < arr[0]) {
                return arr[0];
            }
            var i = 1;
            while(arr[i] < input) {
                i++;
            }
            var low = arr[i - 1];
            var high = (i < arr.length) ? arr[i] : Number.POSITIVE_INFINITY;
            return ((high - input) <= (input - low)) ? high : low;
        };
        GameMath.prototype.roundTo = /**
        * roundTo some place comparative to a 'base', default is 10 for decimal place
        *
        * 'place' is represented by the power applied to 'base' to get that place
        *
        * @param value - the value to round
        * @param place - the place to round to
        * @param base - the base to round in... default is 10 for decimal
        *
        * e.g.
        *
        * 2000/7 ~= 285.714285714285714285714 ~= (bin)100011101.1011011011011011
        *
        * roundTo(2000/7,3) == 0
        * roundTo(2000/7,2) == 300
        * roundTo(2000/7,1) == 290
        * roundTo(2000/7,0) == 286
        * roundTo(2000/7,-1) == 285.7
        * roundTo(2000/7,-2) == 285.71
        * roundTo(2000/7,-3) == 285.714
        * roundTo(2000/7,-4) == 285.7143
        * roundTo(2000/7,-5) == 285.71429
        *
        * roundTo(2000/7,3,2)  == 288       -- 100100000
        * roundTo(2000/7,2,2)  == 284       -- 100011100
        * roundTo(2000/7,1,2)  == 286       -- 100011110
        * roundTo(2000/7,0,2)  == 286       -- 100011110
        * roundTo(2000/7,-1,2) == 285.5     -- 100011101.1
        * roundTo(2000/7,-2,2) == 285.75    -- 100011101.11
        * roundTo(2000/7,-3,2) == 285.75    -- 100011101.11
        * roundTo(2000/7,-4,2) == 285.6875  -- 100011101.1011
        * roundTo(2000/7,-5,2) == 285.71875 -- 100011101.10111
        *
        * note what occurs when we round to the 3rd space (8ths place), 100100000, this is to be assumed
        * because we are rounding 100011.1011011011011011 which rounds up.
        */
        function (value, place, base) {
            if (typeof place === "undefined") { place = 0; }
            if (typeof base === "undefined") { base = 10; }
            var p = Math.pow(base, -place);
            return Math.round(value * p) / p;
        };
        GameMath.prototype.floorTo = function (value, place, base) {
            if (typeof place === "undefined") { place = 0; }
            if (typeof base === "undefined") { base = 10; }
            var p = Math.pow(base, -place);
            return Math.floor(value * p) / p;
        };
        GameMath.prototype.ceilTo = function (value, place, base) {
            if (typeof place === "undefined") { place = 0; }
            if (typeof base === "undefined") { base = 10; }
            var p = Math.pow(base, -place);
            return Math.ceil(value * p) / p;
        };
        GameMath.prototype.interpolateFloat = /**
        * a one dimensional linear interpolation of a value.
        */
        function (a, b, weight) {
            return (b - a) * weight + a;
        };
        GameMath.prototype.radiansToDegrees = /**
        * convert radians to degrees
        */
        function (angle) {
            return angle * GameMath.RAD_TO_DEG;
        };
        GameMath.prototype.degreesToRadians = /**
        * convert degrees to radians
        */
        function (angle) {
            return angle * GameMath.DEG_TO_RAD;
        };
        GameMath.prototype.angleBetween = /**
        * Find the angle of a segment from (x1, y1) -> (x2, y2 )
        */
        function (x1, y1, x2, y2) {
            return Math.atan2(y2 - y1, x2 - x1);
        };
        GameMath.prototype.normalizeAngle = /**
        * set an angle with in the bounds of -PI to PI
        */
        function (angle, radians) {
            if (typeof radians === "undefined") { radians = true; }
            var rd = (radians) ? GameMath.PI : 180;
            return this.wrap(angle, rd, -rd);
        };
        GameMath.prototype.nearestAngleBetween = /**
        * closest angle between two angles from a1 to a2
        * absolute value the return for exact angle
        */
        function (a1, a2, radians) {
            if (typeof radians === "undefined") { radians = true; }
            var rd = (radians) ? GameMath.PI : 180;
            a1 = this.normalizeAngle(a1, radians);
            a2 = this.normalizeAngle(a2, radians);
            if(a1 < -rd / 2 && a2 > rd / 2) {
                a1 += rd * 2;
            }
            if(a2 < -rd / 2 && a1 > rd / 2) {
                a2 += rd * 2;
            }
            return a2 - a1;
        };
        GameMath.prototype.normalizeAngleToAnother = /**
        * normalizes independent and then sets dep to the nearest value respective to independent
        *
        * for instance if dep=-170 and ind=170 then 190 will be returned as an alternative to -170
        */
        function (dep, ind, radians) {
            if (typeof radians === "undefined") { radians = true; }
            return ind + this.nearestAngleBetween(ind, dep, radians);
        };
        GameMath.prototype.normalizeAngleAfterAnother = /**
        * normalize independent and dependent and then set dependent to an angle relative to 'after/clockwise' independent
        *
        * for instance dep=-170 and ind=170, then 190 will be reutrned as alternative to -170
        */
        function (dep, ind, radians) {
            if (typeof radians === "undefined") { radians = true; }
            dep = this.normalizeAngle(dep - ind, radians);
            return ind + dep;
        };
        GameMath.prototype.normalizeAngleBeforeAnother = /**
        * normalizes indendent and dependent and then sets dependent to an angle relative to 'before/counterclockwise' independent
        *
        * for instance dep = 190 and ind = 170, then -170 will be returned as an alternative to 190
        */
        function (dep, ind, radians) {
            if (typeof radians === "undefined") { radians = true; }
            dep = this.normalizeAngle(ind - dep, radians);
            return ind - dep;
        };
        GameMath.prototype.interpolateAngles = /**
        * interpolate across the shortest arc between two angles
        */
        function (a1, a2, weight, radians, ease) {
            if (typeof radians === "undefined") { radians = true; }
            if (typeof ease === "undefined") { ease = null; }
            a1 = this.normalizeAngle(a1, radians);
            a2 = this.normalizeAngleToAnother(a2, a1, radians);
            return (typeof ease === 'function') ? ease(weight, a1, a2 - a1, 1) : this.interpolateFloat(a1, a2, weight);
        };
        GameMath.prototype.logBaseOf = /**
        * Compute the logarithm of any value of any base
        *
        * a logarithm is the exponent that some constant (base) would have to be raised to
        * to be equal to value.
        *
        * i.e.
        * 4 ^ x = 16
        * can be rewritten as to solve for x
        * logB4(16) = x
        * which with this function would be
        * LoDMath.logBaseOf(16,4)
        *
        * which would return 2, because 4^2 = 16
        */
        function (value, base) {
            return Math.log(value) / Math.log(base);
        };
        GameMath.prototype.GCD = /**
        * Greatest Common Denominator using Euclid's algorithm
        */
        function (m, n) {
            var r;
            //make sure positive, GCD is always positive
            m = Math.abs(m);
            n = Math.abs(n);
            //m must be >= n
            if(m < n) {
                r = m;
                m = n;
                n = r;
            }
            //now start loop
            while(true) {
                r = m % n;
                if(!r) {
                    return n;
                }
                m = n;
                n = r;
            }
            return 1;
        };
        GameMath.prototype.LCM = /**
        * Lowest Common Multiple
        */
        function (m, n) {
            return (m * n) / this.GCD(m, n);
        };
        GameMath.prototype.factorial = /**
        * Factorial - N!
        *
        * simple product series
        *
        * by definition:
        * 0! == 1
        */
        function (value) {
            if(value == 0) {
                return 1;
            }
            var res = value;
            while(--value) {
                res *= value;
            }
            return res;
        };
        GameMath.prototype.gammaFunction = /**
        * gamma function
        *
        * defined: gamma(N) == (N - 1)!
        */
        function (value) {
            return this.factorial(value - 1);
        };
        GameMath.prototype.fallingFactorial = /**
        * falling factorial
        *
        * defined: (N)! / (N - x)!
        *
        * written subscript: (N)x OR (base)exp
        */
        function (base, exp) {
            return this.factorial(base) / this.factorial(base - exp);
        };
        GameMath.prototype.risingFactorial = /**
        * rising factorial
        *
        * defined: (N + x - 1)! / (N - 1)!
        *
        * written superscript N^(x) OR base^(exp)
        */
        function (base, exp) {
            //expanded from gammaFunction for speed
            return this.factorial(base + exp - 1) / this.factorial(base - 1);
        };
        GameMath.prototype.binCoef = /**
        * binomial coefficient
        *
        * defined: N! / (k!(N-k)!)
        * reduced: N! / (N-k)! == (N)k (fallingfactorial)
        * reduced: (N)k / k!
        */
        function (n, k) {
            return this.fallingFactorial(n, k) / this.factorial(k);
        };
        GameMath.prototype.risingBinCoef = /**
        * rising binomial coefficient
        *
        * as one can notice in the analysis of binCoef(...) that
        * binCoef is the (N)k divided by k!. Similarly rising binCoef
        * is merely N^(k) / k!
        */
        function (n, k) {
            return this.risingFactorial(n, k) / this.factorial(k);
        };
        GameMath.prototype.chanceRoll = /**
        * Generate a random boolean result based on the chance value
        * <p>
        * Returns true or false based on the chance value (default 50%). For example if you wanted a player to have a 30% chance
        * of getting a bonus, call chanceRoll(30) - true means the chance passed, false means it failed.
        * </p>
        * @param chance The chance of receiving the value. A number between 0 and 100 (effectively 0% to 100%)
        * @return true if the roll passed, or false
        */
        function (chance) {
            if (typeof chance === "undefined") { chance = 50; }
            if(chance <= 0) {
                return false;
            } else if(chance >= 100) {
                return true;
            } else {
                if(Math.random() * 100 >= chance) {
                    return false;
                } else {
                    return true;
                }
            }
        };
        GameMath.prototype.maxAdd = /**
        * Adds the given amount to the value, but never lets the value go over the specified maximum
        *
        * @param value The value to add the amount to
        * @param amount The amount to add to the value
        * @param max The maximum the value is allowed to be
        * @return The new value
        */
        function (value, amount, max) {
            value += amount;
            if(value > max) {
                value = max;
            }
            return value;
        };
        GameMath.prototype.minSub = /**
        * Subtracts the given amount from the value, but never lets the value go below the specified minimum
        *
        * @param value The base value
        * @param amount The amount to subtract from the base value
        * @param min The minimum the value is allowed to be
        * @return The new value
        */
        function (value, amount, min) {
            value -= amount;
            if(value < min) {
                value = min;
            }
            return value;
        };
        GameMath.prototype.wrapValue = /**
        * Adds value to amount and ensures that the result always stays between 0 and max, by wrapping the value around.
        * <p>Values must be positive integers, and are passed through Math.abs</p>
        *
        * @param value The value to add the amount to
        * @param amount The amount to add to the value
        * @param max The maximum the value is allowed to be
        * @return The wrapped value
        */
        function (value, amount, max) {
            var diff;
            value = Math.abs(value);
            amount = Math.abs(amount);
            max = Math.abs(max);
            diff = (value + amount) % max;
            return diff;
        };
        GameMath.prototype.randomSign = /**
        * Randomly returns either a 1 or -1
        *
        * @return	1 or -1
        */
        function () {
            return (Math.random() > 0.5) ? 1 : -1;
        };
        GameMath.prototype.isOdd = /**
        * Returns true if the number given is odd.
        *
        * @param	n	The number to check
        *
        * @return	True if the given number is odd. False if the given number is even.
        */
        function (n) {
            if(n & 1) {
                return true;
            } else {
                return false;
            }
        };
        GameMath.prototype.isEven = /**
        * Returns true if the number given is even.
        *
        * @param	n	The number to check
        *
        * @return	True if the given number is even. False if the given number is odd.
        */
        function (n) {
            if(n & 1) {
                return false;
            } else {
                return true;
            }
        };
        GameMath.prototype.wrapAngle = /**
        * Keeps an angle value between -180 and +180<br>
        * Should be called whenever the angle is updated on the Sprite to stop it from going insane.
        *
        * @param	angle	The angle value to check
        *
        * @return	The new angle value, returns the same as the input angle if it was within bounds
        */
        function (angle) {
            var result = angle;
            //  Nothing needs to change
            if(angle >= -180 && angle <= 180) {
                return angle;
            }
            //  Else normalise it to -180, 180
            result = (angle + 180) % 360;
            if(result < 0) {
                result += 360;
            }
            return result - 180;
        };
        GameMath.prototype.angleLimit = /**
        * Keeps an angle value between the given min and max values
        *
        * @param	angle	The angle value to check. Must be between -180 and +180
        * @param	min		The minimum angle that is allowed (must be -180 or greater)
        * @param	max		The maximum angle that is allowed (must be 180 or less)
        *
        * @return	The new angle value, returns the same as the input angle if it was within bounds
        */
        function (angle, min, max) {
            var result = angle;
            if(angle > max) {
                result = max;
            } else if(angle < min) {
                result = min;
            }
            return result;
        };
        GameMath.prototype.linearInterpolation = /**
        * @method linear
        * @param {Any} v
        * @param {Any} k
        * @static
        */
        function (v, k) {
            var m = v.length - 1;
            var f = m * k;
            var i = Math.floor(f);
            if(k < 0) {
                return this.linear(v[0], v[1], f);
            }
            if(k > 1) {
                return this.linear(v[m], v[m - 1], m - f);
            }
            return this.linear(v[i], v[i + 1 > m ? m : i + 1], f - i);
        };
        GameMath.prototype.bezierInterpolation = /**
        * @method Bezier
        * @param {Any} v
        * @param {Any} k
        * @static
        */
        function (v, k) {
            var b = 0;
            var n = v.length - 1;
            for(var i = 0; i <= n; i++) {
                b += Math.pow(1 - k, n - i) * Math.pow(k, i) * v[i] * this.bernstein(n, i);
            }
            return b;
        };
        GameMath.prototype.catmullRomInterpolation = /**
        * @method CatmullRom
        * @param {Any} v
        * @param {Any} k
        * @static
        */
        function (v, k) {
            var m = v.length - 1;
            var f = m * k;
            var i = Math.floor(f);
            if(v[0] === v[m]) {
                if(k < 0) {
                    i = Math.floor(f = m * (1 + k));
                }
                return this.catmullRom(v[(i - 1 + m) % m], v[i], v[(i + 1) % m], v[(i + 2) % m], f - i);
            } else {
                if(k < 0) {
                    return v[0] - (this.catmullRom(v[0], v[0], v[1], v[1], -f) - v[0]);
                }
                if(k > 1) {
                    return v[m] - (this.catmullRom(v[m], v[m], v[m - 1], v[m - 1], f - m) - v[m]);
                }
                return this.catmullRom(v[i ? i - 1 : 0], v[i], v[m < i + 1 ? m : i + 1], v[m < i + 2 ? m : i + 2], f - i);
            }
        };
        GameMath.prototype.linear = /**
        * @method Linear
        * @param {Any} p0
        * @param {Any} p1
        * @param {Any} t
        * @static
        */
        function (p0, p1, t) {
            return (p1 - p0) * t + p0;
        };
        GameMath.prototype.bernstein = /**
        * @method Bernstein
        * @param {Any} n
        * @param {Any} i
        * @static
        */
        function (n, i) {
            return this.factorial(n) / this.factorial(i) / this.factorial(n - i);
        };
        GameMath.prototype.catmullRom = /**
        * @method CatmullRom
        * @param {Any} p0
        * @param {Any} p1
        * @param {Any} p2
        * @param {Any} p3
        * @param {Any} t
        * @static
        */
        function (p0, p1, p2, p3, t) {
            var v0 = (p2 - p0) * 0.5, v1 = (p3 - p1) * 0.5, t2 = t * t, t3 = t * t2;
            return (2 * p1 - 2 * p2 + v0 + v1) * t3 + (-3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 + v0 * t + p1;
        };
        GameMath.prototype.difference = function (a, b) {
            return Math.abs(a - b);
        };
        GameMath.prototype.random = /**
        * Generates a random number.  Deterministic, meaning safe
        * to use if you want to record replays in random environments.
        *
        * @return	A <code>Number</code> between 0 and 1.
        */
        function () {
            return this.globalSeed = this.srand(this.globalSeed);
        };
        GameMath.prototype.srand = /**
        * Generates a random number based on the seed provided.
        *
        * @param	Seed	A number between 0 and 1, used to generate a predictable random number (very optional).
        *
        * @return	A <code>Number</code> between 0 and 1.
        */
        function (Seed) {
            return ((69621 * (Seed * 0x7FFFFFFF)) % 0x7FFFFFFF) / 0x7FFFFFFF;
        };
        GameMath.prototype.getRandom = /**
        * Fetch a random entry from the given array.
        * Will return null if random selection is missing, or array has no entries.
        * <code>G.getRandom()</code> is deterministic and safe for use with replays/recordings.
        * HOWEVER, <code>U.getRandom()</code> is NOT deterministic and unsafe for use with replays/recordings.
        *
        * @param	Objects		An array of objects.
        * @param	StartIndex	Optional offset off the front of the array. Default value is 0, or the beginning of the array.
        * @param	Length		Optional restriction on the number of values you want to randomly select from.
        *
        * @return	The random object that was selected.
        */
        function (Objects, StartIndex, Length) {
            if (typeof StartIndex === "undefined") { StartIndex = 0; }
            if (typeof Length === "undefined") { Length = 0; }
            if(Objects != null) {
                var l = Length;
                if((l == 0) || (l > Objects.length - StartIndex)) {
                    l = Objects.length - StartIndex;
                }
                if(l > 0) {
                    return Objects[StartIndex + Math.floor(Math.random() * l)];
                }
            }
            return null;
        };
        GameMath.prototype.floor = /**
        * Round down to the next whole number. E.g. floor(1.7) == 1, and floor(-2.7) == -2.
        *
        * @param	Value	Any number.
        *
        * @return	The rounded value of that number.
        */
        function (Value) {
            var n = Value | 0;
            return (Value > 0) ? (n) : ((n != Value) ? (n - 1) : (n));
        };
        GameMath.prototype.ceil = /**
        * Round up to the next whole number.  E.g. ceil(1.3) == 2, and ceil(-2.3) == -3.
        *
        * @param	Value	Any number.
        *
        * @return	The rounded value of that number.
        */
        function (Value) {
            var n = Value | 0;
            return (Value > 0) ? ((n != Value) ? (n + 1) : (n)) : (n);
        };
        GameMath.prototype.sinCosGenerator = /**
        * Generate a sine and cosine table simultaneously and extremely quickly. Based on research by Franky of scene.at
        * <p>
        * The parameters allow you to specify the length, amplitude and frequency of the wave. Once you have called this function
        * you should get the results via getSinTable() and getCosTable(). This generator is fast enough to be used in real-time.
        * </p>
        * @param length 		The length of the wave
        * @param sinAmplitude 	The amplitude to apply to the sine table (default 1.0) if you need values between say -+ 125 then give 125 as the value
        * @param cosAmplitude 	The amplitude to apply to the cosine table (default 1.0) if you need values between say -+ 125 then give 125 as the value
        * @param frequency 	The frequency of the sine and cosine table data
        * @return	Returns the sine table
        * @see getSinTable
        * @see getCosTable
        */
        function (length, sinAmplitude, cosAmplitude, frequency) {
            if (typeof sinAmplitude === "undefined") { sinAmplitude = 1.0; }
            if (typeof cosAmplitude === "undefined") { cosAmplitude = 1.0; }
            if (typeof frequency === "undefined") { frequency = 1.0; }
            var sin = sinAmplitude;
            var cos = cosAmplitude;
            var frq = frequency * Math.PI / length;
            this.cosTable = [];
            this.sinTable = [];
            for(var c = 0; c < length; c++) {
                cos -= sin * frq;
                sin += cos * frq;
                this.cosTable[c] = cos;
                this.sinTable[c] = sin;
            }
            return this.sinTable;
        };
        GameMath.prototype.vectorLength = /**
        * Finds the length of the given vector
        *
        * @param	dx
        * @param	dy
        *
        * @return
        */
        function (dx, dy) {
            return Math.sqrt(dx * dx + dy * dy);
        };
        GameMath.prototype.dotProduct = /**
        * Finds the dot product value of two vectors
        *
        * @param	ax		Vector X
        * @param	ay		Vector Y
        * @param	bx		Vector X
        * @param	by		Vector Y
        *
        * @return	Dot product
        */
        function (ax, ay, bx, by) {
            return ax * bx + ay * by;
        };
        return GameMath;
    })();
    Phaser.GameMath = GameMath;    
})(Phaser || (Phaser = {}));
/// <reference path="Basic.ts" />
/// <reference path="Game.ts" />
/**
* Phaser - Group
*
* This class is used for organising, updating and sorting game objects.
*
*/
var Phaser;
(function (Phaser) {
    var Group = (function (_super) {
        __extends(Group, _super);
        function Group(game, MaxSize) {
            if (typeof MaxSize === "undefined") { MaxSize = 0; }
                _super.call(this, game);
            this.isGroup = true;
            this.members = [];
            this.length = 0;
            this._maxSize = MaxSize;
            this._marker = 0;
            this._sortIndex = null;
        }
        Group.ASCENDING = -1;
        Group.DESCENDING = 1;
        Group.prototype.destroy = /**
        * Override this function to handle any deleting or "shutdown" type operations you might need,
        * such as removing traditional Flash children like Basic objects.
        */
        function () {
            if(this.members != null) {
                var basic;
                var i = 0;
                while(i < this.length) {
                    basic = this.members[i++];
                    if(basic != null) {
                        basic.destroy();
                    }
                }
                this.members.length = 0;
            }
            this._sortIndex = null;
        };
        Group.prototype.update = /**
        * Automatically goes through and calls update on everything you added.
        */
        function () {
            var basic;
            var i = 0;
            while(i < this.length) {
                basic = this.members[i++];
                if((basic != null) && basic.exists && basic.active) {
                    basic.preUpdate();
                    basic.update();
                    basic.postUpdate();
                }
            }
        };
        Group.prototype.render = /**
        * Automatically goes through and calls render on everything you added.
        */
        function (camera, cameraOffsetX, cameraOffsetY) {
            var basic;
            var i = 0;
            while(i < this.length) {
                basic = this.members[i++];
                if((basic != null) && basic.exists && basic.visible) {
                    basic.render(camera, cameraOffsetX, cameraOffsetY);
                }
            }
        };
        Object.defineProperty(Group.prototype, "maxSize", {
            get: /**
            * The maximum capacity of this group.  Default is 0, meaning no max capacity, and the group can just grow.
            */
            function () {
                return this._maxSize;
            },
            set: /**
            * @private
            */
            function (Size) {
                this._maxSize = Size;
                if(this._marker >= this._maxSize) {
                    this._marker = 0;
                }
                if((this._maxSize == 0) || (this.members == null) || (this._maxSize >= this.members.length)) {
                    return;
                }
                //If the max size has shrunk, we need to get rid of some objects
                var basic;
                var i = this._maxSize;
                var l = this.members.length;
                while(i < l) {
                    basic = this.members[i++];
                    if(basic != null) {
                        basic.destroy();
                    }
                }
                this.length = this.members.length = this._maxSize;
            },
            enumerable: true,
            configurable: true
        });
        Group.prototype.add = /**
        * Adds a new <code>Basic</code> subclass (Basic, Basic, Enemy, etc) to the group.
        * Group will try to replace a null member of the array first.
        * Failing that, Group will add it to the end of the member array,
        * assuming there is room for it, and doubling the size of the array if necessary.
        *
        * <p>WARNING: If the group has a maxSize that has already been met,
        * the object will NOT be added to the group!</p>
        *
        * @param	Object		The object you want to add to the group.
        *
        * @return	The same <code>Basic</code> object that was passed in.
        */
        function (Object) {
            //Don't bother adding an object twice.
            if(this.members.indexOf(Object) >= 0) {
                return Object;
            }
            //First, look for a null entry where we can add the object.
            var i = 0;
            var l = this.members.length;
            while(i < l) {
                if(this.members[i] == null) {
                    this.members[i] = Object;
                    if(i >= this.length) {
                        this.length = i + 1;
                    }
                    return Object;
                }
                i++;
            }
            //Failing that, expand the array (if we can) and add the object.
            if(this._maxSize > 0) {
                if(this.members.length >= this._maxSize) {
                    return Object;
                } else if(this.members.length * 2 <= this._maxSize) {
                    this.members.length *= 2;
                } else {
                    this.members.length = this._maxSize;
                }
            } else {
                this.members.length *= 2;
            }
            //If we made it this far, then we successfully grew the group,
            //and we can go ahead and add the object at the first open slot.
            this.members[i] = Object;
            this.length = i + 1;
            return Object;
        };
        Group.prototype.recycle = /**
        * Recycling is designed to help you reuse game objects without always re-allocating or "newing" them.
        *
        * <p>If you specified a maximum size for this group (like in Emitter),
        * then recycle will employ what we're calling "rotating" recycling.
        * Recycle() will first check to see if the group is at capacity yet.
        * If group is not yet at capacity, recycle() returns a new object.
        * If the group IS at capacity, then recycle() just returns the next object in line.</p>
        *
        * <p>If you did NOT specify a maximum size for this group,
        * then recycle() will employ what we're calling "grow-style" recycling.
        * Recycle() will return either the first object with exists == false,
        * or, finding none, add a new object to the array,
        * doubling the size of the array if necessary.</p>
        *
        * <p>WARNING: If this function needs to create a new object,
        * and no object class was provided, it will return null
        * instead of a valid object!</p>
        *
        * @param	ObjectClass		The class type you want to recycle (e.g. Basic, EvilRobot, etc). Do NOT "new" the class in the parameter!
        *
        * @return	A reference to the object that was created.  Don't forget to cast it back to the Class you want (e.g. myObject = myGroup.recycle(myObjectClass) as myObjectClass;).
        */
        function (ObjectClass) {
            if (typeof ObjectClass === "undefined") { ObjectClass = null; }
            var basic;
            if(this._maxSize > 0) {
                if(this.length < this._maxSize) {
                    if(ObjectClass == null) {
                        return null;
                    }
                    return this.add(new ObjectClass());
                } else {
                    basic = this.members[this._marker++];
                    if(this._marker >= this._maxSize) {
                        this._marker = 0;
                    }
                    return basic;
                }
            } else {
                basic = this.getFirstAvailable(ObjectClass);
                if(basic != null) {
                    return basic;
                }
                if(ObjectClass == null) {
                    return null;
                }
                return this.add(new ObjectClass());
            }
        };
        Group.prototype.remove = /**
        * Removes an object from the group.
        *
        * @param	Object	The <code>Basic</code> you want to remove.
        * @param	Splice	Whether the object should be cut from the array entirely or not.
        *
        * @return	The removed object.
        */
        function (Object, Splice) {
            if (typeof Splice === "undefined") { Splice = false; }
            var index = this.members.indexOf(Object);
            if((index < 0) || (index >= this.members.length)) {
                return null;
            }
            if(Splice) {
                this.members.splice(index, 1);
                this.length--;
            } else {
                this.members[index] = null;
            }
            return Object;
        };
        Group.prototype.replace = /**
        * Replaces an existing <code>Basic</code> with a new one.
        *
        * @param	OldObject	The object you want to replace.
        * @param	NewObject	The new object you want to use instead.
        *
        * @return	The new object.
        */
        function (OldObject, NewObject) {
            var index = this.members.indexOf(OldObject);
            if((index < 0) || (index >= this.members.length)) {
                return null;
            }
            this.members[index] = NewObject;
            return NewObject;
        };
        Group.prototype.sort = /**
        * Call this function to sort the group according to a particular value and order.
        * For example, to sort game objects for Zelda-style overlaps you might call
        * <code>myGroup.sort("y",Group.ASCENDING)</code> at the bottom of your
        * <code>State.update()</code> override.  To sort all existing objects after
        * a big explosion or bomb attack, you might call <code>myGroup.sort("exists",Group.DESCENDING)</code>.
        *
        * @param	Index	The <code>string</code> name of the member variable you want to sort on.  Default value is "y".
        * @param	Order	A <code>Group</code> constant that defines the sort order.  Possible values are <code>Group.ASCENDING</code> and <code>Group.DESCENDING</code>.  Default value is <code>Group.ASCENDING</code>.
        */
        function (Index, Order) {
            if (typeof Index === "undefined") { Index = "y"; }
            if (typeof Order === "undefined") { Order = Group.ASCENDING; }
            this._sortIndex = Index;
            this._sortOrder = Order;
            this.members.sort(this.sortHandler);
        };
        Group.prototype.setAll = /**
        * Go through and set the specified variable to the specified value on all members of the group.
        *
        * @param	VariableName	The string representation of the variable name you want to modify, for example "visible" or "scrollFactor".
        * @param	Value			The value you want to assign to that variable.
        * @param	Recurse			Default value is true, meaning if <code>setAll()</code> encounters a member that is a group, it will call <code>setAll()</code> on that group rather than modifying its variable.
        */
        function (VariableName, Value, Recurse) {
            if (typeof Recurse === "undefined") { Recurse = true; }
            var basic;
            var i = 0;
            while(i < length) {
                basic = this.members[i++];
                if(basic != null) {
                    if(Recurse && (basic.isGroup == true)) {
                        basic['setAll'](VariableName, Value, Recurse);
                    } else {
                        basic[VariableName] = Value;
                    }
                }
            }
        };
        Group.prototype.callAll = /**
        * Go through and call the specified function on all members of the group.
        * Currently only works on functions that have no required parameters.
        *
        * @param	FunctionName	The string representation of the function you want to call on each object, for example "kill()" or "init()".
        * @param	Recurse			Default value is true, meaning if <code>callAll()</code> encounters a member that is a group, it will call <code>callAll()</code> on that group rather than calling the group's function.
        */
        function (FunctionName, Recurse) {
            if (typeof Recurse === "undefined") { Recurse = true; }
            var basic;
            var i = 0;
            while(i < this.length) {
                basic = this.members[i++];
                if(basic != null) {
                    if(Recurse && (basic.isGroup == true)) {
                        basic['callAll'](FunctionName, Recurse);
                    } else {
                        basic[FunctionName]();
                    }
                }
            }
        };
        Group.prototype.forEach = function (callback, Recurse) {
            if (typeof Recurse === "undefined") { Recurse = false; }
            var basic;
            var i = 0;
            while(i < this.length) {
                basic = this.members[i++];
                if(basic != null) {
                    if(Recurse && (basic.isGroup == true)) {
                        basic.forEach(callback, true);
                    } else {
                        callback.call(this, basic);
                    }
                }
            }
        };
        Group.prototype.getFirstAvailable = /**
        * Call this function to retrieve the first object with exists == false in the group.
        * This is handy for recycling in general, e.g. respawning enemies.
        *
        * @param	ObjectClass		An optional parameter that lets you narrow the results to instances of this particular class.
        *
        * @return	A <code>Basic</code> currently flagged as not existing.
        */
        function (ObjectClass) {
            if (typeof ObjectClass === "undefined") { ObjectClass = null; }
            var basic;
            var i = 0;
            while(i < this.length) {
                basic = this.members[i++];
                if((basic != null) && !basic.exists && ((ObjectClass == null) || (typeof basic === ObjectClass))) {
                    return basic;
                }
            }
            return null;
        };
        Group.prototype.getFirstNull = /**
        * Call this function to retrieve the first index set to 'null'.
        * Returns -1 if no index stores a null object.
        *
        * @return	An <code>int</code> indicating the first null slot in the group.
        */
        function () {
            var basic;
            var i = 0;
            var l = this.members.length;
            while(i < l) {
                if(this.members[i] == null) {
                    return i;
                } else {
                    i++;
                }
            }
            return -1;
        };
        Group.prototype.getFirstExtant = /**
        * Call this function to retrieve the first object with exists == true in the group.
        * This is handy for checking if everything's wiped out, or choosing a squad leader, etc.
        *
        * @return	A <code>Basic</code> currently flagged as existing.
        */
        function () {
            var basic;
            var i = 0;
            while(i < length) {
                basic = this.members[i++];
                if((basic != null) && basic.exists) {
                    return basic;
                }
            }
            return null;
        };
        Group.prototype.getFirstAlive = /**
        * Call this function to retrieve the first object with dead == false in the group.
        * This is handy for checking if everything's wiped out, or choosing a squad leader, etc.
        *
        * @return	A <code>Basic</code> currently flagged as not dead.
        */
        function () {
            var basic;
            var i = 0;
            while(i < this.length) {
                basic = this.members[i++];
                if((basic != null) && basic.exists && basic.alive) {
                    return basic;
                }
            }
            return null;
        };
        Group.prototype.getFirstDead = /**
        * Call this function to retrieve the first object with dead == true in the group.
        * This is handy for checking if everything's wiped out, or choosing a squad leader, etc.
        *
        * @return	A <code>Basic</code> currently flagged as dead.
        */
        function () {
            var basic;
            var i = 0;
            while(i < this.length) {
                basic = this.members[i++];
                if((basic != null) && !basic.alive) {
                    return basic;
                }
            }
            return null;
        };
        Group.prototype.countLiving = /**
        * Call this function to find out how many members of the group are not dead.
        *
        * @return	The number of <code>Basic</code>s flagged as not dead.  Returns -1 if group is empty.
        */
        function () {
            var count = -1;
            var basic;
            var i = 0;
            while(i < this.length) {
                basic = this.members[i++];
                if(basic != null) {
                    if(count < 0) {
                        count = 0;
                    }
                    if(basic.exists && basic.alive) {
                        count++;
                    }
                }
            }
            return count;
        };
        Group.prototype.countDead = /**
        * Call this function to find out how many members of the group are dead.
        *
        * @return	The number of <code>Basic</code>s flagged as dead.  Returns -1 if group is empty.
        */
        function () {
            var count = -1;
            var basic;
            var i = 0;
            while(i < this.length) {
                basic = this.members[i++];
                if(basic != null) {
                    if(count < 0) {
                        count = 0;
                    }
                    if(!basic.alive) {
                        count++;
                    }
                }
            }
            return count;
        };
        Group.prototype.getRandom = /**
        * Returns a member at random from the group.
        *
        * @param	StartIndex	Optional offset off the front of the array. Default value is 0, or the beginning of the array.
        * @param	Length		Optional restriction on the number of values you want to randomly select from.
        *
        * @return	A <code>Basic</code> from the members list.
        */
        function (StartIndex, Length) {
            if (typeof StartIndex === "undefined") { StartIndex = 0; }
            if (typeof Length === "undefined") { Length = 0; }
            if(Length == 0) {
                Length = this.length;
            }
            return this._game.math.getRandom(this.members, StartIndex, Length);
        };
        Group.prototype.clear = /**
        * Remove all instances of <code>Basic</code> subclass (Basic, Block, etc) from the list.
        * WARNING: does not destroy() or kill() any of these objects!
        */
        function () {
            this.length = this.members.length = 0;
        };
        Group.prototype.kill = /**
        * Calls kill on the group's members and then on the group itself.
        */
        function () {
            var basic;
            var i = 0;
            while(i < this.length) {
                basic = this.members[i++];
                if((basic != null) && basic.exists) {
                    basic.kill();
                }
            }
        };
        Group.prototype.sortHandler = /**
        * Helper function for the sort process.
        *
        * @param 	Obj1	The first object being sorted.
        * @param	Obj2	The second object being sorted.
        *
        * @return	An integer value: -1 (Obj1 before Obj2), 0 (same), or 1 (Obj1 after Obj2).
        */
        function (Obj1, Obj2) {
            if(Obj1[this._sortIndex] < Obj2[this._sortIndex]) {
                return this._sortOrder;
            } else if(Obj1[this._sortIndex] > Obj2[this._sortIndex]) {
                return -this._sortOrder;
            }
            return 0;
        };
        return Group;
    })(Phaser.Basic);
    Phaser.Group = Group;    
})(Phaser || (Phaser = {}));
/// <reference path="Game.ts" />
/**
* Phaser - Loader
*
* The Loader handles loading all external content such as Images, Sounds, Texture Atlases and data files.
* It uses a combination of Image() loading and xhr and provides for progress and completion callbacks.
*/
var Phaser;
(function (Phaser) {
    var Loader = (function () {
        function Loader(game, callback) {
            this._game = game;
            this._gameCreateComplete = callback;
            this._keys = [];
            this._fileList = {
            };
            this._xhr = new XMLHttpRequest();
        }
        Loader.prototype.checkKeyExists = function (key) {
            if(this._fileList[key]) {
                return true;
            } else {
                return false;
            }
        };
        Loader.prototype.addImageFile = function (key, url) {
            if(this.checkKeyExists(key) === false) {
                this._fileList[key] = {
                    type: 'image',
                    key: key,
                    url: url,
                    data: null,
                    error: false,
                    loaded: false
                };
                this._keys.push(key);
            }
        };
        Loader.prototype.addSpriteSheet = function (key, url, frameWidth, frameHeight, frameMax) {
            if (typeof frameMax === "undefined") { frameMax = -1; }
            if(this.checkKeyExists(key) === false) {
                this._fileList[key] = {
                    type: 'spritesheet',
                    key: key,
                    url: url,
                    data: null,
                    frameWidth: frameWidth,
                    frameHeight: frameHeight,
                    frameMax: frameMax,
                    error: false,
                    loaded: false
                };
                this._keys.push(key);
            }
        };
        Loader.prototype.addTextureAtlas = function (key, url, jsonURL, jsonData) {
            if (typeof jsonURL === "undefined") { jsonURL = null; }
            if (typeof jsonData === "undefined") { jsonData = null; }
            //console.log('addTextureAtlas');
            //console.log(typeof jsonData);
            if(this.checkKeyExists(key) === false) {
                if(jsonURL !== null) {
                    //console.log('A URL to a json file has been given');
                    //  A URL to a json file has been given
                    this._fileList[key] = {
                        type: 'textureatlas',
                        key: key,
                        url: url,
                        data: null,
                        jsonURL: jsonURL,
                        jsonData: null,
                        error: false,
                        loaded: false
                    };
                    this._keys.push(key);
                } else {
                    //  A json string or object has been given
                    if(typeof jsonData === 'string') {
                        //console.log('A json string has been given');
                        var data = JSON.parse(jsonData);
                        //console.log(data);
                        //  Malformed?
                        if(data['frames']) {
                            //console.log('frames array found');
                            this._fileList[key] = {
                                type: 'textureatlas',
                                key: key,
                                url: url,
                                data: null,
                                jsonURL: null,
                                jsonData: data['frames'],
                                error: false,
                                loaded: false
                            };
                            this._keys.push(key);
                        }
                    } else {
                        //console.log('A json object has been given', jsonData);
                        //  Malformed?
                        if(jsonData['frames']) {
                            //console.log('frames array found');
                            this._fileList[key] = {
                                type: 'textureatlas',
                                key: key,
                                url: url,
                                data: null,
                                jsonURL: null,
                                jsonData: jsonData['frames'],
                                error: false,
                                loaded: false
                            };
                            this._keys.push(key);
                        }
                    }
                }
            }
        };
        Loader.prototype.addAudioFile = function (key, url) {
            if(this.checkKeyExists(key) === false) {
                this._fileList[key] = {
                    type: 'audio',
                    key: key,
                    url: url,
                    data: null,
                    buffer: null,
                    error: false,
                    loaded: false
                };
                this._keys.push(key);
            }
        };
        Loader.prototype.addTextFile = function (key, url) {
            if(this.checkKeyExists(key) === false) {
                this._fileList[key] = {
                    type: 'text',
                    key: key,
                    url: url,
                    data: null,
                    error: false,
                    loaded: false
                };
                this._keys.push(key);
            }
        };
        Loader.prototype.removeFile = function (key) {
            delete this._fileList[key];
        };
        Loader.prototype.removeAll = function () {
            this._fileList = {
            };
        };
        Loader.prototype.load = function (onFileLoadCallback, onCompleteCallback) {
            if (typeof onFileLoadCallback === "undefined") { onFileLoadCallback = null; }
            if (typeof onCompleteCallback === "undefined") { onCompleteCallback = null; }
            this.progress = 0;
            this.hasLoaded = false;
            this._onComplete = onCompleteCallback;
            if(onCompleteCallback == null) {
                this._onComplete = this._game.onCreateCallback;
            }
            this._onFileLoad = onFileLoadCallback;
            if(this._keys.length > 0) {
                this._progressChunk = 100 / this._keys.length;
                this.loadFile();
            } else {
                this.progress = 1;
                this.hasLoaded = true;
                this._gameCreateComplete.call(this._game);
                if(this._onComplete !== null) {
                    this._onComplete.call(this._game.callbackContext);
                }
            }
        };
        Loader.prototype.loadFile = function () {
            var _this = this;
            var file = this._fileList[this._keys.pop()];
            //  Image or Data?
            switch(file.type) {
                case 'image':
                case 'spritesheet':
                case 'textureatlas':
                    file.data = new Image();
                    file.data.name = file.key;
                    file.data.onload = function () {
                        return _this.fileComplete(file.key);
                    };
                    file.data.onerror = function () {
                        return _this.fileError(file.key);
                    };
                    file.data.src = file.url;
                    break;
                case 'audio':
                    this._xhr.open("GET", file.url, true);
                    this._xhr.responseType = "arraybuffer";
                    this._xhr.onload = function () {
                        return _this.fileComplete(file.key);
                    };
                    this._xhr.onerror = function () {
                        return _this.fileError(file.key);
                    };
                    this._xhr.send();
                    break;
                case 'text':
                    this._xhr.open("GET", file.url, true);
                    this._xhr.responseType = "text";
                    this._xhr.onload = function () {
                        return _this.fileComplete(file.key);
                    };
                    this._xhr.onerror = function () {
                        return _this.fileError(file.key);
                    };
                    this._xhr.send();
                    break;
            }
        };
        Loader.prototype.fileError = function (key) {
            this._fileList[key].loaded = true;
            this._fileList[key].error = true;
            this.nextFile(key, false);
        };
        Loader.prototype.fileComplete = function (key) {
            var _this = this;
            this._fileList[key].loaded = true;
            var file = this._fileList[key];
            var loadNext = true;
            switch(file.type) {
                case 'image':
                    this._game.cache.addImage(file.key, file.url, file.data);
                    break;
                case 'spritesheet':
                    this._game.cache.addSpriteSheet(file.key, file.url, file.data, file.frameWidth, file.frameHeight, file.frameMax);
                    break;
                case 'textureatlas':
                    //console.log('texture atlas loaded');
                    if(file.jsonURL == null) {
                        this._game.cache.addTextureAtlas(file.key, file.url, file.data, file.jsonData);
                    } else {
                        //  Load the JSON before carrying on with the next file
                        //console.log('Loading the JSON before carrying on with the next file');
                        loadNext = false;
                        this._xhr.open("GET", file.jsonURL, true);
                        this._xhr.responseType = "text";
                        this._xhr.onload = function () {
                            return _this.jsonLoadComplete(file.key);
                        };
                        this._xhr.onerror = function () {
                            return _this.jsonLoadError(file.key);
                        };
                        this._xhr.send();
                    }
                    break;
                case 'audio':
                    file.data = this._xhr.response;
                    this._game.cache.addSound(file.key, file.url, file.data);
                    break;
                case 'text':
                    file.data = this._xhr.response;
                    this._game.cache.addText(file.key, file.url, file.data);
                    break;
            }
            if(loadNext) {
                this.nextFile(key, true);
            }
        };
        Loader.prototype.jsonLoadComplete = function (key) {
            //console.log('json load complete');
            var data = JSON.parse(this._xhr.response);
            //console.log(data);
            //  Malformed?
            if(data['frames']) {
                var file = this._fileList[key];
                this._game.cache.addTextureAtlas(file.key, file.url, file.data, data['frames']);
            }
            this.nextFile(key, true);
        };
        Loader.prototype.jsonLoadError = function (key) {
            //console.log('json load error');
            var file = this._fileList[key];
            file.error = true;
            this.nextFile(key, true);
        };
        Loader.prototype.nextFile = function (previousKey, success) {
            this.progress = Math.round(this.progress + this._progressChunk);
            if(this._onFileLoad) {
                this._onFileLoad.call(this._game.callbackContext, this.progress, previousKey, success);
            }
            if(this._keys.length > 0) {
                this.loadFile();
            } else {
                this.hasLoaded = true;
                this.removeAll();
                this._gameCreateComplete.call(this._game);
                if(this._onComplete !== null) {
                    this._onComplete.call(this._game.callbackContext);
                }
            }
        };
        return Loader;
    })();
    Phaser.Loader = Loader;    
})(Phaser || (Phaser = {}));
/// <reference path="Game.ts" />
/// <reference path="gameobjects/GameObject.ts" />
/**
* Phaser - Motion
*
* The Motion class contains lots of useful functions for moving game objects around in world space.
*/
var Phaser;
(function (Phaser) {
    var Motion = (function () {
        function Motion(game) {
            this._game = game;
        }
        Motion.prototype.computeVelocity = /**
        * A tween-like function that takes a starting velocity and some other factors and returns an altered velocity.
        *
        * @param	Velocity		Any component of velocity (e.g. 20).
        * @param	Acceleration	Rate at which the velocity is changing.
        * @param	Drag			Really kind of a deceleration, this is how much the velocity changes if Acceleration is not set.
        * @param	Max				An absolute value cap for the velocity.
        *
        * @return	The altered Velocity value.
        */
        function (Velocity, Acceleration, Drag, Max) {
            if (typeof Acceleration === "undefined") { Acceleration = 0; }
            if (typeof Drag === "undefined") { Drag = 0; }
            if (typeof Max === "undefined") { Max = 10000; }
            if(Acceleration !== 0) {
                Velocity += Acceleration * this._game.time.elapsed;
            } else if(Drag !== 0) {
                var drag = Drag * this._game.time.elapsed;
                if(Velocity - drag > 0) {
                    Velocity = Velocity - drag;
                } else if(Velocity + drag < 0) {
                    Velocity += drag;
                } else {
                    Velocity = 0;
                }
            }
            if((Velocity != 0) && (Max != 10000)) {
                if(Velocity > Max) {
                    Velocity = Max;
                } else if(Velocity < -Max) {
                    Velocity = -Max;
                }
            }
            return Velocity;
        };
        Motion.prototype.velocityFromAngle = /**
        * Given the angle and speed calculate the velocity and return it as a Point
        *
        * @param	angle	The angle (in degrees) calculated in clockwise positive direction (down = 90 degrees positive, right = 0 degrees positive, up = 90 degrees negative)
        * @param	speed	The speed it will move, in pixels per second sq
        *
        * @return	A Point where Point.x contains the velocity x value and Point.y contains the velocity y value
        */
        function (angle, speed) {
            var a = this._game.math.degreesToRadians(angle);
            return new Phaser.Point((Math.cos(a) * speed), (Math.sin(a) * speed));
        };
        Motion.prototype.moveTowardsObject = /**
        * Sets the source Sprite x/y velocity so it will move directly towards the destination Sprite at the speed given (in pixels per second)<br>
        * If you specify a maxTime then it will adjust the speed (over-writing what you set) so it arrives at the destination in that number of seconds.<br>
        * Timings are approximate due to the way Flash timers work, and irrespective of SWF frame rate. Allow for a variance of +- 50ms.<br>
        * The source object doesn't stop moving automatically should it ever reach the destination coordinates.<br>
        * If you need the object to accelerate, see accelerateTowardsObject() instead
        * Note: Doesn't take into account acceleration, maxVelocity or drag (if you set drag or acceleration too high this object may not move at all)
        *
        * @param	source		The Sprite on which the velocity will be set
        * @param	dest		The Sprite where the source object will move to
        * @param	speed		The speed it will move, in pixels per second (default is 60 pixels/sec)
        * @param	maxTime		Time given in milliseconds (1000 = 1 sec). If set the speed is adjusted so the source will arrive at destination in the given number of ms
        */
        function (source, dest, speed, maxTime) {
            if (typeof speed === "undefined") { speed = 60; }
            if (typeof maxTime === "undefined") { maxTime = 0; }
            var a = this.angleBetween(source, dest);
            if(maxTime > 0) {
                var d = this.distanceBetween(source, dest);
                //	We know how many pixels we need to move, but how fast?
                speed = d / (maxTime / 1000);
            }
            source.velocity.x = Math.cos(a) * speed;
            source.velocity.y = Math.sin(a) * speed;
        };
        Motion.prototype.accelerateTowardsObject = /**
        * Sets the x/y acceleration on the source Sprite so it will move towards the destination Sprite at the speed given (in pixels per second)<br>
        * You must give a maximum speed value, beyond which the Sprite won't go any faster.<br>
        * If you don't need acceleration look at moveTowardsObject() instead.
        *
        * @param	source			The Sprite on which the acceleration will be set
        * @param	dest			The Sprite where the source object will move towards
        * @param	speed			The speed it will accelerate in pixels per second
        * @param	xSpeedMax		The maximum speed in pixels per second in which the sprite can move horizontally
        * @param	ySpeedMax		The maximum speed in pixels per second in which the sprite can move vertically
        */
        function (source, dest, speed, xSpeedMax, ySpeedMax) {
            var a = this.angleBetween(source, dest);
            source.velocity.x = 0;
            source.velocity.y = 0;
            source.acceleration.x = Math.cos(a) * speed;
            source.acceleration.y = Math.sin(a) * speed;
            source.maxVelocity.x = xSpeedMax;
            source.maxVelocity.y = ySpeedMax;
        };
        Motion.prototype.moveTowardsMouse = /**
        * Move the given Sprite towards the mouse pointer coordinates at a steady velocity
        * If you specify a maxTime then it will adjust the speed (over-writing what you set) so it arrives at the destination in that number of seconds.<br>
        * Timings are approximate due to the way Flash timers work, and irrespective of SWF frame rate. Allow for a variance of +- 50ms.<br>
        * The source object doesn't stop moving automatically should it ever reach the destination coordinates.<br>
        *
        * @param	source		The Sprite to move
        * @param	speed		The speed it will move, in pixels per second (default is 60 pixels/sec)
        * @param	maxTime		Time given in milliseconds (1000 = 1 sec). If set the speed is adjusted so the source will arrive at destination in the given number of ms
        */
        function (source, speed, maxTime) {
            if (typeof speed === "undefined") { speed = 60; }
            if (typeof maxTime === "undefined") { maxTime = 0; }
            var a = this.angleBetweenMouse(source);
            if(maxTime > 0) {
                var d = this.distanceToMouse(source);
                //	We know how many pixels we need to move, but how fast?
                speed = d / (maxTime / 1000);
            }
            source.velocity.x = Math.cos(a) * speed;
            source.velocity.y = Math.sin(a) * speed;
        };
        Motion.prototype.accelerateTowardsMouse = /**
        * Sets the x/y acceleration on the source Sprite so it will move towards the mouse coordinates at the speed given (in pixels per second)<br>
        * You must give a maximum speed value, beyond which the Sprite won't go any faster.<br>
        * If you don't need acceleration look at moveTowardsMouse() instead.
        *
        * @param	source			The Sprite on which the acceleration will be set
        * @param	speed			The speed it will accelerate in pixels per second
        * @param	xSpeedMax		The maximum speed in pixels per second in which the sprite can move horizontally
        * @param	ySpeedMax		The maximum speed in pixels per second in which the sprite can move vertically
        */
        function (source, speed, xSpeedMax, ySpeedMax) {
            var a = this.angleBetweenMouse(source);
            source.velocity.x = 0;
            source.velocity.y = 0;
            source.acceleration.x = Math.cos(a) * speed;
            source.acceleration.y = Math.sin(a) * speed;
            source.maxVelocity.x = xSpeedMax;
            source.maxVelocity.y = ySpeedMax;
        };
        Motion.prototype.moveTowardsPoint = /**
        * Sets the x/y velocity on the source Sprite so it will move towards the target coordinates at the speed given (in pixels per second)<br>
        * If you specify a maxTime then it will adjust the speed (over-writing what you set) so it arrives at the destination in that number of seconds.<br>
        * Timings are approximate due to the way Flash timers work, and irrespective of SWF frame rate. Allow for a variance of +- 50ms.<br>
        * The source object doesn't stop moving automatically should it ever reach the destination coordinates.<br>
        *
        * @param	source		The Sprite to move
        * @param	target		The Point coordinates to move the source Sprite towards
        * @param	speed		The speed it will move, in pixels per second (default is 60 pixels/sec)
        * @param	maxTime		Time given in milliseconds (1000 = 1 sec). If set the speed is adjusted so the source will arrive at destination in the given number of ms
        */
        function (source, target, speed, maxTime) {
            if (typeof speed === "undefined") { speed = 60; }
            if (typeof maxTime === "undefined") { maxTime = 0; }
            var a = this.angleBetweenPoint(source, target);
            if(maxTime > 0) {
                var d = this.distanceToPoint(source, target);
                //	We know how many pixels we need to move, but how fast?
                speed = d / (maxTime / 1000);
            }
            source.velocity.x = Math.cos(a) * speed;
            source.velocity.y = Math.sin(a) * speed;
        };
        Motion.prototype.accelerateTowardsPoint = /**
        * Sets the x/y acceleration on the source Sprite so it will move towards the target coordinates at the speed given (in pixels per second)<br>
        * You must give a maximum speed value, beyond which the Sprite won't go any faster.<br>
        * If you don't need acceleration look at moveTowardsPoint() instead.
        *
        * @param	source			The Sprite on which the acceleration will be set
        * @param	target			The Point coordinates to move the source Sprite towards
        * @param	speed			The speed it will accelerate in pixels per second
        * @param	xSpeedMax		The maximum speed in pixels per second in which the sprite can move horizontally
        * @param	ySpeedMax		The maximum speed in pixels per second in which the sprite can move vertically
        */
        function (source, target, speed, xSpeedMax, ySpeedMax) {
            var a = this.angleBetweenPoint(source, target);
            source.velocity.x = 0;
            source.velocity.y = 0;
            source.acceleration.x = Math.cos(a) * speed;
            source.acceleration.y = Math.sin(a) * speed;
            source.maxVelocity.x = xSpeedMax;
            source.maxVelocity.y = ySpeedMax;
        };
        Motion.prototype.distanceBetween = /**
        * Find the distance (in pixels, rounded) between two Sprites, taking their origin into account
        *
        * @param	a	The first Sprite
        * @param	b	The second Sprite
        * @return	int	Distance (in pixels)
        */
        function (a, b) {
            var dx = (a.x + a.origin.x) - (b.x + b.origin.x);
            var dy = (a.y + a.origin.y) - (b.y + b.origin.y);
            return this._game.math.vectorLength(dx, dy);
        };
        Motion.prototype.distanceToPoint = /**
        * Find the distance (in pixels, rounded) from an Sprite to the given Point, taking the source origin into account
        *
        * @param	a		The Sprite
        * @param	target	The Point
        * @return	int		Distance (in pixels)
        */
        function (a, target) {
            var dx = (a.x + a.origin.x) - (target.x);
            var dy = (a.y + a.origin.y) - (target.y);
            return this._game.math.vectorLength(dx, dy);
        };
        Motion.prototype.distanceToMouse = /**
        * Find the distance (in pixels, rounded) from the object x/y and the mouse x/y
        *
        * @param	a	The Sprite to test against
        * @return	int	The distance between the given sprite and the mouse coordinates
        */
        function (a) {
            var dx = (a.x + a.origin.x) - this._game.input.x;
            var dy = (a.y + a.origin.y) - this._game.input.y;
            return this._game.math.vectorLength(dx, dy);
        };
        Motion.prototype.angleBetweenPoint = /**
        * Find the angle (in radians) between an Sprite and an Point. The source sprite takes its x/y and origin into account.
        * The angle is calculated in clockwise positive direction (down = 90 degrees positive, right = 0 degrees positive, up = 90 degrees negative)
        *
        * @param	a			The Sprite to test from
        * @param	target		The Point to angle the Sprite towards
        * @param	asDegrees	If you need the value in degrees instead of radians, set to true
        *
        * @return	Number The angle (in radians unless asDegrees is true)
        */
        function (a, target, asDegrees) {
            if (typeof asDegrees === "undefined") { asDegrees = false; }
            var dx = (target.x) - (a.x + a.origin.x);
            var dy = (target.y) - (a.y + a.origin.y);
            if(asDegrees) {
                return this._game.math.radiansToDegrees(Math.atan2(dy, dx));
            } else {
                return Math.atan2(dy, dx);
            }
        };
        Motion.prototype.angleBetween = /**
        * Find the angle (in radians) between the two Sprite, taking their x/y and origin into account.
        * The angle is calculated in clockwise positive direction (down = 90 degrees positive, right = 0 degrees positive, up = 90 degrees negative)
        *
        * @param	a			The Sprite to test from
        * @param	b			The Sprite to test to
        * @param	asDegrees	If you need the value in degrees instead of radians, set to true
        *
        * @return	Number The angle (in radians unless asDegrees is true)
        */
        function (a, b, asDegrees) {
            if (typeof asDegrees === "undefined") { asDegrees = false; }
            var dx = (b.x + b.origin.x) - (a.x + a.origin.x);
            var dy = (b.y + b.origin.y) - (a.y + a.origin.y);
            if(asDegrees) {
                return this._game.math.radiansToDegrees(Math.atan2(dy, dx));
            } else {
                return Math.atan2(dy, dx);
            }
        };
        Motion.prototype.velocityFromFacing = /**
        * Given the GameObject and speed calculate the velocity and return it as an Point based on the direction the sprite is facing
        *
        * @param	parent	The Sprite to get the facing value from
        * @param	speed	The speed it will move, in pixels per second sq
        *
        * @return	An Point where Point.x contains the velocity x value and Point.y contains the velocity y value
        */
        function (parent, speed) {
            var a;
            if(parent.facing == Phaser.Collision.LEFT) {
                a = this._game.math.degreesToRadians(180);
            } else if(parent.facing == Phaser.Collision.RIGHT) {
                a = this._game.math.degreesToRadians(0);
            } else if(parent.facing == Phaser.Collision.UP) {
                a = this._game.math.degreesToRadians(-90);
            } else if(parent.facing == Phaser.Collision.DOWN) {
                a = this._game.math.degreesToRadians(90);
            }
            return new Phaser.Point(Math.cos(a) * speed, Math.sin(a) * speed);
        };
        Motion.prototype.angleBetweenMouse = /**
        * Find the angle (in radians) between an Sprite and the mouse, taking their x/y and origin into account.
        * The angle is calculated in clockwise positive direction (down = 90 degrees positive, right = 0 degrees positive, up = 90 degrees negative)
        *
        * @param	a			The Object to test from
        * @param	asDegrees	If you need the value in degrees instead of radians, set to true
        *
        * @return	Number The angle (in radians unless asDegrees is true)
        */
        function (a, asDegrees) {
            if (typeof asDegrees === "undefined") { asDegrees = false; }
            //	In order to get the angle between the object and mouse, we need the objects screen coordinates (rather than world coordinates)
            var p = a.getScreenXY();
            var dx = a._game.input.x - p.x;
            var dy = a._game.input.y - p.y;
            if(asDegrees) {
                return this._game.math.radiansToDegrees(Math.atan2(dy, dx));
            } else {
                return Math.atan2(dy, dx);
            }
        };
        return Motion;
    })();
    Phaser.Motion = Motion;    
})(Phaser || (Phaser = {}));
/// <reference path="../Game.ts" />
/// <reference path="../SoundManager.ts" />
/**
* Phaser - Sound
*
* A Sound file, used by the Game.SoundManager for playback.
*/
var Phaser;
(function (Phaser) {
    var Sound = (function () {
        function Sound(context, gainNode, data, volume, loop) {
            if (typeof volume === "undefined") { volume = 1; }
            if (typeof loop === "undefined") { loop = false; }
            this.loop = false;
            this.isPlaying = false;
            this.isDecoding = false;
            this._context = context;
            this._gainNode = gainNode;
            this._buffer = data;
            this._volume = volume;
            this.loop = loop;
            //  Local volume control
            if(this._context !== null) {
                this._localGainNode = this._context.createGainNode();
                this._localGainNode.connect(this._gainNode);
                this._localGainNode.gain.value = this._volume;
            }
            if(this._buffer === null) {
                this.isDecoding = true;
            } else {
                this.play();
            }
        }
        Sound.prototype.setDecodedBuffer = function (data) {
            this._buffer = data;
            this.isDecoding = false;
            this.play();
        };
        Sound.prototype.play = function () {
            if(this._buffer === null || this.isDecoding === true) {
                return;
            }
            this._sound = this._context.createBufferSource();
            this._sound.buffer = this._buffer;
            this._sound.connect(this._localGainNode);
            if(this.loop) {
                this._sound.loop = true;
            }
            this._sound.noteOn(0)// the zero is vitally important, crashes iOS6 without it
            ;
            this.duration = this._sound.buffer.duration;
            this.isPlaying = true;
        };
        Sound.prototype.stop = function () {
            if(this.isPlaying === true) {
                this.isPlaying = false;
                this._sound.noteOff(0);
            }
        };
        Sound.prototype.mute = function () {
            this._localGainNode.gain.value = 0;
        };
        Sound.prototype.unmute = function () {
            this._localGainNode.gain.value = this._volume;
        };
        Object.defineProperty(Sound.prototype, "volume", {
            get: function () {
                return this._volume;
            },
            set: function (value) {
                this._volume = value;
                this._localGainNode.gain.value = this._volume;
            },
            enumerable: true,
            configurable: true
        });
        return Sound;
    })();
    Phaser.Sound = Sound;    
})(Phaser || (Phaser = {}));
/// <reference path="Game.ts" />
/// <reference path="system/Sound.ts" />
/**
* Phaser - SoundManager
*
* This is an embroyonic web audio sound management class. There is a lot of work still to do here.
*/
var Phaser;
(function (Phaser) {
    var SoundManager = (function () {
        function SoundManager(game) {
            this._context = null;
            this._game = game;
            if(game.device.webaudio == true) {
                if(!!window['AudioContext']) {
                    this._context = new window['AudioContext']();
                } else if(!!window['webkitAudioContext']) {
                    this._context = new window['webkitAudioContext']();
                }
                if(this._context !== null) {
                    this._gainNode = this._context.createGainNode();
                    this._gainNode.connect(this._context.destination);
                    this._volume = 1;
                }
            }
        }
        SoundManager.prototype.mute = function () {
            this._gainNode.gain.value = 0;
        };
        SoundManager.prototype.unmute = function () {
            this._gainNode.gain.value = this._volume;
        };
        Object.defineProperty(SoundManager.prototype, "volume", {
            get: function () {
                return this._volume;
            },
            set: function (value) {
                this._volume = value;
                this._gainNode.gain.value = this._volume;
            },
            enumerable: true,
            configurable: true
        });
        SoundManager.prototype.decode = function (key, callback, sound) {
            if (typeof callback === "undefined") { callback = null; }
            if (typeof sound === "undefined") { sound = null; }
            var soundData = this._game.cache.getSound(key);
            if(soundData) {
                if(this._game.cache.isSoundDecoded(key) === false) {
                    var that = this;
                    this._context.decodeAudioData(soundData, function (buffer) {
                        that._game.cache.decodedSound(key, buffer);
                        if(sound) {
                            sound.setDecodedBuffer(buffer);
                        }
                        callback();
                    });
                }
            }
        };
        SoundManager.prototype.play = function (key, volume, loop) {
            if (typeof volume === "undefined") { volume = 1; }
            if (typeof loop === "undefined") { loop = false; }
            var _this = this;
            if(this._context === null) {
                return;
            }
            var soundData = this._game.cache.getSound(key);
            if(soundData) {
                //  Does the sound need decoding?
                if(this._game.cache.isSoundDecoded(key) === true) {
                    return new Phaser.Sound(this._context, this._gainNode, soundData, volume, loop);
                } else {
                    var tempSound = new Phaser.Sound(this._context, this._gainNode, null, volume, loop);
                    //  this is an async process, so we can return the Sound object anyway, it just won't be playing yet
                    this.decode(key, function () {
                        return _this.play(key);
                    }, tempSound);
                    return tempSound;
                }
            }
        };
        return SoundManager;
    })();
    Phaser.SoundManager = SoundManager;    
})(Phaser || (Phaser = {}));
/**
* Phaser
*
*  v0.9 - April 18th 2013
*
* A small and feature-packed 2D canvas game framework born from the firey pits of Flixel and Kiwi.
*
* Richard Davey (@photonstorm)
*
* Many thanks to Adam Saltsman (@ADAMATOMIC) for the original Flixel AS3 code on which Phaser is based.
*
* "If you want your children to be intelligent,  read them fairy tales."
* "If you want them to be more intelligent, read them more fairy tales."
*                                                     -- Albert Einstein
*/
var Phaser;
(function (Phaser) {
    Phaser.VERSION = 'Phaser version 0.9';
})(Phaser || (Phaser = {}));
/// <reference path="../Game.ts" />
/**
* Phaser - StageScaleMode
*
* This class controls the scaling of your game. On mobile devices it will also remove the URL bar and allow
* you to maintain proportion and aspect ratio.
* It is based on a technique taken from Viewporter v2.0 by Zynga Inc. http://github.com/zynga/viewporter
*/
var Phaser;
(function (Phaser) {
    var StageScaleMode = (function () {
        function StageScaleMode(game) {
            var _this = this;
            this._startHeight = 0;
            this.width = 0;
            this.height = 0;
            this._game = game;
            this.orientation = window['orientation'];
            window.addEventListener('orientationchange', function (event) {
                return _this.checkOrientation(event);
            }, false);
        }
        StageScaleMode.EXACT_FIT = 0;
        StageScaleMode.NO_SCALE = 1;
        StageScaleMode.SHOW_ALL = 2;
        StageScaleMode.prototype.update = function () {
            if(this._game.stage.scaleMode !== StageScaleMode.NO_SCALE && (window.innerWidth !== this.width || window.innerHeight !== this.height)) {
                this.refresh();
            }
        };
        Object.defineProperty(StageScaleMode.prototype, "isLandscape", {
            get: function () {
                return window['orientation'] === 90 || window['orientation'] === -90;
            },
            enumerable: true,
            configurable: true
        });
        StageScaleMode.prototype.checkOrientation = function (event) {
            if(window['orientation'] !== this.orientation) {
                this.refresh();
                this.orientation = window['orientation'];
            }
        };
        StageScaleMode.prototype.refresh = function () {
            var _this = this;
            //  We can't do anything about the status bars in iPads, web apps or desktops
            if(this._game.device.iPad == false && this._game.device.webApp == false && this._game.device.desktop == false) {
                document.documentElement.style.minHeight = '5000px';
                this._startHeight = window.innerHeight;
                if(this._game.device.android && this._game.device.chrome == false) {
                    window.scrollTo(0, 1);
                } else {
                    window.scrollTo(0, 0);
                }
            }
            if(this._check == null) {
                this._iterations = 40;
                this._check = window.setInterval(function () {
                    return _this.setScreenSize();
                }, 10);
            }
        };
        StageScaleMode.prototype.setScreenSize = function () {
            if(this._game.device.iPad == false && this._game.device.webApp == false && this._game.device.desktop == false) {
                if(this._game.device.android && this._game.device.chrome == false) {
                    window.scrollTo(0, 1);
                } else {
                    window.scrollTo(0, 0);
                }
            }
            this._iterations--;
            if(window.innerHeight > this._startHeight || this._iterations < 0) {
                // Set minimum height of content to new window height
                document.documentElement.style.minHeight = window.innerHeight + 'px';
                if(this._game.stage.scaleMode == StageScaleMode.EXACT_FIT) {
                    if(this._game.stage.maxScaleX && window.innerWidth > this._game.stage.maxScaleX) {
                        this.width = this._game.stage.maxScaleX;
                    } else {
                        this.width = window.innerWidth;
                    }
                    if(this._game.stage.maxScaleY && window.innerHeight > this._game.stage.maxScaleY) {
                        this.height = this._game.stage.maxScaleY;
                    } else {
                        this.height = window.innerHeight;
                    }
                } else if(this._game.stage.scaleMode == StageScaleMode.SHOW_ALL) {
                    var multiplier = Math.min((window.innerHeight / this._game.stage.height), (window.innerWidth / this._game.stage.width));
                    this.width = Math.round(this._game.stage.width * multiplier);
                    this.height = Math.round(this._game.stage.height * multiplier);
                    if(this._game.stage.maxScaleX && this.width > this._game.stage.maxScaleX) {
                        this.width = this._game.stage.maxScaleX;
                    }
                    if(this._game.stage.maxScaleY && this.height > this._game.stage.maxScaleY) {
                        this.height = this._game.stage.maxScaleY;
                    }
                }
                this._game.stage.canvas.style.width = this.width + 'px';
                this._game.stage.canvas.style.height = this.height + 'px';
                this._game.input.scaleX = this._game.stage.width / this.width;
                this._game.input.scaleY = this._game.stage.height / this.height;
                clearInterval(this._check);
                this._check = null;
            }
        };
        return StageScaleMode;
    })();
    Phaser.StageScaleMode = StageScaleMode;    
})(Phaser || (Phaser = {}));
/// <reference path="Phaser.ts" />
/// <reference path="Game.ts" />
/// <reference path="system/StageScaleMode.ts" />
/**
* Phaser - Stage
*
* The Stage is the canvas on which everything is displayed. This class handles display within the web browser, focus handling,
* resizing, scaling and pause/boot screens.
*/
var Phaser;
(function (Phaser) {
    var Stage = (function () {
        function Stage(game, parent, width, height) {
            var _this = this;
            this.clear = true;
            this.minScaleX = null;
            this.maxScaleX = null;
            this.minScaleY = null;
            this.maxScaleY = null;
            this._logo = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAO1JREFUeNpi/P//PwM6YGRkxBQEAqBaRnQxFmwa10d6MAjrMqMofHv5L1we2SBGmAtAktg0ogOQQYHLd8ANYYFpPtTmzUAMAFmwnsEDrAdkCAvMZlIAsiFMMAEYsKvaSrQhIMCELkGsV2AAbIC8gCQYgwKIUABiNYBf9yoYH7n7n6CzN274g2IYEyFbsNmKLIaSkHpP7WSwUfbA0ASzFQRslBlxp0RcAF0TRhggA3zhAJIDpUKU5A9KyshpHDkjFZu5g2nJMFcwXVJSgqIGnBKx5bKenh4w/XzVbgbPtlIUcVgSxuoCUgHIIIAAAwArtXwJBABO6QAAAABJRU5ErkJggg==";
            this._game = game;
            this.canvas = document.createElement('canvas');
            this.canvas.width = width;
            this.canvas.height = height;
            if(document.getElementById(parent)) {
                document.getElementById(parent).appendChild(this.canvas);
                document.getElementById(parent).style.overflow = 'hidden';
            } else {
                document.body.appendChild(this.canvas);
            }
            //  Consume default actions on the canvas
            this.canvas.style.msTouchAction = 'none';
            this.canvas.style['touch-action'] = 'none';
            this.context = this.canvas.getContext('2d');
            this.offset = this.getOffset(this.canvas);
            this.bounds = new Phaser.Rectangle(this.offset.x, this.offset.y, width, height);
            this.aspectRatio = width / height;
            this.scaleMode = Phaser.StageScaleMode.NO_SCALE;
            this.scale = new Phaser.StageScaleMode(this._game);
            //document.addEventListener('visibilitychange', (event) => this.visibilityChange(event), false);
            //document.addEventListener('webkitvisibilitychange', (event) => this.visibilityChange(event), false);
            window.onblur = function (event) {
                return _this.visibilityChange(event);
            };
            window.onfocus = function (event) {
                return _this.visibilityChange(event);
            };
        }
        Stage.ORIENTATION_LANDSCAPE = 0;
        Stage.ORIENTATION_PORTRAIT = 1;
        Stage.prototype.update = function () {
            this.scale.update();
            if(this.clear) {
                //  implement dirty rect? could take up more cpu time than it saves. needs benching.
                this.context.clearRect(0, 0, this.width, this.height);
            }
        };
        Stage.prototype.renderDebugInfo = function () {
            this.context.fillStyle = 'rgb(255,255,255)';
            this.context.fillText(Phaser.VERSION, 10, 20);
            this.context.fillText('Game Size: ' + this.width + ' x ' + this.height, 10, 40);
            this.context.fillText('x: ' + this.x + ' y: ' + this.y, 10, 60);
        };
        Stage.prototype.visibilityChange = function (event) {
            if(event.type == 'blur' && this._game.paused == false && this._game.isBooted == true) {
                this._game.paused = true;
                this.drawPauseScreen();
            } else if(event.type == 'focus') {
                this._game.paused = false;
            }
            //if (document['hidden'] === true || document['webkitHidden'] === true)
                    };
        Stage.prototype.drawInitScreen = function () {
            this.context.fillStyle = 'rgb(40, 40, 40)';
            this.context.fillRect(0, 0, this.width, this.height);
            this.context.fillStyle = 'rgb(255,255,255)';
            this.context.font = 'bold 18px Arial';
            this.context.textBaseline = 'top';
            this.context.fillText(Phaser.VERSION, 54, 32);
            this.context.fillText('Game Size: ' + this.width + ' x ' + this.height, 32, 64);
            this.context.fillText('www.photonstorm.com', 32, 96);
            this.context.font = '16px Arial';
            this.context.fillText('You are seeing this screen because you didn\'t specify any default', 32, 160);
            this.context.fillText('functions in the Game constructor, or use Game.loadState()', 32, 184);
            var image = new Image();
            var that = this;
            image.onload = function () {
                that.context.drawImage(image, 32, 32);
            };
            image.src = this._logo;
        };
        Stage.prototype.drawPauseScreen = function () {
            this.saveCanvasValues();
            this.context.fillStyle = 'rgba(0, 0, 0, 0.4)';
            this.context.fillRect(0, 0, this.width, this.height);
            //  Draw a 'play' arrow
            var arrowWidth = Math.round(this.width / 2);
            var arrowHeight = Math.round(this.height / 2);
            var sx = this.centerX - arrowWidth / 2;
            var sy = this.centerY - arrowHeight / 2;
            this.context.beginPath();
            this.context.moveTo(sx, sy);
            this.context.lineTo(sx, sy + arrowHeight);
            this.context.lineTo(sx + arrowWidth, this.centerY);
            this.context.fillStyle = 'rgba(255, 255, 255, 0.8)';
            this.context.fill();
            this.context.closePath();
            this.restoreCanvasValues();
        };
        Stage.prototype.getOffset = function (element) {
            var box = element.getBoundingClientRect();
            var clientTop = element.clientTop || document.body.clientTop || 0;
            var clientLeft = element.clientLeft || document.body.clientLeft || 0;
            var scrollTop = window.pageYOffset || element.scrollTop || document.body.scrollTop;
            var scrollLeft = window.pageXOffset || element.scrollLeft || document.body.scrollLeft;
            return new Phaser.Point(box.left + scrollLeft - clientLeft, box.top + scrollTop - clientTop);
        };
        Stage.prototype.saveCanvasValues = function () {
            this.strokeStyle = this.context.strokeStyle;
            this.lineWidth = this.context.lineWidth;
            this.fillStyle = this.context.fillStyle;
        };
        Stage.prototype.restoreCanvasValues = function () {
            this.context.strokeStyle = this.strokeStyle;
            this.context.lineWidth = this.lineWidth;
            this.context.fillStyle = this.fillStyle;
        };
        Object.defineProperty(Stage.prototype, "backgroundColor", {
            get: function () {
                return this._bgColor;
            },
            set: function (color) {
                this.canvas.style.backgroundColor = color;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Stage.prototype, "x", {
            get: function () {
                return this.bounds.x;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Stage.prototype, "y", {
            get: function () {
                return this.bounds.y;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Stage.prototype, "width", {
            get: function () {
                return this.bounds.width;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Stage.prototype, "height", {
            get: function () {
                return this.bounds.height;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Stage.prototype, "centerX", {
            get: function () {
                return this.bounds.halfWidth;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Stage.prototype, "centerY", {
            get: function () {
                return this.bounds.halfHeight;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Stage.prototype, "randomX", {
            get: function () {
                return Math.round(Math.random() * this.bounds.width);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Stage.prototype, "randomY", {
            get: function () {
                return Math.round(Math.random() * this.bounds.height);
            },
            enumerable: true,
            configurable: true
        });
        return Stage;
    })();
    Phaser.Stage = Stage;    
})(Phaser || (Phaser = {}));
/// <reference path="Game.ts" />
/**
* Phaser - Time
*
* This is the game clock and it manages elapsed time and calculation of delta values, used for game object motion.
*/
var Phaser;
(function (Phaser) {
    var Time = (function () {
        function Time(game) {
            this.timeScale = 1.0;
            this.elapsed = 0;
            /**
            *
            * @property time
            * @type Number
            */
            this.time = 0;
            /**
            *
            * @property now
            * @type Number
            */
            this.now = 0;
            /**
            *
            * @property delta
            * @type Number
            */
            this.delta = 0;
            this.fps = 0;
            this.fpsMin = 1000;
            this.fpsMax = 0;
            this.msMin = 1000;
            this.msMax = 0;
            this.frames = 0;
            this._timeLastSecond = 0;
            this._started = Date.now();
            this._timeLastSecond = this._started;
            this.time = this._started;
        }
        Object.defineProperty(Time.prototype, "totalElapsedSeconds", {
            get: /**
            *
            * @method totalElapsedSeconds
            * @return {Number}
            */
            function () {
                return (this.now - this._started) * 0.001;
            },
            enumerable: true,
            configurable: true
        });
        Time.prototype.update = /**
        *
        * @method update
        */
        function () {
            // Can we use performance.now() ?
            this.now = Date.now()// mark
            ;
            this.delta = this.now - this.time// elapsedMS
            ;
            this.msMin = Math.min(this.msMin, this.delta);
            this.msMax = Math.max(this.msMax, this.delta);
            this.frames++;
            if(this.now > this._timeLastSecond + 1000) {
                this.fps = Math.round((this.frames * 1000) / (this.now - this._timeLastSecond));
                this.fpsMin = Math.min(this.fpsMin, this.fps);
                this.fpsMax = Math.max(this.fpsMax, this.fps);
                this._timeLastSecond = this.now;
                this.frames = 0;
            }
            this.time = this.now// _total
            ;
            ////  Lock the delta at 0.1 to minimise fps tunneling
            //if (this.delta > 0.1)
            //{
            //    this.delta = 0.1;
            //}
                    };
        Time.prototype.elapsedSince = /**
        *
        * @method elapsedSince
        * @param {Number} since
        * @return {Number}
        */
        function (since) {
            return this.now - since;
        };
        Time.prototype.elapsedSecondsSince = /**
        *
        * @method elapsedSecondsSince
        * @param {Number} since
        * @return {Number}
        */
        function (since) {
            return (this.now - since) * 0.001;
        };
        Time.prototype.reset = /**
        *
        * @method reset
        */
        function () {
            this._started = this.now;
        };
        return Time;
    })();
    Phaser.Time = Time;    
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    /// <reference path="../../Game.ts" />
    /**
    * Phaser - Easing - Back
    *
    * For use with Phaser.Tween
    */
    (function (Easing) {
        var Back = (function () {
            function Back() { }
            Back.In = function In(k) {
                var s = 1.70158;
                return k * k * ((s + 1) * k - s);
            };
            Back.Out = function Out(k) {
                var s = 1.70158;
                return --k * k * ((s + 1) * k + s) + 1;
            };
            Back.InOut = function InOut(k) {
                var s = 1.70158 * 1.525;
                if((k *= 2) < 1) {
                    return 0.5 * (k * k * ((s + 1) * k - s));
                }
                return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
            };
            return Back;
        })();
        Easing.Back = Back;        
    })(Phaser.Easing || (Phaser.Easing = {}));
    var Easing = Phaser.Easing;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    /// <reference path="../../Game.ts" />
    /**
    * Phaser - Easing - Bounce
    *
    * For use with Phaser.Tween
    */
    (function (Easing) {
        var Bounce = (function () {
            function Bounce() { }
            Bounce.In = function In(k) {
                return 1 - Phaser.Easing.Bounce.Out(1 - k);
            };
            Bounce.Out = function Out(k) {
                if(k < (1 / 2.75)) {
                    return 7.5625 * k * k;
                } else if(k < (2 / 2.75)) {
                    return 7.5625 * (k -= (1.5 / 2.75)) * k + 0.75;
                } else if(k < (2.5 / 2.75)) {
                    return 7.5625 * (k -= (2.25 / 2.75)) * k + 0.9375;
                } else {
                    return 7.5625 * (k -= (2.625 / 2.75)) * k + 0.984375;
                }
            };
            Bounce.InOut = function InOut(k) {
                if(k < 0.5) {
                    return Phaser.Easing.Bounce.In(k * 2) * 0.5;
                }
                return Phaser.Easing.Bounce.Out(k * 2 - 1) * 0.5 + 0.5;
            };
            return Bounce;
        })();
        Easing.Bounce = Bounce;        
    })(Phaser.Easing || (Phaser.Easing = {}));
    var Easing = Phaser.Easing;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    /// <reference path="../../Game.ts" />
    /**
    * Phaser - Easing - Circular
    *
    * For use with Phaser.Tween
    */
    (function (Easing) {
        var Circular = (function () {
            function Circular() { }
            Circular.In = function In(k) {
                return 1 - Math.sqrt(1 - k * k);
            };
            Circular.Out = function Out(k) {
                return Math.sqrt(1 - (--k * k));
            };
            Circular.InOut = function InOut(k) {
                if((k *= 2) < 1) {
                    return -0.5 * (Math.sqrt(1 - k * k) - 1);
                }
                return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);
            };
            return Circular;
        })();
        Easing.Circular = Circular;        
    })(Phaser.Easing || (Phaser.Easing = {}));
    var Easing = Phaser.Easing;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    /// <reference path="../../Game.ts" />
    /**
    * Phaser - Easing - Cubic
    *
    * For use with Phaser.Tween
    */
    (function (Easing) {
        var Cubic = (function () {
            function Cubic() { }
            Cubic.In = function In(k) {
                return k * k * k;
            };
            Cubic.Out = function Out(k) {
                return --k * k * k + 1;
            };
            Cubic.InOut = function InOut(k) {
                if((k *= 2) < 1) {
                    return 0.5 * k * k * k;
                }
                return 0.5 * ((k -= 2) * k * k + 2);
            };
            return Cubic;
        })();
        Easing.Cubic = Cubic;        
    })(Phaser.Easing || (Phaser.Easing = {}));
    var Easing = Phaser.Easing;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    /// <reference path="../../Game.ts" />
    /**
    * Phaser - Easing - Elastic
    *
    * For use with Phaser.Tween
    */
    (function (Easing) {
        var Elastic = (function () {
            function Elastic() { }
            Elastic.In = function In(k) {
                var s, a = 0.1, p = 0.4;
                if(k === 0) {
                    return 0;
                }
                if(k === 1) {
                    return 1;
                }
                if(!a || a < 1) {
                    a = 1;
                    s = p / 4;
                } else {
                    s = p * Math.asin(1 / a) / (2 * Math.PI);
                }
                return -(a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p));
            };
            Elastic.Out = function Out(k) {
                var s, a = 0.1, p = 0.4;
                if(k === 0) {
                    return 0;
                }
                if(k === 1) {
                    return 1;
                }
                if(!a || a < 1) {
                    a = 1;
                    s = p / 4;
                } else {
                    s = p * Math.asin(1 / a) / (2 * Math.PI);
                }
                return (a * Math.pow(2, -10 * k) * Math.sin((k - s) * (2 * Math.PI) / p) + 1);
            };
            Elastic.InOut = function InOut(k) {
                var s, a = 0.1, p = 0.4;
                if(k === 0) {
                    return 0;
                }
                if(k === 1) {
                    return 1;
                }
                if(!a || a < 1) {
                    a = 1;
                    s = p / 4;
                } else {
                    s = p * Math.asin(1 / a) / (2 * Math.PI);
                }
                if((k *= 2) < 1) {
                    return -0.5 * (a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p));
                }
                return a * Math.pow(2, -10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p) * 0.5 + 1;
            };
            return Elastic;
        })();
        Easing.Elastic = Elastic;        
    })(Phaser.Easing || (Phaser.Easing = {}));
    var Easing = Phaser.Easing;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    /// <reference path="../../Game.ts" />
    /**
    * Phaser - Easing - Exponential
    *
    * For use with Phaser.Tween
    */
    (function (Easing) {
        var Exponential = (function () {
            function Exponential() { }
            Exponential.In = function In(k) {
                return k === 0 ? 0 : Math.pow(1024, k - 1);
            };
            Exponential.Out = function Out(k) {
                return k === 1 ? 1 : 1 - Math.pow(2, -10 * k);
            };
            Exponential.InOut = function InOut(k) {
                if(k === 0) {
                    return 0;
                }
                if(k === 1) {
                    return 1;
                }
                if((k *= 2) < 1) {
                    return 0.5 * Math.pow(1024, k - 1);
                }
                return 0.5 * (-Math.pow(2, -10 * (k - 1)) + 2);
            };
            return Exponential;
        })();
        Easing.Exponential = Exponential;        
    })(Phaser.Easing || (Phaser.Easing = {}));
    var Easing = Phaser.Easing;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    /// <reference path="../../Game.ts" />
    /**
    * Phaser - Easing - Linear
    *
    * For use with Phaser.Tween
    */
    (function (Easing) {
        var Linear = (function () {
            function Linear() { }
            Linear.None = function None(k) {
                return k;
            };
            return Linear;
        })();
        Easing.Linear = Linear;        
    })(Phaser.Easing || (Phaser.Easing = {}));
    var Easing = Phaser.Easing;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    /// <reference path="../../Game.ts" />
    /**
    * Phaser - Easing - Quadratic
    *
    * For use with Phaser.Tween
    */
    (function (Easing) {
        var Quadratic = (function () {
            function Quadratic() { }
            Quadratic.In = function In(k) {
                return k * k;
            };
            Quadratic.Out = function Out(k) {
                return k * (2 - k);
            };
            Quadratic.InOut = function InOut(k) {
                if((k *= 2) < 1) {
                    return 0.5 * k * k;
                }
                return -0.5 * (--k * (k - 2) - 1);
            };
            return Quadratic;
        })();
        Easing.Quadratic = Quadratic;        
    })(Phaser.Easing || (Phaser.Easing = {}));
    var Easing = Phaser.Easing;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    /// <reference path="../../Game.ts" />
    /**
    * Phaser - Easing - Quartic
    *
    * For use with Phaser.Tween
    */
    (function (Easing) {
        var Quartic = (function () {
            function Quartic() { }
            Quartic.In = function In(k) {
                return k * k * k * k;
            };
            Quartic.Out = function Out(k) {
                return 1 - (--k * k * k * k);
            };
            Quartic.InOut = function InOut(k) {
                if((k *= 2) < 1) {
                    return 0.5 * k * k * k * k;
                }
                return -0.5 * ((k -= 2) * k * k * k - 2);
            };
            return Quartic;
        })();
        Easing.Quartic = Quartic;        
    })(Phaser.Easing || (Phaser.Easing = {}));
    var Easing = Phaser.Easing;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    /// <reference path="../../Game.ts" />
    /**
    * Phaser - Easing - Quintic
    *
    * For use with Phaser.Tween
    */
    (function (Easing) {
        var Quintic = (function () {
            function Quintic() { }
            Quintic.In = function In(k) {
                return k * k * k * k * k;
            };
            Quintic.Out = function Out(k) {
                return --k * k * k * k * k + 1;
            };
            Quintic.InOut = function InOut(k) {
                if((k *= 2) < 1) {
                    return 0.5 * k * k * k * k * k;
                }
                return 0.5 * ((k -= 2) * k * k * k * k + 2);
            };
            return Quintic;
        })();
        Easing.Quintic = Quintic;        
    })(Phaser.Easing || (Phaser.Easing = {}));
    var Easing = Phaser.Easing;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    /// <reference path="../../Game.ts" />
    /**
    * Phaser - Easing - Sinusoidal
    *
    * For use with Phaser.Tween
    */
    (function (Easing) {
        var Sinusoidal = (function () {
            function Sinusoidal() { }
            Sinusoidal.In = function In(k) {
                return 1 - Math.cos(k * Math.PI / 2);
            };
            Sinusoidal.Out = function Out(k) {
                return Math.sin(k * Math.PI / 2);
            };
            Sinusoidal.InOut = function InOut(k) {
                return 0.5 * (1 - Math.cos(Math.PI * k));
            };
            return Sinusoidal;
        })();
        Easing.Sinusoidal = Sinusoidal;        
    })(Phaser.Easing || (Phaser.Easing = {}));
    var Easing = Phaser.Easing;
})(Phaser || (Phaser = {}));
/// <reference path="../Game.ts" />
/// <reference path="easing/Back.ts" />
/// <reference path="easing/Bounce.ts" />
/// <reference path="easing/Circular.ts" />
/// <reference path="easing/Cubic.ts" />
/// <reference path="easing/Elastic.ts" />
/// <reference path="easing/Exponential.ts" />
/// <reference path="easing/Linear.ts" />
/// <reference path="easing/Quadratic.ts" />
/// <reference path="easing/Quartic.ts" />
/// <reference path="easing/Quintic.ts" />
/// <reference path="easing/Sinusoidal.ts" />
/**
* Phaser - Tween
*
* Based heavily on tween.js by sole (https://github.com/sole/tween.js) converted to TypeScript and integrated into Phaser
*/
var Phaser;
(function (Phaser) {
    var Tween = (function () {
        function Tween(object, game) {
            this._object = null;
            this._pausedTime = 0;
            this._valuesStart = {
            };
            this._valuesEnd = {
            };
            this._duration = 1000;
            this._delayTime = 0;
            this._startTime = null;
            this._chainedTweens = [];
            this._object = object;
            this._game = game;
            this._manager = this._game.tweens;
            this._interpolationFunction = this._game.math.linearInterpolation;
            this._easingFunction = Phaser.Easing.Linear.None;
            this.onStart = new Phaser.Signal();
            this.onUpdate = new Phaser.Signal();
            this.onComplete = new Phaser.Signal();
        }
        Tween.prototype.to = function (properties, duration, ease, autoStart) {
            if (typeof duration === "undefined") { duration = 1000; }
            if (typeof ease === "undefined") { ease = null; }
            if (typeof autoStart === "undefined") { autoStart = false; }
            this._duration = duration;
            //  If properties isn't an object this will fail, sanity check it here somehow?
            this._valuesEnd = properties;
            if(ease !== null) {
                this._easingFunction = ease;
            }
            if(autoStart === true) {
                return this.start();
            } else {
                return this;
            }
        };
        Tween.prototype.start = function () {
            if(this._game === null || this._object === null) {
                return;
            }
            this._manager.add(this);
            this.onStart.dispatch(this._object);
            this._startTime = this._game.time.now + this._delayTime;
            for(var property in this._valuesEnd) {
                // This prevents the interpolation of null values or of non-existing properties
                if(this._object[property] === null || !(property in this._object)) {
                    throw Error('Phaser.Tween interpolation of null value of non-existing property');
                    continue;
                }
                // check if an Array was provided as property value
                if(this._valuesEnd[property] instanceof Array) {
                    if(this._valuesEnd[property].length === 0) {
                        continue;
                    }
                    // create a local copy of the Array with the start value at the front
                    this._valuesEnd[property] = [
                        this._object[property]
                    ].concat(this._valuesEnd[property]);
                }
                this._valuesStart[property] = this._object[property];
            }
            return this;
        };
        Tween.prototype.stop = function () {
            if(this._manager !== null) {
                this._manager.remove(this);
            }
            return this;
        };
        Object.defineProperty(Tween.prototype, "parent", {
            set: function (value) {
                this._game = value;
                this._manager = this._game.tweens;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Tween.prototype, "delay", {
            get: function () {
                return this._delayTime;
            },
            set: function (amount) {
                this._delayTime = amount;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Tween.prototype, "easing", {
            get: function () {
                return this._easingFunction;
            },
            set: function (easing) {
                this._easingFunction = easing;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Tween.prototype, "interpolation", {
            get: function () {
                return this._interpolationFunction;
            },
            set: function (interpolation) {
                this._interpolationFunction = interpolation;
            },
            enumerable: true,
            configurable: true
        });
        Tween.prototype.chain = function (tween) {
            this._chainedTweens.push(tween);
            return this;
        };
        Tween.prototype.update = function (time) {
            if(this._game.paused == true) {
                if(this._pausedTime == 0) {
                    this._pausedTime = time;
                }
            } else {
                //  Ok we aren't paused, but was there some time gained?
                if(this._pausedTime > 0) {
                    this._startTime += (time - this._pausedTime);
                    this._pausedTime = 0;
                }
            }
            if(time < this._startTime) {
                return true;
            }
            var elapsed = (time - this._startTime) / this._duration;
            elapsed = elapsed > 1 ? 1 : elapsed;
            var value = this._easingFunction(elapsed);
            for(var property in this._valuesStart) {
                //  Add checks for object, array, numeric up front
                if(this._valuesEnd[property] instanceof Array) {
                    this._object[property] = this._interpolationFunction(this._valuesEnd[property], value);
                } else {
                    this._object[property] = this._valuesStart[property] + (this._valuesEnd[property] - this._valuesStart[property]) * value;
                }
            }
            this.onUpdate.dispatch(this._object, value);
            if(elapsed == 1) {
                this.onComplete.dispatch(this._object);
                for(var i = 0; i < this._chainedTweens.length; i++) {
                    this._chainedTweens[i].start();
                }
                return false;
            }
            return true;
        };
        return Tween;
    })();
    Phaser.Tween = Tween;    
})(Phaser || (Phaser = {}));
/// <reference path="Game.ts" />
/// <reference path="system/Tween.ts" />
/**
* Phaser - TweenManager
*
* The Game has a single instance of the TweenManager through which all Tween objects are created and updated.
* Tweens are hooked into the game clock and pause system, adjusting based on the game state.
* TweenManager is based heavily on tween.js by sole (http://soledadpenades.com).
* I converted it to TypeScript, swapped the callbacks for signals and patched a few issues with regard
* to properties and completion errors. Please see https://github.com/sole/tween.js for a full list of contributors.
*/
var Phaser;
(function (Phaser) {
    var TweenManager = (function () {
        function TweenManager(game) {
            this._game = game;
            this._tweens = [];
        }
        TweenManager.prototype.getAll = function () {
            return this._tweens;
        };
        TweenManager.prototype.removeAll = function () {
            this._tweens.length = 0;
        };
        TweenManager.prototype.create = function (object) {
            return new Phaser.Tween(object, this._game);
        };
        TweenManager.prototype.add = function (tween) {
            tween.parent = this._game;
            this._tweens.push(tween);
            return tween;
        };
        TweenManager.prototype.remove = function (tween) {
            var i = this._tweens.indexOf(tween);
            if(i !== -1) {
                this._tweens.splice(i, 1);
            }
        };
        TweenManager.prototype.update = function () {
            if(this._tweens.length === 0) {
                return false;
            }
            var i = 0;
            var numTweens = this._tweens.length;
            while(i < numTweens) {
                if(this._tweens[i].update(this._game.time.now)) {
                    i++;
                } else {
                    this._tweens.splice(i, 1);
                    numTweens--;
                }
            }
            return true;
        };
        return TweenManager;
    })();
    Phaser.TweenManager = TweenManager;    
})(Phaser || (Phaser = {}));
/// <reference path="Game.ts" />
/**
* Phaser - World
*
* A game has only one world. The world is an abstract place in which all game objects live. It is not bound
* by stage limits and can be any size or dimension. You look into the world via cameras and all game objects
* live within the world at world-based coordinates. By default a world is created the same size as your Stage.
*/
var Phaser;
(function (Phaser) {
    var World = (function () {
        function World(game, width, height) {
            this._game = game;
            this._cameras = new Phaser.CameraManager(this._game, 0, 0, width, height);
            this._game.camera = this._cameras.current;
            this.group = new Phaser.Group(this._game, 0);
            this.bounds = new Phaser.Rectangle(0, 0, width, height);
            this.worldDivisions = 6;
        }
        World.prototype.update = function () {
            this.group.preUpdate();
            this.group.update();
            this.group.postUpdate();
            this._cameras.update();
        };
        World.prototype.render = function () {
            //  Unlike in flixel our render process is camera driven, not group driven
            this._cameras.render();
        };
        World.prototype.destroy = function () {
            this.group.destroy();
            this._cameras.destroy();
        };
        World.prototype.setSize = //  World methods
        function (width, height, updateCameraBounds) {
            if (typeof updateCameraBounds === "undefined") { updateCameraBounds = true; }
            this.bounds.width = width;
            this.bounds.height = height;
            if(updateCameraBounds == true) {
                this._game.camera.setBounds(0, 0, width, height);
            }
        };
        Object.defineProperty(World.prototype, "width", {
            get: function () {
                return this.bounds.width;
            },
            set: function (value) {
                this.bounds.width = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(World.prototype, "height", {
            get: function () {
                return this.bounds.height;
            },
            set: function (value) {
                this.bounds.height = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(World.prototype, "centerX", {
            get: function () {
                return this.bounds.halfWidth;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(World.prototype, "centerY", {
            get: function () {
                return this.bounds.halfHeight;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(World.prototype, "randomX", {
            get: function () {
                return Math.round(Math.random() * this.bounds.width);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(World.prototype, "randomY", {
            get: function () {
                return Math.round(Math.random() * this.bounds.height);
            },
            enumerable: true,
            configurable: true
        });
        World.prototype.addExistingCamera = //  Cameras
        function (cam) {
            //return this._cameras.addCamera(x, y, width, height);
            return cam;
        };
        World.prototype.createCamera = function (x, y, width, height) {
            return this._cameras.addCamera(x, y, width, height);
        };
        World.prototype.removeCamera = function (id) {
            return this._cameras.removeCamera(id);
        };
        World.prototype.getAllCameras = function () {
            return this._cameras.getAll();
        };
        World.prototype.addExistingSprite = //  Sprites
        //  Drop this?
        function (sprite) {
            return this.group.add(sprite);
        };
        World.prototype.createSprite = function (x, y, key) {
            if (typeof key === "undefined") { key = ''; }
            return this.group.add(new Phaser.Sprite(this._game, x, y, key));
        };
        World.prototype.createGeomSprite = function (x, y) {
            return this.group.add(new Phaser.GeomSprite(this._game, x, y));
        };
        World.prototype.createDynamicTexture = function (key, width, height) {
            return new Phaser.DynamicTexture(this._game, key, width, height);
        };
        World.prototype.createGroup = function (MaxSize) {
            if (typeof MaxSize === "undefined") { MaxSize = 0; }
            return this.group.add(new Phaser.Group(this._game, MaxSize));
        };
        World.prototype.createTilemap = //  Tilemaps
        function (key, mapData, format, tileWidth, tileHeight) {
            return this.group.add(new Phaser.Tilemap(this._game, key, mapData, format, tileWidth, tileHeight));
        };
        World.prototype.createParticle = //  Emitters
        function () {
            return new Phaser.Particle(this._game);
        };
        World.prototype.createEmitter = function (x, y, size) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            if (typeof size === "undefined") { size = 0; }
            return this.group.add(new Phaser.Emitter(this._game, x, y, size));
        };
        return World;
    })();
    Phaser.World = World;    
})(Phaser || (Phaser = {}));
/// <reference path="../Game.ts" />
/**
* Phaser - Device
*
* Detects device support capabilities. Using some elements from System.js by MrDoob and Modernizr
* https://github.com/Modernizr/Modernizr/blob/master/feature-detects/audio.js
*/
var Phaser;
(function (Phaser) {
    var Device = (function () {
        /**
        *
        * @constructor
        * @return {Device} This Object
        */
        function Device() {
            //  Operating System
            this.desktop = false;
            /**
            *
            * @property iOS
            * @type Boolean
            */
            this.iOS = false;
            /**
            *
            * @property android
            * @type Boolean
            */
            this.android = false;
            /**
            *
            * @property chromeOS
            * @type Boolean
            */
            this.chromeOS = false;
            /**
            *
            * @property linux
            * @type Boolean
            */
            this.linux = false;
            /**
            *
            * @property maxOS
            * @type Boolean
            */
            this.macOS = false;
            /**
            *
            * @property windows
            * @type Boolean
            */
            this.windows = false;
            //  Features
            /**
            *
            * @property canvas
            * @type Boolean
            */
            this.canvas = false;
            /**
            *
            * @property file
            * @type Boolean
            */
            this.file = false;
            /**
            *
            * @property fileSystem
            * @type Boolean
            */
            this.fileSystem = false;
            /**
            *
            * @property localStorage
            * @type Boolean
            */
            this.localStorage = false;
            /**
            *
            * @property webGL
            * @type Boolean
            */
            this.webGL = false;
            /**
            *
            * @property worker
            * @type Boolean
            */
            this.worker = false;
            /**
            *
            * @property touch
            * @type Boolean
            */
            this.touch = false;
            /**
            *
            * @property css3D
            * @type Boolean
            */
            this.css3D = false;
            //  Browser
            /**
            *
            * @property arora
            * @type Boolean
            */
            this.arora = false;
            /**
            *
            * @property chrome
            * @type Boolean
            */
            this.chrome = false;
            /**
            *
            * @property epiphany
            * @type Boolean
            */
            this.epiphany = false;
            /**
            *
            * @property firefox
            * @type Boolean
            */
            this.firefox = false;
            /**
            *
            * @property ie
            * @type Boolean
            */
            this.ie = false;
            /**
            *
            * @property ieVersion
            * @type Number
            */
            this.ieVersion = 0;
            /**
            *
            * @property mobileSafari
            * @type Boolean
            */
            this.mobileSafari = false;
            /**
            *
            * @property midori
            * @type Boolean
            */
            this.midori = false;
            /**
            *
            * @property opera
            * @type Boolean
            */
            this.opera = false;
            /**
            *
            * @property safari
            * @type Boolean
            */
            this.safari = false;
            this.webApp = false;
            //  Audio
            /**
            *
            * @property audioData
            * @type Boolean
            */
            this.audioData = false;
            /**
            *
            * @property webaudio
            * @type Boolean
            */
            this.webaudio = false;
            /**
            *
            * @property ogg
            * @type Boolean
            */
            this.ogg = false;
            /**
            *
            * @property mp3
            * @type Boolean
            */
            this.mp3 = false;
            /**
            *
            * @property wav
            * @type Boolean
            */
            this.wav = false;
            /**
            *
            * @property m4a
            * @type Boolean
            */
            this.m4a = false;
            //  Device
            /**
            *
            * @property iPhone
            * @type Boolean
            */
            this.iPhone = false;
            /**
            *
            * @property iPhone4
            * @type Boolean
            */
            this.iPhone4 = false;
            /**
            *
            * @property iPad
            * @type Boolean
            */
            this.iPad = false;
            /**
            *
            * @property pixelRatio
            * @type Number
            */
            this.pixelRatio = 0;
            this._checkAudio();
            this._checkBrowser();
            this._checkCSS3D();
            this._checkDevice();
            this._checkFeatures();
            this._checkOS();
        }
        Device.prototype._checkOS = /**
        *
        * @method _checkOS
        * @private
        */
        function () {
            var ua = navigator.userAgent;
            if(/Android/.test(ua)) {
                this.android = true;
            } else if(/CrOS/.test(ua)) {
                this.chromeOS = true;
            } else if(/iP[ao]d|iPhone/i.test(ua)) {
                this.iOS = true;
            } else if(/Linux/.test(ua)) {
                this.linux = true;
            } else if(/Mac OS/.test(ua)) {
                this.macOS = true;
            } else if(/Windows/.test(ua)) {
                this.windows = true;
            }
            if(this.windows || this.macOS || this.linux) {
                this.desktop = true;
            }
        };
        Device.prototype._checkFeatures = /**
        *
        * @method _checkFeatures
        * @private
        */
        function () {
            this.canvas = !!window['CanvasRenderingContext2D'];
            try  {
                this.localStorage = !!localStorage.getItem;
            } catch (error) {
                this.localStorage = false;
            }
            this.file = !!window['File'] && !!window['FileReader'] && !!window['FileList'] && !!window['Blob'];
            this.fileSystem = !!window['requestFileSystem'];
            this.webGL = !!window['WebGLRenderingContext'];
            this.worker = !!window['Worker'];
            if('ontouchstart' in document.documentElement || window.navigator.msPointerEnabled) {
                this.touch = true;
            }
        };
        Device.prototype._checkBrowser = /**
        *
        * @method _checkBrowser
        * @private
        */
        function () {
            var ua = navigator.userAgent;
            if(/Arora/.test(ua)) {
                this.arora = true;
            } else if(/Chrome/.test(ua)) {
                this.chrome = true;
            } else if(/Epiphany/.test(ua)) {
                this.epiphany = true;
            } else if(/Firefox/.test(ua)) {
                this.firefox = true;
            } else if(/Mobile Safari/.test(ua)) {
                this.mobileSafari = true;
            } else if(/MSIE (\d+\.\d+);/.test(ua)) {
                this.ie = true;
                this.ieVersion = parseInt(RegExp.$1);
            } else if(/Midori/.test(ua)) {
                this.midori = true;
            } else if(/Opera/.test(ua)) {
                this.opera = true;
            } else if(/Safari/.test(ua)) {
                this.safari = true;
            }
            // WebApp mode in iOS
            if(navigator['standalone']) {
                this.webApp = true;
            }
        };
        Device.prototype._checkAudio = /**
        *
        * @method _checkAudio
        * @private
        */
        function () {
            this.audioData = !!(window['Audio']);
            this.webaudio = !!(window['webkitAudioContext'] || window['AudioContext']);
            var audioElement = document.createElement('audio');
            var result = false;
            try  {
                if(result = !!audioElement.canPlayType) {
                    if(audioElement.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, '')) {
                        this.ogg = true;
                    }
                    if(audioElement.canPlayType('audio/mpeg;').replace(/^no$/, '')) {
                        this.mp3 = true;
                    }
                    // Mimetypes accepted:
                    //   developer.mozilla.org/En/Media_formats_supported_by_the_audio_and_video_elements
                    //   bit.ly/iphoneoscodecs
                    if(audioElement.canPlayType('audio/wav; codecs="1"').replace(/^no$/, '')) {
                        this.wav = true;
                    }
                    if(audioElement.canPlayType('audio/x-m4a;') || audioElement.canPlayType('audio/aac;').replace(/^no$/, '')) {
                        this.m4a = true;
                    }
                }
            } catch (e) {
            }
        };
        Device.prototype._checkDevice = /**
        *
        * @method _checkDevice
        * @private
        */
        function () {
            this.pixelRatio = window['devicePixelRatio'] || 1;
            this.iPhone = navigator.userAgent.toLowerCase().indexOf('iphone') != -1;
            this.iPhone4 = (this.pixelRatio == 2 && this.iPhone);
            this.iPad = navigator.userAgent.toLowerCase().indexOf('ipad') != -1;
        };
        Device.prototype._checkCSS3D = /**
        *
        * @method _checkCSS3D
        * @private
        */
        function () {
            var el = document.createElement('p');
            var has3d;
            var transforms = {
                'webkitTransform': '-webkit-transform',
                'OTransform': '-o-transform',
                'msTransform': '-ms-transform',
                'MozTransform': '-moz-transform',
                'transform': 'transform'
            };
            // Add it to the body to get the computed style.
            document.body.insertBefore(el, null);
            for(var t in transforms) {
                if(el.style[t] !== undefined) {
                    el.style[t] = "translate3d(1px,1px,1px)";
                    has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
                }
            }
            document.body.removeChild(el);
            this.css3D = (has3d !== undefined && has3d.length > 0 && has3d !== "none");
        };
        Device.prototype.getAll = /**
        *
        * @method getAll
        * @return {String}
        */
        function () {
            var output = '';
            output = output.concat('Device\n');
            output = output.concat('iPhone : ' + this.iPhone + '\n');
            output = output.concat('iPhone4 : ' + this.iPhone4 + '\n');
            output = output.concat('iPad : ' + this.iPad + '\n');
            output = output.concat('\n');
            output = output.concat('Operating System\n');
            output = output.concat('iOS: ' + this.iOS + '\n');
            output = output.concat('Android: ' + this.android + '\n');
            output = output.concat('ChromeOS: ' + this.chromeOS + '\n');
            output = output.concat('Linux: ' + this.linux + '\n');
            output = output.concat('MacOS: ' + this.macOS + '\n');
            output = output.concat('Windows: ' + this.windows + '\n');
            output = output.concat('\n');
            output = output.concat('Browser\n');
            output = output.concat('Arora: ' + this.arora + '\n');
            output = output.concat('Chrome: ' + this.chrome + '\n');
            output = output.concat('Epiphany: ' + this.epiphany + '\n');
            output = output.concat('Firefox: ' + this.firefox + '\n');
            output = output.concat('Internet Explorer: ' + this.ie + ' (' + this.ieVersion + ')\n');
            output = output.concat('Mobile Safari: ' + this.mobileSafari + '\n');
            output = output.concat('Midori: ' + this.midori + '\n');
            output = output.concat('Opera: ' + this.opera + '\n');
            output = output.concat('Safari: ' + this.safari + '\n');
            output = output.concat('\n');
            output = output.concat('Features\n');
            output = output.concat('Canvas: ' + this.canvas + '\n');
            output = output.concat('File: ' + this.file + '\n');
            output = output.concat('FileSystem: ' + this.fileSystem + '\n');
            output = output.concat('LocalStorage: ' + this.localStorage + '\n');
            output = output.concat('WebGL: ' + this.webGL + '\n');
            output = output.concat('Worker: ' + this.worker + '\n');
            output = output.concat('Touch: ' + this.touch + '\n');
            output = output.concat('CSS 3D: ' + this.css3D + '\n');
            output = output.concat('\n');
            output = output.concat('Audio\n');
            output = output.concat('Audio Data: ' + this.canvas + '\n');
            output = output.concat('Web Audio: ' + this.canvas + '\n');
            output = output.concat('Can play OGG: ' + this.canvas + '\n');
            output = output.concat('Can play MP3: ' + this.canvas + '\n');
            output = output.concat('Can play M4A: ' + this.canvas + '\n');
            output = output.concat('Can play WAV: ' + this.canvas + '\n');
            return output;
        };
        return Device;
    })();
    Phaser.Device = Device;    
})(Phaser || (Phaser = {}));
/// <reference path="../Game.ts" />
/**
* Phaser - RandomDataGenerator
*
* An extremely useful repeatable random data generator. Access it via Game.rnd
* Based on Nonsense by Josh Faul https://github.com/jocafa/Nonsense
* Random number generator from http://baagoe.org/en/wiki/Better_random_numbers_for_javascript
*/
var Phaser;
(function (Phaser) {
    var RandomDataGenerator = (function () {
        /**
        * @constructor
        * @param {Array} seeds
        * @return {Phaser.RandomDataGenerator}
        */
        function RandomDataGenerator(seeds) {
            if (typeof seeds === "undefined") { seeds = []; }
            /**
            * @property c
            * @type Number
            * @private
            */
            this.c = 1;
            this.sow(seeds);
        }
        RandomDataGenerator.prototype.uint32 = /**
        * @method uint32
        * @private
        */
        function () {
            return this.rnd.apply(this) * 0x100000000;// 2^32
            
        };
        RandomDataGenerator.prototype.fract32 = /**
        * @method fract32
        * @private
        */
        function () {
            return this.rnd.apply(this) + (this.rnd.apply(this) * 0x200000 | 0) * 1.1102230246251565e-16;// 2^-53
            
        };
        RandomDataGenerator.prototype.rnd = // private random helper
        /**
        * @method rnd
        * @private
        */
        function () {
            var t = 2091639 * this.s0 + this.c * 2.3283064365386963e-10;// 2^-32
            
            this.c = t | 0;
            this.s0 = this.s1;
            this.s1 = this.s2;
            this.s2 = t - this.c;
            return this.s2;
        };
        RandomDataGenerator.prototype.hash = /**
        * @method hash
        * @param {Any} data
        * @private
        */
        function (data) {
            var h, i, n;
            n = 0xefc8249d;
            data = data.toString();
            for(i = 0; i < data.length; i++) {
                n += data.charCodeAt(i);
                h = 0.02519603282416938 * n;
                n = h >>> 0;
                h -= n;
                h *= n;
                n = h >>> 0;
                h -= n;
                n += h * 0x100000000// 2^32
                ;
            }
            return (n >>> 0) * 2.3283064365386963e-10;// 2^-32
            
        };
        RandomDataGenerator.prototype.sow = /**
        * Reset the seed of the random data generator
        * @method sow
        * @param {Array} seeds
        */
        function (seeds) {
            if (typeof seeds === "undefined") { seeds = []; }
            this.s0 = this.hash(' ');
            this.s1 = this.hash(this.s0);
            this.s2 = this.hash(this.s1);
            var seed;
            for(var i = 0; seed = seeds[i++]; ) {
                this.s0 -= this.hash(seed);
                this.s0 += ~~(this.s0 < 0);
                this.s1 -= this.hash(seed);
                this.s1 += ~~(this.s1 < 0);
                this.s2 -= this.hash(seed);
                this.s2 += ~~(this.s2 < 0);
            }
        };
        Object.defineProperty(RandomDataGenerator.prototype, "integer", {
            get: /**
            * Returns a random integer between 0 and 2^32
            * @method integer
            * @return {Number}
            */
            function () {
                return this.uint32();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RandomDataGenerator.prototype, "frac", {
            get: /**
            * Returns a random real number between 0 and 1
            * @method frac
            * @return {Number}
            */
            function () {
                return this.fract32();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RandomDataGenerator.prototype, "real", {
            get: /**
            * Returns a random real number between 0 and 2^32
            * @method real
            * @return {Number}
            */
            function () {
                return this.uint32() + this.fract32();
            },
            enumerable: true,
            configurable: true
        });
        RandomDataGenerator.prototype.integerInRange = /**
        * Returns a random integer between min and max
        * @method integerInRange
        * @param {Number} min
        * @param {Number} max
        * @return {Number}
        */
        function (min, max) {
            return Math.floor(this.realInRange(min, max));
        };
        RandomDataGenerator.prototype.realInRange = /**
        * Returns a random real number between min and max
        * @method realInRange
        * @param {Number} min
        * @param {Number} max
        * @return {Number}
        */
        function (min, max) {
            min = min || 0;
            max = max || 0;
            return this.frac * (max - min) + min;
        };
        Object.defineProperty(RandomDataGenerator.prototype, "normal", {
            get: /**
            * Returns a random real number between -1 and 1
            * @method normal
            * @return {Number}
            */
            function () {
                return 1 - 2 * this.frac;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RandomDataGenerator.prototype, "uuid", {
            get: /**
            * Returns a valid v4 UUID hex string (from https://gist.github.com/1308368)
            * @method uuid
            * @return {String}
            */
            function () {
                var a, b;
                for(b = a = ''; a++ < 36; b += ~a % 5 | a * 3 & 4 ? (a ^ 15 ? 8 ^ this.frac * (a ^ 20 ? 16 : 4) : 4).toString(16) : '-') {
                    ;
                }
                return b;
            },
            enumerable: true,
            configurable: true
        });
        RandomDataGenerator.prototype.pick = /**
        * Returns a random member of `array`
        * @method pick
        * @param {Any} array
        */
        function (array) {
            return array[this.integerInRange(0, array.length)];
        };
        RandomDataGenerator.prototype.weightedPick = /**
        * Returns a random member of `array`, favoring the earlier entries
        * @method weightedPick
        * @param {Any} array
        */
        function (array) {
            return array[~~(Math.pow(this.frac, 2) * array.length)];
        };
        RandomDataGenerator.prototype.timestamp = /**
        * Returns a random timestamp between min and max, or between the beginning of 2000 and the end of 2020 if min and max aren't specified
        * @method timestamp
        * @param {Number} min
        * @param {Number} max
        */
        function (min, max) {
            if (typeof min === "undefined") { min = 946684800000; }
            if (typeof max === "undefined") { max = 1577862000000; }
            return this.realInRange(min, max);
        };
        Object.defineProperty(RandomDataGenerator.prototype, "angle", {
            get: /**
            * Returns a random angle between -180 and 180
            * @method angle
            */
            function () {
                return this.integerInRange(-180, 180);
            },
            enumerable: true,
            configurable: true
        });
        return RandomDataGenerator;
    })();
    Phaser.RandomDataGenerator = RandomDataGenerator;    
})(Phaser || (Phaser = {}));
/// <reference path="../Game.ts" />
/**
* Phaser - RequestAnimationFrame
*
* Abstracts away the use of RAF or setTimeOut for the core game update loop. The callback can be re-mapped on the fly.
*/
var Phaser;
(function (Phaser) {
    var RequestAnimationFrame = (function () {
        /**
        * Constructor
        * @param {Any} callback
        * @return {RequestAnimationFrame} This object.
        */
        function RequestAnimationFrame(callback, callbackContext) {
            /**
            *
            * @property _isSetTimeOut
            * @type Boolean
            * @private
            **/
            this._isSetTimeOut = false;
            /**
            *
            * @property lastTime
            * @type Number
            **/
            this.lastTime = 0;
            /**
            *
            * @property currentTime
            * @type Number
            **/
            this.currentTime = 0;
            /**
            *
            * @property isRunning
            * @type Boolean
            **/
            this.isRunning = false;
            this._callback = callback;
            this._callbackContext = callbackContext;
            var vendors = [
                'ms', 
                'moz', 
                'webkit', 
                'o'
            ];
            for(var x = 0; x < vendors.length && !window.requestAnimationFrame; x++) {
                window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
                window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'];
            }
            this.start();
        }
        RequestAnimationFrame.prototype.setCallback = /**
        *
        * @method callback
        * @param {Any} callback
        **/
        function (callback) {
            this._callback = callback;
        };
        RequestAnimationFrame.prototype.isUsingSetTimeOut = /**
        *
        * @method usingSetTimeOut
        * @return Boolean
        **/
        function () {
            return this._isSetTimeOut;
        };
        RequestAnimationFrame.prototype.isUsingRAF = /**
        *
        * @method usingRAF
        * @return Boolean
        **/
        function () {
            if(this._isSetTimeOut === true) {
                return false;
            } else {
                return true;
            }
        };
        RequestAnimationFrame.prototype.start = /**
        *
        * @method start
        * @param {Any} [callback]
        **/
        function (callback) {
            if (typeof callback === "undefined") { callback = null; }
            var _this = this;
            if(callback) {
                this._callback = callback;
            }
            if(!window.requestAnimationFrame) {
                this._isSetTimeOut = true;
                this._timeOutID = window.setTimeout(function () {
                    return _this.SetTimeoutUpdate();
                }, 0);
            } else {
                this._isSetTimeOut = false;
                window.requestAnimationFrame(function () {
                    return _this.RAFUpdate();
                });
            }
            this.isRunning = true;
        };
        RequestAnimationFrame.prototype.stop = /**
        *
        * @method stop
        **/
        function () {
            if(this._isSetTimeOut) {
                clearTimeout(this._timeOutID);
            } else {
                window.cancelAnimationFrame;
            }
            this.isRunning = false;
        };
        RequestAnimationFrame.prototype.RAFUpdate = function () {
            var _this = this;
            //  Not in IE8 (but neither is RAF) also doesn't use a high performance timer (window.performance.now)
            this.currentTime = Date.now();
            if(this._callback) {
                this._callback.call(this._callbackContext);
            }
            var timeToCall = Math.max(0, 16 - (this.currentTime - this.lastTime));
            window.requestAnimationFrame(function () {
                return _this.RAFUpdate();
            });
            this.lastTime = this.currentTime + timeToCall;
        };
        RequestAnimationFrame.prototype.SetTimeoutUpdate = /**
        *
        * @method SetTimeoutUpdate
        **/
        function () {
            var _this = this;
            //  Not in IE8
            this.currentTime = Date.now();
            if(this._callback) {
                this._callback.call(this._callbackContext);
            }
            var timeToCall = Math.max(0, 16 - (this.currentTime - this.lastTime));
            this._timeOutID = window.setTimeout(function () {
                return _this.SetTimeoutUpdate();
            }, timeToCall);
            this.lastTime = this.currentTime + timeToCall;
        };
        return RequestAnimationFrame;
    })();
    Phaser.RequestAnimationFrame = RequestAnimationFrame;    
})(Phaser || (Phaser = {}));
/// <reference path="../../Game.ts" />
/// <reference path="../../Signal.ts" />
/**
* Phaser - Input
*
* A game specific Input manager that looks after the mouse, keyboard and touch objects. This is updated by the core game loop.
*/
var Phaser;
(function (Phaser) {
    var Input = (function () {
        function Input(game) {
            this.x = 0;
            this.y = 0;
            this.scaleX = 1;
            this.scaleY = 1;
            this.worldX = 0;
            this.worldY = 0;
            this._game = game;
            this.mouse = new Phaser.Mouse(this._game);
            this.keyboard = new Phaser.Keyboard(this._game);
            this.touch = new Phaser.Touch(this._game);
            this.onDown = new Phaser.Signal();
            this.onUp = new Phaser.Signal();
        }
        Input.prototype.update = function () {
            this.x = Math.round(this.x);
            this.y = Math.round(this.y);
            this.worldX = this._game.camera.worldView.x + this.x;
            this.worldY = this._game.camera.worldView.y + this.y;
            this.mouse.update();
            this.touch.update();
        };
        Input.prototype.reset = function () {
            this.mouse.reset();
            this.keyboard.reset();
            this.touch.reset();
        };
        Input.prototype.getWorldX = function (camera) {
            if (typeof camera === "undefined") { camera = this._game.camera; }
            return camera.worldView.x + this.x;
        };
        Input.prototype.getWorldY = function (camera) {
            if (typeof camera === "undefined") { camera = this._game.camera; }
            return camera.worldView.y + this.y;
        };
        Input.prototype.renderDebugInfo = function (x, y, color) {
            if (typeof color === "undefined") { color = 'rgb(255,255,255)'; }
            this._game.stage.context.fillStyle = color;
            this._game.stage.context.fillText('Input', x, y);
            this._game.stage.context.fillText('Screen X: ' + this.x + ' Screen Y: ' + this.y, x, y + 14);
            this._game.stage.context.fillText('World X: ' + this.worldX + ' World Y: ' + this.worldY, x, y + 28);
            this._game.stage.context.fillText('Scale X: ' + this.scaleX.toFixed(1) + ' Scale Y: ' + this.scaleY.toFixed(1), x, y + 42);
        };
        return Input;
    })();
    Phaser.Input = Input;    
})(Phaser || (Phaser = {}));
/// <reference path="../../Game.ts" />
/**
* Phaser - Keyboard
*
* The Keyboard class handles keyboard interactions with the game and the resulting events.
* The avoid stealing all browser input we don't use event.preventDefault. If you would like to trap a specific key however
* then use the addKeyCapture() method.
*/
var Phaser;
(function (Phaser) {
    var Keyboard = (function () {
        function Keyboard(game) {
            this._keys = {
            };
            this._capture = {
            };
            this._game = game;
            this.start();
        }
        Keyboard.prototype.start = function () {
            var _this = this;
            document.body.addEventListener('keydown', function (event) {
                return _this.onKeyDown(event);
            }, false);
            document.body.addEventListener('keyup', function (event) {
                return _this.onKeyUp(event);
            }, false);
        };
        Keyboard.prototype.addKeyCapture = function (keycode) {
            this._capture[keycode] = true;
        };
        Keyboard.prototype.removeKeyCapture = function (keycode) {
            delete this._capture[keycode];
        };
        Keyboard.prototype.clearCaptures = function () {
            this._capture = {
            };
        };
        Keyboard.prototype.onKeyDown = function (event) {
            if(this._capture[event.keyCode]) {
                event.preventDefault();
            }
            if(!this._keys[event.keyCode]) {
                this._keys[event.keyCode] = {
                    isDown: true,
                    timeDown: this._game.time.now,
                    timeUp: 0
                };
            } else {
                this._keys[event.keyCode].isDown = true;
                this._keys[event.keyCode].timeDown = this._game.time.now;
            }
        };
        Keyboard.prototype.onKeyUp = function (event) {
            if(this._capture[event.keyCode]) {
                event.preventDefault();
            }
            if(!this._keys[event.keyCode]) {
                this._keys[event.keyCode] = {
                    isDown: false,
                    timeDown: 0,
                    timeUp: this._game.time.now
                };
            } else {
                this._keys[event.keyCode].isDown = false;
                this._keys[event.keyCode].timeUp = this._game.time.now;
            }
        };
        Keyboard.prototype.reset = function () {
            for(var key in this._keys) {
                this._keys[key].isDown = false;
            }
        };
        Keyboard.prototype.justPressed = function (keycode, duration) {
            if (typeof duration === "undefined") { duration = 250; }
            if(this._keys[keycode] && this._keys[keycode].isDown === true && (this._game.time.now - this._keys[keycode].timeDown < duration)) {
                return true;
            } else {
                return false;
            }
        };
        Keyboard.prototype.justReleased = function (keycode, duration) {
            if (typeof duration === "undefined") { duration = 250; }
            if(this._keys[keycode] && this._keys[keycode].isDown === false && (this._game.time.now - this._keys[keycode].timeUp < duration)) {
                return true;
            } else {
                return false;
            }
        };
        Keyboard.prototype.isDown = function (keycode) {
            if(this._keys[keycode]) {
                return this._keys[keycode].isDown;
            } else {
                return false;
            }
        };
        Keyboard.A = "A".charCodeAt(0);
        Keyboard.B = "B".charCodeAt(0);
        Keyboard.C = "C".charCodeAt(0);
        Keyboard.D = "D".charCodeAt(0);
        Keyboard.E = "E".charCodeAt(0);
        Keyboard.F = "F".charCodeAt(0);
        Keyboard.G = "G".charCodeAt(0);
        Keyboard.H = "H".charCodeAt(0);
        Keyboard.I = "I".charCodeAt(0);
        Keyboard.J = "J".charCodeAt(0);
        Keyboard.K = "K".charCodeAt(0);
        Keyboard.L = "L".charCodeAt(0);
        Keyboard.M = "M".charCodeAt(0);
        Keyboard.N = "N".charCodeAt(0);
        Keyboard.O = "O".charCodeAt(0);
        Keyboard.P = "P".charCodeAt(0);
        Keyboard.Q = "Q".charCodeAt(0);
        Keyboard.R = "R".charCodeAt(0);
        Keyboard.S = "S".charCodeAt(0);
        Keyboard.T = "T".charCodeAt(0);
        Keyboard.U = "U".charCodeAt(0);
        Keyboard.V = "V".charCodeAt(0);
        Keyboard.W = "W".charCodeAt(0);
        Keyboard.X = "X".charCodeAt(0);
        Keyboard.Y = "Y".charCodeAt(0);
        Keyboard.Z = "Z".charCodeAt(0);
        Keyboard.ZERO = "0".charCodeAt(0);
        Keyboard.ONE = "1".charCodeAt(0);
        Keyboard.TWO = "2".charCodeAt(0);
        Keyboard.THREE = "3".charCodeAt(0);
        Keyboard.FOUR = "4".charCodeAt(0);
        Keyboard.FIVE = "5".charCodeAt(0);
        Keyboard.SIX = "6".charCodeAt(0);
        Keyboard.SEVEN = "7".charCodeAt(0);
        Keyboard.EIGHT = "8".charCodeAt(0);
        Keyboard.NINE = "9".charCodeAt(0);
        Keyboard.NUMPAD_0 = 96;
        Keyboard.NUMPAD_1 = 97;
        Keyboard.NUMPAD_2 = 98;
        Keyboard.NUMPAD_3 = 99;
        Keyboard.NUMPAD_4 = 100;
        Keyboard.NUMPAD_5 = 101;
        Keyboard.NUMPAD_6 = 102;
        Keyboard.NUMPAD_7 = 103;
        Keyboard.NUMPAD_8 = 104;
        Keyboard.NUMPAD_9 = 105;
        Keyboard.NUMPAD_MULTIPLY = 106;
        Keyboard.NUMPAD_ADD = 107;
        Keyboard.NUMPAD_ENTER = 108;
        Keyboard.NUMPAD_SUBTRACT = 109;
        Keyboard.NUMPAD_DECIMAL = 110;
        Keyboard.NUMPAD_DIVIDE = 111;
        Keyboard.F1 = 112;
        Keyboard.F2 = 113;
        Keyboard.F3 = 114;
        Keyboard.F4 = 115;
        Keyboard.F5 = 116;
        Keyboard.F6 = 117;
        Keyboard.F7 = 118;
        Keyboard.F8 = 119;
        Keyboard.F9 = 120;
        Keyboard.F10 = 121;
        Keyboard.F11 = 122;
        Keyboard.F12 = 123;
        Keyboard.F13 = 124;
        Keyboard.F14 = 125;
        Keyboard.F15 = 126;
        Keyboard.COLON = 186;
        Keyboard.EQUALS = 187;
        Keyboard.UNDERSCORE = 189;
        Keyboard.QUESTION_MARK = 191;
        Keyboard.TILDE = 192;
        Keyboard.OPEN_BRACKET = 219;
        Keyboard.BACKWARD_SLASH = 220;
        Keyboard.CLOSED_BRACKET = 221;
        Keyboard.QUOTES = 222;
        Keyboard.BACKSPACE = 8;
        Keyboard.TAB = 9;
        Keyboard.CLEAR = 12;
        Keyboard.ENTER = 13;
        Keyboard.SHIFT = 16;
        Keyboard.CONTROL = 17;
        Keyboard.ALT = 18;
        Keyboard.CAPS_LOCK = 20;
        Keyboard.ESC = 27;
        Keyboard.SPACEBAR = 32;
        Keyboard.PAGE_UP = 33;
        Keyboard.PAGE_DOWN = 34;
        Keyboard.END = 35;
        Keyboard.HOME = 36;
        Keyboard.LEFT = 37;
        Keyboard.UP = 38;
        Keyboard.RIGHT = 39;
        Keyboard.DOWN = 40;
        Keyboard.INSERT = 45;
        Keyboard.DELETE = 46;
        Keyboard.HELP = 47;
        Keyboard.NUM_LOCK = 144;
        return Keyboard;
    })();
    Phaser.Keyboard = Keyboard;    
})(Phaser || (Phaser = {}));
/// <reference path="../../Game.ts" />
/**
* Phaser - Mouse
*
* The Mouse class handles mouse interactions with the game and the resulting events.
*/
var Phaser;
(function (Phaser) {
    var Mouse = (function () {
        function Mouse(game) {
            this._x = 0;
            this._y = 0;
            this.isDown = false;
            this.isUp = true;
            this.timeDown = 0;
            this.duration = 0;
            this.timeUp = 0;
            this._game = game;
            this.start();
        }
        Mouse.LEFT_BUTTON = 0;
        Mouse.MIDDLE_BUTTON = 1;
        Mouse.RIGHT_BUTTON = 2;
        Mouse.prototype.start = function () {
            var _this = this;
            this._game.stage.canvas.addEventListener('mousedown', function (event) {
                return _this.onMouseDown(event);
            }, true);
            this._game.stage.canvas.addEventListener('mousemove', function (event) {
                return _this.onMouseMove(event);
            }, true);
            this._game.stage.canvas.addEventListener('mouseup', function (event) {
                return _this.onMouseUp(event);
            }, true);
        };
        Mouse.prototype.reset = function () {
            this.isDown = false;
            this.isUp = true;
        };
        Mouse.prototype.onMouseDown = function (event) {
            this.button = event.button;
            this._x = event.clientX - this._game.stage.x;
            this._y = event.clientY - this._game.stage.y;
            this._game.input.x = this._x * this._game.input.scaleX;
            this._game.input.y = this._y * this._game.input.scaleY;
            this.isDown = true;
            this.isUp = false;
            this.timeDown = this._game.time.now;
            this._game.input.onDown.dispatch(this._game.input.x, this._game.input.y, this.timeDown);
        };
        Mouse.prototype.update = function () {
            //this._game.input.x = this._x * this._game.input.scaleX;
            //this._game.input.y = this._y * this._game.input.scaleY;
            if(this.isDown) {
                this.duration = this._game.time.now - this.timeDown;
            }
        };
        Mouse.prototype.onMouseMove = function (event) {
            this.button = event.button;
            this._x = event.clientX - this._game.stage.x;
            this._y = event.clientY - this._game.stage.y;
            this._game.input.x = this._x * this._game.input.scaleX;
            this._game.input.y = this._y * this._game.input.scaleY;
        };
        Mouse.prototype.onMouseUp = function (event) {
            this.button = event.button;
            this.isDown = false;
            this.isUp = true;
            this.timeUp = this._game.time.now;
            this.duration = this.timeUp - this.timeDown;
            this._x = event.clientX - this._game.stage.x;
            this._y = event.clientY - this._game.stage.y;
            this._game.input.x = this._x * this._game.input.scaleX;
            this._game.input.y = this._y * this._game.input.scaleY;
            this._game.input.onUp.dispatch(this._game.input.x, this._game.input.y, this.timeDown);
        };
        return Mouse;
    })();
    Phaser.Mouse = Mouse;    
})(Phaser || (Phaser = {}));
/// <reference path="../../Game.ts" />
/**
* Phaser - Finger
*
* A Finger object is used by the Touch manager and represents a single finger on the touch screen.
*/
var Phaser;
(function (Phaser) {
    var Finger = (function () {
        /**
        * Constructor
        * @param {Phaser.Game} game.
        * @return {Phaser.Finger} This object.
        */
        function Finger(game) {
            /**
            *
            * @property point
            * @type Point
            **/
            this.point = null;
            /**
            *
            * @property circle
            * @type Circle
            **/
            this.circle = null;
            /**
            *
            * @property withinGame
            * @type Boolean
            */
            this.withinGame = false;
            /**
            * The horizontal coordinate of point relative to the viewport in pixels, excluding any scroll offset
            * @property clientX
            * @type Number
            */
            this.clientX = -1;
            //
            /**
            * The vertical coordinate of point relative to the viewport in pixels, excluding any scroll offset
            * @property clientY
            * @type Number
            */
            this.clientY = -1;
            //
            /**
            * The horizontal coordinate of point relative to the viewport in pixels, including any scroll offset
            * @property pageX
            * @type Number
            */
            this.pageX = -1;
            /**
            * The vertical coordinate of point relative to the viewport in pixels, including any scroll offset
            * @property pageY
            * @type Number
            */
            this.pageY = -1;
            /**
            * The horizontal coordinate of point relative to the screen in pixels
            * @property screenX
            * @type Number
            */
            this.screenX = -1;
            /**
            * The vertical coordinate of point relative to the screen in pixels
            * @property screenY
            * @type Number
            */
            this.screenY = -1;
            /**
            * The horizontal coordinate of point relative to the game element
            * @property x
            * @type Number
            */
            this.x = -1;
            /**
            * The vertical coordinate of point relative to the game element
            * @property y
            * @type Number
            */
            this.y = -1;
            /**
            *
            * @property isDown
            * @type Boolean
            **/
            this.isDown = false;
            /**
            *
            * @property isUp
            * @type Boolean
            **/
            this.isUp = false;
            /**
            *
            * @property timeDown
            * @type Number
            **/
            this.timeDown = 0;
            /**
            *
            * @property duration
            * @type Number
            **/
            this.duration = 0;
            /**
            *
            * @property timeUp
            * @type Number
            **/
            this.timeUp = 0;
            /**
            *
            * @property justPressedRate
            * @type Number
            **/
            this.justPressedRate = 200;
            /**
            *
            * @property justReleasedRate
            * @type Number
            **/
            this.justReleasedRate = 200;
            this._game = game;
            this.active = false;
        }
        Finger.prototype.start = /**
        *
        * @method start
        * @param {Any} event
        */
        function (event) {
            this.identifier = event.identifier;
            this.target = event.target;
            //  populate geom objects
            if(this.point === null) {
                this.point = new Phaser.Point();
            }
            if(this.circle === null) {
                this.circle = new Phaser.Circle(0, 0, 44);
            }
            this.move(event);
            this.active = true;
            this.withinGame = true;
            this.isDown = true;
            this.isUp = false;
            this.timeDown = this._game.time.now;
        };
        Finger.prototype.move = /**
        *
        * @method move
        * @param {Any} event
        */
        function (event) {
            this.clientX = event.clientX;
            this.clientY = event.clientY;
            this.pageX = event.pageX;
            this.pageY = event.pageY;
            this.screenX = event.screenX;
            this.screenY = event.screenY;
            this.x = this.pageX - this._game.stage.offset.x;
            this.y = this.pageY - this._game.stage.offset.y;
            this.point.setTo(this.x, this.y);
            this.circle.setTo(this.x, this.y, 44);
            //  Droppings history (used for gestures and motion tracking)
            this.duration = this._game.time.now - this.timeDown;
        };
        Finger.prototype.leave = /**
        *
        * @method leave
        * @param {Any} event
        */
        function (event) {
            this.withinGame = false;
            this.move(event);
        };
        Finger.prototype.stop = /**
        *
        * @method stop
        * @param {Any} event
        */
        function (event) {
            this.active = false;
            this.withinGame = false;
            this.isDown = false;
            this.isUp = true;
            this.timeUp = this._game.time.now;
            this.duration = this.timeUp - this.timeDown;
        };
        Finger.prototype.justPressed = /**
        *
        * @method justPressed
        * @param {Number} [duration].
        * @return {Boolean}
        */
        function (duration) {
            if (typeof duration === "undefined") { duration = this.justPressedRate; }
            if(this.isDown === true && (this.timeDown + duration) > this._game.time.now) {
                return true;
            } else {
                return false;
            }
        };
        Finger.prototype.justReleased = /**
        *
        * @method justReleased
        * @param {Number} [duration].
        * @return {Boolean}
        */
        function (duration) {
            if (typeof duration === "undefined") { duration = this.justReleasedRate; }
            if(this.isUp === true && (this.timeUp + duration) > this._game.time.now) {
                return true;
            } else {
                return false;
            }
        };
        Finger.prototype.toString = /**
        * Returns a string representation of this object.
        * @method toString
        * @return {string} a string representation of the instance.
        **/
        function () {
            return "[{Finger (identifer=" + this.identifier + " active=" + this.active + " duration=" + this.duration + " withinGame=" + this.withinGame + " x=" + this.x + " y=" + this.y + " clientX=" + this.clientX + " clientY=" + this.clientY + " screenX=" + this.screenX + " screenY=" + this.screenY + " pageX=" + this.pageX + " pageY=" + this.pageY + ")}]";
        };
        return Finger;
    })();
    Phaser.Finger = Finger;    
})(Phaser || (Phaser = {}));
/// <reference path="../../Game.ts" />
/// <reference path="Finger.ts" />
/**
* Phaser - Touch
*
* The Touch class handles touch interactions with the game and the resulting Finger objects.
* http://www.w3.org/TR/touch-events/
* https://developer.mozilla.org/en-US/docs/DOM/TouchList
* http://www.html5rocks.com/en/mobile/touchandmouse/
* Note: Android 2.x only supports 1 touch event at once, no multi-touch
*
*  @todo       Try and resolve update lag in Chrome/Android
*              Gestures (pinch, zoom, swipe)
*              GameObject Touch
*              Touch point within GameObject
*              Input Zones (mouse and touch) - lock entities within them + axis aligned drags
*/
var Phaser;
(function (Phaser) {
    var Touch = (function () {
        /**
        * Constructor
        * @param {Game} game.
        * @return {Touch} This object.
        */
        function Touch(game) {
            /**
            *
            * @property x
            * @type Number
            **/
            this.x = 0;
            /**
            *
            * @property y
            * @type Number
            **/
            this.y = 0;
            /**
            *
            * @property isDown
            * @type Boolean
            **/
            this.isDown = false;
            /**
            *
            * @property isUp
            * @type Boolean
            **/
            this.isUp = true;
            this._game = game;
            this.finger1 = new Phaser.Finger(this._game);
            this.finger2 = new Phaser.Finger(this._game);
            this.finger3 = new Phaser.Finger(this._game);
            this.finger4 = new Phaser.Finger(this._game);
            this.finger5 = new Phaser.Finger(this._game);
            this.finger6 = new Phaser.Finger(this._game);
            this.finger7 = new Phaser.Finger(this._game);
            this.finger8 = new Phaser.Finger(this._game);
            this.finger9 = new Phaser.Finger(this._game);
            this.finger10 = new Phaser.Finger(this._game);
            this._fingers = [
                this.finger1, 
                this.finger2, 
                this.finger3, 
                this.finger4, 
                this.finger5, 
                this.finger6, 
                this.finger7, 
                this.finger8, 
                this.finger9, 
                this.finger10
            ];
            this.touchDown = new Phaser.Signal();
            this.touchUp = new Phaser.Signal();
            this.start();
        }
        Touch.prototype.start = /**
        *
        * @method start
        */
        function () {
            var _this = this;
            this._game.stage.canvas.addEventListener('touchstart', function (event) {
                return _this.onTouchStart(event);
            }, false);
            this._game.stage.canvas.addEventListener('touchmove', function (event) {
                return _this.onTouchMove(event);
            }, false);
            this._game.stage.canvas.addEventListener('touchend', function (event) {
                return _this.onTouchEnd(event);
            }, false);
            this._game.stage.canvas.addEventListener('touchenter', function (event) {
                return _this.onTouchEnter(event);
            }, false);
            this._game.stage.canvas.addEventListener('touchleave', function (event) {
                return _this.onTouchLeave(event);
            }, false);
            this._game.stage.canvas.addEventListener('touchcancel', function (event) {
                return _this.onTouchCancel(event);
            }, false);
            document.addEventListener('touchmove', function (event) {
                return _this.consumeTouchMove(event);
            }, false);
        };
        Touch.prototype.consumeTouchMove = /**
        * Prevent iOS bounce-back (doesn't work?)
        * @method consumeTouchMove
        * @param {Any} event
        **/
        function (event) {
            event.preventDefault();
        };
        Touch.prototype.onTouchStart = /**
        *
        * @method onTouchStart
        * @param {Any} event
        **/
        function (event) {
            event.preventDefault();
            //  A list of all the touch points that BECAME active with the current event
            //  https://developer.mozilla.org/en-US/docs/DOM/TouchList
            //  event.targetTouches = list of all touches on the TARGET ELEMENT (i.e. game dom element)
            //  event.touches = list of all touches on the ENTIRE DOCUMENT, not just the target element
            //  event.changedTouches = the touches that CHANGED in this event, not the total number of them
            for(var i = 0; i < event.changedTouches.length; i++) {
                for(var f = 0; f < this._fingers.length; f++) {
                    if(this._fingers[f].active === false) {
                        this._fingers[f].start(event.changedTouches[i]);
                        this.x = this._fingers[f].x;
                        this.y = this._fingers[f].y;
                        this._game.input.x = this.x * this._game.input.scaleX;
                        this._game.input.y = this.y * this._game.input.scaleY;
                        this.touchDown.dispatch(this._fingers[f].x, this._fingers[f].y, this._fingers[f].timeDown, this._fingers[f].timeUp, this._fingers[f].duration);
                        this._game.input.onDown.dispatch(this._game.input.x, this._game.input.y, this._fingers[f].timeDown);
                        this.isDown = true;
                        this.isUp = false;
                        break;
                    }
                }
            }
        };
        Touch.prototype.onTouchCancel = /**
        * Doesn't appear to be supported by most browsers yet
        * @method onTouchCancel
        * @param {Any} event
        **/
        function (event) {
            event.preventDefault();
            //  Touch cancel - touches that were disrupted (perhaps by moving into a plugin or browser chrome)
            //  http://www.w3.org/TR/touch-events/#dfn-touchcancel
            //  event.changedTouches = the touches that CHANGED in this event, not the total number of them
            for(var i = 0; i < event.changedTouches.length; i++) {
                for(var f = 0; f < this._fingers.length; f++) {
                    if(this._fingers[f].identifier === event.changedTouches[i].identifier) {
                        this._fingers[f].stop(event.changedTouches[i]);
                        break;
                    }
                }
            }
        };
        Touch.prototype.onTouchEnter = /**
        * Doesn't appear to be supported by most browsers yet
        * @method onTouchEnter
        * @param {Any} event
        **/
        function (event) {
            event.preventDefault();
            //  For touch enter and leave its a list of the touch points that have entered or left the target
            //  event.targetTouches = list of all touches on the TARGET ELEMENT (i.e. game dom element)
            //  event.touches = list of all touches on the ENTIRE DOCUMENT, not just the target element
            //  event.changedTouches = the touches that CHANGED in this event, not the total number of them
            for(var i = 0; i < event.changedTouches.length; i++) {
                for(var f = 0; f < this._fingers.length; f++) {
                    if(this._fingers[f].active === false) {
                        this._fingers[f].start(event.changedTouches[i]);
                        break;
                    }
                }
            }
        };
        Touch.prototype.onTouchLeave = /**
        * Doesn't appear to be supported by most browsers yet
        * @method onTouchLeave
        * @param {Any} event
        **/
        function (event) {
            event.preventDefault();
            //  For touch enter and leave its a list of the touch points that have entered or left the target
            //  event.changedTouches = the touches that CHANGED in this event, not the total number of them
            for(var i = 0; i < event.changedTouches.length; i++) {
                for(var f = 0; f < this._fingers.length; f++) {
                    if(this._fingers[f].identifier === event.changedTouches[i].identifier) {
                        this._fingers[f].leave(event.changedTouches[i]);
                        break;
                    }
                }
            }
        };
        Touch.prototype.onTouchMove = /**
        *
        * @method onTouchMove
        * @param {Any} event
        **/
        function (event) {
            event.preventDefault();
            //  event.targetTouches = list of all touches on the TARGET ELEMENT (i.e. game dom element)
            //  event.touches = list of all touches on the ENTIRE DOCUMENT, not just the target element
            //  event.changedTouches = the touches that CHANGED in this event, not the total number of them
            for(var i = 0; i < event.changedTouches.length; i++) {
                for(var f = 0; f < this._fingers.length; f++) {
                    if(this._fingers[f].identifier === event.changedTouches[i].identifier) {
                        this._fingers[f].move(event.changedTouches[i]);
                        this.x = this._fingers[f].x;
                        this.y = this._fingers[f].y;
                        this._game.input.x = this.x * this._game.input.scaleX;
                        this._game.input.y = this.y * this._game.input.scaleY;
                        break;
                    }
                }
            }
        };
        Touch.prototype.onTouchEnd = /**
        *
        * @method onTouchEnd
        * @param {Any} event
        **/
        function (event) {
            event.preventDefault();
            //  For touch end its a list of the touch points that have been removed from the surface
            //  https://developer.mozilla.org/en-US/docs/DOM/TouchList
            //  event.changedTouches = the touches that CHANGED in this event, not the total number of them
            for(var i = 0; i < event.changedTouches.length; i++) {
                for(var f = 0; f < this._fingers.length; f++) {
                    if(this._fingers[f].identifier === event.changedTouches[i].identifier) {
                        this._fingers[f].stop(event.changedTouches[i]);
                        this.x = this._fingers[f].x;
                        this.y = this._fingers[f].y;
                        this._game.input.x = this.x * this._game.input.scaleX;
                        this._game.input.y = this.y * this._game.input.scaleY;
                        this.touchUp.dispatch(this._fingers[f].x, this._fingers[f].y, this._fingers[f].timeDown, this._fingers[f].timeUp, this._fingers[f].duration);
                        this._game.input.onUp.dispatch(this._game.input.x, this._game.input.y, this._fingers[f].timeUp);
                        this.isDown = false;
                        this.isUp = true;
                        break;
                    }
                }
            }
        };
        Touch.prototype.calculateDistance = /**
        *
        * @method calculateDistance
        * @param {Finger} finger1
        * @param {Finger} finger2
        **/
        function (finger1, finger2) {
        };
        Touch.prototype.calculateAngle = /**
        *
        * @method calculateAngle
        * @param {Finger} finger1
        * @param {Finger} finger2
        **/
        function (finger1, finger2) {
        };
        Touch.prototype.checkOverlap = /**
        *
        * @method checkOverlap
        * @param {Finger} finger1
        * @param {Finger} finger2
        **/
        function (finger1, finger2) {
        };
        Touch.prototype.update = /**
        *
        * @method update
        */
        function () {
        };
        Touch.prototype.stop = /**
        *
        * @method stop
        */
        function () {
            //this._domElement.addEventListener('touchstart', (event) => this.onTouchStart(event), false);
            //this._domElement.addEventListener('touchmove', (event) => this.onTouchMove(event), false);
            //this._domElement.addEventListener('touchend', (event) => this.onTouchEnd(event), false);
            //this._domElement.addEventListener('touchenter', (event) => this.onTouchEnter(event), false);
            //this._domElement.addEventListener('touchleave', (event) => this.onTouchLeave(event), false);
            //this._domElement.addEventListener('touchcancel', (event) => this.onTouchCancel(event), false);
                    };
        Touch.prototype.reset = /**
        *
        * @method reset
        **/
        function () {
            this.isDown = false;
            this.isUp = false;
        };
        return Touch;
    })();
    Phaser.Touch = Touch;    
})(Phaser || (Phaser = {}));
/// <reference path="../Game.ts" />
/// <reference path="../Group.ts" />
/**
* Phaser - Emitter
*
* Emitter is a lightweight particle emitter. It can be used for one-time explosions or for
* continuous effects like rain and fire. All it really does is launch Particle objects out
* at set intervals, and fixes their positions and velocities accorindgly.
*/
var Phaser;
(function (Phaser) {
    var Emitter = (function (_super) {
        __extends(Emitter, _super);
        /**
        * Creates a new <code>Emitter</code> object at a specific position.
        * Does NOT automatically generate or attach particles!
        *
        * @param	X		The X position of the emitter.
        * @param	Y		The Y position of the emitter.
        * @param	Size	Optional, specifies a maximum capacity for this emitter.
        */
        function Emitter(game, X, Y, Size) {
            if (typeof X === "undefined") { X = 0; }
            if (typeof Y === "undefined") { Y = 0; }
            if (typeof Size === "undefined") { Size = 0; }
                _super.call(this, game, Size);
            this.x = X;
            this.y = Y;
            this.width = 0;
            this.height = 0;
            this.minParticleSpeed = new Phaser.Point(-100, -100);
            this.maxParticleSpeed = new Phaser.Point(100, 100);
            this.minRotation = -360;
            this.maxRotation = 360;
            this.gravity = 0;
            this.particleClass = null;
            this.particleDrag = new Phaser.Point();
            this.frequency = 0.1;
            this.lifespan = 3;
            this.bounce = 0;
            this._quantity = 0;
            this._counter = 0;
            this._explode = true;
            this.on = false;
            this._point = new Phaser.Point();
        }
        Emitter.prototype.destroy = /**
        * Clean up memory.
        */
        function () {
            this.minParticleSpeed = null;
            this.maxParticleSpeed = null;
            this.particleDrag = null;
            this.particleClass = null;
            this._point = null;
            _super.prototype.destroy.call(this);
        };
        Emitter.prototype.makeParticles = /**
        * This function generates a new array of particle sprites to attach to the emitter.
        *
        * @param	Graphics		If you opted to not pre-configure an array of Sprite objects, you can simply pass in a particle image or sprite sheet.
        * @param	Quantity		The number of particles to generate when using the "create from image" option.
        * @param	BakedRotations	How many frames of baked rotation to use (boosts performance).  Set to zero to not use baked rotations.
        * @param	Multiple		Whether the image in the Graphics param is a single particle or a bunch of particles (if it's a bunch, they need to be square!).
        * @param	Collide			Whether the particles should be flagged as not 'dead' (non-colliding particles are higher performance).  0 means no collisions, 0-1 controls scale of particle's bounding box.
        *
        * @return	This Emitter instance (nice for chaining stuff together, if you're into that).
        */
        function (Graphics, Quantity, BakedRotations, Multiple, Collide) {
            if (typeof Quantity === "undefined") { Quantity = 50; }
            if (typeof BakedRotations === "undefined") { BakedRotations = 16; }
            if (typeof Multiple === "undefined") { Multiple = false; }
            if (typeof Collide === "undefined") { Collide = 0.8; }
            this.maxSize = Quantity;
            var totalFrames = 1;
            /*
            if(Multiple)
            {
            var sprite:Sprite = new Sprite(this._game);
            sprite.loadGraphic(Graphics,true);
            totalFrames = sprite.frames;
            sprite.destroy();
            }
            */
            var randomFrame;
            var particle;
            var i = 0;
            while(i < Quantity) {
                if(this.particleClass == null) {
                    particle = new Phaser.Particle(this._game);
                } else {
                    particle = new this.particleClass(this._game);
                }
                if(Multiple) {
                    /*
                    randomFrame = this._game.math.random()*totalFrames;
                    if(BakedRotations > 0)
                    particle.loadRotatedGraphic(Graphics,BakedRotations,randomFrame);
                    else
                    {
                    particle.loadGraphic(Graphics,true);
                    particle.frame = randomFrame;
                    }
                    */
                                    } else {
                    /*
                    if (BakedRotations > 0)
                    particle.loadRotatedGraphic(Graphics,BakedRotations);
                    else
                    particle.loadGraphic(Graphics);
                    */
                    if(Graphics) {
                        particle.loadGraphic(Graphics);
                    }
                }
                if(Collide > 0) {
                    particle.width *= Collide;
                    particle.height *= Collide;
                    //particle.centerOffsets();
                                    } else {
                    particle.allowCollisions = Phaser.Collision.NONE;
                }
                particle.exists = false;
                this.add(particle);
                i++;
            }
            return this;
        };
        Emitter.prototype.update = /**
        * Called automatically by the game loop, decides when to launch particles and when to "die".
        */
        function () {
            if(this.on) {
                if(this._explode) {
                    this.on = false;
                    var i = 0;
                    var l = this._quantity;
                    if((l <= 0) || (l > this.length)) {
                        l = this.length;
                    }
                    while(i < l) {
                        this.emitParticle();
                        i++;
                    }
                    this._quantity = 0;
                } else {
                    this._timer += this._game.time.elapsed;
                    while((this.frequency > 0) && (this._timer > this.frequency) && this.on) {
                        this._timer -= this.frequency;
                        this.emitParticle();
                        if((this._quantity > 0) && (++this._counter >= this._quantity)) {
                            this.on = false;
                            this._quantity = 0;
                        }
                    }
                }
            }
            _super.prototype.update.call(this);
        };
        Emitter.prototype.kill = /**
        * Call this function to turn off all the particles and the emitter.
        */
        function () {
            this.on = false;
            _super.prototype.kill.call(this);
        };
        Emitter.prototype.start = /**
        * Call this function to start emitting particles.
        *
        * @param	Explode		Whether the particles should all burst out at once.
        * @param	Lifespan	How long each particle lives once emitted. 0 = forever.
        * @param	Frequency	Ignored if Explode is set to true. Frequency is how often to emit a particle. 0 = never emit, 0.1 = 1 particle every 0.1 seconds, 5 = 1 particle every 5 seconds.
        * @param	Quantity	How many particles to launch. 0 = "all of the particles".
        */
        function (Explode, Lifespan, Frequency, Quantity) {
            if (typeof Explode === "undefined") { Explode = true; }
            if (typeof Lifespan === "undefined") { Lifespan = 0; }
            if (typeof Frequency === "undefined") { Frequency = 0.1; }
            if (typeof Quantity === "undefined") { Quantity = 0; }
            this.revive();
            this.visible = true;
            this.on = true;
            this._explode = Explode;
            this.lifespan = Lifespan;
            this.frequency = Frequency;
            this._quantity += Quantity;
            this._counter = 0;
            this._timer = 0;
        };
        Emitter.prototype.emitParticle = /**
        * This function can be used both internally and externally to emit the next particle.
        */
        function () {
            var particle = this.recycle(Phaser.Particle);
            particle.lifespan = this.lifespan;
            particle.elasticity = this.bounce;
            particle.reset(this.x - (particle.width >> 1) + this._game.math.random() * this.width, this.y - (particle.height >> 1) + this._game.math.random() * this.height);
            particle.visible = true;
            if(this.minParticleSpeed.x != this.maxParticleSpeed.x) {
                particle.velocity.x = this.minParticleSpeed.x + this._game.math.random() * (this.maxParticleSpeed.x - this.minParticleSpeed.x);
            } else {
                particle.velocity.x = this.minParticleSpeed.x;
            }
            if(this.minParticleSpeed.y != this.maxParticleSpeed.y) {
                particle.velocity.y = this.minParticleSpeed.y + this._game.math.random() * (this.maxParticleSpeed.y - this.minParticleSpeed.y);
            } else {
                particle.velocity.y = this.minParticleSpeed.y;
            }
            particle.acceleration.y = this.gravity;
            if(this.minRotation != this.maxRotation) {
                particle.angularVelocity = this.minRotation + this._game.math.random() * (this.maxRotation - this.minRotation);
            } else {
                particle.angularVelocity = this.minRotation;
            }
            if(particle.angularVelocity != 0) {
                particle.angle = this._game.math.random() * 360 - 180;
            }
            particle.drag.x = this.particleDrag.x;
            particle.drag.y = this.particleDrag.y;
            particle.onEmit();
        };
        Emitter.prototype.setSize = /**
        * A more compact way of setting the width and height of the emitter.
        *
        * @param	Width	The desired width of the emitter (particles are spawned randomly within these dimensions).
        * @param	Height	The desired height of the emitter.
        */
        function (Width, Height) {
            this.width = Width;
            this.height = Height;
        };
        Emitter.prototype.setXSpeed = /**
        * A more compact way of setting the X velocity range of the emitter.
        *
        * @param	Min		The minimum value for this range.
        * @param	Max		The maximum value for this range.
        */
        function (Min, Max) {
            if (typeof Min === "undefined") { Min = 0; }
            if (typeof Max === "undefined") { Max = 0; }
            this.minParticleSpeed.x = Min;
            this.maxParticleSpeed.x = Max;
        };
        Emitter.prototype.setYSpeed = /**
        * A more compact way of setting the Y velocity range of the emitter.
        *
        * @param	Min		The minimum value for this range.
        * @param	Max		The maximum value for this range.
        */
        function (Min, Max) {
            if (typeof Min === "undefined") { Min = 0; }
            if (typeof Max === "undefined") { Max = 0; }
            this.minParticleSpeed.y = Min;
            this.maxParticleSpeed.y = Max;
        };
        Emitter.prototype.setRotation = /**
        * A more compact way of setting the angular velocity constraints of the emitter.
        *
        * @param	Min		The minimum value for this range.
        * @param	Max		The maximum value for this range.
        */
        function (Min, Max) {
            if (typeof Min === "undefined") { Min = 0; }
            if (typeof Max === "undefined") { Max = 0; }
            this.minRotation = Min;
            this.maxRotation = Max;
        };
        Emitter.prototype.at = /**
        * Change the emitter's midpoint to match the midpoint of a <code>Object</code>.
        *
        * @param	Object		The <code>Object</code> that you want to sync up with.
        */
        function (Object) {
            Object.getMidpoint(this._point);
            this.x = this._point.x - (this.width >> 1);
            this.y = this._point.y - (this.height >> 1);
        };
        return Emitter;
    })(Phaser.Group);
    Phaser.Emitter = Emitter;    
})(Phaser || (Phaser = {}));
/// <reference path="../Game.ts" />
/**
* Phaser - GeomSprite
*
* A GeomSprite is a special kind of GameObject that contains a base geometry class (Circle, Line, Point, Rectangle).
* They can be rendered in the game and used for collision just like any other game object. Display of them is controlled
* via the lineWidth / lineColor / fillColor and renderOutline / renderFill properties.
*/
var Phaser;
(function (Phaser) {
    var GeomSprite = (function (_super) {
        __extends(GeomSprite, _super);
        function GeomSprite(game, x, y) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
                _super.call(this, game, x, y);
            //  local rendering related temp vars to help avoid gc spikes
            this._dx = 0;
            this._dy = 0;
            this._dw = 0;
            this._dh = 0;
            this.type = 0;
            this.renderOutline = true;
            this.renderFill = true;
            this.lineWidth = 1;
            this.lineColor = 'rgb(0,255,0)';
            this.fillColor = 'rgb(0,100,0)';
            this.type = GeomSprite.UNASSIGNED;
            return this;
        }
        GeomSprite.UNASSIGNED = 0;
        GeomSprite.CIRCLE = 1;
        GeomSprite.LINE = 2;
        GeomSprite.POINT = 3;
        GeomSprite.RECTANGLE = 4;
        GeomSprite.prototype.loadCircle = function (circle) {
            this.refresh();
            this.circle = circle;
            this.type = GeomSprite.CIRCLE;
            return this;
        };
        GeomSprite.prototype.loadLine = function (line) {
            this.refresh();
            this.line = line;
            this.type = GeomSprite.LINE;
            return this;
        };
        GeomSprite.prototype.loadPoint = function (point) {
            this.refresh();
            this.point = point;
            this.type = GeomSprite.POINT;
            return this;
        };
        GeomSprite.prototype.loadRectangle = function (rect) {
            this.refresh();
            this.rect = rect;
            this.type = GeomSprite.RECTANGLE;
            return this;
        };
        GeomSprite.prototype.createCircle = function (diameter) {
            this.refresh();
            this.circle = new Phaser.Circle(this.x, this.y, diameter);
            this.type = GeomSprite.CIRCLE;
            this.bounds.setTo(this.circle.x - this.circle.radius, this.circle.y - this.circle.radius, this.circle.diameter, this.circle.diameter);
            return this;
        };
        GeomSprite.prototype.createLine = function (x, y) {
            this.refresh();
            this.line = new Phaser.Line(this.x, this.y, x, y);
            this.type = GeomSprite.LINE;
            this.bounds.setTo(this.x, this.y, this.line.width, this.line.height);
            return this;
        };
        GeomSprite.prototype.createPoint = function () {
            this.refresh();
            this.point = new Phaser.Point(this.x, this.y);
            this.type = GeomSprite.POINT;
            this.bounds.width = 1;
            this.bounds.height = 1;
            return this;
        };
        GeomSprite.prototype.createRectangle = function (width, height) {
            this.refresh();
            this.rect = new Phaser.Rectangle(this.x, this.y, width, height);
            this.type = GeomSprite.RECTANGLE;
            this.bounds.copyFrom(this.rect);
            return this;
        };
        GeomSprite.prototype.refresh = function () {
            this.circle = null;
            this.line = null;
            this.point = null;
            this.rect = null;
        };
        GeomSprite.prototype.update = function () {
            //  Update bounds and position?
            if(this.type == GeomSprite.UNASSIGNED) {
                return;
            } else if(this.type == GeomSprite.CIRCLE) {
                this.circle.x = this.x;
                this.circle.y = this.y;
                this.bounds.width = this.circle.diameter;
                this.bounds.height = this.circle.diameter;
            } else if(this.type == GeomSprite.LINE) {
                this.line.x1 = this.x;
                this.line.y1 = this.y;
                this.bounds.setTo(this.x, this.y, this.line.width, this.line.height);
            } else if(this.type == GeomSprite.POINT) {
                this.point.x = this.x;
                this.point.y = this.y;
            } else if(this.type == GeomSprite.RECTANGLE) {
                this.rect.x = this.x;
                this.rect.y = this.y;
                this.bounds.copyFrom(this.rect);
            }
        };
        GeomSprite.prototype.inCamera = function (camera) {
            if(this.scrollFactor.x !== 1.0 || this.scrollFactor.y !== 1.0) {
                this._dx = this.bounds.x - (camera.x * this.scrollFactor.x);
                this._dy = this.bounds.y - (camera.y * this.scrollFactor.x);
                this._dw = this.bounds.width * this.scale.x;
                this._dh = this.bounds.height * this.scale.y;
                return (camera.right > this._dx) && (camera.x < this._dx + this._dw) && (camera.bottom > this._dy) && (camera.y < this._dy + this._dh);
            } else {
                return camera.intersects(this.bounds);
            }
        };
        GeomSprite.prototype.render = function (camera, cameraOffsetX, cameraOffsetY) {
            //  Render checks
            if(this.type == GeomSprite.UNASSIGNED || this.visible === false || this.scale.x == 0 || this.scale.y == 0 || this.alpha < 0.1 || this.inCamera(camera.worldView) == false) {
                return false;
            }
            //  Alpha
            if(this.alpha !== 1) {
                var globalAlpha = this._game.stage.context.globalAlpha;
                this._game.stage.context.globalAlpha = this.alpha;
            }
            this._dx = cameraOffsetX + (this.bounds.x - camera.worldView.x);
            this._dy = cameraOffsetY + (this.bounds.y - camera.worldView.y);
            this._dw = this.bounds.width * this.scale.x;
            this._dh = this.bounds.height * this.scale.y;
            //  Circles are drawn center based
            if(this.type == GeomSprite.CIRCLE) {
                this._dx += this.circle.radius;
                this._dy += this.circle.radius;
            }
            //	Apply camera difference
            if(this.scrollFactor.x !== 1.0 || this.scrollFactor.y !== 1.0) {
                this._dx -= (camera.worldView.x * this.scrollFactor.x);
                this._dy -= (camera.worldView.y * this.scrollFactor.y);
            }
            //	Rotation is disabled for now as I don't want it to be misleading re: collision
            /*
            if (this.angle !== 0)
            {
            this._game.stage.context.save();
            this._game.stage.context.translate(this._dx + (this._dw / 2) - this.origin.x, this._dy + (this._dh / 2) - this.origin.y);
            this._game.stage.context.rotate(this.angle * (Math.PI / 180));
            this._dx = -(this._dw / 2);
            this._dy = -(this._dh / 2);
            }
            */
            this._dx = Math.round(this._dx);
            this._dy = Math.round(this._dy);
            this._dw = Math.round(this._dw);
            this._dh = Math.round(this._dh);
            this._game.stage.saveCanvasValues();
            //  Debug
            //this._game.stage.context.fillStyle = 'rgba(255,0,0,0.5)';
            //this._game.stage.context.fillRect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);
            this._game.stage.context.lineWidth = this.lineWidth;
            this._game.stage.context.strokeStyle = this.lineColor;
            this._game.stage.context.fillStyle = this.fillColor;
            if(this._game.stage.fillStyle !== this.fillColor) {
            }
            //  Primitive Renderer
            if(this.type == GeomSprite.CIRCLE) {
                this._game.stage.context.beginPath();
                this._game.stage.context.arc(this._dx, this._dy, this.circle.radius, 0, Math.PI * 2);
                this._game.stage.context.stroke();
                if(this.renderFill) {
                    this._game.stage.context.fill();
                }
                this._game.stage.context.closePath();
            } else if(this.type == GeomSprite.LINE) {
                this._game.stage.context.beginPath();
                this._game.stage.context.moveTo(this._dx, this._dy);
                this._game.stage.context.lineTo(this.line.x2, this.line.y2);
                this._game.stage.context.stroke();
                this._game.stage.context.closePath();
            } else if(this.type == GeomSprite.POINT) {
                this._game.stage.context.fillRect(this._dx, this._dy, 2, 2);
            } else if(this.type == GeomSprite.RECTANGLE) {
                //  We can use the faster fillRect if we don't need the outline
                if(this.renderOutline == false) {
                    this._game.stage.context.fillRect(this._dx, this._dy, this.rect.width, this.rect.height);
                } else {
                    this._game.stage.context.beginPath();
                    this._game.stage.context.rect(this._dx, this._dy, this.rect.width, this.rect.height);
                    this._game.stage.context.stroke();
                    if(this.renderFill) {
                        this._game.stage.context.fill();
                    }
                    this._game.stage.context.closePath();
                }
                //  And now the edge points
                this._game.stage.context.fillStyle = 'rgb(255,255,255)';
                this.renderPoint(this._dx, this._dy, this.rect.topLeft, 2);
                this.renderPoint(this._dx, this._dy, this.rect.topCenter, 2);
                this.renderPoint(this._dx, this._dy, this.rect.topRight, 2);
                this.renderPoint(this._dx, this._dy, this.rect.leftCenter, 2);
                this.renderPoint(this._dx, this._dy, this.rect.center, 2);
                this.renderPoint(this._dx, this._dy, this.rect.rightCenter, 2);
                this.renderPoint(this._dx, this._dy, this.rect.bottomLeft, 2);
                this.renderPoint(this._dx, this._dy, this.rect.bottomCenter, 2);
                this.renderPoint(this._dx, this._dy, this.rect.bottomRight, 2);
            }
            this._game.stage.restoreCanvasValues();
            if(this.rotation !== 0) {
                this._game.stage.context.translate(0, 0);
                this._game.stage.context.restore();
            }
            if(globalAlpha > -1) {
                this._game.stage.context.globalAlpha = globalAlpha;
            }
            return true;
        };
        GeomSprite.prototype.renderPoint = function (offsetX, offsetY, point, size) {
            offsetX = 0;
            offsetY = 0;
            this._game.stage.context.fillRect(offsetX + point.x, offsetY + point.y, 1, 1);
        };
        GeomSprite.prototype.renderDebugInfo = function (x, y, color) {
            if (typeof color === "undefined") { color = 'rgb(255,255,255)'; }
            //this._game.stage.context.fillStyle = color;
            //this._game.stage.context.fillText('Sprite: ' + this.name + ' (' + this.bounds.width + ' x ' + this.bounds.height + ')', x, y);
            //this._game.stage.context.fillText('x: ' + this.bounds.x.toFixed(1) + ' y: ' + this.bounds.y.toFixed(1) + ' rotation: ' + this.angle.toFixed(1), x, y + 14);
            //this._game.stage.context.fillText('dx: ' + this._dx.toFixed(1) + ' dy: ' + this._dy.toFixed(1) + ' dw: ' + this._dw.toFixed(1) + ' dh: ' + this._dh.toFixed(1), x, y + 28);
            //this._game.stage.context.fillText('sx: ' + this._sx.toFixed(1) + ' sy: ' + this._sy.toFixed(1) + ' sw: ' + this._sw.toFixed(1) + ' sh: ' + this._sh.toFixed(1), x, y + 42);
                    };
        GeomSprite.prototype.collide = //  Gives a basic boolean response to a geometric collision.
        //  If you need the details of the collision use the Collision functions instead and inspect the IntersectResult object.
        function (source) {
            //  Circle vs. Circle
            if(this.type == GeomSprite.CIRCLE && source.type == GeomSprite.CIRCLE) {
                return Phaser.Collision.circleToCircle(this.circle, source.circle).result;
            }
            //  Circle vs. Rect
            if(this.type == GeomSprite.CIRCLE && source.type == GeomSprite.RECTANGLE) {
                return Phaser.Collision.circleToRectangle(this.circle, source.rect).result;
            }
            //  Circle vs. Point
            if(this.type == GeomSprite.CIRCLE && source.type == GeomSprite.POINT) {
                return Phaser.Collision.circleContainsPoint(this.circle, source.point).result;
            }
            //  Circle vs. Line
            if(this.type == GeomSprite.CIRCLE && source.type == GeomSprite.LINE) {
                return Phaser.Collision.lineToCircle(source.line, this.circle).result;
            }
            //  Rect vs. Rect
            if(this.type == GeomSprite.RECTANGLE && source.type == GeomSprite.RECTANGLE) {
                return Phaser.Collision.rectangleToRectangle(this.rect, source.rect).result;
            }
            //  Rect vs. Circle
            if(this.type == GeomSprite.RECTANGLE && source.type == GeomSprite.CIRCLE) {
                return Phaser.Collision.circleToRectangle(source.circle, this.rect).result;
            }
            //  Rect vs. Point
            if(this.type == GeomSprite.RECTANGLE && source.type == GeomSprite.POINT) {
                return Phaser.Collision.pointToRectangle(source.point, this.rect).result;
            }
            //  Rect vs. Line
            if(this.type == GeomSprite.RECTANGLE && source.type == GeomSprite.LINE) {
                return Phaser.Collision.lineToRectangle(source.line, this.rect).result;
            }
            //  Point vs. Point
            if(this.type == GeomSprite.POINT && source.type == GeomSprite.POINT) {
                return this.point.equals(source.point);
            }
            //  Point vs. Circle
            if(this.type == GeomSprite.POINT && source.type == GeomSprite.CIRCLE) {
                return Phaser.Collision.circleContainsPoint(source.circle, this.point).result;
            }
            //  Point vs. Rect
            if(this.type == GeomSprite.POINT && source.type == GeomSprite.RECTANGLE) {
                return Phaser.Collision.pointToRectangle(this.point, source.rect).result;
            }
            //  Point vs. Line
            if(this.type == GeomSprite.POINT && source.type == GeomSprite.LINE) {
                return source.line.isPointOnLine(this.point.x, this.point.y);
            }
            //  Line vs. Line
            if(this.type == GeomSprite.LINE && source.type == GeomSprite.LINE) {
                return Phaser.Collision.lineSegmentToLineSegment(this.line, source.line).result;
            }
            //  Line vs. Circle
            if(this.type == GeomSprite.LINE && source.type == GeomSprite.CIRCLE) {
                return Phaser.Collision.lineToCircle(this.line, source.circle).result;
            }
            //  Line vs. Rect
            if(this.type == GeomSprite.LINE && source.type == GeomSprite.RECTANGLE) {
                return Phaser.Collision.lineSegmentToRectangle(this.line, source.rect).result;
            }
            //  Line vs. Point
            if(this.type == GeomSprite.LINE && source.type == GeomSprite.POINT) {
                return this.line.isPointOnLine(source.point.x, source.point.y);
            }
            return false;
        };
        return GeomSprite;
    })(Phaser.GameObject);
    Phaser.GeomSprite = GeomSprite;    
})(Phaser || (Phaser = {}));
/// <reference path="../Game.ts" />
/// <reference path="Sprite.ts" />
/**
* Phaser - Particle
*
* This is a simple particle class that extends a Sprite to have a slightly more
* specialised behaviour. It is used exclusively by the Emitter class and can be extended as required.
*/
var Phaser;
(function (Phaser) {
    var Particle = (function (_super) {
        __extends(Particle, _super);
        /**
        * Instantiate a new particle.  Like <code>Sprite</code>, all meaningful creation
        * happens during <code>loadGraphic()</code> or <code>makeGraphic()</code> or whatever.
        */
        function Particle(game) {
                _super.call(this, game);
            this.lifespan = 0;
            this.friction = 500;
        }
        Particle.prototype.update = /**
        * The particle's main update logic.  Basically it checks to see if it should
        * be dead yet, and then has some special bounce behavior if there is some gravity on it.
        */
        function () {
            //lifespan behavior
            if(this.lifespan <= 0) {
                return;
            }
            this.lifespan -= this._game.time.elapsed;
            if(this.lifespan <= 0) {
                this.kill();
            }
            //simpler bounce/spin behavior for now
            if(this.touching) {
                if(this.angularVelocity != 0) {
                    this.angularVelocity = -this.angularVelocity;
                }
            }
            if(this.acceleration.y > 0)//special behavior for particles with gravity
             {
                if(this.touching & Phaser.Collision.FLOOR) {
                    this.drag.x = this.friction;
                    if(!(this.wasTouching & Phaser.Collision.FLOOR)) {
                        if(this.velocity.y < -this.elasticity * 10) {
                            if(this.angularVelocity != 0) {
                                this.angularVelocity *= -this.elasticity;
                            }
                        } else {
                            this.velocity.y = 0;
                            this.angularVelocity = 0;
                        }
                    }
                } else {
                    this.drag.x = 0;
                }
            }
        };
        Particle.prototype.onEmit = /**
        * Triggered whenever this object is launched by a <code>Emitter</code>.
        * You can override this to add custom behavior like a sound or AI or something.
        */
        function () {
        };
        return Particle;
    })(Phaser.Sprite);
    Phaser.Particle = Particle;    
})(Phaser || (Phaser = {}));
/// <reference path="../Game.ts" />
/**
* Phaser - Tile
*
* A simple helper object for <code>Tilemap</code> that helps expand collision opportunities and control.
*/
var Phaser;
(function (Phaser) {
    var Tile = (function (_super) {
        __extends(Tile, _super);
        /**
        * Instantiate this new tile object.  This is usually called from <code>Tilemap.loadMap()</code>.
        *
        * @param Tilemap			A reference to the tilemap object creating the tile.
        * @param Index				The actual core map data index for this tile type.
        * @param Width				The width of the tile.
        * @param Height			The height of the tile.
        * @param Visible			Whether the tile is visible or not.
        * @param AllowCollisions	The collision flags for the object.  By default this value is ANY or NONE depending on the parameters sent to loadMap().
        */
        function Tile(game, Tilemap, Index, Width, Height, Visible, AllowCollisions) {
                _super.call(this, game, 0, 0, Width, Height);
            this.immovable = true;
            this.moves = false;
            this.callback = null;
            this.filter = null;
            this.tilemap = Tilemap;
            this.index = Index;
            this.visible = Visible;
            this.allowCollisions = AllowCollisions;
            this.mapIndex = 0;
        }
        Tile.prototype.destroy = /**
        * Clean up memory.
        */
        function () {
            _super.prototype.destroy.call(this);
            this.callback = null;
            this.tilemap = null;
        };
        return Tile;
    })(Phaser.GameObject);
    Phaser.Tile = Tile;    
})(Phaser || (Phaser = {}));
/// <reference path="../Game.ts" />
/**
* Phaser - TilemapBuffer
*
* Responsible for rendering a portion of a tilemap to the given Camera.
*/
var Phaser;
(function (Phaser) {
    var TilemapBuffer = (function () {
        function TilemapBuffer(game, camera, tilemap, texture, tileOffsets) {
            this._startX = 0;
            this._maxX = 0;
            this._startY = 0;
            this._maxY = 0;
            this._tx = 0;
            this._ty = 0;
            this._dx = 0;
            this._dy = 0;
            this._oldCameraX = 0;
            this._oldCameraY = 0;
            this._dirty = true;
            //console.log('New TilemapBuffer created for Camera ' + camera.ID);
            this._game = game;
            this.camera = camera;
            this._tilemap = tilemap;
            this._texture = texture;
            this._tileOffsets = tileOffsets;
            //this.createCanvas();
                    }
        TilemapBuffer.prototype.createCanvas = function () {
            this.canvas = document.createElement('canvas');
            this.canvas.width = this._game.stage.width;
            this.canvas.height = this._game.stage.height;
            this.context = this.canvas.getContext('2d');
        };
        TilemapBuffer.prototype.update = function () {
            /*
            if (this.camera.worldView.x !== this._oldCameraX || this.camera.worldView.y !== this._oldCameraY)
            {
            this._dirty = true;
            }
            
            this._oldCameraX = this.camera.worldView.x;
            this._oldCameraY = this.camera.worldView.y;
            */
                    };
        TilemapBuffer.prototype.renderDebugInfo = function (x, y, color) {
            if (typeof color === "undefined") { color = 'rgb(255,255,255)'; }
            this._game.stage.context.fillStyle = color;
            this._game.stage.context.fillText('TilemapBuffer', x, y);
            this._game.stage.context.fillText('startX: ' + this._startX + ' endX: ' + this._maxX, x, y + 14);
            this._game.stage.context.fillText('startY: ' + this._startY + ' endY: ' + this._maxY, x, y + 28);
            this._game.stage.context.fillText('dx: ' + this._dx + ' dy: ' + this._dy, x, y + 42);
            this._game.stage.context.fillText('Dirty: ' + this._dirty, x, y + 56);
        };
        TilemapBuffer.prototype.render = function (dx, dy) {
            /*
            if (this._dirty == false)
            {
            this._game.stage.context.drawImage(this.canvas, 0, 0);
            
            return true;
            }
            */
            //  Work out how many tiles we can fit into our camera and round it up for the edges
            this._maxX = this._game.math.ceil(this.camera.width / this._tilemap.tileWidth) + 1;
            this._maxY = this._game.math.ceil(this.camera.height / this._tilemap.tileHeight) + 1;
            //  And now work out where in the tilemap the camera actually is
            this._startX = this._game.math.floor(this.camera.worldView.x / this._tilemap.tileWidth);
            this._startY = this._game.math.floor(this.camera.worldView.y / this._tilemap.tileHeight);
            //  Tilemap bounds check
            if(this._startX < 0) {
                this._startX = 0;
            }
            if(this._startY < 0) {
                this._startY = 0;
            }
            if(this._startX + this._maxX > this._tilemap.widthInTiles) {
                this._startX = this._tilemap.widthInTiles - this._maxX;
            }
            if(this._startY + this._maxY > this._tilemap.heightInTiles) {
                this._startY = this._tilemap.heightInTiles - this._maxY;
            }
            //  Finally get the offset to avoid the blocky movement
            this._dx = dx;
            this._dy = dy;
            this._dx += -(this.camera.worldView.x - (this._startX * this._tilemap.tileWidth));
            this._dy += -(this.camera.worldView.y - (this._startY * this._tilemap.tileHeight));
            this._tx = this._dx;
            this._ty = this._dy;
            for(var row = this._startY; row < this._startY + this._maxY; row++) {
                this._columnData = this._tilemap.mapData[row];
                for(var tile = this._startX; tile < this._startX + this._maxX; tile++) {
                    if(this._tileOffsets[this._columnData[tile]]) {
                        //this.context.drawImage(
                        this._game.stage.context.drawImage(this._texture, // Source Image
                        this._tileOffsets[this._columnData[tile]].x, // Source X (location within the source image)
                        this._tileOffsets[this._columnData[tile]].y, // Source Y
                        this._tilemap.tileWidth, //	Source Width
                        this._tilemap.tileHeight, //	Source Height
                        this._tx, //	Destination X (where on the canvas it'll be drawn)
                        this._ty, //	Destination Y
                        this._tilemap.tileWidth, //	Destination Width (always same as Source Width unless scaled)
                        this._tilemap.tileHeight);
                        //	Destination Height (always same as Source Height unless scaled)
                        this._tx += this._tilemap.tileWidth;
                    }
                }
                this._tx = this._dx;
                this._ty += this._tilemap.tileHeight;
            }
            //this._game.stage.context.drawImage(this.canvas, 0, 0);
            //console.log('dirty cleaned');
            //this._dirty = false;
            return true;
        };
        return TilemapBuffer;
    })();
    Phaser.TilemapBuffer = TilemapBuffer;    
})(Phaser || (Phaser = {}));
/// <reference path="../Game.ts" />
/// <reference path="GameObject.ts" />
/// <reference path="../system/Tile.ts" />
/// <reference path="../system/TilemapBuffer.ts" />
/**
* Phaser - Tilemap
*
* This GameObject allows for the display of a tilemap within the game world. Tile maps consist of an image, tile data and a size.
* Internally it creates a TilemapBuffer for each camera in the world.
*/
var Phaser;
(function (Phaser) {
    var Tilemap = (function (_super) {
        __extends(Tilemap, _super);
        function Tilemap(game, key, mapData, format, tileWidth, tileHeight) {
            if (typeof tileWidth === "undefined") { tileWidth = 0; }
            if (typeof tileHeight === "undefined") { tileHeight = 0; }
                _super.call(this, game);
            this._dx = 0;
            this._dy = 0;
            this.widthInTiles = 0;
            this.heightInTiles = 0;
            this.widthInPixels = 0;
            this.heightInPixels = 0;
            //  How many extra tiles to draw around the edge of the screen (for fast scrolling games, or to optimise mobile performance try increasing this)
            //  The number is the amount of extra tiles PER SIDE, so a value of 10 would be (10 tiles + screen size + 10 tiles)
            this.tileBoundary = 10;
            this._texture = this._game.cache.getImage(key);
            this._tilemapBuffers = [];
            this.isGroup = false;
            this.tileWidth = tileWidth;
            this.tileHeight = tileHeight;
            this.boundsInTiles = new Phaser.Rectangle();
            this.mapFormat = format;
            switch(format) {
                case Tilemap.FORMAT_CSV:
                    this.parseCSV(game.cache.getText(mapData));
                    break;
                case Tilemap.FORMAT_TILED_JSON:
                    this.parseTiledJSON(game.cache.getText(mapData));
                    break;
            }
            this.parseTileOffsets();
            this.createTilemapBuffers();
        }
        Tilemap.FORMAT_CSV = 0;
        Tilemap.FORMAT_TILED_JSON = 1;
        Tilemap.prototype.parseCSV = function (data) {
            //console.log('parseMapData');
            this.mapData = [];
            //  Trim any rogue whitespace from the data
            data = data.trim();
            var rows = data.split("\n");
            //console.log('rows', rows);
            for(var i = 0; i < rows.length; i++) {
                var column = rows[i].split(",");
                //console.log('column', column);
                var output = [];
                if(column.length > 0) {
                    //  Set the width based on the first row
                    if(this.widthInTiles == 0) {
                        //  Maybe -1?
                        this.widthInTiles = column.length;
                    }
                    //  We have a new row of tiles
                    this.heightInTiles++;
                    //  Parse it
                    for(var c = 0; c < column.length; c++) {
                        output[c] = parseInt(column[c]);
                    }
                    this.mapData.push(output);
                }
            }
            //console.log('final map array');
            //console.log(this.mapData);
            if(this.widthInTiles > 0) {
                this.widthInPixels = this.tileWidth * this.widthInTiles;
            }
            if(this.heightInTiles > 0) {
                this.heightInPixels = this.tileHeight * this.heightInTiles;
            }
            this.boundsInTiles.setTo(0, 0, this.widthInTiles, this.heightInTiles);
        };
        Tilemap.prototype.parseTiledJSON = function (data) {
            //console.log('parseTiledJSON');
            this.mapData = [];
            //  Trim any rogue whitespace from the data
            data = data.trim();
            //  We ought to change this soon, so we have layer support, but for now let's just get it working
            var json = JSON.parse(data);
            //  Right now we assume no errors at all with the parsing (safe I know)
            this.tileWidth = json.tilewidth;
            this.tileHeight = json.tileheight;
            //  Parse the first layer only
            this.widthInTiles = json.layers[0].width;
            this.heightInTiles = json.layers[0].height;
            this.widthInPixels = this.widthInTiles * this.tileWidth;
            this.heightInPixels = this.heightInTiles * this.tileHeight;
            this.boundsInTiles.setTo(0, 0, this.widthInTiles, this.heightInTiles);
            //console.log('width in tiles', this.widthInTiles);
            //console.log('height in tiles', this.heightInTiles);
            //console.log('width in px', this.widthInPixels);
            //console.log('height in px', this.heightInPixels);
            //  Now let's get the data
            var c = 0;
            var row;
            for(var i = 0; i < json.layers[0].data.length; i++) {
                if(c == 0) {
                    row = [];
                }
                row.push(json.layers[0].data[i]);
                c++;
                if(c == this.widthInTiles) {
                    this.mapData.push(row);
                    c = 0;
                }
            }
            //console.log('mapData');
            //console.log(this.mapData);
                    };
        Tilemap.prototype.getMapSegment = function (area) {
        };
        Tilemap.prototype.createTilemapBuffers = function () {
            var cams = this._game.world.getAllCameras();
            for(var i = 0; i < cams.length; i++) {
                this._tilemapBuffers[cams[i].ID] = new Phaser.TilemapBuffer(this._game, cams[i], this, this._texture, this._tileOffsets);
            }
        };
        Tilemap.prototype.parseTileOffsets = function () {
            this._tileOffsets = [];
            var i = 0;
            if(this.mapFormat == Tilemap.FORMAT_TILED_JSON) {
                //  For some reason Tiled counts from 1 not 0
                this._tileOffsets[0] = null;
                i = 1;
            }
            for(var ty = 0; ty < this._texture.height; ty += this.tileHeight) {
                for(var tx = 0; tx < this._texture.width; tx += this.tileWidth) {
                    this._tileOffsets[i] = {
                        x: tx,
                        y: ty
                    };
                    i++;
                }
            }
        };
        Tilemap.prototype.update = /*
        //  Use a Signal?
        public addTilemapBuffers(camera:Camera) {
        
        console.log('added new camera to tilemap');
        this._tilemapBuffers[camera.ID] = new TilemapBuffer(this._game, camera, this, this._texture, this._tileOffsets);
        
        }
        */
        function () {
            //  Check if any of the cameras have scrolled far enough for us to need to refresh a TilemapBuffer
            this._tilemapBuffers[0].update();
        };
        Tilemap.prototype.renderDebugInfo = function (x, y, color) {
            if (typeof color === "undefined") { color = 'rgb(255,255,255)'; }
            this._tilemapBuffers[0].renderDebugInfo(x, y, color);
        };
        Tilemap.prototype.render = function (camera, cameraOffsetX, cameraOffsetY) {
            if(this.visible === false || this.scale.x == 0 || this.scale.y == 0 || this.alpha < 0.1) {
                return false;
            }
            this._dx = cameraOffsetX + (this.bounds.x - camera.worldView.x);
            this._dy = cameraOffsetY + (this.bounds.y - camera.worldView.y);
            this._dx = Math.round(this._dx);
            this._dy = Math.round(this._dy);
            if(this._tilemapBuffers[camera.ID]) {
                //this._tilemapBuffers[camera.ID].render(this._dx, this._dy);
                this._tilemapBuffers[camera.ID].render(cameraOffsetX, cameraOffsetY);
            }
            return true;
        };
        return Tilemap;
    })(Phaser.GameObject);
    Phaser.Tilemap = Tilemap;    
})(Phaser || (Phaser = {}));
/// <reference path="AnimationManager.ts" />
/// <reference path="Basic.ts" />
/// <reference path="Cache.ts" />
/// <reference path="CameraManager.ts" />
/// <reference path="Collision.ts" />
/// <reference path="DynamicTexture.ts" />
/// <reference path="GameMath.ts" />
/// <reference path="Group.ts" />
/// <reference path="Loader.ts" />
/// <reference path="Motion.ts" />
/// <reference path="Signal.ts" />
/// <reference path="SignalBinding.ts" />
/// <reference path="SoundManager.ts" />
/// <reference path="Stage.ts" />
/// <reference path="Time.ts" />
/// <reference path="TweenManager.ts" />
/// <reference path="World.ts" />
/// <reference path="system/Device.ts" />
/// <reference path="system/RandomDataGenerator.ts" />
/// <reference path="system/RequestAnimationFrame.ts" />
/// <reference path="system/input/Input.ts" />
/// <reference path="system/input/Keyboard.ts" />
/// <reference path="system/input/Mouse.ts" />
/// <reference path="system/input/Touch.ts" />
/// <reference path="gameobjects/Emitter.ts" />
/// <reference path="gameobjects/GameObject.ts" />
/// <reference path="gameobjects/GeomSprite.ts" />
/// <reference path="gameobjects/Particle.ts" />
/// <reference path="gameobjects/Sprite.ts" />
/// <reference path="gameobjects/Tilemap.ts" />
/**
* Phaser - Game
*
* This is where the magic happens. The Game object is the heart of your game, providing quick access to common
* functions and handling the boot process.
*/
var Phaser;
(function (Phaser) {
    var Game = (function () {
        function Game(callbackContext, parent, width, height, initCallback, createCallback, updateCallback, renderCallback) {
            if (typeof parent === "undefined") { parent = ''; }
            if (typeof width === "undefined") { width = 800; }
            if (typeof height === "undefined") { height = 600; }
            if (typeof initCallback === "undefined") { initCallback = null; }
            if (typeof createCallback === "undefined") { createCallback = null; }
            if (typeof updateCallback === "undefined") { updateCallback = null; }
            if (typeof renderCallback === "undefined") { renderCallback = null; }
            var _this = this;
            this._maxAccumulation = 32;
            this._accumulator = 0;
            this._step = 0;
            this._loadComplete = false;
            this._paused = false;
            this._pendingState = null;
            this.onInitCallback = null;
            this.onCreateCallback = null;
            this.onUpdateCallback = null;
            this.onRenderCallback = null;
            this.onPausedCallback = null;
            this.isBooted = false;
            this.callbackContext = callbackContext;
            this.onInitCallback = initCallback;
            this.onCreateCallback = createCallback;
            this.onUpdateCallback = updateCallback;
            this.onRenderCallback = renderCallback;
            if(document.readyState === 'complete' || document.readyState === 'interactive') {
                this.boot(parent, width, height);
            } else {
                document.addEventListener('DOMContentLoaded', function () {
                    return _this.boot(parent, width, height);
                }, false);
            }
        }
        Game.prototype.boot = function (parent, width, height) {
            var _this = this;
            if(!document.body) {
                window.setTimeout(function () {
                    return _this.boot(parent, width, height);
                }, 13);
            } else {
                this.device = new Phaser.Device();
                this.motion = new Phaser.Motion(this);
                this.math = new Phaser.GameMath(this);
                this.stage = new Phaser.Stage(this, parent, width, height);
                this.world = new Phaser.World(this, width, height);
                this.sound = new Phaser.SoundManager(this);
                this.cache = new Phaser.Cache(this);
                this.collision = new Phaser.Collision(this);
                this.loader = new Phaser.Loader(this, this.loadComplete);
                this.time = new Phaser.Time(this);
                this.tweens = new Phaser.TweenManager(this);
                this.input = new Phaser.Input(this);
                this.rnd = new Phaser.RandomDataGenerator([
                    (Date.now() * Math.random()).toString()
                ]);
                this.framerate = 60;
                //  Display the default game screen?
                if(this.onInitCallback == null && this.onCreateCallback == null && this.onUpdateCallback == null && this.onRenderCallback == null && this._pendingState == null) {
                    this.isBooted = false;
                    this.stage.drawInitScreen();
                } else {
                    this.isBooted = true;
                    this._loadComplete = false;
                    this._raf = new Phaser.RequestAnimationFrame(this.loop, this);
                    if(this._pendingState) {
                        this.switchState(this._pendingState, false, false);
                    } else {
                        this.startState();
                    }
                }
            }
        };
        Game.prototype.loadComplete = function () {
            //  Called when the loader has finished after init was run
            this._loadComplete = true;
        };
        Game.prototype.loop = function () {
            this.time.update();
            this.tweens.update();
            if(this._paused == true) {
                if(this.onPausedCallback !== null) {
                    this.onPausedCallback.call(this.callbackContext);
                }
                return;
            }
            this.input.update();
            this.stage.update();
            this._accumulator += this.time.delta;
            if(this._accumulator > this._maxAccumulation) {
                this._accumulator = this._maxAccumulation;
            }
            while(this._accumulator >= this._step) {
                this.time.elapsed = this.time.timeScale * (this._step / 1000);
                this.world.update();
                this._accumulator = this._accumulator - this._step;
            }
            if(this._loadComplete && this.onUpdateCallback) {
                this.onUpdateCallback.call(this.callbackContext);
            }
            this.world.render();
            if(this._loadComplete && this.onRenderCallback) {
                this.onRenderCallback.call(this.callbackContext);
            }
        };
        Game.prototype.startState = function () {
            if(this.onInitCallback !== null) {
                this.onInitCallback.call(this.callbackContext);
            } else {
                //  No init? Then there was nothing to load either
                if(this.onCreateCallback !== null) {
                    this.onCreateCallback.call(this.callbackContext);
                }
                this._loadComplete = true;
            }
        };
        Game.prototype.setCallbacks = function (initCallback, createCallback, updateCallback, renderCallback) {
            if (typeof initCallback === "undefined") { initCallback = null; }
            if (typeof createCallback === "undefined") { createCallback = null; }
            if (typeof updateCallback === "undefined") { updateCallback = null; }
            if (typeof renderCallback === "undefined") { renderCallback = null; }
            this.onInitCallback = initCallback;
            this.onCreateCallback = createCallback;
            this.onUpdateCallback = updateCallback;
            this.onRenderCallback = renderCallback;
        };
        Game.prototype.switchState = function (state, clearWorld, clearCache) {
            if (typeof clearWorld === "undefined") { clearWorld = true; }
            if (typeof clearCache === "undefined") { clearCache = false; }
            if(this.isBooted == false) {
                this._pendingState = state;
                return;
            }
            //  Prototype?
            if(typeof state === 'function') {
                state = new state(this);
            }
            //  Ok, have we got the right functions?
            if(state['create'] || state['update']) {
                this.callbackContext = state;
                this.onInitCallback = null;
                this.onCreateCallback = null;
                this.onUpdateCallback = null;
                this.onRenderCallback = null;
                this.onPausedCallback = null;
                //  Bingo, let's set them up
                if(state['init']) {
                    this.onInitCallback = state['init'];
                }
                if(state['create']) {
                    this.onCreateCallback = state['create'];
                }
                if(state['update']) {
                    this.onUpdateCallback = state['update'];
                }
                if(state['render']) {
                    this.onRenderCallback = state['render'];
                }
                if(state['paused']) {
                    this.onPausedCallback = state['paused'];
                }
                if(clearWorld) {
                    this.world.destroy();
                    if(clearCache == true) {
                        this.cache.destroy();
                    }
                }
                this._loadComplete = false;
                this.startState();
            } else {
                throw Error("Invalid State object given. Must contain at least a create or update function.");
                return;
            }
        };
        Game.prototype.destroy = //  Nuke the whole game from orbit
        function () {
            this.callbackContext = null;
            this.onInitCallback = null;
            this.onCreateCallback = null;
            this.onUpdateCallback = null;
            this.onRenderCallback = null;
            this.onPausedCallback = null;
            this.camera = null;
            this.cache = null;
            this.input = null;
            this.loader = null;
            this.sound = null;
            this.stage = null;
            this.time = null;
            this.world = null;
            this.isBooted = false;
        };
        Object.defineProperty(Game.prototype, "paused", {
            get: function () {
                return this._paused;
            },
            set: function (value) {
                if(value == true && this._paused == false) {
                    this._paused = true;
                } else if(value == false && this._paused == true) {
                    this._paused = false;
                    this.time.time = Date.now();
                    this.input.reset();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Game.prototype, "framerate", {
            get: function () {
                return 1000 / this._step;
            },
            set: function (value) {
                this._step = 1000 / value;
                if(this._maxAccumulation < this._step) {
                    this._maxAccumulation = this._step;
                }
            },
            enumerable: true,
            configurable: true
        });
        Game.prototype.createCamera = //  Handy Proxy methods
        function (x, y, width, height) {
            return this.world.createCamera(x, y, width, height);
        };
        Game.prototype.createGeomSprite = function (x, y) {
            return this.world.createGeomSprite(x, y);
        };
        Game.prototype.createSprite = function (x, y, key) {
            if (typeof key === "undefined") { key = ''; }
            return this.world.createSprite(x, y, key);
        };
        Game.prototype.createDynamicTexture = function (key, width, height) {
            return this.world.createDynamicTexture(key, width, height);
        };
        Game.prototype.createGroup = function (MaxSize) {
            if (typeof MaxSize === "undefined") { MaxSize = 0; }
            return this.world.createGroup(MaxSize);
        };
        Game.prototype.createParticle = function () {
            return this.world.createParticle();
        };
        Game.prototype.createEmitter = function (x, y, size) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            if (typeof size === "undefined") { size = 0; }
            return this.world.createEmitter(x, y, size);
        };
        Game.prototype.createTilemap = function (key, mapData, format, tileWidth, tileHeight) {
            return this.world.createTilemap(key, mapData, format, tileWidth, tileHeight);
        };
        Game.prototype.createTween = function (obj) {
            return this.tweens.create(obj);
        };
        Game.prototype.collide = function (ObjectOrGroup1, ObjectOrGroup2, NotifyCallback) {
            if (typeof ObjectOrGroup1 === "undefined") { ObjectOrGroup1 = null; }
            if (typeof ObjectOrGroup2 === "undefined") { ObjectOrGroup2 = null; }
            if (typeof NotifyCallback === "undefined") { NotifyCallback = null; }
            return this.collision.overlap(ObjectOrGroup1, ObjectOrGroup2, NotifyCallback, Phaser.Collision.separate);
        };
        return Game;
    })();
    Phaser.Game = Game;    
})(Phaser || (Phaser = {}));
/// <reference path="../Game.ts" />
/**
* Phaser - MicroPoint
*
* The MicroPoint object represents a location in a two-dimensional coordinate system,
* where x represents the horizontal axis and y represents the vertical axis.
* It is different to the Point class in that it doesn't contain any of the help methods like add/substract/distanceTo, etc.
* Use a MicroPoint when all you literally need is a solid container for x and y (such as in the Rectangle class).
*/
var Phaser;
(function (Phaser) {
    var MicroPoint = (function () {
        /**
        * Creates a new point. If you pass no parameters to this method, a point is created at (0,0).
        * @class MicroPoint
        * @constructor
        * @param {Number} x The horizontal position of this point (default 0)
        * @param {Number} y The vertical position of this point (default 0)
        **/
        function MicroPoint(x, y, parent) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            if (typeof parent === "undefined") { parent = null; }
            this._x = x;
            this._y = y;
            this.parent = parent;
        }
        Object.defineProperty(MicroPoint.prototype, "x", {
            get: /**
            * The x coordinate of the top-left corner of the rectangle
            * @property x
            * @type Number
            **/
            function () {
                return this._x;
            },
            set: /**
            * The x coordinate of the top-left corner of the rectangle
            * @property x
            * @type Number
            **/
            function (value) {
                this._x = value;
                if(this.parent) {
                    this.parent.updateBounds();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MicroPoint.prototype, "y", {
            get: /**
            * The y coordinate of the top-left corner of the rectangle
            * @property y
            * @type Number
            **/
            function () {
                return this._y;
            },
            set: /**
            * The y coordinate of the top-left corner of the rectangle
            * @property y
            * @type Number
            **/
            function (value) {
                this._y = value;
                if(this.parent) {
                    this.parent.updateBounds();
                }
            },
            enumerable: true,
            configurable: true
        });
        MicroPoint.prototype.copyFrom = /**
        * Copies the x and y values from any given object to this MicroPoint.
        * @method copyFrom
        * @param {any} source - The object to copy from.
        * @return {MicroPoint} This MicroPoint object. Useful for chaining method calls.
        **/
        function (source) {
            return this.setTo(source.x, source.y);
        };
        MicroPoint.prototype.copyTo = /**
        * Copies the x and y values from this MicroPoint to any given object.
        * @method copyTo
        * @param {any} target - The object to copy to.
        * @return {any} The target object.
        **/
        function (target) {
            target.x = this._x;
            target.y = this._y;
            return target;
        };
        MicroPoint.prototype.setTo = /**
        * Sets the x and y values of this MicroPoint object to the given coordinates.
        * @method setTo
        * @param {Number} x - The horizontal position of this point.
        * @param {Number} y - The vertical position of this point.
        * @return {MicroPoint} This MicroPoint object. Useful for chaining method calls.
        **/
        function (x, y, callParent) {
            if (typeof callParent === "undefined") { callParent = true; }
            this._x = x;
            this._y = y;
            if(this.parent != null && callParent == true) {
                this.parent.updateBounds();
            }
            return this;
        };
        MicroPoint.prototype.equals = /**
        * Determines whether this MicroPoint object and the given object are equal. They are equal if they have the same x and y values.
        * @method equals
        * @param {any} point - The object to compare against. Must have x and y properties.
        * @return {Boolean} A value of true if the object is equal to this MicroPoin object; false if it is not equal.
        **/
        function (toCompare) {
            if(this._x === toCompare.x && this._y === toCompare.y) {
                return true;
            } else {
                return false;
            }
        };
        MicroPoint.prototype.toString = /**
        * Returns a string representation of this object.
        * @method toString
        * @return {string} a string representation of the instance.
        **/
        function () {
            return '[{MicroPoint (x=' + this._x + ' y=' + this._y + ')}]';
        };
        return MicroPoint;
    })();
    Phaser.MicroPoint = MicroPoint;    
})(Phaser || (Phaser = {}));
/// <reference path="Game.ts" />
/**
* Phaser - State
*
* This is a base State class which can be extended if you are creating your game using TypeScript.
*/
var Phaser;
(function (Phaser) {
    var State = (function () {
        function State(game) {
            this.game = game;
            this.camera = game.camera;
            this.cache = game.cache;
            this.collision = game.collision;
            this.input = game.input;
            this.loader = game.loader;
            this.math = game.math;
            this.motion = game.motion;
            this.sound = game.sound;
            this.stage = game.stage;
            this.time = game.time;
            this.tweens = game.tweens;
            this.world = game.world;
        }
        State.prototype.init = //  Overload these in your own States
        function () {
        };
        State.prototype.create = function () {
        };
        State.prototype.update = function () {
        };
        State.prototype.render = function () {
        };
        State.prototype.paused = function () {
        };
        State.prototype.createCamera = //  Handy Proxy methods
        function (x, y, width, height) {
            return this.game.world.createCamera(x, y, width, height);
        };
        State.prototype.createGeomSprite = function (x, y) {
            return this.world.createGeomSprite(x, y);
        };
        State.prototype.createSprite = function (x, y, key) {
            if (typeof key === "undefined") { key = ''; }
            return this.game.world.createSprite(x, y, key);
        };
        State.prototype.createDynamicTexture = function (key, width, height) {
            return this.game.world.createDynamicTexture(key, width, height);
        };
        State.prototype.createGroup = function (MaxSize) {
            if (typeof MaxSize === "undefined") { MaxSize = 0; }
            return this.game.world.createGroup(MaxSize);
        };
        State.prototype.createParticle = function () {
            return this.game.world.createParticle();
        };
        State.prototype.createEmitter = function (x, y, size) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            if (typeof size === "undefined") { size = 0; }
            return this.game.world.createEmitter(x, y, size);
        };
        State.prototype.createTilemap = function (key, mapData, format, tileWidth, tileHeight) {
            return this.game.world.createTilemap(key, mapData, format, tileWidth, tileHeight);
        };
        State.prototype.createTween = function (obj) {
            return this.game.tweens.create(obj);
        };
        State.prototype.collide = function (ObjectOrGroup1, ObjectOrGroup2, NotifyCallback) {
            if (typeof ObjectOrGroup1 === "undefined") { ObjectOrGroup1 = null; }
            if (typeof ObjectOrGroup2 === "undefined") { ObjectOrGroup2 = null; }
            if (typeof NotifyCallback === "undefined") { NotifyCallback = null; }
            return this.collision.overlap(ObjectOrGroup1, ObjectOrGroup2, NotifyCallback, Phaser.Collision.separate);
        };
        return State;
    })();
    Phaser.State = State;    
})(Phaser || (Phaser = {}));
