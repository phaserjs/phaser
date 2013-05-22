/// <reference path="../../Phaser/Game.ts" />

(function () {

    var myGame = new Phaser.Game(this, 'game', 800, 600, null, create, update);

    var floor: Phaser.GeomSprite;

    function create() {

        for (var i = 0; i < 100; i++)
        {
            var p:Phaser.GeomSprite = myGame.add.geomSprite(myGame.stage.randomX, Math.random() * 100);
            p.createPoint();
            p.fillColor = 'rgb(255,255,255)';
            p.acceleration.y = 100 + Math.random() * 100;
            p.elasticity = 0.8;
        }

        //  A simple floor
        floor = myGame.add.geomSprite(0, 550);
        floor.createRectangle(800, 50);
        floor.immovable = true;

    }

    function update() {

        myGame.collide(myGame.world.group, floor);

    }

})();
