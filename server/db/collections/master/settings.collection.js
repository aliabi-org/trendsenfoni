const collectionName = path.basename(__filename, '.collection.js')
module.exports = function (dbModel) {
	const schema = mongoose.Schema(
		{
			member: { type: ObjectId, ref: 'members', index: true },
			connector: {
				clientId: { type: String, default: '', index: true },
				clientPass: { type: String, default: '', index: true },
				connectionType: { type: String, enum: ['mssql', 'mysql', 'pg', 'fs', 'excel'], default: 'mssql', index: true },
				mssql: {
					user: { type: String, default: 'sa' },
					password: { type: String, default: '' },
					database: { type: String, default: '' },
					server: { type: String, default: '' },
					port: { type: Number, default: 1433 },
					dialect: { type: String, default: 'mssql' },
					dialectOptions: {
						instanceName: { type: String, default: 'SQLExpress' }
					},
					options: {
						encrypt: { type: Boolean, default: false },
						trustServerCertificate: { type: Boolean, default: true },
					}
				}
			},

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
