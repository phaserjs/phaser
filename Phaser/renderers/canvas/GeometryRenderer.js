var Phaser;
(function (Phaser) {
    (function (Renderer) {
        /// <reference path="../../_definitions.ts" />
        (function (Canvas) {
            var GeometryRenderer = (function () {
                function GeometryRenderer(game) {
                    //  Local rendering related temp vars to help avoid gc spikes through constant var creation
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
                    this._sin = 0;
                    this._cos = 1;
                    this.game = game;
                }
                GeometryRenderer.prototype.renderCircle = function (camera, circle, context, outline, fill, lineColor, fillColor, lineWidth) {
                    if (typeof outline === "undefined") { outline = false; }
                    if (typeof fill === "undefined") { fill = true; }
                    if (typeof lineColor === "undefined") { lineColor = 'rgb(0,255,0)'; }
                    if (typeof fillColor === "undefined") { fillColor = 'rgba(0,100,0.0.3)'; }
                    if (typeof lineWidth === "undefined") { lineWidth = 1; }
                    //  Reset our temp vars
                    this._sx = 0;
                    this._sy = 0;
                    this._sw = circle.diameter;
                    this._sh = circle.diameter;
                    this._fx = 1;
                    this._fy = 1;
                    this._sin = 0;
                    this._cos = 1;
                    this._dx = camera.screenView.x + circle.x - camera.worldView.x;
                    this._dy = camera.screenView.y + circle.y - camera.worldView.y;
                    this._dw = circle.diameter;
                    this._dh = circle.diameter;

                    this._sx = Math.floor(this._sx);
                    this._sy = Math.floor(this._sy);
                    this._sw = Math.floor(this._sw);
                    this._sh = Math.floor(this._sh);
                    this._dx = Math.floor(this._dx);
                    this._dy = Math.floor(this._dy);
                    this._dw = Math.floor(this._dw);
                    this._dh = Math.floor(this._dh);

                    this.game.stage.saveCanvasValues();

                    context.save();
                    context.lineWidth = lineWidth;
                    context.strokeStyle = lineColor;
                    context.fillStyle = fillColor;

                    context.beginPath();
                    context.arc(this._dx, this._dy, circle.radius, 0, Math.PI * 2);
                    context.closePath();

                    if (outline) {
                        //context.stroke();
                    }

                    if (fill) {
                        context.fill();
                    }

                    context.restore();

                    this.game.stage.restoreCanvasValues();

                    return true;
                };
                return GeometryRenderer;
            })();
            Canvas.GeometryRenderer = GeometryRenderer;
        })(Renderer.Canvas || (Renderer.Canvas = {}));
        var Canvas = Renderer.Canvas;
    })(Phaser.Renderer || (Phaser.Renderer = {}));
    var Renderer = Phaser.Renderer;
})(Phaser || (Phaser = {}));
