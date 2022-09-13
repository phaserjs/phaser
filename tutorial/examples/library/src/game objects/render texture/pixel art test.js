var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    pixelArt: true,
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload()
{
    this.load.image('mushroom', 'assets/sprites/mushroom16x16.png');
}

function create() 
{
    var rt = this.add.renderTexture(0, 0, 800, 600).setOrigin(0);

    var mushroom = this.add.image(400, 300, 'mushroom').setScale(8);

    rt.draw(mushroom, 200, 200);
}
