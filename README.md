# dpi

Test static site implementation. Currently uses:

- [Metalsmith](https://github.com/segmentio/metalsmith) for the static site generation

- [Gulp](http://gulpjs.com) for building, running, watching and deploying

- [Aglio](https://github.com/danielgtaylor/aglio) for conversion of [API Blueprint](https://apiblueprint.org) markdown to html

## Installation

**Note about Node versions:** Currently some dependencies do not work with the latest version (0.12.2) of Node (notably aglio).
They will most likely be updated soon, but until then the last version of Node that seems to work is 0.10.38.

To install, simply:

`npm install`

## Workflow

Although [Gulp](http://gulpjs.com) is included as a dependency, you'll need to have a global install to run commands.

So if you don't, run:

`npm install gulp -g`

### Commands

#### `gulp` (default)

Build the site, start watching source files for changes and start a server with live reload:

(Just a wrapper for `gulp build`, `gulp connect` and `gulp watch`)

To run, type:

`gulp`

Then visit <http://localhost:8080> to see the site. Any changes made to source files will rebuild and reload the page.

**Note about watch/live-reload:** Changes to the node scripts will require a manual restart as well as adding new source.

If you do not want live-reload, use the `--no-reload` flag:

`gulp --no-reload`

The site will still be re-built on changes and the server started, the browser just won't refresh.

To exit, type control-c

#### `gulp build`

Generate the static site.

To run, type:

`gulp build`

The site will now be generated in the `/builds` directory

#### `gulp connect`

Start a local server on port 8080 with the root at the `/builds` directory

To run, type:

`gulp connect`

Then visit <http://localhost:8080> to see the site.

To exit, type control-c

#### `gulp watch`

Watch the source files and call `gulp build` on changes. Also live reloads if a server is running via `gulp connect`

To run, type:

`gulp watch`

**Note about watch/live-reload:** Changes to the node scripts will require a manual restart as well as adding new source.

To exit, type control-c

The paths to watched files is defined in `gulpfile.js` as the `sourcePaths` variable.

#### `gulp deploy`

Deploy the `/builds` directory to GitHub pages by committing/pushing it's contents to the gh-pages branch of this repo

To run, type:

`gulp deploy`

Then visit http://[USERNAME].github.io/[REPO] to see the site.