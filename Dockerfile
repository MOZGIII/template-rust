# syntax=docker/dockerfile:1.23

ARG BUILDER_BASE=rust:bookworm
ARG RUNTIME_BASE=debian:bookworm

FROM ${BUILDER_BASE} AS builder

RUN apt-get update \
  && apt-get install -y \
  clang \
  && rm -rf /var/lib/apt/lists/*

RUN mkdir -p ~/.ssh \
  && chmod 0600 ~/.ssh \
  && ssh-keyscan github.com >>~/.ssh/known_hosts

FROM ${RUNTIME_BASE} AS runtime

RUN apt-get update \
  && apt-get install -y \
  ca-certificates \
  jq \
  curl \
  && rm -rf /var/lib/apt/lists/*

FROM builder AS build

WORKDIR /worktree

# Install rust.
RUN \
  --mount=type=bind,target=rust-toolchain.toml,source=rust-toolchain.toml \
  --mount=type=cache,target=/usr/local/rustup \
  rustup install

# Build the binaries.
RUN \
  --mount=type=bind,target=.,readwrite \
  --mount=type=cache,target=/usr/local/rustup \
  --mount=type=cache,target=/usr/local/cargo/registry \
  --mount=type=cache,target=/build \
  --mount=type=ssh \
  RUST_BACKTRACE=1 \
  CARGO_BUILD_BUILD_DIR=/build \
  CARGO_TARGET_DIR=/artifacts \
  cargo build --release --locked --workspace

FROM runtime AS runtime-release-artifact

ONBUILD ARG ARTIFACT
ONBUILD COPY --from=build "/artifacts/release/${ARTIFACT}" /usr/local/bin
ONBUILD RUN ldd "/usr/local/bin/${ARTIFACT}"

ARG ARTIFACT=main
FROM runtime-release-artifact AS main
CMD ["main"]
