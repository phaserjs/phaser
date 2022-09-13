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
    this.load.atlas('flares', 'assets/particles/flares.png', 'assets/particles/flares.json');
    this.load.json('emitter', 'assets/particles/emitter.json'); // see './particle editor.js'
}

function create ()
{
    var particles = this.add.particles('flares');

    particles.createEmitter(this.cache.json.get('emitter'));

}
