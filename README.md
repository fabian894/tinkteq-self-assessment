# tinkteq-self-assessement
Authentication &amp; Role-Based Access Control (RBAC)

• Create a secure JWT-based authentication system for user login and token management.
• Implement role-based access control (RBAC) to restrict access to APIs based on user roles
(Admin, Shipper, Carrier).

 **clear instructions on how to set up and run the API locally, along with any dependencies or configurations needed**
• Install the following dependencies
npm init -y
npm install express mongoose dotenv bcryptjs jsonwebtoken cors cookie-parser
npm install -g nodemon
npm install validator

• Run he following command
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))" (optional since i have pasted the random character for the JWT_SECRET below)
node migrations/migrateUser.js

• Create a file in the root/directory of the project and name it .env (github do not permit configuration files containing vital information)
## paste the below code inside the .env file
PORT=5000
MONGO_URI=mongodb://localhost:27017 (replace with youe mongo_DB connection string)
JWT_SECRET=5b9c88781b15d607659fd5da858689e5554db153d88f7be93762200978cb33ce6e7b6b23b15a730de63ae83aabbf9b1ee307793e2daef958204cd86733e278a6

## Run the project
npm run dev

note: i have attached the API documentation on the repository. Kindly open it on postman and test the endpoints created on it.

Thank you 
