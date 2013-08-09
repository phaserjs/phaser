var Phaser;
(function (Phaser) {
    (function (Renderer) {
        /// <reference path="../../_definitions.ts" />
        (function (Canvas) {
            var ScrollZoneRenderer = (function () {
                function ScrollZoneRenderer(game) {
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
                /**
                * Check whether this object is visible in a specific camera Rectangle.
                * @param camera {Rectangle} The Rectangle you want to check.
                * @return {boolean} Return true if bounds of this sprite intersects the given Rectangle, otherwise return false.
                */
                ScrollZoneRenderer.prototype.inCamera = function (camera, scrollZone) {
                    if (scrollZone.transform.scrollFactor.equals(0)) {
                        return true;
                    }

                    //return RectangleUtils.intersects(sprite.cameraView, camera.screenView);
                    return true;
                };

                ScrollZoneRenderer.prototype.render = function (camera, scrollZone) {
                    if (scrollZone.transform.scale.x == 0 || scrollZone.transform.scale.y == 0 || scrollZone.texture.alpha < 0.1 || this.inCamera(camera, scrollZone) == false) {
                        return false;
                    }

                    //  Reset our temp vars
                    this._ga = -1;
                    this._sx = 0;
                    this._sy = 0;
                    this._sw = scrollZone.width;
                    this._sh = scrollZone.height;
                    this._fx = scrollZone.transform.scale.x;
                    this._fy = scrollZone.transform.scale.y;
                    this._sin = 0;
                    this._cos = 1;
                    this._dx = (camera.screenView.x * scrollZone.transform.scrollFactor.x) + scrollZone.x - (camera.worldView.x * scrollZone.transform.scrollFactor.x);
                    this._dy = (camera.screenView.y * scrollZone.transform.scrollFactor.y) + scrollZone.y - (camera.worldView.y * scrollZone.transform.scrollFactor.y);
                    this._dw = scrollZone.width;
                    this._dh = scrollZone.height;

                    if (scrollZone.texture.alpha !== 1) {
                        this._ga = scrollZone.texture.context.globalAlpha;
                        scrollZone.texture.context.globalAlpha = scrollZone.texture.alpha;
                    }

                    if (scrollZone.texture.flippedX) {
                        this._fx = -scrollZone.transform.scale.x;
                    }

                    if (scrollZone.texture.flippedY) {
                        this._fy = -scrollZone.transform.scale.y;
                    }

                    if (scrollZone.modified) {
                        if (scrollZone.texture.renderRotation == true && (scrollZone.rotation !== 0 || scrollZone.transform.rotationOffset !== 0)) {
                            this._sin = Math.sin(scrollZone.game.math.degreesToRadians(scrollZone.transform.rotationOffset + scrollZone.rotation));
                            this._cos = Math.cos(scrollZone.game.math.degreesToRadians(scrollZone.transform.rotationOffset + scrollZone.rotation));
                        }

                        scrollZone.texture.context.save();

                        scrollZone.texture.context.setTransform(this._cos * this._fx, (this._sin * this._fx) + scrollZone.transform.skew.x, -(this._sin * this._fy) + scrollZone.transform.skew.y, this._cos * this._fy, this._dx, this._dy);

                        this._dx = -scrollZone.transform.origin.x;
                        this._dy = -scrollZone.transform.origin.y;
                    } else {
                        if (!scrollZone.transform.origin.equals(0)) {
                            this._dx -= scrollZone.transform.origin.x;
                            this._dy -= scrollZone.transform.origin.y;
                        }
                    }

                    this._sx = Math.floor(this._sx);
                    this._sy = Math.floor(this._sy);
                    this._sw = Math.floor(this._sw);
                    this._sh = Math.floor(this._sh);
                    this._dx = Math.floor(this._dx);
                    this._dy = Math.floor(this._dy);
                    this._dw = Math.floor(this._dw);
                    this._dh = Math.floor(this._dh);

                    for (var i = 0; i < scrollZone.regions.length; i++) {
                        if (scrollZone.texture.isDynamic) {
                            scrollZone.regions[i].render(scrollZone.texture.context, scrollZone.texture.texture, this._dx, this._dy, this._dw, this._dh);
                        } else {
                            scrollZone.regions[i].render(scrollZone.texture.context, scrollZone.texture.texture, this._dx, this._dy, this._dw, this._dh);
                        }
                    }

                    if (scrollZone.modified) {
                        scrollZone.texture.context.restore();
                    }

                    if (this._ga > -1) {
                        scrollZone.texture.context.globalAlpha = this._ga;
                    }

                    this.game.renderer.renderCount++;

                    return true;
                };
                return ScrollZoneRenderer;
            })();
            Canvas.ScrollZoneRenderer = ScrollZoneRenderer;
        })(Renderer.Canvas || (Renderer.Canvas = {}));
        var Canvas = Renderer.Canvas;
    })(Phaser.Renderer || (Phaser.Renderer = {}));
    var Renderer = Phaser.Renderer;
})(Phaser || (Phaser = {}));
