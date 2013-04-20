module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
 
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        typescript: {
            base: {
                src: ['Phaser/**/*.ts'],
                dest: 'build/phaser.js',
                options: {
                    target: 'ES5'
                }
            }
        },
	copy: {
	    main: {
	    files: [
		{src: 'build/phaser.js', dest: 'Tests/phaser.js'}
	    ]}
	},
        watch: {
            files: '**/*.ts',
            tasks: ['typescript', 'copy']
        }
    });
 
    grunt.registerTask('default', ['watch']);
 
}
