var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#010101',
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.spritesheet('mummy', 'assets/sprites/metalslug_mummy37x45.png', { frameWidth: 37, frameHeight: 45, endFrame: 17 });
}

function create ()
{
    this.anims.create({
        key: 'run',
        frames: 'mummy',
        frameRate: 20,
        repeat: -1
    });

    var sprite1 = this.add.sprite(100, 200, 'mummy').play('run');
    var sprite2 = this.add.sprite(100, 300, 'mummy').play('run');
    var sprite3 = this.add.sprite(100, 400, 'mummy').play('run');

    container = this.add.container(300, 0, [ sprite1, sprite2, sprite3 ]);

    this.tweens.add({
        targets: container,
        scaleX: 3,
        scaleY: 3,
        duration: 6000,
        yoyo: true,
        repeat: -1
    });
}
