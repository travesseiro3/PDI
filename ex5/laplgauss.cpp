#include <iostream>
#include <opencv2/opencv.hpp>

using namespace std;
using namespace cv;

void printmask(Mat &m){
  for(int i=0; i<m.size().height; i++){
    for(int j=0; j<m.size().width; j++){
      cout << m.at<float>(i, j) << ",";
    }
    cout << endl;
  }
}

void menu(){
  cout << "\nPressione a tecla para ativar o filtro: \n"
          " a  - Calcular Modulo\n"
          " m  - Filtro Media\n"
          " h  - Filtro Horizontal\n"
          " v  - Filtro Vertical\n"
          " l  - Filtro Laplaciano\n"
          " g  - Filtro Gaussiano\n"
          " x  - Filtro Laplaciano do Gaussiano\n"
          "esc - Sair\n";
}

int main(int argvc, char** argv){
  VideoCapture video;

  float media[] = { 1, 1, 1,
                    1, 1, 1,
                    1, 1, 1};
  float gauss[] = { 1, 2, 1,
                    2, 4, 2,
                    1, 2, 1};
  float horiz[] = {-1, 0, 1,
                   -2, 0, 2,
                   -1, 0, 1};
  float vert[]  = {-1,-2,-1,
                    0, 0, 0,
                    1, 2, 1};
  float lapl[] = {  0,-1, 0,
                   -1, 4,-1,
                    0,-1, 0};

  Mat cap, frame, frame32f, frameFiltered;
  Mat mask(3, 3, CV_32F), mask1;
  Mat result, result1;
  int absolut;
  char key;

  video.open(0);

  if(!video.isOpened()) return -1;

  namedWindow("Imagem Original", 1);
  namedWindow("Filtro Espacial", 2);

  mask = Mat(3, 3, CV_32F, media);
  scaleAdd(mask, 1/9.0, Mat::zeros(3, 3, CV_32F), mask1);
  swap(mask, mask1);
  absolut=1; // calcs abs of the image

  menu();

  for(;;){
    video >> cap;
    cvtColor(cap, frame, CV_BGR2GRAY);
    flip(frame, frame, 1);
    imshow("Imagem Original", frame);
    frame.convertTo(frame32f, CV_32F);
    filter2D(frame32f, frameFiltered, frame32f.depth(), mask, Point(1,1), 0);
    if(absolut){
      frameFiltered = abs(frameFiltered);
    }
    frameFiltered.convertTo(result, CV_8U);
    imshow("Filtro Espacial", result);
    key = (char) waitKey(10);
    if (key==27) break; // ESC
    switch(key){
      case 'a': // Calcular Modulo
        menu();
        absolut=!absolut;
        break;
      case 'm': // Filtro da Media
        menu();
        mask = Mat(3, 3, CV_32F, media);
        scaleAdd(mask, 1/9.0, Mat::zeros(3, 3, CV_32F), mask1);
        mask = mask1;
        printmask(mask);
        break;
      case 'h': // Filtro Horizontal
        menu();
        mask = Mat(3, 3, CV_32F, horiz);
        printmask(mask);
        break;
      case 'v':
        menu();
        mask = Mat(3, 3, CV_32F, vert);
        printmask(mask);
        break;
      case 'l':
        menu();
        mask = Mat(3, 3, CV_32F, lapl);
        printmask(mask);
        break;
      case 'g':
        menu();
        mask = Mat(3, 3, CV_32F, gauss);
        scaleAdd(mask, 1/16.0, Mat::zeros(3, 3, CV_32F), mask1);
        mask = mask1;
        printmask(mask);
        break;
      case 'x':
        menu();
        mask = Mat(3, 3, CV_32F, lapl);
        result1 = Mat(3, 3, CV_32F, gauss);
        mask = mask.mul(result1);
        scaleAdd(mask, 1/16.0, Mat::zeros(3, 3, CV_32F), mask1);
        mask = mask1;
        printmask(mask);
        break;
    }
  }

  return 0;
}
