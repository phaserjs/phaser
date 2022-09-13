var config = {
    type: Phaser.WEBGL,
    width: 640,
    height: 480,
    backgroundColor: '#bfcc00',
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('food', 'assets/games/snake/food.png');
    this.load.image('body', 'assets/games/snake/body.png');
}

function create ()
{
}

function update (time, delta)
{
}
