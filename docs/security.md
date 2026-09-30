# Security model

Scans are offline and read-only. File count and size are bounded, generated/vendor directories are ignored by default, symlink traversal is not followed, filenames are emitted as data, and no shell interpolation is used for repository content.
