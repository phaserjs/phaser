/// <reference path="../../Phaser/Game.ts" />
/// <reference path="../../Phaser/gameobjects/ScrollZone.ts" />
(function () {
    var game = new Phaser.Game(this, 'game', 800, 600, preload, create);

    function preload() {
        game.load.image('starray', 'assets/pics/auto_scroll_landscape.png');
    }

    function create() {
        var zone = game.add.scrollZone('starray');

        //  Hide the default region (the full image)
        zone.currentRegion.visible = false;

        var y = 0;
        var speed = 16;

        for (var z = 0; z < 32; z++) {
            zone.addRegion(0, y, 640, 10, speed);

            if (z <= 15) {
                speed -= 1;
            } else {
                speed += 1;
            }

            if (z == 15) {
                y = 240;
                speed += 1;
            } else {
                y += 10;
            }
        }
    }
})();
