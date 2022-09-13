var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#1b1464',
    parent: 'phaser-example',
    physics: {
        default: 'matter',
        matter: {
            gravity: { y: 0.3 },
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
    this.load.json('shapes', 'assets/physics/catstick.json');
    this.load.image('catstick', 'assets/sprites/catstick.png');
    this.load.image('block', 'assets/sprites/crate32.png');
}

function create ()
{
    var shapes = this.cache.json.get('shapes');

    var cat = this.add.container(400, 450);

    cat.add(this.add.sprite(0, 0, 'catstick'));

    this.matter.add.gameObject(cat, { shape: shapes.catstick, isStatic: true });

    // var cat = this.matter.add.sprite(400, 450, 'catstick', null, { shape: shapes.catstick, isStatic: true });
    // cat.setScale(0.5);

    cat.setAngle(75);
    cat.setBounce(0.7);

    for (var i = 0; i < 32; i++)
    {
        var x = Phaser.Math.Between(300, 500);
        var y = Phaser.Math.Between(-300, -100);

        this.matter.add.sprite(x, y, 'block').setAngle(20);
    }

}
