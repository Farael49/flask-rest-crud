angular.module('flaskAngular')
.service('Message', function (toaster, $translate) {
	this.getMessageOk = function (message, data) {
		$translate(message, data).then(function (message){
			toaster.pop('success', message);
		});
	};

	this.getMessageError = function (message, data) {
		$translate(message, data).then(function (message){
			toaster.pop('error', message);
		});
	};
	this.warning = function (message, data) {
        $translate(message, data).then(function (message){
            toaster.pop('warning', message);
        });
    };
    this.error = function (message, data) {
        this.getMessageError(message, data);
    };
    this.success = function (message, data) {
        this.getMessageOk(message, data);
    };
})