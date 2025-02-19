import { AdminProvider, useUser } from "shared/hooks";
import React from "react";
import { AdminTokensComponent, AdminActionsComponent } from "./components";
import { AdminThirdPartComponent } from "modules/admin/components/third-party/third-party.component";

export const AdminComponent = () => {
  const { user } = useUser();

  if (!user || !user?.admin) return null;

  return (
    <AdminProvider>
      <div>
        <h2>Admin</h2>
        <hr />
        <AdminTokensComponent />
        <hr />
        <AdminThirdPartComponent />
        <hr />
        <AdminActionsComponent />
      </div>
    </AdminProvider>
  );
};
