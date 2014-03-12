/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

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
    * @property {number} maxObjects - Used by the QuadTree to set the maximum number of objects per quad.
    */
    this.maxObjects = 10;

    /**
    * @property {number} maxLevels - Used by the QuadTree to set the maximum number of iteration levels.
    */
    this.maxLevels = 4;

    /**
    * @property {number} OVERLAP_BIAS - A value added to the delta values during collision checks.
    */
    this.OVERLAP_BIAS = 4;

    /**
    * @property {Phaser.QuadTree} quadTree - The world QuadTree.
    */
    this.quadTree = new Phaser.QuadTree(this.game.world.bounds.x, this.game.world.bounds.y, this.game.world.bounds.width, this.game.world.bounds.height, this.maxObjects, this.maxLevels);

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
    * @property {number} _intersection - Internal cache var.
    * @private
    */
    // this._intersection = [0,0,0,0];
    this._intersection = new Phaser.Rectangle();

};

Phaser.Physics.Arcade.prototype.constructor = Phaser.Physics.Arcade;

Phaser.Physics.Arcade.prototype = {

    /**
    * This will create an Arcade Physics body on the given game object or array of game objects.
    * A game object can only have 1 physics body active at any one time, and it can't be changed until the object is destroyed.
    *
    * @method Phaser.Physics.Arcade#enable
    * @param {object|array|Phaser.Group} object - The game object to create the physics body on. Can also be an array or Group of objects, a body will be created on every child that has a `body` property.
    * @param {boolean} [children=true] - Should a body be created on all children of this object? If true it will recurse down the display list as far as it can go.
    */
    enable: function (object, children) {

        if (typeof children === 'undefined') { children = true; }

        var i = 1;

        if (Array.isArray(object))
        {
            i = object.length;

            while (i--)
            {
                if (object[i] instanceof Phaser.Group)
                {
                    //  If it's a Group then we do it on the children regardless
                    this.enable(object[i].children, children);
                }
                else
                {
                    this.enableBody(object[i]);

                    if (children && object[i].hasOwnProperty('children') && object[i].children.length > 0)
                    {
                        this.enable(object[i], true);
                    }
                }
            }
        }
        else
        {
            if (object instanceof Phaser.Group)
            {
                //  If it's a Group then we do it on the children regardless
                this.enable(object.children, children);
            }
            else
            {
                this.enableBody(object);

                if (children && object.hasOwnProperty('children') && object.children.length > 0)
                {
                    this.enable(object.children, true);
                }
            }
        }

    },

    /**
    * Creates an Arcade Physics body on the given game object.
    * A game object can only have 1 physics body active at any one time, and it can't be changed until the body is nulled.
    *
    * @method Phaser.Physics.Arcade#enableBody
    * @param {object} object - The game object to create the physics body on. A body will only be created if this object has a null `body` property.
    */
    enableBody: function (object) {

        if (object.hasOwnProperty('body') && object.body === null)
        {
            object.body = new Phaser.Physics.Arcade.Body(object);
        }

    },

    /**
    * Called automatically by a Physics body, it updates all motion related values on the Body.
    *
    * @method Phaser.Physics.Arcade#updateMotion
    * @param {Phaser.Physics.Arcade.Body} The Body object to be updated.
    */
    updateMotion: function (body) {

        this._velocityDelta = this.computeVelocity(body.angularVelocity, body.angularAcceleration, body.angularDrag, body.maxAngular) - body.angularVelocity;
        body.angularVelocity += this._velocityDelta;
        body.rotation += (body.angularVelocity * this.game.time.physicsElapsed);

        //  Apply gravity using the p2 style gravityScale
        if (body.allowGravity)
        {
            if (body.gravity.x !== 0)
            {
                body.velocity.x += body.gravity.x * this.game.time.physicsElapsed;
            }
            else
            {
                body.velocity.x += this.gravity.x * this.game.time.physicsElapsed * body.gravityScale.x;
            }

            if (body.gravity.y !== 0)
            {
                body.velocity.y += body.gravity.y * this.game.time.physicsElapsed;
            }
            else
            {
                body.velocity.y += this.gravity.y * this.game.time.physicsElapsed * body.gravityScale.y;
            }
        }

        //  Apply velocity
        body.velocity.x = this.computeVelocity(body.velocity.x, body.acceleration.x, body.drag.x, body.maxVelocity.x);
        body.velocity.y = this.computeVelocity(body.velocity.y, body.acceleration.y, body.drag.y, body.maxVelocity.y);

    },

    /**
    * A tween-like function that takes a starting velocity and some other factors and returns an altered velocity.
    * Based on a function in Flixel by @ADAMATOMIC
    *
    * @method Phaser.Physics.Arcade#computeVelocity
    * @param {number} velocity - Any component of velocity (e.g. 20).
    * @param {number} acceleration - Rate at which the velocity is changing.
    * @param {number} drag - Really kind of a deceleration, this is how much the velocity changes if Acceleration is not set.
    * @param {number} [max=10000] - An absolute value cap for the velocity.
    * @return {number} The altered Velocity value.
    */
    computeVelocity: function (velocity, acceleration, drag, max) {

        max = max || 10000;

        if (acceleration)
        {
            velocity += acceleration * this.game.time.physicsElapsed;
        }
        else if (drag)
        {
            this._drag = drag * this.game.time.physicsElapsed;

            if (velocity - this._drag > 0)
            {
                velocity -= this._drag;
            }
            else if (velocity + this._drag < 0)
            {
                velocity += this._drag;
            }
            else
            {
                velocity = 0;
            }
        }

        if (velocity > max)
        {
            velocity = max;
        }
        else if (velocity < -max)
        {
            velocity = -max;
        }

        return velocity;

    },

    /**
    * Checks for overlaps between two game objects. The objects can be Sprites, Groups or Emitters.
    * You can perform Sprite vs. Sprite, Sprite vs. Group and Group vs. Group overlap checks.
    * Unlike collide the objects are NOT automatically separated or have any physics applied, they merely test for overlap results.
    * The second parameter can be an array of objects, of differing types.
    *
    * @method Phaser.Physics.Arcade#overlap
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
    * @method Phaser.Physics.Arcade#collide
    * @param {Phaser.Sprite|Phaser.Group|Phaser.Particles.Emitter|Phaser.Tilemap} object1 - The first object to check. Can be an instance of Phaser.Sprite, Phaser.Group, Phaser.Particles.Emitter, or Phaser.Tilemap.
    * @param {Phaser.Sprite|Phaser.Group|Phaser.Particles.Emitter|Phaser.Tilemap|array} object2 - The second object or array of objects to check. Can be Phaser.Sprite, Phaser.Group, Phaser.Particles.Emitter or Phaser.Tilemap.
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

        this.quadTree.reset(this.game.world.bounds.x, this.game.world.bounds.y, this.game.world.bounds.width, this.game.world.bounds.height, this.maxObjects, this.maxLevels);

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

        for (var i = 0, len = group1.children.length; i < len; i++)
        {
            if (group1.children[i].exists)
            {
                this.collideSpriteVsGroup(group1.children[i], group2, collideCallback, processCallback, callbackContext, overlapOnly);
            }
        }

    },

    /**
    * An internal function. Use Phaser.Physics.Arcade.collide instead.
    *
    * @method Phaser.Physics.Arcade#collideSpriteVsTilemapLayer
    * @private
    */
    collideSpriteVsTilemapLayer: function (sprite, tilemapLayer, collideCallback, processCallback, callbackContext) {

        // this._mapData = tilemapLayer.getTiles(sprite.body.left, sprite.body.top, sprite.body.width, sprite.body.height, true);
        // this._mapData = tilemapLayer.getTiles(sprite.body.x, sprite.body.y, sprite.body.width, sprite.body.height, true);

        this._mapData = tilemapLayer.getIntersectingTiles(sprite.body.position.x, sprite.body.position.y, sprite.body.width, sprite.body.height, true);

        // var vx = sprite.body.x;
        // var vy = sprite.body.y;

        // vx += sprite.body.newVelocity.x;
        // vy += sprite.body.newVelocity.y;

        // this._mapData = tilemapLayer.getIntersectingTiles(vx, vy, sprite.body.width, sprite.body.height, true);

        if (this._mapData.length === 0)
        {
            return;
        }

        // if (this._mapData.length > 1)
        // {
            //  Needs process callback added
            this.separateTiles(sprite.body, this._mapData);
        // }

        /*
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
        */

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

        for (var i = 0, len = group.children.length; i < len; i++)
        {
            if (group.children[i].exists)
            {
                this.collideSpriteVsTilemapLayer(group.children[i], tilemapLayer, collideCallback, processCallback, callbackContext);
            }
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

        if (!Phaser.Rectangle.intersects(body1, body2))
        {
            return false;
        }

        //  They overlap. Is there a custom process callback? If it returns true then we can carry on, otherwise we should abort.
        if (processCallback && processCallback.call(callbackContext, body1.sprite, body2.sprite) === false)
        {
            return false;
        }

        if (this.separateX(body1, body2, overlapOnly) || this.separateY(body1, body2, overlapOnly))
        {
            this._result = true;

            return true;
        }
        else
        {
            return false;
        }

    },

    /**
    * The core separation function to separate two physics bodies on the x axis.
    * @method Phaser.Physics.Arcade#separateX
    * @param {Phaser.Physics.Arcade.Body} body1 - The Body object to separate.
    * @param {Phaser.Physics.Arcade.Body} body2 - The Body object to separate.
    * @param {boolean} overlapOnly - If true the bodies will only have their overlap data set, no separation or exchange of velocity will take place.
    * @returns {boolean} Returns true if the bodies were separated, otherwise false.
    */
    separateX: function (body1, body2, overlapOnly) {

        //  Can't separate two immovable bodies
        if (body1.immovable && body2.immovable)
        {
            return false;
        }

        this._overlap = 0;

        //  Check if the hulls actually overlap
        if (Phaser.Rectangle.intersects(body1, body2))
        {
            this._maxOverlap = body1.deltaAbsX() + body2.deltaAbsX() + this.OVERLAP_BIAS;

            if (body1.deltaX() === 0 && body2.deltaX() === 0)
            {
                //  They overlap but neither of them are moving
                body1.embedded = true;
                body2.embedded = true;
            }
            else if (body1.deltaX() > body2.deltaX())
            {
                //  Body1 is moving right and/or Body2 is moving left
                this._overlap = body1.x + body1.width - body2.x;

                if ((this._overlap > this._maxOverlap) || body1.checkCollision.right === false || body2.checkCollision.left === false)
                {
                    this._overlap = 0;
                }
                else
                {
                    body1.touching.right = true;
                    body2.touching.left = true;
                }
            }
            else if (body1.deltaX() < body2.deltaX())
            {
                //  Body1 is moving left and/or Body2 is moving right
                this._overlap = body1.x - body2.width - body2.x;

                if ((-this._overlap > this._maxOverlap) || body1.checkCollision.left === false || body2.checkCollision.right === false)
                {
                    this._overlap = 0;
                }
                else
                {
                    body1.touching.left = true;
                    body2.touching.right = true;
                }
            }

            //  Then adjust their positions and velocities accordingly (if there was any overlap)
            if (this._overlap !== 0)
            {
                body1.overlapX = this._overlap;
                body2.overlapX = this._overlap;

                if (overlapOnly || body1.customSeparateX || body2.customSeparateX)
                {
                    return true;
                }

                this._velocity1 = body1.velocity.x;
                this._velocity2 = body2.velocity.x;

                if (!body1.immovable && !body2.immovable)
                {
                    this._overlap *= 0.5;

                    body1.x = body1.x - this._overlap;
                    body2.x += this._overlap;

                    this._newVelocity1 = Math.sqrt((this._velocity2 * this._velocity2 * body2.mass) / body1.mass) * ((this._velocity2 > 0) ? 1 : -1);
                    this._newVelocity2 = Math.sqrt((this._velocity1 * this._velocity1 * body1.mass) / body2.mass) * ((this._velocity1 > 0) ? 1 : -1);
                    this._average = (this._newVelocity1 + this._newVelocity2) * 0.5;
                    this._newVelocity1 -= this._average;
                    this._newVelocity2 -= this._average;

                    body1.velocity.x = this._average + this._newVelocity1 * body1.bounce.x;
                    body2.velocity.x = this._average + this._newVelocity2 * body2.bounce.x;
                }
                else if (!body1.immovable)
                {
                    body1.x = body1.x - this._overlap;
                    body1.velocity.x = this._velocity2 - this._velocity1 * body1.bounce.x;
                }
                else if (!body2.immovable)
                {
                    body2.x += this._overlap;
                    body2.velocity.x = this._velocity1 - this._velocity2 * body2.bounce.x;
                }

                return true;
            }
        }

        return false;

    },

    /**
    * The core separation function to separate two physics bodies on the y axis.
    * @method Phaser.Physics.Arcade#separateY
    * @param {Phaser.Physics.Arcade.Body} body1 - The Body object to separate.
    * @param {Phaser.Physics.Arcade.Body} body2 - The Body object to separate.
    * @param {boolean} overlapOnly - If true the bodies will only have their overlap data set, no separation or exchange of velocity will take place.
    * @returns {boolean} Returns true if the bodies were separated, otherwise false.
    */
    separateY: function (body1, body2, overlapOnly) {

        //  Can't separate two immovable or non-existing bodys
        if (body1.immovable && body2.immovable)
        {
            return false;
        }

        this._overlap = 0;

        //  Check if the hulls actually overlap
        if (Phaser.Rectangle.intersects(body1, body2))
        {
            this._maxOverlap = body1.deltaAbsY() + body2.deltaAbsY() + this.OVERLAP_BIAS;

            if (body1.deltaY() === 0 && body2.deltaY() === 0)
            {
                //  They overlap but neither of them are moving
                body1.embedded = true;
                body2.embedded = true;
            }
            else if (body1.deltaY() > body2.deltaY())
            {
                //  Body1 is moving down and/or Body2 is moving up
                this._overlap = body1.y + body1.height - body2.y;

                if ((this._overlap > this._maxOverlap) || body1.checkCollision.down === false || body2.checkCollision.up === false)
                {
                    this._overlap = 0;
                }
                else
                {
                    body1.touching.down = true;
                    body2.touching.up = true;
                }
            }
            else if (body1.deltaY() < body2.deltaY())
            {
                //  Body1 is moving up and/or Body2 is moving down
                this._overlap = body1.y - body2.height - body2.y;

                if ((-this._overlap > this._maxOverlap) || body1.checkCollision.up === false || body2.checkCollision.down === false)
                {
                    this._overlap = 0;
                }
                else
                {
                    body1.touching.up = true;
                    body2.touching.down = true;
                }
            }

            //  Then adjust their positions and velocities accordingly (if there was any overlap)
            if (this._overlap !== 0)
            {
                body1.overlapY = this._overlap;
                body2.overlapY = this._overlap;

                if (overlapOnly || body1.customSeparateY || body2.customSeparateY)
                {
                    return true;
                }

                this._velocity1 = body1.velocity.y;
                this._velocity2 = body2.velocity.y;

                if (!body1.immovable && !body2.immovable)
                {
                    this._overlap *= 0.5;

                    body1.y = body1.y - this._overlap;
                    body2.y += this._overlap;

                    this._newVelocity1 = Math.sqrt((this._velocity2 * this._velocity2 * body2.mass) / body1.mass) * ((this._velocity2 > 0) ? 1 : -1);
                    this._newVelocity2 = Math.sqrt((this._velocity1 * this._velocity1 * body1.mass) / body2.mass) * ((this._velocity1 > 0) ? 1 : -1);
                    this._average = (this._newVelocity1 + this._newVelocity2) * 0.5;
                    this._newVelocity1 -= this._average;
                    this._newVelocity2 -= this._average;

                    body1.velocity.y = this._average + this._newVelocity1 * body1.bounce.y;
                    body2.velocity.y = this._average + this._newVelocity2 * body2.bounce.y;
                }
                else if (!body1.immovable)
                {
                    body1.y = body1.y - this._overlap;
                    body1.velocity.y = this._velocity2 - this._velocity1 * body1.bounce.y;

                    //  This is special case code that handles things like horizontal moving platforms you can ride
                    if (body2.moves)
                    {
                        body1.x += body2.x - body2.prev.x;
                    }
                }
                else if (!body2.immovable)
                {
                    body2.y += this._overlap;
                    body2.velocity.y = this._velocity1 - this._velocity2 * body2.bounce.y;

                    //  This is special case code that handles things like horizontal moving platforms you can ride
                    if (body1.moves)
                    {
                        body2.x += body1.x - body1.prev.x;
                    }
                }

                return true;
            }

        }

        return false;

    },

    separateTiles: function (body, tiles) {

        body.resetResult();

        var result = false;

        for (var i = 0; i < tiles.length; i++)
        {
            if (this.separateTile(i, body, tiles[i]))
            {
                result = true;
            }
        }

        return result;

    },

    separateTile: function (i, body, tile) {

        //  we re-check for collision in case body was separated in a previous step
        if (i > 0 && !tile.intersects(body.position.x, body.position.y, body.right, body.bottom))
        {
            //  no collision so bail out (separted in a previous step)
            console.log('no collision so bail out (separted in a previous step');
            return false;
        }

        // console.log('body intersecting tile');
        // console.log('x', body.position.x, 'y', body.position.y, 'r', body.right, 'b', body.bottom, 'wh', body.width, body.height);
        // console.log('x', tile.x, 'y', tile.y, 'r', tile.right, 'b', tile.bottom);

        if (body.newVelocity.x && (tile.faceLeft || tile.faceRight))
        {
            var px = 0;
            var tx = 0;

            if (body.newVelocity.x > 0 && tile.faceLeft)
            {
                px = body.width;
            }
            else if (body.newVelocity.x < 0 && tile.faceRight)
            {
                tx = tile.width;
            }

            body.position.x = tile.worldX - px + tx;
    
            body.velocity.x = 0; // rebound check
            // body.newVelocity.x = 0; // rebound check
        }

        //  Vertical only if still colliding

        // if (tile.intersects(body.position.x, body.position.y, body.right, body.bottom))
        // if (body.newVelocity.y && tile.intersects(body.position.x, body.position.y, body.right, body.bottom))
        if (body.newVelocity.y && (tile.faceTop || tile.faceBottom))
        {
            var py = 0;
            var ty = 0;

            if (body.newVelocity.y > 0 && tile.faceBottom)
            {
                py = body.height;
            }
            else if (body.newVelocity.y < 0 && tile.faceTop)
            {
                ty = tile.height;
            }

            // console.log('cy', body.newVelocity.y, py, ty);

            body.position.y = tile.worldY - py + ty;

            body.velocity.y = 0; // rebound check
            // body.newVelocity.y = 0; // rebound check
        }

        // var pxOffsetX = (body.newVelocity.x > 0 ? body.width : 0);
        // var tileOffsetX = (body.newVelocity.x < 0 ? tile.width : 0);
        // var pxOffsetY = (body.newVelocity.y > 0 ? body.height : 0);
        // var tileOffsetY = (body.newVelocity.y < 0 ? tile.height : 0);

        //  Assume fully solid for now

        // body.result.x = true;
        // body.result.tile = tile;
        // body.result.px = tile.x - pxOffsetX + tileOffsetX;
        // body.position.x = tile.x - pxOffsetX + tileOffsetX;

        // res.pos.y = tileY * this.tilesize - pxOffsetY + tileOffsetY;



        // console.log('nv', body.newVelocity.x, 'tile.xy', tile.x, tile.y, 'p', pxOffsetX, 't', tileOffsetX, 'body xy', body.position.x, body.position.y);

    },

    /**
    * The core separation function to separate a physics body and a tile.
    * @method Phaser.Physics.Arcade#separateTile
    * @param {Phaser.Physics.Arcade.Body} body - The Body object to separate.
    * @param {Phaser.Tile} tile - The tile to collide against.
    * @returns {boolean} Returns true if the body was separated, otherwise false.
    */
    XXXseparateTile: function (body, tile) {

        /*
        this._intersection = this.tileIntersects(body, tile);

        //  If the intersection area is either entirely null, or has a width/height of zero, we bail out now
        if (this._intersection[4] === 0 || this._intersection[2] === 0 || this._intersection[3] === 0)
        {
            return false;
        }

        Phaser.Rectangle.intersection(body, tile, this._intersection);

        if (this._intersection.width === 0 && this._intersection.height === 0)
        {
            return false;
        }
        */

        // console.log(this._intersection);
        // console.log(tile, body.x, body.y);

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

        if (body.deltaX() < 0 && body.checkCollision.left)
        {
            //  Body is moving LEFT
            if (tile.tile.faceRight && body.x < tile.right)
            {

            }
        }


        var process = false;

        if (this._intersection.width > 0)
        {
            //  Tile is blocking to the right and body is moving left
            if (body.deltaX() < 0 && body.checkCollision.left && tile.tile.faceRight)
            {
                body.x = tile.right;
                // process = true;
                // body.overlapX = -this._intersection.width;
            }

            //  Tile is blocking to the left and body is moving right
            if (body.deltaX() > 0 && body.checkCollision.right && tile.tile.faceLeft)
            {
                body.right = tile.x;
                // process = true;
                // body.overlapX = this._intersection.width;
            }
        }

/*
        if (body.overlapX !== 0)
        {
            if (body.overlapX < 0)
            {
                body.blocked.left = true;
            }
            else if (body.overlapX > 0)
            {
                body.blocked.right = true;
            }

            body.x -= body.overlapX;
            // body.preX -= body.overlapX;
            body.blocked.x = Math.floor(body.x);
            body.blocked.y = Math.floor(body.y);

            if (body.bounce.x === 0)
            {
                body.velocity.x = 0;
            }
            else
            {
                body.velocity.x = -body.velocity.x * body.bounce.x;
            }
        }
*/

        Phaser.Rectangle.intersection(body, tile, this._intersection);

        if (this._intersection.width === 0 && this._intersection.height === 0)
        {
            return false;
        }

        body.overlapY = 0;

        var process = false;

        if (this._intersection.height > 0)
        {
            //  Tile is blocking to the bottom and body is moving up
            if (body.deltaY() < 0 && body.checkCollision.up && tile.tile.faceBottom)
            {

                // process = true;
                // body.overlapY = -this._intersection.height;
            }
            
            //  Tile is blocking to the top and body is moving down
            if (body.deltaY() > 0 && body.checkCollision.down && tile.tile.faceTop)
            {
                process = true;
                body.overlapY = this._intersection.height;
            }
        }

        if (body.overlapY !== 0)
        {
            if (body.overlapY < 0)
            {
                body.blocked.up = true;
            }
            else if (body.overlapY > 0)
            {
                body.blocked.down = true;
            }

            body.y -= body.overlapY;
            // body.preY -= body.overlapY;
            body.blocked.x = Math.floor(body.x);
            body.blocked.y = Math.floor(body.y);

            if (body.bounce.y === 0)
            {
                body.velocity.y = 0;
            }
            else
            {
                body.velocity.y = -body.velocity.y * body.bounce.y;
            }
        }

        return;


        /*
        if (body.deltaX() < 0 && body.checkCollision.left && tile.tile.faceRight && !body.blocked.left)
        // if (body.deltaX() < 0 && body.checkCollision.left && tile.tile.faceRight)
        {
            //  LEFT
            body.overlapX = body.x - tile.right;

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
        // else if (body.deltaX() > 0 && body.checkCollision.right && tile.tile.faceLeft)
        {
            //  RIGHT
            body.overlapX = body.right - tile.x;

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
        // if (body.deltaY() < 0 && body.checkCollision.up && tile.tile.faceBottom)
        {
            //  UP
            body.overlapY = body.y - tile.bottom;

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
        // else if (body.deltaY() > 0 && body.checkCollision.down && tile.tile.faceTop)
        {
            //  DOWN
            body.overlapY = body.bottom - tile.y;

            if (body.overlapY > 0)
            {
                process = true;
            }
            else
            {
                body.overlapY = 0;
            }
        }
        */

        //  Only separate on the smallest of the two values if it's a single tile
        /*
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
        */

        //  Separate in a single sweep
/*        if (process)
        {
            return this.processTileSeparation(body);
        }
        else
        {
            return false;
        }
*/
    },

    /**
    * Internal function to process the separation of a physics body from a tile.
    * @method Phaser.Physics.Arcade#processTileSeparation
    * @protected
    * @param {Phaser.Physics.Arcade.Body} body - The Body object to separate.
    * @returns {boolean} Returns true if separated, false if not.
    */
    processTileSeparation: function (body) {

        if (body.overlapX !== 0)
        {
            if (body.overlapX < 0)
            {
                body.blocked.left = true;
            }
            else if (body.overlapX > 0)
            {
                body.blocked.right = true;
            }

            body.x -= body.overlapX;
            body.preX -= body.overlapX;
            body.blocked.x = Math.floor(body.x);
            body.blocked.y = Math.floor(body.y);

            if (body.bounce.x === 0)
            {
                body.velocity.x = 0;
            }
            else
            {
                body.velocity.x = -body.velocity.x * body.bounce.x;
            }
        }

        if (body.overlapY !== 0)
        {
            if (body.overlapY < 0)
            {
                body.blocked.up = true;
            }
            else if (body.overlapY > 0)
            {
                body.blocked.down = true;
            }

            body.y -= body.overlapY;
            body.preY -= body.overlapY;
            body.blocked.x = Math.floor(body.x);
            body.blocked.y = Math.floor(body.y);

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
    * If you specify a maxTime then it will adjust the speed (overwriting what you set) so it arrives at the destination in that number of seconds.
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
