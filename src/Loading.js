import Progress from 'inferno-bootstrap/dist/Progress';

export default function Loading({ loading, children }) {
  return (
    loading ?
      <div className="row">
        <div className="col-12">
          <Progress animated bar value={100} />
        </div>
      </div> :
      children
  );
}