angular.module('utils', ['ngDialog'])
.service('ConfirmDialog', function(ngDialog) {
        return {
            confirm: function(key, values) {
                var messages = [];
                if (!angular.isArray(key)){
                	key = [key];
                	values = [values];
                }
                for (var i = 0; i < key.length; i++){
                	var message = {key:key[i]};
                	if (values && angular.isDefined(values[i])){
                		message.values = values[i];
                	}
                	messages.push(message);
                }
                return ngDialog.openConfirm({
                    showClose: false,
                    closeByEscape: false,
                    closeByDocument: false,
                    data:messages,
                    template: 'views/common/confirm-popin.html'
                });
            },
            confirmDelete: function() {
                return this.confirm("global.messages.confirmDelete");
            },
            info: function(message) {
                  return ngDialog.openConfirm({
                  showClose: true,
                  closeByEscape: true,
                  closeByDocument: true,
                  data:message,
                  template: 'views/common/confirm-popin.html'
                });
            }
        };
    })