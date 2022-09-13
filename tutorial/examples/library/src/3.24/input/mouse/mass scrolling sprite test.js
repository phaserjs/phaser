var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var controls;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.spritesheet('bobs', 'assets/sprites/bobs-by-cleathley.png', { frameWidth: 32, frameHeight: 32 });
}

function create ()
{
    //  Create a little 32x32 texture to use to show where the mouse is
    var graphics = this.make.graphics({ x: 0, y: 0, add: false, fillStyle: { color: 0xff00ff, alpha: 1 } });

    graphics.fillRect(0, 0, 32, 32);

    graphics.generateTexture('block', 32, 32);

    var highlighted = this.add.image(16, 16, 'block');

    //  All the Images can share the same Shape, no need for a unique instance per one, a reference is fine
    var hitArea = new Phaser.Geom.Rectangle(0, 0, 32, 32);
    var hitAreaCallback = Phaser.Geom.Rectangle.Contains;

    //  Create 10,000 Image Game Objects aligned in a grid
    //  Change this to 2000 on MS Edge as it can't seem to cope with 10k at the moment
    group = this.make.group({
        classType: Phaser.GameObjects.Image,
        key: 'bobs',
        frame: Phaser.Utils.Array.NumberArray(0, 399),
        randomFrame: true,
        repeat: 24,
        max: 10000,
        hitArea: hitArea,
        hitAreaCallback: hitAreaCallback,
        gridAlign: {
            width: 100,
            cellWidth: 32,
            cellHeight: 32
        }
    });

    //  Camera controls
    var cursors = this.input.keyboard.createCursorKeys();

    var controlConfig = {
        camera: this.cameras.main,
        left: cursors.left,
        right: cursors.right,
        up: cursors.up,
        down: cursors.down,
        acceleration: 0.04,
        drag: 0.0005,
        maxSpeed: 0.7
    };

    controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);

    this.input.on('pointerover', function (pointer, gameObjects) {

        highlighted.setPosition(gameObjects[0].x, gameObjects[0].y);

    });

    this.input.on('gameobjectdown', function (pointer, gameObject) {

        gameObject.visible = false;

    });
}

function update (time, delta)
{
    controls.update(delta);
}
