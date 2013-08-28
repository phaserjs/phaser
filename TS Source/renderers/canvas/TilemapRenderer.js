var Phaser;
(function (Phaser) {
    (function (Renderer) {
        /// <reference path="../../_definitions.ts" />
        (function (Canvas) {
            var TilemapRenderer = (function () {
                function TilemapRenderer(game) {
                    //  Local rendering related temp vars to help avoid gc spikes through constant var creation
                    this._ga = 1;
                    this._dx = 0;
                    this._dy = 0;
                    this._dw = 0;
                    this._dh = 0;
                    this._tx = 0;
                    this._ty = 0;
                    this._tl = 0;
                    this._maxX = 0;
                    this._maxY = 0;
                    this._startX = 0;
                    this._startY = 0;
                    this.game = game;
                }
                TilemapRenderer.prototype.render = /**
                * Render a tilemap to a specific camera.
                * @param camera {Camera} The camera this tilemap will be rendered to.
                */
                function (camera, tilemap) {
                    //  Loop through the layers
                    this._tl = tilemap.layers.length;
                    for(var i = 0; i < this._tl; i++) {
                        if(tilemap.layers[i].visible == false || tilemap.layers[i].alpha < 0.1) {
                            continue;
                        }
                        var layer = tilemap.layers[i];
                        //  Work out how many tiles we can fit into our camera and round it up for the edges
                        this._maxX = this.game.math.ceil(camera.width / layer.tileWidth) + 1;
                        this._maxY = this.game.math.ceil(camera.height / layer.tileHeight) + 1;
                        //  And now work out where in the tilemap the camera actually is
                        this._startX = this.game.math.floor(camera.worldView.x / layer.tileWidth);
                        this._startY = this.game.math.floor(camera.worldView.y / layer.tileHeight);
                        //  Tilemap bounds check
                        if(this._startX < 0) {
                            this._startX = 0;
                        }
                        if(this._startY < 0) {
                            this._startY = 0;
                        }
                        if(this._maxX > layer.widthInTiles) {
                            this._maxX = layer.widthInTiles;
                        }
                        if(this._maxY > layer.heightInTiles) {
                            this._maxY = layer.heightInTiles;
                        }
                        if(this._startX + this._maxX > layer.widthInTiles) {
                            this._startX = layer.widthInTiles - this._maxX;
                        }
                        if(this._startY + this._maxY > layer.heightInTiles) {
                            this._startY = layer.heightInTiles - this._maxY;
                        }
                        //  Finally get the offset to avoid the blocky movement
                        //this._dx = (camera.screenView.x * layer.transform.scrollFactor.x) - (camera.worldView.x * layer.transform.scrollFactor.x);
                        //this._dy = (camera.screenView.y * layer.transform.scrollFactor.y) - (camera.worldView.y * layer.transform.scrollFactor.y);
                        //this._dx = (camera.screenView.x * this.scrollFactor.x) + this.x - (camera.worldView.x * this.scrollFactor.x);
                        //this._dy = (camera.screenView.y * this.scrollFactor.y) + this.y - (camera.worldView.y * this.scrollFactor.y);
                        this._dx = 0;
                        this._dy = 0;
                        this._dx += -(camera.worldView.x - (this._startX * layer.tileWidth));
                        this._dy += -(camera.worldView.y - (this._startY * layer.tileHeight));
                        this._tx = this._dx;
                        this._ty = this._dy;
                        //  Alpha
                        if(layer.texture.alpha !== 1) {
                            this._ga = layer.texture.context.globalAlpha;
                            layer.texture.context.globalAlpha = layer.texture.alpha;
                        }
                        for(var row = this._startY; row < this._startY + this._maxY; row++) {
                            this._columnData = layer.mapData[row];
                            for(var tile = this._startX; tile < this._startX + this._maxX; tile++) {
                                if(layer.tileOffsets[this._columnData[tile]]) {
                                    layer.texture.context.drawImage(layer.texture.texture, layer.tileOffsets[this._columnData[tile]].x, layer.tileOffsets[this._columnData[tile]].y, layer.tileWidth, layer.tileHeight, this._tx, this._ty, layer.tileWidth, layer.tileHeight);
                                }
                                this._tx += layer.tileWidth;
                            }
                            this._tx = this._dx;
                            this._ty += layer.tileHeight;
                        }
                        if(this._ga > -1) {
                            layer.texture.context.globalAlpha = this._ga;
                        }
                    }
                    return true;
                };
                return TilemapRenderer;
            })();
            Canvas.TilemapRenderer = TilemapRenderer;            
        })(Renderer.Canvas || (Renderer.Canvas = {}));
        var Canvas = Renderer.Canvas;
    })(Phaser.Renderer || (Phaser.Renderer = {}));
    var Renderer = Phaser.Renderer;
})(Phaser || (Phaser = {}));
