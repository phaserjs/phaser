class Example extends Phaser.Scene
{
    constructor ()
    {
        super();

        this.rope;
        this.count = 0;
    }

    preload ()
    {
        this.load.glsl('bundle', 'assets/rope/bundle6.glsl.js');
    }

    create ()
    {
        //  Create our Shader
        const shader = this.add.shader('RayTracer', 0, 0, 700, 500);

        //  Set it to render to a texture
        shader.setRenderToTexture('shaderTexture');

        //  Create our Rope, using the shader texture
        const rope = this.add.rope(400, 300, 'shaderTexture', null, 16);

        //  Some shaders require us to flipY, like this one:
        rope.setFlipY(true);

        this.rope = rope;

        this.add.text(10, 10, 'Rope using a Shader for a texture', { font: '16px Courier', fill: '#ffffff' }).setShadow(1, 1);
    }

    update ()
    {
        this.count += 0.1;

        let points = this.rope.points;

        for (let i = 0; i < points.length; i++)
        {
            if (this.rope.horizontal)
            {
                points[i].y = Math.sin(i * 0.5 + this.count) * 10;
            }
            else
            {
                points[i].x = Math.sin(i * 0.5 + this.count) * 10;
            }
        }

        this.rope.setDirty();
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-example',
    scene: Example
};

let game = new Phaser.Game(config);
