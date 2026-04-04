import { Share } from '@capacitor/share';
import SharePopover from '~/components/share-popover.vue';

/**
 * The primary share entry point. Tries three strategies in order:
 * 1. Native Capacitor share sheet (`Share.share`) — used on iOS/Android when available.
 * 2. Ionic popover (`share-popover.vue`) — used on web when a triggering DOM event is provided.
 * 3. Ionic action sheet (`shareSheet()`) — fallback for web with no event.
 * Always prefer this over calling `shareSheet()` or individual share utils directly.
 * @param {{title: string, description: string, url: string, image: string}} props
 * @param {Event|null} event - The DOM event that triggered the share (used to anchor a popover).
 *                             Pass null to skip the popover and fall back to the action sheet.
 * @returns {Promise<any>}
 * @example
 * // From a button click handler:
 * await shareSocial({ title, description, url, image }, $event);
 *
 * // Without an event (always uses action sheet on web):
 * await shareSocial({ title, description, url, image });
 */
export default async function ({title, description, url, image}, event = null) {
  let canShare = await Share.canShare();
  if (canShare && canShare.value) {
      let options = {};
      if (title && title.length > 0) {
        options["title"] = title;
      }
      if (description && description.length > 0) {
        options["text"] = description;
      }
      if (url && url.length > 0) {
        options["url"] = url;
      }
      return await Share.share(options);
  }
  if (event) {
    return await showPopover(SharePopover, event, {
      title: title,
      description: description,
      image: image,
      url: url
    });
  }
  return await shareSheet({
    title: title,
    description: description,
    image: image,
    url: url
  });
}
