(function(){
    angular.module('nucleaseSubmit', ['ngTable'])
        .controller('submitFormController', ['$scope', '$http', '$location', function($scope, $http, $location, ngTableParams){
            $scope.data = { gRNA_length: 20,
                            PAM_sequence: 'NGG',
                            options: {require_5G: false, require_5GG: false}
                          };
            $scope.results = {};

            $scope.error = '';

            $scope.submit = function(){
                $scope.error = '';



                $http({method: 'POST', url: '/nuclease', data: $scope.data})
                    .success(function(data, status, headers, config){
                        if(data.error){
                            $scope.error = data.message;
                        } else {
                            $scope.results = data;
                            $scope.resultsTable = new ngTableParams({
                                page: 1,            // show first page
                            }, {
                                total: $scope.results.length, // length of data
                            });
                            console.log('Success!');
                            console.log(data);
                            // window.location = '/funding';
                        }
                    })
                    .error(function(data, status, headers, config){
                        $scope.error = 'Error. Please try again.'
                        console.log('POST failed with error code: ' + status);
                    });
            }

        }]);
})()