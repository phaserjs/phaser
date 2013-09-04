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

    this.LEFT = 0x0001;
    this.RIGHT = 0x0010;
    this.UP = 0x0100;
    this.DOWN = 0x1000;
    this.NONE = 0;
    this.CEILING = this.UP;
    this.FLOOR = this.DOWN;
    this.WALL = this.LEFT | this.RIGHT;
    this.ANY = this.LEFT | this.RIGHT | this.UP | this.DOWN;

	this.OVERLAP_BIAS = 4;
	this.TILE_OVERLAP = false;

	this.quadTree = null;

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

	collide: function (objectOrGroup1, objectOrGroup2, notifyCallback) {

		return this.overlap(objectOrGroup1, objectOrGroup2, notifyCallback, this.separate);

	},

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

    	//	Create our tree which all of the Physics bodies will add themselves to
    	this.quadTree = new Phaser.QuadTree(this.game.world.bounds.x, this.game.world.bounds.y, this.game.world.bounds.width, this.game.world.bounds.height, this.maxObjects, this.maxLevels);

    },

    postUpdate: function () {

    	//	Clear the tree ready for the next update
    	this.quadTree.clear();

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
    overlap: function (object1, object2, notifyCallback, processCallback) {

        return result;

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
                if (object1.deltaAbsX() > object2.deltaAbsX())
                {
                    this._overlap = object1.x + object1.width - object2.x;

                    if ((this._overlap > this._maxOverlap) || !(object1.allowCollisions & this.RIGHT) || !(object2.allowCollisions & this.LEFT))
                    {
                        this._overlap = 0;
                    }
                    else
                    {
                        object1.touching |= this.RIGHT;
                        object2.touching |= this.LEFT;
                    }
                }
                else if (object1.deltaX() < object2.deltaX())
                {
                    this._overlap = object1.x - object2.width - object2.x;

                    if ((-this._overlap > this._maxOverlap) || !(object1.allowCollisions & this.LEFT) || !(object2.allowCollisions & this.RIGHT))
                    {
                        this._overlap = 0;
                    }
                    else
                    {
                        object1.touching |= this.LEFT;
                        object2.touching |= this.RIGHT;
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

                    if ((this._overlap > this._maxOverlap) || !(object1.allowCollisions & this.DOWN) || !(object2.allowCollisions & this.UP))
                    {
                        this._overlap = 0;
                    }
                    else
                    {
                        object1.touching |= this.DOWN;
                        object2.touching |= this.UP;
                    }
                }
                else if (object1.deltaY() < object2.deltaY())
                {
                    this._overlap = object1.y - object2.height - object2.y;

                    if ((-this._overlap > this._maxOverlap) || !(object1.allowCollisions & this.UP) || !(object2.allowCollisions & this.DOWN))
                    {
                        this._overlap = 0;
                    }
                    else
                    {
                        object1.touching |= this.UP;
                        object2.touching |= this.DOWN;
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

};
