var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('cokecan', 'assets/sprites/cokecan.png');
}

function create ()
{
    var info = this.add.text(0, 0, 'Click to add objects', { fill: '#00ff00' });

    //  Our pool - essentially a Group that takes advantage of maxSize

    //  Setting the maxSize property limits the amount of objects allowed in this pool

    var cans = this.add.group({
        defaultKey: 'cokecan',
        maxSize: 10
    });

    var x = 60;

    this.input.on('pointerdown', function () {

        //  Pluck an entry from the pool. If it doesn't already exist, create it.
        cans.get(x, 300);

        x += 74;

        info.setText([
            'Used: ' + cans.getTotalUsed(),
            'Free: ' + cans.getTotalFree()
        ]);

    });
}
