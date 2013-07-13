/// <reference path="../../Phaser/Game.ts" />

(function () {

    var myGame = new Phaser.Game(this, 'game', 800, 600, null, create, update, render);

    var segment: Phaser.Verlet.Composite;

    function create() {

        myGame.verlet.friction = 1;

        segment = myGame.verlet.createLineSegments([new Phaser.Vector2(20, 10), new Phaser.Vector2(40, 10), new Phaser.Vector2(60, 10), new Phaser.Vector2(80, 10), new Phaser.Vector2(100, 10)], 0.02);
        segment.pin(0);
        segment.pin(4);

		var wheel = myGame.verlet.createTire(new Phaser.Vector2(200,50), 100, 30, 0.3, 0.9);
		var tire2 = myGame.verlet.createTire(new Phaser.Vector2(400,50), 70, 7, 0.1, 0.2);
		var cube = myGame.verlet.createTire(new Phaser.Vector2(600,50), 70, 4, 1, 1);
		var tri = myGame.verlet.createTire(new Phaser.Vector2(700,50), 100, 3, 1, 1);

    }

    function update() {
    }

    function render() {

        myGame.verlet.render();

    }

})();
