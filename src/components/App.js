import React, { useState, useEffect, useRef } from "react";
import {
	Animated,
	Dimensions,
	Easing,
	Platform,
	SafeAreaView,
	StatusBar,
	StyleSheet,
	Text,
	View
} from "react-native";

import ajax from "../ajax";
import DealList from "./DealList";
import DealDetail from "./DealDetail";
import SearchBar from "./SearchBar";

export default function App() {
	const [deals, setDeals] = useState([]);
	const [dealsFromSearch, setDealsFromSearch] = useState([]);
	const [currentDealId, setCurrentDealId] = useState(null);
	const [activeSearchTerm, setActiveSearchTerm] = useState("");
	// Start animation at x (relative) position 0
	const titleXPos = useRef(new Animated.Value(0)).current;

	// Spring back and forth from x = -100 to 100
	const animateTitle = (direction=1) => {
		// Get the width of the screen (minus the width of bakesale)
		const width = Dimensions.get("window").width - 150;
		// (what to animate, the configuration object)
		Animated.timing(titleXPos, {
			toValue: direction * (width / 2),
			duration: 1000,
			easing: Easing.ease, // accelerate to the edge
			useNativeDriver: false
		}).start(({ finished }) => {
			// Invoked after the previous animation is done
			if (finished) {
				animateTitle(-1 * direction);
			} // stop the infinite loop once the deals are fetched
		});
	};

	useEffect(() => {
		animateTitle();

		// Fetch all the deals from the bakesaleforgood API
		(async () => {
			const fetchedDeals = await ajax.fetchInitialDeals();
			setDeals(fetchedDeals);
		})();
	}, []);

	const searchDeals = async searchTerm => {
		// Default if the search bar is empty
		let fetchedDealsFromSearch = [];

		if (searchTerm) {
			fetchedDealsFromSearch = await ajax.fetchDealsSearchResults(searchTerm);
		}

		setDealsFromSearch(fetchedDealsFromSearch);
		setActiveSearchTerm(searchTerm);
	};

	const currentDeal = () =>
		deals.find(deal => deal.key === currentDealId);

	// If not searching for anything, display all the deals
	const dealsToDisplay = dealsFromSearch.length > 0
		? dealsFromSearch
		: deals;

	if (currentDealId) {
		// Avoid the notch on iOS
		return Platform.OS === "ios" ? (
			<SafeAreaView style={styles.main}>
				<DealDetail
					initialDealData={currentDeal()}
					onBack={setCurrentDealId}
				/>
			</SafeAreaView>
		) : (
			<View style={styles.main}>
				<DealDetail
					initialDealData={currentDeal()}
					onBack={setCurrentDealId}
				/>
			</View>
		);
	} else if (dealsToDisplay.length > 0) {
		return Platform.OS === "ios" ? (
			<SafeAreaView style={styles.main}>
				<SearchBar searchDeals={searchDeals} initialSearchTerm={activeSearchTerm} />
				<DealList deals={dealsToDisplay} onItemPress={setCurrentDealId} />
			</SafeAreaView>
		) : (
			<View style={styles.main}>
				<SearchBar searchDeals={searchDeals} initialSearchTerm={activeSearchTerm} />
				<DealList deals={dealsToDisplay} onItemPress={setCurrentDealId} />
			</View>
		);
	} else {
		return (
			<Animated.View style={[styles.container, { left: titleXPos }]}>
				<Text style={styles.header}>Bakesale</Text>
			</Animated.View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center'
	},

	main: {
		marginTop: 30,
		// Avoid the notch on Android
		paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
	},

	header: {
		fontSize: 40
	}
});
