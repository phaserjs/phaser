var config = {
    type: Phaser.AUTO,
    width: 821,
    height: 552,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
        update: update,
        extend:
        {
            scanFont: scanFont
        }
    }
};

var fNoop =  0, // No effect
    fSin1 =  1, // Sine 1
    fSin2 =  2, // Sine 2
    fBce1 =  3, // Bounce 1
    fBce2 =  4, // Bounce 2
    fRot1 =  5, // Rotate slow
    fRot2 =  6, // Rotate quick
    fCyld =  7, // Cylinder
    fTria =  8, // Triangle
    fGrow =  9; // Pack/Unpack

var colrY =  0, // Yellow
    colrB =  1, // Blue
    colrP =  2, // Purple
    flgDE =  3, // Germany
    flgFR =  4, // France
    flgBE =  5, // Belgium
    flgGB =  6, // Great-Britain
    flgSE =  7, // Sweden
    flgNL =  8, // Netherlands
    flgSC =  9, // Scotland
    flgES = 10, // Spain
    flgAU = 11, // Australia
    flgPT = 12, // Portugal
    flgCH = 13, // Switzerland
    flgLU = 14; // Luxembourg

// Scrolltext
var text = [
    [fNoop, colrY, 0, 'phaser 3'],
    [fSin1, colrB, 0, 'phaser 3'],
    [fSin2, colrP, 0, 'phaser 3'],
    [fBce1, colrY, 0, 'phaser 3'],
    [fBce2, colrB, 0, 'phaser 3'],
    [fRot1, colrP, 0, 'phaser 3'],
    [fRot2, colrY, 0, 'phaser 3'],
    [fCyld, colrB, 0, 'phaser 3'],
    [fTria, colrP, 0, 'phaser 3'],
    [fGrow, colrY, 0, 'phaser 3'],

    [fSin1, colrB, 0, 'ohhh the new blitter object'],
    [fRot1, colrY, 0, 'can do some really cool stuff'],
    [fBce1, colrP, 0, 'don\'t you think so?'],
    [fCyld, colrY, 0, 'Let\'s do the twist again!'],
    [fTria, colrB, 0, 'A demo masterminded by Alien.'],
    [fSin2, colrP, 0, 'Would you like to see some more bobs? Ok:'],
    [fRot2, colrY, 0, '# ## ### ######'],
    [fGrow, colrP, 0, 'You just saw 384 masked 3-bitplane bobs per VBL...'],
    [fRot1, colrY, 0, 'Anyway, let\'s have some greetings now.'],
    [fTria, colrP, 0, 'First the megagreetings. They go to:'],
    [fTria, flgDE, 0, 'Delta Force'],
    [fGrow, flgFR, 0, 'Legacy'],
    [fGrow, flgFR, 0, 'Overlanders'],
    [fCyld, flgFR, 0, 'Poltergeist'],
    [fSin2, flgDE, 0, 'TEX'],
    [fGrow, flgFR, 1, 'Vegetables.'],
    [fNoop, colrB, 0, 'Normal greetings go to:'],
    [fNoop, flgFR, 0, '1984    ABCS 85'],
    [fTria, flgDE, 0, 'ACF'],
    [fTria, flgFR, 0, 'Mathias Agopian'],
    [fRot1, flgFR, 0, 'Alcatraz'],
    [fSin1, flgDE, 0, 'BMT'],
    [fSin1, flgFR, 0, 'DNT Crew'],
    [fGrow, flgBE, 1, 'Dr. Satan'],
    [fNoop, flgGB, 0, 'Dynamic Duo'],
    [fCyld, flgSE, 0, 'Electra'],
    [fTria, flgGB, 0, 'Electronic Images'],
    [fSin2, flgFR, 0, 'Equinox'],
    [fGrow, flgNL, 0, 'Eternal'],
    [fRot2, flgSC, 0, 'Fingerbobs'],
    [fBce2, flgSE, 0, 'Flexible Front'],
    [fBce2, flgNL, 0, 'Galtan 6'],
    [fBce1, flgFR, 0, 'Laurent Z.'],
    [fBce1, flgBE, 0, 'Lem and Nic'],
    [fTria, flgFR, 0, 'Mad Vision'],
    [fGrow, flgFR, 0, 'MCoder'],
    [fRot2, flgFR, 0, 'Naos'],
    [fBce2, flgGB, 0, 'Neil of Cor Blimey'],
    [fCyld, flgDE, 0, 'Newline'],
    [fCyld, flgFR, 0, 'Next    NGC'],
    [fBce1, flgSE, 0, 'Omega    Phalanx'],
    [fBce1, flgFR, 0, 'Prism    Quartex'],
    [fGrow, flgES, 1, 'Red Devil'],
    [fNoop, flgDE, 0, 'The Respectables'],
    [fSin1, flgGB, 0, 'Ripped Off'],
    [fRot2, flgAU, 0, 'Sewer Software'],
    [fTria, flgFR, 0, 'Silents'],
    [fBce1, flgPT, 0, 'Paulo Simoes'],
    [fCyld, flgCH, 0, 'Spreadpoint'],
    [fNoop, flgFR, 0, 'ST Magazine'],
    [fNoop, flgNL, 0, 'ST News'],
    [fNoop, flgDE, 0, 'Sven Meyer'],
    [fBce2, flgSE, 0, 'Sync'],
    [fBce1, flgSE, 0, 'TCB'],
    [fGrow, flgCH, 0, 'TDA'],
    [fGrow, flgGB, 0, 'TLB'],
    [fGrow, flgDE, 0, 'TNT-Crew'],
    [fSin2, flgDE, 0, 'TOS Magazin'],
    [fSin2, flgFR, 0, 'Tsunoo Rhilty'],
    [fRot2, flgDE, 0, 'TVI'],
    [fGrow, flgLU, 0, 'ULM'],
    [fGrow, flgFR, 0, 'Undead'],
    [fCyld, flgGB, 0, 'XXX International'],
    [fCyld, flgFR, 0, 'Yoda'],
    [fCyld, flgFR, 0, 'Zarathoustra.'],
    [fNoop, colrP, 0, 'Alien\'s special greetings are flying over to:'],
    [fSin2, flgFR, 0, 'Atm    Alain Hurtig    Nicolas Chouckroun'],
    [fTria, flgDE, 0, 'Flix    Big Alec'],
    [fSin1, flgGB, 0, 'Manikin'],
    [fSin1, flgNL, 0, 'Digital Insanity'],
    [fSin2, flgFR, 0, 'Fury'],
    [fGrow, flgLU, 0, 'Gunstick'],
    [fRot2, flgFR, 0, 'Dbug II'],
    [fTria, flgDE, 0, 'ES    Gogo'],
    [fGrow, flgSE, 0, 'Tanis'],
    [fRot1, flgFR, 0, 'Gordon    Thomas Landspurg'],
    [fBce1, flgGB, 0, 'Kreator    4mat'],
    [fTria, flgFR, 0, 'Moby    Audio Monster'],
    [fNoop, colrP, 0, 'Douglas Adams and Rodney Matthews.    Now a little comment about ripping...'],
    [fSin1, colrY, 0, 'ST Connexion\'s policy is the following:'],
    [fGrow, colrP, 0, 'All our code is copyrighted and may not be re-used in any program or modified in any way whatsoever.'],
    [fNoop, colrB, 0, 'It is also illegal to distribute it under any form other than that in which it was released:'],
    [fSin2, colrP, 0, 'Delta Force\'s Punish Your Machine Demo.'],
    [fNoop, colrY, 0, 'If you wonder why we have such a strict policy, it is because some commercial lamers helped themselves to parts of our code, as well as inumerable groups.'],
    [fSin1, colrP, 0, 'Some hints about the 4-bit hardware scroller coming up...    In January 1991, I (Alien) got my 4-bit hardware-scroller to work.'],
    [fSin2, colrP, 0, 'It allows you to move the whole screen left and right by increments of 4 pixels. The source has been published in my series of articles about overscan in ST Magazine, a French publication.'],
    [fTria, colrY, 0, 'As this technique is brand-new, it may not work on some Atari ST\'s. If it doesn\'t work on yours, please contact us.'],
    [fBce2, colrB, 0, 'Time to grab a pen..........    To obtain 4 bit hardware scrolling on an ST, you have to switch to midrez after the passage to hirez used to free the left border, and then wait 0,4,8,12 cycles before switching back to lowrez.'],
    [fNoop, colrP, 0, 'This affects the way the shifter works, and delays the displaying of the picture by a multiple of 500 nanoseconds, which results in an effective shift in the picture...'],
    [fSin2, colrY, 0, 'Note the method described here does not work on some STE\'s.   Time is up, so let\'s cut the crap:'],
    [fRot1, colrB, 0, 'According to Vickers of Legacy sitting next to us, you\'ve been reading this text for over an hour...'],
    [fCyld, colrP, 0, 'But the original version was over 10 kb long, ensuring 4 hours of pleasant reading!'],
    [fGrow, colrY, 0, 'See you in the next St Connexion Production, scheduled to be released within the next 2 years!                                 '],
],
frame,
letters,
structure,
text_num  = -1,
callback  = null,
tile      = null,
counter   = -1,
first     = 0,
iteration = null,
skip      = false,
blitter   = null;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('font', 'assets/tests/twist/bob-font.png');
    this.load.atlas('bobs', 'assets/tests/twist/bobs.png', 'assets/tests/twist/bobs.json');
}

function create ()
{
    this.scanFont();

    blitter = this.add.blitter(0, 0, 'bobs');

    frame = this.textures.getFrame('bobs', 'bob2');
}

function scanFont ()
{
    var font_canvas = Phaser.Display.Canvas.Pool.create(this, 120, 102);

    var ctx = font_canvas.getContext('2d');

    ctx.drawImage(this.textures.get('font').source[0].image, 0, 0);

    var imageData = ctx.getImageData(0, 0, font_canvas.width, font_canvas.height);

    letters = [];

    for (var y = 0 ; y < 6 ; y++) {
        for (var x = 0 ; x < 10 ; x++) {
            var letter = [];
            for (var i = 0 ; i < 12 ; i++) {
                var col = [], tot = 0;
                for (var j = 0 ; j < 17 ; j++) {
                    var index = ((y * 17 + j) * imageData.width + (x * 12 + i)) * 4;
                    col[j] = (imageData.data[index] > 0) ? 1 : 0;
                    tot += col[j];
                }
                if (tot > 0) letter[i] = col; else continue;
            }
            // Space
            if (x == 0 && y == 0) {
                for (var i = 0 ; i < 8 ; i++) {
                    letter[i] = [];
                }
            }
            letters[y * 10 + x] = letter;
        }
    }
}

function generateStructure (text)
{
    var letter, c = 0;
    structure = []

    // Spaces before the text
    for (var i = 0 ; i < 34 ; i++) {
        structure[c++] = [];
    }

    // Run through the text
    for (var x = 0 ; x < text.length ; x++) {
        letter = letters[text.toUpperCase().charCodeAt(x) - 32];
        for (var i = 0 ; i < letter.length ; i++) {
            structure[c++] = letter[i];
        }
        // Add a spacer column (except for # character)
        if (text.toUpperCase().charCodeAt(x) != 35) {
            structure[c++] = [];
        }
    }

    // Spaces after the text
    for (var i = 0 ; i < 26 ; i++) {
        structure[c++] = [];
    }
}

function drawFont (position, increment, callback, tile)
{
    blitter.clear();

    var mid = 140;

    for (var x = 0 ; x <= 26 ; x++)
    {
        var col = structure[position + x];

        for (var y = 0 ; y < 16 ; y++)
        {
            if (col[y] === 1)
            {
                switch (callback)
                {
                    // Sine
                    case fSin1: posy = mid + 30 * Math.sin((x + iteration) / 8) + (y - 8) * 10; break;
                    case fSin2: posy = mid + 30 * Math.sin((x + iteration) / 6) + (y - 8) * 10; break;

                    // Bounce
                    case fBce1: posy = mid + 20 - 40 * Math.abs(Math.sin((x + iteration) / 8.75)) + (y - 8) * 10; break;
                    case fBce2: posy = mid + 20 - 40 * Math.abs(Math.sin((x + iteration) / 17.5)) + (y - 8) * 10; break;

                    // Rotate
                    case fRot1: posy = mid + ((y - 8) * 10) * Math.sin((x + iteration) / 8); break;
                    case fRot2: posy = mid + ((y - 8) * 10) * Math.sin((x + iteration) / 5); break;

                    // Cylinder
                    case fCyld: posy = mid + 100 * Math.sin((x + y + iteration) / 8.75); break;

                    // Triangular
                    case fTria: posy = mid + 10 * Math.abs((((x + iteration) / 8) % 12) - 6) - 30 + ((y - 8) * 10); break;

                    // Pack/Unpack
                    case fGrow: posy = mid + (y - 8) * (10 + 3 * Math.sin((x + iteration) / 10)); break;

                    // No effect
                    default:    posy = mid + (y - 8) * 10; break;
                }

                blitter.create(x * 32 - increment * 8, Math.round(posy) * 2, frame);
            }
        }
    }
}

function update ()
{
    // Load next scroller
    if (text_num < 0 || counter < 0)
    {
        first++;
        text_num++;

        if (text_num == text.length)
        {
            text_num = 0;
        }

        callback  = text[text_num][0];
        tile      = text[text_num][1];
        generateStructure(text[text_num][3]);
        counter   = (structure.length - 26) * 4 - 1;
        iteration = 0;

        frame = this.textures.getFrame('bobs', 'bob' + (tile + 1).toString());
    }

    // Draw 4-bit scroller
    drawFont(Math.floor(iteration / 4), iteration % 4, callback, tile);

    // Next iteration
    counter--;
    iteration++;
}

/*
 * +================================================================================+
 * | A CODEF/HTML5 remake of the screen "Let's Do The Twist Again" by ST Connexion, |
 * | released in the Punish Your Machine demo by Delta Force (Atari ST, 1991)       |
 * |                                                                                |
 * | It was the first (and only one?) demo featuring 4-bit syncscroller, that       |
 * | allowed to shift the screen by increments of 4 pixels, whereas a "classic"     |
 * | syncscroller had a 16 px accuracy.                                             |
 * |                                                                                |
 * | Alien of ST Connexion did a series of articles about overscan in ST Magazine,  |
 * | a French publication, that were partially translated in Alive diskmag.         |
 * |                                                                                |
 * | http://demozoo.org/productions/123966/                                         |
 * +--------------------------------------------------------------------------------+
 * | Music mod.art by Noise/Celtic :                                                |
 * |   http://janeway.exotica.org.uk/release.php?id=33713                           |
 * | Which is a cover of Fallen Angel by Mysterious Art :                           |
 * |   http://www.discogs.com/Mysterious-Art-Omen.../master/91953                   |
 * +================================================================================+
 * | Copyleft 2015 by Dyno <dyno@aldabase.com>                                      |
 * +================================================================================+
 */
