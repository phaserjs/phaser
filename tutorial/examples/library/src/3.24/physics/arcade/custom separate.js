var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            fps: 100,
            gravity: { y: 300 }
        }
    },
    scene: {
        preload: preload,
        create: create
    }
};

new Phaser.Game(config);

function preload ()
{
    this.load.image('block', 'assets/sprites/block.png');
}

function create ()
{
    this.physics.world.checkCollision.up = false;

    var group = this.physics.add.group({
        key: 'block',
        frameQuantity: 6,
        bounceY: 0.5,
        dragY: 30,
        velocityY: 300,
        collideWorldBounds: true,
        setXY: { x: 400, y: 0, stepY: -200 }
    });

    group.children.iterate(function (block) {
        block.body.customSeparateY = true;
    });

    this.physics.add.collider(group, group, function (s1, s2) {
        var b1 = s1.body;
        var b2 = s2.body;

        if (b1.y > b2.y) {
            b2.y += (b1.top - b2.bottom);
            b2.stop();
        }
        else {
            b1.y += (b2.top - b1.bottom);
            b1.stop();
        }
    });
}
