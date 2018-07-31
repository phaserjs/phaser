var RenderTextureCanvas = {

    /**
     * Fills the Render Texture with the given color.
     *
     * @method Phaser.GameObjects.RenderTexture#fill
     * @since 3.2.0
     *
     * @param {number} rgb - The color to fill the Render Texture with.
     *
     * @return {Phaser.GameObjects.RenderTexture} This Game Object.
     */
    fill: function (rgb)
    {
        var ur = ((rgb >> 16)|0) & 0xff;
        var ug = ((rgb >> 8)|0) & 0xff;
        var ub = (rgb|0) & 0xff;

        this.context.fillStyle = 'rgb(' + ur + ',' + ug + ',' + ub + ')';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

        return this;
    },

    /**
     * Clears the Render Texture.
     *
     * @method Phaser.GameObjects.RenderTexture#clear
     * @since 3.2.0
     *
     * @return {Phaser.GameObjects.RenderTexture} This Game Object.
     */
    clear: function ()
    {
        this.context.save();
        this.context.setTransform(1, 0, 0, 1, 0, 0);
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.restore();

        return this;
    },

    /**
     * Draws the Texture Frame to the Render Texture at the given position.
     * 
     * You can either pass in a Game Object frame property:
     * 
     * ```javascript
     * var rt = this.add.renderTexture(100, 100, 400, 300);
     * var bunny = this.make.sprite({ key: 'bunny' }, false);
     * rt.draw(bunny.frame, 0, 0);
     * ```
     * 
     * Or get a frame reference from the Texture Manager:
     * 
     * ```javascript
     * var rt = this.add.renderTexture(100, 100, 400, 300);
     * var bunny = this.textures.getFrame('bunny');
     * rt.draw(bunny, 0, 0);
     * ```
     *
     * @method Phaser.GameObjects.RenderTexture#draw
     * @since 3.2.0
     *
     * @param {Phaser.Textures.Frame} frame - The Texture Frame that will be drawn to the Render Texture.
     * @param {number} x - The x position to draw the frame at.
     * @param {number} y - The y position to draw the frame at.
     *
     * @return {this} This Game Object.
     */
    draw: function (frame, x, y)
    {
        var cd = frame.canvasData;
        var source = frame.source.image;

        var matrix = this.currentMatrix;

        this.context.globalAlpha = this.globalAlpha;
        this.context.setTransform(matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]);
        this.context.drawImage(source, cd.x, cd.y, cd.width, cd.height, x, y, cd.width, cd.height);

        return this;
    }

};

module.exports = RenderTextureCanvas;
