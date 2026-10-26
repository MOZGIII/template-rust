export type Mode = {
  name: string;
  cargoCommand: string;
  cargoArgs: string;
  // The dependency cache the mode works from; modes that compile the
  // dependencies the same way share one. Absent for modes that need none.
  cargoCacheKey?: string;
  // Set on a mode whose dependencies are a subset of those of another mode
  // with the same cache key: it restores that cache but never saves its own,
  // so the saved cache is always the larger one.
  cargoCacheRestoreOnly?: true;
  platformIndependent?: true;
};

export type Modes = Record<string, Mode>;

export const code = {
  clippy: {
    name: "cargo clippy",
    cargoCommand: "clippy",
    cargoArgs: "--locked --workspace --all-targets",
    cargoCacheKey: "check",
  },
  test: {
    name: "cargo test",
    cargoCommand: "test",
    cargoArgs: "--locked --workspace",
    cargoCacheKey: "build",
  },
  build: {
    name: "cargo build",
    cargoCommand: "build",
    cargoArgs: "--locked --workspace",
    cargoCacheKey: "build",
    cargoCacheRestoreOnly: true, // `test` adds the dev-dependencies
  },
  fmt: {
    name: "cargo fmt",
    cargoCommand: "fmt",
    cargoArgs: "-- --check",
    platformIndependent: true,
  },
  docs: {
    name: "cargo doc",
    cargoCommand: "doc",
    cargoArgs: "--locked --workspace --document-private-items --no-deps",
    platformIndependent: true,
    cargoCacheKey: "check",
    cargoCacheRestoreOnly: true, // `clippy --all-targets` adds the dev-dependencies
  },
} satisfies Modes;

export const build = {
  build: {
    name: "cargo build",
    cargoCommand: "build",
    cargoArgs: "--locked --workspace --release",
    cargoCacheKey: "release-build",
  },
} satisfies Modes;
