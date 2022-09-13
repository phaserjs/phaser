class FractalPlugin extends Phaser.Plugins.ScenePlugin {

    constructor (scene, pluginManager)
    {
        super(scene, pluginManager);

        this.texture;
        this.canvas;
        this.context;
        this.maxIterations = 64;

        this.imageData;
        this.data;

        this.v1 = -1.5;
        this.v2 = 3.0;
        this.v3 = -1.0;
        this.v4 = 2.0;
        this.x0 = -0.4;
        this.y0 = -0.6;

        this.c1 = 8;
        this.c2 = 5;
        this.c3 = 25;
    }

    boot ()
    {
        var eventEmitter = this.systems.events;

        eventEmitter.on('update', this.update, this);
    }

    create (x, y, w, h)
    {
        this.texture = this.scene.textures.createCanvas('FractalPlugin', w, h);

        this.canvas = this.texture.canvas;
        this.context = this.texture.context;
        this.imageData = this.context.createImageData(w, h);
        this.data = this.imageData.data;

        this.drawJulia();

        this.texture.refresh();

        let image = this.scene.add.image(x, y, 'FractalPlugin');

        return image;
    }

    update ()
    {
        if (!this.texture)
        {
            return;
        }

        this.drawJulia();
        this.texture.refresh();
    }

    drawJulia ()
    {
        let cw = this.canvas.width;
        let ch = this.canvas.height;

        let imageData = this.imageData;
        let data = this.data;

        let x0 = this.x0;
        let y0 = this.y0;

        for (let i = 0; i < ch; i++)
        {
            for (let j = 0; j < cw; j++)
            {
                // limit the axis
                let x = this.v1 + j * this.v2 / cw;
                let y = this.v3 + i * this.v4 / ch;
                
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
                data[i * cw * 4 + j * 4 + 0] = iteration * this.c1;
                data[i * cw * 4 + j * 4 + 1] = iteration * this.c2;
                data[i * cw * 4 + j * 4 + 2] = iteration * this.c3;
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
    var image = this.fractals.create(400, 300, 256, 256);

    image.setScale(2);

    this.tweens.add({

        targets: this.fractals,
        v1: 1.5,
        v2: -3.0,
        v3: 1.0,
        v4: -2.0,
        duration: 4000,
        yoyo: true,
        repeat: -1

    });

    this.tweens.add({

        targets: this.fractals,
        c1: 16,
        c2: 10,
        c3: 0,
        duration: 16000,
        yoyo: true,
        repeat: -1

    });
}
