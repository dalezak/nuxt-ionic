export default function (text) {
  if (text) {
    let date = new Date(text);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleTimeString('en-us', {
      weekday: "long", 
      year: "numeric", 
      month: "short", 
      day: "numeric"
    });
  }
  return "";
}