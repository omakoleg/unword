/*
Custom json error response
*/
module.exports = function(data) {
  var req = this.req;
  var res = this.res;

  var result = {
    status: 200,
    error: false,
    data: data || null
  };
  return res.json(result, result.status);
}