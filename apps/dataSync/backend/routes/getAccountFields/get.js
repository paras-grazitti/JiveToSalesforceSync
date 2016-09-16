exports.route = function (req, res) {
    console.log("api hit");

    var salesforceAccountFields = [];
    var salesforceContactFields = [];
    var jiveSpaceFields = [];
    var jiveUserFields = [];
    var existingAccountNames = [];
    var JiveCredentials ;


    async.parallel([
        function (cb) {
            conn.sobject("Account").describe(function (err, meta) {

                if(err){

                }
                else{
                    meta.fields.forEach(function (fields) {
                        salesforceAccountFields.push(fields.name);
                    });
                }

                cb(null);

            });
        },
        function (cb) {
            conn.sobject("Contact").describe(function (err, meta) {

                if(err){

                }
                else{
                    meta.fields.forEach(function (fields) {
                        salesforceContactFields.push(fields.name);

                    });
                }



                cb(null);

            });
        },
        function (cb) {

            fs.readFile(DIRNAME + '/metadata/jiveFields.json', 'utf8', function (unableToOpen, data) {
                if (unableToOpen) {
                    console.log('metadata/userSyncingData.json doesnt exists');
                    res.send("some problem in userSyncingData.json file");
                } else if (data) {

                    data = JSON.parse(data);
                    jiveUserFields = data.userFields;
                    //cb(null);
                    var headers = {
                        'Authorization': 'Bearer ' + jive1.access_token,
                        'Content-Type': 'application/json'
                    };

                    var options = {
                        url: jiveLoginUrl + '/api/core/v3/admin/profileFields',
                        method: 'GET',
                        headers: headers
                    };

                    request(options, function (err, response, data) {

                        console.log(err);
                        data = JSON.parse(data);

                        data.list.forEach(function(response)
                        {
                            jiveUserFields.push(response.name);

                        });
                        jiveUserFields = jiveUserFields.filter( onlyUnique );
                        cb(null);
                    })
                }
            })


        },
        function (cb) {
            fs.readFile(DIRNAME + '/metadata/jiveFields.json', 'utf8', function (unableToOpen, data) {
                if (unableToOpen) {
                    console.log('metadata/userSyncingData.json doesnt exists');
                    res.send("some problem in userSyncingData.json file");
                } else if (data) {

                    data = JSON.parse(data);
                    jiveSpaceFields = data.spaceFields;
                    cb(null);
                }
            })
        },
        function (cb) {
            fs.readFile(DIRNAME + '/metadata/jiveCredentials.json', 'utf8', function (unableToOpen, data) {
                if (unableToOpen) {
                    console.log('metadata/jiveCredentials.json doesnt exists');
                    res.send("some problem in jiveCredentials.json file");
                } else if (data) {
                    
                    data = JSON.parse(data);
                    JiveCredentials = data.JiveCredentials;
                    cb(null);
                }
            })
        },
        function(cb){
            var query = "select Id,Name from Account ";
            conn.query(query, function (err, result) {

                if(!err){
                    result.records.forEach(function(result)
                    {
                        existingAccountNames.push({
                            "id":result.Id,
                            "name":result.Name
                        })

                    });
                }

                cb(null);

            })
        }
        

    ], function (err, result) {

        var salesforceCredentials = admin.admin.oauth2;
        //var jiveCredentialsJ = jiveCredentials.JiveCredentials;

      //  console.log(existingAccountNames)
        res.send({
            "salesforceAccountFields":salesforceAccountFields,
            "salesforceContactFields":salesforceContactFields,
            "jiveUserFields":jiveUserFields,
            "jiveSpaceFields":jiveSpaceFields,
            "existingAccountNames":existingAccountNames,
            "loginUrl":salesforceCredentials.loginUrl,
            "clientId":salesforceCredentials.clientId,
            "clientSecret":salesforceCredentials.clientSecret,
            "username": JiveCredentials.username,
            "password":JiveCredentials.password,
            "jiveLoginUrl":JiveCredentials.jiveLoginUrl
        })

    });


};


function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}