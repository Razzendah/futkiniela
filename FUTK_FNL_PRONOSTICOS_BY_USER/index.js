let AWS = require('aws-sdk');
let docClient = new AWS.DynamoDB.DocumentClient();

/*
Fut Kiniela
apigateway + lambda + android app

Se guardan los partidos en dynamodb y se consultan con la app
*/
exports.handler = async (event) => {

	let usuario = event.pathParameters.usuario
	let pronosticosUser = ""

	let params = {
		TableName: "FUTK_UCL_FORECAST",
		FilterExpression: 'usuario = :this_user',
		ExpressionAttributeValues: { ':this_user': usuario }
	}

	pronosticosUser = await docClient.scan(params).promise()

	return {
		"statusCode": 200,
		"isBase64Encoded": false,
		"headers": {
			"Access-Control-Allow-Origin": "*", // Required for CORS support to work
			"Access-Control-Allow-Credentials": true,
			"Content-Type": "application/json"
		},
		"body": JSON.stringify(pronosticosUser)
	}

};
