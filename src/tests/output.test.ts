import { describe, it, expect, vi, beforeEach } from "vitest";
import { formatTaskBranches, outputMergedBranches } from "../output";
import { GitMergedConfig } from "../repo";

const DEFAULT_CONFIG: GitMergedConfig = {
  issueUrlFormat: "https://test-instance.org/browse/{{prefix}}{{id}}",
  issueUrlPrefix: ["TOKEN-"]
};

describe("formatTaskBranches", () => {
  it("should format branches with issue URL correctly", () => {
    const branches = ["feat/TOKEN-800_new-feature", "fix/TOKEN-123_some-fix"];
    const result = formatTaskBranches(branches, DEFAULT_CONFIG);
    expect(result).toEqual([
      'feat/TOKEN-800_new-feature <https://test-instance.org/browse/TOKEN-800>',
      'fix/TOKEN-123_some-fix <https://test-instance.org/browse/TOKEN-123>'
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

  it("should log the correct branches when there are merged branches", () => {
    const branches = ["feat/TOKEN-800_new-feature", "fix/TOKEN-123_some-fix"];

    outputMergedBranches(branches, "master", DEFAULT_CONFIG);
    expect(infoSpy).toHaveBeenNthCalledWith(1, "Branches merged into 'master':");
    const branchOutput = [
      "feat/TOKEN-800_new-feature <https://test-instance.org/browse/TOKEN-800>",
      "fix/TOKEN-123_some-fix <https://test-instance.org/browse/TOKEN-123>"
    ]
    expect(infoSpy).toHaveBeenNthCalledWith(2, branchOutput.join("\n"));

    const localDelete = `git branch --delete ${branches.join(" ")}`;
    const remoteDelete = `git push origin --delete ${branches.join(" ")}`;
    expect(infoSpy).toHaveBeenNthCalledWith(3, "\nRun the following to delete branches locally and remotely:");
    expect(infoSpy).toHaveBeenNthCalledWith(4, `${localDelete} && ${remoteDelete}`);
  });

  it("should log a message when no branches are merged", () => {
    outputMergedBranches([], "master", DEFAULT_CONFIG);
    expect(infoSpy).toHaveBeenCalledWith("No branches merged into 'master'.");
  });

  it("should warn when issueUrlFormat is not a valid URL", () => {
    const branches = ["feat/TOKEN-100"];
    const config = { ...DEFAULT_CONFIG, issueUrlFormat: "invalid-url" };

    outputMergedBranches(branches, "master", config);
    expect(warnSpy).toHaveBeenCalledWith("'invalid-url' is not a valid URL. Skipped formatting.");
  });
});
