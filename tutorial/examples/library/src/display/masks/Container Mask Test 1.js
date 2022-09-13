class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.image('bg', 'assets/ui/undersea-bg.png');
        this.load.image('rick', 'assets/sprites/rick.png');
    }

    create ()
    {
        const bg = this.add.image(400, 300, 'bg');

        //  Our container
        const container = this.add.container(400, 300);

        //  Create some sprites - positions are relative to the Container x/y
        const sprite0 = this.add.sprite(-400, 0, 'rick');
        const sprite1 = this.add.sprite(0, 0, 'rick');
        const sprite2 = this.add.sprite(400, 0, 'rick');
        const sprite3 = this.add.sprite(-200, -200, 'rick');
        const sprite4 = this.add.sprite(200, -200, 'rick');
        const sprite5 = this.add.sprite(200, 200, 'rick');
        const sprite6 = this.add.sprite(-200, 200, 'rick');

        container.add([ sprite0, sprite1, sprite2, sprite3, sprite4, sprite5, sprite6 ]);

        this.tweens.add({
            targets: container,
            angle: { value: 360, duration: 6000 },
            scaleX: { value: 0.5, duration: 3000, yoyo: true, ease: 'Quad.easeInOut' },
            scaleY: { value: 0.5, duration: 3000, yoyo: true, ease: 'Quad.easeInOut' },
            repeat: -1
        });

        const shape1 = this.make.graphics().fillRect(50, 50, 700, 500);
        const shape2 = this.make.graphics().fillCircle(400, 300, 300);
        const shape3 = this.make.graphics().fillCircle(400, 300, 60);

        const geomask1 = shape1.createGeometryMask();
        const geomask2 = shape2.createGeometryMask();
        const geomask3 = shape3.createGeometryMask();

        // geomask1.invertAlpha = false;
        // geomask2.invertAlpha = true;
        // geomask3.invertAlpha = true;

        this.cameras.main.setMask(geomask1);

        container.setMask(geomask2);

        sprite1.setMask(geomask3);

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
    backgroundColor: '#000066',
    parent: 'phaser-example',
    scene: [ Example ]
};

const game = new Phaser.Game(config);
