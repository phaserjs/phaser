/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../utils/Class');
var DegToRad = require('../../math/DegToRad');
var DistanceBetween = require('../../math/distance/DistanceBetween');
var DistanceSquared = require('../../math/distance/DistanceSquared');
var Factory = require('./Factory');
var GetFastValue = require('../../utils/object/GetFastValue');
var Merge = require('../../utils/object/Merge');
var PluginCache = require('../../plugins/PluginCache');
var SceneEvents = require('../../scene/events');
var Vector2 = require('../../math/Vector2');
var World = require('./World');

/**
 * @classdesc
 * The Arcade Physics Plugin belongs to a Scene and sets up and manages the Scene's physics simulation.
 * It also holds some useful methods for moving and rotating Arcade Physics Bodies.
 *
 * You can access it from within a Scene using `this.physics`.
 *
 * @class ArcadePhysics
 * @memberof Phaser.Physics.Arcade
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Scene} scene - The Scene that this Plugin belongs to.
 */
var ArcadePhysics = new Class({

    initialize:

    function ArcadePhysics (scene)
    {
        /**
         * The Scene that this Plugin belongs to.
         *
         * @name Phaser.Physics.Arcade.ArcadePhysics#scene
         * @type {Phaser.Scene}
         * @since 3.0.0
         */
        this.scene = scene;

        /**
         * The Scene's Systems.
         *
         * @name Phaser.Physics.Arcade.ArcadePhysics#systems
         * @type {Phaser.Scenes.Systems}
         * @since 3.0.0
         */
        this.systems = scene.sys;

        /**
         * A configuration object. Union of the `physics.arcade.*` properties of the GameConfig and SceneConfig objects.
         *
         * @name Phaser.Physics.Arcade.ArcadePhysics#config
         * @type {object}
         * @since 3.0.0
         */
        this.config = this.getConfig();

        /**
         * The physics simulation.
         *
         * @name Phaser.Physics.Arcade.ArcadePhysics#world
         * @type {Phaser.Physics.Arcade.World}
         * @since 3.0.0
         */
        this.world;

        /**
         * An object holding the Arcade Physics factory methods.
         *
         * @name Phaser.Physics.Arcade.ArcadePhysics#add
         * @type {Phaser.Physics.Arcade.Factory}
         * @since 3.0.0
         */
        this.add;

        scene.sys.events.once(SceneEvents.BOOT, this.boot, this);
        scene.sys.events.on(SceneEvents.START, this.start, this);
    },

    /**
     * This method is called automatically, only once, when the Scene is first created.
     * Do not invoke it directly.
     *
     * @method Phaser.Physics.Arcade.ArcadePhysics#boot
     * @private
     * @since 3.5.1
     */
    boot: function ()
    {
        this.world = new World(this.scene, this.config);
        this.add = new Factory(this.world);

        this.systems.events.once(SceneEvents.DESTROY, this.destroy, this);
    },

    /**
     * This method is called automatically by the Scene when it is starting up.
     * It is responsible for creating local systems, properties and listening for Scene events.
     * Do not invoke it directly.
     *
     * @method Phaser.Physics.Arcade.ArcadePhysics#start
     * @private
     * @since 3.5.0
     */
    start: function ()
    {
        if (!this.world)
        {
            this.world = new World(this.scene, this.config);
            this.add = new Factory(this.world);
        }

        var eventEmitter = this.systems.events;

        eventEmitter.on(SceneEvents.UPDATE, this.world.update, this.world);
        eventEmitter.on(SceneEvents.POST_UPDATE, this.world.postUpdate, this.world);
        eventEmitter.once(SceneEvents.SHUTDOWN, this.shutdown, this);
    },

    /**
     * Creates the physics configuration for the current Scene.
     *
     * @method Phaser.Physics.Arcade.ArcadePhysics#getConfig
     * @since 3.0.0
     *
     * @return {object} The physics configuration.
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
     * Tests if Game Objects overlap. See {@link Phaser.Physics.Arcade.World#overlap}
     *
     * @method Phaser.Physics.Arcade.ArcadePhysics#overlap
     * @since 3.0.0
     *
     * @param {ArcadeColliderType} object1 - The first object or array of objects to check.
     * @param {ArcadeColliderType} [object2] - The second object or array of objects to check, or `undefined`.
     * @param {ArcadePhysicsCallback} [collideCallback] - An optional callback function that is called if the objects collide.
     * @param {ArcadePhysicsCallback} [processCallback] - An optional callback function that lets you perform additional checks against the two objects if they overlap. If this is set then `collideCallback` will only be called if this callback returns `true`.
     * @param {*} [callbackContext] - The context in which to run the callbacks.
     *
     * @return {boolean} True if at least one Game Object overlaps another.
     *
     * @see Phaser.Physics.Arcade.World#overlap
     */
    overlap: function (object1, object2, overlapCallback, processCallback, callbackContext)
    {
        if (overlapCallback === undefined) { overlapCallback = null; }
        if (processCallback === undefined) { processCallback = null; }
        if (callbackContext === undefined) { callbackContext = overlapCallback; }

        return this.world.collideObjects(object1, object2, overlapCallback, processCallback, callbackContext, true);
    },

    /**
     * Tests if Game Objects overlap and separates them (if possible). See {@link Phaser.Physics.Arcade.World#collide}.
     *
     * @method Phaser.Physics.Arcade.ArcadePhysics#collide
     * @since 3.0.0
     *
     * @param {ArcadeColliderType} object1 - The first object or array of objects to check.
     * @param {ArcadeColliderType} [object2] - The second object or array of objects to check, or `undefined`.
     * @param {ArcadePhysicsCallback} [collideCallback] - An optional callback function that is called if the objects collide.
     * @param {ArcadePhysicsCallback} [processCallback] - An optional callback function that lets you perform additional checks against the two objects if they collide. If this is set then `collideCallback` will only be called if this callback returns `true`.
     * @param {*} [callbackContext] - The context in which to run the callbacks.
     *
     * @return {boolean} True if any overlapping Game Objects were separated, otherwise false.
     *
     * @see Phaser.Physics.Arcade.World#collide
     */
    collide: function (object1, object2, collideCallback, processCallback, callbackContext)
    {
        if (collideCallback === undefined) { collideCallback = null; }
        if (processCallback === undefined) { processCallback = null; }
        if (callbackContext === undefined) { callbackContext = collideCallback; }

        return this.world.collideObjects(object1, object2, collideCallback, processCallback, callbackContext, false);
    },

    /**
     * Pauses the simulation.
     *
     * @method Phaser.Physics.Arcade.ArcadePhysics#pause
     * @since 3.0.0
     *
     * @return {Phaser.Physics.Arcade.World} The simulation.
     */
    pause: function ()
    {
        return this.world.pause();
    },

    /**
     * Resumes the simulation (if paused).
     *
     * @method Phaser.Physics.Arcade.ArcadePhysics#resume
     * @since 3.0.0
     *
     * @return {Phaser.Physics.Arcade.World} The simulation.
     */
    resume: function ()
    {
        return this.world.resume();
    },

    /**
     * Sets the acceleration.x/y property on the game object so it will move towards the x/y coordinates at the given rate (in pixels per second squared)
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
     * @param {number} [speed=60] - The acceleration (change in speed) in pixels per second squared.
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
     * Sets the acceleration.x/y property on the game object so it will move towards the x/y coordinates at the given rate (in pixels per second squared)
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
     * @param {number} [speed=60] - The acceleration (change in speed) in pixels per second squared.
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
     * Finds the Body closest to a source point or object.
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
        var bodies = this.world.tree.all();

        var min = Number.MAX_VALUE;
        var closest = null;
        var x = source.x;
        var y = source.y;

        for (var i = bodies.length - 1; i >= 0; i--)
        {
            var target = bodies[i];
            var distance = DistanceSquared(x, y, target.x, target.y);

            if (distance < min)
            {
                closest = target;
                min = distance;
            }
        }

        return closest;
    },

    /**
     * Finds the Body farthest from a source point or object.
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
        var bodies = this.world.tree.all();

        var max = -1;
        var farthest = null;
        var x = source.x;
        var y = source.y;

        for (var i = bodies.length - 1; i >= 0; i--)
        {
            var target = bodies[i];
            var distance = DistanceSquared(x, y, target.x, target.y);

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
     * Given the angle (in degrees) and speed calculate the velocity and return it as a vector, or set it to the given vector object.
     * One way to use this is: velocityFromAngle(angle, 200, sprite.body.velocity) which will set the values directly to the sprite's velocity and not create a new vector object.
     *
     * @method Phaser.Physics.Arcade.ArcadePhysics#velocityFromAngle
     * @since 3.0.0
     *
     * @param {number} angle - The angle in degrees calculated in clockwise positive direction (down = 90 degrees positive, right = 0 degrees positive, up = 90 degrees negative)
     * @param {number} [speed=60] - The speed it will move, in pixels per second squared.
     * @param {Phaser.Math.Vector2} [vec2] - The Vector2 in which the x and y properties will be set to the calculated velocity.
     *
     * @return {Phaser.Math.Vector2} The Vector2 that stores the velocity.
     */
    velocityFromAngle: function (angle, speed, vec2)
    {
        if (speed === undefined) { speed = 60; }
        if (vec2 === undefined) { vec2 = new Vector2(); }

        return vec2.setToPolar(DegToRad(angle), speed);
    },

    /**
     * Given the rotation (in radians) and speed calculate the velocity and return it as a vector, or set it to the given vector object.
     * One way to use this is: velocityFromRotation(rotation, 200, sprite.body.velocity) which will set the values directly to the sprite's velocity and not create a new vector object.
     *
     * @method Phaser.Physics.Arcade.ArcadePhysics#velocityFromRotation
     * @since 3.0.0
     *
     * @param {number} rotation - The angle in radians.
     * @param {number} [speed=60] - The speed it will move, in pixels per second squared
     * @param {Phaser.Math.Vector2} [vec2] - The Vector2 in which the x and y properties will be set to the calculated velocity.
     *
     * @return {Phaser.Math.Vector2} The Vector2 that stores the velocity.
     */
    velocityFromRotation: function (rotation, speed, vec2)
    {
        if (speed === undefined) { speed = 60; }
        if (vec2 === undefined) { vec2 = new Vector2(); }

        return vec2.setToPolar(rotation, speed);
    },

    /**
     * The Scene that owns this plugin is shutting down.
     * We need to kill and reset all internal properties as well as stop listening to Scene events.
     *
     * @method Phaser.Physics.Arcade.ArcadePhysics#shutdown
     * @since 3.0.0
     */
    shutdown: function ()
    {
        if (!this.world)
        {
            //  Already destroyed
            return;
        }

        var eventEmitter = this.systems.events;

        eventEmitter.off(SceneEvents.UPDATE, this.world.update, this.world);
        eventEmitter.off(SceneEvents.POST_UPDATE, this.world.postUpdate, this.world);
        eventEmitter.off(SceneEvents.SHUTDOWN, this.shutdown, this);

        this.add.destroy();
        this.world.destroy();

        this.add = null;
        this.world = null;
    },

    /**
     * The Scene that owns this plugin is being destroyed.
     * We need to shutdown and then kill off all external references.
     *
     * @method Phaser.Physics.Arcade.ArcadePhysics#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.shutdown();

        this.scene.sys.events.off(SceneEvents.START, this.start, this);

        this.scene = null;
        this.systems = null;
    }

});

PluginCache.register('ArcadePhysics', ArcadePhysics, 'arcadePhysics');

module.exports = ArcadePhysics;
