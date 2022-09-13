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

function create ()
{
    //  How this renders depends entirely on the browser, each does it a little differently
    //  Note that the fill color value is ignored for most emoji (as you'd expect)
    this.add.text(0, 60, '😜🍩🏄🕹💖🧟', { fontFamily: 'Arial', fontSize: 96, fill: '#ff0000' });
    this.add.text(0, 260, '🥪🤬🧠💩🤖👩‍💻', { fontFamily: 'Arial', fontSize: 96, fill: '#ff0000' });

    //  Here is how to embed an emoji using a unicode sequence instead:
    //  For more details see http://crocodillon.com/blog/parsing-emoji-unicode-in-javascript
    this.add.text(0, 460, '\ud83d\ude03', { fontFamily: 'Arial', fontSize: 96, fill: '#ff0000' });
}
