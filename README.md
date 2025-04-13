# git-merged-branches CLI

`git-merged-branches` is a simple command-line utility that allows you to view all branches that have been merged into a selected base branch, such as master.

## Installation

To install `git-merged-branches` globally, use the following command:

```bash
npm install --global git-merged-branches
```

## Usage

After installation, you can use the `git-merged-branches` command in your terminal. By default, it will show a list of branches that have been merged into the base branch (e.g., master or main).

The utility checks for the default base branch (**master** or **main**), and if neither exists, it will notify you.

When you run the `git-merged-branches` command, it will show a list of branches that have been merged into the base branch:

```bash
$ git-merged-branches
Branches merged into 'master':
feature/add-new-feature
bugfix/fix-crash-on-start
hotfix/urgent-fix
```

Also, you may use `gmb` as an alias for `git-merged-branches`.

## Configuration

You can configure the behavior of the `git-merged-branches` command by adding a `git-merged-branches` object to your `package.json`.
The configuration allows you to specify:

- **issueUrlFormat**: The base URL for your issue tracker. Must be a valid URL. If it's not, the utility will warn you.
- **issueUrlPrefix**: The prefix used to identify issues in branch names. Must consist of letters. If it's not, the utility will warn you.

Here is an example of how to add the configuration:

```json
"git-merged-branches": {
  "issueUrlFormat": "https://your-jira-instance.net",
  "issueUrlPrefix": "TOKEN-"
}
```

With this configuration, `git-merged-branches` will detect branches with the prefix **TOKEN** and generate links to the issue tracker:

```bash
$ git-merged-branches
Branches merged into 'master':
TOKEN-800_new-feature <https://your-jira-instance.net/TOKEN-800>
fix/TOKEN-123_some-fix <https://your-jira-instance.net/TOKEN-123>
fix/EXTERNAL-391
hotfix
```

If the configuration is invalid, `git-merged-branches` will display warnings and skip formatting the issue URLs.

## Development

- Clone the repository:

  ```bash
  git clone https://github.com/VChet/git-merged-branches.git
  cd git-merged-branches
  ```

- Install dependencies:

  ```bash
  npm install
  ```

- Build:

  ```bash
  npm run build
  ```

- Link it locally for testing:

  ```bash
  npm link
  ```

Now you can run `git-merged-branches` on your local machine.
