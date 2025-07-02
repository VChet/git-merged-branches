import { pluralize } from "./helpers.js";
import { fetchRemoteBranches, GitMergedConfig } from "./repo.js";
import { isValidURL } from "./validate.js";

function formatSingleBranch(
  branch: string,
  issueUrlFormat: NonNullable<GitMergedConfig["issueUrlFormat"]>,
  issueUrlPrefix: NonNullable<GitMergedConfig["issueUrlPrefix"]>
): string {
  for (const prefix of issueUrlPrefix) {
    const prefixRegex = new RegExp(`\\b${prefix}(\\d+)`, "i");
    const match = branch.match(prefixRegex);

    if (!match) { continue; }

    const [_fullToken, id] = match;
    const url = issueUrlFormat.replace("{{prefix}}", prefix).replace("{{id}}", id);
    return `${branch} <${url}>`;
  }
  return branch;
}

export function formatTaskBranches(branches: string[], { issueUrlFormat, issueUrlPrefix }: GitMergedConfig): string[] {
  if (!issueUrlFormat || !issueUrlPrefix) { return branches; }
  // issueUrlFormat
  if (!isValidURL(issueUrlFormat)) {
    console.warn(`'${issueUrlFormat}' is not a valid URL. Skipped formatting.`);
    return branches;
  }
  // issueUrlPrefix
  if (!Array.isArray(issueUrlPrefix)) {
    console.warn(`'${issueUrlPrefix}' is not an array. Skipped formatting.`);
    return branches;
  }
  return branches.map((branch) => formatSingleBranch(branch, issueUrlFormat, issueUrlPrefix));
}

export function outputMergedBranches(branches: string[], targetBranch: string, config: GitMergedConfig): void {
  if (!branches.length) {
    return console.info(`No branches merged into '${targetBranch}'.`);
  }

  console.info(`${pluralize(branches.length, ["branch", "branches"])} merged into '${targetBranch}':`)
  console.info(formatTaskBranches(branches, config).join("\n"));

  const remoteBranches = fetchRemoteBranches("origin");
  const remoteMerged = branches.filter(branch => remoteBranches.includes(branch));

  console.info("\nRun the following to delete branches:");
  console.info(`locally:\n  git branch --delete ${branches.join(" ")}`);
  if (remoteMerged.length) { console.info(`remotely:\n  git push origin --delete ${remoteMerged.join(" ")}`); }
}
