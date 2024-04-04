export default function (path, push = true) {
  if (process.client) {
    const router = useRouter();
    if (push) {
      consoleLog("showPage", "push", path);
      router.push({ path: path });
    }
    else {
      consoleLog("showPage", "replace", path);
      router.replace({ path: path });
    }
  }
}