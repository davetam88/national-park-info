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
  // iterate through the items array
  for (let i = 0; i < dataLen; i++)
  {

    // build site address.
    let siteAddress = `
	  ${responseJson.data[i].addresses[0].line1}
	  ${responseJson.data[i].addresses[0].city},  ${responseJson.data[i].addresses[0].stateCode} ${responseJson.data[i].addresses[0].postalCode} 
	  `;

    // show fullname, desc, link and address.
    $('#results-list').append(
      `<li><h3>${responseJson.data[i].fullName}</h3>
      <p>${responseJson.data[i].description}</p>
	  <p><b>WebLink</b> : <a href="${responseJson.data[i].url}">${responseJson.data[i].fullName}</a>
      <p><b>Address</b> : ${siteAddress}</p>
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
  console.log('stateName :>> ', stateName); // db.

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
