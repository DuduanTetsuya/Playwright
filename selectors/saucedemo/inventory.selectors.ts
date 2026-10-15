export const InventorySelectors = {
    title: '.title',
    inventoryItem: '.inventory_item',
    itemName: '.inventory_item_name',
    itemPrice: '.inventory_item_price',
    itemDescription: '.inventory_item_desc',
    addToCartButton: (itemName: string) => `[data-test="add-to-cart-${itemName}"]`,
    removeFromCartButton: (itemName: string) => `[data-test="remove-${itemName}"]`,
    productLink: '.inventory_item_name',
    shoppingCartBadge: '.shopping_cart_badge',
    shoppingCartLink: '.shopping_cart_link',
    sortDropdown: '[data-test="product-sort-container"]',
    menuButton: '#react-burger-menu-btn',
    logoutLink: '[data-test="logout-sidebar-link"]',
    resetAppStateLink: '[data-test="reset-sidebar-link"]'
};
