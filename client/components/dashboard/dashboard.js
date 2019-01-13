/**
 * Dashboard Module
 *
 * Description
 */
angular.module('dashboard', ['ngAnimate', 'ngMaterial', 'ngMessages'])
    .factory('interceptor', function() {
        return {
            request: function(config) {
                config.headers["Authorization"] = "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjJhOTkzY2FkNmY2YTM5YWZlYWNhNmU4NzBlNWRjMDYxMjViOGFmYzcwMWIxNjQ4NzJhNTAyNDJmNDM2MzkwMDEwNDMwYTU1MDEwMWZkM2RiIn0.eyJhdWQiOiIyIiwianRpIjoiMmE5OTNjYWQ2ZjZhMzlhZmVhY2E2ZTg3MGU1ZGMwNjEyNWI4YWZjNzAxYjE2NDg3MmE1MDI0MmY0MzYzOTAwMTA0MzBhNTUwMTAxZmQzZGIiLCJpYXQiOjE1NDY4Njk0NTAsIm5iZiI6MTU0Njg2OTQ1MCwiZXhwIjoxNTQ4MTY1NDUwLCJzdWIiOiI1YTk0YTVjMC0xMGRhLTExZTktYTFmOS05MThhMzVhZjUwMDIiLCJzY29wZXMiOltdfQ.fRyy44SRQrNZ46U2_G7A9YLS-Fu5Pt4UMpbHS6qEoazYjwiMxmmYBOaYfX-taEgqGzK64bDdLPUL62No80A0eYdt7eYhUIqj5VJ1s5kA6Zt5BDuJr7_aKGaEntLoMagRx22dDC0pDYqfms4qV0nTP-Fpx2l338OtZNjavPSH0thndR03TsbfjIxtDDLyZLcjXhi4XWOGXmhd_MJDlGj1HQVLY2DYw8nfrRjcTzXe8x93NglUFazNLyO1ecBW36-BtEXkWuLIIBD0axvDTBac089g-G9ulkRps1kSkQjOCfAEMu0tEWvrYv3enw1_3a1KgXD-FVQ4ZJmPOhfdnUJfuUr5ezCilFlBx3fAtsn3HZeMUtR38Iq9g7fUfycIP4fhXyCVwvZk2UU0VvvKJtdghLjmYc-2ffwCyFiQtScw3dYXm0j6cJ44B9vRs-k1DSdqO7atqGvYVsePAkH0KD4LTzNn8ltWhsjja6xlzrFrm_uVdRsBwQLOeNCGTY5qndonSJanrKvz1dDkEoLNgrreO6Tb0mml-Lx-HlQtaG5ke7IBG60ZpIddBHFjqiC2F3etFJkT_uuyjDaMb6Xci3YPAMIdjTnI4aeMs8UbNNro-0fq7Ydd9XIH5Chhc7JbZiVVEkzaXkIEcp4VP1dg-_VWLXZ07AX8Bbx3ThY980POHv4"
                config.headers["referer-domain"] = "fwda.devship.freightbro.com"
                return config
            }
        }
    })
    .config(function($httpProvider) {
        $httpProvider.interceptors.push('interceptor')
    })
    .filter('sort', function() {
        return function(data, param) {
            if (param == "Ascending") {
                return data.sort(function(a, b) {
                    if (a.subVendor > b.subVendor) {
                        return 1
                    } else {
                        return -1
                    }
                    return 1
                })
            } else {
                return data.sort(function(a, b) {
                    if (a.subVendor > b.subVendor) {
                        return -1
                    } else {
                        return 1
                    }
                    return -1
                })
            }


        }
    })
    .service('apiservice', ['$http', function($http) {
        this.data = new Array()

        this.getSchedule = function(url) {
            return $http({
                url: url,
                method: 'GET'
            }).then((response) => {
                this.data.push(response)
            }, (error) => {
                this.data.push({"error" : "Schedule Not Available"})
            })
        }

        this.getData = function() {
            return this.data
        }

    }])
    .controller('dashboard', ['$scope', '$http', 'apiservice', '$filter', function($scope, $http, apiservice, $filter) {

        $scope.options = ['Ascending', 'Descending']
        $scope.result = 'Ascending'
        
        function isEmpty(data) {
            if (data.length) {
                return data
            }
            return data.length
        }

        function timeConversion(data) {
            let pattern = /\d+\-\d+\-\d+/g;
            if (data != "NA") {
                let date = new Date(data)
                return "Expires on " + date.toLocaleString('en-us', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                })
            }
        }

        $http({
            method: 'GET',
            // url: 'https://devapi.freightbro.com/api/search/5c335c0cad334f1fae13ffad'
            // url: 'https://devapi.freightbro.com/api/schedules?from_port=INNSA&to_port=DEHAM&carrier_code=&from_date=2019-01-14'
            url: '/api/data'
        }).then((reponse) => {
            let resultArray = Array()
            let jsonResponse = reponse.data.data.result_data.msr_rates.data
            for (var i = 0; i < jsonResponse.rates.length; i++) {
                let responseObj = new Object();
                Object.assign(responseObj, {
                    "vendor": jsonResponse.rates[i]["vendor"]["vendor_name"],
                    "subVendor": jsonResponse.rates[i]["sub_vendor"]["sub_vendor_name"],
                    "serviceType": (jsonResponse.rates[i]["service_type"] || "NA"),
                    "expiry": timeConversion(jsonResponse.rates[i]["expiry"] || "NA"),
                    "legCurrencyCost": jsonResponse.rates[i]["leg_currency_cost"] || "NA",
                    "legName": jsonResponse.rates[i]["leg_name"] || "NA",
                    "totalCost": (jsonResponse.rates[i]["leg_total_cost"] || "NA"),
                    "legCurrency": (jsonResponse.rates[i]["leg_currency"] || "NA"),
                    "totalCostCurrency": (jsonResponse.rates[i]["leg_total_currency"] || "NA"),
                    "schedule": isEmpty(jsonResponse.rates[i]["schedule"]["data"]) || jsonResponse.rates[i]["schedule"]["url"],
                    "flag": isEmpty(jsonResponse.rates[i]["schedule"]["data"])
                })
                resultArray.push(responseObj)
                delete(responseObj)
            }
            $scope.cardDetails = resultArray
            $scope.result = resultArray
            for (var j = 0; j < jsonResponse.rates.length; j++) {
                if (!($scope.result[j].schedule instanceof Array)) {
                    apiservice.getSchedule($scope.result[j].schedule)
                }
            }
        })

        $scope.schedule = apiservice.getData()

        $scope.search = function() {
            $scope.searchData = []
            if ($scope.query.length > 2) {
                $scope.cardDetails.forEach((values) => {
                    if (JSON.stringify(values).toLowerCase().includes($scope.query.toLowerCase())) {
                        $scope.searchData.push(values)
                    }
                })
                $scope.result = $scope.searchData
            } else {
                $scope.result = $scope.cardDetails
            }
            $filter('sort')($scope.result, $scope.sortvalue)
        }

        $scope.sort = function() {
            $filter('sort')($scope.result, $scope.sortvalue)
        }

    }])