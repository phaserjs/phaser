var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#1d1d1d',
    parent: 'phaser-example',
    physics: {
        default: 'matter',
        matter: {
            enableSleeping: true
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
    this.load.image('ball', 'assets/sprites/pangball.png');
}

function create ()
{
    this.matter.world.setBounds(0, 0, 800, 600, 32, true, true, false, true);

    this.time.addEvent({
        delay: 500,
        callback: function ()
        {
            var ball = this.matter.add.image(Phaser.Math.Between(100, 700), Phaser.Math.Between(-600, 0), 'ball');
            ball.setCircle();
            ball.setFriction(0.005).setBounce(1);
            ball.setSleepEvents(true, true);
        },
        callbackScope: this,
        repeat: 64
    });

    this.matter.world.on('sleepstart', function (event, body) {
        event.source.gameObject.setTint(0xff0000);
    });

    this.matter.world.on('sleepend', function (event) {
        event.source.gameObject.setTint(0xffffff);
    });
}
