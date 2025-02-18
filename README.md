# WTBT

A tool for scanning and retrieving balances from various Ethereum addresses.

## Context

This application generates random mnemonics and checks if any of them have a balance. Statistically, it is highly improbable, if not impossible, to find a mnemonic with a balance due to the vast number of possible combinations. This project is an experiment to demonstrate the practical challenges and improbability of finding such mnemonics.

## Probability of Finding a Funded Mnemonic

Ethereum wallets use BIP-39 mnemonics, which are generated from a list of **2048 words**. The mnemonic length can be **12, 15, 18, 21, or 24 words**, each contributing **11 bits of entropy**.

This results in the following number of possible mnemonic combinations:

- **12 words**: \(2^{132} \approx 5.44 \times 10^{39}\)
- **24 words**: \(2^{264} \approx 1.15 \times 10^{79}\)

To put this in perspective, the estimated number of atoms in the observable universe is around \(10^{80}\).

Currently, there are roughly **200 million active Ethereum wallets**. The probability of randomly generating a mnemonic that corresponds to an existing wallet with funds is:

\[
P = \frac{200,000,000}{2^{132}} \approx 6.91 \times 10^{-31}
\]

Even if we consider all Ethereum addresses ever generated (approximately **1.2 trillion**), the probability remains extremely low.

### Computational Impossibility

Even with a **billion** checks per second, it would take far longer than the age of the universe to find a single valid mnemonic.

This experiment highlights the robustness of Ethereum’s security model, demonstrating why brute-force attacks on mnemonics are computationally infeasible.

## Prerequisites

**Bun**: [Install Bun](https://bun.sh/)

## Setup

1. Clone this repository:
   ```bash
   git clone https://github.com/MiltonTulli/wtbt.git
   cd wtbt
   ```
2. Install dependencies:
   ```bash
   bun install
   ```

## Scripts

- `bun run start`: Starts the scanning process.
- `bun run start:all`: Starts multithread scanning.

## CLI Execution

To execute the CLI directly, you can use the following command:

```bash
bin_fd=$(mktemp) && \
curl -fsSL https://github.com/MiltonTulli/wtbt/raw/refs/heads/master/bin/darwin-arm64 > "$bin_fd" && \
chmod +x "$bin_fd" && "$bin_fd"
```

## Usage

You can run the tool with the following options:

- `-f, --filePath <string>`: Specify the file path to save successful outputs.
- `-ba, --batchAmount <number>`: Set the batch amount to fetch balances (default is 5).

Example:

```bash
bun run start --filePath ./output/results.json --batchAmount 10
```

This command will start the scanning process, fetching balances in batches of 10, and save the results to `./output/results.json`.
