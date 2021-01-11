import React from "react";
import PropTypes from "prop-types";
import { FlatList, StyleSheet, View } from "react-native";

import DealItem from "./DealItem";

export default function DealList({ deals, onItemPress }) {
	return (
		<View style={styles.list}>
			<FlatList
				data={deals}
				renderItem={({item}) => <DealItem deal={item} onPress={onItemPress} />}
			/>
		</View>
	);
}

DealList.propTypes = {
	deals: PropTypes.array.isRequired,
	onItemPress: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
	list: {
		backgroundColor: "#eee",
		width: "100%",
		marginBottom: "auto"
	}
});
