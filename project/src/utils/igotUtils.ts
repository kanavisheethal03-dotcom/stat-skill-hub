/**
 * Reusable utility for opening the official iGOT Karmayogi portal.
 *
 * NOTE: The iGOT portal (igotkarmayogi.gov.in) requires government credentials
 * to browse the course catalogue. There is no publicly accessible course-list URL.
 * All links land on the portal homepage where users can log in and explore.
 */

export const IGOT_COURSE_LIST_URL = 'https://igotkarmayogi.gov.in/#/contentList';
export const IGOT_CONTENT_LIST_URL = 'https://igotkarmayogi.gov.in/#/contentList';
export const IGOT_PORTAL_COURSES = 'https://igotkarmayogi.gov.in/#/contentList';

/**
 * Safely opens the official iGOT Karmayogi portal in a new browser tab.
 *
 * @param igotUrl - The specific course URL or fallback to the iGOT portal content list
 * @param onUnavailable - Optional callback if the link is not available
 */
export function openIGOTCourse(
  igotUrl?: string,
  onUnavailable?: (message: string) => void
): boolean {
  let targetUrl = igotUrl?.trim();

  // Fall back to the content list URL for any generic / invalid / empty URLs
  if (
    !targetUrl ||
    targetUrl === 'https://igotkarmayogi.gov.in' ||
    targetUrl === 'https://igotkarmayogi.gov.in/' ||
    targetUrl === 'https://igotkarmayogi.gov.in/app/search' ||
    targetUrl === 'https://igotkarmayogi.gov.in/app/search/contentlist' ||
    targetUrl === 'https://karmayogibharat.gov.in' ||
    targetUrl === 'https://karmayogibharat.gov.in/' ||
    targetUrl === 'https://karmayogibharat.gov.in/courses'
  ) {
    targetUrl = IGOT_CONTENT_LIST_URL;
  }

  // Safely open in a new browser tab with strict security flags
  window.open(targetUrl, '_blank', 'noopener,noreferrer');
  return true;
}
