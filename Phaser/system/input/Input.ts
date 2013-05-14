/// <reference path="../../Game.ts" />
/// <reference path="../../Signal.ts" />
/// <reference path="MSPointer.ts" />

/**
* Phaser - Input
*
* A game specific Input manager that looks after the mouse, keyboard and touch objects. This is updated by the core game loop.
*/

module Phaser {

    export class Input {

        constructor(game: Game) {

            this._game = game;

            this.mouse = new Mouse(this._game);
            this.keyboard = new Keyboard(this._game);
            this.touch = new Touch(this._game);
            this.mspointer = new MSPointer(this._game);

            this.onDown = new Phaser.Signal();
            this.onUp = new Phaser.Signal();

        }

        private _game: Game;

        /**
         *
         * @type {Mouse}
         */
        public mouse: Mouse;

        /**
         *
         * @type {Keyboard}
         */
        public keyboard: Keyboard;

        /**
         *
         * @type {Touch}
         */
        public touch: Touch;

        /**
         *
         * @type {MSPointer}
         */
        public mspointer: MSPointer;

        /**
         *
         * @type {Number}
         */
        public x: number = 0;

        /**
         *
         * @type {Number}
         */
        public y: number = 0;

        /**
         *
         * @type {Number}
         */
        public scaleX: number = 1;

        /**
         *
         * @type {Number}
         */
        public scaleY: number = 1;

        /**
         *
         * @type {Number}
         */
        public worldX: number = 0;

        /**
         *
         * @type {Number}
         */
        public worldY: number = 0;

        /**
         *
         * @type {Phaser.Signal}
         */
        public onDown: Phaser.Signal;

        /**
         *
         * @type {Phaser.Signal}
         */
        public onUp: Phaser.Signal;

        public update() {

            this.x = Math.round(this.x);
            this.y = Math.round(this.y);

            this.worldX = this._game.camera.worldView.x + this.x;
            this.worldY = this._game.camera.worldView.y + this.y;

            this.mouse.update();
            this.touch.update();

        }

        public reset() {

            this.mouse.reset();
            this.keyboard.reset();
            this.touch.reset();

        }

        /**
         * @param {Camera} [camera]
         */
        public getWorldX(camera?: Camera = this._game.camera) {

            return camera.worldView.x + this.x;

        }

        /**
         * @param {Camera} [camera]
         */
        public getWorldY(camera?: Camera = this._game.camera) {

            return camera.worldView.y + this.y;

        }

        /**
         * @param {Number} x
         * @param {Number} y
         * @param {String} [color]
         */
        public renderDebugInfo(x: number, y: number, color?: string = 'rgb(255,255,255)') {

            this._game.stage.context.font = '14px Courier';
            this._game.stage.context.fillStyle = color;
            this._game.stage.context.fillText('Input', x, y);
            this._game.stage.context.fillText('Screen X: ' + this.x + ' Screen Y: ' + this.y, x, y + 14);
            this._game.stage.context.fillText('World X: ' + this.worldX + ' World Y: ' + this.worldY, x, y + 28);
            this._game.stage.context.fillText('Scale X: ' + this.scaleX.toFixed(1) + ' Scale Y: ' + this.scaleY.toFixed(1), x, y + 42);

        }

    }

}