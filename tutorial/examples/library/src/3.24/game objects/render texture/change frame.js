var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    },
    width: 800,
    height: 600
};

var rt;

var atari;
var mushroom;
var car;
var selected;

var game = new Phaser.Game(config);

function preload()
{
    this.load.atlas('atlas', 'assets/atlas/megaset-1.png', 'assets/atlas/megaset-1.json');
}

function create() 
{
    rt = this.make.renderTexture({ x: 0, y: 0, width: 800, height: 600 }).setOrigin(0, 0);

    atari = this.add.image(200, 500, 'atlas', 'atari800').setInteractive();
    mushroom = this.add.image(400, 100, 'atlas', 'mushroom2').setInteractive();
    car = this.add.image(650, 500, 'atlas', 'supercars-parsec').setInteractive();

    selected = atari;

    atari.on('pointerdown', function ()
    {
        selected = this;
    })

    mushroom.on('pointerdown', function ()
    {
        selected = this;
    })

    car.on('pointerdown', function ()
    {
        selected = this;
    })

    this.input.on('pointermove', function (pointer)
    {
        draw(pointer.x, pointer.y);
    });
}

function draw(x, y) 
{
    rt.draw(selected, x, y);
}