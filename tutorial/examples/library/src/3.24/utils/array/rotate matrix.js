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
    this.add.text(10, 10, 'Click to rotate the array matrix', { font: '16px Courier', fill: '#ffffff' });

    var text = this.add.text(200, 200, '', { font: '32px Courier', fill: '#00ff00' });

    var matrix = [
        [ 1, 1, 1, 1, 1, 1 ],
        [ 2, 0, 0, 0, 0, 4 ],
        [ 2, 0, 1, 2, 0, 4 ],
        [ 2, 0, 3, 4, 0, 4 ],
        [ 2, 0, 0, 0, 0, 4 ],
        [ 3, 3, 3, 3, 3, 3 ]
    ];

    text.setText(Phaser.Utils.Array.Matrix.MatrixToString(matrix));

    this.input.on('pointerup', function () {

        matrix = Phaser.Utils.Array.Matrix.RotateRight(matrix);

        text.setText(Phaser.Utils.Array.Matrix.MatrixToString(matrix));

    });
}
