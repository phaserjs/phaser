/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var DegToRad = require('../../math/DegToRad');
var DistanceBetween = require('../../math/distance/DistanceBetween');
var DistanceSquared = require('../../math/distance/DistanceSquared');
var Factory = require('./Factory');
var GetFastValue = require('../../utils/object/GetFastValue');
var Merge = require('../../utils/object/Merge');
var OverlapCirc = require('./components/OverlapCirc');
var OverlapRect = require('./components/OverlapRect');
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
 * Arcade Physics uses the Projection Method of collision resolution and separation. While it's fast and suitable
 * for 'arcade' style games it lacks stability when multiple objects are in close proximity or resting upon each other.
 * The separation that stops two objects penetrating may create a new penetration against a different object. If you
 * require a high level of stability please consider using an alternative physics system, such as Matter.js.
 *
 * @class ArcadePhysics
 * @memberof Phaser.Physics.Arcade
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Scene} scene - The Scene that this Plugin belongs to.
 */
var ArcadePhysics = class {

    constructor(scene)
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
         * @type {Phaser.Types.Physics.Arcade.ArcadeWorldConfig}
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

        /**
         * Holds the internal collision filter category.
         *
         * @name Phaser.Physics.Arcade.World#_category
         * @private
         * @type {number}
         * @since 3.70.0
         */
        this._category = 0x0001;

        scene.sys.events.once(SceneEvents.BOOT, this.boot, this);
        scene.sys.events.on(SceneEvents.START, this.start, this);
    }

    /**
     * This method is called automatically, only once, when the Scene is first created.
     * Do not invoke it directly.
     *
     * @method Phaser.Physics.Arcade.ArcadePhysics#boot
     * @private
     * @since 3.5.1
     */
    boot()
    {
        this.world = new World(this.scene, this.config);
        this.add = new Factory(this.world);

        this.systems.events.once(SceneEvents.DESTROY, this.destroy, this);
    }

    /**
     * This method is called automatically by the Scene when it is starting up.
     * It is responsible for creating local systems, properties and listening for Scene events.
     * Do not invoke it directly.
     *
     * @method Phaser.Physics.Arcade.ArcadePhysics#start
     * @private
     * @since 3.5.0
     */
    start()
    {
        if (!this.world)
        {
            this.world = new World(this.scene, this.config);
            this.add = new Factory(this.world);
        }

        var eventEmitter = this.systems.events;

        if (!GetFastValue(this.config, 'customUpdate', false))
        {
            eventEmitter.on(SceneEvents.UPDATE, this.world.update, this.world);
        }

        eventEmitter.on(SceneEvents.POST_UPDATE, this.world.postUpdate, this.world);
        eventEmitter.once(SceneEvents.SHUTDOWN, this.shutdown, this);
    }

    /**
     * Causes `World.update` to be automatically called each time the Scene
     * emits and `UPDATE` event. This is the default setting, so only needs
     * calling if you have specifically disabled it.
     *
     * @method Phaser.Physics.Arcade.ArcadePhysics#enableUpdate
     * @since 3.50.0
     */
    enableUpdate()
    {
        this.systems.events.on(SceneEvents.UPDATE, this.world.update, this.world);
    }

    /**
     * Causes `World.update` to **not** be automatically called each time the Scene
     * emits and `UPDATE` event.
     *
     * If you wish to run the World update at your own rate, or from your own
     * component, then you should call this method to disable the built-in link,
     * and then call `World.update(time, delta)` accordingly.
     *
     * Note that `World.postUpdate` is always automatically called when the Scene
     * emits a `POST_UPDATE` event, regardless of this setting.
     *
     * @method Phaser.Physics.Arcade.ArcadePhysics#disableUpdate
     * @since 3.50.0
     */
    disableUpdate()
    {
        this.systems.events.off(SceneEvents.UPDATE, this.world.update, this.world);
    }

    /**
     * Creates the physics configuration for the current Scene.
     *
     * @method Phaser.Physics.Arcade.ArcadePhysics#getConfig
     * @since 3.0.0
     *
     * @return {Phaser.Types.Physics.Arcade.ArcadeWorldConfig} The physics configuration.
     */
    getConfig()
    {
        var gameConfig = this.systems.game.config.physics;
        var sceneConfig = this.systems.settings.physics;

        var config = Merge(
            GetFastValue(sceneConfig, 'arcade', {}),
            GetFastValue(gameConfig, 'arcade', {})
        );

        return config;
    }

    /**
     * Returns the next available collision category.
     *
     * You can have a maximum of 32 categories.
     *
     * By default all bodies collide with all other bodies.
     *
     * Use the `Body.setCollisionCategory()` and
     * `Body.setCollidesWith()` methods to change this.
     *
     * @method Phaser.Physics.Arcade.ArcadePhysics#nextCategory
     * @since 3.70.0
     *
     * @return {number} The next collision category.
     */
    nextCategory()
    {
        this._category = this._category << 1;

        return this._category;
    }

    /**
     * Tests if Game Objects overlap. See {@link Phaser.Physics.Arcade.World#overlap}
     *
     * @method Phaser.Physics.Arcade.ArcadePhysics#overlap
     * @since 3.0.0
     *
     * @param {Phaser.Types.Physics.Arcade.ArcadeColliderType} object1 - The first object or array of objects to check.
     * @param {Phaser.Types.Physics.Arcade.ArcadeColliderType} [object2] - The second object or array of objects to check, or `undefined`.
     * @param {Phaser.Types.Physics.Arcade.ArcadePhysicsCallback} [overlapCallback] - An optional callback function that is called if the objects overlap.
     * @param {Phaser.Types.Physics.Arcade.ArcadePhysicsCallback} [processCallback] - An optional callback function that lets you perform additional checks against the two objects if they overlap. If this is set then `overlapCallback` will only be called if this callback returns `true`.
     * @param {*} [callbackContext] - The context in which to run the callbacks.
     *
     * @return {boolean} True if at least one Game Object overlaps another.
     *
     * @see Phaser.Physics.Arcade.World#overlap
     */
    overlap(object1, object2, overlapCallback, processCallback, callbackContext)
    {
        if (overlapCallback === undefined) { overlapCallback = null; }
        if (processCallback === undefined) { processCallback = null; }
        if (callbackContext === undefined) { callbackContext = overlapCallback; }

        return this.world.collideObjects(object1, object2, overlapCallback, processCallback, callbackContext, true);
    }

    /**
     * Performs a collision check and separation between the two physics enabled objects given, which can be single
     * Game Objects, arrays of Game Objects, Physics Groups, arrays of Physics Groups or normal Groups.
     *
     * If you don't require separation then use {@link #overlap} instead.
     *
     * If two Groups or arrays are passed, each member of one will be tested against each member of the other.
     *
     * If **only** one Group is passed (as `object1`), each member of the Group will be collided against the other members.
     *
     * If **only** one Array is passed, the array is iterated and every element in it is tested against the others.
     *
     * Two callbacks can be provided. The `collideCallback` is invoked if a collision occurs and the two colliding
     * objects are passed to it.
     *
     * Arcade Physics uses the Projection Method of collision resolution and separation. While it's fast and suitable
     * for 'arcade' style games it lacks stability when multiple objects are in close proximity or resting upon each other.
     * The separation that stops two objects penetrating may create a new penetration against a different object. If you
     * require a high level of stability please consider using an alternative physics system, such as Matter.js.
     *
     * @method Phaser.Physics.Arcade.ArcadePhysics#collide
     * @since 3.0.0
     *
     * @param {Phaser.Types.Physics.Arcade.ArcadeColliderType} object1 - The first object or array of objects to check.
     * @param {Phaser.Types.Physics.Arcade.ArcadeColliderType} [object2] - The second object or array of objects to check, or `undefined`.
     * @param {Phaser.Types.Physics.Arcade.ArcadePhysicsCallback} [collideCallback] - An optional callback function that is called if the objects collide.
     * @param {Phaser.Types.Physics.Arcade.ArcadePhysicsCallback} [processCallback] - An optional callback function that lets you perform additional checks against the two objects if they collide. If this is set then `collideCallback` will only be called if this callback returns `true`.
     * @param {*} [callbackContext] - The context in which to run the callbacks.
     *
     * @return {boolean} True if any overlapping Game Objects were separated, otherwise false.
     *
     * @see Phaser.Physics.Arcade.World#collide
     */
    collide(object1, object2, collideCallback, processCallback, callbackContext)
    {
        if (collideCallback === undefined) { collideCallback = null; }
        if (processCallback === undefined) { processCallback = null; }
        if (callbackContext === undefined) { callbackContext = collideCallback; }

        return this.world.collideObjects(object1, object2, collideCallback, processCallback, callbackContext, false);
    }

    /**
     * This advanced method is specifically for testing for collision between a single Sprite and an array of Tile objects.
     *
     * You should generally use the `collide` method instead, with a Sprite vs. a Tilemap Layer, as that will perform
     * tile filtering and culling for you, as well as handle the interesting face collision automatically.
     *
     * This method is offered for those who would like to check for collision with specific Tiles in a layer, without
     * having to set any collision attributes on the tiles in question. This allows you to perform quick dynamic collisions
     * on small sets of Tiles. As such, no culling or checks are made to the array of Tiles given to this method,
     * you should filter them before passing them to this method.
     *
     * Important: Use of this method skips the `interesting faces` system that Tilemap Layers use. This means if you have
     * say a row or column of tiles, and you jump into, or walk over them, it's possible to get stuck on the edges of the
     * tiles as the interesting face calculations are skipped. However, for quick-fire small collision set tests on
     * dynamic maps, this method can prove very useful.
     *
     * @method Phaser.Physics.Arcade.ArcadePhysics#collideTiles
     * @fires Phaser.Physics.Arcade.Events#TILE_COLLIDE
     * @since 3.17.0
     *
     * @param {Phaser.GameObjects.GameObject} sprite - The first object to check for collision.
     * @param {Phaser.Tilemaps.Tile[]} tiles - An array of Tiles to check for collision against.
     * @param {Phaser.Types.Physics.Arcade.ArcadePhysicsCallback} [collideCallback] - An optional callback function that is called if the objects collide.
     * @param {Phaser.Types.Physics.Arcade.ArcadePhysicsCallback} [processCallback] - An optional callback function that lets you perform additional checks against the two objects if they collide. If this is set then `collideCallback` will only be called if this callback returns `true`.
     * @param {any} [callbackContext] - The context in which to run the callbacks.
     *
     * @return {boolean} True if any objects overlap (with `overlapOnly`); or true if any overlapping objects were separated.
     */
    collideTiles(sprite, tiles, collideCallback, processCallback, callbackContext)
    {
        return this.world.collideTiles(sprite, tiles, collideCallback, processCallback, callbackContext);
    }

    /**
     * This advanced method is specifically for testing for overlaps between a single Sprite and an array of Tile objects.
     *
     * You should generally use the `overlap` method instead, with a Sprite vs. a Tilemap Layer, as that will perform
     * tile filtering and culling for you, as well as handle the interesting face collision automatically.
     *
     * This method is offered for those who would like to check for overlaps with specific Tiles in a layer, without
     * having to set any collision attributes on the tiles in question. This allows you to perform quick dynamic overlap
     * tests on small sets of Tiles. As such, no culling or checks are made to the array of Tiles given to this method,
     * you should filter them before passing them to this method.
     *
     * @method Phaser.Physics.Arcade.ArcadePhysics#overlapTiles
     * @fires Phaser.Physics.Arcade.Events#TILE_OVERLAP
     * @since 3.17.0
     *
     * @param {Phaser.GameObjects.GameObject} sprite - The first object to check for collision.
     * @param {Phaser.Tilemaps.Tile[]} tiles - An array of Tiles to check for collision against.
     * @param {Phaser.Types.Physics.Arcade.ArcadePhysicsCallback} [overlapCallback] - An optional callback function that is called if the objects overlap.
     * @param {Phaser.Types.Physics.Arcade.ArcadePhysicsCallback} [processCallback] - An optional callback function that lets you perform additional checks against the two objects if they collide. If this is set then `overlapCallback` will only be called if this callback returns `true`.
     * @param {any} [callbackContext] - The context in which to run the callbacks.
     *
     * @return {boolean} True if any objects overlap (with `overlapOnly`); or true if any overlapping objects were separated.
     */
    overlapTiles(sprite, tiles, overlapCallback, processCallback, callbackContext)
    {
        return this.world.overlapTiles(sprite, tiles, overlapCallback, processCallback, callbackContext);
    }

    /**
     * Pauses the simulation.
     *
     * @method Phaser.Physics.Arcade.ArcadePhysics#pause
     * @since 3.0.0
     *
     * @return {Phaser.Physics.Arcade.World} The simulation.
     */
    pause()
    {
        return this.world.pause();
    }

    /**
     * Resumes the simulation (if paused).
     *
     * @method Phaser.Physics.Arcade.ArcadePhysics#resume
     * @since 3.0.0
     *
     * @return {Phaser.Physics.Arcade.World} The simulation.
     */
    resume()
    {
        return this.world.resume();
    }

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
    accelerateTo(gameObject, x, y, speed, xSpeedMax, ySpeedMax)
    {
        if (speed === undefined) { speed = 60; }

        var angle = Math.atan2(y - gameObject.y, x - gameObject.x);

        gameObject.body.acceleration.setToPolar(angle, speed);

        if (xSpeedMax !== undefined && ySpeedMax !== undefined)
        {
            gameObject.body.maxVelocity.set(xSpeedMax, ySpeedMax);
        }

        return angle;
    }

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
    accelerateToObject(gameObject, destination, speed, xSpeedMax, ySpeedMax)
    {
        return this.accelerateTo(gameObject, destination.x, destination.y, speed, xSpeedMax, ySpeedMax);
    }

    /**
     * Finds the Body or Game Object closest to a source point or object.
     *
     * If a `targets` argument is passed, this method finds the closest of those.
     * The targets can be Arcade Physics Game Objects, Dynamic Bodies, or Static Bodies.
     *
     * If no `targets` argument is passed, this method finds the closest Dynamic Body.
     *
     * If two or more targets are the exact same distance from the source point, only the first target
     * is returned.
     *
     * @method Phaser.Physics.Arcade.ArcadePhysics#closest
     * @since 3.0.0
     *
     * @generic {Phaser.Physics.Arcade.Body|Phaser.Physics.Arcade.StaticBody|Phaser.GameObjects.GameObject} Target
     * @param {Phaser.Types.Math.Vector2Like} source - Any object with public `x` and `y` properties, such as a Game Object or Geometry object.
     * @param {Target[]} [targets] - The targets.
     *
     * @return {Target|null} The target closest to the given source point.
     */
    closest(source, targets)
    {
        if (!targets)
        {
            targets = this.world.bodies.entries;
        }

        var min = Number.MAX_VALUE;
        var closest = null;
        var x = source.x;
        var y = source.y;
        var len = targets.length;

        for (var i = 0; i < len; i++)
        {
            var target = targets[i];
            var body = target.body || target;

            if (source === target || source === body || source === body.gameObject || source === body.center)
            {
                continue;
            }

            var distance = DistanceSquared(x, y, body.center.x, body.center.y);

            if (distance < min)
            {
                closest = target;
                min = distance;
            }
        }

        return closest;
    }

    /**
     * Finds the Body or Game Object farthest from a source point or object.
     *
     * If a `targets` argument is passed, this method finds the farthest of those.
     * The targets can be Arcade Physics Game Objects, Dynamic Bodies, or Static Bodies.
     *
     * If no `targets` argument is passed, this method finds the farthest Dynamic Body.
     *
     * If two or more targets are the exact same distance from the source point, only the first target
     * is returned.
     *
     * @method Phaser.Physics.Arcade.ArcadePhysics#furthest
     * @since 3.0.0
     *
     * @param {any} source - Any object with public `x` and `y` properties, such as a Game Object or Geometry object.
     * @param {(Phaser.Physics.Arcade.Body[]|Phaser.Physics.Arcade.StaticBody[]|Phaser.GameObjects.GameObject[])} [targets] - The targets.
     *
     * @return {?(Phaser.Physics.Arcade.Body|Phaser.Physics.Arcade.StaticBody|Phaser.GameObjects.GameObject)} The target farthest from the given source point.
     */
    furthest(source, targets)
    {
        if (!targets)
        {
            targets = this.world.bodies.entries;
        }

        var max = -1;
        var farthest = null;
        var x = source.x;
        var y = source.y;
        var len = targets.length;

        for (var i = 0; i < len; i++)
        {
            var target = targets[i];
            var body = target.body || target;

            if (source === target || source === body || source === body.gameObject || source === body.center)
            {
                continue;
            }

            var distance = DistanceSquared(x, y, body.center.x, body.center.y);

            if (distance > max)
            {
                farthest = target;
                max = distance;
            }

        }

        return farthest;
    }

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
    moveTo(gameObject, x, y, speed, maxTime)
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
    }

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
    moveToObject(gameObject, destination, speed, maxTime)
    {
        return this.moveTo(gameObject, destination.x, destination.y, speed, maxTime);
    }

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
    velocityFromAngle(angle, speed, vec2)
    {
        if (speed === undefined) { speed = 60; }
        if (vec2 === undefined) { vec2 = new Vector2(); }

        return vec2.setToPolar(DegToRad(angle), speed);
    }

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
    velocityFromRotation(rotation, speed, vec2)
    {
        if (speed === undefined) { speed = 60; }
        if (vec2 === undefined) { vec2 = new Vector2(); }

        return vec2.setToPolar(rotation, speed);
    }

    /**
     * This method will search the given rectangular area and return an array of all physics bodies that
     * overlap with it. It can return either Dynamic, Static bodies or a mixture of both.
     *
     * A body only has to intersect with the search area to be considered, it doesn't have to be fully
     * contained within it.
     *
     * If Arcade Physics is set to use the RTree (which it is by default) then the search for is extremely fast,
     * otherwise the search is O(N) for Dynamic Bodies.
     *
     * @method Phaser.Physics.Arcade.ArcadePhysics#overlapRect
     * @since 3.17.0
     *
     * @param {number} x - The top-left x coordinate of the area to search within.
     * @param {number} y - The top-left y coordinate of the area to search within.
     * @param {number} width - The width of the area to search within.
     * @param {number} height - The height of the area to search within.
     * @param {boolean} [includeDynamic=true] - Should the search include Dynamic Bodies?
     * @param {boolean} [includeStatic=false] - Should the search include Static Bodies?
     *
     * @return {(Phaser.Physics.Arcade.Body[]|Phaser.Physics.Arcade.StaticBody[])} An array of bodies that overlap with the given area.
     */
    overlapRect(x, y, width, height, includeDynamic, includeStatic)
    {
        return OverlapRect(this.world, x, y, width, height, includeDynamic, includeStatic);
    }

    /**
     * This method will search the given circular area and return an array of all physics bodies that
     * overlap with it. It can return either Dynamic, Static bodies or a mixture of both.
     *
     * A body only has to intersect with the search area to be considered, it doesn't have to be fully
     * contained within it.
     *
     * If Arcade Physics is set to use the RTree (which it is by default) then the search is rather fast,
     * otherwise the search is O(N) for Dynamic Bodies.
     *
     * @method Phaser.Physics.Arcade.ArcadePhysics#overlapCirc
     * @since 3.21.0
     *
     * @param {number} x - The x coordinate of the center of the area to search within.
     * @param {number} y - The y coordinate of the center of the area to search within.
     * @param {number} radius - The radius of the area to search within.
     * @param {boolean} [includeDynamic=true] - Should the search include Dynamic Bodies?
     * @param {boolean} [includeStatic=false] - Should the search include Static Bodies?
     *
     * @return {(Phaser.Physics.Arcade.Body[]|Phaser.Physics.Arcade.StaticBody[])} An array of bodies that overlap with the given area.
     */
    overlapCirc(x, y, radius, includeDynamic, includeStatic)
    {
        return OverlapCirc(this.world, x, y, radius, includeDynamic, includeStatic);
    }

    /**
     * The Scene that owns this plugin is shutting down.
     * We need to kill and reset all internal properties as well as stop listening to Scene events.
     *
     * @method Phaser.Physics.Arcade.ArcadePhysics#shutdown
     * @since 3.0.0
     */
    shutdown()
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
        this._category = 1;
    }

    /**
     * The Scene that owns this plugin is being destroyed.
     * We need to shutdown and then kill off all external references.
     *
     * @method Phaser.Physics.Arcade.ArcadePhysics#destroy
     * @since 3.0.0
     */
    destroy()
    {
        this.shutdown();

        this.scene.sys.events.off(SceneEvents.START, this.start, this);

        this.scene = null;
        this.systems = null;
    }

};

PluginCache.register('ArcadePhysics', ArcadePhysics, 'arcadePhysics');

module.exports = ArcadePhysics;
