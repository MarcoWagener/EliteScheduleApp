(function(){
	'use-strict';

	angular.module('eliteApp')
		.factory('myTeamsService', ['CacheFactory', myTeamsService]);

	function myTeamsService(CacheFactory) {
		var self = this;

		self.myTeamsCache = CacheFactory.get("myTeamsCache");

		function followTeam(team, league) {
			var teamCacheModel = {
				id: team.id,
				name: team.name,
				leagueId: league.id,
				leagueName: league.name
			};

			self.myTeamsCache.put(team.id.toString(), teamCacheModel);
		}

		function unFollowTeam(teamId) {
			self.myTeamsCache.remove(teamId.toString());
		}

		function getFollowedTeams() {
			var teams = [],
				keys = self.myTeamsCache.keys();

			for(var i = 0; i < keys.length; i++) {				
				var team = self.myTeamsCache.get(keys[i]);
				teams.push(team);
			}

			return teams;
		}

		function isFollowingTeam(teamId) {
			var team = self.myTeamsCache.get(teamId);

			return team === undefined ? false : true;
		}

		return {
			followTeam: followTeam,
			unFollowTeam: unFollowTeam,
			getFollowedTeams: getFollowedTeams,
			isFollowingTeam: isFollowingTeam
		};
	};
})();
		