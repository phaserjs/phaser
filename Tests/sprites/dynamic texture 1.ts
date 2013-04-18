/// <reference path="../../Phaser/Phaser.ts" />

(function () {

    var myGame = new Phaser.Game(this, 'game', 800, 600, init, create, update);

    function init() {

        myGame.loader.addImageFile('ball', 'assets/sprites/shinyball.png');

        myGame.loader.load();

    }

    var wobblyBall: Phaser.DynamicTexture;

    function create() {

        //  Create our DynamicTexture
        wobblyBall = myGame.createDynamicTexture('wobbly', 32, 64);

        //  And apply it to 100 randomly positioned sprites
        for (var i = 0; i < 100; i++)
        {
            var temp = myGame.createSprite(myGame.world.randomX, myGame.world.randomY);
            temp.width = 32;
            temp.height = 64;
            temp.loadDynamicTexture(wobblyBall);
        }

        //  Populate the wave with some data
		waveData = myGame.math.sinCosGenerator(32, 8, 8, 2);

    }

    function update() {

		wobblyBall.clear();

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
			copyPoint.y = waveSize + (waveSize / 2) + waveData[s];

			wobblyBall.context.drawImage(myGame.cache.getImage('ball'), copyRect.x, copyRect.y, copyRect.w, copyRect.h, copyPoint.x, copyPoint.y, copyRect.w, copyRect.h);
				
			copyRect.x += wavePixelChunk;
				
			s++;
		}
			
		//	Cycle through the wave data - this is what causes the image to "undulate"
		var t = waveData.shift();
		waveData.push(t);
		
		waveDataCounter++;
		
		if (waveDataCounter == waveData.length)
		{
			waveDataCounter = 0;
		}
	}

})();
