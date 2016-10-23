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

        var uvs = frame.uvs;
        var verts = src.transform.glVertextData;
        var index = src.glTextureIndex;
        var alpha = src.color.worldAlpha * 255 << 24;
        var tint = src.color._glTint;
        var bg = src.color._glBg;

        renderer.spriteBatch.render(src);

        //  Several options open to us... we can either just call 'render' and it works out
        //  everything for us.
        //  
        //  Or we can call addVerts 4 times
        //  
        //  Or we can call addVerts and pass in objects, but call it as many times as we like
        //  so we can do special FX from it

        renderer.spriteBatch.addVert(verts.x0, verts.y0, uvs.x0, uvs.y0, index, tint.topLeft + alpha, bg);
        renderer.spriteBatch.addVert(verts.x1, verts.y1, uvs.x1, uvs.y1, index, tint.topRight + alpha, bg);
        renderer.spriteBatch.addVert(verts.x2, verts.y2, uvs.x2, uvs.y2, index, tint.bottomRight + alpha, bg);
        renderer.spriteBatch.addVert(verts.x3, verts.y3, uvs.x3, uvs.y3, index, tint.bottomLeft + alpha, bg);
    }

};
