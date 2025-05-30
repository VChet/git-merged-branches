import process from "node:process";
import { getConfig, getDefaultTargetBranch, getMergedBranches, isDetachedHead, isGitRepo } from "./repo.js";
import { outputMergedBranches } from "./output.js";
import { logError } from "./helpers.js";

function main(): void {
  if (!isGitRepo()) {
    console.error("Not a git repository.");
    process.exit(1);
  }
  if (isDetachedHead()) {
    console.error("HEAD is detached (e.g., after checkout of a commit). Please switch to a branch.");
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
    logError("Error executing 'git-merged-branches' command", error);
    process.exit(1);
  }
}

main();
