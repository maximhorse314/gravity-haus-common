[![Maintainability](https://api.codeclimate.com/v1/badges/74c7d7de668e719f7cf9/maintainability)](https://codeclimate.com/repos/62c59ee7f15d906633005cfa/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/74c7d7de668e719f7cf9/test_coverage)](https://codeclimate.com/repos/62c59ee7f15d906633005cfa/test_coverage)
 
 ### Install dependancys
  - run `npm i` in root

## Database 
  - [sequelize-typescript](https://www.npmjs.com/package/sequelize-typescript#installation) to manage database models in lambda layer
  - [sequelize-cli](https://www.npmjs.com/package/sequelize-cli) to manage the migrations and seeds
#### Migrations
- `npx sequelize migration:create --name <NAME OF MIGRATION>` creates migration file

- `npm run db:migrate` runs migrations for development and test databases
  - `db:migrate:test` run migrations on test database
  - `db:migrate:dev` run migrations on development database

- `npm run db:migrate:undo --name=<FILE NAME>` Reverts a migration on development and test databases
  - `npm run db:migrate:undo:test --name=<FILE NAME>` run undo on test database
  - `npm run db:migrate:undo:dev --name=<FILE NAME>` run undo on development database

#### Seeds
- `npx sequelize seed:generate --name MODEL_NAME`  Generates a new seed file
- `npx sequelize db:seed --seed SEEDER_FILE_NAME`  Run specified seeder
- `npx sequelize db:seed:undo`                     Deletes data from the database
- `npx sequelize db:seed:all`                      Run every seeder
 
 ### Testing
  - `npm run test`: run test and outputs coverage
  - `npm run test:watch`: runs test and reruns code is updated

### Adding a new Function

run: `gh-cli faas-fun --http-mmethod <delete | get | patch | post | put > --function-nname <THE NEAME OF THE NEW FUNCTION>`
  - short hand ex: `gh-cli faas-fun -hm post -fn login`

#### File Structure

```
<services>
|--- package.json
|--- src
      |--- <HTTP Method (create | delete| post | put | patch | get )>
        |--- <function>
            |--- <function>.ts
            |--- tests
                |--- events
                    |--- <function-event>.ts
                |--- <function>.test.ts

```

# LEARN

[Step by step: Building and publishing an NPM Typescript package.](https://itnext.io/step-by-step-building-and-publishing-an-npm-typescript-package-44fe7164964c)

[Creating and publishing private packages](https://docs.npmjs.com/creating-and-publishing-private-packages)

