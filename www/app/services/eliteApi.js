(function () {
	'use strict';

	angular.module('eliteApp')
		.factory('eliteApi', ['$http', '$q', '$ionicLoading', 'CacheFactory', eliteApi]);

	function eliteApi($http, $q, $ionicLoading, CacheFactory) {
		var currentLeagueId;

		self.leaguesCache = CacheFactory.get("leaguesCache");
		self.leagueDataCache = CacheFactory.get("leagueDataCache");

		function getLeagues() {
			var deferred = $q.defer(),
				cacheKey = "leagues",
				leaguesData = self.leaguesCache.get(cacheKey);

			if(leaguesData) {
				console.log("Found data inside cache", leaguesData);
				deferred.resolve(leaguesData);
			}
			else {
				$http.get("http://elite-schedule.net/api/leaguedata")
					.success(function(data) {
						self.leaguesCache.put(cacheKey, data);

						deferred.resolve(data);
					})
					.error(function() {										
						deferred.reject();
					});	
			}	

			return deferred.promise;
		}

		function getLeagueData() {
			var deferred = $q.defer();

			$ionicLoading.show({ template: 'Loading...'});

			$http.get("http://elite-schedule.net/api/leaguedata/" + currentLeagueId)
				.success(function(data) {
					console.log("Received schedule data via HTTP.", data, status);
					deferred.resolve(data);

					$ionicLoading.hide();
				})
				.error(function() {					
					console.log("Error while making HTTP call.");
					deferred.reject();

					$ionicLoading.hide();
				});

			return deferred.promise;
		};

		function setLeagueId(leaugeId) {
			currentLeagueId = leaugeId;
		};

		return {
			getLeagues: getLeagues,
			getLeagueData: getLeagueData,
			setLeagueId: setLeagueId
		};
	};
})();