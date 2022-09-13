var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scale: {
        width: 400,
        height: 300
    },
    scene: {
        create: create
    }
};

var game = new Phaser.Game(config);

function create ()
{
    var srcA = {
        a: {
            c: 100
        }
    }

    var srcB = {
        b: {

        }
    }

    var value = Phaser.Utils.Objects.GetValue(srcA, 'a.b.c', 66, srcB)

    console.log(value)

    this.add.text(200, 200, 'hello: ' + value);
}
