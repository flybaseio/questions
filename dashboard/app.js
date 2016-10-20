/*
// Load the Visualization API and the corechart package.
	google.charts.load('current', {'packages':['corechart']});
	google.charts.setOnLoadCallback(drawChart);
	function drawChart() {
		var data = new google.visualization.DataTable();
		data.addColumn('string', 'Topping');
		data.addColumn('number', 'Slices');
		data.addRows([
			['Mushrooms', 3],
			['Onions', 1],
			['Olives', 1],
			['Zucchini', 1],
			['Pepperoni', 2]
		]);
		
		var options = {'title':'How Much Pizza I Ate Last Night','width':400,'height':300};
		// Instantiate and draw our chart, passing in some options.
		var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
		chart.draw(data, options);
	}
*/

(function() {
	'use strict';
	var app = angular.module('dashboardApp', [ 'flybaseResourceHttp' ])
		.constant('FLYBASE_CONFIG',{
API_KEY:"token:eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhcGlrZXkiOiJkMmZkYzY3Ni1mN2ExLTQ2NDAtOGQzNi0zNzZjZWMyMGViNzUiLCJpYXQiOjE0NjA2NjA0OTQsImNyZWF0ZWQiOiIyMDE2LTA0LTE0IDEyOjAxOjM0IiwiZXhwaXJlcyI6IjIwMTYtMDUtMTQgMTI6MDE6MzQifQ.thTPvoEUC0rwCAxglGnFJgYbOA6STREjHTWgalqAQrA",
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
				google.charts.load('current', {'packages':['corechart']});
				google.charts.setOnLoadCallback( $scope.update_epoch ;

/*
				$scope.epoch =  jQuery('#chart').epoch({
					type: 'bar',
					data: []
				});
				$scope.update_epoch();
*/
			};

			$scope.update_epoch = function(){

				var new_data = jQuery.map($scope.questions, function(question, i) {
		            return [question.question, question.points];
		        });

				var data = new google.visualization.DataTable();
				data.addColumn('string', 'Question');
				data.addColumn('number', 'Points');
				data.addRows( new_data );
				
				var options = {'title':'Questions','width':400,'height':300};
				var chart = new google.visualization.PieChart(document.getElementById('chart'));
				chart.draw(data, options);

/*
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
*/
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
