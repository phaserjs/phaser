var ForwardRenderer = function (renderer, lightLayer, interpolationPercentage, camera)
{
    var spriteList = lightLayer.sprites;
    var length = spriteList.length;
    var batch = renderer.spriteBatch;

    if (this.renderMask !== this.renderFlags || length === 0)
    {
        return;
    }

    if (renderer.currentRenderer !== null)
    {
        renderer.currentRenderer.flush();
    }

    batch.bind(lightLayer.passShader);
    batch.indexBufferObject.bind();
    lightLayer.updateLights(renderer, camera);

    for (var index = 0; index < length; ++index)
    {
        var spriteNormalPair = spriteList[index];
        renderer.setTexture(
            spriteNormalPair.
            normalTextureRef.
            source[spriteNormalPair.spriteRef.frame.sourceIndex].
            glTexture,
            1
        );
        batch.addSprite(spriteNormalPair.spriteRef, camera);
    }

    batch.flush(lightLayer.passShader, lightLayer.renderTarget);

};

module.exports = ForwardRenderer;
