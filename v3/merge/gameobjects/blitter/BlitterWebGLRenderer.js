Phaser.Renderer.WebGL.GameObjects.Blitter = {

    TYPES: [
        Phaser.GameObject.Blitter.prototype
    ],

    render: function (renderer, src, interpolationPercentage)
    {
        var blitterAlpha = src.color.worldAlpha * 255 << 24;

        //  Skip rendering?
        if (src.skipRender || !src.visible || blitterAlpha === 0 || src.children.list.length === 0)
        {
            return;
        }

        var bg = src.color._glBg;
        var tint = src.color._glTint;
        var worldAlpha = src.color._worldAlpha;
    
        //  Render children
        for (var i = 0; i < src.children.list.length; i++)
        {
            var bob = src.children.list[i];
            var frame = bob.frame;
            var alpha = (worldAlpha * bob.alpha) * 255 << 24;

            if (!bob.visible || alpha === 0 || !frame.cutWidth || !frame.cutHeight)
            {
                continue;
            }

            var index = frame.source.glTextureIndex;
            var verts = bob.transform.getVertexData(interpolationPercentage);

            //  tint and bg values come from the parent Blitter object, not the Bob
            renderer.batch.add(frame.source, src.blendMode, verts, frame.uvs, index, alpha, tint, bg);
        }
    }

};
