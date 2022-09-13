var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    // this.load.binary('tune1', 'assets/audio/sid/8-Bit_House_Party.sid');
    // this.load.binary('tune1', 'assets/audio/sid/Hawkeye.sid');
    // this.load.binary('tune1', 'assets/audio/sid/Katakis.sid');

    this.load.binary('tune1', 'assets/audio/sid/cybernoid.sid');
    // this.load.binary('tune1', 'assets/audio/sid/cybernoid2.sid');
    // this.load.binary('tune1', 'assets/audio/sid/mutants.sid');
    // this.load.binary('tune1', 'assets/audio/sid/thrust.sid');
    // this.load.binary('tune1', 'assets/audio/sid/robocop.sid');
    // this.load.binary('tune1', 'assets/audio/sid/warhawk.sid');
    // this.load.binary('tune1', 'assets/audio/sid/stormlord.sid');
    // this.load.binary('tune1', 'assets/audio/sid/zoids.sid');

    this.load.plugin('SIDPlayerPlugin', 'assets/audio/sid/SIDPlayerPluginES5.js', true);
    this.load.script('jsSID', 'assets/audio/sid/jsSID.js');
}

function create ()
{
    var text = this.add.text(10, 10, 'SID Player', { font: '16px Courier', fill: '#00ff00' });

    var plugin = this.plugins.get('SIDPlayerPlugin');
    plugin.loadLocal(this.cache.binary.get('tune1'));

    /*
    var SIDplayer = new jsSID(16384, 0.0005);

    SIDplayer.loadLocal(this.cache.binary.get('tune1'));

    SIDplayer.setmodel(6581);

    var i = 0;
    var max = SIDplayer.getsubtunes();

    text.setText([
        'Title: ' + SIDplayer.gettitle(),
        'Author: ' + SIDplayer.getauthor(),
        'Info: ' + SIDplayer.getinfo(),
        'Current Sub-Tune: ' + i,
        'Total Sub-Tunes: ' + SIDplayer.getsubtunes(),
        'Pref. Model: ' + SIDplayer.getprefmodel(),
        'Playtime: ' + SIDplayer.getplaytime(),
        'Playback Model: ' + SIDplayer.getmodel()
    ]);

    this.input.keyboard.on('keyup_LEFT', function () {

        if (i > 0)
        {
            i--;

            SIDplayer.loadLocal(this.cache.binary.get('tune1'), i);
        }

    }, this);

    this.input.keyboard.on('keyup_RIGHT', function () {

        if (i <= max)
        {
            i++;

            SIDplayer.loadLocal(this.cache.binary.get('tune1'), i);
        }

    }, this);
    */
}
