var meanApp = angular.module('meanApp', [
      'ui.router',
      'ngRoute'
]);

/*meanApp.config(function($urlRouterProvider, $stateProvider){
  $urlRouterProvider.when('', '/');
  $urlRouterProvider.otherwise('/404');
  $stateProvider
    .state('main', {
      url:'/',
      templateUrl:'home.html',
      controller:'appCtrl' // or you can specify a childCtrl
    });
});*/

meanApp.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl:'home.html',
      controller: 'appCtrl'
    });
});

meanApp.controller('appCtrl', appCtrl);

appCtrl.$inject = ['$location', '$http', '$scope'];

function appCtrl($location, $http, $scope){
  var app = this;
  var URI = "http://localhost:3333";

  app.datafromMongo=[];

  $http.get(URI + "/products").then(function(res){
    app.products = res.data;
  });

  app.submit = function(req){
    $http.post(URI + "/products", req).then(function(res){
      app.products.push(res.data);
    });
  };

  app.show = function () {
    $http.get(URI + "/list").then(function(product){
      product.data.map(function(d,idx){
        app.datafromMongo.push(d);
      });
    });
  };

  app.getManex = function(work_order){
    $http.get(URI + "/work_order/" + work_order)
      .then(function(res){
        app.getfromManex = remapPretty(res.data);
      });
  };

  app.postManex = function(work_order){
    $http.post(URI + "/work_order", {work_order: work_order})
      .then(function(res){
        app.postfromManex = remapPretty(res.data);
        console.log(app.postfromManex);
      });
  };

  function remapPretty(src){
    var o = {};
    src.map((d,idx) => {
      o[idx] = {
        key: d.UNIQ_KEY || '',
        wo: d.WO_NO || '',
        so: d.SO_NO || '',
        due_date: d.DUE_DATE || '',
        assembly: d.ASSY_NO || '',
        revision: d.REVISION || '',
        qty: d.QTY || '',
        customer_po: d.CUST_PO_NO || '',
        customer_name: d.CUST_NAME || '',
        timestamp: Math.floor(Date.now() / 1000)
      }
    });
    return o;
  }
}
