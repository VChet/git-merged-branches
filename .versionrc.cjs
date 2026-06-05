module.exports = {
  tagPrefix: "",
  scripts: {
    prerelease: "npm run lint:all && npm test && npm run build"
  },
  writerOpts: {
    finalizeContext(context) {
      if (!context.commitGroups?.length) {
        context.commitGroups = [{ commits: [{ header: "No significant changes" }] }];
      }
      return context;
    }
  }
};
