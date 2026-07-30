# Emergency rollback record

Production was restored to the last confirmed working app commit because the stability refactor prevented the React application from mounting and left the static fallback shell visible.

The refactor remains preserved in Git history and should be reintroduced only through a preview branch with browser-level smoke tests.
