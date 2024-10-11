import pactum from 'pactum';
import { StatusCodes } from 'http-status-codes';
import { SimpleReporter } from '../simple-reporter';


describe('Gestão de mercado', () => {
  const p = pactum;
  const rep = SimpleReporter;
  const baseUrl = 'https://api-desafio-qa.onrender.com';
  let marketId = '';
 

  p.request.setDefaultTimeout(50000);

  beforeAll(() => p.reporter.add(rep));
  afterAll(() => p.reporter.end());

  describe('Market', () => {
    it('Cadastrando mercado sem seu cnpj obrigatório', async () => {
      const responseMarket = await p
        .spec()
        .post(`${baseUrl}/mercado`)
        .withJson({
          nome: 'Papeluche',
          endereco: 'Caxias do Sul'
        })
        .expectStatus(StatusCodes.BAD_REQUEST);

    });

    it('Cadastrando mercado sem seu nome obrigatório', async () => {
      const responseMarket = await p
        .spec()
        .post(`${baseUrl}/mercado`)
        .withJson({
          cnpj: '47555103000181',
          endereco: 'Rua Caxias do Sul'
        })
        .expectStatus(StatusCodes.BAD_REQUEST);


    });

    it('Cadastrando mercado sem seu endereço obrigatório', async () => {
      const responseMarket = await p
        .spec()
        .post(`${baseUrl}/mercado`)
        .withJson({
          nome: 'Papeluche',
          cnpj: '47555103000181',
        })
        .expectStatus(StatusCodes.BAD_REQUEST);


    });

    it('Cadastrando mercado com cnpj excedendo os números válidos', async () => {
      const responseMarket = await p
        .spec()
        .post(`${baseUrl}/mercado`)
        .withJson({
          nome: 'Papeluche',
          cnpj: '4755510300018153457456',
        })
        .expectStatus(StatusCodes.BAD_REQUEST);

    });

    it('Cadastrando mercado corretamente', async () => {
      const responseMarket = await p
        .spec()
        .post(`${baseUrl}/mercado`)
        .withJson({
          nome: 'Mecânica Timas Turbo',
          cnpj: '47555103000181',
          endereco: 'Rua Caxias do Sul'
        })
        .expectStatus(StatusCodes.CREATED);

      marketId = responseMarket.body.id; 
    });

    it('Alterado mercado corretamente', async () => {
        await p
          .spec()
          .put(`${baseUrl}/mercado/${marketId}`)
          .withJson({
            nome: 'Joel Madeiras',
            cnpj: '47555103000981',
            endereco: 'Rua Caxias do Sul de Jesus'
          })
          .expectStatus(StatusCodes.OK);
  
      });

      it('Alterado mercado incorretamente', async () => {
        await p
          .spec()
          .put(`${baseUrl}/mercado/${marketId}`)
          .withJson({
            cnpj: '47555103000981',
            endereco: 'Rua Caxias do Sul de Jesus'
          })
          .expectStatus(StatusCodes.BAD_REQUEST);
      });

      it('Buscando produtos existentes do mercado criado', async () => {
        await p
          .spec()
          .get(`${baseUrl}/mercado/${marketId}/produtos`)
          .expectStatus(StatusCodes.OK); 
      });

      it('Deletando mercado corretamente', async () => {
        await p
          .spec()
          .delete(`${baseUrl}/mercado/${marketId}`)
          .expectStatus(StatusCodes.NO_CONTENT); 
      });
  
      it('Tentando buscar mercado deletado', async () => {
        await p
          .spec()
          .get(`${baseUrl}/mercado/${marketId}`)
          .expectStatus(StatusCodes.NOT_FOUND); 
      });


  });
});
