export default async function (message = "Loading...", hide = 0) {
  const { show } = useLoading();
  return show(message, hide);
}
