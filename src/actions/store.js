export default {
	debug: true,
	state: {
		popinIsOpen: false,
		popinListIsOpen: false
	},
	getState( key ) {
		return this.state[key];
	},
	setState( key, newValue ) {

		// DEBUG
		this.debug && (
			console.log('%cset ' + key + ' Action trigger with', 'color: green'),
			console.log('%c' + this.state[key], 'text-decoration: line-through', newValue)
		);

		// CODE
		this.state[key] = newValue;

		return this.state[key];
	},
	clearState( key ) {

		// DEBUG
		this.debug && (
			console.log('%cclear ' + key + ' Action trigger', 'color: green;'),
			console.log('%c' + this.state[key], 'text-decoration: line-through')
		);

		// CODE
		this.state[key] = false;

		return this.state[key];
	},
	toggleState( key ) {

		// DEBUG
		this.debug && (
			console.log('%ctoggleState ' + key + ' Action trigger', 'color: green;'),
			console.log('%c' + this.state[key], 'text-decoration: line-through', !this.state[key])
		);

		// CODE
		this.state[key] = !this.state[key];

		return this.state[key];
	}
}