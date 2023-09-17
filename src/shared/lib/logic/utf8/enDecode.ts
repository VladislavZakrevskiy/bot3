export function encode_utf8(emoji: string) {
	const codeUnit1 = emoji.charCodeAt(0);
	const codeUnit2 = emoji.charCodeAt(1);
	const codePoint1 = codeUnit1.toString(16);
	const codePoint2 = codeUnit2.toString(16);
	const codePoint = codePoint1 + codePoint2;

	return codePoint;
}

// export function decode_utf8(emoji: string) {
// 	return decodeURIComponent(escape(s));
// }
