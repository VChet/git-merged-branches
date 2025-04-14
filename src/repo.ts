import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export function isGitRepo(): boolean {
  try {
    execSync("git rev-parse --is-inside-work-tree", { stdio: "ignore" });
    return true;
  } catch (error) {
    return false;
  }
}

export function isBranchExists(branch: string): boolean {
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
    const branch = line.replace('*', '').trim();
    if (!branch) { return acc; }
    // Ignore branches on the base commit
    const branchCommit = execSync(`git rev-parse ${branch}`, { encoding: "utf-8" }).trim();
    if (branchCommit === baseCommit) { return acc; }
    return [...acc, branch];
  }, []);
}

export interface GitMergedConfig {
  issueUrlFormat?: string;
  issueUrlPrefix?: string;
};

export function getConfig(): GitMergedConfig {
  try {
    const pkgPath = join(process.cwd(), "package.json");
    const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
    return pkg["git-merged-branches"] || {};
  } catch (error) {
    return {};
  }
}
