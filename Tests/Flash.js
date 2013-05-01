var Phaser;
(function (Phaser) {
    (function (FX) {
        /// <reference path="../../Phaser/Game.ts" />
        /// <reference path="../../Phaser/FXManager.ts" />
        /**
        * Phaser - FX - Camera - Flash
        *
        *
        */
        (function (Camera) {
            var Flash = (function () {
                function Flash(game) {
                    this._fxFlashComplete = null;
                    this._fxFlashDuration = 0;
                    this._fxFlashAlpha = 0;
                    this._game = game;
                }
                Flash.prototype.start = /**
                * The camera is filled with this color and returns to normal at the given duration.
                *
                * @param	Color		The color you want to use in 0xRRGGBB format, i.e. 0xffffff for white.
                * @param	Duration	How long it takes for the flash to fade.
                * @param	OnComplete	An optional function you want to run when the flash finishes. Set to null for no callback.
                * @param	Force		Force an already running flash effect to reset.
                */
                function (color, duration, onComplete, force) {
                    if (typeof color === "undefined") { color = 0xffffff; }
                    if (typeof duration === "undefined") { duration = 1; }
                    if (typeof onComplete === "undefined") { onComplete = null; }
                    if (typeof force === "undefined") { force = false; }
                    if(force === false && this._fxFlashAlpha > 0) {
                        //  You can't flash again unless you force it
                        return;
                    }
                    if(duration <= 0) {
                        duration = 1;
                    }
                    var red = color >> 16 & 0xFF;
                    var green = color >> 8 & 0xFF;
                    var blue = color & 0xFF;
                    this._fxFlashColor = 'rgba(' + red + ',' + green + ',' + blue + ',';
                    this._fxFlashDuration = duration;
                    this._fxFlashAlpha = 1;
                    this._fxFlashComplete = onComplete;
                };
                Flash.prototype.postUpdate = function () {
                    //  Update the Flash effect
                    if(this._fxFlashAlpha > 0) {
                        this._fxFlashAlpha -= this._game.time.elapsed / this._fxFlashDuration;
                        this._fxFlashAlpha = this._game.math.roundTo(this._fxFlashAlpha, -2);
                        if(this._fxFlashAlpha <= 0) {
                            this._fxFlashAlpha = 0;
                            if(this._fxFlashComplete !== null) {
                                this._fxFlashComplete();
                            }
                        }
                    }
                };
                Flash.prototype.postRender = function (cameraX, cameraY, cameraWidth, cameraHeight) {
                    if(this._fxFlashAlpha > 0) {
                        this._game.stage.context.fillStyle = this._fxFlashColor + this._fxFlashAlpha + ')';
                        this._game.stage.context.fillRect(cameraX, cameraY, cameraWidth, cameraHeight);
                    }
                };
                return Flash;
            })();
            Camera.Flash = Flash;            
        })(FX.Camera || (FX.Camera = {}));
        var Camera = FX.Camera;
    })(Phaser.FX || (Phaser.FX = {}));
    var FX = Phaser.FX;
})(Phaser || (Phaser = {}));
