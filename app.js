

var express = require('express'),
    http = require('http'),
    https = require('https'),
    path = require('path'),
    jsforce = require('jsforce'),
    cookieParser = require('cookie-parser');
    session = require('express-session'),
    xmlparser = require('express-xml-bodyparser');
    request = require('request');



jive = require('jive-sdk');
moment = require('moment');
lodash = require('lodash');
fs = require('fs');
async = require('async');
https = require('https');
conn={};



 croneForAccountProvisioning = require('./routes/accountProvisioningCrone');
 croneForUserSyncing = require('./routes/userSyncingCrone');
 


var app = express();
app.use(cookieParser());



app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

var options = {

    key: fs.readFileSync('/usr/local/ssl/certificates/connectors-grazitti-com.key'),

    cert: fs.readFileSync('/usr/local/ssl/certificates/connectors-grazitti-com.crt'),

    ca: [ fs.readFileSync('/usr/local/ssl/certificates/intermediate.crt') ]

};

var failServer = function(reason) {
    console.log('FATAL -', reason);
    process.exit(-1);
};

var startServer = function() {
    if (!jive.service.role || jive.service.role.isHttp()) {
        var server = https.createServer(options,app).listen( app.get('port') || 8090, app.get('hostname') || undefined, function () {
            console.log("Express server listening on " + server.address().address +':'+server.address().port);
        });
        GLOBAL_SERVER = server;
    }
};
DIRNAME = __dirname;

admin = JSON.parse(fs.readFileSync('metadata/admin.json', 'utf-8').toString());
jiveCredentials = JSON.parse(fs.readFileSync('metadata/jiveCredentials.json', 'utf-8').toString());



app.get('/dailyCroneForAccountProvisioning',croneForAccountProvisioning.croneForDailyAccountUpdates);
app.get('/weeklyCroneForAccountProvisioning',croneForAccountProvisioning.croneForWeeklyAccountUpdates);

app.get('/dailyCroneForUserSyncing',croneForUserSyncing.croneForDailyUserUpdates);
app.get('/weeklyCroneForUserSyncing',croneForUserSyncing.croneForWeeklyUserUpdates);


app.get('/dailyCroneForContactsSyncing',croneForUserSyncing.croneForDailyContactUpdates);
app.get('/weeklyCroneForContactsSyncing',croneForUserSyncing.croneForWeeklyContactUpdates);





var salesforceConnect = require('./services/salesforceConnect.js');

var jiveConnect = require('./services/jiveConnect');

jive.service.init(app)


.then( function() { return jive.service.autowire() } )


.then( function() { return jive.service.start() } ).then( startServer, failServer );

