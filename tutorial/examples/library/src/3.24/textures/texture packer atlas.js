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

var atari;
var disk;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.path = 'assets/atlas/';

    this.load.atlas('sprites', 'tp3test.png', 'tp3test.json');
}

function create ()
{
    //  Include .png until 'Trim filenames' works

    //  This one has a custom pivot point:
    atari = this.add.image(150, 100, 'sprites', 'atari130xe.png');

    //  Default pivot point
    this.add.image(200, 300, 'sprites', 'elephant.png');
    this.add.image(500, 200, 'sprites', 'exocet_spaceman.png');

    //  This one has a custom pivot point:
    disk = this.add.image(300, 300, 'sprites', 'copy-that-floppy.png');
}

function update ()
{
    atari.rotation += 0.01;
    disk.rotation += 0.01;
}
