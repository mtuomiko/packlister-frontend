# Packlister frontend

Frontend repository for a hobby project aiming to replicate [LighterPack](https://lighterpack.com/). Backend repository
is at [packlister-backend](https://github.com/mtuomiko/packlister-backend).

### NPM commands

* `build` create production build to `build/` with webpack
* `start` run development mode (with `webpack-dev-server`)
* `lint` run `eslint`
* `analyze` create source map visualization to `sourcemap.html` (see [source-map-explorer](https://github.com/danvk/source-map-explorer))

### Environment variables

You can create a `.env` file (see `.env.example`) to set these in development.

* `DEV_PORT` Configure webpack devserver port. Defaults to `3003`.
* `API_BASE_URL` API URL, defaults to `http://localhost:8080/api` in dev and to a relative path `/api` for production. 

### Development

Example for running production build locally: `npx serve -s build -p 3003`
