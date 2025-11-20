/**
 * Shopify Pages Service
 *
 * Handles creating and managing Shopify Online Store pages via Admin API
 * Used for onboarding to create Ring Builder page and add to navigation
 */

import { authenticate } from "~/shopify.server";

type AdminApiContext = Awaited<ReturnType<typeof authenticate.admin>>["admin"];

interface CreatePageResult {
  success: boolean;
  pageId?: string;
  pageHandle?: string;
  pageUrl?: string;
  error?: string;
}

interface AddToMenuResult {
  success: boolean;
  menuItemId?: string;
  error?: string;
}

/**
 * Create a Ring Builder page in merchant's Shopify store
 */
export async function createBuilderPage(
  admin: AdminApiContext,
  options: {
    title?: string;
    handle?: string;
    shop: string;
  }
): Promise<CreatePageResult> {
  const title = options.title || "Design Your Ring";
  const handle = options.handle || "design-your-ring";

  const builderUrl = process.env.SHOPIFY_APP_URL || "https://your-app.com";
  const embedUrl = `${builderUrl}/builder?shop=${options.shop}`;

  const pageBody = `
<div class="ring-builder-container" style="width: 100%; max-width: 1400px; margin: 0 auto;">
  <iframe
    src="${embedUrl}"
    style="width: 100%; min-height: 800px; border: none; border-radius: 8px;"
    title="Ring Builder"
    id="ring-builder-iframe"
    scrolling="no"
  ></iframe>
</div>

<script>
  window.addEventListener('message', function(e) {
    if (e.data.type === 'ring-builder-resize') {
      const iframe = document.getElementById('ring-builder-iframe');
      if (iframe) {
        iframe.style.height = e.data.height + 'px';
      }
    }
  });
</script>
  `.trim();

  try {
    const response = await admin.graphql(
      `#graphql
      mutation createPage($input: PageCreateInput!) {
        pageCreate(page: $input) {
          page {
            id
            title
            handle
            onlineStoreUrl
          }
          userErrors {
            field
            message
          }
        }
      }`,
      {
        variables: {
          input: {
            title,
            handle,
            body: pageBody,
            isPublished: true,
          },
        },
      }
    );

    const data = await response.json();

    if (data.data?.pageCreate?.userErrors?.length > 0) {
      return {
        success: false,
        error: data.data.pageCreate.userErrors[0].message,
      };
    }

    const page = data.data?.pageCreate?.page;

    if (!page) {
      return {
        success: false,
        error: "Failed to create page",
      };
    }

    return {
      success: true,
      pageId: page.id,
      pageHandle: page.handle,
      pageUrl: page.onlineStoreUrl,
    };
  } catch (error: any) {
    console.error("Error creating page:", error);
    return {
      success: false,
      error: error.message || "Unknown error",
    };
  }
}

/**
 * Add Ring Builder page to navigation menu
 */
export async function addPageToMenu(
  admin: AdminApiContext,
  options: {
    menuHandle?: string;
    pageHandle: string;
    pageTitle: string;
  }
): Promise<AddToMenuResult> {
  const menuHandle = options.menuHandle || "main-menu";

  try {
    const menuResponse = await admin.graphql(
      `#graphql
      query getMenu($handle: String!) {
        menu(handle: $handle) {
          id
          handle
        }
      }`,
      {
        variables: {
          handle: menuHandle,
        },
      }
    );

    const menuData = await menuResponse.json();
    const menu = menuData.data?.menu;

    if (!menu) {
      return {
        success: false,
        error: `Menu with handle "${menuHandle}" not found`,
      };
    }

    const createResponse = await admin.graphql(
      `#graphql
      mutation menuItemAdd($menuId: ID!, $menuItem: MenuItemInput!) {
        menuItemAdd(menuId: $menuId, menuItem: $menuItem) {
          menuItem {
            id
            title
            url
          }
          userErrors {
            field
            message
          }
        }
      }`,
      {
        variables: {
          menuId: menu.id,
          menuItem: {
            title: options.pageTitle,
            url: `/pages/${options.pageHandle}`,
            type: "PAGE",
          },
        },
      }
    );

    const createData = await createResponse.json();

    if (createData.data?.menuItemAdd?.userErrors?.length > 0) {
      return {
        success: false,
        error: createData.data.menuItemAdd.userErrors[0].message,
      };
    }

    const menuItem = createData.data?.menuItemAdd?.menuItem;

    if (!menuItem) {
      return {
        success: false,
        error: "Failed to add menu item",
      };
    }

    return {
      success: true,
      menuItemId: menuItem.id,
    };
  } catch (error: any) {
    console.error("Error adding page to menu:", error);
    return {
      success: false,
      error: error.message || "Unknown error",
    };
  }
}

/**
 * Get existing pages to check if Ring Builder page already exists
 */
export async function getPages(admin: AdminApiContext) {
  try {
    const response = await admin.graphql(
      `#graphql
      query getPages {
        pages(first: 50) {
          edges {
            node {
              id
              title
              handle
              onlineStoreUrl
            }
          }
        }
      }`
    );

    const data = await response.json();
    const pages = data.data?.pages?.edges?.map((edge: any) => edge.node) || [];

    return {
      success: true,
      pages,
    };
  } catch (error: any) {
    console.error("Error getting pages:", error);
    return {
      success: false,
      pages: [],
      error: error.message || "Unknown error",
    };
  }
}

/**
 * Check if Ring Builder page exists
 */
export async function checkBuilderPageExists(
  admin: AdminApiContext,
  handle: string = "design-your-ring"
): Promise<boolean> {
  const result = await getPages(admin);

  if (!result.success) {
    return false;
  }

  return result.pages.some((page: any) => page.handle === handle);
}

/**
 * Delete a page by handle (for cleanup/testing)
 */
export async function deletePage(
  admin: AdminApiContext,
  pageId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await admin.graphql(
      `#graphql
      mutation deletePage($id: ID!) {
        pageDelete(id: $id) {
          deletedPageId
          userErrors {
            field
            message
          }
        }
      }`,
      {
        variables: {
          id: pageId,
        },
      }
    );

    const data = await response.json();

    if (data.data?.pageDelete?.userErrors?.length > 0) {
      return {
        success: false,
        error: data.data.pageDelete.userErrors[0].message,
      };
    }

    return {
      success: true,
    };
  } catch (error: any) {
    console.error("Error deleting page:", error);
    return {
      success: false,
      error: error.message || "Unknown error",
    };
  }
}
