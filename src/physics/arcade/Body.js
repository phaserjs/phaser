Phaser.Physics.Arcade.Body = function (sprite) {

	this.sprite = sprite;
	this.game = sprite.game;

	this.offset = new Phaser.Point;

	//	the top-left of the Body
	this.x = sprite.x;
	this.y = sprite.y;

	//	un-scaled original size
	this.sourceWidth = sprite.currentFrame.sourceSizeW;
	this.sourceHeight = sprite.currentFrame.sourceSizeH;

	//	calculated (scaled) size
	this.width = sprite.currentFrame.sourceSizeW;
	this.height = sprite.currentFrame.sourceSizeH;
	this.halfWidth = Math.floor(sprite.currentFrame.sourceSizeW / 2);
	this.halfHeight = Math.floor(sprite.currentFrame.sourceSizeH / 2);

	this.bounds = new Phaser.Rectangle(sprite.x, sprite.y, this.width, this.height);

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

    this.quadTreeIDs = [];
    this.quadTreeIndex = -1;

    //	Allow collision
    this.allowCollision = { none: false, any: true, up: true, down: true, left: true, right: true };
    this.touching = { none: true, up: false, down: false, left: false, right: false };
    this.wasTouching = { none: true, up: false, down: false, left: false, right: false };

    this.immovable = false;
    this.moves = true;
    this.rotation = 0;
    this.allowRotation = false;
    this.allowGravity = true;

    this.collideWorldBounds = false;

	this.lastX = sprite.x;
	this.lastY = sprite.y;

};

Phaser.Physics.Arcade.Body.prototype = {

	updateBounds: function (centerX, centerY, scaleX, scaleY) {

		if (scaleX != this._sx || scaleY != this._sy)
		{
			this.width = this.sourceWidth * scaleX;
			this.height = this.sourceHeight * scaleY;
			this.halfWidth = Math.floor(this.width / 2);
			this.halfHeight = Math.floor(this.height / 2);
			this.bounds.width = this.width;
			this.bounds.height = this.height;
			this._sx = scaleX;
			this._sy = scaleY;
		}

	},

	update: function () {

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

		this.lastX = this.x;
		this.lastY = this.y;

		if (this.moves)
		{
			this.game.physics.updateMotion(this);
		}

		this.bounds.x = this.x;
		this.bounds.y = this.y;

		if (this.allowCollision.none == false && this.sprite.visible && this.sprite.alive)
		{
		    this.quadTreeIDs = [];
		    this.quadTreeIndex = -1;
			this.game.physics.quadTree.insert(this);
		}

	},

	checkWorldBounds: function () {

		if (this.bounds.x < this.game.world.bounds.x)
		{
			this.x = this.game.world.bounds.x;
			this.velocity.x *= -1;
			this.velocity.x *= this.bounce.x;
		}
		else if (this.bounds.right > this.game.world.bounds.right)
		{
			this.x = this.game.world.bounds.right - this.width;
			this.velocity.x *= -1;
			this.velocity.x *= this.bounce.x;
		}

		if (this.bounds.y < this.game.world.bounds.y)
		{
			this.y = this.game.world.bounds.y;
			this.velocity.y *= -1;
			this.velocity.y *= this.bounce.y;
		}
		else if (this.bounds.bottom > this.game.world.bounds.bottom)
		{
			this.y = this.game.world.bounds.bottom - this.height;
			this.velocity.y *= -1;
			this.velocity.y *= this.bounce.y;
		}

	},

	postUpdate: function () {

		if (this.collideWorldBounds)
		{
			this.checkWorldBounds();
		}

		this.sprite.x = this.x - this.offset.x + (this.sprite.anchor.x * this.width);
		this.sprite.y = this.y - this.offset.y + (this.sprite.anchor.y * this.height);

		if (this.allowRotation)
		{
			this.sprite.angle = this.rotation;
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
		this.bounds.width = this.width;
		this.bounds.height = this.height;
		this.offset.setTo(offsetX, offsetY);

	},

	/*
    hullWidth: function () {

        if (this.deltaX() > 0)
        {
            return this.width + this.deltaX();
        }
        else
        {
            return this.width - this.deltaX();
        }

    },

    hullHeight: function () {

        if (this.deltaY() > 0)
        {
            return this.height + this.deltaY();
        }
        else
        {
            return this.height - this.deltaY();
        }

    },

    hullX: function () {

        if (this.x < this.lastX)
        {
            return this.x;
        }
        else
        {
            return this.lastX;
        }

    },

    hullY: function () {

        if (this.y < this.lastY)
        {
            return this.y;
        }
        else
        {
            return this.lastY;
        }

    },
    */

    deltaAbsX: function () {
        return (this.deltaX() > 0 ? this.deltaX() : -this.deltaX());
    },

    deltaAbsY: function () {
        return (this.deltaY() > 0 ? this.deltaY() : -this.deltaY());
    },

    deltaX: function () {
        return this.x - this.lastX;
    },

    deltaY: function () {
        return this.y - this.lastY;
    }

};