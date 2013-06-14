/// <reference path="../../Phaser/Game.ts" />
/// <reference path="../../Phaser/physics/advanced/Manager.ts" />
/// <reference path="../../Phaser/physics/advanced/ShapeBox.ts" />
/// <reference path="../../Phaser/physics/advanced/ShapeCircle.ts" />
(function () {
    var game = new Phaser.Game(this, 'game', 800, 600, init, create, update, render);
    function init() {
        game.load.image('xatari', 'assets/sprites/atari800xl.png');
        game.load.image('card', 'assets/sprites/mana_card.png');
        game.load.image('atari', 'assets/sprites/shinyball.png');
        game.load.start();
    }
    var atari;
    var card;
    var physics;
    var circle;
    var walls;
    var ground;
    function create() {
        atari = game.add.sprite(200, 100, 'atari');
        atari.transform.origin.setTo(0.5, 0.5);
        //card = game.add.sprite(500, 300, 'card');
        physics = new Phaser.Physics.Advanced.Manager(game);
        walls = new Phaser.Physics.Advanced.Body(null, Phaser.Types.BODY_STATIC);
        walls.game = game;
        //  position is in relation to the containing body! don't forget this
        ground = walls.addShape(new Phaser.Physics.Advanced.ShapeBox(400, 500, 500, 20));
        ground.friction = 10;
        //walls.addShape(new Phaser.Physics.Advanced.ShapeBox(0, 0.2, 20.48, 0.4));
        //walls.addShape(new Phaser.Physics.Advanced.ShapeBox(0, 15.16, 20.48, 0.4));
        //walls.addShape(new Phaser.Physics.Advanced.ShapeBox(-10.04, 7.68, 0.4, 14.56));
        //walls.addShape(new Phaser.Physics.Advanced.ShapeBox(10.04, 7.68, 0.4, 14.56));
        walls.resetMassData();
        physics.space.addBody(walls);
        //  Add a circle
        circle = new Phaser.Physics.Advanced.Body(null, Phaser.Types.BODY_DYNAMIC, physics.pixelsToMeters(300), physics.pixelsToMeters(200));
        circle.game = game;
        var shape = new Phaser.Physics.Advanced.ShapeCircle(0.4, 0, 0);
        shape.elasticity = 0.8;
        shape.friction = 10.0;
        shape.density = 1;
        circle.addShape(shape);
        circle.resetMassData();
        physics.space.addBody(circle);
    }
    function update() {
        physics.update();
        atari.x = physics.metersToPixels(circle.position.x);
        atari.y = physics.metersToPixels(circle.position.y);
        atari.rotation = physics.metersToPixels(circle.angle);
        //  force moves without rotating
        if(game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
            circle.applyAngularImpulse(-0.02);
        } else if(game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            circle.applyAngularImpulse(0.02);
        }
        /*
        if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
        {
        circle.applyForceToCenter(new Phaser.Vec2(-8, 0));
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
        {
        circle.applyForceToCenter(new Phaser.Vec2(8, 0));
        }
        */
        if(game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
            circle.applyForceToCenter(new Phaser.Vec2(0, -10));
        } else if(game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
            circle.applyForceToCenter(new Phaser.Vec2(0, 5));
        }
        //console.log(circle.velocity.x, circle.velocity.y);
        //console.log('p', circle.position.x, circle.position.y);
            }
    function renderCircle(shape) {
        game.stage.context.beginPath();
        game.stage.context.arc(shape.tc.x * 50, shape.tc.y * 50, shape.radius * 50, 0, Math.PI * 2, false);
        if(shape.body.isAwake) {
            game.stage.context.fillStyle = 'rgba(0,255,0, 0.3)';
        } else {
            game.stage.context.fillStyle = 'rgba(100,100,100, 0.1)';
        }
        game.stage.context.fill();
        game.stage.context.closePath();
    }
    function drawPolygon(ctx, shape, lineWidth, fillStyle) {
        var verts = shape.verts;
        ctx.beginPath();
        ctx.moveTo(verts[0].x * 50, verts[0].y * 50);
        for(var i = 0; i < verts.length; i++) {
            ctx.lineTo(verts[i].x * 50, verts[i].y * 50);
        }
        ctx.lineTo(verts[verts.length - 1].x * 50, verts[verts.length - 1].y * 50);
        ctx.closePath();
        ctx.fillStyle = fillStyle;
        ctx.fill();
    }
    function render() {
        game.stage.context.fillStyle = 'rgb(255,255,0)';
        game.stage.context.fillText('x: ' + circle.position.x + ' y: ' + circle.position.y, 32, 32);
        game.stage.context.fillText('vx: ' + circle.velocity.x + ' vy: ' + circle.velocity.y, 32, 64);
        renderCircle(circle.shapes[0]);
        drawPolygon(game.stage.context, walls.shapes[0], 1, 'rgb(0,255,255)');
    }
})();
