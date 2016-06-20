/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* The Weapon Plugin provides the ability to easily create a bullet pool and manager.
*
* Weapons fire Phaser.Bullet objects, which are essentially Sprites with a few extra properties.
* The Bullets are enabled for Arcade Physics. They do not currently work with P2 Physics.
*
* The Bullets are created inside of `Weapon.bullets`, which is a Phaser.Group instance. Anything you
* can usually do with a Group, such as move it around the display list, iterate it, etc can be done
* to the bullets Group too.
*
* Bullets can have textures and even animations. You can control the speed at which they are fired,
* the firing rate, the firing angle, and even set things like gravity for them.
*
* A small example, assumed to be running from within a Phaser.State create method.
*
* `var weapon = this.add.weapon(10, 'bullet');`
* `weapon.fireFrom.set(300, 300);`
* `this.input.onDown.add(weapon.fire, this);`
*
* @class Phaser.Weapon
* @constructor
* @param {Phaser.Game} game - A reference to the current Phaser.Game instance.
* @param {Phaser.PluginManager} parent - The Phaser Plugin Manager which looks after this plugin.
*/
Phaser.Weapon = function (game, parent) {

    Phaser.Plugin.call(this, game, parent);

    /**
     * This is the Phaser.Group that contains all of the bullets managed by this plugin.
     * @type {Phaser.Group}
     */
    this.bullets = null;

    /**
     * Should the bullet pool run out of bullets (i.e. they are all in flight) then this
     * boolean controls if the Group will create a brand new bullet object or not.
     * @type {boolean}
     */
    this.autoExpandBulletsGroup = false;

    /**
     * Will this weapon auto fire? If set to true then a new bullet will be fired
     * based on the `fireRate` value.
     * @type {boolean}
     */
    this.autofire = false;

    /**
     * The total number of bullets this Weapon has fired so far.
     * You can limit the number of shots allowed (via `fireLimit`), and reset
     * this total via `Weapon.resetShots`.
     * @type {number}
     */
    this.shots = 0;

    /**
     * The maximum number of shots that this Weapon is allowed to fire before it stops.
     * When the limit is his the `Weapon.onFireLimit` Signal is dispatched.
     * You can reset the shot counter via `Weapon.resetShots`.
     * @type {number}
     */
    this.fireLimit = 0;

    /**
     * The rate at which this Weapon can fire. The value is given in milliseconds.
     * @type {number}
     */
    this.fireRate = 100;

    /**
     * This is a modifier that is added to the `fireRate` each update to add variety
     * to the firing rate of the Weapon. The value is given in milliseconds.
     * If you've a `fireRate` of 200 and a `fireRateVariance` of 50 then the actual
     * firing rate of the Weapon will be between 150 and 250.
     * @type {number}
     */
    this.fireRateVariance = 0;

    /**
     * This is a Rectangle from within which the bullets are fired. By default it's a 1x1
     * rectangle, the equivalent of a Point. But you can change the width and height, and if
     * larger than 1x1 it'll pick a random point within the rectangle to launch the bullet from.
     * @type {Phaser.Rectangle}
     */
    this.fireFrom = new Phaser.Rectangle(0, 0, 1, 1);

    /**
     * The angle at which the bullets are fired. This can be a const such as Phaser.ANGLE_UP
     * or it can be any number from 0 to 360 inclusive, where 0 degrees is to the right.
     * @type {integer}
     */
    this.fireAngle = Phaser.ANGLE_UP;

    /**
     * When a Bullet is fired it can optionally inherit the velocity of the `trackedSprite` if set.
     * @type {boolean}
     */
    this.bulletInheritSpriteSpeed = false;

    /**
     * The string based name of the animation that the Bullet will be given on launch.
     * This is set via `Weapon.addBulletAnimation`.
     * @type {string}
     */
    this.bulletAnimation = '';

    /**
     * If you've added a set of frames via `Weapon.setBulletFrames` then you can optionally
     * chose for each Bullet fired to pick a random frame from the set.
     * @type {boolean}
     */
    this.bulletFrameRandom = false;

    /**
     * If you've added a set of frames via `Weapon.setBulletFrames` then you can optionally
     * chose for each Bullet fired to use the next frame in the set. The frame index is then
     * advanced one frame until it reaches the end of the set, then it starts from the start
     * again. Cycling frames like this allows you to create varied bullet effects via
     * sprite sheets.
     * @type {boolean}
     */
    this.bulletFrameCycle = false;

    /**
     * Should the Bullets wrap around the world bounds? This automatically calls
     * `World.wrap` on the Bullet each frame. See the docs for that method for details.
     * @type {boolean}
     */
    this.bulletWorldWrap = false;

    /**
     * If `bulletWorldWrap` is true then you can provide an optional padding value with this
     * property. It's added to the calculations determining when the Bullet should wrap around
     * the world or not. The value is given in pixels.
     * @type {integer}
     */
    this.bulletWorldWrapPadding = 0;

    /**
     * An optional angle offset applied to the Bullets when they are launched.
     * This is useful if for example your bullet sprites have been drawn facing up, instead of
     * to the right, and you want to fire them at an angle. In which case you can set the
     * angle offset to be 90 and they'll be properly rotated when fired.
     * @type {number}
     */
    this.bulletAngleOffset = 0;

    /**
     * This is a variance added to the angle of Bullets when they are fired.
     * If you fire from an angle of 90 and have a `bulletAngleVariance` of 20 then the actual
     * angle of the Bullets will be between 70 and 110 degrees. This is a quick way to add a
     * great 'spread' effect to a Weapon.
     * @type {number}
     */
    this.bulletAngleVariance = 0;

    /**
     * The speed at which the bullets are fired. This value is given in pixels per second, and
     * is used to set the starting velocity of the bullets.
     * @type {number}
     */
    this.bulletSpeed = 200;

    /**
     * This is a variance added to the speed of Bullets when they are fired.
     * If bullets have a `bulletSpeed` value of 200, and a `bulletSpeedVariance` of 50
     * then the actual speed of the Bullets will be between 150 and 250 pixels per second.
     * @type {number}
     */
    this.bulletSpeedVariance = 0;

    /**
     * If you've set `bulletKillType` to `Phaser.Weapon.KILL_LIFESPAN` this controls the amount
     * of lifespan the Bullets have set on launch. The value is given in milliseconds.
     * When a Bullet hits its lifespan limit it will be automatically killed.
     * @type {number}
     */
    this.bulletLifespan = 0;

    /**
     * If you've set `bulletKillType` to `Phaser.Weapon.KILL_DISTANCE` this controls the distance
     * the Bullet can travel before it is automatically killed. The distance is given in pixels.
     * @type {number}
     */
    this.bulletKillDistance = 0;

    /**
     * This is the amount of gravity added to the Bullets physics body when fired.
     * Gravity is expressed in pixels / second / second.
     * @type {Phaser.Point}
     */
    this.bulletGravity = new Phaser.Point(0, 0);

    /**
     * Bullets can optionally adjust their rotation in-flight to match their velocity.
     * This can create the effect of a bullet 'pointing' to the path it is following, for example
     * an arrow being fired from a bow, and works especially well when added to `bulletGravity`.
     * @type {boolean}
     */
    this.bulletRotateToVelocity = false;

    /**
     * The Texture Key that the Bullets use when rendering.
     * Changing this has no effect on bullets in-flight, only on newly spawned bullets.
     * @type {string}
     */
    this.bulletKey = '';

    /**
     * The Texture Frame that the Bullets use when rendering.
     * Changing this has no effect on bullets in-flight, only on newly spawned bullets.
     * @type {string|integer}
     */
    this.bulletFrame = '';

    /**
     * Private var that holds the public `bulletClass` property.
     * @type {object}
     * @private
     */
    this._bulletClass = Phaser.Bullet;

    /**
     * Private var that holds the public `bulletCollideWorldBounds` property.
     * @type {boolean}
     * @private
     */
    this._bulletCollideWorldBounds = false;

    /**
     * Private var that holds the public `bulletKillType` property.
     * @type {integer}
     * @private
     */
    this._bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;

    /**
     * Holds internal data about custom bullet body sizes.
     *
     * @type {Object}
     * @private
     */
    this._data = {
        customBody: false,
        width: 0,
        height: 0,
        offsetX: 0,
        offsetY: 0
    };

    /**
     * This Rectangle defines the bounds that are used when determining if a Bullet should be killed or not.
     * It's used in combination with `Weapon.bulletKillType` when that is set to either `Phaser.Weapon.KILL_WEAPON_BOUNDS`
     * or `Phaser.Weapon.KILL_STATIC_BOUNDS`. If you are not using either of these kill types then the bounds are ignored.
     * If you are tracking a Sprite or Point then the bounds are centered on that object every frame.
     *
     * @type {Phaser.Rectangle}
     */
    this.bounds = new Phaser.Rectangle();

    /**
     * The Rectangle used to calculate the bullet bounds from.
     *
     * @type {Phaser.Rectangle}
     * @private
     */
    this.bulletBounds = game.world.bounds;

    /**
     * This array stores the frames added via `Weapon.setBulletFrames`.
     *
     * @type {Array}
     * @protected
     */
    this.bulletFrames = [];

    /**
     * The index of the frame within `Weapon.bulletFrames` that is currently being used.
     * This value is only used if `Weapon.bulletFrameCycle` is set to `true`.
     * @type {number}
     * @private
     */
    this.bulletFrameIndex = 0;

    /**
     * An internal object that stores the animation data added via `Weapon.addBulletAnimation`.
     * @type {Object}
     * @private
     */
    this.anims = {};

    /**
     * The onFire Signal is dispatched each time `Weapon.fire` is called, and a Bullet is
     * _successfully_ launched. The callback is set two arguments: a reference to the bullet sprite itself,
     * and a reference to the Weapon that fired the bullet.
     *
     * @type {Phaser.Signal}
     */
    this.onFire = new Phaser.Signal();

    /**
     * The onKill Signal is dispatched each time a Bullet that is in-flight is killed. This can be the result
     * of leaving the Weapon bounds, an expiring lifespan, or exceeding a specified distance.
     * The callback is sent one argument: A reference to the bullet sprite itself.
     *
     * @type {Phaser.Signal}
     */
    this.onKill = new Phaser.Signal();

    /**
     * The onFireLimit Signal is dispatched if `Weapon.fireLimit` is > 0, and a bullet launch takes the number
     * of shots fired to equal the fire limit.
     * The callback is sent two arguments: A reference to the Weapon that hit the limit, and the value of
     * `Weapon.fireLimit`.
     *
     * @type {Phaser.Signal}
     */
    this.onFireLimit = new Phaser.Signal();

    /**
     * The Sprite currently being tracked by the Weapon, if any.
     * This is set via the `Weapon.trackSprite` method.
     *
     * @type {Phaser.Sprite|Object}
     */
    this.trackedSprite = null;

    /**
     * The Pointer currently being tracked by the Weapon, if any.
     * This is set via the `Weapon.trackPointer` method.
     *
     * @type {Phaser.Pointer}
     */
    this.trackedPointer = null;

    /**
     * If the Weapon is tracking a Sprite, should it also track the Sprites rotation?
     * This is useful for a game such as Asteroids, where you want the weapon to fire based
     * on the sprites rotation.
     *
     * @type {boolean}
     */
    this.trackRotation = false;

    /**
     * The Track Offset is a Point object that allows you to specify a pixel offset that bullets use
     * when launching from a tracked Sprite or Pointer. For example if you've got a bullet that is 2x2 pixels
     * in size, but you're tracking a Sprite that is 32x32, then you can set `trackOffset.x = 16` to have
     * the bullet launched from the center of the Sprite.
     *
     * @type {Phaser.Point}
     */
    this.trackOffset = new Phaser.Point();

    /**
     * Internal firing rate time tracking variable.
     *
     * @type {number}
     * @private
     */
    this._nextFire = 0;

};

Phaser.Weapon.prototype = Object.create(Phaser.Plugin.prototype);
Phaser.Weapon.prototype.constructor = Phaser.Weapon;

/**
* A `bulletKillType` constant that stops the bullets from ever being destroyed automatically.
* @constant
* @type {integer}
*/
Phaser.Weapon.KILL_NEVER = 0;

/**
* A `bulletKillType` constant that automatically kills the bullets when their `bulletLifespan` expires.
* @constant
* @type {integer}
*/
Phaser.Weapon.KILL_LIFESPAN = 1;

/**
* A `bulletKillType` constant that automatically kills the bullets after they
* exceed the `bulletDistance` from their original firing position.
* @constant
* @type {integer}
*/
Phaser.Weapon.KILL_DISTANCE = 2;

/**
* A `bulletKillType` constant that automatically kills the bullets when they leave the `Weapon.bounds` rectangle.
* @constant
* @type {integer}
*/
Phaser.Weapon.KILL_WEAPON_BOUNDS = 3;

/**
* A `bulletKillType` constant that automatically kills the bullets when they leave the `Camera.bounds` rectangle.
* @constant
* @type {integer}
*/
Phaser.Weapon.KILL_CAMERA_BOUNDS = 4;

/**
* A `bulletKillType` constant that automatically kills the bullets when they leave the `World.bounds` rectangle.
* @constant
* @type {integer}
*/
Phaser.Weapon.KILL_WORLD_BOUNDS = 5;

/**
* A `bulletKillType` constant that automatically kills the bullets when they leave the `Weapon.bounds` rectangle.
* @constant
* @type {integer}
*/
Phaser.Weapon.KILL_STATIC_BOUNDS = 6;

/**
* This method performs two actions: First it will check to see if the `Weapon.bullets` Group exists or not,
* and if not it creates it, adding it the `group` given as the 4th argument.
*
* Then it will seed the bullet pool with the `quantity` number of Bullets, using the texture key and frame
* provided (if any).
*
* If for example you set the quantity to be 10, then this Weapon will only ever be able to have 10 bullets
* in-flight simultaneously. If you try to fire an 11th bullet then nothing will happen until one, or more, of
* the in-flight bullets have been killed, freeing them up for use by the Weapon again.
*
* If you do not wish to have a limit set, then pass in -1 as the quantity. In this instance the Weapon will
* keep increasing the size of the bullet pool as needed. It will never reduce the size of the pool however,
* so be careful it doesn't grow too large.
*
* You can either set the texture key and frame here, or via the `Weapon.bulletKey` and `Weapon.bulletFrame`
* properties. You can also animate bullets, or set them to use random frames. All Bullets belonging to a
* single Weapon instance must share the same texture key however.
*
* @method Phaser.Weapon#createBullets
* @param {integer} [quantity=1] - The quantity of bullets to seed the Weapon with. If -1 it will set the pool to automatically expand.
* @param {string} [key] - The Game.cache key of the image that this Sprite will use.
* @param {integer|string} [frame] - If the Sprite image contains multiple frames you can specify which one to use here.
* @param {Phaser.Group} [group] - Optional Group to add the object to. If not specified it will be added to the World group.
* @return {Phaser.Weapon} This Weapon instance.
*/
Phaser.Weapon.prototype.createBullets = function (quantity, key, frame, group) {

    if (quantity === undefined) { quantity = 1; }
    if (group === undefined) { group = this.game.world; }

    if (!this.bullets)
    {
        this.bullets = this.game.add.physicsGroup(Phaser.Physics.ARCADE, group);
        this.bullets.classType = this._bulletClass;
    }

    if (quantity !== 0)
    {
        if (quantity === -1)
        {
            this.autoExpandBulletsGroup = true;
            quantity = 1;
        }

        this.bullets.createMultiple(quantity, key, frame);

        this.bullets.setAll('data.bulletManager', this);

        this.bulletKey = key;
        this.bulletFrame = frame;
    }

    return this;

};

/**
* Call a function on each in-flight bullet in this Weapon.
*
* See {@link Phaser.Group#forEachExists forEachExists} for more details.
*
* @method Phaser.Weapon#forEach
* @param {function} callback - The function that will be called for each applicable child. The child will be passed as the first argument.
* @param {object} callbackContext - The context in which the function should be called (usually 'this').
* @param {...any} [args=(none)] - Additional arguments to pass to the callback function, after the child item.
* @return {Phaser.Weapon} This Weapon instance.
*/
Phaser.Weapon.prototype.forEach = function (callback, callbackContext) {

    this.bullets.forEachExists(callback, callbackContext, arguments);

    return this;

};

/**
* Sets `Body.enable` to `false` on each bullet in this Weapon.
* This has the effect of stopping them in-flight should they be moving.
* It also stops them being able to be checked for collision.
*
* @method Phaser.Weapon#pauseAll
* @return {Phaser.Weapon} This Weapon instance.
*/
Phaser.Weapon.prototype.pauseAll = function () {

    this.bullets.setAll('body.enable', false);

    return this;

};

/**
* Sets `Body.enable` to `true` on each bullet in this Weapon.
* This has the effect of resuming their motion should they be in-flight.
* It also enables them for collision checks again.
*
* @method Phaser.Weapon#resumeAll
* @return {Phaser.Weapon} This Weapon instance.
*/
Phaser.Weapon.prototype.resumeAll = function () {

    this.bullets.setAll('body.enable', true);

    return this;

};

/**
* Calls `Bullet.kill` on every in-flight bullet in this Weapon.
* Also re-enables their physics bodies, should they have been disabled via `pauseAll`.
*
* @method Phaser.Weapon#killAll
* @return {Phaser.Weapon} This Weapon instance.
*/
Phaser.Weapon.prototype.killAll = function () {

    this.bullets.callAllExists('kill', true);

    this.bullets.setAll('body.enable', true);

    return this;

};

/**
* Resets the `Weapon.shots` counter back to zero. This is used when you've set
* `Weapon.fireLimit`, and have hit (or just wish to reset) your limit.
*
* @method Phaser.Weapon#resetShots
* @param {integer} [newLimit] - Optionally set a new `Weapon.fireLimit`.
* @return {Phaser.Weapon} This Weapon instance.
*/
Phaser.Weapon.prototype.resetShots = function (newLimit) {

    this.shots = 0;

    if (newLimit !== undefined)
    {
        this.fireLimit = newLimit;
    }

    return this;

};

/**
* Destroys this Weapon. It removes itself from the PluginManager, destroys
* the bullets Group, and nulls internal references.
*
* @method Phaser.Weapon#destroy
*/
Phaser.Weapon.prototype.destroy = function () {

    this.parent.remove(this, false);

    this.bullets.destroy();

    this.game = null;
    this.parent = null;
    this.active = false;
    this.visible = false;

};

/**
* Internal update method, called by the PluginManager.
*
* @method Phaser.Weapon#update
* @protected
*/
Phaser.Weapon.prototype.update = function () {

    if (this._bulletKillType === Phaser.Weapon.KILL_WEAPON_BOUNDS)
    {
        if (this.trackedSprite)
        {
            this.trackedSprite.updateTransform();
            this.bounds.centerOn(this.trackedSprite.worldPosition.x, this.trackedSprite.worldPosition.y);
        }
        else if (this.trackedPointer)
        {
            this.bounds.centerOn(this.trackedPointer.worldX, this.trackedPointer.worldY);
        }
    }

    if (this.autofire && this.game.time.now < this._nextFire)
    {
        this.fire();
    }

};

/**
* Sets this Weapon to track the given Sprite, or any Object with a public `world` Point object.
* When a Weapon tracks a Sprite it will automatically update its `fireFrom` value to match the Sprites
* position within the Game World, adjusting the coordinates based on the offset arguments.
*
* This allows you to lock a Weapon to a Sprite, so that bullets are always launched from its location.
*
* Calling `trackSprite` will reset `Weapon.trackedPointer` to null, should it have been set, as you can
* only track _either_ a Sprite, or a Pointer, at once, but not both.
*
* @method Phaser.Weapon#trackSprite
* @param {Phaser.Sprite|Object} sprite - The Sprite to track the position of.
* @param {integer} [offsetX=0] - The horizontal offset from the Sprites position to be applied to the Weapon.
* @param {integer} [offsetY=0] - The vertical offset from the Sprites position to be applied to the Weapon.
* @param {boolean} [trackRotation=false] - Should the Weapon also track the Sprites rotation?
* @return {Phaser.Weapon} This Weapon instance.
*/
Phaser.Weapon.prototype.trackSprite = function (sprite, offsetX, offsetY, trackRotation) {

    if (offsetX === undefined) { offsetX = 0; }
    if (offsetY === undefined) { offsetY = 0; }
    if (trackRotation === undefined) { trackRotation = false; }

    this.trackedPointer = null;
    this.trackedSprite = sprite;
    this.trackRotation = trackRotation;

    this.trackOffset.set(offsetX, offsetY);

    return this;

};

/**
* Sets this Weapon to track the given Pointer.
* When a Weapon tracks a Pointer it will automatically update its `fireFrom` value to match the Pointers
* position within the Game World, adjusting the coordinates based on the offset arguments.
*
* This allows you to lock a Weapon to a Pointer, so that bullets are always launched from its location.
*
* Calling `trackPointer` will reset `Weapon.trackedSprite` to null, should it have been set, as you can
* only track _either_ a Pointer, or a Sprite, at once, but not both.
*
* @method Phaser.Weapon#trackPointer
* @param {Phaser.Pointer} [pointer] - The Pointer to track the position of. Defaults to `Input.activePointer` if not specified.
* @param {integer} [offsetX=0] - The horizontal offset from the Pointers position to be applied to the Weapon.
* @param {integer} [offsetY=0] - The vertical offset from the Pointers position to be applied to the Weapon.
* @return {Phaser.Weapon} This Weapon instance.
*/
Phaser.Weapon.prototype.trackPointer = function (pointer, offsetX, offsetY) {

    if (pointer === undefined) { pointer = this.game.input.activePointer; }
    if (offsetX === undefined) { offsetX = 0; }
    if (offsetY === undefined) { offsetY = 0; }

    this.trackedPointer = pointer;
    this.trackedSprite = null;
    this.trackRotation = false;

    this.trackOffset.set(offsetX, offsetY);

    return this;

};

/**
* Attempts to fire a single Bullet. If there are no more bullets available in the pool, and the pool cannot be extended,
* then this method returns `false`. It will also return false if not enough time has expired since the last time
* the Weapon was fired, as defined in the `Weapon.fireRate` property.
*
* Otherwise the first available bullet is selected and launched.
*
* The arguments are all optional, but allow you to control both where the bullet is launched from, and aimed at.
*
* If you don't provide any of the arguments then it uses those set via properties such as `Weapon.trackedSprite`,
* `Weapon.bulletAngle` and so on.
*
* When the bullet is launched it has its texture and frame updated, as required. The velocity of the bullet is
* calculated based on Weapon properties like `bulletSpeed`.
*
* @method Phaser.Weapon#fire
* @param {Phaser.Sprite|Phaser.Point|Object} [from] - Optionally fires the bullet **from** the `x` and `y` properties of this object. If set this overrides `Weapon.trackedSprite` or `trackedPointer`. Pass `null` to ignore it.
* @param {number} [x] - The x coordinate, in world space, to fire the bullet **towards**. If left as `undefined` the bullet direction is based on its angle.
* @param {number} [y] - The y coordinate, in world space, to fire the bullet **towards**. If left as `undefined` the bullet direction is based on its angle.
* @return {boolean} True if a bullet was successfully fired, otherwise false.
*/
Phaser.Weapon.prototype.fire = function (from, x, y) {

    if (this.game.time.now < this._nextFire || (this.fireLimit > 0 && this.shots === this.fireLimit))
    {
        return false;
    }

    var speed = this.bulletSpeed;

    //  Apply +- speed variance
    if (this.bulletSpeedVariance !== 0)
    {
        speed += Phaser.Math.between(-this.bulletSpeedVariance, this.bulletSpeedVariance);
    }

    if (from)
    {
        if (this.fireFrom.width > 1)
        {
            this.fireFrom.centerOn(from.x, from.y);
        }
        else
        {
            this.fireFrom.x = from.x;
            this.fireFrom.y = from.y;
        }
    }
    else if (this.trackedSprite)
    {
        if (this.fireFrom.width > 1)
        {
            this.fireFrom.centerOn(this.trackedSprite.world.x + this.trackOffset.x, this.trackedSprite.world.y + this.trackOffset.y);
        }
        else
        {
            this.fireFrom.x = this.trackedSprite.world.x + this.trackOffset.x;
            this.fireFrom.y = this.trackedSprite.world.y + this.trackOffset.y;
        }

        if (this.bulletInheritSpriteSpeed)
        {
            speed += this.trackedSprite.body.speed;
        }
    }
    else if (this.trackedPointer)
    {
        if (this.fireFrom.width > 1)
        {
            this.fireFrom.centerOn(this.trackedPointer.world.x + this.trackOffset.x, this.trackedPointer.world.y + this.trackOffset.y);
        }
        else
        {
            this.fireFrom.x = this.trackedPointer.world.x + this.trackOffset.x;
            this.fireFrom.y = this.trackedPointer.world.y + this.trackOffset.y;
        }
    }

    var fromX = (this.fireFrom.width > 1) ? this.fireFrom.randomX : this.fireFrom.x;
    var fromY = (this.fireFrom.height > 1) ? this.fireFrom.randomY : this.fireFrom.y;

    var angle = (this.trackRotation) ? this.trackedSprite.angle : this.fireAngle;

    //  The position (in world space) to fire the bullet towards, if set
    if (x !== undefined && y !== undefined)
    {
        angle = this.game.math.radToDeg(Math.atan2(y - fromY, x - fromX));
    }

    //  Apply +- angle variance
    if (this.bulletAngleVariance !== 0)
    {
        angle += Phaser.Math.between(-this.bulletAngleVariance, this.bulletAngleVariance);
    }

    var moveX = 0;
    var moveY = 0;

    //  Avoid sin/cos for right-angled shots
    if (angle === 0 || angle === 180)
    {
        moveX = Math.cos(this.game.math.degToRad(angle)) * speed;
    }
    else if (angle === 90 || angle === 270)
    {
        moveY = Math.sin(this.game.math.degToRad(angle)) * speed;
    }
    else
    {
        moveX = Math.cos(this.game.math.degToRad(angle)) * speed;
        moveY = Math.sin(this.game.math.degToRad(angle)) * speed;
    }

    var bullet = null;

    if (this.autoExpandBulletsGroup)
    {
        bullet = this.bullets.getFirstExists(false, true, fromX, fromY, this.bulletKey, this.bulletFrame);

        bullet.data.bulletManager = this;
    }
    else
    {
        bullet = this.bullets.getFirstExists(false);
    }

    if (bullet)
    {
        bullet.reset(fromX, fromY);

        bullet.data.fromX = fromX;
        bullet.data.fromY = fromY;
        bullet.data.killType = this.bulletKillType;
        bullet.data.killDistance = this.bulletKillDistance;
        bullet.data.rotateToVelocity = this.bulletRotateToVelocity;

        if (this.bulletKillType === Phaser.Weapon.KILL_LIFESPAN)
        {
            bullet.lifespan = this.bulletLifespan;
        }

        bullet.angle = angle + this.bulletAngleOffset;

        //  Frames and Animations
        if (this.bulletAnimation !== '')
        {
            if (bullet.animations.getAnimation(this.bulletAnimation) === null)
            {
                var anim = this.anims[this.bulletAnimation];

                bullet.animations.add(anim.name, anim.frames, anim.frameRate, anim.loop, anim.useNumericIndex);
            }

            bullet.animations.play(this.bulletAnimation);
        }
        else
        {
            if (this.bulletFrameCycle)
            {
                bullet.frame = this.bulletFrames[this.bulletFrameIndex];

                this.bulletFrameIndex++;

                if (this.bulletFrameIndex >= this.bulletFrames.length)
                {
                    this.bulletFrameIndex = 0;
                }
            }
            else if (this.bulletFrameRandom)
            {
                bullet.frame = this.bulletFrames[Math.floor(Math.random() * this.bulletFrames.length)];
            }
        }

        if (bullet.data.bodyDirty)
        {
            if (this._data.customBody)
            {
                bullet.body.setSize(this._data.width, this._data.height, this._data.offsetX, this._data.offsetY);
            }

            bullet.body.collideWorldBounds = this.bulletCollideWorldBounds;

            bullet.data.bodyDirty = false;
        }

        bullet.body.velocity.set(moveX, moveY);
        bullet.body.gravity.set(this.bulletGravity.x, this.bulletGravity.y);

        this._nextFire = this.game.time.now + this.fireRate;

        this.shots++;

        this.onFire.dispatch(bullet, this, speed);

        if (this.fireLimit > 0 && this.shots === this.fireLimit)
        {
            this.onFireLimit.dispatch(this, this.fireLimit);
        }

    }

};

/**
* Fires a bullet **at** the given Pointer. The bullet will be launched from the `Weapon.fireFrom` position,
* or from a Tracked Sprite or Pointer, if you have one set.
*
* @method Phaser.Weapon#fireAtPointer
* @param {Phaser.Pointer} [pointer] - The Pointer to fire the bullet towards.
* @return {boolean} True if a bullet was successfully fired, otherwise false.
*/
Phaser.Weapon.prototype.fireAtPointer = function (pointer) {

    if (pointer === undefined) { pointer = this.game.input.activePointer; }

    return this.fire(null, pointer.worldX, pointer.worldY);

};

/**
* Fires a bullet **at** the given Sprite. The bullet will be launched from the `Weapon.fireFrom` position,
* or from a Tracked Sprite or Pointer, if you have one set.
*
* @method Phaser.Weapon#fireAtSprite
* @param {Phaser.Sprite} [sprite] - The Sprite to fire the bullet towards.
* @return {boolean} True if a bullet was successfully fired, otherwise false.
*/
Phaser.Weapon.prototype.fireAtSprite = function (sprite) {

    return this.fire(null, sprite.world.x, sprite.world.y);

};

/**
* Fires a bullet **at** the given coordinates. The bullet will be launched from the `Weapon.fireFrom` position,
* or from a Tracked Sprite or Pointer, if you have one set.
*
* @method Phaser.Weapon#fireAtXY
* @param {number} [x] - The x coordinate, in world space, to fire the bullet towards.
* @param {number} [y] - The y coordinate, in world space, to fire the bullet towards.
* @return {boolean} True if a bullet was successfully fired, otherwise false.
*/
Phaser.Weapon.prototype.fireAtXY = function (x, y) {

    return this.fire(null, x, y);

};

/**
* You can modify the size of the physics Body the Bullets use to be any dimension you need.
* This allows you to make it smaller, or larger, than the parent Sprite.
* You can also control the x and y offset of the Body. This is the position of the
* Body relative to the top-left of the Sprite _texture_.
*
* For example: If you have a Sprite with a texture that is 80x100 in size,
* and you want the physics body to be 32x32 pixels in the middle of the texture, you would do:
*
* `setSize(32, 32, 24, 34)`
*
* Where the first two parameters is the new Body size (32x32 pixels).
* 24 is the horizontal offset of the Body from the top-left of the Sprites texture, and 34
* is the vertical offset.
*
* @method Phaser.Weapon#setBulletBodyOffset
* @param {number} width - The width of the Body.
* @param {number} height - The height of the Body.
* @param {number} [offsetX] - The X offset of the Body from the top-left of the Sprites texture.
* @param {number} [offsetY] - The Y offset of the Body from the top-left of the Sprites texture.
* @return {Phaser.Weapon} The Weapon Plugin.
*/
Phaser.Weapon.prototype.setBulletBodyOffset = function (width, height, offsetX, offsetY) {

    if (offsetX === undefined) { offsetX = 0; }
    if (offsetY === undefined) { offsetY = 0; }

    this._data.customBody = true;
    this._data.width = width;
    this._data.height = height;
    this._data.offsetX = offsetX;
    this._data.offsetY = offsetY;

    //  Update all bullets in the pool
    this.bullets.callAll('body.setSize', 'body', width, height, offsetX, offsetY);
    this.bullets.setAll('data.bodyDirty', false);

    return this;

};

/**
* Sets the texture frames that the bullets can use when being launched.
*
* This is intended for use when you've got numeric based frames, such as those loaded via a Sprite Sheet.
*
* It works by calling `Phaser.ArrayUtils.numberArray` internally, using the min and max values
* provided. Then it sets the frame index to be zero.
*
* You can optionally set the cycle and random booleans, to allow bullets to cycle through the frames
* when they're fired, or pick one at random.
*
* @method Phaser.Weapon#setBulletFrames
* @param {integer} min - The minimum value the frame can be. Usually zero.
* @param {integer} max - The maximum value the frame can be.
* @param {boolean} [cycle=true] - Should the bullet frames cycle as they are fired?
* @param {boolean} [random=false] - Should the bullet frames be picked at random as they are fired?
* @return {Phaser.Weapon} The Weapon Plugin.
*/
Phaser.Weapon.prototype.setBulletFrames = function (min, max, cycle, random) {

    if (cycle === undefined) { cycle = true; }
    if (random === undefined) { random = false; }

    this.bulletFrames = Phaser.ArrayUtils.numberArray(min, max);

    this.bulletFrameIndex = 0;

    this.bulletFrameCycle = cycle;
    this.bulletFrameRandom = random;

    return this;

};

/**
* Adds a new animation under the given key. Optionally set the frames, frame rate and loop.
* The arguments are all the same as for `Animation.add`, and work in the same way.
*
* `Weapon.bulletAnimation` will be set to this animation after it's created. From that point on, all
* bullets fired will play using this animation. You can swap between animations by calling this method
* several times, and then just changing the `Weapon.bulletAnimation` property to the name of the animation
* you wish to play for the next launched bullet.
*
* If you wish to stop using animations at all, set `Weapon.bulletAnimation` to '' (an empty string).
*
* @method Phaser.Weapon#addBulletAnimation
* @param {string} name - The unique (within the Weapon instance) name for the animation, i.e. "fire", "blast".
* @param {Array} [frames=null] - An array of numbers/strings that correspond to the frames to add to this animation and in which order. e.g. [1, 2, 3] or ['run0', 'run1', run2]). If null then all frames will be used.
* @param {number} [frameRate=60] - The speed at which the animation should play. The speed is given in frames per second.
* @param {boolean} [loop=false] - Whether or not the animation is looped or just plays once.
* @param {boolean} [useNumericIndex=true] - Are the given frames using numeric indexes (default) or strings?
* @return {Phaser.Weapon} The Weapon Plugin.
*/
Phaser.Weapon.prototype.addBulletAnimation = function (name, frames, frameRate, loop, useNumericIndex) {

    this.anims[name] = {
        name: name,
        frames: frames,
        frameRate: frameRate,
        loop: loop,
        useNumericIndex: useNumericIndex
    };

    //  Add the animation to any existing bullets in the pool
    this.bullets.callAll('animations.add', 'animations', name, frames, frameRate, loop, useNumericIndex);

    this.bulletAnimation = name;

    return this;

};

/**
* Uses `Game.Debug` to draw some useful information about this Weapon, including the number of bullets
* both in-flight, and available. And optionally the physics debug bodies of the bullets.
*
* @method Phaser.Weapon#debug
* @param {integer} [x=16] - The coordinate, in screen space, at which to draw the Weapon debug data.
* @param {integer} [y=32] - The coordinate, in screen space, at which to draw the Weapon debug data.
* @param {boolean} [debugBodies=false] - Optionally draw the physics body of every bullet in-flight.
*/
Phaser.Weapon.prototype.debug = function (x, y, debugBodies) {

    if (x === undefined) { x = 16; }
    if (y === undefined) { y = 32; }
    if (debugBodies === undefined) { debugBodies = false; }

    this.game.debug.text("Weapon Plugin", x, y);
    this.game.debug.text("Bullets Alive: " + this.bullets.total + " - Total: " + this.bullets.length, x, y + 24);

    if (debugBodies)
    {
        this.bullets.forEachExists(this.game.debug.body, this.game.debug, 'rgba(255, 0, 255, 0.8)');
    }

};

/**
* The Class of the bullets that are launched by this Weapon. Defaults `Phaser.Bullet`, but can be
* overridden before calling `createBullets` and set to your own class type.
*
* @name Phaser.Weapon#bulletClass
* @property {Object} bulletClass
*/
Object.defineProperty(Phaser.Weapon.prototype, "bulletClass", {

    get: function () {

        return this._bulletClass;

    },

    set: function (classType) {

        this._bulletClass = classType;

        this.bullets.classType = this._bulletClass;

    }

});

/**
* This controls how the bullets will be killed. The default is `Phaser.Weapon.KILL_WORLD_BOUNDS`.
*
* There are 7 different "kill types" available:
*
* * `Phaser.Weapon.KILL_NEVER`
* The bullets are never destroyed by the Weapon. It's up to you to destroy them via your own code.
*
* * `Phaser.Weapon.KILL_LIFESPAN`
* The bullets are automatically killed when their `bulletLifespan` amount expires.
*
* * `Phaser.Weapon.KILL_DISTANCE`
* The bullets are automatically killed when they exceed `bulletDistance` pixels away from their original launch position.
*
* * `Phaser.Weapon.KILL_WEAPON_BOUNDS`
* The bullets are automatically killed when they no longer intersect with the `Weapon.bounds` rectangle.
*
* * `Phaser.Weapon.KILL_CAMERA_BOUNDS`
* The bullets are automatically killed when they no longer intersect with the `Camera.bounds` rectangle.
*
* * `Phaser.Weapon.KILL_WORLD_BOUNDS`
* The bullets are automatically killed when they no longer intersect with the `World.bounds` rectangle.
*
* * `Phaser.Weapon.KILL_STATIC_BOUNDS`
* The bullets are automatically killed when they no longer intersect with the `Weapon.bounds` rectangle.
* The difference between static bounds and weapon bounds, is that a static bounds will never be adjusted to
* match the position of a tracked sprite or pointer.
*
* @name Phaser.Weapon#bulletKillType
* @property {integer} bulletKillType
*/
Object.defineProperty(Phaser.Weapon.prototype, "bulletKillType", {

    get: function () {

        return this._bulletKillType;

    },

    set: function (type) {

        switch (type)
        {
            case Phaser.Weapon.KILL_STATIC_BOUNDS:
            case Phaser.Weapon.KILL_WEAPON_BOUNDS:
                this.bulletBounds = this.bounds;
                break;

            case Phaser.Weapon.KILL_CAMERA_BOUNDS:
                this.bulletBounds = this.game.camera.view;
                break;

            case Phaser.Weapon.KILL_WORLD_BOUNDS:
                this.bulletBounds = this.game.world.bounds;
                break;
        }

        this._bulletKillType = type;

    }

});

/**
* Should bullets collide with the World bounds or not?
*
* @name Phaser.Weapon#bulletCollideWorldBounds
* @property {boolean} bulletCollideWorldBounds
*/
Object.defineProperty(Phaser.Weapon.prototype, "bulletCollideWorldBounds", {

    get: function () {

        return this._bulletCollideWorldBounds;

    },

    set: function (value) {

        this._bulletCollideWorldBounds = value;

        this.bullets.setAll('body.collideWorldBounds', value);
        this.bullets.setAll('data.bodyDirty', false);

    }

});

/**
* The x coordinate from which bullets are fired. This is the same as `Weapon.fireFrom.x`, and
* can be overridden by the `Weapon.fire` arguments.
*
* @name Phaser.Weapon#x
* @property {number} x
*/
Object.defineProperty(Phaser.Weapon.prototype, "x", {

    get: function () {

        return this.fireFrom.x;

    },

    set: function (value) {

        this.fireFrom.x = value;
    }

});

/**
* The y coordinate from which bullets are fired. This is the same as `Weapon.fireFrom.y`, and
* can be overridden by the `Weapon.fire` arguments.
*
* @name Phaser.Weapon#y
* @property {number} y
*/
Object.defineProperty(Phaser.Weapon.prototype, "y", {

    get: function () {

        return this.fireFrom.y;

    },

    set: function (value) {

        this.fireFrom.y = value;
    }

});
