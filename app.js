var express = require('express');
var bodyParser = require('body-parser');
var mailer = require('express-mailer');
var validator = require('validator');

var app = express();

mailer.extend(app, {
    from: 'support@smart-itpro.com',
    host: 'smtp.office365.com', // hostname
    secureConnection: false, // use SSL
    port: 587, // port for secure SMTP
    transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
    auth: {
        user: 'support@smart-itpro.com',
        pass: 'X%lLm6%BSr5SPB'
    }
});

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');



app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


app.post('/send-email', function (req, res) {
    var emailObj = req.body;
    var editedObj = {};

    for (var keyName in emailObj) {
        editedObj[keyName] = validator.trim(emailObj[keyName]);
        editedObj[keyName] = validator.escape(editedObj[keyName]);
    }

    if (!validator.isEmail(editedObj['email'])||validator.isEmpty(editedObj['personName'])||validator.isEmpty(editedObj['companyName'])) {
        res.send({message: "Error! Fields did not pass validation on the server!", code: 500});
        return;
    }

    res.mailer.send('email', {
        to: 'support@smart-itpro.com', // REQUIRED. This can be a comma delimited string just like a normal email to field.
        subject: 'Contact Message', // REQUIRED.
        otherProperty: editedObj
    }, function (err) {
        if (err) {
            res.send({message: "Sorry, there was an error sending this email. Please try again later", code: 400, error: err});
            return;
        }
        res.send({message: "Thank you. Email was sent successfully", code: 200});
    });
});

app.listen(8823, function () {
    console.log('server started on port 8823...');
});