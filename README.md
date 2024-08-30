# Share-Journeys-Management-UI

## Overview 🌟

**Share-Journeys-Management** is a comprehensive system designed to manage posts, user interactions, and administrative functions related to shared journeys.
## Frontend 🌐

### Features for Clients 👥

- **Authentication**: Secure user authentication. 🔒
- **Post Management**:
  - **Filter and Search**: Ability to filter and search for posts. 🔍
  - **CRUD Operations**: Create, Read, Update, and Delete posts. ✏️
  - **Share Posts**: Share posts with other users. 🔄
  - **Rating and Comments**: Rate and comment on posts, with the ability to reply to comments. ⭐💬
  - **Post History**: View the history of posts. 📜
  - **Invited Trips**: Manage and view trips to which the user has been invited. ✈️
- **Chat**:
  - **CRUD Group Chat**: Create, Read, Update, and Delete group chats. 💬
  - **Real-Time Chat**: Real-time chat with other users. ⏱️
- **Notifications**: Receive notifications when invited to trips. 🔔
- **Google Map Integration**: Display location information using Google Maps. 🗺️
- **Export to Excel**: Export data to Excel files. 📊

### Features for Staff 🧑‍🔧

- **Authentication**: Secure authentication for staff members. 🔑
- **Post Approval**: Approve posts using AI for content moderation. 🤖

### Technologies Used 🛠️

- **React Native**: Framework for building mobile applications. 📱
- **Push Notification Expo**: Handling push notifications in React Native. 📬
- **Google Maps API**: For map integration. 🌍
- **Firestore**: NoSQL cloud database for real-time data. ☁️


### API Integration 🔗

The frontend communicates with the backend via RESTful APIs to manage data and perform actions. Here’s how it works:

- **API Calls**: The application makes HTTP requests to the backend using Axios to handle CRUD operations, authentication, chat, and more. 🚀
- **Endpoints**: Each feature (e.g., post management, comments) has corresponding API endpoints. Ensure to refer to the backend API documentation for the correct endpoint URLs and request formats. 📑
- **Data Handling**: The frontend processes and displays data received from the API, handles user interactions, and updates the UI in real-time based on the responses. 📈
