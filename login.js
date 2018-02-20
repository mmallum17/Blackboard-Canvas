const https = require('https');
const querystring = require('querystring');
const tough = require('tough-cookie');

let Cookie = tough.Cookie;
let cookies;
let cookieHeader = '';

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
    if(res.headers['set-cookie'] instanceof Array){
        cookies = res.headers['set-cookie'].map(Cookie.parse);
    }
    else{
        cookies = [Cookie.parse(res.headers['set-cookie'])];
    }
    if(cookies instanceof Array){
        let tempArr = [];
        for(let i = 0; i < cookies.length; i++) {
            let key = cookies[i].key;
            tempArr[key] = cookies[i].cookieString();
        }
        for(let key in tempArr){
            cookieHeader += tempArr[key] + '; ';
            console.log(tempArr[key]);
        }
        cookieHeader = cookieHeader.slice(0, -2);

        /*console.log(tempArr);
        cookieHeader = tempArr.join('; ');*/
    }
    else {
        cookieHeader = cookies.cookieString();
    }

    options.method = 'GET';
    options.path = '/learn/api/public/v1/courses';
    delete options['headers'];
    options.headers = {'Cookie': cookieHeader};
    // options.headers = {'Cookie':  'JSESSIONID=4036BC12AFF0F39FE8115E03E5CF84FE; session_id=699DDDE0E718A8E69E4A51E74C770D75; s_session_id=E85204C9AAE2E7B8C07086388456FF7E; web_client_cache_guid=2bbe930c-5a29-4cf6-8c49-758a5dadf898;  NSC_100051_wjq_69.196.228.1*443=ffffffff090d12da45525d5f4f58455e445a4a4229a0'};

    console.log(options);

    const getReq = https.request(options, (res) => {
        console.log('statusCode:', res.statusCode);
        console.log('headers:', res.headers);
        res.on('data', (d) => {
           process.stdout.write(d);
        });
    });

    getReq.on('error', (e) => {
       console.error(e);
    });
    getReq.end();

/*res.on('data', (d) => {
    process.stdout.write(d);
});*/
});
req.on('error', (e) => {
    console.error(e);
});
req.write(postData);
req.end();

