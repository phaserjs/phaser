# DocStrap #

DocStrap is [Bootstrap](http://twitter.github.io/bootstrap/index.html) based template for [JSDoc3](http://usejsdoc.org/).
In addition, it includes all of the themes from [Bootswatch](http://bootswatch.com/) giving you a great deal of look
and feel options for your documentation. Additionally, it adds some options to the conf.json file that gives
you even more flexibility to tweak the template to your needs. It will also make your teeth whiter.

## Features ##
* Fixed navigation at page top
* Right side TOC for navigation in pages
* Themed
* Customizable

### What It Looks Like ###
Here are examples of this template with the different Bootswatch themes:

+ [Amelia](http://terryweiss.github.io/docstrap/themes/amelia)
+ [Cerulean](http://terryweiss.github.io/docstrap/themes/cerulean)
+ [Cosmo](http://terryweiss.github.io/docstrap/themes/cosmo)
+ [Cyborg](http://terryweiss.github.io/docstrap/themes/cyborg)
+ [Flatly](http://terryweiss.github.io/docstrap/themes/flatly)
+ [Journal](http://terryweiss.github.io/docstrap/themes/journal)
+ [Readable](http://terryweiss.github.io/docstrap/themes/readable)
+ [Simplex](http://terryweiss.github.io/docstrap/themes/simplex)
+ [Slate](http://terryweiss.github.io/docstrap/themes/slate)
+ [Spacelab](http://terryweiss.github.io/docstrap/themes/spacelab)
+ [Spruce](http://terryweiss.github.io/docstrap/themes/spruce)
+ [Superhero](http://terryweiss.github.io/docstrap/themes/superhero)
+ [United](http://terryweiss.github.io/docstrap/themes/united)

To change your theme, just change it in the `conf.json` file. See below for details.
## Ooooh, I want it! How do I get it?##
First grab the [zip file from github.](https://github.com/terryweiss/docstrap/archive/master.zip) Unzip it
to your favorite hard drive and ask JSDoc to use it. Like so:

	<path/to/jsdoc>/jsoc mysourcefiles/* -t <path.to.unzipped>/template -c <path.to.unzipped>/conf.json -d <path.to.output>/

Also take a gander at [JSDoc's command line options](http://usejsdoc.org/about-commandline.html).

## Configuring the template ##

DocStrap ships with a `conf.json` file in the template/ directory. It is just a regular old
[JSDoc configuration file](http://usejsdoc.org/about-configuring-jsdoc.html), but with the following new options:
```
"templates": {
	"systemName"      : "{string}",
	"footer"          : "{string}",
	"copyright"       : "{string}",
	"navType"         : "{vertical|inline}",
	"theme"           : "{theme}",
	"linenums"        : {boolean},
	"collapseSymbols" : {boolean},
	"inverseNav"      : {boolean}
}
```
### Options ###

*   __systemName__
	The name of the system being documented. This will appear in the page title for each page
*   __footer__
	Any markup want to appear in the footer of each page. This is not processed at all, just printed exactly as you enter it
*   __copyright__
	You can add a copyright message below the _footer_ and above the JSDoc timestamp at the bottom of the page
*   __navType__
	The template uses top level navigation with dropdowns for the contents of each category. On large systems these dropdowns
	can get large enough to expand beyond the page. To make the dropdowns render wider and stack the entries vertically, set this
	option to `"inline"`. Otherwise set it to `"vertical"` to make them regular stacked dropdowns.
*   __theme__
	This is the name of the them you want to use **in all lowercase**. The valid options are
	+ `amelia`
	+ `cerulean`
	+ `cosmo`
	+ `cyborg`
	+ `flatly`
	+ `journal`
	+ `readable`
	+ `simplex`
	+ `slate`
	+ `spacelab`
	+ `spruce`
	+ `superhero`
	+ `united`
*   __linenums__
	When true, line numbers will appear in the source code listing. If you have
	[also turned that on](http://usejsdoc.org/about-configuring-jsdoc.html).
*   __collapseSymbols__
	If your pages have a large number of symbols, it can be easy to get lost in all the text. If you turn this to `true`
	all of the symbols in the page will roll their contents up so that you just get a list of symbols that can be expanded
	and collapsed.
*   __inverseNav__
	Bootstrap navbars come in two flavors, regular and inverse where inverse is generally higher contrast. Set this to `true` to
	use the inverse header.

## Customizing DocStrap ##
No template can meet every need and customizing templates is a favorite pastime of....well, no-one, but you may need to anyway.
First make sure you have [bower](https://github.com/bower/bower) and [grunt-cli](https://github.com/gruntjs/grunt-cli) installed.
Fetch the source using `git` or grab the [zip file from github.](https://github.com/terryweiss/docstrap/archive/master.zip) and unzip
it somewhere. Everything that follows happens in the unzip directory.

Next, prepare the environment:

    bower install

and

    grunt install

When that is done, you have all of the tools to start modifying the template. The template, like Bootstrap, used [less](http://lesscss.org/).
The way it works is that `./styles/main.less` pulls in the bootstrap files uncompiled so that you have access to all of bootstraps mixins, colors,
etc, that you would want. There are two more files in that directory, `variables.less`, `bootswatch.less`. These are the
theme files and you can modify them, but keep in mind that if you apply a new theme (see below) those files will be overwritten. It is best
to keep your changes to the `main.less` file.

To compile your changes to `main.less` and any other files it loads up,

	grunt less

The output is will be put in `./template/static/styles/site.<theme-name>.css`. The next time you create your documentation, it
will have the new css file included.

To apply a different template to the `styles` directory to modify, open up the `conf.json` in the template directory and
change the `theme` option to the theme you want. Then

	grunt apply

And the new theme will be in `variables.less`, `bootswatch.less`. Don't forget to compile your changes using `grunt apply` to
get that change into the template.

**NOTE** that these steps are not necessary to just change the theme, this is only to modify the theme. If all you want to do is
change the theme, just update conf.json with the new theme and build your docs!

## Contributing ##
Yes! Contribute! Test! Share your ideas! Report Bugs!

## Roadmap ##

* Integrate Darkstrap
* Make plain old bootstrap an option (doh!)
* ~~Jump to source line numbers~~
* Document publish.js


## History ##

### v0.2.0 ###

* Added jump to source linenumers - still a problem scrolling with fixed header
* changed syntax highlighter to [sunlight](http://sunlightjs.com/)
* Modify incoming bootswatch files to make font calls without protocol.

### v0.1.0 ###
Initial release


## Notices ##
If you like DocStrap, be sure and check out these excellent projects and support them!

[JSDoc3 is licensed under the Apache License](https://github.com/jsdoc3/jsdoc/blob/master/LICENSE.md)

[So is Bootstrap](https://github.com/twitter/bootstrap/blob/master/LICENSE)

[And Bootswatch](https://github.com/thomaspark/bootswatch/blob/gh-pages/LICENSE)

[TOC is licensed under MIT](https://github.com/jgallen23/toc/blob/master/LICENSE)

[Grunt is also MIT](https://github.com/gruntjs/grunt-cli/blob/master/LICENSE-MIT)

DocStrap [is licensed under the MIT license.](https://github.com/terryweiss/docstrap/blob/master/LICENSE.md)

[Sunlight uses the WTFPL](http://sunlightjs.com/)

## License ##
DocStrap Copyright (c) 2012-2013Terry Weiss. All rights reserved.

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.






