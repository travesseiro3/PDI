#include <iostream>
#include <opencv2/opencv.hpp>
#include <chrono> //Para medir o tempo de execução

using namespace cv;
using namespace std;

int main(int argc, char** argv){

  Mat image, mask;
  int width, height;
  int new_color, n_objects=0, holes=0;
  Point p;

  image = imread(argv[1],CV_LOAD_IMAGE_GRAYSCALE);
  mask = image.clone();

  if(!image.data){
    std::cout << "imagem nao carregou corretamente\n";
    return(-1);
  }

  //Captura das dimensões da imagem
  width = mask.size().width;
  height = mask.size().height;

  //Início da contagem do tempo de execução
  //auto t0 = chrono::high_resolution_clock::now();

  //Verificação da primeira e da última linha
  for (int i=0; i<height; i=i+height-1) {
    for(int j=0; j<width; j++) {
      if(mask.at<uchar>(i,j)==255){
        //Point usa os eixos invertidos
        p.x=j;
        p.y=i;
        //Preenche o objeto de que 'p' faz parte com a cor '0'
        floodFill(mask,p,0);
      }
    }
  }

  //Verificação da primeira e da última coluna
  for (int i=0; i<height; i++) {
    for(int j=0; j<width; j=j+width-1) {
      if(mask.at<uchar>(i,j)==255){
        //Point usa os eixos invertidos
        p.x=j;
        p.y=i;
        //Preenche o objeto de que 'p' faz parte com a cor '0'
        floodFill(mask,p,0);
      }
    }
  }

  //Final da contagem do tempo de execução
  //auto t1 = chrono::high_resolution_clock::now();

  //Pintando o fundo da cena de "outra cor"
  floodFill(mask, {0, 0}, 1);

  //Busca objetos e os rotula
  new_color=10;
  for(int i=1; i < height-1; i++){
    for(int j=1; j < width-1; j++){
      if(mask.at<uchar>(i,j) == 255){
    		p.x=j;
    		p.y=i;
        n_objects++;
    		floodFill(mask, p, new_color);
        //Reinício da contagem para manter a cor normalizada
        if(new_color==245){
          new_color = 10;
        }
        //Pula o intervalo usado pra pintar objetos com buracos
        else if(new_color==110){
          new_color = 140;
        }
        //Incremento das cores
        else{
          new_color++;
        }
  	  }
    }
  }

  //Identificação dos objetos com buracos
  for(int i=1; i < height-1; i++){
    for(int j=1; j < width-1; j++){
      //Caso tenha encontrado algum buraco
      if(mask.at<uchar>(i,j) == 0){
        //Analise se o pixel da esquerda não é buraco
        if(mask.at<uchar>(i,j-1) !=0 && mask.at<uchar>(i,j-1) != 1 && mask.at<uchar>(i,j-1) != 125){
          //Se não for, pinte com o tom de cinza = "125"
          floodFill(mask, {j-1, i}, 125);
          holes++;
        }
      }
    }
  }

  //chrono::duration<double> t_gasto = t1 - t0;
  //cout << "Tempo gasto: " << t_gasto.count() << "s\n";
  cout << "Temos " << n_objects << " objetos no total, dentre eles " << holes << " têm buracos\n";
  imshow("image", image);
  imshow("mask", mask);
  //imwrite("labeling.png", image);
  waitKey();

  return 0;
}
