var config = {
    type: Phaser.AUTO,
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

var groupA;
var groupB;
var move = 0;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.atlas('atlas', 'assets/tests/fruit/veg.png', 'assets/tests/fruit/veg.json');
}

function create ()
{
    groupA = this.add.group();
    groupB = this.add.group();

    for (var i = 0; i < 1000; i++)
    {
        groupA.create(100 + Math.random() * 600, 100 + Math.random() * 400, 'atlas', 'veg0' + Math.floor(1 + Math.random() * 9));
    }

    for (var i = 0; i < 1000; i++)
    {
        groupB.create(100 + Math.random() * 600, 100 + Math.random() * 400, 'atlas', 'veg0' + Math.floor(1 + Math.random() * 9));
    }
}

function update ()
{
    Phaser.Actions.IncX(groupA.getChildren(), Math.cos(move));
    Phaser.Actions.IncY(groupA.getChildren(), Math.sin(move));
    Phaser.Actions.Rotate(groupA.getChildren(), -0.01);

    Phaser.Actions.IncX(groupB.getChildren(), -Math.cos(move));
    Phaser.Actions.IncY(groupB.getChildren(), -Math.sin(move));
    Phaser.Actions.Rotate(groupB.getChildren(), 0.01);

    move += 0.01;
}
