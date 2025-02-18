import { english, generateMnemonic } from "viem/accounts";

export function* generateCombinations() {
  while (true) {
    yield generateMnemonic(english);
  }
}
