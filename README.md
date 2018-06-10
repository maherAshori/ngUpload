# ngUpload
Help You to have easy upload component in "angular js" which can use in controllers &amp; views

# dependency

<a target="_blank" href="https://github.com/danialfarid/ng-file-upload">ng-file-upload</a>

# How to use it:

<ol>
  <li>
    add source files to your page
    
    <script src="/bower_components/ng-file-upload/ng-file-upload.js"></script>
    <script src="/bower_components/ng-file-upload/ng-file-upload-shim.js"></script>
    <script src="angular-upload.js"></script>
  </li>
  <li>
    inject angular upload to your main project
    
    var yourApp = angular.module("yourApp", ["angularUpload"]);
  </li>
  <li>
    Define upload api in your project
  
    app.constant("$configs", {
      upload: "http://localhost:2005/api/fileUpload"
      //we use this method for upload images
    });
  </li>
  <li>
    add this method in your controller (every where you want)
    
    var controller = function ($scope, ngUpload, $configs) {
      const self = this;

      self.item = {};

      self.uploadFile = function (files, item, single) {
          //third part of method define upload is single or multiple
          const _files = single ? files[0] : files;
          const api = single ? "single" : "multiple";
          ngUpload[api](_files, item).then(function (data) {
              if (single) {
                  //use return data to show as single image
                  item.image = data.FileName;
              } else {
                  //use return data to show as multiple images
                  self.item.files = data;
              }
          });
      }
    };
    controller.$inject = ["$scope", "$ngUpload", "$configs"];
    app.controller("myController", controller);
  </li>
  <li>
    add directive in your view

     <!-- progress-bar: work for both mode with same way --> 
     <div ng-if="self.item.uploadProgress > 0" class="progress" style="height: 1px;">
        <div class="progress-bar" role="progressbar" style="width: {{self.item.uploadProgress}}%;" aria-valuemax="100"></div>
     </div>
     
     <!-- single mode --> 
     <button ngf-select
          ngf-change="self.uploadFile($files, self.item, true)"
          ngf-capture="'camera'"
          ngf-pattern="'image/*'"
          ngf-accept="'image/*'"
          ngf-keep-distinct="true">
      upload single image
     </button>
     
     <img ng-src="{{self.item.image}}" />
     
     <!-- multiple mode --> 
     <button ngf-select
          ngf-change="self.uploadFile($files, self.item, false)"
          ngf-capture="'camera'"
          ngf-pattern="'image/*'"
          ngf-accept="'image/*'"
          ngf-multiple="true"
          ngf-keep-distinct="true">
      upload multiple images
     </button>

     <div class="row">
       <div class="col-4" ng-repeat="file in self.item.files">
          <img ng-src="{{file.image}}" />
          <hr>
          {{file}}
       </div>
     </div>
  </li>
</ol>
