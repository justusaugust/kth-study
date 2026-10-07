# Issue tracker: GitHub

Repository: `justusaugust/kth-study`. Issues and specs live in GitHub Issues.
Use `--repo justusaugust/kth-study` for every `gh issue` operation.

Read: `gh issue view <number> --repo justusaugust/kth-study --comments`.
List: `gh issue list --repo justusaugust/kth-study --state open --json number,title,body,labels`.
For authorized creation or comments, use `--body-file` for multiline text.
"Publish to the issue tracker" means create an issue after confirming task authorization.

**PRs as a request surface: no.**
Tracker configuration and readiness labels do not authorize external actions or deployment.
