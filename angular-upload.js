app.service("$ngUpload", ["Upload", "$configs", "$filter", "$interval", "$q", function (upload, $configs, $filter, interval, $q) {
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
        item.files = [];
        const deferred = $q.defer();
        const progress = 100 / files.length;

        item.uploadProgress = 0;

        angular.forEach(files, function (file) {
            if (file.size > $configs.uploadFileSize) {
                const object = {
                    file: file.name,
                    error: "size > " + $configs.uploadFileSize + " Byte",
                    ready: false
                }
                item.files.push(object);
            } else {
                upload.upload({
                    url: $configs.upload,
                    file: file
                }).success(function (data) {
                    const object = {
                        imagePreview: $configs.uploadTemp + data.FileName + data.Extension,
                        image: $configs.uploadMedia + data.FileName,
                        ready: true,
                        error: null
                    }
                    item.files.push(object);
                    item.uploadProgress += progress;
                    deferred.resolve(data);
                }).error(function (error) {
                    const object = {
                        file: file.name,
                        error: error,
                        ready: false
                    }
                    item.files.push(object);
                });
            }
        });

        return deferred.promise;
    }
}]);
