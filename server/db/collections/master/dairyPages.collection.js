const collectionName = path.basename(__filename, '.collection.js')
module.exports = function (dbModel) {
	const schema = mongoose.Schema(
		{
			member: { type: ObjectId, ref: 'members', index: true },
			dairy: { type: ObjectId, ref: 'dairy', index: true },
			issueDate: { type: String, required: true, index: true },
			dayNo: { type: Number, required: true, index: true },
			transferBalance: { type: Number, default: 0 },
			debit: { type: Number, default: 0, index: true },
			credit: { type: Number, default: 0, index: true },
			balance: { type: Number, default: 0, index: true },
			dayFinished: { type: Boolean, default: false, index: true }
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
