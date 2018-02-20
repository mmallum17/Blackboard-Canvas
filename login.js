const https = require('https');
const querystring = require('querystring');

const postData = querystring.stringify({
    'user_id': 'mmmallum',
    'password': 'NannerLover17'
});

const options = {
    hostname: 'blackboard.unomaha.edu',
    port: 443,
    path: '/webapps/login/?action=login',
    method: 'POST',
    headers: {
        'Accept': '*/*',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
    }
};

const req = https.request(options, (res) => {
    console.log('statusCode:', res.statusCode);
console.log('headers:', res.headers);

res.on('data', (d) => {
    process.stdout.write(d);
});
});

req.on('error', (e) => {
    console.error(e);
});

req.write(postData);
req.end();