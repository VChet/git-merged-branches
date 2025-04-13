import process from "node:process";
import { getConfig, getDefaultTargetBranch, getMergedBranches, isGitRepo } from "./repo.js";
import { outputMergedBranches } from "./output.js";

function main(): void {
  if (!isGitRepo()) {
    console.error("Not a git repository.");
    process.exit(1);
  }
  const targetBranch = getDefaultTargetBranch();
  if (!targetBranch) {
    console.error("No 'master' or 'main' branch found.");
    process.exit(1);
  }
  try {
    const mergedBranches = getMergedBranches(targetBranch);
    outputMergedBranches(mergedBranches, targetBranch, getConfig());
  } catch (error) {
    console.error("Error executing 'git-merged-branches' command`:", error);
    process.exit(1);
  }
}

main();
