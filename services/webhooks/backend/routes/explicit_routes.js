var jive = require('jive-sdk');
var fs = require('fs');

var userSyncingFile = require('../../../../routes/userSyncingCrone');


exports.postWebhooks = {

    'path': '/webhooks',
    'verb': 'post',
    'route': function (req, res) {
        

        var jiveUrls = [];
        var users = [];
        var activityList = req.body;
        var userSyncingConditions;
        console.log(JSON.stringify(activityList));
        if (activityList) {

            async.waterfall([
                function (cb) {
                    activityList.forEach(function (results) {
                        jiveUrls.push(results.activity.object.id);

                    });

                    jiveUrls = jiveUrls.filter(function (e, i, arr) {
                        return arr.lastIndexOf(e) === i;
                    });
                    console.log(jiveUrls);

                    cb(null);

                },
                function (cb) {
                    console.log(jiveUrls);
                    userSyncingFile.getUserSyncingDataFromFile(res, 0, function (err, result) {
                        if (err) {
                            res.send("some error occured");
                        }
                        else {
                            if (result.length) {
                                userSyncingConditions = result;
                                cb(null);
                            }
                            else {

                                console.log("no real time syncing file");
                                res.writeHead(200, {'Content-Type': 'application/json'});
                                res.end(JSON.stringify({}));
                            }

                        }

                    })

                },
                function (cb) {
                    getJiveDataFromUrl(res, userSyncingConditions[0], jiveUrls, function (err, result) {
                        if (err) {
                            res.send("some error occured");
                        }
                        else {

                            users.push(result);
                            console.log("users....",users)
                            cb(null);
                        }

                    });

                },
                function (cb) {
                    userSyncingFile.updateContactsInSalesforce(res, users, function (err, result) {
                        cb(null);
                    });
                }
            ], function (err, result) {
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({}));
            });

        }
        else {
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({}));
            console.log("no webhooks currently")
        }
    }
};


function getJiveDataFromUrl(res, userSyncingConditions, jiveUrls, callback) {
    var headers = {
        'Authorization': 'Bearer ' + jive1.access_token,
        'Content-Type': 'application/json'
    };

    var results = [];
    var options = {
        url: jiveUrls[0],
        method: 'GET',
        headers: headers
    };

    console.log(options);
    request(options, function (err, response, data) {
        console.log(err);
        if (!err && response.statusCode == 200) {
            console.log(data);
            data = JSON.parse(data);
            
            results.push(data);
            userSyncingConditions.data = results;
            callback(null, userSyncingConditions);

        }
        else {

            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({}));
        }

    });

}
