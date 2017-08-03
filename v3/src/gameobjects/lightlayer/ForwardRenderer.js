var ForwardRenderer = function (renderer, lightLayer, interpolationPercentage, camera)
{
    if (this.renderMask !== this.renderFlags)
    {
        return;
    }

    var spriteList = lightLayer.sprites;
    var length = spriteList.length;
    var batch = renderer.spriteBatch;

    batch.bind(lightLayer.passShader);
    batch.indexBufferObject.bind();
    lightLayer.updateLights();

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
