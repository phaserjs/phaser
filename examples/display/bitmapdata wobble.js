
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {

    game.load.image('ball', 'assets/sprites/shinyball.png');

}

var bmd;

var waveSize = 8;
var wavePixelChunk = 2;
var waveData;
var waveDataCounter;

function create() {

	//	Create our BitmapData object at a size of 32x64
	bmd = game.add.bitmapData('ball', 32, 64);

    //  And apply it to 100 randomly positioned sprites
    for (var i = 0; i < 100; i++)
    {
        game.add.sprite(game.world.randomX, game.world.randomY, bmd);
    }

    //  Populate the wave with some data
	waveData = game.math.sinCosGenerator(32, 8, 8, 2);

}

function update() {

	//	Clear the BitmapData
	bmd.clear();

	updateWobblyBall();

}

//  This creates a simple sine-wave effect running through our BitmapData.
//  This is then duplicated across all 100 sprites using it, meaning we only have to calculate it and upload it to the GPU once.

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

	//	Now all the pixel data has been redrawn we render it to the BitmapData object.
	//	In CANVAS mode this doesn't do anything, but on WebGL it pushes the new texture to the GPU.
	//	If your game is exclusively running under Canvas you ca safely ignore this step.
	bmd.render();

	//	Cycle through the wave data - this is what causes the image to "undulate"
	game.math.shift(waveData.sin);
	
	waveDataCounter++;
	
	if (waveDataCounter == waveData.length)
	{
		waveDataCounter = 0;
	}
}
