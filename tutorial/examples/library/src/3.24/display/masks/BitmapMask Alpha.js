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

    bunny.mask = new Phaser.Display.Masks.BitmapMask(this, mask);

    this.input.on('pointermove', function (pointer) {

        mask.x = pointer.x;
        mask.y = pointer.y;

    });

}
