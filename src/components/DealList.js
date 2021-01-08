import React from "react";
import PropTypes from "prop-types";
import { FlatList, StyleSheet, Text, View } from "react-native";

export default function DealList({ deals }) {
	/* Deals contain:
	 * cause: {name: },
	 * key: string,
	 * media: [string],
	 * price: number,
	 * title: string
	 */
	return (
		<View style={styles.list}>
			<FlatList
				data={deals}
				renderItem={({item}) => <Text>{item.title}</Text>}
			/>
		</View>
	);
}

DealList.propTypes = {
	deals: PropTypes.array.isRequired
};

const styles = StyleSheet.create({
	list: {
		backgroundColor: "#eee",
		flex: 1,
		width: "100%",
		paddingTop: 50
	}
});
