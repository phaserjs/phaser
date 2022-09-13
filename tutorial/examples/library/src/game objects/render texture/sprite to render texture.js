var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    backgroundColor: '#2d2d88',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('bubble', 'assets/particles/bubble.png');
    this.load.image('dude', 'assets/sprites/phaser-dude.png');
}

function create ()
{
    var bubble = this.add.image(0, 0, 'bubble');
    var dude = this.add.image(0, 0, 'dude');

    var rt = this.add.renderTexture(400, 300, 64, 64);

    rt.draw(bubble, 32, 32);
    rt.draw(dude, 32, 32);
}
