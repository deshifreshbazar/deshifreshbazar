// utils/cookies.ts or similar

export function deleteCookie(name: string) {
    document.cookie = `${name}=; Max-Age=0; path=/`;
  }
  