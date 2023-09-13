/**
 *
 * @param {Event} evt
 */
export default function logEvent( evt ) {
	evt.stopImmediatePropagation();

	switch ( evt.type ) {
		case 'beforeinput':
			return logBeforeInputEvent( evt );
		case 'click':
			return logClickEvent( evt );
		default:
			return console.log( evt.type, evt );
	}
}

/**
 * @param {MouseEvent} evt
 */
function logClickEvent( evt ) {
	if ( !document.querySelector( '#click' ).checked ) {
		return;
	}

	const x = evt.clientX;
	const y = evt.clientY;
	const position = document.caretPositionFromPoint ? document.caretPositionFromPoint( x, y ) : document.caretRangeFromPoint( x, y );

	console.log( 'click', x, y, position );
}

// Stolen from CKE5.
function logBeforeInputEvent( evt ) {
	if ( !document.querySelector( '#beforeinput' ).checked ) {
		return;
	}

	console.group( `%c${ evt.type }`, 'color:red' );

	if ( 'inputType' in evt ) {
		console.log( `%cinput type:%c "${ evt.inputType }"`, 'font-weight: bold', 'font-weight: default; color: blue' );
	}

	if ( 'isComposing' in evt ) {
		console.log( `%cisComposing:%c ${ evt.isComposing }`, 'font-weight: bold', 'font-weight: default; color: green' );
	}

	if ( 'data' in evt ) {
		console.log( `%cdata:%c "${ evt.data }"`, 'font-weight: bold', 'font-weight: default; color: blue' );
	}

	if ( 'dataTransfer' in evt && evt.dataTransfer ) {
		const data = evt.dataTransfer.getData( 'text/plain' );

		console.log( `%cdataTransfer:%c "${ data }"`, 'font-weight: bold', 'font-weight: default; color: blue' );
	}

	if ( 'keyCode' in evt ) {
		console.log( `%ckeyCode:%c ${ evt.keyCode }`, 'font-weight: bold', 'font-weight: default; color: green' );
	}

	if ( 'key' in evt ) {
		console.log( `%ckey:%c "${ evt.key }"`, 'font-weight: bold', 'font-weight: default; color: blue' );
	}

	logTargetRanges( evt );
	logSelection();

	console.groupEnd();
}

function logTargetRanges( evt ) {
	if ( evt.getTargetRanges ) {
		console.group( '%cevent target ranges:', 'font-weight: bold' );
		logRanges( evt.getTargetRanges() );
		console.groupEnd();
	}
}

function logSelection() {
	const selection = document.getSelection();
	const ranges = [];

	for ( let i = 0; i < selection.rangeCount; i++ ) {
		ranges.push( selection.getRangeAt( i ) );
	}

	console.group( '%cselection:', 'font-weight: bold' );
	logRanges( ranges );
	console.groupEnd();
}

function logRanges( ranges ) {
	if ( !ranges || !ranges.length ) {
		console.log( '  %cno ranges', 'font-style: italic' );
	} else {
		for ( const range of ranges ) {
			console.log( '  start:', range.startContainer,
				`${ range.startOffset } / ${
					range.startContainer.nodeType == 3 ?
						range.startContainer.data.length :
						range.startContainer.childNodes.length
				}`
			);
			console.log( '  end:', range.endContainer,
				`${ range.endOffset } / ${
					range.endContainer.nodeType == 3 ?
						range.endContainer.data.length :
						range.endContainer.childNodes.length
				}`
			);
		}
	}
}
