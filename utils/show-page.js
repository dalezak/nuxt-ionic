export default function (path, push = true) {
  if (process.client) {
    // const router = useRouter();
    const router = useIonRouter();
    if (push) {
      consoleLog("showPage", path);
      // router.push({ path: path });
      router.push(path);
    }
    else {
      consoleLog("showPage", path);
      router.replace({ path: path });
    }
  }
}