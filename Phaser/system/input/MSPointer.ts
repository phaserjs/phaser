/// <reference path="../../Game.ts" />
/// <reference path="Finger.ts" />

/**
* Phaser - MSPointer
*
* The MSPointer class handles touch interactions with the game and the resulting Finger objects.
* It will work only in Internet Explorer 10 and Windows Store or Windows Phone 8 apps using JavaScript. 
* http://msdn.microsoft.com/en-us/library/ie/hh673557(v=vs.85).aspx
* 
*
*  @todo       Gestures (pinch, zoom, swipe)
*/

module Phaser {

    export class MSPointer {

        /** 
        * Constructor
        * @param {Game} game.
        * @return {MSPointer} This object.
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

            if (navigator.msMaxTouchPoints)
            {
                this._game.stage.canvas.addEventListener('MSPointerDown', (event) => this.onPointerDown(event), false);
                this._game.stage.canvas.addEventListener('MSPointerMove', (event) => this.onPointerMove(event), false);
                this._game.stage.canvas.addEventListener('MSPointerUp', (event) => this.onPointerUp(event), false);
            }

        }

        /** 
        * 
        * @method onPointerDown
        * @param {Any} event
        **/
        private onPointerDown(event) {

            event.preventDefault();
            
            for (var f = 0; f < this._fingers.length; f++)
            {
                if (this._fingers[f].active === false)
                {
                    event.identifier = event.pointerId;
                    this._fingers[f].start(event);
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

        /** 
        * 
        * @method onPointerMove
        * @param {Any} event
        **/
        private onPointerMove(event) {

            event.preventDefault();

            for (var f = 0; f < this._fingers.length; f++)
            {
                if (this._fingers[f].identifier === event.pointerId &&
                    this._fingers[f].active === true)
                {
                    event.identifier = event.pointerId;
                    this._fingers[f].move(event);
                    this.x = this._fingers[f].x;
                    this.y = this._fingers[f].y;
                    this._game.input.x = this.x * this._game.input.scaleX;
                    this._game.input.y = this.y * this._game.input.scaleY;
                    break;
                }
            }
        }

        /** 
        * 
        * @method onPointerUp
        * @param {Any} event
        **/
        private onPointerUp(event) {

            event.preventDefault();

            for (var f = 0; f < this._fingers.length; f++)
            {
                
                if (this._fingers[f].identifier === event.pointerId)
                {
                    event.identifier = event.pointerId;
                    this._fingers[f].stop(event);
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

}