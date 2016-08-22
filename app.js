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

appCtrl.$inject = ['$http'];

function appCtrl($http){
  var app = this;
  var URI = "http://localhost:3333";

  app.datafromMongo=[];

  app.submit = function(product){
    $http.post(URI + "/add", {product: product});
  };

  app.show = function () {
    $http.get(URI + "/list").then(function(product){
      product.data.map(function(d,idx){
        app.datafromMongo.push(d);
      });
    });
  }
}
