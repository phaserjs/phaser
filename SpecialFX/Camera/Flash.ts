/// <reference path="../../Phaser/Game.d.ts" />
/// <reference path="../../Phaser/FXManager.d.ts" />

/**
* Phaser - FX - Camera - Flash
*
* The camera is filled with the given color and returns to normal at the given duration.
*/

module Phaser.FX.Camera {

    export class Flash {

        constructor(game: Game) {

            this._game = game;

        }

        private _game: Game;

        private _fxFlashColor: string;
        private _fxFlashComplete = null;
        private _fxFlashDuration: number = 0;
        private _fxFlashAlpha: number = 0;

        /**
        * The camera is filled with this color and returns to normal at the given duration.
        * 
        * @param	Color		The color you want to use in 0xRRGGBB format, i.e. 0xffffff for white.
        * @param	Duration	How long it takes for the flash to fade.
        * @param	OnComplete	An optional function you want to run when the flash finishes. Set to null for no callback.
        * @param	Force		Force an already running flash effect to reset.
        */
        public start(color: number = 0xffffff, duration: number = 1, onComplete = null, force: bool = false) {

            if (force === false && this._fxFlashAlpha > 0)
            {
                //  You can't flash again unless you force it
                return;
            }

            if (duration <= 0)
            {
                duration = 1;
            }

            var red = color >> 16 & 0xFF;
            var green = color >> 8 & 0xFF;
            var blue = color & 0xFF;

            this._fxFlashColor = 'rgba(' + red + ',' + green + ',' + blue + ',';
            this._fxFlashDuration = duration;
            this._fxFlashAlpha = 1;
            this._fxFlashComplete = onComplete;

        }

        public postUpdate() {

            //  Update the Flash effect
            if (this._fxFlashAlpha > 0)
            {
                this._fxFlashAlpha -= this._game.time.elapsed / this._fxFlashDuration;

                if (this._game.math.roundTo(this._fxFlashAlpha, -2) <= 0)
                {
                    this._fxFlashAlpha = 0;

                    if (this._fxFlashComplete !== null)
                    {
                        this._fxFlashComplete();
                    }
                }
            }

        }

        public postRender(camera: Phaser.Camera, cameraX: number, cameraY: number, cameraWidth: number, cameraHeight: number) {

            if (this._fxFlashAlpha > 0)
            {
                this._game.stage.context.fillStyle = this._fxFlashColor + this._fxFlashAlpha + ')';
                this._game.stage.context.fillRect(cameraX, cameraY, cameraWidth, cameraHeight);
            }

        }

    }

}
