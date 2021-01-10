import React from "react";
import PropTypes from "prop-types";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { priceDisplay } from "../util";

export default function DealItem({ deal, onPress }) {
	/* Deals contain:
	 * cause: {name: string},
	 * key: string,
	 * media: [string],
	 * price: number,
	 * title: string
	 */
	const handlePress = () => {
		onPress(deal.key); // set the current deal ID as the deal's key
	};

	return (
		<TouchableOpacity style={styles.deal} onPress={handlePress}>
			<Image
				source={{ uri: deal.media[0] }}
				style={styles.image}
			/>
			<View style={styles.info}>
				<Text style={styles.title}>{deal.title}</Text>
				<View style={styles.footer}>
					<Text style={styles.cause}>{deal.cause.name}</Text>
					<Text style={styles.price}>{priceDisplay(deal.price)}</Text>
				</View>
			</View>
		</TouchableOpacity>
	);
}

DealItem.propTypes = {
	deal: PropTypes.object.isRequired,
	onPress: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
	deal: {
		margin: 12
	},

	image: {
		width: "100%",
		height: 150, // images from the API have a height of 150
		backgroundColor: "#ccc"
	},

	info: {
		padding: 10,
		backgroundColor: "#fff",
		borderColor: "#bbb",
		borderWidth: 1,
		borderTopWidth: 0
	},

	title: {
		fontSize: 16,
		fontWeight: "bold",
		marginBottom: 5
	},

	footer: {
		flexDirection: "row"
	},

	cause: {
		flex: 2
	},

	price: {
		flex: 1,
		textAlign: "right"
	}
});
