import chai from 'chai';
import sinon from 'sinon';

import Club from '../models/Club.js';
import ClubMembership from '../models/ClubMembership.js';
import * as clubController from '../controllers/clubController.js';

const { expect } = chai;

describe('Club Controller Tests', () => {

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
  // CREATE CLUB
  // ============================
  describe('createClub', () => {

    it('should create a club without image', async () => {
      req.body = { name: 'Chess Club' };

      sinon.stub(Club.prototype, 'save').resolves();

      await clubController.createClub(req, res);

      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    });

    it('should create a club with image', async () => {
      req.body = { name: 'Chess Club' };
      req.file = { filename: 'image.jpg' };

      sinon.stub(Club.prototype, 'save').resolves();

      await clubController.createClub(req, res);

      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    });

  });

  // ============================
  // GET ALL CLUBS
  // ============================
  describe('getClubs', () => {

    it('should return all clubs', async () => {
      sinon.stub(Club, 'find').resolves([{ name: 'Club1' }]);

      await clubController.getClubs(req, res);

      expect(res.json.calledOnce).to.be.true;
    });

  });

  // ============================
  // GET CLUB BY ID
  // ============================
  describe('getClubById', () => {

    it('should return a club', async () => {
      req.params.id = '123';

      sinon.stub(Club, 'findById').resolves({ name: 'Club1' });

      await clubController.getClubById(req, res);

      expect(res.json.calledOnce).to.be.true;
    });

    it('should return 404 if error occurs', async () => {
      req.params.id = '123';

      sinon.stub(Club, 'findById').rejects(new Error());

      await clubController.getClubById(req, res);

      expect(res.status.calledWith(404)).to.be.true;
    });

  });

  // ============================
  // UPDATE CLUB
  // ============================
  describe('updateClub', () => {

    it('should update club without image', async () => {
      req.params.id = '123';
      req.body = { name: 'Updated Club' };

      sinon.stub(Club, 'findByIdAndUpdate').resolves({ name: 'Updated Club' });

      await clubController.updateClub(req, res);

      expect(res.json.calledOnce).to.be.true;
    });

    it('should update club with image', async () => {
      req.params.id = '123';
      req.body = { name: 'Updated Club' };
      req.file = { filename: 'new.jpg' };

      sinon.stub(Club, 'findByIdAndUpdate').resolves({ name: 'Updated Club' });

      await clubController.updateClub(req, res);

      expect(res.json.calledOnce).to.be.true;
    });

  });

  // ============================
  // DELETE CLUB
  // ============================
  describe('deleteClub', () => {

    it('should delete club and memberships', async () => {
      req.params.id = '123';

      sinon.stub(Club, 'findByIdAndDelete').resolves();
      sinon.stub(ClubMembership, 'deleteMany').resolves();

      await clubController.deleteClub(req, res);

      expect(res.json.calledWith({ message: 'Club deleted successfully' })).to.be.true;
    });

  });

  // ============================
  // JOIN CLUB
  // ============================
  describe('joinClub', () => {

    it('should create membership request', async () => {
      req.params = { userId: 'u1', clubId: 'c1' };

      sinon.stub(ClubMembership.prototype, 'save').resolves();

      await clubController.joinClub(req, res);

      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    });

  });

  // ============================
  // LEAVE / REJECT CLUB
  // ============================
  describe('leaveOrRejectClub', () => {

    it('should delete membership', async () => {
      req.params = { userId: 'u1', clubId: 'c1' };

      sinon.stub(ClubMembership, 'findOneAndDelete').resolves({});

      await clubController.leaveOrRejectClub(req, res);

      expect(res.json.calledWith({
        message: 'Membership updated successfully'
      })).to.be.true;
    });

    it('should return 404 if not found', async () => {
      req.params = { userId: 'u1', clubId: 'c1' };

      sinon.stub(ClubMembership, 'findOneAndDelete').resolves(null);

      await clubController.leaveOrRejectClub(req, res);

      expect(res.status.calledWith(404)).to.be.true;
    });

  });

  // ============================
  // ACCEPT REQUEST
  // ============================
  describe('acceptRequesT', () => {

    it('should accept membership request', async () => {
      req.params.id = '123';

      sinon.stub(ClubMembership, 'findByIdAndUpdate')
        .resolves({ status: 'accepted' });

      await clubController.acceptRequesT(req, res);

      expect(res.json.calledOnce).to.be.true;
    });

  });

});