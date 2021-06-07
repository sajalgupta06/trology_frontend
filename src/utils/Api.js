import config from "../config.json";
import aws4 from "aws4";
import AWS from "aws-sdk";
import https from "https";
import { refreshAwsCredentials } from "./AuthUtil.js";
import _ from "lodash";

function jsonStringify(obj) {
  // indent spaces: 2
  return JSON.stringify(obj, null, 2);
}



export async function apiRequest(method, path, body, follow) {
  // Use proper REST API host depending on path. We have 2 REST API stacks.
  // Todo: Remove the fallback apiHost later.
  var host = '';
  var opts = {};
  console.log('apiRequest.params', {method, path, follow});

  // if(!isXebraCall) {
    host = config.apiHost;
    opts = {
      service: "execute-api",
      host: host,
      path: "/" + config.stage + path, // Include query string if exists.
      region: config.aws.region,
      method: method,
      headers: { "content-type": "application/json" }
    };

    if (body) {
      if (typeof body !== "string") body = JSON.stringify(body);
      opts.body = body;
    }

    // Refresh AWS credentials if it had expired.
    await refreshAwsCredentials();

    AWS.config.region = config.aws.region;
    console.log('AWS.config.credentials', AWS.config.credentials);
    aws4.sign(opts, AWS.config.credentials);

  console.log("apiRequest opts:", opts);
  var apiResult = {};

  let promise = new Promise(function(resolve, reject) {
    var req = https.request(opts, function(res) {
      res.setEncoding("utf8");
      apiResult.data = "";
      res.on("data", function(chunk) {
        apiResult.data += chunk;
      });
      res.on("end", async function() {
        apiResult.statusCode = +res.statusCode;
        if (+res.statusCode !== 200) {
          reject(jsonStringify(apiResult));
        } else {
          let data = apiResult.data;
          if (follow && data.length > 0 && data.length < 10000) {
            try {
              data = JSON.parse(data);
            }
            catch(err){
              console.log('Ignoring apiRequest followURL processing error.');
              apiResult.failedFollowURL = data.followURL;
            }
          }
          resolve(jsonStringify(apiResult));
        }
      });
    });

    // What to do on error at client side.
    // If browser blocks API call due to cors, it fails here.
    req.on("error", function(e) {
      // apiResult.error = 'Problem with execute API request: ' + e.message;
      apiResult.error = e.message;
      reject(jsonStringify(apiResult));
      console.log("Problem with execute API request: " + e.message);
    });

    // The write() or end() will trigger the real action.
    if (body) req.write(body);
    req.end();
  });

  return promise;
}
