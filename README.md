# GitLab Issue Creator (MCP Server)

An MCP server that creates GitLab issues, compatible with self-hosted instances (default: <https://gitlab.com>).

## Tools

- `create_gitlab_issue`
  - Required: `title`, `projectId`
  - Optional: `description`, `labels`, `assigneeIds`, `milestoneId`, `dueDate`, `confidential`
  - Optional overrides: `gitlabUrl`, `gitlabToken` (prefer env vars)

## Configuration

Set env vars (recommended):

- `GITLAB_URL` (defaults to `https://gitlab.com`)
- `GITLAB_TOKEN` (required)

See [.env.example](.env.example).

## Install (from npm)

Prerequisites:

- Node.js >= 18

Install into an existing project:

```sh
npm install gitlab-issue-creator-mcp
```

## MCP client setup (npm install)

Most MCP clients expect a stdio server. If you installed this package into a project, point your MCP client at the installed `dist/index.js`:

```json
{
  "mcpServers": {
    "gitlab-issue-creator": {
      "command": "node",
      "args": ["./node_modules/gitlab-issue-creator-mcp/dist/index.js"],
      "env": {
        "GITLAB_URL": "https://gitlab.com",
        "GITLAB_TOKEN": "<your_token>"
      }
    }
  }
}
```

Notes:

- Some clients require an absolute path for `args[0]`. In that case, replace the relative `./node_modules/...` path with an absolute path on your machine.
- `GITLAB_TOKEN` is required; `GITLAB_URL` defaults to `https://gitlab.com`.

## Develop (from source)

Recommended flow for teammates:

1. Clone this repo
2. Install + build: `npm install && npm run build`
3. Open the repo folder in VS Code
4. Start the MCP server (Chat tool picker or `MCP: List Servers`)

VS Code will prompt for:

- GitLab base URL (defaults to `https://gitlab.com`)
- GitLab access token (stored securely by VS Code)

## Develop / Build

- Install: `npm install`
- Build: `npm run build`
- Run: `GITLAB_TOKEN=... npm start`

If you want to run the server from a local clone (instead of installing from npm), build it and point your MCP client at `dist/index.js`.

## Notes

- Prefer a Project Access Token or a PAT scoped as narrowly as possible.
- This server prints no secrets, but your MCP client should keep tokens out of logs.

## License

MIT. See [LICENSE](LICENSE).
