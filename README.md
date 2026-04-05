The Book Club Management System is a full-stack web application designed to simplify the management of book clubs, memberships, and user interactions. It provides administrators and members with an intuitive interface to organize club activities, approve memberships, and share real-time updates.

🚀 Features
User registration and authentication

Club creation and membership management

Admin approval for membership requests

Real-time status updates for clubs

Secure backend validation and data handling

Responsive design and smooth user experience

Tech Stack
Frontend:

React.js

Axios (for API integration)

Backend:

Express.js

Node.js

MongoDB (for data storage)

Mongoose (ODM)

Installation and Setup
Follow these steps to set up the project locally:

Clone the repository:

bash
git clone https://github.com/ChadaniKhadka/bookClubManagementSystem_IFN636_A2.git
Navigate to the project directory:

bash
cd book-club-management
Install backend dependencies:

bash
cd backend
npm install
Set up environment variables:
Create a .env file inside your backend folder and add:

text
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
Run the backend server:

bash
npm start
Install frontend dependencies:

bash
cd ../frontend
npm install
Run the frontend:

bash
npm start
Open in browser:
Visit http://localhost:3000