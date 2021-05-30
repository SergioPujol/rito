const { authenticate } = require('@feathersjs/authentication').hooks;

/*const listaConUser = list=>{
  for(var i = 0; i < list.members.length; i++){
    if(list.members[i].user_id == context.params.user._id) {console.log(list);return true;}
  }
}*/

module.exports = {
  before: {
    all: [authenticate('jwt')],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [async (context) => {
      //console.log(context.params)
      const listsAsMemberOrOwner = context.result.data.filter(list=>{
        if(list.owner.toString() == context.params.user._id.toString()){
          return list;
        }
        for(var i = 0; i < list.members.length; i++){
          //console.log(context.params.user)
          //console.log(list.members[i])
          if(list.members[i].user_id.toString() == context.params.user._id.toString()){
            return list;
          }
        }
      });
      context.result.data = listsAsMemberOrOwner
      context.result.total = listsAsMemberOrOwner.length
      return context;
    }],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};


