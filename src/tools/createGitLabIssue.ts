import type { Tool } from "@modelcontextprotocol/sdk/types.js";

type CreateGitLabIssueArgs = {
  title: string;
  description?: string;
  labels?: string[];
  assigneeIds?: number[];
  milestoneId?: number;
  dueDate?: string; // YYYY-MM-DD
  confidential?: boolean;

  projectId: string;

  // Optional overrides; prefer env vars
  gitlabUrl?: string;
};

type GitLabIssueResponse = {
  id: number;
  iid: number;
  project_id: number;
  title: string;
  description: string | null;
  state: string;
  web_url: string;
};

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value || value.trim().length === 0) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function normalizeBaseUrl(url: string): string {
  return url.replace(/\/$/, "");
}

async function createGitLabIssue(params: CreateGitLabIssueArgs) {
  const baseUrl = normalizeBaseUrl(
    params.gitlabUrl ?? process.env.GITLAB_URL ?? "https://gitlab.com",
  );
  const token = requiredEnv("GITLAB_TOKEN");
  const projectId = params.projectId;

  const apiUrl = `${baseUrl}/api/v4/projects/${encodeURIComponent(projectId)}/issues`;

  const body = new URLSearchParams();
  body.set("title", params.title);
  if (params.description) body.set("description", params.description);
  if (params.labels?.length) body.set("labels", params.labels.join(","));
  if (params.assigneeIds?.length) {
    for (const id of params.assigneeIds)
      body.append("assignee_ids[]", String(id));
  }
  if (typeof params.milestoneId === "number")
    body.set("milestone_id", String(params.milestoneId));
  if (params.dueDate) body.set("due_date", params.dueDate);
  if (typeof params.confidential === "boolean")
    body.set("confidential", params.confidential ? "true" : "false");

  const res = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "PRIVATE-TOKEN": token,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(
      `GitLab API error (${res.status} ${res.statusText}) while creating issue: ${text}`,
    );
  }

  const data = JSON.parse(text) as GitLabIssueResponse;
  return {
    id: data.id,
    iid: data.iid,
    projectId: data.project_id,
    title: data.title,
    state: data.state,
    webUrl: data.web_url,
  };
}

export const createGitLabIssueTool: Tool = {
  name: "create_gitlab_issue",
  description:
    "Create a GitLab issue in a project on a self-hosted (or gitlab.com) instance.",
  inputSchema: {
    type: "object",
    additionalProperties: false,
    required: ["title", "projectId"],
    properties: {
      title: { type: "string", description: "Issue title" },
      projectId: {
        type: "string",
        description:
          "GitLab project numeric ID or project path (e.g. group/project)",
      },
      description: { type: "string", description: "Issue description/body" },
      labels: {
        type: "array",
        description: "List of labels to apply",
        items: { type: "string" },
      },
      assigneeIds: {
        type: "array",
        description: "Assignee user IDs",
        items: { type: "number" },
      },
      milestoneId: { type: "number", description: "Milestone ID" },
      dueDate: {
        type: "string",
        description: "Due date in YYYY-MM-DD format",
      },
      confidential: { type: "boolean", description: "Create as confidential" },
      gitlabUrl: {
        type: "string",
        description:
          "Optional override for GitLab base URL. Otherwise uses GITLAB_URL env var (defaults to https://gitlab.com).",
      },
    },
  },
};

function assertString(value: unknown, field: string): asserts value is string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${field} must be a non-empty string`);
  }
}

export async function handleCreateGitLabIssue(rawArgs: unknown) {
  const args = rawArgs as Partial<CreateGitLabIssueArgs>;
  assertString(args.title, "title");
  assertString(args.projectId, "projectId");

  const result = await createGitLabIssue({
    title: args.title,
    description: args.description,
    labels: args.labels,
    assigneeIds: args.assigneeIds,
    milestoneId: args.milestoneId,
    dueDate: args.dueDate,
    confidential: args.confidential,
    projectId: args.projectId,
    gitlabUrl: args.gitlabUrl,
  });

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(result, null, 2),
      },
    ],
  };
}
