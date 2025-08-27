import { execSync } from "node:child_process";
import { cwd } from "node:process";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { logError } from "./helpers";
import type { GitMergedConfig } from "./types";

export function isGitRepo(): boolean {
  try {
    execSync("git rev-parse --is-inside-work-tree", { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

export function isDetachedHead(): boolean {
  try {
    const output = execSync("git symbolic-ref --quiet --short HEAD", { encoding: "utf-8" }).trim();
    return output === "";
  } catch {
    return true;
  }
}

function isBranchExists(branch: string): boolean {
  try {
    execSync(`git show-ref --verify --quiet refs/heads/${branch}`);
    return true;
  } catch {
    return false;
  }
}

export function getDefaultTargetBranch(): string | null {
  if (isBranchExists("main")) { return "main"; }
  else if (isBranchExists("master")) { return "master"; }
  else { return null; }
}

export function getMergedBranches(targetBranch: string): string[] {
  const baseCommit = execSync(`git rev-parse ${targetBranch}`, { encoding: "utf-8" }).trim();
  const output = execSync(`git branch --merged ${targetBranch}`, { encoding: "utf-8" });
  return output.split("\n").reduce((acc: string[], line) => {
    // Ignore empty lines
    const branch = line.replace("*", "").trim();
    if (!branch) { return acc; }
    // Ignore branches on the base commit
    const branchCommit = execSync(`git rev-parse ${branch}`, { encoding: "utf-8" }).trim();
    if (branchCommit === baseCommit) { return acc; }
    return [...acc, branch];
  }, []);
}

export function fetchRemoteBranches(remote = "origin"): string[] {
  try {
    const output = execSync(`git ls-remote --heads ${remote}`, { encoding: "utf-8" });
    return output
      .split("\n")
      .map(line => line.split("\t")[1])
      .filter(ref => ref?.startsWith("refs/heads/"))
      .map(ref => ref.replace("refs/heads/", ""));
  } catch (error) {
    logError(`Could not fetch remote branches from '${remote}'`, error);
    return [];
  }
}

export function getConfig(): GitMergedConfig {
  try {
    const pkgPath = join(cwd(), "package.json");
    const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
    return pkg["git-merged-branches"] || {};
  } catch (error) {
    logError("Could not read package.json", error);
    return {};
  }
}

function deleteLocalBranches(branches: string[]): void {
  execSync(`git branch --delete ${branches.join(" ")}`, { stdio: "inherit" });
}
function deleteRemoteBranches(branches: string[]): void {
  execSync(`git push origin --delete ${branches.join(" ")}`, { stdio: "inherit" });
}
export function deleteBranches(localBranches: string[], remoteBranches: string[]): void {
  try {
    console.info("\nDeleting branches locally…");
    deleteLocalBranches(localBranches);
    if (remoteBranches.length) {
      console.info("\nDeleting branches remotely…");
      deleteRemoteBranches(remoteBranches);
    }
  } catch (error) {
    logError("Failed to delete branches", error);
  }
}
