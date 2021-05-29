:bookmark_tabs: Table of Contents
================
<!-- ts -->
  - [Table of Contents](#bookmark_tabs-table-of-contents)
  - [Getting Started](#memo-getting-started)
  - [Backend](#key-backend)
  - [Starting](#hammer-starting)
  - [Next Step](#fast_forward-next-step)
<!-- te -->

## :memo: Getting Started

```bash
# From the base folder enter the api folder
cd api
# once inside the api folder run:
yarn
# or if you ususing npm run:
npm install
```

## :key: Backend

After installing all the backend dependencies, you will need to configure the [frontend](https://github.com/ylyra/coopers/tree/main/api#memo-getting-started) dependencies, if you did that before installing the frontend, you can skip this part.

### Config typeorm

There is two option of how to run the typeorm, the basics that use sqlite3 as the database or using postgres, if you runing the basics no change is needed just run the command below 

```bash
yarn typeorm migration:run
# or in case you are using npm:
npm run typeorm migration:run

# thats create a default user with 
# email: admin@admin.com
# password: 123
```

It will generate the sqlite3 database inside ``src/database`` and will create some default values to each table.

#### Runing typeorm with postgres

But, if you want to run as a postgres database there is some changes needed. You can run the postgres database in a Docker. [Here a tutorial](https://towardsdatascience.com/local-development-set-up-of-postgresql-with-docker-c022632f13ea)

Create your postgres instance on docker then create an inside, after that you need to creat a ``.env`` file in the root of the api folder, you can copy the content of ``.env.example`` and replace the values of 

```bash
TYPEORM_HOST = 
TYPEORM_PORT =
TYPEORM_USERNAME = 
TYPEORM_PASSWORD =

# respectfully as created to your database

# you also will need to change the TOKEN_SECRET to your own secret token.
```

After replacing the values, you need to reconfigure the ``ormconfig.json``, first of all, change it's name to  ``ormconfig.js`` and replace the code inside to the code below:

```bash
module.exports = {
  "type": "postgres",
  "host": process.env.TYPEORM_HOST,
  "port": process.env.TYPEORM_PORT,
  "username": process.env.TYPEORM_USERNAME,
  "password": process.env.TYPEORM_PASSWORD,
  "database": process.env.TYPEORM_DATABASE,
  "entities": [process.env.TYPEORM_ENTITIES],
  "migrations": [process.env.TYPEORM_MIGRATIONS],
  "cli": {
    "migrationsDir": process.env.TYPEORM_MIGRATIONS_DIR
  },
  "ssl": {
    "rejectUnauthorized": false,
  }
}
```

After run that you are ready to the next step. Create the migrations:

```bash
yarn typeorm migration:run
# or in case you are using npm:
npm run typeorm migration:run

# thats create a default user with 
# email: admin@admin.com
# password: 123
```

## :hammer: Starting

To run the backend project, inside the api folder in your prompt run:

```bash
yarn dev
# or, if you using npm
npm run dev

# after typing this command your backend application will start running on port :3333

# to open it in your browser access http://localhost:3333
```
___

## :fast_forward: Next Step

[Tutorial for the frontend part](https://github.com/ylyra/coopers/tree/main/web#memo-getting-started)
