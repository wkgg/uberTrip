var request = require('request');
var getTimePrice = function( callback ){

    var x=39.979785,y=116.310304;//中关村
    var sx=40.005254,sy=116.486406;//望京

    var headers = {
		'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZXMiOlsicmVxdWVzdCJdLCJzdWIiOiI0YWZmN2UwZC0zNWEyLTRlN2UtYmYxNy1jODA2NjIwYjgxNjUiLCJpc3MiOiJ1YmVyLWNuMSIsImp0aSI6ImNkNGRiNDk1LThjYTQtNDY1ZS04Mjc2LTY0OTYyMTFlY2Q1OCIsImV4cCI6MTQ1NTUzNTY4NiwiaWF0IjoxNDUyOTQzNjg1LCJ1YWN0IjoiaUF0RnZiSXBSeDhOTUg5dWdsU2xsMXNpVU40c0h0IiwibmJmIjoxNDUyOTQzNTk1LCJhdWQiOiJjbUxETWtaNGNyOXJpdkdsUGQ4WjZBUU0tZ2R3aVUydCJ9.sXyIREP46oSdj__RcNh0lv4D6huWMhTDc31WymHN1VpqfSE_ayGmVCHJ7ZxgpWf9oPfCjIQvCsLUgbYCVH-fhDJ5KxCrIRk18P3H-kILto7cdFuEXUddefcRdfS8YXUz47K5gwCNR7JOqHmrFe5MozX-H7BMICzBDU549_1CEgsx8pgl5E6n6ecw7_FgDdYBx5LezuAqJT2bmPF8JaLTVeuVEI7CGAeJujgciTfamof-pNDFKu7PMgiV7qQCAPCWb_g7ygoMya-Z6NBdLHdi1cd7AL8ld10T4gI8JVvF1FeZpwBsFDzosIde7XiEW6YLmJiXjVihbk-aLmKV7JWSZA',
		'Content-Type': 'application/json',
		'Accept': 'application/json'
	};

    var api = 'https://sandbox-api.uber.com.cn/v1/estimates/';

    var list = {
    	price : {
    		start_latitude:sx,
    		start_longitude:sy,
    		end_latitude:x,
    		end_longitude:y
    	},
    	time :{
    		start_latitude:x,
    		start_longitude:y,
    	}
    }

    var price_query = [];
    var time_query = [];

    for(var i in list.price){
    	price_query.push( i+'='+list.price[i] );
    }

    for(var i in list.time){
    	time_query.push( i+'='+list.time[i] );
    }


    request({
        url: api + 'price?' + price_query.join('&'),
        headers : headers
    },function(error, response, result){
    	
    	result = JSON.parse(result);

    	time_query.push('product_id='+result.prices[0]['product_id']);

    	request({
            url: api + 'time?' + time_query.join('&'),
            headers : headers
        },function(error, response, res){

        	console.log(api + 'time?' + time_query.join('&'))

    		res = JSON.parse(res);

    		console.log(res)

    		var time = res && res.times[0] && res.times[0]['estimate'] || '';
    		var estimate = result && result.prices[0] && result.prices[0]['estimate'] || '';
    		var display_name = result && result.prices[0] && result.prices[0]['display_name'] || '';

    		callback.call(null,{
    			'time': Math.floor(time/60+0.99999) + '分钟',
    			'estimate' : estimate.replace('CN',''),
    			'display_name' : display_name
    		});

            console.log('time: ',Math.floor(time/60+0.99999) + '分钟', ' estimate: ' , estimate.replace('CN',''), ' display_name: ', display_name);
        })
    })

}
exports.getTimePrice = getTimePrice;
