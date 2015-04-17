var express = require('express');
var app = express();
var swig = require('swig');
var req = require('request');

var credentials = {
	client_id: '92GAdGEj29p9Ms5BbJvP1HeYLfcPeJQn',
	client_secret: 's3vdC6LDRnuPVQYI8HHrZfInKmJpYLBq',
	redirect_uri: 'https://emoji-playlist.herokuapp.com/callback',
	domain: 'https://new.onetune.fm'
}

app.engine('html', swig.renderFile);

app.set('view engine', 'html');
app.set('views', __dirname + '/views');

app.set('view cache', false);
swig.setDefaults({ cache: false });

app.use('/emoji', express.static(__dirname + '/emoji'))

app.get('/', function (request, response) {
	response.render('index', credentials)
});

app.get('/callback', function (request, response) {
	if (request.query.error) {
		if (request.query.error == 'access_denied') {
			return response.end('User has declined')
		}
		else if (request.query.error == 'invalid_grant') {
			return response.end('Code has expired')
		}
		else {
			return response.end('Unknown error');
		}
	}
	else {
		req.post(credentials.domain + '/api/v2/oauth/token', {
			form: {
				'grant_type': 'authorization_code',
				'code': request.query.code,
				'client_id': credentials.client_id,
				'client_secret': credentials.client_secret
			}
		}, function (http, httpResponse, body) {
			response.redirect('/emoji?access_token=' + JSON.parse(body).access_token)
		});
	}
});

app.get('/emoji', function (request, response) {
	response.render('select', {
		'token': request.query.access_token,
		'credentials': credentials
	})
})

app.listen(process.env.PORT || 3000)