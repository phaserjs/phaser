var config = {
    type: Phaser.CANVAS,
    parent: 'phaser-example',
    scene: {
        create: create
    }
};

var game = new Phaser.Game(config);

function create ()
{
    // var a = [ 'a', 'b', 'c' ];
    // var a = [ 'a' ];
    var a = [ 'a', 'b' ];
    var b = [ 1, 2 ];
    // var b = [ 1, 2, 3 ];
    // var b = [ 1, 2, 3, 4, 5, 6, 7, 8 ];

    // var out = Phaser.Utils.Array.Range(a, b);

    // var out = Phaser.Utils.Array.Range(a, b, { repeat: 1 });
 
    // var out = Phaser.Utils.Array.Range(a, b, { yoyo: true, repeat: 1 });

    // var out = Phaser.Utils.Array.Range(a, b, { qty: 3, yoyo: true });

    // var out = Phaser.Utils.Array.Range(a, b, { random: true });

    // var out = Phaser.Utils.Array.Range(a, b, { randomB: true });

    var out = Phaser.Utils.Array.Range(a, b, { repeat: -1, max: 10 });

    out.forEach(function (e) {
        console.log(e.a, e.b);
    });
}
