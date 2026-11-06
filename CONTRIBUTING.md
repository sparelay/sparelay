# Contributing to Sparelay

Thanks for your interest in improving Sparelay.

By participating in this project, you agree to follow our
[Code of Conduct](CODE_OF_CONDUCT.md). For security issues, please read
[SECURITY.md](SECURITY.md) instead of opening a public issue.

## Development setup

Requirements:

- Bun 1.2 or newer
- Docker and Docker Compose (optional, for container testing)

```bash
git clone https://github.com/sparelay/sparelay.git
cd sparelay
cp .env.example .env
# Set API_KEY in .env
bun install
bun run dev
```

The application is available at http://localhost:3000. The database defaults
to `./data/database.sqlite`; set `DB_PATH` only if you need a different file.
Docker Compose mounts `./data` to `/app/data`, so the default resolves to
`/app/data/database.sqlite`.

## Before opening a pull request

Run the same checks as CI:

```bash
bun run typecheck
bun run lint
bun run test
bun run format:check
```

Add tests for behavior changes. Most tests live next to the code as
`*.test.ts`.

## Commit and pull request conventions

This repository uses [Conventional Commits](https://www.conventionalcommits.org/)
so that release-please can generate changelogs and versions.

Use a pull request title such as:

```text
feat: add a new search provider
fix: handle provider timeouts
docs: clarify the Docker setup
chore: update dependencies
```

For breaking changes, add `!` after the type/scope and describe the migration
in the pull request body:

```text
feat!: change the /search response shape
```

Pull requests are merged with squash merge; the pull request title becomes the
commit message used by release-please.

## Developer Certificate of Origin

Please sign off your commits:

```bash
git commit -s -m "fix: handle provider timeouts"
```

The sign-off certifies that you have the right to submit the contribution under
the project's MIT license. See <https://developercertificate.org/> for the full
text.

- Sign off every commit. When amending, use `git commit --amend -s`.
- Let `-s` generate the trailer from `git config user.name` and `user.email`
  instead of typing it by hand.
- Only sign off your own contribution. Never add a `Signed-off-by` for another
  person, an AI assistant, or a tool.
- If a commit is missing its sign-off, fix it with `git commit --amend -s` or
  `git rebase --signoff <base>` rather than appending a trailer manually.

## Adding a provider

1. Add the schema and default configuration under `features/provider/model/<type>/`.
2. Register it in `PROVIDER_REGISTRY`.
3. Add the adapter under `features/search/server/providers/`.
4. Add the factory entry in `features/search/server/create-provider.ts`.
5. Add a form fragment if the provider needs custom fields.
6. Add tests for request building and response normalization.

## Release process

Releases are managed by release-please. Do not create tags or edit version
numbers manually. Maintainers merge the release pull request, and the `Publish`
workflow builds and pushes the Docker image.

## Reporting security issues

Do not open a public issue for a vulnerability. Use the private reporting
instructions in [SECURITY.md](SECURITY.md).
