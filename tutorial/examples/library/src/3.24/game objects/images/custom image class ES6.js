class EnemyRobot extends Phaser.GameObjects.Image {

    constructor (scene, x, y)
    {
        super(scene, x, y);

        this.setTexture('contra');
        this.setPosition(x, y);
        this.setScale(2);
    }

}

var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('contra', 'assets/pics/contra3.png');
}

function create ()
{
    this.children.add(new EnemyRobot(this, 264, 250));
    this.children.add(new EnemyRobot(this, 464, 350));
    this.children.add(new EnemyRobot(this, 664, 450));
}
