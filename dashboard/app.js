(function() {
	'use strict';
	var app = angular.module('dashboardApp', [ 'flybaseResourceHttp' ])
		.constant('FLYBASE_CONFIG',{
			API_KEY:"YOUR-API-KEY",
			DB_NAME:'questions'
		})
		.factory('Question', function ($flybaseResourceHttp) {
			return $flybaseResourceHttp('questions');
		})
		.controller('dashboardController', function($scope, Question, $timeout) {
			$scope.questions = [];
			$scope.epoch = undefined;
			$scope.init = function(){
				Question.all().then(function(questions){
					$timeout(function() {
						$scope.questions = questions;
						$timeout(function() {
							$scope.init_epoch();
						});
					});
				});
			};
			$scope.init();

			$scope.init_epoch = function( ){
				$scope.epoch =  jQuery('#chart').epoch({
					type: 'bar',
					data: []
				});
				$scope.update_epoch();
			};

			$scope.update_epoch = function(){
				var new_data = jQuery.map($scope.questions, function(question, i) {
		            return {
		                x: question.question,
		                y: question.points
		            }
		        });
		        
		        $scope.epoch.update([{
		            label: 'series',
		            values: new_data
		        }]);
			};
			Question.flybase().on('added', function( data ){
				$timeout(function() {
					$scope.questions.push( data.value() );
					$scope.update_epoch();
				});
			});
			Question.flybase().on('changed', function( data ){
				$timeout(function() {
					var snapshot = data.value();
					angular.forEach($scope.questions, function(question,i) {
						if( question._id == snapshot._id ){
							$scope.questions[ i ] = snapshot;
						}
					});
					$scope.update_epoch();
				});
			});
			Question.flybase().on('removed', function( data ){
				$timeout(function() {
					var snapshot = data.value();
					angular.forEach($scope.questions, function(question,i) {
						if( question._id == snapshot._id ){
							$scope.questions.splice(i, 1);
						}
					});
					$scope.update_epoch();
				});
			});	
		});
})();