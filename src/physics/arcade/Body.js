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

    //	Handy consts
    this.LEFT = 0x0001;
    this.RIGHT = 0x0010;
    this.UP = 0x0100;
    this.DOWN = 0x1000;
    this.NONE = 0;
    this.CEILING = this.UP;
    this.FLOOR = this.DOWN;
    this.WALL = this.LEFT | this.RIGHT;
    this.ANY = this.LEFT | this.RIGHT | this.UP | this.DOWN;

    this.immovable = false;
    this.moves = true;
    this.touching = 0;
    this.wasTouching = 0;
    this.rotation = 0;
    this.allowCollisions = this.ANY;
    this.allowRotation = false;
    this.allowGravity = true;

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

		this.lastX = this.x;
		this.lastY = this.y;

		this.game.physics.updateMotion(this);

		this.bounds.x = this.x;
		this.bounds.y = this.y;

	},

	postUpdate: function () {

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