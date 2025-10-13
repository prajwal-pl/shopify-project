/**
 * Ring Builder Dashboard
 *
 * Overview page for Ring Builder admin.
 */

import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData, Link } from "react-router";
import { authenticate } from "~/shopify.server";
import prisma from "~/db.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const { session } = await authenticate.admin(request);
  const { shop } = session;

  // Get counts for dashboard
  const [settingsCount, stonesCount, configurationsCount] = await Promise.all([
    prisma.settingMetadata.count({ where: { shop } }),
    prisma.stoneMetadata.count({ where: { shop } }),
    prisma.configuration.count({ where: { shop } }),
  ]);

  return {
    settingsCount,
    stonesCount,
    configurationsCount,
  };
}

export default function BuilderDashboard() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Ring Builder Dashboard</h1>
        <p>Manage your custom ring builder settings and products</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">⚙️</div>
          <div className="stat-content">
            <div className="stat-value">{data.settingsCount}</div>
            <div className="stat-label">Ring Settings</div>
          </div>
          <Link to="/app/builder/products" className="stat-link">
            Manage Settings →
          </Link>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💎</div>
          <div className="stat-content">
            <div className="stat-value">{data.stonesCount}</div>
            <div className="stat-label">Stones</div>
          </div>
          <Link to="/app/builder/products" className="stat-link">
            Manage Stones →
          </Link>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💍</div>
          <div className="stat-content">
            <div className="stat-value">{data.configurationsCount}</div>
            <div className="stat-label">Configurations</div>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <Link to="/app/builder/products" className="action-card">
            <div className="action-icon">📦</div>
            <div className="action-title">Manage Products</div>
            <div className="action-desc">
              Mark products as settings or stones and add metadata
            </div>
          </Link>

          <Link to="/app/builder/settings" className="action-card">
            <div className="action-icon">⚙️</div>
            <div className="action-title">Builder Settings</div>
            <div className="action-desc">
              Configure pricing, side stones, and builder options
            </div>
          </Link>
        </div>
      </div>

      <style>{`
        .dashboard {
          max-width: 1200px;
        }

        .dashboard-header {
          margin-bottom: 32px;
        }

        .dashboard-header h1 {
          font-size: 28px;
          font-weight: 600;
          margin: 0 0 8px;
          color: #202223;
        }

        .dashboard-header p {
          font-size: 14px;
          color: #6d7175;
          margin: 0;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }

        .stat-card {
          background: white;
          border: 1px solid #e1e3e5;
          border-radius: 8px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .stat-icon {
          font-size: 32px;
        }

        .stat-content {
          flex: 1;
        }

        .stat-value {
          font-size: 36px;
          font-weight: 600;
          color: #202223;
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 14px;
          color: #6d7175;
        }

        .stat-link {
          font-size: 14px;
          color: #2c6ecb;
          text-decoration: none;
          font-weight: 500;
        }

        .stat-link:hover {
          text-decoration: underline;
        }

        .quick-actions h2 {
          font-size: 20px;
          font-weight: 600;
          margin: 0 0 20px;
          color: #202223;
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }

        .action-card {
          background: white;
          border: 1px solid #e1e3e5;
          border-radius: 8px;
          padding: 24px;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .action-card:hover {
          border-color: #2c6ecb;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .action-icon {
          font-size: 32px;
          margin-bottom: 12px;
        }

        .action-title {
          font-size: 16px;
          font-weight: 600;
          color: #202223;
          margin-bottom: 8px;
        }

        .action-desc {
          font-size: 14px;
          color: #6d7175;
          line-height: 1.5;
        }

        @media (max-width: 768px) {
          .stats-grid,
          .actions-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
