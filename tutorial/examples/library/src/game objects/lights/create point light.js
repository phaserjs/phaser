class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    create ()
    {
        this.add.text(10, 10, 'Wheel: Hue\nA + D: Radius\nW + S: Attenuation\nClick to set Light').setDepth(1);

        let colorIndex = 0;
        const spectrum = Phaser.Display.Color.ColorSpectrum(128);

        let radius = 128;
        let intensity = 1;
        let attenuation = 0.1;

        let light = this.add.pointlight(400, 300, 0, radius, intensity);

        let color = spectrum[colorIndex];

        light.color.setTo(color.r, color.g, color.b);

        colorIndex++;

        this.input.on('pointerdown', pointer => {

            light = this.add.pointlight(pointer.x, pointer.y, 0, radius, intensity);

            light.attenuation = attenuation;
            light.color.setTo(color.r, color.g, color.b);

        });

        this.input.on('pointermove', pointer => {

            light.x = pointer.x;
            light.y = pointer.y;

        });

        this.input.on('wheel', (pointer, over, deltaX, deltaY, deltaZ) => {

            if (deltaY < 0)
            {
                colorIndex--;
            }
            else if (deltaY > 0)
            {
                colorIndex++;
            }

            if (colorIndex === spectrum.length)
            {
                colorIndex = 0;
            }
            else if (colorIndex < 0)
            {
                colorIndex = spectrum.length - 1;
            }

            color = spectrum[colorIndex];

            light.color.setTo(color.r, color.g, color.b);

        });

        this.input.keyboard.on('keydown-A', () => {

            light.radius--;
            radius--;

        });

        this.input.keyboard.on('keydown-D', () => {

            light.radius++;
            radius++;

        });

        this.input.keyboard.on('keydown-W', () => {

            light.attenuation += 0.01;
            attenuation += 0.01;

        });

        this.input.keyboard.on('keydown-S', () => {

            light.attenuation -= 0.01;
            attenuation -= 0.01;

        });
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    parent: 'phaser-example',
    scene: Example
};

const game = new Phaser.Game(config);
