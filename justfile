# Sn0w — Astro static site + blog.
#
# `just` puts the everyday commands behind one-word recipes and documents them
# with `just --list`. The bun scripts stay the source of truth; this file only
# composes them, and `ci` mirrors the order the GitHub workflow uses.

set shell := ["bash", "-euo", "pipefail", "-c"]

# List the recipes below.
default:
    @just --list

# Install dependencies exactly as bun.lock records them.
install:
    bun install --frozen-lockfile

# Run the Astro dev server on http://localhost:4321.
dev:
    bun run dev
alias d := dev

# Type-check .astro and .ts files.
check:
    bun run check
alias c := check

# Run the content publication rules.
test:
    bun run test
alias t := test

# Rewrite files with Prettier.
fmt:
    bun run format

# Verify formatting without writing; CI runs this.
fmt-check:
    bun run format:check

# Build the static site into dist/.
build:
    bun run build
alias b := build

# Serve the built dist/ locally.
preview:
    bun run preview

# Everything CI runs, in CI's order.
ci: fmt-check check test build

# Show which dependencies are behind.
outdated:
    bun outdated

# Bump every dependency to its latest version, then reinstall.
update:
    bun update --latest
    bun install

# Remove build output and generated types.
clean:
    rm -rf dist .astro
