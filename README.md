# Node-React-MongoDb-GraphQL-Apollo-JWT Authentication App

## System requirements

    * Nodejs version 20.11.1
    * npm version 10.4.0 or above
    * Mongo server
    * Apollo server

## Installation Guide

    1. Clone the project - `git clone https://gitlab.wylog.com/marco/user-authentication-using-graphql.git`
    After clone set up both Frontend & Backend
     - Backend
        - After clone go to the directory auth
        - 'npm install' to install packages
        - npm start
        
     - Frontend
        - After clone go to the directory client
        - 'npm install' to install packages
        - npm start

## Set up .env file
    1. Create .env file in root
    Content:
        MONGO = "mongodb+srv://" //Add your connection string here from mongoDB
        JWT_SECRET = "Marco1" //can create any keyword
