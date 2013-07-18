/// <reference path="../../Game.ts" />

/**
* Phaser - PauseScreen
*
* The PauseScreen is displayed whenever the game loses focus or the player switches to another browser tab.
*/

module Phaser {

    export class PauseScreen {

        /**
         * PauseScreen constructor
         * Create a new <code>PauseScreen</code> with specific width and height.
         *
         * @param width {number} Screen canvas width.
         * @param height {number} Screen canvas height.
         */
        constructor(game: Game, width: number, height: number) {

            this._game = game;
            this._canvas = <HTMLCanvasElement> document.createElement('canvas');
            this._canvas.width = width;
            this._canvas.height = height;
            this._context = this._canvas.getContext('2d');

        }

        /**
         * Local private reference to game.
         */
        private _game: Game;

        /**
         * Canvas element used by engine.
         * @type {HTMLCanvasElement}
         */
        private _canvas: HTMLCanvasElement;

        /**
         * Render context of stage's canvas.
         * @type {CanvasRenderingContext2D}
         */
        private _context: CanvasRenderingContext2D;

        /**
         * Background color.
         */
        private _color;

        /**
         * Fade effect tween.
         * @type {Phaser.Tween}
         */
        private _fade: Phaser.Tween;

        /**
         * Called when the game enters pause mode.
         */
        public onPaused() {

            //  Take a grab of the current canvas to our temporary one
            this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
            this._context.drawImage(this._game.stage.canvas, 0, 0);
            this._color = { r: 255, g: 255, b: 255 };
            this.fadeOut();

        }

        /**
         * Called when the game resume from pause mode.
         */
        public onResume() {
            this._fade.stop();
            this._game.tweens.remove(this._fade);
        }

        /**
         * Update background color.
         */
        public update() {
            this._color.r = Math.round(this._color.r);
            this._color.g = Math.round(this._color.g);
            this._color.b = Math.round(this._color.b);
        }

        /**
         * Render PauseScreen.
         */
        public render() {

            this._game.stage.context.drawImage(this._canvas, 0, 0);

            this._game.stage.context.fillStyle = 'rgba(0, 0, 0, 0.4)';
            this._game.stage.context.fillRect(0, 0, this._game.stage.width, this._game.stage.height);

            //  Draw a 'play' arrow
            var arrowWidth = Math.round(this._game.stage.width / 2);
            var arrowHeight = Math.round(this._game.stage.height / 2);

            var sx = this._game.stage.centerX - arrowWidth / 2;
            var sy = this._game.stage.centerY - arrowHeight / 2;

            this._game.stage.context.beginPath();
            this._game.stage.context.moveTo(sx, sy);
            this._game.stage.context.lineTo(sx, sy + arrowHeight);
            this._game.stage.context.lineTo(sx + arrowWidth, this._game.stage.centerY);
            this._game.stage.context.fillStyle = 'rgba(' + this._color.r + ', ' + this._color.g + ', ' + this._color.b + ', 0.8)';
            this._game.stage.context.fill();
            this._game.stage.context.closePath();

        }

        /**
         * Start fadeOut effect.
         */
        private fadeOut() {

            this._fade = this._game.add.tween(this._color);

            this._fade.to({ r: 50, g: 50, b: 50 }, 1000, Phaser.Easing.Linear.None);
            this._fade.onComplete.add(this.fadeIn, this);
            this._fade.start();

        }

        /**
         * Start fadeIn effect.
         */
        private fadeIn() {

            this._fade = this._game.add.tween(this._color);

            this._fade.to({ r: 255, g: 255, b: 255 }, 1000, Phaser.Easing.Linear.None);
            this._fade.onComplete.add(this.fadeOut, this);
            this._fade.start();

        }

    }

}
