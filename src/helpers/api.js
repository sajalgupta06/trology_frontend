export const handleResponse = (response) => {
  if (!response.ok) {
    return response
      .json()
      .catch(() => {
        // Couldn't parse the JSON
        throw new Error(response.status)
      })
      .then(({ message }) => {
        // Got valid JSON with error response, use it
        throw new Error(message || response.status)
      })
  }
  // Successful response, parse the JSON and return the data
  return response.json()
}
