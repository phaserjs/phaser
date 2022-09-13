(function(){

    var root = this;

    class RandomNamePlugin extends Phaser.Plugins.BasePlugin {

        constructor (pluginManager)
        {
            super(pluginManager);

            this.syllables1 = [ 'fro', 'tir', 'nag', 'bli', 'mon', 'zip' ];
            this.syllables2 = [ 'fay', 'shi', 'zag', 'blarg', 'rash', 'izen' ];

            this.current = this.syllables1;
        }

        changeSet ()
        {
            this.current = this.syllables2;
        }

        getNames (qty = 10)
        {
            let names = [];

            for (let i = 0; i < qty; i++)
            {
                let name = '';

                for (let i = 0; i < Phaser.Math.Between(2, 4); i++)
                {
                    name = name.concat(Phaser.Utils.Array.GetRandom(this.current));
                }

                names.push(Phaser.Utils.String.UppercaseFirst(name));
            }

            return names;
        }

    }

    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = RandomNamePlugin;
        }
        exports.RandomNamePlugin = RandomNamePlugin;
    } else if (typeof define !== 'undefined' && define.amd) {
        define('RandomNamePlugin', (function() { return root.RandomNamePlugin = RandomNamePlugin; })() );
    } else {
        root.RandomNamePlugin = RandomNamePlugin;
    }

    return RandomNamePlugin;
}).call(this);
