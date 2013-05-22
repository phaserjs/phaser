/// <reference path="../../Game.ts" />
/// <reference path="../../geom/Vector2.ts" />

/**
* Phaser - Pointer
*
* A Pointer object is used by the Touch and MSPoint managers and represents a single finger on the touch screen.
*/

module Phaser {

    export class Pointer {

        /**
        * Constructor
        * @param {Phaser.Game} game.
        * @return {Phaser.Pointer} This object.
        */
        constructor(game: Game, id: number) {

            this._game = game;

            this.id = id;
            this.active = false;
            this.position = new Vector2;
            this.positionDown = new Vector2;
            this.circle = new Circle(0, 0, 44);

            if (id == 0)
            {
                this.isMouse = true;
            }

        }

        /**
        * Local private reference to game.
        * @property _game
        * @type {Phaser.Game}
        * @private
        **/
        private _game: Game;

        /**
        * Local private variable to store the status of dispatching a hold event
        * @property _holdSent
        * @type {Boolean}
        * @private
        */
        private _holdSent: bool = false;

        /**
        * Local private variable storing the short-term history of pointer movements
        * @property _history
        * @type {Array}
        * @private
        */
        private _history = [];

        /**
        * Local private variable storing the time at which the next history drop should occur
        * @property _lastDrop
        * @type {Number}
        * @private
        */
        private _nextDrop: number = 0;

        /**
        * The Pointer ID (a number between 1 and 10, 0 is reserved for the mouse pointer specifically)
        * @property id
        * @type {Number}
        */
        public id: number;

        /**
        * An identification number for each touch point.
        * When a touch point becomes active, it is assigned an identifier that is distinct from any other active touch point.
        * While the touch point remains active, all events that refer to it are assigned the same identifier.
        * @property identifier
        * @type {Number}
        */
        public identifier: number;

        /**
        * Is this Pointer active or not? An active Pointer is one that is in contact with the touch screen.
        * @property active
        * @type {Boolean}
        */
        public active: bool;

        /**
        * A Vector object containing the initial position when the Pointer was engaged with the screen.
        * @property positionDown
        * @type {Vector2}
        **/
        public positionDown: Vector2 = null;

        /**
        * A Vector object containing the current position of the Pointer on the screen.
        * @property position
        * @type {Vector2}
        **/
        public position: Vector2 = null;

        /**
        * A Circle object centered on the x/y screen coordinates of the Pointer.
        * Default size of 44px (Apple's recommended "finger tip" size)
        * @property circle
        * @type {Circle}
        **/
        public circle: Circle = null;

        /**
        *
        * @property withinGame
        * @type {Boolean}
        */
        public withinGame: bool = false;

        /**
        * If this Pointer is a mouse the button property holds the value of which mouse button was pressed down
        * @property button
        * @type {Number}
        */
        public button: number;

        /**
        * The horizontal coordinate of point relative to the viewport in pixels, excluding any scroll offset
        * @property clientX
        * @type {Number}
        */
        public clientX: number = -1;

        /**
        * The vertical coordinate of point relative to the viewport in pixels, excluding any scroll offset
        * @property clientY
        * @type {Number}
        */
        public clientY: number = -1;

        /**
        * The horizontal coordinate of point relative to the viewport in pixels, including any scroll offset
        * @property pageX
        * @type {Number}
        */
        public pageX: number = -1;

        /**
        * The vertical coordinate of point relative to the viewport in pixels, including any scroll offset
        * @property pageY
        * @type {Number}
        */
        public pageY: number = -1;

        /**
        * The horizontal coordinate of point relative to the screen in pixels
        * @property screenX
        * @type {Number}
        */
        public screenX: number = -1;

        /**
        * The vertical coordinate of point relative to the screen in pixels
        * @property screenY
        * @type {Number}
        */
        public screenY: number = -1;

        /**
        * The horizontal coordinate of point relative to the game element
        * @property x
        * @type {Number}
        */
        public x: number = -1;

        /**
        * The vertical coordinate of point relative to the game element
        * @property y
        * @type {Number}
        */
        public y: number = -1;

        /**
        * The Element on which the touch point started when it was first placed on the surface, even if the touch point has since moved outside the interactive area of that element.
        * @property target
        * @type {Any}
        */
        public target;

        /**
        * If the Pointer is a mouse this is true, otherwise false
        * @property isMouse
        * @type {Boolean}
        **/
        public isMouse: bool = false;

        /**
        * If the Pointer is touching the touchscreen, or the mouse button is held down, isDown is set to true
        * @property isDown
        * @type {Boolean}
        **/
        public isDown: bool = false;

        /**
        * If the Pointer is not touching the touchscreen, or the mouse button is up, isUp is set to true
        * @property isUp
        * @type {Boolean}
        **/
        public isUp: bool = true;

        /**
        * A timestamp representing when the Pointer first touched the touchscreen.
        * @property timeDown
        * @type {Number}
        **/
        public timeDown: number = 0;

        /**
        * A timestamp representing when the Pointer left the touchscreen.
        * @property timeUp
        * @type {Number}
        **/
        public timeUp: number = 0;

        /**
        * A timestamp representing when the Pointer was last tapped or clicked
        * @property previousTapTime
        * @type {Number}
        **/
        public previousTapTime: number = 0;

        /**
        * The total number of times this Pointer has been touched to the touchscreen
        * @property totalTouches
        * @type {Number}
        **/
        public totalTouches: number = 0;

        /**
        * How long the Pointer has been depressed on the touchscreen. If not currently down it returns -1.
        * @property duration
        * @type {Number}
        **/
        public get duration(): number {

            if (this.isUp)
            {
                return -1;
            }

            return this._game.time.now - this.timeDown;

        }

        /**
        * Gets the X value of this Pointer in world coordinate space
        * @param {Camera} [camera]
        */
        public getWorldX(camera?: Camera = this._game.camera) {

            return camera.worldView.x + this.x;

        }

        /**
        * Gets the Y value of this Pointer in world coordinate space
        * @param {Camera} [camera]
        */
        public getWorldY(camera?: Camera = this._game.camera) {

            return camera.worldView.y + this.y;

        }

        /**
        * Called when the Pointer is pressed onto the touchscreen
        * @method start
        * @param {Any} event
        */
        public start(event): Pointer {

            this.identifier = event.identifier;
            this.target = event.target;

            if (event.button)
            {
                this.button = event.button;
            }

            //  Fix to stop rogue browser plugins from blocking the visibility state event
            if (this._game.paused == true)
            {
                this._game.stage.resumeGame();
                return this;
            }

            this._history.length = 0;

            this.move(event);

            this.positionDown.setTo(this.x, this.y);

            this.active = true;
            this.withinGame = true;
            this.isDown = true;
            this.isUp = false;
            this.timeDown = this._game.time.now;
            this._holdSent = false;

            if (this._game.input.multiInputOverride == Input.MOUSE_OVERRIDES_TOUCH || this._game.input.multiInputOverride == Input.MOUSE_TOUCH_COMBINE || (this._game.input.multiInputOverride == Input.TOUCH_OVERRIDES_MOUSE && this._game.input.currentPointers == 0))
            {
                this._game.input.x = this.x * this._game.input.scaleX;
                this._game.input.y = this.y * this._game.input.scaleY;
                this._game.input.onDown.dispatch(this);
            }

            this.totalTouches++;

            if (this.isMouse == false)
            {
                this._game.input.currentPointers++;
            }

            return this;

        }

        public update() {

            if (this.active)
            {
                if (this._holdSent == false && this.duration >= this._game.input.holdRate)
                {
                    if (this._game.input.multiInputOverride == Input.MOUSE_OVERRIDES_TOUCH || this._game.input.multiInputOverride == Input.MOUSE_TOUCH_COMBINE || (this._game.input.multiInputOverride == Input.TOUCH_OVERRIDES_MOUSE && this._game.input.currentPointers == 0))
                    {
                        this._game.input.onHold.dispatch(this);
                    }

                    this._holdSent = true;
                }

                //  Update the droppings history
                if (this._game.input.recordPointerHistory && this._game.time.now >= this._nextDrop)
                {
                    this._nextDrop = this._game.time.now + this._game.input.recordRate;
                    this._history.push({ x: this.position.x, y: this.position.y });

                    if (this._history.length > this._game.input.recordLimit)
                    {
                        this._history.shift();
                    }
                }

            }

        }

        /**
        * Called when the Pointer is moved on the touchscreen
        * @method move
        * @param {Any} event
        */
        public move(event): Pointer {

            if (event.button)
            {
                this.button = event.button;
            }

            this.clientX = event.clientX;
            this.clientY = event.clientY;
            this.pageX = event.pageX;
            this.pageY = event.pageY;
            this.screenX = event.screenX;
            this.screenY = event.screenY;

            this.x = this.pageX - this._game.stage.offset.x;
            this.y = this.pageY - this._game.stage.offset.y;

            this.position.setTo(this.x, this.y);
            this.circle.x = this.x;
            this.circle.y = this.y;

            if (this._game.input.multiInputOverride == Input.MOUSE_OVERRIDES_TOUCH || this._game.input.multiInputOverride == Input.MOUSE_TOUCH_COMBINE || (this._game.input.multiInputOverride == Input.TOUCH_OVERRIDES_MOUSE && this._game.input.currentPointers == 0))
            {
                this._game.input.x = this.x * this._game.input.scaleX;
                this._game.input.y = this.y * this._game.input.scaleY;
                this._game.input.position.setTo(this._game.input.x, this._game.input.y);
                this._game.input.circle.x = this._game.input.x;
                this._game.input.circle.y = this._game.input.y;
            }

            return this;

        }

        /**
        * Called when the Pointer leaves the target area
        * @method leave
        * @param {Any} event
        */
        public leave(event) {

            this.withinGame = false;
            this.move(event);

        }

        /**
        * Called when the Pointer leaves the touchscreen
        * @method stop
        * @param {Any} event
        */
        public stop(event): Pointer {

            this.timeUp = this._game.time.now;

            if (this._game.input.multiInputOverride == Input.MOUSE_OVERRIDES_TOUCH || this._game.input.multiInputOverride == Input.MOUSE_TOUCH_COMBINE || (this._game.input.multiInputOverride == Input.TOUCH_OVERRIDES_MOUSE && this._game.input.currentPointers == 0))
            {
                this._game.input.onUp.dispatch(this);

                //  Was it a tap?
                if (this.duration >= 0 && this.duration <= this._game.input.tapRate)
                {
                    //  Was it a double-tap?
                    if (this.timeUp - this.previousTapTime < this._game.input.doubleTapRate)
                    {
                        //  Yes, let's dispatch the signal then with the 2nd parameter set to true
                        this._game.input.onTap.dispatch(this, true);
                    }
                    else
                    {
                        //  Wasn't a double-tap, so dispatch a single tap signal
                        this._game.input.onTap.dispatch(this, false);
                    }

                    this.previousTapTime = this.timeUp;
                }

            }

            this.active = false;
            this.withinGame = false;
            this.isDown = false;
            this.isUp = true;

            if (this.isMouse == false)
            {
                this._game.input.currentPointers--;
            }

            return this;

        }

        /**
        * The Pointer is considered justPressed if the time it was pressed onto the touchscreen or clicked is less than justPressedRate
        * @method justPressed
        * @param {Number} [duration].
        * @return {Boolean}
        */
        public justPressed(duration?: number = this._game.input.justPressedRate): bool {

            if (this.isDown === true && (this.timeDown + duration) > this._game.time.now)
            {
                return true;
            }
            else
            {
                return false;
            }

        }

        /**
        * The Pointer is considered justReleased if the time it left the touchscreen is less than justReleasedRate
        * @method justReleased
        * @param {Number} [duration].
        * @return {Boolean}
        */
        public justReleased(duration?: number = this._game.input.justReleasedRate): bool {

            if (this.isUp === true && (this.timeUp + duration) > this._game.time.now)
            {
                return true;
            }
            else
            {
                return false;
            }

        }

        /**
        * Resets the Pointer properties. Called by Input.reset when you perform a State change.
        * @method reset
        */
        public reset() {

            this.active = false;
            this.identifier = null;
            this.isDown = false;
            this.isUp = true;
            this.totalTouches = 0;
            this._holdSent = false;
            this._history.length = 0;

        }

        /**
        * Renders the Pointer.circle object onto the stage in green if down or red if up.
        * @method renderDebug
        */
        public renderDebug(hideIfUp: bool = false) {

            if (hideIfUp == true && this.isUp == true)
            {
                return;
            }

            this._game.stage.context.beginPath();
            this._game.stage.context.arc(this.x, this.y, this.circle.radius, 0, Math.PI * 2);

            if (this.active)
            {
                this._game.stage.context.fillStyle = 'rgba(0,255,0,0.5)';
                this._game.stage.context.strokeStyle = 'rgb(0,255,0)';
            }
            else
            {
                this._game.stage.context.fillStyle = 'rgba(255,0,0,0.5)';
                this._game.stage.context.strokeStyle = 'rgb(100,0,0)';
            }

            this._game.stage.context.fill();
            this._game.stage.context.closePath();

            //  Render the points
            this._game.stage.context.beginPath();
            this._game.stage.context.moveTo(this.positionDown.x, this.positionDown.y);
            this._game.stage.context.lineTo(this.position.x, this.position.y);
            this._game.stage.context.lineWidth = 2;
            this._game.stage.context.stroke();
            this._game.stage.context.closePath();

            //  Render the text
            this._game.stage.context.fillStyle = 'rgb(255,255,255)';
            this._game.stage.context.font = 'Arial 16px';
            this._game.stage.context.fillText('ID: ' + this.id + " Active: " + this.active, this.x, this.y - 100);
            this._game.stage.context.fillText('Screen X: ' + this.x + " Screen Y: " + this.y, this.x, this.y - 80);
            this._game.stage.context.fillText('Duration: ' + this.duration + " ms", this.x, this.y - 60);

        }

        /**
         * Returns a string representation of this object.
         * @method toString
         * @return {String} a string representation of the instance.
         **/
        public toString(): string {

            return "[{Pointer (id=" + this.id + " identifer=" + this.identifier + " active=" + this.active + " duration=" + this.duration + " withinGame=" + this.withinGame + " x=" + this.x + " y=" + this.y + " clientX=" + this.clientX + " clientY=" + this.clientY + " screenX=" + this.screenX + " screenY=" + this.screenY + " pageX=" + this.pageX + " pageY=" + this.pageY + ")}]";

        }

    }

}