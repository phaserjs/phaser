var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    scene: {
        create: create,
    }
};

var game = new Phaser.Game(config);

function create () 
{
    //  Implicit values
    var textConfig = {
        x: 100,
        y: 100,
        text: 'Phaser 3\ntoJSON',
        style: {
            font: '64px Arial',
            fill: '#ffffff',
            align: 'center',
            backgroundColor: '#ff00ff'
        }
    };

    var text = this.make.text(textConfig);

    console.log(text.toJSON());
}
