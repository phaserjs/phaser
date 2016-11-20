Phaser.Renderer.WebGL.GameObjects.PixelField = {

    TYPES: [
        Phaser.GameObject.PixelField.prototype
    ],

    render: function (renderer, src, interpolationPercentage)
    {
        var pixel;
        var verts = src.transform.getVertexData(interpolationPercentage);

        for (var i = 0; i < src.list.length; i++)
        {
            pixel = src.list[i];

            if (pixel.a > 0)
            {
                renderer.batch.addPixel(
                    verts.x0 + pixel.x,
                    verts.y0 + pixel.y,
                    verts.x1 + pixel.x,
                    verts.y1 + pixel.y,
                    verts.x2 + pixel.x,
                    verts.y2 + pixel.y,
                    verts.x3 + pixel.x,
                    verts.y3 + pixel.y,
                    pixel.color
                );
            }
        }
    }

};
