/// <reference path="../../Game.ts" />
/// <reference path="../../Signal.ts" />
/// <reference path="Finger.ts" />

/**
 *	Input - Touch
 *
 *	@desc 		http://www.w3.org/TR/touch-events/
 *              https://developer.mozilla.org/en-US/docs/DOM/TouchList
 *              http://www.html5rocks.com/en/mobile/touchandmouse/
 *              Android 2.x only supports 1 touch event at once, no multi-touch
 *
 *	@version 	1.1 - 27th February 2013
 *	@author 	Richard Davey
 *
 *  @todo       Try and resolve update lag in Chrome/Android
 *              Gestures (pinch, zoom, swipe)
 *              GameObject Touch
 *              Touch point within GameObject
 *              Input Zones (mouse and touch) - lock entities within them + axis aligned drags
 */

class Touch {

    /** 
    * Constructor
    * @param {Game} game.
    * @return {Touch} This object.
    */
    constructor(game: Game) {

        this._game = game;

        this.finger1 = new Finger(this._game);
        this.finger2 = new Finger(this._game);
        this.finger3 = new Finger(this._game);
        this.finger4 = new Finger(this._game);
        this.finger5 = new Finger(this._game);
        this.finger6 = new Finger(this._game);
        this.finger7 = new Finger(this._game);
        this.finger8 = new Finger(this._game);
        this.finger9 = new Finger(this._game);
        this.finger10 = new Finger(this._game);

        this._fingers = [this.finger1, this.finger2, this.finger3, this.finger4, this.finger5, this.finger6, this.finger7, this.finger8, this.finger9, this.finger10];

        this.touchDown = new Signal();
        this.touchUp = new Signal();

        this.start();

    }

    /** 
    * 
    * @property _game
    * @type Game
    * @private
    **/
    private _game: Game;

    /** 
    * 
    * @property x
    * @type Number
    **/
    public x: number = 0;

    /** 
    * 
    * @property y
    * @type Number
    **/
    public y: number = 0;

    /** 
    * 
    * @property _fingers
    * @type Array
    * @private
    **/
    private _fingers: Finger[];

    /** 
    * 
    * @property finger1
    * @type Finger
    **/
    public finger1: Finger;

    /** 
    * 
    * @property finger2
    * @type Finger
    **/
    public finger2: Finger;

    /** 
    * 
    * @property finger3
    * @type Finger
    **/
    public finger3: Finger;

    /** 
    * 
    * @property finger4
    * @type Finger
    **/
    public finger4: Finger;

    /** 
    * 
    * @property finger5
    * @type Finger
    **/
    public finger5: Finger;

    /** 
    * 
    * @property finger6
    * @type Finger
    **/
    public finger6: Finger;

    /** 
    * 
    * @property finger7
    * @type Finger
    **/
    public finger7: Finger;

    /** 
    * 
    * @property finger8
    * @type Finger
    **/
    public finger8: Finger;

    /** 
    * 
    * @property finger9
    * @type Finger
    **/
    public finger9: Finger;

    /** 
    * 
    * @property finger10
    * @type Finger
    **/
    public finger10: Finger;

    /** 
    * 
    * @property latestFinger
    * @type Finger
    **/
    public latestFinger: Finger;

    /** 
    * 
    * @property isDown
    * @type Boolean
    **/
    public isDown: bool = false;

    /** 
    * 
    * @property isUp
    * @type Boolean
    **/
    public isUp: bool = true;

    public touchDown: Signal;
    public touchUp: Signal;

    /** 
    * 
    * @method start 
    */
    public start() {

        this._game.stage.canvas.addEventListener('touchstart', (event) => this.onTouchStart(event), false);
        this._game.stage.canvas.addEventListener('touchmove', (event) => this.onTouchMove(event), false);
        this._game.stage.canvas.addEventListener('touchend', (event) => this.onTouchEnd(event), false);
        this._game.stage.canvas.addEventListener('touchenter', (event) => this.onTouchEnter(event), false);
        this._game.stage.canvas.addEventListener('touchleave', (event) => this.onTouchLeave(event), false);
        this._game.stage.canvas.addEventListener('touchcancel', (event) => this.onTouchCancel(event), false);

        document.addEventListener('touchmove', (event) => this.consumeTouchMove(event), false);

    }

    /** 
    * Prevent iOS bounce-back (doesn't work?)
    * @method consumeTouchMove
    * @param {Any} event
    **/
    private consumeTouchMove(event) {

        event.preventDefault();

    }

    /** 
    * 
    * @method onTouchStart
    * @param {Any} event
    **/
    private onTouchStart(event) {

        event.preventDefault();

        //  A list of all the touch points that BECAME active with the current event
        //  https://developer.mozilla.org/en-US/docs/DOM/TouchList

        //  event.targetTouches = list of all touches on the TARGET ELEMENT (i.e. game dom element)
        //  event.touches = list of all touches on the ENTIRE DOCUMENT, not just the target element
        //  event.changedTouches = the touches that CHANGED in this event, not the total number of them
        for (var i = 0; i < event.changedTouches.length; i++)
        {
            for (var f = 0; f < this._fingers.length; f++)
            {
                if (this._fingers[f].active === false)
                {
                    this._fingers[f].start(event.changedTouches[i]);
                    this.x = this._fingers[f].x;
                    this.y = this._fingers[f].y;
                    this._game.input.x = this.x * this._game.input.scaleX;
                    this._game.input.y = this.y * this._game.input.scaleY;
                    this.touchDown.dispatch(this._fingers[f].x, this._fingers[f].y, this._fingers[f].timeDown, this._fingers[f].timeUp, this._fingers[f].duration);
                    this.isDown = true;
                    this.isUp = false;
                    break;
                }
            }
        }

    }

    /** 
    * Doesn't appear to be supported by most browsers yet
    * @method onTouchCancel
    * @param {Any} event
    **/
    private onTouchCancel(event) {

        event.preventDefault();

        //  Touch cancel - touches that were disrupted (perhaps by moving into a plugin or browser chrome)
        //  http://www.w3.org/TR/touch-events/#dfn-touchcancel
        //  event.changedTouches = the touches that CHANGED in this event, not the total number of them
        for (var i = 0; i < event.changedTouches.length; i++)
        {
            for (var f = 0; f < this._fingers.length; f++)
            {
                if (this._fingers[f].identifier === event.changedTouches[i].identifier)
                {
                    this._fingers[f].stop(event.changedTouches[i]);
                    break;
                }
            }
        }

    }

    /** 
    * Doesn't appear to be supported by most browsers yet
    * @method onTouchEnter
    * @param {Any} event
    **/
    private onTouchEnter(event) {

        event.preventDefault();

        //  For touch enter and leave its a list of the touch points that have entered or left the target

        //  event.targetTouches = list of all touches on the TARGET ELEMENT (i.e. game dom element)
        //  event.touches = list of all touches on the ENTIRE DOCUMENT, not just the target element
        //  event.changedTouches = the touches that CHANGED in this event, not the total number of them
        for (var i = 0; i < event.changedTouches.length; i++)
        {
            for (var f = 0; f < this._fingers.length; f++)
            {
                if (this._fingers[f].active === false)
                {
                    this._fingers[f].start(event.changedTouches[i]);
                    break;
                }
            }
        }

    }

    /** 
    * Doesn't appear to be supported by most browsers yet
    * @method onTouchLeave
    * @param {Any} event
    **/
    private onTouchLeave(event) {

        event.preventDefault();

        //  For touch enter and leave its a list of the touch points that have entered or left the target

        //  event.changedTouches = the touches that CHANGED in this event, not the total number of them
        for (var i = 0; i < event.changedTouches.length; i++)
        {
            for (var f = 0; f < this._fingers.length; f++)
            {
                if (this._fingers[f].identifier === event.changedTouches[i].identifier)
                {
                    this._fingers[f].leave(event.changedTouches[i]);
                    break;
                }
            }
        }

    }

    /** 
    * 
    * @method onTouchMove
    * @param {Any} event
    **/
    private onTouchMove(event) {

        event.preventDefault();

        //  event.targetTouches = list of all touches on the TARGET ELEMENT (i.e. game dom element)
        //  event.touches = list of all touches on the ENTIRE DOCUMENT, not just the target element
        //  event.changedTouches = the touches that CHANGED in this event, not the total number of them
        for (var i = 0; i < event.changedTouches.length; i++)
        {
            for (var f = 0; f < this._fingers.length; f++)
            {
                if (this._fingers[f].identifier === event.changedTouches[i].identifier)
                {
                    this._fingers[f].move(event.changedTouches[i]);
                    this.x = this._fingers[f].x;
                    this.y = this._fingers[f].y;
                    this._game.input.x = this.x * this._game.input.scaleX;
                    this._game.input.y = this.y * this._game.input.scaleY;
                    break;
                }
            }
        }

    }

    /** 
    * 
    * @method onTouchEnd
    * @param {Any} event
    **/
    private onTouchEnd(event) {

        event.preventDefault();

        //  For touch end its a list of the touch points that have been removed from the surface
        //  https://developer.mozilla.org/en-US/docs/DOM/TouchList

        //  event.changedTouches = the touches that CHANGED in this event, not the total number of them
        for (var i = 0; i < event.changedTouches.length; i++)
        {
            for (var f = 0; f < this._fingers.length; f++)
            {
                if (this._fingers[f].identifier === event.changedTouches[i].identifier)
                {
                    this._fingers[f].stop(event.changedTouches[i]);
                    this.x = this._fingers[f].x;
                    this.y = this._fingers[f].y;
                    this._game.input.x = this.x * this._game.input.scaleX;
                    this._game.input.y = this.y * this._game.input.scaleY;
                    this.touchUp.dispatch(this._fingers[f].x, this._fingers[f].y, this._fingers[f].timeDown, this._fingers[f].timeUp, this._fingers[f].duration);
                    this.isDown = false;
                    this.isUp = true;
                    break;
                }
            }
        }

    }

    /** 
    * 
    * @method calculateDistance
    * @param {Finger} finger1
    * @param {Finger} finger2
    **/
    public calculateDistance(finger1: Finger, finger2: Finger) {
    }

    /** 
    * 
    * @method calculateAngle
    * @param {Finger} finger1
    * @param {Finger} finger2
    **/
    public calculateAngle(finger1: Finger, finger2: Finger) {
    }

    /** 
    * 
    * @method checkOverlap
    * @param {Finger} finger1
    * @param {Finger} finger2
    **/
    public checkOverlap(finger1: Finger, finger2: Finger) {
    }

    /** 
    * 
    * @method update 
    */
    public update() {


    }

    /** 
    * 
    * @method stop 
    */
    public stop() {

        //this._domElement.addEventListener('touchstart', (event) => this.onTouchStart(event), false);
        //this._domElement.addEventListener('touchmove', (event) => this.onTouchMove(event), false);
        //this._domElement.addEventListener('touchend', (event) => this.onTouchEnd(event), false);
        //this._domElement.addEventListener('touchenter', (event) => this.onTouchEnter(event), false);
        //this._domElement.addEventListener('touchleave', (event) => this.onTouchLeave(event), false);
        //this._domElement.addEventListener('touchcancel', (event) => this.onTouchCancel(event), false);

    }

    /** 
    * 
    * @method reset
    **/
    public reset() {

        this.isDown = false;
        this.isUp = false;

    }

}

