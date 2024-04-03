export default function (path, push = true) {
  if (process.client) {
    const router = useRouter();
    if (push) {
      consoleLog("showPage", path);
      router.push({ path: path });
    }
    else {
      consoleLog("showPage", path);
      router.replace({ path: path });
    }
  }
}