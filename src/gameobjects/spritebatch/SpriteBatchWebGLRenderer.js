Phaser.Renderer.WebGL.GameObjects.SpriteBatch = {

    TYPES: [
        Phaser.GameObject.SpriteBatch.prototype
    ],

    render: function (renderer, src)
    {
        if (!src.visible || src.alpha <= 0 || !src.children.length)
        {
            return;
        }

        var gl = renderer.gl;

        if (!src.ready)
        {
            src.fastSpriteBatch = new PIXI.WebGLFastSpriteBatch(gl);

            src.ready = true;
        }
        
        if (src.fastSpriteBatch.gl !== gl)
        {
            src.fastSpriteBatch.setContext(gl);
        }

        renderer.spriteBatch.stop();
        
        renderer.shaderManager.setShader(renderer.shaderManager.fastShader);
        
        src.fastSpriteBatch.begin(src);

        src.fastSpriteBatch.render(src);

        renderer.spriteBatch.start();
    }
};
