import * as cdk from '@aws-cdk/core';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as s3 from '@aws-cdk/aws-s3';

export class NucleusDeploymentStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, `NucleusDeploymentArtifacts-${cdk.Stack.of(this).region}`, {
      versioned: true
    });

    // The code that defines your stack goes here
    new codebuild.Project(this, 'NucleusDeployment', {
      environment: {
        buildImage: codebuild.LinuxBuildImage.STANDARD_2_0,
      },
      source: codebuild.Source.gitHub({
        owner: "mutual-of-enumclaw",
        repo: "nucleus-status",
        webhook: true,
        webhookFilters: [
          codebuild.FilterGroup
          .inEventOf(codebuild.EventAction.PUSH)
          .andBranchIs('codebuild-deploy')
        ]
      }),
      buildSpec: codebuild.BuildSpec.fromObject({
        version: '0.2',
        phases: {
          build: {
            commands: [
              'npm ci',
              'npm run build',
              'npm run deploy'
            ],
          },
        },
      }),
      artifacts: codebuild.Artifacts.s3({
        bucket,
        includeBuildId: true,
        packageZip: true,
        path: 'nucleus/status/snd'
      }),
    });
  }
}
