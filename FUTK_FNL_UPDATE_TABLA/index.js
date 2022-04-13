const util = require('db_operations')

/*
Fut Kiniela
apigateway + lambda + android app

Se guardan los partidos en dynamodb y se consultan con la app
*/
exports.handler = async (event) => {

	let tabla = [];

	// llamar de bd todos los partidos y pronosticos
	let partidos = await util.partidosDB();
	let pronosticos = await util.pronosticosDB(partidos);

	let puntos = 0;
	let cont = 0;
	pronosticos.forEach(i => {
		if (tabla.length > 0 && tabla.filter(t => t.usuario === i.usuario).length > 0) {
			let tablaUsuario = tabla.filter(t => t.usuario === i.usuario)[0];
			let partido = partidos.filter(p => p.id === i.idpartido)[0];
			if ((partido.localGoles + "-" + partido.visitanteGoles) === (i.local + "-" + i.visitante)) // le atinó al resultado
				tablaUsuario.puntos += 3;
			else if (partido.localGoles === partido.visitanteGoles && i.local === i.visitante) // le atinó empate
				tablaUsuario.puntos += 2;
			else if (partido.localGoles > partido.visitanteGoles && Number(i.local) > Number(i.visitante)) // gana local
				tablaUsuario.puntos += 2;
			else if (partido.localGoles < partido.visitanteGoles && Number(i.local) < Number(i.visitante)) // gana visitante
				tablaUsuario.puntos += 2;
			else
				tablaUsuario.puntos += 0;
		} else {
			let partido = partidos.filter(p => p.id === i.idpartido)[0];
			if ((partido.localGoles + "-" + partido.visitanteGoles) === (i.local + "-" + i.visitante)) // le atinó al resultado
				puntos = 3;
			else if (partido.localGoles === partido.visitanteGoles && i.local === i.visitante) // le atinó empate
				puntos = 2;
			else if (partido.localGoles > partido.visitanteGoles && Number(i.local) > Number(i.visitante)) // gana local
				puntos = 2;
			else if (partido.localGoles < partido.visitanteGoles && Number(i.local) < Number(i.visitante)) // gana visitante
				puntos = 2;
			else
				puntos = 0;

			tabla.push({
				"usuario": i.usuario,
				"puntos": puntos
			});
		}
	});

	let paramsTabla = {
		TableName: "FUTK_UCL_TABLA",
		Item: {

		}
	};

	tabla = tabla.sort((a, b) => b.puntos > a.puntos);

	for (let row = 0; row < tabla.length; row++) {
		paramsTabla.Item.usuario = tabla[row].usuario;
		paramsTabla.Item.puntos = tabla[row].puntos;
		paramsTabla.Item.posicion = tabla[row].posicion;
		await util.tablaDB(paramsTabla);
	}

	console.log("partidosActuales", JSON.stringify(partidos));
	console.log("tabla", JSON.stringify(tabla))
	console.log("pronosticos", JSON.stringify(pronosticos))

	tabla = null;
	partidos = null;
	pronosticos = null;

	return {
		statusCode: 200
	};
};