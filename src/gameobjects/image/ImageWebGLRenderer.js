Phaser.Renderer.WebGL.GameObjects.Image = {

    TYPES: [
        Phaser.GameObject.Image.prototype
    ],

    render: function (renderer, src)
    {
        var frame = src.frame;

        //  Skip rendering?

        if (src.skipRender || !src.visible || src.worldAlpha <= 0 || !frame.cutWidth || !frame.cutHeight)
        {
            return;
        }

        renderer.spriteBatch.render(src);

        /*

        renderer.spriteBatch.setCurrentTexture(src.frame.source);

        // Get the Texture UVs
        var frame = src.frame;
        var source = frame.source;
        var uvs = frame.uvs;

        var aX = src.anchorX;
        var aY = src.anchorY;

        var w0, w1, h0, h1;

        w0 = (frame.width) * (1 - aX);
        w1 = (frame.width) * -aX;

        h0 = frame.height * (1 - aY);
        h1 = frame.height * -aY;

        var resolution = source.resolution;
        var textureIndex = source.glTextureIndex;

        var wt = sprite.transform.world;

        var a = wt.a / resolution;
        var b = wt.b / resolution;
        var c = wt.c / resolution;
        var d = wt.d / resolution;
        var tx = wt.tx;
        var ty = wt.ty;

        if (this.renderer.roundPixels)
        {
            tx |= 0;
            ty |= 0;
        }

        //  Top Left

        a * w1 + c * h1 + tx

        renderer.spriteBatch.addVertexData(x, y, uvX, uvY, tint, bgColor);

        //  Top Right
        renderer.spriteBatch.addVertexData(x, y, uvX, uvY, tint, bgColor);

        //  Bottom Right
        renderer.spriteBatch.addVertexData(x, y, uvX, uvY, tint, bgColor);

        //  Bottom Left
        renderer.spriteBatch.addVertexData(x, y, uvX, uvY, tint, bgColor, gameObject);

        // renderer.spriteBatch.render(src);

        */

    }

};
