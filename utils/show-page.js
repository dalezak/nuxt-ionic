export default function (path, push = true) {
  if (process.client) {
    consoleLog("showPage", path, push);
    const router = useRouter();
    if (push) {
      router.push({ path: path });
    }
    else {
      router.replace({ path: path });
    }
  }
}