/// <reference path="../../Phaser/Game.ts" />
/// <reference path="../../Phaser/gameobjects/ScrollZone.ts" />

(function () {

    var myGame = new Phaser.Game(this, 'game', 800, 600, init, create);

    function init() {

        myGame.loader.addImageFile('starray', 'assets/pics/auto_scroll_landscape.png');

        myGame.loader.load();

    }

    function create() {

        var zone: Phaser.ScrollZone = myGame.add.scrollZone('starray');

        //  Hide the default region (the full image)
        zone.currentRegion.visible = false;

		var y:number = 0;
		var speed:number = 16;
			
		//	The image consists of 10px high scrolling layers, this creates them quickly (top = fastest, getting slower as we move down)
		for (var z:number = 0; z < 32; z++)
		{
		    zone.addRegion(0, y, 640, 10, speed);
				
			if (z <= 15)
			{
				speed -= 1;
			}
			else
			{
				speed += 1;
			}
					
			if (z == 15)
			{
				y = 240;
				speed += 1;
			}
			else
			{
				y += 10;
			}
		}

    }

})();
