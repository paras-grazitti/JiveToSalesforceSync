/**
 * Created by paras on 28/7/16.
 */


exports.route = function(req,res)
{
    console.log("here");
    var accessToken = jiveCredentials.access_token;

    var headers = {
        'Authorization': 'Bearer '+accessToken,
        'Content-Type': 'application/json'
    };

    var options = {
        url: 'https://grazitti-parveen.jiveon.com/api/core/v3/webhooks/1035',
        method: 'DELETE',
        headers: headers
    };

    function callback(error, response, body) {

        res.send({
            "body":body
        });
    }

    request(options, callback);

};