import Club from "../models/Club.js";
import ClubMembership from "../models/ClubMembership.js";

// CREATE
export const createClub = async (req, res) => {
  try {
    const club = new Club({
      ...req.body,
      coverImage: req.file
  ? `/uploads/${req.file.filename}`
  : "" });

    await club.save();
    res.status(201).json(club);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// READ ALL
export const getClubs = async (req, res) => {
  try {
    const clubs = await Club.find();
    res.json(clubs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// READ ONE
export const getClubById = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    res.json(club);
  } catch (err) {
    res.status(404).json({ message: "Club not found" });
  }
};


// UPDATE
export const updateClub = async (req, res) => {
  try {
    const updatedData = {
      ...req.body,
    };

    // ONLY update image if new file exists
    if (req.file) {
      updatedData.coverImage = `/uploads/${req.file.filename}`;
    }

    const club = await Club.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    res.json(club);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// DELETE
export const deleteClub = async (req, res) => {
  try {
    await Club.findByIdAndDelete(req.params.id);
    res.json({ message: "Club deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUserClubList = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const [clubs, memberships] = await Promise.all([
      Club.find(),
      ClubMembership.find({ userId }),
    ]);

    const result = clubs.map((club) => {
      const member = memberships.find(
        (m) => m.clubId.toString() === club.id.toString()
      );

      return {
        ...club._doc,
        isMember: !!member,
        memberStatus: member ? member.status : null,
        userId:userId
      };
    });

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



export const joinClub = async (req, res) => {
  try {
    const member = new ClubMembership({
    userId : req.params.userId,
    clubId : req.params.clubId,
   status : "pending" });

    await member.save();
    res.status(201).json(member);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const leaveOrRejectClub = async (req, res) => {
   try {
    const userId = req.params.userId; // from auth middleware
    const clubId = req.params.clubId;

    const deleted = await ClubMembership.findOneAndDelete({
      userId,
      clubId,
    });

    if (!deleted) {
      return res.status(404).json({
        message: "Membership not found",
      });
    }

    res.json({
      message: "Membership updated successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPendingRequests = async (req, res) => {
  try {
    const requests = await ClubMembership.find({ status: "pending" })
      .populate("clubId", "name")
      .populate("userId", "name");

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const acceptRequesT = async (req, res) => {
  try {
    const membership = await ClubMembership.findByIdAndUpdate(
      req.params.id,
      { status: "accepted" }, 
      { new: true }
    );

    res.json(membership);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};