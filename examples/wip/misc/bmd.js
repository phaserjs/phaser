
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('atari1', 'assets/sprites/atari130xe.png');
    game.load.image('coke', 'assets/sprites/cokecan.png');
    game.load.image('mushroom', 'assets/sprites/mushroom2.png');
    game.load.image('ball', 'assets/sprites/shinyball.png');

}

var bmd;

function create() {

	bmd = game.add.bitmapData(32, 64);

	console.log(bmd);

    //  And apply it to 100 randomly positioned sprites
    for (var i = 0; i < 100; i++)
    {
        game.add.sprite(game.world.randomX - 32, game.world.randomY - 64, bmd);
    }

    //  Populate the wave with some data
	waveData = game.math.sinCosGenerator(32, 8, 8, 2);

}

function update() {

	bmd.clear();

	updateWobblyBall();

}

//  This creates a simple sine-wave effect running through our DynamicTexture.
//  This is then duplicated across all sprites using it, meaning we only have to calculate it once.

var waveSize = 8;
var wavePixelChunk = 2;
var waveData;
var waveDataCounter;

function updateWobblyBall()
{
	var s = 0;
	var copyRect = { x: 0, y: 0, w: wavePixelChunk, h: 32 };
	var copyPoint = { x: 0, y: 0 };

	for (var x = 0; x < 32; x += wavePixelChunk)
	{
		copyPoint.x = x;
		copyPoint.y = waveSize + (waveSize / 2) + waveData.sin[s];

		bmd.context.drawImage(game.cache.getImage('ball'), copyRect.x, copyRect.y, copyRect.w, copyRect.h, copyPoint.x, copyPoint.y, copyRect.w, copyRect.h);
			
		copyRect.x += wavePixelChunk;
			
		s++;
	}

	//	Cycle through the wave data - this is what causes the image to "undulate"
	game.math.shift(waveData.sin);
	
	waveDataCounter++;
	
	if (waveDataCounter == waveData.length)
	{
		waveDataCounter = 0;
	}
}


function render() {

	bmd.render();

}
