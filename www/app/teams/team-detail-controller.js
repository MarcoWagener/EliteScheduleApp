(function () {
	'use strict';

	angular.module('eliteApp')
		.controller('teamDetailCtrl', ['$stateParams', '$ionicPopup', 'eliteApi', 'myTeamsService', teamDetailCtrl]);

	function teamDetailCtrl($stateParams, $ionicPopup, eliteApi, myTeamsService) {
		var vm = this;
		
		vm.teamId = Number($stateParams.id);

		eliteApi.getLeagueData()
			.then(function(data) {
				vm.league = data.league;

				vm.team = _.chain(data.teams)
		        			.map("divisionTeams")
							.flatten()
							.find({"id": vm.teamId})
		            		.value();	            			

				vm.teamName = vm.team.name;

				vm.games = _.chain(data.games)					
							.filter(isTeamInGame)
							.map(function(item) {
								var isTeam1 = (item.team1Id === vm.teamId ? true : false);
								var opponentName = isTeam1 ? item.team2 : item.team1;
								var scoreDisplay = getScoreDisplay(isTeam1, item.team1Score, item.team2Score);

								return {
									gameId: item.id,
									opponent: opponentName,
									time: item.time,
									location: item.location,
									locationUrl: item.locationUrl,
									scoreDisplay: scoreDisplay,
									homeAway: (isTeam1 ? "vs." : "at")
								};
							})
							.value();		

				vm.teamStanding = _.chain(data.standings)
									.map("divisionStandings")
									.flatten()
									.find({"teamId": vm.teamId})
									.value();
			});

		function isTeamInGame(item) {
			return item.team1Id === vm.teamId || item.team2Id === vm.teamId;
		}

		function getScoreDisplay(isTeam1, team1Score, team2Score) {
			if (team1Score && team2Score) {
				var teamScore = (isTeam1 ? team1Score : team2Score);
				var opponentScore = (isTeam1 ? team2Score : team1Score);
				var winIndicator = teamScore > opponentScore ? "W: " : "L: ";

				return winIndicator + teamScore + "-" + opponentScore;
			}
			else {
				return "";
			}
		}
		
		vm.following = myTeamsService.isFollowingTeam(vm.teamId);

		vm.showCache = function(){
			console.log(myTeamsService.getFollowedTeams());
		}

		vm.toggleFollow = function() {
			if(!vm.following) {
				$ionicPopup.confirm({
					template: 'Are you sure you want to unfollow?',
				    buttons: [
				      { 
				      	text: 'Cancel',
				      	type: 'button',
				      	onTap: function(e) {
				      		vm.following = true;
				        	myTeamsService.followTeam(vm.team, vm.league);
				      	}
				      },
				      {
				        text: '<b>Unfollow</b>',
				        type: 'button-positive',
				        onTap: function(e) {
				        	myTeamsService.unFollowTeam(vm.teamId.toString());
				        }
				      }
				    ]
				})
			}
			else {
				myTeamsService.followTeam(vm.team, vm.league);
			}
		};
	};
})();