var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 640,
    height: 480,
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload() {
    this.load.image('bunny', 'assets/sprites/bunny.png');
    this.load.image('backdrop', 'assets/pics/platformer-backdrop.png');
    this.load.image('mask', 'assets/pics/mask.png');
}

function create() {

    var backdrop = this.make.image({
        x: game.config.width / 2,
        y: game.config.height / 2,
        key: 'backdrop',
        add: true
    }).setScale(2);

    var mask = this.make.image({
        x: game.config.width / 2,
        y: game.config.height / 2,
        key: 'mask',
        add: false
    });

    var bunny = this.make.sprite({
        x: game.config.width / 2, 
        y: game.config.height / 2, 
        key: 'bunny',
        add: true
    });

    bunny.blendMode = Phaser.BlendModes.MULTIPLY;

    // bunny.mask = new Phaser.Display.Masks.BitmapMask(this, mask);

    var shape = this.make.graphics();

    shape.fillStyle(0xffffff);

    shape.beginPath();

    shape.moveTo(-240, 0);
    shape.arc(-240, 0, 250, 0, Math.PI * 2);
    shape.moveTo(240, 0);
    shape.arc(240, 0, 250, 0, Math.PI * 2);

    shape.fillPath();

    var mask = shape.createGeometryMask();

    bunny.setMask(mask);

}