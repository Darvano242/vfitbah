# Build-script boundaries

Build scripts may validate files, add one idempotent static asset tag, or migrate data policies. They must not replace React component bodies, route by clicking rendered elements, or rewrite large application sections using string offsets.

Allowed:
- `verify-stability.js`
- `apply-stability-runtime.js`
- narrowly scoped package/application policy migrations with explicit failure handling

Disallowed in production build:
- `apply-vfp-programs.js`
- `apply-direct-programs-link.js`
- DOM scanners that repeatedly mutate React navigation or content
