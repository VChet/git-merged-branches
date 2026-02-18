import { bold, cyan, green, pluralize, underline, yellow } from "./helpers.js";
import { deleteBranches, fetchRemoteBranches } from "./repo.js";
import { isValidURL } from "./validate.js";
import type { GitMergedConfig, GitMergedOptions } from "./types.js";

function formatSingleBranch(
  branch: string,
  issueUrlFormat: NonNullable<GitMergedConfig["issueUrlFormat"]>,
  issueUrlPrefix: NonNullable<GitMergedConfig["issueUrlPrefix"]>
): string {
  for (const prefix of issueUrlPrefix) {
    const prefixRegex = prefix.match(/^\w/) ?
      new RegExp(`\\b${prefix}(\\d+)`, "i") :
      new RegExp(`${prefix}(\\d+)`, "i");
    const match = branch.match(prefixRegex);
    if (!match) continue;

    const url = issueUrlFormat.replace("{{prefix}}", prefix).replace("{{id}}", match[1]);
    return `${branch} ${underline(url)}`;
  }
  return branch;
}

export function formatTaskBranches(branches: string[], { issueUrlFormat, issueUrlPrefix }: GitMergedConfig): string[] {
  if (!issueUrlFormat || !issueUrlPrefix) { return branches; }
  // issueUrlFormat
  if (!isValidURL(issueUrlFormat)) {
    console.warn(`${yellow(issueUrlFormat)} is not a valid URL. Skipped formatting`);
    return branches;
  }
  // issueUrlPrefix
  if (!Array.isArray(issueUrlPrefix)) {
    console.warn(`${yellow(issueUrlPrefix)} is not an array. Skipped formatting`);
    return branches;
  }
  return branches.map((branch) => formatSingleBranch(branch, issueUrlFormat, issueUrlPrefix));
}

export function outputMergedBranches(
  branches: string[],
  targetBranch: string,
  config: GitMergedConfig,
  options: GitMergedOptions = {}
): void {
  if (!branches.length) { return console.info(`No branches merged into ${bold(targetBranch)}`); }

  const pluralized = pluralize(branches.length, ["branch", "branches"]);

  console.info(`${yellow(pluralized)} merged into ${bold(targetBranch)}:`);
  console.info(formatTaskBranches(branches, config).join("\n"));

  const remoteBranches = fetchRemoteBranches("origin");
  const remoteMerged = branches.filter((branch) => remoteBranches.includes(branch));
  if (options.deleteBranches) {
    deleteBranches(branches, remoteMerged);
    console.info(green("Branches deleted successfully"));
    return;
  }

  console.info(`\nUse ${cyan("--delete")} to delete ${yellow(pluralized)} automatically`);
  console.info("\nDelete locally:");
  console.info(cyan(`  git branch --delete ${branches.join(" ")}`));
  if (remoteMerged.length) {
    console.info("\nDelete remotely:");
    console.info(cyan(`  git push origin --delete ${remoteMerged.join(" ")}`));
  }
}
