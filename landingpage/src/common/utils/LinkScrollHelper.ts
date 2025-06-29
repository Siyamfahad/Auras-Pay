/**
 * This function contains the logic to determine if a next-link should be scrolled to or not.
 * Is is used to use smooth scrolling when the user clicks on a next-link with anchor (#), but not when the user navigates to a regular page.
 * @param url The url of the next-link
 * @returns True if the next-link should be scrolled to, false otherwise
 * @example scrollIfNoHash("https://www.example.com/#hash") // false
 */
export function scrollIfNoHash(url: string) {
  return !url.includes("#");
}
