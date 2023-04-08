import { Icon } from '@visurel/iconify-angular';

export interface MenuItems {
    type: 'link';
    id?: 'all' | 'Active' | 'Inactive';
    icon?: Icon;
    label: string;
    value?: number;
    class?: {
        icon?: string;
    };
    size?: string;
}