import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

import ajax from "../ajax";
import DealList from "./DealList";
import DealDetail from "./DealDetail";
import SearchBar from "./SearchBar";

export default function App() {
	const [deals, setDeals] = useState([]);
	const [dealsFromSearch, setDealsFromSearch] = useState([]);
	const [currentDealId, setCurrentDealId] = useState(null);

	useEffect(() => {
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
	};

	const currentDeal = () =>
		deals.find(deal => deal.key === currentDealId);

	// If not searching for anything, display all the deals
	const dealsToDisplay = dealsFromSearch.length > 0
		? dealsFromSearch
		: deals;

	if (currentDealId) {
		return (
			<View style={styles.main}>
				<DealDetail
					initialDealData={currentDeal()}
					onBack={setCurrentDealId}
				/>
			</View>
		);
	} else if (dealsToDisplay.length > 0) {
		return (
			<View style={styles.main}>
				<SearchBar searchDeals={searchDeals} />
				<DealList deals={dealsToDisplay} onItemPress={setCurrentDealId} />
			</View>
		);
	} else {
		return <Text style={styles.header}>Bakesale</Text>;
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
		marginTop: 30
	},

	header: {
		fontSize: 40
	}
});
