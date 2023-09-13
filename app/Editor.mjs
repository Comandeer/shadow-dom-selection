import logEvent from './logEvent.mjs';

export default class Editor extends HTMLElement {
	#shadow;
	#selectionchangeListener;

	constructor() {
		super();

		this.#shadow = this.attachShadow( {
			mode: 'closed'
		} );
	}

	connectedCallback() {
		this.#shadow.innerHTML = `<style>
		[contenteditable] {
			min-height: 2em;
			border: 2px #f00 dashed;
		}

		table, tr, td {
			border: 1px #000 solid;
		}
		</style>
		<div contenteditable>${ this.innerHTML }</div>`;

		let child;
		while ( child = this.firstChild ) {
			child.remove();
		}

		this.#selectionchangeListener = evt => this.#logSelectionChangeEvent( evt );

		document.addEventListener( 'selectionchange', this.#selectionchangeListener );
		this.#shadow.addEventListener( 'click', logEvent );
		this.#shadow.addEventListener( 'beforeinput', logEvent );
	}

	disconnectedCallback() {
		document.removeEventListener( 'selectionchange', this.#selectionchangeListener );
		this.#shadow.removeEventListener( 'click', logEvent );
		this.#shadow.removeEventListener( 'beforeinput', logEvent );
	}

	changeSelection() {
		this.#shadow.querySelector( '[contenteditable]' ).focus();

		const heading = this.#shadow.querySelector( 'h1' );
		const range = document.createRange();

		range.selectNodeContents( heading );

		const selection = getSelection();

		selection.removeAllRanges();
		selection.addRange( range );
	}

	/**
	 *
	 * @param {Event} evt
	 */
	#logSelectionChangeEvent( evt ) {
		const selection = getSelection();
		let documentRange;

		try {
			documentRange = selection.getRangeAt( 0 );
		} catch {
			return;
		}

		const isGetComposedRangesSupported = 'getComposedRanges' in selection;
		const isShadowRootSelectionSupported = 'getSelection' in this.#shadow;

		if ( !document.querySelector( '#selectionchange' ).checked ) {
			return;
		}

		if ( !isGetComposedRangesSupported && !isShadowRootSelectionSupported ) {
			console.group( `%cnot working ${ evt.type }`, 'color:red' );
			console.log( 'editor', this );
			console.log( 'content of document range', documentRange.cloneContents() );
			console.groupEnd();
			return;
		}

		if ( isShadowRootSelectionSupported ) {
			/**
			 * @type {Selection}
			 */
			const shadowRootSelection = this.#shadow.getSelection();
			const shadowRootRange = shadowRootSelection.rangeCount > 0 ? shadowRootSelection.getRangeAt( 0 ) : null;

			console.group( `%clegacy ${ evt.type }`, 'color:red' );
			console.log( 'editor', this );
			console.log( 'content of document range', documentRange.cloneContents() );
			console.log( 'content of shadow range', shadowRootRange ? shadowRootRange.cloneContents() : null );
			console.groupEnd();

			return;
		}

		/**
		 * @type {StaticRange[]}
		 */
		const [ composedRange ] = selection.getComposedRanges( this.#shadow );
		const range = document.createRange();

		range.setStart( composedRange.startContainer, composedRange.startOffset );
		range.setEnd( composedRange.endContainer, composedRange.endOffset );

		console.group( `%c${ evt.type }`, 'color:red' );
		console.log( 'editor', this );
		console.log( 'content of document range', documentRange.cloneContents() );
		console.log( 'composed range', composedRange );
		console.log( 'content of the range based on composed one', range.cloneContents() );
		console.groupEnd();
	}
}
