import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { StyleSheet, TextInput } from "react-native";
import debounce from "lodash.debounce";

export default function SearchBar({ searchDeals, initialSearchTerm }) {
	const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
	const isMounted = useRef(false);
	const inputElement = useRef(null);

	const searchDealsAndBlur = term => {
		// Remove focus (hide the keyboard) after searching
		searchDeals(term);
		inputElement.current.blur();
	};

	const debouncedSearchDeals = useRef(debounce(searchDealsAndBlur, 300));

	useEffect(() => {
		// Only invoke componentDidUpdate()
		if (!isMounted.current) {
			isMounted.current = true;
		}

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

	const exposeInputElement = element => {
		inputElement.current = element;
	};

	return (
		<TextInput
			ref={exposeInputElement}
			value={searchTerm}
			placeholder="Search All Deals"
			style={styles.input}
			onChangeText={handleChange}
		/>
	);
}

SearchBar.propTypes = {
	searchDeals: PropTypes.func.isRequired,
	initialSearchTerm: PropTypes.string.isRequired
};

const styles = StyleSheet.create({
	input: {
		height: 40,
		marginHorizontal: 12
	}
});
