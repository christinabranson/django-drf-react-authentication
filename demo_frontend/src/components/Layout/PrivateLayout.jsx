
import React from "react";

export const PrivateLayout = ({ children, ...rest }) => (
    <div className="card">
        {children}
        <div className="card-footer text-muted">
            This is a private layout.
        </div>
    </div>
);

export default PrivateLayout;