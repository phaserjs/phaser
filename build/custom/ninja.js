/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Ninja Physics. The Ninja Physics system was created in Flash by Metanet Software and ported to JavaScript by Richard Davey.
*
* It allows for AABB and Circle to Tile collision. Tiles can be any of 34 different types, including slopes, convex and concave shapes.
*
* It does what it does very well, but is ripe for expansion and optimisation. Here are some features that I'd love to see the community add:
*
* * AABB to AABB collision
* * AABB to Circle collision
* * AABB and Circle 'immovable' property support
* * n-way collision, so an AABB/Circle could pass through a tile from below and land upon it.
* * QuadTree or spatial grid for faster Body vs. Tile Group look-ups.
* * Optimise the internal vector math and reduce the quantity of temporary vars created.
* * Expand Gravity and Bounce to allow for separate x/y axis values.
* * Support Bodies linked to Sprites that don't have anchor set to 0.5
*
* Feel free to attempt any of the above and submit a Pull Request with your code! Be sure to include test cases proving they work.
*
* @class Phaser.Physics.Ninja
* @constructor
* @param {Phaser.Game} game - reference to the current game instance.
*/
Phaser.Physics.Ninja = function (game) {

    /**
    * @property {Phaser.Game} game - Local reference to game.
    */
    this.game = game;

    /**
    * @property {Phaser.Time} time - Local reference to game.time.
    */
    this.time = this.game.time;

    /**
    * @property {number} gravity - The World gravity setting.
    */
    this.gravity = 0.2;

    /**
    * @property {Phaser.Rectangle} bounds - The bounds inside of which the physics world exists. Defaults to match the world bounds.
    */
    this.bounds = new Phaser.Rectangle(0, 0, game.world.width, game.world.height);

    /**
    * @property {number} maxObjects - Used by the QuadTree to set the maximum number of objects per quad.
    */
    this.maxObjects = 10;

    /**
    * @property {number} maxLevels - Used by the QuadTree to set the maximum number of iteration levels.
    */
    this.maxLevels = 4;

    /**
    * @property {Phaser.QuadTree} quadTree - The world QuadTree.
    */
    this.quadTree = new Phaser.QuadTree(this.game.world.bounds.x, this.game.world.bounds.y, this.game.world.bounds.width, this.game.world.bounds.height, this.maxObjects, this.maxLevels);

    // By default we want the bounds the same size as the world bounds
    this.setBoundsToWorld();

};

Phaser.Physics.Ninja.prototype.constructor = Phaser.Physics.Ninja;

Phaser.Physics.Ninja.prototype = {

    /**
    * This will create a Ninja Physics AABB body on the given game object. Its dimensions will match the width and height of the object at the point it is created.
    * A game object can only have 1 physics body active at any one time, and it can't be changed until the object is destroyed.
    *
    * @method Phaser.Physics.Ninja#enableAABB
    * @param {object|array|Phaser.Group} object - The game object to create the physics body on. Can also be an array or Group of objects, a body will be created on every child that has a `body` property.
    * @param {boolean} [children=true] - Should a body be created on all children of this object? If true it will recurse down the display list as far as it can go.
    */
    enableAABB: function (object, children) {

        this.enable(object, 1, 0, 0, children);

    },

    /**
    * This will create a Ninja Physics Circle body on the given game object.
    * A game object can only have 1 physics body active at any one time, and it can't be changed until the object is destroyed.
    *
    * @method Phaser.Physics.Ninja#enableCircle
    * @param {object|array|Phaser.Group} object - The game object to create the physics body on. Can also be an array or Group of objects, a body will be created on every child that has a `body` property.
    * @param {number} radius - The radius of the Circle.
    * @param {boolean} [children=true] - Should a body be created on all children of this object? If true it will recurse down the display list as far as it can go.
    */
    enableCircle: function (object, radius, children) {

        this.enable(object, 2, 0, radius, children);

    },

    /**
    * This will create a Ninja Physics Tile body on the given game object. There are 34 different types of tile you can create, including 45 degree slopes,
    * convex and concave circles and more. The id parameter controls which Tile type is created, but you can also change it at run-time.
    * Note that for all degree based tile types they need to have an equal width and height. If the given object doesn't have equal width and height it will use the width.
    * A game object can only have 1 physics body active at any one time, and it can't be changed until the object is destroyed.
    *
    * @method Phaser.Physics.Ninja#enableTile
    * @param {object|array|Phaser.Group} object - The game object to create the physics body on. Can also be an array or Group of objects, a body will be created on every child that has a `body` property.
    * @param {number} [id=1] - The type of Tile this will use, i.e. Phaser.Physics.Ninja.Tile.SLOPE_45DEGpn, Phaser.Physics.Ninja.Tile.CONVEXpp, etc.
    * @param {boolean} [children=true] - Should a body be created on all children of this object? If true it will recurse down the display list as far as it can go.
    */
    enableTile: function (object, id, children) {

        this.enable(object, 3, id, 0, children);

    },

    /**
    * This will create a Ninja Physics body on the given game object or array of game objects.
    * A game object can only have 1 physics body active at any one time, and it can't be changed until the object is destroyed.
    *
    * @method Phaser.Physics.Ninja#enable
    * @param {object|array|Phaser.Group} object - The game object to create the physics body on. Can also be an array or Group of objects, a body will be created on every child that has a `body` property.
    * @param {number} [type=1] - The type of Ninja shape to create. 1 = AABB, 2 = Circle or 3 = Tile.
    * @param {number} [id=1] - If this body is using a Tile shape, you can set the Tile id here, i.e. Phaser.Physics.Ninja.Tile.SLOPE_45DEGpn, Phaser.Physics.Ninja.Tile.CONVEXpp, etc.
    * @param {number} [radius=0] - If this body is using a Circle shape this controls the radius.
    * @param {boolean} [children=true] - Should a body be created on all children of this object? If true it will recurse down the display list as far as it can go.
    */
    enable: function (object, type, id, radius, children) {

        if (typeof type === 'undefined') { type = 1; }
        if (typeof id === 'undefined') { id = 1; }
        if (typeof radius === 'undefined') { radius = 0; }
        if (typeof children === 'undefined') { children = true; }

        if (Array.isArray(object))
        {
            var i = object.length;

            while (i--)
            {
                if (object[i] instanceof Phaser.Group)
                {
                    //  If it's a Group then we do it on the children regardless
                    this.enable(object[i].children, type, id, radius, children);
                }
                else
                {
                    this.enableBody(object[i], type, id, radius);

                    if (children && object[i].hasOwnProperty('children') && object[i].children.length > 0)
                    {
                        this.enable(object[i], type, id, radius, true);
                    }
                }
            }
        }
        else
        {
            if (object instanceof Phaser.Group)
            {
                //  If it's a Group then we do it on the children regardless
                this.enable(object.children, type, id, radius, children);
            }
            else
            {
                this.enableBody(object, type, id, radius);

                if (children && object.hasOwnProperty('children') && object.children.length > 0)
                {
                    this.enable(object.children, type, id, radius, true);
                }
            }
        }

    },

    /**
    * Creates a Ninja Physics body on the given game object.
    * A game object can only have 1 physics body active at any one time, and it can't be changed until the body is nulled.
    *
    * @method Phaser.Physics.Ninja#enableBody
    * @param {object} object - The game object to create the physics body on. A body will only be created if this object has a null `body` property.
    */
    enableBody: function (object, type, id, radius) {

        if (object.hasOwnProperty('body') && object.body === null)
        {
            object.body = new Phaser.Physics.Ninja.Body(this, object, type, id, radius);
            object.anchor.set(0.5);
        }

    },

    /**
    * Updates the size of this physics world.
    *
    * @method Phaser.Physics.Ninja#setBounds
    * @param {number} x - Top left most corner of the world.
    * @param {number} y - Top left most corner of the world.
    * @param {number} width - New width of the world. Can never be smaller than the Game.width.
    * @param {number} height - New height of the world. Can never be smaller than the Game.height.
    */
    setBounds: function (x, y, width, height) {

        this.bounds.setTo(x, y, width, height);

    },

    /**
    * Updates the size of this physics world to match the size of the game world.
    *
    * @method Phaser.Physics.Ninja#setBoundsToWorld
    */
    setBoundsToWorld: function () {

        this.bounds.setTo(this.game.world.bounds.x, this.game.world.bounds.y, this.game.world.bounds.width, this.game.world.bounds.height);

    },

    /**
    * Clears all physics bodies from the given TilemapLayer that were created with `World.convertTilemap`.
    *
    * @method Phaser.Physics.Ninja#clearTilemapLayerBodies
    * @param {Phaser.Tilemap} map - The Tilemap to get the map data from.
    * @param {number|string|Phaser.TilemapLayer} [layer] - The layer to operate on. If not given will default to map.currentLayer.
    */
    clearTilemapLayerBodies: function (map, layer) {

        layer = map.getLayer(layer);

        var i = map.layers[layer].bodies.length;

        while (i--)
        {
            map.layers[layer].bodies[i].destroy();
        }

        map.layers[layer].bodies.length = [];

    },

    /**
    * Goes through all tiles in the given Tilemap and TilemapLayer and converts those set to collide into physics tiles.
    * Only call this *after* you have specified all of the tiles you wish to collide with calls like Tilemap.setCollisionBetween, etc.
    * Every time you call this method it will destroy any previously created bodies and remove them from the world.
    * Therefore understand it's a very expensive operation and not to be done in a core game update loop.
    *
    * In Ninja the Tiles have an ID from 0 to 33, where 0 is 'empty', 1 is a full tile, 2 is a 45-degree slope, etc. You can find the ID
    * list either at the very bottom of `Tile.js`, or in a handy visual reference in the `resources/Ninja Physics Debug Tiles` folder in the repository.
    * The slopeMap parameter is an array that controls how the indexes of the tiles in your tilemap data will map to the Ninja Tile IDs.
    * For example if you had 6 tiles in your tileset: Imagine the first 4 should be converted into fully solid Tiles and the other 2 are 45-degree slopes.
    * Your slopeMap array would look like this: `[ 1, 1, 1, 1, 2, 3 ]`.
    * Where each element of the array is a tile in your tilemap and the resulting Ninja Tile it should create.
    *
    * @method Phaser.Physics.Ninja#convertTilemap
    * @param {Phaser.Tilemap} map - The Tilemap to get the map data from.
    * @param {number|string|Phaser.TilemapLayer} [layer] - The layer to operate on. If not given will default to map.currentLayer.
    * @param {object} [slopeMap] - The tilemap index to Tile ID map.
    * @return {array} An array of the Phaser.Physics.Ninja.Tile objects that were created.
    */
    convertTilemap: function (map, layer, slopeMap) {

        layer = map.getLayer(layer);

        //  If the bodies array is already populated we need to nuke it
        this.clearTilemapLayerBodies(map, layer);

        for (var y = 0, h = map.layers[layer].height; y < h; y++)
        {
            for (var x = 0, w = map.layers[layer].width; x < w; x++)
            {
                var tile = map.layers[layer].data[y][x];

                if (tile && slopeMap.hasOwnProperty(tile.index))
                {
                    var body = new Phaser.Physics.Ninja.Body(this, null, 3, slopeMap[tile.index], 0, tile.worldX + tile.centerX, tile.worldY + tile.centerY, tile.width, tile.height);

                    map.layers[layer].bodies.push(body);
                }
            }
        }

        return map.layers[layer].bodies;

    },

    /**
    * Checks for overlaps between two game objects. The objects can be Sprites, Groups or Emitters.
    * You can perform Sprite vs. Sprite, Sprite vs. Group and Group vs. Group overlap checks.
    * Unlike collide the objects are NOT automatically separated or have any physics applied, they merely test for overlap results.
    * The second parameter can be an array of objects, of differing types.
    *
    * @method Phaser.Physics.Ninja#overlap
    * @param {Phaser.Sprite|Phaser.Group|Phaser.Particles.Emitter} object1 - The first object to check. Can be an instance of Phaser.Sprite, Phaser.Group or Phaser.Particles.Emitter.
    * @param {Phaser.Sprite|Phaser.Group|Phaser.Particles.Emitter|array} object2 - The second object or array of objects to check. Can be Phaser.Sprite, Phaser.Group or Phaser.Particles.Emitter.
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

        if (Array.isArray(object2))
        {
            for (var i = 0,  len = object2.length; i < len; i++)
            {
                this.collideHandler(object1, object2[i], overlapCallback, processCallback, callbackContext, true);
            }
        }
        else
        {
            this.collideHandler(object1, object2, overlapCallback, processCallback, callbackContext, true);
        }

        return (this._total > 0);

    },

    /**
    * Checks for collision between two game objects. You can perform Sprite vs. Sprite, Sprite vs. Group, Group vs. Group, Sprite vs. Tilemap Layer or Group vs. Tilemap Layer collisions.
    * The second parameter can be an array of objects, of differing types.
    * The objects are also automatically separated. If you don't require separation then use ArcadePhysics.overlap instead.
    * An optional processCallback can be provided. If given this function will be called when two sprites are found to be colliding. It is called before any separation takes place,
    * giving you the chance to perform additional checks. If the function returns true then the collision and separation is carried out. If it returns false it is skipped.
    * The collideCallback is an optional function that is only called if two sprites collide. If a processCallback has been set then it needs to return true for collideCallback to be called.
    *
    * @method Phaser.Physics.Ninja#collide
    * @param {Phaser.Sprite|Phaser.Group|Phaser.Particles.Emitter|Phaser.TilemapLayer} object1 - The first object to check. Can be an instance of Phaser.Sprite, Phaser.Group, Phaser.Particles.Emitter, or Phaser.TilemapLayer.
    * @param {Phaser.Sprite|Phaser.Group|Phaser.Particles.Emitter|Phaser.TilemapLayer|array} object2 - The second object or array of objects to check. Can be Phaser.Sprite, Phaser.Group, Phaser.Particles.Emitter or Phaser.TilemapLayer.
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

        if (Array.isArray(object2))
        {
            for (var i = 0,  len = object2.length; i < len; i++)
            {
                this.collideHandler(object1, object2[i], collideCallback, processCallback, callbackContext, false);
            }
        }
        else
        {
            this.collideHandler(object1, object2, collideCallback, processCallback, callbackContext, false);
        }

        return (this._total > 0);

    },

    /**
    * Internal collision handler.
    *
    * @method Phaser.Physics.Ninja#collideHandler
    * @private
    * @param {Phaser.Sprite|Phaser.Group|Phaser.Particles.Emitter|Phaser.TilemapLayer} object1 - The first object to check. Can be an instance of Phaser.Sprite, Phaser.Group, Phaser.Particles.Emitter, or Phaser.TilemapLayer.
    * @param {Phaser.Sprite|Phaser.Group|Phaser.Particles.Emitter|Phaser.TilemapLayer} object2 - The second object to check. Can be an instance of Phaser.Sprite, Phaser.Group, Phaser.Particles.Emitter or Phaser.TilemapLayer. Can also be an array of objects to check.
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
    * An internal function. Use Phaser.Physics.Ninja.collide instead.
    *
    * @method Phaser.Physics.Ninja#collideSpriteVsSprite
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
    * An internal function. Use Phaser.Physics.Ninja.collide instead.
    *
    * @method Phaser.Physics.Ninja#collideSpriteVsGroup
    * @private
    */
    collideSpriteVsGroup: function (sprite, group, collideCallback, processCallback, callbackContext, overlapOnly) {

        if (group.length === 0)
        {
            return;
        }

        //  What is the sprite colliding with in the quadtree?
        // this.quadTree.clear();

        // this.quadTree = new Phaser.QuadTree(this.game.world.bounds.x, this.game.world.bounds.y, this.game.world.bounds.width, this.game.world.bounds.height, this.maxObjects, this.maxLevels);

        // this.quadTree.populate(group);

        // this._potentials = this.quadTree.retrieve(sprite);

        for (var i = 0, len = group.children.length; i < len; i++)
        {
            //  We have our potential suspects, are they in this group?
            if (group.children[i].exists && group.children[i].body && this.separate(sprite.body, group.children[i].body, processCallback, callbackContext, overlapOnly))
            {
                if (collideCallback)
                {
                    collideCallback.call(callbackContext, sprite, group.children[i]);
                }

                this._total++;
            }
        }

    },

    /**
    * An internal function. Use Phaser.Physics.Ninja.collide instead.
    *
    * @method Phaser.Physics.Ninja#collideGroupVsSelf
    * @private
    */
    collideGroupVsSelf: function (group, collideCallback, processCallback, callbackContext, overlapOnly) {

        if (group.length === 0)
        {
            return;
        }

        var len = group.children.length;

        for (var i = 0; i < len; i++)
        {
            for (var j = i + 1; j <= len; j++)
            {
                if (group.children[i] && group.children[j] && group.children[i].exists && group.children[j].exists)
                {
                    this.collideSpriteVsSprite(group.children[i], group.children[j], collideCallback, processCallback, callbackContext, overlapOnly);
                }
            }
        }

    },

    /**
    * An internal function. Use Phaser.Physics.Ninja.collide instead.
    *
    * @method Phaser.Physics.Ninja#collideGroupVsGroup
    * @private
    */
    collideGroupVsGroup: function (group1, group2, collideCallback, processCallback, callbackContext, overlapOnly) {

        if (group1.length === 0 || group2.length === 0)
        {
            return;
        }

        for (var i = 0, len = group1.children.length; i < len; i++)
        {
            if (group1.children[i].exists)
            {
                this.collideSpriteVsGroup(group1.children[i], group2, collideCallback, processCallback, callbackContext, overlapOnly);
            }
        }

    },

    /**
    * The core separation function to separate two physics bodies.
    * @method Phaser.Physics.Ninja#separate
    * @param {Phaser.Physics.Ninja.Body} body1 - The Body object to separate.
    * @param {Phaser.Physics.Ninja.Body} body2 - The Body object to separate.
    * @returns {boolean} Returns true if the bodies collided, otherwise false.
    */
    separate: function (body1, body2) {

        if (body1.type !== Phaser.Physics.NINJA || body2.type !== Phaser.Physics.NINJA)
        {
            return false;
        }

        if (body1.aabb && body2.aabb)
        {
            return body1.aabb.collideAABBVsAABB(body2.aabb);
        }

        if (body1.aabb && body2.tile)
        {
            return body1.aabb.collideAABBVsTile(body2.tile);
        }

        if (body1.tile && body2.aabb)
        {
            return body2.aabb.collideAABBVsTile(body1.tile);
        }

        if (body1.circle && body2.tile)
        {
            return body1.circle.collideCircleVsTile(body2.tile);
        }

        if (body1.tile && body2.circle)
        {
            return body2.circle.collideCircleVsTile(body1.tile);
        }

    }

};

/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* The Physics Body is linked to a single Sprite. All physics operations should be performed against the body rather than
* the Sprite itself. For example you can set the velocity, bounce values etc all on the Body.
*
* @class Phaser.Physics.Ninja.Body
* @constructor
* @param {Phaser.Physics.Ninja} system - The physics system this Body belongs to.
* @param {Phaser.Sprite} sprite - The Sprite object this physics body belongs to.
* @param {number} [type=1] - The type of Ninja shape to create. 1 = AABB, 2 = Circle or 3 = Tile.
* @param {number} [id=1] - If this body is using a Tile shape, you can set the Tile id here, i.e. Phaser.Physics.Ninja.Tile.SLOPE_45DEGpn, Phaser.Physics.Ninja.Tile.CONVEXpp, etc.
* @param {number} [radius=16] - If this body is using a Circle shape this controls the radius.
* @param {number} [x=0] - The x coordinate of this Body. This is only used if a sprite is not provided.
* @param {number} [y=0] - The y coordinate of this Body. This is only used if a sprite is not provided.
* @param {number} [width=0] - The width of this Body. This is only used if a sprite is not provided.
* @param {number} [height=0] - The height of this Body. This is only used if a sprite is not provided.
*/
Phaser.Physics.Ninja.Body = function (system, sprite, type, id, radius, x, y, width, height) {

    sprite = sprite || null;

    if (typeof type === 'undefined') { type = 1; }
    if (typeof id === 'undefined') { id = 1; }
    if (typeof radius === 'undefined') { radius = 16; }

    /**
    * @property {Phaser.Sprite} sprite - Reference to the parent Sprite.
    */
    this.sprite = sprite;

    /**
    * @property {Phaser.Game} game - Local reference to game.
    */
    this.game = system.game;

    /**
    * @property {number} type - The type of physics system this body belongs to.
    */
    this.type = Phaser.Physics.NINJA;

    /**
    * @property {Phaser.Physics.Ninja} system - The parent physics system.
    */
    this.system = system;

    /**
    * @property {Phaser.Physics.Ninja.AABB} aabb - The AABB object this body is using for collision.
    */
    this.aabb = null;

    /**
    * @property {Phaser.Physics.Ninja.Tile} tile - The Tile object this body is using for collision.
    */
    this.tile = null;

    /**
    * @property {Phaser.Physics.Ninja.Circle} circle - The Circle object this body is using for collision.
    */
    this.circle = null;

    /**
    * @property {object} shape - A local reference to the body shape.
    */
    this.shape = null;

    //  Setting drag to 0 and friction to 0 means you get a normalised speed (px psec)

    /**
    * @property {number} drag - The drag applied to this object as it moves.
    * @default
    */
    this.drag = 1;

    /**
    * @property {number} friction - The friction applied to this object as it moves.
    * @default
    */
    this.friction = 0.05;

    /**
    * @property {number} gravityScale - How much of the world gravity should be applied to this object? 1 = all of it, 0.5 = 50%, etc.
    * @default
    */
    this.gravityScale = 1;

    /**
    * @property {number} bounce - The bounciness of this object when it collides. A value between 0 and 1. We recommend setting it to 0.999 to avoid jittering.
    * @default
    */
    this.bounce = 0.3;

    /**
    * @property {Phaser.Point} velocity - The velocity in pixels per second sq. of the Body.
    */
    this.velocity = new Phaser.Point();

    /**
    * @property {number} facing - A const reference to the direction the Body is traveling or facing.
    * @default
    */
    this.facing = Phaser.NONE;

    /**
    * @property {boolean} immovable - An immovable Body will not receive any impacts from other bodies. Not fully implemented.
    * @default
    */
    this.immovable = false;

    /**
    * A Body can be set to collide against the World bounds automatically and rebound back into the World if this is set to true. Otherwise it will leave the World.
    * @property {boolean} collideWorldBounds - Should the Body collide with the World bounds?
    */
    this.collideWorldBounds = true;

    /**
    * Set the checkCollision properties to control which directions collision is processed for this Body.
    * For example checkCollision.up = false means it won't collide when the collision happened while moving up.
    * @property {object} checkCollision - An object containing allowed collision.
    */
    this.checkCollision = { none: false, any: true, up: true, down: true, left: true, right: true };

    /**
    * This object is populated with boolean values when the Body collides with another.
    * touching.up = true means the collision happened to the top of this Body for example.
    * @property {object} touching - An object containing touching results.
    */
    this.touching = { none: true, up: false, down: false, left: false, right: false };

    /**
    * This object is populated with previous touching values from the bodies previous collision.
    * @property {object} wasTouching - An object containing previous touching results.
    */
    this.wasTouching = { none: true, up: false, down: false, left: false, right: false };

    /**
    * @property {number} maxSpeed - The maximum speed this body can travel at (taking drag and friction into account)
    * @default
    */
    this.maxSpeed = 8;

    if (sprite)
    {
        x = sprite.x;
        y = sprite.y;
        width = sprite.width;
        height = sprite.height;

        if (sprite.anchor.x === 0)
        {
            x += (sprite.width * 0.5);
        }

        if (sprite.anchor.y === 0)
        {
            y += (sprite.height * 0.5);
        }
    }

    if (type === 1)
    {
        this.aabb = new Phaser.Physics.Ninja.AABB(this, x, y, width, height);
        this.shape = this.aabb;
    }
    else if (type === 2)
    {
        this.circle = new Phaser.Physics.Ninja.Circle(this, x, y, radius);
        this.shape = this.circle;
    }
    else if (type === 3)
    {
        this.tile = new Phaser.Physics.Ninja.Tile(this, x, y, width, height, id);
        this.shape = this.tile;
    }

};

Phaser.Physics.Ninja.Body.prototype = {

    /**
    * Internal method.
    *
    * @method Phaser.Physics.Ninja.Body#preUpdate
    * @protected
    */
    preUpdate: function () {

        //  Store and reset collision flags
        this.wasTouching.none = this.touching.none;
        this.wasTouching.up = this.touching.up;
        this.wasTouching.down = this.touching.down;
        this.wasTouching.left = this.touching.left;
        this.wasTouching.right = this.touching.right;

        this.touching.none = true;
        this.touching.up = false;
        this.touching.down = false;
        this.touching.left = false;
        this.touching.right = false;

        this.shape.integrate();

        if (this.collideWorldBounds)
        {
            this.shape.collideWorldBounds();
        }

    },

    /**
    * Internal method.
    *
    * @method Phaser.Physics.Ninja.Body#postUpdate
    * @protected
    */
    postUpdate: function () {

        if (this.sprite)
        {
            if (this.sprite.type === Phaser.TILESPRITE)
            {
                //  TileSprites don't use their anchor property, so we need to adjust the coordinates
                this.sprite.x = this.shape.pos.x - this.shape.xw;
                this.sprite.y = this.shape.pos.y - this.shape.yw;
            }
            else
            {
                this.sprite.x = this.shape.pos.x;
                this.sprite.y = this.shape.pos.y;
            }
        }

        if (this.velocity.x < 0)
        {
            this.facing = Phaser.LEFT;
        }
        else if (this.velocity.x > 0)
        {
            this.facing = Phaser.RIGHT;
        }

        if (this.velocity.y < 0)
        {
            this.facing = Phaser.UP;
        }
        else if (this.velocity.y > 0)
        {
            this.facing = Phaser.DOWN;
        }

    },

    /**
    * Stops all movement of this body.
    *
    * @method Phaser.Physics.Ninja.Body#setZeroVelocity
    */
    setZeroVelocity: function () {

        this.shape.oldpos.x = this.shape.pos.x;
        this.shape.oldpos.y = this.shape.pos.y;

    },

    /**
    * Moves the Body forwards based on its current angle and the given speed.
    * The speed is represented in pixels per second. So a value of 100 would move 100 pixels in 1 second (1000ms).
    *
    * @method Phaser.Physics.Body#moveTo
    * @param {number} speed - The speed at which it should move forwards.
    * @param {number} angle - The angle in which it should move, given in degrees.
    */
    moveTo: function (speed, angle) {

        var magnitude = speed * this.game.time.physicsElapsed;
        var angle = this.game.math.degToRad(angle);

        this.shape.pos.x = this.shape.oldpos.x + (magnitude * Math.cos(angle));
        this.shape.pos.y = this.shape.oldpos.y + (magnitude * Math.sin(angle));

    },

    /**
    * Moves the Body backwards based on its current angle and the given speed.
    * The speed is represented in pixels per second. So a value of 100 would move 100 pixels in 1 second (1000ms).
    *
    * @method Phaser.Physics.Body#moveBackward
    * @param {number} speed - The speed at which it should move backwards.
    * @param {number} angle - The angle in which it should move, given in degrees.
    */
    moveFrom: function (speed, angle) {

        var magnitude = -speed * this.game.time.physicsElapsed;
        var angle = this.game.math.degToRad(angle);

        this.shape.pos.x = this.shape.oldpos.x + (magnitude * Math.cos(angle));
        this.shape.pos.y = this.shape.oldpos.y + (magnitude * Math.sin(angle));

    },

    /**
    * If this Body is dynamic then this will move it to the left by setting its x velocity to the given speed.
    * The speed is represented in pixels per second. So a value of 100 would move 100 pixels in 1 second (1000ms).
    *
    * @method Phaser.Physics.Body#moveLeft
    * @param {number} speed - The speed at which it should move to the left, in pixels per second.
    */
    moveLeft: function (speed) {

        var fx = -speed * this.game.time.physicsElapsed;

        this.shape.pos.x = this.shape.oldpos.x + Math.min(this.maxSpeed, Math.max(-this.maxSpeed, this.shape.pos.x - this.shape.oldpos.x + fx));

    },

    /**
    * If this Body is dynamic then this will move it to the right by setting its x velocity to the given speed.
    * The speed is represented in pixels per second. So a value of 100 would move 100 pixels in 1 second (1000ms).
    *
    * @method Phaser.Physics.Body#moveRight
    * @param {number} speed - The speed at which it should move to the right, in pixels per second.
    */
    moveRight: function (speed) {

        var fx = speed * this.game.time.physicsElapsed;

        this.shape.pos.x = this.shape.oldpos.x + Math.min(this.maxSpeed, Math.max(-this.maxSpeed, this.shape.pos.x - this.shape.oldpos.x + fx));

    },

    /**
    * If this Body is dynamic then this will move it up by setting its y velocity to the given speed.
    * The speed is represented in pixels per second. So a value of 100 would move 100 pixels in 1 second (1000ms).
    *
    * @method Phaser.Physics.Body#moveUp
    * @param {number} speed - The speed at which it should move up, in pixels per second.
    */
    moveUp: function (speed) {

        var fx = -speed * this.game.time.physicsElapsed;

        this.shape.pos.y = this.shape.oldpos.y + Math.min(this.maxSpeed, Math.max(-this.maxSpeed, this.shape.pos.y - this.shape.oldpos.y + fx));

    },

    /**
    * If this Body is dynamic then this will move it down by setting its y velocity to the given speed.
    * The speed is represented in pixels per second. So a value of 100 would move 100 pixels in 1 second (1000ms).
    *
    * @method Phaser.Physics.Body#moveDown
    * @param {number} speed - The speed at which it should move down, in pixels per second.
    */
    moveDown: function (speed) {

        var fx = speed * this.game.time.physicsElapsed;

        this.shape.pos.y = this.shape.oldpos.y + Math.min(this.maxSpeed, Math.max(-this.maxSpeed, this.shape.pos.y - this.shape.oldpos.y + fx));

    },

    /**
    * Resets all Body values and repositions on the Sprite.
    *
    * @method Phaser.Physics.Ninja.Body#reset
    */
    reset: function () {

        this.velocity.set(0);

        this.shape.pos.x = this.sprite.x;
        this.shape.pos.y = this.sprite.y;

        this.shape.oldpos.copyFrom(this.shape.pos);

    },

    /**
    * Returns the absolute delta x value.
    *
    * @method Phaser.Physics.Ninja.Body#deltaAbsX
    * @return {number} The absolute delta value.
    */
    deltaAbsX: function () {
        return (this.deltaX() > 0 ? this.deltaX() : -this.deltaX());
    },

    /**
    * Returns the absolute delta y value.
    *
    * @method Phaser.Physics.Ninja.Body#deltaAbsY
    * @return {number} The absolute delta value.
    */
    deltaAbsY: function () {
        return (this.deltaY() > 0 ? this.deltaY() : -this.deltaY());
    },

    /**
    * Returns the delta x value. The difference between Body.x now and in the previous step.
    *
    * @method Phaser.Physics.Ninja.Body#deltaX
    * @return {number} The delta value. Positive if the motion was to the right, negative if to the left.
    */
    deltaX: function () {
        return this.shape.pos.x - this.shape.oldpos.x;
    },

    /**
    * Returns the delta y value. The difference between Body.y now and in the previous step.
    *
    * @method Phaser.Physics.Ninja.Body#deltaY
    * @return {number} The delta value. Positive if the motion was downwards, negative if upwards.
    */
    deltaY: function () {
        return this.shape.pos.y - this.shape.oldpos.y;
    },

    /**
    * Destroys this body's reference to the sprite and system, and destroys its shape.
    *
    * @method Phaser.Physics.Ninja.Body#destroy
    */
    destroy: function() {
        this.sprite = null;
        this.system = null;
        this.aabb = null;
        this.tile = null;
        this.circle = null;

        this.shape.destroy();
        this.shape = null;
    }
};

/**
* @name Phaser.Physics.Ninja.Body#x
* @property {number} x - The x position.
*/
Object.defineProperty(Phaser.Physics.Ninja.Body.prototype, "x", {

    get: function () {
        return this.shape.pos.x;
    },

    set: function (value) {
        this.shape.pos.x = value;
    }

});

/**
* @name Phaser.Physics.Ninja.Body#y
* @property {number} y - The y position.
*/
Object.defineProperty(Phaser.Physics.Ninja.Body.prototype, "y", {

    get: function () {
        return this.shape.pos.y;
    },

    set: function (value) {
        this.shape.pos.y = value;
    }

});

/**
* @name Phaser.Physics.Ninja.Body#width
* @property {number} width - The width of this Body
* @readonly
*/
Object.defineProperty(Phaser.Physics.Ninja.Body.prototype, "width", {

    get: function () {
        return this.shape.width;
    }

});

/**
* @name Phaser.Physics.Ninja.Body#height
* @property {number} height - The height of this Body
* @readonly
*/
Object.defineProperty(Phaser.Physics.Ninja.Body.prototype, "height", {

    get: function () {
        return this.shape.height;
    }

});

/**
* @name Phaser.Physics.Ninja.Body#bottom
* @property {number} bottom - The bottom value of this Body (same as Body.y + Body.height)
* @readonly
*/
Object.defineProperty(Phaser.Physics.Ninja.Body.prototype, "bottom", {

    get: function () {
        return this.shape.pos.y + this.shape.yw;
    }

});

/**
* @name Phaser.Physics.Ninja.Body#right
* @property {number} right - The right value of this Body (same as Body.x + Body.width)
* @readonly
*/
Object.defineProperty(Phaser.Physics.Ninja.Body.prototype, "right", {

    get: function () {
        return this.shape.pos.x + this.shape.xw;
    }

});

/**
* @name Phaser.Physics.Ninja.Body#speed
* @property {number} speed - The speed of this Body
* @readonly
*/
Object.defineProperty(Phaser.Physics.Ninja.Body.prototype, "speed", {

    get: function () {
        return Math.sqrt(this.shape.velocity.x * this.shape.velocity.x + this.shape.velocity.y * this.shape.velocity.y);
    }

});

/**
* @name Phaser.Physics.Ninja.Body#angle
* @property {number} angle - The angle of this Body
* @readonly
*/
Object.defineProperty(Phaser.Physics.Ninja.Body.prototype, "angle", {

    get: function () {
        return Math.atan2(this.shape.velocity.y, this.shape.velocity.x);
    }

});

/**
* Render Sprite's Body.
*
* @method Phaser.Physics.Ninja.Body#render
* @param {object} context - The context to render to.
* @param {Phaser.Physics.Ninja.Body} body - The Body to render.
* @param {string} [color='rgba(0,255,0,0.4)'] - color of the debug shape to be rendered. (format is css color string).
* @param {boolean} [filled=true] - Render the shape as a filled (default, true) or a stroked (false)
*/
Phaser.Physics.Ninja.Body.render = function(context, body, color, filled) {
    color = color || 'rgba(0,255,0,0.4)';

    if (typeof filled === 'undefined')
    {
        filled = true;
    }

    if (body.aabb || body.circle)
    {
        body.shape.render(context, body.game.camera.x, body.game.camera.y, color, filled);
    }
};

/* jshint camelcase: false */
/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Ninja Physics AABB constructor.
* Note: This class could be massively optimised and reduced in size. I leave that challenge up to you.
*
* @class Phaser.Physics.Ninja.AABB
* @constructor
* @param {Phaser.Physics.Ninja.Body} body - The body that owns this shape.
* @param {number} x - The x coordinate to create this shape at.
* @param {number} y - The y coordinate to create this shape at.
* @param {number} width - The width of this AABB.
* @param {number} height - The height of this AABB.
*/
Phaser.Physics.Ninja.AABB = function (body, x, y, width, height) {

    /**
    * @property {Phaser.Physics.Ninja.Body} system - A reference to the body that owns this shape.
    */
    this.body = body;

    /**
    * @property {Phaser.Physics.Ninja} system - A reference to the physics system.
    */
    this.system = body.system;

    /**
    * @property {Phaser.Point} pos - The position of this object.
    */
    this.pos = new Phaser.Point(x, y);

    /**
    * @property {Phaser.Point} oldpos - The position of this object in the previous update.
    */
    this.oldpos = new Phaser.Point(x, y);

    /**
    * @property {number} xw - Half the width.
    * @readonly
    */
    this.xw = Math.abs(width / 2);

    /**
    * @property {number} xw - Half the height.
    * @readonly
    */
    this.yw = Math.abs(height / 2);

    /**
    * @property {number} width - The width.
    * @readonly
    */
    this.width = width;

    /**
    * @property {number} height - The height.
    * @readonly
    */
    this.height = height;

    /**
    * @property {number} oH - Internal var.
    * @private
    */
    this.oH = 0;

    /**
    * @property {number} oV - Internal var.
    * @private
    */
    this.oV = 0;

    /**
    * @property {Phaser.Point} velocity - The velocity of this object.
    */
    this.velocity = new Phaser.Point();

    /**
    * @property {object} aabbTileProjections - All of the collision response handlers.
    */
    this.aabbTileProjections = {};

    this.aabbTileProjections[Phaser.Physics.Ninja.Tile.TYPE_FULL] = this.projAABB_Full;
    this.aabbTileProjections[Phaser.Physics.Ninja.Tile.TYPE_45DEG] = this.projAABB_45Deg;
    this.aabbTileProjections[Phaser.Physics.Ninja.Tile.TYPE_CONCAVE] = this.projAABB_Concave;
    this.aabbTileProjections[Phaser.Physics.Ninja.Tile.TYPE_CONVEX] = this.projAABB_Convex;
    this.aabbTileProjections[Phaser.Physics.Ninja.Tile.TYPE_22DEGs] = this.projAABB_22DegS;
    this.aabbTileProjections[Phaser.Physics.Ninja.Tile.TYPE_22DEGb] = this.projAABB_22DegB;
    this.aabbTileProjections[Phaser.Physics.Ninja.Tile.TYPE_67DEGs] = this.projAABB_67DegS;
    this.aabbTileProjections[Phaser.Physics.Ninja.Tile.TYPE_67DEGb] = this.projAABB_67DegB;
    this.aabbTileProjections[Phaser.Physics.Ninja.Tile.TYPE_HALF] = this.projAABB_Half;

};

Phaser.Physics.Ninja.AABB.prototype.constructor = Phaser.Physics.Ninja.AABB;

Phaser.Physics.Ninja.AABB.COL_NONE = 0;
Phaser.Physics.Ninja.AABB.COL_AXIS = 1;
Phaser.Physics.Ninja.AABB.COL_OTHER = 2;

Phaser.Physics.Ninja.AABB.prototype = {

    /**
    * Updates this AABBs position.
    *
    * @method Phaser.Physics.Ninja.AABB#integrate
    */
    integrate: function () {

        var px = this.pos.x;
        var py = this.pos.y;

        //  integrate
        this.pos.x += (this.body.drag * this.pos.x) - (this.body.drag * this.oldpos.x);
        this.pos.y += (this.body.drag * this.pos.y) - (this.body.drag * this.oldpos.y) + (this.system.gravity * this.body.gravityScale);

        //  store
        this.velocity.set(this.pos.x - px, this.pos.y - py);
        this.oldpos.set(px, py);

    },

    /**
    * Process a world collision and apply the resulting forces.
    *
    * @method Phaser.Physics.Ninja.AABB#reportCollisionVsWorld
    * @param {number} px - The tangent velocity
    * @param {number} py - The tangent velocity
    * @param {number} dx - Collision normal
    * @param {number} dy - Collision normal
    * @param {number} obj - Object this AABB collided with
    */
    reportCollisionVsWorld: function (px, py, dx, dy) {

        var p = this.pos;
        var o = this.oldpos;

        //  Calc velocity
        var vx = p.x - o.x;
        var vy = p.y - o.y;

        //  Find component of velocity parallel to collision normal
        var dp = (vx * dx + vy * dy);
        var nx = dp * dx;   //project velocity onto collision normal

        var ny = dp * dy;   //nx,ny is normal velocity

        var tx = vx - nx;   //px,py is tangent velocity
        var ty = vy - ny;

        //  We only want to apply collision response forces if the object is travelling into, and not out of, the collision
        var b, bx, by, fx, fy;

        if (dp < 0)
        {
            fx = tx * this.body.friction;
            fy = ty * this.body.friction;

            b = 1 + this.body.bounce;

            bx = (nx * b);
            by = (ny * b);

            if (dx === 1)
            {
                this.body.touching.left = true;
            }
            else if (dx === -1)
            {
                this.body.touching.right = true;
            }

            if (dy === 1)
            {
                this.body.touching.up = true;
            }
            else if (dy === -1)
            {
                this.body.touching.down = true;
            }
        }
        else
        {
            //  Moving out of collision, do not apply forces
            bx = by = fx = fy = 0;
        }

        //  Project object out of collision
        p.x += px;
        p.y += py;

        //  Apply bounce+friction impulses which alter velocity
        o.x += px + bx + fx;
        o.y += py + by + fy;

    },

    reverse: function () {

        var vx = this.pos.x - this.oldpos.x;
        var vy = this.pos.y - this.oldpos.y;

        if (this.oldpos.x < this.pos.x)
        {
            this.oldpos.x = this.pos.x + vx;
            // this.oldpos.x = this.pos.x + (vx + 1 + this.body.bounce);
        }
        else if (this.oldpos.x > this.pos.x)
        {
            this.oldpos.x = this.pos.x - vx;
            // this.oldpos.x = this.pos.x - (vx + 1 + this.body.bounce);
        }

        if (this.oldpos.y < this.pos.y)
        {
            this.oldpos.y = this.pos.y + vy;
            // this.oldpos.y = this.pos.y + (vy + 1 + this.body.bounce);
        }
        else if (this.oldpos.y > this.pos.y)
        {
            this.oldpos.y = this.pos.y - vy;
            // this.oldpos.y = this.pos.y - (vy + 1 + this.body.bounce);
        }

    },

    /**
    * Process a body collision and apply the resulting forces. Still very much WIP and doesn't work fully. Feel free to fix!
    *
    * @method Phaser.Physics.Ninja.AABB#reportCollisionVsBody
    * @param {number} px - The tangent velocity
    * @param {number} py - The tangent velocity
    * @param {number} dx - Collision normal
    * @param {number} dy - Collision normal
    * @param {number} obj - Object this AABB collided with
    */
    reportCollisionVsBody: function (px, py, dx, dy, obj) {

        var vx1 = this.pos.x - this.oldpos.x;   //  Calc velocity of this object
        var vy1 = this.pos.y - this.oldpos.y;
        var dp1 = (vx1 * dx + vy1 * dy);         //  Find component of velocity parallel to collision normal

        //  We only want to apply collision response forces if the object is travelling into, and not out of, the collision
        if (this.body.immovable && obj.body.immovable)
        {
            //  Split the separation then return, no forces applied as they come to a stand-still
            px *= 0.5;
            py *= 0.5;

            this.pos.add(px, py);
            this.oldpos.set(this.pos.x, this.pos.y);

            obj.pos.subtract(px, py);
            obj.oldpos.set(obj.pos.x, obj.pos.y);

            return;
        }
        else if (!this.body.immovable && !obj.body.immovable)
        {
            //  separate
            px *= 0.5;
            py *= 0.5;

            this.pos.add(px, py);
            obj.pos.subtract(px, py);

            if (dp1 < 0)
            {
                this.reverse();
                obj.reverse();
            }
        }
        else if (!this.body.immovable)
        {
            this.pos.subtract(px, py);

            if (dp1 < 0)
            {
                this.reverse();
            }
        }
        else if (!obj.body.immovable)
        {
            obj.pos.subtract(px, py);

            if (dp1 < 0)
            {
                obj.reverse();
            }
        }

    },

    /**
    * Collides this AABB against the world bounds.
    *
    * @method Phaser.Physics.Ninja.AABB#collideWorldBounds
    */
    collideWorldBounds: function () {

        var dx = this.system.bounds.x - (this.pos.x - this.xw);

        if (0 < dx)
        {
            this.reportCollisionVsWorld(dx, 0, 1, 0, null);
        }
        else
        {
            dx = (this.pos.x + this.xw) - this.system.bounds.right;

            if (0 < dx)
            {
                this.reportCollisionVsWorld(-dx, 0, -1, 0, null);
            }
        }

        var dy = this.system.bounds.y - (this.pos.y - this.yw);

        if (0 < dy)
        {
            this.reportCollisionVsWorld(0, dy, 0, 1, null);
        }
        else
        {
            dy = (this.pos.y + this.yw) - this.system.bounds.bottom;

            if (0 < dy)
            {
                this.reportCollisionVsWorld(0, -dy, 0, -1, null);
            }
        }

    },

    /**
    * Collides this AABB against a AABB.
    *
    * @method Phaser.Physics.Ninja.AABB#collideAABBVsAABB
    * @param {Phaser.Physics.Ninja.AABB} aabb - The AABB to collide against.
    */
    collideAABBVsAABB: function (aabb) {

        var pos = this.pos;
        var c = aabb;

        var tx = c.pos.x;
        var ty = c.pos.y;
        var txw = c.xw;
        var tyw = c.yw;

        var dx = pos.x - tx;//tile->obj delta
        var px = (txw + this.xw) - Math.abs(dx);//penetration depth in x

        if (0 < px)
        {
            var dy = pos.y - ty;//tile->obj delta
            var py = (tyw + this.yw) - Math.abs(dy);//pen depth in y

            if (0 < py)
            {
                //object may be colliding with tile; call tile-specific collision function

                //calculate projection vectors
                if (px < py)
                {
                    //project in x
                    if (dx < 0)
                    {
                        //project to the left
                        px *= -1;
                        py = 0;
                    }
                    else
                    {
                        //proj to right
                        py = 0;
                    }
                }
                else
                {
                    //project in y
                    if (dy < 0)
                    {
                        //project up
                        px = 0;
                        py *= -1;
                    }
                    else
                    {
                        //project down
                        px = 0;
                    }
                }

                var l = Math.sqrt(px * px + py * py);
                this.reportCollisionVsBody(px, py, px / l, py / l, c);

                return Phaser.Physics.Ninja.AABB.COL_AXIS;

            }
        }

        return false;

    },

    /**
    * Collides this AABB against a Tile.
    *
    * @method Phaser.Physics.Ninja.AABB#collideAABBVsTile
    * @param {Phaser.Physics.Ninja.Tile} tile - The Tile to collide against.
    */
    collideAABBVsTile: function (tile) {

        var dx = this.pos.x - tile.pos.x;               //  tile->obj delta
        var px = (tile.xw + this.xw) - Math.abs(dx);    //  penetration depth in x

        if (0 < px)
        {
            var dy = this.pos.y - tile.pos.y;               //  tile->obj delta
            var py = (tile.yw + this.yw) - Math.abs(dy);    //  pen depth in y

            if (0 < py)
            {
                //  Calculate projection vectors
                if (px < py)
                {
                    //  Project in x
                    if (dx < 0)
                    {
                        //  Project to the left
                        px *= -1;
                        py = 0;
                    }
                    else
                    {
                        //  Project to the right
                        py = 0;
                    }
                }
                else
                {
                    //  Project in y
                    if (dy < 0)
                    {
                        //  Project up
                        px = 0;
                        py *= -1;
                    }
                    else
                    {
                        //  Project down
                        px = 0;
                    }
                }

                //  Object may be colliding with tile; call tile-specific collision function
                return this.resolveTile(px, py, this, tile);
            }
        }

        return false;

    },

    /**
    * Resolves tile collision.
    *
    * @method Phaser.Physics.Ninja.AABB#resolveTile
    * @param {number} x - Penetration depth on the x axis.
    * @param {number} y - Penetration depth on the y axis.
    * @param {Phaser.Physics.Ninja.AABB} body - The AABB involved in the collision.
    * @param {Phaser.Physics.Ninja.Tile} tile - The Tile involved in the collision.
    * @return {boolean} True if the collision was processed, otherwise false.
    */
    resolveTile: function (x, y, body, tile) {

        if (0 < tile.id)
        {
            return this.aabbTileProjections[tile.type](x, y, body, tile);
        }
        else
        {
            // console.warn("Ninja.AABB.resolveTile was called with an empty (or unknown) tile!: id=" + tile.id + ")");
            return false;
        }

    },

    /**
    * Resolves Full tile collision.
    *
    * @method Phaser.Physics.Ninja.AABB#projAABB_Full
    * @param {number} x - Penetration depth on the x axis.
    * @param {number} y - Penetration depth on the y axis.
    * @param {Phaser.Physics.Ninja.AABB} obj - The AABB involved in the collision.
    * @param {Phaser.Physics.Ninja.Tile} t - The Tile involved in the collision.
    * @return {number} The result of the collision.
    */
    projAABB_Full: function (x, y, obj, t) {

        var l = Math.sqrt(x * x + y * y);
        obj.reportCollisionVsWorld(x, y, x / l, y / l, t);

        return Phaser.Physics.Ninja.AABB.COL_AXIS;

    },

    /**
    * Resolves Half tile collision.
    *
    * @method Phaser.Physics.Ninja.AABB#projAABB_Half
    * @param {number} x - Penetration depth on the x axis.
    * @param {number} y - Penetration depth on the y axis.
    * @param {Phaser.Physics.Ninja.AABB} obj - The AABB involved in the collision.
    * @param {Phaser.Physics.Ninja.Tile} t - The Tile involved in the collision.
    * @return {number} The result of the collision.
    */
    projAABB_Half: function (x, y, obj, t) {

        //signx or signy must be 0; the other must be -1 or 1
        //calculate the projection vector for the half-edge, and then
        //(if collision is occuring) pick the minimum

        var sx = t.signx;
        var sy = t.signy;

        var ox = (obj.pos.x - (sx*obj.xw)) - t.pos.x;//this gives is the coordinates of the innermost
        var oy = (obj.pos.y - (sy*obj.yw)) - t.pos.y;//point on the AABB, relative to the tile center

        //we perform operations analogous to the 45deg tile, except we're using
        //an axis-aligned slope instead of an angled one..

        //if the dotprod of (ox,oy) and (sx,sy) is negative, the corner is in the slope
        //and we need toproject it out by the magnitude of the projection of (ox,oy) onto (sx,sy)
        var dp = (ox*sx) + (oy*sy);

        if (dp < 0)
        {
            //collision; project delta onto slope and use this to displace the object
            sx *= -dp;//(sx,sy) is now the projection vector
            sy *= -dp;

            var lenN = Math.sqrt(sx*sx + sy*sy);
            var lenP = Math.sqrt(x*x + y*y);

            if (lenP < lenN)
            {
                //project along axis; note that we're assuming that this tile is horizontal OR vertical
                //relative to the AABB's current tile, and not diagonal OR the current tile.
                obj.reportCollisionVsWorld(x,y,x/lenP, y/lenP, t);

                return Phaser.Physics.Ninja.AABB.COL_AXIS;
            }
            else
            {
                //note that we could use -= instead of -dp
                obj.reportCollisionVsWorld(sx,sy,t.signx, t.signy, t);

                return Phaser.Physics.Ninja.AABB.COL_OTHER;
            }
        }

        return Phaser.Physics.Ninja.AABB.COL_NONE;

    },

    /**
    * Resolves 45 Degree tile collision.
    *
    * @method Phaser.Physics.Ninja.AABB#projAABB_45Deg
    * @param {number} x - Penetration depth on the x axis.
    * @param {number} y - Penetration depth on the y axis.
    * @param {Phaser.Physics.Ninja.AABB} obj - The AABB involved in the collision.
    * @param {Phaser.Physics.Ninja.Tile} t - The Tile involved in the collision.
    * @return {number} The result of the collision.
    */
    projAABB_45Deg: function (x, y, obj, t) {

        var signx = t.signx;
        var signy = t.signy;

        var ox = (obj.pos.x - (signx*obj.xw)) - t.pos.x;//this gives is the coordinates of the innermost
        var oy = (obj.pos.y - (signy*obj.yw)) - t.pos.y;//point on the AABB, relative to the tile center

        var sx = t.sx;
        var sy = t.sy;

        //if the dotprod of (ox,oy) and (sx,sy) is negative, the corner is in the slope
        //and we need toproject it out by the magnitude of the projection of (ox,oy) onto (sx,sy)
        var dp = (ox*sx) + (oy*sy);

        if (dp < 0)
        {
            //collision; project delta onto slope and use this to displace the object
            sx *= -dp;//(sx,sy) is now the projection vector
            sy *= -dp;

            var lenN = Math.sqrt(sx*sx + sy*sy);
            var lenP = Math.sqrt(x*x + y*y);

            if (lenP < lenN)
            {
                //project along axis
                obj.reportCollisionVsWorld(x,y,x/lenP, y/lenP, t);

                return Phaser.Physics.Ninja.AABB.COL_AXIS;
            }
            else
            {
                //project along slope
                obj.reportCollisionVsWorld(sx,sy,t.sx,t.sy);

                return Phaser.Physics.Ninja.AABB.COL_OTHER;
            }
        }

        return Phaser.Physics.Ninja.AABB.COL_NONE;
    },

    /**
    * Resolves 22 Degree tile collision.
    *
    * @method Phaser.Physics.Ninja.AABB#projAABB_22DegS
    * @param {number} x - Penetration depth on the x axis.
    * @param {number} y - Penetration depth on the y axis.
    * @param {Phaser.Physics.Ninja.AABB} obj - The AABB involved in the collision.
    * @param {Phaser.Physics.Ninja.Tile} t - The Tile involved in the collision.
    * @return {number} The result of the collision.
    */
    projAABB_22DegS: function (x, y, obj, t) {

        var signx = t.signx;
        var signy = t.signy;

        //first we need to check to make sure we're colliding with the slope at all
        var py = obj.pos.y - (signy*obj.yw);
        var penY = t.pos.y - py;//this is the vector from the innermost point on the box to the highest point on
                                //the tile; if it is positive, this means the box is above the tile and
                                //no collision is occuring
        if (0 < (penY*signy))
        {
            var ox = (obj.pos.x - (signx*obj.xw)) - (t.pos.x + (signx*t.xw));//this gives is the coordinates of the innermost
            var oy = (obj.pos.y - (signy*obj.yw)) - (t.pos.y - (signy*t.yw));//point on the AABB, relative to a point on the slope

            var sx = t.sx;//get slope unit normal
            var sy = t.sy;

            //if the dotprod of (ox,oy) and (sx,sy) is negative, the corner is in the slope
            //and we need toproject it out by the magnitude of the projection of (ox,oy) onto (sx,sy)
            var dp = (ox*sx) + (oy*sy);

            if (dp < 0)
            {
                //collision; project delta onto slope and use this to displace the object
                sx *= -dp;//(sx,sy) is now the projection vector
                sy *= -dp;

                var lenN = Math.sqrt(sx*sx + sy*sy);
                var lenP = Math.sqrt(x*x + y*y);

                var aY = Math.abs(penY);

                if (lenP < lenN)
                {
                    if (aY < lenP)
                    {
                        obj.reportCollisionVsWorld(0, penY, 0, penY/aY, t);

                        return Phaser.Physics.Ninja.AABB.COL_OTHER;
                    }
                    else
                    {
                        obj.reportCollisionVsWorld(x,y,x/lenP, y/lenP, t);

                        return Phaser.Physics.Ninja.AABB.COL_AXIS;
                    }
                }
                else
                {
                    if (aY < lenN)
                    {
                        obj.reportCollisionVsWorld(0, penY, 0, penY/aY, t);

                        return Phaser.Physics.Ninja.AABB.COL_OTHER;
                    }
                    else
                    {
                        obj.reportCollisionVsWorld(sx,sy,t.sx,t.sy,t);

                        return Phaser.Physics.Ninja.AABB.COL_OTHER;
                    }
                }
            }
        }

        //if we've reached this point, no collision has occured
        return Phaser.Physics.Ninja.AABB.COL_NONE;
    },

    /**
    * Resolves 22 Degree tile collision.
    *
    * @method Phaser.Physics.Ninja.AABB#projAABB_22DegB
    * @param {number} x - Penetration depth on the x axis.
    * @param {number} y - Penetration depth on the y axis.
    * @param {Phaser.Physics.Ninja.AABB} obj - The AABB involved in the collision.
    * @param {Phaser.Physics.Ninja.Tile} t - The Tile involved in the collision.
    * @return {number} The result of the collision.
    */
    projAABB_22DegB: function (x, y, obj, t) {

        var signx = t.signx;
        var signy = t.signy;

        var ox = (obj.pos.x - (signx*obj.xw)) - (t.pos.x - (signx*t.xw));//this gives is the coordinates of the innermost
        var oy = (obj.pos.y - (signy*obj.yw)) - (t.pos.y + (signy*t.yw));//point on the AABB, relative to a point on the slope

        var sx = t.sx;//get slope unit normal
        var sy = t.sy;

        //if the dotprod of (ox,oy) and (sx,sy) is negative, the corner is in the slope
        //and we need toproject it out by the magnitude of the projection of (ox,oy) onto (sx,sy)
        var dp = (ox*sx) + (oy*sy);

        if (dp < 0)
        {
            //collision; project delta onto slope and use this to displace the object
            sx *= -dp;//(sx,sy) is now the projection vector
            sy *= -dp;

            var lenN = Math.sqrt(sx*sx + sy*sy);
            var lenP = Math.sqrt(x*x + y*y);

            if (lenP < lenN)
            {
                obj.reportCollisionVsWorld(x,y,x/lenP, y/lenP, t);

                return Phaser.Physics.Ninja.AABB.COL_AXIS;
            }
            else
            {
                obj.reportCollisionVsWorld(sx,sy,t.sx,t.sy,t);

                return Phaser.Physics.Ninja.AABB.COL_OTHER;
            }

        }

        return Phaser.Physics.Ninja.AABB.COL_NONE;

    },

    /**
    * Resolves 67 Degree tile collision.
    *
    * @method Phaser.Physics.Ninja.AABB#projAABB_67DegS
    * @param {number} x - Penetration depth on the x axis.
    * @param {number} y - Penetration depth on the y axis.
    * @param {Phaser.Physics.Ninja.AABB} obj - The AABB involved in the collision.
    * @param {Phaser.Physics.Ninja.Tile} t - The Tile involved in the collision.
    * @return {number} The result of the collision.
    */
    projAABB_67DegS: function (x, y, obj, t) {

        var signx = t.signx;
        var signy = t.signy;

        var px = obj.pos.x - (signx*obj.xw);
        var penX = t.pos.x - px;

        if (0 < (penX*signx))
        {
            var ox = (obj.pos.x - (signx*obj.xw)) - (t.pos.x - (signx*t.xw));//this gives is the coordinates of the innermost
            var oy = (obj.pos.y - (signy*obj.yw)) - (t.pos.y + (signy*t.yw));//point on the AABB, relative to a point on the slope

            var sx = t.sx;//get slope unit normal
            var sy = t.sy;

            //if the dotprod of (ox,oy) and (sx,sy) is negative, the corner is in the slope
            //and we need to project it out by the magnitude of the projection of (ox,oy) onto (sx,sy)
            var dp = (ox*sx) + (oy*sy);

            if (dp < 0)
            {
                //collision; project delta onto slope and use this to displace the object
                sx *= -dp;//(sx,sy) is now the projection vector
                sy *= -dp;

                var lenN = Math.sqrt(sx*sx + sy*sy);
                var lenP = Math.sqrt(x*x + y*y);

                var aX = Math.abs(penX);

                if (lenP < lenN)
                {
                    if (aX < lenP)
                    {
                        obj.reportCollisionVsWorld(penX, 0, penX/aX, 0, t);

                        return Phaser.Physics.Ninja.AABB.COL_OTHER;
                    }
                    else
                    {
                        obj.reportCollisionVsWorld(x,y,x/lenP, y/lenP, t);

                        return Phaser.Physics.Ninja.AABB.COL_AXIS;
                    }
                }
                else
                {
                    if (aX < lenN)
                    {
                        obj.reportCollisionVsWorld(penX, 0, penX/aX, 0, t);

                        return Phaser.Physics.Ninja.AABB.COL_OTHER;
                    }
                    else
                    {
                        obj.reportCollisionVsWorld(sx,sy,t.sx,t.sy,t);

                        return Phaser.Physics.Ninja.AABB.COL_OTHER;
                    }
                }
            }
        }

        //if we've reached this point, no collision has occured
        return Phaser.Physics.Ninja.AABB.COL_NONE;

    },

    /**
    * Resolves 67 Degree tile collision.
    *
    * @method Phaser.Physics.Ninja.AABB#projAABB_67DegB
    * @param {number} x - Penetration depth on the x axis.
    * @param {number} y - Penetration depth on the y axis.
    * @param {Phaser.Physics.Ninja.AABB} obj - The AABB involved in the collision.
    * @param {Phaser.Physics.Ninja.Tile} t - The Tile involved in the collision.
    * @return {number} The result of the collision.
    */
    projAABB_67DegB: function (x, y, obj, t) {

        var signx = t.signx;
        var signy = t.signy;

        var ox = (obj.pos.x - (signx*obj.xw)) - (t.pos.x + (signx*t.xw));//this gives is the coordinates of the innermost
        var oy = (obj.pos.y - (signy*obj.yw)) - (t.pos.y - (signy*t.yw));//point on the AABB, relative to a point on the slope

        var sx = t.sx;//get slope unit normal
        var sy = t.sy;

        //if the dotprod of (ox,oy) and (sx,sy) is negative, the corner is in the slope
        //and we need toproject it out by the magnitude of the projection of (ox,oy) onto (sx,sy)
        var dp = (ox*sx) + (oy*sy);

        if (dp < 0)
        {
            //collision; project delta onto slope and use this to displace the object
            sx *= -dp;//(sx,sy) is now the projection vector
            sy *= -dp;

            var lenN = Math.sqrt(sx*sx + sy*sy);
            var lenP = Math.sqrt(x*x + y*y);

            if (lenP < lenN)
            {
                obj.reportCollisionVsWorld(x,y,x/lenP, y/lenP, t);

                return Phaser.Physics.Ninja.AABB.COL_AXIS;
            }
            else
            {
                obj.reportCollisionVsWorld(sx,sy,t.sx,t.sy,t);

                return Phaser.Physics.Ninja.AABB.COL_OTHER;
            }
        }

        return Phaser.Physics.Ninja.AABB.COL_NONE;
    },

    /**
    * Resolves Convex tile collision.
    *
    * @method Phaser.Physics.Ninja.AABB#projAABB_Convex
    * @param {number} x - Penetration depth on the x axis.
    * @param {number} y - Penetration depth on the y axis.
    * @param {Phaser.Physics.Ninja.AABB} obj - The AABB involved in the collision.
    * @param {Phaser.Physics.Ninja.Tile} t - The Tile involved in the collision.
    * @return {number} The result of the collision.
    */
    projAABB_Convex: function (x, y, obj, t) {

        //if distance from "innermost" corner of AABB is less than than tile radius,
        //collision is occuring and we need to project

        var signx = t.signx;
        var signy = t.signy;

        var ox = (obj.pos.x - (signx * obj.xw)) - (t.pos.x - (signx * t.xw));//(ox,oy) is the vector from the circle center to
        var oy = (obj.pos.y - (signy * obj.yw)) - (t.pos.y - (signy * t.yw));//the AABB
        var len = Math.sqrt(ox * ox + oy * oy);

        var twid = t.xw * 2;
        var rad = Math.sqrt(twid * twid + 0);//this gives us the radius of a circle centered on the tile's corner and extending to the opposite edge of the tile;
        //note that this should be precomputed at compile-time since it's constant

        var pen = rad - len;

        if (((signx * ox) < 0) || ((signy * oy) < 0))
        {
            //the test corner is "outside" the 1/4 of the circle we're interested in
            var lenP = Math.sqrt(x * x + y * y);
            obj.reportCollisionVsWorld(x, y, x / lenP, y / lenP, t);

            return Phaser.Physics.Ninja.AABB.COL_AXIS;//we need to report
        }
        else if (0 < pen)
        {
            //project along corner->circle vector
            ox /= len;
            oy /= len;
            obj.reportCollisionVsWorld(ox * pen, oy * pen, ox, oy, t);

            return Phaser.Physics.Ninja.AABB.COL_OTHER;
        }

        return Phaser.Physics.Ninja.AABB.COL_NONE;

    },

    /**
    * Resolves Concave tile collision.
    *
    * @method Phaser.Physics.Ninja.AABB#projAABB_Concave
    * @param {number} x - Penetration depth on the x axis.
    * @param {number} y - Penetration depth on the y axis.
    * @param {Phaser.Physics.Ninja.AABB} obj - The AABB involved in the collision.
    * @param {Phaser.Physics.Ninja.Tile} t - The Tile involved in the collision.
    * @return {number} The result of the collision.
    */
    projAABB_Concave: function (x, y, obj, t) {

        //if distance from "innermost" corner of AABB is further than tile radius,
        //collision is occuring and we need to project

        var signx = t.signx;
        var signy = t.signy;

        var ox = (t.pos.x + (signx * t.xw)) - (obj.pos.x - (signx * obj.xw));//(ox,oy) is the vector form the innermost AABB corner to the
        var oy = (t.pos.y + (signy * t.yw)) - (obj.pos.y - (signy * obj.yw));//circle's center

        var twid = t.xw * 2;
        var rad = Math.sqrt(twid * twid + 0);//this gives us the radius of a circle centered on the tile's corner and extending to the opposite edge of the tile;
        //note that this should be precomputed at compile-time since it's constant

        var len = Math.sqrt(ox * ox + oy * oy);
        var pen = len - rad;

        if (0 < pen)
        {
            //collision; we need to either project along the axes, or project along corner->circlecenter vector

            var lenP = Math.sqrt(x * x + y * y);

            if (lenP < pen)
            {
                //it's shorter to move along axis directions
                obj.reportCollisionVsWorld(x, y, x / lenP, y / lenP, t);

                return Phaser.Physics.Ninja.AABB.COL_AXIS;
            }
            else
            {
                //project along corner->circle vector
                ox /= len;//len should never be 0, since if it IS 0, rad should be > than len
                oy /= len;//and we should never reach here

                obj.reportCollisionVsWorld(ox * pen, oy * pen, ox, oy, t);

                return Phaser.Physics.Ninja.AABB.COL_OTHER;
            }

        }

        return Phaser.Physics.Ninja.AABB.COL_NONE;

    },

    /**
    * Destroys this AABB's reference to Body and System
    *
    * @method Phaser.Physics.Ninja.AABB#destroy
    */
    destroy: function() {
        this.body = null;
        this.system = null;
    },

    /**
    * Render this AABB for debugging purposes.
    *
    * @method Phaser.Physics.Ninja.AABB#render
    * @param {object} context - The context to render to.
    * @param {number} xOffset - X offset from AABB's position to render at.
    * @param {number} yOffset - Y offset from AABB's position to render at.
    * @param {string} color - color of the debug shape to be rendered. (format is css color string).
    * @param {boolean} filled - Render the shape as solid (true) or hollow (false).
    */
    render: function(context, xOffset, yOffset, color, filled) {
        var left = this.pos.x - this.xw - xOffset;
        var top = this.pos.y - this.yw - yOffset;

        if (filled)
        {
            context.fillStyle = color;
            context.fillRect(left, top, this.width, this.height);
        }
        else
        {
            context.strokeStyle = color;
            context.strokeRect(left, top, this.width, this.height);
        }
    }
};

/* jshint camelcase: false */
/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Ninja Physics Tile constructor.
* A Tile is defined by its width, height and type. It's type can include slope data, such as 45 degree slopes, or convex slopes.
* Understand that for any type including a slope (types 2 to 29) the Tile must be SQUARE, i.e. have an equal width and height.
* Also note that as Tiles are primarily used for levels they have gravity disabled and world bounds collision disabled by default.
*
* Note: This class could be massively optimised and reduced in size. I leave that challenge up to you.
*
* @class Phaser.Physics.Ninja.Tile
* @constructor
* @param {Phaser.Physics.Ninja.Body} body - The body that owns this shape.
* @param {number} x - The x coordinate to create this shape at.
* @param {number} y - The y coordinate to create this shape at.
* @param {number} width - The width of this AABB.
* @param {number} height - The height of this AABB.
* @param {number} [type=1] - The type of Ninja shape to create. 1 = AABB, 2 = Circle or 3 = Tile.
*/
Phaser.Physics.Ninja.Tile = function (body, x, y, width, height, type) {

    if (typeof type === 'undefined') { type = Phaser.Physics.Ninja.Tile.EMPTY; }

    /**
    * @property {Phaser.Physics.Ninja.Body} system - A reference to the body that owns this shape.
    */
    this.body = body;

    /**
    * @property {Phaser.Physics.Ninja} system - A reference to the physics system.
    */
    this.system = body.system;

    /**
    * @property {number} id - The ID of this Tile.
    * @readonly
    */
    this.id = type;

    /**
    * @property {number} type - The type of this Tile.
    * @readonly
    */
    this.type = Phaser.Physics.Ninja.Tile.TYPE_EMPTY;

    /**
    * @property {Phaser.Point} pos - The position of this object.
    */
    this.pos = new Phaser.Point(x, y);

    /**
    * @property {Phaser.Point} oldpos - The position of this object in the previous update.
    */
    this.oldpos = new Phaser.Point(x, y);

    if (this.id > 1 && this.id < 30)
    {
        //  Tile Types 2 to 29 require square tile dimensions, so use the width as the base
        height = width;
    }

    /**
    * @property {number} xw - Half the width.
    * @readonly
    */
    this.xw = Math.abs(width / 2);

    /**
    * @property {number} xw - Half the height.
    * @readonly
    */
    this.yw = Math.abs(height / 2);

    /**
    * @property {number} width - The width.
    * @readonly
    */
    this.width = width;

    /**
    * @property {number} height - The height.
    * @readonly
    */
    this.height = height;

    /**
    * @property {Phaser.Point} velocity - The velocity of this object.
    */
    this.velocity = new Phaser.Point();

    /**
    * @property {number} signx - Internal var.
    * @private
    */
    this.signx = 0;

    /**
    * @property {number} signy - Internal var.
    * @private
    */
    this.signy = 0;

    /**
    * @property {number} sx - Internal var.
    * @private
    */
    this.sx = 0;

    /**
    * @property {number} sy - Internal var.
    * @private
    */
    this.sy = 0;

    //  By default Tiles disable gravity and world bounds collision
    this.body.gravityScale = 0;
    this.body.collideWorldBounds = false;

    if (this.id > 0)
    {
        this.setType(this.id);
    }

};

Phaser.Physics.Ninja.Tile.prototype.constructor = Phaser.Physics.Ninja.Tile;

Phaser.Physics.Ninja.Tile.prototype = {

    /**
    * Updates this objects position.
    *
    * @method Phaser.Physics.Ninja.Tile#integrate
    */
    integrate: function () {

        var px = this.pos.x;
        var py = this.pos.y;

        this.pos.x += (this.body.drag * this.pos.x) - (this.body.drag * this.oldpos.x);
        this.pos.y += (this.body.drag * this.pos.y) - (this.body.drag * this.oldpos.y) + (this.system.gravity * this.body.gravityScale);

        this.velocity.set(this.pos.x - px, this.pos.y - py);
        this.oldpos.set(px, py);

    },

    /**
    * Tiles cannot collide with the world bounds, it's up to you to keep them where you want them. But we need this API stub to satisfy the Body.
    *
    * @method Phaser.Physics.Ninja.Tile#collideWorldBounds
    */
    collideWorldBounds: function () {

        var dx = this.system.bounds.x - (this.pos.x - this.xw);

        if (0 < dx)
        {
            this.reportCollisionVsWorld(dx, 0, 1, 0, null);
        }
        else
        {
            dx = (this.pos.x + this.xw) - this.system.bounds.right;

            if (0 < dx)
            {
                this.reportCollisionVsWorld(-dx, 0, -1, 0, null);
            }
        }

        var dy = this.system.bounds.y - (this.pos.y - this.yw);

        if (0 < dy)
        {
            this.reportCollisionVsWorld(0, dy, 0, 1, null);
        }
        else
        {
            dy = (this.pos.y + this.yw) - this.system.bounds.bottom;

            if (0 < dy)
            {
                this.reportCollisionVsWorld(0, -dy, 0, -1, null);
            }
        }

    },

    /**
    * Process a world collision and apply the resulting forces.
    *
    * @method Phaser.Physics.Ninja.Tile#reportCollisionVsWorld
    * @param {number} px - The tangent velocity
    * @param {number} py - The tangent velocity
    * @param {number} dx - Collision normal
    * @param {number} dy - Collision normal
    * @param {number} obj - Object this Tile collided with
    */
    reportCollisionVsWorld: function (px, py, dx, dy) {
        var p = this.pos;
        var o = this.oldpos;

        //  Calc velocity
        var vx = p.x - o.x;
        var vy = p.y - o.y;

        //  Find component of velocity parallel to collision normal
        var dp = (vx * dx + vy * dy);
        var nx = dp * dx;   //project velocity onto collision normal

        var ny = dp * dy;   //nx,ny is normal velocity

        var tx = vx - nx;   //px,py is tangent velocity
        var ty = vy - ny;

        //  We only want to apply collision response forces if the object is travelling into, and not out of, the collision
        var b, bx, by, fx, fy;

        if (dp < 0)
        {
            fx = tx * this.body.friction;
            fy = ty * this.body.friction;

            b = 1 + this.body.bounce;

            bx = (nx * b);
            by = (ny * b);

            if (dx === 1)
            {
                this.body.touching.left = true;
            }
            else if (dx === -1)
            {
                this.body.touching.right = true;
            }

            if (dy === 1)
            {
                this.body.touching.up = true;
            }
            else if (dy === -1)
            {
                this.body.touching.down = true;
            }
        }
        else
        {
            //  Moving out of collision, do not apply forces
            bx = by = fx = fy = 0;
        }

        //  Project object out of collision
        p.x += px;
        p.y += py;

        //  Apply bounce+friction impulses which alter velocity
        o.x += px + bx + fx;
        o.y += py + by + fy;

    },

    /**
    * Tiles cannot collide with the world bounds, it's up to you to keep them where you want them. But we need this API stub to satisfy the Body.
    *
    * @method Phaser.Physics.Ninja.Tile#setType
    * @param {number} id - The type of Tile this will use, i.e. Phaser.Physics.Ninja.Tile.SLOPE_45DEGpn, Phaser.Physics.Ninja.Tile.CONVEXpp, etc.
    */
    setType: function (id) {

        if (id === Phaser.Physics.Ninja.Tile.EMPTY)
        {
            this.clear();
        }
        else
        {
            this.id = id;
            this.updateType();
        }

        return this;

    },

    /**
    * Sets this tile to be empty.
    *
    * @method Phaser.Physics.Ninja.Tile#clear
    */
    clear: function () {

        this.id = Phaser.Physics.Ninja.Tile.EMPTY;
        this.updateType();

    },

    /**
    * Destroys this Tiles reference to Body and System.
    *
    * @method Phaser.Physics.Ninja.Tile#destroy
    */
    destroy: function () {

        this.body = null;
        this.system = null;

    },

    /**
    * This converts a tile from implicitly-defined (via id), to explicit (via properties).
    * Don't call directly, instead of setType.
    *
    * @method Phaser.Physics.Ninja.Tile#updateType
    * @private
    */
    updateType: function () {

        if (this.id === 0)
        {
            //EMPTY
            this.type = Phaser.Physics.Ninja.Tile.TYPE_EMPTY;
            this.signx = 0;
            this.signy = 0;
            this.sx = 0;
            this.sy = 0;

            return true;
        }

        //tile is non-empty; collide
        if (this.id < Phaser.Physics.Ninja.Tile.TYPE_45DEG)
        {
            //FULL
            this.type = Phaser.Physics.Ninja.Tile.TYPE_FULL;
            this.signx = 0;
            this.signy = 0;
            this.sx = 0;
            this.sy = 0;
        }
        else if (this.id < Phaser.Physics.Ninja.Tile.TYPE_CONCAVE)
        {
            //  45deg
            this.type = Phaser.Physics.Ninja.Tile.TYPE_45DEG;

            if (this.id == Phaser.Physics.Ninja.Tile.SLOPE_45DEGpn)
            {
                this.signx = 1;
                this.signy = -1;
                this.sx = this.signx / Math.SQRT2;//get slope _unit_ normal
                this.sy = this.signy / Math.SQRT2;//since normal is (1,-1), length is sqrt(1*1 + -1*-1) = sqrt(2)
            }
            else if (this.id == Phaser.Physics.Ninja.Tile.SLOPE_45DEGnn)
            {
                this.signx = -1;
                this.signy = -1;
                this.sx = this.signx / Math.SQRT2;//get slope _unit_ normal
                this.sy = this.signy / Math.SQRT2;//since normal is (1,-1), length is sqrt(1*1 + -1*-1) = sqrt(2)
            }
            else if (this.id == Phaser.Physics.Ninja.Tile.SLOPE_45DEGnp)
            {
                this.signx = -1;
                this.signy = 1;
                this.sx = this.signx / Math.SQRT2;//get slope _unit_ normal
                this.sy = this.signy / Math.SQRT2;//since normal is (1,-1), length is sqrt(1*1 + -1*-1) = sqrt(2)
            }
            else if (this.id == Phaser.Physics.Ninja.Tile.SLOPE_45DEGpp)
            {
                this.signx = 1;
                this.signy = 1;
                this.sx = this.signx / Math.SQRT2;//get slope _unit_ normal
                this.sy = this.signy / Math.SQRT2;//since normal is (1,-1), length is sqrt(1*1 + -1*-1) = sqrt(2)
            }
            else
            {
                return false;
            }
        }
        else if (this.id < Phaser.Physics.Ninja.Tile.TYPE_CONVEX)
        {
            //  Concave
            this.type = Phaser.Physics.Ninja.Tile.TYPE_CONCAVE;

            if (this.id == Phaser.Physics.Ninja.Tile.CONCAVEpn)
            {
                this.signx = 1;
                this.signy = -1;
                this.sx = 0;
                this.sy = 0;
            }
            else if (this.id == Phaser.Physics.Ninja.Tile.CONCAVEnn)
            {
                this.signx = -1;
                this.signy = -1;
                this.sx = 0;
                this.sy = 0;
            }
            else if (this.id == Phaser.Physics.Ninja.Tile.CONCAVEnp)
            {
                this.signx = -1;
                this.signy = 1;
                this.sx = 0;
                this.sy = 0;
            }
            else if (this.id == Phaser.Physics.Ninja.Tile.CONCAVEpp)
            {
                this.signx = 1;
                this.signy = 1;
                this.sx = 0;
                this.sy = 0;
            }
            else
            {
                return false;
            }
        }
        else if (this.id < Phaser.Physics.Ninja.Tile.TYPE_22DEGs)
        {
            //  Convex
            this.type = Phaser.Physics.Ninja.Tile.TYPE_CONVEX;

            if (this.id == Phaser.Physics.Ninja.Tile.CONVEXpn)
            {
                this.signx = 1;
                this.signy = -1;
                this.sx = 0;
                this.sy = 0;
            }
            else if (this.id == Phaser.Physics.Ninja.Tile.CONVEXnn)
            {
                this.signx = -1;
                this.signy = -1;
                this.sx = 0;
                this.sy = 0;
            }
            else if (this.id == Phaser.Physics.Ninja.Tile.CONVEXnp)
            {
                this.signx = -1;
                this.signy = 1;
                this.sx = 0;
                this.sy = 0;
            }
            else if (this.id == Phaser.Physics.Ninja.Tile.CONVEXpp)
            {
                this.signx = 1;
                this.signy = 1;
                this.sx = 0;
                this.sy = 0;
            }
            else
            {
                return false;
            }
        }
        else if (this.id < Phaser.Physics.Ninja.Tile.TYPE_22DEGb)
        {
            //  22deg small
            this.type = Phaser.Physics.Ninja.Tile.TYPE_22DEGs;

            if (this.id == Phaser.Physics.Ninja.Tile.SLOPE_22DEGpnS)
            {
                this.signx = 1;
                this.signy = -1;
                var slen = Math.sqrt(2 * 2 + 1 * 1);
                this.sx = (this.signx * 1) / slen;
                this.sy = (this.signy * 2) / slen;
            }
            else if (this.id == Phaser.Physics.Ninja.Tile.SLOPE_22DEGnnS)
            {
                this.signx = -1;
                this.signy = -1;
                var slen = Math.sqrt(2 * 2 + 1 * 1);
                this.sx = (this.signx * 1) / slen;
                this.sy = (this.signy * 2) / slen;
            }
            else if (this.id == Phaser.Physics.Ninja.Tile.SLOPE_22DEGnpS)
            {
                this.signx = -1;
                this.signy = 1;
                var slen = Math.sqrt(2 * 2 + 1 * 1);
                this.sx = (this.signx * 1) / slen;
                this.sy = (this.signy * 2) / slen;
            }
            else if (this.id == Phaser.Physics.Ninja.Tile.SLOPE_22DEGppS)
            {
                this.signx = 1;
                this.signy = 1;
                var slen = Math.sqrt(2 * 2 + 1 * 1);
                this.sx = (this.signx * 1) / slen;
                this.sy = (this.signy * 2) / slen;
            }
            else
            {
                return false;
            }
        }
        else if (this.id < Phaser.Physics.Ninja.Tile.TYPE_67DEGs)
        {
            //  22deg big
            this.type = Phaser.Physics.Ninja.Tile.TYPE_22DEGb;

            if (this.id == Phaser.Physics.Ninja.Tile.SLOPE_22DEGpnB)
            {
                this.signx = 1;
                this.signy = -1;
                var slen = Math.sqrt(2 * 2 + 1 * 1);
                this.sx = (this.signx * 1) / slen;
                this.sy = (this.signy * 2) / slen;
            }
            else if (this.id == Phaser.Physics.Ninja.Tile.SLOPE_22DEGnnB)
            {
                this.signx = -1;
                this.signy = -1;
                var slen = Math.sqrt(2 * 2 + 1 * 1);
                this.sx = (this.signx * 1) / slen;
                this.sy = (this.signy * 2) / slen;
            }
            else if (this.id == Phaser.Physics.Ninja.Tile.SLOPE_22DEGnpB)
            {
                this.signx = -1;
                this.signy = 1;
                var slen = Math.sqrt(2 * 2 + 1 * 1);
                this.sx = (this.signx * 1) / slen;
                this.sy = (this.signy * 2) / slen;
            }
            else if (this.id == Phaser.Physics.Ninja.Tile.SLOPE_22DEGppB)
            {
                this.signx = 1;
                this.signy = 1;
                var slen = Math.sqrt(2 * 2 + 1 * 1);
                this.sx = (this.signx * 1) / slen;
                this.sy = (this.signy * 2) / slen;
            }
            else
            {
                return false;
            }
        }
        else if (this.id < Phaser.Physics.Ninja.Tile.TYPE_67DEGb)
        {
            //  67deg small
            this.type = Phaser.Physics.Ninja.Tile.TYPE_67DEGs;

            if (this.id == Phaser.Physics.Ninja.Tile.SLOPE_67DEGpnS)
            {
                this.signx = 1;
                this.signy = -1;
                var slen = Math.sqrt(2 * 2 + 1 * 1);
                this.sx = (this.signx * 2) / slen;
                this.sy = (this.signy * 1) / slen;
            }
            else if (this.id == Phaser.Physics.Ninja.Tile.SLOPE_67DEGnnS)
            {
                this.signx = -1;
                this.signy = -1;
                var slen = Math.sqrt(2 * 2 + 1 * 1);
                this.sx = (this.signx * 2) / slen;
                this.sy = (this.signy * 1) / slen;
            }
            else if (this.id == Phaser.Physics.Ninja.Tile.SLOPE_67DEGnpS)
            {
                this.signx = -1;
                this.signy = 1;
                var slen = Math.sqrt(2 * 2 + 1 * 1);
                this.sx = (this.signx * 2) / slen;
                this.sy = (this.signy * 1) / slen;
            }
            else if (this.id == Phaser.Physics.Ninja.Tile.SLOPE_67DEGppS)
            {
                this.signx = 1;
                this.signy = 1;
                var slen = Math.sqrt(2 * 2 + 1 * 1);
                this.sx = (this.signx * 2) / slen;
                this.sy = (this.signy * 1) / slen;
            }
            else
            {
                return false;
            }
        }
        else if (this.id < Phaser.Physics.Ninja.Tile.TYPE_HALF)
        {
            //  67deg big
            this.type = Phaser.Physics.Ninja.Tile.TYPE_67DEGb;

            if (this.id == Phaser.Physics.Ninja.Tile.SLOPE_67DEGpnB)
            {
                this.signx = 1;
                this.signy = -1;
                var slen = Math.sqrt(2 * 2 + 1 * 1);
                this.sx = (this.signx * 2) / slen;
                this.sy = (this.signy * 1) / slen;
            }
            else if (this.id == Phaser.Physics.Ninja.Tile.SLOPE_67DEGnnB)
            {
                this.signx = -1;
                this.signy = -1;
                var slen = Math.sqrt(2 * 2 + 1 * 1);
                this.sx = (this.signx * 2) / slen;
                this.sy = (this.signy * 1) / slen;
            }
            else if (this.id == Phaser.Physics.Ninja.Tile.SLOPE_67DEGnpB)
            {
                this.signx = -1;
                this.signy = 1;
                var slen = Math.sqrt(2 * 2 + 1 * 1);
                this.sx = (this.signx * 2) / slen;
                this.sy = (this.signy * 1) / slen;
            }
            else if (this.id == Phaser.Physics.Ninja.Tile.SLOPE_67DEGppB)
            {
                this.signx = 1;
                this.signy = 1;
                var slen = Math.sqrt(2 * 2 + 1 * 1);
                this.sx = (this.signx * 2) / slen;
                this.sy = (this.signy * 1) / slen;
            }
            else
            {
                return false;
            }
        }
        else
        {
            //  Half-full tile
            this.type = Phaser.Physics.Ninja.Tile.TYPE_HALF;

            if (this.id == Phaser.Physics.Ninja.Tile.HALFd)
            {
                this.signx = 0;
                this.signy = -1;
                this.sx = this.signx;
                this.sy = this.signy;
            }
            else if (this.id == Phaser.Physics.Ninja.Tile.HALFu)
            {
                this.signx = 0;
                this.signy = 1;
                this.sx = this.signx;
                this.sy = this.signy;
            }
            else if (this.id == Phaser.Physics.Ninja.Tile.HALFl)
            {
                this.signx = 1;
                this.signy = 0;
                this.sx = this.signx;
                this.sy = this.signy;
            }
            else if (this.id == Phaser.Physics.Ninja.Tile.HALFr)
            {
                this.signx = -1;
                this.signy = 0;
                this.sx = this.signx;
                this.sy = this.signy;
            }
            else
            {
                return false;
            }
        }
    }

};

/**
* @name Phaser.Physics.Ninja.Tile#x
* @property {number} x - The x position.
*/
Object.defineProperty(Phaser.Physics.Ninja.Tile.prototype, "x", {

    get: function () {
        return this.pos.x - this.xw;
    },

    set: function (value) {
        this.pos.x = value;
    }

});

/**
* @name Phaser.Physics.Ninja.Tile#y
* @property {number} y - The y position.
*/
Object.defineProperty(Phaser.Physics.Ninja.Tile.prototype, "y", {

    get: function () {
        return this.pos.y - this.yw;
    },

    set: function (value) {
        this.pos.y = value;
    }

});

/**
* @name Phaser.Physics.Ninja.Tile#bottom
* @property {number} bottom - The bottom value of this Body (same as Body.y + Body.height)
* @readonly
*/
Object.defineProperty(Phaser.Physics.Ninja.Tile.prototype, "bottom", {

    get: function () {
        return this.pos.y + this.yw;
    }

});

/**
* @name Phaser.Physics.Ninja.Tile#right
* @property {number} right - The right value of this Body (same as Body.x + Body.width)
* @readonly
*/
Object.defineProperty(Phaser.Physics.Ninja.Tile.prototype, "right", {

    get: function () {
        return this.pos.x + this.xw;
    }

});

Phaser.Physics.Ninja.Tile.EMPTY = 0;
Phaser.Physics.Ninja.Tile.FULL = 1;//fullAABB tile
Phaser.Physics.Ninja.Tile.SLOPE_45DEGpn = 2;//45-degree triangle, whose normal is (+ve,-ve)
Phaser.Physics.Ninja.Tile.SLOPE_45DEGnn = 3;//(+ve,+ve)
Phaser.Physics.Ninja.Tile.SLOPE_45DEGnp = 4;//(-ve,+ve)
Phaser.Physics.Ninja.Tile.SLOPE_45DEGpp = 5;//(-ve,-ve)
Phaser.Physics.Ninja.Tile.CONCAVEpn = 6;//1/4-circle cutout
Phaser.Physics.Ninja.Tile.CONCAVEnn = 7;
Phaser.Physics.Ninja.Tile.CONCAVEnp = 8;
Phaser.Physics.Ninja.Tile.CONCAVEpp = 9;
Phaser.Physics.Ninja.Tile.CONVEXpn = 10;//1/4/circle
Phaser.Physics.Ninja.Tile.CONVEXnn = 11;
Phaser.Physics.Ninja.Tile.CONVEXnp = 12;
Phaser.Physics.Ninja.Tile.CONVEXpp = 13;
Phaser.Physics.Ninja.Tile.SLOPE_22DEGpnS = 14;//22.5 degree slope
Phaser.Physics.Ninja.Tile.SLOPE_22DEGnnS = 15;
Phaser.Physics.Ninja.Tile.SLOPE_22DEGnpS = 16;
Phaser.Physics.Ninja.Tile.SLOPE_22DEGppS = 17;
Phaser.Physics.Ninja.Tile.SLOPE_22DEGpnB = 18;
Phaser.Physics.Ninja.Tile.SLOPE_22DEGnnB = 19;
Phaser.Physics.Ninja.Tile.SLOPE_22DEGnpB = 20;
Phaser.Physics.Ninja.Tile.SLOPE_22DEGppB = 21;
Phaser.Physics.Ninja.Tile.SLOPE_67DEGpnS = 22;//67.5 degree slope
Phaser.Physics.Ninja.Tile.SLOPE_67DEGnnS = 23;
Phaser.Physics.Ninja.Tile.SLOPE_67DEGnpS = 24;
Phaser.Physics.Ninja.Tile.SLOPE_67DEGppS = 25;
Phaser.Physics.Ninja.Tile.SLOPE_67DEGpnB = 26;
Phaser.Physics.Ninja.Tile.SLOPE_67DEGnnB = 27;
Phaser.Physics.Ninja.Tile.SLOPE_67DEGnpB = 28;
Phaser.Physics.Ninja.Tile.SLOPE_67DEGppB = 29;
Phaser.Physics.Ninja.Tile.HALFd = 30;//half-full tiles
Phaser.Physics.Ninja.Tile.HALFr = 31;
Phaser.Physics.Ninja.Tile.HALFu = 32;
Phaser.Physics.Ninja.Tile.HALFl = 33;

Phaser.Physics.Ninja.Tile.TYPE_EMPTY = 0;
Phaser.Physics.Ninja.Tile.TYPE_FULL = 1;
Phaser.Physics.Ninja.Tile.TYPE_45DEG = 2;
Phaser.Physics.Ninja.Tile.TYPE_CONCAVE = 6;
Phaser.Physics.Ninja.Tile.TYPE_CONVEX = 10;
Phaser.Physics.Ninja.Tile.TYPE_22DEGs = 14;
Phaser.Physics.Ninja.Tile.TYPE_22DEGb = 18;
Phaser.Physics.Ninja.Tile.TYPE_67DEGs = 22;
Phaser.Physics.Ninja.Tile.TYPE_67DEGb = 26;
Phaser.Physics.Ninja.Tile.TYPE_HALF = 30;

/* jshint camelcase: false */
/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Ninja Physics Circle constructor.
* Note: This class could be massively optimised and reduced in size. I leave that challenge up to you.
*
* @class Phaser.Physics.Ninja.Circle
* @constructor
* @param {Phaser.Physics.Ninja.Body} body - The body that owns this shape.
* @param {number} x - The x coordinate to create this shape at.
* @param {number} y - The y coordinate to create this shape at.
* @param {number} radius - The radius of this Circle.
*/
Phaser.Physics.Ninja.Circle = function (body, x, y, radius) {

    /**
    * @property {Phaser.Physics.Ninja.Body} system - A reference to the body that owns this shape.
    */
    this.body = body;

    /**
    * @property {Phaser.Physics.Ninja} system - A reference to the physics system.
    */
    this.system = body.system;

    /**
    * @property {Phaser.Point} pos - The position of this object.
    */
    this.pos = new Phaser.Point(x, y);

    /**
    * @property {Phaser.Point} oldpos - The position of this object in the previous update.
    */
    this.oldpos = new Phaser.Point(x, y);

    /**
    * @property {number} radius - The radius of this circle shape.
    */
    this.radius = radius;

    /**
    * @property {number} xw - Half the width.
    * @readonly
    */
    this.xw = radius;

    /**
    * @property {number} xw - Half the height.
    * @readonly
    */
    this.yw = radius;

    /**
    * @property {number} width - The width.
    * @readonly
    */
    this.width = radius * 2;

    /**
    * @property {number} height - The height.
    * @readonly
    */
    this.height = radius * 2;

    /**
    * @property {number} oH - Internal var.
    * @private
    */
    this.oH = 0;

    /**
    * @property {number} oV - Internal var.
    * @private
    */
    this.oV = 0;

    /**
    * @property {Phaser.Point} velocity - The velocity of this object.
    */
    this.velocity = new Phaser.Point();

    /**
    * @property {object} circleTileProjections - All of the collision response handlers.
    */
    this.circleTileProjections = {};

    this.circleTileProjections[Phaser.Physics.Ninja.Tile.TYPE_FULL] = this.projCircle_Full;
    this.circleTileProjections[Phaser.Physics.Ninja.Tile.TYPE_45DEG] = this.projCircle_45Deg;
    this.circleTileProjections[Phaser.Physics.Ninja.Tile.TYPE_CONCAVE] = this.projCircle_Concave;
    this.circleTileProjections[Phaser.Physics.Ninja.Tile.TYPE_CONVEX] = this.projCircle_Convex;
    this.circleTileProjections[Phaser.Physics.Ninja.Tile.TYPE_22DEGs] = this.projCircle_22DegS;
    this.circleTileProjections[Phaser.Physics.Ninja.Tile.TYPE_22DEGb] = this.projCircle_22DegB;
    this.circleTileProjections[Phaser.Physics.Ninja.Tile.TYPE_67DEGs] = this.projCircle_67DegS;
    this.circleTileProjections[Phaser.Physics.Ninja.Tile.TYPE_67DEGb] = this.projCircle_67DegB;
    this.circleTileProjections[Phaser.Physics.Ninja.Tile.TYPE_HALF] = this.projCircle_Half;

};

Phaser.Physics.Ninja.Circle.prototype.constructor = Phaser.Physics.Ninja.Circle;

Phaser.Physics.Ninja.Circle.COL_NONE = 0;
Phaser.Physics.Ninja.Circle.COL_AXIS = 1;
Phaser.Physics.Ninja.Circle.COL_OTHER = 2;

Phaser.Physics.Ninja.Circle.prototype = {

    /**
    * Updates this Circles position.
    *
    * @method Phaser.Physics.Ninja.Circle#integrate
    */
    integrate: function () {

        var px = this.pos.x;
        var py = this.pos.y;

        //  integrate
        this.pos.x += (this.body.drag * this.pos.x) - (this.body.drag * this.oldpos.x);
        this.pos.y += (this.body.drag * this.pos.y) - (this.body.drag * this.oldpos.y) + (this.system.gravity * this.body.gravityScale);

        //  store
        this.velocity.set(this.pos.x - px, this.pos.y - py);
        this.oldpos.set(px, py);

    },

    /**
    * Process a world collision and apply the resulting forces.
    *
    * @method Phaser.Physics.Ninja.Circle#reportCollisionVsWorld
    * @param {number} px - The tangent velocity
    * @param {number} py - The tangent velocity
    * @param {number} dx - Collision normal
    * @param {number} dy - Collision normal
    * @param {number} obj - Object this Circle collided with
    */
    reportCollisionVsWorld: function (px, py, dx, dy) {

        var p = this.pos;
        var o = this.oldpos;

        //  Calc velocity
        var vx = p.x - o.x;
        var vy = p.y - o.y;

        //  Find component of velocity parallel to collision normal
        var dp = (vx * dx + vy * dy);
        var nx = dp * dx;   //project velocity onto collision normal

        var ny = dp * dy;   //nx,ny is normal velocity

        var tx = vx - nx;   //px,py is tangent velocity
        var ty = vy - ny;

        //  We only want to apply collision response forces if the object is travelling into, and not out of, the collision
        var b, bx, by, fx, fy;

        if (dp < 0)
        {
            fx = tx * this.body.friction;
            fy = ty * this.body.friction;

            b = 1 + this.body.bounce;

            bx = (nx * b);
            by = (ny * b);

            if (dx === 1)
            {
                this.body.touching.left = true;
            }
            else if (dx === -1)
            {
                this.body.touching.right = true;
            }

            if (dy === 1)
            {
                this.body.touching.up = true;
            }
            else if (dy === -1)
            {
                this.body.touching.down = true;
            }
        }
        else
        {
            //  Moving out of collision, do not apply forces
            bx = by = fx = fy = 0;
        }

        //  Project object out of collision
        p.x += px;
        p.y += py;

        //  Apply bounce+friction impulses which alter velocity
        o.x += px + bx + fx;
        o.y += py + by + fy;

    },

    /**
    * Collides this Circle against the world bounds.
    *
    * @method Phaser.Physics.Ninja.Circle#collideWorldBounds
    */
    collideWorldBounds: function () {

        var dx = this.system.bounds.x - (this.pos.x - this.radius);

        if (0 < dx)
        {
            this.reportCollisionVsWorld(dx, 0, 1, 0, null);
        }
        else
        {
            dx = (this.pos.x + this.radius) - this.system.bounds.right;

            if (0 < dx)
            {
                this.reportCollisionVsWorld(-dx, 0, -1, 0, null);
            }
        }

        var dy = this.system.bounds.y - (this.pos.y - this.radius);

        if (0 < dy)
        {
            this.reportCollisionVsWorld(0, dy, 0, 1, null);
        }
        else
        {
            dy = (this.pos.y + this.radius) - this.system.bounds.bottom;

            if (0 < dy)
            {
                this.reportCollisionVsWorld(0, -dy, 0, -1, null);
            }
        }

    },

    /**
    * Collides this Circle with a Tile.
    *
    * @method Phaser.Physics.Ninja.Circle#collideCircleVsTile
    * @param {Phaser.Physics.Ninja.Tile} t - The Tile involved in the collision.
    * @return {boolean} True if they collide, otherwise false.
    */
    collideCircleVsTile: function (tile) {

        var pos = this.pos;
        var r = this.radius;
        var c = tile;

        var tx = c.pos.x;
        var ty = c.pos.y;
        var txw = c.xw;
        var tyw = c.yw;

        var dx = pos.x - tx;    //  tile->obj delta
        var px = (txw + r) - Math.abs(dx);  //  penetration depth in x

        if (0 < px)
        {
            var dy = pos.y - ty;    //  tile->obj delta
            var py = (tyw + r) - Math.abs(dy);  //  pen depth in y

            if (0 < py)
            {
                //  object may be colliding with tile

                //  determine grid/voronoi region of circle center
                this.oH = 0;
                this.oV = 0;

                if (dx < -txw)
                {
                    //  circle is on left side of tile
                    this.oH = -1;
                }
                else if (txw < dx)
                {
                    //  circle is on right side of tile
                    this.oH = 1;
                }

                if (dy < -tyw)
                {
                    //  circle is on top side of tile
                    this.oV = -1;
                }
                else if (tyw < dy)
                {
                    //  circle is on bottom side of tile
                    this.oV = 1;
                }

                return this.resolveCircleTile(px, py, this.oH, this.oV, this, c);

            }
        }
    },

    /**
    * Resolves tile collision.
    *
    * @method Phaser.Physics.Ninja.Circle#resolveCircleTile
    * @param {number} x - Penetration depth on the x axis.
    * @param {number} y - Penetration depth on the y axis.
    * @param {number} oH - Grid / voronoi region.
    * @param {number} oV - Grid / voronoi region.
    * @param {Phaser.Physics.Ninja.Circle} obj - The Circle involved in the collision.
    * @param {Phaser.Physics.Ninja.Tile} t - The Tile involved in the collision.
    * @return {number} The result of the collision.
    */
    resolveCircleTile: function (x, y, oH, oV, obj, t) {

        if (0 < t.id)
        {
            return this.circleTileProjections[t.type](x, y, oH, oV, obj, t);
        }
        else
        {
            return false;
        }

    },

    /**
    * Resolves Full tile collision.
    *
    * @method Phaser.Physics.Ninja.Circle#projCircle_Full
    * @param {number} x - Penetration depth on the x axis.
    * @param {number} y - Penetration depth on the y axis.
    * @param {number} oH - Grid / voronoi region.
    * @param {number} oV - Grid / voronoi region.
    * @param {Phaser.Physics.Ninja.Circle} obj - The Circle involved in the collision.
    * @param {Phaser.Physics.Ninja.Tile} t - The Tile involved in the collision.
    * @return {number} The result of the collision.
    */
    projCircle_Full: function (x, y, oH, oV, obj, t) {

        //if we're colliding vs. the current cell, we need to project along the
        //smallest penetration vector.
        //if we're colliding vs. horiz. or vert. neighb, we simply project horiz/vert
        //if we're colliding diagonally, we need to collide vs. tile corner

        if (oH === 0)
        {
            if (oV === 0)
            {
                //collision with current cell
                if (x < y)
                {
                    //penetration in x is smaller; project in x
                    var dx = obj.pos.x - t.pos.x;//get sign for projection along x-axis

                    //NOTE: should we handle the delta === 0 case?! and how? (project towards oldpos?)
                    if (dx < 0)
                    {
                        obj.reportCollisionVsWorld(-x, 0, -1, 0, t);
                        return Phaser.Physics.Ninja.Circle.COL_AXIS;
                    }
                    else
                    {
                        obj.reportCollisionVsWorld(x, 0, 1, 0, t);
                        return Phaser.Physics.Ninja.Circle.COL_AXIS;
                    }
                }
                else
                {
                    //penetration in y is smaller; project in y
                    var dy = obj.pos.y - t.pos.y;//get sign for projection along y-axis

                    //NOTE: should we handle the delta === 0 case?! and how? (project towards oldpos?)
                    if (dy < 0)
                    {
                        obj.reportCollisionVsWorld(0, -y, 0, -1, t);
                        return Phaser.Physics.Ninja.Circle.COL_AXIS;
                    }
                    else
                    {
                        obj.reportCollisionVsWorld(0, y, 0, 1, t);
                        return Phaser.Physics.Ninja.Circle.COL_AXIS;
                    }
                }
            }
            else
            {
                //collision with vertical neighbor
                obj.reportCollisionVsWorld(0, y * oV, 0, oV, t);

                return Phaser.Physics.Ninja.Circle.COL_AXIS;
            }
        }
        else if (oV === 0)
        {
            //collision with horizontal neighbor
            obj.reportCollisionVsWorld(x * oH, 0, oH, 0, t);
            return Phaser.Physics.Ninja.Circle.COL_AXIS;
        }
        else
        {
            //diagonal collision

            //get diag vertex position
            var vx = t.pos.x + (oH * t.xw);
            var vy = t.pos.y + (oV * t.yw);

            var dx = obj.pos.x - vx;//calc vert->circle vector
            var dy = obj.pos.y - vy;

            var len = Math.sqrt(dx * dx + dy * dy);
            var pen = obj.radius - len;

            if (0 < pen)
            {
                //vertex is in the circle; project outward
                if (len === 0)
                {
                    //project out by 45deg
                    dx = oH / Math.SQRT2;
                    dy = oV / Math.SQRT2;
                }
                else
                {
                    dx /= len;
                    dy /= len;
                }

                obj.reportCollisionVsWorld(dx * pen, dy * pen, dx, dy, t);

                return Phaser.Physics.Ninja.Circle.COL_OTHER;
            }
        }

        return Phaser.Physics.Ninja.Circle.COL_NONE;

    },

    /**
    * Resolves 45 Degree tile collision.
    *
    * @method Phaser.Physics.Ninja.Circle#projCircle_45Deg
    * @param {number} x - Penetration depth on the x axis.
    * @param {number} y - Penetration depth on the y axis.
    * @param {number} oH - Grid / voronoi region.
    * @param {number} oV - Grid / voronoi region.
    * @param {Phaser.Physics.Ninja.Circle} obj - The Circle involved in the collision.
    * @param {Phaser.Physics.Ninja.Tile} t - The Tile involved in the collision.
    * @return {number} The result of the collision.
    */
    projCircle_45Deg: function (x, y, oH, oV, obj, t) {

        //if we're colliding diagonally:
        //  -if obj is in the diagonal pointed to by the slope normal: we can't collide, do nothing
        //  -else, collide vs. the appropriate vertex
        //if obj is in this tile: perform collision as for aabb-ve-45deg
        //if obj is horiz OR very neighb in direction of slope: collide only vs. slope
        //if obj is horiz or vert neigh against direction of slope: collide vs. face

        var signx = t.signx;
        var signy = t.signy;
        var lenP;

        if (oH === 0)
        {
            if (oV === 0)
            {
                //colliding with current tile

                var sx = t.sx;
                var sy = t.sy;

                var ox = (obj.pos.x - (sx * obj.radius)) - t.pos.x;//this gives is the coordinates of the innermost
                var oy = (obj.pos.y - (sy * obj.radius)) - t.pos.y;//point on the circle, relative to the tile center

                //if the dotprod of (ox,oy) and (sx,sy) is negative, the innermost point is in the slope
                //and we need toproject it out by the magnitude of the projection of (ox,oy) onto (sx,sy)
                var dp = (ox * sx) + (oy * sy);

                if (dp < 0)
                {
                    //collision; project delta onto slope and use this as the slope penetration vector
                    sx *= -dp;//(sx,sy) is now the penetration vector
                    sy *= -dp;

                    //find the smallest axial projection vector
                    if (x < y)
                    {
                        //penetration in x is smaller
                        lenP = x;
                        y = 0;

                        //get sign for projection along x-axis
                        if ((obj.pos.x - t.pos.x) < 0)
                        {
                            x *= -1;
                        }
                    }
                    else
                    {
                        //penetration in y is smaller
                        lenP = y;
                        x = 0;

                        //get sign for projection along y-axis
                        if ((obj.pos.y - t.pos.y) < 0)
                        {
                            y *= -1;
                        }
                    }

                    var lenN = Math.sqrt(sx * sx + sy * sy);

                    if (lenP < lenN)
                    {
                        obj.reportCollisionVsWorld(x, y, x / lenP, y / lenP, t);

                        return Phaser.Physics.Ninja.Circle.COL_AXIS;
                    }
                    else
                    {
                        obj.reportCollisionVsWorld(sx, sy, t.sx, t.sy, t);

                        return Phaser.Physics.Ninja.Circle.COL_OTHER;
                    }
                }

            }
            else
            {
                //colliding vertically
                if ((signy * oV) < 0)
                {
                    //colliding with face/edge
                    obj.reportCollisionVsWorld(0, y * oV, 0, oV, t);

                    return Phaser.Physics.Ninja.Circle.COL_AXIS;
                }
                else
                {
                    //we could only be colliding vs the slope OR a vertex
                    //look at the vector form the closest vert to the circle to decide

                    var sx = t.sx;
                    var sy = t.sy;

                    var ox = obj.pos.x - (t.pos.x - (signx * t.xw));//this gives is the coordinates of the innermost
                    var oy = obj.pos.y - (t.pos.y + (oV * t.yw));//point on the circle, relative to the closest tile vert

                    //if the component of (ox,oy) parallel to the normal's righthand normal
                    //has the same sign as the slope of the slope (the sign of the slope's slope is signx*signy)
                    //then we project by the vertex, otherwise by the normal.
                    //note that this is simply a VERY tricky/weird method of determining
                    //if the circle is in side the slope/face's voronoi region, or that of the vertex.
                    var perp = (ox * -sy) + (oy * sx);
                    if (0 < (perp * signx * signy))
                    {
                        //collide vs. vertex
                        var len = Math.sqrt(ox * ox + oy * oy);
                        var pen = obj.radius - len;
                        if (0 < pen)
                        {
                            //note: if len=0, then perp=0 and we'll never reach here, so don't worry about div-by-0
                            ox /= len;
                            oy /= len;

                            obj.reportCollisionVsWorld(ox * pen, oy * pen, ox, oy, t);

                            return Phaser.Physics.Ninja.Circle.COL_OTHER;
                        }
                    }
                    else
                    {
                        //collide vs. slope

                        //if the component of (ox,oy) parallel to the normal is less than the circle radius, we're
                        //penetrating the slope. note that this method of penetration calculation doesn't hold
                        //in general (i.e it won't work if the circle is in the slope), but works in this case
                        //because we know the circle is in a neighboring cell
                        var dp = (ox * sx) + (oy * sy);
                        var pen = obj.radius - Math.abs(dp);//note: we don't need the abs because we know the dp will be positive, but just in case..
                        if (0 < pen)
                        {
                            //collision; circle out along normal by penetration amount
                            obj.reportCollisionVsWorld(sx * pen, sy * pen, sx, sy, t);

                            return Phaser.Physics.Ninja.Circle.COL_OTHER;
                        }
                    }
                }
            }
        }
        else if (oV === 0)
        {
            //colliding horizontally
            if ((signx * oH) < 0)
            {
                //colliding with face/edge
                obj.reportCollisionVsWorld(x * oH, 0, oH, 0, t);

                return Phaser.Physics.Ninja.Circle.COL_AXIS;
            }
            else
            {
                //we could only be colliding vs the slope OR a vertex
                //look at the vector form the closest vert to the circle to decide

                var sx = t.sx;
                var sy = t.sy;

                var ox = obj.pos.x - (t.pos.x + (oH * t.xw));//this gives is the coordinates of the innermost
                var oy = obj.pos.y - (t.pos.y - (signy * t.yw));//point on the circle, relative to the closest tile vert

                //if the component of (ox,oy) parallel to the normal's righthand normal
                //has the same sign as the slope of the slope (the sign of the slope's slope is signx*signy)
                //then we project by the normal, otherwise by the vertex.
                //(NOTE: this is the opposite logic of the vertical case;
                // for vertical, if the perp prod and the slope's slope agree, it's outside.
                // for horizontal, if the perp prod and the slope's slope agree, circle is inside.
                //  ..but this is only a property of flahs' coord system (i.e the rules might swap
                // in righthanded systems))
                //note that this is simply a VERY tricky/weird method of determining
                //if the circle is in side the slope/face's voronio region, or that of the vertex.
                var perp = (ox * -sy) + (oy * sx);
                if ((perp * signx * signy) < 0)
                {
                    //collide vs. vertex
                    var len = Math.sqrt(ox * ox + oy * oy);
                    var pen = obj.radius - len;
                    if (0 < pen)
                    {
                        //note: if len=0, then perp=0 and we'll never reach here, so don't worry about div-by-0
                        ox /= len;
                        oy /= len;

                        obj.reportCollisionVsWorld(ox * pen, oy * pen, ox, oy, t);

                        return Phaser.Physics.Ninja.Circle.COL_OTHER;
                    }
                }
                else
                {
                    //collide vs. slope

                    //if the component of (ox,oy) parallel to the normal is less than the circle radius, we're
                    //penetrating the slope. note that this method of penetration calculation doesn't hold
                    //in general (i.e it won't work if the circle is in the slope), but works in this case
                    //because we know the circle is in a neighboring cell
                    var dp = (ox * sx) + (oy * sy);
                    var pen = obj.radius - Math.abs(dp);//note: we don't need the abs because we know the dp will be positive, but just in case..
                    if (0 < pen)
                    {
                        //collision; circle out along normal by penetration amount
                        obj.reportCollisionVsWorld(sx * pen, sy * pen, sx, sy, t);

                        return Phaser.Physics.Ninja.Circle.COL_OTHER;
                    }
                }
            }
        }
        else
        {
            //colliding diagonally
            if (0 < ((signx * oH) + (signy * oV)))
            {
                //the dotprod of slope normal and cell offset is strictly positive,
                //therefore obj is in the diagonal neighb pointed at by the normal, and
                //it cannot possibly reach/touch/penetrate the slope
                return Phaser.Physics.Ninja.Circle.COL_NONE;
            }
            else
            {
                //collide vs. vertex
                //get diag vertex position
                var vx = t.pos.x + (oH * t.xw);
                var vy = t.pos.y + (oV * t.yw);

                var dx = obj.pos.x - vx;//calc vert->circle vector
                var dy = obj.pos.y - vy;

                var len = Math.sqrt(dx * dx + dy * dy);
                var pen = obj.radius - len;
                if (0 < pen)
                {
                    //vertex is in the circle; project outward
                    if (len === 0)
                    {
                        //project out by 45deg
                        dx = oH / Math.SQRT2;
                        dy = oV / Math.SQRT2;
                    }
                    else
                    {
                        dx /= len;
                        dy /= len;
                    }

                    obj.reportCollisionVsWorld(dx * pen, dy * pen, dx, dy, t);
                    return Phaser.Physics.Ninja.Circle.COL_OTHER;
                }

            }

        }

        return Phaser.Physics.Ninja.Circle.COL_NONE;
    },

    /**
    * Resolves Concave tile collision.
    *
    * @method Phaser.Physics.Ninja.Circle#projCircle_Concave
    * @param {number} x - Penetration depth on the x axis.
    * @param {number} y - Penetration depth on the y axis.
    * @param {number} oH - Grid / voronoi region.
    * @param {number} oV - Grid / voronoi region.
    * @param {Phaser.Physics.Ninja.Circle} obj - The Circle involved in the collision.
    * @param {Phaser.Physics.Ninja.Tile} t - The Tile involved in the collision.
    * @return {number} The result of the collision.
    */
    projCircle_Concave: function (x, y, oH, oV, obj, t) {

        //if we're colliding diagonally:
        //  -if obj is in the diagonal pointed to by the slope normal: we can't collide, do nothing
        //  -else, collide vs. the appropriate vertex
        //if obj is in this tile: perform collision as for aabb
        //if obj is horiz OR very neighb in direction of slope: collide vs vert
        //if obj is horiz or vert neigh against direction of slope: collide vs. face

        var signx = t.signx;
        var signy = t.signy;
        var lenP;

        if (oH === 0)
        {
            if (oV === 0)
            {
                //colliding with current tile

                var ox = (t.pos.x + (signx * t.xw)) - obj.pos.x;//(ox,oy) is the vector from the circle to
                var oy = (t.pos.y + (signy * t.yw)) - obj.pos.y;//tile-circle's center

                var twid = t.xw * 2;
                var trad = Math.sqrt(twid * twid + 0);//this gives us the radius of a circle centered on the tile's corner and extending to the opposite edge of the tile;
                //note that this should be precomputed at compile-time since it's constant

                var len = Math.sqrt(ox * ox + oy * oy);
                var pen = (len + obj.radius) - trad;

                if (0 < pen)
                {
                    //find the smallest axial projection vector
                    if (x < y)
                    {
                        //penetration in x is smaller
                        lenP = x;
                        y = 0;

                        //get sign for projection along x-axis
                        if ((obj.pos.x - t.pos.x) < 0)
                        {
                            x *= -1;
                        }
                    }
                    else
                    {
                        //penetration in y is smaller
                        lenP = y;
                        x = 0;

                        //get sign for projection along y-axis
                        if ((obj.pos.y - t.pos.y) < 0)
                        {
                            y *= -1;
                        }
                    }


                    if (lenP < pen)
                    {
                        obj.reportCollisionVsWorld(x, y, x / lenP, y / lenP, t);

                        return Phaser.Physics.Ninja.Circle.COL_AXIS;
                    }
                    else
                    {
                        //we can assume that len >0, because if we're here then
                        //(len + obj.radius) > trad, and since obj.radius <= trad
                        //len MUST be > 0
                        ox /= len;
                        oy /= len;

                        obj.reportCollisionVsWorld(ox * pen, oy * pen, ox, oy, t);

                        return Phaser.Physics.Ninja.Circle.COL_OTHER;
                    }
                }
                else
                {
                    return Phaser.Physics.Ninja.Circle.COL_NONE;
                }

            }
            else
            {
                //colliding vertically
                if ((signy * oV) < 0)
                {
                    //colliding with face/edge
                    obj.reportCollisionVsWorld(0, y * oV, 0, oV, t);

                    return Phaser.Physics.Ninja.Circle.COL_AXIS;
                }
                else
                {
                    //we could only be colliding vs the vertical tip

                    //get diag vertex position
                    var vx = t.pos.x - (signx * t.xw);
                    var vy = t.pos.y + (oV * t.yw);

                    var dx = obj.pos.x - vx;//calc vert->circle vector
                    var dy = obj.pos.y - vy;

                    var len = Math.sqrt(dx * dx + dy * dy);
                    var pen = obj.radius - len;
                    if (0 < pen)
                    {
                        //vertex is in the circle; project outward
                        if (len === 0)
                        {
                            //project out vertically
                            dx = 0;
                            dy = oV;
                        }
                        else
                        {
                            dx /= len;
                            dy /= len;
                        }

                        obj.reportCollisionVsWorld(dx * pen, dy * pen, dx, dy, t);

                        return Phaser.Physics.Ninja.Circle.COL_OTHER;
                    }
                }
            }
        }
        else if (oV === 0)
        {
            //colliding horizontally
            if ((signx * oH) < 0)
            {
                //colliding with face/edge
                obj.reportCollisionVsWorld(x * oH, 0, oH, 0, t);

                return Phaser.Physics.Ninja.Circle.COL_AXIS;
            }
            else
            {
                //we could only be colliding vs the horizontal tip

                //get diag vertex position
                var vx = t.pos.x + (oH * t.xw);
                var vy = t.pos.y - (signy * t.yw);

                var dx = obj.pos.x - vx;//calc vert->circle vector
                var dy = obj.pos.y - vy;

                var len = Math.sqrt(dx * dx + dy * dy);
                var pen = obj.radius - len;
                if (0 < pen)
                {
                    //vertex is in the circle; project outward
                    if (len === 0)
                    {
                        //project out horizontally
                        dx = oH;
                        dy = 0;
                    }
                    else
                    {
                        dx /= len;
                        dy /= len;
                    }

                    obj.reportCollisionVsWorld(dx * pen, dy * pen, dx, dy, t);

                    return Phaser.Physics.Ninja.Circle.COL_OTHER;
                }
            }
        }
        else
        {
            //colliding diagonally
            if (0 < ((signx * oH) + (signy * oV)))
            {
                //the dotprod of slope normal and cell offset is strictly positive,
                //therefore obj is in the diagonal neighb pointed at by the normal, and
                //it cannot possibly reach/touch/penetrate the slope
                return Phaser.Physics.Ninja.Circle.COL_NONE;
            }
            else
            {
                //collide vs. vertex
                //get diag vertex position
                var vx = t.pos.x + (oH * t.xw);
                var vy = t.pos.y + (oV * t.yw);

                var dx = obj.pos.x - vx;//calc vert->circle vector
                var dy = obj.pos.y - vy;

                var len = Math.sqrt(dx * dx + dy * dy);
                var pen = obj.radius - len;
                if (0 < pen)
                {
                    //vertex is in the circle; project outward
                    if (len === 0)
                    {
                        //project out by 45deg
                        dx = oH / Math.SQRT2;
                        dy = oV / Math.SQRT2;
                    }
                    else
                    {
                        dx /= len;
                        dy /= len;
                    }

                    obj.reportCollisionVsWorld(dx * pen, dy * pen, dx, dy, t);

                    return Phaser.Physics.Ninja.Circle.COL_OTHER;
                }

            }

        }

        return Phaser.Physics.Ninja.Circle.COL_NONE;

    },

    /**
    * Resolves Convex tile collision.
    *
    * @method Phaser.Physics.Ninja.Circle#projCircle_Convex
    * @param {number} x - Penetration depth on the x axis.
    * @param {number} y - Penetration depth on the y axis.
    * @param {number} oH - Grid / voronoi region.
    * @param {number} oV - Grid / voronoi region.
    * @param {Phaser.Physics.Ninja.Circle} obj - The Circle involved in the collision.
    * @param {Phaser.Physics.Ninja.Tile} t - The Tile involved in the collision.
    * @return {number} The result of the collision.
    */
    projCircle_Convex: function (x, y, oH, oV, obj, t) {

        //if the object is horiz AND/OR vertical neighbor in the normal (signx,signy)
        //direction, collide vs. tile-circle only.
        //if we're colliding diagonally:
        //  -else, collide vs. the appropriate vertex
        //if obj is in this tile: perform collision as for aabb
        //if obj is horiz or vert neigh against direction of slope: collide vs. face

        var signx = t.signx;
        var signy = t.signy;
        var lenP;

        if (oH === 0)
        {
            if (oV === 0)
            {
                //colliding with current tile


                var ox = obj.pos.x - (t.pos.x - (signx * t.xw));//(ox,oy) is the vector from the tile-circle to
                var oy = obj.pos.y - (t.pos.y - (signy * t.yw));//the circle's center

                var twid = t.xw * 2;
                var trad = Math.sqrt(twid * twid + 0);//this gives us the radius of a circle centered on the tile's corner and extending to the opposite edge of the tile;
                //note that this should be precomputed at compile-time since it's constant

                var len = Math.sqrt(ox * ox + oy * oy);
                var pen = (trad + obj.radius) - len;

                if (0 < pen)
                {
                    //find the smallest axial projection vector
                    if (x < y)
                    {
                        //penetration in x is smaller
                        lenP = x;
                        y = 0;

                        //get sign for projection along x-axis
                        if ((obj.pos.x - t.pos.x) < 0)
                        {
                            x *= -1;
                        }
                    }
                    else
                    {
                        //penetration in y is smaller
                        lenP = y;
                        x = 0;

                        //get sign for projection along y-axis
                        if ((obj.pos.y - t.pos.y) < 0)
                        {
                            y *= -1;
                        }
                    }


                    if (lenP < pen)
                    {
                        obj.reportCollisionVsWorld(x, y, x / lenP, y / lenP, t);

                        return Phaser.Physics.Ninja.Circle.COL_AXIS;
                    }
                    else
                    {
                        //note: len should NEVER be === 0, because if it is,
                        //projeciton by an axis shoudl always be shorter, and we should
                        //never arrive here
                        ox /= len;
                        oy /= len;

                        obj.reportCollisionVsWorld(ox * pen, oy * pen, ox, oy, t);

                        return Phaser.Physics.Ninja.Circle.COL_OTHER;

                    }
                }
            }
            else
            {
                //colliding vertically
                if ((signy * oV) < 0)
                {
                    //colliding with face/edge
                    obj.reportCollisionVsWorld(0, y * oV, 0, oV, t);

                    return Phaser.Physics.Ninja.Circle.COL_AXIS;
                }
                else
                {
                    //obj in neighboring cell pointed at by tile normal;
                    //we could only be colliding vs the tile-circle surface

                    var ox = obj.pos.x - (t.pos.x - (signx * t.xw));//(ox,oy) is the vector from the tile-circle to
                    var oy = obj.pos.y - (t.pos.y - (signy * t.yw));//the circle's center

                    var twid = t.xw * 2;
                    var trad = Math.sqrt(twid * twid + 0);//this gives us the radius of a circle centered on the tile's corner and extending to the opposite edge of the tile;
                    //note that this should be precomputed at compile-time since it's constant

                    var len = Math.sqrt(ox * ox + oy * oy);
                    var pen = (trad + obj.radius) - len;

                    if (0 < pen)
                    {

                        //note: len should NEVER be === 0, because if it is,
                        //obj is not in a neighboring cell!
                        ox /= len;
                        oy /= len;

                        obj.reportCollisionVsWorld(ox * pen, oy * pen, ox, oy, t);

                        return Phaser.Physics.Ninja.Circle.COL_OTHER;
                    }
                }
            }
        }
        else if (oV === 0)
        {
            //colliding horizontally
            if ((signx * oH) < 0)
            {
                //colliding with face/edge
                obj.reportCollisionVsWorld(x * oH, 0, oH, 0, t);

                return Phaser.Physics.Ninja.Circle.COL_AXIS;
            }
            else
            {
                //obj in neighboring cell pointed at by tile normal;
                //we could only be colliding vs the tile-circle surface

                var ox = obj.pos.x - (t.pos.x - (signx * t.xw));//(ox,oy) is the vector from the tile-circle to
                var oy = obj.pos.y - (t.pos.y - (signy * t.yw));//the circle's center

                var twid = t.xw * 2;
                var trad = Math.sqrt(twid * twid + 0);//this gives us the radius of a circle centered on the tile's corner and extending to the opposite edge of the tile;
                //note that this should be precomputed at compile-time since it's constant

                var len = Math.sqrt(ox * ox + oy * oy);
                var pen = (trad + obj.radius) - len;

                if (0 < pen)
                {

                    //note: len should NEVER be === 0, because if it is,
                    //obj is not in a neighboring cell!
                    ox /= len;
                    oy /= len;

                    obj.reportCollisionVsWorld(ox * pen, oy * pen, ox, oy, t);

                    return Phaser.Physics.Ninja.Circle.COL_OTHER;
                }
            }
        }
        else
        {
            //colliding diagonally
            if (0 < ((signx * oH) + (signy * oV)))
            {
                //obj in diag neighb cell pointed at by tile normal;
                //we could only be colliding vs the tile-circle surface

                var ox = obj.pos.x - (t.pos.x - (signx * t.xw));//(ox,oy) is the vector from the tile-circle to
                var oy = obj.pos.y - (t.pos.y - (signy * t.yw));//the circle's center

                var twid = t.xw * 2;
                var trad = Math.sqrt(twid * twid + 0);//this gives us the radius of a circle centered on the tile's corner and extending to the opposite edge of the tile;
                //note that this should be precomputed at compile-time since it's constant

                var len = Math.sqrt(ox * ox + oy * oy);
                var pen = (trad + obj.radius) - len;

                if (0 < pen)
                {

                    //note: len should NEVER be === 0, because if it is,
                    //obj is not in a neighboring cell!
                    ox /= len;
                    oy /= len;

                    obj.reportCollisionVsWorld(ox * pen, oy * pen, ox, oy, t);

                    return Phaser.Physics.Ninja.Circle.COL_OTHER;
                }
            }
            else
            {
                //collide vs. vertex
                //get diag vertex position
                var vx = t.pos.x + (oH * t.xw);
                var vy = t.pos.y + (oV * t.yw);

                var dx = obj.pos.x - vx;//calc vert->circle vector
                var dy = obj.pos.y - vy;

                var len = Math.sqrt(dx * dx + dy * dy);
                var pen = obj.radius - len;
                if (0 < pen)
                {
                    //vertex is in the circle; project outward
                    if (len === 0)
                    {
                        //project out by 45deg
                        dx = oH / Math.SQRT2;
                        dy = oV / Math.SQRT2;
                    }
                    else
                    {
                        dx /= len;
                        dy /= len;
                    }

                    obj.reportCollisionVsWorld(dx * pen, dy * pen, dx, dy, t);

                    return Phaser.Physics.Ninja.Circle.COL_OTHER;
                }

            }

        }

        return Phaser.Physics.Ninja.Circle.COL_NONE;

    },

    /**
    * Resolves Half tile collision.
    *
    * @method Phaser.Physics.Ninja.Circle#projCircle_Half
    * @param {number} x - Penetration depth on the x axis.
    * @param {number} y - Penetration depth on the y axis.
    * @param {number} oH - Grid / voronoi region.
    * @param {number} oV - Grid / voronoi region.
    * @param {Phaser.Physics.Ninja.Circle} obj - The Circle involved in the collision.
    * @param {Phaser.Physics.Ninja.Tile} t - The Tile involved in the collision.
    * @return {number} The result of the collision.
    */
    projCircle_Half: function (x,y,oH,oV,obj,t) {

        //if obj is in a neighbor pointed at by the halfedge normal,
        //we'll never collide (i.e if the normal is (0,1) and the obj is in the DL.D, or R neighbors)
        //
        //if obj is in a neigbor perpendicular to the halfedge normal, it might
        //collide with the halfedge-vertex, or with the halfedge side.
        //
        //if obj is in a neigb pointing opposite the halfedge normal, obj collides with edge
        //
        //if obj is in a diagonal (pointing away from the normal), obj collides vs vertex
        //
        //if obj is in the halfedge cell, it collides as with aabb

        var signx = t.signx;
        var signy = t.signy;

        var celldp = (oH*signx + oV*signy);//this tells us about the configuration of cell-offset relative to tile normal
        if (0 < celldp)
        {
            //obj is in "far" (pointed-at-by-normal) neighbor of halffull tile, and will never hit
            return Phaser.Physics.Ninja.Circle.COL_NONE;
        }
        else if (oH === 0)
        {
            if (oV === 0)
            {
                //colliding with current tile
                var r = obj.radius;
                var ox = (obj.pos.x - (signx*r)) - t.pos.x;//this gives is the coordinates of the innermost
                var oy = (obj.pos.y - (signy*r)) - t.pos.y;//point on the circle, relative to the tile center


                //we perform operations analogous to the 45deg tile, except we're using
                //an axis-aligned slope instead of an angled one..
                var sx = signx;
                var sy = signy;

                //if the dotprod of (ox,oy) and (sx,sy) is negative, the corner is in the slope
                //and we need toproject it out by the magnitude of the projection of (ox,oy) onto (sx,sy)
                var dp = (ox*sx) + (oy*sy);
                if (dp < 0)
                {
                    //collision; project delta onto slope and use this to displace the object
                    sx *= -dp;//(sx,sy) is now the projection vector
                    sy *= -dp;


                    var lenN = Math.sqrt(sx*sx + sy*sy);
                    var lenP = Math.sqrt(x*x + y*y);

                    if (lenP < lenN)
                    {
                        obj.reportCollisionVsWorld(x,y,x/lenP, y/lenP,t);

                        return Phaser.Physics.Ninja.Circle.COL_AXIS;
                    }
                    else
                    {
                        obj.reportCollisionVsWorld(sx,sy,t.signx,t.signy);

                        return Phaser.Physics.Ninja.Circle.COL_OTHER;
                    }
                    return true;
                }

            }
            else
            {
                //colliding vertically

                if (celldp === 0)
                {

                    var dx = obj.pos.x - t.pos.x;

                    //we're in a cell perpendicular to the normal, and can collide vs. halfedge vertex
                    //or halfedge side
                    if ((dx*signx) < 0)
                    {
                        //collision with halfedge side
                        obj.reportCollisionVsWorld(0,y*oV,0,oV,t);

                        return Phaser.Physics.Ninja.Circle.COL_AXIS;
                    }
                    else
                    {
                        //collision with halfedge vertex
                        var dy = obj.pos.y - (t.pos.y + oV*t.yw);//(dx,dy) is now the vector from the appropriate halfedge vertex to the circle

                        var len = Math.sqrt(dx*dx + dy*dy);
                        var pen = obj.radius - len;
                        if (0 < pen)
                        {
                            //vertex is in the circle; project outward
                            if (len === 0)
                            {
                                //project out by 45deg
                                dx = signx / Math.SQRT2;
                                dy = oV / Math.SQRT2;
                            }
                            else
                            {
                                dx /= len;
                                dy /= len;
                            }

                            obj.reportCollisionVsWorld(dx*pen, dy*pen, dx, dy, t);

                            return Phaser.Physics.Ninja.Circle.COL_OTHER;
                        }

                    }
                }
                else
                {
                    //due to the first conditional (celldp >0), we know we're in the cell "opposite" the normal, and so
                    //we can only collide with the cell edge
                    //collision with vertical neighbor
                    obj.reportCollisionVsWorld(0,y*oV,0,oV,t);

                    return Phaser.Physics.Ninja.Circle.COL_AXIS;
                }

            }
        }
        else if (oV === 0)
        {
            //colliding horizontally
            if (celldp === 0)
            {

                var dy = obj.pos.y - t.pos.y;

                //we're in a cell perpendicular to the normal, and can collide vs. halfedge vertex
                //or halfedge side
                if ((dy*signy) < 0)
                {
                    //collision with halfedge side
                    obj.reportCollisionVsWorld(x*oH,0,oH,0,t);

                    return Phaser.Physics.Ninja.Circle.COL_AXIS;
                }
                else
                {
                    //collision with halfedge vertex
                    var dx = obj.pos.x - (t.pos.x + oH*t.xw);//(dx,dy) is now the vector from the appropriate halfedge vertex to the circle

                    var len = Math.sqrt(dx*dx + dy*dy);
                    var pen = obj.radius - len;
                    if (0 < pen)
                    {
                        //vertex is in the circle; project outward
                        if (len === 0)
                        {
                            //project out by 45deg
                            dx = signx / Math.SQRT2;
                            dy = oV / Math.SQRT2;
                        }
                        else
                        {
                            dx /= len;
                            dy /= len;
                        }

                        obj.reportCollisionVsWorld(dx*pen, dy*pen, dx, dy, t);

                        return Phaser.Physics.Ninja.Circle.COL_OTHER;
                    }

                }
            }
            else
            {
                //due to the first conditional (celldp >0), we know w're in the cell "opposite" the normal, and so
                //we can only collide with the cell edge
                obj.reportCollisionVsWorld(x*oH, 0, oH, 0, t);

                return Phaser.Physics.Ninja.Circle.COL_AXIS;
            }
        }
        else
        {
            //colliding diagonally; we know, due to the initial (celldp >0) test which has failed
            //if we've reached this point, that we're in a diagonal neighbor on the non-normal side, so
            //we could only be colliding with the cell vertex, if at all.

            //get diag vertex position
            var vx = t.pos.x + (oH*t.xw);
            var vy = t.pos.y + (oV*t.yw);

            var dx = obj.pos.x - vx;//calc vert->circle vector
            var dy = obj.pos.y - vy;

            var len = Math.sqrt(dx*dx + dy*dy);
            var pen = obj.radius - len;
            if (0 < pen)
            {
                //vertex is in the circle; project outward
                if (len === 0)
                {
                    //project out by 45deg
                    dx = oH / Math.SQRT2;
                    dy = oV / Math.SQRT2;
                }
                else
                {
                    dx /= len;
                    dy /= len;
                }

                obj.reportCollisionVsWorld(dx*pen, dy*pen, dx, dy, t);

                return Phaser.Physics.Ninja.Circle.COL_OTHER;
            }

        }

        return Phaser.Physics.Ninja.Circle.COL_NONE;

    },

    /**
    * Resolves 22 Degree tile collision.
    *
    * @method Phaser.Physics.Ninja.Circle#projCircle_22DegS
    * @param {number} x - Penetration depth on the x axis.
    * @param {number} y - Penetration depth on the y axis.
    * @param {number} oH - Grid / voronoi region.
    * @param {number} oV - Grid / voronoi region.
    * @param {Phaser.Physics.Ninja.Circle} obj - The Circle involved in the collision.
    * @param {Phaser.Physics.Ninja.Tile} t - The Tile involved in the collision.
    * @return {number} The result of the collision.
    */
    projCircle_22DegS: function (x,y,oH,oV,obj,t) {

        //if the object is in a cell pointed at by signy, no collision will ever occur
        //otherwise,
        //
        //if we're colliding diagonally:
        //  -collide vs. the appropriate vertex
        //if obj is in this tile: collide vs slope or vertex
        //if obj is horiz neighb in direction of slope: collide vs. slope or vertex
        //if obj is horiz neighb against the slope:
        //   if (distance in y from circle to 90deg corner of tile < 1/2 tileheight, collide vs. face)
        //   else(collide vs. corner of slope) (vert collision with a non-grid-aligned vert)
        //if obj is vert neighb against direction of slope: collide vs. face

        var lenP;
        var signx = t.signx;
        var signy = t.signy;

        if (0 < (signy*oV))
        {
            //object will never collide vs tile, it can't reach that far

            return Phaser.Physics.Ninja.Circle.COL_NONE;
        }
        else if (oH === 0)
        {
            if (oV === 0)
            {
                //colliding with current tile
                //we could only be colliding vs the slope OR a vertex
                //look at the vector form the closest vert to the circle to decide

                var sx = t.sx;
                var sy = t.sy;

                var r = obj.radius;
                var ox = obj.pos.x - (t.pos.x - (signx*t.xw));//this gives is the coordinates of the innermost
                var oy = obj.pos.y - t.pos.y;//point on the circle, relative to the tile corner

                //if the component of (ox,oy) parallel to the normal's righthand normal
                //has the same sign as the slope of the slope (the sign of the slope's slope is signx*signy)
                //then we project by the vertex, otherwise by the normal or axially.
                //note that this is simply a VERY tricky/weird method of determining
                //if the circle is in side the slope/face's voronio region, or that of the vertex.

                var perp = (ox*-sy) + (oy*sx);
                if (0 < (perp*signx*signy))
                {
                    //collide vs. vertex
                    var len = Math.sqrt(ox*ox + oy*oy);
                    var pen = r - len;
                    if (0 < pen)
                    {
                        //note: if len=0, then perp=0 and we'll never reach here, so don't worry about div-by-0
                        ox /= len;
                        oy /= len;

                        obj.reportCollisionVsWorld(ox*pen, oy*pen, ox, oy, t);

                        return Phaser.Physics.Ninja.Circle.COL_OTHER;
                    }
                }
                else
                {
                    //collide vs. slope or vs axis
                    ox -= r*sx;//this gives us the vector from
                    oy -= r*sy;//a point on the slope to the innermost point on the circle

                    //if the dotprod of (ox,oy) and (sx,sy) is negative, the point on the circle is in the slope
                    //and we need toproject it out by the magnitude of the projection of (ox,oy) onto (sx,sy)
                    var dp = (ox*sx) + (oy*sy);

                    if (dp < 0)
                    {
                        //collision; project delta onto slope and use this to displace the object
                        sx *= -dp;//(sx,sy) is now the projection vector
                        sy *= -dp;

                        var lenN = Math.sqrt(sx*sx + sy*sy);

                        //find the smallest axial projection vector
                        if (x < y)
                        {
                            //penetration in x is smaller
                            lenP = x;
                            y = 0;
                            //get sign for projection along x-axis
                            if ((obj.pos.x - t.pos.x) < 0)
                            {
                                x *= -1;
                            }
                        }
                        else
                        {
                            //penetration in y is smaller
                            lenP = y;
                            x = 0;
                            //get sign for projection along y-axis
                            if ((obj.pos.y - t.pos.y)< 0)
                            {
                                y *= -1;
                            }
                        }

                        if (lenP < lenN)
                        {
                            obj.reportCollisionVsWorld(x,y,x/lenP, y/lenP, t);

                            return Phaser.Physics.Ninja.Circle.COL_AXIS;
                        }
                        else
                        {
                            obj.reportCollisionVsWorld(sx,sy,t.sx,t.sy,t);

                            return Phaser.Physics.Ninja.Circle.COL_OTHER;
                        }

                    }
                }

            }
            else
            {
                //colliding vertically; we can assume that (signy*oV) < 0
                //due to the first conditional far above

                obj.reportCollisionVsWorld(0,y*oV, 0, oV, t);

                return Phaser.Physics.Ninja.Circle.COL_AXIS;
            }
        }
        else if (oV === 0)
        {
            //colliding horizontally
            if ((signx*oH) < 0)
            {
                //colliding with face/edge OR with corner of wedge, depending on our position vertically

                //collide vs. vertex
                //get diag vertex position
                var vx = t.pos.x - (signx*t.xw);
                var vy = t.pos.y;

                var dx = obj.pos.x - vx;//calc vert->circle vector
                var dy = obj.pos.y - vy;

                if ((dy*signy) < 0)
                {
                    //colliding vs face
                    obj.reportCollisionVsWorld(x*oH, 0, oH, 0, t);

                    return Phaser.Physics.Ninja.Circle.COL_AXIS;
                }
                else
                {
                    //colliding vs. vertex

                    var len = Math.sqrt(dx*dx + dy*dy);
                    var pen = obj.radius - len;
                    if (0 < pen)
                    {
                        //vertex is in the circle; project outward
                        if (len === 0)
                        {
                            //project out by 45deg
                            dx = oH / Math.SQRT2;
                            dy = oV / Math.SQRT2;
                        }
                        else
                        {
                            dx /= len;
                            dy /= len;
                        }

                        obj.reportCollisionVsWorld(dx*pen, dy*pen, dx, dy, t);

                        return Phaser.Physics.Ninja.Circle.COL_OTHER;
                    }
                }
            }
            else
            {
                //we could only be colliding vs the slope OR a vertex
                //look at the vector form the closest vert to the circle to decide

                var sx = t.sx;
                var sy = t.sy;

                var ox = obj.pos.x - (t.pos.x + (oH*t.xw));//this gives is the coordinates of the innermost
                var oy = obj.pos.y - (t.pos.y - (signy*t.yw));//point on the circle, relative to the closest tile vert

                //if the component of (ox,oy) parallel to the normal's righthand normal
                //has the same sign as the slope of the slope (the sign of the slope's slope is signx*signy)
                //then we project by the normal, otherwise by the vertex.
                //(NOTE: this is the opposite logic of the vertical case;
                // for vertical, if the perp prod and the slope's slope agree, it's outside.
                // for horizontal, if the perp prod and the slope's slope agree, circle is inside.
                //  ..but this is only a property of flahs' coord system (i.e the rules might swap
                // in righthanded systems))
                //note that this is simply a VERY tricky/weird method of determining
                //if the circle is in side the slope/face's voronio region, or that of the vertex.
                var perp = (ox*-sy) + (oy*sx);
                if ((perp*signx*signy) < 0)
                {
                    //collide vs. vertex
                    var len = Math.sqrt(ox*ox + oy*oy);
                    var pen = obj.radius - len;
                    if (0 < pen)
                    {
                        //note: if len=0, then perp=0 and we'll never reach here, so don't worry about div-by-0
                        ox /= len;
                        oy /= len;

                        obj.reportCollisionVsWorld(ox*pen, oy*pen, ox, oy, t);

                        return Phaser.Physics.Ninja.Circle.COL_OTHER;
                    }
                }
                else
                {
                    //collide vs. slope

                    //if the component of (ox,oy) parallel to the normal is less than the circle radius, we're
                    //penetrating the slope. note that this method of penetration calculation doesn't hold
                    //in general (i.e it won't work if the circle is in the slope), but works in this case
                    //because we know the circle is in a neighboring cell
                    var dp = (ox*sx) + (oy*sy);
                    var pen = obj.radius - Math.abs(dp);//note: we don't need the abs because we know the dp will be positive, but just in case..

                    if (0 < pen)
                    {
                        //collision; circle out along normal by penetration amount
                        obj.reportCollisionVsWorld(sx*pen, sy*pen, sx, sy, t);

                        return Phaser.Physics.Ninja.Circle.COL_OTHER;
                    }
                }
            }
        }
        else
        {

            //colliding diagonally; due to the first conditional above,
            //obj is vertically offset against slope, and offset in either direction horizontally

            //collide vs. vertex
            //get diag vertex position
            var vx = t.pos.x + (oH*t.xw);
            var vy = t.pos.y + (oV*t.yw);

            var dx = obj.pos.x - vx;//calc vert->circle vector
            var dy = obj.pos.y - vy;

            var len = Math.sqrt(dx*dx + dy*dy);
            var pen = obj.radius - len;
            if (0 < pen)
            {
                //vertex is in the circle; project outward
                if (len === 0)
                {
                    //project out by 45deg
                    dx = oH / Math.SQRT2;
                    dy = oV / Math.SQRT2;
                }
                else
                {
                    dx /= len;
                    dy /= len;
                }

                obj.reportCollisionVsWorld(dx*pen, dy*pen, dx, dy, t);

                return Phaser.Physics.Ninja.Circle.COL_OTHER;
            }
        }

        return Phaser.Physics.Ninja.Circle.COL_NONE;

    },

    /**
    * Resolves 22 Degree tile collision.
    *
    * @method Phaser.Physics.Ninja.Circle#projCircle_22DegB
    * @param {number} x - Penetration depth on the x axis.
    * @param {number} y - Penetration depth on the y axis.
    * @param {number} oH - Grid / voronoi region.
    * @param {number} oV - Grid / voronoi region.
    * @param {Phaser.Physics.Ninja.Circle} obj - The Circle involved in the collision.
    * @param {Phaser.Physics.Ninja.Tile} t - The Tile involved in the collision.
    * @return {number} The result of the collision.
    */
    projCircle_22DegB: function (x,y,oH, oV, obj,t) {

        //if we're colliding diagonally:
        //  -if we're in the cell pointed at by the normal, collide vs slope, else
        //  collide vs. the appropriate corner/vertex
        //
        //if obj is in this tile: collide as with aabb
        //
        //if obj is horiz or vertical neighbor AGAINST the slope: collide with edge
        //
        //if obj is horiz neighb in direction of slope: collide vs. slope or vertex or edge
        //
        //if obj is vert neighb in direction of slope: collide vs. slope or vertex

        var lenP;
        var signx = t.signx;
        var signy = t.signy;

        if (oH === 0)
        {
            if (oV === 0)
            {
                //colliding with current cell

                var sx = t.sx;
                var sy = t.sy;

                var r = obj.radius;
                var ox = (obj.pos.x - (sx*r)) - (t.pos.x - (signx*t.xw));//this gives is the coordinates of the innermost
                var oy = (obj.pos.y - (sy*r)) - (t.pos.y + (signy*t.yw));//point on the AABB, relative to a point on the slope

                //if the dotprod of (ox,oy) and (sx,sy) is negative, the point on the circle is in the slope
                //and we need toproject it out by the magnitude of the projection of (ox,oy) onto (sx,sy)
                var dp = (ox*sx) + (oy*sy);

                if (dp < 0)
                {
                    //collision; project delta onto slope and use this to displace the object
                    sx *= -dp;//(sx,sy) is now the projection vector
                    sy *= -dp;

                    var lenN = Math.sqrt(sx*sx + sy*sy);

                    //find the smallest axial projection vector
                    if (x < y)
                    {
                        //penetration in x is smaller
                        lenP = x;
                        y = 0;
                        //get sign for projection along x-axis
                        if ((obj.pos.x - t.pos.x) < 0)
                        {
                            x *= -1;
                        }
                    }
                    else
                    {
                        //penetration in y is smaller
                        lenP = y;
                        x = 0;
                        //get sign for projection along y-axis
                        if ((obj.pos.y - t.pos.y)< 0)
                        {
                            y *= -1;
                        }
                    }

                    if (lenP < lenN)
                    {
                        obj.reportCollisionVsWorld(x, y, x/lenP, y/lenP, t);

                        return Phaser.Physics.Ninja.Circle.COL_AXIS;
                    }
                    else
                    {
                        obj.reportCollisionVsWorld(sx, sy, t.sx, t.sy, t);

                        return Phaser.Physics.Ninja.Circle.COL_OTHER;
                    }
                }
            }
            else
            {
                //colliding vertically

                if ((signy*oV) < 0)
                {
                    //colliding with face/edge
                    obj.reportCollisionVsWorld(0, y*oV, 0, oV, t);

                    return Phaser.Physics.Ninja.Circle.COL_AXIS;
                }
                else
                {
                    //we could only be colliding vs the slope OR a vertex
                    //look at the vector form the closest vert to the circle to decide

                    var sx = t.sx;
                    var sy = t.sy;

                    var ox = obj.pos.x - (t.pos.x - (signx*t.xw));//this gives is the coordinates of the innermost
                    var oy = obj.pos.y - (t.pos.y + (signy*t.yw));//point on the circle, relative to the closest tile vert

                    //if the component of (ox,oy) parallel to the normal's righthand normal
                    //has the same sign as the slope of the slope (the sign of the slope's slope is signx*signy)
                    //then we project by the vertex, otherwise by the normal.
                    //note that this is simply a VERY tricky/weird method of determining
                    //if the circle is in side the slope/face's voronio region, or that of the vertex.
                    var perp = (ox*-sy) + (oy*sx);
                    if (0 < (perp*signx*signy))
                    {
                        //collide vs. vertex
                        var len = Math.sqrt(ox*ox + oy*oy);
                        var pen = obj.radius - len;
                        if (0 < pen)
                        {
                            //note: if len=0, then perp=0 and we'll never reach here, so don't worry about div-by-0
                            ox /= len;
                            oy /= len;

                            obj.reportCollisionVsWorld(ox*pen, oy*pen, ox, oy, t);

                            return Phaser.Physics.Ninja.Circle.COL_OTHER;
                        }
                    }
                    else
                    {
                        //collide vs. slope

                        //if the component of (ox,oy) parallel to the normal is less than the circle radius, we're
                        //penetrating the slope. note that this method of penetration calculation doesn't hold
                        //in general (i.e it won't work if the circle is in the slope), but works in this case
                        //because we know the circle is in a neighboring cell
                        var dp = (ox*sx) + (oy*sy);
                        var pen = obj.radius - Math.abs(dp);//note: we don't need the abs because we know the dp will be positive, but just in case..
                        if (0 < pen)
                        {
                            //collision; circle out along normal by penetration amount
                            obj.reportCollisionVsWorld(sx*pen, sy*pen,sx, sy, t);

                            return Phaser.Physics.Ninja.Circle.COL_OTHER;
                        }
                    }
                }
            }
        }
        else if (oV === 0)
        {
            //colliding horizontally

            if ((signx*oH) < 0)
            {
                //colliding with face/edge
                obj.reportCollisionVsWorld(x*oH, 0, oH, 0, t);

                return Phaser.Physics.Ninja.Circle.COL_AXIS;
            }
            else
            {
                //colliding with edge, slope, or vertex

                var ox = obj.pos.x - (t.pos.x + (signx*t.xw));//this gives is the coordinates of the innermost
                var oy = obj.pos.y - t.pos.y;//point on the circle, relative to the closest tile vert

                if ((oy*signy) < 0)
                {
                    //we're colliding with the halfface
                    obj.reportCollisionVsWorld(x*oH, 0, oH, 0, t);

                    return Phaser.Physics.Ninja.Circle.COL_AXIS;
                }
                else
                {
                    //colliding with the vertex or slope

                    var sx = t.sx;
                    var sy = t.sy;

                    //if the component of (ox,oy) parallel to the normal's righthand normal
                    //has the same sign as the slope of the slope (the sign of the slope's slope is signx*signy)
                    //then we project by the slope, otherwise by the vertex.
                    //note that this is simply a VERY tricky/weird method of determining
                    //if the circle is in side the slope/face's voronio region, or that of the vertex.
                    var perp = (ox*-sy) + (oy*sx);
                    if ((perp*signx*signy) < 0)
                    {
                        //collide vs. vertex
                        var len = Math.sqrt(ox*ox + oy*oy);
                        var pen = obj.radius - len;
                        if (0 < pen)
                        {
                            //note: if len=0, then perp=0 and we'll never reach here, so don't worry about div-by-0
                            ox /= len;
                            oy /= len;

                            obj.reportCollisionVsWorld(ox*pen, oy*pen, ox, oy, t);

                            return Phaser.Physics.Ninja.Circle.COL_OTHER;
                        }
                    }
                    else
                    {
                        //collide vs. slope

                        //if the component of (ox,oy) parallel to the normal is less than the circle radius, we're
                        //penetrating the slope. note that this method of penetration calculation doesn't hold
                        //in general (i.e it won't work if the circle is in the slope), but works in this case
                        //because we know the circle is in a neighboring cell
                        var dp = (ox*sx) + (oy*sy);
                        var pen = obj.radius - Math.abs(dp);//note: we don't need the abs because we know the dp will be positive, but just in case..
                        if (0 < pen)
                        {
                            //collision; circle out along normal by penetration amount
                            obj.reportCollisionVsWorld(sx*pen, sy*pen, t.sx, t.sy, t);

                            return Phaser.Physics.Ninja.Circle.COL_OTHER;
                        }
                    }
                }
            }
        }
        else
        {
            //colliding diagonally
            if ( 0 < ((signx*oH) + (signy*oV)) )
            {
                //the dotprod of slope normal and cell offset is strictly positive,
                //therefore obj is in the diagonal neighb pointed at by the normal.

                //collide vs slope

                //we should really precalc this at compile time, but for now, fuck it
                var slen = Math.sqrt(2*2 + 1*1);//the raw slope is (-2,-1)
                var sx = (signx*1) / slen;//get slope _unit_ normal;
                var sy = (signy*2) / slen;//raw RH normal is (1,-2)

                var r = obj.radius;
                var ox = (obj.pos.x - (sx*r)) - (t.pos.x - (signx*t.xw));//this gives is the coordinates of the innermost
                var oy = (obj.pos.y - (sy*r)) - (t.pos.y + (signy*t.yw));//point on the circle, relative to a point on the slope

                //if the dotprod of (ox,oy) and (sx,sy) is negative, the point on the circle is in the slope
                //and we need toproject it out by the magnitude of the projection of (ox,oy) onto (sx,sy)
                var dp = (ox*sx) + (oy*sy);

                if (dp < 0)
                {
                    //collision; project delta onto slope and use this to displace the object
                    //(sx,sy)*-dp is the projection vector
                    obj.reportCollisionVsWorld(-sx*dp, -sy*dp, t.sx, t.sy, t);

                    return Phaser.Physics.Ninja.Circle.COL_OTHER;
                }
                return Phaser.Physics.Ninja.Circle.COL_NONE;
            }
            else
            {
                //collide vs the appropriate vertex
                var vx = t.pos.x + (oH*t.xw);
                var vy = t.pos.y + (oV*t.yw);

                var dx = obj.pos.x - vx;//calc vert->circle vector
                var dy = obj.pos.y - vy;

                var len = Math.sqrt(dx*dx + dy*dy);
                var pen = obj.radius - len;
                if (0 < pen)
                {
                    //vertex is in the circle; project outward
                    if (len === 0)
                    {
                        //project out by 45deg
                        dx = oH / Math.SQRT2;
                        dy = oV / Math.SQRT2;
                    }
                    else
                    {
                        dx /= len;
                        dy /= len;
                    }

                    obj.reportCollisionVsWorld(dx*pen, dy*pen, dx, dy, t);

                    return Phaser.Physics.Ninja.Circle.COL_OTHER;
                }

            }
        }

        return Phaser.Physics.Ninja.Circle.COL_NONE;
    },

    /**
    * Resolves 67 Degree tile collision.
    *
    * @method Phaser.Physics.Ninja.Circle#projCircle_67DegS
    * @param {number} x - Penetration depth on the x axis.
    * @param {number} y - Penetration depth on the y axis.
    * @param {number} oH - Grid / voronoi region.
    * @param {number} oV - Grid / voronoi region.
    * @param {Phaser.Physics.Ninja.Circle} obj - The Circle involved in the collision.
    * @param {Phaser.Physics.Ninja.Tile} t - The Tile involved in the collision.
    * @return {number} The result of the collision.
    */
    projCircle_67DegS: function (x,y,oH,oV,obj,t) {

        //if the object is in a cell pointed at by signx, no collision will ever occur
        //otherwise,
        //
        //if we're colliding diagonally:
        //  -collide vs. the appropriate vertex
        //if obj is in this tile: collide vs slope or vertex or axis
        //if obj is vert neighb in direction of slope: collide vs. slope or vertex
        //if obj is vert neighb against the slope:
        //   if (distance in y from circle to 90deg corner of tile < 1/2 tileheight, collide vs. face)
        //   else(collide vs. corner of slope) (vert collision with a non-grid-aligned vert)
        //if obj is horiz neighb against direction of slope: collide vs. face

        var signx = t.signx;
        var signy = t.signy;

        if (0 < (signx*oH))
        {
            //object will never collide vs tile, it can't reach that far

            return Phaser.Physics.Ninja.Circle.COL_NONE;
        }
        else if (oH === 0)
        {
            if (oV === 0)
            {
                //colliding with current tile
                //we could only be colliding vs the slope OR a vertex
                //look at the vector form the closest vert to the circle to decide

                var lenP;
                var sx = t.sx;
                var sy = t.sy;

                var r = obj.radius;
                var ox = obj.pos.x - t.pos.x;//this gives is the coordinates of the innermost
                var oy = obj.pos.y - (t.pos.y - (signy*t.yw));//point on the circle, relative to the tile corner

                //if the component of (ox,oy) parallel to the normal's righthand normal
                //has the same sign as the slope of the slope (the sign of the slope's slope is signx*signy)
                //then we project by the normal or axis, otherwise by the corner/vertex
                //note that this is simply a VERY tricky/weird method of determining
                //if the circle is in side the slope/face's voronoi region, or that of the vertex.

                var perp = (ox*-sy) + (oy*sx);
                if ((perp*signx*signy) < 0)
                {
                    //collide vs. vertex
                    var len = Math.sqrt(ox*ox + oy*oy);
                    var pen = r - len;
                    if (0 < pen)
                    {
                        //note: if len=0, then perp=0 and we'll never reach here, so don't worry about div-by-0
                        ox /= len;
                        oy /= len;

                        obj.reportCollisionVsWorld(ox*pen, oy*pen, ox, oy, t);
                        return Phaser.Physics.Ninja.Circle.COL_OTHER;
                    }
                }
                else
                {
                    //collide vs. slope or vs axis
                    ox -= r*sx;//this gives us the vector from
                    oy -= r*sy;//a point on the slope to the innermost point on the circle

                    //if the dotprod of (ox,oy) and (sx,sy) is negative, the point on the circle is in the slope
                    //and we need toproject it out by the magnitude of the projection of (ox,oy) onto (sx,sy)
                    var dp = (ox*sx) + (oy*sy);

                    if (dp < 0)
                    {
                        //collision; project delta onto slope and use this to displace the object
                        sx *= -dp;//(sx,sy) is now the projection vector
                        sy *= -dp;

                        var lenN = Math.sqrt(sx*sx + sy*sy);

                        //find the smallest axial projection vector
                        if (x < y)
                        {
                            //penetration in x is smaller
                            lenP = x;
                            y = 0;
                            //get sign for projection along x-axis
                            if ((obj.pos.x - t.pos.x) < 0)
                            {
                                x *= -1;
                            }
                        }
                        else
                        {
                            //penetration in y is smaller
                            lenP = y;
                            x = 0;
                            //get sign for projection along y-axis
                            if ((obj.pos.y - t.pos.y)< 0)
                            {
                                y *= -1;
                            }
                        }

                        if (lenP < lenN)
                        {
                            obj.reportCollisionVsWorld(x,y,x/lenP, y/lenP, t);

                            return Phaser.Physics.Ninja.Circle.COL_AXIS;
                        }
                        else
                        {
                            obj.reportCollisionVsWorld(sx,sy,t.sx,t.sy,t);

                            return Phaser.Physics.Ninja.Circle.COL_OTHER;
                        }
                    }
                }

            }
            else
            {
                //colliding vertically

                if ((signy*oV) < 0)
                {
                    //colliding with face/edge OR with corner of wedge, depending on our position vertically

                    //collide vs. vertex
                    //get diag vertex position
                    var vx = t.pos.x;
                    var vy = t.pos.y - (signy*t.yw);

                    var dx = obj.pos.x - vx;//calc vert->circle vector
                    var dy = obj.pos.y - vy;

                    if ((dx*signx) < 0)
                    {
                        //colliding vs face
                        obj.reportCollisionVsWorld(0, y*oV, 0, oV, t);

                        return Phaser.Physics.Ninja.Circle.COL_AXIS;
                    }
                    else
                    {
                        //colliding vs. vertex

                        var len = Math.sqrt(dx*dx + dy*dy);
                        var pen = obj.radius - len;
                        if (0 < pen)
                        {
                            //vertex is in the circle; project outward
                            if (len === 0)
                            {
                                //project out by 45deg
                                dx = oH / Math.SQRT2;
                                dy = oV / Math.SQRT2;
                            }
                            else
                            {
                                dx /= len;
                                dy /= len;
                            }

                            obj.reportCollisionVsWorld(dx*pen, dy*pen, dx, dy, t);

                            return Phaser.Physics.Ninja.Circle.COL_OTHER;
                        }
                    }
                }
                else
                {
                    //we could only be colliding vs the slope OR a vertex
                    //look at the vector form the closest vert to the circle to decide

                    var sx = t.sx;
                    var sy = t.sy;

                    var ox = obj.pos.x - (t.pos.x - (signx*t.xw));//this gives is the coordinates of the innermost
                    var oy = obj.pos.y - (t.pos.y + (oV*t.yw));//point on the circle, relative to the closest tile vert

                    //if the component of (ox,oy) parallel to the normal's righthand normal
                    //has the same sign as the slope of the slope (the sign of the slope's slope is signx*signy)
                    //then we project by the vertex, otherwise by the normal.
                    //note that this is simply a VERY tricky/weird method of determining
                    //if the circle is in side the slope/face's voronio region, or that of the vertex.
                    var perp = (ox*-sy) + (oy*sx);
                    if (0 < (perp*signx*signy))
                    {
                        //collide vs. vertex
                        var len = Math.sqrt(ox*ox + oy*oy);
                        var pen = obj.radius - len;
                        if (0 < pen)
                        {
                            //note: if len=0, then perp=0 and we'll never reach here, so don't worry about div-by-0
                            ox /= len;
                            oy /= len;

                            obj.reportCollisionVsWorld(ox*pen, oy*pen, ox, oy, t);

                            return Phaser.Physics.Ninja.Circle.COL_OTHER;
                        }
                    }
                    else
                    {
                        //collide vs. slope

                        //if the component of (ox,oy) parallel to the normal is less than the circle radius, we're
                        //penetrating the slope. note that this method of penetration calculation doesn't hold
                        //in general (i.e it won't work if the circle is in the slope), but works in this case
                        //because we know the circle is in a neighboring cell
                        var dp = (ox*sx) + (oy*sy);
                        var pen = obj.radius - Math.abs(dp);//note: we don't need the abs because we know the dp will be positive, but just in case..

                        if (0 < pen)
                        {
                            //collision; circle out along normal by penetration amount
                            obj.reportCollisionVsWorld(sx*pen, sy*pen, t.sx, t.sy, t);

                            return Phaser.Physics.Ninja.Circle.COL_OTHER;
                        }
                    }
                }
            }
        }
        else if (oV === 0)
        {
            //colliding horizontally; we can assume that (signy*oV) < 0
            //due to the first conditional far above

            obj.reportCollisionVsWorld(x*oH, 0, oH, 0, t);

            return Phaser.Physics.Ninja.Circle.COL_AXIS;
        }
        else
        {
            //colliding diagonally; due to the first conditional above,
            //obj is vertically offset against slope, and offset in either direction horizontally

            //collide vs. vertex
            //get diag vertex position
            var vx = t.pos.x + (oH*t.xw);
            var vy = t.pos.y + (oV*t.yw);

            var dx = obj.pos.x - vx;//calc vert->circle vector
            var dy = obj.pos.y - vy;

            var len = Math.sqrt(dx*dx + dy*dy);
            var pen = obj.radius - len;
            if (0 < pen)
            {
                //vertex is in the circle; project outward
                if (len === 0)
                {
                    //project out by 45deg
                    dx = oH / Math.SQRT2;
                    dy = oV / Math.SQRT2;
                }
                else
                {
                    dx /= len;
                    dy /= len;
                }

                obj.reportCollisionVsWorld(dx*pen, dy*pen, dx, dy, t);

                return Phaser.Physics.Ninja.Circle.COL_OTHER;
            }
        }

        return Phaser.Physics.Ninja.Circle.COL_NONE;

    },

    /**
    * Resolves 67 Degree tile collision.
    *
    * @method Phaser.Physics.Ninja.Circle#projCircle_67DegB
    * @param {number} x - Penetration depth on the x axis.
    * @param {number} y - Penetration depth on the y axis.
    * @param {number} oH - Grid / voronoi region.
    * @param {number} oV - Grid / voronoi region.
    * @param {Phaser.Physics.Ninja.Circle} obj - The Circle involved in the collision.
    * @param {Phaser.Physics.Ninja.Tile} t - The Tile involved in the collision.
    * @return {number} The result of the collision.
    */
    projCircle_67DegB: function (x,y,oH, oV, obj,t) {

        //if we're colliding diagonally:
        //  -if we're in the cell pointed at by the normal, collide vs slope, else
        //  collide vs. the appropriate corner/vertex
        //
        //if obj is in this tile: collide as with aabb
        //
        //if obj is horiz or vertical neighbor AGAINST the slope: collide with edge
        //
        //if obj is vert neighb in direction of slope: collide vs. slope or vertex or halfedge
        //
        //if obj is horiz neighb in direction of slope: collide vs. slope or vertex

        var signx = t.signx;
        var signy = t.signy;

        if (oH === 0)
        {
            if (oV === 0)
            {
                //colliding with current cell

                var lenP;
                var sx = t.sx;
                var sy = t.sy;

                var r = obj.radius;
                var ox = (obj.pos.x - (sx*r)) - (t.pos.x + (signx*t.xw));//this gives is the coordinates of the innermost
                var oy = (obj.pos.y - (sy*r)) - (t.pos.y - (signy*t.yw));//point on the AABB, relative to a point on the slope

                //if the dotprod of (ox,oy) and (sx,sy) is negative, the point on the circle is in the slope
                //and we need toproject it out by the magnitude of the projection of (ox,oy) onto (sx,sy)
                var dp = (ox*sx) + (oy*sy);

                if (dp < 0)
                {
                    //collision; project delta onto slope and use this to displace the object
                    sx *= -dp;//(sx,sy) is now the projection vector
                    sy *= -dp;

                    var lenN = Math.sqrt(sx*sx + sy*sy);

                    //find the smallest axial projection vector
                    if (x < y)
                    {
                        //penetration in x is smaller
                        lenP = x;
                        y = 0;
                        //get sign for projection along x-axis
                        if ((obj.pos.x - t.pos.x) < 0)
                        {
                            x *= -1;
                        }
                    }
                    else
                    {
                        //penetration in y is smaller
                        lenP = y;
                        x = 0;
                        //get sign for projection along y-axis
                        if ((obj.pos.y - t.pos.y)< 0)
                        {
                            y *= -1;
                        }
                    }

                    if (lenP < lenN)
                    {
                        obj.reportCollisionVsWorld(x,y,x/lenP, y/lenP, t);

                        return Phaser.Physics.Ninja.Circle.COL_AXIS;
                    }
                    else
                    {
                        obj.reportCollisionVsWorld(sx, sy, t.sx, t.sy, t);

                        return Phaser.Physics.Ninja.Circle.COL_OTHER;
                    }

                }
            }
            else
            {
                //colliding vertically

                if ((signy*oV) < 0)
                {
                    //colliding with face/edge
                    obj.reportCollisionVsWorld(0, y*oV, 0, oV, t);

                    return Phaser.Physics.Ninja.Circle.COL_AXIS;
                }
                else
                {
                    //colliding with edge, slope, or vertex

                    var ox = obj.pos.x - t.pos.x;//this gives is the coordinates of the innermost
                    var oy = obj.pos.y - (t.pos.y + (signy*t.yw));//point on the circle, relative to the closest tile vert

                    if ((ox*signx) < 0)
                    {
                        //we're colliding with the halfface
                        obj.reportCollisionVsWorld(0, y*oV, 0, oV, t);

                        return Phaser.Physics.Ninja.Circle.COL_AXIS;
                    }
                    else
                    {
                        //colliding with the vertex or slope

                        var sx = t.sx;
                        var sy = t.sy;

                        //if the component of (ox,oy) parallel to the normal's righthand normal
                        //has the same sign as the slope of the slope (the sign of the slope's slope is signx*signy)
                        //then we project by the vertex, otherwise by the slope.
                        //note that this is simply a VERY tricky/weird method of determining
                        //if the circle is in side the slope/face's voronio region, or that of the vertex.
                        var perp = (ox*-sy) + (oy*sx);
                        if (0 < (perp*signx*signy))
                        {
                            //collide vs. vertex
                            var len = Math.sqrt(ox*ox + oy*oy);
                            var pen = obj.radius - len;
                            if (0 < pen)
                            {
                                //note: if len=0, then perp=0 and we'll never reach here, so don't worry about div-by-0
                                ox /= len;
                                oy /= len;

                                obj.reportCollisionVsWorld(ox*pen, oy*pen, ox, oy, t);

                                return Phaser.Physics.Ninja.Circle.COL_OTHER;
                            }
                        }
                        else
                        {
                            //collide vs. slope

                            //if the component of (ox,oy) parallel to the normal is less than the circle radius, we're
                            //penetrating the slope. note that this method of penetration calculation doesn't hold
                            //in general (i.e it won't work if the circle is in the slope), but works in this case
                            //because we know the circle is in a neighboring cell
                            var dp = (ox*sx) + (oy*sy);
                            var pen = obj.radius - Math.abs(dp);//note: we don't need the abs because we know the dp will be positive, but just in case..
                            if (0 < pen)
                            {
                                //collision; circle out along normal by penetration amount
                                obj.reportCollisionVsWorld(sx*pen, sy*pen, sx, sy, t);

                                return Phaser.Physics.Ninja.Circle.COL_OTHER;
                            }
                        }
                    }
                }
            }
        }
        else if (oV === 0)
        {
            //colliding horizontally

            if ((signx*oH) < 0)
            {
                //colliding with face/edge
                obj.reportCollisionVsWorld(x*oH, 0, oH, 0, t);

                return Phaser.Physics.Ninja.Circle.COL_AXIS;
            }
            else
            {
                //we could only be colliding vs the slope OR a vertex
                //look at the vector form the closest vert to the circle to decide

                var slen = Math.sqrt(2*2 + 1*1);//the raw slope is (-2,-1)
                var sx = (signx*2) / slen;//get slope _unit_ normal;
                var sy = (signy*1) / slen;//raw RH normal is (1,-2)

                var ox = obj.pos.x - (t.pos.x + (signx*t.xw));//this gives is the coordinates of the innermost
                var oy = obj.pos.y - (t.pos.y - (signy*t.yw));//point on the circle, relative to the closest tile vert

                //if the component of (ox,oy) parallel to the normal's righthand normal
                //has the same sign as the slope of the slope (the sign of the slope's slope is signx*signy)
                //then we project by the slope, otherwise by the vertex.
                //note that this is simply a VERY tricky/weird method of determining
                //if the circle is in side the slope/face's voronio region, or that of the vertex.
                var perp = (ox*-sy) + (oy*sx);
                if ((perp*signx*signy) < 0)
                {
                    //collide vs. vertex
                    var len = Math.sqrt(ox*ox + oy*oy);
                    var pen = obj.radius - len;
                    if (0 < pen)
                    {
                        //note: if len=0, then perp=0 and we'll never reach here, so don't worry about div-by-0
                        ox /= len;
                        oy /= len;

                        obj.reportCollisionVsWorld(ox*pen, oy*pen, ox, oy, t);

                        return Phaser.Physics.Ninja.Circle.COL_OTHER;
                    }
                }
                else
                {
                    //collide vs. slope

                    //if the component of (ox,oy) parallel to the normal is less than the circle radius, we're
                    //penetrating the slope. note that this method of penetration calculation doesn't hold
                    //in general (i.e it won't work if the circle is in the slope), but works in this case
                    //because we know the circle is in a neighboring cell
                    var dp = (ox*sx) + (oy*sy);
                    var pen = obj.radius - Math.abs(dp);//note: we don't need the abs because we know the dp will be positive, but just in case..
                    if (0 < pen)
                    {
                        //collision; circle out along normal by penetration amount
                        obj.reportCollisionVsWorld(sx*pen, sy*pen, t.sx, t.sy, t);

                        return Phaser.Physics.Ninja.Circle.COL_OTHER;
                    }
                }
            }
        }
        else
        {
            //colliding diagonally
            if ( 0 < ((signx*oH) + (signy*oV)) )
            {
                //the dotprod of slope normal and cell offset is strictly positive,
                //therefore obj is in the diagonal neighb pointed at by the normal.

                //collide vs slope

                var sx = t.sx;
                var sy = t.sy;

                var r = obj.radius;
                var ox = (obj.pos.x - (sx*r)) - (t.pos.x + (signx*t.xw));//this gives is the coordinates of the innermost
                var oy = (obj.pos.y - (sy*r)) - (t.pos.y - (signy*t.yw));//point on the circle, relative to a point on the slope

                //if the dotprod of (ox,oy) and (sx,sy) is negative, the point on the circle is in the slope
                //and we need toproject it out by the magnitude of the projection of (ox,oy) onto (sx,sy)
                var dp = (ox*sx) + (oy*sy);

                if (dp < 0)
                {
                    //collision; project delta onto slope and use this to displace the object
                    //(sx,sy)*-dp is the projection vector

                    obj.reportCollisionVsWorld(-sx*dp, -sy*dp, t.sx, t.sy, t);

                    return Phaser.Physics.Ninja.Circle.COL_OTHER;
                }
                return Phaser.Physics.Ninja.Circle.COL_NONE;
            }
            else
            {

                //collide vs the appropriate vertex
                var vx = t.pos.x + (oH*t.xw);
                var vy = t.pos.y + (oV*t.yw);

                var dx = obj.pos.x - vx;//calc vert->circle vector
                var dy = obj.pos.y - vy;

                var len = Math.sqrt(dx*dx + dy*dy);
                var pen = obj.radius - len;
                if (0 < pen)
                {
                    //vertex is in the circle; project outward
                    if (len === 0)
                    {
                        //project out by 45deg
                        dx = oH / Math.SQRT2;
                        dy = oV / Math.SQRT2;
                    }
                    else
                    {
                        dx /= len;
                        dy /= len;
                    }

                    obj.reportCollisionVsWorld(dx*pen, dy*pen, dx, dy, t);

                    return Phaser.Physics.Ninja.Circle.COL_OTHER;
                }

            }
        }

        return Phaser.Physics.Ninja.Circle.COL_NONE;
    },

    /**
    * Destroys this Circle's reference to Body and System
    *
    * @method Phaser.Physics.Ninja.Circle#destroy
    */
    destroy: function() {
        this.body = null;
        this.system = null;
    },

    /**
    * Render this circle for debugging purposes.
    *
    * @method Phaser.Physics.Ninja.Circle#render
    * @param {object} context - The context to render to.
    * @param {number} xOffset - X offset from circle's position to render at.
    * @param {number} yOffset - Y offset from circle's position to render at.
    * @param {string} color - color of the debug shape to be rendered. (format is css color string).
    * @param {boolean} filled - Render the shape as solid (true) or hollow (false).
    */
    render: function(context, xOffset, yOffset, color, filled) {
        var x = this.pos.x - xOffset;
        var y = this.pos.y - yOffset;

        context.beginPath();
        context.arc(x, y, this.radius, 0, 2 * Math.PI, false);

        if (filled)
        {
            context.fillStyle = color;
            context.fill();
        }
        else
        {
            context.strokeStyle = color;
            context.stroke();
        }
    }
};
