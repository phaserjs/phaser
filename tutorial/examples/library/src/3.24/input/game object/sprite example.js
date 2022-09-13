var config = {
    type: Phaser.AUTO,
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
    this.load.spritesheet('aliens', 'assets/sprites/bsquadron-enemies.png', { frameWidth: 192, frameHeight: 160 });
}

function create ()
{
    var alien = this.add.sprite(400, 300, 'aliens', 0).setInteractive();

    alien.on('pointerover', function () {

        this.setFrame(3);

    });

    alien.on('pointerout', function () {

        this.setFrame(0);

    });
}
