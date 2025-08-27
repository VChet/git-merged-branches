import { describe, it, expect, vi, beforeEach } from "vitest";
import { formatTaskBranches, outputMergedBranches } from "../output";
import * as repoMethods from "../repo";
import type { GitMergedConfig } from "../types";

const DEFAULT_CONFIG: GitMergedConfig = {
  issueUrlFormat: "https://test-instance.org/browse/{{prefix}}{{id}}",
  issueUrlPrefix: ["TOKEN-"]
};

describe("formatTaskBranches", () => {
  it("should format branches with issue URL correctly", () => {
    const branches = ["feat/TOKEN-800_new-feature", "fix/TOKEN-123_some-fix"];
    const result = formatTaskBranches(branches, DEFAULT_CONFIG);
    expect(result).toEqual([
      "feat/TOKEN-800_new-feature <https://test-instance.org/browse/TOKEN-800>",
      "fix/TOKEN-123_some-fix <https://test-instance.org/browse/TOKEN-123>"
    ]);
  });

  it("should support multiple issue prefixes", () => {
    const branches = ["fix/TOKEN-123_fix", "feat/PROJECT-45_add-feature"];
    const config: GitMergedConfig = {
      issueUrlFormat: "https://example.com/browse/{{prefix}}{{id}}",
      issueUrlPrefix: ["TOKEN-", "PROJECT-"]
    };
    const result = formatTaskBranches(branches, config);
    expect(result).toEqual([
      "fix/TOKEN-123_fix <https://example.com/browse/TOKEN-123>",
      "feat/PROJECT-45_add-feature <https://example.com/browse/PROJECT-45>"
    ]);
  });

  it("should not format branches if issueUrlFormat is not provided", () => {
    const branches = ["feat/TOKEN-100"];
    const config = { issueUrlFormat: DEFAULT_CONFIG.issueUrlFormat };
    const result = formatTaskBranches(branches, config);
    expect(result).toEqual(branches);
  });

  it("should not format branches if issueUrlPrefix is not provided", () => {
    const branches = ["feat/TOKEN-100"];
    const config = { issueUrlPrefix: DEFAULT_CONFIG.issueUrlPrefix };
    const result = formatTaskBranches(branches, config);
    expect(result).toEqual(branches);
  });

  it("should not format branches without valid issueUrlFormat", () => {
    const branches = ["feat/TOKEN-800_new-feature"];
    const config: GitMergedConfig = { ...DEFAULT_CONFIG, issueUrlFormat: "invalid-url" };
    const result = formatTaskBranches(branches, config);
    expect(result).toEqual(branches);  // Invalid URL, no changes
  });

  it("should not format branches without matching prefix", () => {
    const branches = ["fix/hotfix", "feature/no-issue"];
    const result = formatTaskBranches(branches, DEFAULT_CONFIG);
    expect(result).toEqual(branches);  // No matching prefix, no changes
  });

  it("should not format branches when prefix is part of another word", () => {
    const branches = ["fix/NOTTOKEN-100_bad-branch"];
    const result = formatTaskBranches(branches, DEFAULT_CONFIG);
    expect(result).toEqual(branches); // No matching prefix, prefix must be exact, no changes
  });
});

describe("outputMergedBranches", () => {
  let infoSpy: ReturnType<typeof vi.spyOn>;
  let warnSpy: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    infoSpy = vi.spyOn(console, "info").mockImplementation(() => {});
    warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  it("should log the correct branches when there are local merged branches", () => {
    const branches = ["feat/TOKEN-800_new-feature", "fix/TOKEN-123_some-fix"];

    outputMergedBranches(branches, "master", DEFAULT_CONFIG);
    expect(infoSpy).toHaveBeenNthCalledWith(1, "2 branches merged into 'master':");
    const branchOutput = [
      "feat/TOKEN-800_new-feature <https://test-instance.org/browse/TOKEN-800>",
      "fix/TOKEN-123_some-fix <https://test-instance.org/browse/TOKEN-123>"
    ];
    expect(infoSpy).toHaveBeenNthCalledWith(2, branchOutput.join("\n"));

    const localDelete = `git branch --delete ${branches.join(" ")}`;
    expect(infoSpy).toHaveBeenNthCalledWith(3, "\nUse --delete to delete 2 branches automatically.");
    expect(infoSpy).toHaveBeenNthCalledWith(4, "\nDelete locally:");
    expect(infoSpy).toHaveBeenNthCalledWith(5, `  ${localDelete}`);
    expect(infoSpy).toHaveBeenCalledTimes(5);
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it("should log the correct branches when there are remote merged branches", () => {
    const branches = ["feat/TOKEN-800_new-feature", "fix/TOKEN-123_some-fix"];
    const fetchRemoteMock = vi.spyOn(repoMethods, "fetchRemoteBranches").mockReturnValue(branches);

    outputMergedBranches(branches, "master", DEFAULT_CONFIG);
    expect(infoSpy).toHaveBeenNthCalledWith(1, "2 branches merged into 'master':");
    const branchOutput = [
      "feat/TOKEN-800_new-feature <https://test-instance.org/browse/TOKEN-800>",
      "fix/TOKEN-123_some-fix <https://test-instance.org/browse/TOKEN-123>"
    ];
    expect(infoSpy).toHaveBeenNthCalledWith(2, branchOutput.join("\n"));

    const localDelete = `git branch --delete ${branches.join(" ")}`;
    const remoteDelete = `git push origin --delete ${branches.join(" ")}`;
    expect(infoSpy).toHaveBeenNthCalledWith(3, "\nUse --delete to delete 2 branches automatically.");
    expect(infoSpy).toHaveBeenNthCalledWith(4, "\nDelete locally:");
    expect(infoSpy).toHaveBeenNthCalledWith(5, `  ${localDelete}`);
    expect(infoSpy).toHaveBeenNthCalledWith(6, "\nDelete remotely:");
    expect(infoSpy).toHaveBeenNthCalledWith(7, `  ${remoteDelete}`);
    expect(infoSpy).toHaveBeenCalledTimes(7);
    expect(warnSpy).not.toHaveBeenCalled();

    fetchRemoteMock.mockRestore();
  });

  it("should log the correct messages when there is single local merged branch", () => {
    const branches = ["feat/TOKEN-800_new-feature"];

    outputMergedBranches(branches, "master", DEFAULT_CONFIG);
    expect(infoSpy).toHaveBeenNthCalledWith(1, "1 branch merged into 'master':");
    expect(infoSpy).toHaveBeenNthCalledWith(2, "feat/TOKEN-800_new-feature <https://test-instance.org/browse/TOKEN-800>");

    const localDelete = `git branch --delete ${branches.join(" ")}`;
    expect(infoSpy).toHaveBeenNthCalledWith(3, "\nUse --delete to delete 1 branch automatically.");
    expect(infoSpy).toHaveBeenNthCalledWith(4, "\nDelete locally:");
    expect(infoSpy).toHaveBeenNthCalledWith(5, `  ${localDelete}`);
    expect(infoSpy).toHaveBeenCalledTimes(5);
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it("should log a message when no branches are merged", () => {
    outputMergedBranches([], "master", DEFAULT_CONFIG);
    expect(infoSpy).toHaveBeenCalledWith("No branches merged into 'master'.");
    expect(infoSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it("should warn when issueUrlFormat is not a valid URL", () => {
    const branches = ["feat/TOKEN-100"];
    const config = { ...DEFAULT_CONFIG, issueUrlFormat: "invalid-url" };

    outputMergedBranches(branches, "master", config);
    expect(infoSpy).toHaveBeenCalledTimes(5);
    expect(warnSpy).toHaveBeenCalledWith("'invalid-url' is not a valid URL. Skipped formatting.");
    expect(warnSpy).toHaveBeenCalledTimes(1);
  });

  it("should delete branches when --delete option is passed", () => {
    const deleteMock = vi.spyOn(repoMethods, "deleteBranches").mockImplementation(() => {});

    const branches = ["feat/TOKEN-800_new-feature", "fix/TOKEN-123_some-fix"];
    const fetchRemoteMock = vi.spyOn(repoMethods, "fetchRemoteBranches").mockReturnValue(branches);

    outputMergedBranches(branches, "master", DEFAULT_CONFIG, { deleteBranches: true });

    expect(deleteMock).toHaveBeenCalledWith(branches, branches);
    expect(infoSpy).toHaveBeenCalledWith("Branches deleted successfully.");

    deleteMock.mockRestore();
    fetchRemoteMock.mockRestore();
  });
});
