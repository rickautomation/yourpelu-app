"use client";

import { useRouter } from "next/navigation";

export function useNavigation() {
  const router = useRouter();

  const goTo = (path: string) => {
    router.push(path);
  };

  return { goTo };
}
