/**
 * Dashboard Module
 *
 * Description
 */
angular.module('dashboard', ['ngAnimate', 'ngMaterial', 'ngMessages'])
    .factory('interceptor', function() {
        return {
            request: function(config) {
                config.headers["Authorization"] = "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImQ5YTliZmIyNzBkZGM4YThmOTFjNWJmN2NlZTIzYzM0ODIzMmY0Y2NlZWNjNzk0OTNlYzQ1MzAwMDNmNTJiMzdlNmM1NzZmNzU2YzE4ZjRkIn0.eyJhdWQiOiIyIiwianRpIjoiZDlhOWJmYjI3MGRkYzhhOGY5MWM1YmY3Y2VlMjNjMzQ4MjMyZjRjY2VlY2M3OTQ5M2VjNDUzMDAwM2Y1MmIzN2U2YzU3NmY3NTZjMThmNGQiLCJpYXQiOjE1NDc0NzYzMjgsIm5iZiI6MTU0NzQ3NjMyOCwiZXhwIjoxNTQ4NzcyMzI4LCJzdWIiOiI1YTk0YTVjMC0xMGRhLTExZTktYTFmOS05MThhMzVhZjUwMDIiLCJzY29wZXMiOltdfQ.LfijeBC8TbE3RDG4jRw1Lq8WnbHtV4NFrHMBOurK-VltErGvCHUwKuPcq3J49hae-mFv8Gn6gj4H3HgJsFHAAfwIuZX9RdJcMXU7JU_7olmtGGL0oJv2MWdN0852G8WCU2fCgZ7klF-Cr8UwMV2kW-VFKWYxcSYD0TtywomRT2aERIoyQD_u8BCCqOm2XySwZbCP6x9bwmIk9opKnEYm3rqNslc-iv7s2-A7c_keBiiXxCcQMh2U5pp7mPQ9HCuLkhqeg4HMUH1RjySuevfWMPl5quVXtfPubUgWKKnBgmeGTi6L1FcFrQfshwpTZCLMi41JEexqihXewbrcZrEig8CJSXhee6TeodLLSkY6FBlr5rzjEdA9hs6cmBqTeA1YFc2qigFi9H4pHmG8WQduKXSxkzE9ZLvo5BARdsZi0jPIXu3nraCZ3f8pMkOxmIjqh3rBpdOjZXr0fAUUhmnAzru6MKG_5pugpKzzC-GQqXLKF6GSjyQM81cnoIOTRGWjQmfCAB6VCeQHKLjY8rS5KyjTdsUtalAeW3xb5HvrbNC_mNo5seCHfG31F0LyMOlgmR4xC_C5K7wtyGdIFODZUB19aCA1xbyYf1erozAWx6-RHjREqGcTEkS9z3WMznpVNucpa6HDref1GmYf9wm-EeKHa4SbU8bL-rzolnGMTts"
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
                // console.log(response.data.data[0])
                if (!response.data.data.length) {
                    this.data.push({
                        "error": "Schedule Not Available"
                    })
                } else {
                    this.data.push({
                        "destinationPortName": response.data.data[0]["destination_port_name"],
                        "transitTime": response.data.data[0]["transit_time"],
                        "viaPort": response.data.data[0]["via_port"],
                        "departureTime": response.data.data[0]["departure_time"],
                        "carrierCode": response.data.data[0]["carrier_code"]
                    })
                }
            }, (error) => {
                this.data.push({
                    "error": "Schedule Not Available"
                })
            })
        }

        this.getData = function() {
            console.log(this.data)
            return this.data
        }

    }])
    .controller('dashboard', ['$scope', '$http', 'apiservice', '$filter', function($scope, $http, apiservice, $filter) {

        $scope.options = ['Ascending', 'Descending']
        $scope.result = 'Ascending'
        $scope.result = []

        function isEmpty(data) {
            if (data.length) {
                return data
            }
            return data.length
        }

        $scope.timeConversion = function(data) {
            let pattern = /\d+\-\d+\-\d+/g;
            if (data != "NA") {
                let date = new Date(data)
                return date.toLocaleString('en-us', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                })
            }
        }

        $http({
            method: 'GET',
            url: 'https://devapi.freightbro.com/api/search/5c335c0cad334f1fae13ffad'
            // url: 'sadfasf'
            // url: '/api/data'
        }).then((reponse) => {
            let resultArray = Array()
            let jsonResponse = reponse.data.data.result_data.msr_rates.data
            for (var i = 0; i < jsonResponse.rates.length; i++) {
                let responseObj = new Object();
                Object.assign(responseObj, {
                    "vendor": jsonResponse.rates[i]["vendor"]["vendor_name"],
                    "subVendor": jsonResponse.rates[i]["sub_vendor"]["sub_vendor_name"],
                    "serviceType": (jsonResponse.rates[i]["service_type"] || "NA"),
                    "expiry": "Expires on " + $scope.timeConversion(jsonResponse.rates[i]["expiry"] || "NA"),
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