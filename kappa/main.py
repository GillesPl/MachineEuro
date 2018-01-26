import requests
import time
import keras
from keras.models import load_model
import cv2
import numpy as np
from PIL import Image
import pandas as pd
from keras.utils import np_utils
from keras.preprocessing import image
from keras.preprocessing.image import ImageDataGenerator
from directkeys import PressKey, ReleaseKey, W, A, S, D
from mss import mss

model = load_model('model.h5')
monitor = {'top': 0, 'left': 0, 'width': 1100, 'height': 820}

scalefactorvertical = 0.39024
scalefactorhorizontal = 0.38818

def execute():
    current = get_steer_wheel()
    aim = predict_steer_wheel()
    if (current < aim - 0.02):
        PressKey(A)
        ReleaseKey(D)
        print("%s < %s" % (current, aim))
    elif (current > aim + 0.02):
        PressKey(D)
        ReleaseKey(A)
        print("%s > %s" % (current, aim))
    else:
        ReleaseKey(A)
        ReleaseKey(D)
        print("%s ~= %s" % (current, aim))

def get_steer_wheel():
    r = requests.get('http://192.168.0.227:25555/api/ets2/telemetry')
    r = r.json()
    return r['truck']['gameSteer'] 

def is_game_paused():
    r = requests.get('http://192.168.0.227:25555/api/ets2/telemetry')
    r = r.json()
    return r['game']['paused'] 

def predict_steer_wheel():
    global model, scalefactorvertical, scalefactorhorizontal
    with mss() as sct:
        sct_img = sct.grab(monitor)
        img = Image.frombytes('RGB', sct_img.size, sct_img.rgb)        
        img = img_to_arr(img)
        img = normalize(img)        
        img = cv2.resize(img, None, fx=scalefactorhorizontal, fy=scalefactorvertical, interpolation=cv2.INTER_AREA)
    return model.predict(np.array([img]))

def img_to_arr(img):
    img = image.img_to_array(img)
    return img

def normalize(img):
    img[:,:,0] -= 94.9449
    img[:,:,0] /= 58.6121

    img[:,:,1] -= 103.599
    img[:,:,1] /= 61.6239

    img[:,:,2] -= 92.9077
    img[:,:,2] /= 68.66
    return img

def get_speed():
    r = requests.get('http://192.168.0.228:25555/api/ets2/telemetry')
    r = r.json()
    return r['truck']['speed'] 


while is_game_paused():
    time.sleep(0.2)

while is_game_paused() == False:
    execute()        
    #if(get_speed() <= 20):
    #   PressKey(W)
    #else:
    #    ReleaseKey(W)
    time.sleep(0.1)

ReleaseKey(W)

