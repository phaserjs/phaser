var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.unityAtlas('asteroids', 'assets/atlas/asteroids.png', 'assets/atlas/asteroids.png.meta');
}

function create ()
{
    this.add.image(200, 200, 'asteroids', 'asteroids_7');
    this.add.image(400, 200, 'asteroids', 'asteroids_10');
    this.add.image(600, 200, 'asteroids', 'asteroids_13');
    this.add.image(200, 400, 'asteroids', 'asteroids_17');
    this.add.image(400, 400, 'asteroids', 'asteroids_21');
    this.add.image(600, 400, 'asteroids', 'asteroids_30');
}
