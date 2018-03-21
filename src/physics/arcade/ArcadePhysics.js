/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../utils/Class');
var Factory = require('./Factory');
var GetFastValue = require('../../utils/object/GetFastValue');
var Merge = require('../../utils/object/Merge');
var PluginManager = require('../../boot/PluginManager');
var World = require('./World');
var DistanceBetween = require('../../math/distance/DistanceBetween');
var DegToRad = require('../../math/DegToRad');

//  All methods in this class are available under `this.physics` in a Scene.

/**
 * @classdesc
 * [description]
 *
 * @class ArcadePhysics
 * @memberOf Phaser.Physics.Arcade
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Scene} scene - [description]
 */
var ArcadePhysics = new Class({

    initialize:

    function ArcadePhysics (scene)
    {
        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.ArcadePhysics#scene
         * @type {Phaser.Scene}
         * @since 3.0.0
         */
        this.scene = scene;

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.ArcadePhysics#systems
         * @type {Phaser.Scenes.Systems}
         * @since 3.0.0
         */
        this.systems = scene.sys;

        if (!scene.sys.settings.isBooted)
        {
            scene.sys.events.once('boot', this.boot, this);
        }

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.ArcadePhysics#config
         * @type {object}
         * @since 3.0.0
         */
        this.config = this.getConfig();

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.ArcadePhysics#world
         * @type {Phaser.Physics.Arcade.World}
         * @since 3.0.0
         */
        this.world;

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.ArcadePhysics#add
         * @type {Phaser.Physics.Arcade.Factory}
         * @since 3.0.0
         */
        this.add;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.ArcadePhysics#getConfig
     * @since 3.0.0
     *
     * @return {object} [description]
     */
    getConfig: function ()
    {
        var gameConfig = this.systems.game.config.physics;
        var sceneConfig = this.systems.settings.physics;

        var config = Merge(
            GetFastValue(sceneConfig, 'arcade', {}),
            GetFastValue(gameConfig, 'arcade', {})
        );

        return config;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.ArcadePhysics#boot
     * @since 3.0.0
     */
    boot: function ()
    {
        this.world = new World(this.scene, this.config);
        this.add = new Factory(this.world);

        var eventEmitter = this.systems.events;

        eventEmitter.on('update', this.world.update, this.world);
        eventEmitter.on('postupdate', this.world.postUpdate, this.world);
        eventEmitter.on('shutdown', this.shutdown, this);
        eventEmitter.on('destroy', this.destroy, this);
    },

    /**
     * Checks for overlaps between two Game Objects. The objects can be any Game Object that have an Arcade Physics Body.
     *
     * Unlike {@link #collide} the objects are NOT automatically separated or have any physics applied, they merely test for overlap results.
     *
     * Both the first and second parameter can be arrays of objects, of differing types.
     * If two arrays are passed, the contents of the first parameter will be tested against all contents of the 2nd parameter.
     *
     * ##### Tilemaps
     *
     * Any overlapping tiles, including blank/null tiles, will give a positive result. Tiles marked via {@link Phaser.Tilemap#setCollision} (and similar methods) have no special status, and callbacks added via {@link Phaser.Tilemap#setTileIndexCallback} or {@link Phaser.Tilemap#setTileLocationCallback} are not invoked. So calling this method without any callbacks isn't very useful.
     *
     * If you're interested only in whether an object overlaps a certain tile or class of tiles, filter the tiles with `processCallback` and then use the result returned by this method. Blank/null tiles can be excluded by their {@link Phaser.Tile#index index} (-1).
     *
     * If you want to take action on certain overlaps, examine the tiles in `collideCallback` and then handle as you like.
     *
     * @method Phaser.Physics.Arcade.ArcadePhysics#overlap
     * @since 3.0.0
     *
     * @param {(Phaser.GameObjects.GameObject|array)} object1 - The first object or array of objects to check. Can be any Game Object that has an Arcade Physics Body.
     * @param {(Phaser.GameObjects.GameObject|array)} object2 - The second object or array of objects to check. Can be any Game Object that has an Arcade Physics Body.
     * @param {ArcadePhysicsCallback} [overlapCallback=null] - An optional callback function that is called if the objects overlap. The two objects will be passed to this function in the same order in which you specified them, unless you are checking Group vs. Sprite, in which case Sprite will always be the first parameter.
     * @param {ArcadePhysicsCallback} [processCallback=null] - A callback function that lets you perform additional checks against the two objects if they overlap. If this is set then `overlapCallback` will only be called if this callback returns `true`.
     * @param {*} [callbackContext] - The context in which to run the callbacks.
     *
     * @return {boolean} True if an overlap occurred otherwise false.
     */
    overlap: function (object1, object2, overlapCallback, processCallback, callbackContext)
    {
        if (overlapCallback === undefined) { overlapCallback = null; }
        if (processCallback === undefined) { processCallback = null; }
        if (callbackContext === undefined) { callbackContext = overlapCallback; }

        return this.world.collideObjects(object1, object2, overlapCallback, processCallback, callbackContext, true);
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.ArcadePhysics#collide
     * @since 3.0.0
     *
     * @param {(Phaser.GameObjects.GameObject|array)} object1 - The first object or array of objects to check. Can be any Game Object that has an Arcade Physics Body.
     * @param {(Phaser.GameObjects.GameObject|array)} object2 - The second object or array of objects to check. Can be any Game Object that has an Arcade Physics Body.
     * @param {ArcadePhysicsCallback} [collideCallback=null] - An optional callback function that is called if the objects collide. The two objects will be passed to this function in the same order in which you specified them, unless you are checking Group vs. Sprite, in which case Sprite will always be the first parameter.
     * @param {ArcadePhysicsCallback} [processCallback=null] - A callback function that lets you perform additional checks against the two objects if they collide. If this is set then `collideCallback` will only be called if this callback returns `true`.
     * @param {*} [callbackContext] - The context in which to run the callbacks.
     *
     * @return {boolean} True if a collision occurred otherwise false.
     */
    collide: function (object1, object2, collideCallback, processCallback, callbackContext)
    {
        if (collideCallback === undefined) { collideCallback = null; }
        if (processCallback === undefined) { processCallback = null; }
        if (callbackContext === undefined) { callbackContext = collideCallback; }

        return this.world.collideObjects(object1, object2, collideCallback, processCallback, callbackContext, false);
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.ArcadePhysics#pause
     * @since 3.0.0
     *
     * @return {Phaser.Physics.Arcade.World} [description]
     */
    pause: function ()
    {
        return this.world.pause();
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.ArcadePhysics#resume
     * @since 3.0.0
     *
     * @return {Phaser.Physics.Arcade.World} [description]
     */
    resume: function ()
    {
        return this.world.resume();
    },

    /**
     * Sets the acceleration.x/y property on the game object so it will move towards the x/y coordinates at the given speed (in pixels per second sq.)
     *
     * You must give a maximum speed value, beyond which the game object won't go any faster.
     *
     * Note: The game object does not continuously track the target. If the target changes location during transit the game object will not modify its course.
     * Note: The game object doesn't stop moving once it reaches the destination coordinates.
     *
     * @method Phaser.Physics.Arcade.ArcadePhysics#accelerateTo
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject} gameObject - Any Game Object with an Arcade Physics body.
     * @param {number} x - The x coordinate to accelerate towards.
     * @param {number} y - The y coordinate to accelerate towards.
     * @param {number} [speed=60] - The speed it will accelerate in pixels per second.
     * @param {number} [xSpeedMax=500] - The maximum x velocity the game object can reach.
     * @param {number} [ySpeedMax=500] - The maximum y velocity the game object can reach.
     *
     * @return {number} The angle (in radians) that the object should be visually set to in order to match its new velocity.
     */
    accelerateTo: function (gameObject, x, y, speed, xSpeedMax, ySpeedMax)
    {
        if (speed === undefined) { speed = 60; }

        var angle = Math.atan2(y - gameObject.y, x - gameObject.x);

        gameObject.body.acceleration.setToPolar(angle, speed);

        if (xSpeedMax !== undefined && ySpeedMax !== undefined)
        {
            gameObject.body.maxVelocity.set(xSpeedMax, ySpeedMax);
        }

        return angle;
    },

    /**
     * Sets the acceleration.x/y property on the game object so it will move towards the x/y coordinates at the given speed (in pixels per second sq.)
     *
     * You must give a maximum speed value, beyond which the game object won't go any faster.
     *
     * Note: The game object does not continuously track the target. If the target changes location during transit the game object will not modify its course.
     * Note: The game object doesn't stop moving once it reaches the destination coordinates.
     *
     * @method Phaser.Physics.Arcade.ArcadePhysics#accelerateToObject
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject} gameObject - Any Game Object with an Arcade Physics body.
     * @param {Phaser.GameObjects.GameObject} destination - The Game Object to move towards. Can be any object but must have visible x/y properties.
     * @param {number} [speed=60] - The speed it will accelerate in pixels per second.
     * @param {number} [xSpeedMax=500] - The maximum x velocity the game object can reach.
     * @param {number} [ySpeedMax=500] - The maximum y velocity the game object can reach.
     *
     * @return {number} The angle (in radians) that the object should be visually set to in order to match its new velocity.
     */
    accelerateToObject: function (gameObject, destination, speed, xSpeedMax, ySpeedMax)
    {
        return this.accelerateTo(gameObject, destination.x, destination.y, speed, xSpeedMax, ySpeedMax);
    },

    /**
     * From a set of points or display objects, find the one closest to a source point or object.
     *
     * @method Phaser.Physics.Arcade.ArcadePhysics#closest
     * @since 3.0.0
     *
     * @param {object} source - Any object with public `x` and `y` properties, such as a Game Object or Geometry object.
     *
     * @return {Phaser.Physics.Arcade.Body} The closest Body to the given source point.
     */
    closest: function (source)
    {
        var bodies = this.tree.all();

        var min = Number.MAX_VALUE;
        var closest = null;
        var x = source.x;
        var y = source.y;

        for (var i = bodies.length - 1; i >= 0; i--)
        {
            var target = bodies[i];
            var distance = DistanceBetween(x, y, target.x, target.y);

            if (distance < min)
            {
                closest = target;
                min = distance;
            }
        }

        return closest;
    },

    /**
     * From a set of points or display objects, find the one farthest from a source point or object.
     *
     * @method Phaser.Physics.Arcade.ArcadePhysics#furthest
     * @since 3.0.0
     *
     * @param {object} source - Any object with public `x` and `y` properties, such as a Game Object or Geometry object.
     *
     * @return {Phaser.Physics.Arcade.Body} The Body furthest from the given source point.
     */
    furthest: function (source)
    {
        var bodies = this.tree.all();

        var max = -1;
        var farthest = null;
        var x = source.x;
        var y = source.y;

        for (var i = bodies.length - 1; i >= 0; i--)
        {
            var target = bodies[i];
            var distance = DistanceBetween(x, y, target.x, target.y);

            if (distance > max)
            {
                farthest = target;
                max = distance;
            }
        }

        return farthest;
    },

    /**
     * Move the given display object towards the x/y coordinates at a steady velocity.
     * If you specify a maxTime then it will adjust the speed (over-writing what you set) so it arrives at the destination in that number of seconds.
     * Timings are approximate due to the way browser timers work. Allow for a variance of +- 50ms.
     * Note: The display object does not continuously track the target. If the target changes location during transit the display object will not modify its course.
     * Note: The display object doesn't stop moving once it reaches the destination coordinates.
     * Note: Doesn't take into account acceleration, maxVelocity or drag (if you've set drag or acceleration too high this object may not move at all)
     *
     * @method Phaser.Physics.Arcade.ArcadePhysics#moveTo
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject} gameObject - Any Game Object with an Arcade Physics body.
     * @param {number} x - The x coordinate to move towards.
     * @param {number} y - The y coordinate to move towards.
     * @param {number} [speed=60] - The speed it will move, in pixels per second (default is 60 pixels/sec)
     * @param {number} [maxTime=0] - Time given in milliseconds (1000 = 1 sec). If set the speed is adjusted so the object will arrive at destination in the given number of ms.
     *
     * @return {number} The angle (in radians) that the object should be visually set to in order to match its new velocity.
     */
    moveTo: function (gameObject, x, y, speed, maxTime)
    {
        if (speed === undefined) { speed = 60; }
        if (maxTime === undefined) { maxTime = 0; }

        var angle = Math.atan2(y - gameObject.y, x - gameObject.x);

        if (maxTime > 0)
        {
            //  We know how many pixels we need to move, but how fast?
            speed = DistanceBetween(gameObject.x, gameObject.y, x, y) / (maxTime / 1000);
        }

        gameObject.body.velocity.setToPolar(angle, speed);

        return angle;
    },

    /**
     * Move the given display object towards the destination object at a steady velocity.
     * If you specify a maxTime then it will adjust the speed (overwriting what you set) so it arrives at the destination in that number of seconds.
     * Timings are approximate due to the way browser timers work. Allow for a variance of +- 50ms.
     * Note: The display object does not continuously track the target. If the target changes location during transit the display object will not modify its course.
     * Note: The display object doesn't stop moving once it reaches the destination coordinates.
     * Note: Doesn't take into account acceleration, maxVelocity or drag (if you've set drag or acceleration too high this object may not move at all)
     *
     * @method Phaser.Physics.Arcade.ArcadePhysics#moveToObject
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject} gameObject - Any Game Object with an Arcade Physics body.
     * @param {object} destination - Any object with public `x` and `y` properties, such as a Game Object or Geometry object.
     * @param {number} [speed=60] - The speed it will move, in pixels per second (default is 60 pixels/sec)
     * @param {number} [maxTime=0] - Time given in milliseconds (1000 = 1 sec). If set the speed is adjusted so the object will arrive at destination in the given number of ms.
     *
     * @return {number} The angle (in radians) that the object should be visually set to in order to match its new velocity.
     */
    moveToObject: function (gameObject, destination, speed, maxTime)
    {
        return this.moveTo(gameObject, destination.x, destination.y, speed, maxTime);
    },

    /**
     * Given the angle (in degrees) and speed calculate the velocity and return it as a Point object, or set it to the given point object.
     * One way to use this is: velocityFromAngle(angle, 200, sprite.velocity) which will set the values directly to the sprites velocity and not create a new Point object.
     *
     * @method Phaser.Physics.Arcade.ArcadePhysics#velocityFromAngle
     * @since 3.0.0
     *
     * @param {number} angle - The angle in degrees calculated in clockwise positive direction (down = 90 degrees positive, right = 0 degrees positive, up = 90 degrees negative)
     * @param {number} [speed=60] - The speed it will move, in pixels per second sq.
     * @param {Phaser.Math.Vector2} vec2 - The Vector2 in which the x and y properties will be set to the calculated velocity.
     *
     * @return {Phaser.Math.Vector2} The Vector2 that stores the velocity.
     */
    velocityFromAngle: function (angle, speed, vec2)
    {
        if (speed === undefined) { speed = 60; }

        return vec2.setToPolar(DegToRad(angle), speed);
    },

    /**
     * Given the rotation (in radians) and speed calculate the velocity and return it as a Point object, or set it to the given point object.
     * One way to use this is: velocityFromRotation(rotation, 200, sprite.velocity) which will set the values directly to the sprites velocity and not create a new Point object.
     *
     * @method Phaser.Physics.Arcade.ArcadePhysics#velocityFromRotation
     * @since 3.0.0
     *
     * @param {number} rotation - The angle in radians.
     * @param {number} [speed=60] - The speed it will move, in pixels per second sq.
     * @param {Phaser.Math.Vector2} vec2 - The Vector2 in which the x and y properties will be set to the calculated velocity.
     *
     * @return {Phaser.Math.Vector2} The Vector2 that stores the velocity.
     */
    velocityFromRotation: function (rotation, speed, vec2)
    {
        if (speed === undefined) { speed = 60; }

        return vec2.setToPolar(rotation, speed);
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.ArcadePhysics#shutdown
     * @since 3.0.0
     */
    shutdown: function ()
    {
        this.world.shutdown();
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.ArcadePhysics#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.world.destroy();
    }

});

PluginManager.register('ArcadePhysics', ArcadePhysics, 'arcadePhysics');

module.exports = ArcadePhysics;
