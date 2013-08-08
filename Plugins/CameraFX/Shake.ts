/// <reference path="../../Phaser/Game.ts" />
/// <reference path="../../Phaser/core/Plugin.ts" />

/**
* Phaser - Plugins - Camera FX - Shake
*
* A simple camera shake effect.
*/

module Phaser.Plugins.CameraFX {

    export class Shake extends Phaser.Plugin {

        constructor(game: Phaser.Game, parent) {

            super(game, parent);
            this.camera = parent;

        }

        public camera: Phaser.Camera;

        private _fxShakeIntensity: number = 0;
        private _fxShakeDuration: number = 0;
        private _fxShakeComplete = null;
        private _fxShakeOffset: Point = new Point(0, 0);
        private _fxShakeDirection: number = 0;
        private _fxShakePrevX: number = 0;
        private _fxShakePrevY: number = 0;

        public static SHAKE_BOTH_AXES: number = 0;
        public static SHAKE_HORIZONTAL_ONLY: number = 1;
        public static SHAKE_VERTICAL_ONLY: number = 2;

        /**
        * A simple camera shake effect.
        * 
        * @param	Intensity	Percentage of screen size representing the maximum distance that the screen can move while shaking.
        * @param	Duration	The length in seconds that the shaking effect should last.
        * @param	OnComplete	A function you want to run when the shake effect finishes.
        * @param	Force		Force the effect to reset (default = true, unlike flash() and fade()!).
        * @param	Direction	Whether to shake on both axes, just up and down, or just side to side (use class constants SHAKE_BOTH_AXES, SHAKE_VERTICAL_ONLY, or SHAKE_HORIZONTAL_ONLY).
        */
        public start(intensity: number = 0.05, duration: number = 0.5, onComplete = null, force: boolean = true, direction: number = Shake.SHAKE_BOTH_AXES) {

            if (!force && ((this._fxShakeOffset.x != 0) || (this._fxShakeOffset.y != 0)))
            {
                return;
            }

            //  If a shake is not already running we need to store the offsets here
            if (this._fxShakeOffset.x == 0 && this._fxShakeOffset.y == 0)
            {
                this._fxShakePrevX = this.camera.x;
                this._fxShakePrevY = this.camera.y;
            }

            this._fxShakeIntensity = intensity;
            this._fxShakeDuration = duration;
            this._fxShakeComplete = onComplete;
            this._fxShakeDirection = direction;
            this._fxShakeOffset.setTo(0, 0);

        }

        public postUpdate() {

            //  Update the "shake" special effect
            if (this._fxShakeDuration > 0)
            {
                this._fxShakeDuration -= this.game.time.elapsed;

                if (this.game.math.roundTo(this._fxShakeDuration, -2) <= 0)
                {
                    this._fxShakeDuration = 0;
                    this._fxShakeOffset.setTo(0, 0);
                    this.camera.x = this._fxShakePrevX;
                    this.camera.y = this._fxShakePrevY;

                    if (this._fxShakeComplete != null)
                    {
                        this._fxShakeComplete();
                    }
                }
                else
                {
                    if ((this._fxShakeDirection == Shake.SHAKE_BOTH_AXES) || (this._fxShakeDirection == Shake.SHAKE_HORIZONTAL_ONLY))
                    {
                        this._fxShakeOffset.x = (this.game.rnd.integer * this._fxShakeIntensity * this.camera.worldView.width * 2 - this._fxShakeIntensity * this.camera.worldView.width);
                    }

                    if ((this._fxShakeDirection == Shake.SHAKE_BOTH_AXES) || (this._fxShakeDirection == Shake.SHAKE_VERTICAL_ONLY))
                    {
                        this._fxShakeOffset.y = (this.game.rnd.integer * this._fxShakeIntensity * this.camera.worldView.height * 2 - this._fxShakeIntensity * this.camera.worldView.height);
                    }
                }

            }

        }

        public preRender() {

            if ((this._fxShakeOffset.x != 0) || (this._fxShakeOffset.y != 0))
            {
                this.camera.x = this._fxShakePrevX + this._fxShakeOffset.x;
                this.camera.y = this._fxShakePrevY + this._fxShakeOffset.y;
            }

        }

    }

}
