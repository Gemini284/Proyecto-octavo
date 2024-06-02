# Grad-CAM Visualization Tool
## Descripción

Este script permite generar una visualización Grad-CAM (Class Activation Map) para una imagen dada utilizando un modelo preentrenado de Keras. La visualización superpone un mapa de calor sobre la imagen original, indicando las áreas más importantes para la predicción del modelo. Adicionalmente, la imagen resultante incluye una etiqueta con la puntuación predicha.

## Requisitos

Asegúrate de tener instalados los siguientes paquetes de Python antes de ejecutar el script:

    pip install -r ./requirements.txt

## Ejecución del script

Para ejecutar el script, utiliza el siguiente comando en tu terminal:

    python gradcam.py <ruta_a_la_imagen>

Ejemplo

    python ./gradcam.py ./example.png

## Detalles del script

El script gradcam.py realiza los siguientes pasos:

* Carga del modelo preentrenado: Se carga un modelo Keras preentrenado desde el archivo pretrained_model.h5.
* Preprocesamiento de la imagen: La imagen de entrada se preprocesa para que esté en el formato adecuado para el modelo.
* Generación del mapa de calor Grad-CAM: Se genera un mapa de calor Grad-CAM para la imagen utilizando el modelo.
* Superposición del mapa de calor: El mapa de calor se superpone a la imagen original, y se guarda la imagen resultante con el nombre gradcam_result.png.
* Etiquetado de la imagen: Se añade la puntuación predicha como una etiqueta en la imagen resultante.

#### Parámetros de entrada

* model_path: La ruta donde se encuentra el modelo preentrenado de keras para hacer la predicción del score
* img_path: La ruta a la imagen para la cual se desea generar la visualización Grad-CAM.
* gradcam_result_path: La ruta de la imagen con los resultados de la visualización Grad-cam.

#### Salidas

* img_path: La ruta a la imagen para la cual se desea generar la visualización Grad-CAM.

#### Ejemplo de salida

* El script guardará la imagen resultante en el archivo gradcam_result.png en el directorio de trabajo actual. Además, la puntuación predicha se mostrará como una etiqueta en la imagen.

![alt text](<resultado control.png>)
