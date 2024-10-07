const collectionName = path.basename(__filename, '.collection.js')
module.exports = function (dbModel) {
	const schema = mongoose.Schema(
		{
			member: { type: ObjectId, ref: 'members', index: true },
			startDate: { type: String, required: true, min: 10, max: 10, index: true },
			endDate: { type: String, required: true, min: 10, max: 10, index: true },
			targetIncome: { type: Number, required: true, index: true },
			hourlyWage: { type: Number, required: true, index: true },
			currency: { type: String, required: true, index: true },
			personalGoals: [{
				name: { type: String, required: true },
				done: { type: Boolean, default: false, index: true },
				percent: { type: Number, default: 0, min: 0, max: 10, index: true }
			}],
			passive: { type: Boolean, default: false, index: true }
		},
		{ versionKey: false, timestamps: true }
	)

	schema.pre('save', (next) => next())
	schema.pre('remove', (next) => next())
	schema.pre('remove', true, (next, done) => next())
	schema.on('init', (model) => { })
	schema.plugin(mongoosePaginate)

	let model = dbModel.conn.model(collectionName, schema, collectionName)

	model.removeOne = (session, filter) => sendToTrash(dbModel, collectionName, session, filter)
	return model
}
