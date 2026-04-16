const chai = require('chai');
const sinon = require('sinon');
const bcrypt = require('bcrypt');

const User = require('../models/User');
const userController = require('../controllers/authController');

const { expect } = chai;

describe('Auth Controller Tests', () => {

  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      user: {}
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
  // REGISTER USER
  // ============================
  describe('registerUser', () => {

    it('should register a new user', async () => {
      req.body = {
        name: 'Test User',
        email: 'test@test.com',
        password: '123456',
        phoneNumber: '123456789',
        address: 'Test Address'
      };

      sinon.stub(User, 'findOne').resolves(null);
      sinon.stub(User, 'create').resolves({
        id: '123',
        name: 'Test User',
        email: 'test@test.com',
        address: 'Test Address',
        phoneNumber: '123456789'
      });

      await userController.registerUser(req, res);

      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    });

    it('should return error if user exists', async () => {
      req.body = { email: 'test@test.com' };

      sinon.stub(User, 'findOne').resolves({ email: 'test@test.com' });

      await userController.registerUser(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ message: 'User already exists' })).to.be.true;
    });

  });

  // ============================
  // LOGIN USER
  // ============================
  describe('loginUser', () => {

    it('should login successfully', async () => {
      req.body = {
        email: 'test@test.com',
        password: '123456'
      };

      sinon.stub(User, 'findOne').resolves({
        id: '123',
        name: 'Test User',
        email: 'test@test.com',
        password: 'hashedPassword',
        isAdmin: false
      });

      sinon.stub(bcrypt, 'compare').resolves(true);

      await userController.loginUser(req, res);

      expect(res.json.calledOnce).to.be.true;
    });

    it('should fail with invalid credentials', async () => {
      req.body = {
        email: 'test@test.com',
        password: 'wrong'
      };

      sinon.stub(User, 'findOne').resolves(null);

      await userController.loginUser(req, res);

      expect(res.status.calledWith(401)).to.be.true;
      expect(res.json.calledWith({ message: 'Invalid email or password' })).to.be.true;
    });

  });

  // ============================
  // GET PROFILE
  // ============================
  describe('getProfile', () => {

    it('should return user profile', async () => {
      req.user = { id: '123' };

      sinon.stub(User, 'findById').resolves({
        name: 'Test User',
        email: 'test@test.com',
        phoneNumber: '123456789',
        address: 'Test Address'
      });

      await userController.getProfile(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    });

    it('should return 404 if user not found', async () => {
      req.user = { id: '123' };

      sinon.stub(User, 'findById').resolves(null);

      await userController.getProfile(req, res);

      expect(res.status.calledWith(404)).to.be.true;
    });

  });

});