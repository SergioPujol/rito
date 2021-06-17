import rosunit
import test_cases_rotate_robot

# rosunit
print("Running test")
rosunit.unitrun('robot_control', 'test_cases_rotate_robot',
                'test_cases_rotate_robot.MyTestSuite')