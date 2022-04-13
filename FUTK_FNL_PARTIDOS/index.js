let AWS = require('aws-sdk');
let docClient = new AWS.DynamoDB.DocumentClient();

/*
Fut Kiniela
conectada con apigateway para obtener los partidos
apigateway + lambda + android app

Se guardan los partidos en dynamodb y se consultan con la app
*/

exports.handler = async (event) => {
	let partidos = ""
	let params = {
		TableName: "FUTK_UCL_PARTIDOS",
		Select: "ALL_ATTRIBUTES"
	}

	partidos = await docClient.scan(params).promise()

	return {
		statusCode: 200,
		headers: {
			"Access-Control-Allow-Origin": "*"
		},
		body: partidos
	}
}
