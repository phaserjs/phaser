/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
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

        if (type === undefined) { type = 1; }
        if (id === undefined) { id = 1; }
        if (radius === undefined) { radius = 0; }
        if (children === undefined) { children = true; }

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
    * @param {number|string|Phaser.TilemapLayer} layer - The layer to operate on. If not given will default to map.currentLayer.
    * @param {object} slopeMap - The tilemap index to Tile ID map.
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
        if (object2 === undefined && (object1.type === Phaser.GROUP || object1.type === Phaser.EMITTER))
        {
            this.collideGroupVsSelf(object1, collideCallback, processCallback, callbackContext, overlapOnly);
            return;
        }

        if (object1 && object2 && object1.exists && object2.exists)
        {
            //  SPRITES
            if (object1.type === Phaser.SPRITE || object1.type === Phaser.TILESPRITE)
            {
                if (object2.type === Phaser.SPRITE || object2.type === Phaser.TILESPRITE)
                {
                    this.collideSpriteVsSprite(object1, object2, collideCallback, processCallback, callbackContext, overlapOnly);
                }
                else if (object2.type === Phaser.GROUP || object2.type === Phaser.EMITTER)
                {
                    this.collideSpriteVsGroup(object1, object2, collideCallback, processCallback, callbackContext, overlapOnly);
                }
                else if (object2.type === Phaser.TILEMAPLAYER)
                {
                    this.collideSpriteVsTilemapLayer(object1, object2, collideCallback, processCallback, callbackContext);
                }
            }
            //  GROUPS
            else if (object1.type === Phaser.GROUP)
            {
                if (object2.type === Phaser.SPRITE || object2.type === Phaser.TILESPRITE)
                {
                    this.collideSpriteVsGroup(object2, object1, collideCallback, processCallback, callbackContext, overlapOnly);
                }
                else if (object2.type === Phaser.GROUP || object2.type === Phaser.EMITTER)
                {
                    this.collideGroupVsGroup(object1, object2, collideCallback, processCallback, callbackContext, overlapOnly);
                }
                else if (object2.type === Phaser.TILEMAPLAYER)
                {
                    this.collideGroupVsTilemapLayer(object1, object2, collideCallback, processCallback, callbackContext);
                }
            }
            //  TILEMAP LAYERS
            else if (object1.type === Phaser.TILEMAPLAYER)
            {
                if (object2.type === Phaser.SPRITE || object2.type === Phaser.TILESPRITE)
                {
                    this.collideSpriteVsTilemapLayer(object2, object1, collideCallback, processCallback, callbackContext);
                }
                else if (object2.type === Phaser.GROUP || object2.type === Phaser.EMITTER)
                {
                    this.collideGroupVsTilemapLayer(object2, object1, collideCallback, processCallback, callbackContext);
                }
            }
            //  EMITTER
            else if (object1.type === Phaser.EMITTER)
            {
                if (object2.type === Phaser.SPRITE || object2.type === Phaser.TILESPRITE)
                {
                    this.collideSpriteVsGroup(object2, object1, collideCallback, processCallback, callbackContext, overlapOnly);
                }
                else if (object2.type === Phaser.GROUP || object2.type === Phaser.EMITTER)
                {
                    this.collideGroupVsGroup(object1, object2, collideCallback, processCallback, callbackContext, overlapOnly);
                }
                else if (object2.type === Phaser.TILEMAPLAYER)
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
