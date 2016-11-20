Phaser.Renderer.WebGL.GameObjects.Sprite = {

    TYPES: [
        Phaser.GameObject.Sprite.prototype
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

        var verts = src.transform.glVertextData;
        var index = src.frame.source.glTextureIndex;
        var tint = src.color._glTint;
        var bg = src.color._glBg;

        renderer.batch.add(frame.source, src.blendMode, verts, frame.uvs, index, alpha, tint, bg);

        //  Render children
        for (var i = 0; i < src.children.length; i++)
        {
            var child = src.children[i];

            child.render(renderer, child);
        }
    }

};
