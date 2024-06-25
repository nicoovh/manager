export default function hostnameValidator() {
  return {
    require: 'ngModel',
    scope: { modifiedDnsList: '=' },
    link(scope, element, attrs, ngModelController) {
      const HOSTNAME_REGEX = /^(?=.{1,253}$)(?!-)([a-zA-Z0-9-]{1,63}(?<!-)\.)+[a-zA-Z]{2,63}$/;

      if (!ngModelController) {
        return;
      }

      const ngModel = ngModelController;

      ngModel.$validators.hostname = (modelValue, viewValue) => {
        if (ngModel.$isEmpty(modelValue)) {
          // Consider empty models to be valid
          return true;
        }

        console.log('ngModel');
        console.log(ngModel);
        console.log('scope.modifiedDnsList');
        console.log(scope.modifiedDnsList);

        if (!HOSTNAME_REGEX.test(viewValue)) {
          ngModel.$setValidity('hostnamePattern', false);
          return false;
        }
        ngModel.$setValidity('hostnamePattern', true);

        const isDuplicated = scope.modifiedDnsList.some((ns) => {
          return ns.nameServer === viewValue;
        });

        if (isDuplicated) {
          ngModel.$setValidity('hostnameUnique', false);
          return false;
        }
        ngModel.$setValidity('hostnameUnique', true);

        return true;
      };
    },
  };
}
