var GetCurrentKey = function ()
{
    if (this.currentAnim)
    {
        return this.currentAnim.key;
    }
};

module.exports = GetCurrentKey;
