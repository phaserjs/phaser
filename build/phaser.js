var Phaser;
(function (Phaser) {
    var Basic = (function () {
        function Basic(game) {
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
        Basic.prototype.destroy = function () {
        };
        Basic.prototype.preUpdate = function () {
        };
        Basic.prototype.update = function () {
        };
        Basic.prototype.postUpdate = function () {
        };
        Basic.prototype.render = function (camera, cameraOffsetX, cameraOffsetY) {
        };
        Basic.prototype.kill = function () {
            this.alive = false;
            this.exists = false;
        };
        Basic.prototype.revive = function () {
            this.alive = true;
            this.exists = true;
        };
        Basic.prototype.toString = function () {
            return "";
        };
        return Basic;
    })();
    Phaser.Basic = Basic;    
})(Phaser || (Phaser = {}));
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
var Phaser;
(function (Phaser) {
    var SignalBinding = (function () {
        function SignalBinding(signal, listener, isOnce, listenerContext, priority) {
            if (typeof priority === "undefined") { priority = 0; }
            this.active = true;
            this.params = null;
            this._listener = listener;
            this._isOnce = isOnce;
            this.context = listenerContext;
            this._signal = signal;
            this.priority = priority || 0;
        }
        SignalBinding.prototype.execute = function (paramsArr) {
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
        SignalBinding.prototype.detach = function () {
            return this.isBound() ? this._signal.remove(this._listener, this.context) : null;
        };
        SignalBinding.prototype.isBound = function () {
            return (!!this._signal && !!this._listener);
        };
        SignalBinding.prototype.isOnce = function () {
            return this._isOnce;
        };
        SignalBinding.prototype.getListener = function () {
            return this._listener;
        };
        SignalBinding.prototype.getSignal = function () {
            return this._signal;
        };
        SignalBinding.prototype._destroy = function () {
            delete this._signal;
            delete this._listener;
            delete this.context;
        };
        SignalBinding.prototype.toString = function () {
            return '[SignalBinding isOnce:' + this._isOnce + ', isBound:' + this.isBound() + ', active:' + this.active + ']';
        };
        return SignalBinding;
    })();
    Phaser.SignalBinding = SignalBinding;    
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    var Signal = (function () {
        function Signal() {
            this._bindings = [];
            this._prevParams = null;
            this.memorize = false;
            this._shouldPropagate = true;
            this.active = true;
        }
        Signal.VERSION = '1.0.0';
        Signal.prototype.validateListener = function (listener, fnName) {
            if(typeof listener !== 'function') {
                throw new Error('listener is a required param of {fn}() and should be a Function.'.replace('{fn}', fnName));
            }
        };
        Signal.prototype._registerListener = function (listener, isOnce, listenerContext, priority) {
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
        Signal.prototype._addBinding = function (binding) {
            var n = this._bindings.length;
            do {
                --n;
            }while(this._bindings[n] && binding.priority <= this._bindings[n].priority);
            this._bindings.splice(n + 1, 0, binding);
        };
        Signal.prototype._indexOfListener = function (listener, context) {
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
        Signal.prototype.has = function (listener, context) {
            if (typeof context === "undefined") { context = null; }
            return this._indexOfListener(listener, context) !== -1;
        };
        Signal.prototype.add = function (listener, listenerContext, priority) {
            if (typeof listenerContext === "undefined") { listenerContext = null; }
            if (typeof priority === "undefined") { priority = 0; }
            this.validateListener(listener, 'add');
            return this._registerListener(listener, false, listenerContext, priority);
        };
        Signal.prototype.addOnce = function (listener, listenerContext, priority) {
            if (typeof listenerContext === "undefined") { listenerContext = null; }
            if (typeof priority === "undefined") { priority = 0; }
            this.validateListener(listener, 'addOnce');
            return this._registerListener(listener, true, listenerContext, priority);
        };
        Signal.prototype.remove = function (listener, context) {
            if (typeof context === "undefined") { context = null; }
            this.validateListener(listener, 'remove');
            var i = this._indexOfListener(listener, context);
            if(i !== -1) {
                this._bindings[i]._destroy();
                this._bindings.splice(i, 1);
            }
            return listener;
        };
        Signal.prototype.removeAll = function () {
            var n = this._bindings.length;
            while(n--) {
                this._bindings[n]._destroy();
            }
            this._bindings.length = 0;
        };
        Signal.prototype.getNumListeners = function () {
            return this._bindings.length;
        };
        Signal.prototype.halt = function () {
            this._shouldPropagate = false;
        };
        Signal.prototype.dispatch = function () {
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
                return;
            }
            bindings = this._bindings.slice(0);
            this._shouldPropagate = true;
            do {
                n--;
            }while(bindings[n] && this._shouldPropagate && bindings[n].execute(paramsArr) !== false);
        };
        Signal.prototype.forget = function () {
            this._prevParams = null;
        };
        Signal.prototype.dispose = function () {
            this.removeAll();
            delete this._bindings;
            delete this._prevParams;
        };
        Signal.prototype.toString = function () {
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
            this.outOfBoundsAction = 0;
            this.z = 0;
            this.rotationOffset = 0;
            this.renderRotation = true;
            this.moves = true;
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
        GameObject.OUT_OF_BOUNDS_STOP = 0;
        GameObject.OUT_OF_BOUNDS_KILL = 1;
        GameObject.prototype.preUpdate = function () {
            this.last.x = this.bounds.x;
            this.last.y = this.bounds.y;
        };
        GameObject.prototype.update = function () {
        };
        GameObject.prototype.postUpdate = function () {
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
        GameObject.prototype.overlaps = function (ObjectOrGroup, InScreenSpace, Camera) {
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
        GameObject.prototype.overlapsAt = function (X, Y, ObjectOrGroup, InScreenSpace, Camera) {
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
            if(!InScreenSpace) {
                return (ObjectOrGroup.x + ObjectOrGroup.width > X) && (ObjectOrGroup.x < X + this.width) && (ObjectOrGroup.y + ObjectOrGroup.height > Y) && (ObjectOrGroup.y < Y + this.height);
            }
            if(Camera == null) {
                Camera = this._game.camera;
            }
            var objectScreenPos = ObjectOrGroup.getScreenXY(null, Camera);
            this._point.x = X - Camera.scroll.x * this.scrollFactor.x;
            this._point.y = Y - Camera.scroll.y * this.scrollFactor.y;
            this._point.x += (this._point.x > 0) ? 0.0000001 : -0.0000001;
            this._point.y += (this._point.y > 0) ? 0.0000001 : -0.0000001;
            return (objectScreenPos.x + ObjectOrGroup.width > this._point.x) && (objectScreenPos.x < this._point.x + this.width) && (objectScreenPos.y + ObjectOrGroup.height > this._point.y) && (objectScreenPos.y < this._point.y + this.height);
        };
        GameObject.prototype.overlapsPoint = function (point, InScreenSpace, Camera) {
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
        GameObject.prototype.onScreen = function (Camera) {
            if (typeof Camera === "undefined") { Camera = null; }
            if(Camera == null) {
                Camera = this._game.camera;
            }
            this.getScreenXY(this._point, Camera);
            return (this._point.x + this.width > 0) && (this._point.x < Camera.width) && (this._point.y + this.height > 0) && (this._point.y < Camera.height);
        };
        GameObject.prototype.getScreenXY = function (point, Camera) {
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
            get: function () {
                return (this.allowCollisions & Phaser.Collision.ANY) > Phaser.Collision.NONE;
            },
            set: function (Solid) {
                if(Solid) {
                    this.allowCollisions = Phaser.Collision.ANY;
                } else {
                    this.allowCollisions = Phaser.Collision.NONE;
                }
            },
            enumerable: true,
            configurable: true
        });
        GameObject.prototype.getMidpoint = function (point) {
            if (typeof point === "undefined") { point = null; }
            if(point == null) {
                point = new Phaser.MicroPoint();
            }
            point.copyFrom(this.bounds.center);
            return point;
        };
        GameObject.prototype.reset = function (X, Y) {
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
        GameObject.prototype.isTouching = function (Direction) {
            return (this.touching & Direction) > Phaser.Collision.NONE;
        };
        GameObject.prototype.justTouched = function (Direction) {
            return ((this.touching & Direction) > Phaser.Collision.NONE) && ((this.wasTouching & Direction) <= Phaser.Collision.NONE);
        };
        GameObject.prototype.hurt = function (Damage) {
            this.health = this.health - Damage;
            if(this.health <= 0) {
                this.kill();
            }
        };
        GameObject.prototype.setBounds = function (x, y, width, height) {
            this.worldBounds = new Phaser.Quad(x, y, width, height);
        };
        GameObject.prototype.hideFromCamera = function (camera) {
            if(this.cameraBlacklist.indexOf(camera.ID) == -1) {
                this.cameraBlacklist.push(camera.ID);
            }
        };
        GameObject.prototype.showToCamera = function (camera) {
            if(this.cameraBlacklist.indexOf(camera.ID) !== -1) {
                this.cameraBlacklist.slice(this.cameraBlacklist.indexOf(camera.ID), 1);
            }
        };
        GameObject.prototype.clearCameraList = function () {
            this.cameraBlacklist.length = 0;
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
            set: function (value) {
                this.bounds.width = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameObject.prototype, "height", {
            get: function () {
                return this.bounds.height;
            },
            set: function (value) {
                this.bounds.height = value;
            },
            enumerable: true,
            configurable: true
        });
        return GameObject;
    })(Phaser.Basic);
    Phaser.GameObject = GameObject;    
})(Phaser || (Phaser = {}));
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
            this.flipped = false;
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
            if(this.visible == false || this.scale.x == 0 || this.scale.y == 0 || this.alpha < 0.1 || this.cameraBlacklist.indexOf(camera.ID) !== -1 || this.inCamera(camera.worldView) == false) {
                return false;
            }
            if(this.alpha !== 1) {
                var globalAlpha = this._game.stage.context.globalAlpha;
                this._game.stage.context.globalAlpha = this.alpha;
            }
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
            if(this.scrollFactor.x !== 1.0 || this.scrollFactor.y !== 1.0) {
                this._dx -= (camera.worldView.x * this.scrollFactor.x);
                this._dy -= (camera.worldView.y * this.scrollFactor.y);
            }
            if(this.angle !== 0 || this.rotationOffset !== 0 || this.flipped == true) {
                this._game.stage.context.save();
                this._game.stage.context.translate(this._dx + (this._dw / 2), this._dy + (this._dh / 2));
                if(this.renderRotation == true && (this.angle !== 0 || this.rotationOffset !== 0)) {
                    this._game.stage.context.rotate((this.rotationOffset + this.angle) * (Math.PI / 180));
                }
                this._dx = -(this._dw / 2);
                this._dy = -(this._dh / 2);
                if(this.flipped == true) {
                    this._game.stage.context.scale(-1, 1);
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
                    this._game.stage.context.drawImage(this._texture.canvas, this._sx, this._sy, this._sw, this._sh, this._dx, this._dy, this._dw, this._dh);
                } else {
                    this._game.stage.context.drawImage(this._texture, this._sx, this._sy, this._sw, this._sh, this._dx, this._dy, this._dw, this._dh);
                }
            } else {
                this._game.stage.context.fillStyle = 'rgb(255,255,255)';
                this._game.stage.context.fillRect(this._dx, this._dy, this._dw, this._dh);
            }
            if(this.flipped === true || this.rotation !== 0 || this.rotationOffset !== 0) {
                this._game.stage.context.restore();
            }
            if(this.renderDebug) {
                this.renderBounds(camera, cameraOffsetX, cameraOffsetY);
            }
            if(globalAlpha > -1) {
                this._game.stage.context.globalAlpha = globalAlpha;
            }
            return true;
        };
        Sprite.prototype.renderBounds = function (camera, cameraOffsetX, cameraOffsetY) {
            this._dx = cameraOffsetX + (this.bounds.topLeft.x - camera.worldView.x);
            this._dy = cameraOffsetY + (this.bounds.topLeft.y - camera.worldView.y);
            this._game.stage.context.fillStyle = this.renderDebugColor;
            this._game.stage.context.fillRect(this._dx, this._dy, this._dw, this._dh);
            this._game.stage.context.fillStyle = this.renderDebugPointColor;
            var hw = this.bounds.halfWidth * this.scale.x;
            var hh = this.bounds.halfHeight * this.scale.y;
            var sw = (this.bounds.width * this.scale.x) - 1;
            var sh = (this.bounds.height * this.scale.y) - 1;
            this._game.stage.context.fillRect(this._dx, this._dy, 1, 1);
            this._game.stage.context.fillRect(this._dx + hw, this._dy, 1, 1);
            this._game.stage.context.fillRect(this._dx + sw, this._dy, 1, 1);
            this._game.stage.context.fillRect(this._dx, this._dy + hh, 1, 1);
            this._game.stage.context.fillRect(this._dx + hw, this._dy + hh, 1, 1);
            this._game.stage.context.fillRect(this._dx + sw, this._dy + hh, 1, 1);
            this._game.stage.context.fillRect(this._dx, this._dy + sh, 1, 1);
            this._game.stage.context.fillRect(this._dx + hw, this._dy + sh, 1, 1);
            this._game.stage.context.fillRect(this._dx + sw, this._dy + sh, 1, 1);
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
var Phaser;
(function (Phaser) {
    var Camera = (function () {
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
            this.showBorder = false;
            this.borderColor = 'rgb(255,255,255)';
            this.opaque = true;
            this._bgColor = 'rgb(0,0,0)';
            this._bgTextureRepeat = 'repeat';
            this.showShadow = false;
            this.shadowColor = 'rgb(0,0,0)';
            this.shadowBlur = 10;
            this.shadowOffset = new Phaser.Point(4, 4);
            this.visible = true;
            this.alpha = 1;
            this.inputX = 0;
            this.inputY = 0;
            this._game = game;
            this.ID = id;
            this._stageX = x;
            this._stageY = y;
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
        Camera.prototype.flash = function (color, duration, onComplete, force) {
            if (typeof color === "undefined") { color = 0xffffff; }
            if (typeof duration === "undefined") { duration = 1; }
            if (typeof onComplete === "undefined") { onComplete = null; }
            if (typeof force === "undefined") { force = false; }
            if(force === false && this._fxFlashAlpha > 0) {
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
        Camera.prototype.fade = function (color, duration, onComplete, force) {
            if (typeof color === "undefined") { color = 0x000000; }
            if (typeof duration === "undefined") { duration = 1; }
            if (typeof onComplete === "undefined") { onComplete = null; }
            if (typeof force === "undefined") { force = false; }
            if(force === false && this._fxFadeAlpha > 0) {
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
        Camera.prototype.shake = function (intensity, duration, onComplete, force, direction) {
            if (typeof intensity === "undefined") { intensity = 0.05; }
            if (typeof duration === "undefined") { duration = 0.5; }
            if (typeof onComplete === "undefined") { onComplete = null; }
            if (typeof force === "undefined") { force = true; }
            if (typeof direction === "undefined") { direction = Camera.SHAKE_BOTH_AXES; }
            if(!force && ((this._fxShakeOffset.x != 0) || (this._fxShakeOffset.y != 0))) {
                return;
            }
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
        Camera.prototype.stopFX = function () {
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
        Camera.prototype.setBounds = function (x, y, width, height) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            if (typeof width === "undefined") { width = 0; }
            if (typeof height === "undefined") { height = 0; }
            if(this.bounds == null) {
                this.bounds = new Phaser.Rectangle();
            }
            this.bounds.setTo(x, y, width, height);
            this.worldView.setTo(x, y, width, height);
            this.scroll.setTo(0, 0);
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
            this.inputX = this.worldView.x + this._game.input.x;
            this.inputY = this.worldView.y + this._game.input.y;
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
                        this._fxShakeOffset.x = (this._game.math.random() * this._fxShakeIntensity * this.worldView.width * 2 - this._fxShakeIntensity * this.worldView.width);
                    }
                    if((this._fxShakeDirection == Camera.SHAKE_BOTH_AXES) || (this._fxShakeDirection == Camera.SHAKE_VERTICAL_ONLY)) {
                        this._fxShakeOffset.y = (this._game.math.random() * this._fxShakeIntensity * this.worldView.height * 2 - this._fxShakeIntensity * this.worldView.height);
                    }
                }
            }
        };
        Camera.prototype.render = function () {
            if(this.visible === false || this.alpha < 0.1) {
                return;
            }
            if((this._fxShakeOffset.x != 0) || (this._fxShakeOffset.y != 0)) {
                this._stageX = this._fxShakePrevX + (this.worldView.halfWidth) + this._fxShakeOffset.x;
                this._stageY = this._fxShakePrevY + (this.worldView.halfHeight) + this._fxShakeOffset.y;
            }
            this._game.stage.context.save();
            if(this.alpha !== 1) {
                this._game.stage.context.globalAlpha = this.alpha;
            }
            this._sx = this._stageX;
            this._sy = this._stageY;
            if(this.showShadow) {
                this._game.stage.context.shadowColor = this.shadowColor;
                this._game.stage.context.shadowBlur = this.shadowBlur;
                this._game.stage.context.shadowOffsetX = this.shadowOffset.x;
                this._game.stage.context.shadowOffsetY = this.shadowOffset.y;
            }
            if(this.scale.x !== 1 || this.scale.y !== 1) {
                this._game.stage.context.scale(this.scale.x, this.scale.y);
                this._sx = this._sx / this.scale.x;
                this._sy = this._sy / this.scale.y;
            }
            if(this._rotation !== 0) {
                this._game.stage.context.translate(this._sx + this.worldView.halfWidth, this._sy + this.worldView.halfHeight);
                this._game.stage.context.rotate(this._rotation * (Math.PI / 180));
                this._game.stage.context.translate(-(this._sx + this.worldView.halfWidth), -(this._sy + this.worldView.halfHeight));
            }
            if(this.opaque == true) {
                if(this._bgTexture) {
                    this._game.stage.context.fillStyle = this._bgTexture;
                    this._game.stage.context.fillRect(this._sx, this._sy, this.worldView.width, this.worldView.height);
                } else {
                    this._game.stage.context.fillStyle = this._bgColor;
                    this._game.stage.context.fillRect(this._sx, this._sy, this.worldView.width, this.worldView.height);
                }
            }
            if(this.showShadow) {
                this._game.stage.context.shadowBlur = 0;
                this._game.stage.context.shadowOffsetX = 0;
                this._game.stage.context.shadowOffsetY = 0;
            }
            if(this._clip) {
                this._game.stage.context.beginPath();
                this._game.stage.context.rect(this._sx, this._sy, this.worldView.width, this.worldView.height);
                this._game.stage.context.closePath();
                this._game.stage.context.clip();
            }
            this._game.world.group.render(this, this._sx, this._sy);
            if(this.showBorder) {
                this._game.stage.context.strokeStyle = this.borderColor;
                this._game.stage.context.lineWidth = 1;
                this._game.stage.context.rect(this._sx, this._sy, this.worldView.width, this.worldView.height);
                this._game.stage.context.stroke();
            }
            if(this._fxFlashAlpha > 0) {
                this._game.stage.context.fillStyle = this._fxFlashColor + this._fxFlashAlpha + ')';
                this._game.stage.context.fillRect(this._sx, this._sy, this.worldView.width, this.worldView.height);
            }
            if(this._fxFadeAlpha > 0) {
                this._game.stage.context.fillStyle = this._fxFadeColor + this._fxFadeAlpha + ')';
                this._game.stage.context.fillRect(this._sx, this._sy, this.worldView.width, this.worldView.height);
            }
            if(this.scale.x !== 1 || this.scale.y !== 1) {
                this._game.stage.context.scale(1, 1);
            }
            if(this._rotation !== 0 || this._clip) {
                this._game.stage.context.translate(0, 0);
            }
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
var Phaser;
(function (Phaser) {
    var CameraManager = (function () {
        function CameraManager(game, x, y, width, height) {
            this._cameraInstance = 0;
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
            var newCam = new Phaser.Camera(this._game, this._cameraInstance, x, y, width, height);
            this._cameras.push(newCam);
            this._cameraInstance++;
            return newCam;
        };
        CameraManager.prototype.removeCamera = function (id) {
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
        CameraManager.prototype.destroy = function () {
            this._cameras.length = 0;
            this.current = this.addCamera(0, 0, this._game.stage.width, this._game.stage.height);
        };
        return CameraManager;
    })();
    Phaser.CameraManager = CameraManager;    
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    var Point = (function () {
        function Point(x, y) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            this.setTo(x, y);
        }
        Point.prototype.add = function (toAdd, output) {
            if (typeof output === "undefined") { output = new Point(); }
            return output.setTo(this.x + toAdd.x, this.y + toAdd.y);
        };
        Point.prototype.addTo = function (x, y) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            return this.setTo(this.x + x, this.y + y);
        };
        Point.prototype.subtractFrom = function (x, y) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            return this.setTo(this.x - x, this.y - y);
        };
        Point.prototype.invert = function () {
            return this.setTo(this.y, this.x);
        };
        Point.prototype.clamp = function (min, max) {
            this.clampX(min, max);
            this.clampY(min, max);
            return this;
        };
        Point.prototype.clampX = function (min, max) {
            this.x = Math.max(Math.min(this.x, max), min);
            return this;
        };
        Point.prototype.clampY = function (min, max) {
            this.x = Math.max(Math.min(this.x, max), min);
            this.y = Math.max(Math.min(this.y, max), min);
            return this;
        };
        Point.prototype.clone = function (output) {
            if (typeof output === "undefined") { output = new Point(); }
            return output.setTo(this.x, this.y);
        };
        Point.prototype.copyFrom = function (source) {
            return this.setTo(source.x, source.y);
        };
        Point.prototype.copyTo = function (target) {
            return target.setTo(this.x, this.y);
        };
        Point.prototype.distanceTo = function (target, round) {
            if (typeof round === "undefined") { round = false; }
            var dx = this.x - target.x;
            var dy = this.y - target.y;
            if(round === true) {
                return Math.round(Math.sqrt(dx * dx + dy * dy));
            } else {
                return Math.sqrt(dx * dx + dy * dy);
            }
        };
        Point.distanceBetween = function distanceBetween(pointA, pointB, round) {
            if (typeof round === "undefined") { round = false; }
            var dx = pointA.x - pointB.x;
            var dy = pointA.y - pointB.y;
            if(round === true) {
                return Math.round(Math.sqrt(dx * dx + dy * dy));
            } else {
                return Math.sqrt(dx * dx + dy * dy);
            }
        };
        Point.prototype.distanceCompare = function (target, distance) {
            if(this.distanceTo(target) >= distance) {
                return true;
            } else {
                return false;
            }
        };
        Point.prototype.equals = function (toCompare) {
            if(this.x === toCompare.x && this.y === toCompare.y) {
                return true;
            } else {
                return false;
            }
        };
        Point.prototype.interpolate = function (pointA, pointB, f) {
        };
        Point.prototype.offset = function (dx, dy) {
            this.x += dx;
            this.y += dy;
            return this;
        };
        Point.prototype.polar = function (length, angle) {
        };
        Point.prototype.setTo = function (x, y) {
            this.x = x;
            this.y = y;
            return this;
        };
        Point.prototype.subtract = function (point, output) {
            if (typeof output === "undefined") { output = new Point(); }
            return output.setTo(this.x - point.x, this.y - point.y);
        };
        Point.prototype.toString = function () {
            return '[{Point (x=' + this.x + ' y=' + this.y + ')}]';
        };
        return Point;
    })();
    Phaser.Point = Point;    
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    var MicroPoint = (function () {
        function MicroPoint(x, y, parent) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            if (typeof parent === "undefined") { parent = null; }
            this._x = x;
            this._y = y;
            this.parent = parent;
        }
        Object.defineProperty(MicroPoint.prototype, "x", {
            get: function () {
                return this._x;
            },
            set: function (value) {
                this._x = value;
                if(this.parent) {
                    this.parent.updateBounds();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MicroPoint.prototype, "y", {
            get: function () {
                return this._y;
            },
            set: function (value) {
                this._y = value;
                if(this.parent) {
                    this.parent.updateBounds();
                }
            },
            enumerable: true,
            configurable: true
        });
        MicroPoint.prototype.copyFrom = function (source) {
            return this.setTo(source.x, source.y);
        };
        MicroPoint.prototype.copyTo = function (target) {
            target.x = this._x;
            target.y = this._y;
            return target;
        };
        MicroPoint.prototype.setTo = function (x, y, callParent) {
            if (typeof callParent === "undefined") { callParent = true; }
            this._x = x;
            this._y = y;
            if(this.parent != null && callParent == true) {
                this.parent.updateBounds();
            }
            return this;
        };
        MicroPoint.prototype.equals = function (toCompare) {
            if(this._x === toCompare.x && this._y === toCompare.y) {
                return true;
            } else {
                return false;
            }
        };
        MicroPoint.prototype.toString = function () {
            return '[{MicroPoint (x=' + this._x + ' y=' + this._y + ')}]';
        };
        return MicroPoint;
    })();
    Phaser.MicroPoint = MicroPoint;    
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    var Rectangle = (function () {
        function Rectangle(x, y, width, height) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            if (typeof width === "undefined") { width = 0; }
            if (typeof height === "undefined") { height = 0; }
            this._tempX = null;
            this._tempY = null;
            this._tempWidth = null;
            this._tempHeight = null;
            this._width = 0;
            this._height = 0;
            this._halfWidth = 0;
            this._halfHeight = 0;
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
            get: function () {
                return this.topLeft.x;
            },
            set: function (value) {
                this.topLeft.x = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rectangle.prototype, "y", {
            get: function () {
                return this.topLeft.y;
            },
            set: function (value) {
                this.topLeft.y = value;
            },
            enumerable: true,
            configurable: true
        });
        Rectangle.prototype.updateBounds = function () {
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
            get: function () {
                return this._width;
            },
            set: function (value) {
                this._width = value;
                this._halfWidth = Math.round(value / 2);
                this.updateBounds();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rectangle.prototype, "height", {
            get: function () {
                return this._height;
            },
            set: function (value) {
                this._height = value;
                this._halfHeight = Math.round(value / 2);
                this.updateBounds();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rectangle.prototype, "halfWidth", {
            get: function () {
                return this._halfWidth;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rectangle.prototype, "halfHeight", {
            get: function () {
                return this._halfHeight;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rectangle.prototype, "bottom", {
            get: function () {
                return this.bottomCenter.y;
            },
            set: function (value) {
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
            get: function () {
                return this.x;
            },
            set: function (value) {
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
            get: function () {
                return this.rightCenter.x;
            },
            set: function (value) {
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
        Rectangle.prototype.size = function (output) {
            if (typeof output === "undefined") { output = new Phaser.Point(); }
            return output.setTo(this._width, this._height);
        };
        Object.defineProperty(Rectangle.prototype, "volume", {
            get: function () {
                return this._width * this._height;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rectangle.prototype, "perimeter", {
            get: function () {
                return (this._width * 2) + (this._height * 2);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rectangle.prototype, "top", {
            get: function () {
                return this.topCenter.y;
            },
            set: function (value) {
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
        Rectangle.prototype.clone = function (output) {
            if (typeof output === "undefined") { output = new Rectangle(); }
            return output.setTo(this.x, this.y, this.width, this.height);
        };
        Rectangle.prototype.contains = function (x, y) {
            if(x >= this.topLeft.x && x <= this.topRight.x && y >= this.topLeft.y && y <= this.bottomRight.y) {
                return true;
            }
            return false;
        };
        Rectangle.prototype.containsPoint = function (point) {
            return this.contains(point.x, point.y);
        };
        Rectangle.prototype.containsRect = function (rect) {
            if(rect.volume > this.volume) {
                return false;
            }
            if(rect.x >= this.topLeft.x && rect.y >= this.topLeft.y && rect.rightCenter.x <= this.rightCenter.x && rect.bottomCenter.y <= this.bottomCenter.y) {
                return true;
            }
            return false;
        };
        Rectangle.prototype.copyFrom = function (source) {
            return this.setTo(source.x, source.y, source.width, source.height);
        };
        Rectangle.prototype.copyTo = function (target) {
            return target.copyFrom(this);
        };
        Rectangle.prototype.equals = function (toCompare) {
            if(this.topLeft.equals(toCompare.topLeft) && this.bottomRight.equals(toCompare.bottomRight)) {
                return true;
            }
            return false;
        };
        Rectangle.prototype.inflate = function (dx, dy) {
            this._tempX = this.topLeft.x - dx;
            this._tempWidth = this._width + (2 * dx);
            this._tempY = this.topLeft.y - dy;
            this._tempHeight = this._height + (2 * dy);
            this.updateBounds();
            return this;
        };
        Rectangle.prototype.inflatePoint = function (point) {
            return this.inflate(point.x, point.y);
        };
        Rectangle.prototype.intersection = function (toIntersect, output) {
            if (typeof output === "undefined") { output = new Rectangle(); }
            if(this.intersects(toIntersect) === true) {
                output.x = Math.max(toIntersect.topLeft.x, this.topLeft.x);
                output.y = Math.max(toIntersect.topLeft.y, this.topLeft.y);
                output.width = Math.min(toIntersect.rightCenter.x, this.rightCenter.x) - output.x;
                output.height = Math.min(toIntersect.bottomCenter.y, this.bottomCenter.y) - output.y;
            }
            return output;
        };
        Rectangle.prototype.intersects = function (r2, t) {
            if (typeof t === "undefined") { t = 0; }
            return !(r2.left > this.right + t || r2.right < this.left - t || r2.top > this.bottom + t || r2.bottom < this.top - t);
        };
        Object.defineProperty(Rectangle.prototype, "isEmpty", {
            get: function () {
                if(this.width < 1 || this.height < 1) {
                    return true;
                }
                return false;
            },
            enumerable: true,
            configurable: true
        });
        Rectangle.prototype.offset = function (dx, dy) {
            if(!isNaN(dx) && !isNaN(dy)) {
                this.x += dx;
                this.y += dy;
            }
            return this;
        };
        Rectangle.prototype.offsetPoint = function (point) {
            return this.offset(point.x, point.y);
        };
        Rectangle.prototype.setEmpty = function () {
            return this.setTo(0, 0, 0, 0);
        };
        Rectangle.prototype.setTo = function (x, y, width, height) {
            this._tempX = x;
            this._tempY = y;
            this._tempWidth = width;
            this._tempHeight = height;
            this.updateBounds();
            return this;
        };
        Rectangle.prototype.union = function (toUnion, output) {
            if (typeof output === "undefined") { output = new Rectangle(); }
            return output.setTo(Math.min(toUnion.x, this.x), Math.min(toUnion.y, this.y), Math.max(toUnion.right, this.right), Math.max(toUnion.bottom, this.bottom));
        };
        Rectangle.prototype.toString = function () {
            return "[{Rectangle (x=" + this.x + " y=" + this.y + " width=" + this.width + " height=" + this.height + " empty=" + this.isEmpty + ")}]";
        };
        return Rectangle;
    })();
    Phaser.Rectangle = Rectangle;    
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    var Quad = (function () {
        function Quad(x, y, width, height) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            if (typeof width === "undefined") { width = 0; }
            if (typeof height === "undefined") { height = 0; }
            this.setTo(x, y, width, height);
        }
        Quad.prototype.setTo = function (x, y, width, height) {
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
        Quad.prototype.intersects = function (q, t) {
            if (typeof t === "undefined") { t = 0; }
            return !(q.left > this.right + t || q.right < this.left - t || q.top > this.bottom + t || q.bottom < this.top - t);
        };
        Quad.prototype.toString = function () {
            return "[{Quad (x=" + this.x + " y=" + this.y + " width=" + this.width + " height=" + this.height + ")}]";
        };
        return Quad;
    })();
    Phaser.Quad = Quad;    
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    var Circle = (function () {
        function Circle(x, y, diameter) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            if (typeof diameter === "undefined") { diameter = 0; }
            this._diameter = 0;
            this._radius = 0;
            this.x = 0;
            this.y = 0;
            this.setTo(x, y, diameter);
        }
        Object.defineProperty(Circle.prototype, "diameter", {
            get: function () {
                return this._diameter;
            },
            set: function (value) {
                if(value > 0) {
                    this._diameter = value;
                    this._radius = value * 0.5;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Circle.prototype, "radius", {
            get: function () {
                return this._radius;
            },
            set: function (value) {
                if(value > 0) {
                    this._radius = value;
                    this._diameter = value * 2;
                }
            },
            enumerable: true,
            configurable: true
        });
        Circle.prototype.circumference = function () {
            return 2 * (Math.PI * this._radius);
        };
        Object.defineProperty(Circle.prototype, "bottom", {
            get: function () {
                return this.y + this._radius;
            },
            set: function (value) {
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
            get: function () {
                return this.x - this._radius;
            },
            set: function (value) {
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
            get: function () {
                return this.x + this._radius;
            },
            set: function (value) {
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
            get: function () {
                return this.y - this._radius;
            },
            set: function (value) {
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
            get: function () {
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
            get: function () {
                if(this._diameter < 1) {
                    return true;
                }
                return false;
            },
            enumerable: true,
            configurable: true
        });
        Circle.prototype.intersectCircleLine = function (line) {
            return Phaser.Collision.lineToCircle(line, this).result;
        };
        Circle.prototype.clone = function (output) {
            if (typeof output === "undefined") { output = new Circle(); }
            return output.setTo(this.x, this.y, this._diameter);
        };
        Circle.prototype.contains = function (x, y) {
            return Phaser.Collision.circleContainsPoint(this, {
                x: x,
                y: y
            }).result;
        };
        Circle.prototype.containsPoint = function (point) {
            return Phaser.Collision.circleContainsPoint(this, point).result;
        };
        Circle.prototype.containsCircle = function (circle) {
            return Phaser.Collision.circleToCircle(this, circle).result;
        };
        Circle.prototype.copyFrom = function (source) {
            return this.setTo(source.x, source.y, source.diameter);
        };
        Circle.prototype.copyTo = function (target) {
            return target.copyFrom(this);
        };
        Circle.prototype.distanceTo = function (target, round) {
            if (typeof round === "undefined") { round = false; }
            var dx = this.x - target.x;
            var dy = this.y - target.y;
            if(round === true) {
                return Math.round(Math.sqrt(dx * dx + dy * dy));
            } else {
                return Math.sqrt(dx * dx + dy * dy);
            }
        };
        Circle.prototype.equals = function (toCompare) {
            if(this.x === toCompare.x && this.y === toCompare.y && this.diameter === toCompare.diameter) {
                return true;
            }
            return false;
        };
        Circle.prototype.intersects = function (toIntersect) {
            if(this.distanceTo(toIntersect, false) < (this._radius + toIntersect._radius)) {
                return true;
            }
            return false;
        };
        Circle.prototype.circumferencePoint = function (angle, asDegrees, output) {
            if (typeof asDegrees === "undefined") { asDegrees = false; }
            if (typeof output === "undefined") { output = new Phaser.Point(); }
            if(asDegrees === true) {
                angle = angle * Phaser.GameMath.DEG_TO_RAD;
            }
            output.x = this.x + this._radius * Math.cos(angle);
            output.y = this.y + this._radius * Math.sin(angle);
            return output;
        };
        Circle.prototype.offset = function (dx, dy) {
            if(!isNaN(dx) && !isNaN(dy)) {
                this.x += dx;
                this.y += dy;
            }
            return this;
        };
        Circle.prototype.offsetPoint = function (point) {
            return this.offset(point.x, point.y);
        };
        Circle.prototype.setTo = function (x, y, diameter) {
            this.x = x;
            this.y = y;
            this._diameter = diameter;
            this._radius = diameter * 0.5;
            return this;
        };
        Circle.prototype.toString = function () {
            return "[{Circle (x=" + this.x + " y=" + this.y + " diameter=" + this.diameter + " radius=" + this.radius + ")}]";
        };
        return Circle;
    })();
    Phaser.Circle = Circle;    
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    var Line = (function () {
        function Line(x1, y1, x2, y2) {
            if (typeof x1 === "undefined") { x1 = 0; }
            if (typeof y1 === "undefined") { y1 = 0; }
            if (typeof x2 === "undefined") { x2 = 0; }
            if (typeof y2 === "undefined") { y2 = 0; }
            this.x1 = 0;
            this.y1 = 0;
            this.x2 = 0;
            this.y2 = 0;
            this.setTo(x1, y1, x2, y2);
        }
        Line.prototype.clone = function (output) {
            if (typeof output === "undefined") { output = new Line(); }
            return output.setTo(this.x1, this.y1, this.x2, this.y2);
        };
        Line.prototype.copyFrom = function (source) {
            return this.setTo(source.x1, source.y1, source.x2, source.y2);
        };
        Line.prototype.copyTo = function (target) {
            return target.copyFrom(this);
        };
        Line.prototype.setTo = function (x1, y1, x2, y2) {
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
            get: function () {
                return Math.sqrt((this.x2 - this.x1) * (this.x2 - this.x1) + (this.y2 - this.y1) * (this.y2 - this.y1));
            },
            enumerable: true,
            configurable: true
        });
        Line.prototype.getY = function (x) {
            return this.slope * x + this.yIntercept;
        };
        Object.defineProperty(Line.prototype, "angle", {
            get: function () {
                return Math.atan2(this.x2 - this.x1, this.y2 - this.y1);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Line.prototype, "slope", {
            get: function () {
                return (this.y2 - this.y1) / (this.x2 - this.x1);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Line.prototype, "perpSlope", {
            get: function () {
                return -((this.x2 - this.x1) / (this.y2 - this.y1));
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Line.prototype, "yIntercept", {
            get: function () {
                return (this.y1 - this.slope * this.x1);
            },
            enumerable: true,
            configurable: true
        });
        Line.prototype.isPointOnLine = function (x, y) {
            if((x - this.x1) * (this.y2 - this.y1) === (this.x2 - this.x1) * (y - this.y1)) {
                return true;
            } else {
                return false;
            }
        };
        Line.prototype.isPointOnLineSegment = function (x, y) {
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
        Line.prototype.intersectLineLine = function (line) {
        };
        Line.prototype.perp = function (x, y, output) {
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
        Line.prototype.toString = function () {
            return "[{Line (x1=" + this.x1 + " y1=" + this.y1 + " x2=" + this.x2 + " y2=" + this.y2 + ")}]";
        };
        return Line;
    })();
    Phaser.Line = Line;    
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    var IntersectResult = (function () {
        function IntersectResult() {
            this.result = false;
        }
        IntersectResult.prototype.setTo = function (x1, y1, x2, y2, width, height) {
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
var Phaser;
(function (Phaser) {
    var LinkedList = (function () {
        function LinkedList() {
            this.object = null;
            this.next = null;
        }
        LinkedList.prototype.destroy = function () {
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
var Phaser;
(function (Phaser) {
    var QuadTree = (function (_super) {
        __extends(QuadTree, _super);
        function QuadTree(X, Y, Width, Height, Parent) {
            if (typeof Parent === "undefined") { Parent = null; }
                _super.call(this, X, Y, Width, Height);
            this._headA = this._tailA = new Phaser.LinkedList();
            this._headB = this._tailB = new Phaser.LinkedList();
            if(Parent != null) {
                var iterator;
                var ot;
                if(Parent._headA.object != null) {
                    iterator = Parent._headA;
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
        QuadTree.prototype.destroy = function () {
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
        QuadTree.prototype.load = function (ObjectOrGroup1, ObjectOrGroup2, NotifyCallback, ProcessCallback) {
            if (typeof ObjectOrGroup2 === "undefined") { ObjectOrGroup2 = null; }
            if (typeof NotifyCallback === "undefined") { NotifyCallback = null; }
            if (typeof ProcessCallback === "undefined") { ProcessCallback = null; }
            this.add(ObjectOrGroup1, QuadTree.A_LIST);
            if(ObjectOrGroup2 != null) {
                this.add(ObjectOrGroup2, QuadTree.B_LIST);
                QuadTree._useBothLists = true;
            } else {
                QuadTree._useBothLists = false;
            }
            QuadTree._notifyCallback = NotifyCallback;
            QuadTree._processingCallback = ProcessCallback;
        };
        QuadTree.prototype.add = function (ObjectOrGroup, List) {
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
                if(QuadTree._object.exists && QuadTree._object.allowCollisions) {
                    QuadTree._objectLeftEdge = QuadTree._object.x;
                    QuadTree._objectTopEdge = QuadTree._object.y;
                    QuadTree._objectRightEdge = QuadTree._object.x + QuadTree._object.width;
                    QuadTree._objectBottomEdge = QuadTree._object.y + QuadTree._object.height;
                    this.addObject();
                }
            }
        };
        QuadTree.prototype.addObject = function () {
            if(!this._canSubdivide || ((this._leftEdge >= QuadTree._objectLeftEdge) && (this._rightEdge <= QuadTree._objectRightEdge) && (this._topEdge >= QuadTree._objectTopEdge) && (this._bottomEdge <= QuadTree._objectBottomEdge))) {
                this.addToList();
                return;
            }
            if((QuadTree._objectLeftEdge > this._leftEdge) && (QuadTree._objectRightEdge < this._midpointX)) {
                if((QuadTree._objectTopEdge > this._topEdge) && (QuadTree._objectBottomEdge < this._midpointY)) {
                    if(this._northWestTree == null) {
                        this._northWestTree = new QuadTree(this._leftEdge, this._topEdge, this._halfWidth, this._halfHeight, this);
                    }
                    this._northWestTree.addObject();
                    return;
                }
                if((QuadTree._objectTopEdge > this._midpointY) && (QuadTree._objectBottomEdge < this._bottomEdge)) {
                    if(this._southWestTree == null) {
                        this._southWestTree = new QuadTree(this._leftEdge, this._midpointY, this._halfWidth, this._halfHeight, this);
                    }
                    this._southWestTree.addObject();
                    return;
                }
            }
            if((QuadTree._objectLeftEdge > this._midpointX) && (QuadTree._objectRightEdge < this._rightEdge)) {
                if((QuadTree._objectTopEdge > this._topEdge) && (QuadTree._objectBottomEdge < this._midpointY)) {
                    if(this._northEastTree == null) {
                        this._northEastTree = new QuadTree(this._midpointX, this._topEdge, this._halfWidth, this._halfHeight, this);
                    }
                    this._northEastTree.addObject();
                    return;
                }
                if((QuadTree._objectTopEdge > this._midpointY) && (QuadTree._objectBottomEdge < this._bottomEdge)) {
                    if(this._southEastTree == null) {
                        this._southEastTree = new QuadTree(this._midpointX, this._midpointY, this._halfWidth, this._halfHeight, this);
                    }
                    this._southEastTree.addObject();
                    return;
                }
            }
            if((QuadTree._objectRightEdge > this._leftEdge) && (QuadTree._objectLeftEdge < this._midpointX) && (QuadTree._objectBottomEdge > this._topEdge) && (QuadTree._objectTopEdge < this._midpointY)) {
                if(this._northWestTree == null) {
                    this._northWestTree = new QuadTree(this._leftEdge, this._topEdge, this._halfWidth, this._halfHeight, this);
                }
                this._northWestTree.addObject();
            }
            if((QuadTree._objectRightEdge > this._midpointX) && (QuadTree._objectLeftEdge < this._rightEdge) && (QuadTree._objectBottomEdge > this._topEdge) && (QuadTree._objectTopEdge < this._midpointY)) {
                if(this._northEastTree == null) {
                    this._northEastTree = new QuadTree(this._midpointX, this._topEdge, this._halfWidth, this._halfHeight, this);
                }
                this._northEastTree.addObject();
            }
            if((QuadTree._objectRightEdge > this._midpointX) && (QuadTree._objectLeftEdge < this._rightEdge) && (QuadTree._objectBottomEdge > this._midpointY) && (QuadTree._objectTopEdge < this._bottomEdge)) {
                if(this._southEastTree == null) {
                    this._southEastTree = new QuadTree(this._midpointX, this._midpointY, this._halfWidth, this._halfHeight, this);
                }
                this._southEastTree.addObject();
            }
            if((QuadTree._objectRightEdge > this._leftEdge) && (QuadTree._objectLeftEdge < this._midpointX) && (QuadTree._objectBottomEdge > this._midpointY) && (QuadTree._objectTopEdge < this._bottomEdge)) {
                if(this._southWestTree == null) {
                    this._southWestTree = new QuadTree(this._leftEdge, this._midpointY, this._halfWidth, this._halfHeight, this);
                }
                this._southWestTree.addObject();
            }
        };
        QuadTree.prototype.addToList = function () {
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
        QuadTree.prototype.execute = function () {
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
        QuadTree.prototype.overlapNode = function () {
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
                QuadTree._objectHullX = (QuadTree._object.x < QuadTree._object.last.x) ? QuadTree._object.x : QuadTree._object.last.x;
                QuadTree._objectHullY = (QuadTree._object.y < QuadTree._object.last.y) ? QuadTree._object.y : QuadTree._object.last.y;
                QuadTree._objectHullWidth = QuadTree._object.x - QuadTree._object.last.x;
                QuadTree._objectHullWidth = QuadTree._object.width + ((QuadTree._objectHullWidth > 0) ? QuadTree._objectHullWidth : -QuadTree._objectHullWidth);
                QuadTree._objectHullHeight = QuadTree._object.y - QuadTree._object.last.y;
                QuadTree._objectHullHeight = QuadTree._object.height + ((QuadTree._objectHullHeight > 0) ? QuadTree._objectHullHeight : -QuadTree._objectHullHeight);
                QuadTree._checkObjectHullX = (checkObject.x < checkObject.last.x) ? checkObject.x : checkObject.last.x;
                QuadTree._checkObjectHullY = (checkObject.y < checkObject.last.y) ? checkObject.y : checkObject.last.y;
                QuadTree._checkObjectHullWidth = checkObject.x - checkObject.last.x;
                QuadTree._checkObjectHullWidth = checkObject.width + ((QuadTree._checkObjectHullWidth > 0) ? QuadTree._checkObjectHullWidth : -QuadTree._checkObjectHullWidth);
                QuadTree._checkObjectHullHeight = checkObject.y - checkObject.last.y;
                QuadTree._checkObjectHullHeight = checkObject.height + ((QuadTree._checkObjectHullHeight > 0) ? QuadTree._checkObjectHullHeight : -QuadTree._checkObjectHullHeight);
                if((QuadTree._objectHullX + QuadTree._objectHullWidth > QuadTree._checkObjectHullX) && (QuadTree._objectHullX < QuadTree._checkObjectHullX + QuadTree._checkObjectHullWidth) && (QuadTree._objectHullY + QuadTree._objectHullHeight > QuadTree._checkObjectHullY) && (QuadTree._objectHullY < QuadTree._checkObjectHullY + QuadTree._checkObjectHullHeight)) {
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
        Collision.lineToLine = function lineToLine(line1, line2, output) {
            if (typeof output === "undefined") { output = new Phaser.IntersectResult(); }
            var denominator = (line1.x1 - line1.x2) * (line2.y1 - line2.y2) - (line1.y1 - line1.y2) * (line2.x1 - line2.x2);
            if(denominator !== 0) {
                output.result = true;
                output.x = ((line1.x1 * line1.y2 - line1.y1 * line1.x2) * (line2.x1 - line2.x2) - (line1.x1 - line1.x2) * (line2.x1 * line2.y2 - line2.y1 * line2.x2)) / denominator;
                output.y = ((line1.x1 * line1.y2 - line1.y1 * line1.x2) * (line2.y1 - line2.y2) - (line1.y1 - line1.y2) * (line2.x1 * line2.y2 - line2.y1 * line2.x2)) / denominator;
            }
            return output;
        };
        Collision.lineToLineSegment = function lineToLineSegment(line, seg, output) {
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
        Collision.lineToRawSegment = function lineToRawSegment(line, x1, y1, x2, y2, output) {
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
        Collision.lineToRay = function lineToRay(line1, ray, output) {
            if (typeof output === "undefined") { output = new Phaser.IntersectResult(); }
            var denominator = (line1.x1 - line1.x2) * (ray.y1 - ray.y2) - (line1.y1 - line1.y2) * (ray.x1 - ray.x2);
            if(denominator !== 0) {
                output.x = ((line1.x1 * line1.y2 - line1.y1 * line1.x2) * (ray.x1 - ray.x2) - (line1.x1 - line1.x2) * (ray.x1 * ray.y2 - ray.y1 * ray.x2)) / denominator;
                output.y = ((line1.x1 * line1.y2 - line1.y1 * line1.x2) * (ray.y1 - ray.y2) - (line1.y1 - line1.y2) * (ray.x1 * ray.y2 - ray.y1 * ray.x2)) / denominator;
                output.result = true;
                if(!(ray.x1 >= ray.x2) && output.x < ray.x1) {
                    output.result = false;
                }
                if(!(ray.y1 >= ray.y2) && output.y < ray.y1) {
                    output.result = false;
                }
            }
            return output;
        };
        Collision.lineToCircle = function lineToCircle(line, circle, output) {
            if (typeof output === "undefined") { output = new Phaser.IntersectResult(); }
            if(line.perp(circle.x, circle.y).length <= circle.radius) {
                output.result = true;
            }
            return output;
        };
        Collision.lineToRectangle = function lineToRectangle(line, rect, output) {
            if (typeof output === "undefined") { output = new Phaser.IntersectResult(); }
            Collision.lineToRawSegment(line, rect.x, rect.y, rect.right, rect.y, output);
            if(output.result === true) {
                return output;
            }
            Collision.lineToRawSegment(line, rect.x, rect.y, rect.x, rect.bottom, output);
            if(output.result === true) {
                return output;
            }
            Collision.lineToRawSegment(line, rect.x, rect.bottom, rect.right, rect.bottom, output);
            if(output.result === true) {
                return output;
            }
            Collision.lineToRawSegment(line, rect.right, rect.y, rect.right, rect.bottom, output);
            return output;
        };
        Collision.lineSegmentToLineSegment = function lineSegmentToLineSegment(line1, line2, output) {
            if (typeof output === "undefined") { output = new Phaser.IntersectResult(); }
            Collision.lineToLineSegment(line1, line2);
            if(output.result === true) {
                if(!(output.x >= Math.min(line1.x1, line1.x2) && output.x <= Math.max(line1.x1, line1.x2) && output.y >= Math.min(line1.y1, line1.y2) && output.y <= Math.max(line1.y1, line1.y2))) {
                    output.result = false;
                }
            }
            return output;
        };
        Collision.lineSegmentToRay = function lineSegmentToRay(line, ray, output) {
            if (typeof output === "undefined") { output = new Phaser.IntersectResult(); }
            Collision.lineToRay(line, ray, output);
            if(output.result === true) {
                if(!(output.x >= Math.min(line.x1, line.x2) && output.x <= Math.max(line.x1, line.x2) && output.y >= Math.min(line.y1, line.y2) && output.y <= Math.max(line.y1, line.y2))) {
                    output.result = false;
                }
            }
            return output;
        };
        Collision.lineSegmentToCircle = function lineSegmentToCircle(seg, circle, output) {
            if (typeof output === "undefined") { output = new Phaser.IntersectResult(); }
            var perp = seg.perp(circle.x, circle.y);
            if(perp.length <= circle.radius) {
                var maxX = Math.max(seg.x1, seg.x2);
                var minX = Math.min(seg.x1, seg.x2);
                var maxY = Math.max(seg.y1, seg.y2);
                var minY = Math.min(seg.y1, seg.y2);
                if((perp.x2 <= maxX && perp.x2 >= minX) && (perp.y2 <= maxY && perp.y2 >= minY)) {
                    output.result = true;
                } else {
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
        Collision.lineSegmentToRectangle = function lineSegmentToRectangle(seg, rect, output) {
            if (typeof output === "undefined") { output = new Phaser.IntersectResult(); }
            if(rect.contains(seg.x1, seg.y1) && rect.contains(seg.x2, seg.y2)) {
                output.result = true;
            } else {
                Collision.lineToRawSegment(seg, rect.x, rect.y, rect.right, rect.bottom, output);
                if(output.result === true) {
                    return output;
                }
                Collision.lineToRawSegment(seg, rect.x, rect.y, rect.x, rect.bottom, output);
                if(output.result === true) {
                    return output;
                }
                Collision.lineToRawSegment(seg, rect.x, rect.bottom, rect.right, rect.bottom, output);
                if(output.result === true) {
                    return output;
                }
                Collision.lineToRawSegment(seg, rect.right, rect.y, rect.right, rect.bottom, output);
                return output;
            }
            return output;
        };
        Collision.rayToRectangle = function rayToRectangle(ray, rect, output) {
            if (typeof output === "undefined") { output = new Phaser.IntersectResult(); }
            Collision.lineToRectangle(ray, rect, output);
            return output;
        };
        Collision.rayToLineSegment = function rayToLineSegment(rayX1, rayY1, rayX2, rayY2, lineX1, lineY1, lineX2, lineY2, output) {
            if (typeof output === "undefined") { output = new Phaser.IntersectResult(); }
            var r;
            var s;
            var d;
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
        Collision.pointToRectangle = function pointToRectangle(point, rect, output) {
            if (typeof output === "undefined") { output = new Phaser.IntersectResult(); }
            output.setTo(point.x, point.y);
            output.result = rect.containsPoint(point);
            return output;
        };
        Collision.rectangleToRectangle = function rectangleToRectangle(rect1, rect2, output) {
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
            return Collision.circleToRectangle(circle, rect, output);
        };
        Collision.circleToCircle = function circleToCircle(circle1, circle2, output) {
            if (typeof output === "undefined") { output = new Phaser.IntersectResult(); }
            output.result = ((circle1.radius + circle2.radius) * (circle1.radius + circle2.radius)) >= Collision.distanceSquared(circle1.x, circle1.y, circle2.x, circle2.y);
            return output;
        };
        Collision.circleToRectangle = function circleToRectangle(circle, rect, output) {
            if (typeof output === "undefined") { output = new Phaser.IntersectResult(); }
            var inflatedRect = rect.clone();
            inflatedRect.inflate(circle.radius, circle.radius);
            output.result = inflatedRect.contains(circle.x, circle.y);
            return output;
        };
        Collision.circleContainsPoint = function circleContainsPoint(circle, point, output) {
            if (typeof output === "undefined") { output = new Phaser.IntersectResult(); }
            output.result = circle.radius * circle.radius >= Collision.distanceSquared(circle.x, circle.y, point.x, point.y);
            return output;
        };
        Collision.prototype.overlap = function (object1, object2, notifyCallback, processCallback) {
            if (typeof object1 === "undefined") { object1 = null; }
            if (typeof object2 === "undefined") { object2 = null; }
            if (typeof notifyCallback === "undefined") { notifyCallback = null; }
            if (typeof processCallback === "undefined") { processCallback = null; }
            if(object1 == null) {
                object1 = this._game.world.group;
            }
            if(object2 == object1) {
                object2 = null;
            }
            Phaser.QuadTree.divisions = this._game.world.worldDivisions;
            var quadTree = new Phaser.QuadTree(this._game.world.bounds.x, this._game.world.bounds.y, this._game.world.bounds.width, this._game.world.bounds.height);
            quadTree.load(object1, object2, notifyCallback, processCallback);
            var result = quadTree.execute();
            quadTree.destroy();
            quadTree = null;
            return result;
        };
        Collision.separate = function separate(object1, object2) {
            var separatedX = Collision.separateX(object1, object2);
            var separatedY = Collision.separateY(object1, object2);
            return separatedX || separatedY;
        };
        Collision.separateTile = function separateTile(object, tile) {
            var separatedX = Collision.separateTileX(object, tile);
            var separatedY = Collision.separateTileY(object, tile);
            return separatedX || separatedY;
        };
        Collision.separateTileX = function separateTileX(object, tile) {
            if(object.immovable && tile.immovable) {
                return false;
            }
            var overlap = 0;
            var objDelta = object.x - object.last.x;
            var tileDelta = 0;
            if(objDelta != tileDelta) {
                var objDeltaAbs = (objDelta > 0) ? objDelta : -objDelta;
                var tileDeltaAbs = (tileDelta > 0) ? tileDelta : -tileDelta;
                var objBounds = new Phaser.Quad(object.x - ((objDelta > 0) ? objDelta : 0), object.last.y, object.width + ((objDelta > 0) ? objDelta : -objDelta), object.height);
                var tileBounds = new Phaser.Quad(tile.x - ((tileDelta > 0) ? tileDelta : 0), tile.y, tile.width + ((tileDelta > 0) ? tileDelta : -tileDelta), tile.height);
                if((objBounds.x + objBounds.width > tileBounds.x) && (objBounds.x < tileBounds.x + tileBounds.width) && (objBounds.y + objBounds.height > tileBounds.y) && (objBounds.y < tileBounds.y + tileBounds.height)) {
                    var maxOverlap = objDeltaAbs + tileDeltaAbs + Collision.OVERLAP_BIAS;
                    if(objDelta > tileDelta) {
                        overlap = object.x + object.width - tile.x;
                        if((overlap > maxOverlap) || !(object.allowCollisions & Collision.RIGHT) || !(tile.allowCollisions & Collision.LEFT)) {
                            overlap = 0;
                        } else {
                            object.touching |= Collision.RIGHT;
                        }
                    } else if(objDelta < tileDelta) {
                        overlap = object.x - tile.width - tile.x;
                        if((-overlap > maxOverlap) || !(object.allowCollisions & Collision.LEFT) || !(tile.allowCollisions & Collision.RIGHT)) {
                            overlap = 0;
                        } else {
                            object.touching |= Collision.LEFT;
                        }
                    }
                }
            }
            if(overlap != 0) {
                var objVelocity = object.velocity.x;
                var tileVelocity = 0;
                if(!object.immovable && !tile.immovable) {
                    overlap *= 0.5;
                    object.x = object.x - overlap;
                    var objNewVelocity = Math.sqrt((tileVelocity * tileVelocity * tile.mass) / object.mass) * ((tileVelocity > 0) ? 1 : -1);
                    var tileNewVelocity = Math.sqrt((objVelocity * objVelocity * object.mass) / tile.mass) * ((objVelocity > 0) ? 1 : -1);
                    var average = (objNewVelocity + tileNewVelocity) * 0.5;
                    objNewVelocity -= average;
                    object.velocity.x = average + objNewVelocity * object.elasticity;
                } else if(!object.immovable) {
                    object.x = object.x - overlap;
                    object.velocity.x = tileVelocity - objVelocity * object.elasticity;
                }
                return true;
            } else {
                return false;
            }
        };
        Collision.separateTileY = function separateTileY(object, tile) {
            if(object.immovable && tile.immovable) {
                return false;
            }
            var overlap = 0;
            var objDelta = object.y - object.last.y;
            var tileDelta = 0;
            if(objDelta != tileDelta) {
                var objDeltaAbs = (objDelta > 0) ? objDelta : -objDelta;
                var tileDeltaAbs = (tileDelta > 0) ? tileDelta : -tileDelta;
                var objBounds = new Phaser.Quad(object.x, object.y - ((objDelta > 0) ? objDelta : 0), object.width, object.height + objDeltaAbs);
                var tileBounds = new Phaser.Quad(tile.x, tile.y - ((tileDelta > 0) ? tileDelta : 0), tile.width, tile.height + tileDeltaAbs);
                if((objBounds.x + objBounds.width > tileBounds.x) && (objBounds.x < tileBounds.x + tileBounds.width) && (objBounds.y + objBounds.height > tileBounds.y) && (objBounds.y < tileBounds.y + tileBounds.height)) {
                    var maxOverlap = objDeltaAbs + tileDeltaAbs + Collision.OVERLAP_BIAS;
                    if(objDelta > tileDelta) {
                        overlap = object.y + object.height - tile.y;
                        if((overlap > maxOverlap) || !(object.allowCollisions & Collision.DOWN) || !(tile.allowCollisions & Collision.UP)) {
                            overlap = 0;
                        } else {
                            object.touching |= Collision.DOWN;
                        }
                    } else if(objDelta < tileDelta) {
                        overlap = object.y - tile.height - tile.y;
                        if((-overlap > maxOverlap) || !(object.allowCollisions & Collision.UP) || !(tile.allowCollisions & Collision.DOWN)) {
                            overlap = 0;
                        } else {
                            object.touching |= Collision.UP;
                        }
                    }
                }
            }
            if(overlap != 0) {
                var objVelocity = object.velocity.y;
                var tileVelocity = 0;
                if(!object.immovable && !tile.immovable) {
                    overlap *= 0.5;
                    object.y = object.y - overlap;
                    var objNewVelocity = Math.sqrt((tileVelocity * tileVelocity * tile.mass) / object.mass) * ((tileVelocity > 0) ? 1 : -1);
                    var tileNewVelocity = Math.sqrt((objVelocity * objVelocity * object.mass) / tile.mass) * ((objVelocity > 0) ? 1 : -1);
                    var average = (objNewVelocity + tileNewVelocity) * 0.5;
                    objNewVelocity -= average;
                    object.velocity.y = average + objNewVelocity * object.elasticity;
                } else if(!object.immovable) {
                    object.y = object.y - overlap;
                    object.velocity.y = tileVelocity - objVelocity * object.elasticity;
                    if(tile.active && tile.moves && (objDelta > tileDelta)) {
                    }
                }
                return true;
            } else {
                return false;
            }
        };
        Collision.separateX = function separateX(object1, object2) {
            if(object1.immovable && object2.immovable) {
                return false;
            }
            var overlap = 0;
            var obj1Delta = object1.x - object1.last.x;
            var obj2Delta = object2.x - object2.last.x;
            if(obj1Delta != obj2Delta) {
                var obj1DeltaAbs = (obj1Delta > 0) ? obj1Delta : -obj1Delta;
                var obj2DeltaAbs = (obj2Delta > 0) ? obj2Delta : -obj2Delta;
                var obj1Bounds = new Phaser.Quad(object1.x - ((obj1Delta > 0) ? obj1Delta : 0), object1.last.y, object1.width + ((obj1Delta > 0) ? obj1Delta : -obj1Delta), object1.height);
                var obj2Bounds = new Phaser.Quad(object2.x - ((obj2Delta > 0) ? obj2Delta : 0), object2.last.y, object2.width + ((obj2Delta > 0) ? obj2Delta : -obj2Delta), object2.height);
                if((obj1Bounds.x + obj1Bounds.width > obj2Bounds.x) && (obj1Bounds.x < obj2Bounds.x + obj2Bounds.width) && (obj1Bounds.y + obj1Bounds.height > obj2Bounds.y) && (obj1Bounds.y < obj2Bounds.y + obj2Bounds.height)) {
                    var maxOverlap = obj1DeltaAbs + obj2DeltaAbs + Collision.OVERLAP_BIAS;
                    if(obj1Delta > obj2Delta) {
                        overlap = object1.x + object1.width - object2.x;
                        if((overlap > maxOverlap) || !(object1.allowCollisions & Collision.RIGHT) || !(object2.allowCollisions & Collision.LEFT)) {
                            overlap = 0;
                        } else {
                            object1.touching |= Collision.RIGHT;
                            object2.touching |= Collision.LEFT;
                        }
                    } else if(obj1Delta < obj2Delta) {
                        overlap = object1.x - object2.width - object2.x;
                        if((-overlap > maxOverlap) || !(object1.allowCollisions & Collision.LEFT) || !(object2.allowCollisions & Collision.RIGHT)) {
                            overlap = 0;
                        } else {
                            object1.touching |= Collision.LEFT;
                            object2.touching |= Collision.RIGHT;
                        }
                    }
                }
            }
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
        Collision.separateY = function separateY(object1, object2) {
            if(object1.immovable && object2.immovable) {
                return false;
            }
            var overlap = 0;
            var obj1Delta = object1.y - object1.last.y;
            var obj2Delta = object2.y - object2.last.y;
            if(obj1Delta != obj2Delta) {
                var obj1DeltaAbs = (obj1Delta > 0) ? obj1Delta : -obj1Delta;
                var obj2DeltaAbs = (obj2Delta > 0) ? obj2Delta : -obj2Delta;
                var obj1Bounds = new Phaser.Quad(object1.x, object1.y - ((obj1Delta > 0) ? obj1Delta : 0), object1.width, object1.height + obj1DeltaAbs);
                var obj2Bounds = new Phaser.Quad(object2.x, object2.y - ((obj2Delta > 0) ? obj2Delta : 0), object2.width, object2.height + obj2DeltaAbs);
                if((obj1Bounds.x + obj1Bounds.width > obj2Bounds.x) && (obj1Bounds.x < obj2Bounds.x + obj2Bounds.width) && (obj1Bounds.y + obj1Bounds.height > obj2Bounds.y) && (obj1Bounds.y < obj2Bounds.y + obj2Bounds.height)) {
                    var maxOverlap = obj1DeltaAbs + obj2DeltaAbs + Collision.OVERLAP_BIAS;
                    if(obj1Delta > obj2Delta) {
                        overlap = object1.y + object1.height - object2.y;
                        if((overlap > maxOverlap) || !(object1.allowCollisions & Collision.DOWN) || !(object2.allowCollisions & Collision.UP)) {
                            overlap = 0;
                        } else {
                            object1.touching |= Collision.DOWN;
                            object2.touching |= Collision.UP;
                        }
                    } else if(obj1Delta < obj2Delta) {
                        overlap = object1.y - object2.height - object2.y;
                        if((-overlap > maxOverlap) || !(object1.allowCollisions & Collision.UP) || !(object2.allowCollisions & Collision.DOWN)) {
                            overlap = 0;
                        } else {
                            object1.touching |= Collision.UP;
                            object2.touching |= Collision.DOWN;
                        }
                    }
                }
            }
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
                    if(object2.active && object2.moves && (obj1Delta > obj2Delta)) {
                        object1.x += object2.x - object2.last.x;
                    }
                } else if(!object2.immovable) {
                    object2.y += overlap;
                    object2.velocity.y = obj1Velocity - obj2Velocity * object2.elasticity;
                    if(object1.active && object1.moves && (obj1Delta < obj2Delta)) {
                        object2.x += object1.x - object1.last.x;
                    }
                }
                return true;
            } else {
                return false;
            }
        };
        Collision.distance = function distance(x1, y1, x2, y2) {
            return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
        };
        Collision.distanceSquared = function distanceSquared(x1, y1, x2, y2) {
            return (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
        };
        return Collision;
    })();
    Phaser.Collision = Collision;    
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    var DynamicTexture = (function () {
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
        DynamicTexture.prototype.getPixel = function (x, y) {
            var imageData = this.context.getImageData(x, y, 1, 1);
            return this.getColor(imageData.data[0], imageData.data[1], imageData.data[2]);
        };
        DynamicTexture.prototype.getPixel32 = function (x, y) {
            var imageData = this.context.getImageData(x, y, 1, 1);
            return this.getColor32(imageData.data[3], imageData.data[0], imageData.data[1], imageData.data[2]);
        };
        DynamicTexture.prototype.getPixels = function (rect) {
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
            if(frame > -1) {
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
                this.context.drawImage(texture, this._sx, this._sy, this._sw, this._sh, this._dx, this._dy, this._dw, this._dh);
            }
        };
        DynamicTexture.prototype.copyPixels = function (sourceTexture, sourceRect, destPoint) {
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
        DynamicTexture.prototype.getColor32 = function (alpha, red, green, blue) {
            return alpha << 24 | red << 16 | green << 8 | blue;
        };
        DynamicTexture.prototype.getColor = function (red, green, blue) {
            return red << 16 | green << 8 | blue;
        };
        return DynamicTexture;
    })();
    Phaser.DynamicTexture = DynamicTexture;    
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    var GameMath = (function () {
        function GameMath(game) {
            this.cosTable = [];
            this.sinTable = [];
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
        GameMath.prototype.percentageMinMax = function (val, max, min) {
            if (typeof min === "undefined") { min = 0; }
            val -= min;
            max -= min;
            if(!max) {
                return 0;
            } else {
                return val / max;
            }
        };
        GameMath.prototype.sign = function (n) {
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
        GameMath.prototype.wrap = function (val, max, min) {
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
        GameMath.prototype.arithWrap = function (value, max, min) {
            if (typeof min === "undefined") { min = 0; }
            max -= min;
            if(max == 0) {
                return min;
            }
            return value - max * Math.floor((value - min) / max);
        };
        GameMath.prototype.clamp = function (input, max, min) {
            if (typeof min === "undefined") { min = 0; }
            return Math.max(min, Math.min(max, input));
        };
        GameMath.prototype.snapTo = function (input, gap, start) {
            if (typeof start === "undefined") { start = 0; }
            if(gap == 0) {
                return input;
            }
            input -= start;
            input = gap * Math.round(input / gap);
            return start + input;
        };
        GameMath.prototype.snapToFloor = function (input, gap, start) {
            if (typeof start === "undefined") { start = 0; }
            if(gap == 0) {
                return input;
            }
            input -= start;
            input = gap * Math.floor(input / gap);
            return start + input;
        };
        GameMath.prototype.snapToCeil = function (input, gap, start) {
            if (typeof start === "undefined") { start = 0; }
            if(gap == 0) {
                return input;
            }
            input -= start;
            input = gap * Math.ceil(input / gap);
            return start + input;
        };
        GameMath.prototype.snapToInArray = function (input, arr, sort) {
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
        GameMath.prototype.roundTo = function (value, place, base) {
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
        GameMath.prototype.interpolateFloat = function (a, b, weight) {
            return (b - a) * weight + a;
        };
        GameMath.prototype.radiansToDegrees = function (angle) {
            return angle * GameMath.RAD_TO_DEG;
        };
        GameMath.prototype.degreesToRadians = function (angle) {
            return angle * GameMath.DEG_TO_RAD;
        };
        GameMath.prototype.angleBetween = function (x1, y1, x2, y2) {
            return Math.atan2(y2 - y1, x2 - x1);
        };
        GameMath.prototype.normalizeAngle = function (angle, radians) {
            if (typeof radians === "undefined") { radians = true; }
            var rd = (radians) ? GameMath.PI : 180;
            return this.wrap(angle, rd, -rd);
        };
        GameMath.prototype.nearestAngleBetween = function (a1, a2, radians) {
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
        GameMath.prototype.normalizeAngleToAnother = function (dep, ind, radians) {
            if (typeof radians === "undefined") { radians = true; }
            return ind + this.nearestAngleBetween(ind, dep, radians);
        };
        GameMath.prototype.normalizeAngleAfterAnother = function (dep, ind, radians) {
            if (typeof radians === "undefined") { radians = true; }
            dep = this.normalizeAngle(dep - ind, radians);
            return ind + dep;
        };
        GameMath.prototype.normalizeAngleBeforeAnother = function (dep, ind, radians) {
            if (typeof radians === "undefined") { radians = true; }
            dep = this.normalizeAngle(ind - dep, radians);
            return ind - dep;
        };
        GameMath.prototype.interpolateAngles = function (a1, a2, weight, radians, ease) {
            if (typeof radians === "undefined") { radians = true; }
            if (typeof ease === "undefined") { ease = null; }
            a1 = this.normalizeAngle(a1, radians);
            a2 = this.normalizeAngleToAnother(a2, a1, radians);
            return (typeof ease === 'function') ? ease(weight, a1, a2 - a1, 1) : this.interpolateFloat(a1, a2, weight);
        };
        GameMath.prototype.logBaseOf = function (value, base) {
            return Math.log(value) / Math.log(base);
        };
        GameMath.prototype.GCD = function (m, n) {
            var r;
            m = Math.abs(m);
            n = Math.abs(n);
            if(m < n) {
                r = m;
                m = n;
                n = r;
            }
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
        GameMath.prototype.LCM = function (m, n) {
            return (m * n) / this.GCD(m, n);
        };
        GameMath.prototype.factorial = function (value) {
            if(value == 0) {
                return 1;
            }
            var res = value;
            while(--value) {
                res *= value;
            }
            return res;
        };
        GameMath.prototype.gammaFunction = function (value) {
            return this.factorial(value - 1);
        };
        GameMath.prototype.fallingFactorial = function (base, exp) {
            return this.factorial(base) / this.factorial(base - exp);
        };
        GameMath.prototype.risingFactorial = function (base, exp) {
            return this.factorial(base + exp - 1) / this.factorial(base - 1);
        };
        GameMath.prototype.binCoef = function (n, k) {
            return this.fallingFactorial(n, k) / this.factorial(k);
        };
        GameMath.prototype.risingBinCoef = function (n, k) {
            return this.risingFactorial(n, k) / this.factorial(k);
        };
        GameMath.prototype.chanceRoll = function (chance) {
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
        GameMath.prototype.maxAdd = function (value, amount, max) {
            value += amount;
            if(value > max) {
                value = max;
            }
            return value;
        };
        GameMath.prototype.minSub = function (value, amount, min) {
            value -= amount;
            if(value < min) {
                value = min;
            }
            return value;
        };
        GameMath.prototype.wrapValue = function (value, amount, max) {
            var diff;
            value = Math.abs(value);
            amount = Math.abs(amount);
            max = Math.abs(max);
            diff = (value + amount) % max;
            return diff;
        };
        GameMath.prototype.randomSign = function () {
            return (Math.random() > 0.5) ? 1 : -1;
        };
        GameMath.prototype.isOdd = function (n) {
            if(n & 1) {
                return true;
            } else {
                return false;
            }
        };
        GameMath.prototype.isEven = function (n) {
            if(n & 1) {
                return false;
            } else {
                return true;
            }
        };
        GameMath.prototype.wrapAngle = function (angle) {
            var result = angle;
            if(angle >= -180 && angle <= 180) {
                return angle;
            }
            result = (angle + 180) % 360;
            if(result < 0) {
                result += 360;
            }
            return result - 180;
        };
        GameMath.prototype.angleLimit = function (angle, min, max) {
            var result = angle;
            if(angle > max) {
                result = max;
            } else if(angle < min) {
                result = min;
            }
            return result;
        };
        GameMath.prototype.linearInterpolation = function (v, k) {
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
        GameMath.prototype.bezierInterpolation = function (v, k) {
            var b = 0;
            var n = v.length - 1;
            for(var i = 0; i <= n; i++) {
                b += Math.pow(1 - k, n - i) * Math.pow(k, i) * v[i] * this.bernstein(n, i);
            }
            return b;
        };
        GameMath.prototype.catmullRomInterpolation = function (v, k) {
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
        GameMath.prototype.linear = function (p0, p1, t) {
            return (p1 - p0) * t + p0;
        };
        GameMath.prototype.bernstein = function (n, i) {
            return this.factorial(n) / this.factorial(i) / this.factorial(n - i);
        };
        GameMath.prototype.catmullRom = function (p0, p1, p2, p3, t) {
            var v0 = (p2 - p0) * 0.5, v1 = (p3 - p1) * 0.5, t2 = t * t, t3 = t * t2;
            return (2 * p1 - 2 * p2 + v0 + v1) * t3 + (-3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 + v0 * t + p1;
        };
        GameMath.prototype.difference = function (a, b) {
            return Math.abs(a - b);
        };
        GameMath.prototype.random = function () {
            return this.globalSeed = this.srand(this.globalSeed);
        };
        GameMath.prototype.srand = function (Seed) {
            return ((69621 * (Seed * 0x7FFFFFFF)) % 0x7FFFFFFF) / 0x7FFFFFFF;
        };
        GameMath.prototype.getRandom = function (Objects, StartIndex, Length) {
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
        GameMath.prototype.floor = function (Value) {
            var n = Value | 0;
            return (Value > 0) ? (n) : ((n != Value) ? (n - 1) : (n));
        };
        GameMath.prototype.ceil = function (Value) {
            var n = Value | 0;
            return (Value > 0) ? ((n != Value) ? (n + 1) : (n)) : (n);
        };
        GameMath.prototype.sinCosGenerator = function (length, sinAmplitude, cosAmplitude, frequency) {
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
        GameMath.prototype.shiftSinTable = function () {
            if(this.sinTable) {
                var s = this.sinTable.shift();
                this.sinTable.push(s);
                return s;
            }
        };
        GameMath.prototype.shiftCosTable = function () {
            if(this.cosTable) {
                var s = this.cosTable.shift();
                this.cosTable.push(s);
                return s;
            }
        };
        GameMath.prototype.vectorLength = function (dx, dy) {
            return Math.sqrt(dx * dx + dy * dy);
        };
        GameMath.prototype.dotProduct = function (ax, ay, bx, by) {
            return ax * bx + ay * by;
        };
        return GameMath;
    })();
    Phaser.GameMath = GameMath;    
})(Phaser || (Phaser = {}));
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
        Group.prototype.destroy = function () {
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
        Group.prototype.update = function () {
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
        Group.prototype.render = function (camera, cameraOffsetX, cameraOffsetY) {
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
            get: function () {
                return this._maxSize;
            },
            set: function (Size) {
                this._maxSize = Size;
                if(this._marker >= this._maxSize) {
                    this._marker = 0;
                }
                if((this._maxSize == 0) || (this.members == null) || (this._maxSize >= this.members.length)) {
                    return;
                }
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
        Group.prototype.add = function (Object) {
            if(this.members.indexOf(Object) >= 0) {
                return Object;
            }
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
            this.members[i] = Object;
            this.length = i + 1;
            return Object;
        };
        Group.prototype.recycle = function (ObjectClass) {
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
        Group.prototype.remove = function (Object, Splice) {
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
        Group.prototype.replace = function (OldObject, NewObject) {
            var index = this.members.indexOf(OldObject);
            if((index < 0) || (index >= this.members.length)) {
                return null;
            }
            this.members[index] = NewObject;
            return NewObject;
        };
        Group.prototype.sort = function (Index, Order) {
            if (typeof Index === "undefined") { Index = "y"; }
            if (typeof Order === "undefined") { Order = Group.ASCENDING; }
            this._sortIndex = Index;
            this._sortOrder = Order;
            this.members.sort(this.sortHandler);
        };
        Group.prototype.setAll = function (VariableName, Value, Recurse) {
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
        Group.prototype.callAll = function (FunctionName, Recurse) {
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
        Group.prototype.forEach = function (callback, recursive) {
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
        Group.prototype.forEachAlive = function (callback, recursive) {
            if (typeof recursive === "undefined") { recursive = false; }
            var basic;
            var i = 0;
            while(i < this.length) {
                basic = this.members[i++];
                if(basic != null && basic.alive) {
                    if(recursive && (basic.isGroup == true)) {
                        basic.forEachAlive(callback, true);
                    } else {
                        callback.call(this, basic);
                    }
                }
            }
        };
        Group.prototype.getFirstAvailable = function (ObjectClass) {
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
        Group.prototype.getFirstNull = function () {
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
        Group.prototype.getFirstExtant = function () {
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
        Group.prototype.getFirstAlive = function () {
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
        Group.prototype.getFirstDead = function () {
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
        Group.prototype.countLiving = function () {
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
        Group.prototype.countDead = function () {
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
        Group.prototype.getRandom = function (StartIndex, Length) {
            if (typeof StartIndex === "undefined") { StartIndex = 0; }
            if (typeof Length === "undefined") { Length = 0; }
            if(Length == 0) {
                Length = this.length;
            }
            return this._game.math.getRandom(this.members, StartIndex, Length);
        };
        Group.prototype.clear = function () {
            this.length = this.members.length = 0;
        };
        Group.prototype.kill = function () {
            var basic;
            var i = 0;
            while(i < this.length) {
                basic = this.members[i++];
                if((basic != null) && basic.exists) {
                    basic.kill();
                }
            }
        };
        Group.prototype.sortHandler = function (Obj1, Obj2) {
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
            this._queueSize = 0;
        }
        Loader.prototype.reset = function () {
            this._queueSize = 0;
        };
        Object.defineProperty(Loader.prototype, "queueSize", {
            get: function () {
                return this._queueSize;
            },
            enumerable: true,
            configurable: true
        });
        Loader.prototype.addImageFile = function (key, url) {
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
        Loader.prototype.addSpriteSheet = function (key, url, frameWidth, frameHeight, frameMax) {
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
        Loader.prototype.addTextureAtlas = function (key, url, jsonURL, jsonData) {
            if (typeof jsonURL === "undefined") { jsonURL = null; }
            if (typeof jsonData === "undefined") { jsonData = null; }
            if(this.checkKeyExists(key) === false) {
                if(jsonURL !== null) {
                    this._queueSize++;
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
                    if(typeof jsonData === 'string') {
                        var data = JSON.parse(jsonData);
                        if(data['frames']) {
                            this._queueSize++;
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
                        if(jsonData['frames']) {
                            this._queueSize++;
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
        Loader.prototype.addTextFile = function (key, url) {
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
                    if(file.jsonURL == null) {
                        this._game.cache.addTextureAtlas(file.key, file.url, file.data, file.jsonData);
                    } else {
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
            var data = JSON.parse(this._xhr.response);
            if(data['frames']) {
                var file = this._fileList[key];
                this._game.cache.addTextureAtlas(file.key, file.url, file.data, data['frames']);
            }
            this.nextFile(key, true);
        };
        Loader.prototype.jsonLoadError = function (key) {
            var file = this._fileList[key];
            file.error = true;
            this.nextFile(key, true);
        };
        Loader.prototype.nextFile = function (previousKey, success) {
            this.progress = Math.round(this.progress + this._progressChunk);
            if(this.progress > 1) {
                this.progress = 1;
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
        Loader.prototype.checkKeyExists = function (key) {
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
var Phaser;
(function (Phaser) {
    var Motion = (function () {
        function Motion(game) {
            this._game = game;
        }
        Motion.prototype.computeVelocity = function (Velocity, Acceleration, Drag, Max) {
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
        Motion.prototype.velocityFromAngle = function (angle, speed) {
            if(isNaN(speed)) {
                speed = 0;
            }
            var a = this._game.math.degreesToRadians(angle);
            return new Phaser.Point((Math.cos(a) * speed), (Math.sin(a) * speed));
        };
        Motion.prototype.moveTowardsObject = function (source, dest, speed, maxTime) {
            if (typeof speed === "undefined") { speed = 60; }
            if (typeof maxTime === "undefined") { maxTime = 0; }
            var a = this.angleBetween(source, dest);
            if(maxTime > 0) {
                var d = this.distanceBetween(source, dest);
                speed = d / (maxTime / 1000);
            }
            source.velocity.x = Math.cos(a) * speed;
            source.velocity.y = Math.sin(a) * speed;
        };
        Motion.prototype.accelerateTowardsObject = function (source, dest, speed, xSpeedMax, ySpeedMax) {
            var a = this.angleBetween(source, dest);
            source.velocity.x = 0;
            source.velocity.y = 0;
            source.acceleration.x = Math.cos(a) * speed;
            source.acceleration.y = Math.sin(a) * speed;
            source.maxVelocity.x = xSpeedMax;
            source.maxVelocity.y = ySpeedMax;
        };
        Motion.prototype.moveTowardsMouse = function (source, speed, maxTime) {
            if (typeof speed === "undefined") { speed = 60; }
            if (typeof maxTime === "undefined") { maxTime = 0; }
            var a = this.angleBetweenMouse(source);
            if(maxTime > 0) {
                var d = this.distanceToMouse(source);
                speed = d / (maxTime / 1000);
            }
            source.velocity.x = Math.cos(a) * speed;
            source.velocity.y = Math.sin(a) * speed;
        };
        Motion.prototype.accelerateTowardsMouse = function (source, speed, xSpeedMax, ySpeedMax) {
            var a = this.angleBetweenMouse(source);
            source.velocity.x = 0;
            source.velocity.y = 0;
            source.acceleration.x = Math.cos(a) * speed;
            source.acceleration.y = Math.sin(a) * speed;
            source.maxVelocity.x = xSpeedMax;
            source.maxVelocity.y = ySpeedMax;
        };
        Motion.prototype.moveTowardsPoint = function (source, target, speed, maxTime) {
            if (typeof speed === "undefined") { speed = 60; }
            if (typeof maxTime === "undefined") { maxTime = 0; }
            var a = this.angleBetweenPoint(source, target);
            if(maxTime > 0) {
                var d = this.distanceToPoint(source, target);
                speed = d / (maxTime / 1000);
            }
            source.velocity.x = Math.cos(a) * speed;
            source.velocity.y = Math.sin(a) * speed;
        };
        Motion.prototype.accelerateTowardsPoint = function (source, target, speed, xSpeedMax, ySpeedMax) {
            var a = this.angleBetweenPoint(source, target);
            source.velocity.x = 0;
            source.velocity.y = 0;
            source.acceleration.x = Math.cos(a) * speed;
            source.acceleration.y = Math.sin(a) * speed;
            source.maxVelocity.x = xSpeedMax;
            source.maxVelocity.y = ySpeedMax;
        };
        Motion.prototype.distanceBetween = function (a, b) {
            var dx = (a.x + a.origin.x) - (b.x + b.origin.x);
            var dy = (a.y + a.origin.y) - (b.y + b.origin.y);
            return this._game.math.vectorLength(dx, dy);
        };
        Motion.prototype.distanceToPoint = function (a, target) {
            var dx = (a.x + a.origin.x) - (target.x);
            var dy = (a.y + a.origin.y) - (target.y);
            return this._game.math.vectorLength(dx, dy);
        };
        Motion.prototype.distanceToMouse = function (a) {
            var dx = (a.x + a.origin.x) - this._game.input.x;
            var dy = (a.y + a.origin.y) - this._game.input.y;
            return this._game.math.vectorLength(dx, dy);
        };
        Motion.prototype.angleBetweenPoint = function (a, target, asDegrees) {
            if (typeof asDegrees === "undefined") { asDegrees = false; }
            var dx = (target.x) - (a.x + a.origin.x);
            var dy = (target.y) - (a.y + a.origin.y);
            if(asDegrees) {
                return this._game.math.radiansToDegrees(Math.atan2(dy, dx));
            } else {
                return Math.atan2(dy, dx);
            }
        };
        Motion.prototype.angleBetween = function (a, b, asDegrees) {
            if (typeof asDegrees === "undefined") { asDegrees = false; }
            var dx = (b.x + b.origin.x) - (a.x + a.origin.x);
            var dy = (b.y + b.origin.y) - (a.y + a.origin.y);
            if(asDegrees) {
                return this._game.math.radiansToDegrees(Math.atan2(dy, dx));
            } else {
                return Math.atan2(dy, dx);
            }
        };
        Motion.prototype.velocityFromFacing = function (parent, speed) {
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
        Motion.prototype.angleBetweenMouse = function (a, asDegrees) {
            if (typeof asDegrees === "undefined") { asDegrees = false; }
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
            this._sound.noteOn(0);
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
                if(this._game.cache.isSoundDecoded(key) === true) {
                    return new Phaser.Sound(this._context, this._gainNode, soundData, volume, loop);
                } else {
                    var tempSound = new Phaser.Sound(this._context, this._gainNode, null, volume, loop);
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
var Phaser;
(function (Phaser) {
    Phaser.VERSION = 'Phaser version 0.9.4';
})(Phaser || (Phaser = {}));
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
var Phaser;
(function (Phaser) {
    var Stage = (function () {
        function Stage(game, parent, width, height) {
            var _this = this;
            this.clear = true;
            this.disablePauseScreen = false;
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
            this.canvas.style.msTouchAction = 'none';
            this.canvas.style['touch-action'] = 'none';
            this.context = this.canvas.getContext('2d');
            this.offset = this.getOffset(this.canvas);
            this.bounds = new Phaser.Rectangle(this.offset.x, this.offset.y, width, height);
            this.aspectRatio = width / height;
            this.scaleMode = Phaser.StageScaleMode.NO_SCALE;
            this.scale = new Phaser.StageScaleMode(this._game);
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
        Stage.ORIENTATION_LANDSCAPE = 0;
        Stage.ORIENTATION_PORTRAIT = 1;
        Stage.prototype.update = function () {
            this.scale.update();
            if(this.clear) {
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
            if(this.disablePauseScreen) {
                return;
            }
            if(event.type == 'blur' && this._game.paused == false && this._game.isBooted == true) {
                this._game.paused = true;
                this.drawPauseScreen();
            } else if(event.type == 'focus') {
                this._game.paused = false;
            }
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
var Phaser;
(function (Phaser) {
    var Time = (function () {
        function Time(game) {
            this.timeScale = 1.0;
            this.elapsed = 0;
            this.time = 0;
            this.now = 0;
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
            get: function () {
                return (this.now - this._started) * 0.001;
            },
            enumerable: true,
            configurable: true
        });
        Time.prototype.update = function () {
            this.now = Date.now();
            this.delta = this.now - this.time;
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
            this.time = this.now;
        };
        Time.prototype.elapsedSince = function (since) {
            return this.now - since;
        };
        Time.prototype.elapsedSecondsSince = function (since) {
            return (this.now - since) * 0.001;
        };
        Time.prototype.reset = function () {
            this._started = this.now;
        };
        return Time;
    })();
    Phaser.Time = Time;    
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
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
                if(this._object[property] === null || !(property in this._object)) {
                    throw Error('Phaser.Tween interpolation of null value of non-existing property');
                    continue;
                }
                if(this._valuesEnd[property] instanceof Array) {
                    if(this._valuesEnd[property].length === 0) {
                        continue;
                    }
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
            this._cameras.render();
        };
        World.prototype.destroy = function () {
            this.group.destroy();
            this._cameras.destroy();
        };
        World.prototype.setSize = function (width, height, updateCameraBounds) {
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
        World.prototype.createCamera = function (x, y, width, height) {
            return this._cameras.addCamera(x, y, width, height);
        };
        World.prototype.removeCamera = function (id) {
            return this._cameras.removeCamera(id);
        };
        World.prototype.getAllCameras = function () {
            return this._cameras.getAll();
        };
        World.prototype.createSprite = function (x, y, key) {
            if (typeof key === "undefined") { key = ''; }
            return this.group.add(new Phaser.Sprite(this._game, x, y, key));
        };
        World.prototype.createGeomSprite = function (x, y) {
            return this.group.add(new Phaser.GeomSprite(this._game, x, y));
        };
        World.prototype.createDynamicTexture = function (width, height) {
            return new Phaser.DynamicTexture(this._game, width, height);
        };
        World.prototype.createGroup = function (MaxSize) {
            if (typeof MaxSize === "undefined") { MaxSize = 0; }
            return this.group.add(new Phaser.Group(this._game, MaxSize));
        };
        World.prototype.createScrollZone = function (key, x, y, width, height) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            if (typeof width === "undefined") { width = 0; }
            if (typeof height === "undefined") { height = 0; }
            return this.group.add(new Phaser.ScrollZone(this._game, key, x, y, width, height));
        };
        World.prototype.createTilemap = function (key, mapData, format, resizeWorld, tileWidth, tileHeight) {
            if (typeof resizeWorld === "undefined") { resizeWorld = true; }
            if (typeof tileWidth === "undefined") { tileWidth = 0; }
            if (typeof tileHeight === "undefined") { tileHeight = 0; }
            return this.group.add(new Phaser.Tilemap(this._game, key, mapData, format, resizeWorld, tileWidth, tileHeight));
        };
        World.prototype.createParticle = function () {
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
var Phaser;
(function (Phaser) {
    var Device = (function () {
        function Device() {
            this.desktop = false;
            this.iOS = false;
            this.android = false;
            this.chromeOS = false;
            this.linux = false;
            this.macOS = false;
            this.windows = false;
            this.canvas = false;
            this.file = false;
            this.fileSystem = false;
            this.localStorage = false;
            this.webGL = false;
            this.worker = false;
            this.touch = false;
            this.css3D = false;
            this.arora = false;
            this.chrome = false;
            this.epiphany = false;
            this.firefox = false;
            this.ie = false;
            this.ieVersion = 0;
            this.mobileSafari = false;
            this.midori = false;
            this.opera = false;
            this.safari = false;
            this.webApp = false;
            this.audioData = false;
            this.webaudio = false;
            this.ogg = false;
            this.mp3 = false;
            this.wav = false;
            this.m4a = false;
            this.iPhone = false;
            this.iPhone4 = false;
            this.iPad = false;
            this.pixelRatio = 0;
            this._checkAudio();
            this._checkBrowser();
            this._checkCSS3D();
            this._checkDevice();
            this._checkFeatures();
            this._checkOS();
        }
        Device.prototype._checkOS = function () {
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
        Device.prototype._checkFeatures = function () {
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
        Device.prototype._checkBrowser = function () {
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
            if(navigator['standalone']) {
                this.webApp = true;
            }
        };
        Device.prototype._checkAudio = function () {
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
        Device.prototype._checkDevice = function () {
            this.pixelRatio = window['devicePixelRatio'] || 1;
            this.iPhone = navigator.userAgent.toLowerCase().indexOf('iphone') != -1;
            this.iPhone4 = (this.pixelRatio == 2 && this.iPhone);
            this.iPad = navigator.userAgent.toLowerCase().indexOf('ipad') != -1;
        };
        Device.prototype._checkCSS3D = function () {
            var el = document.createElement('p');
            var has3d;
            var transforms = {
                'webkitTransform': '-webkit-transform',
                'OTransform': '-o-transform',
                'msTransform': '-ms-transform',
                'MozTransform': '-moz-transform',
                'transform': 'transform'
            };
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
        Device.prototype.getAll = function () {
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
var Phaser;
(function (Phaser) {
    var RandomDataGenerator = (function () {
        function RandomDataGenerator(seeds) {
            if (typeof seeds === "undefined") { seeds = []; }
            this.c = 1;
            this.sow(seeds);
        }
        RandomDataGenerator.prototype.uint32 = function () {
            return this.rnd.apply(this) * 0x100000000;
        };
        RandomDataGenerator.prototype.fract32 = function () {
            return this.rnd.apply(this) + (this.rnd.apply(this) * 0x200000 | 0) * 1.1102230246251565e-16;
        };
        RandomDataGenerator.prototype.rnd = function () {
            var t = 2091639 * this.s0 + this.c * 2.3283064365386963e-10;
            this.c = t | 0;
            this.s0 = this.s1;
            this.s1 = this.s2;
            this.s2 = t - this.c;
            return this.s2;
        };
        RandomDataGenerator.prototype.hash = function (data) {
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
                n += h * 0x100000000;
            }
            return (n >>> 0) * 2.3283064365386963e-10;
        };
        RandomDataGenerator.prototype.sow = function (seeds) {
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
            get: function () {
                return this.uint32();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RandomDataGenerator.prototype, "frac", {
            get: function () {
                return this.fract32();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RandomDataGenerator.prototype, "real", {
            get: function () {
                return this.uint32() + this.fract32();
            },
            enumerable: true,
            configurable: true
        });
        RandomDataGenerator.prototype.integerInRange = function (min, max) {
            return Math.floor(this.realInRange(min, max));
        };
        RandomDataGenerator.prototype.realInRange = function (min, max) {
            min = min || 0;
            max = max || 0;
            return this.frac * (max - min) + min;
        };
        Object.defineProperty(RandomDataGenerator.prototype, "normal", {
            get: function () {
                return 1 - 2 * this.frac;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RandomDataGenerator.prototype, "uuid", {
            get: function () {
                var a, b;
                for(b = a = ''; a++ < 36; b += ~a % 5 | a * 3 & 4 ? (a ^ 15 ? 8 ^ this.frac * (a ^ 20 ? 16 : 4) : 4).toString(16) : '-') {
                    ;
                }
                return b;
            },
            enumerable: true,
            configurable: true
        });
        RandomDataGenerator.prototype.pick = function (array) {
            return array[this.integerInRange(0, array.length)];
        };
        RandomDataGenerator.prototype.weightedPick = function (array) {
            return array[~~(Math.pow(this.frac, 2) * array.length)];
        };
        RandomDataGenerator.prototype.timestamp = function (min, max) {
            if (typeof min === "undefined") { min = 946684800000; }
            if (typeof max === "undefined") { max = 1577862000000; }
            return this.realInRange(min, max);
        };
        Object.defineProperty(RandomDataGenerator.prototype, "angle", {
            get: function () {
                return this.integerInRange(-180, 180);
            },
            enumerable: true,
            configurable: true
        });
        return RandomDataGenerator;
    })();
    Phaser.RandomDataGenerator = RandomDataGenerator;    
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    var RequestAnimationFrame = (function () {
        function RequestAnimationFrame(callback, callbackContext) {
            this._isSetTimeOut = false;
            this.lastTime = 0;
            this.currentTime = 0;
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
        RequestAnimationFrame.prototype.setCallback = function (callback) {
            this._callback = callback;
        };
        RequestAnimationFrame.prototype.isUsingSetTimeOut = function () {
            return this._isSetTimeOut;
        };
        RequestAnimationFrame.prototype.isUsingRAF = function () {
            if(this._isSetTimeOut === true) {
                return false;
            } else {
                return true;
            }
        };
        RequestAnimationFrame.prototype.start = function (callback) {
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
        RequestAnimationFrame.prototype.stop = function () {
            if(this._isSetTimeOut) {
                clearTimeout(this._timeOutID);
            } else {
                window.cancelAnimationFrame;
            }
            this.isRunning = false;
        };
        RequestAnimationFrame.prototype.RAFUpdate = function () {
            var _this = this;
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
        RequestAnimationFrame.prototype.SetTimeoutUpdate = function () {
            var _this = this;
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
            this._game.stage.context.font = '14px Courier';
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
            if(typeof keycode === 'object') {
                for(var i = 0; i < keycode.length; i++) {
                    this._capture[keycode[i]] = true;
                }
            } else {
                this._capture[keycode] = true;
            }
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
var Phaser;
(function (Phaser) {
    var Finger = (function () {
        function Finger(game) {
            this.point = null;
            this.circle = null;
            this.withinGame = false;
            this.clientX = -1;
            this.clientY = -1;
            this.pageX = -1;
            this.pageY = -1;
            this.screenX = -1;
            this.screenY = -1;
            this.x = -1;
            this.y = -1;
            this.isDown = false;
            this.isUp = false;
            this.timeDown = 0;
            this.duration = 0;
            this.timeUp = 0;
            this.justPressedRate = 200;
            this.justReleasedRate = 200;
            this._game = game;
            this.active = false;
        }
        Finger.prototype.start = function (event) {
            this.identifier = event.identifier;
            this.target = event.target;
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
        Finger.prototype.move = function (event) {
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
            this.duration = this._game.time.now - this.timeDown;
        };
        Finger.prototype.leave = function (event) {
            this.withinGame = false;
            this.move(event);
        };
        Finger.prototype.stop = function (event) {
            this.active = false;
            this.withinGame = false;
            this.isDown = false;
            this.isUp = true;
            this.timeUp = this._game.time.now;
            this.duration = this.timeUp - this.timeDown;
        };
        Finger.prototype.justPressed = function (duration) {
            if (typeof duration === "undefined") { duration = this.justPressedRate; }
            if(this.isDown === true && (this.timeDown + duration) > this._game.time.now) {
                return true;
            } else {
                return false;
            }
        };
        Finger.prototype.justReleased = function (duration) {
            if (typeof duration === "undefined") { duration = this.justReleasedRate; }
            if(this.isUp === true && (this.timeUp + duration) > this._game.time.now) {
                return true;
            } else {
                return false;
            }
        };
        Finger.prototype.toString = function () {
            return "[{Finger (identifer=" + this.identifier + " active=" + this.active + " duration=" + this.duration + " withinGame=" + this.withinGame + " x=" + this.x + " y=" + this.y + " clientX=" + this.clientX + " clientY=" + this.clientY + " screenX=" + this.screenX + " screenY=" + this.screenY + " pageX=" + this.pageX + " pageY=" + this.pageY + ")}]";
        };
        return Finger;
    })();
    Phaser.Finger = Finger;    
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    var Touch = (function () {
        function Touch(game) {
            this.x = 0;
            this.y = 0;
            this.isDown = false;
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
        Touch.prototype.start = function () {
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
        Touch.prototype.consumeTouchMove = function (event) {
            event.preventDefault();
        };
        Touch.prototype.onTouchStart = function (event) {
            event.preventDefault();
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
        Touch.prototype.onTouchCancel = function (event) {
            event.preventDefault();
            for(var i = 0; i < event.changedTouches.length; i++) {
                for(var f = 0; f < this._fingers.length; f++) {
                    if(this._fingers[f].identifier === event.changedTouches[i].identifier) {
                        this._fingers[f].stop(event.changedTouches[i]);
                        break;
                    }
                }
            }
        };
        Touch.prototype.onTouchEnter = function (event) {
            event.preventDefault();
            for(var i = 0; i < event.changedTouches.length; i++) {
                for(var f = 0; f < this._fingers.length; f++) {
                    if(this._fingers[f].active === false) {
                        this._fingers[f].start(event.changedTouches[i]);
                        break;
                    }
                }
            }
        };
        Touch.prototype.onTouchLeave = function (event) {
            event.preventDefault();
            for(var i = 0; i < event.changedTouches.length; i++) {
                for(var f = 0; f < this._fingers.length; f++) {
                    if(this._fingers[f].identifier === event.changedTouches[i].identifier) {
                        this._fingers[f].leave(event.changedTouches[i]);
                        break;
                    }
                }
            }
        };
        Touch.prototype.onTouchMove = function (event) {
            event.preventDefault();
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
        Touch.prototype.onTouchEnd = function (event) {
            event.preventDefault();
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
        Touch.prototype.calculateDistance = function (finger1, finger2) {
        };
        Touch.prototype.calculateAngle = function (finger1, finger2) {
        };
        Touch.prototype.checkOverlap = function (finger1, finger2) {
        };
        Touch.prototype.update = function () {
        };
        Touch.prototype.stop = function () {
        };
        Touch.prototype.reset = function () {
            this.isDown = false;
            this.isUp = false;
        };
        return Touch;
    })();
    Phaser.Touch = Touch;    
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    var Emitter = (function (_super) {
        __extends(Emitter, _super);
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
        Emitter.prototype.destroy = function () {
            this.minParticleSpeed = null;
            this.maxParticleSpeed = null;
            this.particleDrag = null;
            this.particleClass = null;
            this._point = null;
            _super.prototype.destroy.call(this);
        };
        Emitter.prototype.makeParticles = function (Graphics, Quantity, BakedRotations, Multiple, Collide) {
            if (typeof Quantity === "undefined") { Quantity = 50; }
            if (typeof BakedRotations === "undefined") { BakedRotations = 16; }
            if (typeof Multiple === "undefined") { Multiple = false; }
            if (typeof Collide === "undefined") { Collide = 0.8; }
            this.maxSize = Quantity;
            var totalFrames = 1;
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
                } else {
                    if(Graphics) {
                        particle.loadGraphic(Graphics);
                    }
                }
                if(Collide > 0) {
                    particle.width *= Collide;
                    particle.height *= Collide;
                } else {
                    particle.allowCollisions = Phaser.Collision.NONE;
                }
                particle.exists = false;
                this.add(particle);
                i++;
            }
            return this;
        };
        Emitter.prototype.update = function () {
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
        Emitter.prototype.kill = function () {
            this.on = false;
            _super.prototype.kill.call(this);
        };
        Emitter.prototype.start = function (Explode, Lifespan, Frequency, Quantity) {
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
        Emitter.prototype.emitParticle = function () {
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
        Emitter.prototype.setSize = function (Width, Height) {
            this.width = Width;
            this.height = Height;
        };
        Emitter.prototype.setXSpeed = function (Min, Max) {
            if (typeof Min === "undefined") { Min = 0; }
            if (typeof Max === "undefined") { Max = 0; }
            this.minParticleSpeed.x = Min;
            this.maxParticleSpeed.x = Max;
        };
        Emitter.prototype.setYSpeed = function (Min, Max) {
            if (typeof Min === "undefined") { Min = 0; }
            if (typeof Max === "undefined") { Max = 0; }
            this.minParticleSpeed.y = Min;
            this.maxParticleSpeed.y = Max;
        };
        Emitter.prototype.setRotation = function (Min, Max) {
            if (typeof Min === "undefined") { Min = 0; }
            if (typeof Max === "undefined") { Max = 0; }
            this.minRotation = Min;
            this.maxRotation = Max;
        };
        Emitter.prototype.at = function (Object) {
            Object.getMidpoint(this._point);
            this.x = this._point.x - (this.width >> 1);
            this.y = this._point.y - (this.height >> 1);
        };
        return Emitter;
    })(Phaser.Group);
    Phaser.Emitter = Emitter;    
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    var GeomSprite = (function (_super) {
        __extends(GeomSprite, _super);
        function GeomSprite(game, x, y) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
                _super.call(this, game, x, y);
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
            if(this.type == GeomSprite.UNASSIGNED || this.visible === false || this.scale.x == 0 || this.scale.y == 0 || this.alpha < 0.1 || this.cameraBlacklist.indexOf(camera.ID) !== -1 || this.inCamera(camera.worldView) == false) {
                return false;
            }
            if(this.alpha !== 1) {
                var globalAlpha = this._game.stage.context.globalAlpha;
                this._game.stage.context.globalAlpha = this.alpha;
            }
            this._dx = cameraOffsetX + (this.bounds.x - camera.worldView.x);
            this._dy = cameraOffsetY + (this.bounds.y - camera.worldView.y);
            this._dw = this.bounds.width * this.scale.x;
            this._dh = this.bounds.height * this.scale.y;
            if(this.type == GeomSprite.CIRCLE) {
                this._dx += this.circle.radius;
                this._dy += this.circle.radius;
            }
            if(this.scrollFactor.x !== 1.0 || this.scrollFactor.y !== 1.0) {
                this._dx -= (camera.worldView.x * this.scrollFactor.x);
                this._dy -= (camera.worldView.y * this.scrollFactor.y);
            }
            this._dx = Math.round(this._dx);
            this._dy = Math.round(this._dy);
            this._dw = Math.round(this._dw);
            this._dh = Math.round(this._dh);
            this._game.stage.saveCanvasValues();
            this._game.stage.context.lineWidth = this.lineWidth;
            this._game.stage.context.strokeStyle = this.lineColor;
            this._game.stage.context.fillStyle = this.fillColor;
            if(this._game.stage.fillStyle !== this.fillColor) {
            }
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
        };
        GeomSprite.prototype.collide = function (source) {
            if(this.type == GeomSprite.CIRCLE && source.type == GeomSprite.CIRCLE) {
                return Phaser.Collision.circleToCircle(this.circle, source.circle).result;
            }
            if(this.type == GeomSprite.CIRCLE && source.type == GeomSprite.RECTANGLE) {
                return Phaser.Collision.circleToRectangle(this.circle, source.rect).result;
            }
            if(this.type == GeomSprite.CIRCLE && source.type == GeomSprite.POINT) {
                return Phaser.Collision.circleContainsPoint(this.circle, source.point).result;
            }
            if(this.type == GeomSprite.CIRCLE && source.type == GeomSprite.LINE) {
                return Phaser.Collision.lineToCircle(source.line, this.circle).result;
            }
            if(this.type == GeomSprite.RECTANGLE && source.type == GeomSprite.RECTANGLE) {
                return Phaser.Collision.rectangleToRectangle(this.rect, source.rect).result;
            }
            if(this.type == GeomSprite.RECTANGLE && source.type == GeomSprite.CIRCLE) {
                return Phaser.Collision.circleToRectangle(source.circle, this.rect).result;
            }
            if(this.type == GeomSprite.RECTANGLE && source.type == GeomSprite.POINT) {
                return Phaser.Collision.pointToRectangle(source.point, this.rect).result;
            }
            if(this.type == GeomSprite.RECTANGLE && source.type == GeomSprite.LINE) {
                return Phaser.Collision.lineToRectangle(source.line, this.rect).result;
            }
            if(this.type == GeomSprite.POINT && source.type == GeomSprite.POINT) {
                return this.point.equals(source.point);
            }
            if(this.type == GeomSprite.POINT && source.type == GeomSprite.CIRCLE) {
                return Phaser.Collision.circleContainsPoint(source.circle, this.point).result;
            }
            if(this.type == GeomSprite.POINT && source.type == GeomSprite.RECTANGLE) {
                return Phaser.Collision.pointToRectangle(this.point, source.rect).result;
            }
            if(this.type == GeomSprite.POINT && source.type == GeomSprite.LINE) {
                return source.line.isPointOnLine(this.point.x, this.point.y);
            }
            if(this.type == GeomSprite.LINE && source.type == GeomSprite.LINE) {
                return Phaser.Collision.lineSegmentToLineSegment(this.line, source.line).result;
            }
            if(this.type == GeomSprite.LINE && source.type == GeomSprite.CIRCLE) {
                return Phaser.Collision.lineToCircle(this.line, source.circle).result;
            }
            if(this.type == GeomSprite.LINE && source.type == GeomSprite.RECTANGLE) {
                return Phaser.Collision.lineSegmentToRectangle(this.line, source.rect).result;
            }
            if(this.type == GeomSprite.LINE && source.type == GeomSprite.POINT) {
                return this.line.isPointOnLine(source.point.x, source.point.y);
            }
            return false;
        };
        return GeomSprite;
    })(Phaser.GameObject);
    Phaser.GeomSprite = GeomSprite;    
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    var Particle = (function (_super) {
        __extends(Particle, _super);
        function Particle(game) {
                _super.call(this, game);
            this.lifespan = 0;
            this.friction = 500;
        }
        Particle.prototype.update = function () {
            if(this.lifespan <= 0) {
                return;
            }
            this.lifespan -= this._game.time.elapsed;
            if(this.lifespan <= 0) {
                this.kill();
            }
            if(this.touching) {
                if(this.angularVelocity != 0) {
                    this.angularVelocity = -this.angularVelocity;
                }
            }
            if(this.acceleration.y > 0) {
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
        Particle.prototype.onEmit = function () {
        };
        return Particle;
    })(Phaser.Sprite);
    Phaser.Particle = Particle;    
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    var TilemapLayer = (function () {
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
            this.alpha = 1;
            this.exists = true;
            this.visible = true;
            this.widthInTiles = 0;
            this.heightInTiles = 0;
            this.widthInPixels = 0;
            this.heightInPixels = 0;
            this.tileMargin = 0;
            this.tileSpacing = 0;
            this._game = game;
            this._parent = parent;
            this.name = name;
            this.mapFormat = mapFormat;
            this.tileWidth = tileWidth;
            this.tileHeight = tileHeight;
            this.boundsInTiles = new Phaser.Rectangle();
            this.mapData = [];
            this._texture = this._game.cache.getImage(key);
        }
        TilemapLayer.prototype.getTileFromWorldXY = function (x, y) {
            x = this._game.math.snapToFloor(x, this.tileWidth) / this.tileWidth;
            y = this._game.math.snapToFloor(y, this.tileHeight) / this.tileHeight;
            return this.getTileIndex(x, y);
        };
        TilemapLayer.prototype.getTileOverlaps = function (object) {
            var mapX = this._game.math.snapToFloor(object.bounds.x, this.tileWidth);
            var mapY = this._game.math.snapToFloor(object.bounds.y, this.tileHeight);
            var mapW = this._game.math.snapToCeil(object.bounds.width, this.tileWidth) + this.tileWidth;
            var mapH = this._game.math.snapToCeil(object.bounds.height, this.tileHeight) + this.tileHeight;
            var tileX = mapX / this.tileWidth;
            var tileY = mapY / this.tileHeight;
            var tileW = mapW / this.tileWidth;
            var tileH = mapH / this.tileHeight;
            if(tileX < 0) {
                tileX = 0;
            }
            if(tileY < 0) {
                tileY = 0;
            }
            if(tileW > this.widthInTiles) {
                tileW = this.widthInTiles;
            }
            if(tileH > this.heightInTiles) {
                tileH = this.heightInTiles;
            }
            var tiles = this.getTileBlock(tileX, tileY, tileW, tileH);
            var result = [];
            var tempBounds = new Phaser.Quad();
            for(var r = 0; r < tiles.length; r++) {
                if(tiles[r].tile.allowCollisions != Phaser.Collision.NONE) {
                    tempBounds.setTo(tiles[r].x * this.tileWidth, tiles[r].y * this.tileHeight, this.tileWidth, this.tileHeight);
                    if(tempBounds.intersects(object.bounds)) {
                        result.push(Phaser.Collision.separateTile(object, {
                            x: tempBounds.x,
                            y: tempBounds.y,
                            width: tempBounds.width,
                            height: tempBounds.height,
                            mass: 1.0,
                            immovable: true,
                            allowCollisions: Phaser.Collision.ANY
                        }));
                    } else {
                        result.push(false);
                    }
                } else {
                    result.push(false);
                }
            }
            return {
                x: tileX,
                y: tileY,
                w: tileW,
                h: tileH,
                collision: result
            };
        };
        TilemapLayer.prototype.getTileBlock = function (x, y, width, height) {
            var output = [];
            for(var ty = y; ty < y + height; ty++) {
                for(var tx = x; tx < x + width; tx++) {
                    output.push({
                        x: tx,
                        y: ty,
                        tile: this._parent.tiles[this.mapData[ty][tx]]
                    });
                }
            }
            return output;
        };
        TilemapLayer.prototype.getTileIndex = function (x, y) {
            if(y >= 0 && y < this.mapData.length) {
                if(x >= 0 && x < this.mapData[y].length) {
                    return this.mapData[y][x];
                }
            }
            return null;
        };
        TilemapLayer.prototype.addColumn = function (column) {
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
        TilemapLayer.prototype.updateBounds = function () {
            this.boundsInTiles.setTo(0, 0, this.widthInTiles, this.heightInTiles);
            console.log('layer bounds', this.boundsInTiles);
        };
        TilemapLayer.prototype.parseTileOffsets = function () {
            this._tileOffsets = [];
            var i = 0;
            if(this.mapFormat == Phaser.Tilemap.FORMAT_TILED_JSON) {
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
            this._game.stage.context.fillStyle = color;
            this._game.stage.context.fillText('TilemapLayer: ' + this.name, x, y);
            this._game.stage.context.fillText('startX: ' + this._startX + ' endX: ' + this._maxX, x, y + 14);
            this._game.stage.context.fillText('startY: ' + this._startY + ' endY: ' + this._maxY, x, y + 28);
            this._game.stage.context.fillText('dx: ' + this._dx + ' dy: ' + this._dy, x, y + 42);
        };
        TilemapLayer.prototype.render = function (camera, dx, dy) {
            if(this.visible === false || this.alpha < 0.1) {
                return false;
            }
            this._maxX = this._game.math.ceil(camera.width / this.tileWidth) + 1;
            this._maxY = this._game.math.ceil(camera.height / this.tileHeight) + 1;
            this._startX = this._game.math.floor(camera.worldView.x / this.tileWidth);
            this._startY = this._game.math.floor(camera.worldView.y / this.tileHeight);
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
            this._dx = dx;
            this._dy = dy;
            this._dx += -(camera.worldView.x - (this._startX * this.tileWidth));
            this._dy += -(camera.worldView.y - (this._startY * this.tileHeight));
            this._tx = this._dx;
            this._ty = this._dy;
            if(this.alpha !== 1) {
                var globalAlpha = this._game.stage.context.globalAlpha;
                this._game.stage.context.globalAlpha = this.alpha;
            }
            for(var row = this._startY; row < this._startY + this._maxY; row++) {
                this._columnData = this.mapData[row];
                for(var tile = this._startX; tile < this._startX + this._maxX; tile++) {
                    if(this._tileOffsets[this._columnData[tile]]) {
                        this._game.stage.context.drawImage(this._texture, this._tileOffsets[this._columnData[tile]].x, this._tileOffsets[this._columnData[tile]].y, this.tileWidth, this.tileHeight, this._tx, this._ty, this.tileWidth, this.tileHeight);
                    }
                    this._tx += this.tileWidth;
                }
                this._tx = this._dx;
                this._ty += this.tileHeight;
            }
            if(globalAlpha > -1) {
                this._game.stage.context.globalAlpha = globalAlpha;
            }
            return true;
        };
        return TilemapLayer;
    })();
    Phaser.TilemapLayer = TilemapLayer;    
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    var Tile = (function () {
        function Tile(game, tilemap, index, width, height) {
            this._game = game;
            this.tilemap = tilemap;
            this.index = index;
            this.width = width;
            this.height = height;
            this.allowCollisions = Phaser.Collision.NONE;
        }
        Tile.prototype.destroy = function () {
            this.tilemap = null;
        };
        Tile.prototype.toString = function () {
            return "[{Tiled (index=" + this.index + " collisions=" + this.allowCollisions + " width=" + this.width + " height=" + this.height + ")}]";
        };
        return Tile;
    })();
    Phaser.Tile = Tile;    
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    var Tilemap = (function (_super) {
        __extends(Tilemap, _super);
        function Tilemap(game, key, mapData, format, resizeWorld, tileWidth, tileHeight) {
            if (typeof resizeWorld === "undefined") { resizeWorld = true; }
            if (typeof tileWidth === "undefined") { tileWidth = 0; }
            if (typeof tileHeight === "undefined") { tileHeight = 0; }
                _super.call(this, game);
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
        Tilemap.prototype.update = function () {
        };
        Tilemap.prototype.render = function (camera, cameraOffsetX, cameraOffsetY) {
            if(this.cameraBlacklist.indexOf(camera.ID) == -1) {
                for(var i = 0; i < this.layers.length; i++) {
                    this.layers[i].render(camera, cameraOffsetX, cameraOffsetY);
                }
            }
        };
        Tilemap.prototype.parseCSV = function (data, key, tileWidth, tileHeight) {
            var layer = new Phaser.TilemapLayer(this._game, this, key, Tilemap.FORMAT_CSV, 'TileLayerCSV' + this.layers.length.toString(), tileWidth, tileHeight);
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
            this.layers.push(layer);
            this.generateTiles(tileQuantity);
        };
        Tilemap.prototype.parseTiledJSON = function (data, key) {
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
                this.layers.push(layer);
            }
            this.generateTiles(tileQuantity);
        };
        Tilemap.prototype.generateTiles = function (qty) {
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
        Tilemap.prototype.setCollisionRange = function (start, end, collision) {
            if (typeof collision === "undefined") { collision = Phaser.Collision.ANY; }
            for(var i = start; i < end; i++) {
                this.tiles[i].allowCollisions = collision;
            }
        };
        Tilemap.prototype.setCollisionByIndex = function (values, collision) {
            if (typeof collision === "undefined") { collision = Phaser.Collision.ANY; }
            for(var i = 0; i < values.length; i++) {
                this.tiles[values[i]].allowCollisions = collision;
            }
        };
        Tilemap.prototype.getTile = function (x, y, layer) {
            if (typeof layer === "undefined") { layer = 0; }
            return this.tiles[this.layers[layer].getTileIndex(x, y)];
        };
        Tilemap.prototype.getTileFromWorldXY = function (x, y, layer) {
            if (typeof layer === "undefined") { layer = 0; }
            return this.tiles[this.layers[layer].getTileFromWorldXY(x, y)];
        };
        Tilemap.prototype.getTileFromInputXY = function (layer) {
            if (typeof layer === "undefined") { layer = 0; }
            return this.tiles[this.layers[layer].getTileFromWorldXY(this._game.input.worldX, this._game.input.worldY)];
        };
        Tilemap.prototype.getTileOverlaps = function (object) {
            return this.currentLayer.getTileOverlaps(object);
        };
        Tilemap.prototype.collide = function (objectOrGroup, callback) {
            if (typeof objectOrGroup === "undefined") { objectOrGroup = null; }
            if (typeof callback === "undefined") { callback = null; }
            if(objectOrGroup == null) {
                objectOrGroup = this._game.world.group;
            }
            if(objectOrGroup.isGroup == false) {
                if(objectOrGroup.exists && objectOrGroup.allowCollisions != Phaser.Collision.NONE) {
                    this.currentLayer.getTileOverlaps(objectOrGroup);
                }
            } else {
                objectOrGroup.forEachAlive(this.currentLayer.getTileOverlaps);
            }
            return true;
        };
        return Tilemap;
    })(Phaser.GameObject);
    Phaser.Tilemap = Tilemap;    
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    var ScrollRegion = (function () {
        function ScrollRegion(x, y, width, height, speedX, speedY) {
            this._anchorWidth = 0;
            this._anchorHeight = 0;
            this._inverseWidth = 0;
            this._inverseHeight = 0;
            this.visible = true;
            this._A = new Phaser.Quad(x, y, width, height);
            this._B = new Phaser.Quad(x, y, width, height);
            this._C = new Phaser.Quad(x, y, width, height);
            this._D = new Phaser.Quad(x, y, width, height);
            this._scroll = new Phaser.MicroPoint();
            this._bounds = new Phaser.Quad(x, y, width, height);
            this.scrollSpeed = new Phaser.MicroPoint(speedX, speedY);
        }
        ScrollRegion.prototype.update = function (delta) {
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
            this._A.setTo(this._scroll.x, this._scroll.y, this._anchorWidth, this._anchorHeight);
            this._B.y = this._scroll.y;
            this._B.width = this._inverseWidth;
            this._B.height = this._anchorHeight;
            this._C.x = this._scroll.x;
            this._C.width = this._anchorWidth;
            this._C.height = this._inverseHeight;
            this._D.width = this._inverseWidth;
            this._D.height = this._inverseHeight;
        };
        ScrollRegion.prototype.render = function (context, texture, dx, dy, dw, dh) {
            if(this.visible == false) {
                return;
            }
            this.crop(context, texture, this._A.x, this._A.y, this._A.width, this._A.height, dx, dy, dw, dh, 0, 0);
            this.crop(context, texture, this._B.x, this._B.y, this._B.width, this._B.height, dx, dy, dw, dh, this._A.width, 0);
            this.crop(context, texture, this._C.x, this._C.y, this._C.width, this._C.height, dx, dy, dw, dh, 0, this._A.height);
            this.crop(context, texture, this._D.x, this._D.y, this._D.width, this._D.height, dx, dy, dw, dh, this._C.width, this._A.height);
        };
        ScrollRegion.prototype.crop = function (context, texture, srcX, srcY, srcW, srcH, destX, destY, destW, destH, offsetX, offsetY) {
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
var Phaser;
(function (Phaser) {
    var ScrollZone = (function (_super) {
        __extends(ScrollZone, _super);
        function ScrollZone(game, key, x, y, width, height) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            if (typeof width === "undefined") { width = 0; }
            if (typeof height === "undefined") { height = 0; }
                _super.call(this, game, x, y, width, height);
            this._dynamicTexture = null;
            this._dx = 0;
            this._dy = 0;
            this._dw = 0;
            this._dh = 0;
            this.flipped = false;
            this.regions = [];
            if(this._game.cache.getImage(key)) {
                this._texture = this._game.cache.getImage(key);
                this.width = this._texture.width;
                this.height = this._texture.height;
                if(width > this._texture.width || height > this._texture.height) {
                    this.createRepeatingTexture(width, height);
                    this.width = width;
                    this.height = height;
                }
                this.addRegion(0, 0, this.width, this.height);
                if((width < this._texture.width || height < this._texture.height) && width !== 0 && height !== 0) {
                    this.width = width;
                    this.height = height;
                }
            }
        }
        ScrollZone.prototype.addRegion = function (x, y, width, height, speedX, speedY) {
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
        ScrollZone.prototype.setSpeed = function (x, y) {
            if(this.currentRegion) {
                this.currentRegion.scrollSpeed.setTo(x, y);
            }
            return this;
        };
        ScrollZone.prototype.update = function () {
            for(var i = 0; i < this.regions.length; i++) {
                this.regions[i].update(this._game.time.delta);
            }
        };
        ScrollZone.prototype.inCamera = function (camera) {
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
        ScrollZone.prototype.render = function (camera, cameraOffsetX, cameraOffsetY) {
            if(this.visible == false || this.scale.x == 0 || this.scale.y == 0 || this.alpha < 0.1 || this.cameraBlacklist.indexOf(camera.ID) !== -1 || this.inCamera(camera.worldView) == false) {
                return false;
            }
            if(this.alpha !== 1) {
                var globalAlpha = this._game.stage.context.globalAlpha;
                this._game.stage.context.globalAlpha = this.alpha;
            }
            this._dx = cameraOffsetX + (this.bounds.topLeft.x - camera.worldView.x);
            this._dy = cameraOffsetY + (this.bounds.topLeft.y - camera.worldView.y);
            this._dw = this.bounds.width * this.scale.x;
            this._dh = this.bounds.height * this.scale.y;
            if(this.scrollFactor.x !== 1.0 || this.scrollFactor.y !== 1.0) {
                this._dx -= (camera.worldView.x * this.scrollFactor.x);
                this._dy -= (camera.worldView.y * this.scrollFactor.y);
            }
            if(this.angle !== 0 || this.flipped == true) {
                this._game.stage.context.save();
                this._game.stage.context.translate(this._dx + (this._dw / 2), this._dy + (this._dh / 2));
                if(this.angle !== 0) {
                    this._game.stage.context.rotate(this.angle * (Math.PI / 180));
                }
                this._dx = -(this._dw / 2);
                this._dy = -(this._dh / 2);
                if(this.flipped == true) {
                    this._game.stage.context.scale(-1, 1);
                }
            }
            this._dx = Math.round(this._dx);
            this._dy = Math.round(this._dy);
            this._dw = Math.round(this._dw);
            this._dh = Math.round(this._dh);
            for(var i = 0; i < this.regions.length; i++) {
                if(this._dynamicTexture) {
                    this.regions[i].render(this._game.stage.context, this._dynamicTexture.canvas, this._dx, this._dy, this._dw, this._dh);
                } else {
                    this.regions[i].render(this._game.stage.context, this._texture, this._dx, this._dy, this._dw, this._dh);
                }
            }
            if(globalAlpha > -1) {
                this._game.stage.context.globalAlpha = globalAlpha;
            }
            return true;
        };
        ScrollZone.prototype.createRepeatingTexture = function (regionWidth, regionHeight) {
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
        Game.prototype.boot = function (parent, width, height) {
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
                this.loader.reset();
                this.onInitCallback.call(this.callbackContext);
                if(this.loader.queueSize == 0) {
                    if(this.onCreateCallback !== null) {
                        this.onCreateCallback.call(this.callbackContext);
                    }
                    this._loadComplete = true;
                }
            } else {
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
            if(typeof state === 'function') {
                state = new state(this);
            }
            if(state['create'] || state['update']) {
                this.callbackContext = state;
                this.onInitCallback = null;
                this.onCreateCallback = null;
                this.onUpdateCallback = null;
                this.onRenderCallback = null;
                this.onPausedCallback = null;
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
                throw new Error("Invalid State object given. Must contain at least a create or update function.");
            }
        };
        Game.prototype.destroy = function () {
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
        Game.prototype.createCamera = function (x, y, width, height) {
            return this.world.createCamera(x, y, width, height);
        };
        Game.prototype.createGeomSprite = function (x, y) {
            return this.world.createGeomSprite(x, y);
        };
        Game.prototype.createSprite = function (x, y, key) {
            if (typeof key === "undefined") { key = ''; }
            return this.world.createSprite(x, y, key);
        };
        Game.prototype.createDynamicTexture = function (width, height) {
            return this.world.createDynamicTexture(width, height);
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
        Game.prototype.createScrollZone = function (key, x, y, width, height) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            if (typeof width === "undefined") { width = 0; }
            if (typeof height === "undefined") { height = 0; }
            return this.world.createScrollZone(key, x, y, width, height);
        };
        Game.prototype.createTilemap = function (key, mapData, format, resizeWorld, tileWidth, tileHeight) {
            if (typeof resizeWorld === "undefined") { resizeWorld = true; }
            if (typeof tileWidth === "undefined") { tileWidth = 0; }
            if (typeof tileHeight === "undefined") { tileHeight = 0; }
            return this.world.createTilemap(key, mapData, format, resizeWorld, tileWidth, tileHeight);
        };
        Game.prototype.createTween = function (obj) {
            return this.tweens.create(obj);
        };
        Game.prototype.collide = function (objectOrGroup1, objectOrGroup2, notifyCallback) {
            if (typeof objectOrGroup1 === "undefined") { objectOrGroup1 = null; }
            if (typeof objectOrGroup2 === "undefined") { objectOrGroup2 = null; }
            if (typeof notifyCallback === "undefined") { notifyCallback = null; }
            return this.collision.overlap(objectOrGroup1, objectOrGroup2, notifyCallback, Phaser.Collision.separate);
        };
        return Game;
    })();
    Phaser.Game = Game;    
})(Phaser || (Phaser = {}));
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
        Animation.prototype.restart = function () {
            this.isPlaying = true;
            this.isFinished = false;
            this._timeLastFrame = this._game.time.now;
            this._timeNextFrame = this._game.time.now + this.delay;
            this._frameIndex = 0;
            this.currentFrame = this._frameData.getFrame(this._frames[this._frameIndex]);
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
        Animation.prototype.onComplete = function () {
            this.isPlaying = false;
            this.isFinished = true;
        };
        return Animation;
    })();
    Phaser.Animation = Animation;    
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    var AnimationLoader = (function () {
        function AnimationLoader() { }
        AnimationLoader.parseSpriteSheet = function parseSpriteSheet(game, key, frameWidth, frameHeight, frameMax) {
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
            if(width == 0 || height == 0 || width < frameWidth || height < frameHeight || total === 0) {
                return null;
            }
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
            var data = new Phaser.FrameData();
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
var Phaser;
(function (Phaser) {
    var Frame = (function () {
        function Frame(x, y, width, height, name) {
            this.name = '';
            this.rotated = false;
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
                if(this._frameData.getFrame(value) !== null) {
                    this.currentFrame = this._frameData.getFrame(value);
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
                if(this._frameData.getFrameByName(value) !== null) {
                    this.currentFrame = this._frameData.getFrameByName(value);
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
        State.prototype.init = function () {
        };
        State.prototype.create = function () {
        };
        State.prototype.update = function () {
        };
        State.prototype.render = function () {
        };
        State.prototype.paused = function () {
        };
        State.prototype.createCamera = function (x, y, width, height) {
            return this.game.world.createCamera(x, y, width, height);
        };
        State.prototype.createGeomSprite = function (x, y) {
            return this.world.createGeomSprite(x, y);
        };
        State.prototype.createSprite = function (x, y, key) {
            if (typeof key === "undefined") { key = ''; }
            return this.game.world.createSprite(x, y, key);
        };
        State.prototype.createDynamicTexture = function (width, height) {
            return this.game.world.createDynamicTexture(width, height);
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
        State.prototype.createScrollZone = function (key, x, y, width, height) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            if (typeof width === "undefined") { width = 0; }
            if (typeof height === "undefined") { height = 0; }
            return this.game.world.createScrollZone(key, x, y, width, height);
        };
        State.prototype.createTilemap = function (key, mapData, format, resizeWorld, tileWidth, tileHeight) {
            if (typeof resizeWorld === "undefined") { resizeWorld = true; }
            if (typeof tileWidth === "undefined") { tileWidth = 0; }
            if (typeof tileHeight === "undefined") { tileHeight = 0; }
            return this.game.world.createTilemap(key, mapData, format, resizeWorld, tileWidth, tileHeight);
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
