import Editor from './Editor.mjs';
import LightEditor from './LightEditor.mjs';

customElements.whenDefined( 'editor-' ).then( () => {
	const editor = document.querySelector( '#editor' );

	document.querySelector( '#change-selection').addEventListener( 'click', editor.changeSelection.bind( editor ) );
} );

customElements.define( 'editor-', Editor );
customElements.define( 'light-editor', LightEditor );
