#include <iostream>
#include <opencv2/opencv.hpp>

using namespace std;
using namespace cv;

int main(int argc, char** argv){
	Mat original, invertido;
	uchar aux;

        original = imread(argv[1],CV_LOAD_IMAGE_GRAYSCALE);
	invertido = original.clone();

	if(!original.data){
		cout << "A imagem nao pode ser aberta" << endl;
	}

	namedWindow("Original", WINDOW_AUTOSIZE);
	namedWindow("Invertido", WINDOW_AUTOSIZE);

	for(int l=0; l < invertido.rows; l++){
		for(int c=0; c < invertido.cols/2; c++){

			aux = invertido.at<uchar>(l,c);

			//Primeiro quadrante
			if(l<invertido.rows/2){
				invertido.at<uchar>(l,c) = invertido.at<uchar>(l+invertido.rows/2, c+invertido.cols/2);
				invertido.at<uchar>(l+invertido.rows/2, c+invertido.cols/2) = aux;
			}
			//Terceiro quadrante
			else{
				invertido.at<uchar>(l,c) = invertido.at<uchar>(l-invertido.rows/2, c+invertido.cols/2);
				invertido.at<uchar>(l-invertido.rows/2, c+invertido.cols/2) = aux;
			}
		}
	}

	imshow("Original", original);
	imshow("Invertido", invertido);
	waitKey();

	return 0;
}
