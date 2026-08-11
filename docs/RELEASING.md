# Releasing Chart Elements

Releases are manual until package ownership and the first consumer-compatibility
matrix have been confirmed.

## One-time prerequisites

1. Confirm control of the npm scope used by `@rwcourson/chart-elements`. The
   unscoped `chart-elements` name belongs to another project and must never be
   targeted.
2. Bootstrap the first `0.1.0` publication only after every gate below passes.
   Because the package settings pages do not exist before that first publish,
   this must be an explicitly approved interactive publish using the maintainer's
   npm account and 2FA. Do not add a reusable npm token to the repository or
   GitHub Actions.
3. After the package pages exist, configure npm trusted publishing for **each**
   public package with GitHub user
   `rwcourson`, repository `chart-elements`, workflow `release.yml`, environment
   `npm`, and the `npm publish` action enabled. Do not store a long-lived npm
   automation token in the repository.
4. Review `NOTICE`, third-party dependency licenses, vendor analogue labels,
   and the automated brand-content scan.

## Prepare a release

1. Add a Changeset describing the user-visible package change:

   ```bash
   pnpm changeset
   ```

2. Run the complete local release gate:

   ```bash
   pnpm install --frozen-lockfile
   pnpm release:check
   ```

   This builds the library packages, tests the registry and CLI, validates the
   npm tarball and CycloneDX SBOMs, enforces archive/JS/CSS budgets, runs package
   metadata/type-resolution checks, builds the demo, builds workspace Next.js
   and Vite fixtures, then installs the exact `.tgz` in fresh React 19/Next and
   React 18.2/Vite consumers and builds both again.

3. Inspect the exact tarball contents and import it into a clean application
   when public exports or dependencies change:

   ```bash
   pnpm --filter @rwcourson/chart-elements pack
   npm pack --dry-run --json packages/chart-elements
   ```

4. Merge the Changeset version PR, then run the **Release packages** workflow
   manually in the protected `npm` environment. Leave `publish` disabled for a
   dry run; enable it only after reviewing every gate.

## Required release conditions

- The working tree and generated catalog are clean.
- `publint` and `attw` pass for all JavaScript/type entry points.
- The tarball contains only declared distribution files.
- Every tarball includes a current CycloneDX SBOM, and the deterministic SBOM
  check passes without absolute workspace paths.
- Compressed/unpacked archives and emitted JavaScript/CSS remain within the
  explicit budgets in `scripts/validate-package.mjs`; budget increases require
  a changelog rationale.
- The current source tree and all package tarballs contain no blocked brand
  identifiers, branded palette definitions, or branded asset names. Package
  tarballs contain no unreviewed binary assets.
- React is a peer dependency and no internal `@/` aliases remain in output.
- `components.css`/`styles.css` contain no preflight, document reset, global
  universal selector, `body`, `html`, `:root`, or `:host` rules. Default tokens
  and demo palettes remain separate opt-in exports, and generated Tailwind
  internals use the package-specific `--ce-tw-*` namespace.
- The React 19/Next.js and React 18/Vite consumer fixtures both build from the
  compiled workspace package and from a clean installation of the exact packed
  archive, with no workspace link accepted by the packed-consumer gate.
- Publishable packages contain only dependency licenses in the reviewed
  permissive allowlist.
- No high or critical production dependency advisories are open.
- Changelog, NOTICE, support labels, and documentation match what is shipping.
- GitHub Actions are pinned to immutable official commit SHAs; Dependabot is the
  update path for those pins.

If a published release is defective, publish a corrective patch or deprecate the
bad version. Do not unpublish a version that consumers may already depend on.
