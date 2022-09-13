var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
        physics: {
            arcade: {
                debug: true,
                gravity: { y: 200 }
            },
            matter: {
                debug: true,
                gravity: { y: 0.5 }
            },
            impact: {
                gravity: 100,
                debug: true,
                setBounds: {
                    x: 100,
                    y: 100,
                    width: 600,
                    height: 300,
                    thickness: 32
                },
                maxVelocity: 500
            }
        }
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('fuji', 'assets/sprites/fuji.png');
    this.load.image('block', 'assets/sprites/block.png');
    this.load.image('platform', 'assets/sprites/platform.png');
    this.load.image('gem', 'assets/sprites/gem.png');
}

function create ()
{
    //  Matter JS:
    this.matter.add.image(400, -100, 'block');
    this.matter.add.image(360, -600, 'block');
    this.matter.add.image(420, -900, 'block');

    this.matter.add.image(400, 550, 'platform', null, { isStatic: true });

    //  Impact Physics

    this.impact.add.image(300, 300, 'gem').setActiveCollision().setVelocity(300, 200).setBounce(1);

    //  Arcade Physics:

    this.physics.add.image(400, 100, 'fuji').setVelocity(100, 200).setBounce(1, 1).setCollideWorldBounds(true);
}
