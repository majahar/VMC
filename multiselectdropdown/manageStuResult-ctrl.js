define(["app"], function(app) {
    "use strict";
    app.controller("manageStuResultCtrl", function(
      localStorageService,
      TosterUtil,
      UploadService,
      $state,
      $scope,
      SiteConstants,
      $rootScope,
      $document,
      $stateParams,
      Constants,
      Upload,
      VmcService,
      $interval,
      $sce,
      $location,
      $timeout,
      $compile,
      $window
    ) {
        $scope.testList=[];
        $scope.showHideCenter = false;
        $scope.centerList=[];

        $scope.loginId = localStorageService.get("loginId");
        $scope.uuid = localStorageService.get("uuid");
        $scope.sessionToken = localStorageService.get("sessionToken");
        $scope.profileCode = localStorageService.get("profileCode");
        $scope.schoolRoleCode = localStorageService.get("schoolRoleCode");
         // Headers
         $scope.headers = {
            headers: {
                "Content-Type": "application/json",
                loginId: $scope.loginId,
                profileCode: $scope.profileCode,
                sessionToken: $scope.sessionToken,
                SupportedApiVersion: 1,
                platform: "web",
                "3dSupport": "1",
            },
        };

        $scope.modalTimeout = function (id, status) {
          $(id).modal(status);
      };
       // $scope.activityFor=false;
       $scope.refresh = function () {
        $scope.resultForm={
          resultBatchId : '',
          tabAccess : '',
          vmcCenter : ''
      }

      $scope.userActivity = { activity: [
        { name: 'Center', id: 1, isDefault: true },
        { name: 'Student',id: 2, isDefault: false },
        { name: 'Delete Batch',id: 3, isDefault: false  }
        ]};
             for (var i = 0; i < $scope.userActivity.activity.length; i++) {
                 if ($scope.userActivity.activity[i].isDefault) {
                     $scope.storeDefault = $scope.userActivity.activity[i].id
                     break;
                 }
             };


       }
       $scope.refresh();

        $scope.getTestList = function () {
          $scope.testList=[];
          
           /*  if ($scope.testList.length > 0) {
              return;
            } */
             /* $scope.testList= [
              {
                  "id": "1",
                  "name": "HDFC-9310"
              },
              {
                  "id": "2",
                  "name": "HDFC-5122"
              },
              {
                  "id": "3",
                  "name": "ICICI- 1151"
              },
              {
                  "id": "4",
                  "name": "ICICI- 7452"
              }
          ];  */
          VmcService.getTestList($scope.headers).then(
              function (response) {
                if (response.data.error == null) {
                  $scope.testList = response.data.response;
                  console.log($scope.testList)
                } else {
                  console.error(" vmc get Test list  Error in getAccountList API");
                  $scope.testList=[];
                }
              },
              function (error) {
                console.error(" vmc get Test list  Error in getAccountList API");
                $scope.testList=[];
              }
            ); 
          };
          $scope.getTestList();

          $scope.getResultViewList = function () {
           
              $scope.resultViewList= [
              {
                  "id": "0",
                  "name": "Disable"
              },
              {
                  "id": "1",
                  "name": "Selection Letter"
              },
              {
                  "id": "2",
                  "name": "Selection Letter And Result Analysis"
              }
          ];  
         
          };
          $scope.getResultViewList();
          $scope.centerListDetail=[];

          $scope.getCenterDetails = function () {
           
            if ($scope.centerList.length > 0) {
                return;
              }
            
            VmcService.getCenterDetails($scope.headers).then(
                function (response) {
                  if (response.data.error == null) {
                    $scope.centerList = response.data.response;

                     angular.forEach($scope.centerList, function (value, key) { 
                      $scope.centerListDetail.push({id : value.centreCode , name :value.centreName}); 
                  }); 
                  } else {
                    console.error(" vmc get center list  Error in getAccountList API");
                  }
                },
                function (error) {
                  console.error(" vmc get center list  Error in getAccountList API");
                }
              );  
       
        };
        $scope.getCenterDetails();
  

        $scope.submitClicked = function () {

            var isFormValid = $scope.validateForm();

                if (isFormValid.length) {
                    TosterUtil.error(isFormValid);
                    return;
                }
           
            var isActivity= $scope.storeDefault == 1 ? "center" : "student";
            var data ={

                resultBatchId: $scope.resultForm.resultBatchId,
                tabAccess: $scope.resultForm.tabAccess,
                isActivity: isActivity,
                centerCode: $scope.resultForm.vmcCenter,
                selectedCenters : $scope.SelectedCenters
            }
            //console.log(data);
            VmcService.updateNatResultAccess(data, $scope.headers).then(
                function (response) {
                  if (response.data.error == null) {
                    //$scope.approval_res = response.data.response;
                    $scope.successMessage = true;
                    $timeout(function () {
                        $scope.successMessage = false;
                       // $state.go("manageStudentInfo");
                       $scope.refresh();

                  },3000);
                  } else {
                    console.error(" vmc  update Error in updateNatResultAccess API");
                    TosterUtil.error(response.data.error.errorMessage);
                  }
                },
                function (error) {
                  console.error(" vmc  update  Error in updateNatResultAccess API");
                }
              ) ;
                        
            
       
        };
        $scope.validateForm = function () {
           

            if ($scope.resultForm.resultBatchId == undefined || $scope.resultForm.resultBatchId == "") {
                return "Please select Batch";
            }
            if ($scope.resultForm.tabAccess === undefined || $scope.resultForm.tabAccess === "") {
              if($scope.storeDefault != 3){
                return "Please select tab access";


              }
            }
            
            return "";

        }

       // $scope.clearCenter = function (activityFor) {
          /*  $scope.resultForm={
              
                vmcCenter : [],
    
            }  */
          // alert(activityFor);
            /* if(activityFor == false){
                $scope.resultForm.vmcCenter="";

            }else if(activityFor == 'deleteBatch'){
              $scope.resultForm.userActivityFor=true;

            } */

       // }

       $scope.showDesiredFields = function (id) {

        $scope.resultForm={
          resultBatchId : '',
          tabAccess : '',
          vmcCenter : ''
      }
       $scope.SelectedCenters = [];

        
        /*  if(id == 1){
          $scope.resultForm.vmcCenter="";

         }else if(id == 3){
          $scope.resultForm.vmcCenter="";
          $scope.resultForm.tabAccess="";


         } */

    };

    $scope.areYouSureWantToDeleteBatch = function(){
      var isFormValid = $scope.validateForm();

                if (isFormValid.length) {
                    TosterUtil.error(isFormValid);
                    return;
                }

                $scope.modalTimeout('#batchDeleteConfirmationPopup', {
                  show: true,
                  backdrop: 'static'
              });

    }

    $scope.hideBatchDialog = function () {
      $("#batchDeleteConfirmationPopup").modal("hide");
  };


    $scope.deleteBatch = function(){
      var data ={

        resultBatchId: $scope.resultForm.resultBatchId
        }

        console.log(data);
           VmcService.deleteNatResult(data, $scope.headers).then(
              function (response) {
      if (response.data.error == null) {
       // alert('success')
        $scope.deleteBatchSuccessMessage = true;
       // $scope.getTestList();
      // alert('test')
       $window.location.reload();


        $timeout(function () {
        //  alert('succes after delay')
         // $scope.refresh();
            $scope.deleteBatchSuccessMessage = false;
            //$state.reload();
            //$window.location.reload();



      },3000);
      } else {
       // alert('error')
        console.error(" vmc  delete Error in deleteNatResult API");
        TosterUtil.error(response.data.error.errorMessage);
      }
    },
    function (error) {
      console.error(" vmc  delete  Error in deleteNatResult API");
    }
  ) ; 
  //$state.reload();

    }
     
        

     /* $scope.save = function () {
         for (var i = 0; i < $scope.merchant.storeLocations.length; i++) {
             if ($scope.merchant.storeLocations[i].id == $scope.storeDefault) {
                 $scope.merchant.storeLocations[i].isDefault = true
             } else {
                 $scope.merchant.storeLocations[i].isDefault = false
             }
         }
        
     } */

     $scope.getNatResultByBatch = function (batchId) {
       //alert(batchId);
       //alert($scope.storeDefault)
       if($scope.storeDefault == 3){
         return
       }
       
       var isActivity = $scope.storeDefault == 1 ? "center" : "student";
        var query = "";
        query = query + 'resultBatchId='+batchId;
        query = query + '&isActivity='+isActivity;

        console.log(query);

        /* var data={
          "response": {
          "id": "17566",
          "status": "1",
          "tabAccess": "2",
          "updatedAt": "2021-02-17 17:42:55",
          "updatedBy": "101004608030",
          "resultBatchId": "53",
          "vmcCenter": ['101','102']
          },
          "error": null
          }
          var res =data.response
          $scope.resultForm={ 
            tabAccess : res.tabAccess,
            resultBatchId : res.resultBatchId,
            vmcCenter :res.vmcCenter
           } */
    
         VmcService.getNatResultByBatch(query, $scope.headers).then(function (response) {
            if (response.data.error == null) {

              var res= response.data.response;

              $scope.resultForm={ 
                tabAccess : res.tabAccess,
                resultBatchId : res.resultBatchId,
                vmcCenter :res.centerCode
               }

            } else {
                TosterUtil.error(response.data.error.errorMessage);
            }
        }, function (error) {
          TosterUtil.error(response.data.error.errorMessage);
        }); 
  };
  
  $scope.SelectedCenters = [{
    "id": 101,
        "name": "Pitampura"
}, {
    "id": 102,
        "name": " Pitampura (Punjabi Bagh)"
}];
 /* $scope.MasterCountries = [{
    "id": 1,
        "name": "India"
}, {
    "id": 2,
        "name": "America"
}, {
    "id": 3,
        "name": "Japan"
}, {
    "id": 4,
        "name": "China"
}, {
    "id": 5,
        "name": "Germany"
}]  */
  
    });
    app.directive('multiselectDropdown', function () {
      return {
          restrict: 'E',
          scope: {
              model: '=',
              options: '=',
          },
          template:
              "<div class='btn-group panel-body' data-ng-class='{open: open}' style='height:250px;'>" +
              "<button class='btn btn-default dropdown-toggle' data-toggle='dropdown' data-ng-click='openDropdown()'style='width: 300px;height: 45px;'>---Select---</button>" +
              "<ul class='wall-dropdown dropdown-menu pd_state-dropDown' id='centrename' aria-labelledby='dropdownMenu' style='position: relative;margin-top: -224px;width: 300px;'>" +
              "<input type='text' ng-model='centreNameFilterStr' placeholder='Search...' list='centrename' class='form-control input-hg'></input>"+
              "<li class='pd_state-dropDown-hide' style='cursor:pointer;' ><a data-ng-click='selectAll()'><span class='glyphicon glyphicon-ok-circle' aria-hidden='true'></span> Select All</a></li>" +
              "<li style='cursor:pointer;' ><a data-ng-click='deselectAll()'><span class='glyphicon glyphicon-remove-circle' aria-hidden='true'></span> DeSelect All</a></li>" +

              "<li style='cursor:pointer;' data-ng-repeat='option in options | filter:centreNameFilterStr'><a data-ng-click='toggleSelectItem(option)'><span data-ng-class='getClassName(option)' aria-hidden='true'></span> {{option.name}}</a></li>" +
              "</ul>" +
              "</div>",
  
          controller: function ($scope) {
  
              $scope.openDropdown = function () {
  
                  $scope.open = !$scope.open;
  
              };
  
              $scope.selectAll = function () {
  
                  $scope.model = [];
  
                  angular.forEach($scope.options, function (item, index) {
  
                      $scope.model.push(item);
  
                  });
  
              };
  
              $scope.deselectAll = function () {
  
                  $scope.model = [];
  
              };
  
              $scope.toggleSelectItem = function (option) {
  
                  var intIndex = -1;
  
                  angular.forEach($scope.model, function (item, index) {
  
                      if (item.id == option.id) {
  
                          intIndex = index;
  
                      }
  
                  });
  
                  if (intIndex >= 0) {
  
                      $scope.model.splice(intIndex, 1);
  
                  } else {
  
                      $scope.model.push(option);
  
                  }
  
              };
  
              $scope.getClassName = function (option) {
  
                  var varClassName = 'glyphicon glyphicon-remove-circle';
  
                  angular.forEach($scope.model, function (item, index) {
  
                      if (item.id == option.id) {
  
                          varClassName = 'glyphicon glyphicon-ok-circle';
  
                      }
  
                  });
  
                  return (varClassName);
  
              };
  
          }
      }
  
  });
 });
  