(function(){
	'use-strict';

	angular.module('eliteApp')
		.controller('MyTeamsCtrl', ['$state', 'myTeamsService', 'eliteApi', MyTeamsCtrl]);

	function MyTeamsCtrl($state, myTeamsService, eliteApi) {
		var vm = this;

		vm.myTeams = myTeamsService.getFollowedTeams();

		vm.goToTeam = function(team) {
			eliteApi.setLeagueId(team.teamId);

			$state.go("app.team-detail", { id: team.teamId })
		};
	};
})();
		