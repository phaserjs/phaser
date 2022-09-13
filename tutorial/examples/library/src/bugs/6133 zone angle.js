var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('fork', 'assets/sprites/fork.png');
}

function create ()
{
    //  So we can see our zone
    var r2 = this.add.rectangle(400, 300, 300, 150, 0x9966ff).setAngle(40);

    var fork = this.add.image(1024, 600, 'fork').setOrigin(0.5, 0).setAngle(-20);

    var zone1 = this.add.zone(400, 300).setSize(300, 150).setAngle(40).setInteractive();

    this.input.on('gameobjectdown', function (pointer, gameObject) {

        fork.x = pointer.x;
        fork.y = pointer.y;

    });
}
