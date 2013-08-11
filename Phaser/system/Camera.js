/// <reference path="../gameobjects/Sprite.ts" />
/// <reference path="../Game.ts" />
/**
* Phaser - Camera
*
* A Camera is your view into the game world. It has a position, size, scale and rotation and renders only those objects
* within its field of view. The game automatically creates a single Stage sized camera on boot, but it can be changed and
* additional cameras created via the CameraManager.
*/
var Phaser;
(function (Phaser) {
    var Camera = (function () {
        /**
        * Instantiates a new camera at the specified location, with the specified size and zoom level.
        *
        * @param X			X location of the camera's display in pixels. Uses native, 1:1 resolution, ignores zoom.
        * @param Y			Y location of the camera's display in pixels. Uses native, 1:1 resolution, ignores zoom.
        * @param Width		The width of the camera display in pixels.
        * @param Height	The height of the camera display in pixels.
        * @param Zoom		The initial zoom level of the camera.  A zoom level of 2 will make all pixels display at 2x resolution.
        */
        function Camera(game, id, x, y, width, height) {
            this._clip = false;
            this._rotation = 0;
            this._target = null;
            this._sx = 0;
            this._sy = 0;
            this.scale = new Phaser.MicroPoint(1, 1);
            this.scroll = new Phaser.MicroPoint(0, 0);
            this.bounds = null;
            this.deadzone = null;
            //  Camera Border
            this.disableClipping = false;
            this.showBorder = false;
            this.borderColor = 'rgb(255,255,255)';
            //  Camera Background Color
            this.opaque = true;
            this._bgColor = 'rgb(0,0,0)';
            this._bgTextureRepeat = 'repeat';
            //  Camera Shadow
            this.showShadow = false;
            this.shadowColor = 'rgb(0,0,0)';
            this.shadowBlur = 10;
            this.shadowOffset = new Phaser.MicroPoint(4, 4);
            this.visible = true;
            this.alpha = 1;
            //  The x/y position of the current input event in world coordinates
            this.inputX = 0;
            this.inputY = 0;
            this._game = game;
            this.ID = id;
            this._stageX = x;
            this._stageY = y;
            this.fx = new Phaser.FXManager(this._game, this);
            //  The view into the world canvas we wish to render
            this.worldView = new Phaser.Rectangle(0, 0, width, height);
            this.checkClip();
        }
        Camera.STYLE_LOCKON = 0;
        Camera.STYLE_PLATFORMER = 1;
        Camera.STYLE_TOPDOWN = 2;
        Camera.STYLE_TOPDOWN_TIGHT = 3;
        Camera.prototype.follow = function (target, style) {
            if (typeof style === "undefined") { style = Camera.STYLE_LOCKON; }
            this._target = target;
            var helper;
            switch(style) {
                case Camera.STYLE_PLATFORMER:
                    var w = this.width / 8;
                    var h = this.height / 3;
                    this.deadzone = new Phaser.Rectangle((this.width - w) / 2, (this.height - h) / 2 - h * 0.25, w, h);
                    break;
                case Camera.STYLE_TOPDOWN:
                    helper = Math.max(this.width, this.height) / 4;
                    this.deadzone = new Phaser.Rectangle((this.width - helper) / 2, (this.height - helper) / 2, helper, helper);
                    break;
                case Camera.STYLE_TOPDOWN_TIGHT:
                    helper = Math.max(this.width, this.height) / 8;
                    this.deadzone = new Phaser.Rectangle((this.width - helper) / 2, (this.height - helper) / 2, helper, helper);
                    break;
                case Camera.STYLE_LOCKON:
                default:
                    this.deadzone = null;
                    break;
            }
        };
        Camera.prototype.focusOnXY = function (x, y) {
            x += (x > 0) ? 0.0000001 : -0.0000001;
            y += (y > 0) ? 0.0000001 : -0.0000001;
            this.scroll.x = Math.round(x - this.worldView.halfWidth);
            this.scroll.y = Math.round(y - this.worldView.halfHeight);
        };
        Camera.prototype.focusOn = function (point) {
            point.x += (point.x > 0) ? 0.0000001 : -0.0000001;
            point.y += (point.y > 0) ? 0.0000001 : -0.0000001;
            this.scroll.x = Math.round(point.x - this.worldView.halfWidth);
            this.scroll.y = Math.round(point.y - this.worldView.halfHeight);
        };
        Camera.prototype.setBounds = /**
        * Specify the boundaries of the world or where the camera is allowed to move.
        *
        * @param	x				The smallest X value of your world (usually 0).
        * @param	y				The smallest Y value of your world (usually 0).
        * @param	width			The largest X value of your world (usually the world width).
        * @param	height			The largest Y value of your world (usually the world height).
        */
        function (x, y, width, height) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            if (typeof width === "undefined") { width = 0; }
            if (typeof height === "undefined") { height = 0; }
            if(this.bounds == null) {
                this.bounds = new Phaser.Rectangle();
            }
            this.bounds.setTo(x, y, width, height);
            this.scroll.setTo(0, 0);
            this.update();
        };
        Camera.prototype.update = function () {
            this.fx.preUpdate();
            if(this._target !== null) {
                if(this.deadzone == null) {
                    this.focusOnXY(this._target.x + this._target.origin.x, this._target.y + this._target.origin.y);
                } else {
                    var edge;
                    var targetX = this._target.x + ((this._target.x > 0) ? 0.0000001 : -0.0000001);
                    var targetY = this._target.y + ((this._target.y > 0) ? 0.0000001 : -0.0000001);
                    edge = targetX - this.deadzone.x;
                    if(this.scroll.x > edge) {
                        this.scroll.x = edge;
                    }
                    edge = targetX + this._target.width - this.deadzone.x - this.deadzone.width;
                    if(this.scroll.x < edge) {
                        this.scroll.x = edge;
                    }
                    edge = targetY - this.deadzone.y;
                    if(this.scroll.y > edge) {
                        this.scroll.y = edge;
                    }
                    edge = targetY + this._target.height - this.deadzone.y - this.deadzone.height;
                    if(this.scroll.y < edge) {
                        this.scroll.y = edge;
                    }
                }
            }
            //  Make sure we didn't go outside the cameras bounds
            if(this.bounds !== null) {
                if(this.scroll.x < this.bounds.left) {
                    this.scroll.x = this.bounds.left;
                }
                if(this.scroll.x > this.bounds.right - this.width) {
                    this.scroll.x = (this.bounds.right - this.width) + 1;
                }
                if(this.scroll.y < this.bounds.top) {
                    this.scroll.y = this.bounds.top;
                }
                if(this.scroll.y > this.bounds.bottom - this.height) {
                    this.scroll.y = (this.bounds.bottom - this.height) + 1;
                }
            }
            this.worldView.x = this.scroll.x;
            this.worldView.y = this.scroll.y;
            //  Input values
            this.inputX = this.worldView.x + this._game.input.x;
            this.inputY = this.worldView.y + this._game.input.y;
            this.fx.postUpdate();
        };
        Camera.prototype.render = function () {
            if(this.visible === false || this.alpha < 0.1) {
                return;
            }
            //if (this._rotation !== 0 || this._clip || this.scale.x !== 1 || this.scale.y !== 1)
            //{
            //this._game.stage.context.save();
            //}
            //  It may be safer/quicker to just save the context every frame regardless (needs testing on mobile)
            this._game.stage.context.save();
            this.fx.preRender(this, this._stageX, this._stageY, this.worldView.width, this.worldView.height);
            if(this.alpha !== 1) {
                this._game.stage.context.globalAlpha = this.alpha;
            }
            this._sx = this._stageX;
            this._sy = this._stageY;
            //  Shadow
            if(this.showShadow) {
                this._game.stage.context.shadowColor = this.shadowColor;
                this._game.stage.context.shadowBlur = this.shadowBlur;
                this._game.stage.context.shadowOffsetX = this.shadowOffset.x;
                this._game.stage.context.shadowOffsetY = this.shadowOffset.y;
            }
            //  Scale on
            if(this.scale.x !== 1 || this.scale.y !== 1) {
                this._game.stage.context.scale(this.scale.x, this.scale.y);
                this._sx = this._sx / this.scale.x;
                this._sy = this._sy / this.scale.y;
            }
            //  Rotation - translate to the mid-point of the camera
            if(this._rotation !== 0) {
                this._game.stage.context.translate(this._sx + this.worldView.halfWidth, this._sy + this.worldView.halfHeight);
                this._game.stage.context.rotate(this._rotation * (Math.PI / 180));
                // now shift back to where that should actually render
                this._game.stage.context.translate(-(this._sx + this.worldView.halfWidth), -(this._sy + this.worldView.halfHeight));
            }
            //  Background
            if(this.opaque == true) {
                if(this._bgTexture) {
                    this._game.stage.context.fillStyle = this._bgTexture;
                    this._game.stage.context.fillRect(this._sx, this._sy, this.worldView.width, this.worldView.height);
                } else {
                    this._game.stage.context.fillStyle = this._bgColor;
                    this._game.stage.context.fillRect(this._sx, this._sy, this.worldView.width, this.worldView.height);
                }
            }
            //  Shadow off
            if(this.showShadow) {
                this._game.stage.context.shadowBlur = 0;
                this._game.stage.context.shadowOffsetX = 0;
                this._game.stage.context.shadowOffsetY = 0;
            }
            this.fx.render(this, this._stageX, this._stageY, this.worldView.width, this.worldView.height);
            //  Clip the camera so we don't get sprites appearing outside the edges
            if(this._clip && this.disableClipping == false) {
                this._game.stage.context.beginPath();
                this._game.stage.context.rect(this._sx, this._sy, this.worldView.width, this.worldView.height);
                this._game.stage.context.closePath();
                this._game.stage.context.clip();
            }
            this._game.world.group.render(this, this._sx, this._sy);
            if(this.showBorder) {
                this._game.stage.context.strokeStyle = this.borderColor;
                this._game.stage.context.lineWidth = 1;
                this._game.stage.context.rect(this._sx, this._sy, this.worldView.width, this.worldView.height);
                this._game.stage.context.stroke();
            }
            //  Scale off
            if(this.scale.x !== 1 || this.scale.y !== 1) {
                this._game.stage.context.scale(1, 1);
            }
            this.fx.postRender(this, this._sx, this._sy, this.worldView.width, this.worldView.height);
            if(this._rotation !== 0 || (this._clip && this.disableClipping == false)) {
                this._game.stage.context.translate(0, 0);
            }
            this._game.stage.context.restore();
            if(this.alpha !== 1) {
                this._game.stage.context.globalAlpha = 1;
            }
        };
        Object.defineProperty(Camera.prototype, "backgroundColor", {
            get: function () {
                return this._bgColor;
            },
            set: function (color) {
                this._bgColor = color;
            },
            enumerable: true,
            configurable: true
        });
        Camera.prototype.setTexture = function (key, repeat) {
            if (typeof repeat === "undefined") { repeat = 'repeat'; }
            this._bgTexture = this._game.stage.context.createPattern(this._game.cache.getImage(key), repeat);
            this._bgTextureRepeat = repeat;
        };
        Camera.prototype.setPosition = function (x, y) {
            this._stageX = x;
            this._stageY = y;
            this.checkClip();
        };
        Camera.prototype.setSize = function (width, height) {
            this.worldView.width = width;
            this.worldView.height = height;
            this.checkClip();
        };
        Camera.prototype.renderDebugInfo = function (x, y, color) {
            if (typeof color === "undefined") { color = 'rgb(255,255,255)'; }
            this._game.stage.context.fillStyle = color;
            this._game.stage.context.fillText('Camera ID: ' + this.ID + ' (' + this.worldView.width + ' x ' + this.worldView.height + ')', x, y);
            this._game.stage.context.fillText('X: ' + this._stageX + ' Y: ' + this._stageY + ' Rotation: ' + this._rotation, x, y + 14);
            this._game.stage.context.fillText('World X: ' + this.scroll.x.toFixed(1) + ' World Y: ' + this.scroll.y.toFixed(1), x, y + 28);
            if(this.bounds) {
                this._game.stage.context.fillText('Bounds: ' + this.bounds.width + ' x ' + this.bounds.height, x, y + 56);
            }
        };
        Object.defineProperty(Camera.prototype, "x", {
            get: function () {
                return this._stageX;
            },
            set: function (value) {
                this._stageX = value;
                this.checkClip();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Camera.prototype, "y", {
            get: function () {
                return this._stageY;
            },
            set: function (value) {
                this._stageY = value;
                this.checkClip();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Camera.prototype, "width", {
            get: function () {
                return this.worldView.width;
            },
            set: function (value) {
                if(value > this._game.stage.width) {
                    value = this._game.stage.width;
                }
                this.worldView.width = value;
                this.checkClip();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Camera.prototype, "height", {
            get: function () {
                return this.worldView.height;
            },
            set: function (value) {
                if(value > this._game.stage.height) {
                    value = this._game.stage.height;
                }
                this.worldView.height = value;
                this.checkClip();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Camera.prototype, "rotation", {
            get: function () {
                return this._rotation;
            },
            set: function (value) {
                this._rotation = this._game.math.wrap(value, 360, 0);
            },
            enumerable: true,
            configurable: true
        });
        Camera.prototype.checkClip = function () {
            if(this._stageX !== 0 || this._stageY !== 0 || this.worldView.width < this._game.stage.width || this.worldView.height < this._game.stage.height) {
                this._clip = true;
            } else {
                this._clip = false;
            }
        };
        return Camera;
    })();
    Phaser.Camera = Camera;    
})(Phaser || (Phaser = {}));
