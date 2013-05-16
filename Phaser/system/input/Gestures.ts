/// <reference path="../../Game.ts" />
/// <reference path="Pointer.ts" />

/**
* Phaser - Gestures
*
* The Gesture class monitors for gestures and dispatches the resulting signals when they occur.
* Note: Android 2.x only supports 1 touch event at once, no multi-touch
*/

module Phaser {

    export class Gestures {

        /**
        * Constructor
        * @param {Game} game.
        * @return {Touch} This object.
        */
        constructor(game: Game) {

            this._game = game;

        }

        /**
        * Local private reference to game.
        * @property _game
        * @type {Game}
        * @private
        **/
        private _game: Game;

        private _p1: Pointer;
        private _p2: Pointer;
        private _p3: Pointer;
        private _p4: Pointer;
        private _p5: Pointer;
        private _p6: Pointer;
        private _p7: Pointer;
        private _p8: Pointer;
        private _p9: Pointer;
        private _p10: Pointer;

        public start() {

            //  Local references to the Phaser.Input.pointer objects
            this._p1 = this._game.input.pointer1;
            this._p2 = this._game.input.pointer2;
            this._p3 = this._game.input.pointer3;
            this._p4 = this._game.input.pointer4;
            this._p5 = this._game.input.pointer5;
            this._p6 = this._game.input.pointer6;
            this._p7 = this._game.input.pointer7;
            this._p8 = this._game.input.pointer8;
            this._p9 = this._game.input.pointer9;
            this._p10 = this._game.input.pointer10;

        }

    }

}