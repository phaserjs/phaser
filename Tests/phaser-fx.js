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
        (function (Camera) {
            var Border = (function () {
                function Border(game, parent) {
                    this.showBorder = false;
                    this.borderColor = 'rgb(255,255,255)';
                    this._game = game;
                    this._parent = parent;
                }
                Border.prototype.start = function () {
                };
                Border.prototype.postRender = function (camera, cameraX, cameraY, cameraWidth, cameraHeight) {
                    if(this.showBorder == true) {
                        this._game.stage.context.strokeStyle = this.borderColor;
                        this._game.stage.context.lineWidth = 1;
                        this._game.stage.context.rect(camera.scaledX, camera.scaledY, camera.worldView.width, camera.worldView.height);
                        this._game.stage.context.stroke();
                    }
                };
                return Border;
            })();
            Camera.Border = Border;            
        })(FX.Camera || (FX.Camera = {}));
        var Camera = FX.Camera;
    })(Phaser.FX || (Phaser.FX = {}));
    var FX = Phaser.FX;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    (function (FX) {
        (function (Camera) {
            var Template = (function () {
                function Template(game, parent) {
                    this._game = game;
                    this._parent = parent;
                }
                Template.prototype.start = function () {
                };
                Template.prototype.preUpdate = function () {
                };
                Template.prototype.postUpdate = function () {
                };
                Template.prototype.preRender = function (camera, cameraX, cameraY, cameraWidth, cameraHeight) {
                };
                Template.prototype.render = function (camera, cameraX, cameraY, cameraWidth, cameraHeight) {
                };
                Template.prototype.postRender = function (camera, cameraX, cameraY, cameraWidth, cameraHeight) {
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
                Mirror.prototype.start = function (x, y, region, fillColor) {
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
                Mirror.prototype.postRender = function (camera, cameraX, cameraY, cameraWidth, cameraHeight) {
                    this._sx = cameraX + this._mirrorX;
                    this._sy = cameraY + this._mirrorY;
                    if(this.flipX == true && this.flipY == false) {
                        this._sx = 0;
                    } else if(this.flipY == true && this.flipX == false) {
                        this._sy = 0;
                    }
                    this._context.drawImage(this._game.stage.canvas, this._sx, this._sy, this._mirrorWidth, this._mirrorHeight, 0, 0, this._mirrorWidth, this._mirrorHeight);
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
        (function (Camera) {
            var Shadow = (function () {
                function Shadow(game, parent) {
                    this.showShadow = false;
                    this.shadowColor = 'rgb(0,0,0)';
                    this.shadowBlur = 10;
                    this.shadowOffset = new Phaser.Point(4, 4);
                    this._game = game;
                    this._parent = parent;
                }
                Shadow.prototype.start = function () {
                };
                Shadow.prototype.preRender = function (camera, cameraX, cameraY, cameraWidth, cameraHeight) {
                    if(this.showShadow == true) {
                        this._game.stage.context.shadowColor = this.shadowColor;
                        this._game.stage.context.shadowBlur = this.shadowBlur;
                        this._game.stage.context.shadowOffsetX = this.shadowOffset.x;
                        this._game.stage.context.shadowOffsetY = this.shadowOffset.y;
                    }
                };
                Shadow.prototype.render = function (camera, cameraX, cameraY, cameraWidth, cameraHeight) {
                    if(this.showShadow == true) {
                        this._game.stage.context.shadowBlur = 0;
                        this._game.stage.context.shadowOffsetX = 0;
                        this._game.stage.context.shadowOffsetY = 0;
                    }
                };
                return Shadow;
            })();
            Camera.Shadow = Shadow;            
        })(FX.Camera || (FX.Camera = {}));
        var Camera = FX.Camera;
    })(Phaser.FX || (Phaser.FX = {}));
    var FX = Phaser.FX;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    (function (FX) {
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
        (function (Camera) {
            var Shake = (function () {
                function Shake(game, camera) {
                    this._fxShakeIntensity = 0;
                    this._fxShakeDuration = 0;
                    this._fxShakeComplete = null;
                    this._fxShakeOffset = new Phaser.Point(0, 0);
                    this._fxShakeDirection = 0;
                    this._fxShakePrevX = 0;
                    this._fxShakePrevY = 0;
                    this._game = game;
                    this._parent = camera;
                }
                Shake.SHAKE_BOTH_AXES = 0;
                Shake.SHAKE_HORIZONTAL_ONLY = 1;
                Shake.SHAKE_VERTICAL_ONLY = 2;
                Shake.prototype.start = function (intensity, duration, onComplete, force, direction) {
                    if (typeof intensity === "undefined") { intensity = 0.05; }
                    if (typeof duration === "undefined") { duration = 0.5; }
                    if (typeof onComplete === "undefined") { onComplete = null; }
                    if (typeof force === "undefined") { force = true; }
                    if (typeof direction === "undefined") { direction = Shake.SHAKE_BOTH_AXES; }
                    if(!force && ((this._fxShakeOffset.x != 0) || (this._fxShakeOffset.y != 0))) {
                        return;
                    }
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
                                this._fxShakeOffset.x = (this._game.math.random() * this._fxShakeIntensity * this._parent.worldView.width * 2 - this._fxShakeIntensity * this._parent.worldView.width);
                            }
                            if((this._fxShakeDirection == Shake.SHAKE_BOTH_AXES) || (this._fxShakeDirection == Shake.SHAKE_VERTICAL_ONLY)) {
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
        (function (Camera) {
            var Fade = (function () {
                function Fade(game) {
                    this._fxFadeComplete = null;
                    this._fxFadeDuration = 0;
                    this._fxFadeAlpha = 0;
                    this._game = game;
                }
                Fade.prototype.start = function (color, duration, onComplete, force) {
                    if (typeof color === "undefined") { color = 0x000000; }
                    if (typeof duration === "undefined") { duration = 1; }
                    if (typeof onComplete === "undefined") { onComplete = null; }
                    if (typeof force === "undefined") { force = false; }
                    if(force === false && this._fxFadeAlpha > 0) {
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
