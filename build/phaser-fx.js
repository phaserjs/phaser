var Phaser;
(function (Phaser) {
    (function (FX) {
        /// <reference path="../../Phaser/Game.d.ts" />
        /// <reference path="../../Phaser/FXManager.d.ts" />
        /**
        * Phaser - FX - Camera - Flash
        *
        * The camera is filled with the given color and returns to normal at the given duration.
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
                        if(this._game.math.roundTo(this._fxFlashAlpha, -2) <= 0) {
                            this._fxFlashAlpha = 0;
                            if(this._fxFlashComplete !== null) {
                                this._fxFlashComplete();
                            }
                        }
                    }
                };
                Flash.prototype.postRender = function (camera, cameraX, cameraY, cameraWidth, cameraHeight) {
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
var Phaser;
(function (Phaser) {
    (function (FX) {
        /// <reference path="../../Phaser/Game.d.ts" />
        /// <reference path="../../Phaser/system/Camera.d.ts" />
        /// <reference path="../../Phaser/FXManager.d.ts" />
        /**
        * Phaser - FX - Camera - Template
        *
        * A Template FX file you can use to create your own Camera FX.
        * If you don't use any of the methods below (i.e. preUpdate, render, etc) then DELETE THEM to avoid un-necessary calls by the FXManager.
        */
        (function (Camera) {
            var Template = (function () {
                function Template(game, parent) {
                    this._game = game;
                    this._parent = parent;
                }
                Template.prototype.start = /**
                * You can name the function that starts the effect whatever you like, but we used 'start' in our effects.
                */
                function () {
                };
                Template.prototype.preUpdate = /**
                * Pre-update is called at the start of the objects update cycle, before any other updates have taken place.
                */
                function () {
                };
                Template.prototype.postUpdate = /**
                * Post-update is called at the end of the objects update cycle, after other update logic has taken place.
                */
                function () {
                };
                Template.prototype.preRender = /**
                * Pre-render is called at the start of the object render cycle, before any transforms have taken place.
                * It happens directly AFTER a canvas context.save has happened if added to a Camera.
                */
                function (camera, cameraX, cameraY, cameraWidth, cameraHeight) {
                };
                Template.prototype.render = /**
                * render is called during the objects render cycle, right after all transforms have finished, but before any children/image data is rendered.
                */
                function (camera, cameraX, cameraY, cameraWidth, cameraHeight) {
                };
                Template.prototype.postRender = /**
                * Post-render is called during the objects render cycle, after the children/image data has been rendered.
                * It happens directly BEFORE a canvas context.restore has happened if added to a Camera.
                */
                function (camera, cameraX, cameraY, cameraWidth, cameraHeight) {
                };
                return Template;
            })();
            Camera.Template = Template;            
        })(FX.Camera || (FX.Camera = {}));
        var Camera = FX.Camera;
    })(Phaser.FX || (Phaser.FX = {}));
    var FX = Phaser.FX;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    (function (FX) {
        /// <reference path="../../Phaser/Game.d.ts" />
        /// <reference path="../../Phaser/system/Camera.d.ts" />
        /// <reference path="../../Phaser/FXManager.d.ts" />
        /**
        * Phaser - FX - Camera - Mirror
        *
        * Creates a mirror effect for a camera.
        * Can mirror the camera image horizontally, vertically or both with an optional fill color overlay.
        */
        (function (Camera) {
            var Mirror = (function () {
                function Mirror(game, parent) {
                    this._mirrorColor = null;
                    this.flipX = false;
                    this.flipY = true;
                    this.cls = false;
                    this._game = game;
                    this._parent = parent;
                    this._canvas = document.createElement('canvas');
                    this._canvas.width = parent.width;
                    this._canvas.height = parent.height;
                    this._context = this._canvas.getContext('2d');
                }
                Mirror.prototype.start = /**
                * This is the rectangular region to grab from the Camera used in the Mirror effect
                * It is rendered to the Stage at Mirror.x/y (note the use of Stage coordinates, not World coordinates)
                */
                function (x, y, region, fillColor) {
                    if (typeof fillColor === "undefined") { fillColor = 'rgba(0, 0, 100, 0.5)'; }
                    this.x = x;
                    this.y = y;
                    this._mirrorX = region.x;
                    this._mirrorY = region.y;
                    this._mirrorWidth = region.width;
                    this._mirrorHeight = region.height;
                    if(fillColor) {
                        this._mirrorColor = fillColor;
                        this._context.fillStyle = this._mirrorColor;
                    }
                };
                Mirror.prototype.postRender = /**
                * Post-render is called during the objects render cycle, after the children/image data has been rendered.
                * It happens directly BEFORE a canvas context.restore has happened if added to a Camera.
                */
                function (camera, cameraX, cameraY, cameraWidth, cameraHeight) {
                    if(this.cls) {
                        this._context.clearRect(0, 0, this._mirrorWidth, this._mirrorHeight);
                    }
                    this._sx = cameraX + this._mirrorX;
                    this._sy = cameraY + this._mirrorY;
                    if(this.flipX == true && this.flipY == false) {
                        this._sx = 0;
                    } else if(this.flipY == true && this.flipX == false) {
                        this._sy = 0;
                    }
                    this._context.drawImage(this._game.stage.canvas, //	Source Image
                    this._sx, //	Source X (location within the source image)
                    this._sy, //	Source Y
                    this._mirrorWidth, //	Source Width
                    this._mirrorHeight, //	Source Height
                    0, //	Destination X (where on the canvas it'll be drawn)
                    0, //	Destination Y
                    this._mirrorWidth, //	Destination Width (always same as Source Width unless scaled)
                    this._mirrorHeight);
                    //	Destination Height (always same as Source Height unless scaled)
                    if(this._mirrorColor) {
                        this._context.fillRect(0, 0, this._mirrorWidth, this._mirrorHeight);
                    }
                    if(this.flipX && this.flipY) {
                        this._game.stage.context.transform(-1, 0, 0, -1, this._mirrorWidth, this._mirrorHeight);
                        this._game.stage.context.drawImage(this._canvas, -this.x, -this.y);
                    } else if(this.flipX) {
                        this._game.stage.context.transform(-1, 0, 0, 1, this._mirrorWidth, 0);
                        this._game.stage.context.drawImage(this._canvas, -this.x, this.y);
                    } else if(this.flipY) {
                        this._game.stage.context.transform(1, 0, 0, -1, 0, this._mirrorHeight);
                        this._game.stage.context.drawImage(this._canvas, this.x, -this.y);
                    }
                };
                return Mirror;
            })();
            Camera.Mirror = Mirror;            
        })(FX.Camera || (FX.Camera = {}));
        var Camera = FX.Camera;
    })(Phaser.FX || (Phaser.FX = {}));
    var FX = Phaser.FX;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    (function (FX) {
        /// <reference path="../../Phaser/Game.d.ts" />
        /// <reference path="../../Phaser/system/Camera.d.ts" />
        /// <reference path="../../Phaser/FXManager.d.ts" />
        /**
        * Phaser - FX - Camera - Scanlines
        *
        * Give your game that classic retro feel!
        */
        (function (Camera) {
            var Scanlines = (function () {
                function Scanlines(game, parent) {
                    this.spacing = 4;
                    this.color = 'rgba(0, 0, 0, 0.3)';
                    this._game = game;
                    this._parent = parent;
                }
                Scanlines.prototype.postRender = function (camera, cameraX, cameraY, cameraWidth, cameraHeight) {
                    this._game.stage.context.fillStyle = this.color;
                    for(var y = cameraY; y < cameraHeight; y += this.spacing) {
                        this._game.stage.context.fillRect(cameraX, y, cameraWidth, 1);
                    }
                };
                return Scanlines;
            })();
            Camera.Scanlines = Scanlines;            
        })(FX.Camera || (FX.Camera = {}));
        var Camera = FX.Camera;
    })(Phaser.FX || (Phaser.FX = {}));
    var FX = Phaser.FX;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    (function (FX) {
        /// <reference path="../../Phaser/Game.d.ts" />
        /// <reference path="../../Phaser/FXManager.d.ts" />
        /**
        * Phaser - FX - Camera - Shake
        *
        * A simple camera shake effect.
        */
        (function (Camera) {
            var Shake = (function () {
                function Shake(game, camera) {
                    this._fxShakeIntensity = 0;
                    this._fxShakeDuration = 0;
                    this._fxShakeComplete = null;
                    this._fxShakeOffset = new Phaser.MicroPoint(0, 0);
                    this._fxShakeDirection = 0;
                    this._fxShakePrevX = 0;
                    this._fxShakePrevY = 0;
                    this._game = game;
                    this._parent = camera;
                }
                Shake.SHAKE_BOTH_AXES = 0;
                Shake.SHAKE_HORIZONTAL_ONLY = 1;
                Shake.SHAKE_VERTICAL_ONLY = 2;
                Shake.prototype.start = /**
                * A simple camera shake effect.
                *
                * @param	Intensity	Percentage of screen size representing the maximum distance that the screen can move while shaking.
                * @param	Duration	The length in seconds that the shaking effect should last.
                * @param	OnComplete	A function you want to run when the shake effect finishes.
                * @param	Force		Force the effect to reset (default = true, unlike flash() and fade()!).
                * @param	Direction	Whether to shake on both axes, just up and down, or just side to side (use class constants SHAKE_BOTH_AXES, SHAKE_VERTICAL_ONLY, or SHAKE_HORIZONTAL_ONLY).
                */
                function (intensity, duration, onComplete, force, direction) {
                    if (typeof intensity === "undefined") { intensity = 0.05; }
                    if (typeof duration === "undefined") { duration = 0.5; }
                    if (typeof onComplete === "undefined") { onComplete = null; }
                    if (typeof force === "undefined") { force = true; }
                    if (typeof direction === "undefined") { direction = Shake.SHAKE_BOTH_AXES; }
                    if(!force && ((this._fxShakeOffset.x != 0) || (this._fxShakeOffset.y != 0))) {
                        return;
                    }
                    //  If a shake is not already running we need to store the offsets here
                    if(this._fxShakeOffset.x == 0 && this._fxShakeOffset.y == 0) {
                        this._fxShakePrevX = this._parent.x;
                        this._fxShakePrevY = this._parent.y;
                    }
                    this._fxShakeIntensity = intensity;
                    this._fxShakeDuration = duration;
                    this._fxShakeComplete = onComplete;
                    this._fxShakeDirection = direction;
                    this._fxShakeOffset.setTo(0, 0);
                };
                Shake.prototype.postUpdate = function () {
                    //  Update the "shake" special effect
                    if(this._fxShakeDuration > 0) {
                        this._fxShakeDuration -= this._game.time.elapsed;
                        if(this._game.math.roundTo(this._fxShakeDuration, -2) <= 0) {
                            this._fxShakeDuration = 0;
                            this._fxShakeOffset.setTo(0, 0);
                            this._parent.x = this._fxShakePrevX;
                            this._parent.y = this._fxShakePrevY;
                            if(this._fxShakeComplete != null) {
                                this._fxShakeComplete();
                            }
                        } else {
                            if((this._fxShakeDirection == Shake.SHAKE_BOTH_AXES) || (this._fxShakeDirection == Shake.SHAKE_HORIZONTAL_ONLY)) {
                                //this._fxShakeOffset.x = ((this._game.math.random() * this._fxShakeIntensity * this.worldView.width * 2 - this._fxShakeIntensity * this.worldView.width) * this._zoom;
                                this._fxShakeOffset.x = (this._game.math.random() * this._fxShakeIntensity * this._parent.worldView.width * 2 - this._fxShakeIntensity * this._parent.worldView.width);
                            }
                            if((this._fxShakeDirection == Shake.SHAKE_BOTH_AXES) || (this._fxShakeDirection == Shake.SHAKE_VERTICAL_ONLY)) {
                                //this._fxShakeOffset.y = (this._game.math.random() * this._fxShakeIntensity * this.worldView.height * 2 - this._fxShakeIntensity * this.worldView.height) * this._zoom;
                                this._fxShakeOffset.y = (this._game.math.random() * this._fxShakeIntensity * this._parent.worldView.height * 2 - this._fxShakeIntensity * this._parent.worldView.height);
                            }
                        }
                    }
                };
                Shake.prototype.preRender = function (camera, cameraX, cameraY, cameraWidth, cameraHeight) {
                    if((this._fxShakeOffset.x != 0) || (this._fxShakeOffset.y != 0)) {
                        this._parent.x = this._fxShakePrevX + this._fxShakeOffset.x;
                        this._parent.y = this._fxShakePrevY + this._fxShakeOffset.y;
                    }
                };
                return Shake;
            })();
            Camera.Shake = Shake;            
        })(FX.Camera || (FX.Camera = {}));
        var Camera = FX.Camera;
    })(Phaser.FX || (Phaser.FX = {}));
    var FX = Phaser.FX;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    (function (FX) {
        /// <reference path="../../Phaser/Game.d.ts" />
        /// <reference path="../../Phaser/FXManager.d.ts" />
        /**
        * Phaser - FX - Camera - Fade
        *
        * The camera is filled with the given color and returns to normal at the given duration.
        */
        (function (Camera) {
            var Fade = (function () {
                function Fade(game) {
                    this._fxFadeComplete = null;
                    this._fxFadeDuration = 0;
                    this._fxFadeAlpha = 0;
                    this._game = game;
                }
                Fade.prototype.start = /**
                * The camera is gradually filled with this color.
                *
                * @param	Color		The color you want to use in 0xRRGGBB format, i.e. 0xffffff for white.
                * @param	Duration	How long it takes for the flash to fade.
                * @param	OnComplete	An optional function you want to run when the flash finishes. Set to null for no callback.
                * @param	Force		Force an already running flash effect to reset.
                */
                function (color, duration, onComplete, force) {
                    if (typeof color === "undefined") { color = 0x000000; }
                    if (typeof duration === "undefined") { duration = 1; }
                    if (typeof onComplete === "undefined") { onComplete = null; }
                    if (typeof force === "undefined") { force = false; }
                    if(force === false && this._fxFadeAlpha > 0) {
                        //  You can't fade again unless you force it
                        return;
                    }
                    if(duration <= 0) {
                        duration = 1;
                    }
                    var red = color >> 16 & 0xFF;
                    var green = color >> 8 & 0xFF;
                    var blue = color & 0xFF;
                    this._fxFadeColor = 'rgba(' + red + ',' + green + ',' + blue + ',';
                    this._fxFadeDuration = duration;
                    this._fxFadeAlpha = 0.01;
                    this._fxFadeComplete = onComplete;
                };
                Fade.prototype.postUpdate = function () {
                    //  Update the Fade effect
                    if(this._fxFadeAlpha > 0) {
                        this._fxFadeAlpha += this._game.time.elapsed / this._fxFadeDuration;
                        if(this._game.math.roundTo(this._fxFadeAlpha, -2) >= 1) {
                            this._fxFadeAlpha = 1;
                            if(this._fxFadeComplete !== null) {
                                this._fxFadeComplete();
                            }
                        }
                    }
                };
                Fade.prototype.postRender = function (camera, cameraX, cameraY, cameraWidth, cameraHeight) {
                    //  "Fade" FX
                    if(this._fxFadeAlpha > 0) {
                        this._game.stage.context.fillStyle = this._fxFadeColor + this._fxFadeAlpha + ')';
                        this._game.stage.context.fillRect(cameraX, cameraY, cameraWidth, cameraHeight);
                    }
                };
                return Fade;
            })();
            Camera.Fade = Fade;            
        })(FX.Camera || (FX.Camera = {}));
        var Camera = FX.Camera;
    })(Phaser.FX || (Phaser.FX = {}));
    var FX = Phaser.FX;
})(Phaser || (Phaser = {}));
