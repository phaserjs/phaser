/*
*   Validate module exclusions.
*/

'use strict';


module.exports = function (grunt) {

    function validateExcludes (excludes) {
        return {
            //  Fail a validation if conditions are not met.
            fail: function (filter, reporter) {
                var result = filter(excludes);

                if (result.length > 0)
                {
                    reporter(result);

                    grunt.fail.fatal('Aborting due to invalid parameter input.');
                }

                return this;
            },

            //  If a module's dependencies are missing, select that to be
            //  removed from the build.
            push: function (filter, reporter) {
                var result = filter(excludes);

                if (result.length > 0)
                {
                    reporter(result);
                }

                excludes = excludes.concat(result);

                return this;
            },

            //  Report the excluded modules.
            result (reporter) {
                if (excludes.length > 0)
                {
                    reporter(excludes);
                }

                return excludes;
            }
        };
    }

    return validateExcludes;

};
