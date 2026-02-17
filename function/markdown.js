const customExtensions = [
	{
		name: 'alignBlock',
		level: 'block',
		start(src) { return src.match(/^:::\s*align\s*\{([^}]+)\}/)?.index; },
		tokenizer(src, tokens) {
			const match = src.match(/^:::\s*align\s*\{([^}]+)\}([\s\S]*?)\n:::/);
			if (match) {
				return {
					type: 'alignBlock',
					raw: match[0],
					align: match[1].trim(),
					content: match[2].trim()
				};
			}
		},
		renderer(token) {
			return `<div class="align-${token.align}">${marked.parse(token.content)}</div>`;
		}
	},
	{
		name: 'epigraph',
		level: 'block',
		start(src) { return src.match(/^:::\s*epigraph(\[([^\]]+)\])?\s*:::/)?.index; },
		tokenizer(src, tokens) {
			const match = src.match(/^:::\s*epigraph(\[([^\]]+)\])?\s*([\s\S]*?)\s*:::/);
			if (match) {
				return {
					type: 'epigraph',
					raw: match[0],
					author: match[2] || '',
					content: match[3].trim()
				};
			}
		},
		renderer(token) {
			const authorPart = `<p>${token.author ? token.author : 'unknown author'}</p>`;
			return `<div class="epigraph">${marked.parse(token.content)}${authorPart}</div>`;
		}
	},
	{
		name: 'foldable',
		level: 'block',
		start(src) { return src.match(/^:{3,}/)?.index; },
		tokenizer(src, tokens) {
			const match = src.match(/^(:{3,})\s*(\w+)?(\[([^\]]+)\])?(\s*\{([^}]+)\})?\s*([\s\S]*?)\s*\1/);
			if (match && (match[2] === 'info' || match[2] === 'warning' || match[2] === 'success' || match[2] === 'error' || match[2] === 'bug' || match[2] === 'flask')) {
				return {
					type: 'foldable',
					raw: match[0],
					foldType: match[2] || 'info',
					title: match[4] || '',
					options: match[6] || '',
					content: match[7].trim()
				};
			}
		},
		renderer(token) {
			const isOpen = token.options.includes('open');
			return `
						<details class="foldable ${token.foldType}" ${isOpen ? 'open' : ''}>
							<summary>${token.title || '点击展开'}</summary>
							${marked.parse(token.content)}
						</details>
					`;
		}
	}
];
marked.use({ extensions: customExtensions });
const renderer = new marked.Renderer();
renderer.code = function (code, language) {
	const lang = language || 'plaintext';
	let highlighted = code;
	if (language && hljs.getLanguage(lang)) {
		try {
			highlighted = hljs.highlight(code, { language: lang, ignoreIllegals: true }).value;
		} catch (e) { }
	}
	return `<div class="code-container"><pre><code class="language-${lang}">${highlighted}</code></pre></div>`;
};
marked.setOptions({
	breaks: false,
	gfm: true,
	mangle: false,
	headerIds: false,
	renderer: renderer,
});
function renderMarkdown(text) {
	const tmp = document.createElement('div');
	tmp.innerHTML = marked.parse(text);
	renderMathInElement(tmp, {
		delimiters: [
			{ left: '$$', right: '$$', display: true },
			{ left: '$', right: '$', display: false },
			{ left: '\(', right: '\)', display: false },
			{ left: '\[', right: '\]', display: true }
		]
	});
	return tmp.innerHTML;
}
