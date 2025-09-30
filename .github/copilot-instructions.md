# Copilot Instructions for Nucleus Deployment Pipeline

## Architecture Overview

This repository contains the **Nucleus Deployment Pipeline** - a comprehensive DevSecOps workflow system for Mutual of Enumclaw's insurance platform. The Nucleus system is a distributed microservices architecture managing policy transactions across multiple environments.

### Key Components
- **Reusable GitHub Workflows**: Production-ready CI/CD pipeline templates in `.github/workflows/`
- **CDK Infrastructure**: AWS infrastructure as code in `nucleus-deployment/`
- **Custom Build Tooling**: TypeScript build utilities in `ts-builder/`
- **Architecture Documentation**: C4 model diagrams using PlantUML in `docs/`

## Critical Development Workflows

### Build & Deploy Process
The main workflow `nucleus-build-and-deploy-sam-stack.yml` follows this pattern:
1. **Setup**: Caches dependencies with JFrog Artifactory authentication via `.npmrc`
2. **Security**: SonarCloud scanning with `npm run test:coverage`
3. **Build**: Custom build via `npm run build-package -- --environments ${{ vars.ENVIRONMENTS }}`
4. **Deploy**: Matrix deployment using `samtsc --deploy-only --config-env ${{ matrix.stage }}`
5. **Documentation**: Auto-embeds PlantUML diagrams and syncs README to Confluence

### Environment Configuration
- Uses GitHub environment matrices: `${{ fromJson(vars.ENVIRONMENTS_MATRIX) }}`
- Stage-specific AWS credentials via `vars.AWS_ACCESS_KEY_ID_SECRET_NAME`
- JFrog authentication via `secrets.JFROG_AUTH_TOKEN`

## Project-Specific Conventions

### Package Management
- **Private Registry**: Uses JFrog Artifactory at `moetech.jfrog.io/artifactory/api/npm/nucleus-npm/`
- **Authentication**: `.npmrc` generated dynamically in workflows with `JFROG_AUTH_TOKEN`
- **Dependencies**: Core package `@moe-tech/policysystem` provides logging via `ConsoleLogger`

### Build System
- **Custom Builder**: `ts-builder/build.js` uses esbuild for bundling with external dependencies
- **TypeScript**: Generates declaration files via `npm-dts`
- **Distribution**: Copies `package.json` and runs `npm ci --omit=dev` in `dist/`

### Logging Standards
**NEVER use `console.log`** - Always use `ConsoleLogger` from `@moe-tech/policysystem`:
```typescript
const { ConsoleLogger, LogType } = require('@moe-tech/policysystem');
const logger = new ConsoleLogger();
logger.log('Message', LogType.INFO); // or LogType.ERROR, LogType.DEBUG
```

### AWS Integration
- **SAM Deployment**: Uses `samtsc` CLI tool for CloudFormation deployments
- **Multi-Region**: Primary region `us-west-2`
- **CDK**: Infrastructure uses CDK v1 (`@aws-cdk/core@1.129.0`)

## Integration Points

### External Dependencies
- **JFrog Artifactory**: Private npm registry and artifact storage
- **SonarCloud**: Code quality and security scanning
- **Confluence**: Documentation synchronization via `confluence-markdown-sync`
- **AWS Services**: CodeBuild, S3, DynamoDB, Lambda (via SAM)

### Cross-Component Communication
- **Release Management**: Uses `mutual-of-enumclaw/action-manage-release@v1`
- **PlantUML Integration**: Auto-generates diagrams with `alessandro-marcantoni/puml-markdown@v0.1.1`
- **Web Deployment**: S3 sync for static assets when `vars.WEB_DEPLOYMENT_BUCKET_NAME_PARAM` is set

## Key Files & Patterns

### Workflow Inputs
- `node-build-version`: Node.js version (default: '20')
- `prebuild-command`: Optional pre-build step
- `build-aws-access-key-id-name`: Build-time AWS credentials

### Environment Variables
- `ENVIRONMENTS`: JSON array of deployment stages
- `ENVIRONMENTS_MATRIX`: Matrix strategy for parallel deployments
- `POST_DEPLOY_COMMAND`: Optional post-deployment commands
- `CONFLUENCE_PAGE_ID`: Target for documentation sync

### Security Model
- **Least Privilege**: Job-specific permissions (`contents: read` vs `contents: write`)
- **Secret Management**: All sensitive data in GitHub Secrets
- **Environment Protection**: Matrix deployments with environment-specific approval rules

## System Context
The Nucleus platform orchestrates insurance policy transactions between:
- **Upstream**: MoeQuote Personal (quotes), Internal users (transactions)
- **Downstream**: Billing systems, Document generation (Exela), State DOT systems
- **Integrations**: RSX (rating), LexisNexis (scoring), MelissaData (validation)

Reference the PlantUML diagrams in `docs/` for complete system architecture understanding.