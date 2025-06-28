export default function parseResponseData(response) {
  if (typeof response.data === `object` && `data` in response.data) {
    return response.data.data;
  }
  return response.data;
}
