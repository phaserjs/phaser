var Frame = require('../../textures/Frame');
var Utils = require('../../renderer/webgl/Utils');

var RenderTextureWebGL = {

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
    fill: function (rgb, alpha)
    {
        if (alpha === undefined) { alpha = 1; }

        var ur = ((rgb >> 16)|0) & 0xff;
        var ug = ((rgb >> 8)|0) & 0xff;
        var ub = (rgb|0) & 0xff;

        this.renderer.setFramebuffer(this.framebuffer);

        var gl = this.gl;

        gl.clearColor(ur / 255.0, ug / 255.0, ub / 255.0, alpha);

        gl.clear(gl.COLOR_BUFFER_BIT);

        this.renderer.setFramebuffer(null);

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
        this.renderer.setFramebuffer(this.framebuffer);

        var gl = this.gl;

        gl.clearColor(0, 0, 0, 0);

        gl.clear(gl.COLOR_BUFFER_BIT);

        this.renderer.setFramebuffer(null);

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
     * @param {number} [tint] - A tint color to be applied to the frame drawn to the Render Texture.
     *
     * @return {this} This Game Object.
     */
    draw: function (entries, x, y, tint)
    {
        if (!Array.isArray(entries))
        {
            entries = [ entries ];
        }

        this.renderer.setFramebuffer(this.framebuffer);

        this.camera.preRender(1, 1, 1);

        var pipeline = this.pipeline;

        pipeline.projOrtho(0, this.width, 0, this.height, -1000.0, 1000.0);

        this.drawList(entries, x, y, tint);

        pipeline.flush();

        this.renderer.setFramebuffer(null);

        pipeline.projOrtho(0, pipeline.width, pipeline.height, 0, -1000.0, 1000.0);

        return this;
    },

    drawList: function (children, x, y, tint)
    {
        for (var i = 0; i < children.length; i++)
        {
            var entry = children[i];

            if (!entry || entry === this)
            {
                continue;
            }

            if (entry.renderWebGL)
            {
                //  Game Objects
                this.drawGameObject(entry, x, y);
            }
            else if (entry.isParent || entry.list)
            {
                //  Groups
                this.drawGroup(entry.getChildren(), x, y);
            }
            else if (entry instanceof Frame)
            {
                //  Texture Frames
                this.drawFrame(entry, x, y, tint);
            }
        }
    },

    drawGroup: function (children, x, y)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }

        for (var i = 0; i < children.length; i++)
        {
            var entry = children[i];

            if (entry.renderWebGL)
            {
                var tx = entry.x + x;
                var ty = entry.y + y;

                this.drawGameObject(entry, tx, ty);
            }
        }
    },

    drawGameObject: function (gameObject, x, y)
    {
        if (x === undefined) { x = gameObject.x; }
        if (y === undefined) { y = gameObject.y; }

        var prevX = gameObject.x;
        var prevY = gameObject.y;

        this.renderer.setBlendMode(gameObject.blendMode);

        gameObject.setPosition(x, y);

        gameObject.renderWebGL(this.renderer, gameObject, 0, this.camera, null);

        gameObject.setPosition(prevX, prevY);
    },

    drawTexture: function (key, frame, x, y, alpha, tint)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }
        if (alpha === undefined) { alpha = this.globalAlpha; }

        if (tint === undefined)
        {
            tint = (this.globalTint >> 16) + (this.globalTint & 0xff00) + ((this.globalTint & 0xff) << 16);
        }
        else
        {
            tint = (tint >> 16) + (tint & 0xff00) + ((tint & 0xff) << 16);
        }

        var textureFrame = this.textureManager.getFrame(key, frame);

        if (textureFrame)
        {
            this.renderer.setFramebuffer(this.framebuffer);

            this.camera.preRender(1, 1, 1);
    
            var pipeline = this.pipeline;
    
            pipeline.projOrtho(0, this.width, 0, this.height, -1000.0, 1000.0);
    
            this.pipeline.batchTextureFrame(frame, x, y, tint, alpha, this.camera.matrix, null);
        
            pipeline.flush();
    
            this.renderer.setFramebuffer(null);
    
            pipeline.projOrtho(0, pipeline.width, pipeline.height, 0, -1000.0, 1000.0);
        }

        return this;
    },

    drawFrame: function (frame, x, y, tint)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }

        if (tint === undefined)
        {
            tint = (this.globalTint >> 16) + (this.globalTint & 0xff00) + ((this.globalTint & 0xff) << 16);
        }
        else
        {
            tint = (tint >> 16) + (tint & 0xff00) + ((tint & 0xff) << 16);
        }

        this.pipeline.batchTextureFrame(frame, x, y, tint, this.globalAlpha, this.camera.matrix, null);
    }

};

module.exports = RenderTextureWebGL;
