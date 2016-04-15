(function() {
	'use strict';
	var app = angular.module('questionApp', [ 'flybaseResourceHttp' ])
		.constant('FLYBASE_CONFIG',{
			API_KEY:"YOUR-API-KEY",
			DB_NAME:'questions'
		})
		.factory('Question', function ($flybaseResourceHttp) {
			return $flybaseResourceHttp('questions');
		})		
		.controller('questionController', function($scope, Question, $timeout) {
			$scope.newquestion = '';
			$scope.questions = [];
			
			$scope.init = function(){
				Question.all().then(function(questions){
					$timeout(function() {
						$scope.questions = questions;
					});
				});
			}
			$scope.init();

			$scope.saveQuestion = function( questionText ){
				var question = new Question();
				question.question = questionText;
				question.points = 1;
				question.$save();
				$scope.newquestion = '';
			};

			$scope.upvoteQuestion = function( questionId ){
				Question.flybase().where({"_id": questionId}).once('value').then(function( rec ){
					var question = rec.first().value();
					question.points += 1;
					Question.flybase().push(question, function(resp) {
//						console.log( "question updated" );
					});
				}, function(err){
				});
			};

			Question.flybase().on('added', function( data ){
				$timeout(function() {
					$scope.questions.push( data.value() );
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
				});
			});
		});
})();