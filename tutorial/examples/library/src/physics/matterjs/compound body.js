var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#1b1464',
    parent: 'phaser-example',
    physics: {
        default: 'matter',
        matter: {
            debug: true,
            gravity: {
                y: 0.3
            },
        }
    },
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('block', 'assets/sprites/block.png');
    this.load.image('platform', 'assets/sprites/platform.png');
}

function create ()
{
    var Bodies = Phaser.Physics.Matter.Matter.Bodies;

    var rectA = Bodies.rectangle(0, 0, 200, 24);
    var rectB = Bodies.rectangle(0, 0, 24, 200);
    var circleA = Bodies.circle(-100, 0, 24);
    var circleB = Bodies.circle(100, 0, 24);
    var circleC = Bodies.circle(0, -100, 24);
    var circleD = Bodies.circle(0, 100, 24);

    var compoundBody = Phaser.Physics.Matter.Matter.Body.create({
        parts: [ rectA, rectB, circleA, circleB, circleC, circleD ]
    });

    var block = this.matter.add.image(150, 0, 'block');

    block.setExistingBody(compoundBody);

    block.setFrictionAir(0.001).setBounce(0.9);

    //  A floor to land on
    this.matter.add.image(350, 450, 'platform', null, { isStatic: true }).setScale(2, 0.5).setAngle(8);
}
