import { GitMergedConfig } from "./repo.js";
import { isValidIssuePrefix, isValidURL } from "./validate.js";

export function formatTaskBranches(branches: string[], { issueUrlFormat, issueUrlPrefix }: GitMergedConfig): string[] {
  if (!issueUrlFormat || !issueUrlPrefix) { return branches; }
  // issueUrlFormat
  if (!isValidURL(issueUrlFormat)) {
    console.warn(`'${issueUrlFormat}' is not a valid URL. Skipped formatting.`);
    return branches;
  }
  // issueUrlPrefix
  if (!isValidIssuePrefix(issueUrlPrefix)) {
    console.warn(`'${issueUrlPrefix}' is not a valid issue prefix. Skipped formatting.`);
    return branches;
  }
  const prefixRegex = new RegExp(`\\b(${issueUrlPrefix}-\\d+)`, "i");

  return branches.map((branch) => {
    const match = branch.match(prefixRegex);
    if (match && issueUrlFormat) {
      const issueId = match[1].toUpperCase();
      return `${branch} <${issueUrlFormat}/${issueId}>`;
      }
    return branch;
  });
}

export function outputMergedBranches(branches: string[], targetBranch: string, config: GitMergedConfig): void {
  if (branches.length) {
    console.info(`Branches merged into '${targetBranch}':`)
    console.info(formatTaskBranches(branches, config).join("\n"));
  } else {
    console.info(`No branches merged into '${targetBranch}'.`);
  }
}
