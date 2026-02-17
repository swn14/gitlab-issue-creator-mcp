# GitLab Issue Creator (MCP Server)

An MCP server that creates GitLab issues, compatible with self-hosted instances (default: <https://gitlab.com>).

## Tools

- `create_gitlab_issue`
  - Required: `title` (and `projectId` unless `GITLAB_PROJECT_ID` is set)
  - Optional: `description`, `labels`, `assigneeIds`, `milestoneId`, `dueDate`, `confidential`
  - Optional overrides: `gitlabUrl` (token must come from env)

## Configuration

### Environment Variables

| Variable            | Required | Default              | Description                                                                                                                                                                                                                              |
| ------------------- | -------- | -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GITLAB_TOKEN`      | **Yes**  | —                    | GitLab Personal Access Token (PAT) or Project Access Token with permission to create issues.                                                                                                                                             |
| `GITLAB_URL`        | No       | `https://gitlab.com` | Base URL of your GitLab instance (e.g. `https://gitlab.company.com`).                                                                                                                                                                    |
| `GITLAB_PROJECT_ID` | No       | —                    | Numeric project ID or path (e.g. `group/project`). When set, all issues are created in this project and the `projectId` tool parameter becomes optional. If a caller passes a different `projectId`, the server will reject the request. |

> **Tip:** When `GITLAB_PROJECT_ID` is set, the tool only requires a `title` to create an issue — no need to specify the project each time.

See [.env.example](.env.example) for a template.

## Install (from npm)

Prerequisites:

- Node.js >= 18

Install into an existing project:

```sh
npm install gitlab-issue-creator-mcp -D
```

## VS Code MCP setup (npm install)

VS Code MCP servers are typically configured in `.vscode/mcp.json`. If you installed this package into a project, point VS Code at the installed `dist/index.js` and use `envFile` to load secrets from a local `.env` file:

```json
{
  "servers": {
    "gitlab-issue-creator-mcp": {
      "type": "stdio",
      "command": "node",
      "args": ["./node_modules/gitlab-issue-creator-mcp/dist/index.js"],
      "envFile": "${workspaceFolder}/.env"
    }
  }
}
```

Notes:

- Some clients require an absolute path for `args[0]`. In that case, replace the relative `./node_modules/...` path with an absolute path on your machine.
- `GITLAB_TOKEN` is required; `GITLAB_URL` defaults to `https://gitlab.com`. Set `GITLAB_PROJECT_ID` to lock all issues to a single project.
- Keep `.env` out of source control (this repo’s `.gitignore` already ignores it). Start from the template: `cp .env.example .env`.

## Develop (from source)

Recommended flow for teammates:

1. Clone this repo
2. Install + build: `npm install && npm run build`
3. Open the repo folder in VS Code
4. Start the MCP server (Chat tool picker or `MCP: List Servers`)

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
