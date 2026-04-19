export type ProductKey =
  | "durian"
  | "coconut"
  | "mango"
  | "mangosteen"
  | "jackfruit"
  | "pineapple";

function normalize(value?: string) {
  return (value ?? "").trim().toLowerCase();
}

export function resolveProductKey(name?: string, imageUrl?: string): ProductKey | null {
  const normalizedName = normalize(name);
  const normalizedImage = normalize(imageUrl);
  const haystack = `${normalizedName} ${normalizedImage}`;

  if (
    haystack.includes("durian") ||
    haystack.includes("ทุเรียน") ||
    haystack.includes("榴莲")
  ) {
    return "durian";
  }

  if (
    haystack.includes("coconut") ||
    haystack.includes("มะพร้าว") ||
    haystack.includes("椰")
  ) {
    return "coconut";
  }

  if (
    haystack.includes("mangosteen") ||
    haystack.includes("มังคุด") ||
    haystack.includes("山竹")
  ) {
    return "mangosteen";
  }

  if (
    haystack.includes("jackfruit") ||
    haystack.includes("ขนุน") ||
    haystack.includes("菠萝蜜")
  ) {
    return "jackfruit";
  }

  if (
    haystack.includes("pineapple") ||
    haystack.includes("สับปะรด") ||
    haystack.includes("菠萝")
  ) {
    return "pineapple";
  }

  if (
    haystack.includes("mango") ||
    haystack.includes("มะม่วง") ||
    haystack.includes("芒")
  ) {
    return "mango";
  }

  return null;
}
