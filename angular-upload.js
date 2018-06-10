var angularUpload = angular.module("angularUpload", ["ngFileUpload"]);
angularUpload.service("$ngUpload", ["Upload", "$configs", "$filter", "$interval", "$q", function (upload, $configs, $filter, interval, $q) {

    this.single = function (file, item) {
        var deferred = $q.defer();

        item.uploadProgress = 0;
        if (file.size > $configs.uploadFileSize) {
            return false;
        } else {
            upload.upload({
                url: $configs.upload,
                file: file
            }).progress(function () {
                var proggress = interval(function () {
                    item.uploadProgress === 100 ? interval.cancel(proggress) : item.uploadProgress++;
                    item.showUploadedImage = item.uploadProgress === 100 ? true : false;
                }, 50);
            }).success(function (data) {
                deferred.resolve(data);
            }).error(function (error) {
                deferred.resolve(error);
            });
        }

        return deferred.promise;
    }

    this.multiple = function (files, item) {
        var _files = [];
        var deferred = $q.defer();
        var progress = 100 / files.length;

        item.uploadProgress = 0;

        angular.forEach(files, function (file) {
            if (file.size > $configs.uploadFileSize) {
                var object = {
                    file: file.name,
                    error: "size > " + $configs.uploadFileSize + " Byte",
                    ready: false
                }
                _files.push(object);
            } else {
                upload.upload({
                    url: $configs.upload,
                    file: file
                }).success(function (data) {
                    var object = {
                        imagePreview: $configs.uploadTemp + data.FileName + data.Extension,
                        image: $configs.uploadMedia + data.FileName,
                        ready: true,
                        error: null
                    }
                    _files.push(object);
                    item.uploadProgress += progress;
                }).error(function (error) {
                    var object = {
                        file: file.name,
                        error: error,
                        ready: false
                    }
                    _files.push(object);
                });
            }
        });
        deferred.resolve(_files);
        return deferred.promise;
    }

}]);
