var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var clown;
var iter = 3.14;
var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('CherilPerils', 'assets/tests/camera/CherilPerils.png');
    this.load.image('clown', 'assets/sprites/clown.png');
}

function create ()
{
    this.add.image(0, 0, 'CherilPerils').setOrigin(0);

    this.cameras.main.setSize(400, 300);

    var cam2 = this.cameras.add(400, 0, 400, 300);
    var cam3 = this.cameras.add(0, 300, 400, 300);
    var cam4 = this.cameras.add(400, 300, 400, 300);

    clown = this.add.image(450 + Math.cos(iter) * 200, 510 + Math.sin(iter) * 200, 'clown');

    this.cameras.main.startFollow(clown);

    cam2.startFollow(clown, false, 0.5, 0.5);
    cam3.startFollow(clown, false, 0.1, 0.1);
    cam4.startFollow(clown, false, 0.05, 0.05);
}

function update ()
{
    clown.x = 450 + Math.cos(iter) * 200;
    clown.y = 510 + Math.sin(iter) * 200;

    iter += 0.02;
}
