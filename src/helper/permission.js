export const permission = (permissions, menu_type, option='access') => {
    const permission = permissions?.findIndex((item, index) => item.menu_item == menu_type);

    if(permission == -1)
        return false;


    if(option == 'access')
        return permissions[permission].access;

    if(option == 'create')
        return permissions[permission].create;

    if(option == 'read')
        return permissions[permission].read;

    if(option == 'update')
        return permissions[permission].update;

    if(option == 'delete')
        return permissions[permission].delete;

}