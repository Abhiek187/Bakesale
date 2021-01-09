import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { StyleSheet, TextInput } from "react-native";
import debounce from "lodash.debounce";

export default function SearchBar({ searchDeals }) {
	const [searchTerm, setSearchTerm] = useState("");
	const debouncedSearchDeals = useRef(debounce(searchDeals, 300));
	const isMounted = useRef(true);

	useEffect(() => {
		// Don't re-render after every character update (wait 300 ms)
		debouncedSearchDeals.current(searchTerm);

		return () => {
			isMounted.current = false;
		};
	}, [searchTerm]);

	const handleChange = term => {
		// Only perform a state change while the component is still mounted
		if (isMounted.current) {
			setSearchTerm(term);
		}
	};

	return (
		<TextInput
			placeholder="Search All Deals"
			style={styles.input}
			onChangeText={handleChange}
		/>
	);
}

SearchBar.propTypes = {
	searchDeals: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
	input: {
		height: 40,
		marginHorizontal: 12
	}
});
