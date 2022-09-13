var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#010101',
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var ts;
var iter = 0;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('mushroom', 'assets/sprites/mushroom2.png');
}

function create ()
{
    //  Our container
    var container = this.add.container(400, 300).setName('conty');

    ts = this.add.tileSprite(0, 0, 400, 600, 'mushroom').setName('tiley');
    container.add(ts);

    var image = this.add.image(0, 0, 'mushroom').setName('mushy').setScale(4);
    container.add(image);

    this.input.on('pointerup', function () {

        this.scene.stop();
    
    }, this);
}

function update ()
{
    ts.tilePositionX = Math.cos(-iter) * 400;
    ts.tilePositionY = Math.sin(-iter) * 400;

    iter += 0.01;
}
