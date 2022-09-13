class FractalPlugin extends Phaser.Plugins.ScenePlugin {

    constructor (scene, pluginManager)
    {
        super(scene, pluginManager);

        this.texture;
        this.canvas;
        this.context;
        this.maxIterations = 100;
    }

    create (x, y, w, h)
    {
        this.texture = this.scene.textures.createCanvas('FractalPlugin', w, h);

        this.canvas = this.texture.canvas;
        this.context = this.texture.context;

        this.drawJulia();

        this.texture.refresh();

        let image = this.scene.add.image(x, y, 'FractalPlugin');

        return image;
    }

    drawJulia ()
    {
        let cw = this.canvas.width;
        let ch = this.canvas.height;
        let imageData = this.context.createImageData(cw, ch);
        let data = imageData.data;

        let x0 = -0.4;
        let y0 = -0.6;

        for (let i = 0; i < ch; i++)
        {
            for (let j = 0; j < cw; j++)
            {
                // limit the axis
                let x = -1.5 + j * 3.0 / cw;
                let y = -1.0 + i * 2.0 / ch;
                
                let iteration = 0;
                
                while ((x * x + y * y < 4) && (iteration < this.maxIterations))
                {
                    let xN = x * x - y * y + x0;
                    let yN = 2 * x * y + y0;
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

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    plugins: {
        scene: [
            { key: 'fractalPlugin', plugin: FractalPlugin, mapping: 'fractals' }
        ]
    },
    scene: {

        create: create
    }
};

let game = new Phaser.Game(config);

function create ()
{
    this.fractals.create(400, 300, 800, 600);
}
