export class MenuModel {
    label: string;
    icon: string;
    routerLink: string;
    items: MenuModel[];

    menuId: string;
    menuParentId: string;
    isMenuParent: boolean;
}
