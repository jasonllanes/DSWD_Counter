# Git Branch Management Commands

## Renaming Feature Branch to Main

When you want to make your feature branch (`christian/test`) the new main branch:

```bash
# 1. First, backup the old main branch
git branch -m main main-backup
git push origin main-backup

# 2. Rename your feature branch to main
git branch -m christian/test main

# 3. Force push the new main (using --force-with-lease for safety)
git push --force-with-lease origin main
```

## Cleaning Up Remote References

```bash

# Simple prune command to clean up remote references
# This will remove any remote-tracking branches that no longer exist on the remote
git remote prune origin

# OR fetch and prune in one command (recommended)
# This will fetch updates from the remote and prune any deleted branches
# Prune means to remove references to branches that no longer exist on the remote
git fetch --prune origin
# OR use the shorthand for fetch with prune
git fetch -p origin

```

## Usage Example

```bash
# Delete feature branch locally and remotely
git branch -d feature/old-feature
git push origin --delete feature/old-feature
```

## What these commands do:

- `git branch -m <old-name> <new-name>`: Renames a branch locally
- `git push origin <branch>` : Pushes the renamed branch to the remote repository.
- `git push --force-with-lease`: Safely force pushes the branch, ensuring you don't overwrite changes made by others.
- `git remote prune origin`: Cleans up local references to branches that have been deleted on the remote.
- `git fetch --prune origin`: Fetches updates from the remote and prunes deleted branches in one step.

## Best Practices

1. Always use `--force-with-lease` instead of `--force` to avoid overwriting others' changes.
2. Create a backup of the old main branch before renaming or backup of important branches before making significant changes.
3. Regularly prune your remote references to keep your local repository clean and up-to-date.
4. Communicate with your team before making significant changes to the main branch to avoid conflicts.

## Common Issues and Solutions

1. If you get "branch already exists":

```bash

git branch -D main # Deletes the local main branch first
git branch -m christian/test main # Then rename

```

2. If you need to check remote branches:

```bash
git branch -a  # List all branches (local and remote)
```

3. To verify your changes:

```bash

git branch # Check local branches
git remote show origin # Check remote branches and their status
```

## Deleting Local and Remote Branches

To delete unused branches both locally and on remote:

```bash
# 1. Delete local branch (safe delete - will warn if branch has unmerged changes)
git branch -d branch-name

# 2. Delete local branch (force delete - will delete regardless of merge status)
git branch -D branch-name

# 3. Delete remote branch
git push origin --delete branch-name

# 4. Verify deletion and clean up
git fetch --prune     # Clean up remote branch references
git branch -a         # List all branches to verify deletion
```
