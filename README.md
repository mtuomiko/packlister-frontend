# Packlister frontend

This is the frontend repository for Packlister, a hobby project aiming to provide a similar service
as [LighterPack](https://lighterpack.com/). See 
also [backend repository](https://github.com/mtuomiko/packlister-backend)

Note! Application backend is deployed on a [render.com](https://render.com/) free plan which has very conservative 
resource limits and also suspends inactive services. Starting a new instance of the backend can take up to 
**5 minutes!** Most of non-logged in frontend functionality will still work until the backend instance is available.

Application is deployed at https://packlister.onrender.com with the backend deployed to 
`packlister-svc.onrender.com`.

### Used technologies

* Main library: React
* Language: TypeScript
* Tooling: Nothing, manual setup just for practice. For a real world project, something like CRA or Vite would probably 
make more sense.
* Build: Webpack with ts-loader
* State management: Redux
* Code quality / static analysis: ESLint
* Component library / styling: Chakra UI, using Emotion
* Visualization: Recharts

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

Example for running production build locally: `npx serve -s ./build -p 3003` (remember to build first)
