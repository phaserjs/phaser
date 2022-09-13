var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var info;
var timer;
var alive = 0;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('bg', 'assets/skies/sky4.png');
    this.load.image('crate', 'assets/sprites/crate.png');
}

function create ()
{
    //  How many crates can you click on in 10 seconds?
    this.add.image(400, 300, 'bg');

    //  Create a bunch of images
    for (var i = 0; i < 64; i++)
    {
        var x = Phaser.Math.Between(0, 800);
        var y = Phaser.Math.Between(0, 600);

        var box = this.add.image(x, y, 'crate');

        //  Make them all input enabled
        box.setInteractive();

        //  The images will dispatch a 'clicked' event when they are clicked on
        box.on('clicked', clickHandler, this);

        alive++;
    }

    //  If a Game Object is clicked on, this event is fired.
    //  We can use it to emit the 'clicked' event on the game object itself.
    this.input.on('gameobjectup', function (pointer, gameObject)
    {
        gameObject.emit('clicked', gameObject);
    }, this);

    //  Display the game stats
    info = this.add.text(10, 10, '', { font: '48px Arial', fill: '#000000' });

    timer = this.time.addEvent({ delay: 10000, callback: gameOver, callbackScope: this });
}

function update ()
{
    info.setText('Alive: ' + alive + '\nTime: ' + Math.floor(10000 - timer.getElapsed()));
}

function clickHandler (box)
{
    alive--;

    box.off('clicked', clickHandler);
    box.input.enabled = false;
    box.setVisible(false);
}

function gameOver ()
{
    this.input.off('gameobjectup');
}
