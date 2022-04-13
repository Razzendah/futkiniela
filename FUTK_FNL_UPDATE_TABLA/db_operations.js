let AWS = require('aws-sdk');
let docClient = new AWS.DynamoDB.DocumentClient();

let partidosDB = async () => {
	let partidos = await docClient.scan({
		TableName: "FUTK_UCL_PARTIDOS",
		Select: "ALL_ATTRIBUTES"
	}).promise();

	// obtener valores de respuesta de BD
	// filtrar solo los partidos con estatus 0 'en progreso' o 1 'finalizado'
	return partidos.Items.filter(p => p.status === 0 || p.status === 1);
}

let pronosticosDB = async (partidos) => {
	let pronosticos = await docClient.scan({
		TableName: "FUTK_UCL_FORECAST",
		Select: "ALL_ATTRIBUTES"
	}).promise()

	// obtener valores de respuesta de BD
	// filtrar solo los pronosticos de los partidos finalizados o en progreso
	return pronosticos.Items.filter(p => p.idpartido < partidos.length + 1);
}

let tablaDB = async (paramsTabla) => {
	return docClient.put(paramsTabla).promise();
}

module.exports = {
	pronosticosDB: pronosticosDB,
	partidosDB: partidosDB,
	tablaDB: tablaDB
}

