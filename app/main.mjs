import Editor from './Editor.mjs';

customElements.whenDefined( 'editor-' ).then( () => {
	const editor = document.querySelector( '#editor' );
	console.log( 'bla')
	document.querySelector( '#change-selection').addEventListener( 'click', editor.changeSelection.bind( editor ) );
} );

customElements.define( 'editor-', Editor );
