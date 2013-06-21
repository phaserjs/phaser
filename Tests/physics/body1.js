/// <reference path="../../Phaser/Game.ts" />
/// <reference path="../../Phaser/physics/advanced/Manager.ts" />
/// <reference path="../../Phaser/physics/advanced/shapes/Box.ts" />
/// <reference path="../../Phaser/physics/advanced/shapes/Circle.ts" />
(function () {
    var game = new Phaser.Game(this, 'game', 800, 600, init, create, update, render);
    function init() {
        game.load.image('xatari', 'assets/sprites/atari800xl.png');
        game.load.image('card', 'assets/sprites/mana_card.png');
        game.load.image('atari', 'assets/sprites/shinyball.png');
        game.load.start();
    }
    var debug;
    var atari;
    var card;
    var physics;
    var circle;
    var walls;
    var t;
    function create() {
        //debug = <HTMLTextAreaElement> document.createElement('textarea');
        //debug.style.position = 'absolute';
        //debug.style.left = '850px';
        //debug.style.top = '32px';
        //debug.style.width = '600px';
        //debug.style.height = '600px';
        //document.body.appendChild(debug);
        //atari = game.add.sprite(200, 100, 'atari');
        //  need to get the physics bounds around the sprite center, regardless of origin
        //atari.transform.origin.setTo(0.5, 0.5);
        //card = game.add.sprite(500, 300, 'card');
        physics = new Phaser.Physics.Advanced.Manager(game);
        //Phaser.Physics.Advanced.Manager.debug = debug;
        walls = new Phaser.Physics.Advanced.Body(null, Phaser.Types.BODY_STATIC, 0, 0);
        walls.game = game;
        //walls.addBox(250, 200, 500, 20, 0, 1, 1);
        //staticBody.addShape(new ShapeBox(0, 0.2, 20.48, 0.4));
        //  * 0.02 p2m
        //  * 50 m2p
        walls.addBox(0, 500, 1024, 20, 0, 1, 1);
        //walls.transform.setRotation(game.math.degreesToRadians(4));
        //walls.fixedRotation = true;
        //  position is in relation to the containing body! don't forget this
        //ground = walls.addShape(new Phaser.Physics.Advanced.Shapes.Box(400, 500, 500, 20));
        //walls.addShape(new Phaser.Physics.Advanced.ShapeBox(0, 0.2, 20.48, 0.4));
        //walls.addShape(new Phaser.Physics.Advanced.ShapeBox(0, 15.16, 20.48, 0.4));
        //walls.addShape(new Phaser.Physics.Advanced.ShapeBox(-10.04, 7.68, 0.4, 14.56));
        //walls.addShape(new Phaser.Physics.Advanced.ShapeBox(10.04, 7.68, 0.4, 14.56));
        //walls.resetMassData();
        physics.space.addBody(walls);
        //  Add a circle
        //circle = new Phaser.Physics.Advanced.Body(null, Phaser.Types.BODY_DYNAMIC, 200, 100);
        //circle.game = game;
        //circle.addCircle(32, 0, 0, 0.5);
        //physics.space.addBody(circle);
        t = new Phaser.Physics.Advanced.Body(null, Phaser.Types.BODY_DYNAMIC, 300, 100);
        //t.fixedRotation = true;
        t.game = game;
        t.addBox(0, 0, 20, 20, 0.5, 1, 1);
        //t.addCircle(32, 0, 0, 0.8);
        //t.addTriangle(0, 0, 1, 1, 2, 2);
        //t.addPoly([{ x: -0.8, y: 0.48 }, { x: -0.8, y: 0 }, { x: 0.8, y: 0 }, { x: 0.8, y: 0.32 }, { x: 0, y: 0.84 }, { x: -0.56, y: 0.84 }], 1, 1, 6);
        //t.addPoly([{ x: -0.8, y: 0.48 }, { x: -0.8, y: 0 }, { x: 0.8, y: 0 }, { x: 0.8, y: 0.32 }, { x: 0, y: 0.84 }, { x: -0.56, y: 0.84 }], 0.5, 1, 1);
        //t.transform.setRotation(game.math.degreesToRadians(45));
        //t.fixedRotation = true;
        physics.space.addBody(t);
        game.input.onTap.add(step, this);
    }
    function step() {
        physics.update();
    }
    function update() {
        //if (physics.space.stepCount < 90)
        //{
        physics.update();
        //}
        //atari.x = physics.metersToPixels(circle.position.x);
        //atari.y = physics.metersToPixels(circle.position.y);
        //atari.rotation = physics.metersToPixels(circle.angle);
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
    function renderBounds(body) {
        game.stage.context.fillStyle = 'rgba(0,255,200,0.2)';
        game.stage.context.fillRect(body.bounds.x, body.bounds.y, body.bounds.width, body.bounds.height);
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
        var verts = shape.tverts;
        var body = shape.body;
        ctx.beginPath();
        ctx.moveTo(body.position.x + verts[0].x * 50, body.position.y + verts[0].y * 50);
        for(var i = 0; i < verts.length; i++) {
            ctx.lineTo(body.position.x + verts[i].x * 50, body.position.y + verts[i].y * 50);
        }
        ctx.lineTo(body.position.x + verts[verts.length - 1].x * 50, body.position.y + verts[verts.length - 1].y * 50);
        ctx.closePath();
        ctx.fillStyle = fillStyle;
        ctx.fill();
    }
    function render() {
        //game.stage.context.fillStyle = 'rgb(255,255,0)';
        //game.stage.context.fillText('x: ' + t.position.x + ' y: ' + t.position.y, 32, 32);
        //game.stage.context.fillText('vx: ' + t.velocity.x + ' vy: ' + t.velocity.y, 32, 64);
        //game.stage.context.fillText('x: ' + t.bounds.x + ' y: ' + t.bounds.y, 32, 32);
        //game.stage.context.fillText('vx: ' + t.velocity.x + ' vy: ' + t.velocity.y, 32, 64);
        //renderCircle(circle.shapes[0]);
        //renderBounds(circle);
        drawPolygon(game.stage.context, walls.shapes[0], 1, 'rgb(0,255,255)');
        //drawPolygon(game.stage.context, walls.shapes[1], 1, 'rgb(0,255,255)');
        //renderCircle(t.shapes[0]);
        drawPolygon(game.stage.context, t.shapes[0], 1, 'rgb(255,255,255)');
        //renderBounds(t);
            }
})();
