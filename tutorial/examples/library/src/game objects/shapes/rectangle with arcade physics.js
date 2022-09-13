var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 }
        }
    },
    scene: {
        create: create
    }
};

var game = new Phaser.Game(config);

function create ()
{
    var r1 = this.add.rectangle(200, 150, 148, 148, 0x6666ff);

    var r2 = this.add.rectangle(400, 150, 148, 148, 0x9966ff).setStrokeStyle(4, 0xefc53f);

    this.physics.add.existing(r1);
    this.physics.add.existing(r2);

    r1.body.velocity.x = 100;
    r1.body.velocity.y = 100;
    r1.body.bounce.x = 1;
    r1.body.bounce.y = 1;
    r1.body.collideWorldBounds = true;

    r2.body.velocity.x = -100;
    r2.body.velocity.y = 100;
    r2.body.bounce.x = 1;
    r2.body.bounce.y = 1;
    r2.body.collideWorldBounds = true;
}