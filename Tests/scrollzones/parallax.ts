/// <reference path="../../Phaser/Game.ts" />
/// <reference path="../../Phaser/gameobjects/ScrollZone.ts" />

(function () {

    var myGame = new Phaser.Game(this, 'game', 800, 600, init, create);

    function init() {

        myGame.loader.addImageFile('starray', 'assets/pics/auto_scroll_landscape.png');

        myGame.loader.load();

    }

    function create() {

        //  In this example we're creating a whole bunch of ScrollZones working on the same image
        var zone: Phaser.ScrollZone = myGame.createScrollZone('starray');

		var y:number = 10;
		var speed:number = 6;
			
		speed -= 0.3;
			
		//	The image consists of 10px high scrolling layers, this creates them quickly (top = fastest, getting slower as we move down)
		for (var z:number = 0; z < 31; z++)
		{
		    zone.addRegion(0, y, 640, 10, speed);
				
			if (z <= 14)
			{
				speed -= 0.3;
			}
			else
			{
				speed += 0.3;
			}
					
			if (z == 14)
			{
				y = 240;
				speed += 0.3;
			}
			else
			{
				y += 10;
			}
		}

    }

})();
