class Scene1 extends Phaser.Scene {
    constructor() {
        super({ key: 'Scene1', active: true });
    }

    preload() {
        this.load.image('bunny', 'assets/sprites/bunny.png');
        this.load.image('phaser2', 'assets/sprites/phaser2.png');
        this.load.image('checker', 'assets/pics/checker.png');
    }

    create() {
        var bunny = this.make.tileSprite({
            x: game.config.width / 2, 
            y: game.config.height / 2,
            width: 400,
            height: 500,
            key: 'bunny',
            add: true
        });

        // bunny.blendMode = Phaser.BlendModes.ADD;

        var phaser2 = this.make.image({
            x: game.config.width / 2,
            y: game.config.height / 2,
            key: 'phaser2',
            add: false
        });

        bunny.mask = new Phaser.Display.Masks.BitmapMask(this, phaser2);

        this.input.on('pointermove', function (pointer) {
            phaser2.x = pointer.x;
            phaser2.y = pointer.y;
        });
    }
}

class Fader extends Phaser.Scene {
  constructor() {
    super({ key: 'Fader', active: true });
  }

  create() {
    // this.cameras.main.transparent = true;
    this.cameras.main.fadeOut(8000);
  }
}

var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 640,
    height: 480,
    scene: [
        Scene1,
        Fader,
    ]
};

var game = new Phaser.Game(config);