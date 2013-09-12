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

	//	avoid gc spikes by caching these values for re-use
	this._obj1Bounds = new Phaser.Rectangle;
	this._obj2Bounds = new Phaser.Rectangle;
	this._overlap = 0;
	this._maxOverlap = 0;
	this._obj1Velocity = 0;
	this._obj2Velocity = 0;
	this._obj1NewVelocity = 0;
	this._obj2NewVelocity = 0;
	this._average = 0;

};

Phaser.Physics.Arcade.prototype = {

    updateMotion: function (body) {

    	//	Rotation
        this._velocityDelta = (this.computeVelocity(0, false, body.angularVelocity, body.angularAcceleration, body.angularDrag, body.maxAngular) - body.angularVelocity) / 2;
        body.angularVelocity += this._velocityDelta;
        body.rotation += body.angularVelocity * this.game.time.physicsElapsed;

    	//	Horizontal
        this._velocityDelta = (this.computeVelocity(1, body, body.velocity.x, body.acceleration.x, body.drag.x) - body.velocity.x) / 2;
        body.velocity.x += this._velocityDelta;
	    this._delta = body.velocity.x * this.game.time.physicsElapsed;
        body.x += this._delta;

    	//	Vertical
        this._velocityDelta = (this.computeVelocity(2, body, body.velocity.y, body.acceleration.y, body.drag.y) - body.velocity.y) / 2;
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

    //  Collides the given object with everything in the world quadtree
    collide: function (object, notifyCallback, callbackContext) {

        return this.overlap(object, null, notifyCallback, this.separate, callbackContext);

    },

    collideGroup: function (group, notifyCallback, callbackContext) {

        notifyCallback = notifyCallback || null;
        callbackContext = callbackContext || notifyCallback;

        for (var g = 0, len = group.length; g < len; g++)
        {
            for (var i = 0, gi = group.length; i < gi; i++)
            {
                if (this.separate(group[g].body, group[i].body))
                {
                    if (notifyCallback)
                    {
                        notifyCallback.call(callbackContext, group[g], group[i].sprite);
                    }
                }
            }
        }

    },

    /**
    * Checks for overlaps between two objects using the world QuadTree. Can be GameObject vs. GameObject, GameObject vs. Group or Group vs. Group.
    * Note: Does not take the objects scrollFactor into account. All overlaps are check in world space.
    * @param object1 The first GameObject or Group to check. If null the world.group is used.
    * @param object2 The second GameObject or Group to check.
    * @param notifyCallback A callback function that is called if the objects overlap. The two objects will be passed to this function in the same order in which you passed them to Collision.overlap.
    * @param processCallback A callback function that lets you perform additional checks against the two objects if they overlap. If this is set then notifyCallback will only be called if processCallback returns true.
    * @returns {boolean} true if the objects overlap, otherwise false.
    */
    overlap: function (object1, object2, notifyCallback, processCallback, callbackContext) {

        object1 = object1 || null;
        object2 = object2 || null;
        notifyCallback = notifyCallback || null;
        processCallback = processCallback || this.separate;
        callbackContext = callbackContext || this;

        //  World vs. World check
        if (object1 == null)
        {
            //  Scan the entire display list, comparing every object! (ouch)
            if (this.game.world._container.first._iNext)
            {
                var currentNode = this.game.world._container.first._iNext;
                    
                do  
                {
                    if (checkExists == false || (checkExists && currentNode.exists))
                    {
                        callback.call(callbackContext, currentNode);
                    }

                    currentNode = currentNode._iNext;
                }
                while (currentNode != this.game.world._container.last._iNext);
            }
        }



        //  Get the ships top-most ID. If the length of that ID is 1 then we can ignore every other result, 
        //  it's simply not colliding with anything :)
        var potentials = this.quadTree.retrieve(object1);
        var output = [];

        for (var i = 0, len = potentials.length; i < len; i++)
        {
            if (processCallback.call(callbackContext, object1.body, potentials[i]))
            {
                if (notifyCallback)
                {
                    notifyCallback.call(callbackContext, object1, potentials[i].sprite);
                }

                output.push(potentials[i]);
            }
        }

        return (output.length);

    },

	 /**
     * The core Collision separation function used by Collision.overlap.
     * @param object1 The first GameObject to separate
     * @param object2 The second GameObject to separate
     * @returns {boolean} Returns true if the objects were separated, otherwise false.
     */
    separate: function (object1, object2) {

        return this.separateX(object1, object2) || this.separateY(object1, object2)

    },

    /**
     * Separates the two objects on their x axis
     * @param object1 The first GameObject to separate
     * @param object2 The second GameObject to separate
     * @returns {boolean} Whether the objects in fact touched and were separated along the X axis.
     */
    separateX: function (object1, object2) {

        //  Can't separate two immovable objects
        if (object1.immovable && object2.immovable)
        {
            return false;
        }

        //  First, get the two object deltas
        this._overlap = 0;

        if (object1.deltaX() != object2.deltaX())
        {
            //  Check if the X hulls actually overlap

            this._obj1Bounds.setTo(object1.x - ((object1.deltaX() > 0) ? object1.deltaX() : 0), object1.lastY, object1.width + ((object1.deltaX() > 0) ? object1.deltaX() : -object1.deltaX()), object1.height);
            this._obj2Bounds.setTo(object2.x - ((object2.deltaX() > 0) ? object2.deltaX() : 0), object2.lastY, object2.width + ((object2.deltaX() > 0) ? object2.deltaX() : -object2.deltaX()), object2.height);

            if ((this._obj1Bounds.right > this._obj2Bounds.x) && (this._obj1Bounds.x < this._obj2Bounds.right) && (this._obj1Bounds.bottom > this._obj2Bounds.y) && (this._obj1Bounds.y < this._obj2Bounds.bottom))
            {
                this._maxOverlap = object1.deltaAbsX() + object2.deltaAbsX() + this.OVERLAP_BIAS;

                //  If they did overlap (and can), figure out by how much and flip the corresponding flags
                if (object1.deltaX() > object2.deltaX())
                {
                    this._overlap = object1.x + object1.width - object2.x;

                    if ((this._overlap > this._maxOverlap) || object1.allowCollision.right == false || object2.allowCollision.left == false)
                    {
                        this._overlap = 0;
                    }
                    else
                    {
                        object1.touching.right = true;
                        object2.touching.left = true;
                    }
                }
                else if (object1.deltaX() < object2.deltaX())
                {
                    this._overlap = object1.x - object2.width - object2.x;

                    if ((-this._overlap > this._maxOverlap) || object1.allowCollision.left == false || object2.allowCollision.right == false)
                    {
                        this._overlap = 0;
                    }
                    else
                    {
                        object1.touching.left = true;
                        object2.touching.right = true;
                    }
                }
            }
        }

        //  Then adjust their positions and velocities accordingly (if there was any overlap)
        if (this._overlap != 0)
        {
            this._obj1Velocity = object1.velocity.x;
            this._obj2Velocity = object2.velocity.x;

            if (!object1.immovable && !object2.immovable)
            {
                this._overlap *= 0.5;
                object1.x = object1.x - this._overlap;
                object2.x += this._overlap;

                this._obj1NewVelocity = Math.sqrt((this._obj2Velocity * this._obj2Velocity * object2.mass) / object1.mass) * ((this._obj2Velocity > 0) ? 1 : -1);
                this._obj2NewVelocity = Math.sqrt((this._obj1Velocity * this._obj1Velocity * object1.mass) / object2.mass) * ((this._obj1Velocity > 0) ? 1 : -1);
                this._average = (this._obj1NewVelocity + this._obj2NewVelocity) * 0.5;
                this._obj1NewVelocity -= this._average;
                this._obj2NewVelocity -= this._average;
                object1.velocity.x = this._average + this._obj1NewVelocity * object1.bounce.x;
                object2.velocity.x = this._average + this._obj2NewVelocity * object2.bounce.x;
            }
            else if (!object1.immovable)
            {
                object1.x = object1.x - this._overlap;
                object1.velocity.x = this._obj2Velocity - this._obj1Velocity * object1.bounce.x;
            }
            else if (!object2.immovable)
            {
                object2.x += this._overlap;
                object2.velocity.x = this._obj1Velocity - this._obj2Velocity * object2.bounce.x;
            }
            return true;
        }
        else
        {
            return false;
        }

    },

    /**
     * Separates the two objects on their y axis
     * @param object1 The first GameObject to separate
     * @param object2 The second GameObject to separate
     * @returns {boolean} Whether the objects in fact touched and were separated along the Y axis.
     */
    separateY: function (object1, object2) {

        //  Can't separate two immovable objects
        if (object1.immovable && object2.immovable)
        {
            return false;
        }

        //  First, get the two object deltas
        this._overlap = 0;

        if (object1.deltaY() != object2.deltaY())
        {
            //  Check if the Y hulls actually overlap
            this._obj1Bounds.setTo(object1.x, object1.y - ((object1.deltaY() > 0) ? object1.deltaY() : 0), object1.width, object1.height + object1.deltaAbsY());
            this._obj2Bounds.setTo(object2.x, object2.y - ((object2.deltaY() > 0) ? object2.deltaY() : 0), object2.width, object2.height + object2.deltaAbsY());

            if ((this._obj1Bounds.right > this._obj2Bounds.x) && (this._obj1Bounds.x < this._obj2Bounds.right) && (this._obj1Bounds.bottom > this._obj2Bounds.y) && (this._obj1Bounds.y < this._obj2Bounds.bottom))
            {
                this._maxOverlap = object1.deltaAbsY() + object2.deltaAbsY() + this.OVERLAP_BIAS;

                //  If they did overlap (and can), figure out by how much and flip the corresponding flags
                if (object1.deltaY() > object2.deltaY())
                {
                    this._overlap = object1.y + object1.height - object2.y;

                    if ((this._overlap > this._maxOverlap) || object1.allowCollision.down == false || object2.allowCollision.up == false)
                    {
                        this._overlap = 0;
                    }
                    else
                    {
                        object1.touching.down = true;
                        object2.touching.up = true;
                    }
                }
                else if (object1.deltaY() < object2.deltaY())
                {
                    this._overlap = object1.y - object2.height - object2.y;

                    if ((-this._overlap > this._maxOverlap) || object1.allowCollision.up == false || object2.allowCollision.down == false)
                    {
                        this._overlap = 0;
                    }
                    else
                    {
                        object1.touching.up = true;
                        object2.touching.down = true;
                    }
                }
            }
        }

        //  Then adjust their positions and velocities accordingly (if there was any overlap)
        if (this._overlap != 0)
        {
            this._obj1Velocity = object1.velocity.y;
            this._obj2Velocity = object2.velocity.y;

            if (!object1.immovable && !object2.immovable)
            {
                this._overlap *= 0.5;
                object1.y = object1.y - this._overlap;
                object2.y += this._overlap;

                this._obj1NewVelocity = Math.sqrt((this._obj2Velocity * this._obj2Velocity * object2.mass) / object1.mass) * ((this._obj2Velocity > 0) ? 1 : -1);
                this._obj2NewVelocity = Math.sqrt((this._obj1Velocity * this._obj1Velocity * object1.mass) / object2.mass) * ((this._obj1Velocity > 0) ? 1 : -1);
                this._average = (this._obj1NewVelocity + this._obj2NewVelocity) * 0.5;
                this._obj1NewVelocity -= this._average;
                this._obj2NewVelocity -= this._average;
                object1.velocity.y = this._average + this._obj1NewVelocity * object1.bounce.y;
                object2.velocity.y = this._average + this._obj2NewVelocity * object2.bounce.y;
            }
            else if (!object1.immovable)
            {
                object1.y = object1.y - this._overlap;
                object1.velocity.y = this._obj2Velocity - this._obj1Velocity * object1.bounce.y;
                //  This is special case code that handles things like horizontal moving platforms you can ride
                if (object2.active && object2.moves && (object1.deltaY() > object2.deltaY()))
                {
                    object1.x += object2.x - object2.lastX;
                }
            }
            else if (!object2.immovable)
            {
                object2.y += this._overlap;
                object2.velocity.y = this._obj1Velocity - this._obj2Velocity * object2.bounce.y;
                //  This is special case code that handles things like horizontal moving platforms you can ride
                if (object1.sprite.active && object1.moves && (object1.deltaY() < object2.deltaY()))
                {
                    object2.x += object1.x - object1.lastX;
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
     * The core Collision separation function used by Collision.overlap.
     * @param object1 The first GameObject to separate
     * @param object2 The second GameObject to separate
     * @returns {boolean} Returns true if the objects were separated, otherwise false.
     */
    separateTile: function (object, x, y, width, height, mass, collideLeft, collideRight, collideUp, collideDown, separateX, separateY) {

        //  Yes, the Y first
        var separatedY = this.separateTileY(object.body, x, y, width, height, mass, collideUp, collideDown, separateY);
        var separatedX = this.separateTileX(object.body, x, y, width, height, mass, collideLeft, collideRight, separateX);

        if (separatedX || separatedY)
        {
            object.body.postUpdate();
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
    separateTileX: function (object, x, y, width, height, mass, collideLeft, collideRight, separate) {

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
            this._obj1Bounds.setTo(object.x, object.y, object.width, object.height);

            if ((this._obj1Bounds.right > x) && (this._obj1Bounds.x < x + width) && (this._obj1Bounds.bottom > y) && (this._obj1Bounds.y < y + height))
            {
                //  The hulls overlap, let's process it
                this._maxOverlap = object.deltaAbsX() + this.OVERLAP_BIAS;

                //  TODO - We need to check if we're already inside of the tile, i.e. jumping through an n-way tile
                //  in which case we didn't ought to separate because it'll look like tunneling

                if (object.deltaX() < 0)
                {
                    //  Going left ...
                    this._overlap = object.x - width - x;

                    if (object.allowCollision.left && collideLeft && this._overlap < this._maxOverlap)
                    {
                        object.touching.left = true;
                        // console.log('left', this._overlap);
                    }
                    else
                    {
                        this._overlap = 0;
                    }
                }
                else
                {
                    //  Going right ...
                    this._overlap = object.right - x;

                    if (object.allowCollision.right && collideRight && this._overlap < this._maxOverlap)
                    {
                        object.touching.right = true;
                        // console.log('right', this._overlap);
                    }
                    else
                    {
                        this._overlap = 0;
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
    separateTileY: function (object, x, y, width, height, mass, collideUp, collideDown, separate) {

        //  Can't separate two immovable objects (tiles are always immovable)
        if (object.immovable)
        {
            return false;
        }

        //  First, get the object delta
        this._overlap = 0;

        if (object.deltaY() != 0)
        {
            this._obj1Bounds.setTo(object.x, object.y, object.width, object.height);

            if ((this._obj1Bounds.right > x) && (this._obj1Bounds.x < x + width) && (this._obj1Bounds.bottom > y) && (this._obj1Bounds.y < y + height))
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

                    if (object.allowCollision.down && collideDown && this._overlap < this._maxOverlap)
                    {
                        object.touching.down = true;
                    }
                    else
                    {
                        this._overlap = 0;
                    }
                }
                else
                {
                    //  Going up ...
                    this._overlap = object.y - height - y;

                    if (object.allowCollision.up && collideUp && this._overlap < this._maxOverlap)
                    {
                        object.touching.up = true;
                    }
                    else
                    {
                        this._overlap = 0;
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
