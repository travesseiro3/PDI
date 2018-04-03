#include <iostream>
#include <opencv2/opencv.hpp>
#include <unistd.h>

using namespace std;
using namespace cv;

int main(int argc, char** argv){
  //Imagem original e imagem equalizada
  Mat image, new_image;
  //Utilização da câmera integrada
  VideoCapture cap;
  //Histogramas das imagens original e equalizada
  Mat histOriginal, histNovo;
  //Quantidade de intervalos dos histogramas
  int nbins = 64;
  //Intervalo de valores mostrados no histograma
  float range[] = {0, 256};
  const float *histrange = { range };

  //Início da captura de vídeo
  cap.open(0);

  if(!cap.isOpened()){
    cout << "cameras indisponiveis";
    return -1;
  }

  //Definição das dimensões dos histogramas
  int histw = nbins, histh = nbins/2;

  while(1){

    if(image.empty()){
      cap >> image;
      cvtColor(image, image, CV_BGR2GRAY);
      new_image = image.clone();
    }
    else{
      cap >> new_image;
      cvtColor(new_image, new_image, CV_BGR2GRAY);
    }

    //Cálculo do histogramas
    calcHist(&image, 1, 0, Mat(), histOriginal, 1,
              &nbins, &histrange, true, false);
    calcHist(&new_image, 1, 0, Mat(), histNovo, 1,
              &nbins, &histrange, true, false);

    //Normalização dos histogramas
    normalize(histOriginal, histOriginal, 0, histh, NORM_MINMAX, -1, Mat());
    normalize(histNovo, histNovo, 0, histh, NORM_MINMAX, -1, Mat());

    int acumuladoOriginal=0, acumuladoNovo=0;
    //Calcular o valor acumulado do histograma
    for(int i=0; i<histw; i++){
      acumuladoOriginal+=histOriginal.at<float>(i);
      acumuladoNovo+=histNovo.at<float>(i);
    }

    if(abs(acumuladoOriginal-acumuladoNovo>=20)){
      cout << "acumuladoOriginal = " << acumuladoOriginal << "\n";
      cout << "acumuladoNovo = " << acumuladoNovo << "\n\n\n";
    }

    imshow("Imagem", image);
    imshow("Imagem Nova", new_image);

    image = new_image.clone();

    if(waitKey(30)>=0) break;
  }

  return 0;
}
