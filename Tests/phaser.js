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
            this.ignoreGlobalUpdate = false;
            this.ignoreGlobalRender = false;
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
        function (forceUpdate) {
            if (typeof forceUpdate === "undefined") { forceUpdate = false; }
        };
        Basic.prototype.postUpdate = /**
        * Post-update is called right after <code>update()</code> on each object in the game loop.
        */
        function () {
        };
        Basic.prototype.render = function (camera, cameraOffsetX, cameraOffsetY, forceRender) {
            if (typeof forceRender === "undefined") { forceRender = false; }
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
                this._bindings[i]._destroy();
                this._bindings.splice(i, 1);
            }
            return listener;
        };
        Signal.prototype.removeAll = /**
        * Remove all listeners from the Signal.
        */
        function () {
            if(this._bindings) {
                var n = this._bindings.length;
                while(n--) {
                    this._bindings[n]._destroy();
                }
                this._bindings.length = 0;
            }
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
/// <reference path="../Game.ts" />
/**
* Phaser - CollisionMask
*/
var Phaser;
(function (Phaser) {
    var CollisionMask = (function () {
        /**
        * CollisionMask constructor. Creates a new <code>CollisionMask</code> for the given GameObject.
        *
        * @param game {Phaser.Game} Current game instance.
        * @param parent {Phaser.GameObject} The GameObject this CollisionMask belongs to.
        * @param x {number} The initial x position of the CollisionMask.
        * @param y {number} The initial y position of the CollisionMask.
        * @param width {number} The width of the CollisionMask.
        * @param height {number} The height of the CollisionMask.
        */
        function CollisionMask(game, parent, x, y, width, height) {
            /**
            * Geom type of this sprite. (available: QUAD, POINT, CIRCLE, LINE, RECTANGLE, POLYGON)
            * @type {number}
            */
            this.type = 0;
            this._game = game;
            this._parent = parent;
            //  By default the CollisionMask is a quad
            this.type = CollisionMask.QUAD;
            this.quad = new Phaser.Quad(this._parent.x, this._parent.y, this._parent.width, this._parent.height);
            this.offset = new Phaser.MicroPoint(0, 0);
            this.last = new Phaser.MicroPoint(0, 0);
            this._ref = this.quad;
            return this;
        }
        CollisionMask.QUAD = 0;
        CollisionMask.POINT = 1;
        CollisionMask.CIRCLE = 2;
        CollisionMask.LINE = 3;
        CollisionMask.RECTANGLE = 4;
        CollisionMask.POLYGON = 5;
        CollisionMask.prototype.createCircle = /**
        * Create a circle shape with specific diameter.
        * @param diameter {number} Diameter of the circle.
        * @return {CollisionMask} This
        */
        function (diameter) {
            this.type = CollisionMask.CIRCLE;
            this.circle = new Phaser.Circle(this.last.x, this.last.y, diameter);
            this._ref = this.circle;
            return this;
        };
        CollisionMask.prototype.preUpdate = /**
        * Pre-update is called right before update() on each object in the game loop.
        */
        function () {
            this.last.x = this.x;
            this.last.y = this.y;
        };
        CollisionMask.prototype.update = function () {
            this._ref.x = this._parent.x + this.offset.x;
            this._ref.y = this._parent.y + this.offset.y;
        };
        CollisionMask.prototype.render = /**
        * Renders the bounding box around this Sprite and the contact points. Useful for visually debugging.
        * @param camera {Camera} Camera the bound will be rendered to.
        * @param cameraOffsetX {number} X offset of bound to the camera.
        * @param cameraOffsetY {number} Y offset of bound to the camera.
        */
        function (camera, cameraOffsetX, cameraOffsetY) {
            var _dx = cameraOffsetX + (this.x - camera.worldView.x);
            var _dy = cameraOffsetY + (this.y - camera.worldView.y);
            this._parent.context.fillStyle = this._parent.renderDebugColor;
            if(this.type == CollisionMask.QUAD) {
                this._parent.context.fillRect(_dx, _dy, this.width, this.height);
            } else if(this.type == CollisionMask.CIRCLE) {
                this._parent.context.beginPath();
                this._parent.context.arc(_dx, _dy, this.circle.radius, 0, Math.PI * 2);
                this._parent.context.fill();
                this._parent.context.closePath();
            }
        };
        CollisionMask.prototype.destroy = /**
        * Destroy all objects and references belonging to this CollisionMask
        */
        function () {
            this._game = null;
            this._parent = null;
            this._ref = null;
            this.quad = null;
            this.point = null;
            this.circle = null;
            this.rect = null;
            this.line = null;
            this.offset = null;
        };
        CollisionMask.prototype.intersectsRaw = function (left, right, top, bottom) {
            //if ((objBounds.x + objBounds.width > x) && (objBounds.x < x + width) && (objBounds.y + objBounds.height > y) && (objBounds.y < y + height))
            return true;
        };
        CollisionMask.prototype.intersectsVector = function (vector) {
            if(this.type == CollisionMask.QUAD) {
                return this.quad.contains(vector.x, vector.y);
            }
        };
        CollisionMask.prototype.intersects = /**
        * Gives a basic boolean response to a geometric collision.
        * If you need the details of the collision use the Collision functions instead and inspect the IntersectResult object.
        * @param source {GeomSprite} Sprite you want to check.
        * @return {boolean} Whether they overlaps or not.
        */
        function (source) {
            //  Quad vs. Quad
            if(this.type == CollisionMask.QUAD && source.type == CollisionMask.QUAD) {
                return this.quad.intersects(source.quad);
            }
            //  Circle vs. Circle
            if(this.type == CollisionMask.CIRCLE && source.type == CollisionMask.CIRCLE) {
                return Phaser.Collision.circleToCircle(this.circle, source.circle).result;
            }
            //  Circle vs. Rect
            if(this.type == CollisionMask.CIRCLE && source.type == CollisionMask.RECTANGLE) {
                return Phaser.Collision.circleToRectangle(this.circle, source.rect).result;
            }
            //  Circle vs. Point
            if(this.type == CollisionMask.CIRCLE && source.type == CollisionMask.POINT) {
                return Phaser.Collision.circleContainsPoint(this.circle, source.point).result;
            }
            //  Circle vs. Line
            if(this.type == CollisionMask.CIRCLE && source.type == CollisionMask.LINE) {
                return Phaser.Collision.lineToCircle(source.line, this.circle).result;
            }
            //  Rect vs. Rect
            if(this.type == CollisionMask.RECTANGLE && source.type == CollisionMask.RECTANGLE) {
                return Phaser.Collision.rectangleToRectangle(this.rect, source.rect).result;
            }
            //  Rect vs. Circle
            if(this.type == CollisionMask.RECTANGLE && source.type == CollisionMask.CIRCLE) {
                return Phaser.Collision.circleToRectangle(source.circle, this.rect).result;
            }
            //  Rect vs. Point
            if(this.type == CollisionMask.RECTANGLE && source.type == CollisionMask.POINT) {
                return Phaser.Collision.pointToRectangle(source.point, this.rect).result;
            }
            //  Rect vs. Line
            if(this.type == CollisionMask.RECTANGLE && source.type == CollisionMask.LINE) {
                return Phaser.Collision.lineToRectangle(source.line, this.rect).result;
            }
            //  Point vs. Point
            if(this.type == CollisionMask.POINT && source.type == CollisionMask.POINT) {
                return this.point.equals(source.point);
            }
            //  Point vs. Circle
            if(this.type == CollisionMask.POINT && source.type == CollisionMask.CIRCLE) {
                return Phaser.Collision.circleContainsPoint(source.circle, this.point).result;
            }
            //  Point vs. Rect
            if(this.type == CollisionMask.POINT && source.type == CollisionMask.RECTANGLE) {
                return Phaser.Collision.pointToRectangle(this.point, source.rect).result;
            }
            //  Point vs. Line
            if(this.type == CollisionMask.POINT && source.type == CollisionMask.LINE) {
                return source.line.isPointOnLine(this.point.x, this.point.y);
            }
            //  Line vs. Line
            if(this.type == CollisionMask.LINE && source.type == CollisionMask.LINE) {
                return Phaser.Collision.lineSegmentToLineSegment(this.line, source.line).result;
            }
            //  Line vs. Circle
            if(this.type == CollisionMask.LINE && source.type == CollisionMask.CIRCLE) {
                return Phaser.Collision.lineToCircle(this.line, source.circle).result;
            }
            //  Line vs. Rect
            if(this.type == CollisionMask.LINE && source.type == CollisionMask.RECTANGLE) {
                return Phaser.Collision.lineSegmentToRectangle(this.line, source.rect).result;
            }
            //  Line vs. Point
            if(this.type == CollisionMask.LINE && source.type == CollisionMask.POINT) {
                return this.line.isPointOnLine(source.point.x, source.point.y);
            }
            return false;
        };
        CollisionMask.prototype.checkHullIntersection = function (mask) {
            if((this.hullX + this.hullWidth > mask.hullX) && (this.hullX < mask.hullX + mask.width) && (this.hullY + this.hullHeight > mask.hullY) && (this.hullY < mask.hullY + mask.hullHeight)) {
                return true;
            } else {
                return false;
            }
        };
        Object.defineProperty(CollisionMask.prototype, "hullWidth", {
            get: function () {
                if(this.deltaX > 0) {
                    return this.width + this.deltaX;
                } else {
                    return this.width - this.deltaX;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CollisionMask.prototype, "hullHeight", {
            get: function () {
                if(this.deltaY > 0) {
                    return this.height + this.deltaY;
                } else {
                    return this.height - this.deltaY;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CollisionMask.prototype, "hullX", {
            get: function () {
                if(this.x < this.last.x) {
                    return this.x;
                } else {
                    return this.last.x;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CollisionMask.prototype, "hullY", {
            get: function () {
                if(this.y < this.last.y) {
                    return this.y;
                } else {
                    return this.last.y;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CollisionMask.prototype, "deltaXAbs", {
            get: function () {
                return (this.deltaX > 0 ? this.deltaX : -this.deltaX);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CollisionMask.prototype, "deltaYAbs", {
            get: function () {
                return (this.deltaY > 0 ? this.deltaY : -this.deltaY);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CollisionMask.prototype, "deltaX", {
            get: function () {
                return this.x - this.last.x;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CollisionMask.prototype, "deltaY", {
            get: function () {
                return this.y - this.last.y;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CollisionMask.prototype, "x", {
            get: function () {
                return this._ref.x;
                //return this.quad.x;
                            },
            set: function (value) {
                this._ref.x = value;
                //this.quad.x = value;
                            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CollisionMask.prototype, "y", {
            get: function () {
                return this._ref.y;
                //return this.quad.y;
                            },
            set: function (value) {
                this._ref.y = value;
                //this.quad.y = value;
                            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CollisionMask.prototype, "width", {
            get: function () {
                //return this.quad.width;
                return this._ref.width;
            },
            set: //public get rotation(): number {
            //    return this._angle;
            //}
            //public set rotation(value: number) {
            //    this._angle = this._game.math.wrap(value, 360, 0);
            //}
            //public get angle(): number {
            //    return this._angle;
            //}
            //public set angle(value: number) {
            //    this._angle = this._game.math.wrap(value, 360, 0);
            //}
            function (value) {
                //this.quad.width = value;
                this._ref.width = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CollisionMask.prototype, "height", {
            get: function () {
                //return this.quad.height;
                return this._ref.height;
            },
            set: function (value) {
                //this.quad.height = value;
                this._ref.height = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CollisionMask.prototype, "left", {
            get: function () {
                return this.x;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CollisionMask.prototype, "right", {
            get: function () {
                return this.x + this.width;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CollisionMask.prototype, "top", {
            get: function () {
                return this.y;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CollisionMask.prototype, "bottom", {
            get: function () {
                return this.y + this.height;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CollisionMask.prototype, "halfWidth", {
            get: function () {
                return this.width / 2;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CollisionMask.prototype, "halfHeight", {
            get: function () {
                return this.height / 2;
            },
            enumerable: true,
            configurable: true
        });
        return CollisionMask;
    })();
    Phaser.CollisionMask = CollisionMask;    
})(Phaser || (Phaser = {}));
var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="../Game.ts" />
/// <reference path="../Basic.ts" />
/// <reference path="../Signal.ts" />
/// <reference path="../system/CollisionMask.ts" />
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
        /**
        * GameObject constructor
        *
        * Create a new <code>GameObject</code> object at specific position with specific width and height.
        *
        * @param [x] {number} The x position of the object.
        * @param [y] {number} The y position of the object.
        * @param [width] {number} The width of the object.
        * @param [height] {number} The height of the object.
        */
        function GameObject(game, x, y, width, height) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            if (typeof width === "undefined") { width = 16; }
            if (typeof height === "undefined") { height = 16; }
                _super.call(this, game);
            /**
            * Angle of this object.
            * @type {number}
            */
            this._angle = 0;
            /**
            * What action will be performed when object is out of the worldBounds.
            * This will default to GameObject.OUT_OF_BOUNDS_STOP.
            * @type {number}
            */
            this.outOfBoundsAction = 0;
            /**
            * Z-order value of the object.
            */
            this.z = 0;
            /**
            * This value is added to the angle of the GameObject.
            * For example if you had a sprite drawn facing straight up then you could set
            * rotationOffset to 90 and it would correspond correctly with Phasers rotation system
            * @type {number}
            */
            this.rotationOffset = 0;
            /**
            * Controls if the GameObject is rendered rotated or not.
            * If renderRotation is false then the object can still rotate but it will never be rendered rotated.
            * @type {boolean}
            */
            this.renderRotation = true;
            /**
            * Set this to false if you want to skip the automatic motion/movement stuff
            * (see updateMotion()).
            * @type {boolean}
            */
            this.moves = true;
            //  Input
            this.inputEnabled = false;
            this._inputOver = false;
            this.canvas = game.stage.canvas;
            this.context = game.stage.context;
            this.frameBounds = new Phaser.Rectangle(x, y, width, height);
            this.exists = true;
            this.active = true;
            this.visible = true;
            this.alive = true;
            this.isGroup = false;
            this.alpha = 1;
            this.scale = new Phaser.MicroPoint(1, 1);
            this.last = new Phaser.MicroPoint(x, y);
            this.align = GameObject.ALIGN_TOP_LEFT;
            this.mass = 1;
            this.elasticity = 0;
            this.health = 1;
            this.immovable = false;
            this.moves = true;
            this.worldBounds = null;
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
            this.cameraBlacklist = [];
            this.scrollFactor = new Phaser.MicroPoint(1, 1);
            this.collisionMask = new Phaser.CollisionMask(game, this, x, y, width, height);
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
        GameObject.OUT_OF_BOUNDS_STOP = 0;
        GameObject.OUT_OF_BOUNDS_KILL = 1;
        GameObject.prototype.preUpdate = /**
        * Pre-update is called right before update() on each object in the game loop.
        */
        function () {
            this.last.x = this.frameBounds.x;
            this.last.y = this.frameBounds.y;
            this.collisionMask.preUpdate();
        };
        GameObject.prototype.update = /**
        * Override this function to update your class's position and appearance.
        */
        function () {
        };
        GameObject.prototype.postUpdate = /**
        * Automatically called after update() by the game loop.
        */
        function () {
            if(this.moves) {
                this.updateMotion();
            }
            if(this.worldBounds != null) {
                if(this.outOfBoundsAction == GameObject.OUT_OF_BOUNDS_KILL) {
                    if(this.x < this.worldBounds.x || this.x > this.worldBounds.right || this.y < this.worldBounds.y || this.y > this.worldBounds.bottom) {
                        this.kill();
                    }
                } else {
                    if(this.x < this.worldBounds.x) {
                        this.x = this.worldBounds.x;
                    } else if(this.x > this.worldBounds.right) {
                        this.x = this.worldBounds.right;
                    }
                    if(this.y < this.worldBounds.y) {
                        this.y = this.worldBounds.y;
                    } else if(this.y > this.worldBounds.bottom) {
                        this.y = this.worldBounds.bottom;
                    }
                }
            }
            this.collisionMask.update();
            if(this.inputEnabled) {
                this.updateInput();
            }
            this.wasTouching = this.touching;
            this.touching = Phaser.Collision.NONE;
        };
        GameObject.prototype.updateInput = /**
        * Update input.
        */
        function () {
        };
        GameObject.prototype.updateMotion = /**
        * Internal function for updating the position and speed of this object.
        */
        function () {
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
            this.frameBounds.x += delta;
            velocityDelta = (this._game.motion.computeVelocity(this.velocity.y, this.acceleration.y, this.drag.y, this.maxVelocity.y) - this.velocity.y) / 2;
            this.velocity.y += velocityDelta;
            delta = this.velocity.y * this._game.time.elapsed;
            this.velocity.y += velocityDelta;
            this.frameBounds.y += delta;
        };
        GameObject.prototype.overlaps = /**
        * Checks to see if some <code>GameObject</code> overlaps this <code>GameObject</code> or <code>Group</code>.
        * If the group has a LOT of things in it, it might be faster to use <code>Collision.overlaps()</code>.
        * WARNING: Currently tilemaps do NOT support screen space overlap checks!
        *
        * @param objectOrGroup {object} The object or group being tested.
        * @param inScreenSpace {boolean} Whether to take scroll factors numbero account when checking for overlap.  Default is false, or "only compare in world space."
        * @param camera {Camera} Specify which game camera you want.  If null getScreenXY() will just grab the first global camera.
        *
        * @return {boolean} Whether or not the objects overlap this.
        */
        function (objectOrGroup, inScreenSpace, camera) {
            if (typeof inScreenSpace === "undefined") { inScreenSpace = false; }
            if (typeof camera === "undefined") { camera = null; }
            if(objectOrGroup.isGroup) {
                var results = false;
                var i = 0;
                var members = objectOrGroup.members;
                while(i < length) {
                    if(this.overlaps(members[i++], inScreenSpace, camera)) {
                        results = true;
                    }
                }
                return results;
            }
            if(!inScreenSpace) {
                return (objectOrGroup.x + objectOrGroup.width > this.x) && (objectOrGroup.x < this.x + this.width) && (objectOrGroup.y + objectOrGroup.height > this.y) && (objectOrGroup.y < this.y + this.height);
            }
            if(camera == null) {
                camera = this._game.camera;
            }
            var objectScreenPos = objectOrGroup.getScreenXY(null, camera);
            this.getScreenXY(this._point, camera);
            return (objectScreenPos.x + objectOrGroup.width > this._point.x) && (objectScreenPos.x < this._point.x + this.width) && (objectScreenPos.y + objectOrGroup.height > this._point.y) && (objectScreenPos.y < this._point.y + this.height);
        };
        GameObject.prototype.overlapsAt = /**
        * Checks to see if this <code>GameObject</code> were located at the given position, would it overlap the <code>GameObject</code> or <code>Group</code>?
        * This is distinct from overlapsPoint(), which just checks that point, rather than taking the object's size numbero account.
        * WARNING: Currently tilemaps do NOT support screen space overlap checks!
        *
        * @param X {number} The X position you want to check.  Pretends this object (the caller, not the parameter) is located here.
        * @param Y {number} The Y position you want to check.  Pretends this object (the caller, not the parameter) is located here.
        * @param objectOrGroup {object} The object or group being tested.
        * @param inScreenSpace {boolean} Whether to take scroll factors numbero account when checking for overlap.  Default is false, or "only compare in world space."
        * @param camera {Camera} Specify which game camera you want.  If null getScreenXY() will just grab the first global camera.
        *
        * @return {boolean} Whether or not the two objects overlap.
        */
        function (X, Y, objectOrGroup, inScreenSpace, camera) {
            if (typeof inScreenSpace === "undefined") { inScreenSpace = false; }
            if (typeof camera === "undefined") { camera = null; }
            if(objectOrGroup.isGroup) {
                var results = false;
                var basic;
                var i = 0;
                var members = objectOrGroup.members;
                while(i < length) {
                    if(this.overlapsAt(X, Y, members[i++], inScreenSpace, camera)) {
                        results = true;
                    }
                }
                return results;
            }
            if(!inScreenSpace) {
                return (objectOrGroup.x + objectOrGroup.width > X) && (objectOrGroup.x < X + this.width) && (objectOrGroup.y + objectOrGroup.height > Y) && (objectOrGroup.y < Y + this.height);
            }
            if(camera == null) {
                camera = this._game.camera;
            }
            var objectScreenPos = objectOrGroup.getScreenXY(null, Phaser.Camera);
            this._point.x = X - camera.scroll.x * this.scrollFactor.x//copied from getScreenXY()
            ;
            this._point.y = Y - camera.scroll.y * this.scrollFactor.y;
            this._point.x += (this._point.x > 0) ? 0.0000001 : -0.0000001;
            this._point.y += (this._point.y > 0) ? 0.0000001 : -0.0000001;
            return (objectScreenPos.x + objectOrGroup.width > this._point.x) && (objectScreenPos.x < this._point.x + this.width) && (objectScreenPos.y + objectOrGroup.height > this._point.y) && (objectScreenPos.y < this._point.y + this.height);
        };
        GameObject.prototype.overlapsPoint = /**
        * Checks to see if a point in 2D world space overlaps this <code>GameObject</code>.
        *
        * @param point {Point} The point in world space you want to check.
        * @param inScreenSpace {boolean} Whether to take scroll factors into account when checking for overlap.
        * @param camera {Camera} Specify which game camera you want.  If null getScreenXY() will just grab the first global camera.
        *
        * @return   Whether or not the point overlaps this object.
        */
        function (point, inScreenSpace, camera) {
            if (typeof inScreenSpace === "undefined") { inScreenSpace = false; }
            if (typeof camera === "undefined") { camera = null; }
            if(!inScreenSpace) {
                return (point.x > this.x) && (point.x < this.x + this.width) && (point.y > this.y) && (point.y < this.y + this.height);
            }
            if(camera == null) {
                camera = this._game.camera;
            }
            var X = point.x - camera.scroll.x;
            var Y = point.y - camera.scroll.y;
            this.getScreenXY(this._point, camera);
            return (X > this._point.x) && (X < this._point.x + this.width) && (Y > this._point.y) && (Y < this._point.y + this.height);
        };
        GameObject.prototype.onScreen = /**
        * Check and see if this object is currently on screen.
        *
        * @param camera {Camera} Specify which game camera you want. If null getScreenXY() will just grab the first global camera.
        *
        * @return {boolean} Whether the object is on screen or not.
        */
        function (camera) {
            if (typeof camera === "undefined") { camera = null; }
            if(camera == null) {
                camera = this._game.camera;
            }
            this.getScreenXY(this._point, camera);
            return (this._point.x + this.width > 0) && (this._point.x < camera.width) && (this._point.y + this.height > 0) && (this._point.y < camera.height);
        };
        GameObject.prototype.getScreenXY = /**
        * Call this to figure out the on-screen position of the object.
        *
        * @param point {Point} Takes a <code>MicroPoint</code> object and assigns the post-scrolled X and Y values of this object to it.
        * @param camera {Camera} Specify which game camera you want.  If null getScreenXY() will just grab the first global camera.
        *
        * @return {MicroPoint} The <code>MicroPoint</code> you passed in, or a new <code>Point</code> if you didn't pass one, containing the screen X and Y position of this object.
        */
        function (point, camera) {
            if (typeof point === "undefined") { point = null; }
            if (typeof camera === "undefined") { camera = null; }
            if(point == null) {
                point = new Phaser.MicroPoint();
            }
            if(camera == null) {
                camera = this._game.camera;
            }
            point.x = this.x - camera.scroll.x * this.scrollFactor.x;
            point.y = this.y - camera.scroll.y * this.scrollFactor.y;
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
            set: function (value) {
                if(value) {
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
        * @param point {Point} Allows you to pass in an existing <code>Point</code> object if you're so inclined.  Otherwise a new one is created.
        *
        * @return {MicroPoint} A <code>Point</code> object containing the midpoint of this object in world coordinates.
        */
        function (point) {
            if (typeof point === "undefined") { point = null; }
            if(point == null) {
                point = new Phaser.MicroPoint();
            }
            point.copyFrom(this.frameBounds.center);
            return point;
        };
        GameObject.prototype.reset = /**
        * Handy for reviving game objects.
        * Resets their existence flags and position.
        *
        * @param x {number} The new X position of this object.
        * @param y {number} The new Y position of this object.
        */
        function (x, y) {
            this.revive();
            this.touching = Phaser.Collision.NONE;
            this.wasTouching = Phaser.Collision.NONE;
            this.x = x;
            this.y = y;
            this.last.x = x;
            this.last.y = y;
            this.velocity.x = 0;
            this.velocity.y = 0;
        };
        GameObject.prototype.isTouching = /**
        * Handy for checking if this object is touching a particular surface.
        * For slightly better performance you can just &amp; the value directly into <code>touching</code>.
        * However, this method is good for readability and accessibility.
        *
        * @param Direction {number} Any of the collision flags (e.g. LEFT, FLOOR, etc).
        *
        * @return {boolean} Whether the object is touching an object in (any of) the specified direction(s) this frame.
        */
        function (direction) {
            return (this.touching & direction) > Phaser.Collision.NONE;
        };
        GameObject.prototype.justTouched = /**
        * Handy function for checking if this object just landed on a particular surface.
        *
        * @param Direction {number} Any of the collision flags (e.g. LEFT, FLOOR, etc).
        *
        * @returns {boolean} Whether the object just landed on any specicied surfaces.
        */
        function (direction) {
            return ((this.touching & direction) > Phaser.Collision.NONE) && ((this.wasTouching & direction) <= Phaser.Collision.NONE);
        };
        GameObject.prototype.hurt = /**
        * Reduces the "health" variable of this sprite by the amount specified in Damage.
        * Calls kill() if health drops to or below zero.
        *
        * @param Damage {number} How much health to take away (use a negative number to give a health bonus).
        */
        function (damage) {
            this.health = this.health - damage;
            if(this.health <= 0) {
                this.kill();
            }
        };
        GameObject.prototype.setBounds = /**
        * Set the world bounds that this GameObject can exist within. By default a GameObject can exist anywhere
        * in the world. But by setting the bounds (which are given in world dimensions, not screen dimensions)
        * it can be stopped from leaving the world, or a section of it.
        *
        * @param x {number} x position of the bound
        * @param y {number} y position of the bound
        * @param width {number} width of its bound
        * @param height {number} height of its bound
        */
        function (x, y, width, height) {
            this.worldBounds = new Phaser.Quad(x, y, width, height);
        };
        GameObject.prototype.setBoundsFromWorld = /**
        * Set the world bounds that this GameObject can exist within based on the size of the current game world.
        *
        * @param action {number} The action to take if the object hits the world bounds, either OUT_OF_BOUNDS_KILL or OUT_OF_BOUNDS_STOP
        */
        function (action) {
            if (typeof action === "undefined") { action = GameObject.OUT_OF_BOUNDS_STOP; }
            this.setBounds(this._game.world.bounds.x, this._game.world.bounds.y, this._game.world.bounds.width, this._game.world.bounds.height);
            this.outOfBoundsAction = action;
        };
        GameObject.prototype.hideFromCamera = /**
        * If you do not wish this object to be visible to a specific camera, pass the camera here.
        *
        * @param camera {Camera} The specific camera.
        */
        function (camera) {
            if(this.cameraBlacklist.indexOf(camera.ID) == -1) {
                this.cameraBlacklist.push(camera.ID);
            }
        };
        GameObject.prototype.showToCamera = /**
        * Make this object only visible to a specific camera.
        *
        * @param camera {Camera} The camera you wish it to be visible.
        */
        function (camera) {
            if(this.cameraBlacklist.indexOf(camera.ID) !== -1) {
                this.cameraBlacklist.slice(this.cameraBlacklist.indexOf(camera.ID), 1);
            }
        };
        GameObject.prototype.clearCameraList = /**
        * This clears the camera black list, making the GameObject visible to all cameras.
        */
        function () {
            this.cameraBlacklist.length = 0;
        };
        GameObject.prototype.destroy = /**
        * Clean up memory.
        */
        function () {
        };
        GameObject.prototype.setPosition = function (x, y) {
            this.x = x;
            this.y = y;
        };
        Object.defineProperty(GameObject.prototype, "x", {
            get: function () {
                return this.frameBounds.x;
            },
            set: function (value) {
                this.frameBounds.x = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameObject.prototype, "y", {
            get: function () {
                return this.frameBounds.y;
            },
            set: function (value) {
                this.frameBounds.y = value;
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
                return this.frameBounds.width;
            },
            set: function (value) {
                this.frameBounds.width = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameObject.prototype, "height", {
            get: function () {
                return this.frameBounds.height;
            },
            set: function (value) {
                this.frameBounds.height = value;
            },
            enumerable: true,
            configurable: true
        });
        return GameObject;
    })(Phaser.Basic);
    Phaser.GameObject = GameObject;    
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
        *Sprite constructor
        * Instantiates a new camera at the specified location, with the specified size and zoom level.
        *
        * @param game {Phaser.Game} Current game instance.
        * @param id {number} Unique identity.
        * @param x {number} X location of the camera's display in pixels. Uses native, 1:1 resolution, ignores zoom.
        * @param y {number} Y location of the camera's display in pixels. Uses native, 1:1 resolution, ignores zoom.
        * @param width {number} The width of the camera display in pixels.
        * @param height {number} The height of the camera display in pixels.
        */
        function Camera(game, id, x, y, width, height) {
            this._clip = false;
            this._rotation = 0;
            this._target = null;
            this._sx = 0;
            this._sy = 0;
            /**
            * Scale factor of the camera.
            * @type {MicroPoint}
            */
            this.scale = new Phaser.MicroPoint(1, 1);
            /**
            * Scrolling factor.
            * @type {MicroPoint}
            */
            this.scroll = new Phaser.MicroPoint(0, 0);
            /**
            * Camera bounds.
            * @type {Rectangle}
            */
            this.bounds = null;
            /**
            * Sprite moving inside this rectangle will not cause camera moving.
            * @type {Rectangle}
            */
            this.deadzone = null;
            //  Camera Border
            this.disableClipping = false;
            /**
            * Whether render border of this camera or not. (default is false)
            * @type {boolean}
            */
            this.showBorder = false;
            /**
            * Color of border of this camera. (in css color string)
            * @type {string}
            */
            this.borderColor = 'rgb(255,255,255)';
            /**
            * Whether the camera background is opaque or not. If set to true the Camera is filled with
            * the value of Camera.backgroundColor every frame.
            * @type {boolean}
            */
            this.opaque = false;
            /**
            * Clears the camera every frame using a canvas clearRect call (default to true).
            * Note that this erases anything below the camera as well, so do not use it in conjuction with a camera
            * that uses alpha or that needs to be able to manage opacity. Equally if Camera.opaque is set to true
            * then set Camera.clear to false to save rendering time.
            * By default the Stage will clear itself every frame, so be sure not to double-up clear calls.
            * @type {boolean}
            */
            this.clear = false;
            /**
            * Background color in css color string.
            * @type {string}
            */
            this._bgColor = 'rgb(0,0,0)';
            /**
            * Background texture repeat style. (default is 'repeat')
            * @type {string}
            */
            this._bgTextureRepeat = 'repeat';
            //  Camera Shadow
            /**
            * Render camera shadow or not. (default is false)
            * @type {boolean}
            */
            this.showShadow = false;
            /**
            * Color of shadow, in css color string.
            * @type {string}
            */
            this.shadowColor = 'rgb(0,0,0)';
            /**
            * Blur factor of shadow.
            * @type {number}
            */
            this.shadowBlur = 10;
            /**
            * Offset of the shadow from camera's position.
            * @type {MicroPoint}
            */
            this.shadowOffset = new Phaser.MicroPoint(4, 4);
            /**
            * Whether this camera visible or not. (default is true)
            * @type {boolean}
            */
            this.visible = true;
            /**
            * Alpha of the camera. (everything rendered to this camera will be affected)
            * @type {number}
            */
            this.alpha = 1;
            /**
            * The x position of the current input event in world coordinates.
            * @type {number}
            */
            this.inputX = 0;
            /**
            * The y position of the current input event in world coordinates.
            * @type {number}
            */
            this.inputY = 0;
            this._game = game;
            this.ID = id;
            this._stageX = x;
            this._stageY = y;
            this.fx = new Phaser.FXManager(this._game, this);
            //  The view into the world canvas we wish to render
            this.worldView = new Phaser.Rectangle(0, 0, width, height);
            this.checkClip();
        }
        Camera.STYLE_LOCKON = 0;
        Camera.STYLE_PLATFORMER = 1;
        Camera.STYLE_TOPDOWN = 2;
        Camera.STYLE_TOPDOWN_TIGHT = 3;
        Camera.prototype.follow = /**
        * Tells this camera object what sprite to track.
        * @param target {Sprite} The object you want the camera to track. Set to null to not follow anything.
        * @param [style] {number} Leverage one of the existing "deadzone" presets. If you use a custom deadzone, ignore this parameter and manually specify the deadzone after calling follow().
        */
        function (target, style) {
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
        Camera.prototype.focusOnXY = /**
        * Move the camera focus to this location instantly.
        * @param x {number} X position.
        * @param y {number} Y position.
        */
        function (x, y) {
            x += (x > 0) ? 0.0000001 : -0.0000001;
            y += (y > 0) ? 0.0000001 : -0.0000001;
            this.scroll.x = Math.round(x - this.worldView.halfWidth);
            this.scroll.y = Math.round(y - this.worldView.halfHeight);
        };
        Camera.prototype.focusOn = /**
        * Move the camera focus to this location instantly.
        * @param point {any} Point you want to focus.
        */
        function (point) {
            point.x += (point.x > 0) ? 0.0000001 : -0.0000001;
            point.y += (point.y > 0) ? 0.0000001 : -0.0000001;
            this.scroll.x = Math.round(point.x - this.worldView.halfWidth);
            this.scroll.y = Math.round(point.y - this.worldView.halfHeight);
        };
        Camera.prototype.setBounds = /**
        * Specify the boundaries of the world or where the camera is allowed to move.
        *
        * @param x      {number} The smallest X value of your world (usually 0).
        * @param y      {number} The smallest Y value of your world (usually 0).
        * @param width  {number} The largest X value of your world (usually the world width).
        * @param height {number} The largest Y value of your world (usually the world height).
        */
        function (x, y, width, height) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            if (typeof width === "undefined") { width = 0; }
            if (typeof height === "undefined") { height = 0; }
            if(this.bounds == null) {
                this.bounds = new Phaser.Rectangle();
            }
            this.bounds.setTo(x, y, width, height);
            this.scroll.setTo(0, 0);
            this.update();
        };
        Camera.prototype.update = /**
        * Update focusing and scrolling.
        */
        function () {
            this.fx.preUpdate();
            if(this._target !== null) {
                if(this.deadzone == null) {
                    this.focusOnXY(this._target.x, this._target.y);
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
            //  Make sure we didn't go outside the cameras bounds
            if(this.bounds !== null) {
                if(this.scroll.x < this.bounds.left) {
                    this.scroll.x = this.bounds.left;
                }
                if(this.scroll.x > this.bounds.right - this.width) {
                    this.scroll.x = (this.bounds.right - this.width) + 1;
                }
                if(this.scroll.y < this.bounds.top) {
                    this.scroll.y = this.bounds.top;
                }
                if(this.scroll.y > this.bounds.bottom - this.height) {
                    this.scroll.y = (this.bounds.bottom - this.height) + 1;
                }
            }
            this.worldView.x = this.scroll.x;
            this.worldView.y = this.scroll.y;
            //  Input values
            this.inputX = this.worldView.x + this._game.input.x;
            this.inputY = this.worldView.y + this._game.input.y;
            this.fx.postUpdate();
        };
        Camera.prototype.render = /**
        * Draw background, shadow, effects, and objects if this is visible.
        */
        function () {
            if(this.visible === false || this.alpha < 0.1) {
                return;
            }
            if(this._rotation !== 0 || this._clip || this.scale.x !== 1 || this.scale.y !== 1) {
                this._game.stage.context.save();
            }
            //  It may be safer/quicker to just save the context every frame regardless (needs testing on mobile - sucked on Android 2.x)
            //this._game.stage.context.save();
            this.fx.preRender(this, this._stageX, this._stageY, this.worldView.width, this.worldView.height);
            if(this.alpha !== 1) {
                this._game.stage.context.globalAlpha = this.alpha;
            }
            this._sx = this._stageX;
            this._sy = this._stageY;
            //  Shadow
            if(this.showShadow == true) {
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
            if(this.clear == true) {
                this._game.stage.context.clearRect(this._sx, this._sy, this.worldView.width, this.worldView.height);
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
            if(this.showShadow == true) {
                this._game.stage.context.shadowBlur = 0;
                this._game.stage.context.shadowOffsetX = 0;
                this._game.stage.context.shadowOffsetY = 0;
            }
            this.fx.render(this, this._stageX, this._stageY, this.worldView.width, this.worldView.height);
            //  Clip the camera so we don't get sprites appearing outside the edges
            if(this._clip == true && this.disableClipping == false) {
                this._game.stage.context.beginPath();
                this._game.stage.context.rect(this._sx, this._sy, this.worldView.width, this.worldView.height);
                this._game.stage.context.closePath();
                this._game.stage.context.clip();
            }
            this._game.world.group.render(this, this._sx, this._sy);
            if(this.showBorder == true) {
                this._game.stage.context.strokeStyle = this.borderColor;
                this._game.stage.context.lineWidth = 1;
                this._game.stage.context.rect(this._sx, this._sy, this.worldView.width, this.worldView.height);
                this._game.stage.context.stroke();
            }
            //  Scale off
            if(this.scale.x !== 1 || this.scale.y !== 1) {
                this._game.stage.context.scale(1, 1);
            }
            this.fx.postRender(this, this._sx, this._sy, this.worldView.width, this.worldView.height);
            if(this._rotation !== 0 || (this._clip && this.disableClipping == false)) {
                this._game.stage.context.translate(0, 0);
            }
            if(this._rotation !== 0 || this._clip || this.scale.x !== 1 || this.scale.y !== 1) {
                this._game.stage.context.restore();
            }
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
        Camera.prototype.setTexture = /**
        * Set camera background texture.
        * @param key {string} Asset key of the texture.
        * @param [repeat] {string} what kind of repeat will this texture used for background.
        */
        function (key, repeat) {
            if (typeof repeat === "undefined") { repeat = 'repeat'; }
            this._bgTexture = this._game.stage.context.createPattern(this._game.cache.getImage(key), repeat);
            this._bgTextureRepeat = repeat;
        };
        Camera.prototype.setPosition = /**
        * Set position of this camera.
        * @param x {number} X position.
        * @param y {number} Y position.
        */
        function (x, y) {
            this._stageX = x;
            this._stageY = y;
            this.checkClip();
        };
        Camera.prototype.setSize = /**
        * Give this camera a new size.
        * @param width {number} Width of new size.
        * @param height {number} Height of new size.
        */
        function (width, height) {
            this.worldView.width = width;
            this.worldView.height = height;
            this.checkClip();
        };
        Camera.prototype.renderDebugInfo = /**
        * Render debug infos. (including id, position, rotation, scrolling factor, bounds and some other properties)
        * @param x {number} X position of the debug info to be rendered.
        * @param y {number} Y position of the debug info to be rendered.
        * @param [color] {number} color of the debug info to be rendered. (format is css color string)
        */
        function (x, y, color) {
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
                if(value > this._game.stage.width) {
                    value = this._game.stage.width;
                }
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
                if(value > this._game.stage.height) {
                    value = this._game.stage.height;
                }
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
/// <reference path="../Game.ts" />
/// <reference path="../AnimationManager.ts" />
/// <reference path="GameObject.ts" />
/// <reference path="../system/Camera.ts" />
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
        /**
        * Sprite constructor
        * Create a new <code>Sprite</code>.
        *
        * @param game {Phaser.Game} Current game instance.
        * @param [x] {number} the initial x position of the sprite.
        * @param [y] {number} the initial y position of the sprite.
        * @param [key] {string} Key of the graphic you want to load for this sprite.
        */
        function Sprite(game, x, y, key) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            if (typeof key === "undefined") { key = null; }
                _super.call(this, game, x, y);
            /**
            * Texture of this sprite is DynamicTexture? (default to false)
            * @type {boolean}
            */
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
            /**
            * Render bound of this sprite for debugging? (default to false)
            * @type {boolean}
            */
            this.renderDebug = false;
            /**
            * Color of the Sprite when no image is present. Format is a css color string.
            * @type {string}
            */
            this.fillColor = 'rgb(255,255,255)';
            /**
            * Color of bound when render debug. (see renderDebug) Format is a css color string.
            * @type {string}
            */
            this.renderDebugColor = 'rgba(0,255,0,0.5)';
            /**
            * Color of points when render debug. (see renderDebug) Format is a css color string.
            * @type {string}
            */
            this.renderDebugPointColor = 'rgba(255,255,255,1)';
            /**
            * Flip the graphic horizontally? (defaults to false)
            * @type {boolean}
            */
            this.flipped = false;
            this._texture = null;
            this.animations = new Phaser.AnimationManager(this._game, this);
            if(key !== null) {
                this.cacheKey = key;
                this.loadGraphic(key);
            } else {
                this.frameBounds.width = 16;
                this.frameBounds.height = 16;
            }
        }
        Sprite.prototype.loadGraphic = /**
        * Load graphic for this sprite. (graphic can be SpriteSheet or Texture)
        * @param key {string} Key of the graphic you want to load for this sprite.
        * @param clearAnimations {boolean} If this Sprite has a set of animation data already loaded you can choose to keep or clear it with this boolean
        * @return {Sprite} Sprite instance itself.
        */
        function (key, clearAnimations) {
            if (typeof clearAnimations === "undefined") { clearAnimations = true; }
            if(clearAnimations && this.animations.frameData !== null) {
                this.animations.destroy();
            }
            if(this._game.cache.getImage(key) !== null) {
                if(this._game.cache.isSpriteSheet(key) == false) {
                    this._texture = this._game.cache.getImage(key);
                    this.frameBounds.width = this._texture.width;
                    this.frameBounds.height = this._texture.height;
                    this.collisionMask.width = this._texture.width;
                    this.collisionMask.height = this._texture.height;
                } else {
                    this._texture = this._game.cache.getImage(key);
                    this.animations.loadFrameData(this._game.cache.getFrameData(key));
                    this.collisionMask.width = this.animations.currentFrame.width;
                    this.collisionMask.height = this.animations.currentFrame.height;
                }
                this._dynamicTexture = false;
            }
            return this;
        };
        Sprite.prototype.loadDynamicTexture = /**
        * Load a DynamicTexture as its texture.
        * @param texture {DynamicTexture} The texture object to be used by this sprite.
        * @return {Sprite} Sprite instance itself.
        */
        function (texture) {
            this._texture = texture;
            this.frameBounds.width = this._texture.width;
            this.frameBounds.height = this._texture.height;
            this._dynamicTexture = true;
            return this;
        };
        Sprite.prototype.makeGraphic = /**
        * This function creates a flat colored square image dynamically.
        * @param width {number} The width of the sprite you want to generate.
        * @param height {number} The height of the sprite you want to generate.
        * @param [color] {number} specifies the color of the generated block. (format is 0xAARRGGBB)
        * @return {Sprite} Sprite instance itself.
        */
        function (width, height, color) {
            if (typeof color === "undefined") { color = 'rgb(255,255,255)'; }
            this._texture = null;
            this.width = width;
            this.height = height;
            this.fillColor = color;
            this._dynamicTexture = false;
            return this;
        };
        Sprite.prototype.inCamera = /**
        * Check whether this object is visible in a specific camera rectangle.
        * @param camera {Rectangle} The rectangle you want to check.
        * @return {boolean} Return true if bounds of this sprite intersects the given rectangle, otherwise return false.
        */
        function (camera, cameraOffsetX, cameraOffsetY) {
            //  Object fixed in place regardless of the camera scrolling? Then it's always visible
            if(this.scrollFactor.x == 0 && this.scrollFactor.y == 0) {
                return true;
            }
            this._dx = (this.frameBounds.x - camera.x);
            this._dy = (this.frameBounds.y - camera.y);
            this._dw = this.frameBounds.width * this.scale.x;
            this._dh = this.frameBounds.height * this.scale.y;
            return (camera.right > this._dx) && (camera.x < this._dx + this._dw) && (camera.bottom > this._dy) && (camera.y < this._dy + this._dh);
        };
        Sprite.prototype.postUpdate = /**
        * Automatically called after update() by the game loop, this function just updates animations.
        */
        function () {
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
        Sprite.prototype.render = /**
        * Render this sprite to specific camera. Called by game loop after update().
        * @param camera {Camera} Camera this sprite will be rendered to.
        * @cameraOffsetX {number} X offset to the camera.
        * @cameraOffsetY {number} Y offset to the camera.
        * @return {boolean} Return false if not rendered, otherwise return true.
        */
        function (camera, cameraOffsetX, cameraOffsetY) {
            //  Render checks
            if(this.visible == false || this.scale.x == 0 || this.scale.y == 0 || this.alpha < 0.1 || this.cameraBlacklist.indexOf(camera.ID) !== -1 || this.inCamera(camera.worldView, cameraOffsetX, cameraOffsetY) == false) {
                return false;
            }
            //  Alpha
            if(this.alpha !== 1) {
                var globalAlpha = this.context.globalAlpha;
                this.context.globalAlpha = this.alpha;
            }
            this._sx = 0;
            this._sy = 0;
            this._sw = this.frameBounds.width;
            this._sh = this.frameBounds.height;
            this._dx = (cameraOffsetX * this.scrollFactor.x) + this.frameBounds.topLeft.x - (camera.worldView.x * this.scrollFactor.x);
            this._dy = (cameraOffsetY * this.scrollFactor.y) + this.frameBounds.topLeft.y - (camera.worldView.y * this.scrollFactor.y);
            this._dw = this.frameBounds.width * this.scale.x;
            this._dh = this.frameBounds.height * this.scale.y;
            if(this.align == Phaser.GameObject.ALIGN_TOP_CENTER) {
                this._dx -= this.frameBounds.halfWidth * this.scale.x;
            } else if(this.align == Phaser.GameObject.ALIGN_TOP_RIGHT) {
                this._dx -= this.frameBounds.width * this.scale.x;
            } else if(this.align == Phaser.GameObject.ALIGN_CENTER_LEFT) {
                this._dy -= this.frameBounds.halfHeight * this.scale.y;
            } else if(this.align == Phaser.GameObject.ALIGN_CENTER) {
                this._dx -= this.frameBounds.halfWidth * this.scale.x;
                this._dy -= this.frameBounds.halfHeight * this.scale.y;
            } else if(this.align == Phaser.GameObject.ALIGN_CENTER_RIGHT) {
                this._dx -= this.frameBounds.width * this.scale.x;
                this._dy -= this.frameBounds.halfHeight * this.scale.y;
            } else if(this.align == Phaser.GameObject.ALIGN_BOTTOM_LEFT) {
                this._dy -= this.frameBounds.height * this.scale.y;
            } else if(this.align == Phaser.GameObject.ALIGN_BOTTOM_CENTER) {
                this._dx -= this.frameBounds.halfWidth * this.scale.x;
                this._dy -= this.frameBounds.height * this.scale.y;
            } else if(this.align == Phaser.GameObject.ALIGN_BOTTOM_RIGHT) {
                this._dx -= this.frameBounds.width * this.scale.x;
                this._dy -= this.frameBounds.height * this.scale.y;
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
            if(this.scrollFactor.x !== 1 || this.scrollFactor.y !== 1) {
                //this._dx -= (camera.worldView.x * this.scrollFactor.x);
                //this._dy -= (camera.worldView.y * this.scrollFactor.y);
                            }
            //	Rotation - needs to work from origin point really, but for now from center
            if(this.angle !== 0 || this.rotationOffset !== 0 || this.flipped == true) {
                this.context.save();
                this.context.translate(this._dx + (this._dw / 2), this._dy + (this._dh / 2));
                if(this.renderRotation == true && (this.angle !== 0 || this.rotationOffset !== 0)) {
                    this.context.rotate((this.rotationOffset + this.angle) * (Math.PI / 180));
                }
                this._dx = -(this._dw / 2);
                this._dy = -(this._dh / 2);
                if(this.flipped == true) {
                    this.context.scale(-1, 1);
                }
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
                    this.context.drawImage(this._texture.canvas, //	Source Image
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
                    this.context.drawImage(this._texture, //	Source Image
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
                this.context.fillStyle = this.fillColor;
                this.context.fillRect(this._dx, this._dy, this._dw, this._dh);
            }
            if(this.flipped === true || this.rotation !== 0 || this.rotationOffset !== 0) {
                //this.context.translate(0, 0);
                this.context.restore();
            }
            if(this.renderDebug) {
                this.renderBounds(camera, cameraOffsetX, cameraOffsetY);
                //this.collisionMask.render(camera, cameraOffsetX, cameraOffsetY);
                            }
            if(globalAlpha > -1) {
                this.context.globalAlpha = globalAlpha;
            }
            return true;
        };
        Sprite.prototype.renderBounds = /**
        * Renders the bounding box around this Sprite and the contact points. Useful for visually debugging.
        * @param camera {Camera} Camera the bound will be rendered to.
        * @param cameraOffsetX {number} X offset of bound to the camera.
        * @param cameraOffsetY {number} Y offset of bound to the camera.
        */
        function (camera, cameraOffsetX, cameraOffsetY) {
            this._dx = cameraOffsetX + (this.frameBounds.topLeft.x - camera.worldView.x);
            this._dy = cameraOffsetY + (this.frameBounds.topLeft.y - camera.worldView.y);
            this.context.fillStyle = this.renderDebugColor;
            this.context.fillRect(this._dx, this._dy, this.frameBounds.width, this.frameBounds.height);
            //this.context.fillStyle = this.renderDebugPointColor;
            //var hw = this.frameBounds.halfWidth * this.scale.x;
            //var hh = this.frameBounds.halfHeight * this.scale.y;
            //var sw = (this.frameBounds.width * this.scale.x) - 1;
            //var sh = (this.frameBounds.height * this.scale.y) - 1;
            //this.context.fillRect(this._dx, this._dy, 1, 1);            //  top left
            //this.context.fillRect(this._dx + hw, this._dy, 1, 1);       //  top center
            //this.context.fillRect(this._dx + sw, this._dy, 1, 1);       //  top right
            //this.context.fillRect(this._dx, this._dy + hh, 1, 1);       //  left center
            //this.context.fillRect(this._dx + hw, this._dy + hh, 1, 1);  //  center
            //this.context.fillRect(this._dx + sw, this._dy + hh, 1, 1);  //  right center
            //this.context.fillRect(this._dx, this._dy + sh, 1, 1);       //  bottom left
            //this.context.fillRect(this._dx + hw, this._dy + sh, 1, 1);  //  bottom center
            //this.context.fillRect(this._dx + sw, this._dy + sh, 1, 1);  //  bottom right
                    };
        Sprite.prototype.renderDebugInfo = /**
        * Render debug infos. (including name, bounds info, position and some other properties)
        * @param x {number} X position of the debug info to be rendered.
        * @param y {number} Y position of the debug info to be rendered.
        * @param [color] {number} color of the debug info to be rendered. (format is css color string)
        */
        function (x, y, color) {
            if (typeof color === "undefined") { color = 'rgb(255,255,255)'; }
            this.context.fillStyle = color;
            this.context.fillText('Sprite: ' + this.name + ' (' + this.frameBounds.width + ' x ' + this.frameBounds.height + ')', x, y);
            this.context.fillText('x: ' + this.frameBounds.x.toFixed(1) + ' y: ' + this.frameBounds.y.toFixed(1) + ' rotation: ' + this.angle.toFixed(1), x, y + 14);
            this.context.fillText('dx: ' + this._dx.toFixed(1) + ' dy: ' + this._dy.toFixed(1) + ' dw: ' + this._dw.toFixed(1) + ' dh: ' + this._dh.toFixed(1), x, y + 28);
            this.context.fillText('sx: ' + this._sx.toFixed(1) + ' sy: ' + this._sy.toFixed(1) + ' sw: ' + this._sw.toFixed(1) + ' sh: ' + this._sh.toFixed(1), x, y + 42);
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
        /**
        * Animation constructor
        * Create a new <code>Animation</code>.
        *
        * @param parent {Sprite} Owner sprite of this animation.
        * @param frameData {FrameData} The FrameData object contains animation data.
        * @param name {string} Unique name of this animation.
        * @param frames {number[]/string[]} An array of numbers or strings indicating what frames to play in what order.
        * @param delay {number} Time between frames in ms.
        * @param looped {boolean} Whether or not the animation is looped or just plays once.
        */
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
            this._frameIndex = 0;
            this.currentFrame = this._frameData.getFrame(this._frames[this._frameIndex]);
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
                if(this.currentFrame !== null) {
                    return this.currentFrame.index;
                } else {
                    return this._frameIndex;
                }
            },
            set: function (value) {
                this.currentFrame = this._frameData.getFrame(value);
                if(this.currentFrame !== null) {
                    this._parent.frameBounds.width = this.currentFrame.width;
                    this._parent.frameBounds.height = this.currentFrame.height;
                    this._frameIndex = value;
                }
            },
            enumerable: true,
            configurable: true
        });
        Animation.prototype.play = /**
        * Play this animation.
        * @param frameRate {number} FrameRate you want to specify instead of using default.
        * @param loop {boolean} Whether or not the animation is looped or just plays once.
        */
        function (frameRate, loop) {
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
        Animation.prototype.restart = /**
        * Play this animation from the first frame.
        */
        function () {
            this.isPlaying = true;
            this.isFinished = false;
            this._timeLastFrame = this._game.time.now;
            this._timeNextFrame = this._game.time.now + this.delay;
            this._frameIndex = 0;
            this.currentFrame = this._frameData.getFrame(this._frames[this._frameIndex]);
        };
        Animation.prototype.stop = /**
        * Stop playing animation and set it finished.
        */
        function () {
            this.isPlaying = false;
            this.isFinished = true;
        };
        Animation.prototype.update = /**
        * Update animation frames.
        */
        function () {
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
        Animation.prototype.destroy = /**
        * Clean up animation memory.
        */
        function () {
            this._game = null;
            this._parent = null;
            this._frames = null;
            this._frameData = null;
            this.currentFrame = null;
            this.isPlaying = false;
        };
        Animation.prototype.onComplete = /**
        * Animation complete callback method.
        */
        function () {
            this.isPlaying = false;
            this.isFinished = true;
            //  callback
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
        AnimationLoader.parseSpriteSheet = /**
        * Parse a sprite sheet from asset data.
        * @param key {string} Asset key for the sprite sheet data.
        * @param frameWidth {number} Width of animation frame.
        * @param frameHeight {number} Height of animation frame.
        * @param frameMax {number} Number of animation frames.
        * @return {FrameData} Generated FrameData object.
        */
        function parseSpriteSheet(game, key, frameWidth, frameHeight, frameMax) {
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
        AnimationLoader.parseJSONData = /**
        * Parse frame datas from json.
        * @param json {object} Json data you want to parse.
        * @return {FrameData} Generated FrameData object.
        */
        function parseJSONData(game, json) {
            //  Malformed?
            if(!json['frames']) {
                throw new Error("Phaser.AnimationLoader.parseJSONData: Invalid Texture Atlas JSON given, missing 'frames' array");
            }
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
        AnimationLoader.parseXMLData = function parseXMLData(game, xml, format) {
            //  Malformed?
            if(!xml.getElementsByTagName('TextureAtlas')) {
                throw new Error("Phaser.AnimationLoader.parseXMLData: Invalid Texture Atlas XML given, missing <TextureAtlas> tag");
            }
            //  Let's create some frames then
            var data = new Phaser.FrameData();
            var frames = xml.getElementsByTagName('SubTexture');
            var newFrame;
            for(var i = 0; i < frames.length; i++) {
                var frame = frames[i].attributes;
                newFrame = data.addFrame(new Phaser.Frame(frame.x.nodeValue, frame.y.nodeValue, frame.width.nodeValue, frame.height.nodeValue, frame.name.nodeValue));
                //  Trimmed?
                if(frame.frameX.nodeValue != '-0' || frame.frameY.nodeValue != '-0') {
                    newFrame.setTrim(true, frame.width.nodeValue, frame.height.nodeValue, Math.abs(frame.frameX.nodeValue), Math.abs(frame.frameY.nodeValue), frame.frameWidth.nodeValue, frame.frameHeight.nodeValue);
                }
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
        /**
        * Frame constructor
        * Create a new <code>Frame</code> with specific position, size and name.
        *
        * @param x {number} X position within the image to cut from.
        * @param y {number} Y position within the image to cut from.
        * @param width {number} Width of the frame.
        * @param height {number} Height of the frame.
        * @param name {string} Name of this frame.
        */
        function Frame(x, y, width, height, name) {
            /**
            * Useful for Texture Atlas files. (is set to the filename value)
            */
            this.name = '';
            /**
            * Rotated? (not yet implemented)
            */
            this.rotated = false;
            /**
            * Either cw or ccw, rotation is always 90 degrees.
            */
            this.rotationDirection = 'cw';
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.name = name;
            this.rotated = false;
            this.trimmed = false;
        }
        Frame.prototype.setRotation = /**
        * Set rotation of this frame. (Not yet supported!)
        */
        function (rotated, rotationDirection) {
            //  Not yet supported
                    };
        Frame.prototype.setTrim = /**
        * Set trim of the frame.
        * @param trimmed {boolean} Whether this frame trimmed or not.
        * @param actualWidth {number} Actual width of this frame.
        * @param actualHeight {number} Actual height of this frame.
        * @param destX {number} Destiny x position.
        * @param destY {number} Destiny y position.
        * @param destWidth {number} Destiny draw width.
        * @param destHeight {number} Destiny draw height.
        */
        function (trimmed, actualWidth, actualHeight, destX, destY, destWidth, destHeight) {
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
        /**
        * FrameData constructor
        */
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
        FrameData.prototype.addFrame = /**
        * Add a new frame.
        * @param frame {Frame} The frame you want to add.
        * @return {Frame} The frame you just added.
        */
        function (frame) {
            frame.index = this._frames.length;
            this._frames.push(frame);
            if(frame.name !== '') {
                this._frameNames[frame.name] = frame.index;
            }
            return frame;
        };
        FrameData.prototype.getFrame = /**
        * Get a frame by its index.
        * @param index {number} Index of the frame you want to get.
        * @return {Frame} The frame you want.
        */
        function (index) {
            if(this._frames[index]) {
                return this._frames[index];
            }
            return null;
        };
        FrameData.prototype.getFrameByName = /**
        * Get a frame by its name.
        * @param name {string} Name of the frame you want to get.
        * @return {Frame} The frame you want.
        */
        function (name) {
            if(this._frameNames[name] >= 0) {
                return this._frames[this._frameNames[name]];
            }
            return null;
        };
        FrameData.prototype.checkFrameName = /**
        * Check whether there's a frame with given name.
        * @param name {string} Name of the frame you want to check.
        * @return {boolean} True if frame with given name found, otherwise return false.
        */
        function (name) {
            if(this._frameNames[name] >= 0) {
                return true;
            }
            return false;
        };
        FrameData.prototype.getFrameRange = /**
        * Get ranges of frames in an array.
        * @param start {number} Start index of frames you want.
        * @param end {number} End index of frames you want.
        * @param [output] {Frame[]} result will be added into this array.
        * @return {Frame[]} Ranges of specific frames in an array.
        */
        function (start, end, output) {
            if (typeof output === "undefined") { output = []; }
            for(var i = start; i <= end; i++) {
                output.push(this._frames[i]);
            }
            return output;
        };
        FrameData.prototype.getFrameIndexes = /**
        * Get all indexes of frames by giving their name.
        * @param [output] {number[]} result will be added into this array.
        * @return {number[]} Indexes of specific frames in an array.
        */
        function (output) {
            if (typeof output === "undefined") { output = []; }
            output.length = 0;
            for(var i = 0; i < this._frames.length; i++) {
                output.push(i);
            }
            return output;
        };
        FrameData.prototype.getFrameIndexesByName = /**
        * Get all names of frames by giving their indexes.
        * @param [output] {number[]} result will be added into this array.
        * @return {number[]} Names of specific frames in an array.
        */
        function (input) {
            var output = [];
            for(var i = 0; i < input.length; i++) {
                if(this.getFrameByName(input[i])) {
                    output.push(this.getFrameByName(input[i]).index);
                }
            }
            return output;
        };
        FrameData.prototype.getAllFrames = /**
        * Get all frames in this frame data.
        * @return {Frame[]} All the frames in an array.
        */
        function () {
            return this._frames;
        };
        FrameData.prototype.getFrames = /**
        * Get All frames with specific ranges.
        * @param range {number[]} Ranges in an array.
        * @return {Frame[]} All frames in an array.
        */
        function (range) {
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
        /**
        * AnimationManager constructor
        * Create a new <code>AnimationManager</code>.
        *
        * @param parent {Sprite} Owner sprite of this manager.
        */
        function AnimationManager(game, parent) {
            /**
            * Data contains animation frames.
            * @type {FrameData}
            */
            this._frameData = null;
            /**
            * Keeps track of the current frame of animation.
            */
            this.currentFrame = null;
            this._game = game;
            this._parent = parent;
            this._anims = {
            };
        }
        AnimationManager.prototype.loadFrameData = /**
        * Load animation frame data.
        * @param frameData Data to be loaded.
        */
        function (frameData) {
            this._frameData = frameData;
            this.frame = 0;
        };
        AnimationManager.prototype.add = /**
        * Add a new animation.
        * @param name {string} What this animation should be called (e.g. "run").
        * @param frames {any[]} An array of numbers/strings indicating what frames to play in what order (e.g. [1, 2, 3] or ['run0', 'run1', run2]).
        * @param frameRate {number} The speed in frames per second that the animation should play at (e.g. 60 fps).
        * @param loop {boolean} Whether or not the animation is looped or just plays once.
        * @param useNumericIndex {boolean} Use number indexes instead of string indexes?
        * @return {Animation} The Animation that was created
        */
        function (name, frames, frameRate, loop, useNumericIndex) {
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
                    throw Error('Invalid frames given to Animation ' + name);
                    return;
                }
            }
            if(useNumericIndex == false) {
                frames = this._frameData.getFrameIndexesByName(frames);
            }
            this._anims[name] = new Phaser.Animation(this._game, this._parent, this._frameData, name, frames, frameRate, loop);
            this.currentAnim = this._anims[name];
            this.currentFrame = this.currentAnim.currentFrame;
            return this._anims[name];
        };
        AnimationManager.prototype.validateFrames = /**
        * Check whether the frames is valid.
        * @param frames {any[]} Frames to be validated.
        * @param useNumericIndex {boolean} Does these frames use number indexes or string indexes?
        * @return {boolean} True if they're valid, otherwise return false.
        */
        function (frames, useNumericIndex) {
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
        AnimationManager.prototype.play = /**
        * Play animation with specific name.
        * @param name {string} The string name of the animation you want to play.
        * @param frameRate {number} FrameRate you want to specify instead of using default.
        * @param loop {boolean} Whether or not the animation is looped or just plays once.
        */
        function (name, frameRate, loop) {
            if (typeof frameRate === "undefined") { frameRate = null; }
            if(this._anims[name]) {
                if(this.currentAnim == this._anims[name]) {
                    if(this.currentAnim.isPlaying == false) {
                        this.currentAnim.play(frameRate, loop);
                    }
                } else {
                    this.currentAnim = this._anims[name];
                    this.currentAnim.play(frameRate, loop);
                }
            }
        };
        AnimationManager.prototype.stop = /**
        * Stop animation by name.
        * Current animation will be automatically set to the stopped one.
        */
        function (name) {
            if(this._anims[name]) {
                this.currentAnim = this._anims[name];
                this.currentAnim.stop();
            }
        };
        AnimationManager.prototype.update = /**
        * Update animation and parent sprite's bounds.
        */
        function () {
            if(this.currentAnim && this.currentAnim.update() == true) {
                this.currentFrame = this.currentAnim.currentFrame;
                this._parent.frameBounds.width = this.currentFrame.width;
                this._parent.frameBounds.height = this.currentFrame.height;
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
                if(this._frameData) {
                    return this._frameData.total;
                } else {
                    return -1;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AnimationManager.prototype, "frame", {
            get: function () {
                return this._frameIndex;
            },
            set: function (value) {
                if(this._frameData.getFrame(value) !== null) {
                    this.currentFrame = this._frameData.getFrame(value);
                    this._parent.frameBounds.width = this.currentFrame.width;
                    this._parent.frameBounds.height = this.currentFrame.height;
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
                if(this._frameData.getFrameByName(value) !== null) {
                    this.currentFrame = this._frameData.getFrameByName(value);
                    this._parent.frameBounds.width = this.currentFrame.width;
                    this._parent.frameBounds.height = this.currentFrame.height;
                    this._frameIndex = this.currentFrame.index;
                }
            },
            enumerable: true,
            configurable: true
        });
        AnimationManager.prototype.destroy = /**
        * Removes all related references
        */
        function () {
            this._anims = {
            };
            this._frameData = null;
            this._frameIndex = 0;
            this.currentAnim = null;
            this.currentFrame = null;
        };
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
        /**
        * Cache constructor
        */
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
        Cache.prototype.addCanvas = /**
        * Add a new canvas.
        * @param key {string} Asset key for this canvas.
        * @param canvas {HTMLCanvasElement} Canvas DOM element.
        * @param context {CanvasRenderingContext2D} Render context of this canvas.
        */
        function (key, canvas, context) {
            this._canvases[key] = {
                canvas: canvas,
                context: context
            };
        };
        Cache.prototype.addSpriteSheet = /**
        * Add a new sprite sheet.
        * @param key {string} Asset key for the sprite sheet.
        * @param url {string} URL of this sprite sheet file.
        * @param data {object} Extra sprite sheet data.
        * @param frameWidth {number} Width of the sprite sheet.
        * @param frameHeight {number} Height of the sprite sheet.
        * @param frameMax {number} How many frames stored in the sprite sheet.
        */
        function (key, url, data, frameWidth, frameHeight, frameMax) {
            this._images[key] = {
                url: url,
                data: data,
                spriteSheet: true,
                frameWidth: frameWidth,
                frameHeight: frameHeight
            };
            this._images[key].frameData = Phaser.AnimationLoader.parseSpriteSheet(this._game, key, frameWidth, frameHeight, frameMax);
        };
        Cache.prototype.addTextureAtlas = /**
        * Add a new texture atlas.
        * @param key  {string} Asset key for the texture atlas.
        * @param url  {string} URL of this texture atlas file.
        * @param data {object} Extra texture atlas data.
        * @param atlasData {object} Texture atlas frames data.
        */
        function (key, url, data, atlasData, format) {
            this._images[key] = {
                url: url,
                data: data,
                spriteSheet: true
            };
            if(format == Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY) {
                this._images[key].frameData = Phaser.AnimationLoader.parseJSONData(this._game, atlasData);
            } else if(format == Phaser.Loader.TEXTURE_ATLAS_XML_STARLING) {
                this._images[key].frameData = Phaser.AnimationLoader.parseXMLData(this._game, atlasData, format);
            }
        };
        Cache.prototype.addImage = /**
        * Add a new image.
        * @param key {string} Asset key for the image.
        * @param url {string} URL of this image file.
        * @param data {object} Extra image data.
        */
        function (key, url, data) {
            this._images[key] = {
                url: url,
                data: data,
                spriteSheet: false
            };
        };
        Cache.prototype.addSound = /**
        * Add a new sound.
        * @param key {string} Asset key for the sound.
        * @param url {string} URL of this sound file.
        * @param data {object} Extra sound data.
        */
        function (key, url, data) {
            this._sounds[key] = {
                url: url,
                data: data,
                decoded: false
            };
        };
        Cache.prototype.decodedSound = /**
        * Add a new decoded sound.
        * @param key {string} Asset key for the sound.
        * @param url {string} URL of this sound file.
        * @param data {object} Extra sound data.
        */
        function (key, data) {
            this._sounds[key].data = data;
            this._sounds[key].decoded = true;
        };
        Cache.prototype.addText = /**
        * Add a new text data.
        * @param key {string} Asset key for the text data.
        * @param url {string} URL of this text data file.
        * @param data {object} Extra text data.
        */
        function (key, url, data) {
            this._text[key] = {
                url: url,
                data: data
            };
        };
        Cache.prototype.getCanvas = /**
        * Get canvas by key.
        * @param key Asset key of the canvas you want.
        * @return {object} The canvas you want.
        */
        function (key) {
            if(this._canvases[key]) {
                return this._canvases[key].canvas;
            }
            return null;
        };
        Cache.prototype.getImage = /**
        * Get image data by key.
        * @param key Asset key of the image you want.
        * @return {object} The image data you want.
        */
        function (key) {
            if(this._images[key]) {
                return this._images[key].data;
            }
            return null;
        };
        Cache.prototype.getFrameData = /**
        * Get frame data by key.
        * @param key Asset key of the frame data you want.
        * @return {object} The frame data you want.
        */
        function (key) {
            if(this._images[key] && this._images[key].spriteSheet == true) {
                return this._images[key].frameData;
            }
            return null;
        };
        Cache.prototype.getSound = /**
        * Get sound data by key.
        * @param key Asset key of the sound you want.
        * @return {object} The sound data you want.
        */
        function (key) {
            if(this._sounds[key]) {
                return this._sounds[key].data;
            }
            return null;
        };
        Cache.prototype.isSoundDecoded = /**
        * Check whether an asset is decoded sound.
        * @param key Asset key of the sound you want.
        * @return {object} The sound data you want.
        */
        function (key) {
            if(this._sounds[key]) {
                return this._sounds[key].decoded;
            }
        };
        Cache.prototype.isSpriteSheet = /**
        * Check whether an asset is sprite sheet.
        * @param key Asset key of the sprite sheet you want.
        * @return {object} The sprite sheet data you want.
        */
        function (key) {
            if(this._images[key]) {
                return this._images[key].spriteSheet;
            }
        };
        Cache.prototype.getText = /**
        * Get text data by key.
        * @param key Asset key of the text data you want.
        * @return {object} The text data you want.
        */
        function (key) {
            if(this._text[key]) {
                return this._text[key].data;
            }
            return null;
        };
        Cache.prototype.destroy = /**
        * Clean up cache memory.
        */
        function () {
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
/// <reference path="Game.ts" />
/// <reference path="system/Camera.ts" />
/**
* Phaser - CameraManager
*
* Your game only has one CameraManager instance and it's responsible for looking after, creating and destroying
* all of the cameras in the world.
*/
var Phaser;
(function (Phaser) {
    var CameraManager = (function () {
        /**
        * CameraManager constructor
        * This will create a new <code>Camera</code> with position and size.
        *
        * @param x {number} X Position of the created camera.
        * @param y {number} y Position of the created camera.
        * @param width {number} Width of the created camera.
        * @param height {number} Height of the created camera.
        */
        function CameraManager(game, x, y, width, height) {
            /**
            * Local helper stores index of next created camera.
            */
            this._cameraInstance = 0;
            this._game = game;
            this._cameras = [];
            this.current = this.addCamera(x, y, width, height);
        }
        CameraManager.prototype.getAll = /**
        * Get all the cameras.
        *
        * @returns {Camera[]} An array contains all the cameras.
        */
        function () {
            return this._cameras;
        };
        CameraManager.prototype.update = /**
        * Update cameras.
        */
        function () {
            this._cameras.forEach(function (camera) {
                return camera.update();
            });
        };
        CameraManager.prototype.render = /**
        * Render cameras.
        */
        function () {
            this._cameras.forEach(function (camera) {
                return camera.render();
            });
        };
        CameraManager.prototype.addCamera = /**
        * Create a new camera with specific position and size.
        *
        * @param x {number} X position of the new camera.
        * @param y {number} Y position of the new camera.
        * @param width {number} Width of the new camera.
        * @param height {number} Height of the new camera.
        * @returns {Camera} The newly created camera object.
        */
        function (x, y, width, height) {
            var newCam = new Phaser.Camera(this._game, this._cameraInstance, x, y, width, height);
            this._cameras.push(newCam);
            this._cameraInstance++;
            return newCam;
        };
        CameraManager.prototype.removeCamera = /**
        * Remove a new camera with its id.
        *
        * @param id {number} ID of the camera you want to remove.
        * @returns {boolean} True if successfully removed the camera, otherwise return false.
        */
        function (id) {
            for(var c = 0; c < this._cameras.length; c++) {
                if(this._cameras[c].ID == id) {
                    if(this.current.ID === this._cameras[c].ID) {
                        this.current = null;
                    }
                    this._cameras.splice(c, 1);
                    return true;
                }
            }
            return false;
        };
        CameraManager.prototype.destroy = /**
        * Clean up memory.
        */
        function () {
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
        Point.prototype.rotate = /**
        * Rotates the point around the x/y coordinates given to the desired angle
        * @param x {number} The x coordinate of the anchor point
        * @param y {number} The y coordinate of the anchor point
        * @param {Number} angle The angle in radians (unless asDegrees is true) to return the point from.
        * @param {Boolean} asDegrees Is the given angle in radians (false) or degrees (true)?
        * @param {Number} distance An optional distance constraint between the point and the anchor
        * @return The modified point object
        */
        function (cx, cy, angle, asDegrees, distance) {
            if (typeof asDegrees === "undefined") { asDegrees = false; }
            if (typeof distance === "undefined") { distance = null; }
            if(asDegrees) {
                angle = angle * Phaser.GameMath.DEG_TO_RAD;
            }
            //  Get distance from origin (cx/cy) to this point
            if(distance === null) {
                distance = Math.sqrt(((cx - this.x) * (cx - this.x)) + ((cy - this.y) * (cy - this.y)));
            }
            return this.setTo(cx + distance * Math.cos(angle), cy + distance * Math.sin(angle));
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
            * @type {Number}
            **/
            function () {
                return this._x;
            },
            set: /**
            * The x coordinate of the top-left corner of the rectangle
            * @property x
            * @type {Number}
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
            * @type {Number}
            **/
            function () {
                return this._y;
            },
            set: /**
            * The y coordinate of the top-left corner of the rectangle
            * @property y
            * @type {Number}
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
        * Creates a new Rectangle object with the top-left corner specified by the x and y parameters and with the specified width and height parameters.
        * If you call this function without parameters, a rectangle with x, y, width, and height properties set to 0 is created.
        * @class Rectangle
        * @constructor
        * @param {Number} x The x coordinate of the top-left corner of the rectangle.
        * @param {Number} y The y coordinate of the top-left corner of the rectangle.
        * @param {Number} width The width of the rectangle.
        * @param {Number} height The height of the rectangle.
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
            * @type {Number}
            **/
            this._width = 0;
            /**
            * The height of the rectangle
            * @property height
            * @type {Number}
            **/
            this._height = 0;
            /**
            * Half of the width of the rectangle
            * @property halfWidth
            * @type {Number}
            **/
            this._halfWidth = 0;
            /**
            * Half of the height of the rectangle
            * @property halfHeight
            * @type {Number}
            **/
            this._halfHeight = 0;
            /**
            * The size of the longest side (width or height)
            * @property length
            * @type {Number}
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
            * @type {Number}
            **/
            function () {
                return this.topLeft.x;
            },
            set: /**
            * The x coordinate of the top-left corner of the rectangle
            * @property x
            * @type {Number}
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
            * @type {Number}
            **/
            function () {
                return this.topLeft.y;
            },
            set: /**
            * The y coordinate of the top-left corner of the rectangle
            * @property y
            * @type {Number}
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
            * @type {Number}
            **/
            function () {
                return this._width;
            },
            set: /**
            * The width of the rectangle
            * @property width
            * @type {Number}
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
            * @type {Number}
            **/
            function () {
                return this._height;
            },
            set: /**
            * The height of the rectangle
            * @property height
            * @type {Number}
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
            * @type {Number}
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
            * @type {Number}
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
            * @ return {Number}
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
        * @return {String} a string representation of the instance.
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
* Phaser - Polygon
*
*/
var Phaser;
(function (Phaser) {
    var Polygon = (function () {
        /**
        * A *convex* clockwise polygon
        * @class Polygon
        * @constructor
        * @param {Vector2} pos A vector representing the origin of the polygon (all other points are relative to this one)
        * @param {Array.<Vector2>} points An Array of vectors representing the points in the polygon, in clockwise order.
        **/
        function Polygon(pos, points, parent) {
            if (typeof pos === "undefined") { pos = new Phaser.Vector2(); }
            if (typeof points === "undefined") { points = []; }
            if (typeof parent === "undefined") { parent = null; }
            this.pos = pos;
            this.points = points;
            this.parent = parent;
            this.recalc();
        }
        Polygon.prototype.recalc = /**
        * Recalculate the edges and normals of the polygon.  This
        * MUST be called if the points array is modified at all and
        * the edges or normals are to be accessed.
        */
        function () {
            var points = this.points;
            var len = points.length;
            this.edges = [];
            this.normals = [];
            for(var i = 0; i < len; i++) {
                var p1 = points[i];
                var p2 = i < len - 1 ? points[i + 1] : points[0];
                var e = new Phaser.Vector2().copyFrom(p2).sub(p1);
                var n = new Phaser.Vector2().copyFrom(e).perp().normalize();
                this.edges.push(e);
                this.normals.push(n);
            }
        };
        return Polygon;
    })();
    Phaser.Polygon = Polygon;    
})(Phaser || (Phaser = {}));
/// <reference path="../Game.ts" />
/// <reference path="Polygon.ts" />
/**
* Phaser - Quad
*
* A Quad object is an area defined by its position, as indicated by its top-left corner (x,y) and width and height.
* Very much like a Rectangle only without all of the additional methods and properties of that class.
*/
var Phaser;
(function (Phaser) {
    var Quad = (function () {
        /**
        * Creates a new Quad object with the top-left corner specified by the x and y parameters and with the specified width and height parameters. If you call this function without parameters, a rectangle with x, y, width, and height properties set to 0 is created.
        * @class Quad
        * @constructor
        * @param {Number} x The x coordinate of the top-left corner of the quad.
        * @param {Number} y The y coordinate of the top-left corner of the quad.
        * @param {Number} width The width of the quad.
        * @param {Number} height The height of the quad.
        * @return {Quad} This object
        **/
        function Quad(x, y, width, height) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            if (typeof width === "undefined") { width = 0; }
            if (typeof height === "undefined") { height = 0; }
            this.setTo(x, y, width, height);
        }
        Quad.prototype.setTo = /**
        * Sets the Quad to the specified size.
        * @method setTo
        * @param {Number} x The x coordinate of the top-left corner of the quad.
        * @param {Number} y The y coordinate of the top-left corner of the quad.
        * @param {Number} width The width of the quad.
        * @param {Number} height The height of the quad.
        * @return {Quad} This object
        **/
        function (x, y, width, height) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            return this;
        };
        Object.defineProperty(Quad.prototype, "left", {
            get: function () {
                return this.x;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Quad.prototype, "right", {
            get: function () {
                return this.x + this.width;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Quad.prototype, "top", {
            get: function () {
                return this.y;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Quad.prototype, "bottom", {
            get: function () {
                return this.y + this.height;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Quad.prototype, "halfWidth", {
            get: function () {
                return this.width / 2;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Quad.prototype, "halfHeight", {
            get: function () {
                return this.height / 2;
            },
            enumerable: true,
            configurable: true
        });
        Quad.prototype.intersects = /**
        * Determines whether the object specified intersects (overlaps) with this Quad object.
        * This method checks the x, y, width, and height properties of the specified Quad object to see if it intersects with this Quad object.
        * @method intersects
        * @param {Object} quad The object to check for intersection with this Quad. Must have left/right/top/bottom properties (Rectangle, Quad).
        * @param {Number} tolerance A tolerance value to allow for an intersection test with padding, default to 0
        * @return {Boolean} A value of true if the specified object intersects with this Quad; otherwise false.
        **/
        function (quad, tolerance) {
            if (typeof tolerance === "undefined") { tolerance = 0; }
            return !(quad.left > this.right + tolerance || quad.right < this.left - tolerance || quad.top > this.bottom + tolerance || quad.bottom < this.top - tolerance);
        };
        Quad.prototype.intersectsRaw = /**
        * Determines whether the object specified intersects (overlaps) with the given values.
        * @method intersectsProps
        * @param {Number} left
        * @param {Number} right
        * @param {Number} top
        * @param {Number} bottomt
        * @param {Number} tolerance A tolerance value to allow for an intersection test with padding, default to 0
        * @return {Boolean} A value of true if the specified object intersects with this Quad; otherwise false.
        **/
        function (left, right, top, bottom, tolerance) {
            if (typeof tolerance === "undefined") { tolerance = 0; }
            return !(left > this.right + tolerance || right < this.left - tolerance || top > this.bottom + tolerance || bottom < this.top - tolerance);
        };
        Quad.prototype.contains = /**
        * Determines whether the specified coordinates are contained within the region defined by this Quad object.
        * @method contains
        * @param {Number} x The x coordinate of the point to test.
        * @param {Number} y The y coordinate of the point to test.
        * @return {Boolean} A value of true if the Rectangle object contains the specified point; otherwise false.
        **/
        function (x, y) {
            if(x >= this.x && x <= this.right && y >= this.y && y <= this.bottom) {
                return true;
            }
            return false;
        };
        Quad.prototype.copyFrom = /**
        * Copies the x/y/width/height values from the source object into this Quad
        * @method copyFrom
        * @param {Any} source The source object to copy from. Can be a Quad, Rectangle or any object with exposed x/y/width/height properties
        * @return {Quad} This object
        **/
        function (source) {
            return this.setTo(source.x, source.y, source.width, source.height);
        };
        Quad.prototype.copyTo = /**
        * Copies the x/y/width/height values from this Quad into the given target object
        * @method copyTo
        * @param {Any} target The object to copy this quads values in to. Can be a Quad, Rectangle or any object with exposed x/y/width/height properties
        * @return {Any} The target object
        **/
        function (target) {
            return target.copyFrom(this);
        };
        Quad.prototype.toPolygon = /**
        * Creates and returns a Polygon that is the same as this Quad.
        * @method toPolygon
        * @return {Polygon} A new Polygon that represents this quad.
        **/
        function () {
            return new Phaser.Polygon(new Phaser.Vector2(this.x, this.y), [
                new Phaser.Vector2(), 
                new Phaser.Vector2(this.width, 0), 
                new Phaser.Vector2(this.width, this.height), 
                new Phaser.Vector2(0, this.height)
            ]);
        };
        Quad.prototype.toString = /**
        * Returns a string representation of this object.
        * @method toString
        * @return {string} a string representation of the object.
        **/
        function () {
            return "[{Quad (x=" + this.x + " y=" + this.y + " width=" + this.width + " height=" + this.height + ")}]";
        };
        return Quad;
    })();
    Phaser.Quad = Quad;    
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
        * @param {Number} [x] The x coordinate of the center of the circle.
        * @param {Number} [y] The y coordinate of the center of the circle.
        * @param {Number} [diameter] The diameter of the circle.
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
            this._pos = new Phaser.Vector2();
            this.setTo(x, y, diameter);
        }
        Object.defineProperty(Circle.prototype, "pos", {
            get: /**
            * The position of this Circle object represented by a Vector2
            * @property pos
            * @type Vector2
            **/
            function () {
                return this._pos.setTo(this.x, this.y);
            },
            enumerable: true,
            configurable: true
        });
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
                if(this._diameter <= 0) {
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
        * @param {Circle} [optional] output Optional Circle object. If given the values will be set into the object, otherwise a brand new Circle object will be created and returned.
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
        * @param {Boolean} [optional] round - Round the distance to the nearest integer (default false)
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
        * @param {Number} angle The angle in radians (unless asDegrees is true) to return the point from.
        * @param {Boolean} asDegrees Is the given angle in radians (false) or degrees (true)?
        * @param {Phaser.Point} [optional] output An optional Point object to put the result in to. If none specified a new Point object will be created.
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
            * @type {Number}
            */
            this.x1 = 0;
            /**
            *
            * @property y1
            * @type {Number}
            */
            this.y1 = 0;
            /**
            *
            * @property x2
            * @type {Number}
            */
            this.x2 = 0;
            /**
            *
            * @property y2
            * @type {Number}
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
            * @type {Boolean}
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
/// <reference path="Polygon.ts" />
/**
* Phaser - Response
*
*/
var Phaser;
(function (Phaser) {
    var Response = (function () {
        /**
        * An object representing the result of an intersection. Contain information about:
        * - The two objects participating in the intersection
        * - The vector representing the minimum change necessary to extract the first object
        *   from the second one.
        * - Whether the first object is entirely inside the second, or vice versa.
        *
        * @constructor
        */
        function Response() {
            this.a = null;
            this.b = null;
            this.overlapN = new Phaser.Vector2();
            this.overlapV = new Phaser.Vector2();
            this.clear();
        }
        Response.prototype.clear = /**
        * Set some values of the response back to their defaults.  Call this between tests if
        * you are going to reuse a single Response object for multiple intersection tests (recommented)
        *
        * @return {Response} This for chaining
        */
        function () {
            this.aInB = true;
            this.bInA = true;
            this.overlap = Number.MAX_VALUE;
            return this;
        };
        return Response;
    })();
    Phaser.Response = Response;    
})(Phaser || (Phaser = {}));
/// <reference path="../Game.ts" />
/**
* Phaser - Vector2
*
* A two dimensional vector.
* Contains methods and ideas from verlet-js by Sub Protocol, SAT.js by Jim Riecken and N by Metanet Software.
*/
var Phaser;
(function (Phaser) {
    var Vector2 = (function () {
        /**
        * Creates a new Vector2 object.
        * @class Vector2
        * @constructor
        * @param {Number} x The x position of the vector
        * @param {Number} y The y position of the vector
        * @return {Vector2} This object
        **/
        function Vector2(x, y) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            this.x = x;
            this.y = y;
        }
        Vector2.prototype.setTo = function (x, y) {
            this.x = x;
            this.y = y;
            return this;
        };
        Vector2.prototype.add = /**
        * Add this vector to the given one and return the result.
        *
        * @param {Vector2} v The other Vector.
        * @param {Vector2} The output Vector.
        * @return {Vector2} The new Vector
        */
        function (v, output) {
            if (typeof output === "undefined") { output = new Vector2(); }
            return output.setTo(this.x + v.x, this.y + v.y);
        };
        Vector2.prototype.sub = /**
        * Subtract this vector to the given one and return the result.
        *
        * @param {Vector2} v The other Vector.
        * @param {Vector2} The output Vector.
        * @return {Vector2} The new Vector
        */
        function (v, output) {
            if (typeof output === "undefined") { output = new Vector2(); }
            return output.setTo(this.x - v.x, this.y - v.y);
        };
        Vector2.prototype.mul = /**
        * Multiply this vector with the given one and return the result.
        *
        * @param {Vector2} v The other Vector.
        * @param {Vector2} The output Vector.
        * @return {Vector2} The new Vector
        */
        function (v, output) {
            if (typeof output === "undefined") { output = new Vector2(); }
            return output.setTo(this.x * v.x, this.y * v.y);
        };
        Vector2.prototype.div = /**
        * Divide this vector by the given one and return the result.
        *
        * @param {Vector2} v The other Vector.
        * @param {Vector2} The output Vector.
        * @return {Vector2} The new Vector
        */
        function (v, output) {
            if (typeof output === "undefined") { output = new Vector2(); }
            return output.setTo(this.x / v.x, this.y / v.y);
        };
        Vector2.prototype.scale = /**
        * Scale this vector by the given values and return the result.
        *
        * @param {number} x The scaling factor in the x direction.
        * @param {?number=} y The scaling factor in the y direction.  If this
        *   is not specified, the x scaling factor will be used.
        * @return {Vector} The new Vector
        */
        function (x, y, output) {
            if (typeof y === "undefined") { y = null; }
            if (typeof output === "undefined") { output = new Vector2(); }
            if(y === null) {
                y = x;
            }
            return output.setTo(this.x * x, this.y * y);
        };
        Vector2.prototype.perp = /**
        * Rotate this vector by 90 degrees
        *
        * @return {Vector} This for chaining.
        */
        function (output) {
            if (typeof output === "undefined") { output = this; }
            var x = this.x;
            return output.setTo(this.y, -x);
        };
        Vector2.prototype.mutableSet = //  Same as copyFrom, used by VerletManager
        function (v) {
            this.x = v.x;
            this.y = v.y;
            return this;
        };
        Vector2.prototype.mutableAdd = /**
        * Add another vector to this one.
        *
        * @param {Vector} other The other Vector.
        * @return {Vector} This for chaining.
        */
        function (v) {
            this.x += v.x;
            this.y += v.y;
            return this;
        };
        Vector2.prototype.mutableSub = /**
        * Subtract another vector from this one.
        *
        * @param {Vector} other The other Vector.
        * @return {Vector} This for chaining.
        */
        function (v) {
            this.x -= v.x;
            this.y -= v.y;
            return this;
        };
        Vector2.prototype.mutableMul = /**
        * Multiply another vector with this one.
        *
        * @param {Vector} other The other Vector.
        * @return {Vector} This for chaining.
        */
        function (v) {
            this.x *= v.x;
            this.y *= v.y;
            return this;
        };
        Vector2.prototype.mutableDiv = /**
        * Divide this vector by another one.
        *
        * @param {Vector} other The other Vector.
        * @return {Vector} This for chaining.
        */
        function (v) {
            this.x /= v.x;
            this.y /= v.y;
            return this;
        };
        Vector2.prototype.mutableScale = /**
        * Scale this vector.
        *
        * @param {number} x The scaling factor in the x direction.
        * @param {?number=} y The scaling factor in the y direction.  If this
        *   is not specified, the x scaling factor will be used.
        * @return {Vector} This for chaining.
        */
        function (x, y) {
            this.x *= x;
            this.y *= y || x;
            return this;
        };
        Vector2.prototype.reverse = /**
        * Reverse this vector.
        *
        * @return {Vector} This for chaining.
        */
        function () {
            this.x = -this.x;
            this.y = -this.y;
            return this;
        };
        Vector2.prototype.edge = function (v, output) {
            if (typeof output === "undefined") { output = new Vector2(); }
            return this.sub(v, output);
        };
        Vector2.prototype.equals = function (v) {
            return this.x == v.x && this.y == v.y;
        };
        Vector2.prototype.epsilonEquals = function (v, epsilon) {
            return Math.abs(this.x - v.x) <= epsilon && Math.abs(this.y - v.y) <= epsilon;
        };
        Vector2.prototype.length = /**
        * Get the length of this vector.
        *
        * @return {number} The length of this vector.
        */
        function () {
            return Math.sqrt((this.x * this.x) + (this.y * this.y));
        };
        Vector2.prototype.length2 = /**
        * Get the length^2 of this vector.
        *
        * @return {number} The length^2 of this vector.
        */
        function () {
            return (this.x * this.x) + (this.y * this.y);
        };
        Vector2.prototype.distance = /**
        * Get the distance between this vector and the given vector.
        *
        * @return {Vector2} v The vector to check
        */
        function (v) {
            return Math.sqrt(this.distance2(v));
        };
        Vector2.prototype.distance2 = /**
        * Get the distance^2 between this vector and the given vector.
        *
        * @return {Vector2} v The vector to check
        */
        function (v) {
            return ((v.x - this.x) * (v.x - this.x)) + ((v.y - this.y) * (v.y - this.y));
        };
        Vector2.prototype.project = /**
        * Project this vector on to another vector.
        *
        * @param {Vector} other The vector to project onto.
        * @return {Vector} This for chaining.
        */
        function (other) {
            var amt = this.dot(other) / other.length2();
            if(amt != 0) {
                this.x = amt * other.x;
                this.y = amt * other.y;
            }
            return this;
        };
        Vector2.prototype.projectN = /**
        * Project this vector onto a vector of unit length.
        *
        * @param {Vector} other The unit vector to project onto.
        * @return {Vector} This for chaining.
        */
        function (other) {
            var amt = this.dot(other);
            if(amt != 0) {
                this.x = amt * other.x;
                this.y = amt * other.y;
            }
            return this;
        };
        Vector2.prototype.reflect = /**
        * Reflect this vector on an arbitrary axis.
        *
        * @param {Vector} axis The vector representing the axis.
        * @return {Vector} This for chaining.
        */
        function (axis) {
            var x = this.x;
            var y = this.y;
            this.project(axis).scale(2);
            this.x -= x;
            this.y -= y;
            return this;
        };
        Vector2.prototype.reflectN = /**
        * Reflect this vector on an arbitrary axis (represented by a unit vector)
        *
        * @param {Vector} axis The unit vector representing the axis.
        * @return {Vector} This for chaining.
        */
        function (axis) {
            var x = this.x;
            var y = this.y;
            this.projectN(axis).scale(2);
            this.x -= x;
            this.y -= y;
            return this;
        };
        Vector2.prototype.getProjectionMagnitude = function (v) {
            var den = v.dot(v);
            if(den == 0) {
                return 0;
            } else {
                return Math.abs(this.dot(v) / den);
            }
        };
        Vector2.prototype.direction = function (output) {
            if (typeof output === "undefined") { output = new Vector2(); }
            output.copyFrom(this);
            return this.normalize(output);
        };
        Vector2.prototype.normalRightHand = function (output) {
            if (typeof output === "undefined") { output = this; }
            return output.setTo(this.y * -1, this.x);
        };
        Vector2.prototype.normalize = /**
        * Normalize (make unit length) this vector.
        *
        * @return {Vector} This for chaining.
        */
        function (output) {
            if (typeof output === "undefined") { output = this; }
            var m = this.length();
            if(m != 0) {
                output.setTo(this.x / m, this.y / m);
            }
            return output;
        };
        Vector2.prototype.getMagnitude = function () {
            return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
        };
        Vector2.prototype.dot = /**
        * Get the dot product of this vector against another.
        *
        * @param {Vector}  other The vector to dot this one against.
        * @return {number} The dot product.
        */
        function (v) {
            return ((this.x * v.x) + (this.y * v.y));
        };
        Vector2.prototype.cross = /**
        * Get the cross product of this vector against another.
        *
        * @param {Vector}  other The vector to cross this one against.
        * @return {number} The cross product.
        */
        function (v) {
            return ((this.x * v.y) - (this.y * v.x));
        };
        Vector2.prototype.angle = /**
        * Get the angle between this vector and the given vector.
        *
        * @return {Vector2} v The vector to check
        */
        function (v) {
            return Math.atan2(this.x * v.y - this.y * v.x, this.x * v.x + this.y * v.y);
        };
        Vector2.prototype.angle2 = function (vLeft, vRight) {
            return vLeft.sub(this).angle(vRight.sub(this));
        };
        Vector2.prototype.rotate = /**
        * Rotate this vector around the origin to the given angle (theta) and return the result in a new Vector
        *
        * @return {Vector2} v The vector to check
        */
        function (origin, theta, output) {
            if (typeof output === "undefined") { output = new Vector2(); }
            var x = this.x - origin.x;
            var y = this.y - origin.y;
            return output.setTo(x * Math.cos(theta) - y * Math.sin(theta) + origin.x, x * Math.sin(theta) + y * Math.cos(theta) + origin.y);
        };
        Vector2.prototype.clone = function (output) {
            if (typeof output === "undefined") { output = new Vector2(); }
            return output.setTo(this.x, this.y);
        };
        Vector2.prototype.copyFrom = function (v) {
            this.x = v.x;
            this.y = v.y;
            return this;
        };
        Vector2.prototype.copyTo = function (v) {
            return v.setTo(this.x, this.y);
        };
        Vector2.prototype.toString = /**
        * Returns a string representation of this object.
        * @method toString
        * @return {string} a string representation of the object.
        **/
        function () {
            return "[{Vector2 (x=" + this.x + " y=" + this.y + ")}]";
        };
        return Vector2;
    })();
    Phaser.Vector2 = Vector2;    
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
        * @param {Number} x			The X-coordinate of the point in space.
        * @param {Number} y			The Y-coordinate of the point in space.
        * @param {Number} width		Desired width of this node.
        * @param {Number} height		Desired height of this node.
        * @param {Number} parent		The parent branch or node.  Pass null to create a root.
        */
        function QuadTree(x, y, width, height, parent) {
            if (typeof parent === "undefined") { parent = null; }
                _super.call(this, x, y, width, height);
            this._headA = this._tailA = new Phaser.LinkedList();
            this._headB = this._tailB = new Phaser.LinkedList();
            //Copy the parent's children (if there are any)
            if(parent != null) {
                var iterator;
                var ot;
                if(parent._headA.object != null) {
                    iterator = parent._headA;
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
                if(parent._headB.object != null) {
                    iterator = parent._headB;
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
        * @param {Basic} objectOrGroup1	Any object that is or extends GameObject or Group.
        * @param {Basic} objectOrGroup2	Any object that is or extends GameObject or Group.  If null, the first parameter will be checked against itself.
        * @param {Function} notifyCallback	A function with the form <code>myFunction(Object1:GameObject,Object2:GameObject)</code> that is called whenever two objects are found to overlap in world space, and either no processCallback is specified, or the processCallback returns true.
        * @param {Function} processCallback	A function with the form <code>myFunction(Object1:GameObject,Object2:GameObject):bool</code> that is called whenever two objects are found to overlap in world space.  The notifyCallback is only called if this function returns true.  See GameObject.separate().
        * @param context The context in which the callbacks will be called
        */
        function (objectOrGroup1, objectOrGroup2, notifyCallback, processCallback, context) {
            if (typeof objectOrGroup2 === "undefined") { objectOrGroup2 = null; }
            if (typeof notifyCallback === "undefined") { notifyCallback = null; }
            if (typeof processCallback === "undefined") { processCallback = null; }
            if (typeof context === "undefined") { context = null; }
            this.add(objectOrGroup1, QuadTree.A_LIST);
            if(objectOrGroup2 != null) {
                this.add(objectOrGroup2, QuadTree.B_LIST);
                QuadTree._useBothLists = true;
            } else {
                QuadTree._useBothLists = false;
            }
            QuadTree._notifyCallback = notifyCallback;
            QuadTree._processingCallback = processCallback;
            QuadTree._callbackContext = context;
        };
        QuadTree.prototype.add = /**
        * Call this function to add an object to the root of the tree.
        * This function will recursively add all group members, but
        * not the groups themselves.
        *
        * @param {Basic} objectOrGroup	GameObjects are just added, Groups are recursed and their applicable members added accordingly.
        * @param {Number} list	A <code>uint</code> flag indicating the list to which you want to add the objects.  Options are <code>QuadTree.A_LIST</code> and <code>QuadTree.B_LIST</code>.
        */
        function (objectOrGroup, list) {
            QuadTree._list = list;
            if(objectOrGroup.isGroup == true) {
                var i = 0;
                var basic;
                var members = objectOrGroup['members'];
                var l = objectOrGroup['length'];
                while(i < l) {
                    basic = members[i++];
                    if((basic != null) && basic.exists) {
                        if(basic.isGroup) {
                            this.add(basic, list);
                        } else {
                            QuadTree._object = basic;
                            if(QuadTree._object.exists && QuadTree._object.allowCollisions) {
                                this.addObject();
                            }
                        }
                    }
                }
            } else {
                QuadTree._object = objectOrGroup;
                if(QuadTree._object.exists && QuadTree._object.allowCollisions) {
                    this.addObject();
                }
            }
        };
        QuadTree.prototype.addObject = /**
        * Internal function for recursively navigating and creating the tree
        * while adding objects to the appropriate nodes.
        */
        function () {
            //If this quad (not its children) lies entirely inside this object, add it here
            if(!this._canSubdivide || ((this._leftEdge >= QuadTree._object.collisionMask.x) && (this._rightEdge <= QuadTree._object.collisionMask.right) && (this._topEdge >= QuadTree._object.collisionMask.y) && (this._bottomEdge <= QuadTree._object.collisionMask.bottom))) {
                this.addToList();
                return;
            }
            //See if the selected object fits completely inside any of the quadrants
            if((QuadTree._object.collisionMask.x > this._leftEdge) && (QuadTree._object.collisionMask.right < this._midpointX)) {
                if((QuadTree._object.collisionMask.y > this._topEdge) && (QuadTree._object.collisionMask.bottom < this._midpointY)) {
                    if(this._northWestTree == null) {
                        this._northWestTree = new QuadTree(this._leftEdge, this._topEdge, this._halfWidth, this._halfHeight, this);
                    }
                    this._northWestTree.addObject();
                    return;
                }
                if((QuadTree._object.collisionMask.y > this._midpointY) && (QuadTree._object.collisionMask.bottom < this._bottomEdge)) {
                    if(this._southWestTree == null) {
                        this._southWestTree = new QuadTree(this._leftEdge, this._midpointY, this._halfWidth, this._halfHeight, this);
                    }
                    this._southWestTree.addObject();
                    return;
                }
            }
            if((QuadTree._object.collisionMask.x > this._midpointX) && (QuadTree._object.collisionMask.right < this._rightEdge)) {
                if((QuadTree._object.collisionMask.y > this._topEdge) && (QuadTree._object.collisionMask.bottom < this._midpointY)) {
                    if(this._northEastTree == null) {
                        this._northEastTree = new QuadTree(this._midpointX, this._topEdge, this._halfWidth, this._halfHeight, this);
                    }
                    this._northEastTree.addObject();
                    return;
                }
                if((QuadTree._object.collisionMask.y > this._midpointY) && (QuadTree._object.collisionMask.bottom < this._bottomEdge)) {
                    if(this._southEastTree == null) {
                        this._southEastTree = new QuadTree(this._midpointX, this._midpointY, this._halfWidth, this._halfHeight, this);
                    }
                    this._southEastTree.addObject();
                    return;
                }
            }
            //If it wasn't completely contained we have to check out the partial overlaps
            if((QuadTree._object.collisionMask.right > this._leftEdge) && (QuadTree._object.collisionMask.x < this._midpointX) && (QuadTree._object.collisionMask.bottom > this._topEdge) && (QuadTree._object.collisionMask.y < this._midpointY)) {
                if(this._northWestTree == null) {
                    this._northWestTree = new QuadTree(this._leftEdge, this._topEdge, this._halfWidth, this._halfHeight, this);
                }
                this._northWestTree.addObject();
            }
            if((QuadTree._object.collisionMask.right > this._midpointX) && (QuadTree._object.collisionMask.x < this._rightEdge) && (QuadTree._object.collisionMask.bottom > this._topEdge) && (QuadTree._object.collisionMask.y < this._midpointY)) {
                if(this._northEastTree == null) {
                    this._northEastTree = new QuadTree(this._midpointX, this._topEdge, this._halfWidth, this._halfHeight, this);
                }
                this._northEastTree.addObject();
            }
            if((QuadTree._object.collisionMask.right > this._midpointX) && (QuadTree._object.collisionMask.x < this._rightEdge) && (QuadTree._object.collisionMask.bottom > this._midpointY) && (QuadTree._object.collisionMask.y < this._bottomEdge)) {
                if(this._southEastTree == null) {
                    this._southEastTree = new QuadTree(this._midpointX, this._midpointY, this._halfWidth, this._halfHeight, this);
                }
                this._southEastTree.addObject();
            }
            if((QuadTree._object.collisionMask.right > this._leftEdge) && (QuadTree._object.collisionMask.x < this._midpointX) && (QuadTree._object.collisionMask.bottom > this._midpointY) && (QuadTree._object.collisionMask.y < this._bottomEdge)) {
                if(this._southWestTree == null) {
                    this._southWestTree = new QuadTree(this._leftEdge, this._midpointY, this._halfWidth, this._halfHeight, this);
                }
                this._southWestTree.addObject();
            }
        };
        QuadTree.prototype.addToList = /**
        * Internal function for recursively adding objects to leaf lists.
        */
        function () {
            var ot;
            if(QuadTree._list == QuadTree.A_LIST) {
                if(this._tailA.object != null) {
                    ot = this._tailA;
                    this._tailA = new Phaser.LinkedList();
                    ot.next = this._tailA;
                }
                this._tailA.object = QuadTree._object;
            } else {
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
        * @return {Boolean} Whether or not any overlaps were found.
        */
        function () {
            var overlapProcessed = false;
            var iterator;
            if(this._headA.object != null) {
                iterator = this._headA;
                while(iterator != null) {
                    QuadTree._object = iterator.object;
                    if(QuadTree._useBothLists) {
                        QuadTree._iterator = this._headB;
                    } else {
                        QuadTree._iterator = iterator.next;
                    }
                    if(QuadTree._object.exists && (QuadTree._object.allowCollisions > 0) && (QuadTree._iterator != null) && (QuadTree._iterator.object != null) && QuadTree._iterator.object.exists && this.overlapNode()) {
                        overlapProcessed = true;
                    }
                    iterator = iterator.next;
                }
            }
            //Advance through the tree by calling overlap on each child
            if((this._northWestTree != null) && this._northWestTree.execute()) {
                overlapProcessed = true;
            }
            if((this._northEastTree != null) && this._northEastTree.execute()) {
                overlapProcessed = true;
            }
            if((this._southEastTree != null) && this._southEastTree.execute()) {
                overlapProcessed = true;
            }
            if((this._southWestTree != null) && this._southWestTree.execute()) {
                overlapProcessed = true;
            }
            return overlapProcessed;
        };
        QuadTree.prototype.overlapNode = /**
        * A private for comparing an object against the contents of a node.
        *
        * @return {Boolean} Whether or not any overlaps were found.
        */
        function () {
            //Walk the list and check for overlaps
            var overlapProcessed = false;
            var checkObject;
            while(QuadTree._iterator != null) {
                if(!QuadTree._object.exists || (QuadTree._object.allowCollisions <= 0)) {
                    break;
                }
                checkObject = QuadTree._iterator.object;
                if((QuadTree._object === checkObject) || !checkObject.exists || (checkObject.allowCollisions <= 0)) {
                    QuadTree._iterator = QuadTree._iterator.next;
                    continue;
                }
                if(QuadTree._object.collisionMask.checkHullIntersection(checkObject.collisionMask)) {
                    //Execute callback functions if they exist
                    if((QuadTree._processingCallback == null) || QuadTree._processingCallback(QuadTree._object, checkObject)) {
                        overlapProcessed = true;
                    }
                    if(overlapProcessed && (QuadTree._notifyCallback != null)) {
                        if(QuadTree._callbackContext !== null) {
                            QuadTree._notifyCallback.call(QuadTree._callbackContext, QuadTree._object, checkObject);
                        } else {
                            QuadTree._notifyCallback(QuadTree._object, checkObject);
                        }
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
/// <reference path="geom/Quad.ts" />
/// <reference path="geom/Circle.ts" />
/// <reference path="geom/Line.ts" />
/// <reference path="geom/IntersectResult.ts" />
/// <reference path="geom/Response.ts" />
/// <reference path="geom/Vector2.ts" />
/// <reference path="system/QuadTree.ts" />
/**
* Phaser - Collision
*
* A set of extremely useful collision and geometry intersection functions.
*/
var Phaser;
(function (Phaser) {
    var Collision = (function () {
        /**
        * Collision constructor
        * @param game A reference to the current Game
        */
        function Collision(game) {
            this._game = game;
            Collision.T_VECTORS = [];
            for(var i = 0; i < 10; i++) {
                Collision.T_VECTORS.push(new Phaser.Vector2());
            }
            Collision.T_ARRAYS = [];
            for(var i = 0; i < 5; i++) {
                Collision.T_ARRAYS.push([]);
            }
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
        Collision.TILE_OVERLAP = false;
        Collision.lineToLine = /**
        * Checks for Line to Line intersection and returns an IntersectResult object containing the results of the intersection.
        * @param line1 The first Line object to check
        * @param line2 The second Line object to check
        * @param [output] An optional IntersectResult object to store the intersection values in. One is created if none given.
        * @returns {IntersectResult=} An IntersectResult object containing the results of the intersection
        */
        function lineToLine(line1, line2, output) {
            if (typeof output === "undefined") { output = new Phaser.IntersectResult(); }
            var denominator = (line1.x1 - line1.x2) * (line2.y1 - line2.y2) - (line1.y1 - line1.y2) * (line2.x1 - line2.x2);
            if(denominator !== 0) {
                output.result = true;
                output.x = ((line1.x1 * line1.y2 - line1.y1 * line1.x2) * (line2.x1 - line2.x2) - (line1.x1 - line1.x2) * (line2.x1 * line2.y2 - line2.y1 * line2.x2)) / denominator;
                output.y = ((line1.x1 * line1.y2 - line1.y1 * line1.x2) * (line2.y1 - line2.y2) - (line1.y1 - line1.y2) * (line2.x1 * line2.y2 - line2.y1 * line2.x2)) / denominator;
            }
            return output;
        };
        Collision.lineToLineSegment = /**
        * Checks for Line to Line Segment intersection and returns an IntersectResult object containing the results of the intersection.
        * @param line The Line object to check
        * @param seg The Line segment object to check
        * @param [output] An optional IntersectResult object to store the intersection values in. One is created if none given.
        * @returns {IntersectResult=} An IntersectResult object containing the results of the intersection
        */
        function lineToLineSegment(line, seg, output) {
            if (typeof output === "undefined") { output = new Phaser.IntersectResult(); }
            var denominator = (line.x1 - line.x2) * (seg.y1 - seg.y2) - (line.y1 - line.y2) * (seg.x1 - seg.x2);
            if(denominator !== 0) {
                output.x = ((line.x1 * line.y2 - line.y1 * line.x2) * (seg.x1 - seg.x2) - (line.x1 - line.x2) * (seg.x1 * seg.y2 - seg.y1 * seg.x2)) / denominator;
                output.y = ((line.x1 * line.y2 - line.y1 * line.x2) * (seg.y1 - seg.y2) - (line.y1 - line.y2) * (seg.x1 * seg.y2 - seg.y1 * seg.x2)) / denominator;
                var maxX = Math.max(seg.x1, seg.x2);
                var minX = Math.min(seg.x1, seg.x2);
                var maxY = Math.max(seg.y1, seg.y2);
                var minY = Math.min(seg.y1, seg.y2);
                if((output.x <= maxX && output.x >= minX) === true || (output.y <= maxY && output.y >= minY) === true) {
                    output.result = true;
                }
            }
            return output;
        };
        Collision.lineToRawSegment = /**
        * Checks for Line to Raw Line Segment intersection and returns the result in the IntersectResult object.
        * @param line The Line object to check
        * @param x1 The start x coordinate of the raw segment
        * @param y1 The start y coordinate of the raw segment
        * @param x2 The end x coordinate of the raw segment
        * @param y2 The end y coordinate of the raw segment
        * @param [output] An optional IntersectResult object to store the intersection values in. One is created if none given.
        * @returns {IntersectResult=} An IntersectResult object containing the results of the intersection
        */
        function lineToRawSegment(line, x1, y1, x2, y2, output) {
            if (typeof output === "undefined") { output = new Phaser.IntersectResult(); }
            var denominator = (line.x1 - line.x2) * (y1 - y2) - (line.y1 - line.y2) * (x1 - x2);
            if(denominator !== 0) {
                output.x = ((line.x1 * line.y2 - line.y1 * line.x2) * (x1 - x2) - (line.x1 - line.x2) * (x1 * y2 - y1 * x2)) / denominator;
                output.y = ((line.x1 * line.y2 - line.y1 * line.x2) * (y1 - y2) - (line.y1 - line.y2) * (x1 * y2 - y1 * x2)) / denominator;
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
        * Checks for Line to Ray intersection and returns the result in an IntersectResult object.
        * @param line1 The Line object to check
        * @param ray The Ray object to check
        * @param [output] An optional IntersectResult object to store the intersection values in. One is created if none given.
        * @returns {IntersectResult=} An IntersectResult object containing the results of the intersection
        */
        function lineToRay(line1, ray, output) {
            if (typeof output === "undefined") { output = new Phaser.IntersectResult(); }
            var denominator = (line1.x1 - line1.x2) * (ray.y1 - ray.y2) - (line1.y1 - line1.y2) * (ray.x1 - ray.x2);
            if(denominator !== 0) {
                output.x = ((line1.x1 * line1.y2 - line1.y1 * line1.x2) * (ray.x1 - ray.x2) - (line1.x1 - line1.x2) * (ray.x1 * ray.y2 - ray.y1 * ray.x2)) / denominator;
                output.y = ((line1.x1 * line1.y2 - line1.y1 * line1.x2) * (ray.y1 - ray.y2) - (line1.y1 - line1.y2) * (ray.x1 * ray.y2 - ray.y1 * ray.x2)) / denominator;
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
        * Check if the Line and Circle objects intersect
        * @param line The Line object to check
        * @param circle The Circle object to check
        * @param [output] An optional IntersectResult object to store the intersection values in. One is created if none given.
        * @returns {IntersectResult=} An IntersectResult object containing the results of the intersection
        */
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
        * @param line The Line object to check
        * @param rect The Rectangle object to check
        * @param [output] An optional IntersectResult object to store the intersection values in. One is created if none given.
        * @returns {IntersectResult=} An IntersectResult object containing the results of the intersection
        */
        function lineToRectangle(line, rect, output) {
            if (typeof output === "undefined") { output = new Phaser.IntersectResult(); }
            //  Top of the Rectangle vs the Line
            Collision.lineToRawSegment(line, rect.x, rect.y, rect.right, rect.y, output);
            if(output.result === true) {
                return output;
            }
            //  Left of the Rectangle vs the Line
            Collision.lineToRawSegment(line, rect.x, rect.y, rect.x, rect.bottom, output);
            if(output.result === true) {
                return output;
            }
            //  Bottom of the Rectangle vs the Line
            Collision.lineToRawSegment(line, rect.x, rect.bottom, rect.right, rect.bottom, output);
            if(output.result === true) {
                return output;
            }
            //  Right of the Rectangle vs the Line
            Collision.lineToRawSegment(line, rect.right, rect.y, rect.right, rect.bottom, output);
            return output;
        };
        Collision.lineSegmentToLineSegment = /**
        * Check if the two Line Segments intersect and returns the result in an IntersectResult object.
        * @param line1 The first Line Segment to check
        * @param line2 The second Line Segment to check
        * @param [output] An optional IntersectResult object to store the intersection values in. One is created if none given.
        * @returns {IntersectResult=} An IntersectResult object containing the results of the intersection
        */
        function lineSegmentToLineSegment(line1, line2, output) {
            if (typeof output === "undefined") { output = new Phaser.IntersectResult(); }
            Collision.lineToLineSegment(line1, line2);
            if(output.result === true) {
                if(!(output.x >= Math.min(line1.x1, line1.x2) && output.x <= Math.max(line1.x1, line1.x2) && output.y >= Math.min(line1.y1, line1.y2) && output.y <= Math.max(line1.y1, line1.y2))) {
                    output.result = false;
                }
            }
            return output;
        };
        Collision.lineSegmentToRay = /**
        * Check if the Line Segment intersects with the Ray and returns the result in an IntersectResult object.
        * @param line The Line Segment to check.
        * @param ray The Ray to check.
        * @param [output] An optional IntersectResult object to store the intersection values in. One is created if none given.
        * @returns {IntersectResult=} An IntersectResult object containing the results of the intersection
        */
        function lineSegmentToRay(line, ray, output) {
            if (typeof output === "undefined") { output = new Phaser.IntersectResult(); }
            Collision.lineToRay(line, ray, output);
            if(output.result === true) {
                if(!(output.x >= Math.min(line.x1, line.x2) && output.x <= Math.max(line.x1, line.x2) && output.y >= Math.min(line.y1, line.y2) && output.y <= Math.max(line.y1, line.y2))) {
                    output.result = false;
                }
            }
            return output;
        };
        Collision.lineSegmentToCircle = /**
        * Check if the Line Segment intersects with the Circle and returns the result in an IntersectResult object.
        * @param seg The Line Segment to check.
        * @param circle The Circle to check
        * @param [output] An optional IntersectResult object to store the intersection values in. One is created if none given.
        * @returns {IntersectResult=} An IntersectResult object containing the results of the intersection
        */
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
                    if(Collision.circleContainsPoint(circle, {
                        x: seg.x1,
                        y: seg.y1
                    }) || Collision.circleContainsPoint(circle, {
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
        * Check if the Line Segment intersects with the Rectangle and returns the result in an IntersectResult object.
        * @param seg The Line Segment to check.
        * @param rect The Rectangle to check.
        * @param [output] An optional IntersectResult object to store the intersection values in. One is created if none given.
        * @returns {IntersectResult=} An IntersectResult object containing the results of the intersection
        */
        function lineSegmentToRectangle(seg, rect, output) {
            if (typeof output === "undefined") { output = new Phaser.IntersectResult(); }
            if(rect.contains(seg.x1, seg.y1) && rect.contains(seg.x2, seg.y2)) {
                output.result = true;
            } else {
                //  Top of the Rectangle vs the Line
                Collision.lineToRawSegment(seg, rect.x, rect.y, rect.right, rect.bottom, output);
                if(output.result === true) {
                    return output;
                }
                //  Left of the Rectangle vs the Line
                Collision.lineToRawSegment(seg, rect.x, rect.y, rect.x, rect.bottom, output);
                if(output.result === true) {
                    return output;
                }
                //  Bottom of the Rectangle vs the Line
                Collision.lineToRawSegment(seg, rect.x, rect.bottom, rect.right, rect.bottom, output);
                if(output.result === true) {
                    return output;
                }
                //  Right of the Rectangle vs the Line
                Collision.lineToRawSegment(seg, rect.right, rect.y, rect.right, rect.bottom, output);
                return output;
            }
            return output;
        };
        Collision.rayToRectangle = /**
        * Check for Ray to Rectangle intersection and returns the result in an IntersectResult object.
        * @param ray The Ray to check.
        * @param rect The Rectangle to check.
        * @param [output] An optional IntersectResult object to store the intersection values in. One is created if none given.
        * @returns {IntersectResult=} An IntersectResult object containing the results of the intersection
        */
        function rayToRectangle(ray, rect, output) {
            if (typeof output === "undefined") { output = new Phaser.IntersectResult(); }
            //  Currently just finds first intersection - might not be closest to ray pt1
            Collision.lineToRectangle(ray, rect, output);
            return output;
        };
        Collision.rayToLineSegment = /**
        * Check whether a Ray intersects a Line segment and returns the parametric value where the intersection occurs in an IntersectResult object.
        * @param rayX1
        * @param rayY1
        * @param rayX2
        * @param rayY2
        * @param lineX1
        * @param lineY1
        * @param lineX2
        * @param lineY2
        * @param [output] An optional IntersectResult object to store the intersection values in. One is created if none given.
        * @returns {IntersectResult=} An IntersectResult object containing the results of the intersection
        */
        function rayToLineSegment(rayX1, rayY1, rayX2, rayY2, lineX1, lineY1, lineX2, lineY2, output) {
            if (typeof output === "undefined") { output = new Phaser.IntersectResult(); }
            var r;
            var s;
            var d;
            // Check lines are not parallel
            if((rayY2 - rayY1) / (rayX2 - rayX1) != (lineY2 - lineY1) / (lineX2 - lineX1)) {
                d = (((rayX2 - rayX1) * (lineY2 - lineY1)) - (rayY2 - rayY1) * (lineX2 - lineX1));
                if(d != 0) {
                    r = (((rayY1 - lineY1) * (lineX2 - lineX1)) - (rayX1 - lineX1) * (lineY2 - lineY1)) / d;
                    s = (((rayY1 - lineY1) * (rayX2 - rayX1)) - (rayX1 - lineX1) * (rayY2 - rayY1)) / d;
                    if(r >= 0) {
                        if(s >= 0 && s <= 1) {
                            output.result = true;
                            output.x = rayX1 + r * (rayX2 - rayX1);
                            output.y = rayY1 + r * (rayY2 - rayY1);
                        }
                    }
                }
            }
            return output;
        };
        Collision.pointToRectangle = /**
        * Determines whether the specified point is contained within the rectangular region defined by the Rectangle object and returns the result in an IntersectResult object.
        * @param point The Point or MicroPoint object to check, or any object with x and y properties.
        * @param rect The Rectangle object to check the point against
        * @param [output] An optional IntersectResult object to store the intersection values in. One is created if none given.
        * @returns {IntersectResult=} An IntersectResult object containing the results of the intersection
        */
        function pointToRectangle(point, rect, output) {
            if (typeof output === "undefined") { output = new Phaser.IntersectResult(); }
            output.setTo(point.x, point.y);
            output.result = rect.containsPoint(point);
            return output;
        };
        Collision.rectangleToRectangle = /**
        * Check whether two axis aligned Rectangles intersect and returns the intersecting rectangle dimensions in an IntersectResult object if they do.
        * @param rect1 The first Rectangle object.
        * @param rect2 The second Rectangle object.
        * @param [output] An optional IntersectResult object to store the intersection values in. One is created if none given.
        * @returns {IntersectResult=} An IntersectResult object containing the results of the intersection
        */
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
        Collision.rectangleToCircle = /**
        * Checks if the Rectangle and Circle objects intersect and returns the result in an IntersectResult object.
        * @param rect The Rectangle object to check
        * @param circle The Circle object to check
        * @param [output] An optional IntersectResult object to store the intersection values in. One is created if none given.
        * @returns {IntersectResult=} An IntersectResult object containing the results of the intersection
        */
        function rectangleToCircle(rect, circle, output) {
            if (typeof output === "undefined") { output = new Phaser.IntersectResult(); }
            return Collision.circleToRectangle(circle, rect, output);
        };
        Collision.circleToCircle = /**
        * Checks if the two Circle objects intersect and returns the result in an IntersectResult object.
        * @param circle1 The first Circle object to check
        * @param circle2 The second Circle object to check
        * @param [output] An optional IntersectResult object to store the intersection values in. One is created if none given.
        * @returns {IntersectResult=} An IntersectResult object containing the results of the intersection
        */
        function circleToCircle(circle1, circle2, output) {
            if (typeof output === "undefined") { output = new Phaser.IntersectResult(); }
            output.result = ((circle1.radius + circle2.radius) * (circle1.radius + circle2.radius)) >= Collision.distanceSquared(circle1.x, circle1.y, circle2.x, circle2.y);
            return output;
        };
        Collision.circleToRectangle = /**
        * Checks if the Circle object intersects with the Rectangle and returns the result in an IntersectResult object.
        * @param circle The Circle object to check
        * @param rect The Rectangle object to check
        * @param [output] An optional IntersectResult object to store the intersection values in. One is created if none given.
        * @returns {IntersectResult=} An IntersectResult object containing the results of the intersection
        */
        function circleToRectangle(circle, rect, output) {
            if (typeof output === "undefined") { output = new Phaser.IntersectResult(); }
            var inflatedRect = rect.clone();
            inflatedRect.inflate(circle.radius, circle.radius);
            output.result = inflatedRect.contains(circle.x, circle.y);
            return output;
        };
        Collision.circleContainsPoint = /**
        * Checks if the Point object is contained within the Circle and returns the result in an IntersectResult object.
        * @param circle The Circle object to check
        * @param point A Point or MicroPoint object to check, or any object with x and y properties
        * @param [output] An optional IntersectResult object to store the intersection values in. One is created if none given.
        * @returns {IntersectResult=} An IntersectResult object containing the results of the intersection
        */
        function circleContainsPoint(circle, point, output) {
            if (typeof output === "undefined") { output = new Phaser.IntersectResult(); }
            output.result = circle.radius * circle.radius >= Collision.distanceSquared(circle.x, circle.y, point.x, point.y);
            return output;
        };
        Collision.prototype.overlap = /**
        * Checks for overlaps between two objects using the world QuadTree. Can be GameObject vs. GameObject, GameObject vs. Group or Group vs. Group.
        * Note: Does not take the objects scrollFactor into account. All overlaps are check in world space.
        * @param object1 The first GameObject or Group to check. If null the world.group is used.
        * @param object2 The second GameObject or Group to check.
        * @param notifyCallback A callback function that is called if the objects overlap. The two objects will be passed to this function in the same order in which you passed them to Collision.overlap.
        * @param processCallback A callback function that lets you perform additional checks against the two objects if they overlap. If this is set then notifyCallback will only be called if processCallback returns true.
        * @param context The context in which the callbacks will be called
        * @returns {boolean} true if the objects overlap, otherwise false.
        */
        function (object1, object2, notifyCallback, processCallback, context) {
            if (typeof object1 === "undefined") { object1 = null; }
            if (typeof object2 === "undefined") { object2 = null; }
            if (typeof notifyCallback === "undefined") { notifyCallback = null; }
            if (typeof processCallback === "undefined") { processCallback = null; }
            if (typeof context === "undefined") { context = null; }
            if(object1 == null) {
                object1 = this._game.world.group;
            }
            if(object2 == object1) {
                object2 = null;
            }
            Phaser.QuadTree.divisions = this._game.world.worldDivisions;
            var quadTree = new Phaser.QuadTree(this._game.world.bounds.x, this._game.world.bounds.y, this._game.world.bounds.width, this._game.world.bounds.height);
            quadTree.load(object1, object2, notifyCallback, processCallback, context);
            var result = quadTree.execute();
            quadTree.destroy();
            quadTree = null;
            return result;
        };
        Collision.separate = /**
        * The core Collision separation function used by Collision.overlap.
        * @param object1 The first GameObject to separate
        * @param object2 The second GameObject to separate
        * @returns {boolean} Returns true if the objects were separated, otherwise false.
        */
        function separate(object1, object2) {
            object1.collisionMask.update();
            object2.collisionMask.update();
            var separatedX = Collision.separateX(object1, object2);
            var separatedY = Collision.separateY(object1, object2);
            return separatedX || separatedY;
        };
        Collision.separateTile = /**
        * Collision resolution specifically for GameObjects vs. Tiles.
        * @param object The GameObject to separate
        * @param tile The Tile to separate
        * @returns {boolean} Whether the objects in fact touched and were separated
        */
        function separateTile(object, x, y, width, height, mass, collideLeft, collideRight, collideUp, collideDown, separateX, separateY) {
            object.collisionMask.update();
            var separatedX = Collision.separateTileX(object, x, y, width, height, mass, collideLeft, collideRight, separateX);
            var separatedY = Collision.separateTileY(object, x, y, width, height, mass, collideUp, collideDown, separateY);
            return separatedX || separatedY;
        };
        Collision.separateTileX = /**
        * Separates the two objects on their x axis
        * @param object The GameObject to separate
        * @param tile The Tile to separate
        * @returns {boolean} Whether the objects in fact touched and were separated along the X axis.
        */
        function separateTileX(object, x, y, width, height, mass, collideLeft, collideRight, separate) {
            //  Can't separate two immovable objects (tiles are always immovable)
            if(object.immovable) {
                return false;
            }
            //  First, get the object delta
            var overlap = 0;
            var objDelta = object.x - object.last.x;
            //var objDelta: number = object.collisionMask.deltaX;
            if(objDelta != 0) {
                //  Check if the X hulls actually overlap
                var objDeltaAbs = (objDelta > 0) ? objDelta : -objDelta;
                //var objDeltaAbs: number = object.collisionMask.deltaXAbs;
                var objBounds = new Phaser.Quad(object.x - ((objDelta > 0) ? objDelta : 0), object.last.y, object.width + ((objDelta > 0) ? objDelta : -objDelta), object.height);
                if((objBounds.x + objBounds.width > x) && (objBounds.x < x + width) && (objBounds.y + objBounds.height > y) && (objBounds.y < y + height)) {
                    var maxOverlap = objDeltaAbs + Collision.OVERLAP_BIAS;
                    //  If they did overlap (and can), figure out by how much and flip the corresponding flags
                    if(objDelta > 0) {
                        overlap = object.x + object.width - x;
                        if((overlap > maxOverlap) || !(object.allowCollisions & Collision.RIGHT) || collideLeft == false) {
                            overlap = 0;
                        } else {
                            object.touching |= Collision.RIGHT;
                        }
                    } else if(objDelta < 0) {
                        overlap = object.x - width - x;
                        if((-overlap > maxOverlap) || !(object.allowCollisions & Collision.LEFT) || collideRight == false) {
                            overlap = 0;
                        } else {
                            object.touching |= Collision.LEFT;
                        }
                    }
                }
            }
            //  Then adjust their positions and velocities accordingly (if there was any overlap)
            if(overlap != 0) {
                if(separate == true) {
                    //console.log('
                    object.x = object.x - overlap;
                    object.velocity.x = -(object.velocity.x * object.elasticity);
                }
                Collision.TILE_OVERLAP = true;
                return true;
            } else {
                return false;
            }
        };
        Collision.separateTileY = /**
        * Separates the two objects on their y axis
        * @param object The first GameObject to separate
        * @param tile The second GameObject to separate
        * @returns {boolean} Whether the objects in fact touched and were separated along the Y axis.
        */
        function separateTileY(object, x, y, width, height, mass, collideUp, collideDown, separate) {
            //  Can't separate two immovable objects (tiles are always immovable)
            if(object.immovable) {
                return false;
            }
            //  First, get the two object deltas
            var overlap = 0;
            var objDelta = object.y - object.last.y;
            if(objDelta != 0) {
                //  Check if the Y hulls actually overlap
                var objDeltaAbs = (objDelta > 0) ? objDelta : -objDelta;
                var objBounds = new Phaser.Quad(object.x, object.y - ((objDelta > 0) ? objDelta : 0), object.width, object.height + objDeltaAbs);
                if((objBounds.x + objBounds.width > x) && (objBounds.x < x + width) && (objBounds.y + objBounds.height > y) && (objBounds.y < y + height)) {
                    var maxOverlap = objDeltaAbs + Collision.OVERLAP_BIAS;
                    //  If they did overlap (and can), figure out by how much and flip the corresponding flags
                    if(objDelta > 0) {
                        overlap = object.y + object.height - y;
                        if((overlap > maxOverlap) || !(object.allowCollisions & Collision.DOWN) || collideUp == false) {
                            overlap = 0;
                        } else {
                            object.touching |= Collision.DOWN;
                        }
                    } else if(objDelta < 0) {
                        overlap = object.y - height - y;
                        if((-overlap > maxOverlap) || !(object.allowCollisions & Collision.UP) || collideDown == false) {
                            overlap = 0;
                        } else {
                            object.touching |= Collision.UP;
                        }
                    }
                }
            }
            // TODO - with super low velocities you get lots of stuttering, set some kind of base minimum here
            //  Then adjust their positions and velocities accordingly (if there was any overlap)
            if(overlap != 0) {
                if(separate == true) {
                    object.y = object.y - overlap;
                    object.velocity.y = -(object.velocity.y * object.elasticity);
                }
                Collision.TILE_OVERLAP = true;
                return true;
            } else {
                return false;
            }
        };
        Collision.NEWseparateTileX = /**
        * Separates the two objects on their x axis
        * @param object The GameObject to separate
        * @param tile The Tile to separate
        * @returns {boolean} Whether the objects in fact touched and were separated along the X axis.
        */
        function NEWseparateTileX(object, x, y, width, height, mass, collideLeft, collideRight, separate) {
            //  Can't separate two immovable objects (tiles are always immovable)
            if(object.immovable) {
                return false;
            }
            //  First, get the object delta
            var overlap = 0;
            if(object.collisionMask.deltaX != 0) {
                //  Check if the X hulls actually overlap
                //var objDeltaAbs: number = (objDelta > 0) ? objDelta : -objDelta;
                //var objBounds: Quad = new Quad(object.x - ((objDelta > 0) ? objDelta : 0), object.last.y, object.width + ((objDelta > 0) ? objDelta : -objDelta), object.height);
                //if ((objBounds.x + objBounds.width > x) && (objBounds.x < x + width) && (objBounds.y + objBounds.height > y) && (objBounds.y < y + height))
                if(object.collisionMask.intersectsRaw(x, x + width, y, y + height)) {
                    var maxOverlap = object.collisionMask.deltaXAbs + Collision.OVERLAP_BIAS;
                    //  If they did overlap (and can), figure out by how much and flip the corresponding flags
                    if(object.collisionMask.deltaX > 0) {
                        //overlap = object.x + object.width - x;
                        overlap = object.collisionMask.right - x;
                        if((overlap > maxOverlap) || !(object.allowCollisions & Collision.RIGHT) || collideLeft == false) {
                            overlap = 0;
                        } else {
                            object.touching |= Collision.RIGHT;
                        }
                    } else if(object.collisionMask.deltaX < 0) {
                        //overlap = object.x - width - x;
                        overlap = object.collisionMask.x - width - x;
                        if((-overlap > maxOverlap) || !(object.allowCollisions & Collision.LEFT) || collideRight == false) {
                            overlap = 0;
                        } else {
                            object.touching |= Collision.LEFT;
                        }
                    }
                }
            }
            //  Then adjust their positions and velocities accordingly (if there was any overlap)
            if(overlap != 0) {
                if(separate == true) {
                    object.x = object.x - overlap;
                    object.velocity.x = -(object.velocity.x * object.elasticity);
                }
                Collision.TILE_OVERLAP = true;
                return true;
            } else {
                return false;
            }
        };
        Collision.NEWseparateTileY = /**
        * Separates the two objects on their y axis
        * @param object The first GameObject to separate
        * @param tile The second GameObject to separate
        * @returns {boolean} Whether the objects in fact touched and were separated along the Y axis.
        */
        function NEWseparateTileY(object, x, y, width, height, mass, collideUp, collideDown, separate) {
            //  Can't separate two immovable objects (tiles are always immovable)
            if(object.immovable) {
                return false;
            }
            //  First, get the two object deltas
            var overlap = 0;
            //var objDelta: number = object.y - object.last.y;
            if(object.collisionMask.deltaY != 0) {
                //  Check if the Y hulls actually overlap
                //var objDeltaAbs: number = (objDelta > 0) ? objDelta : -objDelta;
                //var objBounds: Quad = new Quad(object.x, object.y - ((objDelta > 0) ? objDelta : 0), object.width, object.height + objDeltaAbs);
                //if ((objBounds.x + objBounds.width > x) && (objBounds.x < x + width) && (objBounds.y + objBounds.height > y) && (objBounds.y < y + height))
                if(object.collisionMask.intersectsRaw(x, x + width, y, y + height)) {
                    //var maxOverlap: number = objDeltaAbs + Collision.OVERLAP_BIAS;
                    var maxOverlap = object.collisionMask.deltaYAbs + Collision.OVERLAP_BIAS;
                    //  If they did overlap (and can), figure out by how much and flip the corresponding flags
                    if(object.collisionMask.deltaY > 0) {
                        //overlap = object.y + object.height - y;
                        overlap = object.collisionMask.bottom - y;
                        if((overlap > maxOverlap) || !(object.allowCollisions & Collision.DOWN) || collideUp == false) {
                            overlap = 0;
                        } else {
                            object.touching |= Collision.DOWN;
                        }
                    } else if(object.collisionMask.deltaY < 0) {
                        //overlap = object.y - height - y;
                        overlap = object.collisionMask.y - height - y;
                        if((-overlap > maxOverlap) || !(object.allowCollisions & Collision.UP) || collideDown == false) {
                            overlap = 0;
                        } else {
                            object.touching |= Collision.UP;
                        }
                    }
                }
            }
            // TODO - with super low velocities you get lots of stuttering, set some kind of base minimum here
            //  Then adjust their positions and velocities accordingly (if there was any overlap)
            if(overlap != 0) {
                if(separate == true) {
                    object.y = object.y - overlap;
                    object.velocity.y = -(object.velocity.y * object.elasticity);
                }
                Collision.TILE_OVERLAP = true;
                return true;
            } else {
                return false;
            }
        };
        Collision.separateX = /**
        * Separates the two objects on their x axis
        * @param object1 The first GameObject to separate
        * @param object2 The second GameObject to separate
        * @returns {boolean} Whether the objects in fact touched and were separated along the X axis.
        */
        function separateX(object1, object2) {
            //  Can't separate two immovable objects
            if(object1.immovable && object2.immovable) {
                return false;
            }
            //  First, get the two object deltas
            var overlap = 0;
            if(object1.collisionMask.deltaX != object2.collisionMask.deltaX) {
                if(object1.collisionMask.intersects(object2.collisionMask)) {
                    var maxOverlap = object1.collisionMask.deltaXAbs + object2.collisionMask.deltaXAbs + Collision.OVERLAP_BIAS;
                    //  If they did overlap (and can), figure out by how much and flip the corresponding flags
                    if(object1.collisionMask.deltaX > object2.collisionMask.deltaX) {
                        overlap = object1.collisionMask.right - object2.collisionMask.x;
                        if((overlap > maxOverlap) || !(object1.allowCollisions & Collision.RIGHT) || !(object2.allowCollisions & Collision.LEFT)) {
                            overlap = 0;
                        } else {
                            object1.touching |= Collision.RIGHT;
                            object2.touching |= Collision.LEFT;
                        }
                    } else if(object1.collisionMask.deltaX < object2.collisionMask.deltaX) {
                        overlap = object1.collisionMask.x - object2.collisionMask.width - object2.collisionMask.x;
                        if((-overlap > maxOverlap) || !(object1.allowCollisions & Collision.LEFT) || !(object2.allowCollisions & Collision.RIGHT)) {
                            overlap = 0;
                        } else {
                            object1.touching |= Collision.LEFT;
                            object2.touching |= Collision.RIGHT;
                        }
                    }
                }
            }
            //  Then adjust their positions and velocities accordingly (if there was any overlap)
            if(overlap != 0) {
                var obj1Velocity = object1.velocity.x;
                var obj2Velocity = object2.velocity.x;
                if(!object1.immovable && !object2.immovable) {
                    overlap *= 0.5;
                    object1.x = object1.x - overlap;
                    object2.x += overlap;
                    var obj1NewVelocity = Math.sqrt((obj2Velocity * obj2Velocity * object2.mass) / object1.mass) * ((obj2Velocity > 0) ? 1 : -1);
                    var obj2NewVelocity = Math.sqrt((obj1Velocity * obj1Velocity * object1.mass) / object2.mass) * ((obj1Velocity > 0) ? 1 : -1);
                    var average = (obj1NewVelocity + obj2NewVelocity) * 0.5;
                    obj1NewVelocity -= average;
                    obj2NewVelocity -= average;
                    object1.velocity.x = average + obj1NewVelocity * object1.elasticity;
                    object2.velocity.x = average + obj2NewVelocity * object2.elasticity;
                } else if(!object1.immovable) {
                    object1.x = object1.x - overlap;
                    object1.velocity.x = obj2Velocity - obj1Velocity * object1.elasticity;
                } else if(!object2.immovable) {
                    object2.x += overlap;
                    object2.velocity.x = obj1Velocity - obj2Velocity * object2.elasticity;
                }
                return true;
            } else {
                return false;
            }
        };
        Collision.separateY = /**
        * Separates the two objects on their y axis
        * @param object1 The first GameObject to separate
        * @param object2 The second GameObject to separate
        * @returns {boolean} Whether the objects in fact touched and were separated along the Y axis.
        */
        function separateY(object1, object2) {
            //  Can't separate two immovable objects
            if(object1.immovable && object2.immovable) {
                return false;
            }
            //  First, get the two object deltas
            var overlap = 0;
            if(object1.collisionMask.deltaY != object2.collisionMask.deltaY) {
                if(object1.collisionMask.intersects(object2.collisionMask)) {
                    //  This is the only place to use the DeltaAbs values
                    var maxOverlap = object1.collisionMask.deltaYAbs + object2.collisionMask.deltaYAbs + Collision.OVERLAP_BIAS;
                    //  If they did overlap (and can), figure out by how much and flip the corresponding flags
                    if(object1.collisionMask.deltaY > object2.collisionMask.deltaY) {
                        overlap = object1.collisionMask.bottom - object2.collisionMask.y;
                        if((overlap > maxOverlap) || !(object1.allowCollisions & Collision.DOWN) || !(object2.allowCollisions & Collision.UP)) {
                            overlap = 0;
                        } else {
                            object1.touching |= Collision.DOWN;
                            object2.touching |= Collision.UP;
                        }
                    } else if(object1.collisionMask.deltaY < object2.collisionMask.deltaY) {
                        overlap = object1.collisionMask.y - object2.collisionMask.height - object2.collisionMask.y;
                        if((-overlap > maxOverlap) || !(object1.allowCollisions & Collision.UP) || !(object2.allowCollisions & Collision.DOWN)) {
                            overlap = 0;
                        } else {
                            object1.touching |= Collision.UP;
                            object2.touching |= Collision.DOWN;
                        }
                    }
                }
            }
            //  Then adjust their positions and velocities accordingly (if there was any overlap)
            if(overlap != 0) {
                var obj1Velocity = object1.velocity.y;
                var obj2Velocity = object2.velocity.y;
                if(!object1.immovable && !object2.immovable) {
                    overlap *= 0.5;
                    object1.y = object1.y - overlap;
                    object2.y += overlap;
                    var obj1NewVelocity = Math.sqrt((obj2Velocity * obj2Velocity * object2.mass) / object1.mass) * ((obj2Velocity > 0) ? 1 : -1);
                    var obj2NewVelocity = Math.sqrt((obj1Velocity * obj1Velocity * object1.mass) / object2.mass) * ((obj1Velocity > 0) ? 1 : -1);
                    var average = (obj1NewVelocity + obj2NewVelocity) * 0.5;
                    obj1NewVelocity -= average;
                    obj2NewVelocity -= average;
                    object1.velocity.y = average + obj1NewVelocity * object1.elasticity;
                    object2.velocity.y = average + obj2NewVelocity * object2.elasticity;
                } else if(!object1.immovable) {
                    object1.y = object1.y - overlap;
                    object1.velocity.y = obj2Velocity - obj1Velocity * object1.elasticity;
                    //  This is special case code that handles things like horizontal moving platforms you can ride
                    if(object2.active && object2.moves && (object1.collisionMask.deltaY > object2.collisionMask.deltaY)) {
                        object1.x += object2.x - object2.last.x;
                    }
                } else if(!object2.immovable) {
                    object2.y += overlap;
                    object2.velocity.y = obj1Velocity - obj2Velocity * object2.elasticity;
                    //  This is special case code that handles things like horizontal moving platforms you can ride
                    if(object1.active && object1.moves && (object1.collisionMask.deltaY < object2.collisionMask.deltaY)) {
                        object2.x += object1.x - object1.last.x;
                    }
                }
                return true;
            } else {
                return false;
            }
        };
        Collision.distance = /**
        * Returns the distance between the two given coordinates.
        * @param x1 The X value of the first coordinate
        * @param y1 The Y value of the first coordinate
        * @param x2 The X value of the second coordinate
        * @param y2 The Y value of the second coordinate
        * @returns {number} The distance between the two coordinates
        */
        function distance(x1, y1, x2, y2) {
            return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
        };
        Collision.distanceSquared = /**
        * Returns the distanced squared between the two given coordinates.
        * @param x1 The X value of the first coordinate
        * @param y1 The Y value of the first coordinate
        * @param x2 The X value of the second coordinate
        * @param y2 The Y value of the second coordinate
        * @returns {number} The distance between the two coordinates
        */
        function distanceSquared(x1, y1, x2, y2) {
            return (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
        };
        Collision.flattenPointsOn = // SAT
        /**
        * Flattens the specified array of points onto a unit vector axis,
        * resulting in a one dimensional range of the minimum and
        * maximum value on that axis.
        *
        * @param {Array.<Vector>} points The points to flatten.
        * @param {Vector} normal The unit vector axis to flatten on.
        * @param {Array.<number>} result An array.  After calling this function,
        *   result[0] will be the minimum value,
        *   result[1] will be the maximum value.
        */
        function flattenPointsOn(points, normal, result) {
            var min = Number.MAX_VALUE;
            var max = -Number.MAX_VALUE;
            var len = points.length;
            for(var i = 0; i < len; i++) {
                // Get the magnitude of the projection of the point onto the normal
                var dot = points[i].dot(normal);
                if(dot < min) {
                    min = dot;
                }
                if(dot > max) {
                    max = dot;
                }
            }
            result[0] = min;
            result[1] = max;
        };
        Collision.isSeparatingAxis = /**
        * Check whether two convex clockwise polygons are separated by the specified
        * axis (must be a unit vector).
        *
        * @param {Vector} aPos The position of the first polygon.
        * @param {Vector} bPos The position of the second polygon.
        * @param {Array.<Vector>} aPoints The points in the first polygon.
        * @param {Array.<Vector>} bPoints The points in the second polygon.
        * @param {Vector} axis The axis (unit sized) to test against.  The points of both polygons
        *   will be projected onto this axis.
        * @param {Response=} response A Response object (optional) which will be populated
        *   if the axis is not a separating axis.
        * @return {boolean} true if it is a separating axis, false otherwise.  If false,
        *   and a response is passed in, information about how much overlap and
        *   the direction of the overlap will be populated.
        */
        function isSeparatingAxis(aPos, bPos, aPoints, bPoints, axis, response) {
            if (typeof response === "undefined") { response = null; }
            var rangeA = Collision.T_ARRAYS.pop();
            var rangeB = Collision.T_ARRAYS.pop();
            // Get the magnitude of the offset between the two polygons
            var offsetV = Collision.T_VECTORS.pop().copyFrom(bPos).sub(aPos);
            var projectedOffset = offsetV.dot(axis);
            // Project the polygons onto the axis.
            Collision.flattenPointsOn(aPoints, axis, rangeA);
            Collision.flattenPointsOn(bPoints, axis, rangeB);
            // Move B's range to its position relative to A.
            rangeB[0] += projectedOffset;
            rangeB[1] += projectedOffset;
            // Check if there is a gap. If there is, this is a separating axis and we can stop
            if(rangeA[0] > rangeB[1] || rangeB[0] > rangeA[1]) {
                Collision.T_VECTORS.push(offsetV);
                Collision.T_ARRAYS.push(rangeA);
                Collision.T_ARRAYS.push(rangeB);
                return true;
            }
            // If we're calculating a response, calculate the overlap.
            if(response) {
                var overlap = 0;
                // A starts further left than B
                if(rangeA[0] < rangeB[0]) {
                    response.aInB = false;
                    // A ends before B does. We have to pull A out of B
                    if(rangeA[1] < rangeB[1]) {
                        overlap = rangeA[1] - rangeB[0];
                        response.bInA = false;
                        // B is fully inside A.  Pick the shortest way out.
                                            } else {
                        var option1 = rangeA[1] - rangeB[0];
                        var option2 = rangeB[1] - rangeA[0];
                        overlap = option1 < option2 ? option1 : -option2;
                    }
                    // B starts further left than A
                                    } else {
                    response.bInA = false;
                    // B ends before A ends. We have to push A out of B
                    if(rangeA[1] > rangeB[1]) {
                        overlap = rangeA[0] - rangeB[1];
                        response.aInB = false;
                        // A is fully inside B.  Pick the shortest way out.
                                            } else {
                        var option1 = rangeA[1] - rangeB[0];
                        var option2 = rangeB[1] - rangeA[0];
                        overlap = option1 < option2 ? option1 : -option2;
                    }
                }
                // If this is the smallest amount of overlap we've seen so far, set it as the minimum overlap.
                var absOverlap = Math.abs(overlap);
                if(absOverlap < response.overlap) {
                    response.overlap = absOverlap;
                    response.overlapN.copyFrom(axis);
                    if(overlap < 0) {
                        response.overlapN.reverse();
                    }
                }
            }
            Collision.T_VECTORS.push(offsetV);
            Collision.T_ARRAYS.push(rangeA);
            Collision.T_ARRAYS.push(rangeB);
            return false;
        };
        Collision.LEFT_VORNOI_REGION = -1;
        Collision.MIDDLE_VORNOI_REGION = 0;
        Collision.RIGHT_VORNOI_REGION = 1;
        Collision.vornoiRegion = /**
        * Calculates which Vornoi region a point is on a line segment.
        * It is assumed that both the line and the point are relative to (0, 0)
        *
        *             |       (0)      |
        *      (-1)  [0]--------------[1]  (1)
        *             |       (0)      |
        *
        * @param {Vector} line The line segment.
        * @param {Vector} point The point.
        * @return  {number} LEFT_VORNOI_REGION (-1) if it is the left region,
        *          MIDDLE_VORNOI_REGION (0) if it is the middle region,
        *          RIGHT_VORNOI_REGION (1) if it is the right region.
        */
        function vornoiRegion(line, point) {
            var len2 = line.length2();
            var dp = point.dot(line);
            if(dp < 0) {
                return Collision.LEFT_VORNOI_REGION;
            } else if(dp > len2) {
                return Collision.RIGHT_VORNOI_REGION;
            } else {
                return Collision.MIDDLE_VORNOI_REGION;
            }
        };
        Collision.testCircleCircle = /**
        * Check if two circles intersect.
        *
        * @param {Circle} a The first circle.
        * @param {Circle} b The second circle.
        * @param {Response=} response Response object (optional) that will be populated if
        *   the circles intersect.
        * @return {boolean} true if the circles intersect, false if they don't.
        */
        function testCircleCircle(a, b, response) {
            if (typeof response === "undefined") { response = null; }
            var differenceV = Collision.T_VECTORS.pop().copyFrom(b.pos).sub(a.pos);
            var totalRadius = a.radius + b.radius;
            var totalRadiusSq = totalRadius * totalRadius;
            var distanceSq = differenceV.length2();
            if(distanceSq > totalRadiusSq) {
                // They do not intersect
                Collision.T_VECTORS.push(differenceV);
                return false;
            }
            // They intersect.  If we're calculating a response, calculate the overlap.
            if(response) {
                var dist = Math.sqrt(distanceSq);
                response.a = a;
                response.b = b;
                response.overlap = totalRadius - dist;
                response.overlapN.copyFrom(differenceV.normalize());
                response.overlapV.copyFrom(differenceV).scale(response.overlap);
                response.aInB = a.radius <= b.radius && dist <= b.radius - a.radius;
                response.bInA = b.radius <= a.radius && dist <= a.radius - b.radius;
            }
            Collision.T_VECTORS.push(differenceV);
            return true;
        };
        Collision.testPolygonCircle = /**
        * Check if a polygon and a circle intersect.
        *
        * @param {Polygon} polygon The polygon.
        * @param {Circle} circle The circle.
        * @param {Response=} response Response object (optional) that will be populated if
        *   they interset.
        * @return {boolean} true if they intersect, false if they don't.
        */
        function testPolygonCircle(polygon, circle, response) {
            if (typeof response === "undefined") { response = null; }
            var circlePos = Collision.T_VECTORS.pop().copyFrom(circle.pos).sub(polygon.pos);
            var radius = circle.radius;
            var radius2 = radius * radius;
            var points = polygon.points;
            var len = points.length;
            var edge = Collision.T_VECTORS.pop();
            var point = Collision.T_VECTORS.pop();
            // For each edge in the polygon
            for(var i = 0; i < len; i++) {
                var next = i === len - 1 ? 0 : i + 1;
                var prev = i === 0 ? len - 1 : i - 1;
                var overlap = 0;
                var overlapN = null;
                // Get the edge
                edge.copyFrom(polygon.edges[i]);
                // Calculate the center of the cirble relative to the starting point of the edge
                point.copyFrom(circlePos).sub(points[i]);
                // If the distance between the center of the circle and the point
                // is bigger than the radius, the polygon is definitely not fully in
                // the circle.
                if(response && point.length2() > radius2) {
                    response.aInB = false;
                }
                // Calculate which Vornoi region the center of the circle is in.
                var region = Collision.vornoiRegion(edge, point);
                if(region === Collision.LEFT_VORNOI_REGION) {
                    // Need to make sure we're in the RIGHT_VORNOI_REGION of the previous edge.
                    edge.copyFrom(polygon.edges[prev]);
                    // Calculate the center of the circle relative the starting point of the previous edge
                    var point2 = Collision.T_VECTORS.pop().copyFrom(circlePos).sub(points[prev]);
                    region = Collision.vornoiRegion(edge, point2);
                    if(region === Collision.RIGHT_VORNOI_REGION) {
                        // It's in the region we want.  Check if the circle intersects the point.
                        var dist = point.length2();
                        if(dist > radius) {
                            // No intersection
                            Collision.T_VECTORS.push(circlePos);
                            Collision.T_VECTORS.push(edge);
                            Collision.T_VECTORS.push(point);
                            Collision.T_VECTORS.push(point2);
                            return false;
                        } else if(response) {
                            // It intersects, calculate the overlap
                            response.bInA = false;
                            overlapN = point.normalize();
                            overlap = radius - dist;
                        }
                    }
                    Collision.T_VECTORS.push(point2);
                } else if(region === Collision.RIGHT_VORNOI_REGION) {
                    // Need to make sure we're in the left region on the next edge
                    edge.copyFrom(polygon.edges[next]);
                    // Calculate the center of the circle relative to the starting point of the next edge
                    point.copyFrom(circlePos).sub(points[next]);
                    region = Collision.vornoiRegion(edge, point);
                    if(region === Collision.LEFT_VORNOI_REGION) {
                        // It's in the region we want.  Check if the circle intersects the point.
                        var dist = point.length2();
                        if(dist > radius) {
                            // No intersection
                            Collision.T_VECTORS.push(circlePos);
                            Collision.T_VECTORS.push(edge);
                            Collision.T_VECTORS.push(point);
                            return false;
                        } else if(response) {
                            // It intersects, calculate the overlap
                            response.bInA = false;
                            overlapN = point.normalize();
                            overlap = radius - dist;
                        }
                    }
                    // MIDDLE_VORNOI_REGION
                                    } else {
                    // Need to check if the circle is intersecting the edge,
                    // Change the edge into its "edge normal".
                    var normal = edge.perp().normalize();
                    // Find the perpendicular distance between the center of the
                    // circle and the edge.
                    var dist = point.dot(normal);
                    var distAbs = Math.abs(dist);
                    // If the circle is on the outside of the edge, there is no intersection
                    if(dist > 0 && distAbs > radius) {
                        Collision.T_VECTORS.push(circlePos);
                        Collision.T_VECTORS.push(normal);
                        Collision.T_VECTORS.push(point);
                        return false;
                    } else if(response) {
                        // It intersects, calculate the overlap.
                        overlapN = normal;
                        overlap = radius - dist;
                        // If the center of the circle is on the outside of the edge, or part of the
                        // circle is on the outside, the circle is not fully inside the polygon.
                        if(dist >= 0 || overlap < 2 * radius) {
                            response.bInA = false;
                        }
                    }
                }
                // If this is the smallest overlap we've seen, keep it.
                // (overlapN may be null if the circle was in the wrong Vornoi region)
                if(overlapN && response && Math.abs(overlap) < Math.abs(response.overlap)) {
                    response.overlap = overlap;
                    response.overlapN.copyFrom(overlapN);
                }
            }
            // Calculate the final overlap vector - based on the smallest overlap.
            if(response) {
                response.a = polygon;
                response.b = circle;
                response.overlapV.copyFrom(response.overlapN).scale(response.overlap);
            }
            Collision.T_VECTORS.push(circlePos);
            Collision.T_VECTORS.push(edge);
            Collision.T_VECTORS.push(point);
            return true;
        };
        Collision.testCirclePolygon = /**
        * Check if a circle and a polygon intersect.
        *
        * NOTE: This runs slightly slower than polygonCircle as it just
        * runs polygonCircle and reverses everything at the end.
        *
        * @param {Circle} circle The circle.
        * @param {Polygon} polygon The polygon.
        * @param {Response=} response Response object (optional) that will be populated if
        *   they interset.
        * @return {boolean} true if they intersect, false if they don't.
        */
        function testCirclePolygon(circle, polygon, response) {
            if (typeof response === "undefined") { response = null; }
            var result = Collision.testPolygonCircle(polygon, circle, response);
            if(result && response) {
                // Swap A and B in the response.
                var a = response.a;
                var aInB = response.aInB;
                response.overlapN.reverse();
                response.overlapV.reverse();
                response.a = response.b;
                response.b = a;
                response.aInB = response.bInA;
                response.bInA = aInB;
            }
            return result;
        };
        Collision.testPolygonPolygon = /**
        * Checks whether two convex, clockwise polygons intersect.
        *
        * @param {Polygon} a The first polygon.
        * @param {Polygon} b The second polygon.
        * @param {Response=} response Response object (optional) that will be populated if
        *   they interset.
        * @return {boolean} true if they intersect, false if they don't.
        */
        function testPolygonPolygon(a, b, response) {
            if (typeof response === "undefined") { response = null; }
            var aPoints = a.points;
            var aLen = aPoints.length;
            var bPoints = b.points;
            var bLen = bPoints.length;
            // If any of the edge normals of A is a separating axis, no intersection.
            for(var i = 0; i < aLen; i++) {
                if(Collision.isSeparatingAxis(a.pos, b.pos, aPoints, bPoints, a.normals[i], response)) {
                    return false;
                }
            }
            // If any of the edge normals of B is a separating axis, no intersection.
            for(var i = 0; i < bLen; i++) {
                if(Collision.isSeparatingAxis(a.pos, b.pos, aPoints, bPoints, b.normals[i], response)) {
                    return false;
                }
            }
            // Since none of the edge normals of A or B are a separating axis, there is an intersection
            // and we've already calculated the smallest overlap (in isSeparatingAxis).  Calculate the
            // final overlap vector.
            if(response) {
                response.a = a;
                response.b = b;
                response.overlapV.copyFrom(response.overlapN).scale(response.overlap);
            }
            return true;
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
        /**
        * DynamicTexture constructor
        * Create a new <code>DynamicTexture</code>.
        *
        * @param game {Phaser.Game} Current game instance.
        * @param width {number} Init width of this texture.
        * @param height {number} Init height of this texture.
        */
        function DynamicTexture(game, width, height) {
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
        DynamicTexture.prototype.getPixel = /**
        * Get a color of a specific pixel.
        * @param x {number} X position of the pixel in this texture.
        * @param y {number} Y position of the pixel in this texture.
        * @return {number} A native color value integer (format: 0xRRGGBB)
        */
        function (x, y) {
            //r = imageData.data[0];
            //g = imageData.data[1];
            //b = imageData.data[2];
            //a = imageData.data[3];
            var imageData = this.context.getImageData(x, y, 1, 1);
            return this.getColor(imageData.data[0], imageData.data[1], imageData.data[2]);
        };
        DynamicTexture.prototype.getPixel32 = /**
        * Get a color of a specific pixel (including alpha value).
        * @param x {number} X position of the pixel in this texture.
        * @param y {number} Y position of the pixel in this texture.
        * @return  A native color value integer (format: 0xAARRGGBB)
        */
        function (x, y) {
            var imageData = this.context.getImageData(x, y, 1, 1);
            return this.getColor32(imageData.data[3], imageData.data[0], imageData.data[1], imageData.data[2]);
        };
        DynamicTexture.prototype.getPixels = /**
        * Get pixels in array in a specific rectangle.
        * @param rect {Rectangle} The specific rectangle.
        * @returns {array} CanvasPixelArray.
        */
        function (rect) {
            return this.context.getImageData(rect.x, rect.y, rect.width, rect.height);
        };
        DynamicTexture.prototype.setPixel = /**
        * Set color of a specific pixel.
        * @param x {number} X position of the target pixel.
        * @param y {number} Y position of the target pixel.
        * @param color {number} Native integer with color value. (format: 0xRRGGBB)
        */
        function (x, y, color) {
            this.context.fillStyle = color;
            this.context.fillRect(x, y, 1, 1);
        };
        DynamicTexture.prototype.setPixel32 = /**
        * Set color (with alpha) of a specific pixel.
        * @param x {number} X position of the target pixel.
        * @param y {number} Y position of the target pixel.
        * @param color {number} Native integer with color value. (format: 0xAARRGGBB)
        */
        function (x, y, color) {
            this.context.fillStyle = color;
            this.context.fillRect(x, y, 1, 1);
        };
        DynamicTexture.prototype.setPixels = /**
        * Set image data to a specific rectangle.
        * @param rect {Rectangle} Target rectangle.
        * @param input {object} Source image data.
        */
        function (rect, input) {
            this.context.putImageData(input, rect.x, rect.y);
        };
        DynamicTexture.prototype.fillRect = /**
        * Fill a given rectangle with specific color.
        * @param rect {Rectangle} Target rectangle you want to fill.
        * @param color {number} A native number with color value. (format: 0xRRGGBB)
        */
        function (rect, color) {
            this.context.fillStyle = color;
            this.context.fillRect(rect.x, rect.y, rect.width, rect.height);
        };
        DynamicTexture.prototype.pasteImage = /**
        *
        */
        function (key, frame, destX, destY, destWidth, destHeight) {
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
                this.context.drawImage(texture, //  Source Image
                this._sx, //  Source X (location within the source image)
                this._sy, //  Source Y
                this._sw, //  Source Width
                this._sh, //  Source Height
                this._dx, //  Destination X (where on the canvas it'll be drawn)
                this._dy, //  Destination Y
                this._dw, //  Destination Width (always same as Source Width unless scaled)
                this._dh);
                //  Destination Height (always same as Source Height unless scaled)
                            }
        };
        DynamicTexture.prototype.copyPixels = //  TODO - Add in support for: alphaBitmapData: BitmapData = null, alphaPoint: Point = null, mergeAlpha: bool = false
        /**
        * Copy pixel from another DynamicTexture to this texture.
        * @param sourceTexture {DynamicTexture} Source texture object.
        * @param sourceRect {Rectangle} The specific region rectangle to be copied to this in the source.
        * @param destPoint {Point} Top-left point the target image data will be paste at.
        */
        function (sourceTexture, sourceRect, destPoint) {
            //  Swap for drawImage if the sourceRect is the same size as the sourceTexture to avoid a costly getImageData call
            if(sourceRect.equals(this.bounds) == true) {
                this.context.drawImage(sourceTexture.canvas, destPoint.x, destPoint.y);
            } else {
                this.context.putImageData(sourceTexture.getPixels(sourceRect), destPoint.x, destPoint.y);
            }
        };
        DynamicTexture.prototype.assignCanvasToGameObjects = /**
        * Given an array of GameObjects it will update each of them so that their canvas/contexts reference this DynamicTexture
        * @param objects {Array} An array of GameObjects, or objects that inherit from it such as Sprites
        */
        function (objects) {
            for(var i = 0; i < objects.length; i++) {
                objects[i].canvas = this.canvas;
                objects[i].context = this.context;
            }
        };
        DynamicTexture.prototype.clear = /**
        * Clear the whole canvas.
        */
        function () {
            this.context.clearRect(0, 0, this.bounds.width, this.bounds.height);
        };
        DynamicTexture.prototype.render = /**
        * Renders this DynamicTexture to the Stage at the given x/y coordinates
        *
        * @param x {number} The X coordinate to render on the stage to (given in screen coordinates, not world)
        * @param y {number} The Y coordinate to render on the stage to (given in screen coordinates, not world)
        */
        function (x, y) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            this._game.stage.context.drawImage(this.canvas, x, y);
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
        * @param alpha {number} The Alpha value (between 0 and 255)
        * @param red   {number} The Red channel value (between 0 and 255)
        * @param green {number} The Green channel value (between 0 and 255)
        * @param blue  {number} The Blue channel value (between 0 and 255)
        *
        * @return  A native color value integer (format: 0xAARRGGBB)
        */
        function (alpha, red, green, blue) {
            return alpha << 24 | red << 16 | green << 8 | blue;
        };
        DynamicTexture.prototype.getColor = /**
        * Given 3 color values this will return an integer representation of it
        *
        * @param red   {number} The Red channel value (between 0 and 255)
        * @param green {number} The Green channel value (between 0 and 255)
        * @param blue  {number} The Blue channel value (between 0 and 255)
        *
        * @return  A native color value integer (format: 0xRRGGBB)
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
        * @param [start] - optional starting offset for gap
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
        * @param [start] - optional starting offset for gap
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
        * @param [start] - optional starting offset for gap
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
        *
        * @param	objects		An array of objects.
        * @param	startIndex	Optional offset off the front of the array. Default value is 0, or the beginning of the array.
        * @param	length		Optional restriction on the number of values you want to randomly select from.
        *
        * @return	The random object that was selected.
        */
        function (objects, startIndex, length) {
            if (typeof startIndex === "undefined") { startIndex = 0; }
            if (typeof length === "undefined") { length = 0; }
            if(objects != null) {
                var l = length;
                if((l == 0) || (l > objects.length - startIndex)) {
                    l = objects.length - startIndex;
                }
                if(l > 0) {
                    return objects[startIndex + Math.floor(Math.random() * l)];
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
        GameMath.prototype.shiftSinTable = /**
        * Shifts through the sin table data by one value and returns it.
        * This effectively moves the position of the data from the start to the end of the table.
        * @return	The sin value.
        */
        function () {
            if(this.sinTable) {
                var s = this.sinTable.shift();
                this.sinTable.push(s);
                return s;
            }
        };
        GameMath.prototype.shiftCosTable = /**
        * Shifts through the cos table data by one value and returns it.
        * This effectively moves the position of the data from the start to the end of the table.
        * @return	The cos value.
        */
        function () {
            if(this.cosTable) {
                var s = this.cosTable.shift();
                this.cosTable.push(s);
                return s;
            }
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
        GameMath.prototype.shuffleArray = /**
        * Shuffles the data in the given array into a new order
        * @param array The array to shuffle
        * @return The array
        */
        function (array) {
            for(var i = array.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var temp = array[i];
                array[i] = array[j];
                array[j] = temp;
            }
            return array;
        };
        GameMath.distanceBetween = /**
        * Returns the distance from this Point object to the given Point object.
        * @method distanceFrom
        * @param {Point} target - The destination Point object.
        * @param {Boolean} round - Round the distance to the nearest integer (default false)
        * @return {Number} The distance between this Point object and the destination Point object.
        **/
        function distanceBetween(x1, y1, x2, y2) {
            var dx = x1 - x2;
            var dy = y1 - y2;
            return Math.sqrt(dx * dx + dy * dy);
        };
        GameMath.prototype.rotatePoint = /**
        * Rotates the point around the x/y coordinates given to the desired angle and distance
        * @param point {Object} Any object with exposed x and y properties
        * @param x {number} The x coordinate of the anchor point
        * @param y {number} The y coordinate of the anchor point
        * @param {Number} angle The angle in radians (unless asDegrees is true) to return the point from.
        * @param {Boolean} asDegrees Is the given angle in radians (false) or degrees (true)?
        * @param {Number} distance An optional distance constraint between the point and the anchor
        * @return The modified point object
        */
        function (point, x1, y1, angle, asDegrees, distance) {
            if (typeof asDegrees === "undefined") { asDegrees = false; }
            if (typeof distance === "undefined") { distance = null; }
            if(asDegrees) {
                angle = angle * GameMath.DEG_TO_RAD;
            }
            //  Get distance from origin to the point
            if(distance === null) {
                distance = Math.sqrt(((x1 - point.x) * (x1 - point.x)) + ((y1 - point.y) * (y1 - point.y)));
            }
            point.x = x1 + distance * Math.cos(angle);
            point.y = y1 + distance * Math.sin(angle);
            return point;
        };
        return GameMath;
    })();
    Phaser.GameMath = GameMath;    
})(Phaser || (Phaser = {}));
/// <reference path="Game.ts" />
/**
* Phaser - GameObjectFactory
*
* A quick way to create new world objects and add existing objects to the current world.
*/
var Phaser;
(function (Phaser) {
    var GameObjectFactory = (function () {
        /**
        * GameObjectFactory constructor
        * @param game {Game} A reference to the current Game.
        */
        function GameObjectFactory(game) {
            this._game = game;
            this._world = this._game.world;
        }
        GameObjectFactory.prototype.camera = /**
        * Create a new camera with specific position and size.
        *
        * @param x {number} X position of the new camera.
        * @param y {number} Y position of the new camera.
        * @param width {number} Width of the new camera.
        * @param height {number} Height of the new camera.
        * @returns {Camera} The newly created camera object.
        */
        function (x, y, width, height) {
            return this._world.createCamera(x, y, width, height);
        };
        GameObjectFactory.prototype.geomSprite = /**
        * Create a new GeomSprite with specific position.
        *
        * @param x {number} X position of the new geom sprite.
        * @param y {number} Y position of the new geom sprite.
        * @returns {GeomSprite} The newly created geom sprite object.
        */
        function (x, y) {
            return this._world.createGeomSprite(x, y);
        };
        GameObjectFactory.prototype.sprite = /**
        * Create a new Sprite with specific position and sprite sheet key.
        *
        * @param x {number} X position of the new sprite.
        * @param y {number} Y position of the new sprite.
        * @param key {string} Optional, key for the sprite sheet you want it to use.
        * @returns {Sprite} The newly created sprite object.
        */
        function (x, y, key) {
            if (typeof key === "undefined") { key = ''; }
            return this._world.createSprite(x, y, key);
        };
        GameObjectFactory.prototype.dynamicTexture = /**
        * Create a new DynamicTexture with specific size.
        *
        * @param width {number} Width of the texture.
        * @param height {number} Height of the texture.
        * @returns {DynamicTexture} The newly created dynamic texture object.
        */
        function (width, height) {
            return this._world.createDynamicTexture(width, height);
        };
        GameObjectFactory.prototype.group = /**
        * Create a new object container.
        *
        * @param maxSize {number} Optional, capacity of this group.
        * @returns {Group} The newly created group.
        */
        function (maxSize) {
            if (typeof maxSize === "undefined") { maxSize = 0; }
            return this._world.createGroup(maxSize);
        };
        GameObjectFactory.prototype.particle = /**
        * Create a new Particle.
        *
        * @return {Particle} The newly created particle object.
        */
        function () {
            return this._world.createParticle();
        };
        GameObjectFactory.prototype.emitter = /**
        * Create a new Emitter.
        *
        * @param x {number} Optional, x position of the emitter.
        * @param y {number} Optional, y position of the emitter.
        * @param size {number} Optional, size of this emitter.
        * @return {Emitter} The newly created emitter object.
        */
        function (x, y, size) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            if (typeof size === "undefined") { size = 0; }
            return this._world.createEmitter(x, y, size);
        };
        GameObjectFactory.prototype.scrollZone = /**
        * Create a new ScrollZone object with image key, position and size.
        *
        * @param key {string} Key to a image you wish this object to use.
        * @param x {number} X position of this object.
        * @param y {number} Y position of this object.
        * @param width number} Width of this object.
        * @param height {number} Height of this object.
        * @returns {ScrollZone} The newly created scroll zone object.
        */
        function (key, x, y, width, height) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            if (typeof width === "undefined") { width = 0; }
            if (typeof height === "undefined") { height = 0; }
            return this._world.createScrollZone(key, x, y, width, height);
        };
        GameObjectFactory.prototype.tilemap = /**
        * Create a new Tilemap.
        *
        * @param key {string} Key for tileset image.
        * @param mapData {string} Data of this tilemap.
        * @param format {number} Format of map data. (Tilemap.FORMAT_CSV or Tilemap.FORMAT_TILED_JSON)
        * @param [resizeWorld] {boolean} resize the world to make same as tilemap?
        * @param [tileWidth] {number} width of each tile.
        * @param [tileHeight] {number} height of each tile.
        * @return {Tilemap} The newly created tilemap object.
        */
        function (key, mapData, format, resizeWorld, tileWidth, tileHeight) {
            if (typeof resizeWorld === "undefined") { resizeWorld = true; }
            if (typeof tileWidth === "undefined") { tileWidth = 0; }
            if (typeof tileHeight === "undefined") { tileHeight = 0; }
            return this._world.createTilemap(key, mapData, format, resizeWorld, tileWidth, tileHeight);
        };
        GameObjectFactory.prototype.tween = /**
        * Create a tween object for a specific object.
        *
        * @param obj Object you wish the tween will affect.
        * @return {Phaser.Tween} The newly created tween object.
        */
        function (obj) {
            return this._game.tweens.create(obj);
        };
        GameObjectFactory.prototype.existingSprite = /**
        * Add an existing Sprite to the current world.
        * Note: This doesn't check or update the objects reference to Game. If that is wrong, all kinds of things will break.
        *
        * @param sprite The Sprite to add to the Game World
        * @return {Phaser.Sprite} The Sprite object
        */
        function (sprite) {
            return this._world.group.add(sprite);
        };
        GameObjectFactory.prototype.existingGeomSprite = /**
        * Add an existing GeomSprite to the current world.
        * Note: This doesn't check or update the objects reference to Game. If that is wrong, all kinds of things will break.
        *
        * @param sprite The GeomSprite to add to the Game World
        * @return {Phaser.GeomSprite} The GeomSprite object
        */
        function (sprite) {
            return this._world.group.add(sprite);
        };
        GameObjectFactory.prototype.existingEmitter = /**
        * Add an existing Emitter to the current world.
        * Note: This doesn't check or update the objects reference to Game. If that is wrong, all kinds of things will break.
        *
        * @param emitter The Emitter to add to the Game World
        * @return {Phaser.Emitter} The Emitter object
        */
        function (emitter) {
            return this._world.group.add(emitter);
        };
        GameObjectFactory.prototype.existingScrollZone = /**
        * Add an existing ScrollZone to the current world.
        * Note: This doesn't check or update the objects reference to Game. If that is wrong, all kinds of things will break.
        *
        * @param scrollZone The ScrollZone to add to the Game World
        * @return {Phaser.ScrollZone} The ScrollZone object
        */
        function (scrollZone) {
            return this._world.group.add(scrollZone);
        };
        GameObjectFactory.prototype.existingTilemap = /**
        * Add an existing Tilemap to the current world.
        * Note: This doesn't check or update the objects reference to Game. If that is wrong, all kinds of things will break.
        *
        * @param tilemap The Tilemap to add to the Game World
        * @return {Phaser.Tilemap} The Tilemap object
        */
        function (tilemap) {
            return this._world.group.add(tilemap);
        };
        GameObjectFactory.prototype.existingTween = /**
        * Add an existing Tween to the current world.
        * Note: This doesn't check or update the objects reference to Game. If that is wrong, all kinds of things will break.
        *
        * @param tween The Tween to add to the Game World
        * @return {Phaser.Tween} The Tween object
        */
        function (tween) {
            return this._game.tweens.add(tween);
        };
        return GameObjectFactory;
    })();
    Phaser.GameObjectFactory = GameObjectFactory;    
})(Phaser || (Phaser = {}));
/// <reference path="Basic.ts" />
/// <reference path="Game.ts" />
/**
* Phaser - Group
*
* This class is used for organising, updating and sorting game objects.
*/
var Phaser;
(function (Phaser) {
    var Group = (function (_super) {
        __extends(Group, _super);
        function Group(game, MaxSize) {
            if (typeof MaxSize === "undefined") { MaxSize = 0; }
                _super.call(this, game);
            /**
            * You can set a globalCompositeOperation that will be applied before the render method is called on this Groups children.
            * This is useful if you wish to apply an effect like 'lighten' to a whole group of children as it saves doing it one-by-one.
            * If this value is set it will call a canvas context save and restore before and after the render pass.
            * Set to null to disable.
            */
            this.globalCompositeOperation = null;
            /**
            * You can set an alpha value on this Group that will be applied before the render method is called on this Groups children.
            * This is useful if you wish to alpha a whole group of children as it saves doing it one-by-one.
            * Set to 0 to disable.
            */
            this.alpha = 0;
            this.isGroup = true;
            this.members = [];
            this.length = 0;
            this._maxSize = MaxSize;
            this._marker = 0;
            this._sortIndex = null;
            this.cameraBlacklist = [];
        }
        Group.ASCENDING = -1;
        Group.DESCENDING = 1;
        Group.prototype.hideFromCamera = /**
        * If you do not wish this object to be visible to a specific camera, pass the camera here.
        *
        * @param camera {Camera} The specific camera.
        */
        function (camera) {
            if(this.cameraBlacklist.indexOf(camera.ID) == -1) {
                this.cameraBlacklist.push(camera.ID);
            }
        };
        Group.prototype.showToCamera = /**
        * Make this object only visible to a specific camera.
        *
        * @param camera {Camera} The camera you wish it to be visible.
        */
        function (camera) {
            if(this.cameraBlacklist.indexOf(camera.ID) !== -1) {
                this.cameraBlacklist.slice(this.cameraBlacklist.indexOf(camera.ID), 1);
            }
        };
        Group.prototype.clearCameraList = /**
        * This clears the camera black list, making the GameObject visible to all cameras.
        */
        function () {
            this.cameraBlacklist.length = 0;
        };
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
        function (forceUpdate) {
            if (typeof forceUpdate === "undefined") { forceUpdate = false; }
            if(this.ignoreGlobalUpdate && forceUpdate == false) {
                return;
            }
            var basic;
            var i = 0;
            while(i < this.length) {
                basic = this.members[i++];
                if((basic != null) && basic.exists && basic.active && basic.ignoreGlobalUpdate == false) {
                    basic.preUpdate();
                    basic.update(forceUpdate);
                    basic.postUpdate();
                }
            }
        };
        Group.prototype.render = /**
        * Automatically goes through and calls render on everything you added.
        */
        function (camera, cameraOffsetX, cameraOffsetY, forceRender) {
            if (typeof forceRender === "undefined") { forceRender = false; }
            if(this.cameraBlacklist.indexOf(camera.ID) !== -1) {
                return;
            }
            if(this.ignoreGlobalRender && forceRender == false) {
                return;
            }
            if(this.globalCompositeOperation) {
                this._game.stage.context.save();
                this._game.stage.context.globalCompositeOperation = this.globalCompositeOperation;
            }
            if(this.alpha > 0) {
                var prevAlpha = this._game.stage.context.globalAlpha;
                this._game.stage.context.globalAlpha = this.alpha;
            }
            var basic;
            var i = 0;
            while(i < this.length) {
                basic = this.members[i++];
                if((basic != null) && basic.exists && basic.visible && basic.ignoreGlobalRender == false) {
                    basic.render(camera, cameraOffsetX, cameraOffsetY, forceRender);
                }
            }
            if(this.alpha > 0) {
                this._game.stage.context.globalAlpha = prevAlpha;
            }
            if(this.globalCompositeOperation) {
                this._game.stage.context.restore();
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
        * Adds a new <code>Basic</code> subclass (Basic, GameObject, Sprite, etc) to the group.
        * Group will try to replace a null member of the array first.
        * Failing that, Group will add it to the end of the member array,
        * assuming there is room for it, and doubling the size of the array if necessary.
        *
        * <p>WARNING: If the group has a maxSize that has already been met,
        * the object will NOT be added to the group!</p>
        *
        * @param {Basic} Object The object you want to add to the group.
        * @return {Basic} The same <code>Basic</code> object that was passed in.
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
        * @param {class} ObjectClass The class type you want to recycle (e.g. Basic, EvilRobot, etc). Do NOT "new" the class in the parameter!
        *
        * @return {any} A reference to the object that was created.  Don't forget to cast it back to the Class you want (e.g. myObject = myGroup.recycle(myObjectClass) as myObjectClass;).
        */
        function (ObjectClass) {
            if (typeof ObjectClass === "undefined") { ObjectClass = null; }
            var basic;
            if(this._maxSize > 0) {
                if(this.length < this._maxSize) {
                    if(ObjectClass == null) {
                        return null;
                    }
                    return this.add(new ObjectClass(this._game));
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
                return this.add(new ObjectClass(this._game));
            }
        };
        Group.prototype.remove = /**
        * Removes an object from the group.
        *
        * @param {Basic} object The <code>Basic</code> you want to remove.
        * @param {boolean} splice Whether the object should be cut from the array entirely or not.
        *
        * @return {Basic} The removed object.
        */
        function (object, splice) {
            if (typeof splice === "undefined") { splice = false; }
            var index = this.members.indexOf(object);
            if((index < 0) || (index >= this.members.length)) {
                return null;
            }
            if(splice) {
                this.members.splice(index, 1);
                this.length--;
            } else {
                this.members[index] = null;
            }
            return object;
        };
        Group.prototype.replace = /**
        * Replaces an existing <code>Basic</code> with a new one.
        *
        * @param {Basic} oldObject	The object you want to replace.
        * @param {Basic} newObject	The new object you want to use instead.
        *
        * @return {Basic} The new object.
        */
        function (oldObject, newObject) {
            var index = this.members.indexOf(oldObject);
            if((index < 0) || (index >= this.members.length)) {
                return null;
            }
            this.members[index] = newObject;
            return newObject;
        };
        Group.prototype.sort = /**
        * Call this function to sort the group according to a particular value and order.
        * For example, to sort game objects for Zelda-style overlaps you might call
        * <code>myGroup.sort("y",Group.ASCENDING)</code> at the bottom of your
        * <code>State.update()</code> override.  To sort all existing objects after
        * a big explosion or bomb attack, you might call <code>myGroup.sort("exists",Group.DESCENDING)</code>.
        *
        * @param {string} index The <code>string</code> name of the member variable you want to sort on.  Default value is "y".
        * @param {number} order A <code>Group</code> constant that defines the sort order.  Possible values are <code>Group.ASCENDING</code> and <code>Group.DESCENDING</code>.  Default value is <code>Group.ASCENDING</code>.
        */
        function (index, order) {
            if (typeof index === "undefined") { index = "y"; }
            if (typeof order === "undefined") { order = Group.ASCENDING; }
            this._sortIndex = index;
            this._sortOrder = order;
            this.members.sort(this.sortHandler);
        };
        Group.prototype.setAll = /**
        * Go through and set the specified variable to the specified value on all members of the group.
        *
        * @param {string} VariableName	The string representation of the variable name you want to modify, for example "visible" or "scrollFactor".
        * @param {Object} Value The value you want to assign to that variable.
        * @param {boolean} Recurse	Default value is true, meaning if <code>setAll()</code> encounters a member that is a group, it will call <code>setAll()</code> on that group rather than modifying its variable.
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
        * @param {string} FunctionName	The string representation of the function you want to call on each object, for example "kill()" or "init()".
        * @param {boolean} Recurse	Default value is true, meaning if <code>callAll()</code> encounters a member that is a group, it will call <code>callAll()</code> on that group rather than calling the group's function.
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
        Group.prototype.forEach = /**
        * @param {function} callback
        * @param {boolean} recursive
        */
        function (callback, recursive) {
            if (typeof recursive === "undefined") { recursive = false; }
            var basic;
            var i = 0;
            while(i < this.length) {
                basic = this.members[i++];
                if(basic != null) {
                    if(recursive && (basic.isGroup == true)) {
                        basic.forEach(callback, true);
                    } else {
                        callback.call(this, basic);
                    }
                }
            }
        };
        Group.prototype.forEachAlive = /**
        * @param {any} context
        * @param {function} callback
        * @param {boolean} recursive
        */
        function (context, callback, recursive) {
            if (typeof recursive === "undefined") { recursive = false; }
            var basic;
            var i = 0;
            while(i < this.length) {
                basic = this.members[i++];
                if(basic != null && basic.alive) {
                    if(recursive && (basic.isGroup == true)) {
                        basic.forEachAlive(context, callback, true);
                    } else {
                        callback.call(context, basic);
                    }
                }
            }
        };
        Group.prototype.getFirstAvailable = /**
        * Call this function to retrieve the first object with exists == false in the group.
        * This is handy for recycling in general, e.g. respawning enemies.
        *
        * @param {any} [ObjectClass] An optional parameter that lets you narrow the results to instances of this particular class.
        *
        * @return {any} A <code>Basic</code> currently flagged as not existing.
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
        * @return {number} An <code>int</code> indicating the first null slot in the group.
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
        * @return {Basic} A <code>Basic</code> currently flagged as existing.
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
        * @return {Basic} A <code>Basic</code> currently flagged as not dead.
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
        * @return {Basic} A <code>Basic</code> currently flagged as dead.
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
        * @return {number} The number of <code>Basic</code>s flagged as not dead.  Returns -1 if group is empty.
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
        * @return {number} The number of <code>Basic</code>s flagged as dead.  Returns -1 if group is empty.
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
        * @param {number} StartIndex Optional offset off the front of the array. Default value is 0, or the beginning of the array.
        * @param {number} Length Optional restriction on the number of values you want to randomly select from.
        *
        * @return {Basic} A <code>Basic</code> from the members list.
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
        * @param {Basic} Obj1 The first object being sorted.
        * @param {Basic} Obj2 The second object being sorted.
        *
        * @return {number} An integer value: -1 (Obj1 before Obj2), 0 (same), or 1 (Obj1 after Obj2).
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
        /**
        * Loader constructor
        *
        * @param game {Phaser.Game} Current game instance.
        * @param callback {function} This will be called when assets completely loaded.
        */
        function Loader(game, callback) {
            /**
            * The crossOrigin value applied to loaded images
            * @type {string}
            */
            this.crossOrigin = '';
            this._game = game;
            this._gameCreateComplete = callback;
            this._keys = [];
            this._fileList = {
            };
            this._xhr = new XMLHttpRequest();
            this._queueSize = 0;
        }
        Loader.TEXTURE_ATLAS_JSON_ARRAY = 0;
        Loader.TEXTURE_ATLAS_JSON_HASH = 1;
        Loader.TEXTURE_ATLAS_XML_STARLING = 2;
        Loader.prototype.reset = /**
        * Reset loader, this will remove all loaded assets.
        */
        function () {
            this._queueSize = 0;
        };
        Object.defineProperty(Loader.prototype, "queueSize", {
            get: function () {
                return this._queueSize;
            },
            enumerable: true,
            configurable: true
        });
        Loader.prototype.addImageFile = /**
        * Add a new image asset loading request with key and url.
        * @param key {string} Unique asset key of this image file.
        * @param url {string} URL of image file.
        */
        function (key, url) {
            if(this.checkKeyExists(key) === false) {
                this._queueSize++;
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
        Loader.prototype.addSpriteSheet = /**
        * Add a new sprite sheet loading request.
        * @param key {string} Unique asset key of the sheet file.
        * @param url {string} URL of sheet file.
        * @param frameWidth {number} Width of each single frame.
        * @param frameHeight {number} Height of each single frame.
        * @param frameMax {number} How many frames in this sprite sheet.
        */
        function (key, url, frameWidth, frameHeight, frameMax) {
            if (typeof frameMax === "undefined") { frameMax = -1; }
            if(this.checkKeyExists(key) === false) {
                this._queueSize++;
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
        Loader.prototype.addTextureAtlas = /**
        * Add a new texture atlas loading request.
        * @param key {string} Unique asset key of the texture atlas file.
        * @param textureURL {string} The url of the texture atlas image file.
        * @param [atlasURL] {string} The url of the texture atlas data file (json/xml)
        * @param [atlasData] {object} A JSON or XML data object.
        * @param [format] {number} A value describing the format of the data.
        */
        function (key, textureURL, atlasURL, atlasData, format) {
            if (typeof atlasURL === "undefined") { atlasURL = null; }
            if (typeof atlasData === "undefined") { atlasData = null; }
            if (typeof format === "undefined") { format = Loader.TEXTURE_ATLAS_JSON_ARRAY; }
            if(this.checkKeyExists(key) === false) {
                if(atlasURL !== null) {
                    //  A URL to a json/xml file has been given
                    this._queueSize++;
                    this._fileList[key] = {
                        type: 'textureatlas',
                        key: key,
                        url: textureURL,
                        atlasURL: atlasURL,
                        data: null,
                        format: format,
                        error: false,
                        loaded: false
                    };
                    this._keys.push(key);
                } else {
                    if(format == Loader.TEXTURE_ATLAS_JSON_ARRAY) {
                        //  A json string or object has been given
                        if(typeof atlasData === 'string') {
                            atlasData = JSON.parse(atlasData);
                        }
                        this._queueSize++;
                        this._fileList[key] = {
                            type: 'textureatlas',
                            key: key,
                            url: textureURL,
                            data: null,
                            atlasURL: null,
                            atlasData: atlasData['frames'],
                            format: format,
                            error: false,
                            loaded: false
                        };
                        this._keys.push(key);
                    } else if(format == Loader.TEXTURE_ATLAS_XML_STARLING) {
                        //  An xml string or object has been given
                        if(typeof atlasData === 'string') {
                            var xml;
                            try  {
                                if(window['DOMParser']) {
                                    var domparser = new DOMParser();
                                    xml = domparser.parseFromString(atlasData, "text/xml");
                                } else {
                                    xml = new ActiveXObject("Microsoft.XMLDOM");
                                    xml.async = 'false';
                                    xml.loadXML(atlasData);
                                }
                            } catch (e) {
                                xml = undefined;
                            }
                            if(!xml || !xml.documentElement || xml.getElementsByTagName("parsererror").length) {
                                throw new Error("Phaser.Loader. Invalid Texture Atlas XML given");
                            } else {
                                atlasData = xml;
                            }
                        }
                        this._queueSize++;
                        this._fileList[key] = {
                            type: 'textureatlas',
                            key: key,
                            url: textureURL,
                            data: null,
                            atlasURL: null,
                            atlasData: atlasData,
                            format: format,
                            error: false,
                            loaded: false
                        };
                        this._keys.push(key);
                    }
                }
            }
        };
        Loader.prototype.addAudioFile = /**
        * Add a new audio file loading request.
        * @param key {string} Unique asset key of the audio file.
        * @param url {string} URL of audio file.
        */
        function (key, url) {
            if(this.checkKeyExists(key) === false) {
                this._queueSize++;
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
        Loader.prototype.addTextFile = /**
        * Add a new text file loading request.
        * @param key {string} Unique asset key of the text file.
        * @param url {string} URL of text file.
        */
        function (key, url) {
            if(this.checkKeyExists(key) === false) {
                this._queueSize++;
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
        Loader.prototype.removeFile = /**
        * Remove loading request of a file.
        * @param key {string} Key of the file you want to remove.
        */
        function (key) {
            delete this._fileList[key];
        };
        Loader.prototype.removeAll = /**
        * Remove all file loading requests.
        */
        function () {
            this._fileList = {
            };
        };
        Loader.prototype.load = /**
        * Load assets.
        * @param onFileLoadCallback {function} Called when each file loaded successfully.
        * @param onCompleteCallback {function} Called when all assets completely loaded.
        */
        function (onFileLoadCallback, onCompleteCallback) {
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
        Loader.prototype.loadFile = /**
        * Load files. Private method ONLY used by loader.
        */
        function () {
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
                    file.data.crossOrigin = this.crossOrigin;
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
        Loader.prototype.fileError = /**
        * Error occured when load a file.
        * @param key {string} Key of the error loading file.
        */
        function (key) {
            this._fileList[key].loaded = true;
            this._fileList[key].error = true;
            this.nextFile(key, false);
        };
        Loader.prototype.fileComplete = /**
        * Called when a file is successfully loaded.
        * @param key {string} Key of the successfully loaded file.
        */
        function (key) {
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
                    if(file.atlasURL == null) {
                        this._game.cache.addTextureAtlas(file.key, file.url, file.data, file.atlasData, file.format);
                    } else {
                        //  Load the JSON or XML before carrying on with the next file
                        loadNext = false;
                        this._xhr.open("GET", file.atlasURL, true);
                        this._xhr.responseType = "text";
                        if(file.format == Loader.TEXTURE_ATLAS_JSON_ARRAY) {
                            this._xhr.onload = function () {
                                return _this.jsonLoadComplete(file.key);
                            };
                        } else if(file.format == Loader.TEXTURE_ATLAS_XML_STARLING) {
                            this._xhr.onload = function () {
                                return _this.xmlLoadComplete(file.key);
                            };
                        }
                        this._xhr.onerror = function () {
                            return _this.dataLoadError(file.key);
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
        Loader.prototype.jsonLoadComplete = /**
        * Successfully loaded a JSON file.
        * @param key {string} Key of the loaded JSON file.
        */
        function (key) {
            var data = JSON.parse(this._xhr.response);
            var file = this._fileList[key];
            this._game.cache.addTextureAtlas(file.key, file.url, file.data, data['frames'], file.format);
            this.nextFile(key, true);
        };
        Loader.prototype.dataLoadError = /**
        * Error occured when load a JSON.
        * @param key {string} Key of the error loading JSON file.
        */
        function (key) {
            var file = this._fileList[key];
            file.error = true;
            this.nextFile(key, true);
        };
        Loader.prototype.xmlLoadComplete = function (key) {
            var atlasData = this._xhr.response;
            var xml;
            try  {
                if(window['DOMParser']) {
                    var domparser = new DOMParser();
                    xml = domparser.parseFromString(atlasData, "text/xml");
                } else {
                    xml = new ActiveXObject("Microsoft.XMLDOM");
                    xml.async = 'false';
                    xml.loadXML(atlasData);
                }
            } catch (e) {
                xml = undefined;
            }
            if(!xml || !xml.documentElement || xml.getElementsByTagName("parsererror").length) {
                throw new Error("Phaser.Loader. Invalid Texture Atlas XML given");
            }
            var file = this._fileList[key];
            this._game.cache.addTextureAtlas(file.key, file.url, file.data, xml, file.format);
            this.nextFile(key, true);
        };
        Loader.prototype.nextFile = /**
        * Handle loading next file.
        * @param previousKey {string} Key of previous loaded asset.
        * @param success {boolean} Whether the previous asset loaded successfully or not.
        */
        function (previousKey, success) {
            this.progress = Math.round(this.progress + this._progressChunk);
            if(this.progress > 100) {
                this.progress = 100;
            }
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
        Loader.prototype.checkKeyExists = /**
        * Check whether asset exists with a specific key.
        * @param key {string} Key of the asset you want to check.
        * @return {boolean} Return true if exists, otherwise return false.
        */
        function (key) {
            if(this._fileList[key]) {
                return true;
            } else {
                return false;
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
        * @param {number} Velocity Any component of velocity (e.g. 20).
        * @param {number} Acceleration Rate at which the velocity is changing.
        * @param {number} Drag Really kind of a deceleration, this is how much the velocity changes if Acceleration is not set.
        * @param {number} Max An absolute value cap for the velocity.
        *
        * @return {number} The altered Velocity value.
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
        * @param {number} angle The angle (in degrees) calculated in clockwise positive direction (down = 90 degrees positive, right = 0 degrees positive, up = 90 degrees negative)
        * @param {number} speed The speed it will move, in pixels per second sq
        *
        * @return {Point} A Point where Point.x contains the velocity x value and Point.y contains the velocity y value
        */
        function (angle, speed) {
            if(isNaN(speed)) {
                speed = 0;
            }
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
        * @param {GameObject} source The Sprite on which the velocity will be set
        * @param {GameObject} dest The Sprite where the source object will move to
        * @param {number} speed The speed it will move, in pixels per second (default is 60 pixels/sec)
        * @param {number} maxTime Time given in milliseconds (1000 = 1 sec). If set the speed is adjusted so the source will arrive at destination in the given number of ms
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
        * @param {GameObject} source The Sprite on which the acceleration will be set
        * @param {GameObject} dest The Sprite where the source object will move towards
        * @param {number} speed The speed it will accelerate in pixels per second
        * @param {number} xSpeedMax The maximum speed in pixels per second in which the sprite can move horizontally
        * @param {number} ySpeedMax The maximum speed in pixels per second in which the sprite can move vertically
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
        * @param {GameObject} source The Sprite to move
        * @param {number} speed The speed it will move, in pixels per second (default is 60 pixels/sec)
        * @param {number} maxTime Time given in milliseconds (1000 = 1 sec). If set the speed is adjusted so the source will arrive at destination in the given number of ms
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
        * @param {GameObject} source The Sprite on which the acceleration will be set
        * @param {number} speed The speed it will accelerate in pixels per second
        * @param {number} xSpeedMax The maximum speed in pixels per second in which the sprite can move horizontally
        * @param {number} ySpeedMax The maximum speed in pixels per second in which the sprite can move vertically
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
        * @param {GameObject} source The Sprite to move
        * @param {Point} target The Point coordinates to move the source Sprite towards
        * @param {number} speed The speed it will move, in pixels per second (default is 60 pixels/sec)
        * @param {number} maxTime Time given in milliseconds (1000 = 1 sec). If set the speed is adjusted so the source will arrive at destination in the given number of ms
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
        * @param {GameObject} source The Sprite on which the acceleration will be set
        * @param {Point} target The Point coordinates to move the source Sprite towards
        * @param {number} speed The speed it will accelerate in pixels per second
        * @param {number} xSpeedMax The maximum speed in pixels per second in which the sprite can move horizontally
        * @param {number} ySpeedMax The maximum speed in pixels per second in which the sprite can move vertically
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
        * @param {GameObject} a The first Sprite
        * @param {GameObject} b The second Sprite
        * @return {number} int Distance (in pixels)
        */
        function (a, b) {
            var dx = (a.x + a.origin.x) - (b.x + b.origin.x);
            var dy = (a.y + a.origin.y) - (b.y + b.origin.y);
            return this._game.math.vectorLength(dx, dy);
        };
        Motion.prototype.distanceToPoint = /**
        * Find the distance (in pixels, rounded) from an Sprite to the given Point, taking the source origin into account
        *
        * @param {GameObject} a The Sprite
        * @param {Point} target The Point
        * @return {number} Distance (in pixels)
        */
        function (a, target) {
            var dx = (a.x + a.origin.x) - (target.x);
            var dy = (a.y + a.origin.y) - (target.y);
            return this._game.math.vectorLength(dx, dy);
        };
        Motion.prototype.distanceToMouse = /**
        * Find the distance (in pixels, rounded) from the object x/y and the mouse x/y
        *
        * @param {GameObject} a  Sprite to test against
        * @return {number} The distance between the given sprite and the mouse coordinates
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
        * @param {GameObject} a The Sprite to test from
        * @param {Point} target The Point to angle the Sprite towards
        * @param {boolean} asDegrees If you need the value in degrees instead of radians, set to true
        *
        * @return {number} The angle (in radians unless asDegrees is true)
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
        * @param {GameObject} a The Sprite to test from
        * @param {GameObject} b The Sprite to test to
        * @param {boolean} asDegrees If you need the value in degrees instead of radians, set to true
        *
        * @return {number} The angle (in radians unless asDegrees is true)
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
        * @param {GameObject} parent The Sprite to get the facing value from
        * @param {number} speed The speed it will move, in pixels per second sq
        *
        * @return {Point} An Point where Point.x contains the velocity x value and Point.y contains the velocity y value
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
        * @param {GameObject} a The Object to test from
        * @param {boolean} asDegrees If you need the value in degrees instead of radians, set to true
        *
        * @return {number} The angle (in radians unless asDegrees is true)
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
        /**
        * Sound constructor
        * @param context {object} The AudioContext instance.
        * @param gainNode {object} Gain node instance.
        * @param data {object} Sound data.
        * @param [volume] {number} volume of this sound when playing.
        * @param [loop] {boolean} loop this sound when playing? (Default to false)
        */
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
            //this.play();
                    };
        Sound.prototype.play = /**
        * Play this sound.
        */
        function () {
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
        Sound.prototype.stop = /**
        * Stop playing this sound.
        */
        function () {
            if(this.isPlaying === true) {
                this.isPlaying = false;
                this._sound.noteOff(0);
            }
        };
        Sound.prototype.mute = /**
        * Mute the sound.
        */
        function () {
            this._localGainNode.gain.value = 0;
        };
        Sound.prototype.unmute = /**
        * Enable the sound.
        */
        function () {
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
        /**
        * SoundManager constructor
        * Create a new <code>SoundManager</code>.
        */
        function SoundManager(game) {
            /**
            * Reference to AudioContext instance.
            */
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
        SoundManager.prototype.mute = /**
        * Mute sounds.
        */
        function () {
            this._gainNode.gain.value = 0;
        };
        SoundManager.prototype.unmute = /**
        * Enable sounds.
        */
        function () {
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
        SoundManager.prototype.decode = /**
        * Decode a sound with its assets key.
        * @param key {string} Assets key of the sound to be decoded.
        * @param callback {function} This will be invoked when finished decoding.
        * @param [sound] {Sound} its bufer will be set to decoded data.
        */
        function (key, callback, sound) {
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
        SoundManager.prototype.play = /**
        * Play a sound with its assets key.
        * @param key {string} Assets key of the sound you want to play.
        * @param [volume] {number} volume of the sound you want to play.
        * @param [loop] {boolean} loop when it finished playing? (Default to false)
        * @return {Sound} The playing sound object.
        */
        function (key, volume, loop) {
            if (typeof volume === "undefined") { volume = 1; }
            if (typeof loop === "undefined") { loop = false; }
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
                        return tempSound.play();
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
* v0.9.6 - May 21st 2013
*
* A small and feature-packed 2D canvas game framework born from the firey pits of Flixel and Kiwi.
*
* Richard Davey (@photonstorm)
*
* Many thanks to Adam Saltsman (@ADAMATOMIC) for releasing Flixel on which Phaser took a lot of inspiration.
*
* "If you want your children to be intelligent,  read them fairy tales."
* "If you want them to be more intelligent, read them more fairy tales."
*                                                     -- Albert Einstein
*/
var Phaser;
(function (Phaser) {
    Phaser.VERSION = 'Phaser version 0.9.6';
})(Phaser || (Phaser = {}));
/// <reference path="../Game.ts" />
/**
* Phaser - StageScaleMode
*
* This class controls the scaling of your game. On mobile devices it will also remove the URL bar and allow
* you to maintain proportion and aspect ratio.
* The resizing method is based on a technique taken from Viewporter v2.0 by Zynga Inc. http://github.com/zynga/viewporter
*/
var Phaser;
(function (Phaser) {
    var StageScaleMode = (function () {
        /**
        * StageScaleMode constructor
        */
        function StageScaleMode(game) {
            var _this = this;
            /**
            * Stage height when start the game.
            * @type {number}
            */
            this._startHeight = 0;
            /**
            * Minimum width the canvas should be scaled to (in pixels)
            * @type {number}
            */
            this.minWidth = null;
            /**
            * Maximum width the canvas should be scaled to (in pixels).
            * If null it will scale to whatever width the browser can handle.
            * @type {number}
            */
            this.maxWidth = null;
            /**
            * Minimum height the canvas should be scaled to (in pixels)
            * @type {number}
            */
            this.minHeight = null;
            /**
            * Maximum height the canvas should be scaled to (in pixels).
            * If null it will scale to whatever height the browser can handle.
            * @type {number}
            */
            this.maxHeight = null;
            /**
            * Width of the stage after calculation.
            * @type {number}
            */
            this.width = 0;
            /**
            * Height of the stage after calculation.
            * @type {number}
            */
            this.height = 0;
            this._game = game;
            this.enterLandscape = new Phaser.Signal();
            this.enterPortrait = new Phaser.Signal();
            if(window['orientation']) {
                this.orientation = window['orientation'];
            } else {
                if(window.outerWidth > window.outerHeight) {
                    this.orientation = 90;
                } else {
                    this.orientation = 0;
                }
            }
            window.addEventListener('orientationchange', function (event) {
                return _this.checkOrientation(event);
            }, false);
            window.addEventListener('resize', function (event) {
                return _this.checkResize(event);
            }, false);
        }
        StageScaleMode.EXACT_FIT = 0;
        StageScaleMode.NO_SCALE = 1;
        StageScaleMode.SHOW_ALL = 2;
        Object.defineProperty(StageScaleMode.prototype, "isFullScreen", {
            get: function () {
                if(document['fullscreenElement'] === null || document['mozFullScreenElement'] === null || document['webkitFullscreenElement'] === null) {
                    return false;
                }
                return true;
            },
            enumerable: true,
            configurable: true
        });
        StageScaleMode.prototype.startFullScreen = function () {
            if(this.isFullScreen) {
                return;
            }
            var element = this._game.stage.canvas;
            if(element['requestFullScreen']) {
                element['requestFullScreen']();
            } else if(element['mozRequestFullScreen']) {
                element['mozRequestFullScreen']();
            } else if(element['webkitRequestFullScreen']) {
                element['webkitRequestFullScreen']();
            }
        };
        StageScaleMode.prototype.stopFullScreen = function () {
            if(document['cancelFullScreen']) {
                document['cancelFullScreen']();
            } else if(document['mozCancelFullScreen']) {
                document['mozCancelFullScreen']();
            } else if(document['webkitCancelFullScreen']) {
                document['webkitCancelFullScreen']();
            }
        };
        StageScaleMode.prototype.update = /**
        * The core update loop, called by Phaser.Stage
        */
        function () {
            if(this._game.stage.scaleMode !== StageScaleMode.NO_SCALE && (window.innerWidth !== this.width || window.innerHeight !== this.height)) {
                this.refresh();
            }
        };
        Object.defineProperty(StageScaleMode.prototype, "isPortrait", {
            get: function () {
                return this.orientation == 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(StageScaleMode.prototype, "isLandscape", {
            get: function () {
                return this.orientation === 90 || this.orientation === -90;
            },
            enumerable: true,
            configurable: true
        });
        StageScaleMode.prototype.checkOrientation = /**
        * Handle window.orientationchange events
        */
        function (event) {
            this.orientation = window['orientation'];
            if(this.isLandscape) {
                this.enterLandscape.dispatch(this.orientation);
            } else {
                this.enterPortrait.dispatch(this.orientation);
            }
            if(this._game.stage.scaleMode !== StageScaleMode.NO_SCALE) {
                this.refresh();
            }
        };
        StageScaleMode.prototype.checkResize = /**
        * Handle window.resize events
        */
        function (event) {
            if(window.outerWidth > window.outerHeight) {
                this.orientation = 90;
            } else {
                this.orientation = 0;
            }
            if(this.isLandscape) {
                this.enterLandscape.dispatch(this.orientation);
            } else {
                this.enterPortrait.dispatch(this.orientation);
            }
            if(this._game.stage.scaleMode !== StageScaleMode.NO_SCALE) {
                this.refresh();
            }
        };
        StageScaleMode.prototype.refresh = /**
        * Re-calculate scale mode and update screen size.
        */
        function () {
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
        StageScaleMode.prototype.setScreenSize = /**
        * Set screen size automatically based on the scaleMode.
        */
        function () {
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
                    if(this.maxWidth && window.innerWidth > this.maxWidth) {
                        this.width = this.maxWidth;
                    } else {
                        this.width = window.innerWidth;
                    }
                    if(this.maxHeight && window.innerHeight > this.maxHeight) {
                        this.height = this.maxHeight;
                    } else {
                        this.height = window.innerHeight;
                    }
                } else if(this._game.stage.scaleMode == StageScaleMode.SHOW_ALL) {
                    var multiplier = Math.min((window.innerHeight / this._game.stage.height), (window.innerWidth / this._game.stage.width));
                    this.width = Math.round(this._game.stage.width * multiplier);
                    this.height = Math.round(this._game.stage.height * multiplier);
                    if(this.maxWidth && this.width > this.maxWidth) {
                        this.width = this.maxWidth;
                    }
                    if(this.maxHeight && this.height > this.maxHeight) {
                        this.height = this.maxHeight;
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
/// <reference path="../../Game.ts" />
/**
* Phaser - BootScreen
*
* The BootScreen is displayed when Phaser is started without any default functions or State
*/
var Phaser;
(function (Phaser) {
    var BootScreen = (function () {
        /**
        * BootScreen constructor
        * Create a new <code>BootScreen</code> with specific width and height.
        *
        * @param width {number} Screen canvas width.
        * @param height {number} Screen canvas height.
        */
        function BootScreen(game) {
            /**
            * Engine logo image data.
            */
            this._logoData = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGgAAAAZCAYAAADdYmvFAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAstJREFUeNrsWlFuwjAMbavdZGcAcRm4AXzvCPuGG8BlEJxhZ+l4TJ48z3actGGthqUI1MaO/V6cmIT2/fW10eTt46NvKshtvDZlG31yfOL9a/ldU6x4IZ0GQs0gS217enMkJYr5ixXkYrFoVqtV1kDn8/n+KfXw/Hq9Nin7h8MhScB2u3Xtav2ivsNWrh7XLcWMYqA4eUZ1kj0MAifHJEeKFojWzyIH+rL/0Cwif2AX9nN1oQOgrTg8XcTFx+ScdEOJ4WBxXQ1EjRyrn0cOzzQLzFyQSQcgw/5Qkkr0JVEQpNIdhL4vm4DL5fLulNTHcy6Uxl4/6iMLiePx2KzX6/v30+n0aynUlrnSeNq2/VN9bgM4dFPdNPmsJnIg/PuQbJmLdFN3UNu0SzbyJ0GOWJVWZE/QMkY+owrqXxGEdZA37BVyX6lJTipT6J1lf7fbqc+xh8nYeIvikatP+PGW0nEJ4jOydHYOIcfKnmgWoZDQSIIeio4Sf1IthYWskCO4vqQ6lFYjl8tl9L1H67PZbMz3VO3t93uVXHofmUjReLyMwHi5eCb3ICwJj5ZU9nCg+SzUgPYyif+2epTk4pkkyDp+eXTlZu2BkUybEkklePZfK9lPuTnc07vbmt1bYulHBeNQgx18SsH4ni/cV2rSLtqNDNUH2JQ2SsXS57Y9PHlfumkwCdICt5rnkNdPjpMiIEWgRlAJSdF4SvCQMWj+VyfI0h8D/EgWSYKiJKXi8VrOhJUxaFiFCOKKUJAtR78k9eX4USLHXqLGXOIiWUT4Vj9JiP4W0io3VDz8AJXblNWQrOimLjIGy/9uLICH6mrVmFbxEFHauzmc0fGJJmPg/v+6D0oB7N2bj0FsNHtSWTQniWTR931QlHXvasDTHXLjqY0/1/8hSDxACD+lAGH8dKQbQk5N3TFtzDmLWutvV0+pL5FVoHvCNG35FGAAayS4KUoKC9QAAAAASUVORK5CYII=";
            /**
            * Background gradient effect color 1.
            */
            this._color1 = {
                r: 20,
                g: 20,
                b: 20
            };
            /**
            * Background gradient effect color 2.
            */
            this._color2 = {
                r: 200,
                g: 200,
                b: 200
            };
            /**
            * Fade effect tween.
            * @type {Phaser.Tween}
            */
            this._fade = null;
            this._game = game;
            this._logo = new Image();
            this._logo.src = this._logoData;
        }
        BootScreen.prototype.update = /**
        * Update color and fade.
        */
        function () {
            if(this._fade == null) {
                this.colorCycle();
            }
            this._color1.r = Math.round(this._color1.r);
            this._color1.g = Math.round(this._color1.g);
            this._color1.b = Math.round(this._color1.b);
            this._color2.r = Math.round(this._color2.r);
            this._color2.g = Math.round(this._color2.g);
            this._color2.b = Math.round(this._color2.b);
        };
        BootScreen.prototype.render = /**
        * Render BootScreen.
        */
        function () {
            var grd = this._game.stage.context.createLinearGradient(0, 0, 0, this._game.stage.height);
            grd.addColorStop(0, 'rgb(' + this._color1.r + ', ' + this._color1.g + ', ' + this._color1.b + ')');
            grd.addColorStop(0.5, 'rgb(' + this._color2.r + ', ' + this._color2.g + ', ' + this._color2.b + ')');
            grd.addColorStop(1, 'rgb(' + this._color1.r + ', ' + this._color1.g + ', ' + this._color1.b + ')');
            this._game.stage.context.fillStyle = grd;
            this._game.stage.context.fillRect(0, 0, this._game.stage.width, this._game.stage.height);
            this._game.stage.context.shadowOffsetX = 0;
            this._game.stage.context.shadowOffsetY = 0;
            if(this._logo) {
                this._game.stage.context.drawImage(this._logo, 32, 32);
            }
            this._game.stage.context.shadowColor = 'rgb(0,0,0)';
            this._game.stage.context.shadowOffsetX = 1;
            this._game.stage.context.shadowOffsetY = 1;
            this._game.stage.context.shadowBlur = 0;
            this._game.stage.context.fillStyle = 'rgb(255,255,255)';
            this._game.stage.context.font = 'bold 18px Arial';
            this._game.stage.context.textBaseline = 'top';
            this._game.stage.context.fillText(Phaser.VERSION, 32, 64 + 32);
            this._game.stage.context.fillText('Game Size: ' + this._game.stage.width + ' x ' + this._game.stage.height, 32, 64 + 64);
            this._game.stage.context.fillText('www.photonstorm.com', 32, 64 + 96);
            this._game.stage.context.font = '16px Arial';
            this._game.stage.context.fillText('You are seeing this screen because you didn\'t specify any default', 32, 64 + 160);
            this._game.stage.context.fillText('functions in the Game constructor or use Game.switchState()', 32, 64 + 184);
        };
        BootScreen.prototype.colorCycle = /**
        * Start color fading cycle.
        */
        function () {
            this._fade = this._game.add.tween(this._color2);
            this._fade.to({
                r: Math.random() * 250,
                g: Math.random() * 250,
                b: Math.random() * 250
            }, 3000, Phaser.Easing.Linear.None);
            this._fade.onComplete.add(this.colorCycle, this);
            this._fade.start();
        };
        return BootScreen;
    })();
    Phaser.BootScreen = BootScreen;    
})(Phaser || (Phaser = {}));
/// <reference path="../../Game.ts" />
/**
* Phaser - PauseScreen
*
* The PauseScreen is displayed whenever the game loses focus or the player switches to another browser tab.
*/
var Phaser;
(function (Phaser) {
    var PauseScreen = (function () {
        /**
        * PauseScreen constructor
        * Create a new <code>PauseScreen</code> with specific width and height.
        *
        * @param width {number} Screen canvas width.
        * @param height {number} Screen canvas height.
        */
        function PauseScreen(game, width, height) {
            this._game = game;
            this._canvas = document.createElement('canvas');
            this._canvas.width = width;
            this._canvas.height = height;
            this._context = this._canvas.getContext('2d');
        }
        PauseScreen.prototype.onPaused = /**
        * Called when the game enters pause mode.
        */
        function () {
            //  Take a grab of the current canvas to our temporary one
            this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
            this._context.drawImage(this._game.stage.canvas, 0, 0);
            this._color = {
                r: 255,
                g: 255,
                b: 255
            };
            this.fadeOut();
        };
        PauseScreen.prototype.onResume = /**
        * Called when the game resume from pause mode.
        */
        function () {
            this._fade.stop();
            this._game.tweens.remove(this._fade);
        };
        PauseScreen.prototype.update = /**
        * Update background color.
        */
        function () {
            this._color.r = Math.round(this._color.r);
            this._color.g = Math.round(this._color.g);
            this._color.b = Math.round(this._color.b);
        };
        PauseScreen.prototype.render = /**
        * Render PauseScreen.
        */
        function () {
            this._game.stage.context.drawImage(this._canvas, 0, 0);
            this._game.stage.context.fillStyle = 'rgba(0, 0, 0, 0.4)';
            this._game.stage.context.fillRect(0, 0, this._game.stage.width, this._game.stage.height);
            //  Draw a 'play' arrow
            var arrowWidth = Math.round(this._game.stage.width / 2);
            var arrowHeight = Math.round(this._game.stage.height / 2);
            var sx = this._game.stage.centerX - arrowWidth / 2;
            var sy = this._game.stage.centerY - arrowHeight / 2;
            this._game.stage.context.beginPath();
            this._game.stage.context.moveTo(sx, sy);
            this._game.stage.context.lineTo(sx, sy + arrowHeight);
            this._game.stage.context.lineTo(sx + arrowWidth, this._game.stage.centerY);
            this._game.stage.context.fillStyle = 'rgba(' + this._color.r + ', ' + this._color.g + ', ' + this._color.b + ', 0.8)';
            this._game.stage.context.fill();
            this._game.stage.context.closePath();
        };
        PauseScreen.prototype.fadeOut = /**
        * Start fadeOut effect.
        */
        function () {
            this._fade = this._game.add.tween(this._color);
            this._fade.to({
                r: 50,
                g: 50,
                b: 50
            }, 1000, Phaser.Easing.Linear.None);
            this._fade.onComplete.add(this.fadeIn, this);
            this._fade.start();
        };
        PauseScreen.prototype.fadeIn = /**
        * Start fadeIn effect.
        */
        function () {
            this._fade = this._game.add.tween(this._color);
            this._fade.to({
                r: 255,
                g: 255,
                b: 255
            }, 1000, Phaser.Easing.Linear.None);
            this._fade.onComplete.add(this.fadeOut, this);
            this._fade.start();
        };
        return PauseScreen;
    })();
    Phaser.PauseScreen = PauseScreen;    
})(Phaser || (Phaser = {}));
/// <reference path="Phaser.ts" />
/// <reference path="Game.ts" />
/// <reference path="system/StageScaleMode.ts" />
/// <reference path="system/screens/BootScreen.ts" />
/// <reference path="system/screens/PauseScreen.ts" />
/**
* Phaser - Stage
*
* The Stage is the canvas on which everything is displayed. This class handles display within the web browser, focus handling,
* resizing, scaling and pause/boot screens.
*/
var Phaser;
(function (Phaser) {
    var Stage = (function () {
        /**
        * Stage constructor
        *
        * Create a new <code>Stage</code> with specific width and height.
        *
        * @param parent {number} ID of parent DOM element.
        * @param width {number} Width of the stage.
        * @param height {number} Height of the stage.
        */
        function Stage(game, parent, width, height) {
            var _this = this;
            /**
            * Background color of the stage (defaults to black)
            * @type {string}
            */
            this._bgColor = 'rgb(0,0,0)';
            /**
            * Clear the whole stage every frame? (Default to true)
            * @type {boolean}
            */
            this.clear = true;
            /**
            * Do not use pause screen when game is paused?
            * (Default to false, aka always use PauseScreen)
            * @type {boolean}
            */
            this.disablePauseScreen = false;
            /**
            * Do not use boot screen when engine starts?
            * (Default to false, aka always use BootScreen)
            * @type {boolean}
            */
            this.disableBootScreen = false;
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
            this.canvas.style['ms-touch-action'] = 'none';
            this.canvas.style['touch-action'] = 'none';
            this.canvas.style.backgroundColor = 'rgb(0,0,0)';
            this.canvas.oncontextmenu = function (event) {
                event.preventDefault();
            };
            this.context = this.canvas.getContext('2d');
            this.offset = this.getOffset(this.canvas);
            this.bounds = new Phaser.Quad(this.offset.x, this.offset.y, width, height);
            this.aspectRatio = width / height;
            this.scaleMode = Phaser.StageScaleMode.NO_SCALE;
            this.scale = new Phaser.StageScaleMode(this._game);
            this._bootScreen = new Phaser.BootScreen(this._game);
            this._pauseScreen = new Phaser.PauseScreen(this._game, width, height);
            document.addEventListener('visibilitychange', function (event) {
                return _this.visibilityChange(event);
            }, false);
            document.addEventListener('webkitvisibilitychange', function (event) {
                return _this.visibilityChange(event);
            }, false);
            window.onblur = function (event) {
                return _this.visibilityChange(event);
            };
            window.onfocus = function (event) {
                return _this.visibilityChange(event);
            };
        }
        Stage.prototype.update = /**
        * Update stage for rendering. This will handle scaling, clearing
        * and PauseScreen/BootScreen updating and rendering.
        */
        function () {
            this.scale.update();
            if(this.clear) {
                //  implement dirty rect? could take up more cpu time than it saves. needs benching.
                this.context.clearRect(0, 0, this.width, this.height);
            }
            if(this._game.isRunning == false && this.disableBootScreen == false) {
                this._bootScreen.update();
                this._bootScreen.render();
            }
            if(this._game.paused == true && this.disablePauseScreen == false) {
                this._pauseScreen.update();
                this._pauseScreen.render();
            }
        };
        Stage.prototype.visibilityChange = /**
        * This method is called when the canvas elements visibility is changed.
        */
        function (event) {
            if(this.disablePauseScreen) {
                return;
            }
            if(event.type == 'blur' || document['hidden'] == true || document['webkitHidden'] == true) {
                if(this._game.paused == false) {
                    this.pauseGame();
                }
            } else {
                if(this._game.paused == true) {
                    this.resumeGame();
                }
            }
        };
        Stage.prototype.pauseGame = function () {
            this._pauseScreen.onPaused();
            this.saveCanvasValues();
            this._game.paused = true;
        };
        Stage.prototype.resumeGame = function () {
            this._pauseScreen.onResume();
            this.restoreCanvasValues();
            this._game.paused = false;
        };
        Stage.prototype.getOffset = /**
        * Get the DOM offset values of the given element
        */
        function (element) {
            var box = element.getBoundingClientRect();
            var clientTop = element.clientTop || document.body.clientTop || 0;
            var clientLeft = element.clientLeft || document.body.clientLeft || 0;
            var scrollTop = window.pageYOffset || element.scrollTop || document.body.scrollTop;
            var scrollLeft = window.pageXOffset || element.scrollLeft || document.body.scrollLeft;
            return new Phaser.MicroPoint(box.left + scrollLeft - clientLeft, box.top + scrollTop - clientTop);
        };
        Stage.prototype.saveCanvasValues = /**
        * Save current canvas properties (strokeStyle, lineWidth and fillStyle) for later using.
        */
        function () {
            this.strokeStyle = this.context.strokeStyle;
            this.lineWidth = this.context.lineWidth;
            this.fillStyle = this.context.fillStyle;
        };
        Stage.prototype.restoreCanvasValues = /**
        * Restore current canvas values (strokeStyle, lineWidth and fillStyle) with saved values.
        */
        function () {
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
        /**
        * Time constructor
        * Create a new <code>Time</code>.
        *
        * @param game {Phaser.Game} Current game instance.
        */
        function Time(game) {
            /**
            * Time scale factor.
            * Set it to 0.5 for slow motion, to 2.0 makes game twice faster.
            * @type {number}
            */
            this.timeScale = 1.0;
            /**
            * Elapsed since last frame.
            * @type {number}
            */
            this.elapsed = 0;
            /**
            * Game time counter.
            * @property time
            * @type {number}
            */
            this.time = 0;
            /**
            * Time of current frame.
            * @property now
            * @type {number}
            */
            this.now = 0;
            /**
            * Elapsed time since last frame.
            * @property delta
            * @type {number}
            */
            this.delta = 0;
            /**
            * Frames per second.
            * @type {number}
            */
            this.fps = 0;
            /**
            * Minimal fps.
            * @type {number}
            */
            this.fpsMin = 1000;
            /**
            * Maximal fps.
            * @type {number}
            */
            this.fpsMax = 0;
            /**
            * Mininal duration between 2 frames.
            * @type {number}
            */
            this.msMin = 1000;
            /**
            * Maximal duration between 2 frames.
            * @type {number}
            */
            this.msMax = 0;
            /**
            * How many frames in last second.
            * @type {number}
            */
            this.frames = 0;
            /**
            * Time of last second.
            * @type {number}
            */
            this._timeLastSecond = 0;
            this._started = 0;
            this._timeLastSecond = this._started;
            this.time = this._started;
            this._game = game;
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
        * Update clock and calculate the fps.
        * This is called automatically by Game._raf
        * @method update
        * @param {number} raf The current timestamp, either performance.now or Date.now
        */
        function (raf) {
            this.now = raf// mark
            ;
            //this.now = Date.now(); // mark
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
        };
        Time.prototype.elapsedSince = /**
        * How long has passed since given time.
        * @method elapsedSince
        * @param {number} since The time you want to measure.
        * @return {number} Duration between given time and now.
        */
        function (since) {
            return this.now - since;
        };
        Time.prototype.elapsedSecondsSince = /**
        * How long has passed since give time (in seconds).
        * @method elapsedSecondsSince
        * @param {number} since The time you want to measure (in seconds).
        * @return {number} Duration between given time and now (in seconds).
        */
        function (since) {
            return (this.now - since) * 0.001;
        };
        Time.prototype.reset = /**
        * Set the start time to now.
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
        /**
        * Tween constructor
        * Create a new <code>Tween</code>.
        *
        * @param object {object} Target object will be affected by this tween.
        * @param game {Phaser.Game} Current game instance.
        */
        function Tween(object, game) {
            /**
            * Reference to the target object.
            * @type {object}
            */
            this._object = null;
            this._pausedTime = 0;
            /**
            * Start values container.
            * @type {object}
            */
            this._valuesStart = {
            };
            /**
            * End values container.
            * @type {object}
            */
            this._valuesEnd = {
            };
            /**
            * How long this tween will perform.
            * @type {number}
            */
            this._duration = 1000;
            this._delayTime = 0;
            this._startTime = null;
            /**
            * Contains chained tweens.
            * @type {Tweens[]}
            */
            this._chainedTweens = [];
            this._object = object;
            this._game = game;
            this._manager = this._game.tweens;
            this._interpolationFunction = this._game.math.linearInterpolation;
            this._easingFunction = Phaser.Easing.Linear.None;
            this._chainedTweens = [];
            this.onStart = new Phaser.Signal();
            this.onUpdate = new Phaser.Signal();
            this.onComplete = new Phaser.Signal();
        }
        Tween.prototype.to = /**
        * Configure the Tween
        * @param properties {object} Propertis you want to tween.
        * @param [duration] {number} duration of this tween.
        * @param [ease] {any} Easing function.
        * @param [autoStart] {boolean} Whether this tween will start automatically or not.
        * @param [delay] {number} delay before this tween will start, defaults to 0 (no delay)
        * @return {Tween} Itself.
        */
        function (properties, duration, ease, autoStart, delay) {
            if (typeof duration === "undefined") { duration = 1000; }
            if (typeof ease === "undefined") { ease = null; }
            if (typeof autoStart === "undefined") { autoStart = false; }
            if (typeof delay === "undefined") { delay = 0; }
            this._duration = duration;
            //  If properties isn't an object this will fail, sanity check it here somehow?
            this._valuesEnd = properties;
            if(ease !== null) {
                this._easingFunction = ease;
            }
            if(delay > 0) {
                this._delayTime = delay;
            }
            if(autoStart === true) {
                return this.start();
            } else {
                return this;
            }
        };
        Tween.prototype.start = /**
        * Start to tween.
        */
        function () {
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
        Tween.prototype.stop = /**
        * Stop tweening.
        */
        function () {
            if(this._manager !== null) {
                this._manager.remove(this);
            }
            this.onComplete.dispose();
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
        Tween.prototype.chain = /**
        * Add another chained tween, which will start automatically when the one before it completes.
        * @param tween {Phaser.Tween} Tween object you want to chain with this.
        * @return {Phaser.Tween} Itselfe.
        */
        function (tween) {
            this._chainedTweens.push(tween);
            return this;
        };
        Tween.prototype.update = /**
        * Update tweening.
        * @param time {number} Current time from game clock.
        * @return {boolean} Return false if this completed and no need to update, otherwise return true.
        */
        function (time) {
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
        /**
        * TweenManager constructor
        * @param game {Game} A reference to the current Game.
        */
        function TweenManager(game) {
            this._game = game;
            this._tweens = [];
        }
        TweenManager.prototype.getAll = /**
        * Get all the tween objects in an array.
        * @return {Phaser.Tween[]} Array with all tween objects.
        */
        function () {
            return this._tweens;
        };
        TweenManager.prototype.removeAll = /**
        * Remove all tween objects.
        */
        function () {
            this._tweens.length = 0;
        };
        TweenManager.prototype.create = /**
        * Create a tween object for a specific object.
        *
        * @param object {object} Object you wish the tween will affect.
        * @return {Phaser.Tween} The newly created tween object.
        */
        function (object) {
            return new Phaser.Tween(object, this._game);
        };
        TweenManager.prototype.add = /**
        * Add an exist tween object to the manager.
        *
        * @param tween {Phaser.Tween} The tween object you want to add.
        * @return {Phaser.Tween} The tween object you added to the manager.
        */
        function (tween) {
            tween.parent = this._game;
            this._tweens.push(tween);
            return tween;
        };
        TweenManager.prototype.remove = /**
        * Remove a tween from this manager.
        *
        * @param tween {Phaser.Tween} The tween object you want to remove.
        */
        function (tween) {
            var i = this._tweens.indexOf(tween);
            if(i !== -1) {
                this._tweens.splice(i, 1);
            }
        };
        TweenManager.prototype.update = /**
        * Update all the tween objects you added to this manager.
        *
        * @return {boolean} Return false if there's no tween to update, otherwise return true.
        */
        function () {
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
var Phaser;
(function (Phaser) {
    /// <reference path="../Game.ts" />
    /// <reference path="../geom/Vector2.ts" />
    /**
    * Phaser - Verlet - Particle
    *
    *
    */
    (function (Verlet) {
        var Particle = (function () {
            /**
            * Creates a new Particle object.
            * @class Particle
            * @constructor
            * @param {Number} x The x coordinate of vector2
            * @param {Number} y The y coordinate of vector2
            * @return {Particle} This object
            **/
            function Particle(pos) {
                this.pos = (new Phaser.Vector2()).mutableSet(pos);
                this.lastPos = (new Phaser.Vector2()).mutableSet(pos);
            }
            Particle.prototype.render = function (ctx) {
                ctx.beginPath();
                ctx.arc(this.pos.x, this.pos.y, 2, 0, 2 * Math.PI);
                ctx.fillStyle = "#2dad8f";
                ctx.fill();
            };
            return Particle;
        })();
        Verlet.Particle = Particle;        
    })(Phaser.Verlet || (Phaser.Verlet = {}));
    var Verlet = Phaser.Verlet;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    /// <reference path="../Game.ts" />
    /// <reference path="Particle.ts" />
    /// <reference path="../geom/Vector2.ts" />
    /**
    * Phaser - PinConstraint
    *
    * Constrains to static / fixed point
    */
    (function (Verlet) {
        var PinConstraint = (function () {
            /**
            * Creates a new PinConstraint object.
            * @class PinConstraint
            * @constructor
            * @param {Number} x The x coordinate of vector2
            * @param {Number} y The y coordinate of vector2
            * @return {PinConstraint} This object
            **/
            function PinConstraint(a, pos) {
                this.a = a;
                this.pos = (new Phaser.Vector2()).mutableSet(pos);
            }
            PinConstraint.prototype.relax = function () {
                this.a.pos.mutableSet(this.pos);
            };
            PinConstraint.prototype.render = function (ctx) {
                ctx.beginPath();
                ctx.arc(this.pos.x, this.pos.y, 6, 0, 2 * Math.PI);
                ctx.fillStyle = "rgba(0,153,255,0.1)";
                ctx.fill();
            };
            return PinConstraint;
        })();
        Verlet.PinConstraint = PinConstraint;        
    })(Phaser.Verlet || (Phaser.Verlet = {}));
    var Verlet = Phaser.Verlet;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    /// <reference path="../Game.ts" />
    /// <reference path="../geom/Vector2.ts" />
    /// <reference path="Particle.ts" />
    /// <reference path="PinConstraint.ts" />
    /**
    * Phaser - Verlet - Composite
    *
    *
    */
    (function (Verlet) {
        var Composite = (function () {
            /**
            * Creates a new Composite object.
            * @class Composite
            * @constructor
            * @param {Number} x The x coordinate of vector2
            * @param {Number} y The y coordinate of vector2
            * @return {Composite} This object
            **/
            function Composite(game) {
                /**
                * Texture of the particles to be rendered.
                */
                this._texture = null;
                //  local rendering related temp vars to help avoid gc spikes
                this._sx = 0;
                this._sy = 0;
                this._sw = 0;
                this._sh = 0;
                this._dx = 0;
                this._dy = 0;
                this._dw = 0;
                this._dh = 0;
                this._hw = 0;
                this._hh = 0;
                this.drawParticles = null;
                this.drawConstraints = null;
                this.hideConstraints = true;
                this.constraintLineColor = 'rgba(200,200,200,1)';
                this._game = game;
                this.sprites = [];
                this.particles = [];
                this.constraints = [];
                this.frameBounds = new Phaser.Quad();
            }
            Composite.prototype.createDistanceConstraint = //  Create Constraints
            function (a, b, stiffness, distance) {
                if (typeof distance === "undefined") { distance = null; }
                this.constraints.push(new Phaser.Verlet.DistanceConstraint(a, b, stiffness, distance));
                return this.constraints[this.constraints.length - 1];
            };
            Composite.prototype.createAngleConstraint = function (a, b, c, stiffness) {
                this.constraints.push(new Phaser.Verlet.AngleConstraint(a, b, c, stiffness));
                return this.constraints[this.constraints.length - 1];
            };
            Composite.prototype.createPinConstraint = function (a, pos) {
                this.constraints.push(new Phaser.Verlet.PinConstraint(a, pos));
                return this.constraints[this.constraints.length - 1];
            };
            Composite.prototype.loadGraphic = /**
            * Load a graphic for this Composite. The graphic cannot be a SpriteSheet yet.
            * @param key {string} Key of the graphic you want to load for this sprite.
            * @return {Composite} This object
            */
            function (key) {
                if(this._game.cache.getImage(key) !== null) {
                    if(this._game.cache.isSpriteSheet(key) == false) {
                        this._texture = this._game.cache.getImage(key);
                        this.frameBounds.width = this._texture.width;
                        this.frameBounds.height = this._texture.height;
                        this._hw = Math.floor(this.frameBounds.width / 2);
                        this._hh = Math.floor(this.frameBounds.width / 2);
                        this.drawParticles = this.render;
                        this.drawConstraints = this.renderConstraints;
                    }
                }
                return this;
            };
            Composite.prototype.renderConstraints = function (context) {
                if(this.hideConstraints == true || this.constraints.length == 0) {
                    return;
                }
                var i;
                context.beginPath();
                for(i in this.constraints) {
                    if(this.constraints[i].b) {
                        context.moveTo(this.constraints[i].a.pos.x, this.constraints[i].a.pos.y);
                        context.lineTo(this.constraints[i].b.pos.x, this.constraints[i].b.pos.y);
                    }
                }
                context.strokeStyle = this.constraintLineColor;
                context.stroke();
                context.closePath();
            };
            Composite.prototype.render = function (context) {
                this._sx = 0;
                this._sy = 0;
                this._sw = this.frameBounds.width;
                this._sh = this.frameBounds.height;
                this._dw = this.frameBounds.width;
                this._dh = this.frameBounds.height;
                this._sx = Math.round(this._sx);
                this._sy = Math.round(this._sy);
                this._sw = Math.round(this._sw);
                this._sh = Math.round(this._sh);
                this._dw = Math.round(this._dw);
                this._dh = Math.round(this._dh);
                var i;
                for(i in this.particles) {
                    //this._dx = cameraOffsetX + (this.frameBounds.topLeft.x - camera.worldView.x);
                    //this._dy = cameraOffsetY + (this.frameBounds.topLeft.y - camera.worldView.y);
                    this._dx = this.particles[i].pos.x - this._hw;
                    this._dy = this.particles[i].pos.y - this._hh;
                    this._dx = Math.round(this._dx);
                    this._dy = Math.round(this._dy);
                    context.drawImage(this._texture, //	Source Image
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
            Composite.prototype.pin = function (index, pos) {
                if (typeof pos === "undefined") { pos = null; }
                if(pos == null) {
                    pos = this.particles[index].pos;
                }
                var pc = new Phaser.Verlet.PinConstraint(this.particles[index], pos);
                this.constraints.push(pc);
                return pc;
            };
            return Composite;
        })();
        Verlet.Composite = Composite;        
    })(Phaser.Verlet || (Phaser.Verlet = {}));
    var Verlet = Phaser.Verlet;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    /// <reference path="../Game.ts" />
    /// <reference path="Particle.ts" />
    /// <reference path="../geom/Vector2.ts" />
    /**
    * Phaser - DistanceConstraint
    *
    * Constrains to initial distance
    */
    (function (Verlet) {
        var DistanceConstraint = (function () {
            /**
            * Creates a new DistanceConstraint object.
            * @class DistanceConstraint
            * @constructor
            * @param {Number} x The x coordinate of vector2
            * @param {Number} y The y coordinate of vector2
            * @return {DistanceConstraint} This object
            **/
            function DistanceConstraint(a, b, stiffness, distance) {
                if (typeof distance === "undefined") { distance = null; }
                this.a = a;
                this.b = b;
                if(distance === null) {
                    this.distance = a.pos.sub(b.pos).length();
                } else {
                    this.distance = distance;
                }
                this.stiffness = stiffness;
            }
            DistanceConstraint.prototype.relax = function (stepCoef) {
                var normal = this.a.pos.sub(this.b.pos);
                var m = normal.length2();
                normal.mutableScale(((this.distance * this.distance - m) / m) * this.stiffness * stepCoef);
                this.a.pos.mutableAdd(normal);
                this.b.pos.mutableSub(normal);
            };
            DistanceConstraint.prototype.render = function (ctx) {
                ctx.beginPath();
                ctx.moveTo(this.a.pos.x, this.a.pos.y);
                ctx.lineTo(this.b.pos.x, this.b.pos.y);
                ctx.strokeStyle = "#d8dde2";
                ctx.stroke();
                ctx.closePath();
            };
            return DistanceConstraint;
        })();
        Verlet.DistanceConstraint = DistanceConstraint;        
    })(Phaser.Verlet || (Phaser.Verlet = {}));
    var Verlet = Phaser.Verlet;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    /// <reference path="../Game.ts" />
    /// <reference path="Particle.ts" />
    /// <reference path="../geom/Vector2.ts" />
    /**
    * Phaser - AngleConstraint
    *
    * constrains 3 particles to an angle
    */
    (function (Verlet) {
        var AngleConstraint = (function () {
            /**
            * Creates a new AngleConstraint object.
            * @class AngleConstraint
            * @constructor
            * @param {Number} x The x coordinate of vector2
            * @param {Number} y The y coordinate of vector2
            * @return {AngleConstraint} This object
            **/
            function AngleConstraint(a, b, c, stiffness) {
                this.a = a;
                this.b = b;
                this.c = c;
                this.angle = this.b.pos.angle2(this.a.pos, this.c.pos);
                this.stiffness = stiffness;
            }
            AngleConstraint.prototype.relax = function (stepCoef) {
                var angle = this.b.pos.angle2(this.a.pos, this.c.pos);
                var diff = angle - this.angle;
                if(diff <= -Math.PI) {
                    diff += 2 * Math.PI;
                } else if(diff >= Math.PI) {
                    diff -= 2 * Math.PI;
                }
                diff *= stepCoef * this.stiffness;
                this.a.pos = this.a.pos.rotate(this.b.pos, diff);
                this.c.pos = this.c.pos.rotate(this.b.pos, -diff);
                this.b.pos = this.b.pos.rotate(this.a.pos, diff);
                this.b.pos = this.b.pos.rotate(this.c.pos, -diff);
            };
            AngleConstraint.prototype.render = function (ctx) {
                ctx.beginPath();
                ctx.moveTo(this.a.pos.x, this.a.pos.y);
                ctx.lineTo(this.b.pos.x, this.b.pos.y);
                ctx.lineTo(this.c.pos.x, this.c.pos.y);
                var tmp = ctx.lineWidth;
                ctx.lineWidth = 5;
                ctx.strokeStyle = "rgba(255,255,0,0.2)";
                ctx.stroke();
                ctx.lineWidth = tmp;
            };
            return AngleConstraint;
        })();
        Verlet.AngleConstraint = AngleConstraint;        
    })(Phaser.Verlet || (Phaser.Verlet = {}));
    var Verlet = Phaser.Verlet;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    /// <reference path="Game.ts" />
    /// <reference path="geom/Vector2.ts" />
    /// <reference path="verlet/Composite.ts" />
    /// <reference path="verlet/Particle.ts" />
    /// <reference path="verlet/DistanceConstraint.ts" />
    /// <reference path="verlet/PinConstraint.ts" />
    /// <reference path="verlet/AngleConstraint.ts" />
    /**
    * Phaser - Verlet
    *
    * Based on verlet-js by Sub Protocol released under MIT
    */
    (function (Verlet) {
        var VerletManager = (function () {
            /**
            * Creates a new Vector2 object.
            * @class Vector2
            * @constructor
            * @param {Number} x The x coordinate of vector2
            * @param {Number} y The y coordinate of vector2
            * @return {Vector2} This object
            **/
            function VerletManager(game, width, height) {
                this._v = new Phaser.Vector2();
                this.composites = [];
                this.step = 16;
                this.selectionRadius = 20;
                this.draggedEntity = null;
                this.highlightColor = '#4f545c';
                this.hideNearestEntityCircle = false;
                this._game = game;
                this.width = width;
                this.height = height;
                this.gravity = new Phaser.Vector2(0, 0.2);
                this.friction = 0.99;
                this.groundFriction = 0.8;
                this.canvas = game.stage.canvas;
                this.context = game.stage.context;
                this._game.input.onDown.add(this.mouseDownHandler, this);
                this._game.input.onUp.add(this.mouseUpHandler, this);
            }
            VerletManager.prototype.intersectionTime = /**
            * Computes time of intersection of a particle with a wall
            *
            * @param {Vec2} line    walls root position
            * @param {Vec2} p       particle position
            * @param {Vec2} dir     walls direction
            * @param {Vec2} v       particles velocity
            */
            function (wall, p, dir, v) {
                if(dir.x != 0) {
                    var denominator = v.y - dir.y * v.x / dir.x;
                    if(denominator == 0) {
                        return undefined;
                    }// Movement is parallel to wall
                    
                    var numerator = wall.y + dir.y * (p.x - wall.x) / dir.x - p.y;
                    return numerator / denominator;
                } else {
                    if(v.x == 0) {
                        return undefined;
                    }// parallel again
                    
                    var denominator = v.x;
                    var numerator = wall.x - p.x;
                    return numerator / denominator;
                }
            };
            VerletManager.prototype.intersectionPoint = function (wall, p, dir, v) {
                var t = this.intersectionTime(wall, p, dir, v);
                return new Phaser.Vector2(p.x + v.x * t, p.y + v.y * t);
            };
            VerletManager.prototype.bounds = function (particle) {
                this._v.mutableSet(particle.pos);
                this._v.mutableSub(particle.lastPos);
                if(particle.pos.y > this.height - 1) {
                    particle.pos.mutableSet(this.intersectionPoint(new Phaser.Vector2(0, this.height - 1), particle.lastPos, new Phaser.Vector2(1, 0), this._v));
                }
                if(particle.pos.x < 0) {
                    particle.pos.mutableSet(this.intersectionPoint(new Phaser.Vector2(0, 0), particle.pos, new Phaser.Vector2(0, 1), this._v));
                }
                if(particle.pos.x > this.width - 1) {
                    particle.pos.mutableSet(this.intersectionPoint(new Phaser.Vector2(this.width - 1, 0), particle.pos, new Phaser.Vector2(0, 1), this._v));
                }
            };
            VerletManager.prototype.createPoint = function (pos) {
                var composite = new Phaser.Verlet.Composite(this._game);
                composite.particles.push(new Phaser.Verlet.Particle(pos));
                this.composites.push(composite);
                return composite;
            };
            VerletManager.prototype.createLineSegments = function (vertices, stiffness) {
                var composite = new Phaser.Verlet.Composite(this._game);
                var i;
                for(i in vertices) {
                    composite.particles.push(new Phaser.Verlet.Particle(vertices[i]));
                    if(i > 0) {
                        composite.constraints.push(new Phaser.Verlet.DistanceConstraint(composite.particles[i], composite.particles[i - 1], stiffness));
                    }
                }
                this.composites.push(composite);
                return composite;
            };
            VerletManager.prototype.createCloth = function (origin, width, height, segments, pinMod, stiffness) {
                var composite = new Phaser.Verlet.Composite(this._game);
                var xStride = width / segments;
                var yStride = height / segments;
                var x;
                var y;
                for(y = 0; y < segments; ++y) {
                    for(x = 0; x < segments; ++x) {
                        var px = origin.x + x * xStride - width / 2 + xStride / 2;
                        var py = origin.y + y * yStride - height / 2 + yStride / 2;
                        composite.particles.push(new Phaser.Verlet.Particle(new Phaser.Vector2(px, py)));
                        if(x > 0) {
                            composite.constraints.push(new Phaser.Verlet.DistanceConstraint(composite.particles[y * segments + x], composite.particles[y * segments + x - 1], stiffness));
                        }
                        if(y > 0) {
                            composite.constraints.push(new Phaser.Verlet.DistanceConstraint(composite.particles[y * segments + x], composite.particles[(y - 1) * segments + x], stiffness));
                        }
                    }
                }
                for(x = 0; x < segments; ++x) {
                    if(x % pinMod == 0) {
                        composite.pin(x);
                    }
                }
                this.composites.push(composite);
                return composite;
            };
            VerletManager.prototype.createTire = function (origin, radius, segments, spokeStiffness, treadStiffness) {
                var stride = (2 * Math.PI) / segments;
                var i;
                var composite = new Phaser.Verlet.Composite(this._game);
                // particles
                for(i = 0; i < segments; ++i) {
                    var theta = i * stride;
                    composite.particles.push(new Verlet.Particle(new Phaser.Vector2(origin.x + Math.cos(theta) * radius, origin.y + Math.sin(theta) * radius)));
                }
                var center = new Verlet.Particle(origin);
                composite.particles.push(center);
                // constraints
                for(i = 0; i < segments; ++i) {
                    composite.constraints.push(new Verlet.DistanceConstraint(composite.particles[i], composite.particles[(i + 1) % segments], treadStiffness));
                    composite.constraints.push(new Verlet.DistanceConstraint(composite.particles[i], center, spokeStiffness));
                    composite.constraints.push(new Verlet.DistanceConstraint(composite.particles[i], composite.particles[(i + 5) % segments], treadStiffness));
                }
                this.composites.push(composite);
                return composite;
            };
            VerletManager.prototype.update = function () {
                if(this.composites.length == 0) {
                    return;
                }
                var i, j, c;
                for(c in this.composites) {
                    for(i in this.composites[c].particles) {
                        var particles = this.composites[c].particles;
                        // calculate velocity
                        var velocity = particles[i].pos.sub(particles[i].lastPos).scale(this.friction);
                        // ground friction
                        if(particles[i].pos.y >= this.height - 1 && velocity.length2() > 0.000001) {
                            var m = velocity.length();
                            velocity.x /= m;
                            velocity.y /= m;
                            velocity.mutableScale(m * this.groundFriction);
                        }
                        // save last good state
                        particles[i].lastPos.mutableSet(particles[i].pos);
                        // gravity
                        particles[i].pos.mutableAdd(this.gravity);
                        // inertia
                        particles[i].pos.mutableAdd(velocity);
                    }
                }
                // handle dragging of entities
                if(this.draggedEntity) {
                    this.draggedEntity.pos.mutableSet(this._game.input.position);
                }
                // relax
                var stepCoef = 1 / this.step;
                for(c in this.composites) {
                    var constraints = this.composites[c].constraints;
                    for(i = 0; i < this.step; ++i) {
                        for(j in constraints) {
                            constraints[j].relax(stepCoef);
                        }
                    }
                }
                // bounds checking
                for(c in this.composites) {
                    var particles = this.composites[c].particles;
                    for(i in particles) {
                        this.bounds(particles[i]);
                    }
                }
            };
            VerletManager.prototype.mouseDownHandler = function () {
                var nearest = this.nearestEntity();
                if(nearest) {
                    this.draggedEntity = nearest;
                }
            };
            VerletManager.prototype.mouseUpHandler = function () {
                this.draggedEntity = null;
            };
            VerletManager.prototype.nearestEntity = function () {
                var c, i;
                var d2Nearest = 0;
                var entity = null;
                var constraintsNearest = null;
                // find nearest point
                for(c in this.composites) {
                    var particles = this.composites[c].particles;
                    for(i in particles) {
                        var d2 = particles[i].pos.distance2(this._game.input.position);
                        if(d2 <= this.selectionRadius * this.selectionRadius && (entity == null || d2 < d2Nearest)) {
                            entity = particles[i];
                            constraintsNearest = this.composites[c].constraints;
                            d2Nearest = d2;
                        }
                    }
                }
                // search for pinned constraints for this entity
                for(i in constraintsNearest) {
                    if(constraintsNearest[i] instanceof Verlet.PinConstraint && constraintsNearest[i].a == entity) {
                        entity = constraintsNearest[i];
                    }
                }
                return entity;
            };
            VerletManager.prototype.render = function () {
                var i, c;
                for(c in this.composites) {
                    // draw constraints
                    if(this.composites[c].drawConstraints) {
                        this.composites[c].drawConstraints(this.context, this.composites[c]);
                    } else {
                        var constraints = this.composites[c].constraints;
                        for(i in constraints) {
                            constraints[i].render(this.context);
                        }
                    }
                    // draw particles
                    if(this.composites[c].drawParticles) {
                        this.composites[c].drawParticles(this.context, this.composites[c]);
                    } else {
                        var particles = this.composites[c].particles;
                        for(i in particles) {
                            particles[i].render(this.context);
                        }
                    }
                }
                // highlight nearest / dragged entity
                var nearest = this.draggedEntity || this.nearestEntity();
                if(nearest && this.hideNearestEntityCircle == false) {
                    this.context.beginPath();
                    this.context.arc(nearest.pos.x, nearest.pos.y, 8, 0, 2 * Math.PI);
                    this.context.strokeStyle = this.highlightColor;
                    this.context.stroke();
                    this.context.closePath();
                }
            };
            return VerletManager;
        })();
        Verlet.VerletManager = VerletManager;        
    })(Phaser.Verlet || (Phaser.Verlet = {}));
    var Verlet = Phaser.Verlet;
})(Phaser || (Phaser = {}));
/// <reference path="Game.ts" />
/**
* Phaser - World
*
* "This world is but a canvas to our imagination." - Henry David Thoreau
*
* A game has only one world. The world is an abstract place in which all game objects live. It is not bound
* by stage limits and can be any size or dimension. You look into the world via cameras and all game objects
* live within the world at world-based coordinates. By default a world is created the same size as your Stage.
*/
var Phaser;
(function (Phaser) {
    var World = (function () {
        /**
        * World constructor
        * Create a new <code>World</code> with specific width and height.
        *
        * @param width {number} Width of the world bound.
        * @param height {number} Height of the world bound.
        */
        function World(game, width, height) {
            this._game = game;
            this.cameras = new Phaser.CameraManager(this._game, 0, 0, width, height);
            this.group = new Phaser.Group(this._game, 0);
            this.bounds = new Phaser.Rectangle(0, 0, width, height);
            this.worldDivisions = 6;
        }
        World.prototype.update = /**
        * This is called automatically every frame, and is where main logic performs.
        */
        function () {
            this.group.preUpdate();
            this.group.update();
            this.group.postUpdate();
            this.cameras.update();
        };
        World.prototype.render = /**
        * Render every thing to the screen, automatically called after update().
        */
        function () {
            //  Unlike in flixel our render process is camera driven, not group driven
            this.cameras.render();
        };
        World.prototype.destroy = /**
        * Clean up memory.
        */
        function () {
            this.group.destroy();
            this.cameras.destroy();
        };
        World.prototype.setSize = //  World methods
        /**
        * Update size of this world with specific width and height.
        * You can choose update camera bounds and verlet manager automatically or not.
        *
        * @param width {number} New width of the world.
        * @param height {number} New height of the world.
        * @param [updateCameraBounds] {boolean} update camera bounds automatically or not. Default to true.
        * @param [updateVerletBounds] {boolean} update verlet bounds automatically or not. Default to true.
        */
        function (width, height, updateCameraBounds, updateVerletBounds) {
            if (typeof updateCameraBounds === "undefined") { updateCameraBounds = true; }
            if (typeof updateVerletBounds === "undefined") { updateVerletBounds = true; }
            this.bounds.width = width;
            this.bounds.height = height;
            if(updateCameraBounds == true) {
                this._game.camera.setBounds(0, 0, width, height);
            }
            if(updateVerletBounds == true) {
                this._game.verlet.width = width;
                this._game.verlet.height = height;
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
        World.prototype.createCamera = //  Cameras
        /**
        * Create a new camera with specific position and size.
        *
        * @param x {number} X position of the new camera.
        * @param y {number} Y position of the new camera.
        * @param width {number} Width of the new camera.
        * @param height {number} Height of the new camera.
        * @returns {Camera} The newly created camera object.
        */
        function (x, y, width, height) {
            return this.cameras.addCamera(x, y, width, height);
        };
        World.prototype.removeCamera = /**
        * Remove a new camera with its id.
        *
        * @param id {number} ID of the camera you want to remove.
        * @returns {boolean}   True if successfully removed the camera, otherwise return false.
        */
        function (id) {
            return this.cameras.removeCamera(id);
        };
        World.prototype.getAllCameras = /**
        * Get all the cameras.
        *
        * @returns {array} An array contains all the cameras.
        */
        function () {
            return this.cameras.getAll();
        };
        World.prototype.createSprite = //  Game Objects
        /**
        * Create a new Sprite with specific position and sprite sheet key.
        *
        * @param x {number} X position of the new sprite.
        * @param y {number} Y position of the new sprite.
        * @param [key] {string} key for the sprite sheet you want it to use.
        * @returns {Sprite} The newly created sprite object.
        */
        function (x, y, key) {
            if (typeof key === "undefined") { key = ''; }
            return this.group.add(new Phaser.Sprite(this._game, x, y, key));
        };
        World.prototype.createGeomSprite = /**
        * Create a new GeomSprite with specific position.
        *
        * @param x {number} X position of the new geom sprite.
        * @param y {number} Y position of the new geom sprite.
        * @returns {GeomSprite} The newly created geom sprite object.
        */
        function (x, y) {
            return this.group.add(new Phaser.GeomSprite(this._game, x, y));
        };
        World.prototype.createDynamicTexture = /**
        * Create a new DynamicTexture with specific size.
        *
        * @param width {number} Width of the texture.
        * @param height {number} Height of the texture.
        * @returns {DynamicTexture} The newly created dynamic texture object.
        */
        function (width, height) {
            return new Phaser.DynamicTexture(this._game, width, height);
        };
        World.prototype.createGroup = /**
        * Create a new object container.
        *
        * @param [maxSize] {number} capacity of this group.
        * @returns {Group} The newly created group.
        */
        function (maxSize) {
            if (typeof maxSize === "undefined") { maxSize = 0; }
            return this.group.add(new Phaser.Group(this._game, maxSize));
        };
        World.prototype.createScrollZone = /**
        * Create a new ScrollZone object with image key, position and size.
        *
        * @param key {number} Key to a image you wish this object to use.
        * @param x {number} X position of this object.
        * @param y {number} Y position of this object.
        * @param width {number} Width of this object.
        * @param height {number} Height of this object.
        * @returns {ScrollZone} The newly created scroll zone object.
        */
        function (key, x, y, width, height) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            if (typeof width === "undefined") { width = 0; }
            if (typeof height === "undefined") { height = 0; }
            return this.group.add(new Phaser.ScrollZone(this._game, key, x, y, width, height));
        };
        World.prototype.createTilemap = /**
        * Create a new Tilemap.
        *
        * @param key {string} Key for tileset image.
        * @param mapData {string} Data of this tilemap.
        * @param format {number} Format of map data. (Tilemap.FORMAT_CSV or Tilemap.FORMAT_TILED_JSON)
        * @param [resizeWorld] {boolean} resize the world to make same as tilemap?
        * @param [tileWidth] {number} width of each tile.
        * @param [tileHeight] {number} height of each tile.
        * @return {Tilemap} The newly created tilemap object.
        */
        function (key, mapData, format, resizeWorld, tileWidth, tileHeight) {
            if (typeof resizeWorld === "undefined") { resizeWorld = true; }
            if (typeof tileWidth === "undefined") { tileWidth = 0; }
            if (typeof tileHeight === "undefined") { tileHeight = 0; }
            return this.group.add(new Phaser.Tilemap(this._game, key, mapData, format, resizeWorld, tileWidth, tileHeight));
        };
        World.prototype.createParticle = /**
        * Create a new Particle.
        *
        * @return {Particle} The newly created particle object.
        */
        function () {
            return new Phaser.Particle(this._game);
        };
        World.prototype.createEmitter = /**
        * Create a new Emitter.
        *
        * @param [x] {number} x position of the emitter.
        * @param [y] {number} y position of the emitter.
        * @param [size] {number} size of this emitter.
        * @return {Emitter} The newly created emitter object.
        */
        function (x, y, size) {
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
        * Device constructor
        */
        function Device() {
            //  Operating System
            /**
            * Is running desktop?
            * @type {boolean}
            */
            this.desktop = false;
            /**
            * Is running on iOS?
            * @type {boolean}
            */
            this.iOS = false;
            /**
            * Is running on android?
            * @type {boolean}
            */
            this.android = false;
            /**
            * Is running on chromeOS?
            * @type {boolean}
            */
            this.chromeOS = false;
            /**
            * Is running on linux?
            * @type {boolean}
            */
            this.linux = false;
            /**
            * Is running on maxOS?
            * @type {boolean}
            */
            this.macOS = false;
            /**
            * Is running on windows?
            * @type {boolean}
            */
            this.windows = false;
            //  Features
            /**
            * Is canvas available?
            * @type {boolean}
            */
            this.canvas = false;
            /**
            * Is file available?
            * @type {boolean}
            */
            this.file = false;
            /**
            * Is fileSystem available?
            * @type {boolean}
            */
            this.fileSystem = false;
            /**
            * Is localStorage available?
            * @type {boolean}
            */
            this.localStorage = false;
            /**
            * Is webGL available?
            * @type {boolean}
            */
            this.webGL = false;
            /**
            * Is worker available?
            * @type {boolean}
            */
            this.worker = false;
            /**
            * Is touch available?
            * @type {boolean}
            */
            this.touch = false;
            /**
            * Is mspointer available?
            * @type {boolean}
            */
            this.mspointer = false;
            /**
            * Is css3D available?
            * @type {boolean}
            */
            this.css3D = false;
            //  Browser
            /**
            * Is running in arora?
            * @type {boolean}
            */
            this.arora = false;
            /**
            * Is running in chrome?
            * @type {boolean}
            */
            this.chrome = false;
            /**
            * Is running in epiphany?
            * @type {boolean}
            */
            this.epiphany = false;
            /**
            * Is running in firefox?
            * @type {boolean}
            */
            this.firefox = false;
            /**
            * Is running in ie?
            * @type {boolean}
            */
            this.ie = false;
            /**
            * Version of ie?
            * @type Number
            */
            this.ieVersion = 0;
            /**
            * Is running in mobileSafari?
            * @type {boolean}
            */
            this.mobileSafari = false;
            /**
            * Is running in midori?
            * @type {boolean}
            */
            this.midori = false;
            /**
            * Is running in opera?
            * @type {boolean}
            */
            this.opera = false;
            /**
            * Is running in safari?
            * @type {boolean}
            */
            this.safari = false;
            this.webApp = false;
            //  Audio
            /**
            * Is audioData available?
            * @type {boolean}
            */
            this.audioData = false;
            /**
            * Is webaudio available?
            * @type {boolean}
            */
            this.webaudio = false;
            /**
            * Is ogg available?
            * @type {boolean}
            */
            this.ogg = false;
            /**
            * Is mp3 available?
            * @type {boolean}
            */
            this.mp3 = false;
            /**
            * Is wav available?
            * @type {boolean}
            */
            this.wav = false;
            /**
            * Is m4a available?
            * @type {boolean}
            */
            this.m4a = false;
            //  Device
            /**
            * Is running on iPhone?
            * @type {boolean}
            */
            this.iPhone = false;
            /**
            * Is running on iPhone4?
            * @type {boolean}
            */
            this.iPhone4 = false;
            /**
            * Is running on iPad?
            * @type {boolean}
            */
            this.iPad = false;
            /**
            * PixelRatio of the host device?
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
        * Check which OS is game running on.
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
        * Check HTML5 features of the host environment.
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
            if(window.navigator.msPointerEnabled) {
                this.mspointer = true;
            }
        };
        Device.prototype._checkBrowser = /**
        * Check what browser is game running in.
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
        * Check audio support.
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
        * Check PixelRatio of devices.
        * @private
        */
        function () {
            this.pixelRatio = window['devicePixelRatio'] || 1;
            this.iPhone = navigator.userAgent.toLowerCase().indexOf('iphone') != -1;
            this.iPhone4 = (this.pixelRatio == 2 && this.iPhone);
            this.iPad = navigator.userAgent.toLowerCase().indexOf('ipad') != -1;
        };
        Device.prototype._checkCSS3D = /**
        * Check whether the host environment support 3D CSS.
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
        Device.prototype.isConsoleOpen = function () {
            if(window.console && window.console['firebug']) {
                return true;
            }
            if(window.console) {
                console.profile();
                console.profileEnd();
                if(console.clear) {
                    console.clear();
                }
                return console['profiles'].length > 0;
            }
            return false;
        };
        Device.prototype.getAll = /**
        * Get all informations of host device.
        * @return {string} Informations in a string.
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
            output = output.concat('MSPointer: ' + this.mspointer + '\n');
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
        function RequestAnimationFrame(game, callback) {
            /**
            *
            * @property _isSetTimeOut
            * @type Boolean
            * @private
            **/
            this._isSetTimeOut = false;
            /**
            *
            * @property isRunning
            * @type Boolean
            **/
            this.isRunning = false;
            this._game = game;
            this.callback = callback;
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
            return this._isSetTimeOut === true;
        };
        RequestAnimationFrame.prototype.start = /**
        * Starts the requestAnimatioFrame running or setTimeout if unavailable in browser
        * @method start
        * @param {Any} [callback]
        **/
        function (callback) {
            if (typeof callback === "undefined") { callback = null; }
            var _this = this;
            if(callback) {
                this.callback = callback;
            }
            if(!window.requestAnimationFrame) {
                this._isSetTimeOut = true;
                this._timeOutID = window.setTimeout(function () {
                    return _this.SetTimeoutUpdate();
                }, 0);
            } else {
                this._isSetTimeOut = false;
                window.requestAnimationFrame(function () {
                    return _this.RAFUpdate(0);
                });
            }
            this.isRunning = true;
        };
        RequestAnimationFrame.prototype.stop = /**
        * Stops the requestAnimationFrame from running
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
        RequestAnimationFrame.prototype.RAFUpdate = /**
        * The update method for the requestAnimationFrame
        * @method RAFUpdate
        **/
        function (time) {
            var _this = this;
            this._game.time.update(time);
            if(this.callback) {
                this.callback.call(this._game);
            }
            window.requestAnimationFrame(function (time) {
                return _this.RAFUpdate(time);
            });
        };
        RequestAnimationFrame.prototype.SetTimeoutUpdate = /**
        * The update method for the setTimeout
        * @method SetTimeoutUpdate
        **/
        function () {
            var _this = this;
            this._game.time.update(Date.now());
            this._timeOutID = window.setTimeout(function () {
                return _this.SetTimeoutUpdate();
            }, 16.7);
            if(this.callback) {
                this.callback.call(this._game);
            }
        };
        return RequestAnimationFrame;
    })();
    Phaser.RequestAnimationFrame = RequestAnimationFrame;    
})(Phaser || (Phaser = {}));
/// <reference path="../../Game.ts" />
/// <reference path="../../geom/Vector2.ts" />
/**
* Phaser - Pointer
*
* A Pointer object is used by the Touch and MSPoint managers and represents a single finger on the touch screen.
*/
var Phaser;
(function (Phaser) {
    var Pointer = (function () {
        /**
        * Constructor
        * @param {Phaser.Game} game.
        * @return {Phaser.Pointer} This object.
        */
        function Pointer(game, id) {
            /**
            * Local private variable to store the status of dispatching a hold event
            * @property _holdSent
            * @type {Boolean}
            * @private
            */
            this._holdSent = false;
            /**
            * Local private variable storing the short-term history of pointer movements
            * @property _history
            * @type {Array}
            * @private
            */
            this._history = [];
            /**
            * Local private variable storing the time at which the next history drop should occur
            * @property _lastDrop
            * @type {Number}
            * @private
            */
            this._nextDrop = 0;
            /**
            * A Vector object containing the initial position when the Pointer was engaged with the screen.
            * @property positionDown
            * @type {Vector2}
            **/
            this.positionDown = null;
            /**
            * A Vector object containing the current position of the Pointer on the screen.
            * @property position
            * @type {Vector2}
            **/
            this.position = null;
            /**
            * A Circle object centered on the x/y screen coordinates of the Pointer.
            * Default size of 44px (Apple's recommended "finger tip" size)
            * @property circle
            * @type {Circle}
            **/
            this.circle = null;
            /**
            *
            * @property withinGame
            * @type {Boolean}
            */
            this.withinGame = false;
            /**
            * The horizontal coordinate of point relative to the viewport in pixels, excluding any scroll offset
            * @property clientX
            * @type {Number}
            */
            this.clientX = -1;
            /**
            * The vertical coordinate of point relative to the viewport in pixels, excluding any scroll offset
            * @property clientY
            * @type {Number}
            */
            this.clientY = -1;
            /**
            * The horizontal coordinate of point relative to the viewport in pixels, including any scroll offset
            * @property pageX
            * @type {Number}
            */
            this.pageX = -1;
            /**
            * The vertical coordinate of point relative to the viewport in pixels, including any scroll offset
            * @property pageY
            * @type {Number}
            */
            this.pageY = -1;
            /**
            * The horizontal coordinate of point relative to the screen in pixels
            * @property screenX
            * @type {Number}
            */
            this.screenX = -1;
            /**
            * The vertical coordinate of point relative to the screen in pixels
            * @property screenY
            * @type {Number}
            */
            this.screenY = -1;
            /**
            * The horizontal coordinate of point relative to the game element
            * @property x
            * @type {Number}
            */
            this.x = -1;
            /**
            * The vertical coordinate of point relative to the game element
            * @property y
            * @type {Number}
            */
            this.y = -1;
            /**
            * If the Pointer is a mouse this is true, otherwise false
            * @property isMouse
            * @type {Boolean}
            **/
            this.isMouse = false;
            /**
            * If the Pointer is touching the touchscreen, or the mouse button is held down, isDown is set to true
            * @property isDown
            * @type {Boolean}
            **/
            this.isDown = false;
            /**
            * If the Pointer is not touching the touchscreen, or the mouse button is up, isUp is set to true
            * @property isUp
            * @type {Boolean}
            **/
            this.isUp = true;
            /**
            * A timestamp representing when the Pointer first touched the touchscreen.
            * @property timeDown
            * @type {Number}
            **/
            this.timeDown = 0;
            /**
            * A timestamp representing when the Pointer left the touchscreen.
            * @property timeUp
            * @type {Number}
            **/
            this.timeUp = 0;
            /**
            * A timestamp representing when the Pointer was last tapped or clicked
            * @property previousTapTime
            * @type {Number}
            **/
            this.previousTapTime = 0;
            /**
            * The total number of times this Pointer has been touched to the touchscreen
            * @property totalTouches
            * @type {Number}
            **/
            this.totalTouches = 0;
            this._game = game;
            this.id = id;
            this.active = false;
            this.position = new Phaser.Vector2();
            this.positionDown = new Phaser.Vector2();
            this.circle = new Phaser.Circle(0, 0, 44);
            if(id == 0) {
                this.isMouse = true;
            }
        }
        Object.defineProperty(Pointer.prototype, "duration", {
            get: /**
            * How long the Pointer has been depressed on the touchscreen. If not currently down it returns -1.
            * @property duration
            * @type {Number}
            **/
            function () {
                if(this.isUp) {
                    return -1;
                }
                return this._game.time.now - this.timeDown;
            },
            enumerable: true,
            configurable: true
        });
        Pointer.prototype.getWorldX = /**
        * Gets the X value of this Pointer in world coordinate space
        * @param {Camera} [camera]
        */
        function (camera) {
            if (typeof camera === "undefined") { camera = this._game.camera; }
            return camera.worldView.x + this.x;
        };
        Pointer.prototype.getWorldY = /**
        * Gets the Y value of this Pointer in world coordinate space
        * @param {Camera} [camera]
        */
        function (camera) {
            if (typeof camera === "undefined") { camera = this._game.camera; }
            return camera.worldView.y + this.y;
        };
        Pointer.prototype.start = /**
        * Called when the Pointer is pressed onto the touchscreen
        * @method start
        * @param {Any} event
        */
        function (event) {
            this.identifier = event.identifier;
            this.target = event.target;
            if(event.button) {
                this.button = event.button;
            }
            //  Fix to stop rogue browser plugins from blocking the visibility state event
            if(this._game.paused == true) {
                this._game.stage.resumeGame();
                return this;
            }
            this._history.length = 0;
            this.move(event);
            this.positionDown.setTo(this.x, this.y);
            this.active = true;
            this.withinGame = true;
            this.isDown = true;
            this.isUp = false;
            this.timeDown = this._game.time.now;
            this._holdSent = false;
            if(this._game.input.multiInputOverride == Phaser.Input.MOUSE_OVERRIDES_TOUCH || this._game.input.multiInputOverride == Phaser.Input.MOUSE_TOUCH_COMBINE || (this._game.input.multiInputOverride == Phaser.Input.TOUCH_OVERRIDES_MOUSE && this._game.input.currentPointers == 0)) {
                this._game.input.x = this.x * this._game.input.scaleX;
                this._game.input.y = this.y * this._game.input.scaleY;
                this._game.input.onDown.dispatch(this);
            }
            this.totalTouches++;
            if(this.isMouse == false) {
                this._game.input.currentPointers++;
            }
            return this;
        };
        Pointer.prototype.update = function () {
            if(this.active) {
                if(this._holdSent == false && this.duration >= this._game.input.holdRate) {
                    if(this._game.input.multiInputOverride == Phaser.Input.MOUSE_OVERRIDES_TOUCH || this._game.input.multiInputOverride == Phaser.Input.MOUSE_TOUCH_COMBINE || (this._game.input.multiInputOverride == Phaser.Input.TOUCH_OVERRIDES_MOUSE && this._game.input.currentPointers == 0)) {
                        this._game.input.onHold.dispatch(this);
                    }
                    this._holdSent = true;
                }
                //  Update the droppings history
                if(this._game.input.recordPointerHistory && this._game.time.now >= this._nextDrop) {
                    this._nextDrop = this._game.time.now + this._game.input.recordRate;
                    this._history.push({
                        x: this.position.x,
                        y: this.position.y
                    });
                    if(this._history.length > this._game.input.recordLimit) {
                        this._history.shift();
                    }
                }
            }
        };
        Pointer.prototype.move = /**
        * Called when the Pointer is moved on the touchscreen
        * @method move
        * @param {Any} event
        */
        function (event) {
            if(event.button) {
                this.button = event.button;
            }
            this.clientX = event.clientX;
            this.clientY = event.clientY;
            this.pageX = event.pageX;
            this.pageY = event.pageY;
            this.screenX = event.screenX;
            this.screenY = event.screenY;
            this.x = this.pageX - this._game.stage.offset.x;
            this.y = this.pageY - this._game.stage.offset.y;
            this.position.setTo(this.x, this.y);
            this.circle.x = this.x;
            this.circle.y = this.y;
            if(this._game.input.multiInputOverride == Phaser.Input.MOUSE_OVERRIDES_TOUCH || this._game.input.multiInputOverride == Phaser.Input.MOUSE_TOUCH_COMBINE || (this._game.input.multiInputOverride == Phaser.Input.TOUCH_OVERRIDES_MOUSE && this._game.input.currentPointers == 0)) {
                this._game.input.x = this.x * this._game.input.scaleX;
                this._game.input.y = this.y * this._game.input.scaleY;
                this._game.input.position.setTo(this._game.input.x, this._game.input.y);
                this._game.input.circle.x = this._game.input.x;
                this._game.input.circle.y = this._game.input.y;
            }
            return this;
        };
        Pointer.prototype.leave = /**
        * Called when the Pointer leaves the target area
        * @method leave
        * @param {Any} event
        */
        function (event) {
            this.withinGame = false;
            this.move(event);
        };
        Pointer.prototype.stop = /**
        * Called when the Pointer leaves the touchscreen
        * @method stop
        * @param {Any} event
        */
        function (event) {
            this.timeUp = this._game.time.now;
            if(this._game.input.multiInputOverride == Phaser.Input.MOUSE_OVERRIDES_TOUCH || this._game.input.multiInputOverride == Phaser.Input.MOUSE_TOUCH_COMBINE || (this._game.input.multiInputOverride == Phaser.Input.TOUCH_OVERRIDES_MOUSE && this._game.input.currentPointers == 0)) {
                this._game.input.onUp.dispatch(this);
                //  Was it a tap?
                if(this.duration >= 0 && this.duration <= this._game.input.tapRate) {
                    //  Was it a double-tap?
                    if(this.timeUp - this.previousTapTime < this._game.input.doubleTapRate) {
                        //  Yes, let's dispatch the signal then with the 2nd parameter set to true
                        this._game.input.onTap.dispatch(this, true);
                    } else {
                        //  Wasn't a double-tap, so dispatch a single tap signal
                        this._game.input.onTap.dispatch(this, false);
                    }
                    this.previousTapTime = this.timeUp;
                }
            }
            this.active = false;
            this.withinGame = false;
            this.isDown = false;
            this.isUp = true;
            if(this.isMouse == false) {
                this._game.input.currentPointers--;
            }
            return this;
        };
        Pointer.prototype.justPressed = /**
        * The Pointer is considered justPressed if the time it was pressed onto the touchscreen or clicked is less than justPressedRate
        * @method justPressed
        * @param {Number} [duration].
        * @return {Boolean}
        */
        function (duration) {
            if (typeof duration === "undefined") { duration = this._game.input.justPressedRate; }
            if(this.isDown === true && (this.timeDown + duration) > this._game.time.now) {
                return true;
            } else {
                return false;
            }
        };
        Pointer.prototype.justReleased = /**
        * The Pointer is considered justReleased if the time it left the touchscreen is less than justReleasedRate
        * @method justReleased
        * @param {Number} [duration].
        * @return {Boolean}
        */
        function (duration) {
            if (typeof duration === "undefined") { duration = this._game.input.justReleasedRate; }
            if(this.isUp === true && (this.timeUp + duration) > this._game.time.now) {
                return true;
            } else {
                return false;
            }
        };
        Pointer.prototype.reset = /**
        * Resets the Pointer properties. Called by Input.reset when you perform a State change.
        * @method reset
        */
        function () {
            this.active = false;
            this.identifier = null;
            this.isDown = false;
            this.isUp = true;
            this.totalTouches = 0;
            this._holdSent = false;
            this._history.length = 0;
        };
        Pointer.prototype.renderDebug = /**
        * Renders the Pointer.circle object onto the stage in green if down or red if up.
        * @method renderDebug
        */
        function (hideIfUp) {
            if (typeof hideIfUp === "undefined") { hideIfUp = false; }
            if(hideIfUp == true && this.isUp == true) {
                return;
            }
            this._game.stage.context.beginPath();
            this._game.stage.context.arc(this.x, this.y, this.circle.radius, 0, Math.PI * 2);
            if(this.active) {
                this._game.stage.context.fillStyle = 'rgba(0,255,0,0.5)';
                this._game.stage.context.strokeStyle = 'rgb(0,255,0)';
            } else {
                this._game.stage.context.fillStyle = 'rgba(255,0,0,0.5)';
                this._game.stage.context.strokeStyle = 'rgb(100,0,0)';
            }
            this._game.stage.context.fill();
            this._game.stage.context.closePath();
            //  Render the points
            this._game.stage.context.beginPath();
            this._game.stage.context.moveTo(this.positionDown.x, this.positionDown.y);
            this._game.stage.context.lineTo(this.position.x, this.position.y);
            this._game.stage.context.lineWidth = 2;
            this._game.stage.context.stroke();
            this._game.stage.context.closePath();
            //  Render the text
            this._game.stage.context.fillStyle = 'rgb(255,255,255)';
            this._game.stage.context.font = 'Arial 16px';
            this._game.stage.context.fillText('ID: ' + this.id + " Active: " + this.active, this.x, this.y - 100);
            this._game.stage.context.fillText('Screen X: ' + this.x + " Screen Y: " + this.y, this.x, this.y - 80);
            this._game.stage.context.fillText('Duration: ' + this.duration + " ms", this.x, this.y - 60);
        };
        Pointer.prototype.toString = /**
        * Returns a string representation of this object.
        * @method toString
        * @return {String} a string representation of the instance.
        **/
        function () {
            return "[{Pointer (id=" + this.id + " identifer=" + this.identifier + " active=" + this.active + " duration=" + this.duration + " withinGame=" + this.withinGame + " x=" + this.x + " y=" + this.y + " clientX=" + this.clientX + " clientY=" + this.clientY + " screenX=" + this.screenX + " screenY=" + this.screenY + " pageX=" + this.pageX + " pageY=" + this.pageY + ")}]";
        };
        return Pointer;
    })();
    Phaser.Pointer = Pointer;    
})(Phaser || (Phaser = {}));
/// <reference path="../../Game.ts" />
/// <reference path="Pointer.ts" />
/**
* Phaser - MSPointer
*
* The MSPointer class handles touch interactions with the game and the resulting Pointer objects.
* It will work only in Internet Explorer 10 and Windows Store or Windows Phone 8 apps using JavaScript.
* http://msdn.microsoft.com/en-us/library/ie/hh673557(v=vs.85).aspx
*/
var Phaser;
(function (Phaser) {
    var MSPointer = (function () {
        /**
        * Constructor
        * @param {Game} game.
        * @return {MSPointer} This object.
        */
        function MSPointer(game) {
            /**
            * You can disable all Input by setting disabled = true. While set all new input related events will be ignored.
            * @type {Boolean}
            */
            this.disabled = false;
            this._game = game;
        }
        MSPointer.prototype.start = /**
        * Starts the event listeners running
        * @method start
        */
        function () {
            var _this = this;
            if(this._game.device.mspointer == true) {
                this._game.stage.canvas.addEventListener('MSPointerDown', function (event) {
                    return _this.onPointerDown(event);
                }, false);
                this._game.stage.canvas.addEventListener('MSPointerMove', function (event) {
                    return _this.onPointerMove(event);
                }, false);
                this._game.stage.canvas.addEventListener('MSPointerUp', function (event) {
                    return _this.onPointerUp(event);
                }, false);
            }
        };
        MSPointer.prototype.onPointerDown = /**
        *
        * @method onPointerDown
        * @param {Any} event
        **/
        function (event) {
            if(this._game.input.disabled || this.disabled) {
                return;
            }
            event.preventDefault();
            event.identifier = event.pointerId;
            this._game.input.startPointer(event);
        };
        MSPointer.prototype.onPointerMove = /**
        *
        * @method onPointerMove
        * @param {Any} event
        **/
        function (event) {
            if(this._game.input.disabled || this.disabled) {
                return;
            }
            event.preventDefault();
            event.identifier = event.pointerId;
            this._game.input.updatePointer(event);
        };
        MSPointer.prototype.onPointerUp = /**
        *
        * @method onPointerUp
        * @param {Any} event
        **/
        function (event) {
            if(this._game.input.disabled || this.disabled) {
                return;
            }
            event.preventDefault();
            event.identifier = event.pointerId;
            this._game.input.stopPointer(event);
        };
        MSPointer.prototype.stop = /**
        * Stop the event listeners
        * @method stop
        */
        function () {
            if(this._game.device.mspointer == true) {
                //this._game.stage.canvas.addEventListener('MSPointerDown', (event) => this.onPointerDown(event), false);
                //this._game.stage.canvas.addEventListener('MSPointerMove', (event) => this.onPointerMove(event), false);
                //this._game.stage.canvas.addEventListener('MSPointerUp', (event) => this.onPointerUp(event), false);
                            }
        };
        return MSPointer;
    })();
    Phaser.MSPointer = MSPointer;    
})(Phaser || (Phaser = {}));
/// <reference path="../../Game.ts" />
/// <reference path="Pointer.ts" />
/**
* Phaser - Gestures
*
* The Gesture class monitors for gestures and dispatches the resulting signals when they occur.
* Note: Android 2.x only supports 1 touch event at once, no multi-touch
*/
var Phaser;
(function (Phaser) {
    var Gestures = (function () {
        /**
        * Constructor
        * @param {Game} game.
        * @return {Touch} This object.
        */
        function Gestures(game) {
            this._game = game;
        }
        Gestures.prototype.start = function () {
            //  Local references to the Phaser.Input.pointer objects
            this._p1 = this._game.input.pointer1;
            this._p2 = this._game.input.pointer2;
            this._p3 = this._game.input.pointer3;
            this._p4 = this._game.input.pointer4;
            this._p5 = this._game.input.pointer5;
            this._p6 = this._game.input.pointer6;
            this._p7 = this._game.input.pointer7;
            this._p8 = this._game.input.pointer8;
            this._p9 = this._game.input.pointer9;
            this._p10 = this._game.input.pointer10;
        };
        return Gestures;
    })();
    Phaser.Gestures = Gestures;    
})(Phaser || (Phaser = {}));
/// <reference path="../../Game.ts" />
/// <reference path="../../Signal.ts" />
/// <reference path="Pointer.ts" />
/// <reference path="MSPointer.ts" />
/// <reference path="Gestures.ts" />
/**
* Phaser - Input
*
* A game specific Input manager that looks after the mouse, keyboard and touch objects.
* This is updated by the core game loop.
*/
var Phaser;
(function (Phaser) {
    var Input = (function () {
        function Input(game) {
            /**
            * You can disable all Input by setting Input.disabled = true. While set all new input related events will be ignored.
            * If you need to disable just one type of input, for example mouse, use Input.mouse.disabled = true instead
            * @type {Boolean}
            */
            this.disabled = false;
            /**
            * Controls the expected behaviour when using a mouse and touch together on a multi-input device
            */
            this.multiInputOverride = Input.MOUSE_TOUCH_COMBINE;
            /**
            * A vector object representing the current position of the Pointer.
            * @property vector
            * @type {Vector2}
            **/
            this.position = null;
            /**
            * A Circle object centered on the x/y screen coordinates of the Input.
            * Default size of 44px (Apples recommended "finger tip" size) but can be changed to anything
            * @property circle
            * @type {Circle}
            **/
            this.circle = null;
            /**
            * X coordinate of the most recent Pointer event
            * @type {Number}
            * @private
            */
            this._x = 0;
            /**
            * X coordinate of the most recent Pointer event
            * @type {Number}
            * @private
            */
            this._y = 0;
            /**
            *
            * @type {Number}
            */
            this.scaleX = 1;
            /**
            *
            * @type {Number}
            */
            this.scaleY = 1;
            /**
            * The maximum number of Pointers allowed to be active at any one time.
            * For lots of games it's useful to set this to 1
            * @type {Number}
            */
            this.maxPointers = 10;
            /**
            * The current number of active Pointers.
            * @type {Number}
            */
            this.currentPointers = 0;
            /**
            * The number of milliseconds that the Pointer has to be pressed down and then released to be considered a tap or click
            * @property tapRate
            * @type {Number}
            **/
            this.tapRate = 200;
            /**
            * The number of milliseconds between taps of the same Pointer for it to be considered a double tap / click
            * @property doubleTapRate
            * @type {Number}
            **/
            this.doubleTapRate = 300;
            /**
            * The number of milliseconds that the Pointer has to be pressed down for it to fire a onHold event
            * @property holdRate
            * @type {Number}
            **/
            this.holdRate = 2000;
            /**
            * The number of milliseconds below which the Pointer is considered justPressed
            * @property justPressedRate
            * @type {Number}
            **/
            this.justPressedRate = 200;
            /**
            * The number of milliseconds below which the Pointer is considered justReleased
            * @property justReleasedRate
            * @type {Number}
            **/
            this.justReleasedRate = 200;
            /**
            * Sets if the Pointer objects should record a history of x/y coordinates they have passed through.
            * The history is cleared each time the Pointer is pressed down.
            * The history is updated at the rate specified in Input.pollRate
            * @property recordPointerHistory
            * @type {Boolean}
            **/
            this.recordPointerHistory = true;
            /**
            * The rate in milliseconds at which the Pointer objects should update their tracking history
            * @property recordRate
            * @type {Number}
            */
            this.recordRate = 100;
            /**
            * The total number of entries that can be recorded into the Pointer objects tracking history.
            * The the Pointer is tracking one event every 100ms, then a trackLimit of 100 would store the last 10 seconds worth of history.
            * @property recordLimit
            * @type {Number}
            */
            this.recordLimit = 100;
            /**
            * A Pointer object
            * @property pointer6
            * @type {Pointer}
            **/
            this.pointer6 = null;
            /**
            * A Pointer object
            * @property pointer7
            * @type {Pointer}
            **/
            this.pointer7 = null;
            /**
            * A Pointer object
            * @property pointer8
            * @type {Pointer}
            **/
            this.pointer8 = null;
            /**
            * A Pointer object
            * @property pointer9
            * @type {Pointer}
            **/
            this.pointer9 = null;
            /**
            * A Pointer object
            * @property pointer10
            * @type {Pointer}
            **/
            this.pointer10 = null;
            this._game = game;
            this.mousePointer = new Phaser.Pointer(this._game, 0);
            this.pointer1 = new Phaser.Pointer(this._game, 1);
            this.pointer2 = new Phaser.Pointer(this._game, 2);
            this.pointer3 = new Phaser.Pointer(this._game, 3);
            this.pointer4 = new Phaser.Pointer(this._game, 4);
            this.pointer5 = new Phaser.Pointer(this._game, 5);
            this.mouse = new Phaser.Mouse(this._game);
            this.keyboard = new Phaser.Keyboard(this._game);
            this.touch = new Phaser.Touch(this._game);
            this.mspointer = new Phaser.MSPointer(this._game);
            this.gestures = new Phaser.Gestures(this._game);
            this.onDown = new Phaser.Signal();
            this.onUp = new Phaser.Signal();
            this.onTap = new Phaser.Signal();
            this.onHold = new Phaser.Signal();
            this.position = new Phaser.Vector2();
            this.circle = new Phaser.Circle(0, 0, 44);
            this.currentPointers = 0;
        }
        Input.MOUSE_OVERRIDES_TOUCH = 0;
        Input.TOUCH_OVERRIDES_MOUSE = 1;
        Input.MOUSE_TOUCH_COMBINE = 2;
        Object.defineProperty(Input.prototype, "x", {
            get: /**
            * The screen X coordinate
            * @property x
            * @type {Number}
            **/
            function () {
                return this._x;
            },
            set: function (value) {
                this._x = Math.round(value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "y", {
            get: /**
            * The screen Y coordinate
            * @property y
            * @type {Number}
            **/
            function () {
                return this._y;
            },
            set: function (value) {
                this._y = Math.round(value);
            },
            enumerable: true,
            configurable: true
        });
        Input.prototype.addPointer = /**
        * Add a new Pointer object to the Input Manager. By default Input creates 5 pointer objects for you. If you need more
        * use this to create a new one, up to a maximum of 10.
        * @method addPointer
        * @return {Pointer} A reference to the new Pointer object
        **/
        function () {
            var next = 0;
            if(this.pointer10 === null) {
                next = 10;
            }
            if(this.pointer9 === null) {
                next = 9;
            }
            if(this.pointer8 === null) {
                next = 8;
            }
            if(this.pointer7 === null) {
                next = 7;
            }
            if(this.pointer6 === null) {
                next = 6;
            }
            if(next == 0) {
                throw new Error("You can only have 10 Pointer objects");
                return null;
            } else {
                this['pointer' + next] = new Phaser.Pointer(this._game, next);
                return this['pointer' + next];
            }
        };
        Input.prototype.start = /**
        * Starts the Input Manager running
        * @method start
        **/
        function () {
            this.mouse.start();
            this.keyboard.start();
            this.touch.start();
            this.mspointer.start();
            this.gestures.start();
        };
        Input.prototype.update = /**
        * Updates the Input Manager. Called by the core Game loop.
        * @method update
        **/
        function () {
            this.mousePointer.update();
            this.pointer1.update();
            this.pointer2.update();
            this.pointer3.update();
            this.pointer4.update();
            this.pointer5.update();
            if(this.pointer6) {
                this.pointer6.update();
            }
            if(this.pointer7) {
                this.pointer7.update();
            }
            if(this.pointer8) {
                this.pointer8.update();
            }
            if(this.pointer9) {
                this.pointer9.update();
            }
            if(this.pointer10) {
                this.pointer10.update();
            }
        };
        Input.prototype.reset = /**
        * Reset all of the Pointers and Input states
        * @method reset
        * @param hard {Boolean} A soft reset (hard = false) won't reset any signals that might be bound. A hard reset will.
        **/
        function (hard) {
            if (typeof hard === "undefined") { hard = false; }
            this.keyboard.reset();
            this.pointer1.reset();
            this.pointer2.reset();
            this.pointer3.reset();
            this.pointer4.reset();
            this.pointer5.reset();
            if(this.pointer6) {
                this.pointer6.reset();
            }
            if(this.pointer7) {
                this.pointer7.reset();
            }
            if(this.pointer8) {
                this.pointer8.reset();
            }
            if(this.pointer9) {
                this.pointer9.reset();
            }
            if(this.pointer10) {
                this.pointer10.reset();
            }
            this.currentPointers = 0;
            if(hard == true) {
                this.onDown = new Phaser.Signal();
                this.onUp = new Phaser.Signal();
                this.onTap = new Phaser.Signal();
                this.onHold = new Phaser.Signal();
            }
        };
        Object.defineProperty(Input.prototype, "totalInactivePointers", {
            get: /**
            * Get the total number of inactive Pointers
            * @method totalInactivePointers
            * @return {Number} The number of Pointers currently inactive
            **/
            function () {
                return 10 - this.currentPointers;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "totalActivePointers", {
            get: /**
            * Recalculates the total number of active Pointers
            * @method totalActivePointers
            * @return {Number} The number of Pointers currently active
            **/
            function () {
                this.currentPointers = 0;
                if(this.pointer1.active == true) {
                    this.currentPointers++;
                } else if(this.pointer2.active == true) {
                    this.currentPointers++;
                } else if(this.pointer3.active == true) {
                    this.currentPointers++;
                } else if(this.pointer4.active == true) {
                    this.currentPointers++;
                } else if(this.pointer5.active == true) {
                    this.currentPointers++;
                } else if(this.pointer6 && this.pointer6.active == true) {
                    this.currentPointers++;
                } else if(this.pointer7 && this.pointer7.active == true) {
                    this.currentPointers++;
                } else if(this.pointer8 && this.pointer8.active == true) {
                    this.currentPointers++;
                } else if(this.pointer9 && this.pointer9.active == true) {
                    this.currentPointers++;
                } else if(this.pointer10 && this.pointer10.active == true) {
                    this.currentPointers++;
                }
                return this.currentPointers;
            },
            enumerable: true,
            configurable: true
        });
        Input.prototype.startPointer = /**
        * Find the first free Pointer object and start it, passing in the event data.
        * @method startPointer
        * @param {Any} event The event data from the Touch event
        * @return {Pointer} The Pointer object that was started or null if no Pointer object is available
        **/
        function (event) {
            if(this.maxPointers < 10 && this.totalActivePointers == this.maxPointers) {
                return null;
            }
            //  Unrolled for speed
            if(this.pointer1.active == false) {
                return this.pointer1.start(event);
            } else if(this.pointer2.active == false) {
                return this.pointer2.start(event);
            } else if(this.pointer3.active == false) {
                return this.pointer3.start(event);
            } else if(this.pointer4.active == false) {
                return this.pointer4.start(event);
            } else if(this.pointer5.active == false) {
                return this.pointer5.start(event);
            } else if(this.pointer6 && this.pointer6.active == false) {
                return this.pointer6.start(event);
            } else if(this.pointer7 && this.pointer7.active == false) {
                return this.pointer7.start(event);
            } else if(this.pointer8 && this.pointer8.active == false) {
                return this.pointer8.start(event);
            } else if(this.pointer9 && this.pointer9.active == false) {
                return this.pointer9.start(event);
            } else if(this.pointer10 && this.pointer10.active == false) {
                return this.pointer10.start(event);
            }
            return null;
        };
        Input.prototype.updatePointer = /**
        * Updates the matching Pointer object, passing in the event data.
        * @method updatePointer
        * @param {Any} event The event data from the Touch event
        * @return {Pointer} The Pointer object that was updated or null if no Pointer object is available
        **/
        function (event) {
            //  Unrolled for speed
            if(this.pointer1.active == true && this.pointer1.identifier == event.identifier) {
                return this.pointer1.move(event);
            } else if(this.pointer2.active == true && this.pointer2.identifier == event.identifier) {
                return this.pointer2.move(event);
            } else if(this.pointer3.active == true && this.pointer3.identifier == event.identifier) {
                return this.pointer3.move(event);
            } else if(this.pointer4.active == true && this.pointer4.identifier == event.identifier) {
                return this.pointer4.move(event);
            } else if(this.pointer5.active == true && this.pointer5.identifier == event.identifier) {
                return this.pointer5.move(event);
            } else if(this.pointer6 && this.pointer6.active == true && this.pointer6.identifier == event.identifier) {
                return this.pointer6.move(event);
            } else if(this.pointer7 && this.pointer7.active == true && this.pointer7.identifier == event.identifier) {
                return this.pointer7.move(event);
            } else if(this.pointer8 && this.pointer8.active == true && this.pointer8.identifier == event.identifier) {
                return this.pointer8.move(event);
            } else if(this.pointer9 && this.pointer9.active == true && this.pointer9.identifier == event.identifier) {
                return this.pointer9.move(event);
            } else if(this.pointer10 && this.pointer10.active == true && this.pointer10.identifier == event.identifier) {
                return this.pointer10.move(event);
            }
            return null;
        };
        Input.prototype.stopPointer = /**
        * Stops the matching Pointer object, passing in the event data.
        * @method stopPointer
        * @param {Any} event The event data from the Touch event
        * @return {Pointer} The Pointer object that was stopped or null if no Pointer object is available
        **/
        function (event) {
            //  Unrolled for speed
            if(this.pointer1.active == true && this.pointer1.identifier == event.identifier) {
                return this.pointer1.stop(event);
            } else if(this.pointer2.active == true && this.pointer2.identifier == event.identifier) {
                return this.pointer2.stop(event);
            } else if(this.pointer3.active == true && this.pointer3.identifier == event.identifier) {
                return this.pointer3.stop(event);
            } else if(this.pointer4.active == true && this.pointer4.identifier == event.identifier) {
                return this.pointer4.stop(event);
            } else if(this.pointer5.active == true && this.pointer5.identifier == event.identifier) {
                return this.pointer5.stop(event);
            } else if(this.pointer6 && this.pointer6.active == true && this.pointer6.identifier == event.identifier) {
                return this.pointer6.stop(event);
            } else if(this.pointer7 && this.pointer7.active == true && this.pointer7.identifier == event.identifier) {
                return this.pointer7.stop(event);
            } else if(this.pointer8 && this.pointer8.active == true && this.pointer8.identifier == event.identifier) {
                return this.pointer8.stop(event);
            } else if(this.pointer9 && this.pointer9.active == true && this.pointer9.identifier == event.identifier) {
                return this.pointer9.stop(event);
            } else if(this.pointer10 && this.pointer10.active == true && this.pointer10.identifier == event.identifier) {
                return this.pointer10.stop(event);
            }
            return null;
        };
        Input.prototype.getPointer = /**
        * Get the next Pointer object whos active property matches the given state
        * @method getPointer
        * @param {Boolean} state The state the Pointer should be in (false for inactive, true for active)
        * @return {Pointer} A Pointer object or null if no Pointer object matches the requested state.
        **/
        function (state) {
            if (typeof state === "undefined") { state = false; }
            //  Unrolled for speed
            if(this.pointer1.active == state) {
                return this.pointer1;
            } else if(this.pointer2.active == state) {
                return this.pointer2;
            } else if(this.pointer3.active == state) {
                return this.pointer3;
            } else if(this.pointer4.active == state) {
                return this.pointer4;
            } else if(this.pointer5.active == state) {
                return this.pointer5;
            } else if(this.pointer6 && this.pointer6.active == state) {
                return this.pointer6;
            } else if(this.pointer7 && this.pointer7.active == state) {
                return this.pointer7;
            } else if(this.pointer8 && this.pointer8.active == state) {
                return this.pointer8;
            } else if(this.pointer9 && this.pointer9.active == state) {
                return this.pointer9;
            } else if(this.pointer10 && this.pointer10.active == state) {
                return this.pointer10;
            }
            return null;
        };
        Input.prototype.getPointerFromIdentifier = /**
        * Get the Pointer object whos identified property matches the given identifier value
        * @method getPointerFromIdentifier
        * @param {Number} identifier The Pointer.identifier value to search for
        * @return {Pointer} A Pointer object or null if no Pointer object matches the requested identifier.
        **/
        function (identifier) {
            //  Unrolled for speed
            if(this.pointer1.identifier == identifier) {
                return this.pointer1;
            } else if(this.pointer2.identifier == identifier) {
                return this.pointer2;
            } else if(this.pointer3.identifier == identifier) {
                return this.pointer3;
            } else if(this.pointer4.identifier == identifier) {
                return this.pointer4;
            } else if(this.pointer5.identifier == identifier) {
                return this.pointer5;
            } else if(this.pointer6 && this.pointer6.identifier == identifier) {
                return this.pointer6;
            } else if(this.pointer7 && this.pointer7.identifier == identifier) {
                return this.pointer7;
            } else if(this.pointer8 && this.pointer8.identifier == identifier) {
                return this.pointer8;
            } else if(this.pointer9 && this.pointer9.identifier == identifier) {
                return this.pointer9;
            } else if(this.pointer10 && this.pointer10.identifier == identifier) {
                return this.pointer10;
            }
            return null;
        };
        Input.prototype.getWorldX = /**
        * @param {Camera} [camera]
        */
        function (camera) {
            if (typeof camera === "undefined") { camera = this._game.camera; }
            return camera.worldView.x + this.x;
        };
        Input.prototype.getWorldY = /**
        * @param {Camera} [camera]
        */
        function (camera) {
            if (typeof camera === "undefined") { camera = this._game.camera; }
            return camera.worldView.y + this.y;
        };
        Input.prototype.renderDebugInfo = /**
        * @param {Number} x
        * @param {Number} y
        * @param {String} [color]
        */
        function (x, y, color) {
            if (typeof color === "undefined") { color = 'rgb(255,255,255)'; }
            this._game.stage.context.font = '14px Courier';
            this._game.stage.context.fillStyle = color;
            this._game.stage.context.fillText('Input', x, y);
            this._game.stage.context.fillText('Screen X: ' + this.x + ' Screen Y: ' + this.y, x, y + 14);
            this._game.stage.context.fillText('World X: ' + this.getWorldX() + ' World Y: ' + this.getWorldY(), x, y + 28);
            this._game.stage.context.fillText('Scale X: ' + this.scaleX.toFixed(1) + ' Scale Y: ' + this.scaleY.toFixed(1), x, y + 42);
        };
        Input.prototype.getDistance = /**
        * Get the distance between two Pointer objects
        * @method getDistance
        * @param {Pointer} pointer1
        * @param {Pointer} pointer2
        **/
        function (pointer1, pointer2) {
            return pointer1.position.distance(pointer2.position);
        };
        Input.prototype.getAngle = /**
        * Get the angle between two Pointer objects
        * @method getAngle
        * @param {Pointer} pointer1
        * @param {Pointer} pointer2
        **/
        function (pointer1, pointer2) {
            return pointer1.position.angle(pointer2.position);
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
            /**
            * You can disable all Input by setting disabled = true. While set all new input related events will be ignored.
            * @type {Boolean}
            */
            this.disabled = false;
            this._game = game;
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
        Keyboard.prototype.addKeyCapture = /**
        * By default when a key is pressed Phaser will not stop the event from propagating up to the browser.
        * There are some keys this can be annoying for, like the arrow keys or space bar, which make the browser window scroll.
        * You can use addKeyCapture to consume the keyboard event for specific keys so it doesn't bubble up to the the browser.
        * Pass in either a single keycode or an array of keycodes.
        * @param {Any} keycode
        */
        function (keycode) {
            if(typeof keycode === 'object') {
                for(var i = 0; i < keycode.length; i++) {
                    this._capture[keycode[i]] = true;
                }
            } else {
                this._capture[keycode] = true;
            }
        };
        Keyboard.prototype.removeKeyCapture = /**
        * @param {Number} keycode
        */
        function (keycode) {
            delete this._capture[keycode];
        };
        Keyboard.prototype.clearCaptures = function () {
            this._capture = {
            };
        };
        Keyboard.prototype.onKeyDown = /**
        * @param {KeyboardEvent} event
        */
        function (event) {
            if(this._game.input.disabled || this.disabled) {
                return;
            }
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
        Keyboard.prototype.onKeyUp = /**
        * @param {KeyboardEvent} event
        */
        function (event) {
            if(this._game.input.disabled || this.disabled) {
                return;
            }
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
        Keyboard.prototype.justPressed = /**
        * @param {Number} keycode
        * @param {Number} [duration]
        * @return {Boolean}
        */
        function (keycode, duration) {
            if (typeof duration === "undefined") { duration = 250; }
            if(this._keys[keycode] && this._keys[keycode].isDown === true && (this._game.time.now - this._keys[keycode].timeDown < duration)) {
                return true;
            } else {
                return false;
            }
        };
        Keyboard.prototype.justReleased = /**
        * @param {Number} keycode
        * @param {Number} [duration]
        * @return {Boolean}
        */
        function (keycode, duration) {
            if (typeof duration === "undefined") { duration = 250; }
            if(this._keys[keycode] && this._keys[keycode].isDown === false && (this._game.time.now - this._keys[keycode].timeUp < duration)) {
                return true;
            } else {
                return false;
            }
        };
        Keyboard.prototype.isDown = /**
        * @param {Number} keycode
        * @return {Boolean}
        */
        function (keycode) {
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
            /**
            * You can disable all Input by setting disabled = true. While set all new input related events will be ignored.
            * @type {Boolean}
            */
            this.disabled = false;
            this._game = game;
        }
        Mouse.LEFT_BUTTON = 0;
        Mouse.MIDDLE_BUTTON = 1;
        Mouse.RIGHT_BUTTON = 2;
        Mouse.prototype.start = /**
        * Starts the event listeners running
        * @method start
        */
        function () {
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
        Mouse.prototype.onMouseDown = /**
        * @param {MouseEvent} event
        */
        function (event) {
            if(this._game.input.disabled || this.disabled) {
                return;
            }
            event['identifier'] = 0;
            this._game.input.mousePointer.start(event);
        };
        Mouse.prototype.onMouseMove = /**
        * @param {MouseEvent} event
        */
        function (event) {
            if(this._game.input.disabled || this.disabled) {
                return;
            }
            event['identifier'] = 0;
            this._game.input.mousePointer.move(event);
        };
        Mouse.prototype.onMouseUp = /**
        * @param {MouseEvent} event
        */
        function (event) {
            if(this._game.input.disabled || this.disabled) {
                return;
            }
            event['identifier'] = 0;
            this._game.input.mousePointer.stop(event);
        };
        Mouse.prototype.stop = /**
        * Stop the event listeners
        * @method stop
        */
        function () {
            //this._game.stage.canvas.addEventListener('mousedown', (event: MouseEvent) => this.onMouseDown(event), true);
            //this._game.stage.canvas.addEventListener('mousemove', (event: MouseEvent) => this.onMouseMove(event), true);
            //this._game.stage.canvas.addEventListener('mouseup', (event: MouseEvent) => this.onMouseUp(event), true);
                    };
        return Mouse;
    })();
    Phaser.Mouse = Mouse;    
})(Phaser || (Phaser = {}));
/// <reference path="../../Game.ts" />
/// <reference path="Pointer.ts" />
/**
* Phaser - Touch
*
* The Touch class handles touch interactions with the game and the resulting Pointer objects.
* http://www.w3.org/TR/touch-events/
* https://developer.mozilla.org/en-US/docs/DOM/TouchList
* http://www.html5rocks.com/en/mobile/touchandmouse/
* Note: Android 2.x only supports 1 touch event at once, no multi-touch
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
            * You can disable all Input by setting disabled = true. While set all new input related events will be ignored.
            * @type {Boolean}
            */
            this.disabled = false;
            this._game = game;
        }
        Touch.prototype.start = /**
        * Starts the event listeners running
        * @method start
        */
        function () {
            var _this = this;
            if(this._game.device.touch) {
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
            }
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
            if(this._game.input.disabled || this.disabled) {
                return;
            }
            event.preventDefault();
            //  event.targetTouches = list of all touches on the TARGET ELEMENT (i.e. game dom element)
            //  event.touches = list of all touches on the ENTIRE DOCUMENT, not just the target element
            //  event.changedTouches = the touches that CHANGED in this event, not the total number of them
            for(var i = 0; i < event.changedTouches.length; i++) {
                this._game.input.startPointer(event.changedTouches[i]);
            }
        };
        Touch.prototype.onTouchCancel = /**
        * Touch cancel - touches that were disrupted (perhaps by moving into a plugin or browser chrome)
        * Occurs for example on iOS when you put down 4 fingers and the app selector UI appears
        * @method onTouchCancel
        * @param {Any} event
        **/
        function (event) {
            if(this._game.input.disabled || this.disabled) {
                return;
            }
            event.preventDefault();
            //  Touch cancel - touches that were disrupted (perhaps by moving into a plugin or browser chrome)
            //  http://www.w3.org/TR/touch-events/#dfn-touchcancel
            for(var i = 0; i < event.changedTouches.length; i++) {
                this._game.input.stopPointer(event.changedTouches[i]);
            }
        };
        Touch.prototype.onTouchEnter = /**
        * For touch enter and leave its a list of the touch points that have entered or left the target
        * Doesn't appear to be supported by most browsers yet
        * @method onTouchEnter
        * @param {Any} event
        **/
        function (event) {
            if(this._game.input.disabled || this.disabled) {
                return;
            }
            event.preventDefault();
            for(var i = 0; i < event.changedTouches.length; i++) {
                console.log('touch enter');
            }
        };
        Touch.prototype.onTouchLeave = /**
        * For touch enter and leave its a list of the touch points that have entered or left the target
        * Doesn't appear to be supported by most browsers yet
        * @method onTouchLeave
        * @param {Any} event
        **/
        function (event) {
            event.preventDefault();
            for(var i = 0; i < event.changedTouches.length; i++) {
                console.log('touch leave');
            }
        };
        Touch.prototype.onTouchMove = /**
        *
        * @method onTouchMove
        * @param {Any} event
        **/
        function (event) {
            event.preventDefault();
            for(var i = 0; i < event.changedTouches.length; i++) {
                this._game.input.updatePointer(event.changedTouches[i]);
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
                this._game.input.stopPointer(event.changedTouches[i]);
            }
        };
        Touch.prototype.stop = /**
        * Stop the event listeners
        * @method stop
        */
        function () {
            if(this._game.device.touch) {
                //this._domElement.addEventListener('touchstart', (event) => this.onTouchStart(event), false);
                //this._domElement.addEventListener('touchmove', (event) => this.onTouchMove(event), false);
                //this._domElement.addEventListener('touchend', (event) => this.onTouchEnd(event), false);
                //this._domElement.addEventListener('touchenter', (event) => this.onTouchEnter(event), false);
                //this._domElement.addEventListener('touchleave', (event) => this.onTouchLeave(event), false);
                //this._domElement.addEventListener('touchcancel', (event) => this.onTouchCancel(event), false);
                            }
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
        * @param x {number} The X position of the emitter.
        * @param y {number} The Y position of the emitter.
        * @param [size] {number} Specifies a maximum capacity for this emitter.
        */
        function Emitter(game, x, y, size) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            if (typeof size === "undefined") { size = 0; }
                _super.call(this, game, size);
            this.x = x;
            this.y = y;
            this.width = 0;
            this.height = 0;
            this.minParticleSpeed = new Phaser.MicroPoint(-100, -100);
            this.maxParticleSpeed = new Phaser.MicroPoint(100, 100);
            this.minRotation = -360;
            this.maxRotation = 360;
            this.gravity = 0;
            this.particleClass = null;
            this.particleDrag = new Phaser.MicroPoint();
            this.frequency = 0.1;
            this.lifespan = 3;
            this.bounce = 0;
            this._quantity = 0;
            this._counter = 0;
            this._explode = true;
            this.on = false;
            this._point = new Phaser.MicroPoint();
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
        * @param graphics If you opted to not pre-configure an array of Sprite objects, you can simply pass in a particle image or sprite sheet.
        * @param quantity {number} The number of particles to generate when using the "create from image" option.
        * @param multiple {boolean} Whether the image in the Graphics param is a single particle or a bunch of particles (if it's a bunch, they need to be square!).
        * @param collide {number}  Whether the particles should be flagged as not 'dead' (non-colliding particles are higher performance).  0 means no collisions, 0-1 controls scale of particle's bounding box.
        *
        * @return  This Emitter instance (nice for chaining stuff together, if you're into that).
        */
        function (graphics, quantity, multiple, collide) {
            if (typeof quantity === "undefined") { quantity = 50; }
            if (typeof multiple === "undefined") { multiple = false; }
            if (typeof collide === "undefined") { collide = 0; }
            this.maxSize = quantity;
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
            while(i < quantity) {
                if(this.particleClass == null) {
                    particle = new Phaser.Particle(this._game);
                } else {
                    particle = new this.particleClass(this._game);
                }
                if(multiple) {
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
                    if(graphics) {
                        particle.loadGraphic(graphics);
                    }
                }
                if(collide > 0) {
                    particle.allowCollisions = Phaser.Collision.ANY;
                    particle.width *= collide;
                    particle.height *= collide;
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
        * @param explode {boolean} Whether the particles should all burst out at once.
        * @param lifespan {number} How long each particle lives once emitted. 0 = forever.
        * @param frequency {number} Ignored if Explode is set to true. Frequency is how often to emit a particle. 0 = never emit, 0.1 = 1 particle every 0.1 seconds, 5 = 1 particle every 5 seconds.
        * @param quantity {number} How many particles to launch. 0 = "all of the particles".
        */
        function (explode, lifespan, frequency, quantity) {
            if (typeof explode === "undefined") { explode = true; }
            if (typeof lifespan === "undefined") { lifespan = 0; }
            if (typeof frequency === "undefined") { frequency = 0.1; }
            if (typeof quantity === "undefined") { quantity = 0; }
            this.revive();
            this.visible = true;
            this.on = true;
            this._explode = explode;
            this.lifespan = lifespan;
            this.frequency = frequency;
            this._quantity += quantity;
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
            if(this.minRotation != this.maxRotation && this.minRotation !== 0 && this.maxRotation !== 0) {
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
        * @param width {number} The desired width of the emitter (particles are spawned randomly within these dimensions).
        * @param height {number} The desired height of the emitter.
        */
        function (width, height) {
            this.width = width;
            this.height = height;
        };
        Emitter.prototype.setXSpeed = /**
        * A more compact way of setting the X velocity range of the emitter.
        *
        * @param Min {number} The minimum value for this range.
        * @param Max {number} The maximum value for this range.
        */
        function (min, max) {
            if (typeof min === "undefined") { min = 0; }
            if (typeof max === "undefined") { max = 0; }
            this.minParticleSpeed.x = min;
            this.maxParticleSpeed.x = max;
        };
        Emitter.prototype.setYSpeed = /**
        * A more compact way of setting the Y velocity range of the emitter.
        *
        * @param Min {number} The minimum value for this range.
        * @param Max {number} The maximum value for this range.
        */
        function (min, max) {
            if (typeof min === "undefined") { min = 0; }
            if (typeof max === "undefined") { max = 0; }
            this.minParticleSpeed.y = min;
            this.maxParticleSpeed.y = max;
        };
        Emitter.prototype.setRotation = /**
        * A more compact way of setting the angular velocity constraints of the emitter.
        *
        * @param Min {number} The minimum value for this range.
        * @param Max {number} The maximum value for this range.
        */
        function (min, max) {
            if (typeof min === "undefined") { min = 0; }
            if (typeof max === "undefined") { max = 0; }
            this.minRotation = min;
            this.maxRotation = max;
        };
        Emitter.prototype.at = /**
        * Change the emitter's midpoint to match the midpoint of a <code>Object</code>.
        *
        * @param Object {object} The <code>Object</code> that you want to sync up with.
        */
        function (object) {
            object.getMidpoint(this._point);
            this.x = this._point.x - (this.width >> 1);
            this.y = this._point.y - (this.height >> 1);
        };
        return Emitter;
    })(Phaser.Group);
    Phaser.Emitter = Emitter;    
})(Phaser || (Phaser = {}));
/// <reference path="../Game.ts" />
/// <reference path="../geom/Polygon.ts" />
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
        /**
        * GeomSprite constructor
        * Create a new <code>GeomSprite</code>.
        *
        * @param game {Phaser.Game} Current game instance.
        * @param [x] {number} the initial x position of the sprite.
        * @param [y] {number} the initial y position of the sprite.
        */
        function GeomSprite(game, x, y) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
                _super.call(this, game, x, y);
            //  local rendering related temp vars to help avoid gc spikes
            this._dx = 0;
            this._dy = 0;
            this._dw = 0;
            this._dh = 0;
            /**
            * Geom type of this sprite. (available: UNASSIGNED, CIRCLE, LINE, POINT, RECTANGLE)
            * @type {number}
            */
            this.type = 0;
            /**
            * Render outline of this sprite or not. (default is true)
            * @type {boolean}
            */
            this.renderOutline = true;
            /**
            * Fill the shape or not. (default is true)
            * @type {boolean}
            */
            this.renderFill = true;
            /**
            * Width of outline. (default is 1)
            * @type {number}
            */
            this.lineWidth = 1;
            /**
            * Width of outline. (default is 1)
            * @type {number}
            */
            this.lineColor = 'rgb(0,255,0)';
            /**
            * The color of the filled area in rgb or rgba string format
            * @type {string} Defaults to rgb(0,100,0) - a green color
            */
            this.fillColor = 'rgb(0,100,0)';
            this.type = GeomSprite.UNASSIGNED;
            return this;
        }
        GeomSprite.UNASSIGNED = 0;
        GeomSprite.CIRCLE = 1;
        GeomSprite.LINE = 2;
        GeomSprite.POINT = 3;
        GeomSprite.RECTANGLE = 4;
        GeomSprite.POLYGON = 5;
        GeomSprite.prototype.loadCircle = /**
        * Just like Sprite.loadGraphic(), this will load a circle and set its shape to Circle.
        * @param circle {Circle} Circle geometry define.
        * @return {GeomSprite} GeomSprite instance itself.
        */
        function (circle) {
            this.refresh();
            this.circle = circle;
            this.type = GeomSprite.CIRCLE;
            return this;
        };
        GeomSprite.prototype.loadLine = /**
        * Just like Sprite.loadGraphic(), this will load a line and set its shape to Line.
        * @param line {Line} Line geometry define.
        * @return {GeomSprite} GeomSprite instance itself.
        */
        function (line) {
            this.refresh();
            this.line = line;
            this.type = GeomSprite.LINE;
            return this;
        };
        GeomSprite.prototype.loadPoint = /**
        * Just like Sprite.loadGraphic(), this will load a point and set its shape to Point.
        * @param point {Point} Point geometry define.
        * @return {GeomSprite} GeomSprite instance itself.
        */
        function (point) {
            this.refresh();
            this.point = point;
            this.type = GeomSprite.POINT;
            return this;
        };
        GeomSprite.prototype.loadRectangle = /**
        * Just like Sprite.loadGraphic(), this will load a rect and set its shape to Rectangle.
        * @param rect {Rectangle} Rectangle geometry define.
        * @return {GeomSprite} GeomSprite instance itself.
        */
        function (rect) {
            this.refresh();
            this.rect = rect;
            this.type = GeomSprite.RECTANGLE;
            return this;
        };
        GeomSprite.prototype.createCircle = /**
        * Create a circle shape with specific diameter.
        * @param diameter {number} Diameter of the circle.
        * @return {GeomSprite} GeomSprite instance itself.
        */
        function (diameter) {
            this.refresh();
            this.circle = new Phaser.Circle(this.x, this.y, diameter);
            this.type = GeomSprite.CIRCLE;
            this.frameBounds.setTo(this.circle.x - this.circle.radius, this.circle.y - this.circle.radius, this.circle.diameter, this.circle.diameter);
            return this;
        };
        GeomSprite.prototype.createLine = /**
        * Create a line shape with specific end point.
        * @param x {number} X position of the end point.
        * @param y {number} Y position of the end point.
        * @return {GeomSprite} GeomSprite instance itself.
        */
        function (x, y) {
            this.refresh();
            this.line = new Phaser.Line(this.x, this.y, x, y);
            this.type = GeomSprite.LINE;
            this.frameBounds.setTo(this.x, this.y, this.line.width, this.line.height);
            return this;
        };
        GeomSprite.prototype.createPoint = /**
        * Create a point shape at spriter's position.
        * @return {GeomSprite} GeomSprite instance itself.
        */
        function () {
            this.refresh();
            this.point = new Phaser.Point(this.x, this.y);
            this.type = GeomSprite.POINT;
            this.frameBounds.width = 1;
            this.frameBounds.height = 1;
            return this;
        };
        GeomSprite.prototype.createRectangle = /**
        * Create a rectangle shape of the given width and height size
        * @param width {Number} Width of the rectangle
        * @param height {Number} Height of the rectangle
        * @return {GeomSprite} GeomSprite instance.
        */
        function (width, height) {
            this.refresh();
            this.rect = new Phaser.Rectangle(this.x, this.y, width, height);
            this.type = GeomSprite.RECTANGLE;
            this.frameBounds.copyFrom(this.rect);
            return this;
        };
        GeomSprite.prototype.createPolygon = /**
        * Create a polygon object
        * @param width {Number} Width of the rectangle
        * @param height {Number} Height of the rectangle
        * @return {GeomSprite} GeomSprite instance.
        */
        function (points) {
            if (typeof points === "undefined") { points = []; }
            this.refresh();
            this.polygon = new Phaser.Polygon(new Phaser.Vector2(this.x, this.y), points);
            this.type = GeomSprite.POLYGON;
            //this.frameBounds.copyFrom(this.rect);
            return this;
        };
        GeomSprite.prototype.refresh = /**
        * Destroy all geom shapes of this sprite.
        */
        function () {
            this.circle = null;
            this.line = null;
            this.point = null;
            this.rect = null;
        };
        GeomSprite.prototype.update = /**
        * Update bounds.
        */
        function () {
            //  Update bounds and position?
            if(this.type == GeomSprite.UNASSIGNED) {
                return;
            } else if(this.type == GeomSprite.CIRCLE) {
                this.circle.x = this.x;
                this.circle.y = this.y;
                this.frameBounds.width = this.circle.diameter;
                this.frameBounds.height = this.circle.diameter;
            } else if(this.type == GeomSprite.LINE) {
                this.line.x1 = this.x;
                this.line.y1 = this.y;
                this.frameBounds.setTo(this.x, this.y, this.line.width, this.line.height);
            } else if(this.type == GeomSprite.POINT) {
                this.point.x = this.x;
                this.point.y = this.y;
            } else if(this.type == GeomSprite.RECTANGLE) {
                this.rect.x = this.x;
                this.rect.y = this.y;
                this.frameBounds.copyFrom(this.rect);
            }
        };
        GeomSprite.prototype.inCamera = /**
        * Check whether this object is visible in a specific camera rectangle.
        * @param camera {Rectangle} The rectangle you want to check.
        * @return {boolean} Return true if bounds of this sprite intersects the given rectangle, otherwise return false.
        */
        function (camera) {
            if(this.scrollFactor.x !== 1.0 || this.scrollFactor.y !== 1.0) {
                this._dx = this.frameBounds.x - (camera.x * this.scrollFactor.x);
                this._dy = this.frameBounds.y - (camera.y * this.scrollFactor.x);
                this._dw = this.frameBounds.width * this.scale.x;
                this._dh = this.frameBounds.height * this.scale.y;
                return (camera.right > this._dx) && (camera.x < this._dx + this._dw) && (camera.bottom > this._dy) && (camera.y < this._dy + this._dh);
            } else {
                return camera.intersects(this.frameBounds);
            }
        };
        GeomSprite.prototype.render = /**
        * Render this sprite to specific camera. Called by game loop after update().
        * @param camera {Camera} Camera this sprite will be rendered to.
        * @cameraOffsetX {number} X offset to the camera.
        * @cameraOffsetY {number} Y offset to the camera.
        * @return {boolean} Return false if not rendered, otherwise return true.
        */
        function (camera, cameraOffsetX, cameraOffsetY) {
            //  Render checks
            if(this.type == GeomSprite.UNASSIGNED || this.visible === false || this.scale.x == 0 || this.scale.y == 0 || this.alpha < 0.1 || this.cameraBlacklist.indexOf(camera.ID) !== -1 || this.inCamera(camera.worldView) == false) {
                return false;
            }
            //  Alpha
            if(this.alpha !== 1) {
                var globalAlpha = this.context.globalAlpha;
                this.context.globalAlpha = this.alpha;
            }
            this._dx = cameraOffsetX + (this.frameBounds.x - camera.worldView.x);
            this._dy = cameraOffsetY + (this.frameBounds.y - camera.worldView.y);
            this._dw = this.frameBounds.width * this.scale.x;
            this._dh = this.frameBounds.height * this.scale.y;
            //	Apply camera difference
            if(this.scrollFactor.x !== 1.0 || this.scrollFactor.y !== 1.0) {
                this._dx -= (camera.worldView.x * this.scrollFactor.x);
                this._dy -= (camera.worldView.y * this.scrollFactor.y);
            }
            //	Rotation is disabled for now as I don't want it to be misleading re: collision
            /*
            if (this.angle !== 0)
            {
            this.context.save();
            this.context.translate(this._dx + (this._dw / 2) - this.origin.x, this._dy + (this._dh / 2) - this.origin.y);
            this.context.rotate(this.angle * (Math.PI / 180));
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
            //this.context.fillStyle = 'rgba(255,0,0,0.5)';
            //this.context.fillRect(this.frameBounds.x, this.frameBounds.y, this.frameBounds.width, this.frameBounds.height);
            this.context.lineWidth = this.lineWidth;
            this.context.strokeStyle = this.lineColor;
            this.context.fillStyle = this.fillColor;
            if(this._game.stage.fillStyle !== this.fillColor) {
            }
            //  Primitive Renderer
            if(this.type == GeomSprite.CIRCLE) {
                this.context.beginPath();
                this.context.arc(this._dx, this._dy, this.circle.radius, 0, Math.PI * 2);
                if(this.renderOutline) {
                    this.context.stroke();
                }
                if(this.renderFill) {
                    this.context.fill();
                }
                this.context.closePath();
            } else if(this.type == GeomSprite.LINE) {
                this.context.beginPath();
                this.context.moveTo(this._dx, this._dy);
                this.context.lineTo(this.line.x2, this.line.y2);
                this.context.stroke();
                this.context.closePath();
            } else if(this.type == GeomSprite.POINT) {
                this.context.fillRect(this._dx, this._dy, 2, 2);
            } else if(this.type == GeomSprite.RECTANGLE) {
                //  We can use the faster fillRect if we don't need the outline
                if(this.renderOutline == false) {
                    this.context.fillRect(this._dx, this._dy, this.rect.width, this.rect.height);
                } else {
                    this.context.beginPath();
                    this.context.rect(this._dx, this._dy, this.rect.width, this.rect.height);
                    this.context.stroke();
                    if(this.renderFill) {
                        this.context.fill();
                    }
                    this.context.closePath();
                }
                //  And now the edge points
                this.context.fillStyle = 'rgb(255,255,255)';
                //this.renderPoint(this.rect.topLeft, this._dx, this._dy, 2);
                //this.renderPoint(this.rect.topCenter, this._dx, this._dy, 2);
                //this.renderPoint(this.rect.topRight, this._dx, this._dy, 2);
                //this.renderPoint(this.rect.leftCenter, this._dx, this._dy, 2);
                //this.renderPoint(this.rect.center, this._dx, this._dy, 2);
                //this.renderPoint(this.rect.rightCenter, this._dx, this._dy, 2);
                //this.renderPoint(this.rect.bottomLeft, this._dx, this._dy, 2);
                //this.renderPoint(this.rect.bottomCenter, this._dx, this._dy, 2);
                //this.renderPoint(this.rect.bottomRight, this._dx, this._dy, 2);
                this.renderPoint(this.rect.topLeft, 0, 0, 2);
                this.renderPoint(this.rect.topCenter, 0, 0, 2);
                this.renderPoint(this.rect.topRight, 0, 0, 2);
                this.renderPoint(this.rect.leftCenter, 0, 0, 2);
                this.renderPoint(this.rect.center, 0, 0, 2);
                this.renderPoint(this.rect.rightCenter, 0, 0, 2);
                this.renderPoint(this.rect.bottomLeft, 0, 0, 2);
                this.renderPoint(this.rect.bottomCenter, 0, 0, 2);
                this.renderPoint(this.rect.bottomRight, 0, 0, 2);
            }
            this._game.stage.restoreCanvasValues();
            if(this.rotation !== 0) {
                this.context.translate(0, 0);
                this.context.restore();
            }
            if(globalAlpha > -1) {
                this.context.globalAlpha = globalAlpha;
            }
            return true;
        };
        GeomSprite.prototype.renderPoint = /**
        * Render a point of geometry.
        * @param point {Point} Position of the point.
        * @param offsetX {number} X offset to its position.
        * @param offsetY {number} Y offset to its position.
        * @param [size] {number} point size.
        */
        function (point, offsetX, offsetY, size) {
            if (typeof offsetX === "undefined") { offsetX = 0; }
            if (typeof offsetY === "undefined") { offsetY = 0; }
            if (typeof size === "undefined") { size = 1; }
            this.context.fillRect(offsetX + point.x, offsetY + point.y, size, size);
        };
        GeomSprite.prototype.renderDebugInfo = /**
        * Render debug infos. (this method does not work now)
        * @param x {number} X position of the debug info to be rendered.
        * @param y {number} Y position of the debug info to be rendered.
        * @param [color] {number} color of the debug info to be rendered. (format is css color string)
        */
        function (x, y, color) {
            if (typeof color === "undefined") { color = 'rgb(255,255,255)'; }
            //this.context.fillStyle = color;
            //this.context.fillText('Sprite: ' + this.name + ' (' + this.frameBounds.width + ' x ' + this.frameBounds.height + ')', x, y);
            //this.context.fillText('x: ' + this.frameBounds.x.toFixed(1) + ' y: ' + this.frameBounds.y.toFixed(1) + ' rotation: ' + this.angle.toFixed(1), x, y + 14);
            //this.context.fillText('dx: ' + this._dx.toFixed(1) + ' dy: ' + this._dy.toFixed(1) + ' dw: ' + this._dw.toFixed(1) + ' dh: ' + this._dh.toFixed(1), x, y + 28);
            //this.context.fillText('sx: ' + this._sx.toFixed(1) + ' sy: ' + this._sy.toFixed(1) + ' sw: ' + this._sw.toFixed(1) + ' sh: ' + this._sh.toFixed(1), x, y + 42);
                    };
        GeomSprite.prototype.collide = /**
        * Gives a basic boolean response to a geometric collision.
        * If you need the details of the collision use the Collision functions instead and inspect the IntersectResult object.
        * @param source {GeomSprite} Sprite you want to check.
        * @return {boolean} Whether they overlaps or not.
        */
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
* Phaser - TilemapLayer
*
* A Tilemap Layer. Tiled format maps can have multiple overlapping layers.
*/
var Phaser;
(function (Phaser) {
    var TilemapLayer = (function () {
        /**
        * TilemapLayer constructor
        * Create a new <code>TilemapLayer</code>.
        *
        * @param game {Phaser.Game} Current game instance.
        * @param parent {Tilemap} The tilemap that contains this layer.
        * @param key {string} Asset key for this map.
        * @param mapFormat {number} Format of this map data, available: Tilemap.FORMAT_CSV or Tilemap.FORMAT_TILED_JSON.
        * @param name {string} Name of this layer, so you can get this layer by its name.
        * @param tileWidth {number} Width of tiles in this map.
        * @param tileHeight {number} Height of tiles in this map.
        */
        function TilemapLayer(game, parent, key, mapFormat, name, tileWidth, tileHeight) {
            this._startX = 0;
            this._startY = 0;
            this._maxX = 0;
            this._maxY = 0;
            this._tx = 0;
            this._ty = 0;
            this._dx = 0;
            this._dy = 0;
            this._oldCameraX = 0;
            this._oldCameraY = 0;
            /**
            * Opacity of this layer.
            * @type {number}
            */
            this.alpha = 1;
            /**
            * Controls whether update() and draw() are automatically called.
            * @type {boolean}
            */
            this.exists = true;
            /**
            * Controls whether draw() are automatically called.
            * @type {boolean}
            */
            this.visible = true;
            /**
            * How many tiles in each row.
            * Read-only variable, do NOT recommend changing after the map is loaded!
            * @type {number}
            */
            this.widthInTiles = 0;
            /**
            * How many tiles in each column.
            * Read-only variable, do NOT recommend changing after the map is loaded!
            * @type {number}
            */
            this.heightInTiles = 0;
            /**
            * Read-only variable, do NOT recommend changing after the map is loaded!
            * @type {number}
            */
            this.widthInPixels = 0;
            /**
            * Read-only variable, do NOT recommend changing after the map is loaded!
            * @type {number}
            */
            this.heightInPixels = 0;
            /**
            * Distance between REAL tiles to the tileset texture bound.
            * @type {number}
            */
            this.tileMargin = 0;
            /**
            * Distance between every 2 neighbor tile in the tileset texture.
            * @type {number}
            */
            this.tileSpacing = 0;
            this._game = game;
            this._parent = parent;
            this.name = name;
            this.mapFormat = mapFormat;
            this.tileWidth = tileWidth;
            this.tileHeight = tileHeight;
            this.boundsInTiles = new Phaser.Rectangle();
            //this.scrollFactor = new MicroPoint(1, 1);
            this.canvas = game.stage.canvas;
            this.context = game.stage.context;
            this.mapData = [];
            this._tempTileBlock = [];
            this._texture = this._game.cache.getImage(key);
        }
        TilemapLayer.prototype.putTile = /**
        * Set a specific tile with its x and y in tiles.
        * @param x {number} X position of this tile.
        * @param y {number} Y position of this tile.
        * @param index {number} The index of this tile type in the core map data.
        */
        function (x, y, index) {
            x = this._game.math.snapToFloor(x, this.tileWidth) / this.tileWidth;
            y = this._game.math.snapToFloor(y, this.tileHeight) / this.tileHeight;
            if(y >= 0 && y < this.mapData.length) {
                if(x >= 0 && x < this.mapData[y].length) {
                    this.mapData[y][x] = index;
                }
            }
        };
        TilemapLayer.prototype.swapTile = /**
        * Swap tiles with 2 kinds of indexes.
        * @param tileA {number} First tile index.
        * @param tileB {number} Second tile index.
        * @param [x] {number} specify a rectangle of tiles to operate. The x position in tiles of rectangle's left-top corner.
        * @param [y] {number} specify a rectangle of tiles to operate. The y position in tiles of rectangle's left-top corner.
        * @param [width] {number} specify a rectangle of tiles to operate. The width in tiles.
        * @param [height] {number} specify a rectangle of tiles to operate. The height in tiles.
        */
        function (tileA, tileB, x, y, width, height) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            if (typeof width === "undefined") { width = this.widthInTiles; }
            if (typeof height === "undefined") { height = this.heightInTiles; }
            this.getTempBlock(x, y, width, height);
            for(var r = 0; r < this._tempTileBlock.length; r++) {
                //  First sweep marking tileA as needing a new index
                if(this._tempTileBlock[r].tile.index == tileA) {
                    this._tempTileBlock[r].newIndex = true;
                }
                //  In the same pass we can swap tileB to tileA
                if(this._tempTileBlock[r].tile.index == tileB) {
                    this.mapData[this._tempTileBlock[r].y][this._tempTileBlock[r].x] = tileA;
                }
            }
            for(var r = 0; r < this._tempTileBlock.length; r++) {
                //  And now swap our newIndex tiles for tileB
                if(this._tempTileBlock[r].newIndex == true) {
                    this.mapData[this._tempTileBlock[r].y][this._tempTileBlock[r].x] = tileB;
                }
            }
        };
        TilemapLayer.prototype.fillTile = /**
        * Fill a tile block with a specific tile index.
        * @param index {number} Index of tiles you want to fill with.
        * @param [x] {number} x position (in tiles) of block's left-top corner.
        * @param [y] {number} y position (in tiles) of block's left-top corner.
        * @param [width] {number} width of block.
        * @param [height] {number} height of block.
        */
        function (index, x, y, width, height) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            if (typeof width === "undefined") { width = this.widthInTiles; }
            if (typeof height === "undefined") { height = this.heightInTiles; }
            this.getTempBlock(x, y, width, height);
            for(var r = 0; r < this._tempTileBlock.length; r++) {
                this.mapData[this._tempTileBlock[r].y][this._tempTileBlock[r].x] = index;
            }
        };
        TilemapLayer.prototype.randomiseTiles = /**
        * Set random tiles to a specific tile block.
        * @param tiles {number[]} Tiles with indexes in this array will be randomly set to the given block.
        * @param [x] {number} x position (in tiles) of block's left-top corner.
        * @param [y] {number} y position (in tiles) of block's left-top corner.
        * @param [width] {number} width of block.
        * @param [height] {number} height of block.
        */
        function (tiles, x, y, width, height) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            if (typeof width === "undefined") { width = this.widthInTiles; }
            if (typeof height === "undefined") { height = this.heightInTiles; }
            this.getTempBlock(x, y, width, height);
            for(var r = 0; r < this._tempTileBlock.length; r++) {
                this.mapData[this._tempTileBlock[r].y][this._tempTileBlock[r].x] = this._game.math.getRandom(tiles);
            }
        };
        TilemapLayer.prototype.replaceTile = /**
        * Replace one kind of tiles to another kind.
        * @param tileA {number} Index of tiles you want to replace.
        * @param tileB {number} Index of tiles you want to set.
        * @param [x] {number} x position (in tiles) of block's left-top corner.
        * @param [y] {number} y position (in tiles) of block's left-top corner.
        * @param [width] {number} width of block.
        * @param [height] {number} height of block.
        */
        function (tileA, tileB, x, y, width, height) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            if (typeof width === "undefined") { width = this.widthInTiles; }
            if (typeof height === "undefined") { height = this.heightInTiles; }
            this.getTempBlock(x, y, width, height);
            for(var r = 0; r < this._tempTileBlock.length; r++) {
                if(this._tempTileBlock[r].tile.index == tileA) {
                    this.mapData[this._tempTileBlock[r].y][this._tempTileBlock[r].x] = tileB;
                }
            }
        };
        TilemapLayer.prototype.getTileBlock = /**
        * Get a tile block with specific position and size.(both are in tiles)
        * @param x {number} X position of block's left-top corner.
        * @param y {number} Y position of block's left-top corner.
        * @param width {number} Width of block.
        * @param height {number} Height of block.
        */
        function (x, y, width, height) {
            var output = [];
            this.getTempBlock(x, y, width, height);
            for(var r = 0; r < this._tempTileBlock.length; r++) {
                output.push({
                    x: this._tempTileBlock[r].x,
                    y: this._tempTileBlock[r].y,
                    tile: this._tempTileBlock[r].tile
                });
            }
            return output;
        };
        TilemapLayer.prototype.getTileFromWorldXY = /**
        * Get a tile with specific position (in world coordinate). (thus you give a position of a point which is within the tile)
        * @param x {number} X position of the point in target tile.
        * @param x {number} Y position of the point in target tile.
        */
        function (x, y) {
            x = this._game.math.snapToFloor(x, this.tileWidth) / this.tileWidth;
            y = this._game.math.snapToFloor(y, this.tileHeight) / this.tileHeight;
            return this.getTileIndex(x, y);
        };
        TilemapLayer.prototype.getTileOverlaps = /**
        * Get tiles overlaps the given object.
        * @param object {GameObject} Tiles you want to get that overlaps this.
        * @return {array} Array with tiles informations. (Each contains x, y and the tile.)
        */
        function (object) {
            //  If the object is outside of the world coordinates then abort the check (tilemap has to exist within world bounds)
            if(object.collisionMask.x < 0 || object.collisionMask.x > this.widthInPixels || object.collisionMask.y < 0 || object.collisionMask.bottom > this.heightInPixels) {
                return;
            }
            //  What tiles do we need to check against?
            this._tempTileX = this._game.math.snapToFloor(object.collisionMask.x, this.tileWidth) / this.tileWidth;
            this._tempTileY = this._game.math.snapToFloor(object.collisionMask.y, this.tileHeight) / this.tileHeight;
            this._tempTileW = (this._game.math.snapToCeil(object.collisionMask.width, this.tileWidth) + this.tileWidth) / this.tileWidth;
            this._tempTileH = (this._game.math.snapToCeil(object.collisionMask.height, this.tileHeight) + this.tileHeight) / this.tileHeight;
            //  Loop through the tiles we've got and check overlaps accordingly (the results are stored in this._tempTileBlock)
            this._tempBlockResults = [];
            this.getTempBlock(this._tempTileX, this._tempTileY, this._tempTileW, this._tempTileH, true);
            Phaser.Collision.TILE_OVERLAP = false;
            for(var r = 0; r < this._tempTileBlock.length; r++) {
                if(Phaser.Collision.separateTile(object, this._tempTileBlock[r].x * this.tileWidth, this._tempTileBlock[r].y * this.tileHeight, this.tileWidth, this.tileHeight, this._tempTileBlock[r].tile.mass, this._tempTileBlock[r].tile.collideLeft, this._tempTileBlock[r].tile.collideRight, this._tempTileBlock[r].tile.collideUp, this._tempTileBlock[r].tile.collideDown, this._tempTileBlock[r].tile.separateX, this._tempTileBlock[r].tile.separateY) == true) {
                    this._tempBlockResults.push({
                        x: this._tempTileBlock[r].x,
                        y: this._tempTileBlock[r].y,
                        tile: this._tempTileBlock[r].tile
                    });
                }
            }
            return this._tempBlockResults;
        };
        TilemapLayer.prototype.getTempBlock = /**
        * Get a tile block with its position and size. (This method does not return, it'll set result to _tempTileBlock)
        * @param x {number} X position of block's left-top corner.
        * @param y {number} Y position of block's left-top corner.
        * @param width {number} Width of block.
        * @param height {number} Height of block.
        * @param collisionOnly {boolean} Whethor or not ONLY return tiles which will collide (its allowCollisions value is not Collision.NONE).
        */
        function (x, y, width, height, collisionOnly) {
            if (typeof collisionOnly === "undefined") { collisionOnly = false; }
            if(x < 0) {
                x = 0;
            }
            if(y < 0) {
                y = 0;
            }
            if(width > this.widthInTiles) {
                width = this.widthInTiles;
            }
            if(height > this.heightInTiles) {
                height = this.heightInTiles;
            }
            this._tempTileBlock = [];
            for(var ty = y; ty < y + height; ty++) {
                for(var tx = x; tx < x + width; tx++) {
                    if(collisionOnly) {
                        //  We only want to consider the tile for checking if you can actually collide with it
                        if(this.mapData[ty] && this.mapData[ty][tx] && this._parent.tiles[this.mapData[ty][tx]].allowCollisions != Phaser.Collision.NONE) {
                            this._tempTileBlock.push({
                                x: tx,
                                y: ty,
                                tile: this._parent.tiles[this.mapData[ty][tx]]
                            });
                        }
                    } else {
                        if(this.mapData[ty] && this.mapData[ty][tx]) {
                            this._tempTileBlock.push({
                                x: tx,
                                y: ty,
                                tile: this._parent.tiles[this.mapData[ty][tx]]
                            });
                        }
                    }
                }
            }
        };
        TilemapLayer.prototype.getTileIndex = /**
        * Get the tile index of specific position (in tiles).
        * @param x {number} X position of the tile.
        * @param y {number} Y position of the tile.
        * @return {number} Index of the tile at that position. Return null if there isn't a tile there.
        */
        function (x, y) {
            if(y >= 0 && y < this.mapData.length) {
                if(x >= 0 && x < this.mapData[y].length) {
                    return this.mapData[y][x];
                }
            }
            return null;
        };
        TilemapLayer.prototype.addColumn = /**
        * Add a column of tiles into the layer.
        * @param column {string[]/number[]} An array of tile indexes to be added.
        */
        function (column) {
            var data = [];
            for(var c = 0; c < column.length; c++) {
                data[c] = parseInt(column[c]);
            }
            if(this.widthInTiles == 0) {
                this.widthInTiles = data.length;
                this.widthInPixels = this.widthInTiles * this.tileWidth;
            }
            this.mapData.push(data);
            this.heightInTiles++;
            this.heightInPixels += this.tileHeight;
        };
        TilemapLayer.prototype.updateBounds = /**
        * Update boundsInTiles with widthInTiles and heightInTiles.
        */
        function () {
            this.boundsInTiles.setTo(0, 0, this.widthInTiles, this.heightInTiles);
        };
        TilemapLayer.prototype.parseTileOffsets = /**
        * Parse tile offsets from map data.
        * @return {number} length of _tileOffsets array.
        */
        function () {
            this._tileOffsets = [];
            var i = 0;
            if(this.mapFormat == Phaser.Tilemap.FORMAT_TILED_JSON) {
                //  For some reason Tiled counts from 1 not 0
                this._tileOffsets[0] = null;
                i = 1;
            }
            for(var ty = this.tileMargin; ty < this._texture.height; ty += (this.tileHeight + this.tileSpacing)) {
                for(var tx = this.tileMargin; tx < this._texture.width; tx += (this.tileWidth + this.tileSpacing)) {
                    this._tileOffsets[i] = {
                        x: tx,
                        y: ty
                    };
                    i++;
                }
            }
            return this._tileOffsets.length;
        };
        TilemapLayer.prototype.renderDebugInfo = function (x, y, color) {
            if (typeof color === "undefined") { color = 'rgb(255,255,255)'; }
            this.context.fillStyle = color;
            this.context.fillText('TilemapLayer: ' + this.name, x, y);
            this.context.fillText('startX: ' + this._startX + ' endX: ' + this._maxX, x, y + 14);
            this.context.fillText('startY: ' + this._startY + ' endY: ' + this._maxY, x, y + 28);
            this.context.fillText('dx: ' + this._dx + ' dy: ' + this._dy, x, y + 42);
        };
        TilemapLayer.prototype.render = /**
        * Render this layer to a specific camera with offset to camera.
        * @param camera {Camera} The camera the layer is going to be rendered.
        * @param dx {number} X offset to the camera.
        * @param dy {number} Y offset to the camera.
        * @return {boolean} Return false if layer is invisible or has a too low opacity(will stop rendering), return true if succeed.
        */
        function (camera, dx, dy) {
            if(this.visible === false || this.alpha < 0.1) {
                return false;
            }
            //  Work out how many tiles we can fit into our camera and round it up for the edges
            this._maxX = this._game.math.ceil(camera.width / this.tileWidth) + 1;
            this._maxY = this._game.math.ceil(camera.height / this.tileHeight) + 1;
            //  And now work out where in the tilemap the camera actually is
            this._startX = this._game.math.floor(camera.worldView.x / this.tileWidth);
            this._startY = this._game.math.floor(camera.worldView.y / this.tileHeight);
            //  Tilemap bounds check
            if(this._startX < 0) {
                this._startX = 0;
            }
            if(this._startY < 0) {
                this._startY = 0;
            }
            if(this._maxX > this.widthInTiles) {
                this._maxX = this.widthInTiles;
            }
            if(this._maxY > this.heightInTiles) {
                this._maxY = this.heightInTiles;
            }
            if(this._startX + this._maxX > this.widthInTiles) {
                this._startX = this.widthInTiles - this._maxX;
            }
            if(this._startY + this._maxY > this.heightInTiles) {
                this._startY = this.heightInTiles - this._maxY;
            }
            //  Finally get the offset to avoid the blocky movement
            this._dx = dx;
            this._dy = dy;
            this._dx += -(camera.worldView.x - (this._startX * this.tileWidth));
            this._dy += -(camera.worldView.y - (this._startY * this.tileHeight));
            this._tx = this._dx;
            this._ty = this._dy;
            //	Apply camera difference
            /*
            if (this.scrollFactor.x !== 1.0 || this.scrollFactor.y !== 1.0)
            {
            this._dx -= (camera.worldView.x * this.scrollFactor.x);
            this._dy -= (camera.worldView.y * this.scrollFactor.y);
            }
            */
            //  Alpha
            if(this.alpha !== 1) {
                var globalAlpha = this.context.globalAlpha;
                this.context.globalAlpha = this.alpha;
            }
            for(var row = this._startY; row < this._startY + this._maxY; row++) {
                this._columnData = this.mapData[row];
                for(var tile = this._startX; tile < this._startX + this._maxX; tile++) {
                    if(this._tileOffsets[this._columnData[tile]]) {
                        this.context.drawImage(this._texture, //  Source Image
                        this._tileOffsets[this._columnData[tile]].x, //  Source X (location within the source image)
                        this._tileOffsets[this._columnData[tile]].y, //  Source Y
                        this.tileWidth, //	Source Width
                        this.tileHeight, //	Source Height
                        this._tx, //	Destination X (where on the canvas it'll be drawn)
                        this._ty, //	Destination Y
                        this.tileWidth, //	Destination Width (always same as Source Width unless scaled)
                        this.tileHeight);
                        //	Destination Height (always same as Source Height unless scaled)
                                            }
                    this._tx += this.tileWidth;
                }
                this._tx = this._dx;
                this._ty += this.tileHeight;
            }
            if(globalAlpha > -1) {
                this.context.globalAlpha = globalAlpha;
            }
            return true;
        };
        return TilemapLayer;
    })();
    Phaser.TilemapLayer = TilemapLayer;    
})(Phaser || (Phaser = {}));
/// <reference path="../Game.ts" />
/**
* Phaser - Tile
*
* A Tile is a single representation of a tile within a Tilemap
*/
var Phaser;
(function (Phaser) {
    var Tile = (function () {
        /**
        * Tile constructor
        * Create a new <code>Tile</code>.
        *
        * @param tilemap {Tilemap} the tilemap this tile belongs to.
        * @param index {number} The index of this tile type in the core map data.
        * @param width {number} Width of the tile.
        * @param height number} Height of the tile.
        */
        function Tile(game, tilemap, index, width, height) {
            /**
            * The virtual mass of the tile.
            * @type {number}
            */
            this.mass = 1.0;
            /**
            * Indicating collide with any object on the left.
            * @type {boolean}
            */
            this.collideLeft = false;
            /**
            * Indicating collide with any object on the right.
            * @type {boolean}
            */
            this.collideRight = false;
            /**
            * Indicating collide with any object on the top.
            * @type {boolean}
            */
            this.collideUp = false;
            /**
            * Indicating collide with any object on the bottom.
            * @type {boolean}
            */
            this.collideDown = false;
            /**
            * Enable separation at x-axis.
            * @type {boolean}
            */
            this.separateX = true;
            /**
            * Enable separation at y-axis.
            * @type {boolean}
            */
            this.separateY = true;
            this._game = game;
            this.tilemap = tilemap;
            this.index = index;
            this.width = width;
            this.height = height;
            this.allowCollisions = Phaser.Collision.NONE;
        }
        Tile.prototype.destroy = /**
        * Clean up memory.
        */
        function () {
            this.tilemap = null;
        };
        Tile.prototype.setCollision = /**
        * Set collision configs.
        * @param collision {number} Bit field of flags. (see Tile.allowCollision)
        * @param resetCollisions {boolean} Reset collision flags before set.
        * @param separateX {boolean} Enable seprate at x-axis.
        * @param separateY {boolean} Enable seprate at y-axis.
        */
        function (collision, resetCollisions, separateX, separateY) {
            if(resetCollisions) {
                this.resetCollision();
            }
            this.separateX = separateX;
            this.separateY = separateY;
            this.allowCollisions = collision;
            if(collision & Phaser.Collision.ANY) {
                this.collideLeft = true;
                this.collideRight = true;
                this.collideUp = true;
                this.collideDown = true;
                return;
            }
            if(collision & Phaser.Collision.LEFT || collision & Phaser.Collision.WALL) {
                this.collideLeft = true;
            }
            if(collision & Phaser.Collision.RIGHT || collision & Phaser.Collision.WALL) {
                this.collideRight = true;
            }
            if(collision & Phaser.Collision.UP || collision & Phaser.Collision.CEILING) {
                this.collideUp = true;
            }
            if(collision & Phaser.Collision.DOWN || collision & Phaser.Collision.CEILING) {
                this.collideDown = true;
            }
        };
        Tile.prototype.resetCollision = /**
        * Reset collision status flags.
        */
        function () {
            this.allowCollisions = Phaser.Collision.NONE;
            this.collideLeft = false;
            this.collideRight = false;
            this.collideUp = false;
            this.collideDown = false;
        };
        Tile.prototype.toString = /**
        * Returns a string representation of this object.
        * @method toString
        * @return {string} a string representation of the object.
        **/
        function () {
            return "[{Tiled (index=" + this.index + " collisions=" + this.allowCollisions + " width=" + this.width + " height=" + this.height + ")}]";
        };
        return Tile;
    })();
    Phaser.Tile = Tile;    
})(Phaser || (Phaser = {}));
/// <reference path="../Game.ts" />
/// <reference path="GameObject.ts" />
/// <reference path="../system/TilemapLayer.ts" />
/// <reference path="../system/Tile.ts" />
/**
* Phaser - Tilemap
*
* This GameObject allows for the display of a tilemap within the game world. Tile maps consist of an image, tile data and a size.
* Internally it creates a TilemapLayer for each layer in the tilemap.
*/
var Phaser;
(function (Phaser) {
    var Tilemap = (function (_super) {
        __extends(Tilemap, _super);
        /**
        * Tilemap constructor
        * Create a new <code>Tilemap</code>.
        *
        * @param game {Phaser.Game} Current game instance.
        * @param key {string} Asset key for this map.
        * @param mapData {string} Data of this map. (a big 2d array, normally in csv)
        * @param format {number} Format of this map data, available: Tilemap.FORMAT_CSV or Tilemap.FORMAT_TILED_JSON.
        * @param resizeWorld {boolean} Resize the world bound automatically based on this tilemap?
        * @param tileWidth {number} Width of tiles in this map.
        * @param tileHeight {number} Height of tiles in this map.
        */
        function Tilemap(game, key, mapData, format, resizeWorld, tileWidth, tileHeight) {
            if (typeof resizeWorld === "undefined") { resizeWorld = true; }
            if (typeof tileWidth === "undefined") { tileWidth = 0; }
            if (typeof tileHeight === "undefined") { tileHeight = 0; }
                _super.call(this, game);
            /**
            * Tilemap collision callback.
            * @type {function}
            */
            this.collisionCallback = null;
            this.isGroup = false;
            this.tiles = [];
            this.layers = [];
            this.mapFormat = format;
            switch(format) {
                case Tilemap.FORMAT_CSV:
                    this.parseCSV(game.cache.getText(mapData), key, tileWidth, tileHeight);
                    break;
                case Tilemap.FORMAT_TILED_JSON:
                    this.parseTiledJSON(game.cache.getText(mapData), key);
                    break;
            }
            if(this.currentLayer && resizeWorld) {
                this._game.world.setSize(this.currentLayer.widthInPixels, this.currentLayer.heightInPixels, true);
            }
        }
        Tilemap.FORMAT_CSV = 0;
        Tilemap.FORMAT_TILED_JSON = 1;
        Tilemap.prototype.update = /**
        * Inherited update method.
        */
        function () {
        };
        Tilemap.prototype.render = /**
        * Render this tilemap to a specific camera with specific offset.
        * @param camera {Camera} The camera this tilemap will be rendered to.
        * @param cameraOffsetX {number} X offset of the camera.
        * @param cameraOffsetY {number} Y offset of the camera.
        */
        function (camera, cameraOffsetX, cameraOffsetY) {
            if(this.cameraBlacklist.indexOf(camera.ID) == -1) {
                //  Loop through the layers
                for(var i = 0; i < this.layers.length; i++) {
                    this.layers[i].render(camera, cameraOffsetX, cameraOffsetY);
                }
            }
        };
        Tilemap.prototype.parseCSV = /**
        * Parset csv map data and generate tiles.
        * @param data {string} CSV map data.
        * @param key {string} Asset key for tileset image.
        * @param tileWidth {number} Width of its tile.
        * @param tileHeight {number} Height of its tile.
        */
        function (data, key, tileWidth, tileHeight) {
            var layer = new Phaser.TilemapLayer(this._game, this, key, Tilemap.FORMAT_CSV, 'TileLayerCSV' + this.layers.length.toString(), tileWidth, tileHeight);
            //  Trim any rogue whitespace from the data
            data = data.trim();
            var rows = data.split("\n");
            for(var i = 0; i < rows.length; i++) {
                var column = rows[i].split(",");
                if(column.length > 0) {
                    layer.addColumn(column);
                }
            }
            layer.updateBounds();
            var tileQuantity = layer.parseTileOffsets();
            this.currentLayer = layer;
            this.collisionLayer = layer;
            this.layers.push(layer);
            this.generateTiles(tileQuantity);
        };
        Tilemap.prototype.parseTiledJSON = /**
        * Parset JSON map data and generate tiles.
        * @param data {string} JSON map data.
        * @param key {string} Asset key for tileset image.
        */
        function (data, key) {
            //  Trim any rogue whitespace from the data
            data = data.trim();
            var json = JSON.parse(data);
            for(var i = 0; i < json.layers.length; i++) {
                var layer = new Phaser.TilemapLayer(this._game, this, key, Tilemap.FORMAT_TILED_JSON, json.layers[i].name, json.tilewidth, json.tileheight);
                layer.alpha = json.layers[i].opacity;
                layer.visible = json.layers[i].visible;
                layer.tileMargin = json.tilesets[0].margin;
                layer.tileSpacing = json.tilesets[0].spacing;
                var c = 0;
                var row;
                for(var t = 0; t < json.layers[i].data.length; t++) {
                    if(c == 0) {
                        row = [];
                    }
                    row.push(json.layers[i].data[t]);
                    c++;
                    if(c == json.layers[i].width) {
                        layer.addColumn(row);
                        c = 0;
                    }
                }
                layer.updateBounds();
                var tileQuantity = layer.parseTileOffsets();
                this.currentLayer = layer;
                this.collisionLayer = layer;
                this.layers.push(layer);
            }
            this.generateTiles(tileQuantity);
        };
        Tilemap.prototype.generateTiles = /**
        * Create tiles of given quantity.
        * @param qty {number} Quentity of tiles to be generated.
        */
        function (qty) {
            for(var i = 0; i < qty; i++) {
                this.tiles.push(new Phaser.Tile(this._game, this, i, this.currentLayer.tileWidth, this.currentLayer.tileHeight));
            }
        };
        Object.defineProperty(Tilemap.prototype, "widthInPixels", {
            get: function () {
                return this.currentLayer.widthInPixels;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Tilemap.prototype, "heightInPixels", {
            get: function () {
                return this.currentLayer.heightInPixels;
            },
            enumerable: true,
            configurable: true
        });
        Tilemap.prototype.setCollisionCallback = //  Tile Collision
        /**
        * Set callback to be called when this tilemap collides.
        * @param context {object} Callback will be called with this context.
        * @param callback {function} Callback function.
        */
        function (context, callback) {
            this.collisionCallbackContext = context;
            this.collisionCallback = callback;
        };
        Tilemap.prototype.setCollisionRange = /**
        * Set collision configs of tiles in a range index.
        * @param start {number} First index of tiles.
        * @param end {number} Last index of tiles.
        * @param collision {number} Bit field of flags. (see Tile.allowCollision)
        * @param resetCollisions {boolean} Reset collision flags before set.
        * @param separateX {boolean} Enable seprate at x-axis.
        * @param separateY {boolean} Enable seprate at y-axis.
        */
        function (start, end, collision, resetCollisions, separateX, separateY) {
            if (typeof collision === "undefined") { collision = Phaser.Collision.ANY; }
            if (typeof resetCollisions === "undefined") { resetCollisions = false; }
            if (typeof separateX === "undefined") { separateX = true; }
            if (typeof separateY === "undefined") { separateY = true; }
            for(var i = start; i < end; i++) {
                this.tiles[i].setCollision(collision, resetCollisions, separateX, separateY);
            }
        };
        Tilemap.prototype.setCollisionByIndex = /**
        * Set collision configs of tiles with given index.
        * @param values {number[]} Index array which contains all tile indexes. The tiles with those indexes will be setup with rest parameters.
        * @param collision {number} Bit field of flags. (see Tile.allowCollision)
        * @param resetCollisions {boolean} Reset collision flags before set.
        * @param separateX {boolean} Enable seprate at x-axis.
        * @param separateY {boolean} Enable seprate at y-axis.
        */
        function (values, collision, resetCollisions, separateX, separateY) {
            if (typeof collision === "undefined") { collision = Phaser.Collision.ANY; }
            if (typeof resetCollisions === "undefined") { resetCollisions = false; }
            if (typeof separateX === "undefined") { separateX = true; }
            if (typeof separateY === "undefined") { separateY = true; }
            for(var i = 0; i < values.length; i++) {
                this.tiles[values[i]].setCollision(collision, resetCollisions, separateX, separateY);
            }
        };
        Tilemap.prototype.getTileByIndex = //  Tile Management
        /**
        * Get the tile by its index.
        * @param value {number} Index of the tile you want to get.
        * @return {Tile} The tile with given index.
        */
        function (value) {
            if(this.tiles[value]) {
                return this.tiles[value];
            }
            return null;
        };
        Tilemap.prototype.getTile = /**
        * Get the tile located at specific position and layer.
        * @param x {number} X position of this tile located.
        * @param y {number} Y position of this tile located.
        * @param [layer] {number} layer of this tile located.
        * @return {Tile} The tile with specific properties.
        */
        function (x, y, layer) {
            if (typeof layer === "undefined") { layer = 0; }
            return this.tiles[this.layers[layer].getTileIndex(x, y)];
        };
        Tilemap.prototype.getTileFromWorldXY = /**
        * Get the tile located at specific position (in world coordinate) and layer. (thus you give a position of a point which is within the tile)
        * @param x {number} X position of the point in target tile.
        * @param x {number} Y position of the point in target tile.
        * @param [layer] {number} layer of this tile located.
        * @return {Tile} The tile with specific properties.
        */
        function (x, y, layer) {
            if (typeof layer === "undefined") { layer = 0; }
            return this.tiles[this.layers[layer].getTileFromWorldXY(x, y)];
        };
        Tilemap.prototype.getTileFromInputXY = function (layer) {
            if (typeof layer === "undefined") { layer = 0; }
            return this.tiles[this.layers[layer].getTileFromWorldXY(this._game.input.getWorldX(), this._game.input.getWorldY())];
        };
        Tilemap.prototype.getTileOverlaps = /**
        * Get tiles overlaps the given object.
        * @param object {GameObject} Tiles you want to get that overlaps this.
        * @return {array} Array with tiles informations. (Each contains x, y and the tile.)
        */
        function (object) {
            return this.currentLayer.getTileOverlaps(object);
        };
        Tilemap.prototype.collide = //  COLLIDE
        /**
        * Check whether this tilemap collides with the given game object or group of objects.
        * @param objectOrGroup {function} Target object of group you want to check.
        * @param callback {function} This is called if objectOrGroup collides the tilemap.
        * @param context {object} Callback will be called with this context.
        * @return {boolean} Return true if this collides with given object, otherwise return false.
        */
        function (objectOrGroup, callback, context) {
            if (typeof objectOrGroup === "undefined") { objectOrGroup = null; }
            if (typeof callback === "undefined") { callback = null; }
            if (typeof context === "undefined") { context = null; }
            if(callback !== null && context !== null) {
                this.collisionCallback = callback;
                this.collisionCallbackContext = context;
            }
            if(objectOrGroup == null) {
                objectOrGroup = this._game.world.group;
            }
            //  Group?
            if(objectOrGroup.isGroup == false) {
                this.collideGameObject(objectOrGroup);
            } else {
                objectOrGroup.forEachAlive(this, this.collideGameObject, true);
            }
        };
        Tilemap.prototype.collideGameObject = /**
        * Check whether this tilemap collides with the given game object.
        * @param object {GameObject} Target object you want to check.
        * @return {boolean} Return true if this collides with given object, otherwise return false.
        */
        function (object) {
            if(object !== this && object.immovable == false && object.exists == true && object.allowCollisions != Phaser.Collision.NONE) {
                this._tempCollisionData = this.collisionLayer.getTileOverlaps(object);
                if(this.collisionCallback !== null && this._tempCollisionData.length > 0) {
                    this.collisionCallback.call(this.collisionCallbackContext, object, this._tempCollisionData);
                }
                return true;
            } else {
                return false;
            }
        };
        Tilemap.prototype.putTile = /**
        * Set a tile to a specific layer.
        * @param x {number} X position of this tile.
        * @param y {number} Y position of this tile.
        * @param index {number} The index of this tile type in the core map data.
        * @param [layer] {number} which layer you want to set the tile to.
        */
        function (x, y, index, layer) {
            if (typeof layer === "undefined") { layer = 0; }
            this.layers[layer].putTile(x, y, index);
        };
        return Tilemap;
    })(Phaser.GameObject);
    Phaser.Tilemap = Tilemap;    
    //  Set current layer
    //  Set layer order?
    //  Delete tiles of certain type
    //  Erase tiles
    })(Phaser || (Phaser = {}));
/// <reference path="../Game.ts" />
/// <reference path="../geom/Quad.ts" />
/**
* Phaser - ScrollRegion
*
* Creates a scrolling region within a ScrollZone.
* It is scrolled via the scrollSpeed.x/y properties.
*/
var Phaser;
(function (Phaser) {
    var ScrollRegion = (function () {
        /**
        * ScrollRegion constructor
        * Create a new <code>ScrollRegion</code>.
        *
        * @param x {number} X position in world coordinate.
        * @param y {number} Y position in world coordinate.
        * @param width {number} Width of this object.
        * @param height {number} Height of this object.
        * @param speedX {number} X-axis scrolling speed.
        * @param speedY {number} Y-axis scrolling speed.
        */
        function ScrollRegion(x, y, width, height, speedX, speedY) {
            this._anchorWidth = 0;
            this._anchorHeight = 0;
            this._inverseWidth = 0;
            this._inverseHeight = 0;
            /**
            * Will this region be rendered? (default to true)
            * @type {boolean}
            */
            this.visible = true;
            //	Our seamless scrolling quads
            this._A = new Phaser.Quad(x, y, width, height);
            this._B = new Phaser.Quad(x, y, width, height);
            this._C = new Phaser.Quad(x, y, width, height);
            this._D = new Phaser.Quad(x, y, width, height);
            this._scroll = new Phaser.MicroPoint();
            this._bounds = new Phaser.Quad(x, y, width, height);
            this.scrollSpeed = new Phaser.MicroPoint(speedX, speedY);
        }
        ScrollRegion.prototype.update = /**
        * Update region scrolling with tick time.
        * @param delta {number} Elapsed time since last update.
        */
        function (delta) {
            this._scroll.x += this.scrollSpeed.x;
            this._scroll.y += this.scrollSpeed.y;
            if(this._scroll.x > this._bounds.right) {
                this._scroll.x = this._bounds.x;
            }
            if(this._scroll.x < this._bounds.x) {
                this._scroll.x = this._bounds.right;
            }
            if(this._scroll.y > this._bounds.bottom) {
                this._scroll.y = this._bounds.y;
            }
            if(this._scroll.y < this._bounds.y) {
                this._scroll.y = this._bounds.bottom;
            }
            //	Anchor Dimensions
            this._anchorWidth = (this._bounds.width - this._scroll.x) + this._bounds.x;
            this._anchorHeight = (this._bounds.height - this._scroll.y) + this._bounds.y;
            if(this._anchorWidth > this._bounds.width) {
                this._anchorWidth = this._bounds.width;
            }
            if(this._anchorHeight > this._bounds.height) {
                this._anchorHeight = this._bounds.height;
            }
            this._inverseWidth = this._bounds.width - this._anchorWidth;
            this._inverseHeight = this._bounds.height - this._anchorHeight;
            //	Quad A
            this._A.setTo(this._scroll.x, this._scroll.y, this._anchorWidth, this._anchorHeight);
            //	Quad B
            this._B.y = this._scroll.y;
            this._B.width = this._inverseWidth;
            this._B.height = this._anchorHeight;
            //	Quad C
            this._C.x = this._scroll.x;
            this._C.width = this._anchorWidth;
            this._C.height = this._inverseHeight;
            //	Quad D
            this._D.width = this._inverseWidth;
            this._D.height = this._inverseHeight;
        };
        ScrollRegion.prototype.render = /**
        * Render this region to specific context.
        * @param context {CanvasRenderingContext2D} Canvas context this region will be rendered to.
        * @param texture {object} The texture to be rendered.
        * @param dx {number} X position in world coordinate.
        * @param dy {number} Y position in world coordinate.
        * @param width {number} Width of this region to be rendered.
        * @param height {number} Height of this region to be rendered.
        */
        function (context, texture, dx, dy, dw, dh) {
            if(this.visible == false) {
                return;
            }
            //  dx/dy are the world coordinates to render the FULL ScrollZone into.
            //  This ScrollRegion may be smaller than that and offset from the dx/dy coordinates.
            this.crop(context, texture, this._A.x, this._A.y, this._A.width, this._A.height, dx, dy, dw, dh, 0, 0);
            this.crop(context, texture, this._B.x, this._B.y, this._B.width, this._B.height, dx, dy, dw, dh, this._A.width, 0);
            this.crop(context, texture, this._C.x, this._C.y, this._C.width, this._C.height, dx, dy, dw, dh, 0, this._A.height);
            this.crop(context, texture, this._D.x, this._D.y, this._D.width, this._D.height, dx, dy, dw, dh, this._C.width, this._A.height);
            //context.fillStyle = 'rgb(255,255,255)';
            //context.font = '18px Arial';
            //context.fillText('QuadA: ' + this._A.toString(), 32, 450);
            //context.fillText('QuadB: ' + this._B.toString(), 32, 480);
            //context.fillText('QuadC: ' + this._C.toString(), 32, 510);
            //context.fillText('QuadD: ' + this._D.toString(), 32, 540);
                    };
        ScrollRegion.prototype.crop = /**
        * Crop part of the texture and render it to the given context.
        * @param context {CanvasRenderingContext2D} Canvas context the texture will be rendered to.
        * @param texture {object} Texture to be rendered.
        * @param srcX {number} Target region top-left x coordinate in the texture.
        * @param srcX {number} Target region top-left y coordinate in the texture.
        * @param srcW {number} Target region width in the texture.
        * @param srcH {number} Target region height in the texture.
        * @param destX {number} Render region top-left x coordinate in the context.
        * @param destX {number} Render region top-left y coordinate in the context.
        * @param destW {number} Target region width in the context.
        * @param destH {number} Target region height in the context.
        * @param offsetX {number} X offset to the context.
        * @param offsetY {number} Y offset to the context.
        */
        function (context, texture, srcX, srcY, srcW, srcH, destX, destY, destW, destH, offsetX, offsetY) {
            offsetX += destX;
            offsetY += destY;
            if(srcW > (destX + destW) - offsetX) {
                srcW = (destX + destW) - offsetX;
            }
            if(srcH > (destY + destH) - offsetY) {
                srcH = (destY + destH) - offsetY;
            }
            srcX = Math.floor(srcX);
            srcY = Math.floor(srcY);
            srcW = Math.floor(srcW);
            srcH = Math.floor(srcH);
            offsetX = Math.floor(offsetX + this._bounds.x);
            offsetY = Math.floor(offsetY + this._bounds.y);
            if(srcW > 0 && srcH > 0) {
                context.drawImage(texture, srcX, srcY, srcW, srcH, offsetX, offsetY, srcW, srcH);
            }
        };
        return ScrollRegion;
    })();
    Phaser.ScrollRegion = ScrollRegion;    
})(Phaser || (Phaser = {}));
/// <reference path="../Game.ts" />
/// <reference path="../geom/Quad.ts" />
/// <reference path="ScrollRegion.ts" />
/**
* Phaser - ScrollZone
*
* Creates a scrolling region of the given width and height from an image in the cache.
* The ScrollZone can be positioned anywhere in-world like a normal game object, re-act to physics, collision, etc.
* The image within it is scrolled via ScrollRegions and their scrollSpeed.x/y properties.
* If you create a scroll zone larger than the given source image it will create a DynamicTexture and fill it with a pattern of the source image.
*/
var Phaser;
(function (Phaser) {
    var ScrollZone = (function (_super) {
        __extends(ScrollZone, _super);
        /**
        * ScrollZone constructor
        * Create a new <code>ScrollZone</code>.
        *
        * @param game {Phaser.Game} Current game instance.
        * @param key {string} Asset key for image texture of this object.
        * @param x {number} X position in world coordinate.
        * @param y {number} Y position in world coordinate.
        * @param [width] {number} width of this object.
        * @param [height] {number} height of this object.
        */
        function ScrollZone(game, key, x, y, width, height) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            if (typeof width === "undefined") { width = 0; }
            if (typeof height === "undefined") { height = 0; }
                _super.call(this, game, x, y, width, height);
            /**
            * If this zone is larger than texture image, this will be filled with a pattern of texture.
            * @type {DynamicTexture}
            */
            this._dynamicTexture = null;
            /**
            * Local rendering related temp vars to help avoid gc spikes.
            * @type {number}
            */
            this._dx = 0;
            /**
            * Local rendering related temp vars to help avoid gc spikes.
            * @type {number}
            */
            this._dy = 0;
            /**
            * Local rendering related temp vars to help avoid gc spikes.
            * @type {number}
            */
            this._dw = 0;
            /**
            * Local rendering related temp vars to help avoid gc spikes.
            * @type {number}
            */
            this._dh = 0;
            /**
            * Flip this zone vertically? (default to false)
            * @type {boolean}
            */
            this.flipped = false;
            this.regions = [];
            if(this._game.cache.getImage(key)) {
                this._texture = this._game.cache.getImage(key);
                this.width = this._texture.width;
                this.height = this._texture.height;
                if(width > this._texture.width || height > this._texture.height) {
                    //  Create our repeating texture (as the source image wasn't large enough for the requested size)
                    this.createRepeatingTexture(width, height);
                    this.width = width;
                    this.height = height;
                }
                //  Create a default ScrollRegion at the requested size
                this.addRegion(0, 0, this.width, this.height);
                //  If the zone is smaller than the image itself then shrink the bounds
                if((width < this._texture.width || height < this._texture.height) && width !== 0 && height !== 0) {
                    this.width = width;
                    this.height = height;
                }
            }
        }
        ScrollZone.prototype.addRegion = /**
        * Add a new region to this zone.
        * @param x {number} X position of the new region.
        * @param y {number} Y position of the new region.
        * @param width {number} Width of the new region.
        * @param height {number} Height of the new region.
        * @param [speedX] {number} x-axis scrolling speed.
        * @param [speedY] {number} y-axis scrolling speed.
        * @return {ScrollRegion} The newly added region.
        */
        function (x, y, width, height, speedX, speedY) {
            if (typeof speedX === "undefined") { speedX = 0; }
            if (typeof speedY === "undefined") { speedY = 0; }
            if(x > this.width || y > this.height || x < 0 || y < 0 || (x + width) > this.width || (y + height) > this.height) {
                throw Error('Invalid ScrollRegion defined. Cannot be larger than parent ScrollZone');
                return;
            }
            this.currentRegion = new Phaser.ScrollRegion(x, y, width, height, speedX, speedY);
            this.regions.push(this.currentRegion);
            return this.currentRegion;
        };
        ScrollZone.prototype.setSpeed = /**
        * Set scrolling speed of current region.
        * @param x {number} X speed of current region.
        * @param y {number} Y speed of current region.
        */
        function (x, y) {
            if(this.currentRegion) {
                this.currentRegion.scrollSpeed.setTo(x, y);
            }
            return this;
        };
        ScrollZone.prototype.update = /**
        * Update regions.
        */
        function () {
            for(var i = 0; i < this.regions.length; i++) {
                this.regions[i].update(this._game.time.delta);
            }
        };
        ScrollZone.prototype.inCamera = /**
        * Check whether this zone is visible in a specific camera rectangle.
        * @param camera {Rectangle} The rectangle you want to check.
        * @return {boolean} Return true if bound of this zone intersects the given rectangle, otherwise return false.
        */
        function (camera) {
            if(this.scrollFactor.x !== 1.0 || this.scrollFactor.y !== 1.0) {
                this._dx = this.frameBounds.x - (camera.x * this.scrollFactor.x);
                this._dy = this.frameBounds.y - (camera.y * this.scrollFactor.x);
                this._dw = this.frameBounds.width * this.scale.x;
                this._dh = this.frameBounds.height * this.scale.y;
                return (camera.right > this._dx) && (camera.x < this._dx + this._dw) && (camera.bottom > this._dy) && (camera.y < this._dy + this._dh);
            } else {
                return camera.intersects(this.frameBounds, this.frameBounds.length);
            }
        };
        ScrollZone.prototype.render = /**
        * Render this zone object to a specific camera.
        * @param camera {Camera} The camera this object will be render to.
        * @param cameraOffsetX {number} X offset of camera.
        * @param cameraOffsetY {number} Y offset of camera.
        * @return Return false if not rendered, otherwise return true.
        */
        function (camera, cameraOffsetX, cameraOffsetY) {
            //  Render checks
            if(this.visible == false || this.scale.x == 0 || this.scale.y == 0 || this.alpha < 0.1 || this.cameraBlacklist.indexOf(camera.ID) !== -1 || this.inCamera(camera.worldView) == false) {
                return false;
            }
            //  Alpha
            if(this.alpha !== 1) {
                var globalAlpha = this.context.globalAlpha;
                this.context.globalAlpha = this.alpha;
            }
            this._dx = cameraOffsetX + (this.frameBounds.topLeft.x - camera.worldView.x);
            this._dy = cameraOffsetY + (this.frameBounds.topLeft.y - camera.worldView.y);
            this._dw = this.frameBounds.width * this.scale.x;
            this._dh = this.frameBounds.height * this.scale.y;
            //	Apply camera difference
            if(this.scrollFactor.x !== 1.0 || this.scrollFactor.y !== 1.0) {
                this._dx -= (camera.worldView.x * this.scrollFactor.x);
                this._dy -= (camera.worldView.y * this.scrollFactor.y);
            }
            //	Rotation - needs to work from origin point really, but for now from center
            if(this.angle !== 0 || this.flipped == true) {
                this.context.save();
                this.context.translate(this._dx + (this._dw / 2), this._dy + (this._dh / 2));
                if(this.angle !== 0) {
                    this.context.rotate(this.angle * (Math.PI / 180));
                }
                this._dx = -(this._dw / 2);
                this._dy = -(this._dh / 2);
                if(this.flipped == true) {
                    this.context.scale(-1, 1);
                }
            }
            this._dx = Math.round(this._dx);
            this._dy = Math.round(this._dy);
            this._dw = Math.round(this._dw);
            this._dh = Math.round(this._dh);
            for(var i = 0; i < this.regions.length; i++) {
                if(this._dynamicTexture) {
                    this.regions[i].render(this.context, this._dynamicTexture.canvas, this._dx, this._dy, this._dw, this._dh);
                } else {
                    this.regions[i].render(this.context, this._texture, this._dx, this._dy, this._dw, this._dh);
                }
            }
            if(globalAlpha > -1) {
                this.context.globalAlpha = globalAlpha;
            }
            return true;
        };
        ScrollZone.prototype.createRepeatingTexture = /**
        * Create repeating texture with _texture, and store it into the _dynamicTexture.
        * Used to create texture when texture image is small than size of the zone.
        */
        function (regionWidth, regionHeight) {
            //	Work out how many we'll need of the source image to make it tile properly
            var tileWidth = Math.ceil(this._texture.width / regionWidth) * regionWidth;
            var tileHeight = Math.ceil(this._texture.height / regionHeight) * regionHeight;
            this._dynamicTexture = new Phaser.DynamicTexture(this._game, tileWidth, tileHeight);
            this._dynamicTexture.context.rect(0, 0, tileWidth, tileHeight);
            this._dynamicTexture.context.fillStyle = this._dynamicTexture.context.createPattern(this._texture, "repeat");
            this._dynamicTexture.context.fill();
        };
        return ScrollZone;
    })(Phaser.GameObject);
    Phaser.ScrollZone = ScrollZone;    
})(Phaser || (Phaser = {}));
/// <reference path="AnimationManager.ts" />
/// <reference path="Basic.ts" />
/// <reference path="Cache.ts" />
/// <reference path="CameraManager.ts" />
/// <reference path="Collision.ts" />
/// <reference path="DynamicTexture.ts" />
/// <reference path="FXManager.ts" />
/// <reference path="GameMath.ts" />
/// <reference path="GameObjectFactory.ts" />
/// <reference path="Group.ts" />
/// <reference path="Loader.ts" />
/// <reference path="Motion.ts" />
/// <reference path="Signal.ts" />
/// <reference path="SignalBinding.ts" />
/// <reference path="SoundManager.ts" />
/// <reference path="Stage.ts" />
/// <reference path="Time.ts" />
/// <reference path="TweenManager.ts" />
/// <reference path="VerletManager.ts" />
/// <reference path="World.ts" />
/// <reference path="geom/Vector2.ts" />
/// <reference path="system/Device.ts" />
/// <reference path="system/RandomDataGenerator.ts" />
/// <reference path="system/RequestAnimationFrame.ts" />
/// <reference path="system/input/Input.ts" />
/// <reference path="system/input/Keyboard.ts" />
/// <reference path="system/input/Mouse.ts" />
/// <reference path="system/input/MSPointer.ts" />
/// <reference path="system/input/Touch.ts" />
/// <reference path="gameobjects/Emitter.ts" />
/// <reference path="gameobjects/GameObject.ts" />
/// <reference path="gameobjects/GeomSprite.ts" />
/// <reference path="gameobjects/Particle.ts" />
/// <reference path="gameobjects/Sprite.ts" />
/// <reference path="gameobjects/Tilemap.ts" />
/// <reference path="gameobjects/ScrollZone.ts" />
/**
* Phaser - Game
*
* This is where the magic happens. The Game object is the heart of your game,
* providing quick access to common functions and handling the boot process.
*
* "Hell, there are no rules here - we're trying to accomplish something."
*                                                       Thomas A. Edison
*/
var Phaser;
(function (Phaser) {
    var Game = (function () {
        /**
        * Game constructor
        *
        * Instantiate a new <code>Phaser.Game</code> object.
        *
        * @param callbackContext Which context will the callbacks be called with.
        * @param parent {string} ID of its parent DOM element.
        * @param width {number} The width of your game in game pixels.
        * @param height {number} The height of your game in game pixels.
        * @param initCallback {function} Init callback invoked when init default screen.
        * @param createCallback {function} Create callback invoked when create default screen.
        * @param updateCallback {function} Update callback invoked when update default screen.
        * @param renderCallback {function} Render callback invoked when render default screen.
        * @param destroyCallback {function} Destroy callback invoked when state is destroyed.
        */
        function Game(callbackContext, parent, width, height, initCallback, createCallback, updateCallback, renderCallback, destroyCallback) {
            if (typeof parent === "undefined") { parent = ''; }
            if (typeof width === "undefined") { width = 800; }
            if (typeof height === "undefined") { height = 600; }
            if (typeof initCallback === "undefined") { initCallback = null; }
            if (typeof createCallback === "undefined") { createCallback = null; }
            if (typeof updateCallback === "undefined") { updateCallback = null; }
            if (typeof renderCallback === "undefined") { renderCallback = null; }
            if (typeof destroyCallback === "undefined") { destroyCallback = null; }
            var _this = this;
            /**
            * Max allowable accumulation.
            * @type {number}
            */
            this._maxAccumulation = 32;
            /**
            * Total number of milliseconds elapsed since last update loop.
            * @type {number}
            */
            this._accumulator = 0;
            /**
            * Milliseconds of time per step of the game loop.
            * @type {number}
            */
            this._step = 0;
            /**
            * Whether loader complete loading or not.
            * @type {boolean}
            */
            this._loadComplete = false;
            /**
            * Game is paused?
            * @type {boolean}
            */
            this._paused = false;
            /**
            * The state to be switched to in the next frame.
            * @type {State}
            */
            this._pendingState = null;
            /**
            * The current State object (defaults to null)
            * @type {State}
            */
            this.state = null;
            /**
            * This will be called when init states. (loading assets...)
            * @type {function}
            */
            this.onInitCallback = null;
            /**
            * This will be called when create states. (setup states...)
            * @type {function}
            */
            this.onCreateCallback = null;
            /**
            * This will be called when update states.
            * @type {function}
            */
            this.onUpdateCallback = null;
            /**
            * This will be called when render states.
            * @type {function}
            */
            this.onRenderCallback = null;
            /**
            * This will be called when states paused.
            * @type {function}
            */
            this.onPausedCallback = null;
            /**
            * This will be called when the state is destroyed (i.e. swapping to a new state)
            * @type {function}
            */
            this.onDestroyCallback = null;
            /**
            * Whether the game engine is booted, aka available.
            * @type {boolean}
            */
            this.isBooted = false;
            /**
            * Is game running or paused?
            * @type {boolean}
            */
            this.isRunning = false;
            this.callbackContext = callbackContext;
            this.onInitCallback = initCallback;
            this.onCreateCallback = createCallback;
            this.onUpdateCallback = updateCallback;
            this.onRenderCallback = renderCallback;
            this.onDestroyCallback = destroyCallback;
            if(document.readyState === 'complete' || document.readyState === 'interactive') {
                setTimeout(function () {
                    return _this.boot(parent, width, height);
                });
            } else {
                document.addEventListener('DOMContentLoaded', function () {
                    return _this.boot(parent, width, height);
                }, false);
                window.addEventListener('load', function () {
                    return _this.boot(parent, width, height);
                }, false);
            }
        }
        Game.prototype.boot = /**
        * Initialize engine sub modules and start the game.
        * @param parent {string} ID of parent Dom element.
        * @param width {number} Width of the game screen.
        * @param height {number} Height of the game screen.
        */
        function (parent, width, height) {
            var _this = this;
            if(this.isBooted == true) {
                return;
            }
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
                this.add = new Phaser.GameObjectFactory(this);
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
                this.verlet = new Phaser.Verlet.VerletManager(this, width, height);
                this.framerate = 60;
                this.isBooted = true;
                this.input.start();
                //  Display the default game screen?
                if(this.onInitCallback == null && this.onCreateCallback == null && this.onUpdateCallback == null && this.onRenderCallback == null && this._pendingState == null) {
                    this._raf = new Phaser.RequestAnimationFrame(this, this.bootLoop);
                } else {
                    this.isRunning = true;
                    this._loadComplete = false;
                    this._raf = new Phaser.RequestAnimationFrame(this, this.loop);
                    if(this._pendingState) {
                        this.switchState(this._pendingState, false, false);
                    } else {
                        this.startState();
                    }
                }
            }
        };
        Game.prototype.loadComplete = /**
        * Called when the loader has finished after init was run.
        */
        function () {
            this._loadComplete = true;
        };
        Game.prototype.bootLoop = /**
        * Game loop method will be called when it's booting.
        */
        function () {
            this.tweens.update();
            this.input.update();
            this.stage.update();
        };
        Game.prototype.pausedLoop = /**
        * Game loop method will be called when it's paused.
        */
        function () {
            this.tweens.update();
            this.input.update();
            this.stage.update();
            if(this.onPausedCallback !== null) {
                this.onPausedCallback.call(this.callbackContext);
            }
        };
        Game.prototype.loop = /**
        * Game loop method will be called when it's running.
        */
        function () {
            this.tweens.update();
            this.input.update();
            this.stage.update();
            this.verlet.update();
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
        Game.prototype.startState = /**
        * Start current state.
        */
        function () {
            if(this.onInitCallback !== null) {
                this.loader.reset();
                this.onInitCallback.call(this.callbackContext);
                //  Is the loader empty?
                if(this.loader.queueSize == 0) {
                    if(this.onCreateCallback !== null) {
                        this.onCreateCallback.call(this.callbackContext);
                    }
                    this._loadComplete = true;
                }
            } else {
                //  No init? Then there was nothing to load either
                if(this.onCreateCallback !== null) {
                    this.onCreateCallback.call(this.callbackContext);
                }
                this._loadComplete = true;
            }
        };
        Game.prototype.setCallbacks = /**
        * Set all state callbacks (init, create, update, render).
        * @param initCallback {function} Init callback invoked when init state.
        * @param createCallback {function} Create callback invoked when create state.
        * @param updateCallback {function} Update callback invoked when update state.
        * @param renderCallback {function} Render callback invoked when render state.
        * @param destroyCallback {function} Destroy callback invoked when state is destroyed.
        */
        function (initCallback, createCallback, updateCallback, renderCallback, destroyCallback) {
            if (typeof initCallback === "undefined") { initCallback = null; }
            if (typeof createCallback === "undefined") { createCallback = null; }
            if (typeof updateCallback === "undefined") { updateCallback = null; }
            if (typeof renderCallback === "undefined") { renderCallback = null; }
            if (typeof destroyCallback === "undefined") { destroyCallback = null; }
            this.onInitCallback = initCallback;
            this.onCreateCallback = createCallback;
            this.onUpdateCallback = updateCallback;
            this.onRenderCallback = renderCallback;
            this.onDestroyCallback = destroyCallback;
        };
        Game.prototype.switchState = /**
        * Switch to a new State.
        * @param state {State} The state you want to switch to.
        * @param [clearWorld] {boolean} clear everything in the world? (Default to true)
        * @param [clearCache] {boolean} clear asset cache? (Default to false and ONLY available when clearWorld=true)
        */
        function (state, clearWorld, clearCache) {
            if (typeof clearWorld === "undefined") { clearWorld = true; }
            if (typeof clearCache === "undefined") { clearCache = false; }
            if(this.isBooted == false) {
                this._pendingState = state;
                return;
            }
            //  Destroy current state?
            if(this.onDestroyCallback !== null) {
                this.onDestroyCallback.call(this.callbackContext);
            }
            this.input.reset(true);
            //  Prototype?
            if(typeof state === 'function') {
                this.state = new state(this);
            }
            //  Ok, have we got the right functions?
            if(this.state['create'] || this.state['update']) {
                this.callbackContext = this.state;
                this.onInitCallback = null;
                this.onCreateCallback = null;
                this.onUpdateCallback = null;
                this.onRenderCallback = null;
                this.onPausedCallback = null;
                this.onDestroyCallback = null;
                //  Bingo, let's set them up
                if(this.state['init']) {
                    this.onInitCallback = this.state['init'];
                }
                if(this.state['create']) {
                    this.onCreateCallback = this.state['create'];
                }
                if(this.state['update']) {
                    this.onUpdateCallback = this.state['update'];
                }
                if(this.state['render']) {
                    this.onRenderCallback = this.state['render'];
                }
                if(this.state['paused']) {
                    this.onPausedCallback = this.state['paused'];
                }
                if(this.state['destroy']) {
                    this.onDestroyCallback = this.state['destroy'];
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
                throw new Error("Invalid State object given. Must contain at least a create or update function.");
            }
        };
        Game.prototype.destroy = /**
        * Nuke the whole game from orbit
        */
        function () {
            this.callbackContext = null;
            this.onInitCallback = null;
            this.onCreateCallback = null;
            this.onUpdateCallback = null;
            this.onRenderCallback = null;
            this.onPausedCallback = null;
            this.onDestroyCallback = null;
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
                    this._raf.callback = this.pausedLoop;
                } else if(value == false && this._paused == true) {
                    this._paused = false;
                    //this.time.time = window.performance.now ? (performance.now() + performance.timing.navigationStart) : Date.now();
                    this.input.reset();
                    if(this.isRunning == false) {
                        this._raf.callback = this.bootLoop;
                    } else {
                        this._raf.callback = this.loop;
                    }
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
        Game.prototype.collide = /**
        * Checks for overlaps between two objects using the world QuadTree. Can be GameObject vs. GameObject, GameObject vs. Group or Group vs. Group.
        * Note: Does not take the objects scrollFactor into account. All overlaps are check in world space.
        * @param object1 The first GameObject or Group to check. If null the world.group is used.
        * @param object2 The second GameObject or Group to check.
        * @param notifyCallback A callback function that is called if the objects overlap. The two objects will be passed to this function in the same order in which you passed them to Collision.overlap.
        * @param processCallback A callback function that lets you perform additional checks against the two objects if they overlap. If this is set then notifyCallback will only be called if processCallback returns true.
        * @param context The context in which the callbacks will be called
        * @returns {boolean} true if the objects overlap, otherwise false.
        */
        function (objectOrGroup1, objectOrGroup2, notifyCallback, context) {
            if (typeof objectOrGroup1 === "undefined") { objectOrGroup1 = null; }
            if (typeof objectOrGroup2 === "undefined") { objectOrGroup2 = null; }
            if (typeof notifyCallback === "undefined") { notifyCallback = null; }
            if (typeof context === "undefined") { context = this.callbackContext; }
            return this.collision.overlap(objectOrGroup1, objectOrGroup2, notifyCallback, Phaser.Collision.separate, context);
        };
        Object.defineProperty(Game.prototype, "camera", {
            get: function () {
                return this.world.cameras.current;
            },
            enumerable: true,
            configurable: true
        });
        return Game;
    })();
    Phaser.Game = Game;    
})(Phaser || (Phaser = {}));
/// <reference path="Game.ts" />
/**
* Phaser - FXManager
*
* The FXManager controls all special effects applied to game objects such as Cameras.
*/
var Phaser;
(function (Phaser) {
    var FXManager = (function () {
        function FXManager(game, parent) {
            this._game = game;
            this._parent = parent;
            this._fx = [];
            this.active = true;
            this.visible = true;
        }
        FXManager.prototype.add = /**
        * Adds a new FX to the FXManager.
        * The effect must be an object with at least one of the following methods: preUpdate, postUpdate, preRender, render or postRender.
        * A new instance of the effect will be created and a reference to Game will be passed to the object constructor.
        * @param {object} effect
        * @return {any}
        */
        function (effect) {
            var result = false;
            var newEffect = {
                effect: {
                },
                preUpdate: false,
                postUpdate: false,
                preRender: false,
                render: false,
                postRender: false
            };
            if(typeof effect === 'function') {
                newEffect.effect = new effect(this._game, this._parent);
            } else {
                throw new Error("Invalid object given to Phaser.FXManager.add");
            }
            //  Check for methods now to avoid having to do this every loop
            if(typeof newEffect.effect['preUpdate'] === 'function') {
                newEffect.preUpdate = true;
                result = true;
            }
            if(typeof newEffect.effect['postUpdate'] === 'function') {
                newEffect.postUpdate = true;
                result = true;
            }
            if(typeof newEffect.effect['preRender'] === 'function') {
                newEffect.preRender = true;
                result = true;
            }
            if(typeof newEffect.effect['render'] === 'function') {
                newEffect.render = true;
                result = true;
            }
            if(typeof newEffect.effect['postRender'] === 'function') {
                newEffect.postRender = true;
                result = true;
            }
            if(result == true) {
                this._length = this._fx.push(newEffect);
                return newEffect.effect;
            } else {
                return result;
            }
        };
        FXManager.prototype.preUpdate = /**
        * Pre-update is called at the start of the objects update cycle, before any other updates have taken place.
        */
        function () {
            if(this.active) {
                for(var i = 0; i < this._length; i++) {
                    if(this._fx[i].preUpdate) {
                        this._fx[i].effect.preUpdate();
                    }
                }
            }
        };
        FXManager.prototype.postUpdate = /**
        * Post-update is called at the end of the objects update cycle, after other update logic has taken place.
        */
        function () {
            if(this.active) {
                for(var i = 0; i < this._length; i++) {
                    if(this._fx[i].postUpdate) {
                        this._fx[i].effect.postUpdate();
                    }
                }
            }
        };
        FXManager.prototype.preRender = /**
        * Pre-render is called at the start of the object render cycle, before any transforms have taken place.
        * It happens directly AFTER a canvas context.save has happened if added to a Camera.
        * @param {Camera} camera
        * @param {number} cameraX
        * @param {number} cameraY
        * @param {number} cameraWidth
        * @param {number} cameraHeight
        */
        function (camera, cameraX, cameraY, cameraWidth, cameraHeight) {
            if(this.visible) {
                for(var i = 0; i < this._length; i++) {
                    if(this._fx[i].preRender) {
                        this._fx[i].effect.preRender(camera, cameraX, cameraY, cameraWidth, cameraHeight);
                    }
                }
            }
        };
        FXManager.prototype.render = /**
        * render is called during the objects render cycle, right after all transforms have finished, but before any children/image data is rendered.
        * @param {Camera} camera
        * @param {number} cameraX
        * @param {number} cameraY
        * @param {number} cameraWidth
        * @param {number} cameraHeight
        */
        function (camera, cameraX, cameraY, cameraWidth, cameraHeight) {
            if(this.visible) {
                for(var i = 0; i < this._length; i++) {
                    if(this._fx[i].preRender) {
                        this._fx[i].effect.preRender(camera, cameraX, cameraY, cameraWidth, cameraHeight);
                    }
                }
            }
        };
        FXManager.prototype.postRender = /**
        * Post-render is called during the objects render cycle, after the children/image data has been rendered.
        * It happens directly BEFORE a canvas context.restore has happened if added to a Camera.
        */
        function (camera, cameraX, cameraY, cameraWidth, cameraHeight) {
            if(this.visible) {
                for(var i = 0; i < this._length; i++) {
                    if(this._fx[i].postRender) {
                        this._fx[i].effect.postRender(camera, cameraX, cameraY, cameraWidth, cameraHeight);
                    }
                }
            }
        };
        FXManager.prototype.destroy = /**
        * Clear down this FXManager and null out references
        */
        function () {
            this._game = null;
            this._fx = null;
        };
        return FXManager;
    })();
    Phaser.FXManager = FXManager;    
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
        /**
        * State constructor
        * Create a new <code>State</code>.
        */
        function State(game) {
            this.game = game;
            this.add = game.add;
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
        State.prototype.init = //  Override these in your own States
        /**
        * Override this method to add some load operations.
        * If you need to use the loader, you may need to use them here.
        */
        function () {
        };
        State.prototype.create = /**
        * This method is called after the game engine successfully switches states.
        * Feel free to add any setup code here.(Do not load anything here, override init() instead)
        */
        function () {
        };
        State.prototype.update = /**
        * Put update logic here.
        */
        function () {
        };
        State.prototype.render = /**
        * Put render operations here.
        */
        function () {
        };
        State.prototype.paused = /**
        * This method will be called when game paused.
        */
        function () {
        };
        State.prototype.destroy = /**
        * This method will be called when the state is destroyed
        */
        function () {
        };
        State.prototype.collide = /**
        * Checks for overlaps between two objects using the world QuadTree. Can be GameObject vs. GameObject, GameObject vs. Group or Group vs. Group.
        * Note: Does not take the objects scrollFactor into account. All overlaps are check in world space.
        * @param object1 The first GameObject or Group to check. If null the world.group is used.
        * @param object2 The second GameObject or Group to check.
        * @param notifyCallback A callback function that is called if the objects overlap. The two objects will be passed to this function in the same order in which you passed them to Collision.overlap.
        * @param processCallback A callback function that lets you perform additional checks against the two objects if they overlap. If this is set then notifyCallback will only be called if processCallback returns true.
        * @param context The context in which the callbacks will be called
        * @returns {boolean} true if the objects overlap, otherwise false.
        */
        function (objectOrGroup1, objectOrGroup2, notifyCallback, context) {
            if (typeof objectOrGroup1 === "undefined") { objectOrGroup1 = null; }
            if (typeof objectOrGroup2 === "undefined") { objectOrGroup2 = null; }
            if (typeof notifyCallback === "undefined") { notifyCallback = null; }
            if (typeof context === "undefined") { context = this.game.callbackContext; }
            return this.collision.overlap(objectOrGroup1, objectOrGroup2, notifyCallback, Phaser.Collision.separate, context);
        };
        return State;
    })();
    Phaser.State = State;    
})(Phaser || (Phaser = {}));
