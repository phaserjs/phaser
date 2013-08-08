/// <reference path="../../_definitions.ts" />

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
        constructor(game: Phaser.Game, width: number, height: number) {

            this.game = game;
            this._canvas = <HTMLCanvasElement> document.createElement('canvas');
            this._canvas.width = width;
            this._canvas.height = height;
            this._context = this._canvas.getContext('2d');

        }

        /**
         * Local reference to Game.
         */
        public game: Phaser.Game;

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
            this._context.drawImage(this.game.stage.canvas, 0, 0);
            this._color = { r: 255, g: 255, b: 255 };
            this.fadeOut();

        }

        /**
         * Called when the game resume from pause mode.
         */
        public onResume() {
            this._fade.stop();
            this.game.tweens.remove(this._fade);
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

            this.game.stage.context.drawImage(this._canvas, 0, 0);

            this.game.stage.context.fillStyle = 'rgba(0, 0, 0, 0.4)';
            this.game.stage.context.fillRect(0, 0, this.game.stage.width, this.game.stage.height);

            //  Draw a 'play' arrow
            var arrowWidth = Math.round(this.game.stage.width / 2);
            var arrowHeight = Math.round(this.game.stage.height / 2);

            var sx = this.game.stage.centerX - arrowWidth / 2;
            var sy = this.game.stage.centerY - arrowHeight / 2;

            this.game.stage.context.beginPath();
            this.game.stage.context.moveTo(sx, sy);
            this.game.stage.context.lineTo(sx, sy + arrowHeight);
            this.game.stage.context.lineTo(sx + arrowWidth, this.game.stage.centerY);
            this.game.stage.context.fillStyle = 'rgba(' + this._color.r + ', ' + this._color.g + ', ' + this._color.b + ', 0.8)';
            this.game.stage.context.fill();
            this.game.stage.context.closePath();

        }

        /**
         * Start fadeOut effect.
         */
        private fadeOut() {

            this._fade = this.game.add.tween(this._color);

            this._fade.to({ r: 50, g: 50, b: 50 }, 1000, Phaser.Easing.Linear.None);
            this._fade.onComplete.add(this.fadeIn, this);
            this._fade.start();

        }

        /**
         * Start fadeIn effect.
         */
        private fadeIn() {

            this._fade = this.game.add.tween(this._color);

            this._fade.to({ r: 255, g: 255, b: 255 }, 1000, Phaser.Easing.Linear.None);
            this._fade.onComplete.add(this.fadeOut, this);
            this._fade.start();

        }

    }

}
