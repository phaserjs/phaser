Phaser.TilemapRenderer = function (game) {

    this.game = game;

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
	
};

Phaser.TilemapRenderer.prototype = {

    /**
     * Render a tilemap to a canvas.
     * @param tilemap {Tilemap} The tilemap data to render.
     */
    render: function (tilemap) {

        //  Loop through the layers
        this._tl = tilemap.layers.length;

        for (var i = 0; i < this._tl; i++)
        {
            if (tilemap.layers[i].visible == false || tilemap.layers[i].alpha < 0.1)
            {
                continue;
            }

            var layer = tilemap.layers[i];

            //  Work out how many tiles we can fit into our canvas and round it up for the edges
            this._maxX = this.game.math.ceil(layer.canvas.width / layer.tileWidth) + 1;
            this._maxY = this.game.math.ceil(layer.canvas.height / layer.tileHeight) + 1;

            //  And now work out where in the tilemap the camera actually is
            this._startX = this.game.math.floor(this.game.camera.x / layer.tileWidth);
            this._startY = this.game.math.floor(this.game.camera.y / layer.tileHeight);

            //  Tilemap bounds check
            if (this._startX < 0)
            {
                this._startX = 0;
            }

            if (this._startY < 0)
            {
                this._startY = 0;
            }

            if (this._maxX > layer.widthInTiles)
            {
                this._maxX = layer.widthInTiles;
            }

            if (this._maxY > layer.heightInTiles)
            {
                this._maxY = layer.heightInTiles;
            }

            if (this._startX + this._maxX > layer.widthInTiles)
            {
                this._startX = layer.widthInTiles - this._maxX;
            }

            if (this._startY + this._maxY > layer.heightInTiles)
            {
                this._startY = layer.heightInTiles - this._maxY;
            }

            //  Finally get the offset to avoid the blocky movement
            this._dx = -(this.game.camera.x - (this._startX * layer.tileWidth));
            this._dy = -(this.game.camera.y - (this._startY * layer.tileHeight));

            this._tx = this._dx;
            this._ty = this._dy;

            //  Alpha
            if (layer.alpha !== 1)
            {
                this._ga = layer.context.globalAlpha;
                layer.context.globalAlpha = layer.alpha;
            }

            layer.context.clearRect(0, 0, layer.canvas.width, layer.canvas.height);

            for (var row = this._startY; row < this._startY + this._maxY; row++)
            {
                this._columnData = layer.mapData[row];

                for (var tile = this._startX; tile < this._startX + this._maxX; tile++)
                {
                    if (layer.tileOffsets[this._columnData[tile]])
                    {
                        layer.context.drawImage(
                            layer.tileset,
                            layer.tileOffsets[this._columnData[tile]].x,
                            layer.tileOffsets[this._columnData[tile]].y,
                            layer.tileWidth,
                            layer.tileHeight,
                            this._tx,
                            this._ty,
                            layer.tileWidth,
                            layer.tileHeight
                            );
                    }

                    this._tx += layer.tileWidth;

                }

                this._tx = this._dx;
                this._ty += layer.tileHeight;

            }

            if (this._ga > -1)
            {
                layer.context.globalAlpha = this._ga;
            }

	        //  Only needed if running in WebGL, otherwise this array will never get cleared down I don't think!
	        PIXI.texturesToUpdate.push(layer.baseTexture);

        }

        return true;

    }

};