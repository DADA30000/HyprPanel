import { bind, GLib } from 'astal';
import { Gtk } from 'astal/gtk3';
import options from 'src/configuration';
import { normalizeToAbsolutePath } from 'src/lib/path/helpers';
import { isAnImage } from 'src/lib/validation/images';

const { image, name } = options.menus.dashboard.powermenu.avatar;

const ProfilePicture = (): JSX.Element => {
    return (
        <box
            className={'profile-picture'}
            halign={Gtk.Align.CENTER}
            css={bind(image).as((img) => {
                if (isAnImage(img)) {
                    return `background-image: url("${normalizeToAbsolutePath(img)}")`;
                }

                return `background-image: url("${SRC_DIR}/assets/hyprpanel.png")`;
            })}
        />
    );
};

const ProfileName = (): JSX.Element => {
    return (
        <label
            className={'profile-name'}
            halign={Gtk.Align.CENTER}
            label={bind(name).as((profileName) => {
                if (profileName === 'system') {
                    const username = GLib.get_user_name();
                    return username;
                }
                return profileName;
            })}
        />
    );
};

export const UserProfile = (): JSX.Element => {
    return (
        <box className={'profile-picture-container dashboard-card'} hexpand vertical>
            <ProfilePicture />
            <ProfileName />
        </box>
    );
};
