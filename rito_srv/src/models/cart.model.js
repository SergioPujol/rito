// cart-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const modelName = 'cart';
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const schema = new Schema({
    rito: {type: Schema.Types.ObjectId, ref: 'Ritos', required:true},
    user: {type: Schema.Types.ObjectId, ref: 'Users', required:true},
    products: [{  product: {type: Schema.Types.ObjectId, ref: 'Products'}, 
                  quantity: Number,
                  in_cart: Boolean 
                }],
    paid: {type:Boolean, required:true}
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
