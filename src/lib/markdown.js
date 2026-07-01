/**
 * Очень маленький и безопасный конвертер «облегчённого markdown» в HTML.
 * Контент пишем мы сами (доверенный), но мы всё равно экранируем HTML,
 * чтобы код в примерах не ломал разметку.
 *
 * Поддерживается:
 *   **жирный**            → <strong>
 *   *курсив*              → <em>
 *   `код`                 → <code> (а если слово есть в глоссарии — кликабельный термин)
 *   \`                    → литеральный символ обратной кавычки (экранирование)
 *   [текст](ссылка)       → <a>
 *   - пункт / * пункт     → маркированный список
 *   1. пункт              → нумерованный список
 *   ```...```             → блок кода
 *   пустая строка         → новый абзац
 */

/** @type {Record<string, string>} */
const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

/** @param {string} s */
function escapeHtml(s) {
	return s.replace(/[&<>"']/g, (c) => ESC[c]);
}

// Технический маркер (приватная область Unicode) для экранированного бэктика,
// и сам символ обратной кавычки — через коды, чтобы не путаться в исходнике.
const BT_MARKER = String.fromCharCode(0xe000);
const BACKTICK = String.fromCharCode(96);
// Маркер вокруг индекса код-вставки. Уникальный символ (приватная область
// Unicode), чтобы плейсхолдер не совпадал с обычными числами в тексте.
const CODE_MARKER = String.fromCharCode(0xe001);

/**
 * Нормализуем содержимое `код`-спана к ключу глоссария:
 * `print()` → print, `.append()` → append, `f-строка` → f-строка.
 * @param {string} raw
 */
function glossaryKey(raw) {
	return raw.trim().replace(/^\./, '').replace(/\(.*\)$/, '').trim();
}

/**
 * Форматирование внутри строки (жирный/курсив/код/ссылки).
 * @param {string} text   уже НЕэкранированный исходный текст
 * @param {Set<string>} glossaryKeys
 */
function inline(text, glossaryKeys) {
	// 0) Экранированный бэктик \` — это сам символ, а не начало `кода`.
	//    Прячем под маркер, вернём литералом в самом конце.
	let src = String(text ?? '').replace(/\\`/g, BT_MARKER);

	// 1) Вырезаем `код`-спаны во временные плейсхолдеры, чтобы внутри них
	//    не срабатывали ** и * (звёздочки в коде — это умножение, не курсив).
	/** @type {string[]} */
	const codes = [];
	let s = src.replace(/`([^`]+)`/g, (/** @type {string} */ _, /** @type {string} */ code) => {
		const key = glossaryKey(code);
		let html;
		if (glossaryKeys && glossaryKeys.has(key)) {
			html = `<button type="button" class="gl-term" data-term="${escapeHtml(key)}">${escapeHtml(code)}</button>`;
		} else {
			html = `<code>${escapeHtml(code)}</code>`;
		}
		codes.push(html);
		return `${CODE_MARKER}${codes.length - 1}${CODE_MARKER}`;
	});

	s = escapeHtml(s);
	s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
	s = s.replace(/\*([^*]+)\*/g, '<em>$1</em>');
	s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, t, href) => {
		const safe = /^https?:\/\//.test(href) ? href : '#';
		return `<a href="${escapeHtml(safe)}" target="_blank" rel="noopener">${t}</a>`;
	});

	// Возвращаем код-спаны на место по уникальному маркеру (чтобы не цеплять
	// обычные числа в тексте, например «4 пробела»).
	s = s.replace(new RegExp(CODE_MARKER + '(\\d+)' + CODE_MARKER, 'g'), (_, i) => codes[Number(i)]);
	// Не отрываем знак препинания от код-чипа при переносе строки (чтобы точка
	// после `except` не «убегала» одна на новую строку).
	s = s.replace(
		/(<(?:code|button)[^>]*>[^<]*<\/(?:code|button)>)([.,:;!?)]+)/g,
		'<span class="nowrap-punct">$1$2</span>'
	);
	// Экранированный бэктик возвращаем как обычный видимый символ.
	s = s.split(BT_MARKER).join(BACKTICK);
	return s;
}

/**
 * Конвертирует строку «облегчённого markdown» в HTML.
 * @param {string} md
 * @param {Set<string>} [glossaryKeys]  ключи глоссария для подсветки терминов
 * @returns {string}
 */
export function renderMarkdown(md, glossaryKeys = new Set()) {
	const lines = String(md ?? '').replace(/\r\n/g, '\n').split('\n');
	const out = [];
	let i = 0;

	while (i < lines.length) {
		const line = lines[i];

		if (line.trim() === '') {
			i++;
			continue;
		}

		// Блок кода в тройных кавычках ```
		if (/^\s*```/.test(line)) {
			i++; // пропускаем открывающую ограду
			const codeLines = [];
			while (i < lines.length && !/^\s*```/.test(lines[i])) {
				codeLines.push(lines[i]);
				i++;
			}
			i++; // пропускаем закрывающую ограду
			out.push(`<pre class="md-code">${escapeHtml(codeLines.join('\n'))}</pre>`);
			continue;
		}

		// Маркированный список
		if (/^\s*[-*]\s+/.test(line)) {
			const items = [];
			while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
				items.push(`<li>${inline(lines[i].replace(/^\s*[-*]\s+/, ''), glossaryKeys)}</li>`);
				i++;
			}
			out.push(`<ul>${items.join('')}</ul>`);
			continue;
		}

		// Нумерованный список
		if (/^\s*\d+\.\s+/.test(line)) {
			const items = [];
			while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
				items.push(`<li>${inline(lines[i].replace(/^\s*\d+\.\s+/, ''), glossaryKeys)}</li>`);
				i++;
			}
			out.push(`<ol>${items.join('')}</ol>`);
			continue;
		}

		// Абзац (собираем подряд идущие непустые строки). Прерываемся на пустой
		// строке, на пунктах списка И на ограде блока кода ``` — иначе абзац
		// «проглотит» код и бэктики отрисуются как мусор.
		const para = [];
		while (
			i < lines.length &&
			lines[i].trim() !== '' &&
			!/^\s*([-*]|\d+\.)\s+/.test(lines[i]) &&
			!/^\s*```/.test(lines[i])
		) {
			para.push(lines[i]);
			i++;
		}
		out.push(`<p>${inline(para.join(' '), glossaryKeys)}</p>`);
	}

	return out.join('\n');
}

/**
 * Только строчное форматирование (жирный/курсив/код/ссылки/термины), без абзацев
 * и блоков. Для коротких мест: варианты квиза, пояснения.
 * @param {string} text
 * @param {Set<string>} [glossaryKeys]
 * @returns {string}
 */
export function renderInline(text, glossaryKeys = new Set()) {
	return inline(String(text ?? ''), glossaryKeys);
}
