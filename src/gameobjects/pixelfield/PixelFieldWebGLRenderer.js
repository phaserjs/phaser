Phaser.Renderer.WebGL.GameObjects.PixelField = {

    TYPES: [
        Phaser.GameObject.PixelField.prototype
    ],

    render: function (renderer, src)
    {
        var verts = src.transform.glVertextData;
        var color = src.color._glBg;

        renderer.batch.addPixel(verts, color);
    }

};
