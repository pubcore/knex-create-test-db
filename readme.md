## Helper to create on-the-fly sql database tables to test knex with mocha

#### Prerequisite
* mocha used for tests
* knex used for database (RDMS) persitence functions to test

#### Example
```
import {expect} from 'chai'
import createKnex from '@pubcore/knex-create-test-db'

var rows = [
    {author:'king', published:new Date(), sold:42}
  ],
  table = 'books',
  dbTypes = {author:'string', published:'dateTime', sold:'integer'}

describe('create test db', () => {
  //The test table will be created and droped for each "it" ("beforeEach" callback)
  //Knex will be destroyed after "describe" block finished ("after" callback)

  var knex = createKnex({table, rows, beforeEach, after, dbTypes})

  it('can be used to test some functionality dealing with a knex api', () => {
    expect( bookAvailable({author:'king'}, {db:{knex}}) ).to.be.true
  })
})
```