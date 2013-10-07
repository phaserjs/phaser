Phaser.Physics.Arcade.Body = function (sprite) {

	this.sprite = sprite;
	this.game = sprite.game;

	this.offset = new Phaser.Point;

	this.x = sprite.x;
	this.y = sprite.y;
	this.preX = sprite.x;
	this.preY = sprite.y;
	this.preRotation = sprite.angle;

	//	un-scaled original size
	this.sourceWidth = sprite.currentFrame.sourceSizeW;
	this.sourceHeight = sprite.currentFrame.sourceSizeH;

	//	calculated (scaled) size
	this.width = sprite.currentFrame.sourceSizeW;
	this.height = sprite.currentFrame.sourceSizeH;
	this.halfWidth = Math.floor(sprite.currentFrame.sourceSizeW / 2);
	this.halfHeight = Math.floor(sprite.currentFrame.sourceSizeH / 2);

	//	Scale value cache
	this._sx = sprite.scale.x;
	this._sy = sprite.scale.y;

    this.velocity = new Phaser.Point;
    this.acceleration = new Phaser.Point;
    this.drag = new Phaser.Point;
    this.gravity = new Phaser.Point;
    this.bounce = new Phaser.Point;
    this.maxVelocity = new Phaser.Point(10000, 10000);

    this.angularVelocity = 0;
    this.angularAcceleration = 0;
    this.angularDrag = 0;
    this.maxAngular = 1000;
    this.mass = 1;

    this.skipQuadTree = false;
    this.quadTreeIDs = [];
    this.quadTreeIndex = -1;

    //	Allow collision
    this.allowCollision = { none: false, any: true, up: true, down: true, left: true, right: true };
    this.touching = { none: true, up: false, down: false, left: false, right: false };
    this.wasTouching = { none: true, up: false, down: false, left: false, right: false };
    this.facing = Phaser.NONE;

    this.immovable = false;
    this.moves = true;
    this.rotation = 0;
    this.allowRotation = true;
    this.allowGravity = true;

    //	These two flags allow you to disable the custom separation that takes place
    //	Used in combination with your own collision processHandler you can create whatever
    //	type of collision response you need.
    this.customSeparateX = false;
    this.customSeparateY = false;

    //	When this body collides with another the amount of overlap is stored in here
    //	These values are useful if you want to provide your own custom separation logic.
    this.overlapX = 0;
    this.overlapY = 0;

    //	If a body is overlapping with another body, but neither of them are moving (maybe they spawned on-top of each other?) this is set to true
    this.embedded = false;

    this.collideWorldBounds = false;

};

Phaser.Physics.Arcade.Body.prototype = {

	updateBounds: function (centerX, centerY, scaleX, scaleY) {

		if (scaleX != this._sx || scaleY != this._sy)
		{
			this.width = this.sourceWidth * scaleX;
			this.height = this.sourceHeight * scaleY;
			this.halfWidth = Math.floor(this.width / 2);
			this.halfHeight = Math.floor(this.height / 2);
			this._sx = scaleX;
			this._sy = scaleY;
		}

	},

	preUpdate: function () {

		//	Store and reset collision flags
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

	    this.embedded = false;

		this.preX = (this.sprite.worldTransform[2] - (this.sprite.anchor.x * this.width)) + this.offset.x;
		this.preY = (this.sprite.worldTransform[5] - (this.sprite.anchor.y * this.height)) + this.offset.y;
		this.preRotation = this.sprite.angle;

		this.x = this.preX;
		this.y = this.preY;
		this.rotation = this.preRotation;

		if (this.moves)
		{
			this.game.physics.updateMotion(this);

			if (this.collideWorldBounds)
			{
				this.checkWorldBounds();
			}
		}

		if (this.skipQuadTree == false && this.allowCollision.none == false && this.sprite.visible && this.sprite.alive)
		{
		    this.quadTreeIDs = [];
		    this.quadTreeIndex = -1;
			this.game.physics.quadTree.insert(this);
		}

	},

	postUpdate: function () {

		//	Calculate forward-facing edge
		if (this.deltaX() == 0 && this.deltaY() == 0)
		{
			//	Can't work it out from the Body, how about from x position?
			if (this.sprite.deltaX() == 0 && this.sprite.deltaY() == 0)
			{
				//	still as a statue
			}
		}

		if (this.deltaX() < 0)
		{
			this.facing = Phaser.LEFT;
		}
		else if (this.deltaX() > 0)
		{
			this.facing = Phaser.RIGHT;
		}

		if (this.deltaY() < 0)
		{
			this.facing = Phaser.UP;
		}
		else if (this.deltaY() > 0)
		{
			this.facing = Phaser.DOWN;
		}

		this.sprite.x += this.deltaX();
		this.sprite.y += this.deltaY();

		if (this.allowRotation)
		{
			this.sprite.angle += this.deltaZ();
		}

	},

	checkWorldBounds: function () {

		if (this.x < this.game.world.bounds.x)
		{
			this.x = this.game.world.bounds.x;
			this.velocity.x *= -this.bounce.x;
		}
		else if (this.right > this.game.world.bounds.right)
		{
			this.x = this.game.world.bounds.right - this.width;
			this.velocity.x *= -this.bounce.x;
		}

		if (this.y < this.game.world.bounds.y)
		{
			this.y = this.game.world.bounds.y;
			this.velocity.y *= -this.bounce.y;
		}
		else if (this.bottom > this.game.world.bounds.bottom)
		{
			this.y = this.game.world.bounds.bottom - this.height;
			this.velocity.y *= -this.bounce.y;
		}

	},

	setSize: function (width, height, offsetX, offsetY) {

		offsetX = offsetX || this.offset.x;
		offsetY = offsetY || this.offset.y;

		this.sourceWidth = width;
		this.sourceHeight = height;
		this.width = this.sourceWidth * this._sx;
		this.height = this.sourceHeight * this._sy;
		this.halfWidth = Math.floor(this.width / 2);
		this.halfHeight = Math.floor(this.height / 2);
		this.offset.setTo(offsetX, offsetY);

	},

	reset: function () {

		this.velocity.setTo(0, 0);
		this.acceleration.setTo(0, 0);

	    this.angularVelocity = 0;
	    this.angularAcceleration = 0;

		this.x = (this.sprite.worldTransform[2] - (this.sprite.anchor.x * this.width)) + this.offset.x;
		this.y = (this.sprite.worldTransform[5] - (this.sprite.anchor.y * this.height)) + this.offset.y;
		this.rotation = this.sprite.angle;

	},

	//	Basically Math.abs
    deltaAbsX: function () {
        return (this.deltaX() > 0 ? this.deltaX() : -this.deltaX());
    },

    deltaAbsY: function () {
        return (this.deltaY() > 0 ? this.deltaY() : -this.deltaY());
    },

    deltaX: function () {
        return this.x - this.preX;
    },

    deltaY: function () {
        return this.y - this.preY;
    },

    deltaZ: function () {
        return this.rotation - this.preRotation;
    }

};

Object.defineProperty(Phaser.Physics.Arcade.Body.prototype, "bottom", {
    
    /**
    * The sum of the y and height properties. Changing the bottom property of a Rectangle object has no effect on the x, y and width properties, but does change the height property.
    * @method bottom
    * @return {number}
    **/
    get: function () {
        return this.y + this.height;
    },

    /**
    * The sum of the y and height properties. Changing the bottom property of a Rectangle object has no effect on the x, y and width properties, but does change the height property.
    * @method bottom
    * @param {number} value
    **/    
    set: function (value) {

        if (value <= this.y)
        {
            this.height = 0;
        }
        else
        {
            this.height = (this.y - value);
        }
        
    }

});

Object.defineProperty(Phaser.Physics.Arcade.Body.prototype, "right", {
    
    /**
    * The sum of the x and width properties. Changing the right property of a Rectangle object has no effect on the x, y and height properties.
    * However it does affect the width property.
    * @method right
    * @return {number}
    **/    
    get: function () {
        return this.x + this.width;
    },

    /**
    * The sum of the x and width properties. Changing the right property of a Rectangle object has no effect on the x, y and height properties.
    * However it does affect the width property.
    * @method right
    * @param {number} value
    **/
    set: function (value) {

        if (value <= this.x)
        {
            this.width = 0;
        }
        else
        {
            this.width = this.x + value;
        }

    }

});
