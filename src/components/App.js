import React, { useState, useEffect, useRef } from "react";
import {
	Animated,
	Dimensions,
	Easing,
	PanResponder,
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
	const viewXPos = useRef(new Animated.Value(0)).current;
	const width = useRef(Dimensions.get("window").width).current;
	const dealDirection = useRef(1);

	// Spring back and forth from x = -100 to 100
	const animateTitle = (direction=1) => {
		// Get the width of the screen (minus the width of bakesale)
		const reducedWidth = width - 150;
		// (what to animate, the configuration object)
		Animated.timing(titleXPos, {
			toValue: direction * (reducedWidth / 2),
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

	const currentDealIndex = () =>
		deals.findIndex(deal => deal.key === currentDealId);

	const handleSwipe = indexDirection => {
		const nextDeal = deals[currentDealIndex() + indexDirection];

		if (!nextDeal) {
			// No more deals to swipe through
			Animated.spring(viewXPos, {
				toValue: 0,
				useNativeDriver: false
			}).start();
			return;
		}

		dealDirection.current = indexDirection;
		setCurrentDealId(nextDeal.key);
	};

	const viewPanResponder = PanResponder.create({
		// Let the movement determine whether the Pan Responder is active
		onStartShouldSetPanResponder: () => false,
		// If true, slide the deals; else, activate the ScrollView and slide the images
		onMoveShouldSetPanResponder: (evt, gs) => {
			return gs.moveY > 250 && (Math.abs(gs.dx) > Math.abs(gs.dy * 3));
		},
		// Detect gesture movement (evt = event, gs = gesture state)
		onPanResponderMove: (evt, gs) => {
			// Set the x position of the view to the distance traveled by the gesture
			viewXPos.setValue(gs.dx);
		},
		// When the finger is released
		onPanResponderRelease: (evt, gs) => {
			if (Math.abs(gs.dx) > 0.4 * width) {
				// Swipe the view left or right
				const direction = Math.sign(gs.dx); // -1 or 1

				Animated.timing(viewXPos, {
					toValue: direction * width,
					duration: 250,
					useNativeDriver: false
				}).start(() => {
					// Move the view back or place a new deal in the opposite direction of the swipe
					handleSwipe(-1 * direction);
				});
			} else {
				// The view didn't move far enough, so put it back in its original position
				Animated.spring(viewXPos, {
					toValue: 0,
					useNativeDriver: false
				}).start();
			}
		}
	});

	useEffect(() => {
		animateTitle();

		// Fetch all the deals from the bakesaleforgood API
		(async () => {
			const fetchedDeals = await ajax.fetchInitialDeals();
			setDeals(fetchedDeals);
		})();
	}, []);

	useEffect(() => {
		// Next deal animation
		viewXPos.setValue(dealDirection.current * width);
		Animated.spring(viewXPos, {
			toValue: 0,
			useNativeDriver: false
		}).start();
	}, [currentDealId]);

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
			<SafeAreaView>
				<Animated.View
					{...viewPanResponder.panHandlers}
					style={[styles.main, { left: viewXPos }]}
				>
					{/* The key prop forces DealDetail to re-render whenever the deal ID changes */}
					<DealDetail
						key={currentDealId}
						initialDealData={currentDeal()}
						initialDirection={dealDirection.current}
						onBack={setCurrentDealId}
					/>
				</Animated.View>
			</SafeAreaView>
		) : (
			<Animated.View
				{...viewPanResponder.panHandlers}
				style={[styles.main, { left: viewXPos }]}
			>
				<DealDetail
					key={currentDealId}
					initialDealData={currentDeal()}
					initialDirection={dealDirection.current}
					onBack={setCurrentDealId}
				/>
			</Animated.View>
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
