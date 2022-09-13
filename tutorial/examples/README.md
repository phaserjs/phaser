# Phaser 3 Examples

All of the code in this repo can be browsed at [http://labs.phaser.io](http://labs.phaser.io). The labs site is a mirror of this repo and changes made in the repo are synced to the site within minutes.

You can also clone this repo to have the code locally for testing, which can be really useful while developing with Phaser 3.

## Dev Version vs. Release Version

By default the examples site is configured to serve the latest dev version of Phaser 3. We are continuously working on it, which means new builds are pushed often several times per day. Use the drop-down menu below the example to run it against any previous release version. You should see the URL change to reflect the version within it.

### Requirements

If you want to run our scripts then you need [Node.js](https://nodejs.org)  installed.

To show the example browser run these commands in your terminal:

| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies and launch browser with examples.|
| `npm start` | Launch browser to show the examples. <br> Press `Ctrl + c` to kill **http-server** process. |
| `npm run update` | To build a new `examples.json` file if you add a new example. |

Alternatively, if you have your own local web server installed, you could configure it to serve the `/public` folder from the repo and you will get access to the examples interface.
