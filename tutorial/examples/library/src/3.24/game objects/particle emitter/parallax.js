var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    backgroundColor: '#000',
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.atlas('megaset', 'assets/atlas/megaset-0.png', 'assets/atlas/megaset-0.json');
}

function create ()
{
    var offscreen = new Phaser.Geom.Rectangle(-400, 0, 400, 600);
    var screen = new Phaser.Geom.Rectangle(-400, 0, 1200, 600);

    this.add.particles('megaset', [
        {
            frame: 'blue_ball',
            emitZone: { source: offscreen },
            deathZone: { source: screen, type: 'onLeave' },
            frequency: 100,
            speedX: { min: 80, max: 120 },
            lifespan: 30000,
            scale: 0.5
        },
        {
            frame: 'red_ball',
            emitZone: { source: offscreen },
            deathZone: { source: screen, type: 'onLeave' },
            frequency: 150,
            speedX: { min: 180, max: 220 },
            lifespan: 30000,
            scale: 0.8
        },
        {
            frame: 'yellow_ball',
            emitZone: { source: offscreen },
            deathZone: { source: screen, type: 'onLeave' },
            frequency: 500,
            quantity: 4,
            speedX: { min: 280, max: 320 },
            lifespan: 30000
        },
    ]);
}
