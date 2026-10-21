# tactus.anth.us edge (Accept: text/markdown)

`tactus.yaml` is the CloudFormation stack `papyrus-edge-tactus-site` (account 712236451410, papyrus-production, us-east-1). Since 2026-10-21 `tactus.anth.us` is served by its CloudFront distribution (`duynaf832slz8.cloudfront.net`, alias attached with `AttachAlias=true`, ACM certificate in the stack). A viewer-request function sends `Accept: text/markdown` to the page's `.md` twin; the Amplify managed edge cannot do that itself.

## How updates reach it

The origin is the Amplify app `Tactus-web` (account 335163751677, app `dfkbdffs2viq8`), branch `main`, at `main.dfkbdffs2viq8.amplifyapp.com`. Pushing to `main` still builds and deploys in Amplify as before; the distribution reads that branch URL. The cache policy honours the origin's `Cache-Control` (`s-maxage=0`), so every request revalidates and a deploy shows at once. Nothing is published to a second place.

## What changed in Amplify and DNS

- The `tactus.anth.us` domain association (domain `anth.us`, sub-domain `tactus` on branch `main`) was removed from the Amplify app; the app and branch are untouched. CloudFront accepts the alias only after that. Prior association, for rollback:
  `{"domainName":"anth.us","enableAutoSubDomain":false,"subDomainSettings":[{"prefix":"tactus","branchName":"main"}]}`
  (`aws amplify create-domain-association --app-id dfkbdffs2viq8 --domain-name anth.us --sub-domain-settings prefix=tactus,branchName=main`, then point the CNAME back at the CloudFront name Amplify reports).
- The `tactus` CNAME in the `anth.us` zone (papyrus-production, `Z04979341DPRV5BDQNZMG`) now points at `duynaf832slz8.cloudfront.net` (was `d2q55h8xfhd5q6.cloudfront.net`).

Creating a stack with the alias in one step fails with a 409 while DNS or another distribution still holds the name: create with `AttachAlias=false`, move DNS, then update with `true`.
