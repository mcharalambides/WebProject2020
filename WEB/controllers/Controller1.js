var app = angular.module('myapp',['ui.bootstrap','ngRoute']);
var username;
app
    .controller('loginController', function($scope,$http,$window) {
        
           $scope.insertdata = function(){
               $http.post("../php/insert.php",{'usrname':$scope.usrname,'pass':$scope.pass,'response':response})
            
           }
           $scope.checkdata = function(){
            $http.post("../php/insert.php",{'usrname':$scope.usrname,'pass':$scope.pass})
            .then(function(response) {
                console.log(response);
                if(response.data.status == 'loggedin'){
                    username = $scope.usrname;
                    $window.location.href = 'http://localhost/Desktop/templates/home.html';
                }
                else{
                    alert('invalid login');
                }
           })
           }
    })
    .controller('homeController', function($scope,$http,$window){
        console.log(username);
        $scope.name = username;
    });

    /*app
    .config(function($routeProvider) {
        $routeProvider
        .when('/home', {
            templateUrl: '/Desktop/templates/home.html'
        })
        .otherwise({
            template: '404'
        })
    });*/

    
