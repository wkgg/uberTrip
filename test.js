var request = require('request');

var data = {"start_latitude": 39.98408,"start_longitude": 116.315811, "end_latitude": 39.929937,"end_longitude": 116.584917};
var options = {
  'url': 'https://sandbox-api.uber.com.cn/v1/requests',
  'headers': {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZXMiOlsicmVxdWVzdCJdLCJzdWIiOiI0YWZmN2UwZC0zNWEyLTRlN2UtYmYxNy1jODA2NjIwYjgxNjUiLCJpc3MiOiJ1YmVyLWNuMSIsImp0aSI6ImNkNGRiNDk1LThjYTQtNDY1ZS04Mjc2LTY0OTYyMTFlY2Q1OCIsImV4cCI6MTQ1NTUzNTY4NiwiaWF0IjoxNDUyOTQzNjg1LCJ1YWN0IjoiaUF0RnZiSXBSeDhOTUg5dWdsU2xsMXNpVU40c0h0IiwibmJmIjoxNDUyOTQzNTk1LCJhdWQiOiJjbUxETWtaNGNyOXJpdkdsUGQ4WjZBUU0tZ2R3aVUydCJ9.sXyIREP46oSdj__RcNh0lv4D6huWMhTDc31WymHN1VpqfSE_ayGmVCHJ7ZxgpWf9oPfCjIQvCsLUgbYCVH-fhDJ5KxCrIRk18P3H-kILto7cdFuEXUddefcRdfS8YXUz47K5gwCNR7JOqHmrFe5MozX-H7BMICzBDU549_1CEgsx8pgl5E6n6ecw7_FgDdYBx5LezuAqJT2bmPF8JaLTVeuVEI7CGAeJujgciTfamof-pNDFKu7PMgiV7qQCAPCWb_g7ygoMya-Z6NBdLHdi1cd7AL8ld10T4gI8JVvF1FeZpwBsFDzosIde7XiEW6YLmJiXjVihbk-aLmKV7JWSZA'
  },
  'json': {
    'start_latitude': 39.98408,
    'start_longitude': 116.315811,
    'end_latitude': 39.929937,
    'end_longitude': 116.584917
  }
}
request.post(options,function(e,r,result){
            console.log("e", e);
            console.log("r", r);
            console.log("body", result);
    });