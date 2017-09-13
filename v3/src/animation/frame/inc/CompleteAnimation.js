var CompleteAnimation = function (component)
{
    if (this.hideOnComplete)
    {
        component.parent.visible = false;
    }

    component.stop(true);
};

module.exports = CompleteAnimation;
