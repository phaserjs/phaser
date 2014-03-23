#How to contribute

It's important to us that you feel you can contribute towards the evolution of Phaser. This can take many forms: from helping to fix bugs or improve the docs, to adding in new features to the source. This guide should help you in making that process as smooth as possible.


##Reporting issues

[GitHub Issues][0] is the place to report bugs you may have found in either the core library or any of the examples that are part of the repository. When submitting a bug please do the following:

1. **Search for existing issues.** Your bug may have already been fixed or addressed in a development branch version of Phaser, so be sure to search the issues first before putting in a duplicate issue.

2. **Not sure if it's a bug?.** Then please ask on the forum. If something is blatantly wrong then post it to github. But if you feel it might just be because you're not sure of expected behaviour, then it might save us time, and get you a response faster, if you post it to the Phaser forum instead.

3. **Create an isolated and reproducible test case.** If you are reporting a bug, make sure you also have a minimal, runnable, code example that reproduces the problem you have.

4. **Include a live example.** After narrowing your code down to only the problem areas, make use of [jsFiddle][1], [jsBin][2], or a link to your live site so that we can view a live example of the problem.

5. **Share as much information as possible.** Include browser version affected, your OS, version of the library, steps to reproduce, etc. "X isn't working!!!1!" will probably just be closed.


##Pixi and Phaser

It's important to understand that internally Phaser uses [Pixi.js](https://github.com/GoodBoyDigital/pixi.js/) for all rendering. It's possible you may find a bug that is generated on the Pixi level rather than Phaser. You're welcome to still report the issue of course, but if you get a reply saying we think it might be a Pixi issue this is what we're talking about :)


##Support Forum

We have a very active [Phaser Support Forum](http://www.html5gamedevs.com/forum/14-phaser/). If you need general support, or are struggling to understand how to do something or need your code checked over, then we would urge you to post it to our forum. There are a lot of friendly devs in there who can help, as well as the core Phaser and Pixi teams, so it's a great place to get support from. You're welcome to report bugs directly on GitHub, but for general support we'd always recommend using the forum first.


##Dev vs. Master

The dev branch of Phaser is our 'current working' version. It is always ahead of the master branch in terms of features and fixes. However it's also bleeding-edge and experimental and we cannot and do not guarantee it will compile or work for you. Very often we have to break things for a few days while we rebuild and patch. So by all means please export the dev branch and contribute towards it, indeed that is where all Pull Requests should be sent, but do so understanding the API may change beneath you.


##Making Changes

To take advantage of our grunt build script and jshint config it will be easiest for you if you have node.js and grunt installed locally.

You can download node.js from [nodejs.org][3]. After it has been installed open a console and run `npm i -g grunt -cli` to install the global `grunt` executable.

After that you can clone the repository and run `npm i` inside the cloned folder. This will install dependencies necessary for building the project. Once that is ready,
make your changes and submit a Pull Request:

- **Send Pull Requests to the `dev` branch.** All Pull Requests must be sent to the `dev` branch, `master` is the latest release and PRs to that branch will be closed.

- **Ensure changes are jshint validated.** Our JSHint configuration file is provided in the repository and you should check against it before submitting.

- **Never commit new builds.** When making a code change you should always run `grunt` which will rebuild the project so you can test, *however* please do not commit these new builds or your PR will be closed. Builds by default are placed in the `dist` folder, to keep them separate from the `build` folder releases.

- **Only commit relevant changes.** Don't include changes that are not directly relevant to the fix you are making. The more focused a PR is, the faster it will get attention and be merged. Extra files changing only whitespace or trash files will likely get your PR closed.


##I don't really like git / node.js, but I can fix this bug

That is fine too. While Pull Requests are the best thing in the world for us, they are not the only way to help. You're welcome to post fixes to our forum or even just email them to us. All we ask is that you still adhere to the guidelines presented here re: JSHint, etc.


##Code Style Guide

- Use 4 spaces for tabs, never tab characters.

- No trailing whitespace, blank lines should have no whitespace.

- Always favor strict equals `===` unless you *need* to use type coercion.

- Follow conventions already in the code, and listen to jshint. Our config is set-up for a reason.

Thanks to Chad for creating the original Pixi.js Contributing file which we adapted for Phaser.

[0]: https://github.com/photonstorm/phaser/issues
[1]: http://jsfiddle.net
[2]: http://jsbin.com/
[3]: http://nodejs.org
