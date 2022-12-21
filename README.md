# Render.com deployment checker

This action allows you to wait for a render.com deployment to finish when using the 
[render blueprint](https://render.com/docs/blueprint-spec) files as there currently isn't any way to be notified (yet).

## Usage
### Pre-requisites
1. Get your render api key from https://render.com/docs/api
2. Add `RENDER_APIKEY` to your github's Settings -> Secrets -> Actions -> Repository secrets (https://github.com/<username>/<repository>/settings/secrets/actions)

### Use the action in your pipeline
```
- uses: neil-armstrong-instil/render-deployment-checker
  env:
    RENDER_APIKEY: ${{secrets.RENDER_APIKEY}}
  with:
    serviceId: <select your service on the dashboard and it will be in the url, e.g. "srv-d9ds9ewkdsmx">
    deploymentName: <used to make output nicer to understand, e.g. "Webapp">
```

## Scenarios
### Wanting to run some integration tests after a deployment is successful
```
name: Run on every commit

on: [ push ]

jobs:
  commitChecks:
    runs-on: ubuntu-latest
  acceptanceTests:
    needs: commitChecks
    if: github.ref == 'refs/heads/main'
    concurrency: "1"
    runs-on: ubuntu-latest

    steps:
      - name: Clone project
        uses: actions/checkout@v3

      - name: Setup project
        uses: ./.github/reusable-actions/setup-project

      - name: Wait for webapp deployment
        uses: neil-armstrong-instil/render-deployment-checker
        env:
          RENDER_APIKEY: ${{secrets.RENDER_APIKEY}}
        with:
          serviceId: "srv-mywebapp"
          deploymentName: "Webapp"
          
      - name: Wait for api deployment
        uses: neil-armstrong-instil/render-deployment-checker
        env:
          RENDER_APIKEY: ${{secrets.RENDER_APIKEY}}
        with:
          serviceId: "srv-myapi"
          deploymentName: "API"
          
      - name: Run integration tests
        uses: ./.github/reusable-actions/run-integration-tests
```