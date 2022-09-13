var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#1b1464',
    parent: 'phaser-example',
    physics: {
        default: 'matter',
        matter: {
        }
    },
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

// var engine;
// var stack;

function preload ()
{
    this.load.image('ball', 'assets/sprites/shinyball.png');
}

function create ()
{
    var Matter = Phaser.Physics.Matter;

    // var Engine = Matter.Engine,
    //     Render = Matter.Render,
    //     Runner = Matter.Runner,
    //     Composites = Matter.Composites,
    //     MouseConstraint = Matter.MouseConstraint,
    //     Mouse = Matter.Mouse,
    //     World = Matter.World,
    //     Bodies = Matter.Bodies;

    // engine = Engine.create();

    // add bodies
    // stack = Composites.stack(100, 185, 10, 10, 20, 0, function(x, y) {
    //     return Bodies.circle(x, y, 32/2);
    // });

    // for (var i = 0; i < stack.bodies.length; i++)
    // {
    //     var body = stack.bodies[i];

    //     this.add.image(body.position.x, body.position.y, 'ball');
    // }
    
    // World.add(engine.world, [
    //     // walls
    //     Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
    //     Bodies.rectangle(400, 600, 800, 50, { isStatic: true }),
    //     Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
    //     Bodies.rectangle(0, 300, 50, 600, { isStatic: true }),
    //     stack
    // ]);

    // add mouse control
    /*
    var mouse = Mouse.create(this.sys.canvas),
        mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.1,
                render: {
                    visible: false
                }
            }
        });

    World.add(engine.world, mouseConstraint);
    */

    console.log(stack);

    // run the engine
    // Engine.run(engine);
}

function update ()
{
    // for (var i = 0; i < stack.bodies.length; i++)
    // {
    //     var body = stack.bodies[i];
    //     var ball = this.children.getAt(i);

    //     ball.x = body.position.x;
    //     ball.y = body.position.y;
    //     ball.rotation = body.angle;
    // }
}
