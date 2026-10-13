export type RunnerOS =
  | "ubuntu-26.04"
  | "ubuntu-26.04-arm"
  | "macos-26" // arm
  | "macos-26-large" // intel
  | "windows-latest";

export type Platform = {
  name: string;
  os: RunnerOS;
  buildEnvScript: string;
  essential: boolean;
  env: Record<string, string>;
  cacheKey: string;
  artifactMarker: string | null;
  isBroken: boolean;
};

export type Platforms = Record<string, Platform>;

// An utility to apply common build script paths.
const buildEnvScriptPath = (script: string) =>
  `.github/scripts/build_env/${script}`;

// All the platforms that we support, and their respective settings.
export const all = {
  ubuntu2604_amd64: {
    name: "Ubuntu 26.04 (amd64)",
    os: "ubuntu-26.04",
    buildEnvScript: buildEnvScriptPath("ubuntu.sh"),
    essential: true,
    env: {},
    cacheKey: "ubuntu2604-amd64",
    artifactMarker: "amd64-ubuntu2604",
    isBroken: false,
  },
  ubuntu2604_aarch64: {
    name: "Ubuntu 26.04 (aarch64)",
    os: "ubuntu-26.04-arm",
    buildEnvScript: buildEnvScriptPath("ubuntu.sh"),
    essential: false,
    env: {},
    cacheKey: "ubuntu2604-aarch64",
    artifactMarker: "aarch64-ubuntu2604",
    isBroken: false,
  },
  windows_amd64: {
    name: "Windows (amd64)",
    os: "windows-latest",
    buildEnvScript: buildEnvScriptPath("windows.sh"),
    essential: false,
    env: {},
    cacheKey: "windows-amd64",
    artifactMarker: "amd64",
    isBroken: true,
  },
  macos26_amd64: {
    name: "macOS 26 (amd64)",
    os: "macos-26-large",
    buildEnvScript: buildEnvScriptPath("macos.sh"),
    essential: false,
    env: {},
    cacheKey: "macos26-amd64",
    artifactMarker: "amd64",
    isBroken: true, // needs payment, because it's a `-large` runner
  },
  macos26_aarch64: {
    name: "macOS 26 (aarch64)",
    os: "macos-26",
    buildEnvScript: buildEnvScriptPath("macos.sh"),
    essential: false,
    env: {},
    cacheKey: "macos26-aarch64",
    artifactMarker: "aarch64",
    isBroken: false,
  },
} satisfies Platforms;

// A platform for running things that are platform-independent.
export const core = all.ubuntu2604_amd64 satisfies Platform;
