const collectionName = path.basename(__filename, '.collection.js')
module.exports = function (dbModel) {
	const schema = mongoose.Schema(
		{
			member: { type: ObjectId, ref: 'members', index: true },
			dairy: { type: ObjectId, ref: 'dairy', index: true },
			dairyPage: { type: ObjectId, ref: 'dairyPages', index: true },
			description: { type: String, required: true, index: true },
			total: { type: Number, required: true },
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
