// lists-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const modelName = 'lists';
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const schema = new Schema({
    title: { type: String, required: true },
    owner: {type: Schema.Types.ObjectId, ref: 'Users', required:true},
    products: [{  product: {type: Schema.Types.ObjectId, ref: 'Products'}, 
                  quantity: Number,  
                  added_by:{type: Schema.Types.ObjectId, ref: 'Users'},
                  in_cart: Boolean
                }],
    members: [{  user_id: {type: Schema.Types.ObjectId, ref: 'Users'}}]
  }, {
    timestamps: true
  });

  // This is necessary to avoid model compilation errors in watch mode
  // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
  if (mongooseClient.modelNames().includes(modelName)) {
    mongooseClient.deleteModel(modelName);
  }
  return mongooseClient.model(modelName, schema);
  
};
