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

    //  If you provide the Text Metrics in the Text Config then you can
    //  avoid it having to create a canvas, draw to it, then scan the canvas,
    //  in order to calculate the metrics internally.
    var config1 = {
        x: 100,
        y: 100,
        text: 'Phaser III',
        style: {
            fontSize: '48px',
            fontFamily: 'Arial',
            color: '#ffffff',
            metrics: {
                ascent: 45,
                descent: 10,
                fontSize: 55
            }
        }
    };

    var text = this.make.text(config1);

    //  You can get the metrics from a Text object by doing this:

    console.log(text.getTextMetrics());

    console.log(text.toJSON());
}
