'use strict';

angular.module('core').factory('logoGenerator', ['characterKey', function (characterKey) {
    var data = {
        generate: function (logoName) {

            this.outputLogo = '';
            var output_line1 = '',
                output_line2 = '',
                output_line3 = '',
                output_line4 = '',
                output_line5 = '',
                err = false;

            this.logoName_array = logoName.toLowerCase().split("");

            for (var c in this.logoName_array) {
                if (this.logoName_array[c] in characterKey) {
                    output_line1 += characterKey[this.logoName_array[c]][0];
                    output_line2 += characterKey[this.logoName_array[c]][1];
                    output_line3 += characterKey[this.logoName_array[c]][2];
                    output_line4 += characterKey[this.logoName_array[c]][3];
                    output_line5 += characterKey[this.logoName_array[c]][4];
                }
                else {
                    err = true;
                }
            }

            if (err) {
                this.outputLogo = 'ERROR: Unrecognized Characters!';
                return 'ERROR: Unrecognized Characters!';
            }

            else if (this.logoName_array.length > 0) {
                this.outputLogo = output_line1 + '\n' + output_line2 + '\n' + output_line3 + '\n' + output_line4 + '\n' + output_line5;
                console.log(this.outputLogo);
                return output_line1 + '\n' + output_line2 + '\n' + output_line3 + '\n' + output_line4 + '\n' + output_line5;
            }

            else {
                this.outputLogo = '';
                return '';
            }
        }
    };
    return data;
}]);
