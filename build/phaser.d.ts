/**
* Phaser - Basic
*
* A useful "generic" object on which all GameObjects and Groups are based.
* It has no size, position or graphical data.
*/
module Phaser {
    class Basic {
        /**
        * Instantiate the basic object.
        */
        constructor(game: Game);
        /**
        * The essential reference to the main game object
        */
        public _game: Game;
        /**
        * Allows you to give this object a name. Useful for debugging, but not actually used internally.
        */
        public name: string;
        /**
        * IDs seem like they could be pretty useful, huh?
        * They're not actually used for anything yet though.
        */
        public ID: number;
        /**
        * A boolean to store if this object is a Group or not.
        * Saves us an expensive typeof check inside of core loops.
        */
        public isGroup: bool;
        /**
        * Controls whether <code>update()</code> and <code>draw()</code> are automatically called by State/Group.
        */
        public exists: bool;
        /**
        * Controls whether <code>update()</code> is automatically called by State/Group.
        */
        public active: bool;
        /**
        * Controls whether <code>draw()</code> is automatically called by State/Group.
        */
        public visible: bool;
        /**
        * Useful state for many game objects - "dead" (!alive) vs alive.
        * <code>kill()</code> and <code>revive()</code> both flip this switch (along with exists, but you can override that).
        */
        public alive: bool;
        /**
        * Setting this to true will prevent the object from appearing
        * when the visual debug mode in the debugger overlay is toggled on.
        */
        public ignoreDrawDebug: bool;
        /**
        * Override this to null out iables or manually call
        * <code>destroy()</code> on class members if necessary.
        * Don't forget to call <code>super.destroy()</code>!
        */
        public destroy(): void;
        /**
        * Pre-update is called right before <code>update()</code> on each object in the game loop.
        */
        public preUpdate(): void;
        /**
        * Override this to update your class's position and appearance.
        * This is where most of your game rules and behavioral code will go.
        */
        public update(): void;
        /**
        * Post-update is called right after <code>update()</code> on each object in the game loop.
        */
        public postUpdate(): void;
        public render(camera: Camera, cameraOffsetX: number, cameraOffsetY: number): void;
        /**
        * Handy for "killing" game objects.
        * Default behavior is to flag them as nonexistent AND dead.
        * However, if you want the "corpse" to remain in the game,
        * like to animate an effect or whatever, you should override this,
        * setting only alive to false, and leaving exists true.
        */
        public kill(): void;
        /**
        * Handy for bringing game objects "back to life". Just sets alive and exists back to true.
        * In practice, this is most often called by <code>Object.reset()</code>.
        */
        public revive(): void;
        /**
        * Convert object to readable string name.  Useful for debugging, save games, etc.
        */
        public toString(): string;
    }
}
/**
* Phaser - SignalBinding
*
* An object that represents a binding between a Signal and a listener function.
* Based on JS Signals by Miller Medeiros. Converted by TypeScript by Richard Davey.
* Released under the MIT license
* http://millermedeiros.github.com/js-signals/
*/
module Phaser {
    class SignalBinding {
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
        constructor(signal: Signal, listener, isOnce: bool, listenerContext, priority?: number);
        /**
        * Handler function bound to the signal.
        * @type Function
        * @private
        */
        private _listener;
        /**
        * If binding should be executed just once.
        * @type boolean
        * @private
        */
        private _isOnce;
        /**
        * Context on which listener will be executed (object that should represent the `this` variable inside listener function).
        * @memberOf SignalBinding.prototype
        * @name context
        * @type Object|undefined|null
        */
        public context;
        /**
        * Reference to Signal object that listener is currently bound to.
        * @type Signal
        * @private
        */
        private _signal;
        /**
        * Listener priority
        * @type Number
        */
        public priority: number;
        /**
        * If binding is active and should be executed.
        * @type boolean
        */
        public active: bool;
        /**
        * Default parameters passed to listener during `Signal.dispatch` and `SignalBinding.execute`. (curried parameters)
        * @type Array|null
        */
        public params;
        /**
        * Call listener passing arbitrary parameters.
        * <p>If binding was added using `Signal.addOnce()` it will be automatically removed from signal dispatch queue, this method is used internally for the signal dispatch.</p>
        * @param {Array} [paramsArr] Array of parameters that should be passed to the listener
        * @return {*} Value returned by the listener.
        */
        public execute(paramsArr?: any[]);
        /**
        * Detach binding from signal.
        * - alias to: mySignal.remove(myBinding.getListener());
        * @return {Function|null} Handler function bound to the signal or `null` if binding was previously detached.
        */
        public detach();
        /**
        * @return {Boolean} `true` if binding is still bound to the signal and have a listener.
        */
        public isBound(): bool;
        /**
        * @return {boolean} If SignalBinding will only be executed once.
        */
        public isOnce(): bool;
        /**
        * @return {Function} Handler function bound to the signal.
        */
        public getListener();
        /**
        * @return {Signal} Signal that listener is currently bound to.
        */
        public getSignal(): Signal;
        /**
        * Delete instance properties
        * @private
        */
        public _destroy(): void;
        /**
        * @return {string} String representation of the object.
        */
        public toString(): string;
    }
}
/**
* Phaser - Signal
*
* A Signal is used for object communication via a custom broadcaster instead of Events.
* Based on JS Signals by Miller Medeiros. Converted by TypeScript by Richard Davey.
* Released under the MIT license
* http://millermedeiros.github.com/js-signals/
*/
module Phaser {
    class Signal {
        /**
        *
        * @property _bindings
        * @type Array
        * @private
        */
        private _bindings;
        /**
        *
        * @property _prevParams
        * @type Any
        * @private
        */
        private _prevParams;
        /**
        * Signals Version Number
        * @property VERSION
        * @type String
        * @const
        */
        static VERSION: string;
        /**
        * If Signal should keep record of previously dispatched parameters and
        * automatically execute listener during `add()`/`addOnce()` if Signal was
        * already dispatched before.
        * @type boolean
        */
        public memorize: bool;
        /**
        * @type boolean
        * @private
        */
        private _shouldPropagate;
        /**
        * If Signal is active and should broadcast events.
        * <p><strong>IMPORTANT:</strong> Setting this property during a dispatch will only affect the next dispatch, if you want to stop the propagation of a signal use `halt()` instead.</p>
        * @type boolean
        */
        public active: bool;
        /**
        *
        * @method validateListener
        * @param {Any} listener
        * @param {Any} fnName
        */
        public validateListener(listener, fnName): void;
        /**
        * @param {Function} listener
        * @param {boolean} isOnce
        * @param {Object} [listenerContext]
        * @param {Number} [priority]
        * @return {SignalBinding}
        * @private
        */
        private _registerListener(listener, isOnce, listenerContext, priority);
        /**
        *
        * @method _addBinding
        * @param {SignalBinding} binding
        * @private
        */
        private _addBinding(binding);
        /**
        *
        * @method _indexOfListener
        * @param {Function} listener
        * @return {number}
        * @private
        */
        private _indexOfListener(listener, context);
        /**
        * Check if listener was attached to Signal.
        * @param {Function} listener
        * @param {Object} [context]
        * @return {boolean} if Signal has the specified listener.
        */
        public has(listener, context?: any): bool;
        /**
        * Add a listener to the signal.
        * @param {Function} listener Signal handler function.
        * @param {Object} [listenerContext] Context on which listener will be executed (object that should represent the `this` variable inside listener function).
        * @param {Number} [priority] The priority level of the event listener. Listeners with higher priority will be executed before listeners with lower priority. Listeners with same priority level will be executed at the same order as they were added. (default = 0)
        * @return {SignalBinding} An Object representing the binding between the Signal and listener.
        */
        public add(listener, listenerContext?: any, priority?: number): SignalBinding;
        /**
        * Add listener to the signal that should be removed after first execution (will be executed only once).
        * @param {Function} listener Signal handler function.
        * @param {Object} [listenerContext] Context on which listener will be executed (object that should represent the `this` variable inside listener function).
        * @param {Number} [priority] The priority level of the event listener. Listeners with higher priority will be executed before listeners with lower priority. Listeners with same priority level will be executed at the same order as they were added. (default = 0)
        * @return {SignalBinding} An Object representing the binding between the Signal and listener.
        */
        public addOnce(listener, listenerContext?: any, priority?: number): SignalBinding;
        /**
        * Remove a single listener from the dispatch queue.
        * @param {Function} listener Handler function that should be removed.
        * @param {Object} [context] Execution context (since you can add the same handler multiple times if executing in a different context).
        * @return {Function} Listener handler function.
        */
        public remove(listener, context?: any);
        /**
        * Remove all listeners from the Signal.
        */
        public removeAll(): void;
        /**
        * @return {number} Number of listeners attached to the Signal.
        */
        public getNumListeners(): number;
        /**
        * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
        * <p><strong>IMPORTANT:</strong> should be called only during signal dispatch, calling it before/after dispatch won't affect signal broadcast.</p>
        * @see Signal.prototype.disable
        */
        public halt(): void;
        /**
        * Dispatch/Broadcast Signal to all listeners added to the queue.
        * @param {...*} [params] Parameters that should be passed to each handler.
        */
        public dispatch(...paramsArr: any[]): void;
        /**
        * Forget memorized arguments.
        * @see Signal.memorize
        */
        public forget(): void;
        /**
        * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
        * <p><strong>IMPORTANT:</strong> calling any method on the signal instance after calling dispose will throw errors.</p>
        */
        public dispose(): void;
        /**
        * @return {string} String representation of the object.
        */
        public toString(): string;
    }
}
/**
* Phaser - GameObject
*
* This is the base GameObject on which all other game objects are derived. It contains all the logic required for position,
* motion, size, collision and input.
*/
module Phaser {
    class GameObject extends Basic {
        constructor(game: Game, x?: number, y?: number, width?: number, height?: number);
        private _angle;
        static ALIGN_TOP_LEFT: number;
        static ALIGN_TOP_CENTER: number;
        static ALIGN_TOP_RIGHT: number;
        static ALIGN_CENTER_LEFT: number;
        static ALIGN_CENTER: number;
        static ALIGN_CENTER_RIGHT: number;
        static ALIGN_BOTTOM_LEFT: number;
        static ALIGN_BOTTOM_CENTER: number;
        static ALIGN_BOTTOM_RIGHT: number;
        static OUT_OF_BOUNDS_STOP: number;
        static OUT_OF_BOUNDS_KILL: number;
        public _point: MicroPoint;
        public cameraBlacklist: number[];
        public bounds: Rectangle;
        public worldBounds: Quad;
        public outOfBoundsAction: number;
        public align: number;
        public facing: number;
        public alpha: number;
        public scale: MicroPoint;
        public origin: MicroPoint;
        public z: number;
        public rotationOffset: number;
        public renderRotation: bool;
        public immovable: bool;
        public velocity: MicroPoint;
        public mass: number;
        public elasticity: number;
        public acceleration: MicroPoint;
        public drag: MicroPoint;
        public maxVelocity: MicroPoint;
        public angularVelocity: number;
        public angularAcceleration: number;
        public angularDrag: number;
        public maxAngular: number;
        public scrollFactor: MicroPoint;
        public health: number;
        public moves: bool;
        public touching: number;
        public wasTouching: number;
        public allowCollisions: number;
        public last: MicroPoint;
        public inputEnabled: bool;
        private _inputOver;
        public onInputOver: Signal;
        public onInputOut: Signal;
        public onInputDown: Signal;
        public onInputUp: Signal;
        public preUpdate(): void;
        public update(): void;
        public postUpdate(): void;
        private updateInput();
        private updateMotion();
        /**
        * Checks to see if some <code>GameObject</code> overlaps this <code>GameObject</code> or <code>Group</code>.
        * If the group has a LOT of things in it, it might be faster to use <code>Collision.overlaps()</code>.
        * WARNING: Currently tilemaps do NOT support screen space overlap checks!
        *
        * @param	ObjectOrGroup	The object or group being tested.
        * @param	InScreenSpace	Whether to take scroll factors numbero account when checking for overlap.  Default is false, or "only compare in world space."
        * @param	Camera			Specify which game camera you want.  If null getScreenXY() will just grab the first global camera.
        *
        * @return	Whether or not the two objects overlap.
        */
        public overlaps(ObjectOrGroup, InScreenSpace?: bool, Camera?: Camera): bool;
        /**
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
        public overlapsAt(X: number, Y: number, ObjectOrGroup, InScreenSpace?: bool, Camera?: Camera): bool;
        /**
        * Checks to see if a point in 2D world space overlaps this <code>GameObject</code>.
        *
        * @param	Point			The point in world space you want to check.
        * @param	InScreenSpace	Whether to take scroll factors into account when checking for overlap.
        * @param	Camera			Specify which game camera you want.  If null getScreenXY() will just grab the first global camera.
        *
        * @return	Whether or not the point overlaps this object.
        */
        public overlapsPoint(point: Point, InScreenSpace?: bool, Camera?: Camera): bool;
        /**
        * Check and see if this object is currently on screen.
        *
        * @param	Camera		Specify which game camera you want. If null getScreenXY() will just grab the first global camera.
        *
        * @return	Whether the object is on screen or not.
        */
        public onScreen(Camera?: Camera): bool;
        /**
        * Call this to figure out the on-screen position of the object.
        *
        * @param	Camera		Specify which game camera you want.  If null getScreenXY() will just grab the first global camera.
        * @param	Point		Takes a <code>MicroPoint</code> object and assigns the post-scrolled X and Y values of this object to it.
        *
        * @return	The <code>MicroPoint</code> you passed in, or a new <code>Point</code> if you didn't pass one, containing the screen X and Y position of this object.
        */
        public getScreenXY(point?: MicroPoint, Camera?: Camera): MicroPoint;
        /**
        * Whether the object collides or not.  For more control over what directions
        * the object will collide from, use collision constants (like LEFT, FLOOR, etc)
        * to set the value of allowCollisions directly.
        */
        /**
        * @private
        */
        public solid : bool;
        /**
        * Retrieve the midpoint of this object in world coordinates.
        *
        * @Point	Allows you to pass in an existing <code>Point</code> object if you're so inclined.  Otherwise a new one is created.
        *
        * @return	A <code>Point</code> object containing the midpoint of this object in world coordinates.
        */
        public getMidpoint(point?: MicroPoint): MicroPoint;
        /**
        * Handy for reviving game objects.
        * Resets their existence flags and position.
        *
        * @param	X	The new X position of this object.
        * @param	Y	The new Y position of this object.
        */
        public reset(X: number, Y: number): void;
        /**
        * Handy for checking if this object is touching a particular surface.
        * For slightly better performance you can just &amp; the value directly numbero <code>touching</code>.
        * However, this method is good for readability and accessibility.
        *
        * @param	Direction	Any of the collision flags (e.g. LEFT, FLOOR, etc).
        *
        * @return	Whether the object is touching an object in (any of) the specified direction(s) this frame.
        */
        public isTouching(Direction: number): bool;
        /**
        * Handy for checking if this object is just landed on a particular surface.
        *
        * @param	Direction	Any of the collision flags (e.g. LEFT, FLOOR, etc).
        *
        * @return	Whether the object just landed on (any of) the specified surface(s) this frame.
        */
        public justTouched(Direction: number): bool;
        /**
        * Reduces the "health" variable of this sprite by the amount specified in Damage.
        * Calls kill() if health drops to or below zero.
        *
        * @param	Damage		How much health to take away (use a negative number to give a health bonus).
        */
        public hurt(Damage: number): void;
        /**
        * Set the world bounds that this GameObject can exist within. By default a GameObject can exist anywhere
        * in the world. But by setting the bounds (which are given in world dimensions, not screen dimensions)
        * it can be stopped from leaving the world, or a section of it.
        */
        public setBounds(x: number, y: number, width: number, height: number): void;
        /**
        * If you do not wish this object to be visible to a specific camera, pass the camera here.
        */
        public hideFromCamera(camera: Camera): void;
        public showToCamera(camera: Camera): void;
        public clearCameraList(): void;
        public destroy(): void;
        public x : number;
        public y : number;
        public rotation : number;
        public angle : number;
        public width : number;
        public height : number;
    }
}
/**
* Phaser - Camera
*
* A Camera is your view into the game world. It has a position, size, scale and rotation and renders only those objects
* within its field of view. The game automatically creates a single Stage sized camera on boot, but it can be changed and
* additional cameras created via the CameraManager.
*/
module Phaser {
    class Camera {
        /**
        * Instantiates a new camera at the specified location, with the specified size and zoom level.
        *
        * @param X			X location of the camera's display in pixels. Uses native, 1:1 resolution, ignores zoom.
        * @param Y			Y location of the camera's display in pixels. Uses native, 1:1 resolution, ignores zoom.
        * @param Width		The width of the camera display in pixels.
        * @param Height	The height of the camera display in pixels.
        * @param Zoom		The initial zoom level of the camera.  A zoom level of 2 will make all pixels display at 2x resolution.
        */
        constructor(game: Game, id: number, x: number, y: number, width: number, height: number);
        private _game;
        private _clip;
        private _stageX;
        private _stageY;
        private _rotation;
        private _target;
        private _sx;
        private _sy;
        static STYLE_LOCKON: number;
        static STYLE_PLATFORMER: number;
        static STYLE_TOPDOWN: number;
        static STYLE_TOPDOWN_TIGHT: number;
        public ID: number;
        public worldView: Rectangle;
        public totalSpritesRendered: number;
        public scale: MicroPoint;
        public scroll: MicroPoint;
        public bounds: Rectangle;
        public deadzone: Rectangle;
        public disableClipping: bool;
        public showBorder: bool;
        public borderColor: string;
        public opaque: bool;
        private _bgColor;
        private _bgTexture;
        private _bgTextureRepeat;
        public showShadow: bool;
        public shadowColor: string;
        public shadowBlur: number;
        public shadowOffset: MicroPoint;
        public visible: bool;
        public alpha: number;
        public inputX: number;
        public inputY: number;
        public fx: FXManager;
        public follow(target: Sprite, style?: number): void;
        public focusOnXY(x: number, y: number): void;
        public focusOn(point): void;
        /**
        * Specify the boundaries of the world or where the camera is allowed to move.
        *
        * @param	x				The smallest X value of your world (usually 0).
        * @param	y				The smallest Y value of your world (usually 0).
        * @param	width			The largest X value of your world (usually the world width).
        * @param	height			The largest Y value of your world (usually the world height).
        */
        public setBounds(x?: number, y?: number, width?: number, height?: number): void;
        public update(): void;
        public render(): void;
        public backgroundColor : string;
        public setTexture(key: string, repeat?: string): void;
        public setPosition(x: number, y: number): void;
        public setSize(width: number, height: number): void;
        public renderDebugInfo(x: number, y: number, color?: string): void;
        public x : number;
        public y : number;
        public width : number;
        public height : number;
        public rotation : number;
        private checkClip();
    }
}
/**
* Phaser - Sprite
*
* The Sprite GameObject is an extension of the core GameObject that includes support for animation and dynamic textures.
* It's probably the most used GameObject of all.
*/
module Phaser {
    class Sprite extends GameObject {
        constructor(game: Game, x?: number, y?: number, key?: string);
        private _texture;
        private _dynamicTexture;
        private _sx;
        private _sy;
        private _sw;
        private _sh;
        private _dx;
        private _dy;
        private _dw;
        private _dh;
        public animations: AnimationManager;
        public renderDebug: bool;
        public renderDebugColor: string;
        public renderDebugPointColor: string;
        public flipped: bool;
        public loadGraphic(key: string): Sprite;
        public loadDynamicTexture(texture: DynamicTexture): Sprite;
        public makeGraphic(width: number, height: number, color?: number): Sprite;
        public inCamera(camera: Rectangle): bool;
        public postUpdate(): void;
        public frame : number;
        public frameName : string;
        public render(camera: Camera, cameraOffsetX: number, cameraOffsetY: number): bool;
        private renderBounds(camera, cameraOffsetX, cameraOffsetY);
        public renderDebugInfo(x: number, y: number, color?: string): void;
    }
}
/**
* Phaser - Animation
*
* An Animation is a single animation. It is created by the AnimationManager and belongs to Sprite objects.
*/
module Phaser {
    class Animation {
        constructor(game: Game, parent: Sprite, frameData: FrameData, name: string, frames, delay: number, looped: bool);
        private _game;
        private _parent;
        private _frames;
        private _frameData;
        private _frameIndex;
        private _timeLastFrame;
        private _timeNextFrame;
        public name: string;
        public currentFrame: Frame;
        public isFinished: bool;
        public isPlaying: bool;
        public looped: bool;
        public delay: number;
        public frameTotal : number;
        public frame : number;
        public play(frameRate?: number, loop?: bool): void;
        public restart(): void;
        public stop(): void;
        public update(): bool;
        public destroy(): void;
        private onComplete();
    }
}
/**
* Phaser - AnimationLoader
*
* Responsible for parsing sprite sheet and JSON data into the internal FrameData format that Phaser uses for animations.
*/
module Phaser {
    class AnimationLoader {
        static parseSpriteSheet(game: Game, key: string, frameWidth: number, frameHeight: number, frameMax: number): FrameData;
        static parseJSONData(game: Game, json): FrameData;
    }
}
/**
* Phaser - Frame
*
* A Frame is a single frame of an animation and is part of a FrameData collection.
*/
module Phaser {
    class Frame {
        constructor(x: number, y: number, width: number, height: number, name: string);
        public x: number;
        public y: number;
        public width: number;
        public height: number;
        public index: number;
        public name: string;
        public rotated: bool;
        public rotationDirection: string;
        public trimmed: bool;
        public sourceSizeW: number;
        public sourceSizeH: number;
        public spriteSourceSizeX: number;
        public spriteSourceSizeY: number;
        public spriteSourceSizeW: number;
        public spriteSourceSizeH: number;
        public setRotation(rotated: bool, rotationDirection: string): void;
        public setTrim(trimmed: bool, actualWidth, actualHeight, destX, destY, destWidth, destHeight): void;
    }
}
/**
* Phaser - FrameData
*
* FrameData is a container for Frame objects, the internal representation of animation data in Phaser.
*/
module Phaser {
    class FrameData {
        constructor();
        private _frames;
        private _frameNames;
        public total : number;
        public addFrame(frame: Frame): Frame;
        public getFrame(index: number): Frame;
        public getFrameByName(name: string): Frame;
        public checkFrameName(name: string): bool;
        public getFrameRange(start: number, end: number, output?: Frame[]): Frame[];
        public getFrameIndexes(output?: number[]): number[];
        public getFrameIndexesByName(input: string[]): number[];
        public getAllFrames(): Frame[];
        public getFrames(range: number[]): Frame[];
    }
}
/**
* Phaser - AnimationManager
*
* Any Sprite that has animation contains an instance of the AnimationManager, which is used to add, play and update
* sprite specific animations.
*/
module Phaser {
    class AnimationManager {
        constructor(game: Game, parent: Sprite);
        private _game;
        private _parent;
        private _anims;
        private _frameIndex;
        private _frameData;
        public currentAnim: Animation;
        public currentFrame: Frame;
        public loadFrameData(frameData: FrameData): void;
        public add(name: string, frames?: any[], frameRate?: number, loop?: bool, useNumericIndex?: bool): void;
        private validateFrames(frames, useNumericIndex);
        public play(name: string, frameRate?: number, loop?: bool): void;
        public stop(name: string): void;
        public update(): void;
        public frameData : FrameData;
        public frameTotal : number;
        public frame : number;
        public frameName : string;
    }
}
/**
* Phaser - Cache
*
* A game only has one instance of a Cache and it is used to store all externally loaded assets such
* as images, sounds and data files as a result of Loader calls. Cache items use string based keys for look-up.
*/
module Phaser {
    class Cache {
        constructor(game: Game);
        private _game;
        private _canvases;
        private _images;
        private _sounds;
        private _text;
        public addCanvas(key: string, canvas: HTMLCanvasElement, context: CanvasRenderingContext2D): void;
        public addSpriteSheet(key: string, url: string, data, frameWidth: number, frameHeight: number, frameMax: number): void;
        public addTextureAtlas(key: string, url: string, data, jsonData): void;
        public addImage(key: string, url: string, data): void;
        public addSound(key: string, url: string, data): void;
        public decodedSound(key: string, data): void;
        public addText(key: string, url: string, data): void;
        public getCanvas(key: string);
        public getImage(key: string);
        public getFrameData(key: string): FrameData;
        public getSound(key: string);
        public isSoundDecoded(key: string): bool;
        public isSpriteSheet(key: string): bool;
        public getText(key: string);
        public destroy(): void;
    }
}
/**
* Phaser - CameraManager
*
* Your game only has one CameraManager instance and it's responsible for looking after, creating and destroying
* all of the cameras in the world.
*
* TODO: If the Camera is larger than the Stage size then the rotation offset isn't correct
* TODO: Texture Repeat doesn't scroll, because it's part of the camera not the world, need to think about this more
*/
module Phaser {
    class CameraManager {
        constructor(game: Game, x: number, y: number, width: number, height: number);
        private _game;
        private _cameras;
        private _cameraInstance;
        public current: Camera;
        public getAll(): Camera[];
        public update(): void;
        public render(): void;
        public addCamera(x: number, y: number, width: number, height: number): Camera;
        public removeCamera(id: number): bool;
        public destroy(): void;
    }
}
/**
* Phaser - Point
*
* The Point object represents a location in a two-dimensional coordinate system, where x represents the horizontal axis and y represents the vertical axis.
*/
module Phaser {
    class Point {
        /**
        * Creates a new point. If you pass no parameters to this method, a point is created at (0,0).
        * @class Point
        * @constructor
        * @param {Number} x The horizontal position of this point (default 0)
        * @param {Number} y The vertical position of this point (default 0)
        **/
        constructor(x?: number, y?: number);
        /**
        * The horizontal position of this point (default 0)
        * @property x
        * @type Number
        **/
        public x: number;
        /**
        * The vertical position of this point (default 0)
        * @property y
        * @type Number
        **/
        public y: number;
        /**
        * Adds the coordinates of another point to the coordinates of this point to create a new point.
        * @method add
        * @param {Point} point - The point to be added.
        * @return {Point} The new Point object.
        **/
        public add(toAdd: Point, output?: Point): Point;
        /**
        * Adds the given values to the coordinates of this point and returns it
        * @method addTo
        * @param {Number} x - The amount to add to the x value of the point
        * @param {Number} y - The amount to add to the x value of the point
        * @return {Point} This Point object.
        **/
        public addTo(x?: number, y?: number): Point;
        /**
        * Adds the given values to the coordinates of this point and returns it
        * @method addTo
        * @param {Number} x - The amount to add to the x value of the point
        * @param {Number} y - The amount to add to the x value of the point
        * @return {Point} This Point object.
        **/
        public subtractFrom(x?: number, y?: number): Point;
        /**
        * Inverts the x and y values of this point
        * @method invert
        * @return {Point} This Point object.
        **/
        public invert(): Point;
        /**
        * Clamps this Point object to be between the given min and max
        * @method clamp
        * @param {number} The minimum value to clamp this Point to
        * @param {number} The maximum value to clamp this Point to
        * @return {Point} This Point object.
        **/
        public clamp(min: number, max: number): Point;
        /**
        * Clamps the x value of this Point object to be between the given min and max
        * @method clampX
        * @param {number} The minimum value to clamp this Point to
        * @param {number} The maximum value to clamp this Point to
        * @return {Point} This Point object.
        **/
        public clampX(min: number, max: number): Point;
        /**
        * Clamps the y value of this Point object to be between the given min and max
        * @method clampY
        * @param {number} The minimum value to clamp this Point to
        * @param {number} The maximum value to clamp this Point to
        * @return {Point} This Point object.
        **/
        public clampY(min: number, max: number): Point;
        /**
        * Creates a copy of this Point.
        * @method clone
        * @param {Point} output Optional Point object. If given the values will be set into this object, otherwise a brand new Point object will be created and returned.
        * @return {Point} The new Point object.
        **/
        public clone(output?: Point): Point;
        /**
        * Copies the point data from the source Point object into this Point object.
        * @method copyFrom
        * @param {Point} source - The point to copy from.
        * @return {Point} This Point object. Useful for chaining method calls.
        **/
        public copyFrom(source: Point): Point;
        /**
        * Copies the point data from this Point object to the given target Point object.
        * @method copyTo
        * @param {Point} target - The point to copy to.
        * @return {Point} The target Point object.
        **/
        public copyTo(target: Point): Point;
        /**
        * Returns the distance from this Point object to the given Point object.
        * @method distanceFrom
        * @param {Point} target - The destination Point object.
        * @param {Boolean} round - Round the distance to the nearest integer (default false)
        * @return {Number} The distance between this Point object and the destination Point object.
        **/
        public distanceTo(target: Point, round?: bool): number;
        /**
        * Returns the distance between the two Point objects.
        * @method distanceBetween
        * @param {Point} pointA - The first Point object.
        * @param {Point} pointB - The second Point object.
        * @param {Boolean} round - Round the distance to the nearest integer (default false)
        * @return {Number} The distance between the two Point objects.
        **/
        static distanceBetween(pointA: Point, pointB: Point, round?: bool): number;
        /**
        * Returns true if the distance between this point and a target point is greater than or equal a specified distance.
        * This avoids using a costly square root operation
        * @method distanceCompare
        * @param {Point} target - The Point object to use for comparison.
        * @param {Number} distance - The distance to use for comparison.
        * @return {Boolena} True if distance is >= specified distance.
        **/
        public distanceCompare(target: Point, distance: number): bool;
        /**
        * Determines whether this Point object and the given point object are equal. They are equal if they have the same x and y values.
        * @method equals
        * @param {Point} point - The point to compare against.
        * @return {Boolean} A value of true if the object is equal to this Point object; false if it is not equal.
        **/
        public equals(toCompare: Point): bool;
        /**
        * Determines a point between two specified points. The parameter f determines where the new interpolated point is located relative to the two end points specified by parameters pt1 and pt2.
        * The closer the value of the parameter f is to 1.0, the closer the interpolated point is to the first point (parameter pt1). The closer the value of the parameter f is to 0, the closer the interpolated point is to the second point (parameter pt2).
        * @method interpolate
        * @param {Point} pointA - The first Point object.
        * @param {Point} pointB - The second Point object.
        * @param {Number} f - The level of interpolation between the two points. Indicates where the new point will be, along the line between pt1 and pt2. If f=1, pt1 is returned; if f=0, pt2 is returned.
        * @return {Point} The new interpolated Point object.
        **/
        public interpolate(pointA, pointB, f): void;
        /**
        * Offsets the Point object by the specified amount. The value of dx is added to the original value of x to create the new x value.
        * The value of dy is added to the original value of y to create the new y value.
        * @method offset
        * @param {Number} dx - The amount by which to offset the horizontal coordinate, x.
        * @param {Number} dy - The amount by which to offset the vertical coordinate, y.
        * @return {Point} This Point object. Useful for chaining method calls.
        **/
        public offset(dx: number, dy: number): Point;
        /**
        * Converts a pair of polar coordinates to a Cartesian point coordinate.
        * @method polar
        * @param {Number} length - The length coordinate of the polar pair.
        * @param {Number} angle - The angle, in radians, of the polar pair.
        * @return {Point} The new Cartesian Point object.
        **/
        public polar(length, angle): void;
        /**
        * Sets the x and y values of this Point object to the given coordinates.
        * @method setTo
        * @param {Number} x - The horizontal position of this point.
        * @param {Number} y - The vertical position of this point.
        * @return {Point} This Point object. Useful for chaining method calls.
        **/
        public setTo(x: number, y: number): Point;
        /**
        * Subtracts the coordinates of another point from the coordinates of this point to create a new point.
        * @method subtract
        * @param {Point} point - The point to be subtracted.
        * @param {Point} output Optional Point object. If given the values will be set into this object, otherwise a brand new Point object will be created and returned.
        * @return {Point} The new Point object.
        **/
        public subtract(point: Point, output?: Point): Point;
        /**
        * Returns a string representation of this object.
        * @method toString
        * @return {string} a string representation of the instance.
        **/
        public toString(): string;
    }
}
/**
* Phaser - MicroPoint
*
* The MicroPoint object represents a location in a two-dimensional coordinate system,
* where x represents the horizontal axis and y represents the vertical axis.
* It is different to the Point class in that it doesn't contain any of the help methods like add/substract/distanceTo, etc.
* Use a MicroPoint when all you literally need is a solid container for x and y (such as in the Rectangle class).
*/
module Phaser {
    class MicroPoint {
        /**
        * Creates a new point. If you pass no parameters to this method, a point is created at (0,0).
        * @class MicroPoint
        * @constructor
        * @param {Number} x The horizontal position of this point (default 0)
        * @param {Number} y The vertical position of this point (default 0)
        **/
        constructor(x?: number, y?: number, parent?: any);
        private _x;
        private _y;
        public parent: any;
        /**
        * The x coordinate of the top-left corner of the rectangle
        * @property x
        * @type Number
        **/
        /**
        * The x coordinate of the top-left corner of the rectangle
        * @property x
        * @type Number
        **/
        public x : number;
        /**
        * The y coordinate of the top-left corner of the rectangle
        * @property y
        * @type Number
        **/
        /**
        * The y coordinate of the top-left corner of the rectangle
        * @property y
        * @type Number
        **/
        public y : number;
        /**
        * Copies the x and y values from any given object to this MicroPoint.
        * @method copyFrom
        * @param {any} source - The object to copy from.
        * @return {MicroPoint} This MicroPoint object. Useful for chaining method calls.
        **/
        public copyFrom(source: any): MicroPoint;
        /**
        * Copies the x and y values from this MicroPoint to any given object.
        * @method copyTo
        * @param {any} target - The object to copy to.
        * @return {any} The target object.
        **/
        public copyTo(target: any): MicroPoint;
        /**
        * Sets the x and y values of this MicroPoint object to the given coordinates.
        * @method setTo
        * @param {Number} x - The horizontal position of this point.
        * @param {Number} y - The vertical position of this point.
        * @return {MicroPoint} This MicroPoint object. Useful for chaining method calls.
        **/
        public setTo(x: number, y: number, callParent?: bool): MicroPoint;
        /**
        * Determines whether this MicroPoint object and the given object are equal. They are equal if they have the same x and y values.
        * @method equals
        * @param {any} point - The object to compare against. Must have x and y properties.
        * @return {Boolean} A value of true if the object is equal to this MicroPoin object; false if it is not equal.
        **/
        public equals(toCompare): bool;
        /**
        * Returns a string representation of this object.
        * @method toString
        * @return {string} a string representation of the instance.
        **/
        public toString(): string;
    }
}
/**
* Phaser - Rectangle
*
* A Rectangle object is an area defined by its position, as indicated by its top-left corner (x,y) and width and height.
*/
module Phaser {
    class Rectangle {
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
        constructor(x?: number, y?: number, width?: number, height?: number);
        private _tempX;
        private _tempY;
        private _tempWidth;
        private _tempHeight;
        /**
        * The x coordinate of the top-left corner of the rectangle
        * @property x
        * @type Number
        **/
        /**
        * The x coordinate of the top-left corner of the rectangle
        * @property x
        * @type Number
        **/
        public x : number;
        /**
        * The y coordinate of the top-left corner of the rectangle
        * @property y
        * @type Number
        **/
        /**
        * The y coordinate of the top-left corner of the rectangle
        * @property y
        * @type Number
        **/
        public y : number;
        /**
        * The x and y coordinate of the top-left corner of the rectangle (same as x/y)
        * @property topLeft
        * @type MicroPoint
        **/
        public topLeft: MicroPoint;
        /**
        * The x and y coordinate of the top-center of the rectangle
        * @property topCenter
        * @type MicroPoint
        **/
        public topCenter: MicroPoint;
        /**
        * The x and y coordinate of the top-right corner of the rectangle
        * @property topRight
        * @type MicroPoint
        **/
        public topRight: MicroPoint;
        /**
        * The x and y coordinate of the left-center of the rectangle
        * @property leftCenter
        * @type MicroPoint
        **/
        public leftCenter: MicroPoint;
        /**
        * The x and y coordinate of the center of the rectangle
        * @property center
        * @type MicroPoint
        **/
        public center: MicroPoint;
        /**
        * The x and y coordinate of the right-center of the rectangle
        * @property rightCenter
        * @type MicroPoint
        **/
        public rightCenter: MicroPoint;
        /**
        * The x and y coordinate of the bottom-left corner of the rectangle
        * @property bottomLeft
        * @type MicroPoint
        **/
        public bottomLeft: MicroPoint;
        /**
        * The x and y coordinate of the bottom-center of the rectangle
        * @property bottomCenter
        * @type MicroPoint
        **/
        public bottomCenter: MicroPoint;
        /**
        * The x and y coordinate of the bottom-right corner of the rectangle
        * @property bottomRight
        * @type MicroPoint
        **/
        public bottomRight: MicroPoint;
        /**
        * The width of the rectangle
        * @property width
        * @type Number
        **/
        private _width;
        /**
        * The height of the rectangle
        * @property height
        * @type Number
        **/
        private _height;
        /**
        * Half of the width of the rectangle
        * @property halfWidth
        * @type Number
        **/
        private _halfWidth;
        /**
        * Half of the height of the rectangle
        * @property halfHeight
        * @type Number
        **/
        private _halfHeight;
        /**
        * The size of the longest side (width or height)
        * @property length
        * @type Number
        **/
        public length: number;
        /**
        * Updates all of the MicroPoints based on the values of width and height.
        * You should not normally call this directly.
        **/
        public updateBounds(): void;
        /**
        * The width of the rectangle
        * @property width
        * @type Number
        **/
        /**
        * The width of the rectangle
        * @property width
        * @type Number
        **/
        public width : number;
        /**
        * The height of the rectangle
        * @property height
        * @type Number
        **/
        /**
        * The height of the rectangle
        * @property height
        * @type Number
        **/
        public height : number;
        /**
        * Half of the width of the rectangle
        * @property halfWidth
        * @type Number
        **/
        public halfWidth : number;
        /**
        * Half of the height of the rectangle
        * @property halfHeight
        * @type Number
        **/
        public halfHeight : number;
        /**
        * The sum of the y and height properties.
        * Changing the bottom property of a Rectangle object has no effect on the x, y and width properties, but does change the height property.
        * @method bottom
        * @return {Number}
        **/
        /**
        * The sum of the y and height properties.
        * Changing the bottom property of a Rectangle object has no effect on the x, y and width properties, but does change the height property.
        * @method bottom
        * @param {Number} value
        **/
        public bottom : number;
        /**
        * The x coordinate of the top-left corner of the rectangle.
        * Changing the left property of a Rectangle object has no effect on the y and height properties.
        * However it does affect the width property, whereas changing the x value does not affect the width property.
        * @method left
        * @ return {number}
        **/
        /**
        * The x coordinate of the top-left corner of the rectangle.
        * Changing the left property of a Rectangle object has no effect on the y and height properties.
        * However it does affect the width property, whereas changing the x value does not affect the width property.
        * @method left
        * @param {Number} value
        **/
        public left : number;
        /**
        * The sum of the x and width properties.
        * Changing the right property of a Rectangle object has no effect on the x, y and height properties.
        * However it does affect the width property.
        * @method right
        * @return {Number}
        **/
        /**
        * The sum of the x and width properties.
        * Changing the right property of a Rectangle object has no effect on the x, y and height properties.
        * However it does affect the width property.
        * @method right
        * @param {Number} value
        **/
        public right : number;
        /**
        * The size of the Rectangle object, expressed as a Point object with the values of the width and height properties.
        * @method size
        * @param {Point} output Optional Point object. If given the values will be set into the object, otherwise a brand new Point object will be created and returned.
        * @return {Point} The size of the Rectangle object
        **/
        public size(output?: Point): Point;
        /**
        * The volume of the Rectangle object in pixels, derived from width * height
        * @method volume
        * @return {Number}
        **/
        public volume : number;
        /**
        * The perimeter size of the Rectangle object in pixels. This is the sum of all 4 sides.
        * @method perimeter
        * @return {Number}
        **/
        public perimeter : number;
        /**
        * The y coordinate of the top-left corner of the rectangle.
        * Changing the top property of a Rectangle object has no effect on the x and width properties.
        * However it does affect the height property, whereas changing the y value does not affect the height property.
        * @method top
        * @return {Number}
        **/
        /**
        * The y coordinate of the top-left corner of the rectangle.
        * Changing the top property of a Rectangle object has no effect on the x and width properties.
        * However it does affect the height property, whereas changing the y value does not affect the height property.
        * @method top
        * @param {Number} value
        **/
        public top : number;
        /**
        * Returns a new Rectangle object with the same values for the x, y, width, and height properties as the original Rectangle object.
        * @method clone
        * @param {Rectangle} output Optional Rectangle object. If given the values will be set into the object, otherwise a brand new Rectangle object will be created and returned.
        * @return {Rectangle}
        **/
        public clone(output?: Rectangle): Rectangle;
        /**
        * Determines whether the specified coordinates are contained within the region defined by this Rectangle object.
        * @method contains
        * @param {Number} x The x coordinate of the point to test.
        * @param {Number} y The y coordinate of the point to test.
        * @return {Boolean} A value of true if the Rectangle object contains the specified point; otherwise false.
        **/
        public contains(x: number, y: number): bool;
        /**
        * Determines whether the specified point is contained within the rectangular region defined by this Rectangle object.
        * This method is similar to the Rectangle.contains() method, except that it takes a Point object as a parameter.
        * @method containsPoint
        * @param {Point} point The point object being checked. Can be Point or any object with .x and .y values.
        * @return {Boolean} A value of true if the Rectangle object contains the specified point; otherwise false.
        **/
        public containsPoint(point: any): bool;
        /**
        * Determines whether the Rectangle object specified by the rect parameter is contained within this Rectangle object.
        * A Rectangle object is said to contain another if the second Rectangle object falls entirely within the boundaries of the first.
        * @method containsRect
        * @param {Rectangle} rect The rectangle object being checked.
        * @return {Boolean} A value of true if the Rectangle object contains the specified point; otherwise false.
        **/
        public containsRect(rect: Rectangle): bool;
        /**
        * Copies all of rectangle data from the source Rectangle object into the calling Rectangle object.
        * @method copyFrom
        * @param {Rectangle} rect The source rectangle object to copy from
        * @return {Rectangle} This rectangle object
        **/
        public copyFrom(source: Rectangle): Rectangle;
        /**
        * Copies all the rectangle data from this Rectangle object into the destination Rectangle object.
        * @method copyTo
        * @param {Rectangle} rect The destination rectangle object to copy in to
        * @return {Rectangle} The destination rectangle object
        **/
        public copyTo(target: Rectangle): Rectangle;
        /**
        * Determines whether the object specified in the toCompare parameter is equal to this Rectangle object.
        * This method compares the x, y, width, and height properties of an object against the same properties of this Rectangle object.
        * @method equals
        * @param {Rectangle} toCompare The rectangle to compare to this Rectangle object.
        * @return {Boolean} A value of true if the object has exactly the same values for the x, y, width, and height properties as this Rectangle object; otherwise false.
        **/
        public equals(toCompare: Rectangle): bool;
        /**
        * Increases the size of the Rectangle object by the specified amounts.
        * The center point of the Rectangle object stays the same, and its size increases to the left and right by the dx value,
        * and to the top and the bottom by the dy value.
        * @method inflate
        * @param {Number} dx The amount to be added to the left side of this Rectangle.
        * @param {Number} dy The amount to be added to the bottom side of this Rectangle.
        * @return {Rectangle} This Rectangle object.
        **/
        public inflate(dx: number, dy: number): Rectangle;
        /**
        * Increases the size of the Rectangle object.
        * This method is similar to the Rectangle.inflate() method except it takes a Point object as a parameter.
        * @method inflatePoint
        * @param {Point} point The x property of this Point object is used to increase the horizontal dimension of the Rectangle object. The y property is used to increase the vertical dimension of the Rectangle object.
        * @return {Rectangle} This Rectangle object.
        **/
        public inflatePoint(point: Point): Rectangle;
        /**
        * If the Rectangle object specified in the toIntersect parameter intersects with this Rectangle object,
        * returns the area of intersection as a Rectangle object. If the rectangles do not intersect, this method
        * returns an empty Rectangle object with its properties set to 0.
        * @method intersection
        * @param {Rectangle} toIntersect The Rectangle object to compare against to see if it intersects with this Rectangle object.
        * @param {Rectangle} output Optional Rectangle object. If given the intersection values will be set into this object, otherwise a brand new Rectangle object will be created and returned.
        * @return {Rectangle} A Rectangle object that equals the area of intersection. If the rectangles do not intersect, this method returns an empty Rectangle object; that is, a rectangle with its x, y, width, and height properties set to 0.
        **/
        public intersection(toIntersect: Rectangle, output?: Rectangle): Rectangle;
        /**
        * Determines whether the object specified intersects (overlaps) with this Rectangle object.
        * This method checks the x, y, width, and height properties of the specified Rectangle object to see if it intersects with this Rectangle object.
        * @method intersects
        * @param {Rectangle} r2 The Rectangle object to compare against to see if it intersects with this Rectangle object.
        * @param {Number} t A tolerance value to allow for an intersection test with padding, default to 0
        * @return {Boolean} A value of true if the specified object intersects with this Rectangle object; otherwise false.
        **/
        public intersects(r2: Rectangle, t?: number): bool;
        /**
        * Determines whether or not this Rectangle object is empty.
        * @method isEmpty
        * @return {Boolean} A value of true if the Rectangle object's width or height is less than or equal to 0; otherwise false.
        **/
        public isEmpty : bool;
        /**
        * Adjusts the location of the Rectangle object, as determined by its top-left corner, by the specified amounts.
        * @method offset
        * @param {Number} dx Moves the x value of the Rectangle object by this amount.
        * @param {Number} dy Moves the y value of the Rectangle object by this amount.
        * @return {Rectangle} This Rectangle object.
        **/
        public offset(dx: number, dy: number): Rectangle;
        /**
        * Adjusts the location of the Rectangle object using a Point object as a parameter. This method is similar to the Rectangle.offset() method, except that it takes a Point object as a parameter.
        * @method offsetPoint
        * @param {Point} point A Point object to use to offset this Rectangle object.
        * @return {Rectangle} This Rectangle object.
        **/
        public offsetPoint(point: Point): Rectangle;
        /**
        * Sets all of the Rectangle object's properties to 0. A Rectangle object is empty if its width or height is less than or equal to 0.
        * @method setEmpty
        * @return {Rectangle} This rectangle object
        **/
        public setEmpty(): Rectangle;
        /**
        * Sets the members of Rectangle to the specified values.
        * @method setTo
        * @param {Number} x The x coordinate of the top-left corner of the rectangle.
        * @param {Number} y The y coordinate of the top-left corner of the rectangle.
        * @param {Number} width The width of the rectangle in pixels.
        * @param {Number} height The height of the rectangle in pixels.
        * @return {Rectangle} This rectangle object
        **/
        public setTo(x: number, y: number, width: number, height: number): Rectangle;
        /**
        * Adds two rectangles together to create a new Rectangle object, by filling in the horizontal and vertical space between the two rectangles.
        * @method union
        * @param {Rectangle} toUnion A Rectangle object to add to this Rectangle object.
        * @param {Rectangle} output Optional Rectangle object. If given the new values will be set into this object, otherwise a brand new Rectangle object will be created and returned.
        * @return {Rectangle} A Rectangle object that is the union of the two rectangles.
        **/
        public union(toUnion: Rectangle, output?: Rectangle): Rectangle;
        /**
        * Returns a string representation of this object.
        * @method toString
        * @return {string} a string representation of the instance.
        **/
        public toString(): string;
    }
}
/**
* Phaser - Quad
*
* A Quad object is an area defined by its position, as indicated by its top-left corner (x,y) and width and height.
* Very much like a Rectangle only without all of the additional methods and properties of that class.
*/
module Phaser {
    class Quad {
        /**
        * Creates a new Quad object with the top-left corner specified by the x and y parameters and with the specified width and height parameters. If you call this function without parameters, a rectangle with x, y, width, and height properties set to 0 is created.
        * @class Quad
        * @constructor
        * @param {Number} x The x coordinate of the top-left corner of the quad.
        * @param {Number} y The y coordinate of the top-left corner of the quad.
        * @param {Number} width The width of the quad.
        * @param {Number} height The height of the quad.
        * @return {Quad } This object
        **/
        constructor(x?: number, y?: number, width?: number, height?: number);
        public x: number;
        public y: number;
        public width: number;
        public height: number;
        /**
        * Sets the Quad to the specified size.
        * @method setTo
        * @param {Number} x The x coordinate of the top-left corner of the quad.
        * @param {Number} y The y coordinate of the top-left corner of the quad.
        * @param {Number} width The width of the quad.
        * @param {Number} height The height of the quad.
        * @return {Quad} This object
        **/
        public setTo(x: number, y: number, width: number, height: number): Quad;
        public left : number;
        public right : number;
        public top : number;
        public bottom : number;
        public halfWidth : number;
        public halfHeight : number;
        /**
        * Determines whether the object specified intersects (overlaps) with this Quad object.
        * This method checks the x, y, width, and height properties of the specified Quad object to see if it intersects with this Quad object.
        * @method intersects
        * @param {Object} q The object to check for intersection with this Quad. Must have left/right/top/bottom properties (Rectangle, Quad).
        * @param {Number} t A tolerance value to allow for an intersection test with padding, default to 0
        * @return {Boolean} A value of true if the specified object intersects with this Quad; otherwise false.
        **/
        public intersects(q, t?: number): bool;
        /**
        * Returns a string representation of this object.
        * @method toString
        * @return {string} a string representation of the object.
        **/
        public toString(): string;
    }
}
/**
* Phaser - Circle
*
* A Circle object is an area defined by its position, as indicated by its center point (x,y) and diameter.
*/
module Phaser {
    class Circle {
        /**
        * Creates a new Circle object with the center coordinate specified by the x and y parameters and the diameter specified by the diameter parameter. If you call this function without parameters, a circle with x, y, diameter and radius properties set to 0 is created.
        * @class Circle
        * @constructor
        * @param {Number} x The x coordinate of the center of the circle.
        * @param {Number} y The y coordinate of the center of the circle.
        * @return {Circle} This circle object
        **/
        constructor(x?: number, y?: number, diameter?: number);
        private _diameter;
        private _radius;
        /**
        * The x coordinate of the center of the circle
        * @property x
        * @type Number
        **/
        public x: number;
        /**
        * The y coordinate of the center of the circle
        * @property y
        * @type Number
        **/
        public y: number;
        /**
        * The diameter of the circle. The largest distance between any two points on the circle. The same as the radius * 2.
        * @method diameter
        * @return {Number}
        **/
        /**
        * The diameter of the circle. The largest distance between any two points on the circle. The same as the radius * 2.
        * @method diameter
        * @param {Number} The diameter of the circle.
        **/
        public diameter : number;
        /**
        * The radius of the circle. The length of a line extending from the center of the circle to any point on the circle itself. The same as half the diameter.
        * @method radius
        * @return {Number}
        **/
        /**
        * The radius of the circle. The length of a line extending from the center of the circle to any point on the circle itself. The same as half the diameter.
        * @method radius
        * @param {Number} The radius of the circle.
        **/
        public radius : number;
        /**
        * The circumference of the circle.
        * @method circumference
        * @return {Number}
        **/
        public circumference(): number;
        /**
        * The sum of the y and radius properties. Changing the bottom property of a Circle object has no effect on the x and y properties, but does change the diameter.
        * @method bottom
        * @return {Number}
        **/
        /**
        * The sum of the y and radius properties. Changing the bottom property of a Circle object has no effect on the x and y properties, but does change the diameter.
        * @method bottom
        * @param {Number} The value to adjust the height of the circle by.
        **/
        public bottom : number;
        /**
        * The x coordinate of the leftmost point of the circle. Changing the left property of a Circle object has no effect on the x and y properties. However it does affect the diameter, whereas changing the x value does not affect the diameter property.
        * @method left
        * @return {Number} The x coordinate of the leftmost point of the circle.
        **/
        /**
        * The x coordinate of the leftmost point of the circle. Changing the left property of a Circle object has no effect on the x and y properties. However it does affect the diameter, whereas changing the x value does not affect the diameter property.
        * @method left
        * @param {Number} The value to adjust the position of the leftmost point of the circle by.
        **/
        public left : number;
        /**
        * The x coordinate of the rightmost point of the circle. Changing the right property of a Circle object has no effect on the x and y properties. However it does affect the diameter, whereas changing the x value does not affect the diameter property.
        * @method right
        * @return {Number}
        **/
        /**
        * The x coordinate of the rightmost point of the circle. Changing the right property of a Circle object has no effect on the x and y properties. However it does affect the diameter, whereas changing the x value does not affect the diameter property.
        * @method right
        * @param {Number} The amount to adjust the diameter of the circle by.
        **/
        public right : number;
        /**
        * The sum of the y minus the radius property. Changing the top property of a Circle object has no effect on the x and y properties, but does change the diameter.
        * @method bottom
        * @return {Number}
        **/
        /**
        * The sum of the y minus the radius property. Changing the top property of a Circle object has no effect on the x and y properties, but does change the diameter.
        * @method bottom
        * @param {Number} The amount to adjust the height of the circle by.
        **/
        public top : number;
        /**
        * Gets the area of this Circle.
        * @method area
        * @return {Number} This area of this circle.
        **/
        public area : number;
        /**
        * Determines whether or not this Circle object is empty.
        * @method isEmpty
        * @return {Boolean} A value of true if the Circle objects diameter is less than or equal to 0; otherwise false.
        **/
        public isEmpty : bool;
        /**
        * Whether the circle intersects with a line. Checks against infinite line defined by the two points on the line, not the line segment.
        * If you need details about the intersection then use Collision.lineToCircle instead.
        * @method intersectCircleLine
        * @param {Object} the line object to check.
        * @return {Boolean}
        **/
        public intersectCircleLine(line: Line): bool;
        /**
        * Returns a new Circle object with the same values for the x, y, width, and height properties as the original Circle object.
        * @method clone
        * @param {Circle} output Optional Circle object. If given the values will be set into the object, otherwise a brand new Circle object will be created and returned.
        * @return {Phaser.Circle}
        **/
        public clone(output?: Circle): Circle;
        /**
        * Return true if the given x/y coordinates are within this Circle object.
        * If you need details about the intersection then use Phaser.Intersect.circleContainsPoint instead.
        * @method contains
        * @param {Number} The X value of the coordinate to test.
        * @param {Number} The Y value of the coordinate to test.
        * @return {Boolean} True if the coordinates are within this circle, otherwise false.
        **/
        public contains(x: number, y: number): bool;
        /**
        * Return true if the coordinates of the given Point object are within this Circle object.
        * If you need details about the intersection then use Phaser.Intersect.circleContainsPoint instead.
        * @method containsPoint
        * @param {Phaser.Point} The Point object to test.
        * @return {Boolean} True if the coordinates are within this circle, otherwise false.
        **/
        public containsPoint(point: Point): bool;
        /**
        * Return true if the given Circle is contained entirely within this Circle object.
        * If you need details about the intersection then use Phaser.Intersect.circleToCircle instead.
        * @method containsCircle
        * @param {Phaser.Circle} The Circle object to test.
        * @return {Boolean} True if the coordinates are within this circle, otherwise false.
        **/
        public containsCircle(circle: Circle): bool;
        /**
        * Copies all of circle data from the source Circle object into the calling Circle object.
        * @method copyFrom
        * @param {Circle} rect The source circle object to copy from
        * @return {Circle} This circle object
        **/
        public copyFrom(source: Circle): Circle;
        /**
        * Copies all of circle data from this Circle object into the destination Circle object.
        * @method copyTo
        * @param {Circle} circle The destination circle object to copy in to
        * @return {Circle} The destination circle object
        **/
        public copyTo(target: Circle): Circle;
        /**
        * Returns the distance from the center of this Circle object to the given object (can be Circle, Point or anything with x/y values)
        * @method distanceFrom
        * @param {Circle/Point} target - The destination Point object.
        * @param {Boolean} round - Round the distance to the nearest integer (default false)
        * @return {Number} The distance between this Point object and the destination Point object.
        **/
        public distanceTo(target: any, round?: bool): number;
        /**
        * Determines whether the object specified in the toCompare parameter is equal to this Circle object. This method compares the x, y and diameter properties of an object against the same properties of this Circle object.
        * @method equals
        * @param {Circle} toCompare The circle to compare to this Circle object.
        * @return {Boolean} A value of true if the object has exactly the same values for the x, y and diameter properties as this Circle object; otherwise false.
        **/
        public equals(toCompare: Circle): bool;
        /**
        * Determines whether the Circle object specified in the toIntersect parameter intersects with this Circle object. This method checks the radius distances between the two Circle objects to see if they intersect.
        * @method intersects
        * @param {Circle} toIntersect The Circle object to compare against to see if it intersects with this Circle object.
        * @return {Boolean} A value of true if the specified object intersects with this Circle object; otherwise false.
        **/
        public intersects(toIntersect: Circle): bool;
        /**
        * Returns a Point object containing the coordinates of a point on the circumference of this Circle based on the given angle.
        * @method circumferencePoint
        * @param {Number} The angle in radians (unless asDegrees is true) to return the point from.
        * @param {Boolean} Is the given angle in radians (false) or degrees (true)?
        * @param {Phaser.Point} An optional Point object to put the result in to. If none specified a new Point object will be created.
        * @return {Phaser.Point} The Point object holding the result.
        **/
        public circumferencePoint(angle: number, asDegrees?: bool, output?: Point): Point;
        /**
        * Adjusts the location of the Circle object, as determined by its center coordinate, by the specified amounts.
        * @method offset
        * @param {Number} dx Moves the x value of the Circle object by this amount.
        * @param {Number} dy Moves the y value of the Circle object by this amount.
        * @return {Circle} This Circle object.
        **/
        public offset(dx: number, dy: number): Circle;
        /**
        * Adjusts the location of the Circle object using a Point object as a parameter. This method is similar to the Circle.offset() method, except that it takes a Point object as a parameter.
        * @method offsetPoint
        * @param {Point} point A Point object to use to offset this Circle object.
        * @return {Circle} This Circle object.
        **/
        public offsetPoint(point: Point): Circle;
        /**
        * Sets the members of Circle to the specified values.
        * @method setTo
        * @param {Number} x The x coordinate of the center of the circle.
        * @param {Number} y The y coordinate of the center of the circle.
        * @param {Number} diameter The diameter of the circle in pixels.
        * @return {Circle} This circle object
        **/
        public setTo(x: number, y: number, diameter: number): Circle;
        /**
        * Returns a string representation of this object.
        * @method toString
        * @return {string} a string representation of the instance.
        **/
        public toString(): string;
    }
}
/**
* Phaser - Line
*
* A Line object is an infinte line through space. The two sets of x/y coordinates define the Line Segment.
*/
module Phaser {
    class Line {
        /**
        *
        * @constructor
        * @param {Number} x1
        * @param {Number} y1
        * @param {Number} x2
        * @param {Number} y2
        * @return {Phaser.Line} This Object
        */
        constructor(x1?: number, y1?: number, x2?: number, y2?: number);
        /**
        *
        * @property x1
        * @type Number
        */
        public x1: number;
        /**
        *
        * @property y1
        * @type Number
        */
        public y1: number;
        /**
        *
        * @property x2
        * @type Number
        */
        public x2: number;
        /**
        *
        * @property y2
        * @type Number
        */
        public y2: number;
        /**
        *
        * @method clone
        * @param {Phaser.Line} [output]
        * @return {Phaser.Line}
        */
        public clone(output?: Line): Line;
        /**
        *
        * @method copyFrom
        * @param {Phaser.Line} source
        * @return {Phaser.Line}
        */
        public copyFrom(source: Line): Line;
        /**
        *
        * @method copyTo
        * @param {Phaser.Line} target
        * @return {Phaser.Line}
        */
        public copyTo(target: Line): Line;
        /**
        *
        * @method setTo
        * @param {Number} x1
        * @param {Number} y1
        * @param {Number} x2
        * @param {Number} y2
        * @return {Phaser.Line}
        */
        public setTo(x1?: number, y1?: number, x2?: number, y2?: number): Line;
        public width : number;
        public height : number;
        /**
        *
        * @method length
        * @return {Number}
        */
        public length : number;
        /**
        *
        * @method getY
        * @param {Number} x
        * @return {Number}
        */
        public getY(x: number): number;
        /**
        *
        * @method angle
        * @return {Number}
        */
        public angle : number;
        /**
        *
        * @method slope
        * @return {Number}
        */
        public slope : number;
        /**
        *
        * @method perpSlope
        * @return {Number}
        */
        public perpSlope : number;
        /**
        *
        * @method yIntercept
        * @return {Number}
        */
        public yIntercept : number;
        /**
        *
        * @method isPointOnLine
        * @param {Number} x
        * @param {Number} y
        * @return {Boolean}
        */
        public isPointOnLine(x: number, y: number): bool;
        /**
        *
        * @method isPointOnLineSegment
        * @param {Number} x
        * @param {Number} y
        * @return {Boolean}
        */
        public isPointOnLineSegment(x: number, y: number): bool;
        /**
        *
        * @method intersectLineLine
        * @param {Any} line
        * @return {Any}
        */
        public intersectLineLine(line): any;
        /**
        *
        * @method perp
        * @param {Number} x
        * @param {Number} y
        * @param {Phaser.Line} [output]
        * @return {Phaser.Line}
        */
        public perp(x: number, y: number, output?: Line): Line;
        /**
        *
        * @method toString
        * @return {String}
        */
        public toString(): string;
    }
}
/**
* Phaser - IntersectResult
*
* A light-weight result object to hold the results of an intersection. For when you need more than just true/false.
*/
module Phaser {
    class IntersectResult {
        /**
        * Did they intersect or not?
        * @property result
        * @type Boolean
        */
        public result: bool;
        /**
        * @property x
        * @type Number
        */
        public x: number;
        /**
        * @property y
        * @type Number
        */
        public y: number;
        /**
        * @property x1
        * @type Number
        */
        public x1: number;
        /**
        * @property y1
        * @type Number
        */
        public y1: number;
        /**
        * @property x2
        * @type Number
        */
        public x2: number;
        /**
        * @property y2
        * @type Number
        */
        public y2: number;
        /**
        * @property width
        * @type Number
        */
        public width: number;
        /**
        * @property height
        * @type Number
        */
        public height: number;
        /**
        *
        * @method setTo
        * @param {Number} x1
        * @param {Number} y1
        * @param {Number} [x2]
        * @param {Number} [y2]
        * @param {Number} [width]
        * @param {Number} [height]
        */
        public setTo(x1: number, y1: number, x2?: number, y2?: number, width?: number, height?: number): void;
    }
}
/**
* Phaser - LinkedList
*
* A miniature linked list class. Useful for optimizing time-critical or highly repetitive tasks!
*/
module Phaser {
    class LinkedList {
        /**
        * Creates a new link, and sets <code>object</code> and <code>next</code> to <code>null</code>.
        */
        constructor();
        /**
        * Stores a reference to an <code>Basic</code>.
        */
        public object: Basic;
        /**
        * Stores a reference to the next link in the list.
        */
        public next: LinkedList;
        /**
        * Clean up memory.
        */
        public destroy(): void;
    }
}
/**
* Phaser - QuadTree
*
* A fairly generic quad tree structure for rapid overlap checks. QuadTree is also configured for single or dual list operation.
* You can add items either to its A list or its B list. When you do an overlap check, you can compare the A list to itself,
* or the A list against the B list.  Handy for different things!
*/
module Phaser {
    class QuadTree extends Rectangle {
        /**
        * Instantiate a new Quad Tree node.
        *
        * @param	X			The X-coordinate of the point in space.
        * @param	Y			The Y-coordinate of the point in space.
        * @param	Width		Desired width of this node.
        * @param	Height		Desired height of this node.
        * @param	Parent		The parent branch or node.  Pass null to create a root.
        */
        constructor(X: number, Y: number, Width: number, Height: number, Parent?: QuadTree);
        /**
        * Flag for specifying that you want to add an object to the A list.
        */
        static A_LIST: number;
        /**
        * Flag for specifying that you want to add an object to the B list.
        */
        static B_LIST: number;
        /**
        * Controls the granularity of the quad tree.  Default is 6 (decent performance on large and small worlds).
        */
        static divisions: number;
        /**
        * Whether this branch of the tree can be subdivided or not.
        */
        private _canSubdivide;
        /**
        * Refers to the internal A and B linked lists,
        * which are used to store objects in the leaves.
        */
        private _headA;
        /**
        * Refers to the internal A and B linked lists,
        * which are used to store objects in the leaves.
        */
        private _tailA;
        /**
        * Refers to the internal A and B linked lists,
        * which are used to store objects in the leaves.
        */
        private _headB;
        /**
        * Refers to the internal A and B linked lists,
        * which are used to store objects in the leaves.
        */
        private _tailB;
        /**
        * Internal, governs and assists with the formation of the tree.
        */
        private static _min;
        /**
        * Internal, governs and assists with the formation of the tree.
        */
        private _northWestTree;
        /**
        * Internal, governs and assists with the formation of the tree.
        */
        private _northEastTree;
        /**
        * Internal, governs and assists with the formation of the tree.
        */
        private _southEastTree;
        /**
        * Internal, governs and assists with the formation of the tree.
        */
        private _southWestTree;
        /**
        * Internal, governs and assists with the formation of the tree.
        */
        private _leftEdge;
        /**
        * Internal, governs and assists with the formation of the tree.
        */
        private _rightEdge;
        /**
        * Internal, governs and assists with the formation of the tree.
        */
        private _topEdge;
        /**
        * Internal, governs and assists with the formation of the tree.
        */
        private _bottomEdge;
        /**
        * Internal, governs and assists with the formation of the tree.
        */
        private _halfWidth;
        /**
        * Internal, governs and assists with the formation of the tree.
        */
        private _halfHeight;
        /**
        * Internal, governs and assists with the formation of the tree.
        */
        private _midpointX;
        /**
        * Internal, governs and assists with the formation of the tree.
        */
        private _midpointY;
        /**
        * Internal, used to reduce recursive method parameters during object placement and tree formation.
        */
        private static _object;
        /**
        * Internal, used to reduce recursive method parameters during object placement and tree formation.
        */
        private static _objectLeftEdge;
        /**
        * Internal, used to reduce recursive method parameters during object placement and tree formation.
        */
        private static _objectTopEdge;
        /**
        * Internal, used to reduce recursive method parameters during object placement and tree formation.
        */
        private static _objectRightEdge;
        /**
        * Internal, used to reduce recursive method parameters during object placement and tree formation.
        */
        private static _objectBottomEdge;
        /**
        * Internal, used during tree processing and overlap checks.
        */
        private static _list;
        /**
        * Internal, used during tree processing and overlap checks.
        */
        private static _useBothLists;
        /**
        * Internal, used during tree processing and overlap checks.
        */
        private static _processingCallback;
        /**
        * Internal, used during tree processing and overlap checks.
        */
        private static _notifyCallback;
        /**
        * Internal, used during tree processing and overlap checks.
        */
        private static _iterator;
        /**
        * Internal, helpers for comparing actual object-to-object overlap - see <code>overlapNode()</code>.
        */
        private static _objectHullX;
        /**
        * Internal, helpers for comparing actual object-to-object overlap - see <code>overlapNode()</code>.
        */
        private static _objectHullY;
        /**
        * Internal, helpers for comparing actual object-to-object overlap - see <code>overlapNode()</code>.
        */
        private static _objectHullWidth;
        /**
        * Internal, helpers for comparing actual object-to-object overlap - see <code>overlapNode()</code>.
        */
        private static _objectHullHeight;
        /**
        * Internal, helpers for comparing actual object-to-object overlap - see <code>overlapNode()</code>.
        */
        private static _checkObjectHullX;
        /**
        * Internal, helpers for comparing actual object-to-object overlap - see <code>overlapNode()</code>.
        */
        private static _checkObjectHullY;
        /**
        * Internal, helpers for comparing actual object-to-object overlap - see <code>overlapNode()</code>.
        */
        private static _checkObjectHullWidth;
        /**
        * Internal, helpers for comparing actual object-to-object overlap - see <code>overlapNode()</code>.
        */
        private static _checkObjectHullHeight;
        /**
        * Clean up memory.
        */
        public destroy(): void;
        /**
        * Load objects and/or groups into the quad tree, and register notify and processing callbacks.
        *
        * @param ObjectOrGroup1	Any object that is or extends GameObject or Group.
        * @param ObjectOrGroup2	Any object that is or extends GameObject or Group.  If null, the first parameter will be checked against itself.
        * @param NotifyCallback	A function with the form <code>myFunction(Object1:GameObject,Object2:GameObject)</code> that is called whenever two objects are found to overlap in world space, and either no ProcessCallback is specified, or the ProcessCallback returns true.
        * @param ProcessCallback	A function with the form <code>myFunction(Object1:GameObject,Object2:GameObject):bool</code> that is called whenever two objects are found to overlap in world space.  The NotifyCallback is only called if this function returns true.  See GameObject.separate().
        */
        public load(ObjectOrGroup1: Basic, ObjectOrGroup2?: Basic, NotifyCallback?, ProcessCallback?): void;
        /**
        * Call this function to add an object to the root of the tree.
        * This function will recursively add all group members, but
        * not the groups themselves.
        *
        * @param	ObjectOrGroup	GameObjects are just added, Groups are recursed and their applicable members added accordingly.
        * @param	List			A <code>uint</code> flag indicating the list to which you want to add the objects.  Options are <code>QuadTree.A_LIST</code> and <code>QuadTree.B_LIST</code>.
        */
        public add(ObjectOrGroup: Basic, List: number): void;
        /**
        * Internal function for recursively navigating and creating the tree
        * while adding objects to the appropriate nodes.
        */
        private addObject();
        /**
        * Internal function for recursively adding objects to leaf lists.
        */
        private addToList();
        /**
        * <code>QuadTree</code>'s other main function.  Call this after adding objects
        * using <code>QuadTree.load()</code> to compare the objects that you loaded.
        *
        * @return	Whether or not any overlaps were found.
        */
        public execute(): bool;
        /**
        * An private for comparing an object against the contents of a node.
        *
        * @return	Whether or not any overlaps were found.
        */
        private overlapNode();
    }
}
/**
* Phaser - Collision
*
* A set of extremely useful collision and geometry intersection functions.
*/
module Phaser {
    class Collision {
        /**
        * Collision constructor
        * @param game A reference to the current Game
        */
        constructor(game: Game);
        /**
        * Local private reference to Game
        */
        private _game;
        /**
        * Flag used to allow GameObjects to collide on their left side
        * @type {number}
        */
        static LEFT: number;
        /**
        * Flag used to allow GameObjects to collide on their right side
        * @type {number}
        */
        static RIGHT: number;
        /**
        * Flag used to allow GameObjects to collide on their top side
        * @type {number}
        */
        static UP: number;
        /**
        * Flag used to allow GameObjects to collide on their bottom side
        * @type {number}
        */
        static DOWN: number;
        /**
        * Flag used with GameObjects to disable collision
        * @type {number}
        */
        static NONE: number;
        /**
        * Flag used to allow GameObjects to collide with a ceiling
        * @type {number}
        */
        static CEILING: number;
        /**
        * Flag used to allow GameObjects to collide with a floor
        * @type {number}
        */
        static FLOOR: number;
        /**
        * Flag used to allow GameObjects to collide with a wall (same as LEFT+RIGHT)
        * @type {number}
        */
        static WALL: number;
        /**
        * Flag used to allow GameObjects to collide on any face
        * @type {number}
        */
        static ANY: number;
        /**
        * The overlap bias is used when calculating hull overlap before separation - change it if you have especially small or large GameObjects
        * @type {number}
        */
        static OVERLAP_BIAS: number;
        /**
        * This holds the result of the tile separation check, true if the object was moved, otherwise false
        * @type {boolean}
        */
        static TILE_OVERLAP: bool;
        /**
        * A temporary Quad used in the separation process to help avoid gc spikes
        * @type {Quad}
        */
        static _tempBounds: Quad;
        /**
        * Checks for Line to Line intersection and returns an IntersectResult object containing the results of the intersection.
        * @param line1 The first Line object to check
        * @param line2 The second Line object to check
        * @param output An optional IntersectResult object to store the intersection values in. One is created if none given.
        * @returns {IntersectResult=} An IntersectResult object containing the results of the intersection
        */
        static lineToLine(line1: Line, line2: Line, output?: IntersectResult): IntersectResult;
        /**
        * Checks for Line to Line Segment intersection and returns an IntersectResult object containing the results of the intersection.
        * @param line The Line object to check
        * @param seg The Line segment object to check
        * @param output An optional IntersectResult object to store the intersection values in. One is created if none given.
        * @returns {IntersectResult=} An IntersectResult object containing the results of the intersection
        */
        static lineToLineSegment(line: Line, seg: Line, output?: IntersectResult): IntersectResult;
        /**
        * Checks for Line to Raw Line Segment intersection and returns the result in the IntersectResult object.
        * @param line The Line object to check
        * @param x1 The start x coordinate of the raw segment
        * @param y1 The start y coordinate of the raw segment
        * @param x2 The end x coordinate of the raw segment
        * @param y2 The end y coordinate of the raw segment
        * @param output An optional IntersectResult object to store the intersection values in. One is created if none given.
        * @returns {IntersectResult=} An IntersectResult object containing the results of the intersection
        */
        static lineToRawSegment(line: Line, x1: number, y1: number, x2: number, y2: number, output?: IntersectResult): IntersectResult;
        /**
        * Checks for Line to Ray intersection and returns the result in an IntersectResult object.
        * @param line1 The Line object to check
        * @param ray The Ray object to check
        * @param output An optional IntersectResult object to store the intersection values in. One is created if none given.
        * @returns {IntersectResult=} An IntersectResult object containing the results of the intersection
        */
        static lineToRay(line1: Line, ray: Line, output?: IntersectResult): IntersectResult;
        /**
        * Check if the Line and Circle objects intersect
        * @param line The Line object to check
        * @param circle The Circle object to check
        * @param output An optional IntersectResult object to store the intersection values in. One is created if none given.
        * @returns {IntersectResult=} An IntersectResult object containing the results of the intersection
        */
        static lineToCircle(line: Line, circle: Circle, output?: IntersectResult): IntersectResult;
        /**
        * Check if the Line intersects each side of the Rectangle
        * @param line The Line object to check
        * @param rect The Rectangle object to check
        * @param output An optional IntersectResult object to store the intersection values in. One is created if none given.
        * @returns {IntersectResult=} An IntersectResult object containing the results of the intersection
        */
        static lineToRectangle(line: Line, rect: Rectangle, output?: IntersectResult): IntersectResult;
        /**
        * Check if the two Line Segments intersect and returns the result in an IntersectResult object.
        * @param line1 The first Line Segment to check
        * @param line2 The second Line Segment to check
        * @param output An optional IntersectResult object to store the intersection values in. One is created if none given.
        * @returns {IntersectResult=} An IntersectResult object containing the results of the intersection
        */
        static lineSegmentToLineSegment(line1: Line, line2: Line, output?: IntersectResult): IntersectResult;
        /**
        * Check if the Line Segment intersects with the Ray and returns the result in an IntersectResult object.
        * @param line The Line Segment to check.
        * @param ray The Ray to check.
        * @param output An optional IntersectResult object to store the intersection values in. One is created if none given.
        * @returns {IntersectResult=} An IntersectResult object containing the results of the intersection
        */
        static lineSegmentToRay(line: Line, ray: Line, output?: IntersectResult): IntersectResult;
        /**
        * Check if the Line Segment intersects with the Circle and returns the result in an IntersectResult object.
        * @param seg The Line Segment to check.
        * @param circle The Circle to check
        * @param output An optional IntersectResult object to store the intersection values in. One is created if none given.
        * @returns {IntersectResult=} An IntersectResult object containing the results of the intersection
        */
        static lineSegmentToCircle(seg: Line, circle: Circle, output?: IntersectResult): IntersectResult;
        /**
        * Check if the Line Segment intersects with the Rectangle and returns the result in an IntersectResult object.
        * @param seg The Line Segment to check.
        * @param rect The Rectangle to check.
        * @param output An optional IntersectResult object to store the intersection values in. One is created if none given.
        * @returns {IntersectResult=} An IntersectResult object containing the results of the intersection
        */
        static lineSegmentToRectangle(seg: Line, rect: Rectangle, output?: IntersectResult): IntersectResult;
        /**
        * Check for Ray to Rectangle intersection and returns the result in an IntersectResult object.
        * @param ray The Ray to check.
        * @param rect The Rectangle to check.
        * @param output An optional IntersectResult object to store the intersection values in. One is created if none given.
        * @returns {IntersectResult=} An IntersectResult object containing the results of the intersection
        */
        static rayToRectangle(ray: Line, rect: Rectangle, output?: IntersectResult): IntersectResult;
        /**
        * Check whether a Ray intersects a Line segment and returns the parametric value where the intersection occurs in an IntersectResult object.
        * @param rayX1
        * @param rayY1
        * @param rayX2
        * @param rayY2
        * @param lineX1
        * @param lineY1
        * @param lineX2
        * @param lineY2
        * @param output An optional IntersectResult object to store the intersection values in. One is created if none given.
        * @returns {IntersectResult=} An IntersectResult object containing the results of the intersection
        */
        static rayToLineSegment(rayX1, rayY1, rayX2, rayY2, lineX1, lineY1, lineX2, lineY2, output?: IntersectResult): IntersectResult;
        /**
        * Determines whether the specified point is contained within the rectangular region defined by the Rectangle object and returns the result in an IntersectResult object.
        * @param point The Point or MicroPoint object to check, or any object with x and y properties.
        * @param rect The Rectangle object to check the point against
        * @param output An optional IntersectResult object to store the intersection values in. One is created if none given.
        * @returns {IntersectResult=} An IntersectResult object containing the results of the intersection
        */
        static pointToRectangle(point, rect: Rectangle, output?: IntersectResult): IntersectResult;
        /**
        * Check whether two axis aligned Rectangles intersect and returns the intersecting rectangle dimensions in an IntersectResult object if they do.
        * @param rect1 The first Rectangle object.
        * @param rect2 The second Rectangle object.
        * @param output An optional IntersectResult object to store the intersection values in. One is created if none given.
        * @returns {IntersectResult=} An IntersectResult object containing the results of the intersection
        */
        static rectangleToRectangle(rect1: Rectangle, rect2: Rectangle, output?: IntersectResult): IntersectResult;
        /**
        * Checks if the Rectangle and Circle objects intersect and returns the result in an IntersectResult object.
        * @param rect The Rectangle object to check
        * @param circle The Circle object to check
        * @param output An optional IntersectResult object to store the intersection values in. One is created if none given.
        * @returns {IntersectResult=} An IntersectResult object containing the results of the intersection
        */
        static rectangleToCircle(rect: Rectangle, circle: Circle, output?: IntersectResult): IntersectResult;
        /**
        * Checks if the two Circle objects intersect and returns the result in an IntersectResult object.
        * @param circle1 The first Circle object to check
        * @param circle2 The second Circle object to check
        * @param output An optional IntersectResult object to store the intersection values in. One is created if none given.
        * @returns {IntersectResult=} An IntersectResult object containing the results of the intersection
        */
        static circleToCircle(circle1: Circle, circle2: Circle, output?: IntersectResult): IntersectResult;
        /**
        * Checks if the Circle object intersects with the Rectangle and returns the result in an IntersectResult object.
        * @param circle The Circle object to check
        * @param rect The Rectangle object to check
        * @param output An optional IntersectResult object to store the intersection values in. One is created if none given.
        * @returns {IntersectResult=} An IntersectResult object containing the results of the intersection
        */
        static circleToRectangle(circle: Circle, rect: Rectangle, output?: IntersectResult): IntersectResult;
        /**
        * Checks if the Point object is contained within the Circle and returns the result in an IntersectResult object.
        * @param circle The Circle object to check
        * @param point A Point or MicroPoint object to check, or any object with x and y properties
        * @param output An optional IntersectResult object to store the intersection values in. One is created if none given.
        * @returns {IntersectResult=} An IntersectResult object containing the results of the intersection
        */
        static circleContainsPoint(circle: Circle, point, output?: IntersectResult): IntersectResult;
        /**
        * Checks for overlaps between two objects using the world QuadTree. Can be GameObject vs. GameObject, GameObject vs. Group or Group vs. Group.
        * Note: Does not take the objects scrollFactor into account. All overlaps are check in world space.
        * @param object1 The first GameObject or Group to check. If null the world.group is used.
        * @param object2 The second GameObject or Group to check.
        * @param notifyCallback A callback function that is called if the objects overlap. The two objects will be passed to this function in the same order in which you passed them to Collision.overlap.
        * @param processCallback A callback function that lets you perform additional checks against the two objects if they overlap. If this is set then notifyCallback will only be called if processCallback returns true.
        * @returns {boolean} true if the objects overlap, otherwise false.
        */
        public overlap(object1?: Basic, object2?: Basic, notifyCallback?, processCallback?): bool;
        /**
        * The core Collision separation function used by Collision.overlap.
        * @param object1 The first GameObject to separate
        * @param object2 The second GameObject to separate
        * @returns {boolean} Returns true if the objects were separated, otherwise false.
        */
        static separate(object1, object2): bool;
        /**
        * Collision resolution specifically for GameObjects vs. Tiles.
        * @param object The GameObject to separate
        * @param tile The Tile to separate
        * @returns {boolean} Whether the objects in fact touched and were separated
        */
        static separateTile(object: GameObject, x: number, y: number, width: number, height: number, mass: number, collideLeft: bool, collideRight: bool, collideUp: bool, collideDown: bool, separateX: bool, separateY: bool): bool;
        /**
        * Separates the two objects on their x axis
        * @param object The GameObject to separate
        * @param tile The Tile to separate
        * @returns {boolean} Whether the objects in fact touched and were separated along the X axis.
        */
        static separateTileX(object: GameObject, x: number, y: number, width: number, height: number, mass: number, collideLeft: bool, collideRight: bool, separate: bool): bool;
        /**
        * Separates the two objects on their y axis
        * @param object The first GameObject to separate
        * @param tile The second GameObject to separate
        * @returns {boolean} Whether the objects in fact touched and were separated along the Y axis.
        */
        static separateTileY(object: GameObject, x: number, y: number, width: number, height: number, mass: number, collideUp: bool, collideDown: bool, separate: bool): bool;
        /**
        * Separates the two objects on their x axis
        * @param object1 The first GameObject to separate
        * @param object2 The second GameObject to separate
        * @returns {boolean} Whether the objects in fact touched and were separated along the X axis.
        */
        static separateX(object1, object2): bool;
        /**
        * Separates the two objects on their y axis
        * @param object1 The first GameObject to separate
        * @param object2 The second GameObject to separate
        * @returns {boolean} Whether the objects in fact touched and were separated along the Y axis.
        */
        static separateY(object1, object2): bool;
        /**
        * Returns the distance between the two given coordinates.
        * @param x1 The X value of the first coordinate
        * @param y1 The Y value of the first coordinate
        * @param x2 The X value of the second coordinate
        * @param y2 The Y value of the second coordinate
        * @returns {number} The distance between the two coordinates
        */
        static distance(x1: number, y1: number, x2: number, y2: number): number;
        /**
        * Returns the distanced squared between the two given coordinates.
        * @param x1 The X value of the first coordinate
        * @param y1 The Y value of the first coordinate
        * @param x2 The X value of the second coordinate
        * @param y2 The Y value of the second coordinate
        * @returns {number} The distance between the two coordinates
        */
        static distanceSquared(x1: number, y1: number, x2: number, y2: number): number;
    }
}
/**
* Phaser - DynamicTexture
*
* A DynamicTexture can be thought of as a mini canvas into which you can draw anything.
* Game Objects can be assigned a DynamicTexture, so when they render in the world they do so
* based on the contents of the texture at the time. This allows you to create powerful effects
* once and have them replicated across as many game objects as you like.
*/
module Phaser {
    class DynamicTexture {
        constructor(game: Game, width: number, height: number);
        private _game;
        private _sx;
        private _sy;
        private _sw;
        private _sh;
        private _dx;
        private _dy;
        private _dw;
        private _dh;
        public bounds: Rectangle;
        public canvas: HTMLCanvasElement;
        public context: CanvasRenderingContext2D;
        public getPixel(x: number, y: number): number;
        public getPixel32(x: number, y: number): number;
        public getPixels(rect: Rectangle): ImageData;
        public setPixel(x: number, y: number, color: number): void;
        public setPixel32(x: number, y: number, color: number): void;
        public setPixels(rect: Rectangle, input): void;
        public fillRect(rect: Rectangle, color: number): void;
        public pasteImage(key: string, frame?: number, destX?: number, destY?: number, destWidth?: number, destHeight?: number): void;
        public copyPixels(sourceTexture: DynamicTexture, sourceRect: Rectangle, destPoint: Point): void;
        public clear(): void;
        public width : number;
        public height : number;
        /**
        * Given an alpha and 3 color values this will return an integer representation of it
        *
        * @param	alpha	The Alpha value (between 0 and 255)
        * @param	red		The Red channel value (between 0 and 255)
        * @param	green	The Green channel value (between 0 and 255)
        * @param	blue	The Blue channel value (between 0 and 255)
        *
        * @return	A native color value integer (format: 0xAARRGGBB)
        */
        private getColor32(alpha, red, green, blue);
        /**
        * Given 3 color values this will return an integer representation of it
        *
        * @param	red		The Red channel value (between 0 and 255)
        * @param	green	The Green channel value (between 0 and 255)
        * @param	blue	The Blue channel value (between 0 and 255)
        *
        * @return	A native color value integer (format: 0xRRGGBB)
        */
        private getColor(red, green, blue);
    }
}
/**
* Phaser - GameMath
*
* Adds a set of extra Math functions used through-out Phaser.
* Includes methods written by Dylan Engelman and Adam Saltsman.
*/
module Phaser {
    class GameMath {
        constructor(game: Game);
        private _game;
        static PI: number;
        static PI_2: number;
        static PI_4: number;
        static PI_8: number;
        static PI_16: number;
        static TWO_PI: number;
        static THREE_PI_2: number;
        static E: number;
        static LN10: number;
        static LN2: number;
        static LOG10E: number;
        static LOG2E: number;
        static SQRT1_2: number;
        static SQRT2: number;
        static DEG_TO_RAD: number;
        static RAD_TO_DEG: number;
        static B_16: number;
        static B_31: number;
        static B_32: number;
        static B_48: number;
        static B_53: number;
        static B_64: number;
        static ONE_THIRD: number;
        static TWO_THIRDS: number;
        static ONE_SIXTH: number;
        static COS_PI_3: number;
        static SIN_2PI_3: number;
        static CIRCLE_ALPHA: number;
        static ON: bool;
        static OFF: bool;
        static SHORT_EPSILON: number;
        static PERC_EPSILON: number;
        static EPSILON: number;
        static LONG_EPSILON: number;
        public cosTable: any[];
        public sinTable: any[];
        public fuzzyEqual(a: number, b: number, epsilon?: number): bool;
        public fuzzyLessThan(a: number, b: number, epsilon?: number): bool;
        public fuzzyGreaterThan(a: number, b: number, epsilon?: number): bool;
        public fuzzyCeil(val: number, epsilon?: number): number;
        public fuzzyFloor(val: number, epsilon?: number): number;
        public average(...args: any[]): number;
        public slam(value: number, target: number, epsilon?: number): number;
        /**
        * ratio of value to a range
        */
        public percentageMinMax(val: number, max: number, min?: number): number;
        /**
        * a value representing the sign of the value.
        * -1 for negative, +1 for positive, 0 if value is 0
        */
        public sign(n: number): number;
        public truncate(n: number): number;
        public shear(n: number): number;
        /**
        * wrap a value around a range, similar to modulus with a floating minimum
        */
        public wrap(val: number, max: number, min?: number): number;
        /**
        * arithmetic version of wrap... need to decide which is more efficient
        */
        public arithWrap(value: number, max: number, min?: number): number;
        /**
        * force a value within the boundaries of two values
        *
        * if max < min, min is returned
        */
        public clamp(input: number, max: number, min?: number): number;
        /**
        * Snap a value to nearest grid slice, using rounding.
        *
        * example if you have an interval gap of 5 and a position of 12... you will snap to 10. Where as 14 will snap to 15
        *
        * @param input - the value to snap
        * @param gap - the interval gap of the grid
        * @param start - optional starting offset for gap
        */
        public snapTo(input: number, gap: number, start?: number): number;
        /**
        * Snap a value to nearest grid slice, using floor.
        *
        * example if you have an interval gap of 5 and a position of 12... you will snap to 10. As will 14 snap to 10... but 16 will snap to 15
        *
        * @param input - the value to snap
        * @param gap - the interval gap of the grid
        * @param start - optional starting offset for gap
        */
        public snapToFloor(input: number, gap: number, start?: number): number;
        /**
        * Snap a value to nearest grid slice, using ceil.
        *
        * example if you have an interval gap of 5 and a position of 12... you will snap to 15. As will 14 will snap to 15... but 16 will snap to 20
        *
        * @param input - the value to snap
        * @param gap - the interval gap of the grid
        * @param start - optional starting offset for gap
        */
        public snapToCeil(input: number, gap: number, start?: number): number;
        /**
        * Snaps a value to the nearest value in an array.
        */
        public snapToInArray(input: number, arr: number[], sort?: bool): number;
        /**
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
        public roundTo(value: number, place?: number, base?: number): number;
        public floorTo(value: number, place?: number, base?: number): number;
        public ceilTo(value: number, place?: number, base?: number): number;
        /**
        * a one dimensional linear interpolation of a value.
        */
        public interpolateFloat(a: number, b: number, weight: number): number;
        /**
        * convert radians to degrees
        */
        public radiansToDegrees(angle: number): number;
        /**
        * convert degrees to radians
        */
        public degreesToRadians(angle: number): number;
        /**
        * Find the angle of a segment from (x1, y1) -> (x2, y2 )
        */
        public angleBetween(x1: number, y1: number, x2: number, y2: number): number;
        /**
        * set an angle with in the bounds of -PI to PI
        */
        public normalizeAngle(angle: number, radians?: bool): number;
        /**
        * closest angle between two angles from a1 to a2
        * absolute value the return for exact angle
        */
        public nearestAngleBetween(a1: number, a2: number, radians?: bool): number;
        /**
        * normalizes independent and then sets dep to the nearest value respective to independent
        *
        * for instance if dep=-170 and ind=170 then 190 will be returned as an alternative to -170
        */
        public normalizeAngleToAnother(dep: number, ind: number, radians?: bool): number;
        /**
        * normalize independent and dependent and then set dependent to an angle relative to 'after/clockwise' independent
        *
        * for instance dep=-170 and ind=170, then 190 will be reutrned as alternative to -170
        */
        public normalizeAngleAfterAnother(dep: number, ind: number, radians?: bool): number;
        /**
        * normalizes indendent and dependent and then sets dependent to an angle relative to 'before/counterclockwise' independent
        *
        * for instance dep = 190 and ind = 170, then -170 will be returned as an alternative to 190
        */
        public normalizeAngleBeforeAnother(dep: number, ind: number, radians?: bool): number;
        /**
        * interpolate across the shortest arc between two angles
        */
        public interpolateAngles(a1: number, a2: number, weight: number, radians?: bool, ease?): number;
        /**
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
        public logBaseOf(value: number, base: number): number;
        /**
        * Greatest Common Denominator using Euclid's algorithm
        */
        public GCD(m: number, n: number): number;
        /**
        * Lowest Common Multiple
        */
        public LCM(m: number, n: number): number;
        /**
        * Factorial - N!
        *
        * simple product series
        *
        * by definition:
        * 0! == 1
        */
        public factorial(value: number): number;
        /**
        * gamma function
        *
        * defined: gamma(N) == (N - 1)!
        */
        public gammaFunction(value: number): number;
        /**
        * falling factorial
        *
        * defined: (N)! / (N - x)!
        *
        * written subscript: (N)x OR (base)exp
        */
        public fallingFactorial(base: number, exp: number): number;
        /**
        * rising factorial
        *
        * defined: (N + x - 1)! / (N - 1)!
        *
        * written superscript N^(x) OR base^(exp)
        */
        public risingFactorial(base: number, exp: number): number;
        /**
        * binomial coefficient
        *
        * defined: N! / (k!(N-k)!)
        * reduced: N! / (N-k)! == (N)k (fallingfactorial)
        * reduced: (N)k / k!
        */
        public binCoef(n: number, k: number): number;
        /**
        * rising binomial coefficient
        *
        * as one can notice in the analysis of binCoef(...) that
        * binCoef is the (N)k divided by k!. Similarly rising binCoef
        * is merely N^(k) / k!
        */
        public risingBinCoef(n: number, k: number): number;
        /**
        * Generate a random boolean result based on the chance value
        * <p>
        * Returns true or false based on the chance value (default 50%). For example if you wanted a player to have a 30% chance
        * of getting a bonus, call chanceRoll(30) - true means the chance passed, false means it failed.
        * </p>
        * @param chance The chance of receiving the value. A number between 0 and 100 (effectively 0% to 100%)
        * @return true if the roll passed, or false
        */
        public chanceRoll(chance?: number): bool;
        /**
        * Adds the given amount to the value, but never lets the value go over the specified maximum
        *
        * @param value The value to add the amount to
        * @param amount The amount to add to the value
        * @param max The maximum the value is allowed to be
        * @return The new value
        */
        public maxAdd(value: number, amount: number, max: number): number;
        /**
        * Subtracts the given amount from the value, but never lets the value go below the specified minimum
        *
        * @param value The base value
        * @param amount The amount to subtract from the base value
        * @param min The minimum the value is allowed to be
        * @return The new value
        */
        public minSub(value: number, amount: number, min: number): number;
        /**
        * Adds value to amount and ensures that the result always stays between 0 and max, by wrapping the value around.
        * <p>Values must be positive integers, and are passed through Math.abs</p>
        *
        * @param value The value to add the amount to
        * @param amount The amount to add to the value
        * @param max The maximum the value is allowed to be
        * @return The wrapped value
        */
        public wrapValue(value: number, amount: number, max: number): number;
        /**
        * Randomly returns either a 1 or -1
        *
        * @return	1 or -1
        */
        public randomSign(): number;
        /**
        * Returns true if the number given is odd.
        *
        * @param	n	The number to check
        *
        * @return	True if the given number is odd. False if the given number is even.
        */
        public isOdd(n: number): bool;
        /**
        * Returns true if the number given is even.
        *
        * @param	n	The number to check
        *
        * @return	True if the given number is even. False if the given number is odd.
        */
        public isEven(n: number): bool;
        /**
        * Keeps an angle value between -180 and +180<br>
        * Should be called whenever the angle is updated on the Sprite to stop it from going insane.
        *
        * @param	angle	The angle value to check
        *
        * @return	The new angle value, returns the same as the input angle if it was within bounds
        */
        public wrapAngle(angle: number): number;
        /**
        * Keeps an angle value between the given min and max values
        *
        * @param	angle	The angle value to check. Must be between -180 and +180
        * @param	min		The minimum angle that is allowed (must be -180 or greater)
        * @param	max		The maximum angle that is allowed (must be 180 or less)
        *
        * @return	The new angle value, returns the same as the input angle if it was within bounds
        */
        public angleLimit(angle: number, min: number, max: number): number;
        /**
        * @method linear
        * @param {Any} v
        * @param {Any} k
        * @static
        */
        public linearInterpolation(v, k);
        /**
        * @method Bezier
        * @param {Any} v
        * @param {Any} k
        * @static
        */
        public bezierInterpolation(v, k): number;
        /**
        * @method CatmullRom
        * @param {Any} v
        * @param {Any} k
        * @static
        */
        public catmullRomInterpolation(v, k);
        /**
        * @method Linear
        * @param {Any} p0
        * @param {Any} p1
        * @param {Any} t
        * @static
        */
        public linear(p0, p1, t);
        /**
        * @method Bernstein
        * @param {Any} n
        * @param {Any} i
        * @static
        */
        public bernstein(n, i): number;
        /**
        * @method CatmullRom
        * @param {Any} p0
        * @param {Any} p1
        * @param {Any} p2
        * @param {Any} p3
        * @param {Any} t
        * @static
        */
        public catmullRom(p0, p1, p2, p3, t);
        public difference(a: number, b: number): number;
        /**
        * The global random number generator seed (for deterministic behavior in recordings and saves).
        */
        public globalSeed: number;
        /**
        * Generates a random number.  Deterministic, meaning safe
        * to use if you want to record replays in random environments.
        *
        * @return	A <code>Number</code> between 0 and 1.
        */
        public random(): number;
        /**
        * Generates a random number based on the seed provided.
        *
        * @param	Seed	A number between 0 and 1, used to generate a predictable random number (very optional).
        *
        * @return	A <code>Number</code> between 0 and 1.
        */
        public srand(Seed: number): number;
        /**
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
        public getRandom(Objects, StartIndex?: number, Length?: number);
        /**
        * Round down to the next whole number. E.g. floor(1.7) == 1, and floor(-2.7) == -2.
        *
        * @param	Value	Any number.
        *
        * @return	The rounded value of that number.
        */
        public floor(Value: number): number;
        /**
        * Round up to the next whole number.  E.g. ceil(1.3) == 2, and ceil(-2.3) == -3.
        *
        * @param	Value	Any number.
        *
        * @return	The rounded value of that number.
        */
        public ceil(Value: number): number;
        /**
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
        public sinCosGenerator(length: number, sinAmplitude?: number, cosAmplitude?: number, frequency?: number): any[];
        /**
        * Shifts through the sin table data by one value and returns it.
        * This effectively moves the position of the data from the start to the end of the table.
        * @return	The sin value.
        */
        public shiftSinTable(): number;
        /**
        * Shifts through the cos table data by one value and returns it.
        * This effectively moves the position of the data from the start to the end of the table.
        * @return	The cos value.
        */
        public shiftCosTable(): number;
        /**
        * Finds the length of the given vector
        *
        * @param	dx
        * @param	dy
        *
        * @return
        */
        public vectorLength(dx: number, dy: number): number;
        /**
        * Finds the dot product value of two vectors
        *
        * @param	ax		Vector X
        * @param	ay		Vector Y
        * @param	bx		Vector X
        * @param	by		Vector Y
        *
        * @return	Dot product
        */
        public dotProduct(ax: number, ay: number, bx: number, by: number): number;
    }
}
/**
* Phaser - Group
*
* This class is used for organising, updating and sorting game objects.
*
*/
module Phaser {
    class Group extends Basic {
        constructor(game: Game, MaxSize?: number);
        /**
        * Use with <code>sort()</code> to sort in ascending order.
        */
        static ASCENDING: number;
        /**
        * Use with <code>sort()</code> to sort in descending order.
        */
        static DESCENDING: number;
        /**
        * Array of all the <code>Basic</code>s that exist in this group.
        */
        public members: Basic[];
        /**
        * The number of entries in the members array.
        * For performance and safety you should check this variable
        * instead of members.length unless you really know what you're doing!
        */
        public length: number;
        /**
        * Internal tracker for the maximum capacity of the group.
        * Default is 0, or no max capacity.
        */
        private _maxSize;
        /**
        * Internal helper variable for recycling objects a la <code>Emitter</code>.
        */
        private _marker;
        /**
        * Helper for sort.
        */
        private _sortIndex;
        /**
        * Helper for sort.
        */
        private _sortOrder;
        /**
        * Override this function to handle any deleting or "shutdown" type operations you might need,
        * such as removing traditional Flash children like Basic objects.
        */
        public destroy(): void;
        /**
        * Automatically goes through and calls update on everything you added.
        */
        public update(): void;
        /**
        * Automatically goes through and calls render on everything you added.
        */
        public render(camera: Camera, cameraOffsetX: number, cameraOffsetY: number): void;
        /**
        * The maximum capacity of this group.  Default is 0, meaning no max capacity, and the group can just grow.
        */
        /**
        * @private
        */
        public maxSize : number;
        /**
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
        public add(Object: Basic): Basic;
        /**
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
        public recycle(ObjectClass?);
        /**
        * Removes an object from the group.
        *
        * @param	object	The <code>Basic</code> you want to remove.
        * @param	splice	Whether the object should be cut from the array entirely or not.
        *
        * @return	The removed object.
        */
        public remove(object: Basic, splice?: bool): Basic;
        /**
        * Replaces an existing <code>Basic</code> with a new one.
        *
        * @param	oldObject	The object you want to replace.
        * @param	newObject	The new object you want to use instead.
        *
        * @return	The new object.
        */
        public replace(oldObject: Basic, newObject: Basic): Basic;
        /**
        * Call this function to sort the group according to a particular value and order.
        * For example, to sort game objects for Zelda-style overlaps you might call
        * <code>myGroup.sort("y",Group.ASCENDING)</code> at the bottom of your
        * <code>State.update()</code> override.  To sort all existing objects after
        * a big explosion or bomb attack, you might call <code>myGroup.sort("exists",Group.DESCENDING)</code>.
        *
        * @param	index	The <code>string</code> name of the member variable you want to sort on.  Default value is "y".
        * @param	order	A <code>Group</code> constant that defines the sort order.  Possible values are <code>Group.ASCENDING</code> and <code>Group.DESCENDING</code>.  Default value is <code>Group.ASCENDING</code>.
        */
        public sort(index?: string, order?: number): void;
        /**
        * Go through and set the specified variable to the specified value on all members of the group.
        *
        * @param	VariableName	The string representation of the variable name you want to modify, for example "visible" or "scrollFactor".
        * @param	Value			The value you want to assign to that variable.
        * @param	Recurse			Default value is true, meaning if <code>setAll()</code> encounters a member that is a group, it will call <code>setAll()</code> on that group rather than modifying its variable.
        */
        public setAll(VariableName: string, Value: Object, Recurse?: bool): void;
        /**
        * Go through and call the specified function on all members of the group.
        * Currently only works on functions that have no required parameters.
        *
        * @param	FunctionName	The string representation of the function you want to call on each object, for example "kill()" or "init()".
        * @param	Recurse			Default value is true, meaning if <code>callAll()</code> encounters a member that is a group, it will call <code>callAll()</code> on that group rather than calling the group's function.
        */
        public callAll(FunctionName: string, Recurse?: bool): void;
        public forEach(callback, recursive?: bool): void;
        public forEachAlive(context, callback, recursive?: bool): void;
        /**
        * Call this function to retrieve the first object with exists == false in the group.
        * This is handy for recycling in general, e.g. respawning enemies.
        *
        * @param	ObjectClass		An optional parameter that lets you narrow the results to instances of this particular class.
        *
        * @return	A <code>Basic</code> currently flagged as not existing.
        */
        public getFirstAvailable(ObjectClass?);
        /**
        * Call this function to retrieve the first index set to 'null'.
        * Returns -1 if no index stores a null object.
        *
        * @return	An <code>int</code> indicating the first null slot in the group.
        */
        public getFirstNull(): number;
        /**
        * Call this function to retrieve the first object with exists == true in the group.
        * This is handy for checking if everything's wiped out, or choosing a squad leader, etc.
        *
        * @return	A <code>Basic</code> currently flagged as existing.
        */
        public getFirstExtant(): Basic;
        /**
        * Call this function to retrieve the first object with dead == false in the group.
        * This is handy for checking if everything's wiped out, or choosing a squad leader, etc.
        *
        * @return	A <code>Basic</code> currently flagged as not dead.
        */
        public getFirstAlive(): Basic;
        /**
        * Call this function to retrieve the first object with dead == true in the group.
        * This is handy for checking if everything's wiped out, or choosing a squad leader, etc.
        *
        * @return	A <code>Basic</code> currently flagged as dead.
        */
        public getFirstDead(): Basic;
        /**
        * Call this function to find out how many members of the group are not dead.
        *
        * @return	The number of <code>Basic</code>s flagged as not dead.  Returns -1 if group is empty.
        */
        public countLiving(): number;
        /**
        * Call this function to find out how many members of the group are dead.
        *
        * @return	The number of <code>Basic</code>s flagged as dead.  Returns -1 if group is empty.
        */
        public countDead(): number;
        /**
        * Returns a member at random from the group.
        *
        * @param	StartIndex	Optional offset off the front of the array. Default value is 0, or the beginning of the array.
        * @param	Length		Optional restriction on the number of values you want to randomly select from.
        *
        * @return	A <code>Basic</code> from the members list.
        */
        public getRandom(StartIndex?: number, Length?: number): Basic;
        /**
        * Remove all instances of <code>Basic</code> subclass (Basic, Block, etc) from the list.
        * WARNING: does not destroy() or kill() any of these objects!
        */
        public clear(): void;
        /**
        * Calls kill on the group's members and then on the group itself.
        */
        public kill(): void;
        /**
        * Helper function for the sort process.
        *
        * @param 	Obj1	The first object being sorted.
        * @param	Obj2	The second object being sorted.
        *
        * @return	An integer value: -1 (Obj1 before Obj2), 0 (same), or 1 (Obj1 after Obj2).
        */
        public sortHandler(Obj1: Basic, Obj2: Basic): number;
    }
}
/**
* Phaser - Loader
*
* The Loader handles loading all external content such as Images, Sounds, Texture Atlases and data files.
* It uses a combination of Image() loading and xhr and provides for progress and completion callbacks.
*/
module Phaser {
    class Loader {
        constructor(game: Game, callback);
        private _game;
        private _keys;
        private _fileList;
        private _gameCreateComplete;
        private _onComplete;
        private _onFileLoad;
        private _progressChunk;
        private _xhr;
        private _queueSize;
        public hasLoaded: bool;
        public progress: number;
        public reset(): void;
        public queueSize : number;
        public addImageFile(key: string, url: string): void;
        public addSpriteSheet(key: string, url: string, frameWidth: number, frameHeight: number, frameMax?: number): void;
        public addTextureAtlas(key: string, url: string, jsonURL?: string, jsonData?): void;
        public addAudioFile(key: string, url: string): void;
        public addTextFile(key: string, url: string): void;
        public removeFile(key: string): void;
        public removeAll(): void;
        public load(onFileLoadCallback?, onCompleteCallback?): void;
        private loadFile();
        private fileError(key);
        private fileComplete(key);
        private jsonLoadComplete(key);
        private jsonLoadError(key);
        private nextFile(previousKey, success);
        private checkKeyExists(key);
    }
}
/**
* Phaser - Motion
*
* The Motion class contains lots of useful functions for moving game objects around in world space.
*/
module Phaser {
    class Motion {
        constructor(game: Game);
        private _game;
        /**
        * A tween-like function that takes a starting velocity and some other factors and returns an altered velocity.
        *
        * @param	Velocity		Any component of velocity (e.g. 20).
        * @param	Acceleration	Rate at which the velocity is changing.
        * @param	Drag			Really kind of a deceleration, this is how much the velocity changes if Acceleration is not set.
        * @param	Max				An absolute value cap for the velocity.
        *
        * @return	The altered Velocity value.
        */
        public computeVelocity(Velocity: number, Acceleration?: number, Drag?: number, Max?: number): number;
        /**
        * Given the angle and speed calculate the velocity and return it as a Point
        *
        * @param	angle	The angle (in degrees) calculated in clockwise positive direction (down = 90 degrees positive, right = 0 degrees positive, up = 90 degrees negative)
        * @param	speed	The speed it will move, in pixels per second sq
        *
        * @return	A Point where Point.x contains the velocity x value and Point.y contains the velocity y value
        */
        public velocityFromAngle(angle: number, speed: number): Point;
        /**
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
        public moveTowardsObject(source: GameObject, dest: GameObject, speed?: number, maxTime?: number): void;
        /**
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
        public accelerateTowardsObject(source: GameObject, dest: GameObject, speed: number, xSpeedMax: number, ySpeedMax: number): void;
        /**
        * Move the given Sprite towards the mouse pointer coordinates at a steady velocity
        * If you specify a maxTime then it will adjust the speed (over-writing what you set) so it arrives at the destination in that number of seconds.<br>
        * Timings are approximate due to the way Flash timers work, and irrespective of SWF frame rate. Allow for a variance of +- 50ms.<br>
        * The source object doesn't stop moving automatically should it ever reach the destination coordinates.<br>
        *
        * @param	source		The Sprite to move
        * @param	speed		The speed it will move, in pixels per second (default is 60 pixels/sec)
        * @param	maxTime		Time given in milliseconds (1000 = 1 sec). If set the speed is adjusted so the source will arrive at destination in the given number of ms
        */
        public moveTowardsMouse(source: GameObject, speed?: number, maxTime?: number): void;
        /**
        * Sets the x/y acceleration on the source Sprite so it will move towards the mouse coordinates at the speed given (in pixels per second)<br>
        * You must give a maximum speed value, beyond which the Sprite won't go any faster.<br>
        * If you don't need acceleration look at moveTowardsMouse() instead.
        *
        * @param	source			The Sprite on which the acceleration will be set
        * @param	speed			The speed it will accelerate in pixels per second
        * @param	xSpeedMax		The maximum speed in pixels per second in which the sprite can move horizontally
        * @param	ySpeedMax		The maximum speed in pixels per second in which the sprite can move vertically
        */
        public accelerateTowardsMouse(source: GameObject, speed: number, xSpeedMax: number, ySpeedMax: number): void;
        /**
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
        public moveTowardsPoint(source: GameObject, target: Point, speed?: number, maxTime?: number): void;
        /**
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
        public accelerateTowardsPoint(source: GameObject, target: Point, speed: number, xSpeedMax: number, ySpeedMax: number): void;
        /**
        * Find the distance (in pixels, rounded) between two Sprites, taking their origin into account
        *
        * @param	a	The first Sprite
        * @param	b	The second Sprite
        * @return	int	Distance (in pixels)
        */
        public distanceBetween(a: GameObject, b: GameObject): number;
        /**
        * Find the distance (in pixels, rounded) from an Sprite to the given Point, taking the source origin into account
        *
        * @param	a		The Sprite
        * @param	target	The Point
        * @return	int		Distance (in pixels)
        */
        public distanceToPoint(a: GameObject, target: Point): number;
        /**
        * Find the distance (in pixels, rounded) from the object x/y and the mouse x/y
        *
        * @param	a	The Sprite to test against
        * @return	int	The distance between the given sprite and the mouse coordinates
        */
        public distanceToMouse(a: GameObject): number;
        /**
        * Find the angle (in radians) between an Sprite and an Point. The source sprite takes its x/y and origin into account.
        * The angle is calculated in clockwise positive direction (down = 90 degrees positive, right = 0 degrees positive, up = 90 degrees negative)
        *
        * @param	a			The Sprite to test from
        * @param	target		The Point to angle the Sprite towards
        * @param	asDegrees	If you need the value in degrees instead of radians, set to true
        *
        * @return	Number The angle (in radians unless asDegrees is true)
        */
        public angleBetweenPoint(a: GameObject, target: Point, asDegrees?: bool): number;
        /**
        * Find the angle (in radians) between the two Sprite, taking their x/y and origin into account.
        * The angle is calculated in clockwise positive direction (down = 90 degrees positive, right = 0 degrees positive, up = 90 degrees negative)
        *
        * @param	a			The Sprite to test from
        * @param	b			The Sprite to test to
        * @param	asDegrees	If you need the value in degrees instead of radians, set to true
        *
        * @return	Number The angle (in radians unless asDegrees is true)
        */
        public angleBetween(a: GameObject, b: GameObject, asDegrees?: bool): number;
        /**
        * Given the GameObject and speed calculate the velocity and return it as an Point based on the direction the sprite is facing
        *
        * @param	parent	The Sprite to get the facing value from
        * @param	speed	The speed it will move, in pixels per second sq
        *
        * @return	An Point where Point.x contains the velocity x value and Point.y contains the velocity y value
        */
        public velocityFromFacing(parent: GameObject, speed: number): Point;
        /**
        * Find the angle (in radians) between an Sprite and the mouse, taking their x/y and origin into account.
        * The angle is calculated in clockwise positive direction (down = 90 degrees positive, right = 0 degrees positive, up = 90 degrees negative)
        *
        * @param	a			The Object to test from
        * @param	asDegrees	If you need the value in degrees instead of radians, set to true
        *
        * @return	Number The angle (in radians unless asDegrees is true)
        */
        public angleBetweenMouse(a: GameObject, asDegrees?: bool): number;
    }
}
/**
* Phaser - Sound
*
* A Sound file, used by the Game.SoundManager for playback.
*/
module Phaser {
    class Sound {
        constructor(context, gainNode, data, volume?: number, loop?: bool);
        private _context;
        private _gainNode;
        private _localGainNode;
        private _buffer;
        private _volume;
        private _sound;
        public loop: bool;
        public duration: number;
        public isPlaying: bool;
        public isDecoding: bool;
        public setDecodedBuffer(data): void;
        public play(): void;
        public stop(): void;
        public mute(): void;
        public unmute(): void;
        public volume : number;
    }
}
/**
* Phaser - SoundManager
*
* This is an embroyonic web audio sound management class. There is a lot of work still to do here.
*/
module Phaser {
    class SoundManager {
        constructor(game: Game);
        private _game;
        private _context;
        private _gainNode;
        private _volume;
        public mute(): void;
        public unmute(): void;
        public volume : number;
        public decode(key: string, callback?, sound?: Sound): void;
        public play(key: string, volume?: number, loop?: bool): Sound;
    }
}
/**
* Phaser
*
* v0.9.5 - April 28th 2013
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
module Phaser {
    var VERSION: string;
}
/**
* Phaser - StageScaleMode
*
* This class controls the scaling of your game. On mobile devices it will also remove the URL bar and allow
* you to maintain proportion and aspect ratio.
* It is based on a technique taken from Viewporter v2.0 by Zynga Inc. http://github.com/zynga/viewporter
*/
module Phaser {
    class StageScaleMode {
        constructor(game: Game);
        private _game;
        private _startHeight;
        private _iterations;
        private _check;
        static EXACT_FIT: number;
        static NO_SCALE: number;
        static SHOW_ALL: number;
        public width: number;
        public height: number;
        public orientation;
        public update(): void;
        public isLandscape : bool;
        private checkOrientation(event);
        private refresh();
        private setScreenSize();
    }
}
/**
* Phaser - BootScreen
*
* The BootScreen is displayed when Phaser is started without any default functions or State
*/
module Phaser {
    class BootScreen {
        constructor(game: Game);
        private _game;
        private _logo;
        private _logoData;
        private _color1;
        private _color2;
        private _fade;
        public update(): void;
        public render(): void;
        private colorCycle();
    }
}
/**
* Phaser - PauseScreen
*
* The PauseScreen is displayed whenever the game loses focus or the player switches to another browser tab.
*/
module Phaser {
    class PauseScreen {
        constructor(game: Game, width: number, height: number);
        private _game;
        private _canvas;
        private _context;
        private _color;
        private _fade;
        public onPaused(): void;
        public onResume(): void;
        public update(): void;
        public render(): void;
        private fadeOut();
        private fadeIn();
    }
}
/**
* Phaser - Stage
*
* The Stage is the canvas on which everything is displayed. This class handles display within the web browser, focus handling,
* resizing, scaling and pause/boot screens.
*/
module Phaser {
    class Stage {
        constructor(game: Game, parent: string, width: number, height: number);
        private _game;
        private _bgColor;
        private _bootScreen;
        private _pauseScreen;
        static ORIENTATION_LANDSCAPE: number;
        static ORIENTATION_PORTRAIT: number;
        public bounds: Rectangle;
        public aspectRatio: number;
        public clear: bool;
        public canvas: HTMLCanvasElement;
        public context: CanvasRenderingContext2D;
        public disablePauseScreen: bool;
        public disableBootScreen: bool;
        public offset: Point;
        public scale: StageScaleMode;
        public scaleMode: number;
        public minScaleX: number;
        public maxScaleX: number;
        public minScaleY: number;
        public maxScaleY: number;
        public update(): void;
        private visibilityChange(event);
        private getOffset(element);
        public strokeStyle: string;
        public lineWidth: number;
        public fillStyle: string;
        public saveCanvasValues(): void;
        public restoreCanvasValues(): void;
        public backgroundColor : string;
        public x : number;
        public y : number;
        public width : number;
        public height : number;
        public centerX : number;
        public centerY : number;
        public randomX : number;
        public randomY : number;
    }
}
/**
* Phaser - Time
*
* This is the game clock and it manages elapsed time and calculation of delta values, used for game object motion.
*/
module Phaser {
    class Time {
        constructor(game: Game);
        private _game;
        private _started;
        public timeScale: number;
        public elapsed: number;
        /**
        *
        * @property time
        * @type Number
        */
        public time: number;
        /**
        *
        * @property now
        * @type Number
        */
        public now: number;
        /**
        *
        * @property delta
        * @type Number
        */
        public delta: number;
        /**
        *
        * @method totalElapsedSeconds
        * @return {Number}
        */
        public totalElapsedSeconds : number;
        public fps: number;
        public fpsMin: number;
        public fpsMax: number;
        public msMin: number;
        public msMax: number;
        public frames: number;
        private _timeLastSecond;
        /**
        *
        * @method update
        */
        public update(): void;
        /**
        *
        * @method elapsedSince
        * @param {Number} since
        * @return {Number}
        */
        public elapsedSince(since: number): number;
        /**
        *
        * @method elapsedSecondsSince
        * @param {Number} since
        * @return {Number}
        */
        public elapsedSecondsSince(since: number): number;
        /**
        *
        * @method reset
        */
        public reset(): void;
    }
}
/**
* Phaser - Easing - Back
*
* For use with Phaser.Tween
*/
module Phaser.Easing {
    class Back {
        static In(k): number;
        static Out(k): number;
        static InOut(k): number;
    }
}
/**
* Phaser - Easing - Bounce
*
* For use with Phaser.Tween
*/
module Phaser.Easing {
    class Bounce {
        static In(k): number;
        static Out(k): number;
        static InOut(k): number;
    }
}
/**
* Phaser - Easing - Circular
*
* For use with Phaser.Tween
*/
module Phaser.Easing {
    class Circular {
        static In(k): number;
        static Out(k): number;
        static InOut(k): number;
    }
}
/**
* Phaser - Easing - Cubic
*
* For use with Phaser.Tween
*/
module Phaser.Easing {
    class Cubic {
        static In(k): number;
        static Out(k): number;
        static InOut(k): number;
    }
}
/**
* Phaser - Easing - Elastic
*
* For use with Phaser.Tween
*/
module Phaser.Easing {
    class Elastic {
        static In(k): number;
        static Out(k): number;
        static InOut(k): number;
    }
}
/**
* Phaser - Easing - Exponential
*
* For use with Phaser.Tween
*/
module Phaser.Easing {
    class Exponential {
        static In(k): number;
        static Out(k): number;
        static InOut(k): number;
    }
}
/**
* Phaser - Easing - Linear
*
* For use with Phaser.Tween
*/
module Phaser.Easing {
    class Linear {
        static None(k);
    }
}
/**
* Phaser - Easing - Quadratic
*
* For use with Phaser.Tween
*/
module Phaser.Easing {
    class Quadratic {
        static In(k): number;
        static Out(k): number;
        static InOut(k): number;
    }
}
/**
* Phaser - Easing - Quartic
*
* For use with Phaser.Tween
*/
module Phaser.Easing {
    class Quartic {
        static In(k): number;
        static Out(k): number;
        static InOut(k): number;
    }
}
/**
* Phaser - Easing - Quintic
*
* For use with Phaser.Tween
*/
module Phaser.Easing {
    class Quintic {
        static In(k): number;
        static Out(k): number;
        static InOut(k): number;
    }
}
/**
* Phaser - Easing - Sinusoidal
*
* For use with Phaser.Tween
*/
module Phaser.Easing {
    class Sinusoidal {
        static In(k): number;
        static Out(k): number;
        static InOut(k): number;
    }
}
/**
* Phaser - Tween
*
* Based heavily on tween.js by sole (https://github.com/sole/tween.js) converted to TypeScript and integrated into Phaser
*/
module Phaser {
    class Tween {
        constructor(object, game: Game);
        private _game;
        private _manager;
        private _object;
        private _pausedTime;
        private _valuesStart;
        private _valuesEnd;
        private _duration;
        private _delayTime;
        private _startTime;
        private _easingFunction;
        private _interpolationFunction;
        private _chainedTweens;
        public onStart: Signal;
        public onUpdate: Signal;
        public onComplete: Signal;
        public to(properties, duration?: number, ease?: any, autoStart?: bool): Tween;
        public start(): Tween;
        public stop(): Tween;
        public parent : Game;
        public delay : number;
        public easing : any;
        public interpolation : any;
        public chain(tween: Tween): Tween;
        public debugValue;
        public update(time): bool;
    }
}
/**
* Phaser - TweenManager
*
* The Game has a single instance of the TweenManager through which all Tween objects are created and updated.
* Tweens are hooked into the game clock and pause system, adjusting based on the game state.
* TweenManager is based heavily on tween.js by sole (http://soledadpenades.com).
* I converted it to TypeScript, swapped the callbacks for signals and patched a few issues with regard
* to properties and completion errors. Please see https://github.com/sole/tween.js for a full list of contributors.
*/
module Phaser {
    class TweenManager {
        constructor(game: Game);
        private _game;
        private _tweens;
        public getAll(): Tween[];
        public removeAll(): void;
        public create(object): Tween;
        public add(tween: Tween): Tween;
        public remove(tween: Tween): void;
        public update(): bool;
    }
}
/**
* Phaser - World
*
* A game has only one world. The world is an abstract place in which all game objects live. It is not bound
* by stage limits and can be any size or dimension. You look into the world via cameras and all game objects
* live within the world at world-based coordinates. By default a world is created the same size as your Stage.
*/
module Phaser {
    class World {
        constructor(game: Game, width: number, height: number);
        private _game;
        public cameras: CameraManager;
        public group: Group;
        public bounds: Rectangle;
        public worldDivisions: number;
        public update(): void;
        public render(): void;
        public destroy(): void;
        public setSize(width: number, height: number, updateCameraBounds?: bool): void;
        public width : number;
        public height : number;
        public centerX : number;
        public centerY : number;
        public randomX : number;
        public randomY : number;
        public createCamera(x: number, y: number, width: number, height: number): Camera;
        public removeCamera(id: number): bool;
        public getAllCameras(): Camera[];
        public createSprite(x: number, y: number, key?: string): Sprite;
        public createGeomSprite(x: number, y: number): GeomSprite;
        public createDynamicTexture(width: number, height: number): DynamicTexture;
        public createGroup(MaxSize?: number): Group;
        public createScrollZone(key: string, x?: number, y?: number, width?: number, height?: number): ScrollZone;
        public createTilemap(key: string, mapData: string, format: number, resizeWorld?: bool, tileWidth?: number, tileHeight?: number): Tilemap;
        public createParticle(): Particle;
        public createEmitter(x?: number, y?: number, size?: number): Emitter;
    }
}
/**
* Phaser - Device
*
* Detects device support capabilities. Using some elements from System.js by MrDoob and Modernizr
* https://github.com/Modernizr/Modernizr/blob/master/feature-detects/audio.js
*/
module Phaser {
    class Device {
        /**
        *
        * @constructor
        * @return {Device} This Object
        */
        constructor();
        public desktop: bool;
        /**
        *
        * @property iOS
        * @type Boolean
        */
        public iOS: bool;
        /**
        *
        * @property android
        * @type Boolean
        */
        public android: bool;
        /**
        *
        * @property chromeOS
        * @type Boolean
        */
        public chromeOS: bool;
        /**
        *
        * @property linux
        * @type Boolean
        */
        public linux: bool;
        /**
        *
        * @property maxOS
        * @type Boolean
        */
        public macOS: bool;
        /**
        *
        * @property windows
        * @type Boolean
        */
        public windows: bool;
        /**
        *
        * @property canvas
        * @type Boolean
        */
        public canvas: bool;
        /**
        *
        * @property file
        * @type Boolean
        */
        public file: bool;
        /**
        *
        * @property fileSystem
        * @type Boolean
        */
        public fileSystem: bool;
        /**
        *
        * @property localStorage
        * @type Boolean
        */
        public localStorage: bool;
        /**
        *
        * @property webGL
        * @type Boolean
        */
        public webGL: bool;
        /**
        *
        * @property worker
        * @type Boolean
        */
        public worker: bool;
        /**
        *
        * @property touch
        * @type Boolean
        */
        public touch: bool;
        /**
        *
        * @property css3D
        * @type Boolean
        */
        public css3D: bool;
        /**
        *
        * @property arora
        * @type Boolean
        */
        public arora: bool;
        /**
        *
        * @property chrome
        * @type Boolean
        */
        public chrome: bool;
        /**
        *
        * @property epiphany
        * @type Boolean
        */
        public epiphany: bool;
        /**
        *
        * @property firefox
        * @type Boolean
        */
        public firefox: bool;
        /**
        *
        * @property ie
        * @type Boolean
        */
        public ie: bool;
        /**
        *
        * @property ieVersion
        * @type Number
        */
        public ieVersion: number;
        /**
        *
        * @property mobileSafari
        * @type Boolean
        */
        public mobileSafari: bool;
        /**
        *
        * @property midori
        * @type Boolean
        */
        public midori: bool;
        /**
        *
        * @property opera
        * @type Boolean
        */
        public opera: bool;
        /**
        *
        * @property safari
        * @type Boolean
        */
        public safari: bool;
        public webApp: bool;
        /**
        *
        * @property audioData
        * @type Boolean
        */
        public audioData: bool;
        /**
        *
        * @property webaudio
        * @type Boolean
        */
        public webaudio: bool;
        /**
        *
        * @property ogg
        * @type Boolean
        */
        public ogg: bool;
        /**
        *
        * @property mp3
        * @type Boolean
        */
        public mp3: bool;
        /**
        *
        * @property wav
        * @type Boolean
        */
        public wav: bool;
        /**
        *
        * @property m4a
        * @type Boolean
        */
        public m4a: bool;
        /**
        *
        * @property iPhone
        * @type Boolean
        */
        public iPhone: bool;
        /**
        *
        * @property iPhone4
        * @type Boolean
        */
        public iPhone4: bool;
        /**
        *
        * @property iPad
        * @type Boolean
        */
        public iPad: bool;
        /**
        *
        * @property pixelRatio
        * @type Number
        */
        public pixelRatio: number;
        /**
        *
        * @method _checkOS
        * @private
        */
        private _checkOS();
        /**
        *
        * @method _checkFeatures
        * @private
        */
        private _checkFeatures();
        /**
        *
        * @method _checkBrowser
        * @private
        */
        private _checkBrowser();
        /**
        *
        * @method _checkAudio
        * @private
        */
        private _checkAudio();
        /**
        *
        * @method _checkDevice
        * @private
        */
        private _checkDevice();
        /**
        *
        * @method _checkCSS3D
        * @private
        */
        private _checkCSS3D();
        /**
        *
        * @method getAll
        * @return {String}
        */
        public getAll(): string;
    }
}
/**
* Phaser - RandomDataGenerator
*
* An extremely useful repeatable random data generator. Access it via Game.rnd
* Based on Nonsense by Josh Faul https://github.com/jocafa/Nonsense
* Random number generator from http://baagoe.org/en/wiki/Better_random_numbers_for_javascript
*/
module Phaser {
    class RandomDataGenerator {
        /**
        * @constructor
        * @param {Array} seeds
        * @return {Phaser.RandomDataGenerator}
        */
        constructor(seeds?: string[]);
        /**
        * @property s0
        * @type Any
        * @private
        */
        private s0;
        /**
        * @property s1
        * @type Any
        * @private
        */
        private s1;
        /**
        * @property s2
        * @type Any
        * @private
        */
        private s2;
        /**
        * @property c
        * @type Number
        * @private
        */
        private c;
        /**
        * @method uint32
        * @private
        */
        private uint32();
        /**
        * @method fract32
        * @private
        */
        private fract32();
        /**
        * @method rnd
        * @private
        */
        private rnd();
        /**
        * @method hash
        * @param {Any} data
        * @private
        */
        private hash(data);
        /**
        * Reset the seed of the random data generator
        * @method sow
        * @param {Array} seeds
        */
        public sow(seeds?: string[]): void;
        /**
        * Returns a random integer between 0 and 2^32
        * @method integer
        * @return {Number}
        */
        public integer : number;
        /**
        * Returns a random real number between 0 and 1
        * @method frac
        * @return {Number}
        */
        public frac : number;
        /**
        * Returns a random real number between 0 and 2^32
        * @method real
        * @return {Number}
        */
        public real : number;
        /**
        * Returns a random integer between min and max
        * @method integerInRange
        * @param {Number} min
        * @param {Number} max
        * @return {Number}
        */
        public integerInRange(min: number, max: number): number;
        /**
        * Returns a random real number between min and max
        * @method realInRange
        * @param {Number} min
        * @param {Number} max
        * @return {Number}
        */
        public realInRange(min: number, max: number): number;
        /**
        * Returns a random real number between -1 and 1
        * @method normal
        * @return {Number}
        */
        public normal : number;
        /**
        * Returns a valid v4 UUID hex string (from https://gist.github.com/1308368)
        * @method uuid
        * @return {String}
        */
        public uuid : string;
        /**
        * Returns a random member of `array`
        * @method pick
        * @param {Any} array
        */
        public pick(array);
        /**
        * Returns a random member of `array`, favoring the earlier entries
        * @method weightedPick
        * @param {Any} array
        */
        public weightedPick(array);
        /**
        * Returns a random timestamp between min and max, or between the beginning of 2000 and the end of 2020 if min and max aren't specified
        * @method timestamp
        * @param {Number} min
        * @param {Number} max
        */
        public timestamp(min?: number, max?: number): number;
        /**
        * Returns a random angle between -180 and 180
        * @method angle
        */
        public angle : number;
    }
}
/**
* Phaser - RequestAnimationFrame
*
* Abstracts away the use of RAF or setTimeOut for the core game update loop. The callback can be re-mapped on the fly.
*/
module Phaser {
    class RequestAnimationFrame {
        /**
        * Constructor
        * @param {Any} callback
        * @return {RequestAnimationFrame} This object.
        */
        constructor(callback, callbackContext);
        /**
        *
        * @property _callback
        * @type Any
        * @private
        **/
        private _callback;
        private _callbackContext;
        /**
        *
        * @method callback
        * @param {Any} callback
        **/
        public setCallback(callback): void;
        /**
        *
        * @property _timeOutID
        * @type Any
        * @private
        **/
        private _timeOutID;
        /**
        *
        * @property _isSetTimeOut
        * @type Boolean
        * @private
        **/
        private _isSetTimeOut;
        /**
        *
        * @method usingSetTimeOut
        * @return Boolean
        **/
        public isUsingSetTimeOut(): bool;
        /**
        *
        * @method usingRAF
        * @return Boolean
        **/
        public isUsingRAF(): bool;
        /**
        *
        * @property lastTime
        * @type Number
        **/
        public lastTime: number;
        /**
        *
        * @property currentTime
        * @type Number
        **/
        public currentTime: number;
        /**
        *
        * @property isRunning
        * @type Boolean
        **/
        public isRunning: bool;
        /**
        *
        * @method start
        * @param {Any} [callback]
        **/
        public start(callback?): void;
        /**
        *
        * @method stop
        **/
        public stop(): void;
        public RAFUpdate(): void;
        /**
        *
        * @method SetTimeoutUpdate
        **/
        public SetTimeoutUpdate(): void;
    }
}
/**
* Phaser - Input
*
* A game specific Input manager that looks after the mouse, keyboard and touch objects. This is updated by the core game loop.
*/
module Phaser {
    class Input {
        constructor(game: Game);
        private _game;
        public mouse: Mouse;
        public keyboard: Keyboard;
        public touch: Touch;
        public x: number;
        public y: number;
        public scaleX: number;
        public scaleY: number;
        public worldX: number;
        public worldY: number;
        public onDown: Signal;
        public onUp: Signal;
        public update(): void;
        public reset(): void;
        public getWorldX(camera?: Camera): number;
        public getWorldY(camera?: Camera): number;
        public renderDebugInfo(x: number, y: number, color?: string): void;
    }
}
/**
* Phaser - Keyboard
*
* The Keyboard class handles keyboard interactions with the game and the resulting events.
* The avoid stealing all browser input we don't use event.preventDefault. If you would like to trap a specific key however
* then use the addKeyCapture() method.
*/
module Phaser {
    class Keyboard {
        constructor(game: Game);
        private _game;
        private _keys;
        private _capture;
        public start(): void;
        public addKeyCapture(keycode): void;
        public removeKeyCapture(keycode: number): void;
        public clearCaptures(): void;
        public onKeyDown(event: KeyboardEvent): void;
        public onKeyUp(event: KeyboardEvent): void;
        public reset(): void;
        public justPressed(keycode: number, duration?: number): bool;
        public justReleased(keycode: number, duration?: number): bool;
        public isDown(keycode: number): bool;
        static A: number;
        static B: number;
        static C: number;
        static D: number;
        static E: number;
        static F: number;
        static G: number;
        static H: number;
        static I: number;
        static J: number;
        static K: number;
        static L: number;
        static M: number;
        static N: number;
        static O: number;
        static P: number;
        static Q: number;
        static R: number;
        static S: number;
        static T: number;
        static U: number;
        static V: number;
        static W: number;
        static X: number;
        static Y: number;
        static Z: number;
        static ZERO: number;
        static ONE: number;
        static TWO: number;
        static THREE: number;
        static FOUR: number;
        static FIVE: number;
        static SIX: number;
        static SEVEN: number;
        static EIGHT: number;
        static NINE: number;
        static NUMPAD_0: number;
        static NUMPAD_1: number;
        static NUMPAD_2: number;
        static NUMPAD_3: number;
        static NUMPAD_4: number;
        static NUMPAD_5: number;
        static NUMPAD_6: number;
        static NUMPAD_7: number;
        static NUMPAD_8: number;
        static NUMPAD_9: number;
        static NUMPAD_MULTIPLY: number;
        static NUMPAD_ADD: number;
        static NUMPAD_ENTER: number;
        static NUMPAD_SUBTRACT: number;
        static NUMPAD_DECIMAL: number;
        static NUMPAD_DIVIDE: number;
        static F1: number;
        static F2: number;
        static F3: number;
        static F4: number;
        static F5: number;
        static F6: number;
        static F7: number;
        static F8: number;
        static F9: number;
        static F10: number;
        static F11: number;
        static F12: number;
        static F13: number;
        static F14: number;
        static F15: number;
        static COLON: number;
        static EQUALS: number;
        static UNDERSCORE: number;
        static QUESTION_MARK: number;
        static TILDE: number;
        static OPEN_BRACKET: number;
        static BACKWARD_SLASH: number;
        static CLOSED_BRACKET: number;
        static QUOTES: number;
        static BACKSPACE: number;
        static TAB: number;
        static CLEAR: number;
        static ENTER: number;
        static SHIFT: number;
        static CONTROL: number;
        static ALT: number;
        static CAPS_LOCK: number;
        static ESC: number;
        static SPACEBAR: number;
        static PAGE_UP: number;
        static PAGE_DOWN: number;
        static END: number;
        static HOME: number;
        static LEFT: number;
        static UP: number;
        static RIGHT: number;
        static DOWN: number;
        static INSERT: number;
        static DELETE: number;
        static HELP: number;
        static NUM_LOCK: number;
    }
}
/**
* Phaser - Mouse
*
* The Mouse class handles mouse interactions with the game and the resulting events.
*/
module Phaser {
    class Mouse {
        constructor(game: Game);
        private _game;
        private _x;
        private _y;
        public button: number;
        static LEFT_BUTTON: number;
        static MIDDLE_BUTTON: number;
        static RIGHT_BUTTON: number;
        public isDown: bool;
        public isUp: bool;
        public timeDown: number;
        public duration: number;
        public timeUp: number;
        public start(): void;
        public reset(): void;
        public onMouseDown(event: MouseEvent): void;
        public update(): void;
        public onMouseMove(event: MouseEvent): void;
        public onMouseUp(event: MouseEvent): void;
    }
}
/**
* Phaser - Finger
*
* A Finger object is used by the Touch manager and represents a single finger on the touch screen.
*/
module Phaser {
    class Finger {
        /**
        * Constructor
        * @param {Phaser.Game} game.
        * @return {Phaser.Finger} This object.
        */
        constructor(game: Game);
        /**
        *
        * @property _game
        * @type Phaser.Game
        * @private
        **/
        private _game;
        /**
        * An identification number for each touch point. When a touch point becomes active, it must be assigned an identifier that is distinct from any other active touch point. While the touch point remains active, all events that refer to it must assign it the same identifier.
        * @property identifier
        * @type Number
        */
        public identifier: number;
        /**
        *
        * @property active
        * @type Boolean
        */
        public active: bool;
        /**
        *
        * @property point
        * @type Point
        **/
        public point: Point;
        /**
        *
        * @property circle
        * @type Circle
        **/
        public circle: Circle;
        /**
        *
        * @property withinGame
        * @type Boolean
        */
        public withinGame: bool;
        /**
        * The horizontal coordinate of point relative to the viewport in pixels, excluding any scroll offset
        * @property clientX
        * @type Number
        */
        public clientX: number;
        /**
        * The vertical coordinate of point relative to the viewport in pixels, excluding any scroll offset
        * @property clientY
        * @type Number
        */
        public clientY: number;
        /**
        * The horizontal coordinate of point relative to the viewport in pixels, including any scroll offset
        * @property pageX
        * @type Number
        */
        public pageX: number;
        /**
        * The vertical coordinate of point relative to the viewport in pixels, including any scroll offset
        * @property pageY
        * @type Number
        */
        public pageY: number;
        /**
        * The horizontal coordinate of point relative to the screen in pixels
        * @property screenX
        * @type Number
        */
        public screenX: number;
        /**
        * The vertical coordinate of point relative to the screen in pixels
        * @property screenY
        * @type Number
        */
        public screenY: number;
        /**
        * The horizontal coordinate of point relative to the game element
        * @property x
        * @type Number
        */
        public x: number;
        /**
        * The vertical coordinate of point relative to the game element
        * @property y
        * @type Number
        */
        public y: number;
        /**
        * The Element on which the touch point started when it was first placed on the surface, even if the touch point has since moved outside the interactive area of that element.
        * @property target
        * @type Any
        */
        public target;
        /**
        *
        * @property isDown
        * @type Boolean
        **/
        public isDown: bool;
        /**
        *
        * @property isUp
        * @type Boolean
        **/
        public isUp: bool;
        /**
        *
        * @property timeDown
        * @type Number
        **/
        public timeDown: number;
        /**
        *
        * @property duration
        * @type Number
        **/
        public duration: number;
        /**
        *
        * @property timeUp
        * @type Number
        **/
        public timeUp: number;
        /**
        *
        * @property justPressedRate
        * @type Number
        **/
        public justPressedRate: number;
        /**
        *
        * @property justReleasedRate
        * @type Number
        **/
        public justReleasedRate: number;
        /**
        *
        * @method start
        * @param {Any} event
        */
        public start(event): void;
        /**
        *
        * @method move
        * @param {Any} event
        */
        public move(event): void;
        /**
        *
        * @method leave
        * @param {Any} event
        */
        public leave(event): void;
        /**
        *
        * @method stop
        * @param {Any} event
        */
        public stop(event): void;
        /**
        *
        * @method justPressed
        * @param {Number} [duration].
        * @return {Boolean}
        */
        public justPressed(duration?: number): bool;
        /**
        *
        * @method justReleased
        * @param {Number} [duration].
        * @return {Boolean}
        */
        public justReleased(duration?: number): bool;
        /**
        * Returns a string representation of this object.
        * @method toString
        * @return {string} a string representation of the instance.
        **/
        public toString(): string;
    }
}
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
module Phaser {
    class Touch {
        /**
        * Constructor
        * @param {Game} game.
        * @return {Touch} This object.
        */
        constructor(game: Game);
        /**
        *
        * @property _game
        * @type Game
        * @private
        **/
        private _game;
        /**
        *
        * @property x
        * @type Number
        **/
        public x: number;
        /**
        *
        * @property y
        * @type Number
        **/
        public y: number;
        /**
        *
        * @property _fingers
        * @type Array
        * @private
        **/
        private _fingers;
        /**
        *
        * @property finger1
        * @type Finger
        **/
        public finger1: Finger;
        /**
        *
        * @property finger2
        * @type Finger
        **/
        public finger2: Finger;
        /**
        *
        * @property finger3
        * @type Finger
        **/
        public finger3: Finger;
        /**
        *
        * @property finger4
        * @type Finger
        **/
        public finger4: Finger;
        /**
        *
        * @property finger5
        * @type Finger
        **/
        public finger5: Finger;
        /**
        *
        * @property finger6
        * @type Finger
        **/
        public finger6: Finger;
        /**
        *
        * @property finger7
        * @type Finger
        **/
        public finger7: Finger;
        /**
        *
        * @property finger8
        * @type Finger
        **/
        public finger8: Finger;
        /**
        *
        * @property finger9
        * @type Finger
        **/
        public finger9: Finger;
        /**
        *
        * @property finger10
        * @type Finger
        **/
        public finger10: Finger;
        /**
        *
        * @property latestFinger
        * @type Finger
        **/
        public latestFinger: Finger;
        /**
        *
        * @property isDown
        * @type Boolean
        **/
        public isDown: bool;
        /**
        *
        * @property isUp
        * @type Boolean
        **/
        public isUp: bool;
        public touchDown: Signal;
        public touchUp: Signal;
        /**
        *
        * @method start
        */
        public start(): void;
        /**
        * Prevent iOS bounce-back (doesn't work?)
        * @method consumeTouchMove
        * @param {Any} event
        **/
        private consumeTouchMove(event);
        /**
        *
        * @method onTouchStart
        * @param {Any} event
        **/
        private onTouchStart(event);
        /**
        * Doesn't appear to be supported by most browsers yet
        * @method onTouchCancel
        * @param {Any} event
        **/
        private onTouchCancel(event);
        /**
        * Doesn't appear to be supported by most browsers yet
        * @method onTouchEnter
        * @param {Any} event
        **/
        private onTouchEnter(event);
        /**
        * Doesn't appear to be supported by most browsers yet
        * @method onTouchLeave
        * @param {Any} event
        **/
        private onTouchLeave(event);
        /**
        *
        * @method onTouchMove
        * @param {Any} event
        **/
        private onTouchMove(event);
        /**
        *
        * @method onTouchEnd
        * @param {Any} event
        **/
        private onTouchEnd(event);
        /**
        *
        * @method calculateDistance
        * @param {Finger} finger1
        * @param {Finger} finger2
        **/
        public calculateDistance(finger1: Finger, finger2: Finger): void;
        /**
        *
        * @method calculateAngle
        * @param {Finger} finger1
        * @param {Finger} finger2
        **/
        public calculateAngle(finger1: Finger, finger2: Finger): void;
        /**
        *
        * @method checkOverlap
        * @param {Finger} finger1
        * @param {Finger} finger2
        **/
        public checkOverlap(finger1: Finger, finger2: Finger): void;
        /**
        *
        * @method update
        */
        public update(): void;
        /**
        *
        * @method stop
        */
        public stop(): void;
        /**
        *
        * @method reset
        **/
        public reset(): void;
    }
}
/**
* Phaser - Emitter
*
* Emitter is a lightweight particle emitter. It can be used for one-time explosions or for
* continuous effects like rain and fire. All it really does is launch Particle objects out
* at set intervals, and fixes their positions and velocities accorindgly.
*/
module Phaser {
    class Emitter extends Group {
        /**
        * Creates a new <code>Emitter</code> object at a specific position.
        * Does NOT automatically generate or attach particles!
        *
        * @param	X		The X position of the emitter.
        * @param	Y		The Y position of the emitter.
        * @param	Size	Optional, specifies a maximum capacity for this emitter.
        */
        constructor(game: Game, X?: number, Y?: number, Size?: number);
        /**
        * The X position of the top left corner of the emitter in world space.
        */
        public x: number;
        /**
        * The Y position of the top left corner of emitter in world space.
        */
        public y: number;
        /**
        * The width of the emitter.  Particles can be randomly generated from anywhere within this box.
        */
        public width: number;
        /**
        * The height of the emitter.  Particles can be randomly generated from anywhere within this box.
        */
        public height: number;
        /**
        * The minimum possible velocity of a particle.
        * The default value is (-100,-100).
        */
        public minParticleSpeed: MicroPoint;
        /**
        * The maximum possible velocity of a particle.
        * The default value is (100,100).
        */
        public maxParticleSpeed: MicroPoint;
        /**
        * The X and Y drag component of particles launched from the emitter.
        */
        public particleDrag: MicroPoint;
        /**
        * The minimum possible angular velocity of a particle.  The default value is -360.
        * NOTE: rotating particles are more expensive to draw than non-rotating ones!
        */
        public minRotation: number;
        /**
        * The maximum possible angular velocity of a particle.  The default value is 360.
        * NOTE: rotating particles are more expensive to draw than non-rotating ones!
        */
        public maxRotation: number;
        /**
        * Sets the <code>acceleration.y</code> member of each particle to this value on launch.
        */
        public gravity: number;
        /**
        * Determines whether the emitter is currently emitting particles.
        * It is totally safe to directly toggle this.
        */
        public on: bool;
        /**
        * How often a particle is emitted (if emitter is started with Explode == false).
        */
        public frequency: number;
        /**
        * How long each particle lives once it is emitted.
        * Set lifespan to 'zero' for particles to live forever.
        */
        public lifespan: number;
        /**
        * How much each particle should bounce.  1 = full bounce, 0 = no bounce.
        */
        public bounce: number;
        /**
        * Set your own particle class type here.
        * Default is <code>Particle</code>.
        */
        public particleClass;
        /**
        * Internal helper for deciding how many particles to launch.
        */
        private _quantity;
        /**
        * Internal helper for the style of particle emission (all at once, or one at a time).
        */
        private _explode;
        /**
        * Internal helper for deciding when to launch particles or kill them.
        */
        private _timer;
        /**
        * Internal counter for figuring out how many particles to launch.
        */
        private _counter;
        /**
        * Internal point object, handy for reusing for memory mgmt purposes.
        */
        private _point;
        /**
        * Clean up memory.
        */
        public destroy(): void;
        /**
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
        public makeParticles(Graphics, Quantity?: number, BakedRotations?: number, Multiple?: bool, Collide?: number): Emitter;
        /**
        * Called automatically by the game loop, decides when to launch particles and when to "die".
        */
        public update(): void;
        /**
        * Call this function to turn off all the particles and the emitter.
        */
        public kill(): void;
        /**
        * Call this function to start emitting particles.
        *
        * @param	Explode		Whether the particles should all burst out at once.
        * @param	Lifespan	How long each particle lives once emitted. 0 = forever.
        * @param	Frequency	Ignored if Explode is set to true. Frequency is how often to emit a particle. 0 = never emit, 0.1 = 1 particle every 0.1 seconds, 5 = 1 particle every 5 seconds.
        * @param	Quantity	How many particles to launch. 0 = "all of the particles".
        */
        public start(Explode?: bool, Lifespan?: number, Frequency?: number, Quantity?: number): void;
        /**
        * This function can be used both internally and externally to emit the next particle.
        */
        public emitParticle(): void;
        /**
        * A more compact way of setting the width and height of the emitter.
        *
        * @param	Width	The desired width of the emitter (particles are spawned randomly within these dimensions).
        * @param	Height	The desired height of the emitter.
        */
        public setSize(Width: number, Height: number): void;
        /**
        * A more compact way of setting the X velocity range of the emitter.
        *
        * @param	Min		The minimum value for this range.
        * @param	Max		The maximum value for this range.
        */
        public setXSpeed(Min?: number, Max?: number): void;
        /**
        * A more compact way of setting the Y velocity range of the emitter.
        *
        * @param	Min		The minimum value for this range.
        * @param	Max		The maximum value for this range.
        */
        public setYSpeed(Min?: number, Max?: number): void;
        /**
        * A more compact way of setting the angular velocity constraints of the emitter.
        *
        * @param	Min		The minimum value for this range.
        * @param	Max		The maximum value for this range.
        */
        public setRotation(Min?: number, Max?: number): void;
        /**
        * Change the emitter's midpoint to match the midpoint of a <code>Object</code>.
        *
        * @param	Object		The <code>Object</code> that you want to sync up with.
        */
        public at(Object): void;
    }
}
/**
* Phaser - GeomSprite
*
* A GeomSprite is a special kind of GameObject that contains a base geometry class (Circle, Line, Point, Rectangle).
* They can be rendered in the game and used for collision just like any other game object. Display of them is controlled
* via the lineWidth / lineColor / fillColor and renderOutline / renderFill properties.
*/
module Phaser {
    class GeomSprite extends GameObject {
        constructor(game: Game, x?: number, y?: number);
        private _dx;
        private _dy;
        private _dw;
        private _dh;
        public type: number;
        static UNASSIGNED: number;
        static CIRCLE: number;
        static LINE: number;
        static POINT: number;
        static RECTANGLE: number;
        public circle: Circle;
        public line: Line;
        public point: Point;
        public rect: Rectangle;
        public renderOutline: bool;
        public renderFill: bool;
        public lineWidth: number;
        public lineColor: string;
        public fillColor: string;
        public loadCircle(circle: Circle): GeomSprite;
        public loadLine(line: Line): GeomSprite;
        public loadPoint(point: Point): GeomSprite;
        public loadRectangle(rect: Rectangle): GeomSprite;
        public createCircle(diameter: number): GeomSprite;
        public createLine(x: number, y: number): GeomSprite;
        public createPoint(): GeomSprite;
        public createRectangle(width: number, height: number): GeomSprite;
        public refresh(): void;
        public update(): void;
        public inCamera(camera: Rectangle): bool;
        public render(camera: Camera, cameraOffsetX: number, cameraOffsetY: number): bool;
        public renderPoint(point, offsetX?: number, offsetY?: number, size?: number): void;
        public renderDebugInfo(x: number, y: number, color?: string): void;
        public collide(source: GeomSprite): bool;
    }
}
/**
* Phaser - Particle
*
* This is a simple particle class that extends a Sprite to have a slightly more
* specialised behaviour. It is used exclusively by the Emitter class and can be extended as required.
*/
module Phaser {
    class Particle extends Sprite {
        /**
        * Instantiate a new particle.  Like <code>Sprite</code>, all meaningful creation
        * happens during <code>loadGraphic()</code> or <code>makeGraphic()</code> or whatever.
        */
        constructor(game: Game);
        /**
        * How long this particle lives before it disappears.
        * NOTE: this is a maximum, not a minimum; the object
        * could get recycled before its lifespan is up.
        */
        public lifespan: number;
        /**
        * Determines how quickly the particles come to rest on the ground.
        * Only used if the particle has gravity-like acceleration applied.
        * @default 500
        */
        public friction: number;
        /**
        * The particle's main update logic.  Basically it checks to see if it should
        * be dead yet, and then has some special bounce behavior if there is some gravity on it.
        */
        public update(): void;
        /**
        * Triggered whenever this object is launched by a <code>Emitter</code>.
        * You can override this to add custom behavior like a sound or AI or something.
        */
        public onEmit(): void;
    }
}
/**
* Phaser - TilemapLayer
*
* A Tilemap Layer. Tiled format maps can have multiple overlapping layers.
*/
module Phaser {
    class TilemapLayer {
        constructor(game: Game, parent: Tilemap, key: string, mapFormat: number, name: string, tileWidth: number, tileHeight: number);
        private _game;
        private _parent;
        private _texture;
        private _tileOffsets;
        private _startX;
        private _startY;
        private _maxX;
        private _maxY;
        private _tx;
        private _ty;
        private _dx;
        private _dy;
        private _oldCameraX;
        private _oldCameraY;
        private _columnData;
        private _tempTileX;
        private _tempTileY;
        private _tempTileW;
        private _tempTileH;
        private _tempTileBlock;
        private _tempBlockResults;
        public name: string;
        public alpha: number;
        public exists: bool;
        public visible: bool;
        public orientation: string;
        public properties: {};
        public mapData;
        public mapFormat: number;
        public boundsInTiles: Rectangle;
        public tileWidth: number;
        public tileHeight: number;
        public widthInTiles: number;
        public heightInTiles: number;
        public widthInPixels: number;
        public heightInPixels: number;
        public tileMargin: number;
        public tileSpacing: number;
        public getTileFromWorldXY(x: number, y: number): number;
        public getTileOverlaps(object: GameObject);
        public getTileBlock(x: number, y: number, width: number, height: number): void;
        public getTileIndex(x: number, y: number): number;
        public addColumn(column): void;
        public updateBounds(): void;
        public parseTileOffsets(): number;
        public renderDebugInfo(x: number, y: number, color?: string): void;
        public render(camera: Camera, dx, dy): bool;
    }
}
/**
* Phaser - Tile
*
* A Tile is a single representation of a tile within a Tilemap
*/
module Phaser {
    class Tile {
        constructor(game: Game, tilemap: Tilemap, index: number, width: number, height: number);
        private _game;
        public name: string;
        public mass: number;
        public width: number;
        public height: number;
        public allowCollisions: number;
        public collideLeft: bool;
        public collideRight: bool;
        public collideUp: bool;
        public collideDown: bool;
        public separateX: bool;
        public separateY: bool;
        /**
        * A reference to the tilemap this tile object belongs to.
        */
        public tilemap: Tilemap;
        /**
        * The index of this tile type in the core map data.
        * For example, if your map only has 16 kinds of tiles in it,
        * this number is usually between 0 and 15.
        */
        public index: number;
        /**
        * Clean up memory.
        */
        public destroy(): void;
        public setCollision(collision: number, resetCollisions: bool, separateX: bool, separateY: bool): void;
        public resetCollision(): void;
        /**
        * Returns a string representation of this object.
        * @method toString
        * @return {string} a string representation of the object.
        **/
        public toString(): string;
    }
}
/**
* Phaser - Tilemap
*
* This GameObject allows for the display of a tilemap within the game world. Tile maps consist of an image, tile data and a size.
* Internally it creates a TilemapLayer for each layer in the tilemap.
*/
module Phaser {
    class Tilemap extends GameObject {
        constructor(game: Game, key: string, mapData: string, format: number, resizeWorld?: bool, tileWidth?: number, tileHeight?: number);
        private _tempCollisionData;
        static FORMAT_CSV: number;
        static FORMAT_TILED_JSON: number;
        public tiles: Tile[];
        public layers: TilemapLayer[];
        public currentLayer: TilemapLayer;
        public collisionLayer: TilemapLayer;
        public collisionCallback;
        public collisionCallbackContext;
        public mapFormat: number;
        public update(): void;
        public render(camera: Camera, cameraOffsetX: number, cameraOffsetY: number): void;
        private parseCSV(data, key, tileWidth, tileHeight);
        private parseTiledJSON(data, key);
        private generateTiles(qty);
        public widthInPixels : number;
        public heightInPixels : number;
        public setCollisionCallback(context, callback): void;
        public setCollisionRange(start: number, end: number, collision?: number, resetCollisions?: bool, separateX?: bool, separateY?: bool): void;
        public setCollisionByIndex(values: number[], collision?: number, resetCollisions?: bool, separateX?: bool, separateY?: bool): void;
        public getTileByIndex(value: number): Tile;
        public getTile(x: number, y: number, layer?: number): Tile;
        public getTileFromWorldXY(x: number, y: number, layer?: number): Tile;
        public getTileFromInputXY(layer?: number): Tile;
        public getTileOverlaps(object: GameObject);
        public collide(objectOrGroup?, callback?, context?): void;
        public collideGameObject(object: GameObject): bool;
    }
}
/**
* Phaser - ScrollRegion
*
* Creates a scrolling region within a ScrollZone.
* It is scrolled via the scrollSpeed.x/y properties.
*/
module Phaser {
    class ScrollRegion {
        constructor(x: number, y: number, width: number, height: number, speedX: number, speedY: number);
        private _A;
        private _B;
        private _C;
        private _D;
        private _bounds;
        private _scroll;
        private _anchorWidth;
        private _anchorHeight;
        private _inverseWidth;
        private _inverseHeight;
        public visible: bool;
        public scrollSpeed: MicroPoint;
        public update(delta: number): void;
        public render(context: CanvasRenderingContext2D, texture, dx: number, dy: number, dw: number, dh: number): void;
        private crop(context, texture, srcX, srcY, srcW, srcH, destX, destY, destW, destH, offsetX, offsetY);
    }
}
/**
* Phaser - ScrollZone
*
* Creates a scrolling region of the given width and height from an image in the cache.
* The ScrollZone can be positioned anywhere in-world like a normal game object, re-act to physics, collision, etc.
* The image within it is scrolled via ScrollRegions and their scrollSpeed.x/y properties.
* If you create a scroll zone larger than the given source image it will create a DynamicTexture and fill it with a pattern of the source image.
*/
module Phaser {
    class ScrollZone extends GameObject {
        constructor(game: Game, key: string, x?: number, y?: number, width?: number, height?: number);
        private _texture;
        private _dynamicTexture;
        private _dx;
        private _dy;
        private _dw;
        private _dh;
        public currentRegion: ScrollRegion;
        public regions: ScrollRegion[];
        public flipped: bool;
        public addRegion(x: number, y: number, width: number, height: number, speedX?: number, speedY?: number): ScrollRegion;
        public setSpeed(x: number, y: number): ScrollZone;
        public update(): void;
        public inCamera(camera: Rectangle): bool;
        public render(camera: Camera, cameraOffsetX: number, cameraOffsetY: number): bool;
        private createRepeatingTexture(regionWidth, regionHeight);
    }
}
/**
* Phaser - Game
*
* This is where the magic happens. The Game object is the heart of your game,
* providing quick access to common functions and handling the boot process.
*
* "Hell, there are no rules here - we're trying to accomplish something."
*                                                       Thomas A. Edison
*/
module Phaser {
    class Game {
        constructor(callbackContext, parent?: string, width?: number, height?: number, initCallback?, createCallback?, updateCallback?, renderCallback?);
        private _raf;
        private _maxAccumulation;
        private _accumulator;
        private _step;
        private _loadComplete;
        private _paused;
        private _pendingState;
        public callbackContext;
        public onInitCallback;
        public onCreateCallback;
        public onUpdateCallback;
        public onRenderCallback;
        public onPausedCallback;
        public cache: Cache;
        public collision: Collision;
        public input: Input;
        public loader: Loader;
        public math: GameMath;
        public motion: Motion;
        public sound: SoundManager;
        public stage: Stage;
        public time: Time;
        public tweens: TweenManager;
        public world: World;
        public rnd: RandomDataGenerator;
        public device: Device;
        public isBooted: bool;
        public isRunning: bool;
        private boot(parent, width, height);
        private loadComplete();
        private bootLoop();
        private pausedLoop();
        private loop();
        private startState();
        public setCallbacks(initCallback?, createCallback?, updateCallback?, renderCallback?): void;
        public switchState(state, clearWorld?: bool, clearCache?: bool): void;
        public destroy(): void;
        public paused : bool;
        public framerate : number;
        public createCamera(x: number, y: number, width: number, height: number): Camera;
        public createGeomSprite(x: number, y: number): GeomSprite;
        public createSprite(x: number, y: number, key?: string): Sprite;
        public createDynamicTexture(width: number, height: number): DynamicTexture;
        public createGroup(MaxSize?: number): Group;
        public createParticle(): Particle;
        public createEmitter(x?: number, y?: number, size?: number): Emitter;
        public createScrollZone(key: string, x?: number, y?: number, width?: number, height?: number): ScrollZone;
        public createTilemap(key: string, mapData: string, format: number, resizeWorld?: bool, tileWidth?: number, tileHeight?: number): Tilemap;
        public createTween(obj): Tween;
        public collide(objectOrGroup1?: Basic, objectOrGroup2?: Basic, notifyCallback?): bool;
        public camera : Camera;
    }
}
/**
* Phaser - FXManager
*
* The FXManager controls all special effects applied to game objects such as Cameras.
*/
module Phaser {
    class FXManager {
        constructor(game: Game, parent);
        /**
        * The essential reference to the main game object.
        */
        private _game;
        /**
        * A reference to the object that owns this FXManager instance.
        */
        private _parent;
        /**
        * The array in which we keep all of the registered FX
        */
        private _fx;
        /**
        * Holds the size of the _fx array
        */
        private _length;
        /**
        * Controls whether any of the FX have preUpdate, update or postUpdate called
        */
        public active: bool;
        /**
        * Controls whether any of the FX have preRender, render or postRender called
        */
        public visible: bool;
        /**
        * Adds a new FX to the FXManager.
        * The effect must be an object with at least one of the following methods: preUpdate, postUpdate, preRender, render or postRender.
        * A new instance of the effect will be created and a reference to Game will be passed to the object constructor.
        */
        public add(effect): any;
        /**
        * Pre-update is called at the start of the objects update cycle, before any other updates have taken place.
        */
        public preUpdate(): void;
        /**
        * Post-update is called at the end of the objects update cycle, after other update logic has taken place.
        */
        public postUpdate(): void;
        /**
        * Pre-render is called at the start of the object render cycle, before any transforms have taken place.
        * It happens directly AFTER a canvas context.save has happened if added to a Camera.
        */
        public preRender(camera: Camera, cameraX: number, cameraY: number, cameraWidth: number, cameraHeight: number): void;
        /**
        * render is called during the objects render cycle, right after all transforms have finished, but before any children/image data is rendered.
        */
        public render(camera: Camera, cameraX: number, cameraY: number, cameraWidth: number, cameraHeight: number): void;
        /**
        * Post-render is called during the objects render cycle, after the children/image data has been rendered.
        * It happens directly BEFORE a canvas context.restore has happened if added to a Camera.
        */
        public postRender(camera: Camera, cameraX: number, cameraY: number, cameraWidth: number, cameraHeight: number): void;
        /**
        * Clear down this FXManager and null out references
        */
        public destroy(): void;
    }
}
/**
* Phaser - State
*
* This is a base State class which can be extended if you are creating your game using TypeScript.
*/
module Phaser {
    class State {
        constructor(game: Game);
        public game: Game;
        public camera: Camera;
        public cache: Cache;
        public collision: Collision;
        public input: Input;
        public loader: Loader;
        public math: GameMath;
        public motion: Motion;
        public sound: SoundManager;
        public stage: Stage;
        public time: Time;
        public tweens: TweenManager;
        public world: World;
        public init(): void;
        public create(): void;
        public update(): void;
        public render(): void;
        public paused(): void;
        public createCamera(x: number, y: number, width: number, height: number): Camera;
        public createGeomSprite(x: number, y: number): GeomSprite;
        public createSprite(x: number, y: number, key?: string): Sprite;
        public createDynamicTexture(width: number, height: number): DynamicTexture;
        public createGroup(MaxSize?: number): Group;
        public createParticle(): Particle;
        public createEmitter(x?: number, y?: number, size?: number): Emitter;
        public createScrollZone(key: string, x?: number, y?: number, width?: number, height?: number): ScrollZone;
        public createTilemap(key: string, mapData: string, format: number, resizeWorld?: bool, tileWidth?: number, tileHeight?: number): Tilemap;
        public createTween(obj): Tween;
        public collide(ObjectOrGroup1?: Basic, ObjectOrGroup2?: Basic, NotifyCallback?): bool;
    }
}
