/// <reference path="../../Phaser/Game.ts" />

(function () {

    var myGame = new Phaser.Game(this, 'game', 800, 600, init, create, update, render);

    var cube: Phaser.Verlet.Composite;

    var b1: Phaser.Sprite;
    var b2: Phaser.Sprite;
    var b3: Phaser.Sprite;
    var b4: Phaser.Sprite;

    function init() {

        myGame.loader.addImageFile('ball0', 'assets/sprites/yellow_ball.png');
        myGame.loader.addImageFile('ball1', 'assets/sprites/aqua_ball.png');
        myGame.loader.addImageFile('ball2', 'assets/sprites/blue_ball.png');
        myGame.loader.addImageFile('ball3', 'assets/sprites/green_ball.png');
        myGame.loader.addImageFile('ball4', 'assets/sprites/red_ball.png');
        myGame.loader.addImageFile('ball5', 'assets/sprites/purple_ball.png');

        myGame.loader.load();

    }

    function create() {

        myGame.verlet.friction = 1;
        myGame.verlet.step = 32;

		//var wheel = myGame.verlet.createTire(new Phaser.Vector2(200,50), 100, 30, 0.3, 0.9);
		//var tire2 = myGame.verlet.createTire(new Phaser.Vector2(400,50), 70, 7, 0.1, 0.2);
        cube = myGame.verlet.createTire(new Phaser.Vector2(300, 50), 100, 4, 1, 1);
		//var tri = myGame.verlet.createTire(new Phaser.Vector2(700,50), 100, 3, 1, 1);

        var dc: Phaser.Verlet.DistanceConstraint = new Phaser.Verlet.DistanceConstraint(cube.particles[0], cube.particles[1], 1);
        cube.constraints.push(dc);

        var dc2: Phaser.Verlet.DistanceConstraint = new Phaser.Verlet.DistanceConstraint(cube.particles[1], cube.particles[2], 1);
        cube.constraints.push(dc2);

        var dc3: Phaser.Verlet.DistanceConstraint = new Phaser.Verlet.DistanceConstraint(cube.particles[2], cube.particles[3], 1);
        cube.constraints.push(dc3);

        b1 = myGame.createSprite(cube.particles[0].pos.x, cube.particles[0].pos.y, 'ball0');
        b2 = myGame.createSprite(cube.particles[1].pos.x, cube.particles[1].pos.y, 'ball1');
        b3 = myGame.createSprite(cube.particles[2].pos.x, cube.particles[2].pos.y, 'ball2');
        b4 = myGame.createSprite(cube.particles[3].pos.x, cube.particles[3].pos.y, 'ball3');

    }

    function update() {

        b1.x = cube.particles[0].pos.x - 8;
        b1.y = cube.particles[0].pos.y - 8;

        b2.x = cube.particles[1].pos.x - 8;
        b2.y = cube.particles[1].pos.y - 8;

        b3.x = cube.particles[2].pos.x - 8;
        b3.y = cube.particles[2].pos.y - 8;

        b4.x = cube.particles[3].pos.x - 8;
        b4.y = cube.particles[3].pos.y - 8;

    }

    function render() {

        myGame.verlet.render();

    }

})();
