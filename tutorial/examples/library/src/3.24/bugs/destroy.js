var count = 0;
var times = 5;

function createAndDestroyGame () {

    var game;

    var config = {
        type: Phaser.WEBGL,
        width: 800,
        height: 600,
        parent: 'phaser-example',
        scene: {
            preload: preload,
            create: create,
        }
    };

    game = new Phaser.Game(config);

    function preload () {
        // this.load.image('dude', 'assets/input/p.png');
    };

    function create () {
        //this.add.image(400, 300, 'dude');
        //this.add.text(100, 200, 'game created', { fontFamily: 'Arial', fontSize: 64, color: '#f0f000' });
        console.log('created', ++count);
        game.destroy(true, false);
    };

    game.events.on('destroy', function () {
        console.log('destroyed', count);
        game = null;
        if (count < times) {

            window.setTimeout(createAndDestroyGame, 1000);

        }
    });

}

var b = document.createElement('button');
b.innerText = 'Run 5';
document.body.appendChild(b);
b.onclick = createAndDestroyGame;

var b2 = document.createElement('button');
b2.innerText = 'Run 10';
document.body.appendChild(b2);
b2.onclick = function () { times = 10; createAndDestroyGame(); };

