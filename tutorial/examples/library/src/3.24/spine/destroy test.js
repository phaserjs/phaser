var game;

function makeGame ()
{
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

    game = new Phaser.Game(config);

    function preload ()
    {
        this.load.setPath('assets/spine/coin');

        this.load.spine('coin', 'coin-pro.json', 'coin.atlas');
    }

    function create ()
    {
        var b = this.add.spine(400, 300, 'coin', 'animation', true);
    }
}

var b = document.createElement('button');
b.innerText = 'Nuke';
document.body.appendChild(b);

b.onclick = function () {

    game.destroy(true, false);

};

var b2 = document.createElement('button');
b2.innerText = 'Create';
document.body.appendChild(b2);

b2.onclick = makeGame;

makeGame();
