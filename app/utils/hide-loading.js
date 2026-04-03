export default function (delay = 200) {
  const { dismiss } = useLoading();
  dismiss(delay);
}
