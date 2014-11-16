/*
Custom json error response
*/
module.exports = function(message) {
  var req = this.req;
  var res = this.res;

  var result = {
    status: 200,
    error: true,
    message: message || ""
  };
  return res.json(result, result.status);
}