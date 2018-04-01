#include <iostream>
#include <opencv2/opencv.hpp>
#include <chrono> //Para medir o tempo de execução

using namespace cv;
using namespace std;

int main(int argc, char** argv){
  Mat image, mask;
  int width, height;
  int nova_cor;
  Point p;

  image = imread(argv[1],CV_LOAD_IMAGE_GRAYSCALE);
  mask = image.clone();

  if(!image.data){
    std::cout << "imagem nao carregou corretamente\n";
    return(-1);
  }
  //Captura das dimensões da imagem
  width=mask.size().width;
  height=mask.size().height;

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
  nova_cor=10;
  for(int i=1; i < height-1; i++){
    for(int j=1; j < width-1; j++){
      if(mask.at<uchar>(i,j) == 255){
    		p.x=j;
    		p.y=i;
    		floodFill(mask, p, nova_cor);
        //Reinício da contagem para manter a cor normalizada
        if(nova_cor==245){
          nova_cor = 10;
        }
        //Pula o intervalo usado pra pintar objetos com buracos
        else if(nova_cor==110){
          nova_cor = 140;
        }
        //Incremento das cores
        else{
          nova_cor++;
        }
  	  }
    }
  }
  int ponto, leste, oeste, sul, norte;
  //Identificação dos objetos com buracos
  for(int i=1; i < height-1; i++){
    for(int j=1; j < width-1; j++){
      //Caso tenha encontrado algum buraco
      ponto = mask.at<uchar>(i,j);
      norte = mask.at<uchar>(i-1,j);
      sul   = mask.at<uchar>(i+1,j);
      oeste = mask.at<uchar>(i,j-1);
      leste = mask.at<uchar>(i,j+1);
      if(ponto == 0){
        //Analise se o pixel de cima não é buraco
        if(norte!=0 && norte!=1 && norte!=125){
          //Se não for, pinte com o tom de cinza = "125"
          cout << "NORTE : [" << i << " , " << j << "] \n";
          floodFill(mask, {j, i-1}, 125);
        }
        //Analise se o pixel de baixo não é buraco
        else if(sul != 0 && sul != 1 && sul != 125){
          //Se não for, pinte com o tom de cinza = "125"
          cout << "SUL : [" << i << " , " << j << "] \n";
          floodFill(mask, {j, i+1}, 125);
        }
        //Analise se o pixel da esquerda não é buraco
        else if(oeste !=0 && oeste != 1 && oeste != 125){
          //Se não for, pinte com o tom de cinza = "125"
          cout << "OESTE : [" << i << " , " << j << "] \n";
          floodFill(mask, {j-1, i}, 125);
        }
        //Analise se o pixel da direita não é buraco
        else if(leste != 0 && leste != 1 && leste != 125){
          //Se não for, pinte com o tom de cinza = "125"
          cout << "LESTE : [" << i << " , " << j << "] \n";
          floodFill(mask, {j+1, i}, 125);
        }
      }
    }
  }

  //chrono::duration<double> t_gasto = t1 - t0;
  //cout << "Tempo gasto: " << t_gasto.count() << "s\n";

  imshow("image", image);
  imshow("mask", mask);
  //imwrite("labeling.png", image);
  waitKey();
  return 0;
}
