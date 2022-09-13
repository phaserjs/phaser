var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    backgroundColor: '#cdcdcd',
    scene: {
        preload: preload,
        create: create,
        pack: {
            files: [
                { type: 'scenePlugin', key: 'SpinePlugin', url: 'plugins/SpinePlugin.js', sceneKey: 'spine' }
            ]
        }
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('logo', 'assets/sprites/phaser.png');

    this.load.setPath('assets/spine/demos/');

    this.load.spine('set1', 'demos.json', [ 'atlas1.atlas', 'atlas2.atlas', 'heroes.atlas' ], true);
}

function create ()
{
    this.add.text(10, 10, 'Click the alien', { font: '16px Courier', fill: '#ffffff' }).setShadow(1, 1);

    var b = this.add.spine(400, 500, 'set1.alien').setScale(0.5);

    // var b = this.add.spine(400, 500, 'set1.armorgirl').setScale(0.2);
    // var b = this.add.spine(400, 500, 'set1.dragon').setScale(0.5);
    // var b = this.add.spine(600, 750, 'set1.greengirl').setScale(0.8);
    // var b = this.add.spine(400, 500, 'set1.heroes').setSkinByName('Assassin');
    // var b = this.add.spine(400, 700, 'set1.orangegirl').setScale(1);
    // var b = this.add.spine(400, 500, 'set1.raptor').setScale(0.6);
    // var b = this.add.spine(400, 500, 'set1.spineboy').setScale(1);
    // var b = this.add.spine(400, 500, 'set1.stretchyman').setScale(0.4);
    // var b = this.add.spine(400, 500, 'set1.tank').setScale(0.1);
    // var b = this.add.spine(400, 500, 'set1.vine').setScale(0.5);

    b.setInteractive();

    //  Toggle to view the hit area
    this.input.enableDebug(b, 0xff00ff);

    var anims = b.getAnimationList();

    b.once('pointerdown', function () {

        b.play(anims[0], false);

    }, this);
}
