# Packlister frontend

And so on...

### NPM commands

* `build` create production build to `build/` with webpack
* `start` run development mode (with `webpack-dev-server`)
* `lint` run `eslint`
* `analyze` create source map visualization to `sourcemap.html` (see [source-map-explorer](https://github.com/danvk/source-map-explorer))

### Environment variables

You can create `.env` (see `.env.example`) to set these in development.

* `DEV_PORT` Configure webpack devserver port. Defaults to `3003`.
* `API_BASE_URL` API URL, defaults to `http://localhost:8080/api` in dev. This needs to be defined for a production build.

### Development
