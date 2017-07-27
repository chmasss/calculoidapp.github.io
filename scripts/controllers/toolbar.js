'use strict';
/*global calculoid */
calculoid.controller('ToolbarCtrl', ['$rootScope', '$scope', 'User', '$http', function ($rootScope, $scope, User, $http) {
    $scope.navIsCollapsed = true;
    User.getUser();
    $scope.user = User;
    $scope.redmineCustomFields = [];
    $scope.toolbar = {};
    $scope.toolbar.tab = null;
    $scope.toolbar.opened = false;
    $scope.toolbar.style = {
        'height': '53px'
    };

    $scope.$on('user:updated', function(event, newUser) {
        $scope.user = newUser;
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    });

    $scope.$on('event:google-plus-signin-success', function (event, authResult) {
        User.authenticate('google', authResult);
    });

    $scope.$on('event:google-plus-signin-failure', function () {
        $scope.user.logged = 'out';
        if(!$scope.$$phase) {
            $scope.$apply();
        }
    });

    $scope.isAdmin = function() {
        return $scope.user.group === '6';
    };

    $scope.getToolbarStyle = function() {
        return $scope.toolbar.style;
    }

    $scope.toggleToolbar = function (newTab) {
        if (newTab === $scope.toolbar.tab && $scope.toolbar.opened) {
            $scope.toolbarClose();
        } else {
            $scope.toolbarOpen();
        }
        return $scope.toolbar.opened;
    }

    $scope.toolbarClose = function () {
        $scope.toolbar.style.height = '53px';
        $scope.toolbar.opened = false;
    }

    $scope.toolbarOpen = function () {
        $scope.toolbar.style.height = '300px';
        $scope.toolbar.opened = true;
    }

    $scope.loadToolbarTab = function(tab) {
        if ($scope.toggleToolbar(tab)) {
            $scope.toolbar.tab = tab;
        }
    }

    $scope.displayToolbarTabDetails = function() {
        if ($scope.toolbar.tab) {
            return 'views/toolbar-tabs/' + $scope.toolbar.tab + '.html';
        }
    }

    $scope.$on('onFieldEdit', function() {
        if ($scope.activeField.id) {
            $scope.toolbar.opened = false;
            $scope.loadToolbarTab('edit-field');
        } else {
            $scope.toolbar.opened = true;
            $scope.loadToolbarTab('edit-field');
        }
    });

    $scope.activeTab = function(tabName) {
        if ($scope.toolbar.tab === tabName) {
            return 'active';
        }
    }

    $scope.showEmbedTitle = function(check) {
		if (check) {
			$scope.embedShowTitleText = '';
		} else {
			$scope.embedShowTitleText = ',showTitle:0';
		}
	};

    $scope.showEmbedDescription = function(check) {
		if (check) {
			$scope.embedShowDescriptionText = '';
		} else {
			$scope.embedShowDescriptionText = ',showDescription:0';
		}
	};

    $scope.loadRedmineCustomFields = function(calc, type) {
        if (calc.params.redmineKey && calc.params.redmineUrl) {
            $http.get(calculoidServices.baseUrl+'redmine/fields/' + type + '?key=' + calc.params.redmineKey + '&url=' + calc.params.redmineUrl).then(function(response) {
                if (response.data && response.data.custom_fields) {
                    
                    if (!calc.params.redmineCustomFields) {
                        calc.params.redmineCustomFields = {};
                    }

                    angular.forEach(response.data.custom_fields, function(field) {
                        if (typeof calc.params.redmineCustomFields[field.id] === 'undefined') {
                            if (field.default_value) {
                                calc.params.redmineCustomFields[field.id] = field.default_value;
                            } else {
                                calc.params.redmineCustomFields[field.id] = '';
                            }
                        }
                    });

                    $scope.redmineCustomFields = response.data.custom_fields;
                }
            });
        }
    }

    $scope.loadEasyRedmineCustomFields = function(calc, type) {
        if (calc.params.easyredmineCrmKey && calc.params.easyredmineCrmUrl) {
            $http.get(calculoidServices.baseUrl+'redmine/fields/' + type + '?key=' + calc.params.easyredmineCrmKey + '&url=' + calc.params.easyredmineCrmUrl).then(function(response) {
                if (response.data && response.data.custom_fields) {
                    
                    if (!calc.params.easyredmineCrmCustomFields) {
                        calc.params.easyredmineCrmCustomFields = {};
                    }

                    angular.forEach(response.data.custom_fields, function(field) {
                        if (typeof calc.params.easyredmineCrmCustomFields[field.id] === 'undefined') {
                            if (field.default_value) {
                                calc.params.easyredmineCrmCustomFields[field.id] = field.default_value;
                            } else {
                                calc.params.easyredmineCrmCustomFields[field.id] = '';
                            }
                        }
                    });

                    $scope.easyredmineCrmCustomFields = response.data.custom_fields;
                }
            });
        }
    }
}]);
