import logEvent from './logEvent.mjs';

export default class Editor extends HTMLElement {
	#selectionchangeListener;

	constructor() {
		super();

		this.contentEditable = true;
	}

	connectedCallback() {
		this.#selectionchangeListener = evt => this.#logSelectionChangeEvent( evt );

		document.addEventListener( 'selectionchange', this.#selectionchangeListener );
		this.addEventListener( 'click', logEvent );
		this.addEventListener( 'beforeinput', logEvent );
	}

	disconnectedCallback() {
		document.removeEventListener( 'selectionchange', this.#selectionchangeListener );
		this.removeEventListener( 'click', logEvent );
		this.removeEventListener( 'beforeinput', logEvent );
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

		if ( !document.querySelector( '#selectionchange' ).checked ) {
			return;
		}

		if ( !isGetComposedRangesSupported ) {
			console.group( `%clegacy working ${ evt.type }`, 'color:red' );
			console.log( 'editor', this );
			console.log( 'content of document range', stringifyRangeContent( documentRange ) );
			console.groupEnd();
			return;
		}

		/**
		 * @type {StaticRange[]}
		 */
		const [ composedRange ] = selection.getComposedRanges();
		const range = document.createRange();

		range.setStart( composedRange.startContainer, composedRange.startOffset );
		range.setEnd( composedRange.endContainer, composedRange.endOffset );

		console.group( `%c${ evt.type }`, 'color:red' );
		console.log( 'editor', this );
		console.log( 'content of document range', stringifyRangeContent( documentRange ) );
		console.log( 'composed range', composedRange );
		console.log( 'content of the range based on composed one', stringifyRangeContent( range ) );
		console.groupEnd();
	}
}

/**
 *
 * @param {Range} range
 */
function stringifyRangeContent( range ) {
	const cloned = range.cloneContents();
	const body = document.createElement( 'body' );

	body.append( cloned );

	return body.innerHTML;
}
