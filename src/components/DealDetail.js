import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import {
	Animated,
	Dimensions,
	Image,
	PanResponder,
	StyleSheet,
	Text,
	TouchableOpacity,
	View
} from "react-native";

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
	const [imageIndex, setImageIndex] = useState(0);
	const imageXPos = useRef(new Animated.Value(0)).current;
	const width = useRef(Dimensions.get("window").width).current;
	const imageDirection = useRef(1);

	const handleSwipe = indexDirection => {
		if (!deal.media[imageIndex + indexDirection]) {
			// No more images to swipe through
			Animated.spring(imageXPos, {
				toValue: 0
			}).start();
			return;
		}

		imageDirection.current = indexDirection;
		setImageIndex(imageIndex + indexDirection);
	};

	const imagePanResponder = PanResponder.create({
		// Make the pan responder active
		onStartShouldSetPanResponder: () => true,
		// Detect gesture movement (evt = event, gs = gesture state)
		onPanResponderMove: (evt, gs) => {
			// Set the x position of the image to the distance traveled by the gesture
			imageXPos.setValue(gs.dx);
		},
		// When the finger is released
		onPanResponderRelease: (evt, gs) => {
			if (Math.abs(gs.dx) > 0.4 * width) {
				// Swipe the image left or right
				const direction = Math.sign(gs.dx); // -1 or 1

				Animated.timing(imageXPos, {
					toValue: direction * width,
					duration: 250
				}).start(() => {
					// Move the image back or place a new image in the opposite direction of the swipe
					handleSwipe(-1 * direction);
				});
			} else {
				// The image didn't move far enough, so put it back in its original position
				Animated.spring(imageXPos, {
					toValue: 0
				}).start();
			}
		}
	});

	useEffect(() => {
		(async () => {
			const fullDeal = await ajax.fetchDealDetail(deal.key);
			setDeal(fullDeal);
		})();
	}, []);

	useEffect(() => {
		// Next image animation
		imageXPos.setValue(imageDirection.current * width);
		Animated.spring(imageXPos, {
			toValue: 0
		}).start();
	}, [imageIndex]);

	const handlePress = () => {
		onBack(null); // set the current deal ID to null to go back to the deals list
	};

	return (
		<View style={styles.deal}>
			<TouchableOpacity onPress={handlePress}>
				<Text style={styles.backLink}>Back</Text>
			</TouchableOpacity>
			<Animated.Image
				{...imagePanResponder.panHandlers}
				source={{ uri: deal.media[imageIndex] }}
				style={[styles.image, { left: imageXPos }]}
			/>
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
	backLink: {
		marginBottom: 5,
		color: "#22f",
		marginLeft: 10
	},

	image: {
		width: "100%",
		height: 150, // images from the API have a height of 150
		backgroundColor: "#ccc"
	},

	title: {
		fontSize: 16,
		padding: 10,
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
