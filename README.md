Repository for Mutual of Enumclaw resuable Workflows
This contains resusable workflows to be used within other GitHub actions workflows.
This repository must be public in order to use the resusable workflows in other repositories.

Example Usage:

name: Deploy SND, SND2, DEV

on:
  push:  
    branches:
      - dev

jobs:
  call-snd-deploy:
    uses: mutual-of-enumclaw/nucleus-deployment-pipeline/.github/workflows/nucleus-deploy-sam-stack.yml@main
    with:
      region: 'us-west-2'
      environment_name: 'snd'
    secrets:
      AWS_ACCESS_KEY_ID: ${{ secrets.SANDBOX_DEPLOY_USER_AWS_ACCESS_KEY_ID }}
      AWS_SECRET_ACCESS_KEY: ${{ secrets.SANDBOX_DEPLOY_USER_AWS_SECRET_ACCESS_KEY }}
      MS_TEAMS_WEBHOOK_URI:  ${{ secrets.MS_TEAMS_WEBHOOK_URI }}
