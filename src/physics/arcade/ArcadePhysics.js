Phaser.Physics = {};

Phaser.Physics.Arcade = function (game) {
	
	this.game = game;

	this.gravity = new Phaser.Point;
	this.bounds = new Phaser.Rectangle(0, 0, game.world.width, game.world.height);

	/**
	* Used by the QuadTree to set the maximum number of objects
	* @type {number}
	*/
	this.maxObjects = 10;

	/**
	* Used by the QuadTree to set the maximum number of levels
	* @type {number}
	*/
	this.maxLevels = 4;

	this.OVERLAP_BIAS = 4;
	this.TILE_OVERLAP = false;

    this.quadTree = new Phaser.QuadTree(this, this.game.world.bounds.x, this.game.world.bounds.y, this.game.world.bounds.width, this.game.world.bounds.height, this.maxObjects, this.maxLevels);
	this.quadTreeID = 0;

	//	Avoid gc spikes by caching these values for re-use
	this._bounds1 = new Phaser.Rectangle;
	this._bounds2 = new Phaser.Rectangle;
	this._overlap = 0;
	this._maxOverlap = 0;
	this._velocity1 = 0;
	this._velocity2 = 0;
	this._newVelocity1 = 0;
	this._newVelocity2 = 0;
	this._average = 0;
    this._mapData = [];
    this._result = false;
    this._total = 0;

};

Phaser.Physics.Arcade.prototype = {

    updateMotion: function (body) {

    	//	Rotation
        this._velocityDelta = (this.computeVelocity(0, false, body.angularVelocity, body.angularAcceleration, body.angularDrag, body.maxAngular) - body.angularVelocity) / 2;
        body.angularVelocity += this._velocityDelta;
        body.rotation += body.angularVelocity * this.game.time.physicsElapsed;

    	//	Horizontal
        this._velocityDelta = (this.computeVelocity(1, body, body.velocity.x, body.acceleration.x, body.drag.x, body.maxVelocity.x) - body.velocity.x) / 2;
        body.velocity.x += this._velocityDelta;
	    this._delta = body.velocity.x * this.game.time.physicsElapsed;
        body.x += this._delta;

    	//	Vertical
        this._velocityDelta = (this.computeVelocity(2, body, body.velocity.y, body.acceleration.y, body.drag.y, body.maxVelocity.y) - body.velocity.y) / 2;
        body.velocity.y += this._velocityDelta;
        this._delta = body.velocity.y * this.game.time.physicsElapsed;
        body.y += this._delta;

    },

	/**
    * A tween-like function that takes a starting velocity and some other factors and returns an altered velocity.
    *
    * @param {number} Velocity Any component of velocity (e.g. 20).
    * @param {number} Acceleration Rate at which the velocity is changing.
    * @param {number} Drag Really kind of a deceleration, this is how much the velocity changes if Acceleration is not set.
    * @param {number} Max An absolute value cap for the velocity.
    *
    * @return {number} The altered Velocity value.
    */
    computeVelocity: function (axis, body, velocity, acceleration, drag, max) {

    	max = max || 10000;

    	if (axis == 1 && body.allowGravity)
        {
        	velocity += this.gravity.x + body.gravity.x;
        }
    	else if (axis == 2 && body.allowGravity)
        {
        	velocity += this.gravity.y + body.gravity.y;
        }

        if (acceleration !== 0)
        {
            velocity += acceleration * this.game.time.physicsElapsed;
        }
        else if (drag !== 0)
        {
            this._drag = drag * this.game.time.physicsElapsed;

            if (velocity - this._drag > 0)
            {
                velocity = velocity - this._drag;
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

        if (velocity != 0)
        {
            if (velocity > max)
            {
                velocity = max;
            }
            else if (velocity < -max)
            {
                velocity = -max;
            }
        }

        return velocity;

    },

    preUpdate: function () {

        //  Clear the tree
        this.quadTree.clear();

    	//	Create our tree which all of the Physics bodies will add themselves to
        this.quadTreeID = 0;
    	this.quadTree = new Phaser.QuadTree(this, this.game.world.bounds.x, this.game.world.bounds.y, this.game.world.bounds.width, this.game.world.bounds.height, this.maxObjects, this.maxLevels);

    },

    postUpdate: function () {

    	//	Clear the tree ready for the next update
    	this.quadTree.clear();

    },

    /**
    * Checks for collision between two game objects. The objects can be Sprites, Groups, Emitters or Tilemaps.
    * You can perform Sprite vs. Sprite, Sprite vs. Group, Group vs. Group, Sprite vs. Tilemap or Group vs. Tilemap collisions.
    *
    * @param object1 The first object to check. Can be an instance of Phaser.Sprite, Phaser.Group, Phaser.Particles.Emitter, or Phaser.Tilemap
    * @param object2 The second object to check. Can be an instance of Phaser.Sprite, Phaser.Group, Phaser.Particles.Emitter or Phaser.Tilemap
    * @param collideCallback An optional callback function that is called if the objects overlap. The two objects will be passed to this function in the same order in which you passed them to Collision.overlap.
    * @param processCallback A callback function that lets you perform additional checks against the two objects if they overlap. If this is set then collideCallback will only be called if processCallback returns true.
    * @param callbackContext The context in which to run the callbacks.
    * @returns {boolean} true if any collisions were detected, otherwise false.
    **/
    collide: function (object1, object2, collideCallback, processCallback, callbackContext) {

        collideCallback = collideCallback || null;
        processCallback = processCallback || null;
        callbackContext = callbackContext || collideCallback;

        this._result = false;
        this._total = 0;

        //  Only collide valid objects
        if (object1 && object2 && object1.exists && object2.exists)
        {
            //  Can expand to support Buttons, Text, etc at a later date. For now these are the essentials.

            //  SPRITES
            if (object1.type == Phaser.SPRITE)
            {
                if (object2.type == Phaser.SPRITE)
                {
                    this.collideSpriteVsSprite(object1, object2, collideCallback, processCallback, callbackContext);
                }
                else if (object2.type == Phaser.GROUP || object2.type == Phaser.EMITTER)
                {
                    this.collideSpriteVsGroup(object1, object2, collideCallback, processCallback, callbackContext);
                }
                else if (object2.type == Phaser.TILEMAP)
                {
                    this.collideSpriteVsTilemap(object1, object2, collideCallback, processCallback, callbackContext);
                }
            }
            //  GROUPS
            else if (object1.type == Phaser.GROUP)
            {
                if (object2.type == Phaser.SPRITE)
                {
                    this.collideSpriteVsGroup(object2, object1, collideCallback, processCallback, callbackContext);
                }
                else if (object2.type == Phaser.GROUP || object2.type == Phaser.EMITTER)
                {
                    this.collideGroupVsGroup(object1, object2, collideCallback, processCallback, callbackContext);
                }
                else if (object2.type == Phaser.TILEMAP)
                {
                    this.collideGroupVsTilemap(object1, object2, collideCallback, processCallback, callbackContext);
                }
            }
            //  TILEMAPS
            else if (object1.type == Phaser.TILEMAP)
            {
                if (object2.type == Phaser.SPRITE)
                {
                    this.collideSpriteVsTilemap(object2, object1, collideCallback, processCallback, callbackContext);
                }
                else if (object2.type == Phaser.GROUP || object2.type == Phaser.EMITTER)
                {
                    this.collideGroupVsTilemap(object2, object1, collideCallback, processCallback, callbackContext);
                }
            }
            //  EMITTER
            else if (object1.type == Phaser.EMITTER)
            {
                if (object2.type == Phaser.SPRITE)
                {
                    this.collideSpriteVsGroup(object2, object1, collideCallback, processCallback, callbackContext);
                }
                else if (object2.type == Phaser.GROUP || object2.type == Phaser.EMITTER)
                {
                    this.collideGroupVsGroup(object1, object2, collideCallback, processCallback, callbackContext);
                }
                else if (object2.type == Phaser.TILEMAP)
                {
                    this.collideGroupVsTilemap(object1, object2, collideCallback, processCallback, callbackContext);
                }
            }
        }

        return (this._total > 0);

    },

    collideSpriteVsSprite: function (sprite1, sprite2, collideCallback, processCallback, callbackContext) {

        this.separate(sprite1.body, sprite2.body);

        if (this._result)
        {
            //  They collided, is there a custom process callback?
            if (processCallback)
            {
                if (processCallback.call(callbackContext, sprite1, sprite2))
                {
                    this._total++;

                    if (collideCallback)
                    {
                        collideCallback.call(callbackContext, sprite1, sprite2);
                    }
                }
            }
            else
            {
                this._total++;

                if (collideCallback)
                {
                    collideCallback.call(callbackContext, sprite1, sprite2);
                }
            }
        }

    },

    collideGroupVsTilemap: function (group, tilemap, collideCallback, processCallback, callbackContext) {

        if (group.length == 0)
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
                    this.collideSpriteVsTilemap(currentNode, tilemap, collideCallback, processCallback, callbackContext);
                }
                currentNode = currentNode._iNext;
            }
            while (currentNode != group._container.last._iNext);
        }

    },

    collideSpriteVsTilemap: function (sprite, tilemap, collideCallback, processCallback, callbackContext) {

        this._mapData = tilemap.collisionLayer.getTileOverlaps(sprite);

        //  If the sprite actually collided with the tilemap then _mapData contains an array of the tiles it collided with
        var i = this._mapData.length;

        while (i--)
        {
            if (processCallback)
            {
                //  We've got a custom process callback to hit first
                if (processCallback.call(callbackContext, sprite, this._mapData[i].tile))
                {
                    this._total++;

                    if (collideCallback)
                    {
                        collideCallback.call(callbackContext, sprite, this._mapData[i].tile);
                    }
                }
            }
            else
            {
                this._total++;

                if (collideCallback)
                {
                    collideCallback.call(callbackContext, sprite, this._mapData[i].tile);
                }
            }
        }

    },

    collideSpriteVsGroup: function (sprite, group, collideCallback, processCallback, callbackContext) {

        if (group.length == 0)
        {
            return;
        }

        //  What is the sprite colliding with in the quadtree?
        this._potentials = this.quadTree.retrieve(sprite);

        for (var i = 0, len = this._potentials.length; i < len; i++)
        {
            //  We have our potential suspects, are they in this group?
            if (this._potentials[i].sprite.group == group)
            {
                this.separate(sprite.body, this._potentials[i]);

                if (this._result && processCallback)
                {
                    this._result = processCallback.call(callbackContext, sprite, this._potentials[i].sprite);
                }

                if (this._result)
                {
                    this._total++;

                    if (collideCallback)
                    {
                        collideCallback.call(callbackContext, sprite, this._potentials[i].sprite);
                    }
                }
            }
        }

    },

    collideGroupVsGroup: function (group1, group2, collideCallback, processCallback, callbackContext) {

        if (group1.length == 0 || group2.length == 0)
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
                    this.collideSpriteVsGroup(currentNode, group2, collideCallback, processCallback, callbackContext);
                }
                currentNode = currentNode._iNext;
            }
            while (currentNode != group1._container.last._iNext);
        }

    },

	 /**
     * The core separation function to separate two physics bodies.
     * @param body1 The first Sprite.Body to separate
     * @param body2 The second Sprite.Body to separate
     * @returns {boolean} Returns true if the bodies were separated, otherwise false.
     */
    separate: function (body1, body2) {

        this._result = (this.separateX(body1, body2) || this.separateY(body1, body2));

    },

    /**
     * Separates the two physics bodies on their X axis
     * @param body1 The first Sprite.Body to separate
     * @param body2 The second Sprite.Body to separate
     * @returns {boolean} Whether the objects in fact touched and were separated along the X axis.
     */
    separateX: function (body1, body2) {

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

            if (body1.deltaX() == 0 && body2.deltaX() == 0)
            {
                //  They overlap but neither of them are moving
                body1.embedded = true;
                body2.embedded = true;
            }
            else if (body1.deltaX() > body2.deltaX())
            {
                //  Body1 is moving right and/or Body2 is moving left
                this._overlap = body1.x + body1.width - body2.x;

                if ((this._overlap > this._maxOverlap) || body1.allowCollision.right == false || body2.allowCollision.left == false)
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

                if ((-this._overlap > this._maxOverlap) || body1.allowCollision.left == false || body2.allowCollision.right == false)
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
            if (this._overlap != 0)
            {
                body1.overlapX = this._overlap;
                body2.overlapX = this._overlap;

                if (body1.customSeparateX || body2.customSeparateX)
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
     * Separates the two physics bodies on their Y axis
     * @param body1 The first Sprite.Body to separate
     * @param body2 The second Sprite.Body to separate
     * @returns {boolean} Whether the bodys in fact touched and were separated along the Y axis.
     */
    separateY: function (body1, body2) {

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

            if (body1.deltaY() == 0 && body2.deltaY() == 0)
            {
                //  They overlap but neither of them are moving
                body1.embedded = true;
                body2.embedded = true;
            }
            else if (body1.deltaY() > body2.deltaY())
            {
                //  Body1 is moving down and/or Body2 is moving up
                this._overlap = body1.y + body1.height - body2.y;

                if ((this._overlap > this._maxOverlap) || body1.allowCollision.down == false || body2.allowCollision.up == false)
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

                if ((-this._overlap > this._maxOverlap) || body1.allowCollision.up == false || body2.allowCollision.down == false)
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
            if (this._overlap != 0)
            {
                body1.overlapY = this._overlap;
                body2.overlapY = this._overlap;

                if (body1.customSeparateY || body2.customSeparateY)
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
                    if (body2.active && body2.moves && (body1.deltaY() > body2.deltaY()))
                    {
                        body1.x += body2.x - body2.lastX;
                    }
                }
                else if (!body2.immovable)
                {
                    body2.y += this._overlap;
                    body2.velocity.y = this._velocity1 - this._velocity2 * body2.bounce.y;

                    //  This is special case code that handles things like horizontal moving platforms you can ride
                    if (body1.sprite.active && body1.moves && (body1.deltaY() < body2.deltaY()))
                    {
                        body2.x += body1.x - body1.lastX;
                    }
                }

                return true;
            }

        }

        return false;

    },

     /**
     * The core Collision separation function used by Collision.overlap.
     * @param object1 The first GameObject to separate
     * @param object2 The second GameObject to separate
     * @returns {boolean} Returns true if the objects were separated, otherwise false.
     */
    separateTile: function (object, x, y, width, height, mass, collideLeft, collideRight, collideUp, collideDown, separateX, separateY) {

        var separatedX = this.separateTileX(object.body, x, y, width, height, mass, collideLeft, collideRight, separateX);
        var separatedY = this.separateTileY(object.body, x, y, width, height, mass, collideUp, collideDown, separateY);

        if (separatedX || separatedY)
        {
            return true;
        }

        return false;

    },

    /**
     * Separates the two objects on their x axis
     * @param object The GameObject to separate
     * @param tile The Tile to separate
     * @returns {boolean} Whether the objects in fact touched and were separated along the X axis.
     */
    OLDseparateTileX: function (object, x, y, width, height, mass, collideLeft, collideRight, separate) {

        //  Can't separate two immovable objects (tiles are always immovable)
        if (object.immovable)
        {
            return false;
        }

        //  First, get the object delta
        this._overlap = 0;

        // console.log('separatedX', x, y, object.deltaX());

        if (object.deltaX() != 0)
        {
            this._bounds1.setTo(object.x, object.y, object.width, object.height);

            if ((this._bounds1.right > x) && (this._bounds1.x < x + width) && (this._bounds1.bottom > y) && (this._bounds1.y < y + height))
            {
                //  The hulls overlap, let's process it
                this._maxOverlap = object.deltaAbsX() + this.OVERLAP_BIAS;

                //  TODO - We need to check if we're already inside of the tile, i.e. jumping through an n-way tile
                //  in which case we didn't ought to separate because it'll look like tunneling

                if (object.deltaX() > 0)
                {
                    //  Going right ...
                    this._overlap = object.x + object.width - x;

                    if ((this._overlap > this._maxOverlap) || !object.allowCollision.right || !collideLeft)
                    {
                        this._overlap = 0;
                    }
                    else
                    {
                        object.touching.right = true;
                    }
                }
                else if (object.deltaX() < 0)
                {
                    //  Going left ...
                    this._overlap = object.x - width - x;

                    if ((-this._overlap > this._maxOverlap) || !object.allowCollision.left || !collideRight)
                    {
                        this._overlap = 0;
                    }
                    else
                    {
                        object.touching.left = true;
                    }
                }
            }
        }

        //  Then adjust their positions and velocities accordingly (if there was any overlap)
        if (this._overlap != 0)
        {
            if (separate)
            {
                object.x = object.x - this._overlap;

                if (object.bounce.x == 0)
                {
                    object.velocity.x = 0;
                }
                else
                {
                    object.velocity.x = -object.velocity.x * object.bounce.x;
                }
            }
            return true;
        }
        else
        {
            return false;
        }

    },

    /**
     * Separates the two objects on their x axis
     * @param object The GameObject to separate
     * @param tile The Tile to separate
     * @returns {boolean} Whether the objects in fact touched and were separated along the X axis.
     */
    OLDseparateTileY: function (object, x, y, width, height, mass, collideUp, collideDown, separate) {

        //  Can't separate two immovable objects (tiles are always immovable)
        if (object.immovable)
        {
            return false;
        }

        //  First, get the object delta
        this._overlap = 0;

        if (object.deltaY() != 0)
        {
            this._bounds1.setTo(object.x, object.y, object.width, object.height);

            if ((this._bounds1.right > x) && (this._bounds1.x < x + width) && (this._bounds1.bottom > y) && (this._bounds1.y < y + height))
            {
                //  The hulls overlap, let's process it

                //  Not currently used, may need it so keep for now
                this._maxOverlap = object.deltaAbsY() + this.OVERLAP_BIAS;

                //  TODO - We need to check if we're already inside of the tile, i.e. jumping through an n-way tile
                //  in which case we didn't ought to separate because it'll look like tunneling

                if (object.deltaY() > 0)
                {
                    //  Going down ...
                    this._overlap = object.bottom - y;

                    // if (object.allowCollision.down && collideDown && this._overlap < this._maxOverlap)
                    if ((this._overlap > this._maxOverlap) || !object.allowCollision.down || !collideDown)
                    {
                        this._overlap = 0;
                    }
                    else
                    {
                        object.touching.down = true;
                    }
                }
                else
                {
                    //  Going up ...
                    this._overlap = object.y - height - y;

                    if ((-this._overlap > this._maxOverlap) || !object.allowCollision.up || !collideUp)
                    {
                        this._overlap = 0;
                    }
                    else
                    {
                        object.touching.up = true;
                    }
                }
            }
        }

        //  Then adjust their positions and velocities accordingly (if there was any overlap)
        if (this._overlap != 0)
        {
            if (separate)
            {
                object.y = object.y - this._overlap;

                if (object.bounce.y == 0)
                {
                    object.velocity.y = 0;
                }
                else
                {
                    object.velocity.y = -object.velocity.y * object.bounce.y;
                }
            }
            return true;
        }
        else
        {
            return false;
        }

    },    

    /**
     * Separates the two objects on their x axis
     * @param object The GameObject to separate
     * @param tile The Tile to separate
     * @returns {boolean} Whether the objects in fact touched and were separated along the X axis.
     */
    separateTileX: function (object, x, y, width, height, mass, collideLeft, collideRight, separate) {

        //  Can't separate two immovable objects (tiles are always immovable)
        if (object.immovable)
        {
            return false;
        }

        this._overlap = 0;

        //  Do we have any overlap at all?
        if (Phaser.Rectangle.intersectsRaw(object, x, x + width, y, y + height))
        {
            this._maxOverlap = object.deltaAbsX() + this.OVERLAP_BIAS;

            if (object.deltaX() == 0)
            {
                //  Object is either stuck inside the tile or only overlapping on the Y axis
            }
            else if (object.deltaX() > 0)
            {
                //  Going right ...


                
                this._overlap = object.x + object.width - x;

                if ((this._overlap > this._maxOverlap) || !object.allowCollision.right || !collideLeft)
                {
                    this._overlap = 0;
                }
                else
                {
                    object.touching.right = true;
                }
            }
            else if (object.deltaX() < 0)
            {
                //  Going left ...
                this._overlap = object.x - width - x;

                if ((-this._overlap > this._maxOverlap) || !object.allowCollision.left || !collideRight)
                {
                    this._overlap = 0;
                }
                else
                {
                    object.touching.left = true;
                }
            }

            if (this._overlap != 0)
            {
                if (separate)
                {
                    console.log('x over', this._overlap);
                    object.x = object.x - this._overlap;

                    if (object.bounce.x == 0)
                    {
                        object.velocity.x = 0;
                    }
                    else
                    {
                        object.velocity.x = -object.velocity.x * object.bounce.x;
                    }
                }
                return true;
            }

        }

        return false;

    },

    /**
     * Separates the two objects on their x axis
     * @param object The GameObject to separate
     * @param tile The Tile to separate
     * @returns {boolean} Whether the objects in fact touched and were separated along the X axis.
     */
    separateTileY: function (object, x, y, width, height, mass, collideUp, collideDown, separate) {

        //  Can't separate two immovable objects (tiles are always immovable)
        if (object.immovable)
        {
            return false;
        }

        this._overlap = 0;

        if (Phaser.Rectangle.intersectsRaw(object, x, x + width, y, y + height))
        {
            this._maxOverlap = object.deltaAbsY() + this.OVERLAP_BIAS;

            if (object.deltaY() == 0)
            {
                //  Object is stuck inside a tile and not moving
            }
            else if (object.deltaY() > 0)
            {
                //  Going down ...
                this._overlap = object.bottom - y;

                // if (object.allowCollision.down && collideDown && this._overlap < this._maxOverlap)
                if ((this._overlap > this._maxOverlap) || !object.allowCollision.down || !collideDown)
                {
                    this._overlap = 0;
                }
                else
                {
                    object.touching.down = true;
                }
            }
            else if (object.deltaY() < 0)
            {
                //  Going up ...
                this._overlap = object.y - height - y;

                if ((-this._overlap > this._maxOverlap) || !object.allowCollision.up || !collideUp)
                {
                    this._overlap = 0;
                }
                else
                {
                    object.touching.up = true;
                }
            }

            if (this._overlap != 0)
            {
                console.log('y over', this._overlap);

                if (separate)
                {
                    object.y = object.y - this._overlap;

                    if (object.bounce.y == 0)
                    {
                        object.velocity.y = 0;
                    }
                    else
                    {
                        object.velocity.y = -object.velocity.y * object.bounce.y;
                    }
                }
                return true;
            }
        }
        
        return false;

    },

    /**
    * Given the angle and speed calculate the velocity and return it as a Point
    * 
    * @param    angle   The angle (in degrees) calculated in clockwise positive direction (down = 90 degrees positive, right = 0 degrees positive, up = 90 degrees negative)
    * @param    speed   The speed it will move, in pixels per second sq
    * 
    * @return   A Point where Point.x contains the velocity x value and Point.y contains the velocity y value
    */
    velocityFromAngle: function (angle, speed, point) {

        speed = speed || 0;
        point = point || new Phaser.Point;

        var a = this.game.math.degToRad(angle);

        return point.setTo((Math.cos(a) * speed), (Math.sin(a) * speed));

    },

    /**
     * Sets the source Sprite x/y velocity so it will move directly towards the destination Sprite at the speed given (in pixels per second)<br>
     * If you specify a maxTime then it will adjust the speed (over-writing what you set) so it arrives at the destination in that number of seconds.<br>
     * Timings are approximate due to the way Flash timers work, and irrespective of SWF frame rate. Allow for a variance of +- 50ms.<br>
     * The source object doesn't stop moving automatically should it ever reach the destination coordinates.<br>
     * If you need the object to accelerate, see accelerateTowardsObject() instead
     * Note: Doesn't take into account acceleration, maxVelocity or drag (if you set drag or acceleration too high this object may not move at all)
     * 
     * @param   source      The Sprite on which the velocity will be set
     * @param   dest        The Sprite where the source object will move to
     * @param   speed       The speed it will move, in pixels per second (default is 60 pixels/sec)
     * @param   maxTime     Time given in milliseconds (1000 = 1 sec). If set the speed is adjusted so the source will arrive at destination in the given number of ms
     */
    moveTowardsObject: function (source, dest, speed, maxTime) {

        speed = speed || 60;
        maxTime = maxTime || 0;

        var a = this.angleBetween(source, dest);
        
        if (maxTime > 0)
        {
            var d = this.distanceBetween(source, dest);
            
            //  We know how many pixels we need to move, but how fast?
            speed = d / (maxTime / 1000);
        }
        
        source.body.velocity.x = Math.cos(a) * speed;
        source.body.velocity.y = Math.sin(a) * speed;

    },

    /**
     * Sets the x/y acceleration on the source Sprite so it will move towards the destination Sprite at the speed given (in pixels per second)<br>
     * You must give a maximum speed value, beyond which the Sprite won't go any faster.<br>
     * If you don't need acceleration look at moveTowardsObject() instead.
     * 
     * @param   source          The Sprite on which the acceleration will be set
     * @param   dest            The Sprite where the source object will move towards
     * @param   speed           The speed it will accelerate in pixels per second
     * @param   xSpeedMax       The maximum speed in pixels per second in which the sprite can move horizontally
     * @param   ySpeedMax       The maximum speed in pixels per second in which the sprite can move vertically
     */
    accelerateTowardsObject: function (source, dest, speed, xSpeedMax, ySpeedMax) {

        xSpeedMax = xSpeedMax || 1000;
        ySpeedMax = ySpeedMax || 1000;

        var a = this.angleBetween(source, dest);
        
        source.body.velocity.x = 0;
        source.body.velocity.y = 0;
        
        source.body.acceleration.x = Math.cos(a) * speed;
        source.body.acceleration.y = Math.sin(a) * speed;
        
        source.body.maxVelocity.x = xSpeedMax;
        source.body.maxVelocity.y = ySpeedMax;

    },

    /**
     * Move the given Sprite towards the mouse pointer coordinates at a steady velocity
     * If you specify a maxTime then it will adjust the speed (over-writing what you set) so it arrives at the destination in that number of seconds.<br>
     * Timings are approximate due to the way Flash timers work, and irrespective of SWF frame rate. Allow for a variance of +- 50ms.<br>
     * The source object doesn't stop moving automatically should it ever reach the destination coordinates.<br>
     * 
     * @param   source      The Sprite to move
     * @param   speed       The speed it will move, in pixels per second (default is 60 pixels/sec)
     * @param   maxTime     Time given in milliseconds (1000 = 1 sec). If set the speed is adjusted so the source will arrive at destination in the given number of ms
     */
    moveTowardsMouse: function (source, speed, maxTime) {

        speed = speed || 60;
        maxTime = maxTime || 0;

        var a = this.angleBetweenMouse(source);
        
        if (maxTime > 0)
        {
            var d = this.distanceToMouse(source);
            
            //  We know how many pixels we need to move, but how fast?
            speed = d / (maxTime / 1000);
        }
        
        source.body.velocity.x = Math.cos(a) * speed;
        source.body.velocity.y = Math.sin(a) * speed;

    },

    /**
     * Sets the x/y acceleration on the source Sprite so it will move towards the mouse coordinates at the speed given (in pixels per second)<br>
     * You must give a maximum speed value, beyond which the Sprite won't go any faster.<br>
     * If you don't need acceleration look at moveTowardsMouse() instead.
     * 
     * @param   source          The Sprite on which the acceleration will be set
     * @param   speed           The speed it will accelerate in pixels per second
     * @param   xSpeedMax       The maximum speed in pixels per second in which the sprite can move horizontally
     * @param   ySpeedMax       The maximum speed in pixels per second in which the sprite can move vertically
     */
    accelerateTowardsMouse: function (source, speed, xSpeedMax, ySpeedMax) {

        xSpeedMax = xSpeedMax || 1000;
        ySpeedMax = ySpeedMax || 1000;

        var a = this.angleBetweenMouse(source);
        
        source.body.velocity.x = 0;
        source.body.velocity.y = 0;
        
        source.body.acceleration.x = Math.cos(a) * speed;
        source.body.acceleration.y = Math.sin(a) * speed;
        
        source.body.maxVelocity.x = xSpeedMax;
        source.body.maxVelocity.y = ySpeedMax;

    },

    /**
     * Sets the x/y velocity on the source Sprite so it will move towards the target coordinates at the speed given (in pixels per second)<br>
     * If you specify a maxTime then it will adjust the speed (over-writing what you set) so it arrives at the destination in that number of seconds.<br>
     * Timings are approximate due to the way Flash timers work, and irrespective of SWF frame rate. Allow for a variance of +- 50ms.<br>
     * The source object doesn't stop moving automatically should it ever reach the destination coordinates.<br>
     * 
     * @param   source      The Sprite to move
     * @param   target      The Point coordinates to move the source Sprite towards
     * @param   speed       The speed it will move, in pixels per second (default is 60 pixels/sec)
     * @param   maxTime     Time given in milliseconds (1000 = 1 sec). If set the speed is adjusted so the source will arrive at destination in the given number of ms
     */
    moveTowardsPoint: function (source, target, speed, maxTime) {

        speed = speed || 60;
        maxTime = maxTime || 0;

        var a = this.angleBetweenPoint(source, target);
        
        if (maxTime > 0)
        {
            var d = this.distanceToPoint(source, target);
            
            //  We know how many pixels we need to move, but how fast?
            speed = d / (maxTime / 1000);
        }
        
        source.body.velocity.x = Math.cos(a) * speed;
        source.body.velocity.y = Math.sin(a) * speed;

    },

    /**
     * Sets the x/y acceleration on the source Sprite so it will move towards the target coordinates at the speed given (in pixels per second)<br>
     * You must give a maximum speed value, beyond which the Sprite won't go any faster.<br>
     * If you don't need acceleration look at moveTowardsPoint() instead.
     * 
     * @param   source          The Sprite on which the acceleration will be set
     * @param   target          The Point coordinates to move the source Sprite towards
     * @param   speed           The speed it will accelerate in pixels per second
     * @param   xSpeedMax       The maximum speed in pixels per second in which the sprite can move horizontally
     * @param   ySpeedMax       The maximum speed in pixels per second in which the sprite can move vertically
     */
    accelerateTowardsPoint: function (source, target, speed, xSpeedMax, ySpeedMax) {

        xSpeedMax = xSpeedMax || 1000;
        ySpeedMax = ySpeedMax || 1000;

        var a = this.angleBetweenPoint(source, target);
        
        source.body.velocity.x = 0;
        source.body.velocity.y = 0;
        
        source.body.acceleration.x = Math.cos(a) * speed;
        source.body.acceleration.y = Math.sin(a) * speed;
        
        source.body.maxVelocity.x = xSpeedMax;
        source.body.maxVelocity.y = ySpeedMax;

    },

    /**
     * Find the distance (in pixels, rounded) between two Sprites, taking their origin into account
     * 
     * @param   a   The first Sprite
     * @param   b   The second Sprite
     * @return  int Distance (in pixels)
     */
    distanceBetween: function (a, b) {

        var dx = a.center.x - b.center.x;
        var dy = a.center.y - b.center.y;
        
        return Math.sqrt(dx * dx + dy * dy);

    },

    /**
     * Find the distance (in pixels, rounded) from an Sprite to the given Point, taking the source origin into account
     * 
     * @param   a       The Sprite
     * @param   target  The Point
     * @return  int     Distance (in pixels)
     */
    distanceToPoint: function (a, target) {

        var dx = a.center.x - target.x;
        var dy = a.center.y - target.y;
        
        return Math.sqrt(dx * dx + dy * dy);

    },

    /**
     * Find the distance (in pixels, rounded) from the object x/y and the mouse x/y
     * 
     * @param   a   The Sprite to test against
     * @return  int The distance between the given sprite and the mouse coordinates
     */
    distanceToMouse: function (a) {

        var dx = a.center.x - this.game.input.x;
        var dy = a.center.y - this.game.input.y;
        
        return Math.sqrt(dx * dx + dy * dy);

    },

    /**
     * Find the angle (in radians) between an Sprite and an Point. The source sprite takes its x/y and origin into account.
     * The angle is calculated in clockwise positive direction (down = 90 degrees positive, right = 0 degrees positive, up = 90 degrees negative)
     * 
     * @param   a           The Sprite to test from
     * @param   target      The Point to angle the Sprite towards
     * @param   asDegrees   If you need the value in degrees instead of radians, set to true
     * 
     * @return  Number The angle (in radians unless asDegrees is true)
     */
    angleBetweenPoint: function (a, target, asDegrees) {

        asDegrees = asDegrees || false;

        var dx = target.x - a.center.x;
        var dy = target.y - a.center.y;
        
        if (asDegrees)
        {
            return this.game.math.radToDeg(Math.atan2(dy, dx));
        }
        else
        {
            return Math.atan2(dy, dx);
        }

    },

    /**
     * Find the angle (in radians) between the two Sprite, taking their x/y and origin into account.
     * The angle is calculated in clockwise positive direction (down = 90 degrees positive, right = 0 degrees positive, up = 90 degrees negative)
     * 
     * @param   a           The Sprite to test from
     * @param   b           The Sprite to test to
     * @param   asDegrees   If you need the value in degrees instead of radians, set to true
     * 
     * @return  Number The angle (in radians unless asDegrees is true)
     */
    angleBetween: function (a, b, asDegrees) {

        asDegrees = asDegrees || false;

        var dx = b.center.x - a.center.x;
        var dy = b.center.y - a.center.y;
        
        if (asDegrees)
        {
            return this.game.math.radToDeg(Math.atan2(dy, dx));
        }
        else
        {
            return Math.atan2(dy, dx);
        }

    },

    /**
     * Given the GameObject and speed calculate the velocity and return it as an Point based on the direction the sprite is facing
     * 
     * @param   parent  The Sprite to get the facing value from
     * @param   speed   The speed it will move, in pixels per second sq
     * 
     * @return  An Point where Point.x contains the velocity x value and Point.y contains the velocity y value
     */
    velocityFromFacing: function (parent, speed) {

        /*
        var a;
        
        if (parent.facing == Collision.LEFT)
        {
            a = this._game.math.degreesToRadians(180);
        }
        else if (parent.facing == Collision.RIGHT)
        {
            a = this._game.math.degreesToRadians(0);
        }
        else if (parent.facing == Collision.UP)
        {
            a = this._game.math.degreesToRadians(-90);
        }
        else if (parent.facing == Collision.DOWN)
        {
            a = this._game.math.degreesToRadians(90);
        }
        
        return new Point(Math.cos(a) * speed, Math.sin(a) * speed);
        */

    },
    
    /**
     * Find the angle (in radians) between an Sprite and the mouse, taking their x/y and origin into account.
     * The angle is calculated in clockwise positive direction (down = 90 degrees positive, right = 0 degrees positive, up = 90 degrees negative)
     * 
     * @param   a           The Object to test from
     * @param   asDegrees   If you need the value in degrees instead of radians, set to true
     * 
     * @return  Number The angle (in radians unless asDegrees is true)
     */
    angleBetweenMouse: function (a, asDegrees) {

        asDegrees = asDegrees || false;

        var dx = this.game.input.x - a.bounds.x;
        var dy = this.game.input.y - a.bounds.y;
        
        if (asDegrees)
        {
            return this.game.math.radToDeg(Math.atan2(dy, dx));
        }
        else
        {
            return Math.atan2(dy, dx);
        }
    }

};
