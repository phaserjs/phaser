Phaser.Physics = {};

Phaser.Physics.Arcade = function (game) {
	
	this.game = game;

	this._length = 0;

	/**
	* @type {number}
	*/
	this.worldDivisions = 6;

	// this.angularDrag = 0;
	// this.gravity = new Phaser.Point;
	// this.drag = new Phaser.Point;
	// this.bounce = new Phaser.Point;
	// this.bounds = new Phaser.Rectangle(0, 0, game.world.width, game.world.height);
	// this._distance = new Phaser.Point;
	// this._tangent = new Phaser.Point;

};

Phaser.Physics.Arcade.prototype = {

    updateMotion: function (body) {

        this._velocityDelta = (this.computeVelocity(body.angularVelocity, body.gravity.x, body.angularAcceleration, body.angularDrag, body.maxAngular) - body.angularVelocity) / 2;
        body.angularVelocity += this._velocityDelta;
        body.sprite.rotation += body.angularVelocity * this.game.time.physicsElapsed;
        body.angularVelocity += this._velocityDelta;

        this._velocityDelta = (this.computeVelocity(body.velocity.x, body.gravity.x, body.acceleration.x, body.drag.x) - body.velocity.x) / 2;
        body.velocity.x += this._velocityDelta;
        this._delta = body.velocity.x * this.game.time.physicsElapsed;
        body.velocity.x += this._velocityDelta;
        body._x += this._delta;

        this._velocityDelta = (this.computeVelocity(body.velocity.y, body.gravity.y, body.acceleration.y, body.drag.y) - body.velocity.y) / 2;
        body.velocity.y += this._velocityDelta;
        this._delta = body.velocity.y * this.game.time.physicsElapsed;
        body.velocity.y += this._velocityDelta;
        body._y += this._delta;

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

};

Phaser.Physics.Arcade.prototype.OVERLAP_BIAS = 4;
Phaser.Physics.Arcade.prototype.TILE_OVERLAP = false;
