module.exports = {
  tagPrefix: "",
  scripts: {
    prerelease: "node --run lint:all && node --run test && node --run build"
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
