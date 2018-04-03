#include <iostream>
#include <opencv2/opencv.hpp>

using namespace std;
using namespace cv;

int main(int argc, char** argv){
  //Imagem original e imagem equalizada
  Mat image, equalized_image;
  //Utilização da câmera integrada
  VideoCapture cap;
  //Histogramas das imagens original e equalizada
  Mat histOriginal, histEqualizada;
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

  //Histogramas que serão desenhados nas respectivas imagens
  Mat histImgOriginal(histh, histw, CV_8UC1, Scalar(0));
  Mat histImgEqualizada = histImgOriginal.clone();

  while(1){

    cap >> image;
    cvtColor(image, image, CV_BGR2GRAY);
    equalizeHist(image, equalized_image);

    //Cálculo do histogramas
    calcHist(&image, 1, 0, Mat(), histOriginal, 1,
              &nbins, &histrange, true, false);
    calcHist(&equalized_image, 1, 0, Mat(), histEqualizada, 1,
              &nbins, &histrange, true, false);

    //Normalização dos histogramas
    normalize(histOriginal, histOriginal, 0, histImgOriginal.rows, NORM_MINMAX, -1, Mat());
    normalize(histEqualizada, histEqualizada, 0, histImgEqualizada.rows, NORM_MINMAX, -1, Mat());

    //Inicialização dos histogramas que serão anexados às imagens
    histImgOriginal.setTo(Scalar(0));
    histImgEqualizada.setTo(Scalar(0));

    //Desenho dos histogramas nas imagens
    for(int i=0; i<nbins; i++){
      line(histImgOriginal, Point(i, histh), Point(i, histh-cvRound(histOriginal.at<float>(i))),
            Scalar(255), 1, 8, 0);
      line(histImgEqualizada, Point(i, histh), Point(i, histh-cvRound(histEqualizada.at<float>(i))),
            Scalar(255), 1, 8, 0);
    }

    histImgOriginal.copyTo(image(Rect(0, 0, nbins, histh)));
    histImgEqualizada.copyTo(equalized_image(Rect(0, 0, nbins, histh)));

    imshow("Imagem", image);
    imshow("Imagem Equalizada", equalized_image);

    if(waitKey(30)>=0) break;
  }

  return 0;
}
