var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 150,
    height: 600,
    backgroundColor: '#2d2d2d',
    dom: {
        createContainer: true
    },
    scene: {
        create: create
    }
};

var game = new Phaser.Game(config);

function create ()
{
    var style = {
        'background-color': 'lime',
        'width': '220px',
        'height': '100px',
        'font': '48px Arial',
        'font-weight': 'bold'
    };

    var element = this.add.dom(150, 300, 'div', style, 'Phaser 3');

    setTimeout(() => {
        this.cameras.resize(300, 600);
        this.scale.resize(300, 600);
    }, 5000);
}