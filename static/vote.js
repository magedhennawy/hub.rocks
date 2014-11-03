(function () {
  var API_URL = 'http://localhost:5000/api';
  var app = angular.module('hubrocks', []);

  app.factory('HubrocksAPI', ['$http',
    function ($http) {
      var tracks = [];

      var fetchTracks = function () {
        $http.get(API_URL + '/tracks/')
          .success(function (data) {
            tracks.length = 0;
            data.tracks.forEach(function (t) {
              tracks.push(t);
            });
          });
      };
      fetchTracks();

      return {
        tracks: tracks
      };
    }
  ]);

  app.controller('HubrocksCtrl', ['HubrocksAPI', '$scope',
    function(HubrocksAPI, $scope) {
      $scope.tracks = HubrocksAPI.tracks;
    }
  ]);

  $(document).ready(function () {
    $('.select-track').selectize({
      valueField: 'id',
      labelField: 'title',
      searchField: ['title'],
      options: [],
      create: false,
      load: function(query, callback) {
        if (!query.length) return callback();

        $.ajax({
          url: 'http://api.deezer.com/search/track?output=jsonp&q=' + encodeURIComponent(query),
          dataType: 'jsonp',
          error: function() {
            callback();
          },
          success: function (json) {
            callback(json.data.slice(0, 10));
          }
        });
      },
      render: {
        option: function(track, escape) {
          return '<div>' +
            '<span class="title">' +
              '<span class="name">' + escape(track.title) + '</span>' +
              '<span class="by">' + escape(track.artist.name) + '</span>' +
            '</span>' +
          '</div>';
        }
      },
    });
  });
}());
