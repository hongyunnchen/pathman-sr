(function(app){

	var PathmanAppCtrl = function($scope, $mdSidenav, $mdDialog, NextTopologyService,
								  NetworkService, PathListService, SharedDataService, ErrorHandlerService) {



		// method prototypes

		$scope.init = init;
		$scope.initTopology = initTopology;
		$scope.initPathList = initPathList;
		$scope.openPanel = openPanel;

		// "scopify" shared data
		$scope.shared = SharedDataService.data;

		// initialize the app
		$scope.init();

		/* Implementation */

		/**
		 * Initialize application
		 */
		function init(){
			$scope.initTopology();
			$scope.initPathList();
		}

		/**
		 * Get topology ready
		 */
		function initTopology(){

			NetworkService.refreshTopology(
				function(data){

					var nxData = NextTopologyService.initTopology("topology-container");
					console.log(nxData);
					SharedDataService.multiSet({
						"nxApp": nxData.nxApp,
						"nxTopology": nxData.nxTopology
					}, false);

					// record the topology data
					SharedDataService.data.topologyData = data;
					// render topology
					SharedDataService.data.nxTopology.data(SharedDataService.data.topologyData);
					// topology initialized = true
					SharedDataService.data.topologyInitd = true;
				},
				function(err){

					ErrorHandlerService.log(err, true);

				}
			);
		}

		/**
		 * Initialize path list by making REST call
		 */
		function initPathList(){

			PathListService.refreshPathList(
				function(data){
					// record path list data
					SharedDataService.data.pathListData = data;
					// path list initialized = true
					SharedDataService.data.pathListInitd = true;
				},
				function(err){

					ErrorHandlerService.log(err, true);

				}
			);
		}

		/**
		 * Open side panel by name
		 * @param panelName {String}
		 * @param [args] {Object} optional
		 */
		function openPanel(panelName, args){

			args = args || null;

			// different actions for different panels
			switch(panelName){

				case "path-details":
					if(typeof args === 'object' && args !== null){
						if(args.hasOwnProperty("pathData")){
							SharedDataService.data.selectedPathData = args.pathData;

							SharedDataService.data.sidePanel = true;
							SharedDataService.data.sidePanelName = panelName;
						}
					}
					break;

				default:
					SharedDataService.data.sidePanel = true;
					SharedDataService.data.sidePanelName = panelName;
					break;
			}

			if(SharedDataService.data.topologyInitd){

				// make topology fit into shrunk container
				window.setTimeout(function(){
					SharedDataService.data.nxTopology.adaptToContainer();
				}, 100);

				// clear path layers
				NextTopologyService.clearPathLayer(SharedDataService.data.nxTopology);
			}


		}

	};

	PathmanAppCtrl.$inject = ["$scope", "$mdSidenav", "$mdDialog", "NextTopologyService",
		"NetworkService", "PathListService", "SharedDataService", "ErrorHandlerService"];
	app.controller("PathmanAppCtrl", PathmanAppCtrl);

})(app);