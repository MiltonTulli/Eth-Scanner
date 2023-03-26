import Mnemonic from "bitcore-mnemonic";
import crypto from "crypto";
// TODO: refactor this fn
export function* generateCombinations1(
  elements,
  length,
  startIndex,
  initializeMnemonic
) {
  let indices = new Array(length);
  let usedIndices = new Array(elements.length).fill(false);
  if (initializeMnemonic === undefined || initializeMnemonic === null) {
    indices[0] = startIndex % elements.length;
    usedIndices[indices[0]] = true;
    for (let i = 1; i < length; i++) {
      indices[i] = (indices[i - 1] + 1) % elements.length;
      usedIndices[indices[i]] = true;
    }
  } else {
    let mnemonicWords = initializeMnemonic.split(" ");
    // Check if the number of words in the mnemonic is less than the length
    if (mnemonicWords.length < length) {
      console.log("Initialize Mnemonic is less than the length");
      return;
    }
    for (let i = 0; i < length; i++) {
      // Check if the word exists in the element list
      if (elements.indexOf(mnemonicWords[i]) !== -1) {
        indices[i] = elements.indexOf(mnemonicWords[i]);
        usedIndices[indices[i]] = true;
      } else {
        console.log("word not found in the elements list:" + mnemonicWords[i]);
        return;
      }
    }
  }
  while (indices[length - 1] < elements.length) {
    yield indices.map((i) => elements[i]);
    let i;
    for (i = length - 1; i >= 0; i--) {
      usedIndices[indices[i]] = false;
      if (indices[i] < elements.length - 1) {
        break;
      }
    }
    if (i < 0) {
      break;
    }
    indices[i]++;
    usedIndices[indices[i]] = true;
    for (i++; i < length; i++) {
      indices[i] = (indices[i - 1] + 1) % elements.length;
      usedIndices[indices[i]] = true;
    }
  }
}

export function* generateCombinations(words) {
  // const mnemonic = new Mnemonic(words).toString();
  while (true) {
    yield new Mnemonic(words).toString();
  }
}
