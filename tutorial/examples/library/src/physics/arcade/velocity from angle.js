var config = {
    type: Phaser.AUTO,
    width: 640,
    height: 512,
    parent: 'phaser-example',
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: { y: 300 }
        }
    },
    scene: {
        preload: preload,
        create: create
    }
};

new Phaser.Game(config);

function preload() {
    this.load.image('backdrop', 'assets/pics/platformer-backdrop.png');
    this.load.image('cannon_head', 'assets/tests/timer/cannon_head.png');
    this.load.image('cannon_body', 'assets/tests/timer/cannon_body.png');
    this.load.spritesheet('chick', 'assets/sprites/chick.png', { frameWidth: 16, frameHeight: 18 });
}

function create() {
    this.anims.create({ key: 'fly', frames: this.anims.generateFrameNumbers('chick', [0, 1, 2, 3]), frameRate: 5, repeat: -1 });

    this.add.image(320, 256, 'backdrop').setScale(2);

    var cannonHead = this.add.image(130, 416, 'cannon_head').setDepth(1);
    var cannon = this.add.image(130, 464, 'cannon_body').setDepth(1);
    var chick = this.physics.add.sprite(cannon.x, cannon.y - 50, 'chick').setScale(2);
    var gfx = this.add.graphics().setDefaultStyles({ lineStyle: { width: 10, color: 0xffdd00, alpha: 0.5 } });
    var line = new Phaser.Geom.Line();
    var angle = 0;

    chick.disableBody(true, true);

    this.input.on('pointermove', function (pointer) {
        angle = Phaser.Math.Angle.BetweenPoints(cannon, pointer);
        cannonHead.rotation = angle;
        Phaser.Geom.Line.SetToAngle(line, cannon.x, cannon.y - 50, angle, 128);
        gfx.clear().strokeLineShape(line);
    }, this);

    this.input.on('pointerup', function () {
        chick.enableBody(true, cannon.x, cannon.y - 50, true, true);
        chick.play('fly');
        this.physics.velocityFromRotation(angle, 600, chick.body.velocity);
    }, this);
}
