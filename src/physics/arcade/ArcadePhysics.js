Phaser.Physics = {};

Phaser.Physics.Arcade = function (game) {
	
	this.game = game;

	this._length = 0;

	/**
	* @type {number}
	*/
	this.worldDivisions = 6;

    this.LEFT = 0x0001;
    this.RIGHT = 0x0010;
    this.UP = 0x0100;
    this.DOWN = 0x1000;
    this.NONE = 0;
    this.CEILING = this.UP;
    this.FLOOR = this.DOWN;
    this.WALL = this.LEFT | this.RIGHT;
    this.ANY = this.LEFT | this.RIGHT | this.UP | this.DOWN;
    // console.log('any', this.ANY);
	this.OVERLAP_BIAS = 4;
	this.TILE_OVERLAP = false;

	//	avoid creating these every frame, per collision
	this._obj1Bounds = new Phaser.Rectangle;
	this._obj2Bounds = new Phaser.Rectangle;
	this._overlap = 0;
	this._maxOverlap = 0;
	this._obj1Velocity = 0;
	this._obj2Velocity = 0;
	this._obj1NewVelocity = 0;
	this._obj2NewVelocity = 0;
	this._average = 0;

	// this.angularDrag = 0;
	// this.gravity = new Phaser.Point;
	// this.drag = new Phaser.Point;
	// this.bounce = new Phaser.Point;
	// this.bounds = new Phaser.Rectangle(0, 0, game.world.width, game.world.height);
	// this._distance = new Phaser.Point;
	// this._tangent = new Phaser.Point;

};

Phaser.Physics.Arcade.prototype = {

	collide: function (objectOrGroup1, objectOrGroup2, notifyCallback) {

		return this.overlap(objectOrGroup1, objectOrGroup2, notifyCallback, this.separate);

	},

    updateMotion: function (body) {

        this._velocityDelta = (this.computeVelocity(body.angularVelocity, body.gravity.x, body.angularAcceleration, body.angularDrag, body.maxAngular) - body.angularVelocity) / 2;
        body.angularVelocity += this._velocityDelta;
        body.sprite.rotation += body.angularVelocity * this.game.time.physicsElapsed;
        body.angularVelocity += this._velocityDelta;

        this._velocityDelta = (this.computeVelocity(body.velocity.x, body.gravity.x, body.acceleration.x, body.drag.x) - body.velocity.x) / 2;
        body.velocity.x += this._velocityDelta;
        this._delta = body.velocity.x * this.game.time.physicsElapsed;
        body.velocity.x += this._velocityDelta;
        body.x += this._delta;

        this._velocityDelta = (this.computeVelocity(body.velocity.y, body.gravity.y, body.acceleration.y, body.drag.y) - body.velocity.y) / 2;
        body.velocity.y += this._velocityDelta;
        this._delta = body.velocity.y * this.game.time.physicsElapsed;
        body.velocity.y += this._velocityDelta;
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
    computeVelocity: function (velocity, gravity, acceleration, drag, max) {

    	gravity = gravity || 0;
    	acceleration = acceleration || 0;
    	drag = drag || 0;
    	max = max || 10000;

        if (acceleration !== 0)
        {
            velocity += (acceleration + gravity) * this.game.time.physicsElapsed;
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

            velocity += gravity;
        }

        if ((velocity != 0) && (max != 10000))
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

        if (object1 == null)
        {
            object1 = this._game.world.group;
        }

        if (object2 == object1)
        {
            object2 = null;
        }

        Phaser.QuadTree.divisions = this.worldDivisions;

        var quadTree = new Phaser.QuadTree(this._game.world.bounds.x, this._game.world.bounds.y, this._game.world.bounds.width, this._game.world.bounds.height);

        quadTree.load(object1, object2, notifyCallback, processCallback);

        var result = quadTree.execute();

        quadTree.destroy();

        quadTree = null;

        return result;

    },

	 /**
     * The core Collision separation function used by Collision.overlap.
     * @param object1 The first GameObject to separate
     * @param object2 The second GameObject to separate
     * @returns {boolean} Returns true if the objects were separated, otherwise false.
     */
    separate: function (object1, object2) {

        var separatedX = this.separateX(object1, object2);
        var separatedY = this.separateY(object1, object2);

        return separatedX || separatedY;

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

            if ((this._obj1Bounds.x + this._obj1Bounds.width > this._obj2Bounds.x) && (this._obj1Bounds.x < this._obj2Bounds.x + this._obj2Bounds.width) && (this._obj1Bounds.y + this._obj1Bounds.height > this._obj2Bounds.y) && (this._obj1Bounds.y < this._obj2Bounds.y + this._obj2Bounds.height))
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
        if (object1.immovable && object2.immovable) {
            return false;
        }

        //  First, get the two object deltas
        var overlap = 0;
        var obj1Delta = object1.y - object1.last.y;
        var obj2Delta = object2.y - object2.last.y;

        if (obj1Delta != obj2Delta)
        {
            //  Check if the Y hulls actually overlap
            var obj1DeltaAbs = (obj1Delta > 0) ? obj1Delta : -obj1Delta;
            var obj2DeltaAbs = (obj2Delta > 0) ? obj2Delta : -obj2Delta;
            this._obj1Bounds = new Phaser.Rectangle(object1.x, object1.y - ((obj1Delta > 0) ? obj1Delta : 0), object1.width, object1.height + obj1DeltaAbs);
            this._obj2Bounds = new Phaser.Rectangle(object2.x, object2.y - ((obj2Delta > 0) ? obj2Delta : 0), object2.width, object2.height + obj2DeltaAbs);

            if ((this._obj1Bounds.x + this._obj1Bounds.width > this._obj2Bounds.x) && (this._obj1Bounds.x < this._obj2Bounds.x + this._obj2Bounds.width) && (this._obj1Bounds.y + this._obj1Bounds.height > this._obj2Bounds.y) && (this._obj1Bounds.y < this._obj2Bounds.y + this._obj2Bounds.height))
            {
                var maxOverlap = obj1DeltaAbs + obj2DeltaAbs + Collision.OVERLAP_BIAS;

                //  If they did overlap (and can), figure out by how much and flip the corresponding flags
                if (obj1Delta > obj2Delta)
                {
                    overlap = object1.y + object1.height - object2.y;

                    if ((overlap > maxOverlap) || !(object1.allowCollisions & Collision.DOWN) || !(object2.allowCollisions & Collision.UP))
                    {
                        overlap = 0;
                    }
                    else
                    {
                        object1.touching |= Collision.DOWN;
                        object2.touching |= Collision.UP;
                    }
                }
                else if (obj1Delta < obj2Delta)
                {
                    overlap = object1.y - object2.height - object2.y;

                    if ((-overlap > maxOverlap) || !(object1.allowCollisions & Collision.UP) || !(object2.allowCollisions & Collision.DOWN))
                    {
                        overlap = 0;
                    }
                    else
                    {
                        object1.touching |= Collision.UP;
                        object2.touching |= Collision.DOWN;
                    }
                }
            }
        }

        //  Then adjust their positions and velocities accordingly (if there was any overlap)
        if (overlap != 0)
        {
            this._obj1Velocity = object1.velocity.y;
            this._obj2Velocity = object2.velocity.y;

            if (!object1.immovable && !object2.immovable)
            {
                overlap *= 0.5;
                object1.y = object1.y - overlap;
                object2.y += overlap;

                this._obj1NewVelocity = Math.sqrt((this._obj2Velocity * this._obj2Velocity * object2.mass) / object1.mass) * ((this._obj2Velocity > 0) ? 1 : -1);
                this._obj2NewVelocity = Math.sqrt((this._obj1Velocity * this._obj1Velocity * object1.mass) / object2.mass) * ((this._obj1Velocity > 0) ? 1 : -1);
                this._average = (this._obj1NewVelocity + this._obj2NewVelocity) * 0.5;
                this._obj1NewVelocity -= this._average;
                this._obj2NewVelocity -= this._average;
                object1.velocity.y = this._average + this._obj1NewVelocity * object1.elasticity;
                object2.velocity.y = this._average + this._obj2NewVelocity * object2.elasticity;
            }
            else if (!object1.immovable)
            {
                object1.y = object1.y - overlap;
                object1.velocity.y = this._obj2Velocity - this._obj1Velocity * object1.elasticity;
                //  This is special case code that handles things like horizontal moving platforms you can ride
                if (object2.active && object2.moves && (obj1Delta > obj2Delta))
                {
                    object1.x += object2.x - object2.last.x;
                }
            }
            else if (!object2.immovable)
            {
                object2.y += overlap;
                object2.velocity.y = this._obj1Velocity - this._obj2Velocity * object2.elasticity;
                //  This is special case code that handles things like horizontal moving platforms you can ride
                if (object1.active && object1.moves && (obj1Delta < obj2Delta))
                {
                    object2.x += object1.x - object1.last.x;
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
