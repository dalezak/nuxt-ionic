import { Share } from '@capacitor/share';
import SharePopover from '~/components/share-popover.vue';
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