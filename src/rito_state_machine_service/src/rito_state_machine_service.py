#! /usr/bin/env python

import rospy
from rito_state_machine_msg.srv import RitoServiceMessage, RitoServiceMessageResponse

#from geometry_msgs.msg import Twist


def my_callback(request): # Funcion que se ejecuta cuando se llama al servicio
    rospy.loginfo("The service state machine has been called")
    print(request)

    ## Escribir el codigo que haga moverse el robot formando un cuadrado

    response = RitoServiceMessageResponse()
    response.success = True
    return response    

rospy.init_node('rito_state_machine_service')  # se inicializa el nodo
my_service = rospy.Service('/move_to', RitoServiceMessage, my_callback)  # se crea el servicio

rate = rospy.Rate(1)
rospy.loginfo("Service /move_to ready")
rospy.spin()  # mantiene el service abierto 
