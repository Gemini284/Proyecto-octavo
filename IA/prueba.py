import numpy as np
import tensorflow as tf
import matplotlib.pyplot as plt
import cv2
import sys
import io

def get_img_array(img_path, size):
    """Preprocess the image to get it ready for prediction"""
    img = tf.keras.preprocessing.image.load_img(img_path, target_size=size)
    array = tf.keras.preprocessing.image.img_to_array(img)
    array = np.expand_dims(array, axis=0)
    return array

def make_gradcam_heatmap(img_array, model, last_conv_layer_name):
    """Generates a Grad-CAM heatmap for a given image and model"""
    grad_model = tf.keras.models.Model(
        [model.inputs], [model.get_layer(last_conv_layer_name).output, model.output]
    )

    with tf.GradientTape() as tape:
        last_conv_layer_output, preds = grad_model(img_array)
        pred_index = tf.argmax(preds[0])
        class_channel = preds[:, pred_index]

    grads = tape.gradient(class_channel, last_conv_layer_output)
    pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))

    last_conv_layer_output = last_conv_layer_output[0]
    heatmap = last_conv_layer_output @ pooled_grads[..., tf.newaxis]
    heatmap = tf.squeeze(heatmap)

    heatmap = tf.maximum(heatmap, 0) / tf.math.reduce_max(heatmap)
    return heatmap.numpy(), float(pred_index)

def save_and_display_gradcam(img_path, heatmap, cam_path, prediction, alpha=0.4):
    """Superimposes the heatmap on the original image and saves it"""
    img = cv2.imread(img_path)
    heatmap = cv2.resize(heatmap, (img.shape[1], img.shape[0]))
    heatmap = np.uint8(255 * heatmap)
    heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)
    superimposed_img = heatmap * alpha + img
    superimposed_img = np.clip(superimposed_img, 0, 255).astype(np.uint8)

    # Add prediction as a label on the image
    label = f'Predicted Rating: {prediction:.2f}'
    cv2.putText(superimposed_img, label, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2, cv2.LINE_AA)

    # Save the image to a buffer instead of a file
    is_success, buffer = cv2.imencode(".png", superimposed_img)
    io_buf = io.BytesIO(buffer)
    return io_buf

def main(img_path):
    model_path = 'pretrained_model.h5'
    model = tf.keras.models.load_model(model_path, compile=False)
    last_conv_layer_name = 'conv_pw_13'

    img_array = get_img_array(img_path, (192, 256))
    heatmap, prediction = make_gradcam_heatmap(img_array, model, last_conv_layer_name)

    cam_path = 'gradcam_prueba_result.png'
    buffer = save_and_display_gradcam(img_path, heatmap, cam_path, prediction)

    # Display the image from the buffer
    buffer.seek(0)
    img = plt.imread(buffer, format='png')
    
    plt.imshow(img)
    plt.axis('off')
    plt.title('Website aesthetic prediction score: {:.2f}'.format(prediction))
    plt.show()
    print(buffer.getvalue())
    return buffer # Return the buffer

if __name__ == '__main__':
    if len(sys.argv) != 2:
        print("Usage: python gradcam.py <path_to_image>")
    else:
        main(sys.argv[1])
