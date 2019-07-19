'use strict'
const {expect} = require('chai'),
	main = require('../js/index')

var rows = [
		{
			author:'king',
			published:'2017-11-01 00:00:00',
			lastSold:new Date(),
			sold:42
		}
	],
	dbTypes = {
		author:'string',
		published:'dateTime',
		lastSold:'dateTime',
		sold:'integer'
	},
	table = 'books'

describe('create test db', () => {
	var knex = main({table, rows, beforeEach, after, dbTypes})
	it('knex object connected to on-the-fly sqlite3 table', () => {
		knex(table).where({author:'king'}).then(rows => {
			expect(rows[0].sold).to.equal(42)
		})
	})
})
