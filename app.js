var express = require('express');
var bodyParser = require('body-parser');
var mailer = require('express-mailer');

var app = express();

mailer.extend(app, {
    from: 'maushe4ka@gmail.com',
    host: 'smtp.gmail.com', // hostname
    secureConnection: true, // use SSL
    port: 465, // port for secure SMTP
    transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
    auth: {
        user: 'maushe4ka@gmail.com',
        pass: 'kos542910'
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

    console.log(emailObj);

    res.mailer.send('email', {
        to: 'kostiantyn.koval@gmail.com', // REQUIRED. This can be a comma delimited string just like a normal email to field.
        subject: 'Contact Message', // REQUIRED.
        otherProperty: emailObj
    }, function (err) {
        if (err) {
            // handle error
            console.error(err);
            res.send('There was an error sending the email');
            return;
        }
        res.send('Email Sent');
    });
});

app.listen(3001, function () {
    console.log('server started on port 3001...');
});