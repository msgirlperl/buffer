const Api = {};

const handleError = response => {
  if (!response.ok) {
    throw new Error(
      `API Request Error: ${response.status} - ${response.statusText}: ${
        response.url
      }`
    );
  }
  return response;
};

Api.get = (url, data = {}) => {
  const params = new URLSearchParams(data);
  return fetch(`/api/${url}?${params.toString()}`)
    .then(handleError)
    .then(response => response.json());
};

Api.post = (url, data) => {
  const options = {
    body: JSON.stringify(data),
    method: 'POST'
  };
  return fetch(`/api/${url}`, options)
    .then(handleError)
    .then(response => response.json());
};

export default Api;
