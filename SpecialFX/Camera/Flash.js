var Phaser;
(function (Phaser) {
    (function (FX) {
        (function (Camera) {
            var Flash = (function () {
                function Flash(game) {
                    this._fxFlashComplete = null;
                    this._fxFlashDuration = 0;
                    this._fxFlashAlpha = 0;
                    this._game = game;
                }
                Flash.prototype.start = function (color, duration, onComplete, force) {
                    if (typeof color === "undefined") { color = 0xffffff; }
                    if (typeof duration === "undefined") { duration = 1; }
                    if (typeof onComplete === "undefined") { onComplete = null; }
                    if (typeof force === "undefined") { force = false; }
                    if(force === false && this._fxFlashAlpha > 0) {
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
