var config = {
type: Phaser.WEBGL,
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
this.load.image('bunny', 'assets/sprites/bunny.png');
}

function create ()
{
var bunny = this.add.image(400, 300, 'bunny');
this.add.rectangle(150,150,200,200).setFillStyle(0x6005ae)
this.add.rectangle(500,500,200,200).setFillStyle(0xff0303)
var graphics = this.add.graphics();
graphics.setTexture('bunny');
}
