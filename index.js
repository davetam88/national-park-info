'use strict';

// put your own value below!
const apiKey = 'nC3wQoBberQTpH9oGy9RZd3WPZRbbUw3eTCblSCb';
const searchURL = 'https://developer.nps.gov/api/v1/parks';

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function displayResults(responseJson) {

  const dataLen = responseJson.data.length;
  // if there are previous results, remove them
  $('#results-list').empty();
  // remove previous error if any.
  $('#js-error-message').text("");

  // iterate through the items array
  for (let i = 0; i < dataLen; i++)
  {

    // show fullname, desc, link and address.
    $('#results-list').append(
      `<li><h3>${responseJson.data[i].fullName}</h3>
      <p>${responseJson.data[i].description}</p>
	  <p><b>WebLink</b> : <a href="${responseJson.data[i].url}">${responseJson.data[i].fullName}</a>
      </li>`
    )
  };

  $('#results').removeClass('hidden');
};

function getParkInfos(stateName, maxResults = 10) {
  const params = {
    api_key: apiKey,
    q: stateName,
    limit: maxResults
  };

  const queryString = formatQueryParams(params)

  const url = searchURL + '?' + queryString;

  console.log(url);

  fetch(url)
    .then(response => {
      if (response.ok)
      {
        return response.json();
      }
      let errmsg = `${response.status} : ${response.statusText}`;
      throw new Error(errmsg);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}


function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const stateName = $('#js-search-term').val();
    const maxResults = $('#js-max-results').val();
    getParkInfos(stateName, maxResults);
  });
}

$(watchForm);
