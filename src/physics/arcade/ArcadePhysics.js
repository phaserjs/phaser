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
    * @property {Phaser.Rectangle} bounds - The bounds inside of which the physics world exists. Defaults to match the world bounds.
    */
    this.bounds = new Phaser.Rectangle(0, 0, game.world.width, game.world.height);

    /**
    * @property {number} OVERLAP_BIAS - A value added to the delta values during collision checks.
    */
    this.OVERLAP_BIAS = 4;

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

    //  Avoid gc spikes by caching these values for re-use

    /**
    * @property {Phaser.Rectangle} _bounds1 - Internal cache var.
    * @private
    */
    this._bounds1 = new Phaser.Rectangle();

    /**
    * @property {Phaser.Rectangle} _bounds2 - Internal cache var.
    * @private
    */
    this._bounds2 = new Phaser.Rectangle();

    /**
    * @property {number} _overlap - Internal cache var.
    * @private
    */
    this._overlap = 0;

    /**
    * @property {number} _maxOverlap - Internal cache var.
    * @private
    */
    this._maxOverlap = 0;

    /**
    * @property {number} _velocity1 - Internal cache var.
    * @private
    */
    this._velocity1 = 0;

    /**
    * @property {number} _velocity2 - Internal cache var.
    * @private
    */
    this._velocity2 = 0;

    /**
    * @property {number} _newVelocity1 - Internal cache var.
    * @private
    */
    this._newVelocity1 = 0;

    /**
    * @property {number} _newVelocity2 - Internal cache var.
    * @private
    */
    this._newVelocity2 = 0;

    /**
    * @property {number} _average - Internal cache var.
    * @private
    */
    this._average = 0;

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
    * @property {number} _gravityX - Internal cache var.
    * @private
    */
    this._gravityX = 0;

    /**
    * @property {number} _gravityY - Internal cache var.
    * @private
    */
    this._gravityY = 0;
};

Phaser.Physics.Arcade.prototype = {

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

        body.motionVelocity.x = (body.acceleration.x + this._gravityX) * this.game.time.physicsElapsed;
        body.motionVelocity.y = (body.acceleration.y + this._gravityY) * this.game.time.physicsElapsed;

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

        //  Only test valid objects
        if (object1 && object2 && object1.exists && object2.exists)
        {
            //  SPRITES
            if (object1.type == Phaser.SPRITE || object1.type == Phaser.TILESPRITE)
            {
                if (object2.type == Phaser.SPRITE || object2.type == Phaser.TILESPRITE)
                {
                    this.collideSpriteVsSprite(object1, object2, overlapCallback, processCallback, callbackContext, true);
                }
                else if (object2.type == Phaser.GROUP || object2.type == Phaser.EMITTER)
                {
                    this.collideSpriteVsGroup(object1, object2, overlapCallback, processCallback, callbackContext, true);
                }
            }
            //  GROUPS
            else if (object1.type == Phaser.GROUP)
            {
                if (object2.type == Phaser.SPRITE || object2.type == Phaser.TILESPRITE)
                {
                    this.collideSpriteVsGroup(object2, object1, overlapCallback, processCallback, callbackContext, true);
                }
                else if (object2.type == Phaser.GROUP || object2.type == Phaser.EMITTER)
                {
                    this.collideGroupVsGroup(object1, object2, overlapCallback, processCallback, callbackContext, true);
                }
            }
            //  EMITTER
            else if (object1.type == Phaser.EMITTER)
            {
                if (object2.type == Phaser.SPRITE || object2.type == Phaser.TILESPRITE)
                {
                    this.collideSpriteVsGroup(object2, object1, overlapCallback, processCallback, callbackContext, true);
                }
                else if (object2.type == Phaser.GROUP || object2.type == Phaser.EMITTER)
                {
                    this.collideGroupVsGroup(object1, object2, overlapCallback, processCallback, callbackContext, true);
                }
            }
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

        this.collideHandler(object1, object2, collideCallback, processCallback, callbackContext);

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
            this.collideHandler(object1, objectArray[i], collideCallback, processCallback, callbackContext);
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
    * @param {function} [collideCallback=null] - An optional callback function that is called if the objects collide. The two objects will be passed to this function in the same order in which you specified them.
    * @param {function} [processCallback=null] - A callback function that lets you perform additional checks against the two objects if they overlap. If this is set then collision will only happen if processCallback returns true. The two objects will be passed to this function in the same order in which you specified them.
    * @param {object} [callbackContext] - The context in which to run the callbacks.
    */
    collideHandler: function (object1, object2, collideCallback, processCallback, callbackContext) {

        //  Only collide valid objects
        if (typeof object2 === 'undefined' && object1.type === Phaser.GROUP)
        {
            this.collideGroupVsSelf(object1, collideCallback, processCallback, callbackContext, false);
            return;
        }

        if (object1 && object2 && object1.exists && object2.exists)
        {
            //  SPRITES
            if (object1.type == Phaser.SPRITE || object1.type == Phaser.TILESPRITE)
            {
                if (object2.type == Phaser.SPRITE || object2.type == Phaser.TILESPRITE)
                {
                    this.collideSpriteVsSprite(object1, object2, collideCallback, processCallback, callbackContext, false);
                }
                else if (object2.type == Phaser.GROUP || object2.type == Phaser.EMITTER)
                {
                    this.collideSpriteVsGroup(object1, object2, collideCallback, processCallback, callbackContext, false);
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
                    this.collideSpriteVsGroup(object2, object1, collideCallback, processCallback, callbackContext, false);
                }
                else if (object2.type == Phaser.GROUP || object2.type == Phaser.EMITTER)
                {
                    this.collideGroupVsGroup(object1, object2, collideCallback, processCallback, callbackContext, false);
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
                    this.collideSpriteVsGroup(object2, object1, collideCallback, processCallback, callbackContext, false);
                }
                else if (object2.type == Phaser.GROUP || object2.type == Phaser.EMITTER)
                {
                    this.collideGroupVsGroup(object1, object2, collideCallback, processCallback, callbackContext, false);
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

        this._mapData = tilemapLayer.getTiles(sprite.body.x, sprite.body.y, sprite.body.width, sprite.body.height, true);

        if (this._mapData.length === 0)
        {
            return;
        }

        if (this._mapData.length > 1)
        {
            // console.log(' multi sep ---------------------------------------------------------------------------------------------');
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

        //  Can't separate two immovable bodies and the same body cannot collide with itself
        if (body1 === body2 || (body1.immovable && body2.immovable) || Phaser.Rectangle.intersects(body1, body2) === false)
        {
            return false;
        }

        //  They overlap. Is there a custom process callback? If it returns true then we can carry on, otherwise we should abort.
        if (processCallback && processCallback.call(callbackContext, body1.sprite, body2.sprite) === false)
        {
            return false;
        }

        if (overlapOnly)
        {
            return body1.overlap(body2);
        }
        else
        {
            if (body1.overlap(body2))
            {
                // console.log('-----------------------------------------------------------------------------');
                // console.log(body1.sprite.name, 'overlaps', body2.sprite.name, 'x', body1.overlapX, 'y', body1.overlapY);

                body1.separate(body2);
                return true;
            }
        }

        return false;

    },

    /**
    * The core separation function to separate a physics body and an array of tiles.
    * @method Phaser.Physics.Arcade#separateTiles
    * @param {Phaser.Physics.Arcade.Body} body - The Body object to separate.
    * @param {<Phaser.Tile>array} tiles - The array of tiles to collide against.
    * @returns {boolean} Returns true if the bodies were separated, otherwise false.
    */
    separateTiles: function (body, tiles) {

        //  Can't separate two immovable objects (tiles are always immovable)
        if (body.immovable)
        {
            return false;
        }

        body.overlapX = 0;
        body.overlapY = 0;

        var tile;
        var localOverlapX = 0;
        var localOverlapY = 0;

        for (var i = 0; i < tiles.length; i++)
        {
            tile = tiles[i];

            if (Phaser.Rectangle.intersects(body, tile))
            {
                //  They overlap. Any custom callbacks?
                if (tile.tile.callback || tile.layer.callbacks[tile.tile.index])
                {
                    //  A local callback takes priority over a global callback.
                    if (tile.tile.callback && tile.tile.callback.call(tile.tile.callbackContext, body.sprite, tile) === false)
                    {
                        //  Is there a tile specific collision callback? If it returns true then we can carry on, otherwise we should abort.
                        continue;
                    }
                    else if (tile.layer.callbacks[tile.tile.index] && tile.layer.callbacks[tile.tile.index].callback.call(tile.layer.callbacks[tile.tile.index].callbackContext, body.sprite, tile) === false)
                    {
                        //  Is there a tile index collision callback? If it returns true then we can carry on, otherwise we should abort.
                        continue;
                    }
                }

                if (body.deltaX() < 0 && body.allowCollision.left && tile.tile.faceRight)
                {
                    //  LEFT
                    localOverlapX = body.x - tile.right;

                    if (localOverlapX >= body.deltaX())
                    {
                        // console.log('m left overlapX', localOverlapX, body.deltaX());
                        //  use touching instead of blocked?
                        body.blocked.left = true;
                        body.touching.left = true;
                        body.touching.none = false;
                    }
                }
                else if (body.deltaX() > 0 && body.allowCollision.right && tile.tile.faceLeft)
                {
                    //  RIGHT
                    localOverlapX = body.right - tile.x;

                    //  Distance check
                    if (localOverlapX <= body.deltaX())
                    {
                        // console.log('m right overlapX', localOverlapX, body.deltaX());
                        body.blocked.right = true;
                        body.touching.right = true;
                        body.touching.none = false;
                    }
                }

                if (body.deltaY() < 0 && body.allowCollision.up && tile.tile.faceBottom)
                {
                    //  UP
                    localOverlapY = body.y - tile.bottom;

                    //  Distance check
                    if (localOverlapY >= body.deltaY())
                    {
                        // console.log('m up overlapY', localOverlapY, body.deltaY());
                        body.blocked.up = true;
                        body.touching.up = true;
                        body.touching.none = false;
                    }
                }
                else if (body.deltaY() > 0 && body.allowCollision.down && tile.tile.faceTop)
                {
                    //  DOWN
                    localOverlapY = body.bottom - tile.y;

                    if (localOverlapY <= body.deltaY())
                    {
                        // console.log('m down overlapY', localOverlapY, body.deltaY());
                        body.blocked.down = true;
                        body.touching.down = true;
                        body.touching.none = false;
                    }
                }
            }
        }

        if (localOverlapX !== 0)
        {
            body.overlapX = localOverlapX;
        }

        if (localOverlapY !== 0)
        {
            body.overlapY = localOverlapY;
        }

        if (body.touching.none)
        {
            return false;
        }

        if (body.touching.left || body.touching.right)
        {
            body.x -= body.overlapX;
            body.preX -= body.overlapX;

            if (body.bounce.x === 0)
            {
                body.velocity.x = 0;
            }
            else
            {
                body.velocity.x = -body.velocity.x * body.bounce.x;
            }
        }

        if (body.touching.up || body.touching.down)
        {
            body.y -= body.overlapY;
            body.preY -= body.overlapY;

            if (body.bounce.y === 0)
            {
                body.velocity.y = 0;
            }
            else
            {
                body.velocity.y = -body.velocity.y * body.bounce.y;
            }
        }

        return true;

    },

    /**
    * The core separation function to separate a physics body and a tile.
    * @method Phaser.Physics.Arcade#separateTile
    * @param {Phaser.Physics.Arcade.Body} body1 - The Body object to separate.
    * @param {Phaser.Tile} tile - The tile to collide against.
    * @returns {boolean} Returns true if the bodies were separated, otherwise false.
    */
    separateTile: function (body, tile) {

        //  Can't separate two immovable objects (tiles are always immovable)
        if (body.immovable || Phaser.Rectangle.intersects(body, tile) === false)
        {
            // console.log('no intersects');
            // console.log('tx', tile.x, 'ty', tile.y, 'tw', tile.width, 'th', tile.height, 'tr', tile.right, 'tb', tile.bottom);
            // console.log('bx', body.x, 'by', body.y, 'bw', body.width, 'bh', body.height, 'br', body.right, 'bb', body.bottom);
            return false;
        }

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

        //  use body var instead
        body.overlapX = 0;
        body.overlapY = 0;

        //  Remember - this happens AFTER the body has been moved by the motion update, so it needs moving back again
        // console.log('---------------------------------------------------------------------------------------------');
        // console.log(tile);
        // console.log('tx', tile.x, 'ty', tile.y, 'tw', tile.width, 'th', tile.height, 'tr', tile.right, 'tb', tile.bottom);
        // console.log('bx', body.x, 'by', body.y, 'bw', body.width, 'bh', body.height, 'br', body.right, 'bb', body.bottom);
        // console.log(Phaser.Rectangle.intersects(body, tile));
        // console.log('dx', body.deltaX(), 'dy', body.deltaY(), 'dax', body.deltaAbsX(), 'day', body.deltaAbsY(), 'cax', Math.ceil(body.deltaAbsX()), 'cay', Math.ceil(body.deltaAbsY()));

        if (body.deltaX() < 0 && body.allowCollision.left && tile.tile.faceRight)
        {
            //  LEFT
            body.overlapX = body.x - tile.right;

            if (body.overlapX >= body.deltaX())
            {
                // console.log('left overlapX', body.overlapX, body.deltaX());
                //  use touching instead of blocked?
                body.blocked.left = true;
                body.touching.left = true;
                body.touching.none = false;
            }
        }
        else if (body.deltaX() > 0 && body.allowCollision.right && tile.tile.faceLeft)
        {
            //  RIGHT
            body.overlapX = body.right - tile.x;

            //  Distance check
            if (body.overlapX <= body.deltaX())
            {
                // console.log('right overlapX', body.overlapX, body.deltaX());
                body.blocked.right = true;
                body.touching.right = true;
                body.touching.none = false;
            }
        }

        if (body.deltaY() < 0 && body.allowCollision.up && tile.tile.faceBottom)
        {
            //  UP
            body.overlapY = body.y - tile.bottom;

            //  Distance check
            if (body.overlapY >= body.deltaY())
            {
                // console.log('up overlapY', body.overlapY, body.deltaY());
                body.blocked.up = true;
                body.touching.up = true;
                body.touching.none = false;
            }
        }
        else if (body.deltaY() > 0 && body.allowCollision.down && tile.tile.faceTop)
        {
            //  DOWN
            body.overlapY = body.bottom - tile.y;

            if (body.overlapY <= body.deltaY())
            {
                // console.log('down overlapY', body.overlapY, body.deltaY());
                body.blocked.down = true;
                body.touching.down = true;
                body.touching.none = false;
            }
        }

        //  Separate in a single sweep

        if (body.touching.none)
        {
            return false;
        }

        // if (body.overlapX !== 0)
        if (body.touching.left || body.touching.right)
        {
            body.x -= body.overlapX;
            body.preX -= body.overlapX;

            if (body.bounce.x === 0)
            {
                body.velocity.x = 0;
            }
            else
            {
                body.velocity.x = -body.velocity.x * body.bounce.x;
            }
        }

        // if (body.overlapY !== 0)
        if (body.touching.up || body.touching.down)
        {
            body.y -= body.overlapY;
            body.preY -= body.overlapY;

            if (body.bounce.y === 0)
            {
                body.velocity.y = 0;
            }
            else
            {
                body.velocity.y = -body.velocity.y * body.bounce.y;
            }
        }

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
