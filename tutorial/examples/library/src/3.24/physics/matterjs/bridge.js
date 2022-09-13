var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    parent: 'phaser-example',
    physics: {
        default: 'matter',
        matter: {
            gravity: {
                y: 0.8
            },
            debug: true,
            debugBodyColor: 0xffffff
        }
    },
    scene: {
        create: create
    }
};

var game = new Phaser.Game(config);

function create ()
{
    this.matter.world.setBounds();

    this.matter.add.mouseSpring();

    var group = this.matter.world.nextGroup(true);

    var bridge = this.matter.add.stack(160, 290, 15, 1, 0, 0, function(x, y) {
        return Phaser.Physics.Matter.Matter.Bodies.rectangle(x - 20, y, 53, 20, { 
            collisionFilter: { group: group },
            chamfer: 5,
            density: 0.005,
            frictionAir: 0.05
        });
    });
    
    this.matter.add.chain(bridge, 0.3, 0, -0.3, 0, {
        stiffness: 1,
        length: 0,
        render: {
            visible: false
        }
    });
    
    var stack = this.matter.add.stack(250, 50, 6, 3, 0, 0, function(x, y) {
        return Phaser.Physics.Matter.Matter.Bodies.rectangle(x, y, 50, 50, Phaser.Math.Between(20, 40));
    });

    this.matter.add.rectangle(30, 490, 220, 380, {
        isStatic: true, 
        chamfer: { radius: 20 }
    }),

    this.matter.add.rectangle(770, 490, 220, 380, {
        isStatic: true, 
        chamfer: { radius: 20 }
    }),

    this.matter.add.worldConstraint(bridge.bodies[0], 2, 0.9, {
        pointA: { x: 140, y: 300 }, 
        pointB: { x: -25, y: 0 }
    });

    this.matter.add.worldConstraint(bridge.bodies[bridge.bodies.length - 1], 2, 0.9, {
        pointA: { x: 660, y: 300 }, 
        pointB: { x: 25, y: 0 }
    });
}
