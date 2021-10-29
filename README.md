##Description:
Repository for Mutual of Enumclaw resuable Workflows.
This contains resusable workflows to be used within other GitHub actions workflows in the .github\workflows folder.
This repository must be public in order to use the resusable workflows in other repositories.

##Example Usage of nucleus-deploy-sam-stack.yaml:
```
name: Deploy TST

on:
  push:  
    branches:
      - tst

jobs:
  call-tst-deploy:
    uses: mutual-of-enumclaw/nucleus-deployment-pipeline/.github/workflows/nucleus-deploy-sam-stack.yml@main
    with:
      region: 'us-west-2'
      environment_name: 'tst'
    secrets:
      AWS_ACCESS_KEY_ID: ${{ secrets.GENDEV_DEPLOY_USER_AWS_ACCESS_KEY_ID }}
      AWS_SECRET_ACCESS_KEY: ${{ secrets.GENDEV_DEPLOY_USER_AWS_SECRET_ACCESS_KEY }}
      MS_TEAMS_WEBHOOK_URI:  ${{ secrets.MS_TEAMS_NUCLEUS_DEPLOY_WEBHOOK_URI }}
```