# Backend for the Noodle-Project
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

### Application-Initialization
1. Clone this repository
2. Run `npm i`
3. Set up the database settings in `src/index.ts` and `tests/integration/helper.ts` (Only needed if using a different database than describe above)
4. Run `npm start init`
  - This will create a administrator with the the username `administrator` and the password `administrator`

## Usage
### Development
#### Start the server and NOT restart on file change
```
npm start
```
#### Start the server and restart on file changes
```
npm run watch
```
#### Unit-Tests
```
npm run test
```
#### Integration-Test
```
npm run test:e2e
```
#### Build the project
```
npm run build
```
The output of the build process will be inside `build/`
### Production
The application can be run by using the package (recommend) or cloning and running/building this repository.

For more information about accquiring the package see the [Package Repository](https://github.com/orgs/Software-Engineering-DHBW/packages?repo_name=noodle_backend)

If using the application in production `NODE_ENV=development` **MUST NOT BE SET**.    
Not doing so will sign with the JWT with a hardcoded value and produce a huge security risk.
#### Running from package
##### Globally installed
If the packages has been installed globally, use the following command 
```
noodleBackend
```
##### Local installation
If the packages has been installed in a local project, use the application with the following command
```
npx noodleBackend
```
#### Running from the cloned repository
This will compile the project and the execute it with `node`, to improve performance
```
npm start:prod
```
## Documentation
The API-Documentation can be found in the [Wiki](https://github.com/Software-Engineering-DHBW/noodle_backend/wiki/API)
For the Module Documentation look [here](https://software-engineering-dhbw.github.io/noodle_backend/index.html)
