/// <reference path="../../Game.ts" />
/**
* Phaser - Finger
*
* A Finger object is used by the Touch manager and represents a single finger on the touch screen.
*/
var Phaser;
(function (Phaser) {
    var Finger = (function () {
        /**
        * Constructor
        * @param {Phaser.Game} game.
        * @return {Phaser.Finger} This object.
        */
        function Finger(game) {
            /**
            *
            * @property point
            * @type Point
            **/
            this.point = null;
            /**
            *
            * @property circle
            * @type Circle
            **/
            this.circle = null;
            /**
            *
            * @property withinGame
            * @type Boolean
            */
            this.withinGame = false;
            /**
            * The horizontal coordinate of point relative to the viewport in pixels, excluding any scroll offset
            * @property clientX
            * @type Number
            */
            this.clientX = -1;
            //
            /**
            * The vertical coordinate of point relative to the viewport in pixels, excluding any scroll offset
            * @property clientY
            * @type Number
            */
            this.clientY = -1;
            //
            /**
            * The horizontal coordinate of point relative to the viewport in pixels, including any scroll offset
            * @property pageX
            * @type Number
            */
            this.pageX = -1;
            /**
            * The vertical coordinate of point relative to the viewport in pixels, including any scroll offset
            * @property pageY
            * @type Number
            */
            this.pageY = -1;
            /**
            * The horizontal coordinate of point relative to the screen in pixels
            * @property screenX
            * @type Number
            */
            this.screenX = -1;
            /**
            * The vertical coordinate of point relative to the screen in pixels
            * @property screenY
            * @type Number
            */
            this.screenY = -1;
            /**
            * The horizontal coordinate of point relative to the game element
            * @property x
            * @type Number
            */
            this.x = -1;
            /**
            * The vertical coordinate of point relative to the game element
            * @property y
            * @type Number
            */
            this.y = -1;
            /**
            *
            * @property isDown
            * @type Boolean
            **/
            this.isDown = false;
            /**
            *
            * @property isUp
            * @type Boolean
            **/
            this.isUp = false;
            /**
            *
            * @property timeDown
            * @type Number
            **/
            this.timeDown = 0;
            /**
            *
            * @property duration
            * @type Number
            **/
            this.duration = 0;
            /**
            *
            * @property timeUp
            * @type Number
            **/
            this.timeUp = 0;
            /**
            *
            * @property justPressedRate
            * @type Number
            **/
            this.justPressedRate = 200;
            /**
            *
            * @property justReleasedRate
            * @type Number
            **/
            this.justReleasedRate = 200;
            this._game = game;
            this.active = false;
        }
        Finger.prototype.start = /**
        *
        * @method start
        * @param {Any} event
        */
        function (event) {
            this.identifier = event.identifier;
            this.target = event.target;
            //  populate geom objects
            if(this.point === null) {
                this.point = new Phaser.Point();
            }
            if(this.circle === null) {
                this.circle = new Phaser.Circle(0, 0, 44);
            }
            this.move(event);
            this.active = true;
            this.withinGame = true;
            this.isDown = true;
            this.isUp = false;
            this.timeDown = this._game.time.now;
        };
        Finger.prototype.move = /**
        *
        * @method move
        * @param {Any} event
        */
        function (event) {
            this.clientX = event.clientX;
            this.clientY = event.clientY;
            this.pageX = event.pageX;
            this.pageY = event.pageY;
            this.screenX = event.screenX;
            this.screenY = event.screenY;
            this.x = this.pageX - this._game.stage.offset.x;
            this.y = this.pageY - this._game.stage.offset.y;
            this.point.setTo(this.x, this.y);
            this.circle.setTo(this.x, this.y, 44);
            //  Droppings history (used for gestures and motion tracking)
            this.duration = this._game.time.now - this.timeDown;
        };
        Finger.prototype.leave = /**
        *
        * @method leave
        * @param {Any} event
        */
        function (event) {
            this.withinGame = false;
            this.move(event);
        };
        Finger.prototype.stop = /**
        *
        * @method stop
        * @param {Any} event
        */
        function (event) {
            this.active = false;
            this.withinGame = false;
            this.isDown = false;
            this.isUp = true;
            this.timeUp = this._game.time.now;
            this.duration = this.timeUp - this.timeDown;
        };
        Finger.prototype.justPressed = /**
        *
        * @method justPressed
        * @param {Number} [duration].
        * @return {Boolean}
        */
        function (duration) {
            if (typeof duration === "undefined") { duration = this.justPressedRate; }
            if(this.isDown === true && (this.timeDown + duration) > this._game.time.now) {
                return true;
            } else {
                return false;
            }
        };
        Finger.prototype.justReleased = /**
        *
        * @method justReleased
        * @param {Number} [duration].
        * @return {Boolean}
        */
        function (duration) {
            if (typeof duration === "undefined") { duration = this.justReleasedRate; }
            if(this.isUp === true && (this.timeUp + duration) > this._game.time.now) {
                return true;
            } else {
                return false;
            }
        };
        Finger.prototype.toString = /**
        * Returns a string representation of this object.
        * @method toString
        * @return {string} a string representation of the instance.
        **/
        function () {
            return "[{Finger (identifer=" + this.identifier + " active=" + this.active + " duration=" + this.duration + " withinGame=" + this.withinGame + " x=" + this.x + " y=" + this.y + " clientX=" + this.clientX + " clientY=" + this.clientY + " screenX=" + this.screenX + " screenY=" + this.screenY + " pageX=" + this.pageX + " pageY=" + this.pageY + ")}]";
        };
        return Finger;
    })();
    Phaser.Finger = Finger;    
})(Phaser || (Phaser = {}));
