#!/usr/bin/env python
import rospy
import smach
import time
from smach import State, StateMachine
from smach_ros import IntrospectionServer

import actionlib
from move_base_msgs.msg import MoveBaseAction, MoveBaseGoal, MoveBaseActionFeedback
from tf.transformations import quaternion_from_euler
from collections import OrderedDict


lista_tareas = ['carniceria', 'pescaderia', 'cajero']

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

waypoints_dict = {
    'carniceria' : {
        'tag': 'GO_TO_CARNICERIA',
        'coord': (-7.0, 4.0, 0.0),
        'dir' : (0.0, 0.0, 1.0, 0.0),
        'class' : RecogerCarniceria(),
        'function' : 'RECOGER_CARNICERIA'
    },
    'pescaderia' : {
        'tag': 'GO_TO_PESCADERIA',
        'coord': (-7.0, -4.0, 0.0),
        'dir' : (0.0, 0.0, 1.0, 0.0),
        'class' : RecogerPescaderia(),
        'function' : 'RECOGER_PESCADERIA'
    },
    'cajero' : {
        'tag': 'GO_TO_CAJERO',
        'coord': (-1.0, 2.0, 0.0),
        'dir' : (0.0, 0.0, 1.0, 0.0),
        'class' : IrCajero(),
        'function' : 'IR_CAJERO'
    },
    'centro' : {
        'tag': 'GO_TO_CENTER',
        'coord': (-4.0, 0.0, 0.0),
        'dir' : (0.0, 0.0, 1.0, 0.0),
        'class' : IrCentro(),
        'function' : 'IR_CENTRO'
    }
}

class main():
    def __init__(self):

        rospy.init_node('move_base_action_client', anonymous=False)
        self.start_tasks(lista_tareas)


    def start_tasks(self, list_tasks): #En list_tasks vienen los nombres [carniceria, pescaderia, cajero]

        sm_lavar= StateMachine(outcomes=['succeeded','aborted'])
        sm_lavar.userdata.sm_input = 1
        cont = 0

        with sm_lavar:

            StateMachine.add('POWER_ON', PowerOnRobot(), transitions={'succeeded':'WAITING_ORDER', 'aborted':'aborted'})
            if len(list_tasks) > 0: 

                StateMachine.add('WAITING_ORDER', WaitingOrder(1), transitions={'succeeded':waypoints_dict[list_tasks[0]]['tag'],'aborted':'WAITING_ORDER'})

                for i in list_tasks:
                    cont = cont + 1

                    if cont+1 > len(list_tasks):

                        StateMachine.add(waypoints_dict[i]['tag'], Navigate( waypoints_dict[i]['coord'], waypoints_dict[i]['dir'], waypoints_dict[i]['tag']), transitions={'succeeded':waypoints_dict['centro']['tag'],'aborted':'WAITING_ORDER'})
                        StateMachine.add(waypoints_dict[i]['function'], waypoints_dict[i]['class'], transitions={'succeeded': waypoints_dict['centro']['tag'], 'aborted':'aborted'})
                        StateMachine.add(waypoints_dict['centro']['tag'], Navigate( waypoints_dict['centro']['coord'], waypoints_dict['centro']['dir'], waypoints_dict['centro']['tag']), transitions={'succeeded': 'CHARGE','aborted':'WAITING_ORDER'})
                        StateMachine.add('CHARGE', Charge(), transitions={'succeeded': 'succeeded', 'aborted': 'aborted'},remapping={'input':'sm_input', 'output':''})

                    else: 
                        
                        StateMachine.add(waypoints_dict[i]['tag'], Navigate( waypoints_dict[i]['coord'], waypoints_dict[i]['dir'], waypoints_dict[i]['tag']), transitions={'succeeded':waypoints_dict[list_tasks[cont]]['tag'],'aborted':'WAITING_ORDER'})
                        StateMachine.add(waypoints_dict[i]['function'],  waypoints_dict[i]['class'], transitions={'succeeded':waypoints_dict[list_tasks[cont]]['tag'],'aborted':'WAITING_ORDER'})
                        # En vez de Keep Clothes, es la funcion en cada caso

        intro_server = IntrospectionServer('Robot_mayordomo',sm_lavar, '/SM_ROOT')
        intro_server.start()

        #Ejecutamos la maquina de estados
        sm_outcome = sm_lavar.execute()
        intro_server.stop()

    def shutdown(self):
        rospy.loginf("Parando la ejecucion...")
        rospy.sleep(1)

if __name__=='__main__':
    try:
        main()
    except rospy.ROSInterruptException:
        rospy.loginfo(" Testeo Robot Mayordomo finalizado")