#include <iostream>
#include <opencv2/opencv.hpp>
#include <sstream>

using namespace std;
using namespace cv;

int main(int argc, char** argv){
	Mat original, negativo;
	stringstream ss;
	string s;
	int P1x, P1y, P2x, P2y, menorX, menorY, maiorX, maiorY;
	char abr_par='a', virg='b', fec_par='c';

  original = imread(argv[1],CV_LOAD_IMAGE_GRAYSCALE);
	negativo = original.clone();
	if(!original.data){
		cout << "A imagem nao pode ser aberta" << endl;
	}

	//Repita ate a leitura ser feita corretamente
	do{
		cout << "Insira o primeiro ponto, formato [x,y] :\n ";
		cin >> s;

		//Inicializacao da stringstream e preenchimento das variaveis
		ss.str(s);
		ss >> abr_par >> P1x >> virg >> P1y >> fec_par;

		//Limpando o buffer da stringstream e tambem qualquer erro de eof
		ss.str(string());
		ss.clear();

	}while (abr_par!='[' && fec_par!=']' && virg!=',');

	abr_par = 'a';
	virg    = 'b';
	fec_par = 'c';

  //Repita ate a leitura ser feita corretamente
  do{
          cout << "Insira o segundo ponto, formato [x,y] :\n ";
          cin >> s;

          //Inicializacao da stringstream e preenchimento das variaveis
          ss.str(s);
          ss >> abr_par >> P2x >> virg >> P2y >> fec_par;

          //Limpando o buffer da stringstream e tambem qualquer erro de eof
          ss.str(string());
          ss.clear();

  }while (abr_par!='[' && fec_par!=']' && virg!=',');

	namedWindow("Original", WINDOW_AUTOSIZE);
	namedWindow("Negativo", WINDOW_AUTOSIZE);

	if(P1x>P2x){
		menorX = P2x; maiorX = P1x;
	}
	else{
		menorX = P1x; maiorX = P2x;
	}

	if(P1y>P2y){
		menorY = P2y; maiorY = P1y;
	}
	else{
		menorY = P1y; maiorY = P2y;
	}

	for(int linha=menorX; linha < maiorX; linha++){
		for(int coluna=menorY; coluna < maiorY; coluna++){
			negativo.at<uchar>(linha,coluna) = 255 - negativo.at<uchar>(linha,coluna);
		}
	}

	imshow("Original", original);
	imshow("Negativo", negativo);
	waitKey();

	return 0;
}
