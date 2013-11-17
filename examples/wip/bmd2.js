
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('atari1', 'assets/sprites/atari130xe.png');
    game.load.image('coke', 'assets/sprites/cokecan.png');
    game.load.image('mushroom', 'assets/sprites/mushroom2.png');
    game.load.image('ball', 'assets/sprites/shinyball.png');

}

var bmd;

function create() {

	//game.stage.backgroundColor = '#450034';

	bmd = game.add.bitmapData('bob', 800, 600);

    //  And apply it to 100 randomly positioned sprites
    for (var i = 0; i < 100; i++)
    {
    	//bmd.setPixel(game.world.randomX, game.world.randomY, 100 + Math.random() * 155, 100 + Math.random() * 155, 255);
    }

    bmd.context.fillStyle = '#ffffff';
    bmd.context.fillRect(20,20,16,16);

    var d = game.add.sprite(0, 0, bmd);

}

function update() {

    // bmd.context.fillRect(game.world.randomX,game.world.randomY,4,4);

    //console.log('b');


    // bmd.setPixel(game.world.randomX, game.world.randomY, 250, 250, 250);
    
    bmd.setPixel(game.input.x, game.input.y, 255, 255, 255);

}


function render() {

	bmd.render();

}
