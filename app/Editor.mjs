import logEvent from './logEvent.mjs';

export default class Editor extends HTMLElement {
	#shadow;
	#selectionchangeListener;
	#clickListener;

	constructor() {
		super();

		this.#shadow = this.attachShadow( {
			mode: 'open'
		} );
	}

	connectedCallback() {
		this.#shadow.innerHTML = `<style> [contenteditable] {
			min-height: 2em;
			border: 2px #f00 dashed;
		} </style>
		<div contenteditable>${ this.innerHTML }</div>`;

		let child;
		while ( child = this.firstChild ) {
			child.remove();
		}

		this.#selectionchangeListener = evt => this.#logSelectionChangeEvent( evt );
		this.#clickListener = evt => this.#logClickEvent( evt );

		document.addEventListener( 'selectionchange', this.#selectionchangeListener );
		this.#shadow.addEventListener( 'click', this.#clickListener );
		this.#shadow.addEventListener( 'beforeinput', logEvent );
	}

	disconnectedCallback() {
		document.removeEventListener( 'selectionchange', this.#selectionchangeListener );
		this.#shadow.removeEventListener( 'click', this.#clickListener );
		this.#shadow.removeEventListener( 'beforeinput', logEvent );
	}

	/**
	 *
	 * @param {Event} evt
	 */
	#logSelectionChangeEvent( evt ) {
		const selection = getSelection();
		const documentRange = selection.getRangeAt( 0 );
		const isGetComposedRangesSupported = 'getComposedRanges' in selection;
		const isShadowRootSelectionSupported = 'getSelection' in this.#shadow;

		if ( !isGetComposedRangesSupported && !isShadowRootSelectionSupported ) {
			return;
		}

		if ( isShadowRootSelectionSupported ) {
			/**
			 * @type {Selection}
			 */
			const shadowRootSelection = this.#shadow.getSelection();
			const shadowRootRange = shadowRootSelection.rangeCount > 0 ? shadowRootSelection.getRangeAt( 0 ) : null;

			console.log(
				'legacy selectionchange',
				this,
				documentRange.cloneContents(),
				shadowRootRange ? shadowRootRange.cloneContents() : null
			);

			return;
		}

		/**
		 * @type {StaticRange[]}
		 */
		const [ composedRange ] = selection.getComposedRanges( this.#shadow );
		const range = document.createRange();

		range.setStart( composedRange.startContainer, composedRange.startOffset );
		range.setEnd( composedRange.endContainer, composedRange.endOffset );

		console.log(
			'selectionchange',
			this,
			documentRange.cloneContents(),
			composedRange,
			range.cloneContents()
		);
	}

	/**
	 * @param {MouseEvent} evt
	 */
	#logClickEvent( evt ) {
		const x = evt.clientX;
		const y = evt.clientY;
		const position = document.caretPositionFromPoint ? document.caretPositionFromPoint( x, y ) : document.caretRangeFromPoint( x, y );

		console.log( 'click', x, y, position );
	}
}
