(function () {
	'use strict';

	console.log('entering');

	angular.module('eliteApp')
		.controller('TeamsCtrl', ['eliteApi', TeamsCtrl]);

	function TeamsCtrl(eliteApi) {
		var vm = this;
		
		eliteApi.getLeagueData()
			.then(function(data) {
				vm.teams = data.teams;
		});		
	};
})();