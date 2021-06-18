#! /usr/bin/env python

import rospy
from rito_state_machine_msg.srv import RitoServiceMessage, RitoServiceMessageResponse

#from rito_state_machine import rito_state_machine

#from geometry_msgs.msg import Twist

#!/usr/bin/env python
import rospy
from rospy.core import NullHandler
from rospy.names import resolve_name
import smach
import time
from smach import State, StateMachine
from smach_ros import IntrospectionServer

import cv2
from cv_bridge import CvBridge, CvBridgeError
from sensor_msgs.msg import Image
import numpy as np
import boto3


import actionlib
from move_base_msgs.msg import MoveBaseAction, MoveBaseGoal, MoveBaseActionFeedback
from tf.transformations import quaternion_from_euler
from collections import OrderedDict

lista_tareas = []

endedRoute = False
scanned = False

'''
# Completa este objeto con tus credenciales
awsSession = [
    "ASIAWMD7VZ2ADCB5S3T2", # access key id 
    "G3v9bLttt7JLPQFKEk2D6IV+ARYA+9tu5IZy1X0k", # secret access key
    "IQoJb3JpZ2luX2VjENf//////////wEaCXVzLXdlc3QtMiJHMEUCIQCWgWHzoXEQ2kznbZtNnnEXteCV61QEyHtW8qh1NRP4YQIgP3pZbkgt9JdVpGxV+mWe4ttFXyQuxzssRE6CZUxe30IqrAIIcBAAGgw0MzgzNTQ0MzE2MTYiDHWBFGQmEuc9EvJvQCqJAq7ob4aYL2pB72jNBT6mVCicFFfHeJZoXaNsbb68YlKdxEGB/vL8gI6mWze509qKObWu51nPZcv8UW72i4vMjIJ4qCfloUIGL139NkgM4nZZS4Ry2/QWfiDHLBmopL7dIO9Q+Q3CSiR3w2AtnHLn6rBNmrUihSAA9OWhFlFYN6W4yyIQTaxjahmzQzxb09giLw8e0bZG4WNuIVWe8Z56wTVPpWMShWbzbBzWMbmnSKvU6KokWawRl8QsjqeY7Hl5025gKaGqMzMk6+AGq3vvGSagkdjqgUUWPSWj3mJu2XLVsiCMzDEh6Kl5ViuDOCb5gxO27eWiebRiqoBU7qrFuP2HD6b2LEpHssYw5uCShQY6nQGSxrZ1KcRzou579fKabzDKGaOEkY/8wUdB8zfID8U68+m6x6a5FkwM1lidsEVc6w0xdZwFh6fVxTPY8x9w1meZpVTdSGolkkzaFYWOmjRXROIAtjGvpmggeg3kDedMRQae0EaZVkutGv83vbtgsrdNE8+ymh2o5xWX38y1yMzwnrzKuJnINkSXckrI/5K9sQ3hlHB4sMmyclbVRmAx", # token
    'us-east-1' # region
]
# Creamos la sesion de AWS con las credenciales
session = boto3.Session(
    aws_access_key_id=awsSession[0],
    aws_secret_access_key=awsSession[1],
    aws_session_token=awsSession[2],
    region_name=awsSession[3])

# Indicamos el cliente: comprehend

rekognition = session.client(service_name='rekognition', region_name='us-east-1')'''


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

    def execute(self, userdata):
        print("Escaneando producto...")
        cont = 0
        while not scanned:
            cont = cont + 1
            if cont > 200:
                return 'aborted'
            '''
            if(self.data!=NullHandler):
                try:
                    # Seleccionamos bgr8 porque es la codificacion de OpenCV por defecto
                    cv_image = self.bridge_object.imgmsg_to_cv2(self.data, desired_encoding="bgr8")
                except CvBridgeError as e:
                    print(e)

                client=boto3.client('rekognition')
            
                with open(cv_image, 'rb') as image:
                    response = client.detect_labels(Image={'Bytes': image.read()})
                    
                print('Detected labels in ' + cv_image)    
                if(len(response['Labels']) > 0):
                    return 'succeeded'

                print("Por favor, escanee el producto")
                cont+=1 
                if cont > 3:
                    break
            else:
                '''
        return 'succeeded'

waypoints_dict = {
    'carniceria' : {
        'tag': 'GO_TO_CARNICERIA',
        'coord': (0.1, -0.1, 0.0), # 1.8, -0.8, 0.0
        'dir' : (0.0, 0.0, 1.0, 0.0),
        'class' : RecogerCarniceria(),
        'function' : 'RECOGER_CARNICERIA'
    },
    'pescaderia' : {
        'tag': 'GO_TO_PESCADERIA',
        'coord': (-0.1, 0.1, 0.0), # 1.8, 0.8, 0.0
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
    
    endedRoute = False
    spl = str(request).split()[1]
    res = spl[1:len(spl)-1]
    destinos = res.split(',')
    print(destinos)
    
    if "scan" in destinos:
        rospy.loginfo("Scanned product")
        scanned = True
        response = RitoServiceMessageResponse()
        response.success = True
        response.bill = "Producto: "+ str(3)
    else:
        lista_tareas = destinos
        rospy.loginfo("The service state machine has been called")
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
