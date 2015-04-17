# oauth-example
This is an example on how to use the onetune.fm OAuth API for creating apps. It is written in node.js but you can use any language you want. 

## 1. Creating an app.
I'm going to http://new.onetune.fm/developers and create a new app. I'm going to name it "Emoji playlist", because it will let the user choose a emoji and create a playlist accordingly. I also added a short slogan and specified a redirect URL. Because I will run my app locally for now, my redirect URL will be 'http://127.0.0.1/callback' Instead of 'localhost', you have to use '127.0.0.1', because localhost does not pass the validator as it is technically not a valid URL. For your production site, create a seperate app. 

![Creating an app](http://i.imgur.com/hKxm0M9.png)

## 2. Getting the client_id and client_secret
The app now appears on the left. Click 'Show credentials' to make the client_id and client_secret appear. For me, it looks like this:

![App details](http://i.imgur.com/fJ2dRPR.png)

We will use these values later!

## 3. Create your webapp
I'm running my web app on localhost:3000 - you can find it in this Github repo! Run the server using `node index.js`. Make sure you've changed the client_id, client_secret and redirect_uri at the top of index.js.

To initiate the authentication process, put a link on the website that redirects to this URL:

````
http://new.onetune.fm/api/v2/oauth/authorize?client_id={{your_client_id}}&redirect_uri={{your_redirect_uri}}
````
I'm gonna name the link "Login with onetune.fm", I suggest that you do something similar.
Note: The redirect URI needs to be the same as the one you specified in the onetune.fm developer page. Otherwise you'll receive an error message.

After the user clicked the link, he or she will be presented with a dialog that looks like this: 

![Auth dialog](http://i.imgur.com/vN4oTxH.png)

There are two possible outcomes: The user either grants or denies your app access. In all cases, the user will get redirected to your redirect URI. 

In my case, if the user denies your app access, onetune.fm will redirect to `http://127.0.0.1:3000/callback?error=access_denied&error_description=The%20user%20denied%20access%20to%20your%20application&code=500`, and if access is granted to `http://127.0.0.1:3000/callback?code={{authCode}}`. Your application needs to handle both cases. In my node.js app, I did it like this: 

````javascript
app.get('/callback', function (request, response) {
	if (request.query.error) {
		if (request.query.error == 'access_denied') {
			return response.end('User has declined')
		}
		else if (request.query.error == 'invalid_grant') {
			return response.end('Invalid grant')
		}
		else {
			return response.end('Unknown error');
		}
	}
	else {
	  // Continue with step 4...
	  }
});
````

## 4. Exchanging the received code for an access_token
To receive the code, you need to read the URL parameter in your callback code. In node.js, this is `request.query.code`, in PHP it is `$_GET["code"]`. 
This code is only valid for 30 seconds. Within that timeframe, you need to exchange it for an access token and then user that access token to sign all future requests for that user.

To make this exchange, send a HTTP POST request to `http://new.onetune.fm/api/v2/oauth/token` and send the following data to our onetune.fm server which will create an access_token for you. This is the Javascript version of the code. If you need assistance making it work in your preferred language, you can always hit us up at info@onetune.fm and we will be glad to help you.

````javascript
req.post(credentials.domain + '/api/v2/oauth/token', {
			form: {
				'grant_type': 'authorization_code',
				'code': request.query.code,
				'client_id': your_client_id,
				'client_secret': your_client_secret
			}
		}, function (http, httpResponse, body) {
		  var json = JSON.parse(body)
		  var access_token = json.access_token
			// Access token received!
		});
````

