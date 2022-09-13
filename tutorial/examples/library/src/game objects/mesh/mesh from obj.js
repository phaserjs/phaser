class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.image('bg', 'assets/skies/wtf.png');
        this.load.obj('skull', 'assets/obj/skull.obj');
        this.load.image('powerups', 'assets/obj/powerups.png');
    }

    create ()
    {
        this.add.image(400, 300, 'bg');

        const mesh = this.add.mesh(400, 300, 'powerups');

        mesh.addVerticesFromObj('skull', 0.1);

        mesh.panZ(7);
        mesh.modelRotation.y += 0.5;

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
