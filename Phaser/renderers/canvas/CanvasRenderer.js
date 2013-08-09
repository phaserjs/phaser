var Phaser;
(function (Phaser) {
    (function (Renderer) {
        /// <reference path="../../_definitions.ts" />
        (function (Canvas) {
            var CanvasRenderer = (function () {
                function CanvasRenderer(game) {
                    this._c = 0;
                    this.game = game;

                    this.cameraRenderer = new Phaser.Renderer.Canvas.CameraRenderer(game);
                    this.groupRenderer = new Phaser.Renderer.Canvas.GroupRenderer(game);
                    this.spriteRenderer = new Phaser.Renderer.Canvas.SpriteRenderer(game);
                    this.geometryRenderer = new Phaser.Renderer.Canvas.GeometryRenderer(game);
                    this.scrollZoneRenderer = new Phaser.Renderer.Canvas.ScrollZoneRenderer(game);
                    this.tilemapRenderer = new Phaser.Renderer.Canvas.TilemapRenderer(game);
                }
                CanvasRenderer.prototype.render = function () {
                    this._cameraList = this.game.world.getAllCameras();
                    this.renderCount = 0;

                    for (this._c = 0; this._c < this._cameraList.length; this._c++) {
                        if (this._cameraList[this._c].visible) {
                            this.cameraRenderer.preRender(this._cameraList[this._c]);

                            this.game.world.group.render(this._cameraList[this._c]);

                            this.cameraRenderer.postRender(this._cameraList[this._c]);
                        }
                    }

                    this.renderTotal = this.renderCount;
                };

                CanvasRenderer.prototype.renderGameObject = function (camera, object) {
                    if (object.type == Phaser.Types.SPRITE || object.type == Phaser.Types.BUTTON) {
                        this.spriteRenderer.render(camera, object);
                    } else if (object.type == Phaser.Types.SCROLLZONE) {
                        this.scrollZoneRenderer.render(camera, object);
                    } else if (object.type == Phaser.Types.TILEMAP) {
                        this.tilemapRenderer.render(camera, object);
                    }
                };
                return CanvasRenderer;
            })();
            Canvas.CanvasRenderer = CanvasRenderer;
        })(Renderer.Canvas || (Renderer.Canvas = {}));
        var Canvas = Renderer.Canvas;
    })(Phaser.Renderer || (Phaser.Renderer = {}));
    var Renderer = Phaser.Renderer;
})(Phaser || (Phaser = {}));
