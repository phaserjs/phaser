var seed = 1419463258969;

var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    seed: [ seed ],
    scene: {
        create: create
    }
};

var game = new Phaser.Game(config);

function create ()
{
    var text = this.add.text(80, 80, '', { font: '16px Courier', fill: '#ffffff' });

    //  Every time you reload the page you should get the same values back again
    //  because the RNG was seeded in the Game Config with the same seed value.
    //  Adjust the seed for different results. Remove it for random results.

    var shuffleTest = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G' ];

    text.setText([
        'RNG',
        '---',
        'Seed: ' + seed,
        '',
        'Between 0 and 50: ' + Phaser.Math.RND.between(0, 50),
        'Between 0 and 1: ' + Phaser.Math.RND.realInRange(0, 1),
        'Normal: ' + Phaser.Math.RND.normal(),
        'UUID: ' + Phaser.Math.RND.uuid(),
        'Angle: ' + Phaser.Math.RND.angle(),
        'Shuffle: ' + Phaser.Math.RND.shuffle(shuffleTest).join(' ')
    ]);
}
