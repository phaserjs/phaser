/// <reference path="../../Game.ts" />
/// <reference path="Finger.ts" />
/**
* Phaser - Touch
*
* The Touch class handles touch interactions with the game and the resulting Finger objects.
* http://www.w3.org/TR/touch-events/
* https://developer.mozilla.org/en-US/docs/DOM/TouchList
* http://www.html5rocks.com/en/mobile/touchandmouse/
* Note: Android 2.x only supports 1 touch event at once, no multi-touch
*
*  @todo       Try and resolve update lag in Chrome/Android
*              Gestures (pinch, zoom, swipe)
*              GameObject Touch
*              Touch point within GameObject
*              Input Zones (mouse and touch) - lock entities within them + axis aligned drags
*/
var Phaser;
(function (Phaser) {
    var Touch = (function () {
        /**
        * Constructor
        * @param {Game} game.
        * @return {Touch} This object.
        */
        function Touch(game) {
            /**
            *
            * @property x
            * @type Number
            **/
            this.x = 0;
            /**
            *
            * @property y
            * @type Number
            **/
            this.y = 0;
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
            this.isUp = true;
            this._game = game;
            this.finger1 = new Phaser.Finger(this._game);
            this.finger2 = new Phaser.Finger(this._game);
            this.finger3 = new Phaser.Finger(this._game);
            this.finger4 = new Phaser.Finger(this._game);
            this.finger5 = new Phaser.Finger(this._game);
            this.finger6 = new Phaser.Finger(this._game);
            this.finger7 = new Phaser.Finger(this._game);
            this.finger8 = new Phaser.Finger(this._game);
            this.finger9 = new Phaser.Finger(this._game);
            this.finger10 = new Phaser.Finger(this._game);
            this._fingers = [
                this.finger1, 
                this.finger2, 
                this.finger3, 
                this.finger4, 
                this.finger5, 
                this.finger6, 
                this.finger7, 
                this.finger8, 
                this.finger9, 
                this.finger10
            ];
            this.touchDown = new Phaser.Signal();
            this.touchUp = new Phaser.Signal();
            this.start();
        }
        Touch.prototype.start = /**
        *
        * @method start
        */
        function () {
            var _this = this;
            this._game.stage.canvas.addEventListener('touchstart', function (event) {
                return _this.onTouchStart(event);
            }, false);
            this._game.stage.canvas.addEventListener('touchmove', function (event) {
                return _this.onTouchMove(event);
            }, false);
            this._game.stage.canvas.addEventListener('touchend', function (event) {
                return _this.onTouchEnd(event);
            }, false);
            this._game.stage.canvas.addEventListener('touchenter', function (event) {
                return _this.onTouchEnter(event);
            }, false);
            this._game.stage.canvas.addEventListener('touchleave', function (event) {
                return _this.onTouchLeave(event);
            }, false);
            this._game.stage.canvas.addEventListener('touchcancel', function (event) {
                return _this.onTouchCancel(event);
            }, false);
            document.addEventListener('touchmove', function (event) {
                return _this.consumeTouchMove(event);
            }, false);
        };
        Touch.prototype.consumeTouchMove = /**
        * Prevent iOS bounce-back (doesn't work?)
        * @method consumeTouchMove
        * @param {Any} event
        **/
        function (event) {
            event.preventDefault();
        };
        Touch.prototype.onTouchStart = /**
        *
        * @method onTouchStart
        * @param {Any} event
        **/
        function (event) {
            event.preventDefault();
            //  A list of all the touch points that BECAME active with the current event
            //  https://developer.mozilla.org/en-US/docs/DOM/TouchList
            //  event.targetTouches = list of all touches on the TARGET ELEMENT (i.e. game dom element)
            //  event.touches = list of all touches on the ENTIRE DOCUMENT, not just the target element
            //  event.changedTouches = the touches that CHANGED in this event, not the total number of them
            for(var i = 0; i < event.changedTouches.length; i++) {
                for(var f = 0; f < this._fingers.length; f++) {
                    if(this._fingers[f].active === false) {
                        this._fingers[f].start(event.changedTouches[i]);
                        this.x = this._fingers[f].x;
                        this.y = this._fingers[f].y;
                        this._game.input.x = this.x * this._game.input.scaleX;
                        this._game.input.y = this.y * this._game.input.scaleY;
                        this.touchDown.dispatch(this._fingers[f].x, this._fingers[f].y, this._fingers[f].timeDown, this._fingers[f].timeUp, this._fingers[f].duration);
                        this._game.input.onDown.dispatch(this._game.input.x, this._game.input.y, this._fingers[f].timeDown);
                        this.isDown = true;
                        this.isUp = false;
                        break;
                    }
                }
            }
        };
        Touch.prototype.onTouchCancel = /**
        * Doesn't appear to be supported by most browsers yet
        * @method onTouchCancel
        * @param {Any} event
        **/
        function (event) {
            event.preventDefault();
            //  Touch cancel - touches that were disrupted (perhaps by moving into a plugin or browser chrome)
            //  http://www.w3.org/TR/touch-events/#dfn-touchcancel
            //  event.changedTouches = the touches that CHANGED in this event, not the total number of them
            for(var i = 0; i < event.changedTouches.length; i++) {
                for(var f = 0; f < this._fingers.length; f++) {
                    if(this._fingers[f].identifier === event.changedTouches[i].identifier) {
                        this._fingers[f].stop(event.changedTouches[i]);
                        break;
                    }
                }
            }
        };
        Touch.prototype.onTouchEnter = /**
        * Doesn't appear to be supported by most browsers yet
        * @method onTouchEnter
        * @param {Any} event
        **/
        function (event) {
            event.preventDefault();
            //  For touch enter and leave its a list of the touch points that have entered or left the target
            //  event.targetTouches = list of all touches on the TARGET ELEMENT (i.e. game dom element)
            //  event.touches = list of all touches on the ENTIRE DOCUMENT, not just the target element
            //  event.changedTouches = the touches that CHANGED in this event, not the total number of them
            for(var i = 0; i < event.changedTouches.length; i++) {
                for(var f = 0; f < this._fingers.length; f++) {
                    if(this._fingers[f].active === false) {
                        this._fingers[f].start(event.changedTouches[i]);
                        break;
                    }
                }
            }
        };
        Touch.prototype.onTouchLeave = /**
        * Doesn't appear to be supported by most browsers yet
        * @method onTouchLeave
        * @param {Any} event
        **/
        function (event) {
            event.preventDefault();
            //  For touch enter and leave its a list of the touch points that have entered or left the target
            //  event.changedTouches = the touches that CHANGED in this event, not the total number of them
            for(var i = 0; i < event.changedTouches.length; i++) {
                for(var f = 0; f < this._fingers.length; f++) {
                    if(this._fingers[f].identifier === event.changedTouches[i].identifier) {
                        this._fingers[f].leave(event.changedTouches[i]);
                        break;
                    }
                }
            }
        };
        Touch.prototype.onTouchMove = /**
        *
        * @method onTouchMove
        * @param {Any} event
        **/
        function (event) {
            event.preventDefault();
            //  event.targetTouches = list of all touches on the TARGET ELEMENT (i.e. game dom element)
            //  event.touches = list of all touches on the ENTIRE DOCUMENT, not just the target element
            //  event.changedTouches = the touches that CHANGED in this event, not the total number of them
            for(var i = 0; i < event.changedTouches.length; i++) {
                for(var f = 0; f < this._fingers.length; f++) {
                    if(this._fingers[f].identifier === event.changedTouches[i].identifier) {
                        this._fingers[f].move(event.changedTouches[i]);
                        this.x = this._fingers[f].x;
                        this.y = this._fingers[f].y;
                        this._game.input.x = this.x * this._game.input.scaleX;
                        this._game.input.y = this.y * this._game.input.scaleY;
                        break;
                    }
                }
            }
        };
        Touch.prototype.onTouchEnd = /**
        *
        * @method onTouchEnd
        * @param {Any} event
        **/
        function (event) {
            event.preventDefault();
            //  For touch end its a list of the touch points that have been removed from the surface
            //  https://developer.mozilla.org/en-US/docs/DOM/TouchList
            //  event.changedTouches = the touches that CHANGED in this event, not the total number of them
            for(var i = 0; i < event.changedTouches.length; i++) {
                for(var f = 0; f < this._fingers.length; f++) {
                    if(this._fingers[f].identifier === event.changedTouches[i].identifier) {
                        this._fingers[f].stop(event.changedTouches[i]);
                        this.x = this._fingers[f].x;
                        this.y = this._fingers[f].y;
                        this._game.input.x = this.x * this._game.input.scaleX;
                        this._game.input.y = this.y * this._game.input.scaleY;
                        this.touchUp.dispatch(this._fingers[f].x, this._fingers[f].y, this._fingers[f].timeDown, this._fingers[f].timeUp, this._fingers[f].duration);
                        this._game.input.onUp.dispatch(this._game.input.x, this._game.input.y, this._fingers[f].timeUp);
                        this.isDown = false;
                        this.isUp = true;
                        break;
                    }
                }
            }
        };
        Touch.prototype.calculateDistance = /**
        *
        * @method calculateDistance
        * @param {Finger} finger1
        * @param {Finger} finger2
        **/
        function (finger1, finger2) {
        };
        Touch.prototype.calculateAngle = /**
        *
        * @method calculateAngle
        * @param {Finger} finger1
        * @param {Finger} finger2
        **/
        function (finger1, finger2) {
        };
        Touch.prototype.checkOverlap = /**
        *
        * @method checkOverlap
        * @param {Finger} finger1
        * @param {Finger} finger2
        **/
        function (finger1, finger2) {
        };
        Touch.prototype.update = /**
        *
        * @method update
        */
        function () {
        };
        Touch.prototype.stop = /**
        *
        * @method stop
        */
        function () {
            //this._domElement.addEventListener('touchstart', (event) => this.onTouchStart(event), false);
            //this._domElement.addEventListener('touchmove', (event) => this.onTouchMove(event), false);
            //this._domElement.addEventListener('touchend', (event) => this.onTouchEnd(event), false);
            //this._domElement.addEventListener('touchenter', (event) => this.onTouchEnter(event), false);
            //this._domElement.addEventListener('touchleave', (event) => this.onTouchLeave(event), false);
            //this._domElement.addEventListener('touchcancel', (event) => this.onTouchCancel(event), false);
                    };
        Touch.prototype.reset = /**
        *
        * @method reset
        **/
        function () {
            this.isDown = false;
            this.isUp = false;
        };
        return Touch;
    })();
    Phaser.Touch = Touch;    
})(Phaser || (Phaser = {}));
