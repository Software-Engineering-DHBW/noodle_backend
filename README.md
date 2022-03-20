# Awesome Project Build with TypeORM
## Installation
### NodeJS-Installation
Install NodeJS from the [Downloads-Page](https://nodejs.org/en/download/) or your package manager.
### PostgreSQL-Installation
The following instructions are primarly for Linux. Instructions on MacOS or Windows may require other steps

1. Install PostgreSQL either from the [Downloads-Page](https://www.postgresql.org/download/) or from your package manager
2. Switch to the postgres-user and initialize the database cluster
```
sudo -iu postgres
initdb -D /var/lib/postgres/data
```
3. Start or enable the PostgreSQL-Service
```
sudo systemctl start postgresql
```
4. Create a database named `noodle`
```
createdb noodle
```
5. Add a user with the name `noodle`
```
createuser noodle
psql -d noodle -c "CREATE USER noodle WITH PASSWORD 'noodle'; GRANT ALL ON ALL TABLES IN SCHEMA public TO noodle;"
```

For more information see the the Section [Server Setup and Operation](https://www.postgresql.org/docs/14/runtime.html) in the PostgreSQL-Documentation or the [PostgreSQL-Entry](https://wiki.archlinux.org/title/PostgreSQL) in the Arch Linux-Wiki.

# Usage
Steps to run this project:

1. Run `npm i` command
2. Setup database settings inside `ormconfig.json` file
3. Run `npm start` command

# Documentation
For the API Documentation look [here](https://software-engineering-dhbw.github.io/noodle_backend/index.html)
