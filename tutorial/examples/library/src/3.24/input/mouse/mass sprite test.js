var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create
    }
};

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

    var hitArea = new Phaser.Geom.Rectangle(0, 0, 32, 32);
    var hitAreaCallback = Phaser.Geom.Rectangle.Contains;

    //  Create 400 sprites aligned in a grid
    group = this.make.group({
        classType: Phaser.GameObjects.Image,
        key: 'bobs',
        frame: Phaser.Utils.Array.NumberArray(0, 399),
        randomFrame: true,
        hitArea: hitArea,
        hitAreaCallback: hitAreaCallback,
        gridAlign: {
            width: 25,
            height: 25,
            cellWidth: 32,
            cellHeight: 32
        }
    });

    this.input.on('gameobjectover', function (pointer, gameObject) {

        highlighted.setPosition(gameObject.x, gameObject.y);

    });
}
