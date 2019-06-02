'use strict'
const Knex = require('knex'),
	moment = require('moment')

const stampToUTCDate = stamp => {
	if(typeof stamp === 'string'){
		var date = stamp.split(/[\s-:]/)
		return (new Date(Date.UTC(date[0], date[1]-1, date[2], date[3], date[4], date[5])))
	}else{
		return moment(stamp).utc().toDate()
	}
}

const convertDateTime = (types, row) => {
	Object.keys(row).forEach(col => {
		if(types[col] === 'dateTime' && row[col]){
			row[col] = stampToUTCDate(row[col])
		}
	})
}

exports.default = ({table, rows, beforeEach, after, dbTypes, debug}) => {
	var db = new Knex({
		client: 'sqlite3',
		debug: debug || false,
		connection: {
			filename: './mydb.sqlite',
			timezone: 'UTC',
		},
		useNullAsDefault:true,
		//sqlite does not create js Date objects for dateTime fields
		postProcessResponse: result => {
			if (Array.isArray(result)) {
				result.map(row => convertDateTime(dbTypes, row))
			} else {
				result && convertDateTime(dbTypes, result)
			}
			return result
		}
	})

	beforeEach(() => db.schema.dropTableIfExists(table)
		.then(
			() => db.schema.createTable(
				table,
				t => Object.keys(dbTypes).forEach(col => {
					var type = dbTypes[col]
					t[type](col)
				})
			))
		.then(() => Promise.resolve(rows))
		.then(rows => db.batchInsert(table, rows)))

	after(() => db.destroy())
	return db
}
