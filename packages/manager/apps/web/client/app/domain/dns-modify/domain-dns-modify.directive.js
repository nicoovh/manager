export default function hostnameValidator() {
  return {
    require: 'ngModel',
    link(scope, element, attrs, ngModelController) {
      //   const HOSTNAME_REGEX = /^(?=.{1,253}$)(?!-)([a-zA-Z0-9-]{1,63}(?<!-)\.)+[a-zA-Z]{2,63}$/;

      // Référence à ngModelController
      const ngModel = ngModelController;

      // Fonction de validation personnalisée
      ngModel.$validators.hostname = (modelValue, viewValue) => {
        if (ngModel.$isEmpty(modelValue)) {
          // Consider empty models to be valid
          return true;
        }

        // // Teste l'expression régulière
        // if (!HOSTNAME_REGEX.test(viewValue)) {
        //   ngModel.$setValidity('hostnamePattern', false);
        //   return false;
        // }
        // ngModel.$setValidity('hostnamePattern', true);

        // Vérifie l'unicité
        const isDuplicated = scope.$ctrl.modifiedDnsList.some((ns) => {
          return ns.nameServer === viewValue;
        });

        if (isDuplicated) {
          ngModel.$setValidity('hostnameUnique', false);
          return false;
        }
        ngModel.$setValidity('hostnameUnique', true);

        // Si tout est valide
        return true;
      };
    },
  };
}
