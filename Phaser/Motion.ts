/// <reference path="Game.ts" />
/// <reference path="gameobjects/GameObject.ts" />

/**
* Phaser - Motion
*
* The Motion class contains lots of useful functions for moving game objects around in world space.
*/

module Phaser {

    export class Motion {

        constructor(game: Game) {

            this._game = game;

        }

        private _game: Game;

        /**
        * A tween-like function that takes a starting velocity and some other factors and returns an altered velocity.
        * 
        * @param	Velocity		Any component of velocity (e.g. 20).
        * @param	Acceleration	Rate at which the velocity is changing.
        * @param	Drag			Really kind of a deceleration, this is how much the velocity changes if Acceleration is not set.
        * @param	Max				An absolute value cap for the velocity.
        * 
        * @return	The altered Velocity value.
        */
        public computeVelocity(Velocity: number, Acceleration: number = 0, Drag: number = 0, Max: number = 10000): number {

            if (Acceleration !== 0)
            {
                Velocity += Acceleration * this._game.time.elapsed;
            }
            else if (Drag !== 0)
                {
                var drag: number = Drag * this._game.time.elapsed;

                if (Velocity - drag > 0)
                {
                    Velocity = Velocity - drag;
                }
                else if (Velocity + drag < 0)
                {
                    Velocity += drag;
                }
                else
                {
                    Velocity = 0;
                }
            }

            if ((Velocity != 0) && (Max != 10000))
            {
                if (Velocity > Max)
                {
                    Velocity = Max;
                }
                else if (Velocity < -Max)
                {
                    Velocity = -Max;
                }
            }

            return Velocity;

        }

        /**
        * Given the angle and speed calculate the velocity and return it as a Point
        * 
        * @param	angle	The angle (in degrees) calculated in clockwise positive direction (down = 90 degrees positive, right = 0 degrees positive, up = 90 degrees negative)
        * @param	speed	The speed it will move, in pixels per second sq
        * 
        * @return	A Point where Point.x contains the velocity x value and Point.y contains the velocity y value
        */
        public velocityFromAngle(angle: number, speed: number): Point {

            if (isNaN(speed))
            {
                speed = 0;
            }

            var a: number = this._game.math.degreesToRadians(angle);

            return new Point((Math.cos(a) * speed), (Math.sin(a) * speed));

        }

		/**
		 * Sets the source Sprite x/y velocity so it will move directly towards the destination Sprite at the speed given (in pixels per second)<br>
		 * If you specify a maxTime then it will adjust the speed (over-writing what you set) so it arrives at the destination in that number of seconds.<br>
		 * Timings are approximate due to the way Flash timers work, and irrespective of SWF frame rate. Allow for a variance of +- 50ms.<br>
		 * The source object doesn't stop moving automatically should it ever reach the destination coordinates.<br>
		 * If you need the object to accelerate, see accelerateTowardsObject() instead
		 * Note: Doesn't take into account acceleration, maxVelocity or drag (if you set drag or acceleration too high this object may not move at all)
		 * 
		 * @param	source		The Sprite on which the velocity will be set
		 * @param	dest		The Sprite where the source object will move to
		 * @param	speed		The speed it will move, in pixels per second (default is 60 pixels/sec)
		 * @param	maxTime		Time given in milliseconds (1000 = 1 sec). If set the speed is adjusted so the source will arrive at destination in the given number of ms
		 */
		public moveTowardsObject(source:GameObject, dest:GameObject, speed:number= 60, maxTime:number = 0)
		{
			var a:number = this.angleBetween(source, dest);
			
			if (maxTime > 0)
			{
				var d:number = this.distanceBetween(source, dest);
				
				//	We know how many pixels we need to move, but how fast?
				speed = d / (maxTime / 1000);
			}
			
			source.velocity.x = Math.cos(a) * speed;
			source.velocity.y = Math.sin(a) * speed;

		}

		/**
		 * Sets the x/y acceleration on the source Sprite so it will move towards the destination Sprite at the speed given (in pixels per second)<br>
		 * You must give a maximum speed value, beyond which the Sprite won't go any faster.<br>
		 * If you don't need acceleration look at moveTowardsObject() instead.
		 * 
		 * @param	source			The Sprite on which the acceleration will be set
		 * @param	dest			The Sprite where the source object will move towards
		 * @param	speed			The speed it will accelerate in pixels per second
		 * @param	xSpeedMax		The maximum speed in pixels per second in which the sprite can move horizontally
		 * @param	ySpeedMax		The maximum speed in pixels per second in which the sprite can move vertically
		 */
		public accelerateTowardsObject(source:GameObject, dest:GameObject, speed:number, xSpeedMax:number, ySpeedMax:number)
		{
			var a:number = this.angleBetween(source, dest);
			
			source.velocity.x = 0;
			source.velocity.y = 0;
			
			source.acceleration.x = Math.cos(a) * speed;
			source.acceleration.y = Math.sin(a) * speed;
			
			source.maxVelocity.x = xSpeedMax;
			source.maxVelocity.y = ySpeedMax;

		}

		/**
		 * Move the given Sprite towards the mouse pointer coordinates at a steady velocity
		 * If you specify a maxTime then it will adjust the speed (over-writing what you set) so it arrives at the destination in that number of seconds.<br>
		 * Timings are approximate due to the way Flash timers work, and irrespective of SWF frame rate. Allow for a variance of +- 50ms.<br>
		 * The source object doesn't stop moving automatically should it ever reach the destination coordinates.<br>
		 * 
		 * @param	source		The Sprite to move
		 * @param	speed		The speed it will move, in pixels per second (default is 60 pixels/sec)
		 * @param	maxTime		Time given in milliseconds (1000 = 1 sec). If set the speed is adjusted so the source will arrive at destination in the given number of ms
		 */
		public moveTowardsMouse(source:GameObject, speed:number = 60, maxTime:number = 0)
		{
			var a:number = this.angleBetweenMouse(source);
			
			if (maxTime > 0)
			{
				var d:number = this.distanceToMouse(source);
				
				//	We know how many pixels we need to move, but how fast?
				speed = d / (maxTime / 1000);
			}
			
			source.velocity.x = Math.cos(a) * speed;
			source.velocity.y = Math.sin(a) * speed;

		}

		/**
		 * Sets the x/y acceleration on the source Sprite so it will move towards the mouse coordinates at the speed given (in pixels per second)<br>
		 * You must give a maximum speed value, beyond which the Sprite won't go any faster.<br>
		 * If you don't need acceleration look at moveTowardsMouse() instead.
		 * 
		 * @param	source			The Sprite on which the acceleration will be set
		 * @param	speed			The speed it will accelerate in pixels per second
		 * @param	xSpeedMax		The maximum speed in pixels per second in which the sprite can move horizontally
		 * @param	ySpeedMax		The maximum speed in pixels per second in which the sprite can move vertically
		 */
		public accelerateTowardsMouse(source:GameObject, speed:number, xSpeedMax:number, ySpeedMax:number)
		{
			var a:number = this.angleBetweenMouse(source);
			
			source.velocity.x = 0;
			source.velocity.y = 0;
			
			source.acceleration.x = Math.cos(a) * speed;
			source.acceleration.y = Math.sin(a) * speed;
			
			source.maxVelocity.x = xSpeedMax;
			source.maxVelocity.y = ySpeedMax;
		}

		/**
		 * Sets the x/y velocity on the source Sprite so it will move towards the target coordinates at the speed given (in pixels per second)<br>
		 * If you specify a maxTime then it will adjust the speed (over-writing what you set) so it arrives at the destination in that number of seconds.<br>
		 * Timings are approximate due to the way Flash timers work, and irrespective of SWF frame rate. Allow for a variance of +- 50ms.<br>
		 * The source object doesn't stop moving automatically should it ever reach the destination coordinates.<br>
		 * 
		 * @param	source		The Sprite to move
		 * @param	target		The Point coordinates to move the source Sprite towards
		 * @param	speed		The speed it will move, in pixels per second (default is 60 pixels/sec)
		 * @param	maxTime		Time given in milliseconds (1000 = 1 sec). If set the speed is adjusted so the source will arrive at destination in the given number of ms
		 */
		public moveTowardsPoint(source:GameObject, target:Point, speed:number = 60, maxTime:number = 0)
		{
			var a:number = this.angleBetweenPoint(source, target);
			
			if (maxTime > 0)
			{
				var d:number = this.distanceToPoint(source, target);
				
				//	We know how many pixels we need to move, but how fast?
				speed = d / (maxTime / 1000);
			}
			
			source.velocity.x = Math.cos(a) * speed;
			source.velocity.y = Math.sin(a) * speed;
		}

		/**
		 * Sets the x/y acceleration on the source Sprite so it will move towards the target coordinates at the speed given (in pixels per second)<br>
		 * You must give a maximum speed value, beyond which the Sprite won't go any faster.<br>
		 * If you don't need acceleration look at moveTowardsPoint() instead.
		 * 
		 * @param	source			The Sprite on which the acceleration will be set
		 * @param	target			The Point coordinates to move the source Sprite towards
		 * @param	speed			The speed it will accelerate in pixels per second
		 * @param	xSpeedMax		The maximum speed in pixels per second in which the sprite can move horizontally
		 * @param	ySpeedMax		The maximum speed in pixels per second in which the sprite can move vertically
		 */
		public accelerateTowardsPoint(source:GameObject, target:Point, speed:number, xSpeedMax:number, ySpeedMax:number)
		{
			var a:number = this.angleBetweenPoint(source, target);
			
			source.velocity.x = 0;
			source.velocity.y = 0;
			
			source.acceleration.x = Math.cos(a) * speed;
			source.acceleration.y = Math.sin(a) * speed;
			
			source.maxVelocity.x = xSpeedMax;
			source.maxVelocity.y = ySpeedMax;
		}

		/**
		 * Find the distance (in pixels, rounded) between two Sprites, taking their origin into account
		 * 
		 * @param	a	The first Sprite
		 * @param	b	The second Sprite
		 * @return	int	Distance (in pixels)
		 */
		public distanceBetween(a:GameObject, b:GameObject):number
		{
			var dx:number = (a.x + a.origin.x) - (b.x + b.origin.x);
			var dy:number = (a.y + a.origin.y) - (b.y + b.origin.y);
			
			return this._game.math.vectorLength(dx, dy);

		}

		/**
		 * Find the distance (in pixels, rounded) from an Sprite to the given Point, taking the source origin into account
		 * 
		 * @param	a		The Sprite
		 * @param	target	The Point
		 * @return	int		Distance (in pixels)
		 */
		public distanceToPoint(a:GameObject, target:Point):number
		{
			var dx:number = (a.x + a.origin.x) - (target.x);
			var dy:number = (a.y + a.origin.y) - (target.y);
			
			return this._game.math.vectorLength(dx, dy);
		}

		/**
		 * Find the distance (in pixels, rounded) from the object x/y and the mouse x/y
		 * 
		 * @param	a	The Sprite to test against
		 * @return	int	The distance between the given sprite and the mouse coordinates
		 */
		public distanceToMouse(a:GameObject):number
		{
		    var dx: number = (a.x + a.origin.x) - this._game.input.x;
		    var dy: number = (a.y + a.origin.y) - this._game.input.y;
			
			return this._game.math.vectorLength(dx, dy);
		}

		/**
		 * Find the angle (in radians) between an Sprite and an Point. The source sprite takes its x/y and origin into account.
		 * The angle is calculated in clockwise positive direction (down = 90 degrees positive, right = 0 degrees positive, up = 90 degrees negative)
		 * 
		 * @param	a			The Sprite to test from
		 * @param	target		The Point to angle the Sprite towards
		 * @param	asDegrees	If you need the value in degrees instead of radians, set to true
		 * 
		 * @return	Number The angle (in radians unless asDegrees is true)
		 */
		public angleBetweenPoint(a:GameObject, target:Point, asDegrees:bool = false):number
        {
			var dx:number = (target.x) - (a.x + a.origin.x);
			var dy:number = (target.y) - (a.y + a.origin.y);
			
			if (asDegrees)
			{
				return this._game.math.radiansToDegrees(Math.atan2(dy, dx));
			}
			else
			{
				return Math.atan2(dy, dx);
			}
        }

		/**
		 * Find the angle (in radians) between the two Sprite, taking their x/y and origin into account.
		 * The angle is calculated in clockwise positive direction (down = 90 degrees positive, right = 0 degrees positive, up = 90 degrees negative)
		 * 
		 * @param	a			The Sprite to test from
		 * @param	b			The Sprite to test to
		 * @param	asDegrees	If you need the value in degrees instead of radians, set to true
		 * 
		 * @return	Number The angle (in radians unless asDegrees is true)
		 */
		public angleBetween(a:GameObject, b:GameObject, asDegrees:bool = false):number
        {
			var dx:number = (b.x + b.origin.x) - (a.x + a.origin.x);
			var dy:number = (b.y + b.origin.y) - (a.y + a.origin.y);
			
			if (asDegrees)
			{
				return this._game.math.radiansToDegrees(Math.atan2(dy, dx));
			}
			else
			{
				return Math.atan2(dy, dx);
			}
        }

		/**
		 * Given the GameObject and speed calculate the velocity and return it as an Point based on the direction the sprite is facing
		 * 
		 * @param	parent	The Sprite to get the facing value from
		 * @param	speed	The speed it will move, in pixels per second sq
		 * 
		 * @return	An Point where Point.x contains the velocity x value and Point.y contains the velocity y value
		 */
		public velocityFromFacing(parent:GameObject, speed:number):Point
		{
			var a:number;
			
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

		}
		
		/**
		 * Find the angle (in radians) between an Sprite and the mouse, taking their x/y and origin into account.
		 * The angle is calculated in clockwise positive direction (down = 90 degrees positive, right = 0 degrees positive, up = 90 degrees negative)
		 * 
		 * @param	a			The Object to test from
		 * @param	asDegrees	If you need the value in degrees instead of radians, set to true
		 * 
		 * @return	Number The angle (in radians unless asDegrees is true)
		 */
		public angleBetweenMouse(a:GameObject, asDegrees:bool = false):number
		{
			//	In order to get the angle between the object and mouse, we need the objects screen coordinates (rather than world coordinates)
			var p:MicroPoint = a.getScreenXY();
			
			var dx:number = a._game.input.x - p.x;
			var dy:number = a._game.input.y - p.y;
			
			if (asDegrees)
			{
				return this._game.math.radiansToDegrees(Math.atan2(dy, dx));
			}
			else
			{
				return Math.atan2(dy, dx);
			}
		}

    }

}
