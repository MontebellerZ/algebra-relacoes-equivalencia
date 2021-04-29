var paresOrdenados = new Array();
var calc = [false,false,false];

class Par{
	constructor(x, y){
		this.x = x;
		this.y = y;
	}

	getX(){
		return this.x;
	}

	getY(){
		return this.y;
	}
}

function getConjunto(){
	let conjunto = document.getElementById('conjunto').value;
	if(conjunto!=''){
		conjunto = conjunto.split(',');
		conjunto.forEach(function (item, index){
			conjunto[index]=conjunto[index].trim();
		});
	}
	return conjunto.sort();
}

function setConjunto(n){
	let conjunto = getConjunto();
	conjunto.push(n);
	document.getElementById('conjunto').value = conjunto.join().split(',').sort().join(', ');
}

function checar(x, y){
	let conjunto = getConjunto();
	let confirmacao=true;

	if(!conjunto.includes(x)&&!conjunto.includes(y)){
		confirmacao = confirm(x+' ∉ S e '+y+' ∉ S. Deseja incluir o par ('+x+', '+y+') e adicionar '+x+' e '+y+' ao conjunto S?');
		if(confirmacao){
			setConjunto([x, y]);
		}
	}
	else if(!conjunto.includes(x)){
		confirmacao = confirm(x+' ∉ S. Deseja incluir o par ('+x+', '+y+') e adicionar '+x+' ao conjunto S?');
		if(confirmacao){
			setConjunto(x);
		}
	}
	else if(!conjunto.includes(y)){
		confirmacao = confirm(y+' ∉ S. Deseja incluir o par ('+x+', '+y+') e adicionar '+y+' ao conjunto S?');
		if(confirmacao){
			setConjunto(y);
		}
	}

	return confirmacao;
}

function mark(teste){
	let p;

	if(teste){
		p = '<i class="fas fa-check"></i>';
	}
	else{
		p = '<i class="fas fa-times"></i>';
	}

	return p;
}

function printarPares(vetorP){
	let p = '';

	p += '<b>Reflexiva:</b> '+mark(reflexiva(2, vetorP))+' | ';
	p += '<b>Simétrica:</b> '+mark(simetrica(2, vetorP))+' | ';
	p += '<b>Transitiva:</b> '+mark(transitiva(2, vetorP));

	p += '<br><br>p = { ';
	vetorP.forEach(function (item, index){
		if(index>0){
			p += ', ';
		}
		p += '<span>('+vetorP[index].getX()+', '+vetorP[index].getY()+')</span>';
	});
	p += ' }';

	return p;
}

function limpar(){
	if(confirm("Tem certeza que deseja limpar os pares?")){
		paresOrdenados.length = 0;
		document.getElementById('pares').innerHTML=printarPares(paresOrdenados);
	}
	calcular(0);
}

function adicionar(){
	let x = prompt("Insira o valor de x:");
	let y = prompt("Insira o valor de y:");

	if(checar(x, y)){
		paresOrdenados.push(new Par(x , y));
		document.getElementById('pares').innerHTML = printarPares(paresOrdenados);
		calcular(0);
	}	
}

function addTexto(){
	alert("Insira o texto no seguinte formato:\n    (x1, y1), (x2, y2), (x3, y3), (xn, yn), ...");
	let texto = prompt("Insira o texto:");

	texto = texto.replace(/\),/g, ';').replace(/[() ]/g, '');

	if(texto.search(';,')<0 && texto.search(',;')<0 && texto[0]!=',' && texto[texto.length-1]!=','){
		texto = texto.split(';');

		for(let i=0; i<texto.length; i++){
			texto[i] = texto[i].split(',');

			let x = texto[i][0];
			let y = texto[i][1];

			if(checar(x, y)){
				paresOrdenados.push(new Par(x , y));
			}
		}
	}
	else{
		alert("O texto continha um ou mais erros. Tente novamente.");
	}

	document.getElementById('pares').innerHTML = printarPares(paresOrdenados);
	calcular(0);
}

function remover(){
	paresOrdenados.pop();
	document.getElementById('pares').innerHTML = printarPares(paresOrdenados);
}

function reflexiva(modo, paresResultado){
	let rflx = true;
	let conjunto = getConjunto();

	for(let i=0; i<conjunto.length; i++){
		let sentinela = false;
		let novoPar = new Par(conjunto[i], conjunto[i]);

		for(let j=0; j<paresResultado.length; j++){
			if(JSON.stringify(novoPar) === JSON.stringify(paresResultado[j])){
				sentinela=true;
			}
		}

		if(!sentinela&&modo==1){
			paresResultado.push(novoPar);
		}
		else if(!sentinela){
			rflx = false;
			return rflx;
		}
	}

	return paresResultado;
}

function simetrica(modo, paresResultado){
	let smtc = true;
	for(let i=0; i<paresResultado.length; i++){
		let parX = paresResultado[i].getX();
		let parY = paresResultado[i].getY();

		let sentinela = false;
		let novoPar = new Par(parY, parX);

		for(let j=0; j<paresResultado.length; j++){
			if(JSON.stringify(novoPar) === JSON.stringify(paresResultado[j])){
				sentinela = true;
			}
		}

		if(!sentinela&&modo==1){
			paresResultado.push(novoPar);
		}
		else if(!sentinela){
			smtc = false;
			return smtc;
		}
	}
	return paresResultado;
}

function transitiva(modo, paresResultado){
	let tstv = true;
	for(let i=0; i<paresResultado.length; i++){
		let parX = paresResultado[i].getX();
		let parY = paresResultado[i].getY();

		for(let j=0; j<paresResultado.length; j++){
			if(parY == paresResultado[j].getX()){
				let sentinela = false;
				let novoPar = new Par(parX, paresResultado[j].getY());

				for(let k=0; k<paresResultado.length; k++){
					if(JSON.stringify(novoPar) === JSON.stringify(paresResultado[k])){
						sentinela=true;
					}
				}

				if(!sentinela&&modo==1){
					paresResultado.push(novoPar);
				}
				else if(!sentinela){
					tstv = false;
					return tstv;
				}
			}
		}
	}
	return paresResultado;
}

function calcular(tipo){
	let div = document.getElementById('resultado');
	let corOn = "rgb(36, 240, 178)";
	let corOff = "rgb(255, 105, 105)";
	let textoTipo = '';

	let paresResultado = [...paresOrdenados];

	switch(tipo){
		case 1:
			if(calc[0]){
				calc[0]=false;
				document.getElementById('reflexiva').style.backgroundColor = corOff;
			}
			else{
				calc[0]=true;
				document.getElementById('reflexiva').style.backgroundColor = corOn;
			}
			break;

		case 2:
			if(calc[1]){
				calc[1]=false;
				document.getElementById('simetrica').style.backgroundColor = corOff;
			}
			else{
				calc[1]=true;
				document.getElementById('simetrica').style.backgroundColor = corOn;
			}
			break;

		case 3:
			if(calc[2]){
				calc[2]=false;
				document.getElementById('transitiva').style.backgroundColor = corOff;
			}
			else{
				calc[2]=true;
				document.getElementById('transitiva').style.backgroundColor = corOn;
			}
			break;
	}

	for(let i=0; i<calc.length; i++){
		if(calc[i]){
			if(textoTipo!=''){
				textoTipo += ', ';
			}

			switch (i){
				case 0:
					textoTipo += 'Reflexivo';
					break;

				case 1:
					textoTipo += 'Simetrica';
					break;

				case 2:
					textoTipo += 'Transitiva';
					break;
			}
		}
	}

	if(calc[0]){
		paresResultado = reflexiva(1, paresResultado);
	}
	if(calc[1]){
		paresResultado = simetrica(1, paresResultado);
	}
	if(calc[2]){
		paresResultado = transitiva(1, paresResultado);
	}

	if(textoTipo!=''){
		div.innerHTML = '<b class="tipo">('+textoTipo+') de p:</b><br>';
		div.innerHTML += printarPares(paresResultado);
	}
	else{
		div.innerHTML = '';
	}
}