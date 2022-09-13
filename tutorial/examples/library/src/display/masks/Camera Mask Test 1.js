class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.image('image', 'assets/pics/sao-sinon.png');
        this.load.image('phaser2', 'assets/sprites/phaser2.png');
        this.load.image('asuna', 'assets/sprites/asuna_by_vali233.png');
    }

    create ()
    {
        const shape1 = this.make.graphics().fillStyle(0xffffff).fillRect(200, 150, 400, 500);
        const shape2 = this.make.graphics().fillStyle(0x00ff00).fillCircle(400, 300, 200);
        const shape3 = this.make.graphics().fillStyle(0x0000ff).fillRect(500, 50, 100, 400);

        const mask1 = shape1.createGeometryMask();
        const mask2 = shape2.createGeometryMask();
        const mask3 = shape3.createGeometryMask();

        this.cameras.main.setMask(mask1);
        // this.cameras.main.setMask(mask2);

        const bg = this.add.image(300, 300, 'image').setTint(0xff0000);

        this.tweens.add({
            targets: bg,
            x: 500,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1,
            duration: 2000
        });

        const logo = this.add.image(400, 100, 'phaser2');
        const logo2 = this.add.image(300, 150, 'asuna');
        const logo3 = this.add.image(500, 50, 'asuna');

        this.tweens.add({
            targets: [ logo, logo2, logo3 ],
            y: 500,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1,
            duration: 2000
        });

        logo.setMask(mask2);
        // logo2.setMask(mask2);
        logo3.setMask(mask3);

        const cursors = this.input.keyboard.createCursorKeys();

        const controlConfig = {
            camera: this.cameras.main,
            left: cursors.left,
            right: cursors.right,
            up: cursors.up,
            down: cursors.down,
            zoomIn: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
            zoomOut: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
            acceleration: 0.03,
            drag: 0.0005,
            maxSpeed: 1.0
        };

        this.controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);

        this.input.keyboard.on('keydown-Z', function (event) {

            this.cameras.main.rotation += 0.01;

        }, this);

        this.input.keyboard.on('keydown-X', function (event) {

            this.cameras.main.rotation -= 0.01;

        }, this);
    }

    update (time, delta)
    {
        this.controls.update(delta);
    }
}

const config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-example',
    scene: [ Example ]
};

const game = new Phaser.Game(config);
