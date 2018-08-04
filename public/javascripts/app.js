angular.module('shoppingApp', [])

.controller('shoppingController', function($scope, $http) {

    	$scope.items = {};
		$scope.promoList = {};
		$scope.promoCode = "";
		$scope.displayPromo = "";
		$scope.promoDiscount = 0;
		$scope.subTotal = 0;
		$scope.total = 0;
		$scope.isPromoValid = false;
		$scope.redBorderPromo = false;


		$scope.init = function(){

		// Get all items from Inventory
		$http.get('./model/inventory.json')
			.success(function(data) {
				$scope.items = data;
				for (var i=0;i<$scope.items.length;i++){
					$scope.items[i].ImageName = "../images/"+$scope.items[i].ImageName; //Image URL Matching

					// Discount as per the Inventory Model
					var discountedPrice =(calculateDiscountedPrice($scope.items[i].ProductPrice * $scope.items[i].Quantity, $scope.items[i].DiscountPercent));

					if($scope.items[i].Gender == "Female") {// Additional 5% Discount for Females
						discountedPrice = calculateDiscountedPrice(discountedPrice,5);
					}
					$scope.subTotal = $scope.subTotal + discountedPrice;
				}
				$scope.total = $scope.subTotal;
			})
			.error(function(error) {
				console.log('Error: ' + error);
			});

			// Get all promos from Promo Model
			$http.get('./model/promo.json')
				.success(function(data) {
					$scope.promoList = data;
				})
				.error(function(error) {
					console.log('Error: ' + error);
				});
	}
		// Local Function to calculate discounted price
		var calculateDiscountedPrice = function(initialPrice,discountPercentage){
			return	initialPrice - (discountPercentage/100)*initialPrice;
		}

		// On Click of Apply Promo Button
		$scope.applyPromo = function(){
			$scope.isPromoValid = false;
			$scope.redBorderPromo = false;
			$scope.promoDiscount = 0;
			$scope.total = $scope.subTotal;
			for (var i=0;i<$scope.promoList.length;i++) {
				if($scope.promoList[i].OfferCode == $scope.promoCode.toUpperCase()){
					$scope.promoDiscount = ($scope.promoList[i].DiscountPercent/100)*$scope.subTotal;
					$scope.isPromoValid = true;
					$scope.displayPromo = $scope.promoCode.toUpperCase();
					$scope.total = $scope.subTotal - $scope.promoDiscount;
					break;
				}
			}
			if(!$scope.isPromoValid){
				$scope.redBorderPromo = true;
			}
		}
});