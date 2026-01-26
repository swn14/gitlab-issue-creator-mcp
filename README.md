# GitLab Issue Creator (MCP Server)

An MCP server that creates GitLab issues, compatible with self-hosted instances (default: <https://gitlab.org>).

## Tools

- `create_gitlab_issue`
  - Required: `title`, `projectId`
  - Optional: `description`, `labels`, `assigneeIds`, `milestoneId`, `dueDate`, `confidential`
  - Optional overrides: `gitlabUrl`, `gitlabToken` (prefer env vars)

## Configuration

Set env vars (recommended):

- `GITLAB_URL` (defaults to `https://gitlab.org`)
- `GITLAB_TOKEN` (required)

See [.env.example](.env.example).

## Team setup

Recommended flow for teammates:

1. Clone this repo
2. Install + build: `npm install && npm run build`
3. Open the repo folder in VS Code
4. Start the MCP server (Chat tool picker or `MCP: List Servers`)

VS Code will prompt for:

- GitLab base URL (defaults to `https://gitlab.org`)
- GitLab access token (stored securely by VS Code)

## Develop / Build

- Install: `npm install`
- Build: `npm run build`
- Run: `GITLAB_TOKEN=... npm start`

## MCP client config (example)

## VS Code MCP setup

This repo includes a workspace MCP configuration at [.vscode/mcp.json](.vscode/mcp.json).

1. Build the server: `npm install && npm run build`
2. In VS Code, run `MCP: List Servers` (or open the Chat view tool picker)
3. Start/trust the `gitlabIssueCreator` server when prompted

VS Code will prompt for the GitLab URL (defaulting to `https://gitlab.org`) and the token (stored securely via input variables).

Most MCP clients expect a stdio server:

```json
{
  "mcpServers": {
    "gitlab-issue-creator": {
      "command": "node",
      "args": ["/absolute/path/to/gitlab-issue-creator/dist/index.js"],
      "env": {
        "GITLAB_URL": "https://gitlab.org",
        "GITLAB_TOKEN": "<your_token>"
      }
    }
  }
}
```

## Notes

- Prefer a Project Access Token or a PAT scoped as narrowly as possible.
- This server prints no secrets, but your MCP client should keep tokens out of logs.
