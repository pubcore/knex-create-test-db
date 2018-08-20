## Helper to create on-the-fly sql database tables to test knex with mocha

#### Prerequisite
* mocha used for tests
* knex used for database (RDMS) persitence functions to test

#### Example
	import {expect} from 'chai'
	import main from '../src/index'

	var rows = [
			{author:'king', published:new Date(), sold:42}
		],
		types = {author:'string', published:'dateTime', sold:'integer'},
		table = 'books'

	describe('create test db', () => {

		//The test table will be created and droped for each "it"
		//leverage mocha's "beforeEach" callbacks.
		//knex will be destroyed after "describe" block finished
		
		var knex = main({table, rows, beforeEach, after, types})
		it('knex object connected to on-the-fly sqlite3 table', () => {
			knex(table).where({author:'king'}).then(rows => {
				expect(rows[0].sold).to.equal(42)
			})
		})
	})
