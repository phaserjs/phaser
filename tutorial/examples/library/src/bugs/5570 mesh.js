var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

function preload ()
{
  this.load.image('powerups', 'assets/obj/powerups.png');
  this.load.obj('skull', 'assets/obj/skull.obj');
}

function create ()
{
    const mesh = this.add.mesh(400, 300, 'powerups');

    mesh.addVerticesFromObj('skull', 0.1);

    mesh.panZ(7);
    mesh.modelRotation.y += 0.5;

    this.debug = this.add.graphics().setScrollFactor(0);

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

    this.mesh = mesh;

    const cursors = this.input.keyboard.createCursorKeys();

    const controlConfig = {
        camera: this.cameras.main,
        left: cursors.left,
        right: cursors.right,
        up: cursors.up,
        down: cursors.down,
        zoomIn: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
        zoomOut: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
        acceleration: 0.06,
        drag: 0.0005,
        maxSpeed: 1.0
    };

    this.controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);

    this.t = this.add.text(10, 10).setScrollFactor(0);

    window.cam = this.cameras.main;
}

function update (time, delta)
{
    this.controls.update(delta);

    this.debug.clear();
    this.debug.lineStyle(1, 0x00ff00);

    this.t.text = this.mesh.totalRendered;
}
