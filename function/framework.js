function updateBreadcrumb(items) {
	const bc = document.getElementById('breadcrumb');
	if (items.length === 0) {
		bc.innerHTML = '';
		return;
	}
	const parts = [];
	items.forEach((item, i) => {
		if (i > 0) {
			parts.push('<span class="separator">/</span>');
		}
		if (item.href) {
			parts.push(`<a href="${item.href}" class="breadcrumb-item">${item.text}</a>`);
		} else {
			parts.push(`<span class="breadcrumb-item" style="color:var(--text-color)">${item.text}</span>`);
		}
	});
	bc.innerHTML = parts.join('');
}
document.addEventListener('DOMContentLoaded', () => {
	parseRoute();
	window.addEventListener('popstate', parseRoute);
	const menuToggle = document.getElementById('menuToggle');
	const sidebar = document.getElementById('sidebar');
	const overlay = document.getElementById('sidebarOverlay');
	menuToggle?.addEventListener('click', () => {
		sidebar.classList.toggle('expanded');
		overlay.classList.toggle('active');
		if (overlay.classList.contains('active')) document.body.style.overflow = 'hidden';
		else document.body.style.overflow = '';
	});
	overlay?.addEventListener('click', () => {
		sidebar.classList.remove('expanded');
		overlay.classList.remove('active');
		document.body.style.overflow = '';
	});
});
