/**
 * Product Edit Page
 *
 * Edit ring setting or stone metadata.
 */

import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";
import { redirect , useLoaderData, useNavigate, useFetcher } from "react-router";
import { authenticate } from "~/shopify.server";
import prisma from "~/db.server";
import {
  SETTING_STYLES,
  SETTING_HEIGHTS,
  STONE_SHAPES,
  STONE_TYPES,
  CUT_GRADES,
  COLOR_GRADES,
  CLARITY_GRADES,
  CERTIFICATION_TYPES,
  METAL_TYPES,
  FLUORESCENCE_LEVELS,
  POLISH_GRADES,
  SYMMETRY_GRADES,
} from "~/utils/constants";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { admin, session } = await authenticate.admin(request);
  const { shop } = session;

  const productId = params.id;
  if (!productId) {
    throw new Response("Not Found", { status: 404 });
  }

  // Fetch product from Shopify
  const query = `
    query GetProduct($id: ID!) {
      product(id: $id) {
        id
        title
        description
        images(first: 1) {
          edges {
            node {
              url
            }
          }
        }
        variants(first: 1) {
          edges {
            node {
              price
              sku
            }
          }
        }
      }
    }
  `;

  const response = await admin.graphql(query, {
    variables: { id: productId },
  });

  const data = await response.json();
  const product = data.data?.product;

  if (!product) {
    throw new Response("Not Found", { status: 404 });
  }

  // Check for existing metadata
  const [setting, stone] = await Promise.all([
    prisma.settingMetadata.findFirst({ where: { productId, shop } }),
    prisma.stoneMetadata.findFirst({ where: { productId, shop } }),
  ]);

  return {
    product,
    builderType: setting ? "setting" : stone ? "stone" : null,
    metadata: setting || stone,
  };
}

export async function action({ request, params }: ActionFunctionArgs) {
  const { session } = await authenticate.admin(request);
  const productId = params.id;

  const formData = await request.formData();
  formData.append("type", formData.get("builderType") as string);

  // Submit to metadata API
  const response = await fetch(
    `${new URL(request.url).origin}/api/admin/products/${encodeURIComponent(productId!)}/metadata`,
    {
      method: "POST",
      body: formData,
    },
  );

  const result = await response.json();

  if (!response.ok) {
    return { error: result.error };
  }

  return redirect("/app/builder/products");
}

export default function ProductEditPage() {
  const { product, builderType, metadata } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  const image = product.images.edges[0]?.node.url;
  const variant = product.variants.edges[0]?.node;

  return (
    <div className="edit-page">
      <div className="page-header">
        <button onClick={() => navigate(-1)} className="back-button">
          ← Back
        </button>
        <h1>Edit Product Metadata</h1>
      </div>

      <div className="product-preview">
        {image && (
          <img src={image} alt={product.title} className="preview-image" />
        )}
        <div className="preview-info">
          <h2>{product.title}</h2>
          {variant && (
            <>
              <p className="price">${variant.price}</p>
              {variant.sku && <p className="sku">SKU: {variant.sku}</p>}
            </>
          )}
        </div>
      </div>

      {builderType === "setting" ? (
        <SettingMetadataForm metadata={metadata} />
      ) : builderType === "stone" ? (
        <StoneMetadataForm metadata={metadata} />
      ) : (
        <div className="no-metadata">
          <p>This product is not marked as a setting or stone.</p>
          <button onClick={() => navigate(-1)}>Go Back</button>
        </div>
      )}

      <style>{`
        .edit-page {
          max-width: 800px;
        }

        .page-header {
          margin-bottom: 24px;
        }

        .back-button {
          background: none;
          border: none;
          color: #2c6ecb;
          font-size: 14px;
          cursor: pointer;
          padding: 0;
          margin-bottom: 12px;
        }

        .back-button:hover {
          text-decoration: underline;
        }

        .page-header h1 {
          font-size: 24px;
          font-weight: 600;
          margin: 0;
          color: #202223;
        }

        .product-preview {
          background: white;
          border: 1px solid #e1e3e5;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 24px;
          display: flex;
          gap: 20px;
          align-items: center;
        }

        .preview-image {
          width: 100px;
          height: 100px;
          object-fit: cover;
          border-radius: 6px;
        }

        .preview-info h2 {
          font-size: 18px;
          font-weight: 600;
          margin: 0 0 8px;
        }

        .price {
          font-size: 20px;
          font-weight: 600;
          color: #202223;
          margin: 0 0 4px;
        }

        .sku {
          font-size: 14px;
          color: #6d7175;
          margin: 0;
        }

        .no-metadata {
          background: white;
          border: 1px solid #e1e3e5;
          border-radius: 8px;
          padding: 40px;
          text-align: center;
        }
      `}</style>
    </div>
  );
}

function SettingMetadataForm({ metadata }: { metadata: any }) {
  const fetcher = useFetcher();
  const isSaving = fetcher.state !== "idle";

  const basePrices = metadata?.basePrices
    ? JSON.parse(metadata.basePrices)
    : {};
  const compatibleShapes = metadata?.compatibleShapes
    ? JSON.parse(metadata.compatibleShapes)
    : [];

  return (
    <fetcher.Form method="post" className="metadata-form">
      <input type="hidden" name="builderType" value="setting" />

      <div className="form-section">
        <h3>Setting Details</h3>

        <div className="form-field">
          <label>Style *</label>
          <select
            name="style"
            defaultValue={metadata?.style || "solitaire"}
            required
          >
            {SETTING_STYLES.map((style) => (
              <option key={style.value} value={style.value}>
                {style.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label>Setting Height</label>
          <select
            name="settingHeight"
            defaultValue={metadata?.settingHeight || ""}
          >
            <option value="">Select height...</option>
            {SETTING_HEIGHTS.map((height) => (
              <option key={height.value} value={height.value}>
                {height.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label>Featured</label>
          <input
            type="checkbox"
            name="featured"
            defaultChecked={metadata?.featured || false}
          />
        </div>
      </div>

      <div className="form-section">
        <h3>Compatible Stone Shapes *</h3>
        <div className="checkbox-grid">
          {STONE_SHAPES.map((shape) => (
            <label key={shape.value} className="checkbox-label">
              <input
                type="checkbox"
                name="shapes"
                value={shape.value}
                defaultChecked={compatibleShapes.includes(shape.value)}
              />
              {shape.label}
            </label>
          ))}
        </div>
        <input
          type="hidden"
          name="compatibleShapes"
          value={JSON.stringify(
            Array.from(
              document.querySelectorAll('input[name="shapes"]:checked'),
            ).map((el: any) => el.value),
          )}
        />
      </div>

      <div className="form-section">
        <h3>Base Prices by Metal Type *</h3>
        {METAL_TYPES.map((metal) => (
          <div key={metal.value} className="form-field">
            <label>{metal.label}</label>
            <input
              type="number"
              name={`price_${metal.value}`}
              defaultValue={basePrices[metal.value] || 0}
              step="0.01"
              min="0"
              required
            />
          </div>
        ))}
        <input
          type="hidden"
          name="basePrices"
          value={JSON.stringify(
            METAL_TYPES.reduce(
              (acc, metal) => {
                const input = document.querySelector(
                  `input[name="price_${metal.value}"]`,
                ) as HTMLInputElement;
                acc[metal.value] = input?.value || 0;
                return acc;
              },
              {} as Record<string, any>,
            ),
          )}
        />
      </div>

      <div className="form-actions">
        <button type="submit" disabled={isSaving} className="button primary">
          {isSaving ? "Saving..." : "Save Setting"}
        </button>
      </div>

      <style>{`
        .metadata-form {
          background: white;
          border: 1px solid #e1e3e5;
          border-radius: 8px;
          padding: 24px;
        }

        .form-section {
          margin-bottom: 32px;
        }

        .form-section h3 {
          font-size: 18px;
          font-weight: 600;
          margin: 0 0 16px;
          color: #202223;
        }

        .form-field {
          margin-bottom: 16px;
        }

        .form-field label {
          display: block;
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 6px;
          color: #202223;
        }

        .form-field input,
        .form-field select,
        .form-field textarea {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #c9cccf;
          border-radius: 6px;
          font-size: 14px;
        }

        .form-field input[type="checkbox"] {
          width: auto;
        }

        .checkbox-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 12px;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
        }

        .form-actions {
          padding-top: 24px;
          border-top: 1px solid #e1e3e5;
        }

        .button {
          padding: 12px 24px;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
        }

        .button.primary {
          background: #2c6ecb;
          color: white;
        }

        .button.primary:hover:not(:disabled) {
          background: #1f5199;
        }

        .button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </fetcher.Form>
  );
}

function StoneMetadataForm({ metadata }: { metadata: any }) {
  const fetcher = useFetcher();
  const isSaving = fetcher.state !== "idle";

  return (
    <fetcher.Form method="post" className="metadata-form">
      <input type="hidden" name="builderType" value="stone" />

      <div className="form-section">
        <h3>Stone Details</h3>

        <div className="form-row">
          <div className="form-field">
            <label>Stone Type *</label>
            <select
              name="stoneType"
              defaultValue={metadata?.stoneType || "diamond"}
              required
            >
              {STONE_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label>Shape *</label>
            <select
              name="shape"
              defaultValue={metadata?.shape || "round"}
              required
            >
              {STONE_SHAPES.map((shape) => (
                <option key={shape.value} value={shape.value}>
                  {shape.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-field">
            <label>Carat *</label>
            <input
              type="number"
              name="carat"
              defaultValue={metadata?.carat || ""}
              step="0.01"
              min="0"
              required
            />
          </div>

          <div className="form-field">
            <label>Price *</label>
            <input
              type="number"
              name="price"
              defaultValue={metadata?.price || ""}
              step="0.01"
              min="0"
              required
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>4 Cs (Diamond Quality)</h3>

        <div className="form-row">
          <div className="form-field">
            <label>Cut</label>
            <select name="cut" defaultValue={metadata?.cut || ""}>
              <option value="">Select cut...</option>
              {CUT_GRADES.map((cut) => (
                <option key={cut.value} value={cut.value}>
                  {cut.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label>Color</label>
            <select name="color" defaultValue={metadata?.color || ""}>
              <option value="">Select color...</option>
              {COLOR_GRADES.map((color) => (
                <option key={color.value} value={color.value}>
                  {color.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label>Clarity</label>
            <select name="clarity" defaultValue={metadata?.clarity || ""}>
              <option value="">Select clarity...</option>
              {CLARITY_GRADES.map((clarity) => (
                <option key={clarity.value} value={clarity.value}>
                  {clarity.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Certification</h3>

        <div className="form-row">
          <div className="form-field">
            <label>Certificate Type</label>
            <select
              name="certificate"
              defaultValue={metadata?.certificate || ""}
            >
              <option value="">Select certificate...</option>
              {CERTIFICATION_TYPES.map((cert) => (
                <option key={cert.value} value={cert.value}>
                  {cert.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label>Certificate Number</label>
            <input
              type="text"
              name="certificateNumber"
              defaultValue={metadata?.certificateNumber || ""}
            />
          </div>
        </div>

        <div className="form-field">
          <label>Certificate URL</label>
          <input
            type="url"
            name="certificateUrl"
            defaultValue={metadata?.certificateUrl || ""}
            placeholder="https://..."
          />
        </div>
      </div>

      <div className="form-section">
        <h3>Additional Details (Optional)</h3>

        <div className="form-field">
          <label>Measurements</label>
          <input
            type="text"
            name="measurements"
            defaultValue={metadata?.measurements || ""}
            placeholder="7.35 x 7.40 x 4.50"
          />
        </div>

        <div className="form-row">
          <div className="form-field">
            <label>Table %</label>
            <input
              type="number"
              name="tablePercent"
              defaultValue={metadata?.tablePercent || ""}
              step="0.1"
              min="0"
              max="100"
            />
          </div>

          <div className="form-field">
            <label>Depth %</label>
            <input
              type="number"
              name="depthPercent"
              defaultValue={metadata?.depthPercent || ""}
              step="0.1"
              min="0"
              max="100"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-field">
            <label>Polish</label>
            <select name="polish" defaultValue={metadata?.polish || ""}>
              <option value="">Select polish...</option>
              {POLISH_GRADES.map((grade) => (
                <option key={grade.value} value={grade.value}>
                  {grade.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label>Symmetry</label>
            <select name="symmetry" defaultValue={metadata?.symmetry || ""}>
              <option value="">Select symmetry...</option>
              {SYMMETRY_GRADES.map((grade) => (
                <option key={grade.value} value={grade.value}>
                  {grade.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label>Fluorescence</label>
            <select
              name="fluorescence"
              defaultValue={metadata?.fluorescence || ""}
            >
              <option value="">Select fluorescence...</option>
              {FLUORESCENCE_LEVELS.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-field">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="available"
              defaultChecked={metadata?.available !== false}
            />
            Available for sale
          </label>
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" disabled={isSaving} className="button primary">
          {isSaving ? "Saving..." : "Save Stone"}
        </button>
      </div>

      <style>{`
        .form-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 16px;
        }
      `}</style>
    </fetcher.Form>
  );
}
