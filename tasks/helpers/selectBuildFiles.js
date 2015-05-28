/*
*   Select the module files to be compiled.
*/

'use strict';


module.exports = function (modules) {

    //  The Phaser module names.
    var moduleNames = Object.keys(modules);


    function selectBuildFiles (excludes) {
        return moduleNames.reduce(function (filelist, name) {
            var m = modules[name];

            if (!m.optional || excludes.indexOf(name) < 0)
            {
                //  A module is required or is optional but was not excluded.
                filelist.push(m.files);
            }
            else if (excludes.indexOf(name) >= 0 && m.stubs)
            {
                //  A module is excluded but has a stub.
                filelist.push(m.stubs);
            }

            return filelist;
        }, []);
    }

    return selectBuildFiles;

};
