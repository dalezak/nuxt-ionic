import { Share } from '@capacitor/share';
export default async function (title, text, url) {
  let canShare = await Share.canShare();
  if (canShare && canShare.value) {
      let options = {};
      if (title && title.length > 0) {
        options["title"] = title;
      }
      if (text && text.length > 0) {
        options["text"] = text;
      }
      if (url && url.length > 0) {
        options["url"] = url;
      }
      return await Share.share(options);
  }
  return await shareCustom(title, text, url);
}