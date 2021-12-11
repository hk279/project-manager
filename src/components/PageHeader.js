const PageHeader = ({ title, actions }) => {
    return (
        <div className="view-header">
            <h2 className="view-title">{title}</h2>
            {actions && <div className="view-action-buttons-container">{actions}</div>}
        </div>
    );
};

export default PageHeader;
