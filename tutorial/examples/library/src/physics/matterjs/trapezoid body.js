var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#1b1464',
    parent: 'phaser-example',
    physics: {
        default: 'matter',
        matter: {
            debug: true
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
    this.load.image('orange', 'assets/sprites/columns-orange.png');
}

function create ()
{
    this.matter.world.setBounds().disableGravity();

    var poly = this.matter.add.image(200, 50, 'orange');

    poly.setBody({
        type: 'trapezoid',
        width: 128,
        height: 64,
        slope: 0.6
    });

    //  Just make the body move around and bounce
    poly.setVelocity(6, 3);
    poly.setAngularVelocity(0.01);
    poly.setBounce(1);
    poly.setFriction(0, 0, 0);
}
