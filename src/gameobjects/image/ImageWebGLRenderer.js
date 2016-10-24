Phaser.Renderer.WebGL.GameObjects.Image = {

    TYPES: [
        Phaser.GameObject.Image.prototype
    ],

    render: function (renderer, src)
    {
        var frame = src.frame;
        var alpha = src.color.worldAlpha * 255 << 24;

        //  Skip rendering?

        if (src.skipRender || !src.visible || alpha === 0 || !frame.cutWidth || !frame.cutHeight)
        {
            return;
        }

        //  The below works

        var uvs = frame.uvs;
        var verts = src.transform.glVertextData;
        var index = src.frame.source.glTextureIndex;
        var tint = src.color._glTint;
        var bg = src.color._glBg;

        renderer.spriteBatch.addToBatch(src, verts, uvs, index, alpha, tint, bg);

        /*

        // var verts = src.transform.cloneVertexData();
        var worldAlpha = 0.2;

        //  0.2, 0.4, 0.6, 0.8, 1

        //  xy0 Top Left Vert
        //  xy1 Top Right Vert
        //  xy2 Bottom Right Vert
        //  xy3 Bottom Left Vert

        //  Let's just try 5 clones below the current sprite?

        verts.x0 += 8 * 5;
        verts.x1 += 8 * 5;
        verts.x2 += 8 * 5;
        verts.x3 += 8 * 5;

        verts.y0 += 8 * 5;
        verts.y1 += 8 * 5;
        verts.y2 += 8 * 5;
        verts.y3 += 8 * 5;


        for (var i = 0; i < 5; i++)
        {
            alpha = worldAlpha * 255 << 24;

            renderer.spriteBatch.addToBatch(src, verts, uvs, index, alpha, tint, bg);

            verts.x0 -= 8;
            verts.x1 -= 8;
            verts.x2 -= 8;
            verts.x3 -= 8;

            verts.y0 -= 8;
            verts.y1 -= 8;
            verts.y2 -= 8;
            verts.y3 -= 8;

            worldAlpha += 0.2;
        }
        */

        //  Also works ...

        // renderer.spriteBatch.startGameObject(src);
        // renderer.spriteBatch.addVert(verts.x0, verts.y0, uvs.x0, uvs.y0, index, tint.topLeft + alpha, bg);
        // renderer.spriteBatch.addVert(verts.x1, verts.y1, uvs.x1, uvs.y1, index, tint.topRight + alpha, bg);
        // renderer.spriteBatch.addVert(verts.x2, verts.y2, uvs.x2, uvs.y2, index, tint.bottomRight + alpha, bg);
        // renderer.spriteBatch.addVert(verts.x3, verts.y3, uvs.x3, uvs.y3, index, tint.bottomLeft + alpha, bg);
    }

};
