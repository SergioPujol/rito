# Rito

## Robotic Shopping Cart: Automated Assistance for Efficient Supermarket Experience

This repository showcases the development of a robotic shopping cart project that aims to enhance the efficiency and convenience of grocery shopping during the pandemic. With the increasing challenges of crowded supermarkets and long queues, our project focuses on creating a robot that assists users in their daily shopping tasks. The robot utilizes autonomous navigation, image recognition, and web-based control to provide a seamless and automated shopping experience.

## Project Overview:
The project revolves around the design, implementation, and operation of a robot capable of autonomously navigating through the supermarket while assisting users in their shopping needs. The use of cutting-edge technologies ensures the development of an innovative solution.

## Key Features:

1. Autonomous Navigation: The robot autonomously navigates the supermarket, relieving users from the burden of pushing the cart.
2. Web-Based Control Interface: An intuitive web application allows users to control and monitor the robot's actions, including viewing the supermarket map, managing shopping lists, and personalizing profiles.
3. Object Recognition: The robot incorporates image recognition capabilities to identify and differentiate various products, automating the shopping process.
4. Shopping List Management: Users can create, modify, and delete shopping lists within the web application, ensuring an organized and efficient shopping experience.
5. User Authentication: The application incorporates user authentication to provide secure access to saved data and personalized settings.
6. Real-Time Weight Monitoring: The web interface displays the current weight of items in the cart, facilitating efficient shopping and checkout.
7. Route Planning: The robot generates optimal routes within the supermarket based on the user's shopping list, ensuring efficient collection of items.
8. Product Detection: By analyzing weight changes, the system detects when a new product is added to the cart, providing real-time updates to the user.
9. Map Visualization: The web interface displays the robot's planned route on the supermarket map, allowing users to track its progress.
10. Pick-Up Request: Users can send the robot to specific supermarket areas (e.g., seafood, butcher) to collect items by selecting designated pickup points within the web application.

## Technologies Used in the Web Application:
The web application has been developed using various technologies to ensure its functionality and seamless integration with the robotic system. The technologies used include:

- HTML5, CSS, and JavaScript: These core web technologies form the foundation of the application, providing structure, styling, and interactivity.
- Bootstrap 4.0: Bootstrap has been utilized for modals, dropdowns, and overall page styling, enhancing the visual appeal and responsiveness of the web application.
- jQuery 3.2.1: Used in conjunction with Bootstrap, jQuery has facilitated JavaScript programming and improved development efficiency.
- RosLib: This library has been employed for communication with ROS (Robot Operating System), enabling seamless integration and control of the robot.
- Socket.IO 1.7.3: Socket.IO, a JavaScript library, has been used for bidirectional, real-time communication between the client and server through event-based interactions. It enables real-time connections with the server.
- feathers.js (Client) 2.0.0: The feathers.js client library has been employed to communicate with the Feathers server. It provides necessary plugins for real-time connections with socket.io, server-emitted events, and JSON Web Tokens (JWT) authentication.
- JWT (JSON Web Tokens): JWT technology has been utilized for user authentication to maintain authentication across the entire web application. The server supplies the token, which is stored locally by the client.
- Cookies: Cookies have been used to store the client's connection with the robot throughout the web application, regardless of the user's active tab. The cookie stores the ROS server's IP address in hexadecimal format.

## Methodology and Evaluation:
To ensure comprehensive engineering education and effective project management, we have adopted a combined approach of CDIO and Scrum methodologies. The CDIO methodology provides a holistic framework, guiding the project from concept development to operational implementation. The Scrum methodology is utilized for project management, incorporating sprint planning, task management, and iterative development, ensuring efficient progress and timely delivery.
