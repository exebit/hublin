'use strict';

angular.module('liveConferenceApplication', [
  'ngRoute',
  'op.socketio',
  'op.easyrtc',
  'op.websocket',
  'op.live-conference',
  'meetings.authentication',
  'meetings.session',
  'meetings.conference',
  'restangular',
  'mgcrea.ngStrap'
]).config(function($routeProvider, RestangularProvider) {

  $routeProvider.when('/', {
    templateUrl: '/views/live-conference/partials/conference',
    controller: 'liveConferenceController',
    resolve: {
      conference: function(conferenceAPI, $route, $location) {
        var urlParams = $location.absUrl().split('/');
        urlParams.pop();
        var conference_id = urlParams.pop().replace('#', '');
        return conferenceAPI.get(conference_id).then(
          function(response) {
            return response.data;
          },
          function(err) {
            $location.path('/');
          }
        );
      }
    }
  });

  $routeProvider.otherwise({redirectTo: '/'});

  RestangularProvider.setBaseUrl('/api');
  RestangularProvider.setFullResponse(true);

})
  .run(['$log', 'session', 'ioConnectionManager', function($log, session, ioConnectionManager) {
    session.ready.then(function() {
      $log.debug('Session is ready, connecting to websocket', session.user);
      ioConnectionManager.connect();
    });
  }]);