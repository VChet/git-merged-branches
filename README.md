# git-merged-branches

[![npm version](https://img.shields.io/npm/v/git-merged-branches)](https://www.npmjs.com/package/git-merged-branches)
[![build](https://github.com/VChet/git-merged-branches/actions/workflows/build.yml/badge.svg)](https://github.com/VChet/git-merged-branches/actions/workflows/build.yml)

**git-merged-branches` is a command-line utility to view branches merged into a selected base branch (e.g., master or main).**

- CLI usage
- customizable via `package.json`

## Installation

Install globally to use `git-merged-branches` or the shorter version `gmb`:

```bash
npm install --global git-merged-branches
```

Or use it without installation via [npx](https://docs.npmjs.com/cli/v7/commands/npx):

```bash
npx git-merged-branches
```

## Usage

By default, the command shows merged branches into the base branch (**master** or **main**). If neither exists, it will notify you.

Example output:

```bash
$ git-merged-branches
Branches merged into 'master':
feature/add-new-feature
bugfix/fix-crash-on-start
hotfix/urgent-fix
```

## Configuration

You can configure the utility in your `package.json` under `git-merged-branches`. This allows you to set:

- **issueUrlFormat**: Base URL for your issue tracker (must be a valid URL).
- **issueUrlPrefix**: Prefix for issue identifiers in branch names (must be letters).

Example configuration:

```json
"git-merged-branches": {
  "issueUrlFormat": "https://your-jira-instance.net",
  "issueUrlPrefix": "TOKEN"
}
```

With this setup, `git-merged-branches` will generate links for branches with such tokens in their name:

```bash
$ git-merged-branches
Branches merged into 'master':
TOKEN-800_new-feature <https://your-jira-instance.net/TOKEN-800>
fix/TOKEN-123_some-fix <https://your-jira-instance.net/TOKEN-123>
fix/EXTERNAL-391
hotfix
```

If the configuration is invalid, warnings will be shown and the utility will skip formatting URLs.

## Development

To contribute or test locally:

1. Clone the repository:

    ```bash
    git clone https://github.com/VChet/git-merged-branches.git
    cd git-merged-branches
    ```

1. Install dependencies:

    ```bash
    npm install
    ```

1. Build the project:

    ```bash
    npm run build
    ```

1. Link it locally for testing:

    ```bash
    npm link
    ```

Now you can run `git-merged-branches` on your local machine.

## Contributing

If you have any ideas, bug reports, or feature requests, feel free to [contribute](https://github.com/VChet/git-merged-branches/pulls) or report [issues](https://github.com/VChet/git-merged-branches/issues).
