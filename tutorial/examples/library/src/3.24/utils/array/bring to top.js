var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    scene: {
        create: create
    }
};

var game = new Phaser.Game(config);

function create ()
{
    var data = [ 'a', 'b', 'c', 'd', 'e', 'f', 'g' ];

    this.add.text(10, 10, 'Before: ' + data.join(' - '), { font: '16px Courier', fill: '#00ff00' });

    Phaser.Utils.Array.BringToTop(data, 'c');

    this.add.text(10, 40, 'After:  ' + data.join(' - '), { font: '16px Courier', fill: '#00ff00' });
}
