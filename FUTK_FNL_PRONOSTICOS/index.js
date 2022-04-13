let AWS = require('aws-sdk');
let docClient = new AWS.DynamoDB.DocumentClient();

/*
Fut Kiniela
apigateway + lambda + android app

Se guardan los partidos en dynamodb y se consultan con la app
*/
exports.handler = (event) => {
	console.log("event ", event)
	console.log("stringify ", JSON.stringify(event))

	let pronosticos = JSON.parse(JSON.stringify(event))

	pronosticos.partidos.forEach(p => {
		insertar(p, pronosticos.usuario)
	})

	return {
		statusCode: 200,
		headers: {
			"Access-Control-Allow-Origin": "*"
		}
	}
}

let insertar = (p, usuario) => {
	let params = {
		TableName: "FUTK_UCL_FORECAST",
		Item: {
			"usuario": usuario,
			"idpartido": p.idpartido,
			"local": p.local,
			"visitante": p.visitante
		}
	}

	docClient.put(params, (err, data) => {
		if (err)
			console.log("No se pudo insertar:", err)
		else
			console.log("Insertado")
	})

	return true
}
