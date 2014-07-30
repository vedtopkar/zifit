(function(){
    console.log('test');
    angular.module('nucleaseSubmit', [])
        .controller('submitFormController', ['$scope', '$http', function($scope, $http){
            $scope.data = { gRNA_length: 20,
                            PAM_sequence: 'NGG'
                          };
            $scope.error = '';

            $scope.options = { require_5G: false };

            $scope.submit = function(){
                $scope.error = '';
                $http({method: 'POST', url: '/nuclease'})
                    .success(function(data, status, headers, config){
                        console.log('Success!');
                    })
                    .error(function(data, status, headers, config){
                        $scope.error = 'Error. Please try again.'
                        console.log('POST failed with error cord: ' + status);
                    });
            }

        }]);
})()