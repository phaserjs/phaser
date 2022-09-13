var config = {
    type: Phaser.AUTO,
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

    //  16px padding around all sides
    this.add.text(100, 10, 'Phaser', style).setPadding(16);

    //  64px horizontal padding and 16px vertical padding
    this.add.text(100, 110, 'Phaser', style).setPadding(64, 16);

    //  The same again but specified in an object
    this.add.text(100, 210, 'Phaser', style).setPadding({ x: 64, y: 16 });

    //  16px vertical padding, 48px on the left and 128px on the right
    this.add.text(100, 310, 'Phaser', style).setPadding({ y: 16, left: 48, right: 128 });

    //  32px horizontal padding, 4px on the top and 16px on the bottom
    this.add.text(100, 410, 'Phaser', style).setPadding({ x: 32, top: 4, bottom: 16 });

    //  Different values for each side
    this.add.text(100, 510, 'Phaser', style).setPadding({ left: 8, right: 128, top: 0, bottom: 32 });
}
