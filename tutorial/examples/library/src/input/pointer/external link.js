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
    this.load.image('logo', 'assets/sprites/phaser3-logo.png');
}

function create ()
{
    var button = this.add.image(400, 300, 'logo').setInteractive();

    button.on('pointerup', openExternalLink, this);
}

function openExternalLink ()
{
    var tweet = 'I am testing a button from within a Phaser example';

    var url = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(tweet);

    var s = window.open(url, '_blank');

    if (s && s.focus)
    {
        s.focus();
    }
    else if (!s)
    {
        window.location.href = url;
    }
}
