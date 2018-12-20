var v = require('vivid-cli');
                                          
v.log('{bgYellow}{black} __________.__                                 ________   ');
v.log('{bgYellow}{black} \\______   \\  |__ _____    ______ ___________  \\_____  \\  ');
v.log('{bgYellow}{black}  |     ___/  |  \\\\__  \\  /  ___// __ \\_  __ \\   _(__  <  ');
v.log('{bgYellow}{black}  |    |   |   Y  \\/ __ \\_\\___ \\\\  ___/|  | \\/  /       \\ ');
v.log('{bgYellow}{black}  |____|   |___|  (____  /____  >\\___  >__|    /______  / ');
v.log('{bgYellow}{black}                \\/     \\/     \\/     \\/               \\/  ');
v.log('{bgYellow}{black}  Available commands:                                     ');

v.log('{white}* npm run {green}build {cyan}  Build dev version of Phaser with Webpack');
v.log('{white}* npm run {green}watch {cyan}     Build dev & put Webpack in watch mode');
v.log('{white}* npm run {green}dist {cyan}              Build dist versions of Phaser');
v.log('{white}* npm run {green}lint {cyan}                 ESLint check Phaser source');
v.log('{white}* npm run {green}lintfix {cyan}      ESLint check and fix Phaser source');
v.log('{white}* npm run {green}sloc {cyan}      Get source code & comments line count');
v.log('{white}* npm run {green}bundleshaders {cyan}   Convert vert/frag shaders to js');
v.log('{white}* npm run {green}plugin.cam3d {cyan}              Build Camera3D Plugin');
v.log('{white}Facebook Instant Games:');
v.log('{white}* npm run {green}buildfb {cyan}        Build dev Phaser FB with Webpack');
v.log('{white}* npm run {green}watchfb {cyan}      Build FB dev in Webpack watch mode');
v.log('{white}* npm run {green}distfb {cyan}         Build dist versions of Phaser FB');
v.log('{white}* npm run {green}distfull {cyan}     Build dist versions of Phaser + FB');

v.log('{bgYellow}{black}  https://phaser.io               https://labs.phaser.io  ');
