import { describe, it, expect, vi, beforeEach } from "vitest";
import { formatTaskBranches, outputMergedBranches } from "../output";
import { GitMergedConfig } from "../repo";

const DEFAULT_CONFIG: GitMergedConfig = {
  issueUrlFormat: "https://test-instance.org",
  issueUrlPrefix: "TOKEN"
};

describe("formatTaskBranches", () => {
  it("should format branches with issue URL correctly", () => {
    const branches = ["feat/TOKEN-800_new-feature", "fix/TOKEN-123_some-fix"];
    const result = formatTaskBranches(branches, DEFAULT_CONFIG);
    expect(result).toEqual([
      'feat/TOKEN-800_new-feature <https://test-instance.org/TOKEN-800>',
      'fix/TOKEN-123_some-fix <https://test-instance.org/TOKEN-123>'
    ]);
  });

  it("should not format branches without issue prefix", () => {
    const branches = ["fix/hotfix", "feature/no-issue"];
    const result = formatTaskBranches(branches, DEFAULT_CONFIG);
    expect(result).toEqual(branches);  // No change, since no matching prefix
  });

  it("should return branches as is if URL format is invalid", () => {
    const branches = ["feat/TOKEN-800_new-feature"];
    const config: GitMergedConfig = { ...DEFAULT_CONFIG, issueUrlFormat: "invalid-url" };
    const result = formatTaskBranches(branches, config);
    expect(result).toEqual(branches);  // Invalid URL, no changes
  });

  it("should return branches as is if issue prefix is invalid", () => {
    const branches = ["feat/TOKEN-800_new-feature"];
    const config: GitMergedConfig = { ...DEFAULT_CONFIG, issueUrlPrefix: "invalid!prefix" };
    const result = formatTaskBranches(branches, config);
    expect(result).toEqual(branches);  // Invalid prefix, no changes
  });
});

describe("outputMergedBranches", () => {
  let infoSpy: ReturnType<typeof vi.spyOn>;
  let warnSpy: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    infoSpy = vi.spyOn(console, "info").mockImplementation(() => {});
    warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  it("should warn when issueUrlFormat is not a valid URL", () => {
    const branches = ["feat/TOKEN-100"];
    const config = { ...DEFAULT_CONFIG, issueUrlFormat: "invalid-url" };

    outputMergedBranches(branches, "master", config);
    expect(warnSpy).toHaveBeenCalledWith("'invalid-url' is not a valid URL. Skipped formatting.");
  });

  it("should warn when issueUrlPrefix is not valid", () => {
    const branches = ["feat/TOKEN-100"];
    const config = { ...DEFAULT_CONFIG, issueUrlPrefix: "invalid!prefix" };

    outputMergedBranches(branches, "master", config);
    expect(warnSpy).toHaveBeenCalledWith("'invalid!prefix' is not a valid issue prefix. Skipped formatting.");
  });

  it("should log the correct branches when there are merged branches", () => {
    const branches = ["feat/TOKEN-800_new-feature", "fix/TOKEN-123_some-fix"];

    outputMergedBranches(branches, "master", DEFAULT_CONFIG);
    expect(infoSpy).toHaveBeenNthCalledWith(1, "Branches merged into 'master':");
    expect(infoSpy).toHaveBeenNthCalledWith(2, "feat/TOKEN-800_new-feature <https://test-instance.org/TOKEN-800>\nfix/TOKEN-123_some-fix <https://test-instance.org/TOKEN-123>")
  });

  it("should log a message when no branches are merged", () => {
    outputMergedBranches([], "master", DEFAULT_CONFIG);

    expect(infoSpy).toHaveBeenCalledWith("No branches merged into 'master'.");
  });
});
