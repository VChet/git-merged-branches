import process from "node:process";
import { bold, logError, red } from "./helpers.js";
import { outputMergedBranches } from "./output.js";
import { getConfig, getDefaultTargetBranch, getMergedBranches, isDetachedHead, isGitRepo } from "./repo.js";

function main(): void {
  if (!isGitRepo()) {
    console.error(red("Not a git repository"));
    process.exit(1);
  }
  if (isDetachedHead()) {
    console.error(red(`${bold("HEAD")} is detached (e.g., after checkout of a commit). Please switch to a branch`));
    process.exit(1);
  }

  const targetBranch = getDefaultTargetBranch();
  if (!targetBranch) {
    console.error(red(`No ${bold("master")} or ${bold("main")} branch found`));
    process.exit(1);
  }
  try {
    const mergedBranches = getMergedBranches(targetBranch);
    const deleteBranches = process.argv.includes("--delete");
    outputMergedBranches(mergedBranches, targetBranch, getConfig(), { deleteBranches });
  } catch (error) {
    logError("Error executing 'git-merged-branches' command", error);
    process.exit(1);
  }
}

main();
