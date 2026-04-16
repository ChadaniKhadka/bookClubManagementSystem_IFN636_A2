import chai from 'chai';
import sinon from 'sinon';

import Book from '../models/Book.js';
import * as bookController from '../controllers/bookController.js';

const { expect } = chai;

describe('Book Controller Tests', () => {

  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      file: null
    };

    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub()
    };
  });

  afterEach(() => {
    sinon.restore();
  });

  // ============================
  // CREATE BOOK
  // ============================
  describe('createBook', () => {

    it('should create book without image', async () => {
      req.body = { title: 'Test Book' };

      sinon.stub(Book.prototype, 'save').resolves();

      await bookController.createBook(req, res);

      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    });

    it('should create book with image', async () => {
      req.body = { title: 'Test Book' };
      req.file = { filename: 'cover.jpg' };

      sinon.stub(Book.prototype, 'save').resolves();

      await bookController.createBook(req, res);

      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    });

  });

  // ============================
  // GET ALL BOOKS
  // ============================
  describe('getBooks', () => {

    it('should return all books', async () => {
      sinon.stub(Book, 'find').resolves([{ title: 'Book1' }]);

      await bookController.getBooks(req, res);

      expect(res.json.calledOnce).to.be.true;
    });

  });

  // ============================
  // GET BOOK BY ID
  // ============================
  describe('getBookById', () => {

    it('should return a book', async () => {
      req.params.id = '123';

      sinon.stub(Book, 'findById').resolves({ title: 'Book1' });

      await bookController.getBookById(req, res);

      expect(res.json.calledOnce).to.be.true;
    });

    it('should return 404 if error occurs', async () => {
      req.params.id = '123';

      sinon.stub(Book, 'findById').rejects(new Error());

      await bookController.getBookById(req, res);

      expect(res.status.calledWith(404)).to.be.true;
    });

  });

  // ============================
  // UPDATE BOOK
  // ============================
  describe('updateBook', () => {

    it('should update book without image', async () => {
      req.params.id = '123';
      req.body = { title: 'Updated Book' };

      sinon.stub(Book, 'findByIdAndUpdate')
        .resolves({ title: 'Updated Book' });

      await bookController.updateBook(req, res);

      expect(res.json.calledOnce).to.be.true;
    });

    it('should update book with image', async () => {
      req.params.id = '123';
      req.body = { title: 'Updated Book' };
      req.file = { filename: 'new.jpg' };

      sinon.stub(Book, 'findByIdAndUpdate')
        .resolves({ title: 'Updated Book' });

      await bookController.updateBook(req, res);

      expect(res.json.calledOnce).to.be.true;
    });

  });

  // ============================
  // DELETE BOOK
  // ============================
  describe('deleteBook', () => {

    it('should delete a book', async () => {
      req.params.id = '123';

      sinon.stub(Book, 'findByIdAndDelete').resolves();

      await bookController.deleteBook(req, res);

      expect(res.json.calledWith({
        message: 'Book deleted successfully'
      })).to.be.true;
    });

  });

});