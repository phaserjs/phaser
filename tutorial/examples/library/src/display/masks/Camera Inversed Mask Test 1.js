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
        this.load.image('mask', 'assets/tests/camera/soft-mask.png');
        this.load.image('bg', 'assets/ui/undersea-bg.png');
        this.load.spritesheet('fish', 'assets/sprites/fish-136x80.png', { frameWidth: 136, frameHeight: 80 });
    }

    create ()
    {
        const maskImage = this.make.image({
            x: 400,
            y: 300,
            key: 'mask',
            add: false
        });

        const mask = maskImage.createBitmapMask();

        const bg = this.add.image(400, 300, 'bg');

        const particles = this.add.particles('fish');

        const emitter1 = particles.createEmitter({
            frame: { frames: [ 0, 1, 2 ], cycle: true, quantity: 4 },
            x: -70,
            y: { min: 100, max: 500, steps: 8 },
            lifespan: 5000,
            speedX: { min: 200, max: 400, steps: 8 },
            quantity: 4,
            frequency: 500
        });

        const emitter2 = particles.createEmitter({
            frame: { frames: [ 0, 1, 2 ], cycle: true, quantity: 4 },
            x: 870,
            y: { min: 100, max: 500, steps: 8 },
            lifespan: 5000,
            speedX: { min: -200, max: -400, steps: 8 },
            quantity: 4,
            frequency: 500
        });

        const shape1 = this.make.graphics().fillRect(50, 50, 700, 500);
        const shape2 = this.make.graphics().fillCircle(400, 300, 300);
        const shape3 = this.make.graphics().fillCircle(400, 300, 100);

        const geomask1 = shape1.createGeometryMask();
        const geomask2 = shape2.createGeometryMask();
        const geomask3 = shape3.createGeometryMask();

        // geomask1.invertAlpha = true;
        // geomask2.invertAlpha = true;
        // geomask3.invertAlpha = true;

        // emitter.setMask(geomask);
        // emitter.setMask(mask);

        // particles.setMask(geomask1);
        // particles.setMask(geomask2);

        // particles.setMask(mask);
        // particles.setMask(mask2);

        this.cameras.main.setMask(geomask1);

        particles.setMask(geomask2);

        // emitter1.setMask(geomask2);
        emitter2.setMask(geomask3);

        // this.cameras.main.setMask(geomask2);
        // particles.setMask(mask2);

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
