# Markr - marking as a micro-service

## Preamble

This is a small micro-service with two endpoints:

* POST /import - accepts XML string blobs for ingestion
* GET /results/:testId/aggregate - return some simple stats for the given testId

## Design

The high level units are `e2e` (integration tests), `src` (the source code - duh!), and `unit-tests` (can you guess what lives here?).

Peeking in to `src` there are 3 folders:

* controllers: the actual code
* models: database models - this prototype uses sqlite
* routeHandlers: these are the handlers that map routes to code

The `routeHandlers` folder is arguably the most detailed in that the handlers are broken down by verb (GET, POST) and then route (results, ingest - import is a reserved work in JS). Within each of these files there are the respepective methods for that route and these are assembled into an object that can be used to wire them in to the main application configuration in `index.js`.

For an example look in `index.js` at the method `wireUpRoutes`.

## Development dependencies

* NodeJS >=8: https://nodejs.org/
* YARN: https://yarnpkg.com/en/
* Get started: `yarn install`

This code was developed and tested on Debian Stable (Stretch - 9.3).

### Running the development environment

To run this service just use:

```
> yarn start
```

If you want to develop in this code base then you likely want to run either

```
> yarn unit-tests
```

OR

```
yarn e2e-tests
```

depending on whether you are developing unit or integration tests respectively.

## Next Steps

* testing hierarchy needs a cleanup and rethink. Does it really need to be two types of test with different run commands?
* Move unit specs alongside the code.
* Rethink the gulp setup.
* Rethink the database setup code so we can pass in connection information for a real database at runtime.

## Assumptions

* Given the directive that an old machine is submitting the marked data I've assumed that it probably can't handle waiting around for transactional imports. Therefore, as soon as data is POST'ed data an import is kicked off and the API responds with a 200 immediately. Since the brief says be smart about overrides there shouldn't be an issue with the old machine submitting the same data many, many, many times.
