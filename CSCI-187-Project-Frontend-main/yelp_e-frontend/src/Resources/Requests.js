

//Login Request API handler
export const LoginRequest = async (username, password) => {
  var r;
  await fetch("/users/login/" + username + "/" + password)
    .then((response) => response.json())
    .then((json) => {
      r = json;
    });

  return r;
};

//Graph Data API handler
export const GetGraphData = async (business_id) => {
  var r;
  await fetch("/businesses/owner/" + business_id + "/graph")
    .then((response) => response.json())
    .then((json) => {
      r = json;
    });

  return r;
};

//Search Query API handler
export const SearchRequest = async (request, sort) => {
  var r;

  var path = "/search/" + request + "/" + sort;

  await fetch(path)
    .then((response) => response.json())
    .then((json) => (r = json));

  return r;
};

//Single Business Information API handler
export const SingleBusinessRequest = async (request) => {
  var r;

  await fetch("/business/" + request)
    .then((response) => response.json())
    .then((json) => {
      r = json;
    });

  return r;
};

//Review API handler
export const BusinessReviewRequest = async (request) => {
  var r;

  await fetch("/businesses/reviews/" + request)
    .then((response) => response.json())
    .then((json) => {
      r = json;
    });

  return r;
};

//Review Search API handler
export const BusinessFilteredReviewRequest = async (business_id, search) => {
  var r;

  await fetch("/businesses/searchbar/" + business_id + "/" + search)
    .then((response) => response.json())
    .then((json) => {
      r = json;
    });

  return r;
};
