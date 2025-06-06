import { bind } from 'astal';
import { Gtk } from 'astal/gtk3';
import { cpuService, gpuService, handleClick, ramService, storageService } from './helpers';
import { Binding } from 'astal';
import { renderResourceLabel } from 'src/components/bar/utils/systemResource';
import options from 'src/configuration';
import { isPrimaryClick } from 'src/lib/events/mouse';

const { enable_gpu } = options.menus.dashboard.stats;

const StatBar = ({ icon, value, label, stat }: StatBarProps): JSX.Element => {
    return (
        <box vertical>
            <box className={`stat ${stat}`} valign={Gtk.Align.CENTER} hexpand>
                <button>
                    <label className={'txt-icon'} label={icon} />
                </button>
                <button
                    onClick={(_, self) => {
                        if (isPrimaryClick(self)) {
                            handleClick();
                        }
                    }}
                >
                    <levelbar className={'stats-bar'} value={value} valign={Gtk.Align.CENTER} hexpand />
                </button>
            </box>
            <box halign={Gtk.Align.END}>
                <label className={`stat-value ${stat}`} label={label} />
            </box>
        </box>
    );
};

export const GpuStat = (): JSX.Element => {
    return (
        <box>
            {bind(enable_gpu).as((enabled) => {
                if (!enabled) {
                    return <box />;
                }

                gpuService.initialize();

                return (
                    <StatBar
                        icon={'󰢮'}
                        stat={'gpu'}
                        value={bind(gpuService.gpu)}
                        label={bind(gpuService.gpu).as((gpuUsage) => `${Math.floor(gpuUsage * 100)}%`)}
                    />
                );
            })}
        </box>
    );
};

export const CpuStat = (): JSX.Element => {
    cpuService.initialize();

    return (
        <StatBar
            icon={''}
            stat={'cpu'}
            value={bind(cpuService.cpu).as((cpuUsage) => Math.round(cpuUsage) / 100)}
            label={bind(cpuService.cpu).as((cpuUsage) => `${Math.round(cpuUsage)}%`)}
        />
    );
};

export const RamStat = (): JSX.Element => {
    ramService.initialize();

    return (
        <StatBar
            icon={''}
            stat={'ram'}
            value={bind(ramService.ram).as((ramUsage) => ramUsage.percentage / 100)}
            label={bind(ramService.ram).as(
                (ramUsage) => `${renderResourceLabel('used/total', ramUsage, true)}`,
            )}
        />
    );
};

export const StorageStat = (): JSX.Element => {
    storageService.initialize();

    return (
        <StatBar
            icon={'󰋊'}
            stat={'storage'}
            value={bind(storageService.storage).as((storageUsage) => storageUsage.percentage / 100)}
            label={bind(storageService.storage).as((storageUsage) =>
                renderResourceLabel('used/total', storageUsage, true),
            )}
        />
    );
};

interface StatBarProps {
    icon: string;
    stat: string;
    value: Binding<number> | number;
    label: Binding<string> | string;
}
