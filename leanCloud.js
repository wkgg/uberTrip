var AV = require('avoscloud-sdk');

AV.initialize('pw4XcPthbqVW72oOehrd0ESn-gzGzoHsz', '46TeO5PoglzP5Py17yMh48o8');
//我创建的这个对象的objectId  569a130e00b00ef38506c111
//已经创建了对象，所以直接查找到这对象，然后对这个对象进行操作

var uberhacker = AV.Object.extend('uberhacker',{

  getAllInfoCount : function(callback){
    var query = new AV.Query(uberhacker);
    query.count({
      success : function (count) {
        if(typeof callback === 'function') {
          callback.call(this,count);
        }
      },
      error : function(object, error) {
        console.log('error');
      }
    });
  },

  //获取所有参加活动用户此时的信息
  getAllInfo : function( callback ) {
    AV.Query.doCloudQuery('select * from uberhacker', {
      success: function(result){
        //results 是查询返回的结果，AV.Object 列表
        var results = result.results;
        if(typeof callback === 'function') {
          var res = [];
          for( var i=0; i<results.length;i++){
            var item = results[i].attributes;
            res.push(item)
          }
          callback.call(this,res);
        }
      },
      error: function(error){
        //查询失败，查看 error
        console.log(error);
      }
    });
  },


  //根据requireId来查找用户的信息
  getInfo : function(requestId,callback) {
    var findResult = '';
    var query = new AV.Query(uberhacker);
    query.equalTo('requestId', requestId);

    query.find({
      success : function(results) {
        if(typeof callback === 'function') {
          var res = [];
          for( var i=0; i<results.length;i++){
            var item = results[i].attributes;
            res.push(item)
          }
          callback.call(this,res);
        }
      },
      error:function(object, error) {
        console.log(error);
      }

    });
    
  },
  //添加用户信息
  addInfo : function( args ) {

    if(typeof args !== 'object'){
      new Error();
      return this;
    }

    for ( var i in args ) {
      this.set( i , args[i] );
    };

    this.save(null, {
      success:function(uberhacker) {
        console.log('New object created with objectId: ' + uberhacker.id);
      },
      error:function(uberhacker, error) {
        console.log('Failed to create new object, with error message: ' + error.message);
      }
    });
    return this;
  }

});

exports.cloudHolder = function(){
  return new uberhacker();
}
