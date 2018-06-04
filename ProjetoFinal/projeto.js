// Variável que indica se a grade já foi criada
var temTabela = false;
// Contadores utilizados nos loops
var l=0, c=0;
// Matriz usada para guardar o elemento estruturante
var ee_matriz = [];
// Matriz usada para guardar a imagem
var desenho_matriz = [];

// function criarEE(largura, altura){
// 	var matriz = [];
// 	for(l=0; l<largura; l++){
// 		matriz[l] = [];
// 		for(c=0; c<altura; c++){
// 			matriz[l][c] = l+c+1;
// 		}
// 	}
// 	return matriz;
// }

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

// Função para sincronizar a matriz com o desenho
function atualizaMatrizDesenho(tr, td){
	if($(".meuDesenho table tbody tr:nth-child("+Number(tr)+") td:nth-child("+Number(td)+")").attr('class')=='active'){
		desenho_matriz[tr-1][td-1] = 1;
	}
	else{
		desenho_matriz[tr-1][td-1] = 0;
	}
	$(".meuResultado table tbody tr:nth-child("+Number(tr)+") td:nth-child("+Number(td)+")").toggleClass('active');
}

function criaMatrizDesenho(largura, altura){
	for(l=0; l<largura; l++){
		desenho_matriz[l] = [];
		for(c=0; c<altura; c++){
				desenho_matriz[l][c] = 0;
		}
	}
	desenhaTabela(largura, altura, "_resultado", ".meuResultado");
}

function main(){

	$(document).ready(function(){
		$(".meuDesenho table tbody tr td").on("click", function(){
			$(this).toggleClass('active');
			atualizaMatrizDesenho(retornaPosicao($(this).attr("id")).tr, retornaPosicao($(this).attr("id")).td);
//				$(this).css("background-color", $('#paleta').val());
		});

//			$("#paleta").on("change", function(){
//				$(".active").css("background-color", $('#paleta').val());
//			});
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
				desenhaTabela(largura, altura, "_desenho", ".meuDesenho");
				temTabela = true;
				alert("Tabela criada com sucesso !");
				// Criação da grade que será usada para mostrar o elemento estruturante
				desenhaTabela(3, 3, "_ee", ".meuEE");
				// Criação da matriz que representa a imagem
				criaMatrizDesenho(largura, altura, ".meuDesenho");
			}
		}
	}

}
