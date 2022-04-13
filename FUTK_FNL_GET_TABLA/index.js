let AWS = require('aws-sdk');
let docClient = new AWS.DynamoDB.DocumentClient();

/*
Fut Kiniela
apigateway + lambda + android app

Se guardan los partidos en dynamodb y se consultan con la app
*/
exports.handler = async (event) => {

	let tablaPosiciones = ""

	let params = {
		TableName: "FUTK_UCL_TABLA",
		Select: "ALL_ATTRIBUTES",
		Item: {
			sortKey: 'puntos'
		}
	}

	tablaPosiciones = await docClient.scan(params).promise()

	return {
		statusCode: 200,
		body: tablaPosiciones
	}
};
