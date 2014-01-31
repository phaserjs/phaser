/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* @class Phaser.Physics
*/
Phaser.Physics = {};

/**
* Arcade Physics constructor.
*
* @class Phaser.Physics.Arcade
* @classdesc Arcade Physics Constructor
* @constructor
* @param {Phaser.Game} game reference to the current game instance.
*/
Phaser.Physics.Arcade = function (game) {
    
    /**
    * @property {Phaser.Game} game - Local reference to game.
    */
    this.game = game;

    /**
    * @property {Phaser.Point} gravity - The World gravity setting. Defaults to x: 0, y: 0, or no gravity.
    */
    this.gravity = new Phaser.Point();

    /**
    * @property {SAT.Box} worldLeft - The left hand side of the physics bounds.
    */
    this.worldLeft = null;

    /**
    * @property {SAT.Box} worldRight - The right hand side of the physics bounds.
    */
    this.worldRight = null;

    /**
    * @property {SAT.Box} worldTop - The top side of the physics bounds.
    */
    this.worldTop = null;

    /**
    * @property {SAT.Box} worldBottom - The bottom of the physics bounds.
    */
    this.worldBottom = null;

    /**
    * @property {array<SAT.Polygon>} worldPolys - An array of the polygon data from the physics bounds.
    */
    this.worldPolys = [ null, null, null, null ];

    /**
    * @property {Phaser.QuadTree} quadTree - The world QuadTree.
    */
    this.quadTree = new Phaser.QuadTree(this.game.world.bounds.x, this.game.world.bounds.y, this.game.world.bounds.width, this.game.world.bounds.height, this.maxObjects, this.maxLevels);

    /**
    * @property {number} maxObjects - Used by the QuadTree to set the maximum number of objects per quad.
    */
    this.maxObjects = 10;

    /**
    * @property {number} maxLevels - Used by the QuadTree to set the maximum number of iteration levels.
    */
    this.maxLevels = 4;

    /**
    * @property {Array} _mapData - Internal cache var.
    * @private
    */
    this._mapData = [];

    /**
    * @property {number} _mapTiles - Internal cache var.
    * @private
    */
    this._mapTiles = 0;

    /**
    * @property {boolean} _result - Internal cache var.
    * @private
    */
    this._result = false;

    /**
    * @property {number} _total - Internal cache var.
    * @private
    */
    this._total = 0;

    /**
    * @property {number} _angle - Internal cache var.
    * @private
    */
    this._angle = 0;

    /**
    * @property {number} _drag - Internal cache var.
    * @private
    */
    this._drag = 0;

    /**
    * @property {number} _dx - Internal cache var.
    * @private
    */
    this._dx = 0;

    /**
    * @property {number} _dy - Internal cache var.
    * @private
    */
    this._dy = 0;

    /**
    * @property {Phaser.Point} _p - Internal cache var.
    * @private
    */
    this._p = new Phaser.Point(0, 0);

    /**
    * @property {number} _intersection - Internal cache var.
    * @private
    */
    this._intersection = [0,0,0,0];

    /**
    * @property {number} _gravityX - Internal cache var.
    * @private
    */
    this._gravityX = 0;

    /**
    * @property {number} _gravityY - Internal cache var.
    * @private
    */
    this._gravityY = 0;

    /**
    * @property {SAT.Response} _response - Internal cache var.
    * @private
    */
    this._response = new SAT.Response();

    //  Set the bounds to the world as default
    this.setBoundsToWorld(true, true, true, true);

};

/**
* @constant
* @type {number}
*/
Phaser.Physics.Arcade.RECT = 0;

/**
* @constant
* @type {number}
*/
Phaser.Physics.Arcade.CIRCLE = 1;

/**
* @constant
* @type {number}
*/
Phaser.Physics.Arcade.POLYGON = 2;

Phaser.Physics.Arcade.prototype = {

    /**
    * Checks the given Physics.Body against the Physics Bounds, if any are set, and separates them, setting the blocked flags on the Body as it does so.
    *
    * @method Phaser.Physics.Arcade#checkBounds
    * @param {Phaser.Physics.Arcade.Body} The Body object to be checked.
    * @return {boolean} True if the body hit the bounds, otherwise false.
    */
    checkBounds: function (body) {

        if (!body.collideWorldBounds || (!this.worldLeft && !this.worldRight && !this.worldTop && !this.worldBottom))
        {
            return;
        }

        this._response.clear();

        var test = SAT.testPolygonPolygon;
        var part = body.polygon;
        var rebounded = false;

        if (body.type === Phaser.Physics.Arcade.CIRCLE)
        {
            test = SAT.testPolygonCircle;
            part = body.shape;
        }

        if (this.worldLeft && test(this.worldPolys[0], part, this._response))
        {
            body.blocked.left = true;
            part.pos.add(this._response.overlapV);
            body.blocked.x = Math.floor(body.x);
            body.blocked.y = Math.floor(body.y);
            rebounded = true;
        }
        else if (this.worldRight && test(this.worldPolys[1], part, this._response))
        {
            body.blocked.right = true;
            part.pos.add(this._response.overlapV);
            body.blocked.x = Math.floor(body.x);
            body.blocked.y = Math.floor(body.y);
            rebounded = true;
        }

        this._response.clear();

        if (this.worldTop && test(this.worldPolys[2], part, this._response))
        {
            body.blocked.up = true;
            part.pos.add(this._response.overlapV);
            body.blocked.x = Math.floor(body.x);
            body.blocked.y = Math.floor(body.y);
            rebounded = true;
        }
        else if (this.worldBottom && test(this.worldPolys[3], part, this._response))
        {
            body.blocked.down = true;
            part.pos.add(this._response.overlapV);
            body.blocked.x = Math.floor(body.x);
            body.blocked.y = Math.floor(body.y);
            rebounded = true;
        }

        return rebounded;

        if (body.sprite.debug)
        {
            console.log('checkBounds finished', body.blocked);
        }

    },

    /**
    * Sets the bounds of the Physics world to match the Game.World.
    * You can optionally set which 'walls' to create: left, right, top or bottom.
    *
    * @method Phaser.Physics.Arcade#setBoundsToWorld
    * @param {boolean} [left=true] - If true will create the left bounds wall.
    * @param {boolean} [right=true] - If true will create the right bounds wall.
    * @param {boolean} [top=true] - If true will create the top bounds wall.
    * @param {boolean} [bottom=true] - If true will create the bottom bounds wall.
    */
    setBoundsToWorld: function (left, right, top, bottom) {

        this.setBounds(this.game.world.bounds.x, this.game.world.bounds.y, this.game.world.bounds.width, this.game.world.bounds.height, left, right, top, bottom);

    },

    /**
    * Sets the bounds of the Physics world to match the given world pixel dimensions.
    * You can optionally set which 'walls' to create: left, right, top or bottom.
    *
    * @method Phaser.Physics.Arcade#setBounds
    * @param {number} x - The x coordinate of the top-left corner of the bounds.
    * @param {number} y - The y coordinate of the top-left corner of the bounds.
    * @param {number} width - The width of the bounds.
    * @param {number} height - The height of the bounds.
    * @param {boolean} [left=true] - If true will create the left bounds wall.
    * @param {boolean} [right=true] - If true will create the right bounds wall.
    * @param {boolean} [top=true] - If true will create the top bounds wall.
    * @param {boolean} [bottom=true] - If true will create the bottom bounds wall.
    */
    setBounds: function (x, y, width, height, left, right, top, bottom) {

        if (typeof left === 'undefined') { left = true; }
        if (typeof right === 'undefined') { right = true; }
        if (typeof top === 'undefined') { top = true; }
        if (typeof bottom === 'undefined') { bottom = true; }

        var thickness = 100;

        if (left)
        {
            this.worldLeft = new SAT.Box(new SAT.Vector(x - thickness, y), thickness, height);
            this.worldPolys[0] = this.worldLeft.toPolygon();
        }
        else
        {
            this.worldLeft = null;
            this.worldPolys[0] = null;
        }

        if (right)
        {
            this.worldRight = new SAT.Box(new SAT.Vector(x + width, y), thickness, height);
            this.worldPolys[1] = this.worldRight.toPolygon();
        }
        else
        {
            this.worldRight = null;
            this.worldPolys[1] = null;
        }

        if (top)
        {
            this.worldTop = new SAT.Box(new SAT.Vector(x, y - thickness), width, thickness);
            this.worldPolys[2] = this.worldTop.toPolygon();
        }
        else
        {
            this.worldTop = null;
            this.worldPolys[2] = null;
        }

        if (bottom)
        {
            this.worldBottom = new SAT.Box(new SAT.Vector(x, y + height), width, thickness);
            this.worldPolys[3] = this.worldBottom.toPolygon();
        }
        else
        {
            this.worldBottom = null;
            this.worldPolys[3] = null;
        }

    },

    /**
    * Called automatically by a Physics body, it updates all motion related values on the Body.
    *
    * @method Phaser.Physics.Arcade#updateMotion
    * @param {Phaser.Physics.Arcade.Body} The Body object to be updated.
    */
    updateMotion: function (body) {

        //  If you're wondering why the velocity is halved and applied twice, read this: http://www.niksula.hut.fi/~hkankaan/Homepages/gravity.html

        //  World gravity is allowed
        if (body.allowGravity)
        {
            this._gravityX = this.gravity.x + body.gravity.x;
            this._gravityY = this.gravity.y + body.gravity.y;
        }
        else
        {
            this._gravityX = body.gravity.x;
            this._gravityY = body.gravity.y;
        }

        //  Don't apply gravity to any body that is blocked
        if ((this._gravityX < 0 && body.blocked.left) || (this._gravityX > 0 && body.blocked.right))
        {
            this._gravityX = 0;
        }

        if ((this._gravityY < 0 && body.blocked.up) || (this._gravityY > 0 && body.blocked.down))
        {
            this._gravityY = 0;
        }

        //  Rotation
        if (body.allowRotation)
        {
            this._velocityDelta = body.angularAcceleration * this.game.time.physicsElapsed;

            if (body.angularDrag !== 0 && body.angularAcceleration === 0)
            {
                this._drag = body.angularDrag * this.game.time.physicsElapsed;

                if (body.angularVelocity > 0)
                {
                    body.angularVelocity -= this._drag;
                }
                else if (body.angularVelocity < 0)
                {
                    body.angularVelocity += this._drag;
                }
            }

            body.rotation += this.game.time.physicsElapsed * (body.angularVelocity + this._velocityDelta / 2);
            body.angularVelocity += this._velocityDelta;
    
            if (body.angularVelocity > body.maxAngular)
            {
                body.angularVelocity = body.maxAngular;
            }
            else if (body.angularVelocity < -body.maxAngular)
            {
                body.angularVelocity = -body.maxAngular;
            }
        }

        // temp = acc*dt
        // pos = pos + dt*(vel + temp/2)
        // vel = vel + temp

        if (body.sprite.debug)
        {
            console.log('updateMotion: acx', body.acceleration.x, 'acy', body.acceleration.y, 'gravx', this._gravityX, 'gravy', this._gravityY, 'elapsed', this.game.time.physicsElapsed);
            // console.log('updateMotion: rotation', body.rotation, 'vd', this._velocityDelta, 'drag', this._drag, 'acceleration', body.angularAcceleration);
        }

        this._p.setTo((body.acceleration.x + this._gravityX) * this.game.time.physicsElapsed, (body.acceleration.y + this._gravityY) * this.game.time.physicsElapsed);

        return this._p;

    },

    /**
    * Checks for overlaps between two game objects. The objects can be Sprites, Groups or Emitters.
    * You can perform Sprite vs. Sprite, Sprite vs. Group and Group vs. Group overlap checks.
    * Unlike collide the objects are NOT automatically separated or have any physics applied, they merely test for overlap results.
    *
    * @method Phaser.Physics.Arcade#overlap
    * @param {Phaser.Sprite|Phaser.Group|Phaser.Particles.Emitter} object1 - The first object to check. Can be an instance of Phaser.Sprite, Phaser.Group or Phaser.Particles.Emitter.
    * @param {Phaser.Sprite|Phaser.Group|Phaser.Particles.Emitter} object2 - The second object to check. Can be an instance of Phaser.Sprite, Phaser.Group or Phaser.Particles.Emitter.
    * @param {function} [overlapCallback=null] - An optional callback function that is called if the objects overlap. The two objects will be passed to this function in the same order in which you specified them.
    * @param {function} [processCallback=null] - A callback function that lets you perform additional checks against the two objects if they overlap. If this is set then overlapCallback will only be called if processCallback returns true.
    * @param {object} [callbackContext] - The context in which to run the callbacks.
    * @returns {boolean} True if an overlap occured otherwise false.
    */
    overlap: function (object1, object2, overlapCallback, processCallback, callbackContext) {

        overlapCallback = overlapCallback || null;
        processCallback = processCallback || null;
        callbackContext = callbackContext || overlapCallback;

        this._result = false;
        this._total = 0;

        this.collideHandler(object1, object2, overlapCallback, processCallback, callbackContext, true);

        return (this._total > 0);

    },

    /**
    * Checks for overlaps between a game object and a array of game objects. You can perform Sprite vs. Sprite, Sprite vs. Group, Group vs. Group, Sprite vs. Tilemap Layer or Group vs. Tilemap Layer checks.
    * Unlike collide the objects are NOT automatically separated or have any physics applied, they merely test for overlap results.
    * An optional processCallback can be provided. If given this function will be called when two sprites are found to be overlapping,
    * giving you the chance to perform additional checks. If the function returns true then the overlap takes place. If it returns false it is skipped.
    * The collideCallback is an optional function that is only called if two sprites collide. If a processCallback has been set then it needs to return true for overlapCallback to be called.
    *
    * @method Phaser.Physics.Arcade#overlapArray
    * @param {Phaser.Sprite|Phaser.Group|Phaser.Particles.Emitter|Phaser.Tilemap} object1 - The first object to check. Can be an instance of Phaser.Sprite, Phaser.Group, Phaser.Particles.Emitter, or Phaser.Tilemap.
    * @param {<Phaser.Sprite>array|<Phaser.Group>array|<Phaser.Particles.Emitter>array|<Phaser.Tilemap>array} objectArray - An array of objects to check. Can contain instances of Phaser.Sprite, Phaser.Group, Phaser.Particles.Emitter or Phaser.Tilemap.
    * @param {function} [overlapCallback=null] - An optional callback function that is called if the objects overlap. The two objects will be passed to this function in the same order in which you specified them.
    * @param {function} [processCallback=null] - A callback function that lets you perform additional checks against the two objects if they overlap. If this is set then collision will only happen if processCallback returns true. The two objects will be passed to this function in the same order in which you specified them.
    * @param {object} [callbackContext] - The context in which to run the callbacks.
    * @returns {boolean} True if a collision occured otherwise false.
    */
    overlapArray: function (object1, objectArray, overlapCallback, processCallback, callbackContext) {

        overlapCallback = overlapCallback || null;
        processCallback = processCallback || null;
        callbackContext = callbackContext || overlapCallback;

        this._result = false;
        this._total = 0;

        for (var i = 0,  len = objectArray.length; i < len; i++)
        {
            this.collideHandler(object1, objectArray[i], overlapCallback, processCallback, callbackContext, true);
        }

        return (this._total > 0);

    },

    /**
    * Checks for collision between two game objects. You can perform Sprite vs. Sprite, Sprite vs. Group, Group vs. Group, Sprite vs. Tilemap Layer or Group vs. Tilemap Layer collisions.
    * If you'd like to collide an array of objects see Phaser.Physics.Arcade#collideArray.
    * The objects are also automatically separated. If you don't require separation then use ArcadePhysics.overlap instead.
    * An optional processCallback can be provided. If given this function will be called when two sprites are found to be colliding. It is called before any separation takes place,
    * giving you the chance to perform additional checks. If the function returns true then the collision and separation is carried out. If it returns false it is skipped.
    * The collideCallback is an optional function that is only called if two sprites collide. If a processCallback has been set then it needs to return true for collideCallback to be called.
    *
    * @method Phaser.Physics.Arcade#collide
    * @param {Phaser.Sprite|Phaser.Group|Phaser.Particles.Emitter|Phaser.Tilemap} object1 - The first object to check. Can be an instance of Phaser.Sprite, Phaser.Group, Phaser.Particles.Emitter, or Phaser.Tilemap.
    * @param {Phaser.Sprite|Phaser.Group|Phaser.Particles.Emitter|Phaser.Tilemap} object2 - The second object to check. Can be an instance of Phaser.Sprite, Phaser.Group, Phaser.Particles.Emitter or Phaser.Tilemap.
    * @param {function} [collideCallback=null] - An optional callback function that is called if the objects collide. The two objects will be passed to this function in the same order in which you specified them.
    * @param {function} [processCallback=null] - A callback function that lets you perform additional checks against the two objects if they overlap. If this is set then collision will only happen if processCallback returns true. The two objects will be passed to this function in the same order in which you specified them.
    * @param {object} [callbackContext] - The context in which to run the callbacks.
    * @returns {boolean} True if a collision occured otherwise false.
    */
    collide: function (object1, object2, collideCallback, processCallback, callbackContext) {

        collideCallback = collideCallback || null;
        processCallback = processCallback || null;
        callbackContext = callbackContext || collideCallback;

        this._result = false;
        this._total = 0;

        this.collideHandler(object1, object2, collideCallback, processCallback, callbackContext, false);

        return (this._total > 0);

    },

    /**
    * Checks for collision between a game object and an array of game objects. You can perform Sprite vs. Sprite, Sprite vs. Group, Group vs. Group, Sprite vs. Tilemap Layer or Group vs. Tilemap Layer collisions.
    * The objects are also automatically separated. If you don't require separation then use ArcadePhysics.overlap instead.
    * An optional processCallback can be provided. If given this function will be called when two sprites are found to be colliding. It is called before any separation takes place,
    * giving you the chance to perform additional checks. If the function returns true then the collision and separation is carried out. If it returns false it is skipped.
    * The collideCallback is an optional function that is only called if two sprites collide. If a processCallback has been set then it needs to return true for collideCallback to be called.
    *
    * @method Phaser.Physics.Arcade#collideArray
    * @param {Phaser.Sprite|Phaser.Group|Phaser.Particles.Emitter|Phaser.Tilemap} object1 - The first object to check. Can be an instance of Phaser.Sprite, Phaser.Group, Phaser.Particles.Emitter, or Phaser.Tilemap.
    * @param {<Phaser.Sprite>array|<Phaser.Group>array|<Phaser.Particles.Emitter>array|<Phaser.Tilemap>array} objectArray - An array of objects to check. Can contain instances of Phaser.Sprite, Phaser.Group, Phaser.Particles.Emitter or Phaser.Tilemap.
    * @param {function} [collideCallback=null] - An optional callback function that is called if the objects collide. The two objects will be passed to this function in the same order in which you specified them.
    * @param {function} [processCallback=null] - A callback function that lets you perform additional checks against the two objects if they overlap. If this is set then collision will only happen if processCallback returns true. The two objects will be passed to this function in the same order in which you specified them.
    * @param {object} [callbackContext] - The context in which to run the callbacks.
    * @returns {boolean} True if a collision occured otherwise false.
    */
    collideArray: function (object1, objectArray, collideCallback, processCallback, callbackContext) {

        collideCallback = collideCallback || null;
        processCallback = processCallback || null;
        callbackContext = callbackContext || collideCallback;

        this._result = false;
        this._total = 0;

        for (var i = 0,  len = objectArray.length; i < len; i++)
        {
            this.collideHandler(object1, objectArray[i], collideCallback, processCallback, callbackContext, false);
        }

        return (this._total > 0);

    },

    /**
    * Internal collision handler.
    *
    * @method Phaser.Physics.Arcade#collideHandler
    * @private
    * @param {Phaser.Sprite|Phaser.Group|Phaser.Particles.Emitter|Phaser.Tilemap} object1 - The first object to check. Can be an instance of Phaser.Sprite, Phaser.Group, Phaser.Particles.Emitter, or Phaser.Tilemap.
    * @param {Phaser.Sprite|Phaser.Group|Phaser.Particles.Emitter|Phaser.Tilemap} object2 - The second object to check. Can be an instance of Phaser.Sprite, Phaser.Group, Phaser.Particles.Emitter or Phaser.Tilemap. Can also be an array of objects to check.
    * @param {function} collideCallback - An optional callback function that is called if the objects collide. The two objects will be passed to this function in the same order in which you specified them.
    * @param {function} processCallback - A callback function that lets you perform additional checks against the two objects if they overlap. If this is set then collision will only happen if processCallback returns true. The two objects will be passed to this function in the same order in which you specified them.
    * @param {object} callbackContext - The context in which to run the callbacks.
    * @param {boolean} overlapOnly - Just run an overlap or a full collision.
    */
    collideHandler: function (object1, object2, collideCallback, processCallback, callbackContext, overlapOnly) {

        //  Only collide valid objects
        if (typeof object2 === 'undefined' && (object1.type === Phaser.GROUP || object1.type === Phaser.EMITTER))
        {
            this.collideGroupVsSelf(object1, collideCallback, processCallback, callbackContext, overlapOnly);
            return;
        }

        if (object1 && object2 && object1.exists && object2.exists)
        {
            //  SPRITES
            if (object1.type == Phaser.SPRITE || object1.type == Phaser.TILESPRITE)
            {
                if (object2.type == Phaser.SPRITE || object2.type == Phaser.TILESPRITE)
                {
                    this.collideSpriteVsSprite(object1, object2, collideCallback, processCallback, callbackContext, overlapOnly);
                }
                else if (object2.type == Phaser.GROUP || object2.type == Phaser.EMITTER)
                {
                    this.collideSpriteVsGroup(object1, object2, collideCallback, processCallback, callbackContext, overlapOnly);
                }
                else if (object2.type == Phaser.TILEMAPLAYER)
                {
                    this.collideSpriteVsTilemapLayer(object1, object2, collideCallback, processCallback, callbackContext);
                }
            }
            //  GROUPS
            else if (object1.type == Phaser.GROUP)
            {
                if (object2.type == Phaser.SPRITE || object2.type == Phaser.TILESPRITE)
                {
                    this.collideSpriteVsGroup(object2, object1, collideCallback, processCallback, callbackContext, overlapOnly);
                }
                else if (object2.type == Phaser.GROUP || object2.type == Phaser.EMITTER)
                {
                    this.collideGroupVsGroup(object1, object2, collideCallback, processCallback, callbackContext, overlapOnly);
                }
                else if (object2.type == Phaser.TILEMAPLAYER)
                {
                    this.collideGroupVsTilemapLayer(object1, object2, collideCallback, processCallback, callbackContext);
                }
            }
            //  TILEMAP LAYERS
            else if (object1.type == Phaser.TILEMAPLAYER)
            {
                if (object2.type == Phaser.SPRITE || object2.type == Phaser.TILESPRITE)
                {
                    this.collideSpriteVsTilemapLayer(object2, object1, collideCallback, processCallback, callbackContext);
                }
                else if (object2.type == Phaser.GROUP || object2.type == Phaser.EMITTER)
                {
                    this.collideGroupVsTilemapLayer(object2, object1, collideCallback, processCallback, callbackContext);
                }
            }
            //  EMITTER
            else if (object1.type == Phaser.EMITTER)
            {
                if (object2.type == Phaser.SPRITE || object2.type == Phaser.TILESPRITE)
                {
                    this.collideSpriteVsGroup(object2, object1, collideCallback, processCallback, callbackContext, overlapOnly);
                }
                else if (object2.type == Phaser.GROUP || object2.type == Phaser.EMITTER)
                {
                    this.collideGroupVsGroup(object1, object2, collideCallback, processCallback, callbackContext, overlapOnly);
                }
                else if (object2.type == Phaser.TILEMAPLAYER)
                {
                    this.collideGroupVsTilemapLayer(object1, object2, collideCallback, processCallback, callbackContext);
                }
            }
        }

    },

    /**
    * An internal function. Use Phaser.Physics.Arcade.collide instead.
    *
    * @method Phaser.Physics.Arcade#collideSpriteVsSprite
    * @private
    */
    collideSpriteVsSprite: function (sprite1, sprite2, collideCallback, processCallback, callbackContext, overlapOnly) {

        if (this.separate(sprite1.body, sprite2.body, processCallback, callbackContext, overlapOnly))
        {
            if (collideCallback)
            {
                collideCallback.call(callbackContext, sprite1, sprite2);
            }

            this._total++;
        }

    },

    /**
    * An internal function. Use Phaser.Physics.Arcade.collide instead.
    *
    * @method Phaser.Physics.Arcade#collideSpriteVsGroup
    * @private
    */
    collideSpriteVsGroup: function (sprite, group, collideCallback, processCallback, callbackContext, overlapOnly) {

        if (group.length === 0)
        {
            return;
        }

        //  What is the sprite colliding with in the quadtree?
        this.quadTree.clear();

        this.quadTree = new Phaser.QuadTree(this.game.world.bounds.x, this.game.world.bounds.y, this.game.world.bounds.width, this.game.world.bounds.height, this.maxObjects, this.maxLevels);

        this.quadTree.populate(group);

        this._potentials = this.quadTree.retrieve(sprite);

        for (var i = 0, len = this._potentials.length; i < len; i++)
        {
            //  We have our potential suspects, are they in this group?
            if (this.separate(sprite.body, this._potentials[i], processCallback, callbackContext, overlapOnly))
            {
                if (collideCallback)
                {
                    collideCallback.call(callbackContext, sprite, this._potentials[i].sprite);
                }

                this._total++;
            }
        }

    },

    /**
    * An internal function. Use Phaser.Physics.Arcade.collide instead.
    *
    * @method Phaser.Physics.Arcade#collideGroupVsSelf
    * @private
    */
    collideGroupVsSelf: function (group, collideCallback, processCallback, callbackContext, overlapOnly) {

        if (group.length === 0)
        {
            return;
        }

        var len = group._container.children.length;

        for (var i = 0; i < len; i++)
        {
            for (var j = i + 1; j <= len; j++)
            {
                if (group._container.children[i] && group._container.children[j] && group._container.children[i].exists && group._container.children[j].exists)
                {
                    this.collideSpriteVsSprite(group._container.children[i], group._container.children[j], collideCallback, processCallback, callbackContext, overlapOnly);
                }
            }
        }

    },

    /**
    * An internal function. Use Phaser.Physics.Arcade.collide instead.
    *
    * @method Phaser.Physics.Arcade#collideGroupVsGroup
    * @private
    */
    collideGroupVsGroup: function (group1, group2, collideCallback, processCallback, callbackContext, overlapOnly) {

        if (group1.length === 0 || group2.length === 0)
        {
            return;
        }

        if (group1._container.first._iNext)
        {
            var currentNode = group1._container.first._iNext;
                
            do
            {
                if (currentNode.exists)
                {
                    this.collideSpriteVsGroup(currentNode, group2, collideCallback, processCallback, callbackContext, overlapOnly);
                }
                currentNode = currentNode._iNext;
            }
            while (currentNode != group1._container.last._iNext);
        }

    },

    /**
    * An internal function. Use Phaser.Physics.Arcade.collide instead.
    *
    * @method Phaser.Physics.Arcade#collideSpriteVsTilemapLayer
    * @private
    */
    collideSpriteVsTilemapLayer: function (sprite, tilemapLayer, collideCallback, processCallback, callbackContext) {

        // console.log('collideSpriteVsTilemapLayer x:', sprite.body.x, 'y:', sprite.body.y, 'body left:', sprite.body.left, 'right:', sprite.body.right);

        this._mapData = tilemapLayer.getTiles(sprite.body.left, sprite.body.top, sprite.body.width, sprite.body.height, true);

        if (this._mapData.length === 0)
        {
            return;
        }

        if (this._mapData.length > 1)
        {
            this.separateTiles(sprite.body, this._mapData);
        }
        else
        {
            var i = 0;

            if (this.separateTile(sprite.body, this._mapData[i]))
            {
                //  They collided, is there a custom process callback?
                if (processCallback)
                {
                    if (processCallback.call(callbackContext, sprite, this._mapData[i]))
                    {
                        this._total++;

                        if (collideCallback)
                        {
                            collideCallback.call(callbackContext, sprite, this._mapData[i]);
                        }
                    }
                }
                else
                {
                    this._total++;

                    if (collideCallback)
                    {
                        collideCallback.call(callbackContext, sprite, this._mapData[i]);
                    }
                }
            }
        }

    },

    /**
    * An internal function. Use Phaser.Physics.Arcade.collide instead.
    *
    * @method Phaser.Physics.Arcade#collideGroupVsTilemapLayer
    * @private
    */
    collideGroupVsTilemapLayer: function (group, tilemapLayer, collideCallback, processCallback, callbackContext) {

        if (group.length === 0)
        {
            return;
        }

        if (group._container.first._iNext)
        {
            var currentNode = group._container.first._iNext;
                
            do
            {
                if (currentNode.exists)
                {
                    this.collideSpriteVsTilemapLayer(currentNode, tilemapLayer, collideCallback, processCallback, callbackContext);
                }
                currentNode = currentNode._iNext;
            }
            while (currentNode != group._container.last._iNext);
        }

    },

    /**
    * The core separation function to separate two physics bodies.
    * @method Phaser.Physics.Arcade#separate
    * @param {Phaser.Physics.Arcade.Body} body1 - The Body object to separate.
    * @param {Phaser.Physics.Arcade.Body} body2 - The Body object to separate.
    * @param {function} [processCallback=null] - A callback function that lets you perform additional checks against the two objects if they overlap. If this function is set then the sprites will only be collided if it returns true.
    * @param {object} [callbackContext] - The context in which to run the process callback.
    * @returns {boolean} Returns true if the bodies collided, otherwise false.
    */
    separate: function (body1, body2, processCallback, callbackContext, overlapOnly) {

        if (body1 === body2 || this.intersects(body1, body2) === false)
        {
            return false;
        }

        //  They overlap. Is there a custom process callback? If it returns true then we can carry on, otherwise we should abort.
        if (processCallback && processCallback.call(callbackContext, body1.sprite, body2.sprite) === false)
        {
            return false;
        }

        this._response.clear();

        if (overlapOnly)
        {
            return body1.overlap(body2, this._response);
        }
        else
        {
            if (body1.overlap(body2, this._response))
            {
                return body1.separate(body2, this._response);
            }
        }

        return false;

    },

    /**
    * Performs a rect intersection test against the two objects.
    * Objects must expose properties: width, height, left, right, top, bottom.
    * @method Phaser.Physics.Arcade#intersects
    * @param {object} a - The first object to test.
    * @param {object} b - The second object to test.
    * @returns {boolean} Returns true if the objects intersect, otherwise false.
    */
    intersects: function (a, b) {

        if (a.width <= 0 || a.height <= 0 || b.width <= 0 || b.height <= 0)
        {
            return false;
        }

        return !(a.right < b.left || a.bottom < b.top || a.left > b.right || a.top > b.bottom);

    },

    /**
    * Performs a rect intersection test against the two objects.
    * Objects must expose properties: width, height, left, right, top, bottom.
    * @method Phaser.Physics.Arcade#tileIntersects
    * @param {object} body - The Body to test.
    * @param {object} tile - The Tile to test.
    * @returns {boolean} Returns true if the objects intersect, otherwise false.
    */
    tileIntersects: function (body, tile) {

        if (body.width <= 0 || body.height <= 0 || tile.width <= 0 || tile.height <= 0)
        {
            this._intersection[4] = 0;
            return this._intersection;
        }

        // console.log('____ tileIntersects');
        // console.log('body: ', body.left, body.top, body.right, body.bottom);
        // console.log('tile: ', tile.x, tile.y, tile.right, tile.bottom);

        if (!(body.right < tile.x || body.bottom < tile.y || body.left > tile.right || body.top > tile.bottom))
        {
            this._intersection[0] = Math.max(body.left, tile.x);                                    // x
            this._intersection[1] = Math.max(body.top, tile.y);                                     // y
            this._intersection[2] = Math.min(body.right, tile.right) - this._intersection[0];       // width
            this._intersection[3] = Math.min(body.bottom, tile.bottom) - this._intersection[1];     // height
            this._intersection[4] = 1;

            return this._intersection;
        }

        this._intersection[4] = 0;
        return this._intersection;

    },

    /**
    * The core separation function to separate a physics body and an array of tiles.
    * @method Phaser.Physics.Arcade#separateTiles
    * @param {Phaser.Physics.Arcade.Body} body - The Body object to separate.
    * @param {<Phaser.Tile>array} tiles - The array of tiles to collide against.
    * @returns {boolean} Returns true if the body was separated, otherwise false.
    */
    separateTiles: function (body, tiles) {

        // console.log('!!! separateTiles', tiles);

        var tile;
        var result = false;

        for (var i = 0; i < tiles.length; i++)
        {
            tile = tiles[i];

            if (this.separateTile(body, tile))
            {
                result = true;
            }
        }

        return result;

    },

    /**
    * The core separation function to separate a physics body and a tile.
    * @method Phaser.Physics.Arcade#separateTile
    * @param {Phaser.Physics.Arcade.Body} body - The Body object to separate.
    * @param {Phaser.Tile} tile - The tile to collide against.
    * @returns {boolean} Returns true if the body was separated, otherwise false.
    */
    separateTile: function (body, tile) {

        this._intersection = this.tileIntersects(body, tile);

        //  If the intersection area is either entirely null, or has a width/height of zero, we bail out now
        if (this._intersection[4] === 0 || this._intersection[2] === 0 || this._intersection[3] === 0)
        {
            // console.log('Tile does not intersect body');
            return false;
        }

        // console.log('*** separateTile', tile);
        // console.log('intersection', this._intersection);

        // tile.tile.debug = true;

        //  They overlap. Any custom callbacks?
        if (tile.tile.callback || tile.layer.callbacks[tile.tile.index])
        {
            //  A local callback takes priority over a global callback.
            if (tile.tile.callback && tile.tile.callback.call(tile.tile.callbackContext, body.sprite, tile) === false)
            {
                //  Is there a tile specific collision callback? If it returns true then we can carry on, otherwise we should abort.
                return false;
            }
            else if (tile.layer.callbacks[tile.tile.index] && tile.layer.callbacks[tile.tile.index].callback.call(tile.layer.callbacks[tile.tile.index].callbackContext, body.sprite, tile) === false)
            {
                //  Is there a tile index collision callback? If it returns true then we can carry on, otherwise we should abort.
                return false;
            }
        }

        body.overlapX = 0;
        body.overlapY = 0;

        var process = false;

        if (body.deltaX() < 0 && body.checkCollision.left && tile.tile.faceRight && !body.blocked.left)
        {
            //  LEFT
            body.overlapX = body.left - tile.right;

            // console.log('ST left', body.overlapX, body.deltaX(), 'bt', body.left, tile.right);

            if (body.overlapX < 0)
            {
                process = true;
            }
            else
            {
                body.overlapX = 0;
            }
        }
        else if (body.deltaX() > 0 && body.checkCollision.right && tile.tile.faceLeft && !body.blocked.right)
        {
            //  RIGHT
            body.overlapX = body.right - tile.x;

            // console.log('ST right', body.overlapX, body.deltaX(), 'bt', body.right, tile.x);

            if (body.overlapX > 0)
            {
                process = true;
            }
            else
            {
                body.overlapX = 0;
            }
        }

        if (body.deltaY() < 0 && body.checkCollision.up && tile.tile.faceBottom && !body.blocked.up)
        {
            //  UP
            body.overlapY = body.top - tile.bottom;

            // console.log('ST up', body.overlapY, body.deltaY(), 'bt', body.top, tile.bottom);

            if (body.overlapY < 0)
            {
                process = true;
            }
            else
            {
                body.overlapY = 0;
            }
        }
        else if (body.deltaY() > 0 && body.checkCollision.down && tile.tile.faceTop && !body.blocked.down)
        {
            //  DOWN
            body.overlapY = body.bottom - tile.y;

            // console.log('ST down', body.overlapY, body.deltaY(), 'bt', body.bottom, tile.y);

            if (body.overlapY > 0)
            {
                process = true;
            }
            else
            {
                body.overlapY = 0;
            }
        }

        //  Only separate on the smallest of the two values if it's a single tile
        if (body.overlapX !== 0 && body.overlapY !== 0)
        {
            if (Math.abs(body.overlapX) > Math.abs(body.overlapY))
            {
                body.overlapX = 0;
            }
            else
            {
                body.overlapY = 0;
            }
        }

        //  Separate in a single sweep
        if (process)
        {
            return this.processTileSeparation(body);
        }
        else
        {
            return false;
        }

    },

    /**
    * Internal function to process the separation of a physics body from a tile.
    * @method Phaser.Physics.Arcade#processTileSeparation
    * @protected
    * @param {Phaser.Physics.Arcade.Body} body1 - The Body object to separate.
    * @returns {boolean} Returns true if separated, false if not.
    */
    processTileSeparation: function (body) {

        // console.log('PRE processTileSeparation xy', body.x, body.y, 'left', body.left, 'right', body.right, 'up', body.up, 'down', body.down);

        if (body.overlapX < 0)
        {
            body.x -= body.overlapX;
            body.left -= body.overlapX;
            body.right -= body.overlapX;
            body.blocked.x = Math.floor(body.x);
            body.blocked.y = Math.floor(body.y);
            body.blocked.left = true;
            body.touching.left = true;
            body.touching.none = false;
        }
        else if (body.overlapX > 0)
        {
            body.x -= body.overlapX;
            body.left -= body.overlapX;
            body.right -= body.overlapX;
            body.blocked.x = Math.floor(body.x);
            body.blocked.y = Math.floor(body.y);
            body.blocked.right = true;
            body.touching.right = true;
            body.touching.none = false;
        }

        if (body.overlapY < 0)
        {
            body.y -= body.overlapY;
            body.top -= body.overlapY;
            body.bottom -= body.overlapY;
            body.blocked.x = Math.floor(body.x);
            body.blocked.y = Math.floor(body.y);
            body.blocked.up = true;
            body.touching.up = true;
            body.touching.none = false;

        }
        else if (body.overlapY > 0)
        {
            body.y -= body.overlapY;
            body.top -= body.overlapY;
            body.bottom -= body.overlapY;
            body.blocked.x = Math.floor(body.x);
            body.blocked.y = Math.floor(body.y);
            body.blocked.down = true;
            body.touching.down = true;
            body.touching.none = false;
        }

        // console.log('POST processTileSeparation xy', body.x, body.y, 'left', body.left, 'right', body.right, 'up', body.up, 'down', body.down);

        return true;

    },

    /**
    * Move the given display object towards the destination object at a steady velocity.
    * If you specify a maxTime then it will adjust the speed (over-writing what you set) so it arrives at the destination in that number of seconds.
    * Timings are approximate due to the way browser timers work. Allow for a variance of +- 50ms.
    * Note: The display object does not continuously track the target. If the target changes location during transit the display object will not modify its course.
    * Note: The display object doesn't stop moving once it reaches the destination coordinates.
    * Note: Doesn't take into account acceleration, maxVelocity or drag (if you've set drag or acceleration too high this object may not move at all)
    * 
    * @method Phaser.Physics.Arcade#moveToObject
    * @param {any} displayObject - The display object to move.
    * @param {any} destination - The display object to move towards. Can be any object but must have visible x/y properties.
    * @param {number} [speed=60] - The speed it will move, in pixels per second (default is 60 pixels/sec)
    * @param {number} [maxTime=0] - Time given in milliseconds (1000 = 1 sec). If set the speed is adjusted so the object will arrive at destination in the given number of ms.
    * @return {number} The angle (in radians) that the object should be visually set to in order to match its new velocity.
    */
    moveToObject: function (displayObject, destination, speed, maxTime) {

        if (typeof speed === 'undefined') { speed = 60; }
        if (typeof maxTime === 'undefined') { maxTime = 0; }

        this._angle = Math.atan2(destination.y - displayObject.y, destination.x - displayObject.x);
        
        if (maxTime > 0)
        {
            //  We know how many pixels we need to move, but how fast?
            speed = this.distanceBetween(displayObject, destination) / (maxTime / 1000);
        }
        
        displayObject.body.velocity.x = Math.cos(this._angle) * speed;
        displayObject.body.velocity.y = Math.sin(this._angle) * speed;

        return this._angle;

    },

    /**
    * Move the given display object towards the pointer at a steady velocity. If no pointer is given it will use Phaser.Input.activePointer.
    * If you specify a maxTime then it will adjust the speed (over-writing what you set) so it arrives at the destination in that number of seconds.
    * Timings are approximate due to the way browser timers work. Allow for a variance of +- 50ms.
    * Note: The display object does not continuously track the target. If the target changes location during transit the display object will not modify its course.
    * Note: The display object doesn't stop moving once it reaches the destination coordinates.
    * 
    * @method Phaser.Physics.Arcade#moveToPointer
    * @param {any} displayObject - The display object to move.
    * @param {number} [speed=60] - The speed it will move, in pixels per second (default is 60 pixels/sec)
    * @param {Phaser.Pointer} [pointer] - The pointer to move towards. Defaults to Phaser.Input.activePointer.
    * @param {number} [maxTime=0] - Time given in milliseconds (1000 = 1 sec). If set the speed is adjusted so the object will arrive at destination in the given number of ms.
    * @return {number} The angle (in radians) that the object should be visually set to in order to match its new velocity.
    */
    moveToPointer: function (displayObject, speed, pointer, maxTime) {

        if (typeof speed === 'undefined') { speed = 60; }
        pointer = pointer || this.game.input.activePointer;
        if (typeof maxTime === 'undefined') { maxTime = 0; }

        this._angle = this.angleToPointer(displayObject, pointer);
        
        if (maxTime > 0)
        {
            //  We know how many pixels we need to move, but how fast?
            speed = this.distanceToPointer(displayObject, pointer) / (maxTime / 1000);
        }
        
        displayObject.body.velocity.x = Math.cos(this._angle) * speed;
        displayObject.body.velocity.y = Math.sin(this._angle) * speed;

        return this._angle;

    },

    /**
    * Move the given display object towards the x/y coordinates at a steady velocity.
    * If you specify a maxTime then it will adjust the speed (over-writing what you set) so it arrives at the destination in that number of seconds.
    * Timings are approximate due to the way browser timers work. Allow for a variance of +- 50ms.
    * Note: The display object does not continuously track the target. If the target changes location during transit the display object will not modify its course.
    * Note: The display object doesn't stop moving once it reaches the destination coordinates.
    * Note: Doesn't take into account acceleration, maxVelocity or drag (if you've set drag or acceleration too high this object may not move at all)
    * 
    * @method Phaser.Physics.Arcade#moveToXY
    * @param {any} displayObject - The display object to move.
    * @param {number} x - The x coordinate to move towards.
    * @param {number} y - The y coordinate to move towards.
    * @param {number} [speed=60] - The speed it will move, in pixels per second (default is 60 pixels/sec)
    * @param {number} [maxTime=0] - Time given in milliseconds (1000 = 1 sec). If set the speed is adjusted so the object will arrive at destination in the given number of ms.
    * @return {number} The angle (in radians) that the object should be visually set to in order to match its new velocity.
    */
    moveToXY: function (displayObject, x, y, speed, maxTime) {

        if (typeof speed === 'undefined') { speed = 60; }
        if (typeof maxTime === 'undefined') { maxTime = 0; }

        this._angle = Math.atan2(y - displayObject.y, x - displayObject.x);
        
        if (maxTime > 0)
        {
            //  We know how many pixels we need to move, but how fast?
            speed = this.distanceToXY(displayObject, x, y) / (maxTime / 1000);
        }
        
        displayObject.body.velocity.x = Math.cos(this._angle) * speed;
        displayObject.body.velocity.y = Math.sin(this._angle) * speed;

        return this._angle;

    },

    /**
    * Given the angle (in degrees) and speed calculate the velocity and return it as a Point object, or set it to the given point object.
    * One way to use this is: velocityFromAngle(angle, 200, sprite.velocity) which will set the values directly to the sprites velocity and not create a new Point object.
    * 
    * @method Phaser.Physics.Arcade#velocityFromAngle
    * @param {number} angle - The angle in degrees calculated in clockwise positive direction (down = 90 degrees positive, right = 0 degrees positive, up = 90 degrees negative)
    * @param {number} [speed=60] - The speed it will move, in pixels per second sq.
    * @param {Phaser.Point|object} [point] - The Point object in which the x and y properties will be set to the calculated velocity.
    * @return {Phaser.Point} - A Point where point.x contains the velocity x value and point.y contains the velocity y value.
    */
    velocityFromAngle: function (angle, speed, point) {

        if (typeof speed === 'undefined') { speed = 60; }
        point = point || new Phaser.Point();

        return point.setTo((Math.cos(this.game.math.degToRad(angle)) * speed), (Math.sin(this.game.math.degToRad(angle)) * speed));

    },

    /**
    * Given the rotation (in radians) and speed calculate the velocity and return it as a Point object, or set it to the given point object.
    * One way to use this is: velocityFromRotation(rotation, 200, sprite.velocity) which will set the values directly to the sprites velocity and not create a new Point object.
    * 
    * @method Phaser.Physics.Arcade#velocityFromRotation
    * @param {number} rotation - The angle in radians.
    * @param {number} [speed=60] - The speed it will move, in pixels per second sq.
    * @param {Phaser.Point|object} [point] - The Point object in which the x and y properties will be set to the calculated velocity.
    * @return {Phaser.Point} - A Point where point.x contains the velocity x value and point.y contains the velocity y value.
    */
    velocityFromRotation: function (rotation, speed, point) {

        if (typeof speed === 'undefined') { speed = 60; }
        point = point || new Phaser.Point();

        return point.setTo((Math.cos(rotation) * speed), (Math.sin(rotation) * speed));

    },

    /**
    * Given the rotation (in radians) and speed calculate the acceleration and return it as a Point object, or set it to the given point object.
    * One way to use this is: accelerationFromRotation(rotation, 200, sprite.acceleration) which will set the values directly to the sprites acceleration and not create a new Point object.
    * 
    * @method Phaser.Physics.Arcade#accelerationFromRotation
    * @param {number} rotation - The angle in radians.
    * @param {number} [speed=60] - The speed it will move, in pixels per second sq.
    * @param {Phaser.Point|object} [point] - The Point object in which the x and y properties will be set to the calculated acceleration.
    * @return {Phaser.Point} - A Point where point.x contains the acceleration x value and point.y contains the acceleration y value.
    */
    accelerationFromRotation: function (rotation, speed, point) {

        if (typeof speed === 'undefined') { speed = 60; }
        point = point || new Phaser.Point();

        return point.setTo((Math.cos(rotation) * speed), (Math.sin(rotation) * speed));

    },

    /**
    * Sets the acceleration.x/y property on the display object so it will move towards the target at the given speed (in pixels per second sq.)
    * You must give a maximum speed value, beyond which the display object won't go any faster.
    * Note: The display object does not continuously track the target. If the target changes location during transit the display object will not modify its course.
    * Note: The display object doesn't stop moving once it reaches the destination coordinates.
    * 
    * @method Phaser.Physics.Arcade#accelerateToObject
    * @param {any} displayObject - The display object to move.
    * @param {any} destination - The display object to move towards. Can be any object but must have visible x/y properties.
    * @param {number} [speed=60] - The speed it will accelerate in pixels per second.
    * @param {number} [xSpeedMax=500] - The maximum x velocity the display object can reach.
    * @param {number} [ySpeedMax=500] - The maximum y velocity the display object can reach.
    * @return {number} The angle (in radians) that the object should be visually set to in order to match its new trajectory.
    */
    accelerateToObject: function (displayObject, destination, speed, xSpeedMax, ySpeedMax) {

        if (typeof speed === 'undefined') { speed = 60; }
        if (typeof xSpeedMax === 'undefined') { xSpeedMax = 1000; }
        if (typeof ySpeedMax === 'undefined') { ySpeedMax = 1000; }

        this._angle = this.angleBetween(displayObject, destination);

        displayObject.body.acceleration.setTo(Math.cos(this._angle) * speed, Math.sin(this._angle) * speed);
        displayObject.body.maxVelocity.setTo(xSpeedMax, ySpeedMax);

        return this._angle;

    },

    /**
    * Sets the acceleration.x/y property on the display object so it will move towards the target at the given speed (in pixels per second sq.)
    * You must give a maximum speed value, beyond which the display object won't go any faster.
    * Note: The display object does not continuously track the target. If the target changes location during transit the display object will not modify its course.
    * Note: The display object doesn't stop moving once it reaches the destination coordinates.
    * 
    * @method Phaser.Physics.Arcade#accelerateToPointer
    * @param {any} displayObject - The display object to move.
    * @param {Phaser.Pointer} [pointer] - The pointer to move towards. Defaults to Phaser.Input.activePointer.
    * @param {number} [speed=60] - The speed it will accelerate in pixels per second.
    * @param {number} [xSpeedMax=500] - The maximum x velocity the display object can reach.
    * @param {number} [ySpeedMax=500] - The maximum y velocity the display object can reach.
    * @return {number} The angle (in radians) that the object should be visually set to in order to match its new trajectory.
    */
    accelerateToPointer: function (displayObject, pointer, speed, xSpeedMax, ySpeedMax) {

        if (typeof speed === 'undefined') { speed = 60; }
        if (typeof pointer === 'undefined') { pointer = this.game.input.activePointer; }
        if (typeof xSpeedMax === 'undefined') { xSpeedMax = 1000; }
        if (typeof ySpeedMax === 'undefined') { ySpeedMax = 1000; }

        this._angle = this.angleToPointer(displayObject, pointer);
        
        displayObject.body.acceleration.setTo(Math.cos(this._angle) * speed, Math.sin(this._angle) * speed);
        displayObject.body.maxVelocity.setTo(xSpeedMax, ySpeedMax);

        return this._angle;

    },

    /**
    * Sets the acceleration.x/y property on the display object so it will move towards the x/y coordinates at the given speed (in pixels per second sq.)
    * You must give a maximum speed value, beyond which the display object won't go any faster.
    * Note: The display object does not continuously track the target. If the target changes location during transit the display object will not modify its course.
    * Note: The display object doesn't stop moving once it reaches the destination coordinates.
    * 
    * @method Phaser.Physics.Arcade#accelerateToXY
    * @param {any} displayObject - The display object to move.
    * @param {number} x - The x coordinate to accelerate towards.
    * @param {number} y - The y coordinate to accelerate towards.
    * @param {number} [speed=60] - The speed it will accelerate in pixels per second.
    * @param {number} [xSpeedMax=500] - The maximum x velocity the display object can reach.
    * @param {number} [ySpeedMax=500] - The maximum y velocity the display object can reach.
    * @return {number} The angle (in radians) that the object should be visually set to in order to match its new trajectory.
    */
    accelerateToXY: function (displayObject, x, y, speed, xSpeedMax, ySpeedMax) {

        if (typeof speed === 'undefined') { speed = 60; }
        if (typeof xSpeedMax === 'undefined') { xSpeedMax = 1000; }
        if (typeof ySpeedMax === 'undefined') { ySpeedMax = 1000; }

        this._angle = this.angleToXY(displayObject, x, y);

        displayObject.body.acceleration.setTo(Math.cos(this._angle) * speed, Math.sin(this._angle) * speed);
        displayObject.body.maxVelocity.setTo(xSpeedMax, ySpeedMax);

        return this._angle;

    },

    /**
    * Find the distance between two display objects (like Sprites).
    * 
    * @method Phaser.Physics.Arcade#distanceBetween
    * @param {any} source - The Display Object to test from.
    * @param {any} target - The Display Object to test to.
    * @return {number} The distance between the source and target objects.
    */
    distanceBetween: function (source, target) {

        this._dx = source.x - target.x;
        this._dy = source.y - target.y;
        
        return Math.sqrt(this._dx * this._dx + this._dy * this._dy);

    },

    /**
    * Find the distance between a display object (like a Sprite) and the given x/y coordinates.
    * The calculation is made from the display objects x/y coordinate. This may be the top-left if its anchor hasn't been changed.
    * If you need to calculate from the center of a display object instead use the method distanceBetweenCenters()
    * 
    * @method Phaser.Physics.Arcade#distanceToXY
    * @param {any} displayObject - The Display Object to test from.
    * @param {number} x - The x coordinate to move towards.
    * @param {number} y - The y coordinate to move towards.
    * @return {number} The distance between the object and the x/y coordinates.
    */
    distanceToXY: function (displayObject, x, y) {

        this._dx = displayObject.x - x;
        this._dy = displayObject.y - y;
        
        return Math.sqrt(this._dx * this._dx + this._dy * this._dy);

    },

    /**
    * Find the distance between a display object (like a Sprite) and a Pointer. If no Pointer is given the Input.activePointer is used.
    * The calculation is made from the display objects x/y coordinate. This may be the top-left if its anchor hasn't been changed.
    * If you need to calculate from the center of a display object instead use the method distanceBetweenCenters()
    * 
    * @method Phaser.Physics.Arcade#distanceToPointer
    * @param {any} displayObject - The Display Object to test from.
    * @param {Phaser.Pointer} [pointer] - The Phaser.Pointer to test to. If none is given then Input.activePointer is used.
    * @return {number} The distance between the object and the Pointer.
    */
    distanceToPointer: function (displayObject, pointer) {

        pointer = pointer || this.game.input.activePointer;

        this._dx = displayObject.x - pointer.x;
        this._dy = displayObject.y - pointer.y;
        
        return Math.sqrt(this._dx * this._dx + this._dy * this._dy);

    },

    /**
    * Find the angle in radians between two display objects (like Sprites).
    * 
    * @method Phaser.Physics.Arcade#angleBetween
    * @param {any} source - The Display Object to test from.
    * @param {any} target - The Display Object to test to.
    * @return {number} The angle in radians between the source and target display objects.
    */
    angleBetween: function (source, target) {

        this._dx = target.x - source.x;
        this._dy = target.y - source.y;

        return Math.atan2(this._dy, this._dx);

    },

    /**
    * Find the angle in radians between a display object (like a Sprite) and the given x/y coordinate.
    * 
    * @method Phaser.Physics.Arcade#angleToXY
    * @param {any} displayObject - The Display Object to test from.
    * @param {number} x - The x coordinate to get the angle to.
    * @param {number} y - The y coordinate to get the angle to.
    * @return {number} The angle in radians between displayObject.x/y to Pointer.x/y
    */
    angleToXY: function (displayObject, x, y) {

        this._dx = x - displayObject.x;
        this._dy = y - displayObject.y;
        
        return Math.atan2(this._dy, this._dx);

    },
    
    /**
    * Find the angle in radians between a display object (like a Sprite) and a Pointer, taking their x/y and center into account.
    * 
    * @method Phaser.Physics.Arcade#angleToPointer
    * @param {any} displayObject - The Display Object to test from.
    * @param {Phaser.Pointer} [pointer] - The Phaser.Pointer to test to. If none is given then Input.activePointer is used.
    * @return {number} The angle in radians between displayObject.x/y to Pointer.x/y
    */
    angleToPointer: function (displayObject, pointer) {

        pointer = pointer || this.game.input.activePointer;

        this._dx = pointer.worldX - displayObject.x;
        this._dy = pointer.worldY - displayObject.y;
        
        return Math.atan2(this._dy, this._dx);

    }

};

Phaser.Physics.Arcade.prototype.constructor = Phaser.Physics.Arcade;
