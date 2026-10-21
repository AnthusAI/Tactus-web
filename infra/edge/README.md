# tactus.anth.us edge (Accept: text/markdown)

`tactus.yaml` is the CloudFormation stack `papyrus-edge-tactus-site` (account 712236451410, papyrus-production, us-east-1): a CloudFront distribution in front of the Amplify app `Tactus-web` (account 335163751677, app `dfkbdffs2viq8`, branch `main`) whose viewer-request function sends `Accept: text/markdown` to the page's `.md` twin. The Amplify managed edge cannot do that itself. The cache policy honours the origin's `Cache-Control` (`s-maxage=0`), so a deploy shows at once.

State on 2026-10-21: the stack is created **without** its alias, and DNS still points at the Amplify distribution. It answers on its `*.cloudfront.net` name (checked: `Accept: text/markdown` returns `text/markdown` for `/` and `/getting-started/`, normal requests return HTML). CloudFront refused the alias because `tactus.anth.us` is still attached to the Amplify-managed distribution, which lives in account 335163751677.

To finish (needs a session for account 335163751677):

1. In the Amplify console or API for app `dfkbdffs2viq8`, remove the `tactus.anth.us` domain association (do not delete the app).
2. Point the `tactus.anth.us` CNAME in the `anth.us` zone (papyrus-production, `Z04979341DPRV5BDQNZMG`) at the stack's `DistributionDomainName`.
3. Update the stack with `AttachAlias=true` (change set, read first), then check `curl -H 'Accept: text/markdown' https://tactus.anth.us/`.

Order matters: CloudFront accepts the alias only once DNS no longer points at the other distribution and the Amplify association is gone. Skip step 1 and the update fails with a 409 (it did; the stack rolled back cleanly).
