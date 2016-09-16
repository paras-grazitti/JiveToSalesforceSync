/**
 * Created by paras on 3/8/16.
 */

profileLogs = [];

var savedLogs = [];

var jiveBaseUrl = "https://grazitti-parveen.jiveon.com/api/core/v3/";


var userSyncingFile = require('./userSyncingCrone');


/*
 Cron Job for Syncing the Contacts of Salesforce
 with Users/Persons in Jive on weekly basis
 depending on the conditions saved in UserSyncingData.json
 */


exports.croneForWeeklyUserUpdates = function (req, res) {

    userLogs = [];
    var savedUserLogs = [];

    var utcMoment = moment.utc();
    var utcDate = new Date(utcMoment.format());
    var previousDate = new Date(utcMoment.format());

    previousDate.setDate(utcDate.getDate() - 6);

    utcDate = utcDate.toISOString();
    previousDate = previousDate.toISOString();

    var userSyncingConditions;
    var users = [];

    async.auto({
        getUserSyncingData: function (cb) {
            userSyncingFile.getUserSyncingDataFromFile(res, 2, function (err, result) {
                if (err) {
                    res.send("some error occured");
                }
                else {
                    if (result.length) {
                        console.log("sdhbsadadsdsadmdbfdfdf hdndsmfbf")
                        userSyncingConditions = result;
                        cb(null);
                    }
                    else {
                        res.send("no conditions for daily update");
                    }

                }

            });
        },
        getSalesforceData: ['getUserSyncingData', function (cb) {
            userSyncingFile.getSalesforceContacts(res, userSyncingConditions[0], utcDate, previousDate, function (err, result) {
                if (err) {
                    res.send("some error occured");
                }
                else {
                    users.push(result);
                    cb(null);
                }

            })
        }],
        updateUsersInJive: ['getSalesforceData', function (cb) {
            console.log("update in jive");
            userSyncingFile.updateJiveUser(res, users, function (err, result) {
                cb(null);

            });

        }],
        saveProfileLogs:['updateUsersInJive',function(cb)
        {
            // console.log("logs",accountLogs);
            fs.readFile(DIRNAME + '/metadata/profileLogs.json', 'utf8', function (unableToOpen, data) {

                savedLogs = JSON.parse(data);
                savedLogs = savedLogs.profileLogs;
                var finalLogs = savedLogs.concat(profileLogs);
                var x = {};
                x.profileLogs = finalLogs;
                x = JSON.stringify(x);
                fs.writeFile(DIRNAME + '/metadata/profileLogs.json',x, function (err, data) {
                    if (err) {
                        console.error('Unable to Update Account Logs Data', err);
                        res.send({
                            "message": "Some error occured due to non updation of account logs",
                            "status": 400
                        })
                    }
                    else {
                        console.log('profile logs.json updated !!');
                        cb(null);
                    }
                })

            });
        }]


    }, function (err, result) {
        if (err) {
            res.send("some error occured");
        }
        else {
            res.send("updated");
        }

    });
};


/*
 Cron Job for Syncing the Contacts of Salesforce
 with Users/Persons in Jive on daily basis
 depending on the conditions saved in UserSyncingData.json
 */
exports.croneForDailyUserUpdates = function (req, res) {

    var utcMoment = moment.utc();
    var utcDate = new Date(utcMoment.format());
    var previousDate = new Date(utcMoment.format());

    previousDate.setDate(utcDate.getDate() - 1);

    utcDate = utcDate.toISOString();
    previousDate = previousDate.toISOString();

    var userSyncingConditions;
    var users = [];

    async.auto({
        getUserSyncingData: function (cb) {
            userSyncingFile.getUserSyncingDataFromFile(res, 1, function (err, result) {
                if (err) {
                    res.send("some error occured");
                }
                else {
                    if (result.length) {
                        userSyncingConditions = result;
                        cb(null);
                    }
                    else {
                        res.send("no conditions for daily update");
                    }

                }

            });
        },
        getSalesforceData: ['getUserSyncingData', function (cb) {
            userSyncingFile.getSalesforceContacts(res, userSyncingConditions[0], utcDate, previousDate, function (err, result) {
                if (err) {
                    res.send("some error occured");
                }
                else {

                    users.push(result);
                    console.log("users...",users);
                    cb(null);
                }

            })
        }],
        updateUsersInJive: ['getSalesforceData', function (cb) {
            console.log("sdhbmdbfdfdf hdndsmfbf");
            userSyncingFile.updateJiveUser(res, users, function (err, result) {
                cb(null);

            });

        }],
        saveProfileLogs:['updateUsersInJive',function(cb) {
            // console.log("logs",accountLogs);
            fs.readFile(DIRNAME + '/metadata/profileLogs.json', 'utf8', function (unableToOpen, data) {

                savedLogs = JSON.parse(data);
                savedLogs = savedLogs.profileLogs;
                var finalLogs = savedLogs.concat(profileLogs);
                var x = {};
                x.profileLogs = finalLogs;
                x = JSON.stringify(x);
                fs.writeFile(DIRNAME + '/metadata/profileLogs.json', x, function (err, data) {
                    if (err) {
                        console.error('Unable to Update Account Logs Data', err);
                        res.send({
                            "message": "Some error occured due to non updation of account logs",
                            "status": 400
                        })
                    }
                    else {
                        console.log('profile logs.json updated !!');
                        cb(null);
                    }
                })

            });
        }]


    }, function (err, result) {
        if (err) {
            res.send("some error occured");
        }
        else {
            res.send("updated");
        }

    });
};


/*
 Cron Job for Syncing the Users/persons of Jive
 with Contacts in salesforce on daily basis
 depending on the conditions saved in UserSyncingData.json
 */
exports.croneForDailyContactUpdates = function (req, res) {
    var utcMoment = moment.utc();
    var utcDate = new Date(utcMoment.format());
    var previousDate = new Date(utcMoment.format());

    previousDate.setDate(utcDate.getDate() - 1);

    utcDate = utcDate.toISOString();
    previousDate = previousDate.toISOString();

    var userSyncingConditions;
    var users = [];

    async.auto({
        getUserSyncingData: function (cb) {
            userSyncingFile.getUserSyncingDataFromFile(res, 1, function (err, result) {
                if (err) {
                    res.send("some error occured");
                }
                else {
                    if (result.length) {
                        userSyncingConditions = result;
                        cb(null);
                    }
                    else {
                        res.send("no conditions for daily update");
                    }

                }

            });
        },
        getJiveData: ['getUserSyncingData', function (cb) {
            getJiveUsers(res, userSyncingConditions[0], utcDate, previousDate, function (err, result) {
                if (err) {
                    res.send("some error occured");
                }
                else {

                    users.push(result);
                    cb(null);
                }

            })
        }],
        updateUsersInSalesforce: ['getJiveData', function (cb) {
            userSyncingFile.updateContactsInSalesforce(res, users, function (err, result) {
                cb(null);

            });

        }],
        saveProfileLogs:['updateUsersInSalesforce',function(cb) {
            // console.log("logs",accountLogs);
            fs.readFile(DIRNAME + '/metadata/profileLogs.json', 'utf8', function (unableToOpen, data) {

                savedLogs = JSON.parse(data);
                savedLogs = savedLogs.profileLogs;
                var finalLogs = savedLogs.concat(profileLogs);
                var x = {};
                x.profileLogs = finalLogs;
                x = JSON.stringify(x);
                fs.writeFile(DIRNAME + '/metadata/profileLogs.json', x, function (err, data) {
                    if (err) {
                        console.error('Unable to Update Account Logs Data', err);
                        res.send({
                            "message": "Some error occured due to non updation of account logs",
                            "status": 400
                        })
                    }
                    else {
                        console.log('profile logs.json updated !!');
                        cb(null);
                    }
                })

            });
        }]


    }, function (err, result) {
        if (err) {
            res.send("some error occured");
        }
        else {
            res.send("updated");
        }

    });

};


/*
 Cron Job for Syncing the Users/persons of Jive
 with Contacts in salesforce on weekly basis
 depending on the conditions saved in UserSyncingData.json
 */
exports.croneForWeeklyContactUpdates = function (req, res) {
    var utcMoment = moment.utc();
    var utcDate = new Date(utcMoment.format());
    var previousDate = new Date(utcMoment.format());

    previousDate.setDate(utcDate.getDate() - 6);

    utcDate = utcDate.toISOString();
    previousDate = previousDate.toISOString();

    var userSyncingConditions;
    var users = [];

    async.auto({
        getUserSyncingData: function (cb) {
            userSyncingFile.getUserSyncingDataFromFile(res, 2, function (err, result) {
                if (err) {
                    res.send("some error occured");
                }
                else {
                    if (result.length) {
                        console.log("aithe");
                        userSyncingConditions = result;
                        cb(null);
                    }
                    else {
                        res.send("no conditions for daily update");
                    }

                }

            });
        },
        getJiveData: ['getUserSyncingData', function (cb) {
            getJiveUsers(res, userSyncingConditions[0], utcDate, previousDate, function (err, result) {
                if (err) {
                    res.send("some error occured");
                }
                else {
                    console.log("aithe fir se");
                    users.push(result);
                    cb(null);
                }

            })
        }],
        updateUsersInSalesforce: ['getJiveData', function (cb) {
            userSyncingFile.updateContactsInSalesforce(res, users, function (err, result) {
                cb(null);
            });

        }],
        saveProfileLogs:['updateUsersInSalesforce',function(cb) {
            // console.log("logs",accountLogs);
            fs.readFile(DIRNAME + '/metadata/profileLogs.json', 'utf8', function (unableToOpen, data) {

                savedLogs = JSON.parse(data);
                savedLogs = savedLogs.profileLogs;
                var finalLogs = savedLogs.concat(profileLogs);
                var x = {};
                x.profileLogs = finalLogs;
                x = JSON.stringify(x);
                fs.writeFile(DIRNAME + '/metadata/profileLogs.json', x, function (err, data) {
                    if (err) {
                        console.error('Unable to Update Account Logs Data', err);
                        res.send({
                            "message": "Some error occured due to non updation of account logs",
                            "status": 400
                        })
                    }
                    else {
                        console.log('profile logs.json updated !!');
                        cb(null);
                    }
                })

            });
        }]


    }, function (err, result) {
        if (err) {
            res.send("some error occured");
        }
        else {
            res.send("updated");
        }

    });

};


/*
 Gives the list of jive users based on the conditions set in UserSyncingData.json file
 INPUT: user syncing conditions, startdate , end data
 OUTPUT : Array of Jive Users based on conditions and date range
 */
function getJiveUsers(res, userSyncingConditions, utcDate, previousDate, callback) {

    var headers = {
        'Authorization': 'Bearer ' + jive1.access_token,
        'Content-Type': 'application/json'
    };

    var options = {
        url: jiveLoginUrl + '/api/core/v3/people?filter=updated(' + previousDate + ',' + utcDate + ')&fields=jive,addresses,id,emails,followerCount,followed,displayName,mentionName,followingCount,name,phoneNumbers',
        method: 'GET',
        headers: headers
    };

    console.log(options);
    request(options, function (err, response, data) {
        console.log(err);
        if (!err && response.statusCode == 200) {
            // console.log(data);
            data = JSON.parse(data);
            if (data.list.length) {

                var k = 0;

                function getAnalyticsData(k) {

                    if (k < data.list.length) {
                        getAnalyticsValues(data.list[k].emails[0].value,data.list[k], function (cb) {
                            k++;
                            getAnalyticsData(k);
                        });
                    }
                    else {
                        userSyncingConditions.data = data.list;

                       // res.send(userSyncingConditions);

                        callback(null,userSyncingConditions);
                    }
                }

                getAnalyticsData(0);

            }
            else {
                res.send("no users updated in last week");
            }

        }
        else {
            res.send("some error occured");
        }

    });


}


function  getAnalyticsValues(userEmail,userData,callback) {

    var analyticsHeader = { 'Authorization': analyticsAuthorizationHeader};

    async.parallel([
        function(cb){

            var analyticsOptions = {
                url: 'https://api.jivesoftware.com/analytics/v2/export/activity?filter=action(Create)&filter=user('+userEmail+')',
                method: 'GET',
                headers: analyticsHeader
            };

            request(analyticsOptions,function(err,response,data)
            {
                data = JSON.parse(data);
                userData.createdDocuments = data.paging.totalCount;
                cb();

            })

        },
        function(cb){
            var analyticsOptions = {
                url: 'https://api.jivesoftware.com/analytics/v2/export/activity?filter=action(Comment)&filter=user('+userEmail+')',
                method: 'GET',
                headers: analyticsHeader
            };

            request(analyticsOptions,function(err,response,data)
            {
                data = JSON.parse(data);
                userData.commentsCount = data.paging.totalCount;
                cb();

            })
        },
        function(cb){
            var analyticsOptions = {
                url: 'https://api.jivesoftware.com/analytics/v2/export/activity?filter=action(Like)&filter=user('+userEmail+')',
                method: 'GET',
                headers: analyticsHeader
            };

            request(analyticsOptions,function(err,response,data)
            {
                data = JSON.parse(data);
                userData.likesCount = data.paging.totalCount;
                cb();

            });

        },
        function(cb){
            var analyticsOptions = {
                url: 'https://api.jivesoftware.com/analytics/v2/export/activity?filter=action(Login)&filter=user('+userEmail+')',
                method: 'GET',
                headers: analyticsHeader
            };

            request(analyticsOptions,function(err,response,data)
            {
                data = JSON.parse(data);
                userData.loginCount = data.paging.totalCount;
                cb();

            });

        },
        function(cb){
            var analyticsOptions = {
                url: 'https://api.jivesoftware.com/analytics/v2/export/activity?filter=action(Logout)&filter=user('+userEmail+')',
                method: 'GET',
                headers: analyticsHeader
            };

            request(analyticsOptions,function(err,response,data)
            {
                data = JSON.parse(data);
                userData.logoutCount = data.paging.totalCount;
                cb();
            });

        }
    ],function(err,result)
    {
        callback(null);

    })

}
    /*
     Gives the list of salesforce contacts based on the conditions set in UserSyncingData.json file
     INPUT: user syncing conditions, startdate , end data
     OUTPUT : Array of Salesforce Contacts based on conditions and date range
     */
exports.getSalesforceContacts = function (res, userSyncingConditions, utcDate, previousDate, callback) {
    console.log("inside get contctsssdasd")
    var results = [];
    var dynamicQuery = "";
    var query = "";
    var conditions = userSyncingConditions.condition;
    var mapping = userSyncingConditions.mapping;
    var mappedFields = "";

    if (conditions.length) {

        if (userSyncingConditions.filterLogic != "") {

            for (var k = 0; k < conditions.length; k++) {
                var x = k + 1;
                var y = " " + conditions[k].field + " " + conditions[k].operator + " '" + conditions[k].value + "' ";
                dynamicQuery = userSyncingConditions.filterLogic.replace(x, y);
                console.log(dynamicQuery);
                userSyncingConditions.filterLogic = dynamicQuery;
            }

        }
        else{

            query = " " +conditions[0].field + " " + conditions[0].operator + " '" + conditions[0].value + "' ";

        }
    }

    console.log(dynamicQuery);
    query = query + dynamicQuery;

    mapping.forEach(function (result) {
        if (mappedFields.indexOf(result.salesforceField) == -1) {
            if (result.salesforceField != "Id") {
                mappedFields = mappedFields + result.salesforceField + " ,";
            }

        }
    });
    mappedFields = mappedFields.substring(0, mappedFields.length - 1);


    if (query != "") {
        var contactQuery = "select Id," + mappedFields + " from Contact where LastModifiedDate <= " + utcDate;
        contactQuery += " and LastModifiedDate >= " + previousDate + " and ( " + query + " )";

    }
    else {
        var contactQuery = "select Id," + mappedFields + " from Contact where LastModifiedDate <= " + utcDate;
        contactQuery += " and LastModifiedDate >= " + previousDate;

    }
    conn.query(contactQuery, function (err, result) {
        if (err) {
            console.log("error", err);
            res.send("some error occured");
        }
        else {

            if (result.totalSize != 0) {

                console.log("hello");
                userSyncingConditions.data = result.records;
                callback(null, userSyncingConditions);

            }
            else {
                res.send("no contacts matching");
            }
        }

    });

}


exports.updateContactsInSalesforce = function (res, filteredUserSyncingData, callback) {

    var i = 0;

    var usersLength = filteredUserSyncingData.length;
    console.log("length", usersLength);


    function getDataFunction(i) {

        if (i < usersLength) {
            getDataOfContact(res, filteredUserSyncingData[i], function (cb) {
                i++;
                getDataFunction(i);
            });
        }
        else {
            callback(null);
        }
    }

    getDataFunction(0);

};


function getDataOfContact(res, filteredUserSyncingData, callback) {
    var j = 0;

    function getData(j) {
        if (j < filteredUserSyncingData.data.length) {
            checkForContactInSalesforce(res, filteredUserSyncingData, filteredUserSyncingData.data[j], function (cb) {
                j++;
                getData(j);

            });

        }
        else {
            callback(null);

        }
    }

    getData(0);
}


/*
 Checks for the contacts in salesforce based on the Jive user email
 INPUT: Jive user data
 OUTPUT : Contact to be inserted or to be updated
 */
function checkForContactInSalesforce(res, userData, userValues, callback) {


    //console.log(userValues);
    var query = "select Id from Contact where Email = '" + userValues.emails[0].value + "'";
    //console.log(query);
    conn.query(query, function (err, result) {

        if (result.totalSize != 0) {
            console.log("updation to be done");
            updateContacts(res, userData, userValues, result.records[0].Id, callback);

        }
        else {
            console.log("insertion to be done");
            insertContacts(res, userData, userValues, callback);

        }

    })

}


/*
 Updates contacts in salesforce based on the Jive user email
 INPUT: Jive user data
 OUTPUT : Updation of contact
 */

function updateContacts(res, userData, userValues, contactId, callback) {

    var objectToInsert = {};

    var accountName = "";

    if (userData.accountNameMapping.userFieldMapping == false) {
        objectToInsert.accountId = userData.accountNameMapping.account;
        updateContactSalesforce();
    }
    else {
        if (userData.accountNameMapping.account == "displayName") {
            accountName = userValues.displayName;
        }
        else if (userData.accountNameMapping.account == "Email") {
            accountName = userValues.emails[0].value;
        }
        else if (userData.accountNameMapping.account == "familyName") {
            accountName = userValues.name.familyName;
        }
        else if (userData.accountNameMapping.account == "givenName") {
            accountName = userValues.name.givenName;
        }
        else if (userData.accountNameMapping.account == "followerCount") {
            accountName = userValues.followerCount;
        }
        else if (userData.accountNameMapping.account == "followed") {
            accountName = userValues.followed;
        }
        else if (userData.accountNameMapping.account == "id") {
            accountName = userValues.id;
        }
        else if (userData.accountNameMapping.account == "followingCount") {
            accountName = userValues.followingCount;
        }
        else if (userData.accountNameMapping.account == "Title") {

            if (userValues.jive.profile != undefined) {

                var titleIndex = lodash.findIndex(userValues.jive.profile, {"jive_label": "Title"});
                if (titleIndex != -1)
                {
                    accountName = userValues.jive.profile[titleIndex].value;
                }
                else{
                    accountName = "No Title found";
                }

            }
            else {
                accountName = "No Title found";
            }

        }

        else if (userData.accountNameMapping.account == "Department") {

            if (userValues.jive.profile != undefined) {

                var departmentIndex = lodash.findIndex(userValues.jive.profile, {"jive_label": "Department"});
                if (departmentIndex != -1)
                {
                    accountName = userValues.jive.profile[departmentIndex].value;
                }
                else{
                    accountName = "No Department found";
                }
            }
            else {
                accountName = "No Department found";
            }
        }


        else if (userData.accountNameMapping.account == "Address") {

            if (userValues.addresses != undefined) {

                accountName = userValues.addresses[0].value.formatted;
            }
            else {
                accountName = "No Address found";
            }
        }

        else if (userData.accountNameMapping.account == "Phone Number") {

            if (userValues.phoneNumbers != undefined) {

                accountName = userValues.phoneNumbers[0].value;
            }
            else {
                accountName = "No Phone Number found";
            }
        }

        conn.query("SELECT Id FROM Account where Name = '" + accountName + "'", function (err, result) {
            if (result.records.length) {

                objectToInsert.accountId = result.records[0].Id;
                updateContactSalesforce();

            }
            else {
                conn.sobject("Account").create({Name: accountName}, function (err, ret) {

                    objectToInsert.accountId = ret.id;
                    updateContactSalesforce();
                });

            }
        })

    }

    console.log("inside update contact function");

    function updateContactSalesforce() {
        objectToInsert.Id = contactId;


        userData.mapping.forEach(function (result) {

            if (parseInt(result.mappingType) != 0) {


                if (userValues[result.jiveField] != undefined) {
                    console.log("undefined");
                    objectToInsert[result.salesforceField] = userValues[result.jiveField];
                }

                else {

                    console.log("inside else condition");
                    if (userValues.addresses != undefined) {
                        if (userValues.addresses[0].jive_label == result.jiveField) {

                            console.log("inside addresses mapping");

                            if (result.salesforceField == "MailingAddress") {
                                objectToInsert.MailingCountry = userValues.addresses[0].value.country,
                                    objectToInsert.MailingPostalCode = userValues.addresses[0].value.postalCode,
                                    objectToInsert.MailingState = userValues.addresses[0].value.region,
                                    objectToInsert.MailingCity = userValues.addresses[0].value.locality
                                objectToInsert.MailingStreet = userValues.addresses[0].value.streetAddress

                            }
                            else {

                                objectToInsert.OtherCountry = userValues.addresses[0].value.country,
                                    objectToInsert.OtherPostalCode = userValues.addresses[0].value.postalCode,
                                    objectToInsert.OtherState = userValues.addresses[0].value.region,
                                    objectToInsert.OtherCity = userValues.addresses[0].value.locality,
                                    objectToInsert.OtherStreet = userValues.addresses[0].value.streetAddress
                            }

                        }
                        else {
                            console.log("address not matched");
                        }
                    }

                    if (userValues.emails[0].jive_label == result.jiveField) {
                        objectToInsert[result.salesforceField] = userValues.emails[0].value;
                    }

                    if (userValues.phoneNumbers != undefined) {
                        if (userValues.phoneNumbers[0].jive_label == result.jiveField) {
                            console.log("inside phone number mapping");
                            objectToInsert[result.salesforceField] = userValues.phoneNumbers[0].value;
                        }
                        else {
                            console.log("phone number not matched");
                        }
                    }

                    if (userValues.jive.profile != undefined) {


                        if (result.salesforceField == "Title") {
                            console.log("inside title mapping");
                            var titleIndex = lodash.findIndex(userValues.jive.profile, {"jive_label": "Title"});
                            if (titleIndex != -1)
                                objectToInsert[result.salesforceField] = userValues.jive.profile[titleIndex].value;

                        }
                        if (result.salesforceField == "Department") {
                            console.log("inside department mapping");

                            var departmentIndex = lodash.findIndex(userValues.jive.profile, {"jive_label": "Department"});
                            if (departmentIndex != -1)
                                objectToInsert[result.salesforceField] = userValues.jive.profile[departmentIndex].value;

                        }
                        else {
                            console.log("no title or deprtment")
                        }

                    }
                    else {
                        console.log("sfsdf");
                    }
                }
            }

        });


        objectToInsert.FirstName = userValues.name.givenName;
        objectToInsert.LastName = userValues.name.familyName;
        objectToInsert.Email = userValues.emails[0].value;


        console.log(objectToInsert);

        conn.sobject("Contact").update(objectToInsert, function (err, ret) {

            // console.log(err);
            // console.log(ret);

            if(err){
                err = JSON.stringify(err);
                profileLogs.push({
                    "message":err,
                    "userId": userValues.id,
                    "contactId":0,
                    "status" : "Updation Failure",
                    "timestamp": new Date()
                });

            }
            else {
                profileLogs.push({
                    "message":"Contact updated in Salesforce",
                    "userId": userValues.id,
                    "contactId":ret.id,
                    "status" : "Success",
                    "timestamp": new Date()
                });

            }



            callback(null);
        });
    }


}


/*
 Inserts contacts in salesforce
 INPUT: Jive user data
 OUTPUT : Insertion of contact
 */
function insertContacts(res, userData, userValues, callback) {


    var objectToInsert = {};
    var accountName = "";

    if (userData.accountNameMapping.userFieldMapping == false) {
        objectToInsert.accountId = userData.accountNameMapping.account;
        insertContactSalesforce();
    }
    else {
        if (userData.accountNameMapping.account == "displayName") {
            accountName = userValues.displayName;
        }
        else if (userData.accountNameMapping.account == "Email") {
            accountName = userValues.emails[0].value;
        }
        else if (userData.accountNameMapping.account == "familyName") {
            accountName = userValues.name.familyName;
        }
        else if (userData.accountNameMapping.account == "givenName") {
            accountName = userValues.name.givenName;
        }
        else if (userData.accountNameMapping.account == "followerCount") {
            accountName = userValues.followerCount;
        }
        else if (userData.accountNameMapping.account == "followed") {
            accountName = userValues.followed;
        }
        else if (userData.accountNameMapping.account == "id") {
            accountName = userValues.id;
        }
        else if (userData.accountNameMapping.account == "followingCount") {
            accountName = userValues.followingCount;
        }
        else if (userData.accountNameMapping.account == "Title") {
            if (userValues.jive.profile != undefined) {

                var titleIndex = lodash.findIndex(userValues.jive.profile, {"jive_label": "Title"});
                if (titleIndex != -1)
                {
                    accountName = userValues.jive.profile[titleIndex].value;
                }
                else{
                    accountName = "No Title found";
                }

            }
            else {
                accountName = "No Title found";
            }

        }

        else if (userData.accountNameMapping.account == "Department") {

            if (userValues.jive.profile != undefined) {

                var departmentIndex = lodash.findIndex(userValues.jive.profile, {"jive_label": "Department"});
                if (departmentIndex != -1)
                {
                    accountName = userValues.jive.profile[departmentIndex].value;
                }
                else{
                    accountName = "No Department found";
                }
            }
            else {
                accountName = "No Department found";
            }
        }
        else if (userData.accountNameMapping.account == "Address") {

            if (userValues.addresses != undefined) {

                accountName = userValues.addresses[0].value.formatted;
            }
            else {
                accountName = "No Address found";
            }
        }
        else if (userData.accountNameMapping.account == "Phone Number") {

            if (userValues.phoneNumbers != undefined) {

                accountName = userValues.phoneNumbers[0].value;
            }
            else {
                accountName = "No Phone Number found";
            }
        }
        conn.query("SELECT Id FROM Account where Name = '" + accountName + "'", function (err, result) {
            if (result.records.length) {

                objectToInsert.accountId = result.records[0].Id;
                insertContactSalesforce();

            }
            else {
                conn.sobject("Account").create({Name: accountName}, function (err, ret) {

                    objectToInsert.accountId = ret.id;
                    insertContactSalesforce();
                });

            }
        });
        // conn.sobject("Account").create({Name: accountName}, function (err, ret) {
        //
        //     console.log("Created record id : " + ret.id);
        //     objectToInsert.accountId = ret.id;
        //     insertContactSalesforce();
        // });


    }

    function insertContactSalesforce() {
        userData.mapping.forEach(function (result) {

            if (parseInt(result.mappingType) != 0) {

                if (userValues.addresses != undefined) {
                    if (userValues.addresses[0].jive_label == result.jiveField) {

                        console.log("inside addresses mapping");

                        if (result.salesforceField == "MailingAddress") {
                            objectToInsert.MailingCountry = userValues.addresses[0].value.country,
                                objectToInsert.MailingPostalCode = userValues.addresses[0].value.postalCode,
                                objectToInsert.MailingState = userValues.addresses[0].value.region,
                                objectToInsert.MailingCity = userValues.addresses[0].value.locality,
                                objectToInsert.MailingStreet = userValues.addresses[0].value.streetAddress

                        }
                        else {

                            objectToInsert.OtherCountry = userValues.addresses[0].value.country,
                                objectToInsert.OtherPostalCode = userValues.addresses[0].value.postalCode,
                                objectToInsert.OtherState = userValues.addresses[0].value.region,
                                objectToInsert.OtherCity = userValues.addresses[0].value.locality,
                                objectToInsert.OtherStreet = userValues.addresses[0].value.streetAddress
                        }


                    }
                    else {
                        console.log("address not matched");
                    }
                }

                if (userValues.emails[0].jive_label == result.jiveField) {
                    objectToInsert[result.salesforceField] = userValues.emails[0].value;
                }

                if (userValues.phoneNumbers != undefined) {
                    if (userValues.phoneNumbers[0].jive_label == result.jiveField) {
                        console.log("inside phone number mapping");
                        objectToInsert[result.salesforceField] = userValues.phoneNumbers[0].value;
                    }
                    else {
                        console.log("phone number not matched");
                    }
                }

                if (userValues.jive.profile != undefined) {


                    if (result.salesforceField == "Title") {
                        console.log("inside title mapping");
                        var titleIndex = lodash.findIndex(userValues.jive.profile, {"jive_label": "Title"});
                        if (titleIndex != -1)
                            objectToInsert[result.salesforceField] = userValues.jive.profile[titleIndex].value;

                    }
                    if (result.salesforceField == "Department") {
                        console.log("inside department mapping");

                        var departmentIndex = lodash.findIndex(userValues.jive.profile, {"jive_label": "Department"});
                        if (departmentIndex != -1)
                            objectToInsert[result.salesforceField] = userValues.jive.profile[departmentIndex].value;

                    }
                    else {
                        console.log("no title or deprtment")
                    }

                }
                else {
                    console.log("sfsdf");
                }
            }

        });
        objectToInsert.FirstName = userValues.name.givenName;
        objectToInsert.LastName = userValues.name.familyName;
        objectToInsert.Email = userValues.emails[0].value;
        console.log(objectToInsert);

        conn.sobject("Contact").create(objectToInsert, function (err, ret) {
            if(err){
                err = JSON.stringify(err)
                profileLogs.push({
                    "message":err,
                    "userId": userValues.id,
                    "contactId":0,
                    "status" : "Insertion Failure",
                    "timestamp": new Date()
                });

            }
            else {
                profileLogs.push({
                    "message":"Contact inserted in Salesforce",
                    "userId": userValues.id,
                    "contactId":ret.id,
                    "status" : "Success",
                    "timestamp": new Date()
                });

            }
            console.log(err);
            console.log(ret);
            callback(null);
        });

    }


}


/*
 Gets the data from userSyncingData.json file based on the frequency(real time, daily or weekly )
 INPUT: Frequency(0: real time , 1: daily , 2: weekly )
 OUTPUT : File Json
 */

exports.getUserSyncingDataFromFile = function (res, frequency, callback) {
    console.log("read data from file")
    var userSyncingData;
    fs.readFile(DIRNAME + '/metadata/userSyncingData.json', 'utf8', function (unableToOpen, data) {
        if (unableToOpen) {
            console.log('metadata/userSyncingData.json doesnt exists');
            res.send("some problem in userSyncingData.json file");
        } else if (data) {

            data = JSON.parse(data);
            userSyncingData = data.userSyncingData;
            if (!userSyncingData.length) {
                console.log("no file for real time syncing");
                res.send("no updations to be made");
            }
            else {
                userSyncingData = lodash.filter(userSyncingData, {frequency: frequency.toString()});
                callback(null, userSyncingData);
            }
        }
    });

};


exports.updateJiveUser = function (res, filteredUserSyncingData, callback) {


    headers = {
        'Authorization': 'Bearer ' + jive1.access_token,
        'Content-Type': 'application/json'
    };

    var i = 0;

    var contactsLength = filteredUserSyncingData.length;


    function getDataFunction(i) {

        if (i < contactsLength) {
            getDataOfUser(res, filteredUserSyncingData[i], function (cb) {
                i++;
                getDataFunction(i);
            });
        }
        else {
            callback(null);
        }
    }

    getDataFunction(0);

};


function getDataOfUser(res, filteredUserSyncingData, callback) {
    var j = 0;

    function getData(j) {
        if (j < filteredUserSyncingData.data.length) {
            checkForUserInJive(res, filteredUserSyncingData, filteredUserSyncingData.data[j], function (cb) {
                j++;
                getData(j);

            });

        }
        else {
            callback(null);

        }
    }

    getData(0);
}


/*
 Checks for Users in Jive for Contact email in salesforce
 INPUT: Salesforce Contact data
 OUTPUT : User to be inserted or updated
 */
function checkForUserInJive(res, contactData, contactValues, callback) {

    var options = {
        url: jiveLoginUrl + '/api/core/v3/people/email/' + contactValues.Email,
        method: 'GET',
        headers: headers
    };

    request(options, function (err, response, data) {
      data = JSON.parse(data);

        if (!err && response.statusCode == 200) {
            console.log("updation to be done");
            updateUserInJive(res, contactData, contactValues, data, callback);

        }
        else {
            console.log("insertion to be done");
            insertUserInJive(res, contactData, contactValues, callback);
        }

    })

}


/*
 Inserts users in jive
 INPUT: salesforce contact data
 OUTPUT : Insertion of user
 */
function insertUserInJive(res, contactData, contactValues, callback) {
    console.log("contact values in insertion",contactValues);
    var insertionOptions = {
        url: jiveLoginUrl + '/api/core/v3/people',
        method: 'POST',
        headers: headers,
        body: {
            "emails": [{
                "value": contactValues.Email,
                "jive_label": "Email"
            }],
            "jive": {
                "password": "paras@123",
                "username": contactValues.Email
            },
            "name": {
                "givenName":contactValues.FirstName,
                "familyName":contactValues.LastName
            }
        }
    };

    contactData.mapping.forEach(function (result) {

        if (parseInt(result.mappingType) != 1) {

            if (result.jiveField == "Title") {


                if (insertionOptions.body.jive.profile == undefined) {

                    insertionOptions.body.jive.profile = [];

                    var title = {
                        "jive_label": "Title",
                        "value": contactValues[result.salesforceField],
                        "jive_displayOrder": 0,
                        "jive_summaryDisplayOrder": 0,
                        "jive_showSummaryLabel": true
                    };
                    insertionOptions.body.jive.profile.push(title);
                }
                else {

                    var title = {
                        "jive_label": "Title",
                        "value": contactValues[result.salesforceField],
                        "jive_displayOrder": 0,
                        "jive_summaryDisplayOrder": 0,
                        "jive_showSummaryLabel": true
                    };
                    insertionOptions.body.jive.profile.push(title);

                }


            }

            if (result.jiveField == "Department") {

                if (insertionOptions.body.jive.profile == undefined) {
                    insertionOptions.body.jive.profile = [];
                    var department = {
                        "jive_label": "Department",
                        "value": contactValues[result.salesforceField],
                        "jive_displayOrder": 1,
                        "jive_summaryDisplayOrder": 1,
                        "jive_showSummaryLabel": true
                    };
                    insertionOptions.body.jive.profile.push(department);
                }
                else {
                    var department = {
                        "jive_label": "Department",
                        "value": contactValues[result.salesforceField],
                        "jive_displayOrder": 1,
                        "jive_summaryDisplayOrder": 1,
                        "jive_showSummaryLabel": true
                    };
                    insertionOptions.body.jive.profile.push(department);
                }


            }

            if (result.jiveField == "followerCount") {
                insertionOptions.body[result.jiveField] = contactValues[result.salesforceField];

            }

            if (result.jiveField == "followed") {
                insertionOptions.body[result.jiveField] = contactValues[result.salesforceField];
            }

            if (result.jiveField == "Address") {

                if (contactValues[result.salesforceField] != null) {
                    var addresses = {
                        "jive_label": "Address",
                        "type": "work",
                        "value": {
                            "country": contactValues[result.salesforceField].country,
                            "locality": contactValues[result.salesforceField].street,
                            "postalCode": contactValues[result.salesforceField].postalCode,
                            "region": contactValues[result.salesforceField].state,
                            "streetAddress": contactValues[result.salesforceField].street,
                            "formatted": contactValues[result.salesforceField].street
                        },
                        "jive_displayOrder": 8,
                        "jive_showSummaryLabel": false
                    };
                }
                insertionOptions.body.addresses = [];

                insertionOptions.body.addresses.push(addresses)

            }

            if (result.jiveField == "displayName") {
                insertionOptions.body[result.jiveField] = contactValues[result.salesforceField];

            }

            if (result.jiveField == "mentionName") {
                insertionOptions.body[result.jiveField] = contactValues[result.salesforceField];
            }

            if (result.jiveField == "followingCount") {
                insertionOptions.body[result.jiveField] = contactValues[result.salesforceField];
            }

            if (result.jiveField == "Phone Number") {
                var phoneNumbers = {
                    "jive_label": "Phone Number",
                    "primary": true,
                    "type": "work",
                    "value": contactValues[result.salesforceField],
                    "jive_displayOrder": 2,
                    "jive_summaryDisplayOrder": 3,
                    "jive_showSummaryLabel": true
                };
                insertionOptions.body.phoneNumbers = [];
                insertionOptions.body.phoneNumbers.push(phoneNumbers);

            }

            if (result.jiveField == "familyName") {
                insertionOptions.body.name[result.jiveField] = contactValues[result.salesforceField];
            }

            if (result.jiveField == "givenName") {
                insertionOptions.body.name[result.jiveField] = contactValues[result.salesforceField];
            }
        }

    });

    insertionOptions.body = JSON.stringify(insertionOptions.body);

    console.log(insertionOptions);


    request(insertionOptions, function (err, response, body) {

        console.log(body)
        if (!err && response.statusCode == 200) {

            console.log("success");

            profileLogs.push({
                "message":"User Inserted in jive ",
                "userId": body.id,
                "contactId":contactValues.Email,
                "status" : "Success",
                "timestamp": new Date()
            });
            callback(null);

        }
        else {

            body = JSON.parse(body);
            if(body.error){
                profileLogs.push({
                    "message":body,
                    "userId": 0,
                    "contactId":contactValues.Email,
                    "status" : "Insertion Failure",
                    "timestamp": new Date()
                });
                callback(null);
            }
            else{
                console.log(err);
                console.log(response);

                body = JSON.stringify(body);
                profileLogs.push({
                    "message":body,
                    "userId": 0,
                    "contactId":contactValues.Email,
                    "status" : "Insertion Failure",
                    "timestamp": new Date()
                });

                res.send(body);

            }




        }

    });

}


/*
 Updates users in jive based on the salesforce contact email
 INPUT: salesforce contact data
 OUTPUT : Updation of Jive User
 */
function updateUserInJive(res, contactData, contactValues, person, callback) {

    var updatedOptions = {
        url: jiveLoginUrl + '/api/core/v3/people/' + person.id + '',
        method: 'PUT',
        headers: headers,
        body: {
            "emails": [{
                "value": contactValues.Email,
                "jive_label": "Email"
            }],
            "jive": {
                "password": "paras@123",
                "username": contactValues.Email
            },
            "name": {
                "givenName":contactValues.FirstName,
                "familyName":contactValues.LastName
            }
        }
    };

    console.log(contactValues);

    contactData.mapping.forEach(function (result) {


        if (parseInt(result.mappingType) != 1) {

            if (result.jiveField == "Title") {

                if (person.jive.profile == "undefined") {
                    updatedOptions.body.jive.profile = [];

                    var title = {
                        "jive_label": "Title",
                        "value": contactValues[result.salesforceField],
                        "jive_displayOrder": 0,
                        "jive_summaryDisplayOrder": 0,
                        "jive_showSummaryLabel": true
                    };
                    updatedOptions.body.jive.profile.push(title);

                }
                else {

                    var titleIndex = lodash._.findIndex(person.jive.profile, {'jive_label': 'Title'});
                    if (titleIndex != -1) {
                        person.jive.profile[titleIndex].value = contactValues[result.salesforceField];
                        updatedOptions.body.jive.profile = person.jive.profile;
                    }
                    else {
                        var title = {
                            "jive_label": "Title",
                            "value": contactValues[result.salesforceField],
                            "jive_displayOrder": 0,
                            "jive_summaryDisplayOrder": 0,
                            "jive_showSummaryLabel": true
                        };
                        person.jive.profile.push(title);
                        updatedOptions.body.jive.profile = person.jive.profile;

                    }

                }

            }

            if (result.jiveField == "Department") {

                if (person.jive.profile == "undefined") {
                    updatedOptions.body.jive.profile = [];

                    var department = {
                        "jive_label": "Department",
                        "value": contactValues[result.salesforceField],
                        "jive_displayOrder": 1,
                        "jive_summaryDisplayOrder": 1,
                        "jive_showSummaryLabel": true
                    };
                    updatedOptions.body.jive.profile.push(department);

                }
                else {

                    var departmentIndex = lodash._.findIndex(person.jive.profile, {'jive_label': 'Department'});
                    if (departmentIndex != -1) {
                        person.jive.profile[departmentIndex].value = contactValues[result.salesforceField];
                        updatedOptions.body.jive.profile = person.jive.profile;

                    }
                    else {
                        var department = {
                            "jive_label": "Department",
                            "value": contactValues[result.salesforceField],
                            "jive_displayOrder": 0,
                            "jive_summaryDisplayOrder": 0,
                            "jive_showSummaryLabel": true
                        };
                        person.jive.profile.push(department);
                        updatedOptions.body.jive.profile = person.jive.profile;

                    }

                }
            }

            if (result.jiveField == "followerCount") {
                updatedOptions.body[result.jiveField] = contactValues[result.salesforceField];

            }

            if (result.jiveField == "followed") {
                updatedOptions.body[result.jiveField] = contactValues[result.salesforceField];
            }

            if (result.jiveField == "Address") {

                if (contactValues[result.salesforceField] != null) {


                    if (person.addresses == "undefined") {

                        var addresses = {
                            "jive_label": "Address",
                            "type": "work",
                            "value": {
                                "country": contactValues[result.salesforceField].country,
                                "locality": contactValues[result.salesforceField].street,
                                "postalCode": contactValues[result.salesforceField].postalCode,
                                "region": contactValues[result.salesforceField].state,
                                "streetAddress": contactValues[result.salesforceField].street,
                                "formatted": contactValues[result.salesforceField].street
                            },
                            "jive_displayOrder": 8,
                            "jive_showSummaryLabel": false
                        };
                        updatedOptions.body.addresses = [];
                        updatedOptions.body.addresses.push(addresses);

                    }
                    else {
                        var addresses = [{
                            "jive_label": "Address",
                            "type": "work",
                            "value": {
                                "country": contactValues[result.salesforceField].country,
                                "locality": contactValues[result.salesforceField].street,
                                "postalCode": contactValues[result.salesforceField].postalCode,
                                "region": contactValues[result.salesforceField].state,
                                "streetAddress": contactValues[result.salesforceField].street,
                                "formatted": contactValues[result.salesforceField].street
                            },
                            "jive_displayOrder": 8,
                            "jive_showSummaryLabel": false
                        }];
                        updatedOptions.body.addresses = addresses;

                    }
                }
            }

            if (result.jiveField == "displayName") {
                updatedOptions.body[result.jiveField] = contactValues[result.salesforceField];

            }

            if (result.jiveField == "mentionName") {
                updatedOptions.body[result.jiveField] = contactValues[result.salesforceField];
            }

            if (result.jiveField == "followingCount") {
                updatedOptions.body[result.jiveField] = contactValues[result.salesforceField];
            }

            if (result.jiveField == "Phone Number") {
                if (person.phoneNumbers == "undefined") {
                    var phoneNumbers = [{
                        "jive_label": "Phone Number",
                        "primary": true,
                        "type": "work",
                        "value": contactValues[result.salesforceField],
                        "jive_displayOrder": 2,
                        "jive_summaryDisplayOrder": 3,
                        "jive_showSummaryLabel": true
                    }];

                    updatedOptions.body.phoneNumbers = phoneNumbers;
                }
                else {
                    var phoneNumbers = [{
                        "jive_label": "Phone Number",
                        "primary": true,
                        "type": "work",
                        "value": contactValues[result.salesforceField],
                        "jive_displayOrder": 2,
                        "jive_summaryDisplayOrder": 3,
                        "jive_showSummaryLabel": true
                    }];
                    updatedOptions.body.phoneNumbers = phoneNumbers;
                }

            }

            if (result.jiveField == "familyName") {
                updatedOptions.body.name[result.jiveField] = contactValues[result.salesforceField];
            }

            if (result.jiveField == "givenName") {
                updatedOptions.body.name[result.jiveField] = contactValues[result.salesforceField];
            }

            if(result.jiveField == "Email"){
                console.log("dfdfsdf");
            }
        }
    });

    updatedOptions.body = JSON.stringify(updatedOptions.body);
    request(updatedOptions, function (error, response, data) {
        if (!error && response.statusCode == 200) {
            console.log(error);
            console.log(data);
            data = JSON.parse(data);
            profileLogs.push({
                "message":"User Updated in jive ",
                "userId": data.id,
                "contactId":contactValues.Email,
                "status" : "Success",
                "timestamp": new Date()
            });
            callback(null);

        }
        else {
            data = JSON.parse(data);
            if(data.error.message){
                profileLogs.push({
                    "message":data.error.message,
                    "userId": 0,
                    "contactId":contactValues.Email,
                    "status" : "Updation Failure",
                    "timestamp": new Date()
                });
                callback(null);
            }
            else{
                console.log("here");
                console.log(error);
                console.log(response);
                data = JSON.stringify(data);
                console.log("data....",data);
                profileLogs.push({
                    "message":data,
                    "userId": 0,
                    "contactId":contactValues.Email,
                    "status" : "Updation Failure",
                    "timestamp": new Date()
                });
                res.send(data);
            }
        }


    });
}
