var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#c4dedf',
    parent: 'phaser-example',
    physics: {
        default: 'matter',
        matter: {
            debug: false,
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
    this.load.image('mountains', 'assets/skies/mountains-tile.png');
    this.load.spritesheet('balls', 'assets/sprites/balls.png', { frameWidth: 17, frameHeight: 17 });
}

function create ()
{
    this.add.image(0, 600, 'mountains').setOrigin(0, 1);

    this.matter.world.setBounds(0, 0, 800, 600, 32, true, true, false, true);

    var path = '0 307 0 67 8 55 12 53 57 128 86 94 128 136 148 103 190 159 210 135 222 149 248 109 267 133 293 93 321 128 361 75 381 97 439 4 523 117 551 78 563 92 569 93 603 38 637 99 654 53 701 154 729 109 750 140 800 66 800 307';

    //  The direct Matter way:

    // var verts = Phaser.Physics.Matter.Matter.Vertices.fromPath(path);

    // var body = Phaser.Physics.Matter.Matter.Bodies.fromVertices(408, 492, verts, { ignoreGravity: true }, true, 0.01, 10);

    // Phaser.Physics.Matter.Matter.World.add(this.matter.world.localWorld, body);

    //  Or the short-cut version using factory helpers:

    var verts = this.matter.verts.fromPath(path);

    this.matter.add.fromVertices(408, 492, verts, { ignoreGravity: true }, true, 0.01, 10);

    //  Just a repeating timer
    this.time.addEvent({ delay: 250, callback: releaseBall, callbackScope: this, repeat: 256 });
}

function releaseBall ()
{
    var ball = this.matter.add.image(Phaser.Math.Between(32, 768), -200, 'balls', Phaser.Math.Between(0, 5));

    ball.setCircle();
    ball.setBounce(0.96);
}
