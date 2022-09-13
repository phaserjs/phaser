function create ()
{
    // RTL without padding
    this.add.text(
        400, 250,
        'יא פרו...',
        {
            fixedWidth: 300, fixedHeight: 80,
            backgroundColor: '#333333',
            rtl: true
        }
    );

    // RTL with lett/right padding
    this.add.text(
        400, 350,
        'יא פרו...',
        {
            fixedWidth: 300, fixedHeight: 80,
            padding: {
                left: 30, right: 30
            },
            backgroundColor: '#333300',
            rtl: true
        }
    );
}

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    scene: {
        create: create
    }
};

var game = new Phaser.Game(config);
