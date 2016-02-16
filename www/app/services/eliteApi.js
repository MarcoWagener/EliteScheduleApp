(function () {
	'use strict';

	angular.module('eliteApp')
		.factory('eliteApi', ['$http', '$q', '$ionicLoading', 'CacheFactory', eliteApi]);

	function eliteApi($http, $q, $ionicLoading, CacheFactory) {

		self.leaguesCache = CacheFactory.get("leaguesCache");
		self.leagueDataCache = CacheFactory.get("leagueDataCache");
		self.staticCache = CacheFactory.get("staticCache");

		self.leaguesCache.setOptions({
			onExpire: function(key, value) {
				getLeagues()
					.then(function() {
						console.log("Leagues Cache was automatically refreshed.", new Date());
					}, function() {
						console.log("Error getting data. Putting expired item back in cache.", new Date());
						self.leaguesCache.put(key, value);
					});
			}
		});

		self.leagueDataCache.setOptions({
			onExpire: function(key, value) {
				getLeagueData()
					.then(function() {
						console.log("Leagues Data Cache was automatically refreshed.", new Date());
					}, function() {
						console.log("Error getting data. Putting expired item back in cache.", new Date());
						self.leagueDataCache.put(key, value);
					});
			}
		});

		function setLeagueId(leaugeId) {
			self.staticCache.put("currentLeagueId", leaugeId);
		}

		function getLeagueId() {
			var id = self.staticCache.get("currentLeagueId");
			console.log("in get leaugeId", id);
			return id;
		}

		function getLeagues() {
			var deferred = $q.defer(),
				cacheKey = "leagues",
				leaguesData = self.leaguesCache.get(cacheKey);

			if(leaguesData) {
				console.log("Found getLeagues() inside cache.", leaguesData);
				deferred.resolve(leaguesData);
			}
			else {
				$ionicLoading.show({ template: 'Loading...'});

				$http.get("http://elite-schedule.net/api/leaguedata")
					.success(function(data) {
						self.leaguesCache.put(cacheKey, data);
						console.log("Received getLeagues() data via HTTP.", data, status);
						deferred.resolve(data);

						$ionicLoading.hide();
					})
					.error(function() {	
						console.log("Error while making HTTP call for getLeagues().");									
						deferred.reject();

						$ionicLoading.hide();
					});	
			}	

			return deferred.promise;
		}

		function getLeagueData() {
			var deferred = $q.defer(),
				cacheKey = "leagueData-" + getLeagueId(),
				leagueData = self.leagueDataCache.get(cacheKey);

			if(leagueData) {
				console.log("Found getLeagueData() in cache.", leagueData);
				deferred.resolve(leagueData);
			}
			else {
				$ionicLoading.show({ template: 'Loading...'});

				$http.get("http://elite-schedule.net/api/leaguedata/" + getLeagueId())
					.success(function(data) {
						self.leagueDataCache.put(cacheKey, data);
						console.log("Received getLeagueData() data via HTTP.", data, status);
						deferred.resolve(data);

						$ionicLoading.hide();
					})
					.error(function() {					
						console.log("Error while making HTTP call for getLeagueData().");
						deferred.reject();

						$ionicLoading.hide();
					});				
			}

			return deferred.promise;
		};

		// function setLeagueId(leaugeId) {
		// 	currentLeagueId = leaugeId;
		// };

		return {
			getLeagues: getLeagues,
			getLeagueData: getLeagueData,
			setLeagueId: setLeagueId
		};
	};
})();