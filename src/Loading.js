export default function Loading({ loading, children }) {
  return (
    loading ?
      <div className="row">
        <div className="col-12">
          <div className="progress">
            <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{ width: '100%' }} ></div>
          </div>
        </div>
      </div>
      : children
  );
}