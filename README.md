# user-search-test-exercise
## Test Setup & Execution
1. run `npm install` to load the node module dependencies
2. Execute tests with `npm run test:system` cmd with the required cmd line arguments
  - `domain` specifies the Auth0 domain endpoint where these execute
    - Note: you must specify your full domain with region & origin e.g. `--domain dev-4fwk1wij.us.auth0.com`
  - `token` specifies the Auth0 API token used for API access

## Exection Example
`npm run test:system -- --domain {YOUR_DOMAIN} --token {YOUR_API_TOKEN}`
