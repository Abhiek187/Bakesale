import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

import ajax from "../ajax";
import DealList from "./DealList";
import DealDetail from "./DealDetail";

export default function App() {
	const [deals, setDeals] = useState([]);
	const [currentDealId, setCurrentDealId] = useState(null);

	useEffect(() => {
		(async () => {
			const fetchedDeals = await ajax.fetchInitialDeals();
			setDeals(fetchedDeals);
		})();
	}, []);

	const currentDeal = () =>
		deals.find(deal => deal.key === currentDealId);

	if (currentDealId) {
		return (
			<DealDetail
				initialDealData={currentDeal()}
				onBack={setCurrentDealId}
			/>
		);
	} else if (deals.length > 0) {
		return <DealList deals={deals} onItemPress={setCurrentDealId} />;
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

	header: {
		fontSize: 40
	}
});
