// Variável que indica se a grade já foi criada
var temTabela = false;
// Contadores utilizados nos loops
var l=0, c=0;
// Matriz usada para guardar o elemento estruturante
var ee_matriz = [];
// Matriz usada para guardar a imagem
var desenho_matriz = [];
// Matriz usada para guardar o resultado
var resultado_matriz = [];

function desenhaTabela(largura, altura, id, div){
	var tb = "<table>";
	for(l=0; l<largura; l++){
		tb += "<tr>";
		for(c=0; c<altura; c++){
			tb+="<td id='tr"+Number(l+1)+"td"+Number(c+1)+id+"'></td>";
		}
		tb += "</tr>";
	}
	tb += "</table>"
	$(tb).appendTo(div);
}

// Função para retornar a linha e a coluna da célula na tabela
function retornaPosicao(id){
	var res = id.split("tr")[1].split("td");
	return {
		tr : res[0],
		td : res[1].split("_")[0]
	};
}

// Função para sincronizar a matriz com a imagem
function atualizaMatrizPelaTabela(tr, td, imageEnum){
	switch(imageEnum){
		case 1:
			if($(".meuDesenho table tbody tr:nth-child("+Number(tr)+") td:nth-child("+Number(td)+")").attr('class')=='active'){
				desenho_matriz[tr-1][td-1] = 0;
			}
			else{
				desenho_matriz[tr-1][td-1] = 255;
			}
			break;
		case 2:
			if($(".meuEE table tbody tr:nth-child("+Number(tr)+") td:nth-child("+Number(td)+")").attr('class')=='active'){
				ee_matriz[tr-1][td-1] = 0;
			}
			else{
				ee_matriz[tr-1][td-1] = 255;
			}
			break;
	}
}

// Função para sincronizar a tabela do resultado com a matriz
function atualizaTabelaPelaMatriz(width, height, operation){
	for(l=0; l<width; l++){
		for(c=0; c<height; c++){
			if(resultado_matriz[l][c] == 0){
				if(desenho_matriz[l][c] == 255){
					$(".meuResultado table tbody tr:nth-child("+Number(l+1)+") td:nth-child("+Number(c+1)+")").toggleClass('dilated');
				}
				else{
					$(".meuResultado table tbody tr:nth-child("+Number(l+1)+") td:nth-child("+Number(c+1)+")").toggleClass('active');
				}
			}
			else{
				if(desenho_matriz[l][c] == 0){
					$(".meuResultado table tbody tr:nth-child("+Number(l+1)+") td:nth-child("+Number(c+1)+")").toggleClass('eroded');
				}
			}
	 	}
	}
}

function criaMatriz(largura, altura, tableEnum){
	switch(tableEnum){
		case 1:
			for(l=0; l<largura; l++){
				desenho_matriz[l] = [];
				for(c=0; c<altura; c++){
					desenho_matriz[l][c] = 255;
				}
			}
			break;
		case 2:
			for(l=0; l<largura; l++){
				ee_matriz[l] = [];
				for(c=0; c<altura; c++){
					ee_matriz[l][c] = 255;
				}
			}
			break;
		case 3:
			for(l=0; l<largura; l++){
				resultado_matriz[l] = [];
				for(c=0; c<altura; c++){
					resultado_matriz[l][c] = 255;
					$(".meuResultado table tbody tr:nth-child("+Number(l+1)+") td:nth-child("+Number(c+1)+")").removeClass();
				}
			}
			break;
	}
}

function main(){

	$(document).ready(function(){
		$(".meuDesenho table tbody tr td").on("click", function(){
			$(this).toggleClass('active');
			atualizaMatrizPelaTabela(retornaPosicao($(this).attr("id")).tr, retornaPosicao($(this).attr("id")).td, 1);
//				$(this).css("background-color", $('#paleta').val());
		});
		$(".meuEE table tbody tr td").on("click", function(){
			$(this).toggleClass('active');
			atualizaMatrizPelaTabela(retornaPosicao($(this).attr("id")).tr, retornaPosicao($(this).attr("id")).td, 2);
//				$(this).css("background-color", $('#paleta').val());
		});

//			$("#paleta").on("change", function(){
//				$(".active").css("background-color", $('#paleta').val());
//			});

		$("#testaOpencv").on("click", function(){
			// Dimensões da tabela do desenho
			let width = Number(document.getElementById('largura').value);
			let height = Number(document.getElementById('altura').value);
			// Dimensões do canvas utilizados para debug
			let novoTamanho = new cv.Size(200, 200);
			// Operação escolhida
			let operacao = document.getElementById('operation').value;

			// Reiniciar a tabela do resultado
			criaMatriz(width, height, 3);

			// Convertemos as matrizes em vetores de 1 dimensão
			let desenho1d = [].concat(...desenho_matriz);
			let ee1d = [].concat(...ee_matriz);

			// Criamos matrizes do opencv usando os vetores criados
			let matDesenho = cv.matFromArray(width, height, cv.CV_8U, desenho1d);
			let matEE = cv.matFromArray(5, 5, cv.CV_8U, ee1d);

			// Utilizamos o negativo das imagens pois as operações são feitas em cima dos pixels brancos
			cv.bitwise_not(matDesenho, matDesenho);
			cv.bitwise_not(matEE, matEE);

			// Rotacionamos o elemento estruturante para corrigir a forma como a matriz foi salva
			let matEERotacionado = new cv.Mat();
			cv.warpAffine(matEE, matEERotacionado, cv.getRotationMatrix2D(new cv.Point(2, 2	), 180, 1), new cv.Size(5,5), cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());

			// Inicializamos uma matriz vazia para armazenar o resultado
			let matResultado = new cv.Mat();

			if(operacao=="dilatation"){
				// Aplicamos a dilatação na imagem que acabou de ser criada
				cv.dilate(matDesenho, matResultado, matEERotacionado, new cv.Point(-1, -1), 1, cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue());
			}
			else if(operacao=="erosion"){
				// Aplicamos a erosão na imagem que acabou de ser criada
				cv.erode(matDesenho, matResultado, matEE, new cv.Point(-1, -1), 1, cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue());
			}
			if(operacao=="opening"){
				// Aplicamos a erosão na imagem que acabou de ser criada
				cv.erode(matDesenho, matResultado, matEE, new cv.Point(-1, -1), 1, cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue());
				// Aplicamos a dilatação na imagem que acabou de ser criada
				cv.dilate(matResultado, matResultado, matEERotacionado, new cv.Point(-1, -1), 1, cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue());
			}
			if(operacao=="closing"){
				// Aplicamos a dilatação na imagem que acabou de ser criada
				cv.dilate(matDesenho, matResultado, matEERotacionado, new cv.Point(-1, -1), 1, cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue());
				// Aplicamos a erosão na imagem que acabou de ser criada
				cv.erode(matResultado, matResultado, matEE, new cv.Point(-1, -1), 1, cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue());
			}

			// Revertemos a inversão dos pixels para mostrarmos do jeito correto
			cv.bitwise_not(matResultado, matResultado);

			// Redimensionamos as imagens para ficarem do tamanho do canvas
			// let matDesenhoGrande = new cv.Mat();
			// cv.resize(matDesenho, matDesenhoGrande, novoTamanho, 0, 0, cv.INTER_AREA);
			// let matEEGrande = new cv.Mat();
			// cv.resize(matEERotacionado, matEEGrande, novoTamanho, 0, 0, cv.INTER_AREA);
			// let matResultadoGrande = new cv.Mat();
			// cv.resize(matResultado, matResultadoGrande, novoTamanho, 0, 0, cv.INTER_AREA);

			// Revertemos a inversão dos pixels para mostrarmos do jeito correto
			// cv.bitwise_not(matDesenhoGrande, matDesenhoGrande);
			// cv.bitwise_not(matEEGrande, matEEGrande);
			// cv.bitwise_not(matResultadoGrande, matResultadoGrande);

			// Mostramos as imagens nos canvas
			// cv.imshow('canvasOutput1', matDesenhoGrande);
			// cv.imshow('canvasOutput2', matEEGrande);
			// cv.imshow('canvasOutput3', matResultadoGrande);

			// Atualizar os valores da matriz resultado
			for(l=0; l<Number(document.getElementById('largura').value); l++){
				for(c=0; c<Number(document.getElementById('altura').value); c++){
					resultado_matriz[l][c] = matResultado.ucharPtr(l,c);
				}
			}

			// Atualizar os valores a serem mostrados na tabela resultado
			atualizaTabelaPelaMatriz(width, height);

			// Apagamos todas as matrizes que foram criadas para limpar a memória
			matDesenho.delete();
			// matDesenhoGrande.delete();
			matEE.delete();
			matEERotacionado.delete();
			// matEEGrande.delete();
			matResultado.delete();
			// matResultadoGrande.delete();
		});

	});

	// Quando a checkbox "Criar Tabela" for apertada
	if(document.querySelector("#caixinha").checked){

		// Caso nenhuma grade tenha sido criada
		if(!temTabela){
			var altura = document.getElementById('altura').value;
			var largura = document.getElementById('largura').value;

			// Verificação de campo vazio
			if(altura == "" || largura == ""){
				alert("Altura ou(e) Largura vazio(s)");
			}
			// Verificação de medida inválida para a grade
			else if(Number(altura) <= 0 || Number(largura) <= 0){
				alert("Altura ou(e) Largura devem ser maiores que 0");
			}
			// Criação da grade de imagem e do elemento estruturante
			else{
				// Criação da grade que será usada para desenhar a imagem
				desenhaTabela(Number(largura), Number(altura), "_desenho", ".meuDesenho");
				temTabela = true;
				// Criação da grade que será usada para mostrar o elemento estruturante
				desenhaTabela(5, 5, "_ee", ".meuEE");
				// Criação da grade que será usada para mostrar o resultado
				desenhaTabela(Number(largura), Number(altura), "_resultado", ".meuResultado");

				// Inicialização das matrizes que representam a imagem, o E.E. e o resultado
				criaMatriz(Number(largura), Number(altura), 1);
				criaMatriz(5, 5, 2);
				criaMatriz(Number(largura), Number(altura), 3);
			}
		}
	}

}	
