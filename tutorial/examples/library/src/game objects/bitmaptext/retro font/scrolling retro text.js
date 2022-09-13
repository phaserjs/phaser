let i = 0;
class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.image('neuromancer', 'assets/pics/case.jpg');
        this.load.image('knighthawks', 'assets/fonts/retro/knighthawks-font.png');
    }

    create ()
    {
        var prose = [
            "The sky above the port was the color of television, tuned to a dead channel.",
            "'It's not like I'm using,' Case heard someone say, as he shouldered his way",
            "through the crowd around the door of the Chat. 'It's like my body's developed",
            "this massive drug deficiency.' It was a Sprawl voice and a Sprawl joke.",
            "The Chatsubo was a bar for professional expatriates; you could drink there for",
            "a week and never hear two words in Japanese.",
            "Ratz was tending bar, his prosthetic arm jerking monotonously as he filled a tray",
            "of glasses with draft Kirin. He saw Case and smiled, his teeth a webwork of",
            "East European steel and brown decay. Case found a place at the bar, between the",
            "unlikely tan on one of Lonny Zone's whores and the crisp naval uniform of a tall",
            "African whose cheekbones were ridged with precise rows of tribal scars. 'Wage was",
            "in here early, with two joeboys,' Ratz said, shoving a draft across the bar with",
            "his good hand. 'Maybe some business with you, Case?'",
            "Case shrugged. The girl to his right giggled and nudged him.",
            "The bartender's smile widened. His ugliness was the stuff of legend. In an age of",
            "affordable beauty, there was something heraldic about his lack of it. The antique",
            "arm whined as he reached for another mug.",
            "   -----------   From Neuromancer by William Gibson                             "
        ];

        this.content = prose.join(' ').toUpperCase();

        var config = {
            image: 'knighthawks',
            width: 32,
            height: 25,
            chars: Phaser.GameObjects.RetroFont.TEXT_SET2,
            charsPerRow: 10
        };

        this.cache.bitmapFont.add('knighthawks', Phaser.GameObjects.RetroFont.Parse(this, config));

        this.add.image(400, 300, 'neuromancer').setAlpha(0.3);

        this.dynamic = this.add.dynamicBitmapText(0, 190, 'knighthawks', '  ---------------------   ');
        this.dynamic.setScale(4);
    }

    update ()
    {
        this.dynamic.scrollX += 4;

        if (this.dynamic.scrollX >= 32)
        {
            //  Remove first character
            var current = this.dynamic.text.substr(1);

            //  Add next character from the string
            current = current.concat(this.content[i]);

            i++;

            if (i === this.content.length)
            {
                i = 0;
            }

            //  Set it
            this.dynamic.setText(current);

            //  Reset scroller
            this.dynamic.scrollX = this.dynamic.scrollX % 32;
        }
    }
}

const config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    pixelArt: true,
    width: 800,
    height: 600,
    scene: [ Example ]
};

const game = new Phaser.Game(config);
