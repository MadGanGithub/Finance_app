# Instructions for Setup:

### `git clone https://github.com/MadGanGithub/Finance_app.git`

->Open two terminals(Frontend)
### `cd frontend`
### `npm run start`

->Go to backend/config 
->create a config.env file
MODE=development
PORT=4100
JWT_SECRET=american__company
USERNAME=postgres
PASSWORD=postgres
HOSTNAME=localhost
DATABASE=postgres

->Install postgresql and pgadmin tool

(Backend)
### `cd backend` 
### `npm run start`

## API Documentation

https://documenter.getpostman.com/view/33658600/2sA2xnx9eo


## Database Design:


User Table (customer):

user_id (Primary Key): A unique identifier for each user, generated using UUID.
name: The name of the user.
email (Primary Key, Unique): The email address of the user, used for login and must be unique.
password: The password of the user, stored securely (not shown here).

Transaction Table (transaction):

transaction_id (Primary Key): A unique identifier for each transaction, generated using UUID.
amount: The amount of the transaction, stored as a decimal with precision 10 and scale 2.
type: The type of transaction, either 'debit' or 'credit'.
description: A description of the transaction.
user_id: The ID of the user associated with the transaction, used as a foreign key to link transactions to users.
date: The date of the transaction, stored as a DATEONLY type.

## Entity Relationship Model:

+-----------------+             +-------------------+
|     User        |             |    Transaction    |
+-----------------+             +-------------------+
| PK   user_id    |<----------->| PK   transaction_id |
|     name        |             |     amount        |
|     email       |             |     type          |
|     password    |             |     description   |
+-----------------+             | FK   user_id      |
                                |     date          |
                                +-------------------+
