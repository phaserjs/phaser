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

function create() 
{
    var style = {
        fontSize: '32px',
        fontFamily: 'Arial',
        color: '#ffffff',
        backgroundColor: '#ff00ff'
    };

    //  No padding
    var config0 = {
        x: 100,
        y: 50,
        text: 'Padding Test',
        style: style
    };

    this.make.text(config0);

    //  16px padding around the whole Text object
    var config1 = {
        x: 100,
        y: 150,
        padding: 16,
        text: 'Padding Test',
        style: style
    };

    this.make.text(config1);

    //  32px padding on the left/right, 0 on the top/bottom
    var config2 = {
        x: 100,
        y: 250,
        padding: {
            x: 32
        },
        text: 'Padding Test',
        style: style
    };

    this.make.text(config2);

    //  32px padding on the left/right, 16 on the top/bottom
    var config3 = {
        x: 100,
        y: 350,
        padding: {
            x: 32,
            y: 16
        },
        text: 'Padding Test',
        style: style
    };

    this.make.text(config3);

    //  Variable padding around all edges
    var config4 = {
        x: 100,
        y: 450,
        padding: {
            left: 64,
            right: 16,
            top: 20,
            bottom: 40
        },
        text: 'Padding Test',
        style: style
    };

    this.make.text(config4);
}
