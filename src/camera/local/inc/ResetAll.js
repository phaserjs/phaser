var ResetAll = function ()
{
    while (this.cameras.length > 0)
    {
        this.cameraPool.push(this.cameras.pop());
    }

    this.main = this.add();

    return this.main;
};

module.exports = ResetAll;
