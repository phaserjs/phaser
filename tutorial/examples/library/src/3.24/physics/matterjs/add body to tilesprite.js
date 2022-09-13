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
        create: create,
        update: update
    }
};

var sprite1;
var sprite2;
var iter = 0;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('platform', 'assets/sprites/platform.png');
    this.load.image('mushroom', 'assets/sprites/mushroom2.png');
    this.load.image('balls', 'assets/sprites/balls.png');
}

function create ()
{
    sprite1 = this.add.tileSprite(100, 100, 150, 150, 'mushroom');
    sprite2 = this.add.tileSprite(0, -100, 200, 51, 'balls');

    this.matter.add.gameObject(sprite1).setFrictionAir(0.001).setBounce(0.8);
    this.matter.add.gameObject(sprite2).setFrictionAir(0.001).setBounce(0.8);

    this.matter.add.image(350, 500, 'platform', null, { isStatic: true }).setScale(2, 0.5).setAngle(9);
}

function update ()
{
    sprite1.tilePositionX = Math.cos(iter) * 400;
    sprite1.tilePositionY = Math.sin(iter) * 400;
 
    sprite2.tilePositionX = Math.cos(-iter) * 200;
    sprite2.tilePositionY = Math.sin(-iter) * 200;

    iter += 0.01;
}
