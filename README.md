# brotli-playground

Test environment to test the behavior of Brotli in Safari over chunked responses.

## Install
Make sure to get the latest [Node.js](https://nodejs.org/en/) (tested with v12.9.1). Then clone this repo and install dependencies:
```sh
npm install
```

## Running
Run the server with Brotli enabled
```sh
npm start
```
or with Brotli disabled
```sh
npm run no-br
```
You will likely be prompted for password, this is necessary to setup SSL for localhost. Safari only accepts Brotli on HTTPS.
## Analyzing Results
- Visit https://localhost:3000 using Safari.
- With Brotli enabled, the browser dumps 5 lines at once. Opening the JS console confirms that all script tags executed roughly at the same time.
- With Brotli disabled, the broswer shows the HTML payload in chunks, since the server is configured to chunk 5 responses in 1 second intervals.
- Testing on Chrome with Brotli enabled confirms chunked responses are incrementally shown on screen.
