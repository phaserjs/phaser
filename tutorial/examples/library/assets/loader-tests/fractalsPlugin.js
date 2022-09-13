/**
 * @author       delimitry
 * @author       Richard Davey <rich@photonstorm.com>
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

class FractalPlugin {

    constructor (scene)
    {
        this.scene = scene;

        this.systems = scene.sys;

        if (!scene.sys.settings.isBooted)
        {
            scene.sys.events.once('boot', this.boot, this);
        }
        else
        {
            this.boot();
        }

        this.maxIterations = 100;
    }

    boot ()
    {
        this.texture = this.scene.textures.createCanvas('FractalPlugin', 800, 600);

        this.canvas = this.texture.canvas;
        this.context = this.texture.context;
    }

    createImage (x, y)
    {
        if (this.texture)
        {
            this.drawJulia();

            this.texture.refresh();

            let image = this.scene.add.image(x, y, 'FractalPlugin');

            return image;
        }
    }

    drawJulia ()
    {
        var cw = this.canvas.width;
        var ch = this.canvas.height;
        var imageData = this.context.createImageData(cw, ch);
        var data = imageData.data;

        var x0 = -0.4;
        var y0 = -0.6;

        for (var i = 0; i < ch; i++)
        {
            for (var j = 0; j < cw; j++)
            {
                // limit the axis
                var x = -1.5 + j * 3.0 / cw;
                var y = -1.0 + i * 2.0 / ch;

                var iteration = 0;

                while ((x * x + y * y < 4) && (iteration < maxIterations))
                {
                    var xN = x * x - y * y + x0;
                    var yN = 2 * x * y + y0;
                    x = xN;
                    y = yN;
                    iteration++;
                }

                // set pixel color [r,g,b,a]
                data[i * cw * 4 + j * 4 + 0] = iteration * 8;
                data[i * cw * 4 + j * 4 + 1] = iteration * 5;
                data[i * cw * 4 + j * 4 + 2] = iteration * 25;
                data[i * cw * 4 + j * 4 + 3] = 255;
            }
        }

        this.context.putImageData(imageData, 0, 0);
    }
}

FractalPlugin.register = function (PluginManager)
{
    console.log('register');

    PluginManager.register('FractalPlugin', FractalPlugin, 'fractals');
}
