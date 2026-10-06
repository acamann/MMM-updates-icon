/* MMM-updates-icon
 * MagicMirror² module — a yellow exclamation button pinned to the bottom of
 * the left nav panel whenever `updatenotification` reports outdated modules.
 * Tapping the button toggles a popover listing the outdated modules.
 */

// eslint-disable-next-line no-undef
Module.register('MMM-updates-icon', {
	defaults: {
		animationSpeed: 0
	},

	start() {
		this.outdated = [];
		this.popoverOpen = false;
	},

	notificationReceived(notification, payload) {
		if (notification === 'UPDATES' && Array.isArray(payload)) {
			this.outdated = payload;
			this.updateDom(this.config.animationSpeed);
		}
	},

	getStyles() {
		return ['MMM-updates-icon.css'];
	},

	getDom() {
		const wrapper = document.createElement('div');
		wrapper.className = 'updates-icon';

		if (!Array.isArray(this.outdated) || this.outdated.length === 0) {
			return wrapper;
		}

		const button = document.createElement('div');
		button.className = 'updates-icon-button';
		button.setAttribute('role', 'button');
		button.title = `${this.outdated.length} module update(s) available`;
		const icon = document.createElement('i');
		icon.className = 'fas fa-rotate';
		button.append(icon);
		button.addEventListener('click', () => {
			this.popoverOpen = !this.popoverOpen;
			this.updateDom(this.config.animationSpeed);
		});
		wrapper.append(button);

		if (this.popoverOpen) {
			const popover = document.createElement('div');
			popover.className = 'updates-icon-popover';

			const title = document.createElement('h3');
			title.className = 'updates-icon-popover-title';
			title.textContent = `Updates available (${this.outdated.length})`;
			popover.append(title);

			const list = document.createElement('ul');
			list.className = 'updates-icon-popover-list';
			this.outdated.forEach(info => {
				const item = document.createElement('li');
				const commits = info.behind === 1 ? '1 commit' : `${info.behind} commits`;
				item.textContent = `${info.module}: ${commits} behind ${info.tracking || info.current}`;
				list.append(item);
			});
			popover.append(list);

			wrapper.append(popover);
		}

		return wrapper;
	}
});
