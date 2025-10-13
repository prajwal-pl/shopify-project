/**
 * Ring Builder Admin Layout
 *
 * Layout route for Ring Builder admin pages with navigation.
 */

import { Outlet, useLocation, Link } from "react-router";

export default function BuilderLayout() {
  const location = useLocation();

  // Navigation items for Ring Builder admin
  const navItems = [
    { path: "/app/builder", label: "Dashboard", end: true },
    { path: "/app/builder/products", label: "Products" },
    { path: "/app/builder/settings", label: "Settings" },
    { path: "/app/builder/preview", label: "👁️ Preview Builder" },
  ];

  return (
    <div className="ring-builder-admin">
      {/* Navigation */}
      <nav className="builder-nav">
        <div className="nav-header">
          <h1>💍 Ring Builder</h1>
        </div>
        <ul className="nav-menu">
          {navItems.map((item) => {
            const isActive = item.end
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path);

            return (
              <li key={item.path} className={isActive ? "active" : ""}>
                <Link to={item.path}>{item.label}</Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Main Content */}
      <main className="builder-content">
        <Outlet />
      </main>

      <style>{`
        .ring-builder-admin {
          display: flex;
          min-height: 100vh;
          background: #f6f6f7;
        }

        .builder-nav {
          width: 240px;
          background: white;
          border-right: 1px solid #e1e3e5;
          padding: 20px 0;
        }

        .nav-header {
          padding: 0 20px 20px;
          border-bottom: 1px solid #e1e3e5;
        }

        .nav-header h1 {
          font-size: 20px;
          font-weight: 600;
          margin: 0;
          color: #202223;
        }

        .nav-menu {
          list-style: none;
          padding: 16px 0 0;
          margin: 0;
        }

        .nav-menu li {
          margin: 0;
        }

        .nav-menu a {
          display: block;
          padding: 12px 20px;
          color: #202223;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          transition: background-color 0.15s ease;
        }

        .nav-menu a:hover {
          background-color: #f6f6f7;
        }

        .nav-menu li.active a {
          background-color: #f1f2f4;
          color: #2c6ecb;
          border-left: 3px solid #2c6ecb;
          padding-left: 17px;
        }

        .builder-content {
          flex: 1;
          padding: 32px;
          max-width: 1280px;
        }

        @media (max-width: 768px) {
          .ring-builder-admin {
            flex-direction: column;
          }

          .builder-nav {
            width: 100%;
            border-right: none;
            border-bottom: 1px solid #e1e3e5;
          }

          .nav-menu {
            display: flex;
            flex-wrap: wrap;
          }

          .nav-menu li {
            flex: 1;
            min-width: 100px;
          }

          .builder-content {
            padding: 16px;
          }
        }
      `}</style>
    </div>
  );
}
