var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var x;
var y;
var move = 0;
var group;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('sky', 'assets/skies/deepblue.png');
    this.load.image('ball', 'assets/demoscene/ball-tlb.png');
}

function create ()
{
    this.add.image(0, 0, 'sky').setOrigin(0);

    group = this.add.group({ key: 'ball', frameQuantity: 128 });

    this.input.on('pointermove', function (pointer) {

        x = pointer.x;
        y = pointer.y;

    });
}

function update (time, delta)
{
    move += delta;

    if (move > 6)
    {
        Phaser.Actions.ShiftPosition(group.getChildren(), x, y);
        move = 0;
    }
}
