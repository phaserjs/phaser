var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#0072bc',
    parent: 'phaser-example',
    scene: {
        create: create
    }
};

var totalTests = 0;
var testsPassed = 0;
var assert = (message, condition) => {
    totalTests++;
    if (condition) testsPassed++;
    console.assert(condition, message);
};

var game = new Phaser.Game(config);

function create ()
{
    var text = this.make.text({
        x: 400,
        y: 300,
        text: '  The   sky above the port was the color of television, tuned to a dead channel.',
        origin: 0.5,
        style: {
            font: 'bold 30px Arial',
            fill: 'white'
        }
    });

    // --- DEFAULTS ---
    assert('Word wrap width should be null', text.style.wordWrapWidth === null);
    assert('Advanced word wrap should be false', text.style.wordWrapUseAdvanced === false);
    assert('Word wrap callback should be null', text.style.wordWrapCallback === null);
    assert('Word wrap callback scope should be null', text.style.wordWrapCallbackScope === null);
    assert('Wrapped text should be one line', text.getWrappedText().length === 1);

    // --- BASIC WIDTH WRAPPING ---
    text.setWordWrapWidth(200, false);
    var lines = text.getWrappedText();
    assert('Wrapped text should be multiple lines', lines.length > 1);
    assert('First line should not be trimmed', lines[0].startsWith(' '));
    assert('First line not have whitespace collapsed', lines[0].includes('The   sky'));
    text.setWordWrapWidth(null);

    // --- DISABLING WRAPPING AFTER ENABLING IT ---
    text.setWordWrapWidth(200, false);
    text.setWordWrapWidth(null);
    assert('Wrapped text should be one line', text.getWrappedText().length === 1);

    // --- ADVANCED WIDTH WRAPPING ---
    text.setWordWrapWidth(200, true);
    var lines = text.getWrappedText();
    assert('Wrapped text should be multiple lines', lines.length > 1);
    assert('First line should be trimmed', !lines[0].startsWith(' '));
    assert('First line have whitespace collapsed', lines[0].includes('The sky'));
    text.setWordWrapWidth(null);

    // --- WRAPPING CALLBACK, RETURNING ARRAY ---
    text.setWordWrapCallback(function (string, textObject) {
        assert('Second argument should be the text gameobject', text === textObject);
        assert('Scope should match the given scope object', this.testObject === true);
        return [ '1', '2' ];
    }, { testObject: true });
    var lines = text.getWrappedText();
    assert('Wrapped text should be exactly two lines', lines.length === 2);
    assert('Wrapped text should be ["1", "2"]', lines[0] === '1' && lines[1] === '2');
    text.setWordWrapCallback(null);

    // --- WRAPPING CALLBACK, RETURNING STRING ---
    text.setWordWrapCallback(() => '1\n2');
    var lines = text.getWrappedText();
    assert('Wrapped text should be exactly two lines', lines.length === 2);
    assert('Wrapped text should be ["1", "2"]', lines[0] === '1' && lines[1] === '2');
    text.setWordWrapCallback(null);

    // --- DISABLING WRAPPING CALLBACK AFTER ENABLING IT ---
    text.setWordWrapCallback(text => text, { testObject: true });
    text.setWordWrapCallback(null);
    var lines = text.getWrappedText();
    assert('Wrapped text should be one line', lines.length === 1);

    console.log(`${testsPassed} / ${totalTests} tests passed`);
}
