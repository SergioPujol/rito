// products-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const modelName = 'products';
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const schema = new Schema({
    name: { type: String, required: true},
    description: { type: String, required: true },
    brand: { type: String, required: true },
    category: { type: String },
    weight: { type: Number, required: true },
    stock: { type: Number, required: true },
    price: { type: Number, required: true },
    img_url: { type: String, required: true },
    expiration_date: { type: Date, required: true },
  }, {
    timestamps: false
  });

  // This is necessary to avoid model compilation errors in watch mode
  // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
  if (mongooseClient.modelNames().includes(modelName)) {
    mongooseClient.deleteModel(modelName);
  }
  return mongooseClient.model(modelName, schema);
  
};
