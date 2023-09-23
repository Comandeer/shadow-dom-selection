import Editor from './Editor.mjs';

customElements.whenDefined( 'editor-' ).then( () => {
	const editor = document.querySelector( '#editor' );

	document.querySelector( '#change-selection-shadow' ).addEventListener( 'click', editor.changeSelection.bind( editor ) );
	document.querySelector( '#change-selection-light' ).addEventListener( 'click', function changeSelection() {
		const paragraph = document.querySelector( 'p' );
		const range = document.createRange();

		range.selectNodeContents( paragraph );

		const selection = getSelection();

		selection.removeAllRanges();
		selection.addRange( range );
	} );
} );

customElements.define( 'editor-', Editor );
