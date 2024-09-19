NAVANKUR ASSIGNMNET - (Authentication and session management) 

TechStack used - Node.js, Express, Redis, Nodemailer, JWT, Bcrypt etc

Run following commands : 

1. npm i -> to install necessary packages
   
3. start MongoDB server and Redis client locally 
   
4. create .env file in root directory and paste the content below in it

PORT=5000

MONGODB_URI=mongodb://localhost:27017/navankur

JWT_SECRET=ca23a7719ee5187e665b93eb3aac1554ea1fb235346a7638d826153392deb913f51f83a62305284fad276ac4a5ef8e62431ff3c250b68cd2885ef9f19ed7c080dd6e65b1b721123f5c54f9676e7db815

6. Start server using "npm run dev"

7. Use postman to test following endpoints
   
   POST /auth/signup
   
   POST /auth/login
   
   POST /auth/logout
   
   POST /auth/forgot-password
   
   POST /auth/reset-password/:id/:token

9. You cam also use browser to use GET endoints below
    
   GET /auth/signup
   
   GET /auth/login
   
   GET /auth/forgot-password
   
   GET /auth/reset-password/:id/:token
   
