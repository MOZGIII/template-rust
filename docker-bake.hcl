group "default" {
  targets = ["main"]
}

target "base" {
  dockerfile = "Dockerfile"
}

target "main" {
  inherits = ["base", "docker-metadata-action-main"]
  target = "main"
}

# Targets to allow injecting customizations from Github Actions.

target "docker-metadata-action-main" {}
