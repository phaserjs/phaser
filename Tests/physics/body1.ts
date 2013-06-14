/// <reference path="../../Phaser/Game.ts" />
/// <reference path="../../Phaser/physics/advanced/Manager.ts" />
/// <reference path="../../Phaser/physics/advanced/ShapeBox.ts" />
/// <reference path="../../Phaser/physics/advanced/ShapeCircle.ts" />

(function () {

    var game = new Phaser.Game(this, 'game', 800, 600, init, create, update, render);

    function init() {

        game.load.image('atari', 'assets/sprites/atari800xl.png');
        game.load.image('card', 'assets/sprites/mana_card.png');
        game.load.start();

    }

    var atari: Phaser.Sprite;
    var card: Phaser.Sprite;
    var physics: Phaser.Physics.Advanced.Manager;
    var circle: Phaser.Physics.Advanced.Body;

    function create() {

        atari = game.add.sprite(200, 100, 'atari');
        //card = game.add.sprite(500, 300, 'card');

        physics = new Phaser.Physics.Advanced.Manager(game);

        var walls = new Phaser.Physics.Advanced.Body(null, Phaser.Types.BODY_STATIC);
        walls.game = game;

        walls.addShape(new Phaser.Physics.Advanced.ShapeBox(0, 0.2, 20.48, 0.4));
        walls.addShape(new Phaser.Physics.Advanced.ShapeBox(0, 15.16, 20.48, 0.4));
        walls.addShape(new Phaser.Physics.Advanced.ShapeBox(-10.04, 7.68, 0.4, 14.56));
        walls.addShape(new Phaser.Physics.Advanced.ShapeBox(10.04, 7.68, 0.4, 14.56));
        walls.resetMassData();

        physics.space.addBody(walls);

        //  Add a circle

        circle = new Phaser.Physics.Advanced.Body(null, Phaser.Types.BODY_DYNAMIC, 4, 4);
        circle.game = game;

        var shape = new Phaser.Physics.Advanced.ShapeCircle(0.4, 0, 0);
        shape.elasticity = 0.5;
        shape.friction = 1.0;
        shape.density = 1;
        circle.addShape(shape);
        circle.resetMassData();

        physics.space.addBody(circle);

    }

    function update() {
        physics.update();
    }

    function render() {

        game.stage.context.fillStyle = 'rgb(255,255,0)';
        game.stage.context.fillText('x: ' + circle.position.x + ' y: ' + circle.position.y, 32, 32);
        game.stage.context.fillText('vx: ' + circle.velocity.x + ' vy: ' + circle.velocity.y, 32, 64);

    }

})();
