/// <reference path="../../Game.ts" />
/// <reference path="../../Signal.ts" />

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

            this.onDown = new Phaser.Signal();
            this.onUp = new Phaser.Signal();

        }

        private _game: Game;

        public mouse: Mouse;
        public keyboard: Keyboard;
        public touch: Touch;

        public x: number = 0;
        public y: number = 0;

        public scaleX: number = 1;
        public scaleY: number = 1;

        public worldX: number = 0;
        public worldY: number = 0;

        public onDown: Phaser.Signal;
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

        public getWorldX(camera?: Camera = this._game.camera) {

            return camera.worldView.x + this.x;

        }

        public getWorldY(camera?: Camera = this._game.camera) {

            return camera.worldView.y + this.y;

        }

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