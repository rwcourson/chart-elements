# @rwcourson/chart-elements-cli

Small, non-destructive project diagnostics and registry discovery for Chart
Elements.

```bash
pnpm dlx @rwcourson/chart-elements-cli list
pnpm dlx @rwcourson/chart-elements-cli doctor .
```

The CLI deliberately does not offer a source-copy `add` command yet. That
command will ship only after the registry has content hashes, conflict handling,
and safe update semantics.
