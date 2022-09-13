class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.image('bg', 'assets/skies/gradient13.png');
        this.load.image('brick', ['assets/normal-maps/brick.jpg', 'assets/normal-maps/brick_n.png']);
    }

    create ()
    {
        this.lights.enable();
        this.lights.setAmbientColor(0x808080);

        var spotlight = this.lights.addLight(400, 300, 280).setIntensity(3);

        this.input.on('pointermove', function (pointer) {

            spotlight.x = pointer.x;
            spotlight.y = pointer.y;

        });

        this.add.image(400, 300, 'bg').setFlip(false, true);

        const mesh = this.add.mesh(400, 300, 'brick');

        Phaser.Geom.Mesh.GenerateGridVerts({
            mesh,
            widthSegments: 6
        });

        mesh.hideCCW = false;

        mesh.panZ(3.5);

        mesh.setPipeline('Light2D');

        this.debug = this.add.graphics();

        this.add.text(16, 16, 'Rotate with mouse (+ Shift to pan)\nWheel to zoom\nD to toggle debug');

        this.input.keyboard.on('keydown-D', () => {

            if (mesh.debugCallback)
            {
                mesh.setDebug();
            }
            else
            {
                mesh.setDebug(this.debug);
            }

        });

        const rotateRate = 1;
        const panRate = 1;
        const zoomRate = 4;

        this.input.on('pointermove', pointer => {

            if (!pointer.isDown)
            {
                return;
            }

            if (!pointer.event.shiftKey)
            {
                mesh.modelRotation.y += pointer.velocity.x * (rotateRate / 800);
                mesh.modelRotation.x += pointer.velocity.y * (rotateRate / 600);
            }
            else
            {
                mesh.panX(pointer.velocity.x * (panRate / 800));
                mesh.panY(pointer.velocity.y * (panRate / 600));
            }

        });

        this.input.on('wheel', (pointer, over, deltaX, deltaY, deltaZ) => {

            mesh.panZ(deltaY * (zoomRate / 600));

        });
    }

    update ()
    {
        this.debug.clear();
        this.debug.lineStyle(1, 0x00ff00);
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#0a440a',
    parent: 'phaser-example',
    scene: Example
};

let game = new Phaser.Game(config);
