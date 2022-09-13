class LeetSpeak {

    constructor ()
    {
        this.alphabetBasic = {
            'a': '4',
            'b': '8',
            'e': '3',
            'f': 'ph',
            'g': '6', // or 9
            'i': '1', // or |
            'o': '0',
            's': '5',
            't': '7' // or +
        };

        this.alphabetAdvanced = {
            'c': '(', // or k or |< or /<
            'd': '<|',
            'h': '|-|',
            'k': '|<', // or /<
            'l': '|', // or 1
            'm': '|\\/|',
            'n': '|\\|',
            'p': '|2',
            'u': '|_|',
            'v': '/', // or \/
            'w': '//', // or \/\/
            'x': '><',
            'y': '\'/'
        };

        this.alphabetReversed = [
            [/(\|\\\/\|)/g, 'm'],
            [/(\|\\\|)/g, 'n'],
            [/(\()/g, 'c'],
            [/(<\|)/g, 'd'],
            [/\|-\|/g, 'h'],
            [/(\|<)/g, 'k'],
            [/(\|2)/g, 'p'],
            [/(\|_\|)/g, 'u'],
            [/(\/\/)/g, 'w'],
            [/(><)/g, 'x'],
            [/(\|)/g, 'l'],
            [/(\'\/)/g, 'y'],
            [/(\/)/g, 'v'],
            [/(1)/g, 'i'],
            [/(0)/g, 'o'],
            [/(3)/g, 'e'],
            [/(4)/g, 'a'],
            [/(5)/g, 's'],
            [/(6)/g, 'g'],
            [/(7)/g, 't'],
            [/(8)/g, 'b'],
            [/(ph)/g, 'f'],
        ];
    }

    convert (text, useAdvanced = 'n')
    {
        for (let i = 0; i < text.length; i++)
        {
            let alphabet;
            let letter = text[i].toLowerCase();

            if (useAdvanced.toLowerCase() === 'y')
            {
                // Use advanced l33t speak alphabet
                alphabet = (this.alphabetBasic[letter]) ? this.alphabetBasic[letter] : this.alphabetAdvanced[letter];
            }
            else
            {
                // Use basic l33t speak alphabet
                alphabet = this.alphabetBasic[letter];
            }

            if (alphabet)
            {
                text = text.replace(text[i], alphabet);
            }
        }

        return text;
    }
}

class LeetTextFile extends Phaser.Loader.FileTypes.TextFile {

    constructor (loader, key, url, xhrSettings)
    {
       super(loader, key, url, xhrSettings);
    }

    onProcess ()
    {
        //  Leetify it
        this.leet = new LeetSpeak();

        this.data = this.leet.convert(this.xhrLoader.responseText);

        this.onProcessComplete();
    }

}

class LeetSpeakPlugin extends Phaser.Plugins.BasePlugin {

    constructor (pluginManager)
    {
        super(pluginManager);

        this.leet = new LeetSpeak();

        //  Register our new Loader File Type
        pluginManager.registerFileType('leet', this.leetTextFileCallback);
    }

    convert (text)
    {
        return this.leet.convert(text);
    }

    leetTextFileCallback (key, url, xhrSettings)
    {
        if (Array.isArray(key))
        {
            for (var i = 0; i < key.length; i++)
            {
                //  If it's an array it has to be an array of Objects, so we get everything out of the 'key' object
                this.addFile(new LeetTextFile(this, key[i]));
            }
        }
        else
        {
            this.addFile(new LeetTextFile(this, key, url, xhrSettings));
        }

        return this;
    }

}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    plugins: {
        global: [
            { key: 'LeetSpeakPlugin', plugin: LeetSpeakPlugin, start: true }
        ]
    },
    scene: {
        preload: preload,
        create: create
    }
};

let game = new Phaser.Game(config);

function preload ()
{
    this.load.leet('story', 'assets/text/hibernation.txt');
}

function create ()
{
    // let leet = this.plugins.get('LeetSpeakPlugin');
    // let txt = leet.convert("Hello World! Let's hack the gibson!");

    let txt = this.cache.text.get('story');

    this.add.text(4, 4, txt, { font: '16px Courier', fill: '#00ff00' });
}
