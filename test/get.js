const chai = require('chai');
const chaiHttp = require('chai-http');
const { app: servidor } = require('../index');

chai.use(chaiHttp);

describe('respuesta GET servidor animes', () => {
    it('Verificar respuesta codigo 200 metodo GET', (done) => {
        chai.request(servidor).get('/animes').end((err, res) => {
            chai.expect(res).to.have.status(200);
            done();
        });
    });
});