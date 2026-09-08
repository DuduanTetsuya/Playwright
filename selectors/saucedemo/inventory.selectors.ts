export const InventorySelectors = {
    title: '.title',
    inventoryItem: '.inventory_item',
    itemName: '.inventory_item_name',
    itemPrice: '.inventory_item_price',
    addToCartButton: (itemName: string) => `[data-test="add-to-cart-${itemName}"]`,
    removeFromCartButton: (itemName: string) => `[data-test="remove-${itemName}"]`,
    shoppingCartBadge: '.shopping_cart_badge',
    shoppingCartLink: '.shopping_cart_link',
    sortDropdown: '[data-test="product-sort-container"]'
};
