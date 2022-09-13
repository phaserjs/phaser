var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    backgroundColor: '#0072bc',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.binary('mod', 'assets/audio/protracker/act_of_impulse.mod');
}

function create ()
{
    var buffer = new Uint8Array(this.cache.binary.get('mod'));

    //   getString scans the binary file between the two values given, 
    //   returning the characters it finds there as a string

    var signature = getString(buffer, 1080, 1084);

    var text = this.add.text(32, 32, "Signature: " + signature, { fill: '#ffffff' });
    text.setShadow(2, 2, 'rgba(0,0,0,0.5)', 0);

    var title = getString(buffer, 0, 20)
    var text2 = this.add.text(32, 64, "Title: " + title, { fill: '#ffffff' });
    text2.setShadow(2, 2, 'rgba(0,0,0,0.5)', 0);

    //  Get the sample data
    var sampleText = [];

    for (var i = 0; i < 31; i++)
    {
        var st = 20 + i * 30;
        sampleText.push(getString(buffer, st, st + 22));
    }

    var text3 = this.add.text(400, 32, sampleText, { fill: '#ffffff' });
    text3.setShadow(2, 2, 'rgba(0,0,0,0.5)', 0);
}

function getString (buffer, start, end)
{
    var output = '';

    for (var i = start; i < end; i++)
    {
        output += String.fromCharCode(buffer[i]);
    }

    return output;
}
