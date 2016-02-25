define(['chai', 'chai-jquery', 'sinon-chai'], function(chai, chaiJquery, sinonChai) {
  chai.use(chaiJquery);

  chai.use(sinonChai);
  return chai;
});
