import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

import ajax from "../ajax";
import DealList from "./DealList";

export default function App() {
	const [deals, setDeals] = useState([]);

	useEffect(() => {
		(async () => {
			const fetchedDeals = await ajax.fetchInitialDeals();
			setDeals(fetchedDeals);
		})();
	}, []);

	return (
		<View style={styles.container}>
			{deals.length > 0 ? (
				<DealList deals={deals} />
			) : (
				<Text style={styles.header}>Bakesale</Text>
			)}
			<StatusBar style="auto" />
		</View>
	);
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
