Phaser.Renderer.WebGL.GameObjects.Image = {

    TYPES: [
        Phaser.GameObject.Image.prototype
    ],

    render: function (renderer, src)
    {
        // If the sprite is not visible or the alpha is 0 then no need to render this element
        if (!src.visible || src.alpha === 0 || !src.renderable)
        {
            return;
        }

        // Add back in: || src.texture.crop.width <= 0 || src.texture.crop.height <= 0

        renderer.spriteBatch.render(src);
    }

};
