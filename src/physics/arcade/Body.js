Phaser.Physics.Arcade.Body = function (sprite) {

	this.sprite = sprite;
	this.game = sprite.game;

	this.hitArea = new Phaser.Rectangle(sprite.x, sprite.y, sprite.currentFrame.sourceSizeW, sprite.currentFrame.sourceSizeH);
	this.offset = new Phaser.Point;

	this.width = this.hitArea.width;
	this.height = this.hitArea.height;
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

    this.immovable = false;
    this.touching = 0;
    this.wasTouching = 0;
    this.allowCollisions = 1;

	this._x = sprite.x;
	this._y = sprite.y;
	this._ox = sprite.x;
	this._oy = sprite.y;

};

Phaser.Physics.Arcade.Body.prototype = {

	sprite: null,
	game: null,
	hitArea: null,

	update: function (x, y, scaleX, scaleY) {

		if (scaleX != this._sx || scaleY != this._sy)
		{
			this.hitArea.width = this.width * scaleX;
			this.hitArea.height = this.height * scaleY;
			this._sx = scaleX;
			this._sy = scaleY;
		}

		this.hitArea.centerX = x;
		this.hitArea.centerY = y;

	},

	updateMotion: function () {

		this._ox = this._x;
		this._oy = this._y;

		this.game.physics.updateMotion(this);

		//	delta force - _x and _y now contain the new positions, so work out the deltas
		//	separation and stuff happens here

	},

	postUpdate: function () {

		sprite.x = this._x;
		sprite.y = this._y;

	},

	setSize: function (width, height) {

		this.width = width;
		this.height = height;
		this.hitArea.width = this.width * scaleX;
		this.hitArea.height = this.height * scaleY;

	},

    hullWidth: function () {

        if (this.deltaX > 0)
        {
            return this.hitArea.width + this.deltaX;
        }
        else
        {
            return this.hitArea.width - this.deltaX;
        }

    },

    hullHeight: function () {

        if (this.deltaY > 0)
        {
            return this.hitArea.height + this.deltaY;
        }
        else
        {
            return this.hitArea.height - this.deltaY;
        }

    },

    hullX: function () {

        if (this._x < this._ox)
        {
            return this._x;
        }
        else
        {
            return this._ox;
        }

    },

    hullY: function () {

        if (this._y < this._oy)
        {
            return this._y;
        }
        else
        {
            return this._oy;
        }

    },

    deltaXAbs: function () {
        return (this.deltaX > 0 ? this.deltaX : -this.deltaX);
    },

    deltaYAbs: function () {
        return (this.deltaY > 0 ? this.deltaY : -this.deltaY);
    },

    deltaX: function () {
        return this._x - this._ox;
    },

    deltaY: function () {
        return this._y - this._oy;
    }

};