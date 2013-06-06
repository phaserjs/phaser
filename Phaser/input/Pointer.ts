/// <reference path="../Game.ts" />
/// <reference path="../core/Vec2.ts" />

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

            this.game = game;

            this.id = id;
            this.active = false;
            this.position = new Vec2;
            this.positionDown = new Vec2;
            this.circle = new Circle(0, 0, 44);

            if (id == 0)
            {
                this.isMouse = true;
            }

        }

        /**
        * Local private reference to game.
        * @property game
        * @type {Phaser.Game}
        * @private
        **/
        public game: Game;

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

        //  Monitor events outside of a state reset loop
        private _stateReset: bool = false;

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
        * @type {Vec2}
        **/
        public positionDown: Vec2 = null;

        /**
        * A Vector object containing the current position of the Pointer on the screen.
        * @property position
        * @type {Vec2}
        **/
        public position: Vec2 = null;

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

            return this.game.time.now - this.timeDown;

        }

        /**
        * The Game Object this Pointer is currently over / touching / dragging.
        * @property targetObject
        * @type {Any}
        **/
        public targetObject = null;

        /**
        * Gets the X value of this Pointer in world coordinate space (is it properly scaled?)
        * @param {Camera} [camera]
        */
        public getWorldX(camera?: Camera = this.game.camera) {

            return camera.worldView.x + this.x;

        }

        /**
        * Gets the Y value of this Pointer in world coordinate space
        * @param {Camera} [camera]
        */
        public getWorldY(camera?: Camera = this.game.camera) {

            return camera.worldView.y + this.y;

        }

        /**
        * Gets the X value of this Pointer in world coordinate space
        * @param {Camera} [camera]
        */
        public get scaledX():number {
            return Math.floor(this.x * this.game.input.scaleX);
        }

        /**
        * Gets the Y value of this Pointer in world coordinate space
        * @param {Camera} [camera]
        */
        public get scaledY():number {
            return Math.floor(this.y * this.game.input.scaleY);
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
            if (this.game.paused == true && this.game.stage.scale.incorrectOrientation == false)
            {
                this.game.stage.resumeGame();
                return this;
            }

            this._history.length = 0;

            this.active = true;
            this.withinGame = true;
            this.isDown = true;
            this.isUp = false;
            this.timeDown = this.game.time.now;
            this._holdSent = false;

            // x and y are the old values here?
            this.positionDown.setTo(this.x, this.y);

            this.move(event);

            if (this.game.input.multiInputOverride == Input.MOUSE_OVERRIDES_TOUCH || this.game.input.multiInputOverride == Input.MOUSE_TOUCH_COMBINE || (this.game.input.multiInputOverride == Input.TOUCH_OVERRIDES_MOUSE && this.game.input.currentPointers == 0))
            {
                this.game.input.x = this.x * this.game.input.scaleX;
                this.game.input.y = this.y * this.game.input.scaleY;
                this.game.input.onDown.dispatch(this);
            }

            this._stateReset = false;
            this.totalTouches++;

            if (this.isMouse == false)
            {
                this.game.input.currentPointers++;
            }

            if (this.targetObject !== null)
            {
                this.targetObject.input._touchedHandler(this);
            }

            return this;

        }

        public update() {

            if (this.active)
            {
                if (this._holdSent == false && this.duration >= this.game.input.holdRate)
                {
                    if (this.game.input.multiInputOverride == Input.MOUSE_OVERRIDES_TOUCH || this.game.input.multiInputOverride == Input.MOUSE_TOUCH_COMBINE || (this.game.input.multiInputOverride == Input.TOUCH_OVERRIDES_MOUSE && this.game.input.currentPointers == 0))
                    {
                        this.game.input.onHold.dispatch(this);
                    }

                    this._holdSent = true;
                }

                //  Update the droppings history
                if (this.game.input.recordPointerHistory && this.game.time.now >= this._nextDrop)
                {
                    this._nextDrop = this.game.time.now + this.game.input.recordRate;
                    this._history.push({ x: this.position.x, y: this.position.y });

                    if (this._history.length > this.game.input.recordLimit)
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

            this.x = this.pageX - this.game.stage.offset.x;
            this.y = this.pageY - this.game.stage.offset.y;

            this.position.setTo(this.x, this.y);
            this.circle.x = this.x;
            this.circle.y = this.y;

            if (this.game.input.multiInputOverride == Input.MOUSE_OVERRIDES_TOUCH || this.game.input.multiInputOverride == Input.MOUSE_TOUCH_COMBINE || (this.game.input.multiInputOverride == Input.TOUCH_OVERRIDES_MOUSE && this.game.input.currentPointers == 0))
            {
                this.game.input.x = this.x * this.game.input.scaleX;
                this.game.input.y = this.y * this.game.input.scaleY;
                this.game.input.position.setTo(this.game.input.x, this.game.input.y);
                this.game.input.circle.x = this.game.input.x;
                this.game.input.circle.y = this.game.input.y;
            }

            if (this.targetObject !== null)
            {
                if (this.targetObject.input.update(this) == false)
                {
                    this.targetObject = null;
                }
            }
            else
            {
                //  Build our temporary click stack
                var _highestRenderID = -1;
                var _highestRenderObject: number = -1;

                for (var i = 0; i < this.game.input.totalTrackedObjects; i++)
                {
                    if (this.game.input.inputObjects[i].input.checkPointerOver(this) && this.game.input.inputObjects[i].renderOrderID > _highestRenderID)
                    {
                        _highestRenderID = this.game.input.inputObjects[i].renderOrderID;
                        _highestRenderObject = i;
                    }
                }

                if (_highestRenderObject !== -1)
                {
                    //console.log('setting target');
                    this.targetObject = this.game.input.inputObjects[_highestRenderObject];
                    this.targetObject.input._pointerOverHandler(this);
                }

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

            if (this._stateReset)
            {
                event.preventDefault();
                return;
            }

            this.timeUp = this.game.time.now;

            if (this.game.input.multiInputOverride == Input.MOUSE_OVERRIDES_TOUCH || this.game.input.multiInputOverride == Input.MOUSE_TOUCH_COMBINE || (this.game.input.multiInputOverride == Input.TOUCH_OVERRIDES_MOUSE && this.game.input.currentPointers == 0))
            {
                this.game.input.onUp.dispatch(this);

                //  Was it a tap?
                if (this.duration >= 0 && this.duration <= this.game.input.tapRate)
                {
                    //  Was it a double-tap?
                    if (this.timeUp - this.previousTapTime < this.game.input.doubleTapRate)
                    {
                        //  Yes, let's dispatch the signal then with the 2nd parameter set to true
                        this.game.input.onTap.dispatch(this, true);
                    }
                    else
                    {
                        //  Wasn't a double-tap, so dispatch a single tap signal
                        this.game.input.onTap.dispatch(this, false);
                    }

                    this.previousTapTime = this.timeUp;
                }

            }

            //  Mouse is always active
            if (this.id > 0)
            {
                this.active = false;
            }

            this.withinGame = false;
            this.isDown = false;
            this.isUp = true;

            if (this.isMouse == false)
            {
                this.game.input.currentPointers--;
            }

            for (var i = 0; i < this.game.input.totalTrackedObjects; i++)
            {
                if (this.game.input.inputObjects[i].input.enabled)
                {
                    this.game.input.inputObjects[i].input._releasedHandler(this);
                }
            }

            if (this.targetObject)
            {
                this.targetObject.input._releasedHandler(this);
            }

            this.targetObject = null;

            return this;

        }

        /**
        * The Pointer is considered justPressed if the time it was pressed onto the touchscreen or clicked is less than justPressedRate
        * @method justPressed
        * @param {Number} [duration].
        * @return {Boolean}
        */
        public justPressed(duration?: number = this.game.input.justPressedRate): bool {

            if (this.isDown === true && (this.timeDown + duration) > this.game.time.now)
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
        public justReleased(duration?: number = this.game.input.justReleasedRate): bool {

            if (this.isUp === true && (this.timeUp + duration) > this.game.time.now)
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

            if (this.isMouse == false)
            {
                this.active = false;
            }

            this.identifier = null;
            this.isDown = false;
            this.isUp = true;
            this.totalTouches = 0;
            this._holdSent = false;
            this._history.length = 0;
            this._stateReset = true;

            if (this.targetObject)
            {
                this.targetObject.input._releasedHandler(this);
            }

            this.targetObject = null;

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

            this.game.stage.context.beginPath();
            this.game.stage.context.arc(this.x, this.y, this.circle.radius, 0, Math.PI * 2);

            if (this.active)
            {
                this.game.stage.context.fillStyle = 'rgba(0,255,0,0.5)';
                this.game.stage.context.strokeStyle = 'rgb(0,255,0)';
            }
            else
            {
                this.game.stage.context.fillStyle = 'rgba(255,0,0,0.5)';
                this.game.stage.context.strokeStyle = 'rgb(100,0,0)';
            }

            this.game.stage.context.fill();
            this.game.stage.context.closePath();

            //  Render the points
            this.game.stage.context.beginPath();
            this.game.stage.context.moveTo(this.positionDown.x, this.positionDown.y);
            this.game.stage.context.lineTo(this.position.x, this.position.y);
            this.game.stage.context.lineWidth = 2;
            this.game.stage.context.stroke();
            this.game.stage.context.closePath();

            //  Render the text
            this.game.stage.context.fillStyle = 'rgb(255,255,255)';
            this.game.stage.context.font = 'Arial 16px';
            this.game.stage.context.fillText('ID: ' + this.id + " Active: " + this.active, this.x, this.y - 100);
            this.game.stage.context.fillText('Screen X: ' + this.x + " Screen Y: " + this.y, this.x, this.y - 80);
            this.game.stage.context.fillText('Duration: ' + this.duration + " ms", this.x, this.y - 60);

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