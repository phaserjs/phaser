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
                y: 0
            },
            debug: true
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

    this.matter.add.rectangle(200, 200, 100, 100, { 
        chamfer: { radius: 20 }
    });

    this.matter.add.rectangle(300, 200, 100, 100, { 
        chamfer: { radius: [90, 0, 0, 0] }
    });

    this.matter.add.rectangle(400, 200, 200, 200, { 
        chamfer: { radius: [150, 20, 40, 20] }
    });

    this.matter.add.rectangle(200, 200, 200, 200, { 
        chamfer: { radius: [150, 20, 150, 20] }
    });

    this.matter.add.rectangle(300, 200, 200, 50, { 
        chamfer: { radius: [25, 25, 0, 0] }
    });

    this.matter.add.polygon(200, 100, 8, 80, { 
        chamfer: { radius: 30 }
    });

    this.matter.add.polygon(300, 100, 5, 80, { 
        chamfer: { radius: [10, 40, 20, 40, 10] }
    });

    this.matter.add.polygon(400, 200, 3, 50, { 
        chamfer: { radius: [20, 0, 20] }
    });

    this.matter.add.mouseSpring();
}
