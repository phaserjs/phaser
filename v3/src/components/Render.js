var Render = {

    render: function (camera)
    {
        this.renderer.begin();
        this.renderer.setTexture(this.texture);
        this.renderer.render(this, camera);
        this.renderer.end();
    }

};

module.exports = Render;
