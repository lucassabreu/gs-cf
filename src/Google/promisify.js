export default (gp) => new Promise((f, r) => gp.then(f, r))
