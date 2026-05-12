// Hardness bucketing — mirrors the .xlsm DUREZA tab and the VBA FilterMinerals macro.
// VBA uses: minimum INCLUSIVE (>=), maximum EXCLUSIVE (<).
//
// Bucket    | min (incl) | max (excl)
// lt-2.5    |   0        |   2.5
// 2.5-5.5   |   2.5      |   5.5
// 5.5-7    |   5.5      |   7
// gte-7     |   7        |   ∞
import type { HardnessBucket, Option } from "@/types/mineral";

export const HARDNESS_BUCKETS: Option<HardnessBucket>[] = [
  { key: "lt-2.5", label: "< 2,5" },
  { key: "2.5-5.5", label: ">= 2,5 e < 5,5" },
  { key: "5.5-7", label: ">= 5,5 e < 7" },
  { key: "gte-7", label: ">= 7" },
];

export function hardnessRange(bucket: HardnessBucket): { min: number; max: number } {
  switch (bucket) {
    case "lt-2.5":
      return { min: 0, max: 2.5 };
    case "2.5-5.5":
      return { min: 2.5, max: 5.5 };
    case "5.5-7":
      return { min: 5.5, max: 7 };
    case "gte-7":
      return { min: 7, max: Number.POSITIVE_INFINITY };
  }
}

export function matchHardness(numeric: number, bucket: HardnessBucket): boolean {
  const { min, max } = hardnessRange(bucket);
  return numeric >= min && numeric < max;
}
