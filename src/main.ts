import {App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting} from 'obsidian';

interface MyPluginSettings {
	default_template: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	default_template: ''
}

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();

		this.registerEvent(this.app.vault.on('create', (file) => {
			if ('extension' in file) {
				if (file.stat.ctime == file.stat.mtime &&
					file.stat.size == 0 &&
					file.extension == 'md' &&
					file.deleted == false &&
					this.settings.default_template.length > 0) {
					app.vault.adapter.write(file.path, this.settings.default_template)
				}
			}
		}));

		this.addSettingTab(new SampleSettingTab(this.app, this));

	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;
		containerEl.empty();
		containerEl.createEl('h2', {text: 'Settings'});
		new Setting(containerEl)
			.setName('Default template')
			.setDesc('Template for every new md file')
			.addTextArea(text => {
				text.inputEl.setAttr('rows', 20)
				text.inputEl.setAttr('cols', 70)
				text.setPlaceholder('Enter your markdown')
					.setValue(this.plugin.settings.default_template)
					.onChange(async (value) => {
						this.plugin.settings.default_template = value;
						await this.plugin.saveSettings();
					})
			});
	}
}
