import Club from "../models/Club.js";

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