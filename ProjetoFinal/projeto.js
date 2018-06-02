// Variável que indica se a grade já foi criada
var temTabela = false;
// Contadores utilizados nos loops
var l=0, c=0;
// Matriz usada para guardar o elemento estruturante
var ee_matriz = [];
// Matriz usada para guardar a imagem
var desenho_matriz = [];

function desenhaTabela(largura, altura, id, div){
	var tb = "<table>";
	for(l=0; l<largura; l++){
		tb += "<tr>";
		for(c=0; c<altura; c++){
			tb+="<td id='td"+Number(l+1)+"tr"+Number(c+1)+id+"'></td>";
		}
		tb += "</tr>";
	}
	tb += "</table>"
	$(tb).appendTo(div);
}

function preencheMatriz(largura, altura){
	var matriz = [];
	for(l=0; l<largura; l++){
		matriz[l] = [];
		for(c=0; c<altura; c++){
			matriz[l][c] = l+c+1;
		}
	}

	return matriz;
}

function criaTabela(){

	$(document).ready(function(){
		$(".meuDesenho table tbody tr td").on("click", function(){
			$(this).toggleClass('active');
//				var x = ($(this)[0].id);
//				$(this).toggleClass('active');
//				if(($(this).attr("class"))=="active"){
//				$(this).css("background-color", $('#paleta').val());
//					alert("Trocou a cor");
//				}
//				else{
//					alert("Já foi apertado");
//				}
		});

//			$("#paleta").on("change", function(){
//				$(".active").css("background-color", $('#paleta').val());
//			});
	});

	if(document.querySelector("#check").checked){

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
				desenhaTabela(largura, altura, "_image", ".meuDesenho");

				temTabela = true;
				alert("Tabela criada com sucesso !");

				// Criação da grade que será usada para mostrar o elemento estruturante
				desenhaTabela(3, 3, "_ee", ".meuEE");

//				var m = preencheMatriz(3,3);

			}
		}

//		else{
//			alert("A tabela já existe!");
//		}
	}

}
