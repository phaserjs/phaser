var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var image;
var top_left, top_right, bot_left, bot_right;
// var line;
var game = new Phaser.Game(config);
// var graphics;
var rect;

function preload ()
{
    this.load.image('einstein', 'assets/pics/ra-einstein.png');
    this.load.image('ball', 'assets/sprites/blue_ball.png');
}

function create ()
{
    image = this.add.image(400, 300, 'einstein');
    top_left = this.add.image(400,300, 'ball');
    top_right = this.add.image(400,300, 'ball');
    bot_left = this.add.image(400,300, 'ball');
    bot_right = this.add.image(400,300, 'ball');

    image.setScale(.5,.5);

    rect = image.getBounds();

    top_left.setPosition(rect.x,rect.y);
    top_right.setPosition(rect.x+rect.width, rect.y);
    bot_left.setPosition(rect.x, rect.y+rect.height);
    bot_right.setPosition(rect.x+rect.width, rect.y+rect.height);

}

function update ()
{
    image.rotation += 0.01;

    rect = image.getBounds();

    top_left.setPosition(rect.x,rect.y);
    top_right.setPosition(rect.x+rect.width,rect.y);
    bot_left.setPosition(rect.x,rect.y+rect.height);
    bot_right.setPosition(rect.x+rect.width,rect.y+rect.height);
}