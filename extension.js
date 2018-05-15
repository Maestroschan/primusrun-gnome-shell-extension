const Main = imports.ui.main;
const AppDisplay = imports.ui.appDisplay;
const GLib = imports.gi.GLib;
const Lang = imports.lang;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Convenience = Me.imports.convenience;

const Gettext = imports.gettext.domain('primusrun');
const _ = Gettext.gettext;

let origins = [];

function inject_fun(parent, name, fun) {
	let origin = parent[name];
	origins[name] = origin;
	parent[name] = function() {
		let origin_ret = origin.apply(this, arguments);
		if (origin_ret !== undefined) return origin_ret;
		return fun.apply(this, arguments);
	}
}

function remove_fun(parent, name) {
	parent[name] = origins[name];
}


function init() {
	Convenience.initTranslations();
}

function enable() {
	inject_fun(AppDisplay.AppIconMenu.prototype, "_redisplay",  function() {
		this._appendSeparator();
		this._appendMenuItem(_("Launch with primusrun")).connect("activate", Lang.bind(this, function() {
			GLib.spawn_command_line_async(
				"primusrun " +
				this._source.app.get_app_info().get_commandline()
			);
		}));
	});
}

function disable() {
	remove_fun(AppDisplay.AppIconMenu.prototype, "_redisplay");
}



