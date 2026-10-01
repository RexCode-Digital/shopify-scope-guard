# Security model

Scans are offline and read-only. Shopify is not contacted, credentials are not required, source is not uploaded, and repository code is never executed.

Repository content is treated as untrusted input. File count and size are bounded, generated/vendor directories are ignored by default, symlink traversal is not followed, filenames are emitted as data, and no shell interpolation is used for repository content.

The scanner is intentionally conservative: unsupported or runtime-generated Shopify usage is surfaced as UNKNOWN for manual review rather than being treated as unused.
