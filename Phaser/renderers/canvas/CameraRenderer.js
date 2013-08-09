var Phaser;
(function (Phaser) {
    (function (Renderer) {
        /// <reference path="../../_definitions.ts" />
        (function (Canvas) {
            var CameraRenderer = (function () {
                function CameraRenderer(game) {
                    this._ga = 1;
                    this._sx = 0;
                    this._sy = 0;
                    this._sw = 0;
                    this._sh = 0;
                    this._dx = 0;
                    this._dy = 0;
                    this._dw = 0;
                    this._dh = 0;
                    this._fx = 1;
                    this._fy = 1;
                    this._tx = 0;
                    this._ty = 0;
                    this._gac = 1;
                    this._sin = 0;
                    this._cos = 1;
                    this.game = game;
                }
                CameraRenderer.prototype.preRender = function (camera) {
                    if (camera.visible == false || camera.transform.scale.x == 0 || camera.transform.scale.y == 0 || camera.texture.alpha < 0.1) {
                        return false;
                    }

                    if (this.game.device.patchAndroidClearRectBug) {
                        camera.texture.context.fillStyle = 'rgb(0,0,0)';
                        camera.texture.context.fillRect(0, 0, camera.width, camera.height);
                    } else {
                        camera.texture.context.clearRect(0, 0, camera.width, camera.height);
                    }

                    if (camera.texture.alpha !== 1 && camera.texture.context.globalAlpha != camera.texture.alpha) {
                        this._ga = camera.texture.context.globalAlpha;
                        camera.texture.context.globalAlpha = camera.texture.alpha;
                    }

                    if (camera.texture.opaque) {
                        camera.texture.context.fillStyle = camera.texture.backgroundColor;
                        camera.texture.context.fillRect(0, 0, camera.width, camera.height);
                    }

                    if (camera.texture.globalCompositeOperation) {
                        camera.texture.context.globalCompositeOperation = camera.texture.globalCompositeOperation;
                    }

                    camera.plugins.preRender();
                };

                CameraRenderer.prototype.postRender = function (camera) {
                    if (this._ga > -1) {
                        camera.texture.context.globalAlpha = this._ga;
                    }

                    camera.plugins.postRender();

                    //  Reset our temp vars
                    this._ga = -1;
                    this._sx = 0;
                    this._sy = 0;
                    this._sw = camera.width;
                    this._sh = camera.height;
                    this._fx = camera.transform.scale.x;
                    this._fy = camera.transform.scale.y;
                    this._sin = 0;
                    this._cos = 1;
                    this._dx = camera.screenView.x;
                    this._dy = camera.screenView.y;
                    this._dw = camera.width;
                    this._dh = camera.height;

                    this.game.stage.context.save();

                    if (camera.texture.flippedX) {
                        this._fx = -camera.transform.scale.x;
                    }

                    if (camera.texture.flippedY) {
                        this._fy = -camera.transform.scale.y;
                    }

                    if (camera.modified) {
                        if (camera.transform.rotation !== 0 || camera.transform.rotationOffset !== 0) {
                            this._sin = Math.sin(camera.game.math.degreesToRadians(camera.transform.rotationOffset + camera.transform.rotation));
                            this._cos = Math.cos(camera.game.math.degreesToRadians(camera.transform.rotationOffset + camera.transform.rotation));
                        }

                        this.game.stage.context.setTransform(this._cos * this._fx, (this._sin * this._fx) + camera.transform.skew.x, -(this._sin * this._fy) + camera.transform.skew.y, this._cos * this._fy, this._dx, this._dy);

                        this._dx = camera.transform.origin.x * -this._dw;
                        this._dy = camera.transform.origin.y * -this._dh;
                    } else {
                        this._dx -= (this._dw * camera.transform.origin.x);
                        this._dy -= (this._dh * camera.transform.origin.y);
                    }

                    this._sx = Math.floor(this._sx);
                    this._sy = Math.floor(this._sy);
                    this._sw = Math.floor(this._sw);
                    this._sh = Math.floor(this._sh);
                    this._dx = Math.floor(this._dx);
                    this._dy = Math.floor(this._dy);
                    this._dw = Math.floor(this._dw);
                    this._dh = Math.floor(this._dh);

                    if (this._sw <= 0 || this._sh <= 0 || this._dw <= 0 || this._dh <= 0) {
                        this.game.stage.context.restore();
                        return false;
                    }

                    this.game.stage.context.drawImage(camera.texture.canvas, this._sx, this._sy, this._sw, this._sh, this._dx, this._dy, this._dw, this._dh);

                    this.game.stage.context.restore();
                };
                return CameraRenderer;
            })();
            Canvas.CameraRenderer = CameraRenderer;
        })(Renderer.Canvas || (Renderer.Canvas = {}));
        var Canvas = Renderer.Canvas;
    })(Phaser.Renderer || (Phaser.Renderer = {}));
    var Renderer = Phaser.Renderer;
})(Phaser || (Phaser = {}));
