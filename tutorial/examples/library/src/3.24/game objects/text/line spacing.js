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
    var content = [
        "The sky above the port was the color of television, tuned to a dead channel.",
        "`It's not like I'm using,' Case heard someone say, as he shouldered his way ",
        "through the crowd around the door of the Chat. `It's like my body's developed",
        "this massive drug deficiency.' It was a Sprawl voice and a Sprawl joke.",
        "The Chatsubo was a bar for professional expatriates; you could drink there for",
        "a week and never hear two words in Japanese.",
        "",
        "Ratz was tending bar, his prosthetic arm jerking monotonously as he filled a tray",
        "of glasses with draft Kirin. He saw Case and smiled, his teeth a webwork of",
        "East European steel and brown decay. Case found a place at the bar, between the",
        "unlikely tan on one of Lonny Zone's whores and the crisp naval uniform of a tall",
        "African whose cheekbones were ridged with precise rows of tribal scars. `Wage was",
        "in here early, with two joeboys,' Ratz said, shoving a draft across the bar with",
        "his good hand. `Maybe some business with you, Case?'"
    ];

    this.add.text(100, 60, content, { fontFamily: 'Arial', color: '#00ff00', lineSpacing: 10 });

    //  Or you can set it like this:

    // var t = this.add.text(100, 60, content, { fontFamily: 'Arial', color: '#00ff00' });
    // t.setLineSpacing(10);
}
