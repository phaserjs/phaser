var config = {
    type: Phaser.CANVAS,
    width: 800,
    height: 600,
    backgroundColor: '#0072bc',
    parent: 'phaser-example',
    scene: {
        create: create
    }
};

var game = new Phaser.Game(config);

function create ()
{
    // Basic text wrapping based on width.
    this.make.text({
        x: 400,
        y: 100,
        text: 'The sky above the port was the color of television, tuned to a dead channel.',
        origin: { x: 0.5, y: 0.5 },
        style: {
            font: 'bold 25px Arial',
            fill: 'white',
            wordWrap: { width: 300 }
        }
    });

    // Basic wrap will NOT touch the whitespace in your text.
    this.make.text({
        x: 400,
        y: 250,
        text: '        Basic wrapping:        look        at        all        this        weird         space        ',
        origin: { x: 0.5, y: 0.5 },
        style: {
            font: 'bold 25px Arial',
            fill: 'white',
            wordWrap: { width: 300 }
        }
    });

    // Advanced wrap will collapse neighboring spaces into a single space and trim whitespace from
    // the start and end of each line.
    this.make.text({
        x: 400,
        y: 375,
        text: '        Advanced wrapping:        space        collapses        and        is        trimmed        ',
        origin: { x: 0.5, y: 0.5 },
        style: {
            font: 'bold 25px Arial',
            fill: 'white',
            wordWrap: { width: 300, useAdvancedWrap: true }
        }
    });

    // The advanced word wrapping algorithm will also break words that are longer than the specified
    // wrap width
    this.make.text({
        x: 400,
        y: 500,
        text: 'Long word incoming: Supercalifragilisticexpialidocious!',
        origin: { x: 0.5, y: 0.5 },
        style: {
            font: 'bold 25px Arial',
            fill: 'white',
            wordWrap: { width: 300, useAdvancedWrap: true }
        }
    });
}
