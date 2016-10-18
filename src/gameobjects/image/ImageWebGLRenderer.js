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
    }

};
