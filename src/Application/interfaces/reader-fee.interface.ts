export interface FeeReader {
  loadFees(): Record<string, string>;
}
