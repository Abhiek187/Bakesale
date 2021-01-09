import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { priceDisplay } from "../util";
import ajax from "../ajax";

export default function DealDetail({ initialDealData, onBack }) {
	/* Full deal contains:
	 * availableQuantity: number,
	 * cause: {name: string},
	 * charity: {description: null?, name: string, website: null?},
	 * charityDescription/Name/Website: null?,
	 * dealType: string,
	 * description: string,
	 * geoLocation: null?,
	 * key: string,
	 * makerPercentage: number,
	 * media: [string],
	 * price: number,
	 * tags: string (comma-separated),
	 * title: string,
	 * url: string,
	 * user: {avatar: string, name: string}
	 */

	const [deal, setDeal] = useState(initialDealData);

	useEffect(() => {
		(async () => {
			const fullDeal = await ajax.fetchDealDetail(deal.key);
			setDeal(fullDeal);
		})();
	}, []);

	const handlePress = () => {
		onBack(null); // set the current deal ID to null to go back to the deals list
	};

	return (
		<View style={styles.deal}>
			<TouchableOpacity onPress={handlePress}>
				<Text style={styles.backLink}>Back</Text>
			</TouchableOpacity>
			<Image source={{ uri: deal.media[0] }} style={styles.image} />
			<View style={styles.detail}>
				<View>
					<Text style={styles.title}>{deal.title}</Text>
				</View>
				<View style={styles.footer}>
					<View style={styles.info}>
						<Text style={styles.price}>{priceDisplay(deal.price)}</Text>
						<Text style={styles.cause}>{deal.cause.name}</Text>
					</View>
				</View>
			</View>
			{deal.user && (
				<View style={styles.user}>
					<Image source={{ uri: deal.user.avatar }} style={styles.avatar} />
					<Text>{deal.user.name}</Text>
				</View>
			)}
			{deal.description && (
				<View style={styles.description}>
					<Text>{deal.description}</Text>
				</View>
			)}
		</View>
	);
}

DealDetail.propTypes = {
	initialDealData: PropTypes.object.isRequired,
	onBack: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
	deal: {
		marginHorizontal: 12
	},

	backLink: {
		marginBottom: 5,
		color: "#22f"
	},

	image: {
		width: "100%",
		height: 150, // images from the API have a height of 150
		backgroundColor: "#ccc"
	},

	detail: {
		borderColor: "#bbb",
		borderWidth: 1
	},

	title: {
		fontSize: 16,
		fontWeight: "bold",
		backgroundColor: "rgba(237, 149, 45, 0.4)"
	},

	footer: {
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
		marginTop: 15
	},

	info: {
		alignItems: "center"
	},

	user: {
		alignItems: "center"
	},

	cause: {
		marginVertical: 10
	},

	price: {
		fontWeight: "bold"
	},

	// 60x60 avatar image
	avatar: {
		width: 60,
		height: 60,
		borderRadius: 30
	},

	description: {
		borderColor: "#ddd",
		borderWidth: 1,
		borderStyle: "dotted",
		margin: 10,
		padding: 10
	}
});
