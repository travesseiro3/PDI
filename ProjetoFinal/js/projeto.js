// Variável que indica se a grade já foi criada
var jaCriouTudo = false;
// Contadores utilizados nos loops
var l=0, c=0;
// Matriz usada para guardar o elemento estruturante da tabela
var ee_tabela_matriz = [];
// Matriz usada para guardar a imagem
var desenho_matriz = [];
// Matriz usada para guardar o resultado
var resultado_matriz = [];
// Matriz usada para guardar o elemento estruturante da imagem
var ee_imagem_matriz = [];
// Dimensões das grades de desenho e de resultado
var alturaGrade = 15, larguraGrade = 15;
// Dimensões das grades dos elementos estruturantes
var alturaEE = 9, larguraEE = 9;
// Classe utilizada para a dilatação
var dilatedClass = "dilated1";
// Classe utilizada para a erosão
var erodedClass = "eroded1";

// Criação e Inicialização do ambiente
if(!jaCriouTudo){
	let novaAlturaGrade = Number(document.getElementById('colunasGrade').value);
	let novaLarguraGrade = Number(document.getElementById('linhasGrade').value);
	let novaAlturaEE = Number(document.getElementById('colunasEE').value);
	let novaLarguraEE = Number(document.getElementById('linhasEE').value);

	if(novaAlturaGrade > 0 && novaLarguraGrade > 0){
		alturaGrade = novaAlturaGrade;
		larguraGrade = novaLarguraGrade;
	}
	else{
		document.getElementById('colunasGrade').value = 15;
		document.getElementById('linhasGrade').value = 15;
	}
	if(novaAlturaEE > 0 && novaLarguraEE > 0){
		alturaEE = novaAlturaEE;
		larguraEE = novaLarguraEE;
	}
	else{
		document.getElementById('colunasEE').value = 9;
		document.getElementById('linhasEE').value = 9;
	}

	// Criação da grade que será usada para desenhar a imagem
	desenhaTabela(larguraGrade, alturaGrade, ".tabelaEntrada");
	// Criação da grade que será usada para mostrar o elemento estruturante da parte de tabelas
	desenhaTabela(larguraEE, alturaEE, ".tabelaEE");
	// Criação da grade que será usada para mostrar o resultado
	desenhaTabela(larguraGrade, alturaGrade, ".tabelaSaida");
	// Criação da grade que será usada para mostrar o elemento estruturante da parte de imagens
	desenhaTabela(larguraEE, alturaEE, ".imagemEE");

	// Inicialização das matrizes que representam a imagem, o E.E. e o resultado, respectivamente
	criaMatriz(larguraGrade, alturaGrade, 1);
	criaMatriz(larguraEE, alturaEE, 2);
	criaMatriz(larguraGrade, alturaGrade, 3);
	criaMatriz(larguraEE, alturaEE, 4);

	// Inicia com a primeira cor selecionada
	$("a#dilat1").toggleClass('dilated');
	// Inicia com a primeira cor selecionada
	$("a#eros1").toggleClass('eroded');

	jaCriouTudo = true;
}

// Função para desenhar as tabelas nas divs passadas
function desenhaTabela(largura, altura, div){
	let tb = "<table>";
	for(l=0; l<largura; l++){
		tb += "<tr>";
		for(c=0; c<altura; c++){
			tb+="<td id='tr"+Number(l+1)+"td"+Number(c+1)+"'></td>";
		}
		tb += "</tr>";
	}
	tb += "</table>"
	$(tb).appendTo(div);
}

// Função para retornar a linha e a coluna da célula na tabela
function retornaPosicao(id){
	let res = id.split("tr")[1].split("td");
	return {
		tr : res[0],
		td : res[1]
	};
}

// Função para sincronizar a matriz com a imagem
function atualizaMatrizPelaTabela(tr, td, imageEnum){
	switch(imageEnum){
		case 1:
			if($(".tabelaEntrada table tbody tr:nth-child("+Number(tr)+") td:nth-child("+Number(td)+")").attr('class')=='active'){
				desenho_matriz[tr-1][td-1] = 255;
			}
			else{
				desenho_matriz[tr-1][td-1] = 0;
			}
			break;
		case 2:
			if($(".tabelaEE table tbody tr:nth-child("+Number(tr)+") td:nth-child("+Number(td)+")").attr('class')=='active'){
				ee_tabela_matriz[tr-1][td-1] = 255;
			}
			else{
				ee_tabela_matriz[tr-1][td-1] = 0;
			}
			break;
		case 3:
			if($(".imagemEE table tbody tr:nth-child("+Number(tr)+") td:nth-child("+Number(td)+")").attr('class')=='active'){
				ee_imagem_matriz[tr-1][td-1] = 255;
			}
			else{
				ee_imagem_matriz[tr-1][td-1] = 0;
			}
			break;
	}
}

// Função para sincronizar a tabela do resultado com a matriz
function atualizaTabelaPelaMatriz(width, height){
	for(l=0; l<width; l++){
		for(c=0; c<height; c++){
			if(resultado_matriz[l][c] == 255){
				if(desenho_matriz[l][c] == 0){
					$(".tabelaSaida table tbody tr:nth-child("+Number(l+1)+") td:nth-child("+Number(c+1)+")").toggleClass(dilatedClass);
				}
				else{
					$(".tabelaSaida table tbody tr:nth-child("+Number(l+1)+") td:nth-child("+Number(c+1)+")").toggleClass('active');
				}
			}
			else{
				if(desenho_matriz[l][c] == 255){
					$(".tabelaSaida table tbody tr:nth-child("+Number(l+1)+") td:nth-child("+Number(c+1)+")").toggleClass(erodedClass);
				}
				else{
					$(".tabelaSaida table tbody tr:nth-child("+Number(l+1)+") td:nth-child("+Number(c+1)+")").removeClass();
				}
			}
	 	}
	}
}

// Função para criar e inicializar as matrizes que guardarão os valores das tabelas
function criaMatriz(largura, altura, tableEnum){
	switch(tableEnum){
		case 1:
			for(l=0; l<largura; l++){
				desenho_matriz[l] = [];
				for(c=0; c<altura; c++){
					desenho_matriz[l][c] = 0;
				}
			}
			break;
		case 2:
			for(l=0; l<largura; l++){
				ee_tabela_matriz[l] = [];
				for(c=0; c<altura; c++){
					ee_tabela_matriz[l][c] = 0;
				}
			}
			break;
		case 3:
			for(l=0; l<largura; l++){
				resultado_matriz[l] = [];
				for(c=0; c<altura; c++){
					resultado_matriz[l][c] = 0;
					$(".tabelaSaida table tbody tr:nth-child("+Number(l+1)+") td:nth-child("+Number(c+1)+")").removeClass();
				}
			}
			break;
		case 4:
			for(l=0; l<largura; l++){
				ee_imagem_matriz[l] = [];
				for(c=0; c<altura; c++){
					ee_imagem_matriz[l][c] = 0;
				}
			}
			break;
	}
}

// Funções responsáveis pelo funcionamento correto das operações nas tabelas
function funcoesTabela(){

	$(document).ready(function(){

		$(".tabelaEntrada table tbody tr td").on("click", function(){
			$(this).toggleClass('active');
			atualizaMatrizPelaTabela(retornaPosicao($(this).attr("id")).tr, retornaPosicao($(this).attr("id")).td, 1);
		});

		$(".tabelaEE table tbody tr td").on("click", function(){
			$(this).toggleClass('active');
			atualizaMatrizPelaTabela(retornaPosicao($(this).attr("id")).tr, retornaPosicao($(this).attr("id")).td, 2);
		});


		$("#botaoOperacaoTabela").on("click", function(){

			// Operação escolhida
			let operacao = document.getElementById('operacaoTabela').value;

			// Reiniciar a tabela do resultado
			criaMatriz(larguraGrade, alturaGrade, 3);

			// Convertemos as matrizes em vetores de 1 dimensão
			let desenho1d = [].concat(...desenho_matriz);
			let ee1d = [].concat(...ee_tabela_matriz);

			// Criamos matrizes do opencv usando os vetores criados
			let matDesenho = cv.matFromArray(larguraGrade, alturaGrade, cv.CV_8U, desenho1d);
			let matEE = cv.matFromArray(larguraEE, alturaEE, cv.CV_8U, ee1d);

			// Lista de Elementos Estruturantes já criados
			let EE_Tipo = document.getElementById('EE_TipoTabela').value;

			if(EE_Tipo == "personalizado"){
				matEE = matEE;
			}
			else if(EE_Tipo == "cruz"){
				matEE = cv.getStructuringElement(cv.MORPH_CROSS, new cv.Size(3, 3));
			}
			else if(EE_Tipo == "elipse"){
				matEE = cv.getStructuringElement(cv.MORPH_ELLIPSE, new cv.Size(5, 5));
			}
			else if(EE_Tipo == "retangulo"){
				matEE = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(3, 3));
			}

			// Inicializamos uma matriz vazia para armazenar o resultado
			let matResultado = new cv.Mat();

			if(operacao == "dilatacao"){
				// Aplicamos a dilatação na imagem que acabou de ser criada
				cv.dilate(matDesenho, matResultado, matEE, new cv.Point(-1, -1), 1, cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue());
			}
			else if(operacao == "erosao"){
				// Aplicamos a erosão na imagem que acabou de ser criada
				cv.erode(matDesenho, matResultado, matEE, new cv.Point(-1, -1), 1, cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue());
			}
			else if(operacao == "abertura"){
				// Aplicamos a abertura na imagem que acabou de ser criada
				cv.morphologyEx(matDesenho, matResultado, cv.MORPH_OPEN, matEE, new cv.Point(-1, -1), 1, cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue());
			}
			else if(operacao == "fechamento"){
				// Aplicamos o fechamento na imagem que acabou de ser criada
				cv.morphologyEx(matDesenho, matResultado, cv.MORPH_CLOSE, matEE, new cv.Point(-1, -1), 1, cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue());
			}
			else if(operacao == "gradiente"){
				// Aplicamos o gradiente na imagem que acabou de ser criada
				cv.morphologyEx(matDesenho, matResultado, cv.MORPH_GRADIENT, matEE);
			}

			// Atualizar os valores da matriz resultado
			for(l=0; l<larguraGrade; l++){
				for(c=0; c<alturaGrade; c++){
					resultado_matriz[l][c] = matResultado.ucharPtr(l,c);
				}
			}

			// Atualizar os valores a serem mostrados na tabela resultado
			atualizaTabelaPelaMatriz(larguraGrade, alturaGrade);

			// Apagamos todas as matrizes que foram criadas para limpar a memória
			matDesenho.delete();
			matEE.delete();
			matResultado.delete();
		});

	});

}	

// Funções responsáveis pelo funcionamento correto das operações nas imagens
function funcoesImagem(){

	$(document).ready(function(){
		let imagem = document.getElementById('mostraImagem');
		let imagemInput = document.getElementById('arquivoImagem');

		imagemInput.addEventListener('change', (e) => {
			imagem.src = URL.createObjectURL(e.target.files[0]);
		}, false);

		$(".imagemEE table tbody tr td").on("click", function(){
			$(this).toggleClass('active');
			atualizaMatrizPelaTabela(retornaPosicao($(this).attr("id")).tr, retornaPosicao($(this).attr("id")).td, 3);
		});

		$("#botaoOperacaoImagem").on("click", function(){

			// Remoção do label antigo, caso exista
			$('.imagemSaida label').remove();
			$("<label class='hint'>Imagem Resultante : <canvas id='canvasSaida' ></canvas></label>").appendTo('.imagemSaida');

			// Criação e inicialização da matriz com os dados da imagem
			let mat = cv.imread(imagem);

			// Criação e inicialização da matriz do elemento estruturante
			let ee1d = [].concat(...ee_imagem_matriz);
			let matEE = cv.matFromArray(larguraEE, alturaEE, cv.CV_8U, ee1d);

			// Operação escolhida para se realizar a operação morfológica
			let operacao = document.getElementById('operacaoImagem').value;
			
			// Lista de Elementos Estruturantes já criados
			let EE_Tipo = document.getElementById('EE_TipoImagem').value;			
			if(EE_Tipo == "personalizado"){
				matEE = matEE;
			}
			else if(EE_Tipo == "cruz"){
				matEE = cv.getStructuringElement(cv.MORPH_CROSS, new cv.Size(3, 3));
			}
			else if(EE_Tipo == "elipse"){
				matEE = cv.getStructuringElement(cv.MORPH_ELLIPSE, new cv.Size(5, 5));
			}
			else if(EE_Tipo == "retangulo"){
				matEE = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(3, 3));
			}

			// Inicializamos uma matriz vazia para armazenar o resultado
			let matResultado = new cv.Mat();

			if(operacao == "dilatacao"){
				// Aplicamos a dilatação na imagem com o ee desenhado
				cv.dilate(mat, matResultado, matEE, new cv.Point(-1, -1), 1, cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue());
			}
			else if(operacao == "erosao"){
				// Aplicamos a erosão na imagem com o ee desenhado
				cv.erode(mat, matResultado, matEE, new cv.Point(-1, -1), 1, cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue());
			}
			else if(operacao == "abertura"){
				// Aplicamos a abertura na imagem com o ee desenhado
				cv.morphologyEx(mat, matResultado, cv.MORPH_OPEN, matEE, new cv.Point(-1, -1), 1, cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue());
			}
			else if(operacao == "fechamento"){
				// Aplicamos o fechamento na imagem com o ee desenhado
				cv.morphologyEx(mat, matResultado, cv.MORPH_CLOSE, matEE, new cv.Point(-1, -1), 1, cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue());
			}
			else if(operacao == "gradiente"){
				cv.cvtColor(mat, mat, cv.COLOR_RGBA2RGB);
				// Aplicamos o gradiente na imagem com o ee desenhado
				cv.morphologyEx(mat, matResultado, cv.MORPH_GRADIENT, matEE);
			}

			// Mostramos a imagem resultante
			cv.imshow('canvasSaida', matResultado);

			// Apagamos as matrizes criadas
			mat.delete();
			matEE.delete();
			matResultado.delete();
		});
	});

}

// Função executada quando pelo menos uma das medidas das tabelas é alterada
function personalizarDimensoes(){
	let novaAlturaGrade = Number(document.getElementById('colunasGrade').value);
	let novaLarguraGrade = Number(document.getElementById('linhasGrade').value);
	let novaAlturaEE = Number(document.getElementById('colunasEE').value);
	let novaLarguraEE = Number(document.getElementById('linhasEE').value);

	if(alturaGrade != novaAlturaGrade || larguraGrade != novaLarguraGrade){
		$('.tabelaEntrada table').remove();
		$('.tabelaSaida table').remove();
		desenhaTabela(novaLarguraGrade, novaAlturaGrade, ".tabelaEntrada");
		desenhaTabela(novaLarguraGrade, novaAlturaGrade, ".tabelaSaida");
	}
	if(alturaEE != novaAlturaEE || larguraEE != novaLarguraEE){
		$('.tabelaEE table').remove();
		$('.imagemEE table').remove();
		desenhaTabela(novaLarguraEE, novaAlturaEE, ".tabelaEE");
		desenhaTabela(novaLarguraEE, novaAlturaEE, ".imagemEE");
	}

	alert("Medidas atualizadas com sucesso!");
}

// Função para retornar o id numerico do quadradinho
function retornaIdNumerico(operacao, id){
	return Number(id.split(operacao)[1]);
}

// Função para remover o destaque das cores não escolhidas
function removerDestaque(operacao, classe, id){
	let n = retornaIdNumerico(operacao, id);
	for(l=1; l<=7; l++){
		if($("#"+operacao+l).attr("class")==classe && l!= n){
			$("#"+operacao+l).removeClass();
		}
	}
}

// Função para alterar as cores padrões dos elementos
function changeColor(){

	$(document).ready(function(){

		let dilatedId = 1;
		let erodedId = 1;

		$("a").on("click", function(){

			// Se for algum de dilatação :
			if($(this).attr("class")!="dilated" && (
				$(this).attr("id") == "dilat1" ||	$(this).attr("id") == "dilat2" ||	$(this).attr("id") == "dilat3" ||
				$(this).attr("id") == "dilat4" ||	$(this).attr("id") == "dilat5" ||	$(this).attr("id") == "dilat6" ||
				$(this).attr("id") == "dilat7")    ){

				$(this).toggleClass('dilated');
				removerDestaque("dilat", "dilated", $(this).attr("id"));
				dilatedId = retornaIdNumerico("dilat", $(this).attr("id"));
				dilatedClass = "dilated" + dilatedId;
			}

			// Se for algum de erosão :
			else if($(this).attr("class")!="eroded" && (
				$(this).attr("id") == "eros1" ||	$(this).attr("id") == "eros2" ||	$(this).attr("id") == "eros3" ||
				$(this).attr("id") == "eros4" ||	$(this).attr("id") == "eros5" ||	$(this).attr("id") == "eros6" ||
				$(this).attr("id") == "eros7")    ){
				$(this).toggleClass('eroded');
				removerDestaque("eros", "eroded", $(this).attr("id"));
				erodedId = retornaIdNumerico("eros", $(this).attr("id"));
				erodedClass = "eroded" + erodedId;
			}

		});

/* 		$("#botaoMudaCor").on("click", function(){

			dilatedClass = "dilated" + dilatedId;
			erodedClass = "eroded" + erodedId;

			alert("Cores atualizadas com sucesso!");

		});
 */
	});
}