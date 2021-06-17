#! /usr/bin/env python

import rospy
from rito_state_machine_msg.srv import RitoServiceMessage, RitoServiceMessageResponse

#from rito_state_machine import rito_state_machine

#from geometry_msgs.msg import Twist

#!/usr/bin/env python
import rospy
from rospy.core import NullHandler
import smach
import time
from smach import State, StateMachine
from smach_ros import IntrospectionServer

import cv2
from cv_bridge import CvBridge, CvBridgeError
from sensor_msgs.msg import Image
import numpy as np
from keras_preprocessing import image
from keras_preprocessing.image import ImageDataGenerator
import tensorflow as tf


import actionlib
from move_base_msgs.msg import MoveBaseAction, MoveBaseGoal, MoveBaseActionFeedback
from tf.transformations import quaternion_from_euler
from collections import OrderedDict

lista_tareas = []

endedRoute = False

## Descripcion de los estados
class PowerOnRobot(State):
    def __init__(self):
        State.__init__(self, outcomes=['succeeded','aborted'])

    def execute(self, userdata):
        rospy.loginfo("Encendiendo el Robot")
        time.sleep(2)
        return 'succeeded'


class WaitingOrder(State):
    def __init__(self, order_state):
        State.__init__(self, outcomes=['succeeded', 'aborted'], input_keys=[''], output_keys=[''])
        self.order = order_state

    def execute(self, userdata):
        if self.order == 1:
            return 'succeeded'
        else:
            return 'aborted'



class Navigate(State):
    def __init__(self, position, orientation, place):
        State.__init__(self, outcomes=['succeeded', 'aborted'], input_keys=[''], output_keys=[''])
        self._position =position
        self._orientation =orientation
        self._place = place
        self._move_base = actionlib.SimpleActionClient("/move_base", MoveBaseAction)
        rospy.loginfo("Activando el cliente de navegacion..")
        self._move_base.wait_for_server(rospy.Duration(15))


    def execute(self, userdata):
        time.sleep(2)
        goal = MoveBaseGoal()
        goal.target_pose.header.frame_id = 'map'
        rospy.loginfo(self._position)
        goal.target_pose.pose.position.x = self._position[0]
        goal.target_pose.pose.position.y = self._position[1]
        goal.target_pose.pose.position.z = self._position[2]
        goal.target_pose.pose.orientation.x = self._orientation[0]
        goal.target_pose.pose.orientation.y = self._orientation[1]
        goal.target_pose.pose.orientation.z = self._orientation[2]
        goal.target_pose.pose.orientation.w = self._orientation[3]

        rospy.loginfo("ROBOT %s" %(self._place))
        # sends the goal
        self._move_base.send_goal(goal)
        self._move_base.wait_for_result()
        # Comprobamos el estado de la navegacion
        nav_state = self._move_base.get_state()
        rospy.loginfo("[Result] State: %d" % (nav_state))
        nav_state = 3

        if nav_state == 3:
            return 'succeeded'
        else:
            return 'aborted'



class RecogerCarniceria(State):
    def __init__(self):
        State.__init__(self, outcomes=['succeeded','aborted'])

    def execute(self, userdata):
        print("Recogiendo pedido en la Carniceria...")
        for cont in range(0,5):
            cont += 1
            time.sleep(1)
            print(".")
        if cont> 0:
            return 'succeeded'
        else:
            return 'aborted'

class RecogerPescaderia(State):
    def __init__(self):
        State.__init__(self, outcomes=['succeeded','aborted'])

    def execute(self, userdata):
        print("Recogiendo pedido en la Pescaderia...")
        for cont in range(0,5):
            cont += 1
            time.sleep(1)
            print(".")
        if cont> 0:
            return 'succeeded'
        else:
            return 'aborted'

class IrCajero(State):
    def __init__(self):
        State.__init__(self, outcomes=['succeeded','aborted'])

    def execute(self, userdata):
        print("Yendo a la caja del supermercado...")
        for cont in range(0,5):
            cont += 1
            time.sleep(1)
            print(".")
        if cont> 0:
            return 'succeeded'
        else:
            return 'aborted'

class IrCentro(State):
    def __init__(self):
        State.__init__(self, outcomes=['succeeded','aborted'])

    def execute(self, userdata):
        print("Yendo al centro del supermercado...")
        for cont in range(0,5):
            cont += 1
            time.sleep(1)
            print(".")
        if cont> 0:
            return 'succeeded'
        else:
            return 'aborted'


class Charge(State):
    def __init__(self):
        State.__init__(self, outcomes=['succeeded','aborted'], input_keys=['input'], output_keys=[''])

    def execute(self, userdata):
        print("Revisando la carga de la bateria...")
        if userdata.input == 1:
            print("Robot cargado")
            return 'succeeded'
        else:
            print("Robot sin carga")
            return 'aborted'

class Scan(State):

    data = NullHandler

    def __init__(self):
        State.__init__(self, outcomes=['succeeded','aborted'], input_keys=['input'], output_keys=[''])
        print("init")
        self.bridge_object = CvBridge()
        self.image_sub = rospy.Subscriber("/turtlebot3/camera/image_raw",Image, self.camera_callback)

    def camera_callback(self,data):
        self.data = data

    def execute(self, userdata):
        print("Escaneando producto...")
        cont = 0
        while True:
            if(self.data!=NullHandler):
                try:
                    # Seleccionamos bgr8 porque es la codificacion de OpenCV por defecto
                    cv_image = self.bridge_object.imgmsg_to_cv2(self.data, desired_encoding="bgr8")
                except CvBridgeError as e:
                    print(e)

            redCheck = blueCheck = greenCheck = False

            # Convert the imageFrame in 
            # BGR(RGB color space) to 
            # HSV(hue-saturation-value)
            # color space
            hsvFrame = cv2.cvtColor(cv_image, cv2.COLOR_BGR2HSV)
        
            # Set range for red color and 
            # define mask
            red_lower = np.array([136, 87, 111], np.uint8)
            red_upper = np.array([180, 255, 255], np.uint8)

            lower_red = np.array([0,50,50])
            upper_red = np.array([15,255,255])
            red_mask = cv2.inRange(hsvFrame, lower_red, upper_red)
        
            # Set range for green color and 
            # define mask
            green_lower = np.array([25, 52, 72], np.uint8)
            green_upper = np.array([102, 255, 255], np.uint8)
            green_mask = cv2.inRange(hsvFrame, green_lower, green_upper)
        
            # Set range for blue color and
            # define mask
            blue_lower = np.array([94, 80, 2], np.uint8)
            blue_upper = np.array([120, 255, 255], np.uint8)
            blue_mask = cv2.inRange(hsvFrame, blue_lower, blue_upper)
            
            # Morphological Transform, Dilation
            # for each color and bitwise_and operator
            # between imageFrame and mask determines
            # to detect only that particular color
            kernal = np.ones((5, 5), "uint8")
            
            # For red color
            red_mask = cv2.dilate(red_mask, kernal)
            
            # For green color
            green_mask = cv2.dilate(green_mask, kernal)
            
            # For blue color
            blue_mask = cv2.dilate(blue_mask, kernal)
        
            # Creating contour to track red color
            _, contours, _ = cv2.findContours(red_mask, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
            
            if(len(contours) > 0): redCheck = True
            
            '''
            for pic, contour in enumerate(contours):
                area = cv2.contourArea(contour)
                if(area > 300):
                    x, y, w, h = cv2.boundingRect(contour)
                    imageFrame = cv2.rectangle(imageFrame, (x, y), 
                                            (x + w, y + h), 
                                            (0, 0, 255), 2)
                    
                    cv2.putText(imageFrame, "Red Colour", (x, y),
                                cv2.FONT_HERSHEY_SIMPLEX, 1.0,
                                (0, 0, 255))    
        
            '''

            # Creating contour to track green color
            _, contours, _ = cv2.findContours(green_mask, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
            if(len(contours) > 0): greenCheck = True

            '''
            for pic, contour in enumerate(contours):
                area = cv2.contourArea(contour)
                if(area > 300):
                    x, y, w, h = cv2.boundingRect(contour)
                    imageFrame = cv2.rectangle(imageFrame, (x, y), 
                                            (x + w, y + h),
                                            (0, 255, 0), 2)
                    
                    cv2.putText(imageFrame, "Green Colour", (x, y),
                                cv2.FONT_HERSHEY_SIMPLEX, 
                                1.0, (0, 255, 0))
            '''
            # Creating contour to track blue color
            _, contours, _ = cv2.findContours(blue_mask, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
            if(len(contours) > 0): blueCheck = True

            '''
            for pic, contour in enumerate(contours):
                area = cv2.contourArea(contour)
                if(area > 300):
                    x, y, w, h = cv2.boundingRect(contour)
                    imageFrame = cv2.rectangle(imageFrame, (x, y),
                                            (x + w, y + h),
                                            (255, 0, 0), 2)
                    
                    cv2.putText(imageFrame, "Blue Colour", (x, y),
                                cv2.FONT_HERSHEY_SIMPLEX,
                                1.0, (255, 0, 0))
            '''
            if(redCheck):
                print("Escaneado producto rojo")
                endedRoute = True
                return 'succeeded'

            if(blueCheck):
                print("Escaneado producto azul")
                endedRoute = True 
                return 'succeeded'
                
            if(greenCheck):
                print("Escaneado producto verde")
                endedRoute = True           
                return 'succeeded'

            print("Por favor, escanee el producto")
            cont+=1 
            if cont > 3:
                break
        
        return 'aborted'

waypoints_dict = {
    'carniceria' : {
        'tag': 'GO_TO_CARNICERIA',
        'coord': (1.8, -0.8, 0.0),
        'dir' : (0.0, 0.0, 1.0, 0.0),
        'class' : RecogerCarniceria(),
        'function' : 'RECOGER_CARNICERIA'
    },
    'pescaderia' : {
        'tag': 'GO_TO_PESCADERIA',
        'coord': (1.8, 0.8, 0.0),
        'dir' : (0.0, 0.0, 1.0, 0.0),
        'class' : RecogerPescaderia(),
        'function' : 'RECOGER_PESCADERIA'
    },
    'cajero' : {
        'tag': 'GO_TO_CAJERO',
        'coord': (0.5, 0.8, 0.0),
        'dir' : (0.0, 0.0, 1.0, 0.0),
        'class' : IrCajero(),
        'function' : 'IR_CAJERO'
    },
    'centro' : {
        'tag': 'GO_TO_CENTER',
        'coord': (1.0, 0.0, 0.0),
        'dir' : (0.0, 0.0, 1.0, 0.0),
        'class' : IrCentro(),
        'function' : 'IR_CENTRO'
    }
}


def start_tasks(list_tasks): #En list_tasks vienen los nombres [carniceria, pescaderia, cajero]

    sm_rito = StateMachine(outcomes=['succeeded','aborted'])
    sm_rito.userdata.sm_input = 1
    cont = 0

    with sm_rito:

        StateMachine.add('POWER_ON', PowerOnRobot(), transitions={'succeeded':'WAITING_ORDER', 'aborted':'aborted'})
        if len(list_tasks) > 0: 

            StateMachine.add('WAITING_ORDER', WaitingOrder(1), transitions={'succeeded':waypoints_dict[list_tasks[0]]['tag'],'aborted':'WAITING_ORDER'})

            for i in list_tasks:
                cont = cont + 1

                if cont+1 > len(list_tasks):

                    StateMachine.add(waypoints_dict[i]['tag'], Navigate( waypoints_dict[i]['coord'], waypoints_dict[i]['dir'], waypoints_dict[i]['tag']), transitions={'succeeded':'SCAN-'+str(cont),'aborted':'WAITING_ORDER'})
                    StateMachine.add(waypoints_dict[i]['function'], waypoints_dict[i]['class'], transitions={'succeeded': 'SCAN-'+str(cont), 'aborted':'aborted'})
                    StateMachine.add('SCAN-'+str(cont), Scan(), transitions={'succeeded':'GO_TO_CAJERO','aborted':'WAITING_ORDER'})
                    StateMachine.add('GO_TO_CAJERO', Navigate( waypoints_dict['cajero']['coord'], waypoints_dict['cajero']['dir'], waypoints_dict['cajero']['tag']), transitions={'succeeded':waypoints_dict['centro']['tag'],'aborted':'WAITING_ORDER'})
                    StateMachine.add('IR_CAJERO', IrCajero(), transitions={'succeeded': waypoints_dict['centro']['tag'], 'aborted':'aborted'})
                    StateMachine.add(waypoints_dict['centro']['tag'], Navigate( waypoints_dict['centro']['coord'], waypoints_dict['centro']['dir'], waypoints_dict['centro']['tag']), transitions={'succeeded': 'CHARGE','aborted':'WAITING_ORDER'})
                    StateMachine.add('CHARGE', Charge(), transitions={'succeeded': 'succeeded', 'aborted': 'aborted'},remapping={'input':'sm_input', 'output':''})

                else: 
                        
                    StateMachine.add(waypoints_dict[i]['tag'], Navigate( waypoints_dict[i]['coord'], waypoints_dict[i]['dir'], waypoints_dict[i]['tag']), transitions={'succeeded':'SCAN-'+str(cont),'aborted':'WAITING_ORDER'})
                    StateMachine.add(waypoints_dict[i]['function'],  waypoints_dict[i]['class'], transitions={'succeeded':'SCAN-'+str(cont),'aborted':'WAITING_ORDER'})
                    StateMachine.add('SCAN-'+str(cont), Scan(), transitions={'succeeded':waypoints_dict[list_tasks[cont]]['tag'],'aborted':'WAITING_ORDER'})

                    # En vez de Keep Clothes, es la funcion en cada caso

    intro_server = IntrospectionServer('rito_machine',sm_rito, '/SM_ROOT')
    intro_server.start()
    
        #Ejecutamos la maquina de estados
    sm_outcome = sm_rito.execute()
    intro_server.stop()

def shutdown():
    rospy.loginf("Parando la ejecucion...")
    rospy.sleep(1)

def my_callback(request): # Funcion que se ejecuta cuando se llama al servicio
    rospy.loginfo("The service state machine has been called")
    endedRoute = False
    spl = str(request).split()[1]
    res = spl[1:len(spl)-1]
    destinos = res.split(',')
    print(destinos)
    lista_tareas = destinos
    start_tasks(lista_tareas)

    factura = len(destinos) * 4
    response = RitoServiceMessageResponse()
    response.success = True
    response.bill = "Total: "+ str(factura)
    return response    

rospy.init_node('rito_state_machine_service')  # se inicializa el nodo
my_service = rospy.Service('/activate_state', RitoServiceMessage, my_callback)  # se crea el servicio
rate = rospy.Rate(1)
rospy.loginfo("Service /activate_state ready")
rospy.spin()  # mantiene el service abierto 
