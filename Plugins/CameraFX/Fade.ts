/// <reference path="../../Phaser/Game.ts" />
/// <reference path="../../Phaser/core/Plugin.ts" />

/**
* Phaser - Plugins - Camera FX - Fade
*
* The camera is filled with the given color and returns to normal at the given duration.
*/

module Phaser.Plugins.CameraFX {

    export class Fade extends Phaser.Plugin {

        constructor(game: Phaser.Game, parent) {

            super(game, parent);
            this.camera = parent;

        }

        public camera: Phaser.Camera;

        private _fxFadeColor: string;
        private _fxFadeComplete = null;
        private _fxFadeDuration: number = 0;
        private _fxFadeAlpha: number = 0;

        /**
        * The camera is gradually filled with this color.
        * 
        * @param	Color		The color you want to use in 0xRRGGBB format, i.e. 0xffffff for white.
        * @param	Duration	How long it takes for the flash to fade.
        * @param	OnComplete	An optional function you want to run when the flash finishes. Set to null for no callback.
        * @param	Force		Force an already running flash effect to reset.
        */
        public start(color: number = 0x000000, duration: number = 1, onComplete = null, force: bool = false) {

            if (force === false && this._fxFadeAlpha > 0)
            {
                //  You can't fade again unless you force it
                return;
            }

            if (duration <= 0)
            {
                duration = 1;
            }

            var red = color >> 16 & 0xFF;
            var green = color >> 8 & 0xFF;
            var blue = color & 0xFF;

            this._fxFadeColor = 'rgba(' + red + ',' + green + ',' + blue + ',';
            this._fxFadeDuration = duration;
            this._fxFadeAlpha = 0.01;
            this._fxFadeComplete = onComplete;

        }

        public postUpdate() {

            //  Update the Fade effect
            if (this._fxFadeAlpha > 0)
            {
                this._fxFadeAlpha += this.game.time.elapsed / this._fxFadeDuration;

                if (this.game.math.roundTo(this._fxFadeAlpha, -2) >= 1)
                {
                    this._fxFadeAlpha = 1;

                    if (this._fxFadeComplete !== null)
                    {
                        this._fxFadeComplete();
                    }
                }
            }

        }

        public postRender() {

            //  "Fade" FX
            if (this._fxFadeAlpha > 0)
            {
                this.game.stage.context.fillStyle = this._fxFadeColor + this._fxFadeAlpha + ')';
                this.game.stage.context.fillRect(this.camera.screenView.x, this.camera.screenView.y, this.camera.width, this.camera.height);
            }

        }

    }

}
