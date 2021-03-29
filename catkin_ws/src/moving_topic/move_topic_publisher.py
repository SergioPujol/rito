#! /usr/bin/env python

import rospy
import math
from geometry_msgs.msg import Twist

rospy.init_node('move_topic_publisher')
pub=rospy.Publisher('cmd_vel', Twist, queue_size=10)

def move_topic(Dir, Z, F):
    Vdir= Dir*Z
    T=(F*math.pi)/Z
    max_iteraciones=round(T/(1/F)*Z)
    move=Twist()
    rate=rospy.Rate(2)
    num=-1

    while not rospy.is_shutdown():
        if num < max_iteraciones+1:
            print("Realizando movimiento circular...")
            move.linear.x = Vdir
            move.angular.z = Z
            pub.publish(move)
            num += 1
            rate.sleep()
        else:
            print("Final")
            move.linear.x = 0
            move.angular.z = 0
            pub.publish(move)
	    rospy.spin()

move_topic(1.0,1.0,2.0)
