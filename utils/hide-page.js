export default function () {
  if (process.client) {
    const router = useRouter();
    router.go(-1);
  }
}