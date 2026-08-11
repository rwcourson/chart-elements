# Changelog

All notable changes to published packages will be documented here. The project
uses [Semantic Versioning](https://semver.org/) and Changesets for release notes.

## Unreleased

### Added

- Public paginated-report entry point and 32 measured report recipes, with
  minified ESM and source maps keeping the expanded package inside its existing
  archive and compressed JavaScript budgets.
- Scoped package, registry, CLI, consumer fixtures, and release-validation
  foundation for the first community release.
- A dedicated declarative entry point for Vega, Vega-Lite, and independently
  compatible specifications, with remote data disabled by default.
- Source-tree and exact package-tarball checks for blocked brand content,
  package metadata, source-map paths, CSS isolation, and dependency licenses.
- Clean exact-tarball React 18/Vite and React 19/Next installation smoke tests,
  explicit archive and emitted gzip budgets, deterministic CycloneDX SBOMs,
  and immutable GitHub Actions pins.

### Changed

- Raised `@rwcourson/chart-elements` compressed tarball budget to 700 KB after
  specialized-family craft, shared mark constants, and source-map growth
  (still under intentional archive limits; see `scripts/validate-package.mjs`).
- The repository root is now a private workspace and demo application rather
  than the publishable package itself.
- Component CSS no longer ships a Tailwind preflight or document-wide reset;
  default tokens and optional unbranded palettes are separate exports.
- SVG-heavy charts now serialize geometry deterministically across server and
  browser renders; hierarchy slicers, scrollable tables, declarative visuals,
  and paginated-report regions now expose valid keyboard and ARIA semantics.
- Source-level geometry, map, catalog-report, and pagination tests are part of
  the required verification chain alongside compiled-package SSR checks.
- Production verification now inspects all 336 generated gallery documents for
  route drift, duplicate IDs, invalid SVG attributes, nested controls, missing
  accessible labels, unsafe links, and absent image alternatives.
