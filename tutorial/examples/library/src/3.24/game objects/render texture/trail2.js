var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    width: 800,
    height: 600
};

var game = new Phaser.Game(config);

var rt;
var player;

function preload() 
{
    this.load.image('dude', 'assets/sprites/phaser-dude.png');
}

function create() 
{
    rt = this.make.renderTexture({ x: 0, y: 0, width: 800, height: 600 });

    player = this.add.image(256, 256, 'dude');
    player.setOrigin(0.5, 0.5);
}

function update()
{
    player.setPosition(this.input.x, this.input.y);

    rt.draw(player);
}

