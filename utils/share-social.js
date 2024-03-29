import { Share } from '@capacitor/share';
export default async function ({title, description, url, image}) {
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
  return await shareSheet({
    title: title, 
    description: description,
    image: image,
    url: url
  });
}